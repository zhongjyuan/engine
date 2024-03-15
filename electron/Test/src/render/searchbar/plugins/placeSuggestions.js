var urlParser = require("../../utils/urlManagement.js");

var places = require("../../places/places.js");

var searchbarHelper = require("../searchbarHelper.js");
var searchbarPluginManagement = require("../searchbarPluginManagement.js");

/**
 *
 */
const placeSuggestionPlugin = {
	/**
	 * 显示地点建议
	 * @param {*} text
	 * @param {*} input
	 * @param {*} event
	 */
	showPlaceSuggestions: function (text, input, event) {
		// 使用当前标签页的 URL 作为历史记录建议，如果当前标签页为空，则使用前一个标签页的 URL
		var url = window.tabs.get(window.tabs.getSelected()).url;

		if (!url) {
			var previousTab = window.tabs.getAtIndex(window.tabs.getIndex(window.tabs.getSelected()) - 1);
			if (previousTab) {
				url = previousTab.url;
			}
		}

		places.getPlaceSuggestions(url, function (results) {
			searchbarPluginManagement.reset("placeSuggestions"); // 重置插件

			var tabList = window.tabs.get().map(function (tab) {
				return tab.url;
			});

			results = results.filter(function (item) {
				return tabList.indexOf(item.url) === -1; // 过滤掉已存在于标签页中的结果
			});

			results.slice(0, 4).forEach(function (result) {
				searchbarPluginManagement.addResult("placeSuggestions", {
					title: urlParser.prettyURL(result.url), // 标题为 URL 的友好展示形式
					secondaryText: searchbarHelper.getRealTitle(result.title), // 次要文本为真实标题
					url: result.url, // 结果 URL
					delete: function () {
						places.deleteHistory(result.url); // 删除历史记录
					},
				});
			});
		});
	},

	initialize: function () {
		searchbarPluginManagement.register("placeSuggestions", {
			index: 1, // 索引
			trigger: function (text) {
				return !text; // 触发条件为输入框为空
			},
			showResults: placeSuggestionPlugin.showPlaceSuggestions, // 显示结果函数
		});
	},
};

module.exports = placeSuggestionPlugin; // 导出初始化函数
