/**负责管理浏览器中访问过的网页页面的历史记录和标签管理等功能 */

const { ipcRenderer } = require("electron");

const searchEngine = require("../utils/searchEngine.js");
const urlManagement = require("../utils/urlManagement.js");

const { webviews } = require("../webviewManagement.js");

/**
 * 管理浏览器中访问过的网页页面的历史记录和标签管理等功能
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日19:51:14
 */
const places = {
	/**
	 * 存储回调函数
	 */
	callbacks: [],

	/**
	 * 处理消息响应。
	 * @param {*} e 事件
	 * @param {*} data 数据
	 */
	onMessage: function (e, data) {
		places.runWorkerCallback(data.callbackId, data.result);
	},

	/**
	 * 发送消息函数
	 * @param {*} data - 要发送的数据
	 */
	sendMessage: function (data) {
		// 通过 ipc 发送请求
		ipcRenderer.send("places-request", data);
	},

	/**
	 * 保存页面到历史记录函数
	 * @param {*} tabId - 要保存的标签页 ID
	 * @param {*} extractedText - 从页面中提取的文本内容
	 */
	savePage: function (tabId, extractedText) {
		/* this prevents pages that are immediately left from being saved to history, and also gives the page-favicon-updated event time to fire (so the colors saved to history are correct). */
		setTimeout(function () {
			// 等待 500 毫秒

			// 获取指定标签页
			const tab = window.tabs.get(tabId);
			if (tab) {
				const data = {
					url: urlManagement.getSourceURL(tab.url), // 获取原始页面的 URL，而不是 PDF 查看器和阅读模式的 URL
					title: tab.title, // 页面标题
					color: tab.backgroundColor, // 页面背景颜色
					extractedText: extractedText, // 页面文本内容
				};

				// 发送更新页面信息的请求
				places.sendMessage({
					action: "updatePlace", // 请求类型为 "updatePlace"
					pageData: data, // 更新的页面数据
					flags: {
						isNewVisit: true, // 标记为新访问
					},
				});
			}
		}, 500);
	},

	/**
	 * 接收历史数据函数
	 * @param {*} tabId - 标签页 ID
	 * @param {*} args - 参数
	 * @returns
	 */
	receiveHistoryData: function (tabId, args) {
		// 当 js/preload/textExtractor.js 返回页面的文本内容时调用

		// 获取指定 ID 的标签页
		var tab = window.tabs.get(tabId);

		// 获取参数中的数据
		var data = args[0];

		if (tab.url.startsWith("data:") || tab.url.length > 5000) {
			/*
			 * 非常长的 URL 会导致性能问题。特别是：
			 * 它们可能导致数据库异常增大，增加内存使用和启动时间
			 * 当它们显示在搜索结果中时，可能导致浏览器挂起
			 * 为了避免这种情况，不保存这些 URL 到历史记录中
			 */
			return;
		}

		/* 如果页面是内部页面，通常不应该保存，
		 * 除非页面代表另一个页面（例如 PDF 查看器或阅读视图） */
		var isNonIndexableInternalPage = urlManagement.isInternalURL(tab.url) && urlManagement.getSourceURL(tab.url) === tab.url;
		var isSearchPage = !!searchEngine.getSearch(tab.url);

		// 搜索结果页面的全文数据没有用处
		if (isSearchPage) {
			data.extractedText = "";
		}

		// 如果不是私密浏览模式，并且页面不是浏览器页面（除非它包含普通页面的内容），则保存到历史记录
		if (tab.private === false && !isNonIndexableInternalPage) {
			places.savePage(tabId, data.extractedText);
		}
	},

	/**
	 * 添加工作器回调函数
	 * @param {*} callback - 回调函数
	 * @returns - 返回回调函数的唯一标识符
	 */
	addWorkerCallback: function (callback) {
		// 生成一个唯一标识符
		const callbackId = Date.now() / 1000 + Math.random();

		// 将回调函数添加到 callbacks 数组中
		places.callbacks.push({ id: callbackId, fn: callback });

		// 返回回调函数的唯一标识符
		return callbackId;
	},

	/**
	 * 执行工作器回调函数
	 * @param {*} id - 回调函数的唯一标识符
	 * @param {*} data - 要传递给回调函数的数据
	 */
	runWorkerCallback: function (id, data) {
		for (var i = 0; i < places.callbacks.length; i++) {
			// 根据标识符查找对应的回调函数
			if (places.callbacks[i].id === id) {
				// 执行回调函数，并传递数据作为参数
				places.callbacks[i].fn(data);

				// 从 callbacks 数组中移除已执行的回调函数
				places.callbacks.splice(i, 1);
			}
		}
	},

	/**
	 * 删除指定 URL 的历史记录
	 * @param {*} url - 要删除历史记录的URL
	 */
	deleteHistory: function (url) {
		places.sendMessage({
			action: "deleteHistory",
			pageData: {
				url: url,
			},
		});
	},

	/**
	 * 删除所有历史记录
	 */
	deleteAllHistory: function () {
		places.sendMessage({
			action: "deleteAllHistory",
		});
	},

	/**
	 * 搜索地点，并通过回调函数返回结果。
	 * @param {*} text 搜索文本
	 * @param {*} callback 回调函数
	 * @param {*} options 选项
	 */
	searchPlaces: function (text, callback, options) {
		const callbackId = places.addWorkerCallback(callback);
		places.sendMessage({
			action: "searchPlaces",
			text: text,
			callbackId: callbackId,
			options: options,
		});
	},

	/**
	 * 根据完整文本搜索地点，并通过回调函数返回结果。
	 * @param {*} text 搜索文本
	 * @param {*} callback 回调函数
	 */
	searchPlacesFullText: function (text, callback) {
		const callbackId = places.addWorkerCallback(callback);
		places.sendMessage({
			action: "searchPlacesFullText",
			text: text,
			callbackId: callbackId,
		});
	},

	/**
	 * 获取地点的建议列表，并通过回调函数返回结果。
	 * @param {*} url 地点URL
	 * @param {*} callback 回调函数
	 */
	getPlaceSuggestions: function (url, callback) {
		const callbackId = places.addWorkerCallback(callback);
		places.sendMessage({
			action: "getPlaceSuggestions",
			text: url,
			callbackId: callbackId,
		});
	},

	/**
	 * 根据URL获取特定地点的信息，并通过回调函数返回结果。
	 * @param {*} url 地点URL
	 * @param {*} callback 回调函数
	 */
	getItem: function (url, callback) {
		const callbackId = places.addWorkerCallback(callback);
		places.sendMessage({
			action: "getPlace",
			pageData: {
				url: url,
			},
			callbackId: callbackId,
		});
	},

	/**
	 * 获取所有地点的信息，并通过回调函数返回结果。
	 * @param {*} callback 回调函数
	 */
	getAllItems: function (callback) {
		const callbackId = places.addWorkerCallback(callback);
		places.sendMessage({
			action: "getAllPlaces",
			callbackId: callbackId,
		});
	},

	/**
	 * 更新特定地点的信息，并通过回调函数返回结果。
	 * @param {*} url 地点URL
	 * @param {*} fields 待更新字段
	 * @param {*} callback 回调函数
	 */
	updateItem: function (url, fields, callback) {
		const callbackId = places.addWorkerCallback(callback);
		places.sendMessage({
			action: "updatePlace",
			pageData: {
				url: url,
				...fields,
			},
			callbackId: callbackId,
		});
	},

	/**
	 * 切换地点的标签，如果标签已存在则移除，否则添加。
	 * @param {*} url 地点URL
	 * @param {*} tag 标签
	 */
	toggleTag: function (url, tag) {
		places.getItem(url, function (item) {
			if (!item) {
				return;
			}

			if (item.tags.includes(tag)) {
				item.tags = item.tags.filter((t) => t !== tag);
			} else {
				item.tags.push(tag);
			}

			places.sendMessage({
				action: "updatePlace",
				pageData: {
					url: url,
					tags: item.tags,
				},
			});
		});
	},

	/**
	 * 获取特定地点的建议标签列表，并通过回调函数返回结果。
	 * @param {*} url 地点URL
	 * @param {*} callback 回调函数
	 */
	getSuggestedTags: function (url, callback) {
		const callbackId = places.addWorkerCallback(callback);
		places.sendMessage({
			action: "getSuggestedTags",
			pageData: {
				url: url,
			},
			callbackId: callbackId,
		});
	},

	/**
	 * 获取所有标签的排名，并通过回调函数返回结果。
	 * @param {*} url 地点URL
	 * @param {*} callback 回调函数
	 */
	getAllTagsRanked: function (url, callback) {
		const callbackId = places.addWorkerCallback(callback);
		places.sendMessage({
			action: "getAllTagsRanked",
			pageData: {
				url: url,
			},
			callbackId: callbackId,
		});
	},

	/**
	 * 根据标签获取推荐地点，并通过回调函数返回结果。
	 * @param {*} tags 标签
	 * @param {*} callback 回调函数
	 */
	getSuggestedItemsForTags: function (tags, callback) {
		const callbackId = places.addWorkerCallback(callback);
		places.sendMessage({
			action: "getSuggestedItemsForTags",
			pageData: {
				tags: tags,
			},
			callbackId: callbackId,
		});
	},

	/**
	 * 自动补全标签，并通过回调函数返回结果。
	 * @param {*} tags 标签
	 * @param {*} callback 回调函数
	 */
	autocompleteTags: function (tags, callback) {
		const callbackId = places.addWorkerCallback(callback);
		places.sendMessage({
			action: "autocompleteTags",
			pageData: {
				tags: tags,
			},
			callbackId: callbackId,
		});
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		ipcRenderer.on("places-response", places.onMessage);

		webviews.bindIPC("pageData", places.receiveHistoryData);
	},
};

places.initialize();

module.exports = places;
