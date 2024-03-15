var urlManagement = require("../utils/urlManagement.js");
var { relativeDate } = require("../utils/formatManagement.js");

var places = require("../places/places.js");

var searchbarHelper = require("./searchbarHelper.js");
var searchbarPluginManagement = require("./searchbarPluginManagement.js");

var searchbar = require("./searchbar.js");

var bangsPlugin = require("./plugins/bangs.js");

/**
 * 历史记录管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日19:58:09
 */
const historyManagement = {
	/**
	 * 初始化
	 */
	initialize: function () {
		/**历史记录查看器插件 */
		bangsPlugin.registerCustomBang({
			phrase: "!history", // 自定义命令短语为 !history
			snippet: l("searchHistory"), // 搜索建议中显示的文本为 searchHistory
			isAction: false, // 不是一个动作命令
			showSuggestions: function (text, input, event) {
				places.searchPlaces(
					text,
					function (results) {
						searchbarPluginManagement.reset("bangs");

						var container = searchbarPluginManagement.getContainer("bangs");

						// 显示清除按钮
						if (text === "" && results.length > 0) {
							var clearButton = document.createElement("button");
							clearButton.className = "searchbar-floating-button";
							clearButton.textContent = l("clearHistory");
							container.appendChild(clearButton);

							clearButton.addEventListener("click", function () {
								if (confirm(l("clearHistoryConfirmation"))) {
									places.deleteAllHistory();
									window.ipc.invoke("clearStorageData");

									// 刷新列表的一种方式
									// TODO 提供更好的 API
									setTimeout(function () {
										searchbarPluginManagement.run("!history " + text, input, null);
									}, 200);
								}
							});
						}

						// 显示搜索结果

						var lazyList = searchbarHelper.createLazyList(container.parentNode);

						// 用于生成标题
						var lastRelativeDate = "";

						results
							.sort(function (a, b) {
								// 按最后访问时间排序
								return b.lastVisit - a.lastVisit;
							})
							.slice(0, 1000)
							.forEach(function (result, index) {
								var thisRelativeDate = relativeDate(result.lastVisit);
								if (thisRelativeDate !== lastRelativeDate) {
									searchbarPluginManagement.addHeading("bangs", { text: thisRelativeDate });
									lastRelativeDate = thisRelativeDate;
								}

								var data = {
									title: result.title,
									secondaryText: urlManagement.basicURL(urlManagement.getSourceURL(result.url)),
									fakeFocus: index === 0 && text,
									icon: result.isBookmarked ? "carbon:star" : "",
									click: function (e) {
										searchbar.openURL(result.url, e);
									},
									delete: function () {
										places.deleteHistory(result.url);
									},
									showDeleteButton: true,
								};
								var placeholder = lazyList.createPlaceholder();
								container.appendChild(placeholder);
								lazyList.lazyRenderItem(placeholder, data);
							});
					},
					{ limit: Infinity }
				);
			},
			fn: function (text) {
				if (!text) {
					return;
				}
				places.searchPlaces(
					text,
					function (results) {
						if (results.length !== 0) {
							results = results.sort(function (a, b) {
								return b.lastVisit - a.lastVisit;
							});
							searchbar.openURL(results[0].url, null);
						}
					},
					{ limit: Infinity }
				);
			},
		});
	},
};

module.exports = historyManagement;
