/**
 * 下载管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月15日17:27:36
 */
const downloadManagement = {
	/**当前正在下载的文件项 */
	currrentDownloadItems: {},

	/**
	 * 判断是否是附件
	 * @param {*} header HTTP头部
	 * @returns {boolean} 是否是附件
	 */
	isAttachment: function (header) {
		return /^\s*attache*?ment/i.test(header); // 判断HTTP头部是否表示附件的正则表达式。
	},

	/**
	 * 下载事件处理函数
	 * @param {*} event 事件对象
	 * @param {*} item 下载项
	 * @param {*} webContents Web内容
	 * @returns {boolean} 是否继续处理该下载项
	 */
	downloadHandler: function (event, item, webContents) {
		/**源窗体对象 */
		let sourceWindow;

		/**源视图对象 */
		const sourceView = Object.values(viewManagement.viewMap).find((view) => view.webContents.id === webContents.id);
		if (sourceView) {
			// 通过browserView获取窗口对象。
			sourceWindow = BrowserWindow.fromBrowserView(sourceView);
		}

		if (!sourceWindow) {
			// 获取当前激活的窗口对象。
			sourceWindow = windowManagement.getCurrentWin();
		}

		/**保存文件名 */
		var savePathFilename; // 保存下载文件的路径和文件名。

		// 向下载管理器发送下载信息
		sendIPCToWindow(sourceWindow, "download-info", {
			path: item.getSavePath(), // 文件保存的路径。
			name: item.getFilename(), // 文件名。
			status: "progressing", // 当前状态是下载中。
			size: { received: 0, total: item.getTotalBytes() }, // 文件大小信息。
		});

		// 监听下载项的更新事件
		item.on("updated", function (e, state) {
			if (!savePathFilename) {
				savePathFilename = path.basename(item.getSavePath()); // 获取文件名和路径。
			}

			if (item.getSavePath()) {
				downloadManagement.currrentDownloadItems[item.getSavePath()] = item; // 存储当前正在下载的文件项。
			}

			// 向下载管理器发送下载信息
			sendIPCToWindow(sourceWindow, "download-info", {
				path: item.getSavePath(), // 文件保存的路径。
				name: savePathFilename, // 文件名。
				status: state, // 文件状态。
				size: { received: item.getReceivedBytes(), total: item.getTotalBytes() }, // 文件大小信息。
			});
		});

		// 监听下载完成事件
		item.once("done", function (e, state) {
			delete downloadManagement.currrentDownloadItems[item.getSavePath()];

			// 向下载管理器发送下载信息
			sendIPCToWindow(sourceWindow, "download-info", {
				path: item.getSavePath(), // 文件保存的路径。
				name: savePathFilename, // 文件名。
				status: state, // 文件状态。
				size: { received: item.getTotalBytes(), total: item.getTotalBytes() }, // 文件大小信息。
			});
		});

		return true;
	},

	/**
	 * 监听会话中的HTTP响应头部接收事件
	 * @param {*} session 会话对象
	 */
	listenForDownloadHeaders: function (session) {
		session.webRequest.onHeadersReceived(function (details, callback) {
			if (details.resourceType === "mainFrame" && details.responseHeaders) {
				/**源窗体对象 */
				let sourceWindow;

				if (details.webContents) {
					/**源视图对象 */
					const sourceView = Object.values(viewManagement.viewMap).find((view) => view.webContents.id === details.webContents.id);
					if (sourceView) {
						// 通过browserView获取窗口对象。
						sourceWindow = BrowserWindow.fromBrowserView(sourceView);
					}
				}

				if (!sourceWindow) {
					// 获取当前激活的窗口对象。
					sourceWindow = windowManagement.getCurrentWin();
				}

				/**Header 类型 */
				var typeHeader = details.responseHeaders[Object.keys(details.responseHeaders).filter((k) => k.toLowerCase() === "content-type")];

				/**附件对象 */
				var attachment = downloadManagement.isAttachment(
					details.responseHeaders[Object.keys(details.responseHeaders).filter((k) => k.toLowerCase() === "content-disposition")]
				);

				if (typeHeader instanceof Array && typeHeader.filter((t) => t.includes("application/pdf")).length > 0 && !attachment) {
					callback({ cancel: true }); // 取消当前响应。

					// 在PDF查看器中打开
					sendIPCToWindow(sourceWindow, "openPDF", {
						url: details.url, // PDF文件的URL。
						tabId: null,
					});

					return;
				}

				/**是否文件预览 */
				const isFileView = typeHeader instanceof Array && !typeHeader.some((t) => t.includes("text/html"));

				// 向主进程发送文件视图信息
				sendIPCToWindow(sourceWindow, "set-file-view", {
					url: details.url, // 文件的URL。
					isFileView, // 是否是文件视图。
				});
			}

			callback({ cancel: false }); // 继续处理当前响应。
		});
	},

	/**
	 * 初始化函数
	 */
	initialize: function () {
		// 取消下载事件的监听器
		ipc.on("cancelDownload", function (e, path) {
			if (downloadManagement.currrentDownloadItems[path]) {
				downloadManagement.currrentDownloadItems[path].cancel(); // 取消指定路径的下载任务。
			}
		});

		// 为默认会话注册下载事件处理函数
		app.once("ready", function () {
			session.defaultSession.on("will-download", downloadManagement.downloadHandler);
			downloadManagement.listenForDownloadHeaders(session.defaultSession);
		});

		// 为新会话注册下载事件处理函数
		app.on("session-created", function (session) {
			session.on("will-download", downloadManagement.downloadHandler);
			downloadManagement.listenForDownloadHeaders(session);
		});
	},
};

downloadManagement.initialize();
