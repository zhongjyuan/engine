var urlManagement = require("../utils/urlManagement.js");
var { relativeDate } = require("../utils/formatManagement.js");

var searchbarHelper = require("./searchbarHelper.js");
var searchbarPluginManagement = require("./searchbarPluginManagement.js");
var searchbar = require("./searchbar.js");

var places = require("../places/places.js");
var bangsPlugin = require("./plugins/bangs.js");

var tabEditManagement = require("../navbar/tabEditManagement.js");
var bookmarkEditManagement = require("./bookmarkEditManagement.js");

/**
 * 书签管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日19:54:57
 */
const bookmarkManagement = {
	/**标签建议的最大数量 */
	maxTagSuggestions: 12,

	/**
	 * 解析书签搜索文本，提取标签和内容。
	 * @param {*} text - 输入的搜索文本
	 * @returns - 包含标签和内容的对象
	 */
	parseBookmarkSearch: function (text) {
		// 获取以 # 开头的标签
		var tags = text
			.split(/\s/g)
			.filter(function (word) {
				return word.startsWith("#") && word.length > 1;
			})
			.map((t) => t.substring(1));

		var newText = text;

		// 将标签从搜索文本中剥离
		tags.forEach(function (word) {
			newText = newText.replace("#" + word, "");
		});

		newText = newText.trim();

		return {
			tags,
			text: newText,
		};
	},

	/**
	 * 检查书签是否匹配给定的标签。
	 * @param {*} item - 书签对象
	 * @param {*} tags - 标签数组
	 * @returns - 匹配返回 true，不匹配返回 false
	 */
	itemMatchesTags: function (item, tags) {
		for (var i = 0; i < tags.length; i++) {
			if (!item.tags.filter((t) => t.startsWith(tags[i])).length) {
				return false;
			}
		}
		return true;
	},

	/**
	 * 显示书签编辑器，用于编辑书签的标题和URL。
	 * @param {*} url - 书签的 URL
	 * @param {*} item - 列表项的 DOM 元素
	 */
	showBookmarkEditor: function (url, item) {
		bookmarkEditManagement.show(url, item, function (newBookmark) {
			if (newBookmark) {
				if (item.parentNode) {
					// item could be detached from the DOM if the searchbar is closed
					item.parentNode.replaceChild(searchbarHelper.createItem(bookmarkManagement.getBookmarkListItemData(newBookmark)), item);
				}
			} else {
				places.deleteHistory(url);
				item.remove();
			}
		});
	},

	/**
	 * 根据书签对象生成列表项的数据。
	 * @param {*} result - 书签对象
	 * @param {*} focus - 是否为焦点项
	 * @returns - 列表项的数据
	 */
	getBookmarkListItemData: function (result, focus) {
		return {
			title: result.title,
			secondaryText: urlManagement.basicURL(urlManagement.getSourceURL(result.url)),
			fakeFocus: focus,
			click: function (e) {
				searchbar.openURL(result.url, e);
			},
			classList: ["bookmark-item"],
			delete: function () {
				places.deleteHistory(result.url);
			},
			button: {
				icon: "carbon:edit",
				fn: function (el) {
					bookmarkManagement.showBookmarkEditor(result.url, el.parentNode);
				},
			},
		};
	},

	/**
	 * 显示书签搜索的结果列表。
	 * @param {*} text - 输入的搜索文本
	 * @param {*} input - 搜索输入框的 DOM 元素
	 * @param {*} event - 触发搜索的事件对象
	 */
	showBookmarks: function (text, input, event) {
		// 获取搜索栏插件的容器
		var container = searchbarPluginManagement.getContainer("bangs");

		// 创建懒加载列表
		var lazyList = searchbarHelper.createLazyList(container.parentNode);

		// 解析搜索文本，获取标签和内容
		var parsedText = bookmarkManagement.parseBookmarkSearch(text);

		// 记录已经显示在列表中的书签的 URL
		var displayedURLset = [];

		places.searchPlaces(
			parsedText.text,
			function (results) {
				places.autocompleteTags(parsedText.tags, function (suggestedTags) {
					// 自动完成标签
					searchbarPluginManagement.reset("bangs"); // 重置搜索栏插件

					var tagBar = document.createElement("div");
					tagBar.id = "bookmark-tag-bar"; // 标签栏的 ID
					container.appendChild(tagBar); // 添加标签栏到容器中

					parsedText.tags.forEach(function (tag) {
						// 显示已选标签
						tagBar.appendChild(
							bookmarkEditManagement.getTagElement(
								tag,
								true,
								function () {
									tabEditManagement.show(window.tabs.getSelected(), "!bookmarks " + text.replace("#" + tag, "").trim());
								},
								{
									autoRemove: false,
									onModify: () => bookmarkManagement.showBookmarks(text, input, event),
								}
							)
						);
					});

					if (!parsedText.text) {
						// 如果没有内容搜索，则显示标签建议
						suggestedTags.forEach(function (suggestion, index) {
							var el = bookmarkEditManagement.getTagElement(
								suggestion,
								false,
								function () {
									var needsSpace = text.slice(-1) !== " " && text.slice(-1) !== "";
									tabEditManagement.show(window.tabs.getSelected(), "!bookmarks " + text + (needsSpace ? " #" : "#") + suggestion + " ");
								},
								{
									onModify: () => bookmarkManagement.showBookmarks(text, input, event),
								}
							);

							if (index >= bookmarkManagement.maxTagSuggestions) {
								el.classList.add("overflowing");
							}

							tagBar.appendChild(el);
						});

						if (suggestedTags.length > bookmarkManagement.maxTagSuggestions) {
							// 如果标签建议数量超过最大值，则添加省略号以显示其余标签。
							var expandEl = bookmarkEditManagement.getTagElement("\u2026", false, function () {
								tagBar.classList.add("expanded");
								expandEl.remove();
							});

							tagBar.appendChild(expandEl);
						}
					}

					// 上一个书签的访问时间
					var lastRelativeDate = "";
					results
						.filter(function (result) {
							// 过滤不匹配标签的书签
							if (bookmarkManagement.itemMatchesTags(result, parsedText.tags)) {
								return true;
							} else {
								return false;
							}
						})
						.sort(function (a, b) {
							// 按最近访问时间排序
							return b.lastVisit - a.lastVisit;
						})
						.forEach(function (result, index) {
							// 将显示出来的书签的 URL 加入 displayedURLset 数组中
							displayedURLset.push(result.url);

							// 当前的书签的访问时间
							var thisRelativeDate = relativeDate(result.lastVisit);

							// 如果当前书签的访问时间和上一个不同，则添加标题
							if (thisRelativeDate !== lastRelativeDate) {
								searchbarPluginManagement.addHeading("bangs", { text: thisRelativeDate });
								lastRelativeDate = thisRelativeDate;
							}

							// 根据书签对象生成列表项的数据
							var itemData = bookmarkManagement.getBookmarkListItemData(result, index === 0 && parsedText.text);

							// 创建占位符元素
							var placeholder = lazyList.createPlaceholder();

							container.appendChild(placeholder);

							// 懒加载渲染列表项
							lazyList.lazyRenderItem(placeholder, itemData);
						});

					// 如果搜索文本为空且书签数量少于三个，则显示导入书签的选项
					if (text === "" && results.length < 3) {
						container.appendChild(
							searchbarHelper.createItem({
								title: l("importBookmarks"), // 本地化字符串
								icon: "carbon:upload",
								click: function () {
									searchbar.openURL("!importbookmarks", null);
								},
							})
						);
					}

					if (parsedText.tags.length > 0) {
						places.getSuggestedItemsForTags(parsedText.tags, function (suggestedResults) {
							suggestedResults = suggestedResults.filter((res) => !displayedURLset.includes(res.url));
							if (suggestedResults.length === 0) {
								return;
							}
							searchbarPluginManagement.addHeading("bangs", { text: l("bookmarksSimilarItems") });
							suggestedResults.forEach(function (result, index) {
								var item = searchbarHelper.createItem(bookmarkManagement.getBookmarkListItemData(result, false));
								container.appendChild(item);
							});
						});
					}
				});
			},
			{
				searchBookmarks: true,
				limit: Infinity,
			}
		);
	},

	/**
	 * 初始化函数
	 */
	initialize: function () {
		bangsPlugin.registerCustomBang({
			phrase: "!bookmarks",
			snippet: l("searchBookmarks"), // 本地化字符串
			isAction: false,
			showSuggestions: bookmarkManagement.showBookmarks, // 显示书签搜索的结果列表
			fn: function (text) {
				// 解析搜索文本，获取标签和内容
				var parsedText = bookmarkManagement.parseBookmarkSearch(text); 
				
				// 如果没有内容搜索，则不执行操作
				if (!parsedText.text) {
					return;
				}

				places.searchPlaces(
					parsedText.text,
					function (results) {
						results = results
							.filter((r) => bookmarkManagement.itemMatchesTags(r, parsedText.tags)) // 过滤不匹配标签的书签
							.sort(function (a, b) {
								// 按最近访问时间排序
								return b.lastVisit - a.lastVisit;
							});
							
						if (results.length !== 0) {
							// 如果结果不为空，则打开第一个书签的 URL
							searchbar.openURL(results[0].url, null);
						}
					},
					{ searchBookmarks: true }
				);
			},
		});
	},
};

module.exports = bookmarkManagement;
