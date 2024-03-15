// 监听来自页面的消息事件
window.addEventListener("message", function (e) {
	// 如果消息不是来自本地文件.不做任何处理，直接返回
	if (!e.origin.startsWith("file://")) return;

	// 如果收到获取设置数据的消息
	if (e.data && e.data.message && e.data.message === "getSettingsData") {
		// 向后端进程发送获取设置数据的消息
		ipcRenderer.send("getSettingsData");
	}

	// 如果收到设置设置项的消息
	if (e.data && e.data.message && e.data.message === "setSetting") {
		// 向后端进程发送设置设置项的消息
		ipcRenderer.send("setSetting", { key: e.data.key, value: e.data.value });
	}
});

// 当接收到主进程发送的设置数据时
ipcRenderer.on("receiveSettingsData", function (e, data) {
	// 可能是多余的检查，但还是检查一下
	if (window.location.toString().startsWith("file://")) {
		// 向页面发送设置数据
		window.postMessage({ message: "receiveSettingsData", settings: data }, "file://");
	}
});
