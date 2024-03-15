/* 使用Electron框架开发的浏览器插件中的一部分 */

// 如果存在 require 方法，则导入所需的模块
const { ipcRenderer } = require("electron");

/**可能被视为空格的字符 */
const spacesRegex = /[+\s._/-]+/g;

/**
 * 计算历史记录得分
 * @param {*} item - 历史记录项
 * @returns {number} - 返回历史记录得分
 */
function calculateHistoryScore(item) {
	// item.boost - 得分应乘以的因子。例如 - 0.05
	let fs = item.lastVisit * (1 + 0.036 * Math.sqrt(item.visitCount));

	// 对于较短的 URL 进行加分
	if (item.url.length < 20) {
		fs += (30 - item.url.length) * 2500;
	}

	if (item.boost) {
		fs += fs * item.boost;
	}

	return fs;
}

/**一天的毫秒数 */
const oneDayInMS = 24 * 60 * 60 * 1000;

/**数据库中保留的历史记录项最旧的时间 */
const maxItemAge = oneDayInMS * 42;

/**
 * 清理历史记录数据库
 */
function cleanupHistoryDatabase() {
	// 删除旧的历史记录项
	databaseManagement.databases.render.places
		.where("lastVisit")
		.below(Date.now() - maxItemAge) // 当前时间减去最长保留时间，得到需要删除的历史记录项
		.and(function (item) {
			return item.isBookmarked === false; // 仅删除未被收藏的历史记录项
		})
		.delete();
}

/**不要在启动时立即运行，以免减慢搜索栏的搜索速度。 */
setTimeout(cleanupHistoryDatabase, 20000);

/**每隔一个小时清理一次历史记录数据库。 */
setInterval(cleanupHistoryDatabase, 60 * 60 * 1000);

// 为了加快搜索速度，在内存中缓存历史记录。实际上这占用的空间非常小，所以我们可以缓存所有内容。
/**历史记录在内存中的缓存 */
let historyInMemoryCache = [];
/**历史记录缓存加载完成标志 */
let doneLoadingHistoryCache = false;

/**
 * 将项目添加到历史记录缓存中
 * @param {*} item 要添加到缓存中的项目
 */
function addToHistoryCache(item) {
	if (item.isBookmarked) {
		tagIndex.addPage(item); // 如果项目被收藏，将其添加到标签索引中
	}
	delete item.pageHTML; // 删除项目中的页面HTML内容
	delete item.searchIndex; // 删除项目中的搜索索引

	historyInMemoryCache.push(item); // 将项目添加到历史记录缓存中
}

/**
 * 向历史记录缓存中添加或更新项目
 * @param {*} item 要添加或更新的项目
 */
function addOrUpdateHistoryCache(item) {
	delete item.pageHTML; // 删除项目中的页面HTML内容
	delete item.searchIndex; // 删除项目中的搜索索引

	let oldItem;

	for (let i = 0; i < historyInMemoryCache.length; i++) {
		if (historyInMemoryCache[i].url === item.url) {
			oldItem = historyInMemoryCache[i]; // 找到旧项目
			historyInMemoryCache[i] = item; // 更新为新项目
			break;
		}
	}

	if (!oldItem) {
		historyInMemoryCache.push(item); // 如果未找到旧项目，则将新项目添加到缓存中
	}

	if (oldItem) {
		tagIndex.onChange(oldItem, item); // 如果存在旧项目，则触发标签索引的变化事件
	}
}

/**
 * 从历史记录缓存中移除项目
 * @param {*} url 要移除的项目的URL
 */
function removeFromHistoryCache(url) {
	for (let i = 0; i < historyInMemoryCache.length; i++) {
		if (historyInMemoryCache[i].url === url) {
			tagIndex.removePage(historyInMemoryCache[i]); // 从标签索引中移除项目
			historyInMemoryCache.splice(i, 1); // 从历史记录缓存中删除项目
		}
	}
}

/**
 * 加载历史记录到内存缓存中
 */
function loadHistoryInMemory() {
	historyInMemoryCache = []; // 清空历史记录内存缓存

	databaseManagement.databases.render.places
		.orderBy("visitCount")
		.reverse()
		.each(function (item) {
			addToHistoryCache(item); // 将每个项目添加到历史记录内存缓存中
		})
		.then(function () {
			// 如果在搜索过程中有足够的匹配项，我们退出。为了使此功能生效，访问频率较高的站点必须首先出现在缓存中。
			historyInMemoryCache.sort(function (a, b) {
				return calculateHistoryScore(b) - calculateHistoryScore(a);
			});

			doneLoadingHistoryCache = true; // 历史记录缓存加载完成
		});
}

loadHistoryInMemory();

/** */
ipcRenderer.on("places-request", function (e, requesterId, data) {
	const action = data.action; // 获取请求的操作类型
	const pageData = data.pageData; // 获取页面数据
	const flags = data.flags || {}; // 获取标志位
	const searchText = data.text && data.text.toLowerCase(); // 获取搜索文本
	const callbackId = data.callbackId; // 获取回调 ID
	const options = data.options; // 获取选项

	// 根据不同的操作类型执行相应的操作

	// 获取指定页面的数据
	if (action === "getPlace") {
		let found = false;

		for (let i = 0; i < historyInMemoryCache.length; i++) {
			if (historyInMemoryCache[i].url === pageData.url) {
				// 发送页面数据给请求方
				ipcRenderer.sendTo(requesterId, "places-response", {
					result: historyInMemoryCache[i],
					callbackId: callbackId,
				});
				found = true;
				break;
			}
		}

		if (!found) {
			// 页面数据未找到，发送空结果给请求方
			ipcRenderer.sendTo(requesterId, "places-response", {
				result: null,
				callbackId: callbackId,
			});
		}
	}

	// 获取所有历史记录数据
	if (action === "getAllPlaces") {
		ipcRenderer.sendTo(requesterId, "places-response", {
			result: historyInMemoryCache,
			callbackId: callbackId,
		});
	}

	// 更新指定页面的数据
	if (action === "updatePlace") {
		databaseManagement.databases.render.transaction("rw", databaseManagement.databases.render.places, function () {
			databaseManagement.databases.render.places
				.where("url")
				.equals(pageData.url)
				.first(function (item) {
					var isNewItem = false;
					if (!item) {
						isNewItem = true;
						item = {
							url: pageData.url,
							title: pageData.url,
							color: null,
							visitCount: 0,
							lastVisit: Date.now(),
							pageHTML: "",
							extractedText: pageData.extractedText,
							searchIndex: [],
							isBookmarked: false,
							tags: [],
							metadata: {},
						};
					}
					for (const key in pageData) {
						if (key === "extractedText") {
							item.searchIndex = tokenize(pageData.extractedText);
							item.extractedText = pageData.extractedText;
						} else if (key === "tags") {
							// 确保标签不含有空格，并保存到数据库中
							item.tags = pageData.tags.map((t) => t.replace(/\s/g, "-"));
						} else {
							item[key] = pageData[key];
						}
					}

					if (flags.isNewVisit) {
						item.visitCount++;
						item.lastVisit = Date.now();
					}

					// 将更新后的数据保存到数据库中
					databaseManagement.databases.render.places.put(item);
					if (isNewItem) {
						addToHistoryCache(item);
					} else {
						addOrUpdateHistoryCache(item);
					}

					// 发送空结果给请求方
					ipcRenderer.sendTo(requesterId, "places-response", {
						result: null,
						callbackId: callbackId,
					});
				})
				.catch(function (err) {
					console.warn("failed to update history.");
					console.warn("page url was: " + pageData.url);
					console.error(err);
				});
		});
	}

	// 删除指定页面的历史记录数据，包括数据库中的数据和内存缓存中的数据。
	if (action === "deleteHistory") {
		databaseManagement.databases.render.places.where("url").equals(pageData.url).delete();

		removeFromHistoryCache(pageData.url);
	}

	// 删除所有非书签的历史记录数据，包括数据库中的数据和内存缓存中的数据。
	if (action === "deleteAllHistory") {
		databaseManagement.databases.render.places
			.filter(function (item) {
				return item.isBookmarked === false;
			})
			.delete()
			.then(function () {
				loadHistoryInMemory();
			});
	}

	// 获取建议的标签列表，根据指定页面的历史记录数据生成。
	if (action === "getSuggestedTags") {
		ipcRenderer.sendTo(requesterId, "places-response", {
			result: tagIndex.getSuggestedTags(historyInMemoryCache.find((i) => i.url === pageData.url)),
			callbackId: callbackId,
		});
	}

	// 获取按排名排序的所有标签列表，根据指定页面的历史记录数据生成。
	if (action === "getAllTagsRanked") {
		ipcRenderer.sendTo(requesterId, "places-response", {
			result: tagIndex.getAllTagsRanked(historyInMemoryCache.find((i) => i.url === pageData.url)),
			callbackId: callbackId,
		});
	}

	// 获取与指定标签相关的建议项列表，根据指定标签匹配历史记录数据生成。
	if (action === "getSuggestedItemsForTags") {
		ipcRenderer.sendTo(requesterId, "places-response", {
			result: tagIndex.getSuggestedItemsForTags(pageData.tags),
			callbackId: callbackId,
		});
	}

	// 根据已输入的标签进行自动补全，返回匹配的标签列表。
	if (action === "autocompleteTags") {
		ipcRenderer.sendTo(requesterId, "places-response", {
			result: tagIndex.autocompleteTags(pageData.tags),
			callbackId: callbackId,
		});
	}

	// 根据搜索文本进行历史记录搜索，并返回匹配的结果列表。
	if (action === "searchPlaces") {
		// do a history search
		searchPlaces(
			searchText,
			function (matches) {
				ipcRenderer.sendTo(requesterId, "places-response", {
					result: matches,
					callbackId: callbackId,
				});
			},
			options
		);
	}

	// 根据全文搜索文本进行历史记录搜索，并返回匹配的结果列表。
	if (action === "searchPlacesFullText") {
		fullTextPlacesSearch(searchText, function (matches) {
			matches.sort(function (a, b) {
				return calculateHistoryScore(b) - calculateHistoryScore(a);
			});

			ipcRenderer.sendTo(requesterId, "places-response", {
				result: matches.slice(0, 100),
				callbackId: callbackId,
			});
		});
	}

	// 获取建议的页面列表，根据历史记录数据生成。
	if (action === "getPlaceSuggestions") {
		function returnSuggestionResults() {
			const cTime = Date.now();

			let results = historyInMemoryCache.slice().filter((i) => cTime - i.lastVisit < 604800000);

			for (let i = 0; i < results.length; i++) {
				results[i].hScore = calculateHistoryScore(results[i]);
			}

			results = results.sort(function (a, b) {
				return b.hScore - a.hScore;
			});

			ipcRenderer.sendTo(requesterId, "places-response", {
				result: results.slice(0, 100),
				callbackId: callbackId,
			});
		}

		if (historyInMemoryCache.length > 10 || doneLoadingHistoryCache) {
			returnSuggestionResults();
		} else {
			setTimeout(returnSuggestionResults, 100);
		}
	}
});
