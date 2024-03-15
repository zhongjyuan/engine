/**
 * 远端动作管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日19:28:45
 */
const remoteActionManagement = {
	/**
	 * 显示焦点模式对话框1
	 */
	showFocusModeDialog1: function () {
		dialog.showMessageBox({
			type: "info",
			buttons: [l("closeDialog")],
			message: l("isFocusMode"),
			detail: l("focusModeExplanation1") + " " + l("focusModeExplanation2"),
		});
	},

	/**
	 * 显示焦点模式对话框2
	 */
	showFocusModeDialog2: function () {
		dialog.showMessageBox({
			type: "info",
			buttons: [l("closeDialog")],
			message: l("isFocusMode"),
			detail: l("focusModeExplanation2"),
		});
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		// 处理开始文件拖拽的请求
		ipc.handle("startFileDrag", function (e, path) {
			// 从应用中获取文件图标，并启动拖拽操作
			app.getFileIcon(path, {}).then(function (icon) {
				e.sender.startDrag({
					file: path,
					icon: icon,
				});
			});
		});

		// 显示打开对话框的请求处理
		ipc.handle("showOpenDialog", async function (e, options) {
			const result = await dialog.showOpenDialog(windowManagement.getWindow(e.sender).win, options);
			return result.filePaths;
		});

		// 显示保存对话框的请求处理
		ipc.handle("showSaveDialog", async function (e, options) {
			const result = await dialog.showSaveDialog(windowManagement.getWindow(e.sender).win, options);
			return result.filePath;
		});

		// 将单词添加到拼写检查字典中
		ipc.handle("addWordToSpellCheckerDictionary", function (e, word) {
			session.fromPartition("persist:webcontent").addWordToSpellCheckerDictionary(word);
		});

		// 清除存储数据的请求处理
		ipc.handle("clearStorageData", function () {
			return (
				session
					.fromPartition("persist:webcontent")
					.clearStorageData()
					// 避免删除默认分区的文件://数据，以免影响浏览器内部数据
					.then(function () {
						return session.defaultSession.clearStorageData({ origin: "http://" });
					})
					.then(function () {
						return session.defaultSession.clearStorageData({ origin: "https://" });
					})
					.then(function () {
						return session.fromPartition("persist:webcontent").clearCache();
					})
					.then(function () {
						return session.fromPartition("persist:webcontent").clearHostResolverCache();
					})
					.then(function () {
						return session.fromPartition("persist:webcontent").clearAuthCache();
					})
					.then(function () {
						return session.defaultSession.clearCache();
					})
					.then(function () {
						return session.defaultSession.clearHostResolverCache();
					})
					.then(function () {
						return session.defaultSession.clearAuthCache();
					})
			);
		});

		/* 窗口操作 */

		// 最小化窗口
		ipc.handle("minimize", function (e) {
			windowManagement.getWindow(e.sender).win.minimize();
			e.sender.send("minimize");
		});

		// 最大化窗口
		ipc.handle("maximize", function (e) {
			windowManagement.getWindow(e.sender).win.maximize();
			e.sender.send("maximize");
		});

		// 还原窗口
		ipc.handle("unmaximize", function (e) {
			windowManagement.getWindow(e.sender).win.unmaximize();
			e.sender.send("unmaximize");
		});

		// 关闭窗口
		ipc.handle("close", function (e) {
			windowManagement.getWindow(e.sender).win.close();
		});

		// 设置全屏模式
		ipc.handle("setFullScreen", function (e, fullScreen) {
			windowManagement.getWindow(e.sender).win.setFullScreen(e, fullScreen);
		});

		// 在文件管理器中显示指定路径的文件或文件夹
		ipc.handle("showItemInFolder", function (e, path) {
			shell.showItemInFolder(path);
		});
	},
};

remoteActionManagement.initialize();