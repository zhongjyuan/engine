const compareVersions = require("../../utils/versionManagement.js");

const settingManagement = require("../../settingManagement.js");

const searchbarPluginManagement = require("../searchbarPluginManagement.js");

/**
 * 更新通知插件对象
 */
const updateNotificationPlugin = {
	/**更新检查的URL */
	UPDATE_URL: "https://zhongjyuan.net/updates/latestVersion.json",

	/**
	 * 获取更新检查的随机数
	 * @returns {number} - 随机数
	 */
	getUpdateRandomNum: function () {
		/* 
		更新JSON文件可能表示只有一部分客户端可以使用更新，为了避免在还没有时间报告错误之前通知所有人更新到新版本。
		创建一个本地保存的随机数，并将其与指定的百分比进行比较，以确定是否应显示更新通知。 
		*/

		if (!localStorage.getItem("updateRandomNumber")) {
			localStorage.setItem("updateRandomNumber", Math.random());
		}

		return parseFloat(localStorage.getItem("updateRandomNumber"));
	},

	/**
	 * 获取可用的更新
	 */
	getAvailableUpdates: function () {
		if (settingManagement.get("updateNotificationsEnabled") !== false) {
			fetch(updateNotificationPlugin.UPDATE_URL, {
				// 发送更新检查请求
				cache: "no-cache",
			})
				.then((res) => res.json()) // 解析响应为JSON数据
				.then(function (response) {
					console.info("got response from update check", response);
					if (
						response.version && // 响应中包含版本号
						compareVersions(window.globalArgs["app-version"], response.version) > 0 && // 当前版本号小于响应中的版本号
						(!response.availabilityPercent || updateNotificationPlugin.getUpdateRandomNum() < response.availabilityPercent) // 没有指定百分比或随机数小于指定百分比
					) {
						console.info("an update is available");
						localStorage.setItem("availableUpdate", JSON.stringify(response)); // 将可用的更新信息保存到本地存储
					} else {
						console.info("update is not available");
						/* this can happen if either the update is no longer being offered, or the update has already been installed */
						localStorage.removeItem("availableUpdate"); // 更新不可用时，移除本地存储中的更新信息
					}
				})
				.catch(function (e) {
					console.info("failed to get update info", e);
				});
		} else {
			console.info("update checking is disabled");
		}
	},

	/**
	 * 显示更新通知
	 * @param {string} text - 输入框中的文本
	 * @param {HTMLElement} input - 输入框的DOM元素
	 * @param {Event} event - 触发显示更新通知的事件
	 */
	showUpdateNotification: function (text, input, event) {
		function displayUpdateNotification() {
			searchbarPluginManagement.reset("updateNotifications"); // 重置容器内容
			searchbarPluginManagement.addResult(
				"updateNotifications",
				{
					title: l("updateNotificationTitle"), // 更新通知的标题
					descriptionBlock: update.releaseHeadline || "View release notes", // 更新的摘要或查看发布说明
					url: update.releaseNotes, // 发布说明的URL
					icon: "carbon:renew", // 图标
				},
				{ allowDuplicates: true }
			);
		}
		// 是否有可用的更新
		var update = JSON.parse(localStorage.getItem("availableUpdate"));
		if (update) {
			// 更新是否已安装
			if (compareVersions(window.globalArgs["app-version"], update.version) <= 0) {
				return;
			}

			var updateAge = Date.now() - update.releaseTime; // 更新的发布时间与当前时间之差

			/* 最初，在没有标签页打开的情况下，只在显示通知时才显示更新通知，以最小化干扰 */
			if (updateAge < 3 * 7 * 24 * 60 * 60 * 1000) {
				// 如果更新发布时间小于三周
				if (window.tabs.isEmpty()) {
					displayUpdateNotification(); // 显示更新通知
				}
			} else {
				/* 3周后，在所有新标签页上显示通知 */
				if (!window.tabs.get(tabs.getSelected()).url) {
					displayUpdateNotification(); // 显示更新通知
				}
			}
		}
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		setTimeout(updateNotificationPlugin.getAvailableUpdates, 30000); // 延迟30秒后检查更新
		setInterval(updateNotificationPlugin.getAvailableUpdates, 24 * 60 * 60 * 1000); // 每24小时检查一次更新

		searchbarPluginManagement.register("updateNotifications", {
			index: 11, // 设置插件的索引
			trigger: function (text) {
				// 设置触发条件
				return !text && performance.now() > 5000;
			},
			showResults: updateNotificationPlugin.showUpdateNotification, // 设置显示结果的函数
		});
	},
};

module.exports = updateNotificationPlugin;
