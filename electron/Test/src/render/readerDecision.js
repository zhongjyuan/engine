const settingManagement = require("../settings/renderSettingManagement.js");

/**
 * 阅读器决策对象(根据访问历史确定页面是否应该基于阅读器视图进行重定向)
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日11:54:37
 */
const readerDecision = {
	/**
	 * 从 localStorage 加载阅读器数据或从旧格式迁移
	 * @param {*} data - 要加载的阅读器数据
	 */
	loadData: function (data) {
		try {
			if (!data) {
				// 如果未提供数据，请尝试从 localStorage 加载
				data = localStorage.getItem("readerData");
				if (data) {
					// 从旧格式迁移
					// 将数据从旧格式移到新格式
					settingManagement.set("readerData", data);
					localStorage.removeItem("readerData");
				}
			}
			readerDecision.info = JSON.parse(data).data;
		} catch (e) {}

		if (!readerDecision.info) {
			// 如果不存在阅读器决策信息，则进行初始化
			readerDecision.info = {
				domainStatus: {},
				URLStatus: {},
			};
		}
	},

	/**
	 * 将阅读器数据保存到 localStorage
	 */
	saveData: function () {
		// 将阅读器数据保存到 localStorage
		settingManagement.set("readerData", JSON.stringify({ version: 1, data: readerDecision.info }));
	},

	/**
	 * 清理过期的 URL 条目
	 * @returns {boolean} - 如果删除了任何条目，则返回 true
	 */
	cleanupData: function () {
		/**移除结果 */
		var removedEntries = false;

		for (var url in readerDecision.info.URLStatus) {
			// 如果最后访问时间超过 6 周，则删除该 URL 条目
			if (Date.now() - readerDecision.info.URLStatus[url].lastVisit > 6 * 7 * 24 * 60 * 60 * 1000) {
				delete readerDecision.info.URLStatus[url];
				removedEntries = true;
			}
		}

		return removedEntries;
	},

	/**
	 * 通过去除哈希来修剪 URL 并返回修剪后的 URL
	 * @param {*} url - 要修剪的 URL
	 * @returns {string} - 修剪后的 URL
	 */
	trimURL: function (url) {
		var loc = new URL(url);

		loc.hash = "";

		return loc.toString();
	},

	/**
	 * 确定页面是否应该重定向到阅读器视图
	 * @param {*} url - 页面的 URL
	 * @returns {number} - 返回 -1、0 或 1，表示重定向决定
	 */
	shouldRedirect: function (url) {
		/**
		 * 返回值:
		 * -1: 永远不要重定向，即使页面被确认为可阅读
		 * 0: 一旦页面被确认为可阅读，立即重定向
		 * 1: 即使页面尚未被确认为可阅读，也要重定向
		 */

		/**页面修正后的 URL */
		url = readerDecision.trimURL(url);

		try {
			/**页面 URL 对象 */
			var urlObj = new URL(url);

			// 我们有从上次访问此页面收集的数据
			if (readerDecision.info.URLStatus[url]) {
				// 我们知道它将是可读的，立即重定向
				if (readerDecision.info.URLStatus[url].isReaderable === true) {
					return 1;
				}

				// 我们知道它不可读（或者页面的阅读模式可能已损坏），永远不要重定向到它
				else if (readerDecision.info.URLStatus[url].isReaderable === false) {
					return -1;
				}
			}

			// 此域已设置为自动阅读器模式
			// 我们对页面内容一无所知
			else if (readerDecision.info.domainStatus[urlObj.hostname] === true) {
				// 有时域主页会有很多文本，看起来像一篇文章（例如：gutenberg.org, nytimes.com），但几乎从不是，因此除非页面已明确标记为可读（在这种情况下，URLStatus 将在上面处理），否则我们不应重定向到阅读器视图
				if (urlObj.pathname === "/") {
					return -1;
				} else {
					return 0;
				}
			}
		} catch (e) {
			console.warn("无法解析 URL", url, e);
		}

		return -1;
	},

	/**
	 * 设置域的自动重定向状态
	 * @param {*} url - 域的 URL
	 * @param {*} autoRedirect - 自动重定向状态（true 或 false）
	 */
	setDomainStatus: function (url, autoRedirect) {
		readerDecision.info.domainStatus[new URL(url).hostname] = autoRedirect;

		readerDecision.saveData();
	},

	/**
	 * 获取域的自动重定向状态
	 * @param {*} url - 域的 URL
	 * @returns {*} - 自动重定向状态（true 或 false）
	 */
	getDomainStatus: function (url) {
		return readerDecision.info.domainStatus[new URL(url).hostname];
	},

	/**
	 * 为 URL 设置阅读器状态（可读或不可读）
	 * @param {*} url - 页面的 URL
	 * @param {*} isReaderable - 阅读器状态（true 或 false）
	 */
	setURLStatus(url, isReaderable) {
		url = readerDecision.trimURL(url);

		readerDecision.info.URLStatus[url] = { lastVisit: Date.now(), isReaderable };

		readerDecision.saveData();
	},

	/**
	 * 获取 URL 的阅读器状态
	 * @param {*} url - 页面的 URL
	 * @returns {*} - 阅读器状态（true 或 false）
	 */
	getURLStatus: function (url) {
		url = readerDecision.trimURL(url);

		return readerDecision.info.URLStatus[url].isReaderable;
	},

	/**
	 * 获取属于与给定 URL 相同域的 URL 的阅读器状态
	 * @param {*} url - 页面的 URL
	 * @returns {Array} - 阅读器状态数组
	 */
	getSameDomainStatuses: function (url) {
		/**状态结果 */
		var results = [];

		for (var itemURL in readerDecision.info.URLStatus) {
			try {
				if (new URL(itemURL).hostname === new URL(url).hostname && itemURL !== url) {
					results.push(readerDecision.info.URLStatus[itemURL]);
				}
			} catch (e) {}
		}

		return results;
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		// 监听阅读器数据的更改并执行必要的操作
		settingManagement.listen("readerData", function (data) {
			readerDecision.loadData(data);
			if (readerDecision.cleanupData()) {
				readerDecision.saveData();
			}
		});
	},
};

module.exports = readerDecision;
