const settingManagement = require("../settings/renderSettingManagement.js");

/**
 * 窗口控制对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日11:14:50
 */
const windowControl = {
	/**标识窗口是否最大化，默认为false */
	windowIsMaximized: false,

	/**标识窗口是否全屏，默认为false */
	windowIsFullscreen: false,

	/**最小化按钮 */
	captionMinimize: document.querySelector(".windows-caption-buttons .caption-minimise, body.linux .titlebar-linux .caption-minimise"),

	/**最大化按钮 */
	captionMaximize: document.querySelector(".windows-caption-buttons .caption-maximize, body.linux .titlebar-linux .caption-maximize"),

	/**还原按钮 */
	captionRestore: document.querySelector(".windows-caption-buttons .caption-restore, body.linux .titlebar-linux .caption-restore"),


	/**关闭按钮 */
	captionClose: document.querySelector(".windows-caption-buttons .caption-close, body.linux .titlebar-linux .caption-close"),

	/**Linux 平台的关闭按钮 */
	linuxClose: document.querySelector("#linux-control-buttons #close-button"),

	/**Linux 平台的最小化按钮 */
	linuxMinimize: document.querySelector("#linux-control-buttons #minimize-button"),
	
	/**Linux 平台的最大化按钮 */
	linuxMaximize: document.querySelector("#linux-control-buttons #maximize-button"),

	/**
	 * 更新标题栏按钮状态
	 */
	updateCaptionButtons: function () {
		// 如果当前平台是 Windows
		if (window.platformType === "windows") {
			// 如果窗口已经最大化或全屏
			if (windowControl.windowIsMaximized || windowControl.windowIsFullscreen) {
				// 隐藏最大化按钮
				windowControl.captionMaximize.hidden = true;

				// 显示还原按钮
				windowControl.captionRestore.hidden = false;
			} else {
				// 显示最大化按钮
				windowControl.captionMaximize.hidden = false;

				// 隐藏还原按钮
				windowControl.captionRestore.hidden = true;
			}
		}
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		// 根据设置模块中的配置来设置是否使用独立标题栏样式
		if (settingManagement.get("useSeparateTitlebar") === true) {
			document.body.classList.add("separate-titlebar");
		}

		// 如果是 Windows 平台，更新标题栏按钮状态并添加点击事件监听
		if (window.platformType === "windows") {
			// 更新标题栏按钮状态
			windowControl.updateCaptionButtons();

			// 添加最小化按钮点击事件监听器
			windowControl.captionMinimize.addEventListener("click", function (e) {
				window.ipc.invoke("minimize"); // 最小化窗口
			});

			// 添加最大化/还原按钮点击事件监听器
			windowControl.captionMaximize.addEventListener("click", function (e) {
				window.ipc.invoke("maximize"); // 最大化窗口
			});

			// 添加还原按钮点击事件监听器
			windowControl.captionRestore.addEventListener("click", function (e) {
				if (windowControl.windowIsFullscreen) {
					// 如果窗口处于全屏状态
					window.ipc.invoke("setFullScreen", false); // 退出全屏模式
				} else {
					// 否则窗口处于最大化状态
					window.ipc.invoke("unmaximize"); // 还原窗口
				}
			});

			// 添加关闭按钮点击事件监听器
			windowControl.captionClose.addEventListener("click", function (e) {
				window.ipc.invoke("close"); // 关闭窗口
			});
		}

		// 监听窗口最大化、还原、进入全屏、退出全屏等事件，并更新标题栏按钮状态
		window.ipc.on("maximize", function (e) {
			// 将窗口最大化标志设置为 true
			windowControl.windowIsMaximized = true;
			// 更新标题栏按钮状态
			windowControl.updateCaptionButtons();
		});

		window.ipc.on("unmaximize", function (e) {
			// 将窗口最大化标志设置为 false
			windowControl.windowIsMaximized = false;
			// 更新标题栏按钮状态
			windowControl.updateCaptionButtons();
		});

		window.ipc.on("enter-full-screen", function (e) {
			// 将窗口全屏标志设置为 true
			windowControl.windowIsFullscreen = true;
			// 更新标题栏按钮状态
			windowControl.updateCaptionButtons();
		});

		window.ipc.on("leave-full-screen", function (e) {
			// 将窗口全屏标志设置为 false
			windowControl.windowIsFullscreen = false;
			// 更新标题栏按钮状态
			windowControl.updateCaptionButtons();
		});

		// 如果是 Linux 平台，添加关闭、最大化、最小化按钮的点击事件监听
		if (window.platformType === "linux") {
			// 添加关闭按钮的点击事件监听
			windowControl.linuxClose.addEventListener("click", function (e) {
				window.ipc.invoke("close"); // 调用 ipc 模块的 invoke 方法发送 close 消息，请求关闭窗口
			});

			// 添加最大化按钮的点击事件监听
			windowControl.linuxMaximize.addEventListener("click", function (e) {
				if (windowControl.windowIsFullscreen) {
					// 如果窗口处于全屏模式，请求退出全屏
					window.ipc.invoke("setFullScreen", false);
				} else if (windowControl.windowIsMaximized) {
					// 如果窗口已经最大化，请求还原窗口大小
					window.ipc.invoke("unmaximize");
				} else {
					// 否则，请求最大化窗口
					window.ipc.invoke("maximize");
				}
			});

			// 添加最小化按钮的点击事件监听
			windowControl.linuxMinimize.addEventListener("click", function (e) {
				window.ipc.invoke("minimize"); // 调用 ipc 模块的 invoke 方法发送 minimize 消息，请求最小化窗口
			});
		}
	},
};

module.exports = windowControl;
