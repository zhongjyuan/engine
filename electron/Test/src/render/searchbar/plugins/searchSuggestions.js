const urlParser = require("../../utils/urlManagement.js");
const searchEngine = require("../../utils/searchEngine.js");

const searchbarPluginManagement = require("../searchbarPluginManagement.js");

/**
 * 搜索建议插件对象
 */
const searchSuggestionPlugin = {
	/**
	 * 显示搜索建议
	 * @param {string} text - 输入框中的文本
	 * @param {HTMLElement} input - 输入框的DOM元素
	 * @param {Event} event - 触发显示搜索建议的事件
	 */
	showSearchSuggestions: function (text, input, event) {
		const suggestionsURL = searchEngine.getCurrent().suggestionsURL; // 获取当前搜索引擎的建议链接

		// 如果没有建议链接，重置搜索建议容器内容并返回
		if (!suggestionsURL) {
			searchbarPluginManagement.reset("searchSuggestions");
			return;
		}

		// 如果搜索建议数量超过3个，重置搜索建议容器内容并返回
		if (searchbarPluginManagement.getResultCount() - searchbarPluginManagement.getResultCount("searchSuggestions") > 3) {
			searchbarPluginManagement.reset("searchSuggestions");
			return;
		}

		// 发送fetch请求获取搜索建议结果
		fetch(suggestionsURL.replace("%s", encodeURIComponent(text)), {
			cache: "force-cache",
		})
			// 处理响应结果
			.then(function (response) {
				return response.json();
			})
			// 解析结果并将数据存储为 { title: string, url: string, icon: string } 的格式
			.then(function (results) {
				// 重置搜索建议容器内容
				searchbarPluginManagement.reset("searchSuggestions");

				// 如果搜索建议数量超过3个，返回
				if (searchbarPluginManagement.getResultCount() > 3) {
					return;
				}

				// 如果获取到搜索建议结果，则将其添加到搜索栏插件中
				if (results) {
					results = results[1].slice(0, 3); // 获取搜索建议结果的前3个

					results.forEach(function (result) {
						var data = {
							title: result,
							url: result,
						};

						// 如果搜索建议是一个可能的URL，则添加网站图标
						if (urlParser.isPossibleURL(result)) {
							data.icon = "carbon:earth-filled";
						} else {
							// 否则添加搜索图标
							data.icon = "carbon:search";
						}

						// 添加搜索建议结果到搜索栏插件中
						searchbarPluginManagement.addResult("searchSuggestions", data);
					});
				}
			});
	},

	/**
	 * 初始化搜索建议插件
	 */
	initialize: function () {
		// 注册搜索建议插件
		searchbarPluginManagement.register("searchSuggestions", {
			index: 4, // 插件的索引位置
			trigger: function (text) {
				// 触发搜索建议显示的条件判断函数
				return !!text && text.indexOf("!") !== 0 && !window.tabs.get(window.tabs.getSelected()).private;
			},
			showResults: debounce(searchSuggestionPlugin.showSearchSuggestions, 50), // 显示搜索建议结果的函数，使用防抖函数进行优化
		});
	},
};

module.exports = searchSuggestionPlugin;
