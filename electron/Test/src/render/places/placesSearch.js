/* 搜索浏览历史记录和收藏夹 */

/**
 * 将搜索文本进行处理，去除协议、www.以及多余的空格
 *
 * @param {*} text
 * @returns
 */
function processSearchText(text) {
	// the order of these transformations is important - for example, spacesRegex removes / characters, so protocols must be removed before it runs
	return text.toLowerCase().split("?")[0].replace("http://", "").replace("https://", "").replace("www.", "").replace(spacesRegex, " ").trim();
}

/**
 * 搜索浏览历史记录和收藏夹中的条目
 *
 * @param {*} searchText 搜索文本
 * @param {*} callback 回调函数
 * @param {*} options 选项参数
 */
function searchPlaces(searchText, callback, options) {
	const oneDayAgo = Date.now() - oneDayInMS;
	const oneWeekAgo = Date.now() - oneDayInMS * 7;

	const matches = [];
	const st = processSearchText(searchText); // 处理搜索文本，去除协议、www.以及多余的空格
	const stl = searchText.length; // 搜索文本长度
	const searchWords = st.split(" "); // 将搜索文本按空格分割为多个单词
	const swl = searchWords.length; // 搜索词数量
	let substringSearchEnabled = false;
	const itemStartBoost = Math.min(2.5 * stl, 10); // URL开头匹配项的boost值
	const exactMatchBoost = 0.4 + 0.075 * stl; // 完全匹配项的boost值
	const limitToBookmarks = options && options.searchBookmarks; // 是否仅搜索收藏夹
	const resultsLimit = (options && options.limit) || 100; // 返回的匹配项数量上限

	if (searchText.indexOf(" ") !== -1) {
		substringSearchEnabled = true; // 启用子字符串搜索
	}

	// 内部函数，用于处理单个搜索条目
	function processSearchItem(item) {
		// 如果限制只搜索收藏夹且当前条目未被收藏，则跳过
		if (limitToBookmarks && !item.isBookmarked) {
			return;
		}

		// 对URL和标题进行小写处理，并去除多余的空格
		const itextURL = processSearchText(item.url);
		const itextTitle = item.title.toLowerCase().replace(spacesRegex, " ");
		let itext = itextURL;

		// 如果URL与标题不同，则将标题加入到itext中
		if (item.url !== item.title) {
			itext += " " + itextTitle;
		}

		// 如果存在标签，则将标签加入到itext中
		if (item.tags) {
			itext += " " + item.tags.join(" ");
		}

		const tindex = itext.indexOf(st);

		// 如果URL以搜索文本开头，则计为匹配项，并设置较大的boost值
		if (tindex === 0) {
			item.boost = itemStartBoost;
			matches.push(item);
		}
		// 否则，如果URL中存在完全匹配，则计为匹配项，并设置较小的boost值
		else if (tindex !== -1) {
			item.boost = exactMatchBoost;
			matches.push(item);
		} else {
			// 如果启用了子字符串搜索，检查搜索的单词是否都存在于URL中，即使顺序不一致
			if (substringSearchEnabled) {
				let substringMatch = true;

				// 检查搜索的单词是否都存在于URL中
				for (let i = 0; i < swl; i++) {
					if (itext.indexOf(searchWords[i]) === -1) {
						substringMatch = false;
						break;
					}
				}

				if (substringMatch) {
					// 存在子字符串匹配，则计为匹配项，并设置适中的boost值
					item.boost = 0.125 * swl + 0.02 * stl;
					matches.push(item);
					return;
				}
			}

			// 如果访问次数大于2且最近访问时间在一周以内（或一天以内），则使用QuickScore库计算得分
			if ((item.visitCount > 2 && item.lastVisit > oneWeekAgo) || item.lastVisit > oneDayAgo) {
				const score = Math.max(quickScore.quickScore(itextURL.substring(0, 100), st), quickScore.quickScore(itextTitle.substring(0, 50), st));
				if (score > 0.3) {
					// 如果得分高于阈值，则计为匹配项，并设置一定的boost值
					item.boost = score * 0.33;
					matches.push(item);
				}
			}
		}
	}

	// 遍历历史记录缓存中的每个条目，并处理其是否匹配搜索文本
	for (let i = 0; i < historyInMemoryCache.length; i++) {
		if (matches.length > resultsLimit * 2) {
			break;
		}
		processSearchItem(historyInMemoryCache[i]);
	}

	matches.sort(function (a, b) {
		// 对匹配项进行重新排序，以便考虑到应用到条目上的boost值
		return calculateHistoryScore(b) - calculateHistoryScore(a);
	});

	// 清理boost值
	matches.forEach(function (match) {
		match.boost = 0;
	});

	callback(matches.slice(0, resultsLimit)); // 返回前 resultsLimit 个匹配项给回调函数
}
