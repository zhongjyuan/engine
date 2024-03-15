var urlParser = require("../../utils/urlManagement.js");
var { autocomplete, autocompleteURL } = require("../../utils/autoManagement.js");

var searchEngine = require("../../utils/searchEngine.js");

var readerDecision = require("../../readerDecision.js");
var places = require("../../places/places.js");

var searchbarHelper = require("../searchbarHelper.js");
var searchbarPluginManagement = require("../searchbarPluginManagement.js");
var searchbar = require("../searchbar.js");

/**
 * 
 */
const placesPlugin = {
	/**当前响应发送时间戳 */
	currentResponseSent: 0,

	/**
	 * 显示搜索栏地点结果
	 * @param {*} text
	 * @param {*} input
	 * @param {*} event
	 * @param {*} pluginName
	 */
	showSearchbarPlaceResults: function (text, input, event, pluginName = "places") {
		var responseSent = Date.now(); // 获取当前响应时间戳

		var searchFn, resultCount;
		if (pluginName === "fullTextPlaces") {
			searchFn = places.searchPlacesFullText; // 使用全文搜索地点方法
			resultCount = 4 - searchbarPluginManagement.getResultCount("places"); // 获取结果数量
		} else {
			searchFn = places.searchPlaces; // 使用普通地点搜索方法
			resultCount = 4;
		}

		// 只有在按下删除键时才能自动完成项目
		var canAutocomplete = event && event.keyCode !== 8;

		searchFn(text, function (results) {
			// 防止响应无序返回
			if (responseSent < placesPlugin.currentResponseSent) {
				return;
			}

			placesPlugin.currentResponseSent = responseSent;

			searchbarPluginManagement.reset(pluginName); // 重置插件

			results = results.slice(0, resultCount); // 截取结果数量

			results.forEach(function (result, index) {
				var didAutocompleteResult = false; // 初始化是否自动完成结果标志

				var searchQuery = searchEngine.getSearch(result.url); // 获取搜索查询对象

				if (canAutocomplete) {
					// 如果查询被自动完成，按回车键将使用当前搜索引擎搜索结果，因此只能自动完成当前引擎的页面
					if (searchQuery && searchQuery.engine === searchEngine.getCurrent().name && index === 0) {
						var acResult = autocomplete(input, [searchQuery.search]); // 自动完成输入
						if (acResult.valid) {
							canAutocomplete = false;
							didAutocompleteResult = true;
						}
					} else {
						var autocompletionType = autocompleteURL(input, result.url); // 自动完成 URL

						if (autocompletionType !== -1) {
							canAutocomplete = false;
						}

						if (autocompletionType === 0) {
							// 自动完成域，显示域结果项
							var domain = new URL(result.url).hostname; // 获取域名

							searchbarPluginManagement.setTopAnswer(pluginName, {
								title: domain,
								url: domain,
								fakeFocus: true,
							});
						}
						if (autocompletionType === 1) {
							didAutocompleteResult = true;
						}
					}
				}

				var data = {
					url: result.url, // 结果 URL
					metadata: result.tags, // 元数据
					descriptionBlock: result.searchSnippet, // 搜索片段描述
					highlightedTerms: result.searchSnippet
						? text
								.toLowerCase()
								.split(" ")
								.filter((t) => t.length > 0)
						: [], // 高亮术语
					delete: function () {
						places.deleteHistory(result.url); // 删除历史记录
					},
					icon: "carbon:wikis", // 图标
				};

				if (searchQuery) {
					data.title = searchQuery.search; // 标题为搜索查询
					data.secondaryText = searchQuery.engine; // 次要文本为搜索引擎
					data.icon = "carbon:search"; // 图标为搜索
				} else {
					data.title = urlParser.prettyURL(urlParser.getSourceURL(result.url)); // 标题为 URL
					data.secondaryText = searchbarHelper.getRealTitle(result.title); // 次要文本为真实标题
				}

				// 如果为书签项，则显示星号
				if (result.isBookmarked) {
					data.icon = "carbon:star-filled"; // 图标为填充星号
				} else if (readerDecision.shouldRedirect(result.url) === 1) {
					// 显示一个图标表示该页面将在阅读器视图中打开
					data.icon = "carbon:notebook"; // 图标为笔记本
				}

				// 创建项目
				if (didAutocompleteResult) {
					// 如果精确的 URL 被自动完成，将该项显示为顶部答案
					data.fakeFocus = true;
					searchbarPluginManagement.setTopAnswer(pluginName, data);
				} else {
					searchbarPluginManagement.addResult(pluginName, data); // 添加结果
				}
			});
		});
	},

	/**
	 * 初始化函数
	 */
	initialize: function () {
		searchbarPluginManagement.register("places", {
			index: 1, // 索引
			trigger: function (text) {
				return !!text && text.indexOf("!") !== 0; // 触发条件
			},
			showResults: placesPlugin.showSearchbarPlaceResults, // 显示结果函数
		});

		searchbarPluginManagement.register("fullTextPlaces", {
			index: 2, // 索引
			trigger: function (text) {
				return !!text && text.indexOf("!") !== 0; // 触发条件
			},
			showResults: debounce(function () {
				if (searchbarPluginManagement.getResultCount("places") < 4 && searchbar.associatedInput) {
					placesPlugin.showSearchbarPlaceResults.apply(this, Array.from(arguments).concat("fullTextPlaces")); // 显示地点搜索结果
				} else {
					searchbarPluginManagement.reset("fullTextPlaces"); // 重置插件
				}
			}, 200), // 显示结果函数
		});
	},
};

module.exports = placesPlugin;
