const { webviews } = require("../webviewManagement.js");

/**
 * 权限处理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日12:36:30
 */
const permissionHandle = {
	/**权限请求数组 */
	requests: [],

	/**权限变化监听器数组 */
	listeners: [],

	/**
	 * 授予权限
	 * @param {*} permissionId - 权限 ID
	 */
	grant: function (permissionId) {
		permissionHandle.requests.forEach(function (request) {
			if (request.permissionId && request.permissionId === permissionId) {
				// 发送授权消息到主进程
				window.ipc.send("permissionGranted", permissionId);
			}
		});
	},

	/**
	 * 获取权限对应的图标
	 * @param {*} request - 权限请求对象
	 * @returns {Array} - 图标数组
	 */
	getIcons: function (request) {
		// 返回通知权限的图标
		if (request.permission === "notifications") {
			return ["carbon:chat"];
		}

		// 返回指针锁定权限的图标
		else if (request.permission === "pointerLock") {
			return ["carbon:cursor-1"];
		}

		// 返回媒体权限的图标
		else if (request.permission === "media" && request.details.mediaTypes) {
			var mediaIcons = {
				video: "carbon:video", // 视频权限的图标
				audio: "carbon:microphone", // 麦克风权限的图标
			};

			return request.details.mediaTypes.map((t) => mediaIcons[t]);
		}

		return [];
	},

	/**
	 * 获取权限按钮
	 * @param {*} tabId - 标签页 ID
	 * @returns {Array} - 按钮数组
	 */
	getButtons: function (tabId) {
		var buttons = [];

		permissionHandle.requests.forEach(function (request) {
			const icons = permissionHandle.getIcons(request);

			// 不显示不支持的权限类型的按钮
			if (icons.length === 0) {
				return;
			}

			if (request.tabId === tabId) {
				var button = document.createElement("button");
				button.className = "tab-icon permission-request-icon";
				if (request.granted) {
					button.classList.add("active");
				}

				icons.forEach(function (icon) {
					var el = document.createElement("i");
					el.className = "i " + icon;
					button.appendChild(el);
				});

				button.addEventListener("click", function (e) {
					e.stopPropagation();

					if (request.granted) {
						// 刷新网页视图
						webviews.callAsync(tabId, "reload");
					} else {
						// 授予权限
						permissionHandle.grant(request.permissionId);

						button.classList.add("active");
					}
				});

				buttons.push(button);
			}
		});

		return buttons;
	},

	/**
	 * 注册权限变化监听器
	 * @param {*} listener - 监听器函数
	 */
	onChange: function (listener) {
		permissionHandle.listeners.push(listener);
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		window.ipc.on("updatePermissions", function (e, data) {
			var oldData = permissionHandle.requests;

			permissionHandle.requests = data;

			oldData.forEach(function (req) {
				permissionHandle.listeners.forEach((listener) => listener(req.tabId));
			});

			permissionHandle.requests.forEach(function (req) {
				permissionHandle.listeners.forEach((listener) => listener(req.tabId));
			});
		});
	},
};

permissionHandle.initialize();

module.exports = permissionHandle;
