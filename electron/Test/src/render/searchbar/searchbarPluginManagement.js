const searchbarHelper = require("./searchbarHelper.js");

/**
 * 搜索栏插件管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日19:59:46
 */
const searchbarPluginManagement = {
	/**插件数组，格式为 {name, container, trigger, showResults} */
	plugins: [],

	/**结果对象，格式为 {pluginName: [results]} */
	results: {},

	/**URLOpener 函数变量 */
	URLOpener: null,

	/**URLHandlers 数组，格式为 {trigger, action} */
	URLHandlers: [],

	/**topAnswer 对象，用于存储当前最佳答案 */
	topAnswer: {
		item: null,
		plugin: null,
	},

	/**searchbar 元素对象 */
	searchbarElement: document.getElementById("searchbar"),
	
	/**topAnswer 元素对象 */
	topAnswerElement: searchbar.querySelector(".top-answer-area"),

	/**
	 * 清空所有插件容器
	 */
	clearAll: function () {
		empty(searchbarPluginManagement.topAnswerElement);

		searchbarPluginManagement.topAnswer = {
			item: null,
			plugin: null,
		};

		for (var i = 0; i < searchbarPluginManagement.plugins.length; i++) {
			empty(searchbarPluginManagement.plugins[i].container);
		}
	},

	/**
	 * 重置指定插件的结果集和 topAnswer
	 * @param {*} pluginName
	 */
	reset: function (pluginName) {
		empty(searchbarPluginManagement.getContainer(pluginName));

		var ta = searchbarPluginManagement.getTopAnswer(pluginName);
		if (ta) {
			ta.remove();

			searchbarPluginManagement.topAnswer = {
				item: null,
				plugin: null,
			};
		}

		searchbarPluginManagement.results[pluginName] = [];
	},

	/**
	 * 获取指定插件的 topAnswer 元素
	 * @param {*} pluginName
	 * @returns
	 */
	getTopAnswer: function (pluginName) {
		if (pluginName) {
			if (searchbarPluginManagement.topAnswer.plugin === pluginName) {
				return searchbarPluginManagement.topAnswer.item;
			} else {
				return null;
			}
		} else {
			return searchbarPluginManagement.topAnswerElement.firstChild;
		}
	},

	/**
	 * 设置指定插件的 topAnswer
	 * @param {*} pluginName
	 * @param {*} data
	 */
	setTopAnswer: function (pluginName, data) {
		empty(searchbarPluginManagement.topAnswerElement);

		var item = searchbarHelper.createItem(data);
		item.setAttribute("data-plugin", pluginName);
		item.setAttribute("data-url", data.url);
		searchbarPluginManagement.topAnswerElement.appendChild(item);

		item.addEventListener("click", function (e) {
			searchbarPluginManagement.URLOpener(data.url, e);
		});

		searchbarPluginManagement.topAnswer = {
			item: item,
			plugin: pluginName,
		};

		searchbarPluginManagement.results[pluginName].push(data);
	},

	/**
	 * 添加指定插件的搜索结果
	 * @param {*} pluginName
	 * @param {*} data
	 * @param {*} options
	 * @returns
	 */
	addResult: function (pluginName, data, options = {}) {
		if (options.allowDuplicates) {
			data.allowDuplicates = true;
		}

		if (data.url && !data.allowDuplicates) {
			// skip duplicates
			for (var plugin in searchbarPluginManagement.results) {
				for (var i = 0; i < searchbarPluginManagement.results[plugin].length; i++) {
					if (searchbarPluginManagement.results[plugin][i].url === data.url && !searchbarPluginManagement.results[plugin][i].allowDuplicates) {
						return;
					}
				}
			}
		}
		var item = searchbarHelper.createItem(data);

		if (data.url) {
			item.setAttribute("data-url", data.url);
			item.addEventListener("click", function (e) {
				searchbarPluginManagement.URLOpener(data.url, e);
			});

			item.addEventListener("keyup", function (e) {
				if (e.keyCode === 39 || e.keyCode === 32) {
					let input = document.getElementById("tab-editor-input");
					input.value = data.url;
					input.focus();
				}
			});
		}

		searchbarPluginManagement.getContainer(pluginName).appendChild(item);

		searchbarPluginManagement.results[pluginName].push(data);
	},

	/**
	 * 添加指定插件的标题
	 * @param {*} pluginName
	 * @param {*} data
	 */
	addHeading: function (pluginName, data) {
		searchbarPluginManagement.getContainer(pluginName).appendChild(searchbarHelper.createHeading(data));
	},

	/**
	 * 获取指定插件的容器元素
	 * @param {*} pluginName
	 * @returns
	 */
	getContainer: function (pluginName) {
		for (var i = 0; i < searchbarPluginManagement.plugins.length; i++) {
			if (searchbarPluginManagement.plugins[i].name === pluginName) {
				return searchbarPluginManagement.plugins[i].container;
			}
		}

		return null;
	},

	/**
	 * 注册插件
	 * @param {*} name
	 * @param {*} object
	 */
	register: function (name, object) {
		// add the container
		var container = document.createElement("div");
		container.classList.add("searchbar-plugin-container");
		container.setAttribute("data-plugin", name);
		searchbarPluginManagement.searchbarElement.insertBefore(container, searchbarPluginManagement.searchbarElement.childNodes[object.index + 2]);

		searchbarPluginManagement.plugins.push({
			name: name,
			container: container,
			trigger: object.trigger,
			showResults: object.showResults,
		});

		searchbarPluginManagement.results[name] = [];
	},

	/**
	 * 运行插件搜索
	 * @param {*} text
	 * @param {*} input
	 * @param {*} event
	 */
	run: function (text, input, event) {
		for (var i = 0; i < searchbarPluginManagement.plugins.length; i++) {
			try {
				if (
					searchbarPluginManagement.plugins[i].showResults &&
					(!searchbarPluginManagement.plugins[i].trigger || searchbarPluginManagement.plugins[i].trigger(text))
				) {
					searchbarPluginManagement.plugins[i].showResults(text, input, event);
				} else {
					searchbarPluginManagement.reset(searchbarPluginManagement.plugins[i].name);
				}
			} catch (e) {
				console.error('error in searchbar plugin "' + searchbarPluginManagement.plugins[i].name + '":', e);
			}
		}
	},

	/**
	 * 注册 URL 处理器
	 * @param {*} handler
	 */
	registerURLHandler: function (handler) {
		searchbarPluginManagement.URLHandlers.push(handler);
	},

	/**
	 * 运行 URL 处理器
	 * @param {*} text
	 * @returns
	 */
	runURLHandlers: function (text) {
		for (var i = 0; i < searchbarPluginManagement.URLHandlers.length; i++) {
			if (searchbarPluginManagement.URLHandlers[i](text)) {
				return true;
			}
		}
		return false;
	},

	/**
	 * 获取指定插件的结果数量
	 * @param {*} pluginName
	 * @returns
	 */
	getResultCount: function (pluginName) {
		if (pluginName) {
			return searchbarPluginManagement.results[pluginName].length;
		} else {
			var resultCount = 0;
			for (var plugin in searchbarPluginManagement.results) {
				resultCount += searchbarPluginManagement.results[plugin].length;
			}
			return resultCount;
		}
	},

	/**
	 * 初始化 searchbarPluginManagement 单例对象
	 * @param {*} opener
	 */
	initialize: function (opener) {
		searchbarPluginManagement.URLOpener = opener;
	},
};

module.exports = searchbarPluginManagement;
