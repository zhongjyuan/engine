/* 文本处理和全文搜索 */

const stemmer = require("stemmer");

// 定义一些正则表达式和停用词列表
/**用于匹配空白字符 */
const whitespaceRegex = /\s+/g;

/**用于匹配单引号 */
const ignoredCharactersRegex = /[']+/g;

// stop words list from https://github.com/weixsong/elasticlunr.js/blob/master/lib/stop_word_filter.js
/* 停用词列表 */
const stopWords = {
	"": true,
	a: true,
	able: true,
	about: true,
	across: true,
	after: true,
	all: true,
	almost: true,
	also: true,
	am: true,
	among: true,
	an: true,
	and: true,
	any: true,
	are: true,
	as: true,
	at: true,
	be: true,
	because: true,
	been: true,
	but: true,
	by: true,
	can: true,
	cannot: true,
	could: true,
	dear: true,
	did: true,
	do: true,
	does: true,
	either: true,
	else: true,
	ever: true,
	every: true,
	for: true,
	from: true,
	get: true,
	got: true,
	had: true,
	has: true,
	have: true,
	he: true,
	her: true,
	hers: true,
	him: true,
	his: true,
	how: true,
	however: true,
	i: true,
	if: true,
	in: true,
	into: true,
	is: true,
	it: true,
	its: true,
	just: true,
	least: true,
	let: true,
	like: true,
	likely: true,
	may: true,
	me: true,
	might: true,
	most: true,
	must: true,
	my: true,
	neither: true,
	no: true,
	nor: true,
	not: true,
	of: true,
	off: true,
	often: true,
	on: true,
	only: true,
	or: true,
	other: true,
	our: true,
	own: true,
	rather: true,
	said: true,
	say: true,
	says: true,
	she: true,
	should: true,
	since: true,
	so: true,
	some: true,
	than: true,
	that: true,
	the: true,
	their: true,
	them: true,
	then: true,
	there: true,
	these: true,
	they: true,
	this: true,
	tis: true,
	to: true,
	too: true,
	twas: true,
	us: true,
	wants: true,
	was: true,
	we: true,
	were: true,
	what: true,
	when: true,
	where: true,
	which: true,
	while: true,
	who: true,
	whom: true,
	why: true,
	will: true,
	with: true,
	would: true,
	yet: true,
	you: true,
	your: true,
};

/**
 * 对输入的字符串进行分词、过滤停用词、词干提取等操作，返回处理后的词语列表
 * @param {*} string
 * @returns
 */
function tokenize(string) {
	return string
		.trim() // 去除字符串两端的空白字符
		.toLowerCase() // 将所有字符转换为小写
		.replace(ignoredCharactersRegex, "") // 去除字符串中的单引号
		.replace(nonLetterRegex, " ") // 将非字母字符替换为空格
		.normalize("NFD") // 去除字符串中的重音符号
		.replace(/[\u0300-\u036f]/g, "")
		.split(whitespaceRegex) // 将字符串按照空白字符分割为单词
		.filter(function (token) {
			// 过滤停用词和长度大于100的词汇
			return !stopWords[token] && token.length <= 100;
		})
		.map((token) => stemmer(token)) // 对每个词汇进行词干提取
		.slice(0, 20000); // 只保留前20000个词汇
}

/**
 * 对文档进行全文检索，返回匹配的文档列表和相关性计数
 * @param {*} tokens
 * @returns
 */
function fullTextQuery(tokens) {
	return db.transaction("r", db.places, function* () {
		// 并行搜索所有的词汇，获取匹配的文档ID
		const tokenMatches = yield Dexie.Promise.all(tokens.map((prefix) => db.places.where("searchIndex").equals(prefix).primaryKeys()));

		// 计算每个词汇在多少个文档中出现过
		var tokenMatchCounts = {};
		for (var i = 0; i < tokens.length; i++) {
			tokenMatchCounts[tokens[i]] = tokenMatches[i].length;
		}

		var docResults = [];

		// 遍历所有历史记录，查找匹配的文档
		historyInMemoryCache.forEach(function (item) {
			// 将文档的 URL、标题、标签组合成一个字符串
			var itext = (item.url + " " + item.title + " " + item.tags.join(" ")).toLowerCase();
			var matched = true;
			for (var i = 0; i < tokens.length; i++) {
				// 如果文档的搜索索引中不包含当前词汇，并且文档中也不包含当前词汇，则该文档不匹配
				if (!tokenMatches[i].includes(item.id) && !itext.includes(tokens[i])) {
					matched = false;
					break;
				}
			}
			if (matched) {
				docResults.push(item);
			}
		});

		/*
		 * 从所有匹配的文档中挑选出前100个文档，然后根据相关性值对它们进行排序。
		 * 注意：仅读取排名最高的100个文档，以提高性能。
		 */
		const ordered = docResults
			.sort(function (a, b) {
				return calculateHistoryScore(b) - calculateHistoryScore(a);
			})
			.map((i) => i.id)
			.slice(0, 100);

		// 查询数据库，获取所有匹配文档的详细信息
		return {
			documents: yield db.places.where("id").anyOf(ordered).toArray(),
			tokenMatchCounts,
		};
	});
}

/**
 * 对输入的搜索词进行全文检索，并返回匹配的文档列表
 * @param {*} searchText
 * @param {*} callback
 * @returns
 */
function fullTextPlacesSearch(searchText, callback) {
	// 对搜索词进行处理
	const searchWords = tokenize(searchText);
	const sl = searchWords.length;

	if (searchWords.length === 0) {
		callback([]);
		return;
	}

	// 查询数据库，获取匹配的文档列表和相关性计数
	fullTextQuery(searchWords)
		.then(function (queryResults) {
			const docs = queryResults.documents;

			const totalCounts = {};
			for (let i = 0; i < sl; i++) {
				totalCounts[searchWords[i]] = 0;
			}

			const docTermCounts = {};
			const docIndexes = {};

			// find the number and position of the search terms in each document
			docs.forEach(function (doc) {
				const termCount = {};
				const index = doc.searchIndex.concat(tokenize(doc.title));
				const indexList = [];

				for (let i = 0; i < sl; i++) {
					let count = 0;
					const token = searchWords[i];

					let idx = index.indexOf(token);

					while (idx !== -1) {
						count++;
						indexList.push(idx);
						idx = index.indexOf(token, idx + 1);
					}

					termCount[searchWords[i]] = count;
					totalCounts[searchWords[i]] += count;
				}

				docTermCounts[doc.url] = termCount;
				docIndexes[doc.url] = indexList.sort((a, b) => a - b);
			});

			const dl = docs.length;

			for (let i = 0; i < dl; i++) {
				const doc = docs[i];
				const indexLen = doc.searchIndex.length;
				const termCounts = docTermCounts[doc.url];

				if (!doc.boost) {
					doc.boost = 0;
				}

				// add boost when search terms appear close to each other

				const indexList = docIndexes[doc.url];
				let totalWordDistanceBoost = 0;

				for (let n = 1; n < indexList.length; n++) {
					const distance = indexList[n] - indexList[n - 1];
					if (distance < 50) {
						totalWordDistanceBoost += Math.pow(50 - distance, 2) * 0.000075;
					}
					if (distance === 1) {
						totalWordDistanceBoost += 0.05;
					}
				}

				doc.boost += Math.min(totalWordDistanceBoost, 7.5);

				// calculate bm25 score
				// https://en.wikipedia.org/wiki/Okapi_BM25

				const k1 = 1.5;
				const b = 0.75;

				let bm25 = 0;
				for (let x = 0; x < sl; x++) {
					const nqi = queryResults.tokenMatchCounts[searchWords[x]];
					const bmIdf = Math.log((historyInMemoryCache.length - nqi + 0.5) / (nqi + 0.5) + 1);

					const tf = termCounts[searchWords[x]];
					const scorePart2 = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (indexLen / 500))); // 500 is estimated average page length

					bm25 += bmIdf * scorePart2;
				}

				doc.boost += bm25;

				// generate a search snippet for the document

				const snippetIndex = doc.extractedText ? doc.extractedText.split(/\s+/g) : [];

				// tokenize the words the same way as the search words are tokenized
				const mappedWords = snippetIndex.map((w) => stemmer(w.toLowerCase().replace(nonLetterRegex, "")));

				// find the bounds of the subarray of mappedWords with the largest number of unique search words
				let indexBegin = -10;
				let indexEnd = 0;
				let maxScore = 0;
				let maxBegin = -10;
				let maxEnd = 0;
				for (let i2 = 0; i2 < mappedWords.length; i2++) {
					//count number of unique search words in the range
					let currentScore = 0;
					for (let word of searchWords) {
						for (let i3 = Math.max(indexBegin, 0); i3 <= indexEnd; i3++) {
							if (mappedWords[i3] === word) {
								currentScore++;
								break;
							}
						}
					}

					if (currentScore > maxScore || (currentScore > 0 && currentScore === maxScore && indexBegin - maxBegin <= 1)) {
						maxBegin = indexBegin;
						maxEnd = indexEnd;
						maxScore = currentScore;
					}
					indexBegin++;
					indexEnd++;
				}

				// include a few words before the start of the match
				maxBegin = maxBegin - 2;

				// shift a few words farther back if doing so makes the snippet start at the beginning of a phrase or sentence
				for (let bound = maxBegin; bound >= maxBegin - 10 && bound > 0; bound--) {
					if (snippetIndex[bound].endsWith(".") || snippetIndex[bound].endsWith(",")) {
						maxBegin = bound + 1;
						break;
					}
				}

				const snippet = snippetIndex.slice(maxBegin, maxEnd + 5).join(" ");
				if (snippet) {
					doc.searchSnippet = snippet + "...";
				}

				// these properties are never used, and sending them from the worker takes a long time
				delete doc.pageHTML;
				delete doc.extractedText;
				delete doc.searchIndex;
			}

			callback(docs);
		})
		.catch((e) => console.error(e));
}
