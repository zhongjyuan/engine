/**
 * electron.ipcRenderer: Electron框架中的一个模块，它允许在主进程和渲染进程之间进行进程间通信（IPC，Inter-Process Communication）
 * electron.webFrame: Electron框架中的一个模块，用于对Web页面进行操作和控制
 */
const { ipcRenderer, webFrame } = require("electron");

/**需要克隆的事件属性列表 */
const propertiesToClone = ["deltaX", "deltaY", "metaKey", "ctrlKey", "defaultPrevented", "clientX", "clientY"];

/**
 * 克隆事件对象
 * @param {Event} e - 待克隆的事件对象
 * @returns {string} 返回克隆后的 JSON 字符串
 */
function cloneEvent(e) {
	var obj = {};

	// 遍历需要克隆的属性
	for (var i = 0; i < propertiesToClone.length; i++) {
		obj[propertiesToClone[i]] = e[propertiesToClone[i]];
	}

	return JSON.stringify(obj);
}

// 为了解决 Electron 的 bug而设置的延迟
setTimeout(function () {
	/* 用于滑动手势 */
	window.addEventListener("wheel", function (e) {
		// 发送滚轮事件到主进程
		ipcRenderer.send("wheel-event", cloneEvent(e));
	});

	var scrollTimeout = null;

	// 监听滚动事件
	window.addEventListener("scroll", function () {
		clearTimeout(scrollTimeout);

		// 设置延迟发送滚动位置变化到主进程
		scrollTimeout = setTimeout(function () {
			// 发送滚动位置变化到主进程
			ipcRenderer.send("scroll-position-change", Math.round(window.scrollY));
		}, 200);
	});
}, 0);

/* 用于上下文菜单中的画中画功能 */
ipcRenderer.on("getContextMenuData", function (event, data) {
	// 检查是否存在视频元素以显示画中画菜单
	var hasVideo = Array.from(document.elementsFromPoint(data.x, data.y)).some((el) => el.tagName === "VIDEO");

	// 发送上下文菜单数据到主进程
	ipcRenderer.send("contextMenuData", { hasVideo });
});

// 进入画中画模式的事件处理
ipcRenderer.on("enterPictureInPicture", function (event, data) {
	var videos = Array.from(document.elementsFromPoint(data.x, data.y)).filter((el) => el.tagName === "VIDEO");
	if (videos[0]) {
		// 请求进入画中画模式
		videos[0].requestPictureInPicture();
	}
});

// 监听来自文件路径的消息事件
window.addEventListener("message", function (e) {
	if (!e.origin.startsWith("file://")) {
		return;
	}

	// 发送显示凭据列表的消息到主进程
	if (e.data && e.data.message && e.data.message === "showCredentialList") {
		ipcRenderer.send("showCredentialList");
	}
});
