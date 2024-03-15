/**
 * 视图管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月15日12:02:56
 */
const viewManagement = {
	/**保存浏览器视图的映射，以便根据 id 快速访问视图对象 */
	viewMap: {},

	/**保存浏览器视图的状态映射，以便根据 id 快速访问视图状态 */
	viewStateMap: {},

	/**保存临时弹出的浏览器视图，以便根据 id 进行管理 */
	temporaryPopupViews: {},

	/**全局启动请求计数 */
	globalLaunchRequests: 0,

	/**默认的浏览器视图 WebPreferences 设置 */
	defaultViewWebPreferences: {
		nodeIntegration: false, // 是否允许在浏览器视图中集成 Node.js
		nodeIntegrationInSubFrames: true, // 是否在子框架中允许集成 Node.js
		scrollBounce: true, // 是否允许滚动弹性效果
		safeDialogs: true, // 是否启用安全对话框
		safeDialogsMessage: "Prevent this page from creating additional dialogs", // 安全对话框的提示消息
		preload: __dirname + "/dist/preload.js", // 预加载的脚本文件路径
		contextIsolation: true, // 是否启用上下文隔离
		sandbox: true, // 是否启用沙盒模式
		enableRemoteModule: false, // 是否允许使用 remote 模块
		allowPopups: false, // 是否允许弹出窗口
		// partition: partition || 'persist:webcontent', // 分区设置，默认为 'persist:webcontent'
		enableWebSQL: false, // 是否启用 WebSQL
		autoplayPolicy: settingManagement.get("enableAutoplay") ? "no-user-gesture-required" : "user-gesture-required", // 自动播放策略
		minimumFontSize: 6, // 最小字体大小，默认为 Chrome 的默认值（用于抵御指纹识别）
	},

	/**
	 * 处理外部协议链接
	 * @param {*} e 事件对象
	 * @param {*} url URL地址
	 * @param {*} isInPlace 是否在本地打开
	 * @param {*} isMainFrame 是否是主框架
	 * @param {*} frameProcessId 框架进程 ID
	 * @param {*} frameRoutingId 框架路由 ID
	 */
	handleExternalProtocol: function (e, url, isInPlace, isMainFrame, frameProcessId, frameRoutingId) {
		/**定义已知的协议数组 */
		var knownProtocols = ["http", "https", "file", "zhongjyuan", "about", "data", "javascript", "chrome"];

		// 判断URL的协议是否在已知协议数组中，来确定是否为外部协议链接
		if (!knownProtocols.includes(url.split(":")[0])) {
			/**获取与该协议相关联的应用程序名称 */
			var externalApp = app.getApplicationNameForProtocol(url);
			if (externalApp) {
				/**去除非字母数字和点号的字符，得到清理后的名称 */
				var sanitizedName = externalApp.replace(/[^a-zA-Z0-9.]/g, "");

				if (viewManagement.globalLaunchRequests < 2) {
					// 控制在一定时间内最多弹出两次提示框
					viewManagement.globalLaunchRequests++;

					setTimeout(function () {
						viewManagement.globalLaunchRequests--;
					}, 20000);

					// 弹出提示框询问用户是否在该应用程序中打开链接
					var result = electron.dialog.showMessageBoxSync({
						type: "question",
						buttons: ["OK", "Cancel"],
						message: l("openExternalApp").replace("%s", sanitizedName).replace(/\\/g, ""),
						detail: url.length > 160 ? url.substring(0, 160) + "..." : url,
					});

					if (result === 0) {
						// 如果用户点击了"OK"按钮，则在默认浏览器中打开该URL
						electron.shell.openExternal(url);
					}
				}
			}
		}
	},

	/**
	 * 销毁指定视图
	 * @param {*} id 要销毁的视图的标识符
	 */
	destroyView: function (id) {
		// 如果视图不存在，则直接返回
		if (!viewManagement.viewMap[id]) {
			return;
		}

		// 遍历所有窗口
		windowManagement.getOpenWins().forEach(function (win) {
			// 检查窗口是否包含指定id对应的浏览器视图
			if (viewManagement.viewMap[id] === win.getBrowserView()) {
				// 将该窗口的浏览器视图设置为null
				win.setBrowserView(null);

				// 获取窗口的状态，并将其选中的视图设为null
				windowManagement.getWindowState(win).selectedView = null;
			}
		});

		// 销毁指定id对应的浏览器视图的WebContents
		viewManagement.viewMap[id].webContents.destroy();

		// 从viewMap和viewStateMap对象中删除指定id的视图
		delete viewManagement.viewMap[id];
		delete viewManagement.viewStateMap[id];
	},

	/**
	 * 销毁所有视图
	 */
	destroyAllViews: function () {
		// 遍历viewMap对象的所有属性
		for (const id in viewManagement.viewMap) {
			// 调用destroyView函数销毁对应的视图
			viewManagement.destroyView(id);
		}
	},

	/**
	 * 设置视图的位置和大小
	 * @param {string} id 视图的标识符
	 * @param {Electron.Rectangle} bounds 视图的位置和大小
	 */
	setBounds: function (id, bounds) {
		// 检查视图是否存在于viewMap中
		if (viewManagement.viewMap[id]) {
			// 调用视图对象的setBounds方法，设置视图的位置和大小
			viewManagement.viewMap[id].setBounds(bounds);
		}
	},

	/**
	 * 设置指定窗口中的视图
	 * @param {string} id 视图的标识符
	 * @param {Electron.WebContents} senderContents 发送消息的WebContents对象
	 */
	setView: function (id, senderContents) {
		const win = windowManagement.getWindow(senderContents).win;

		// 当前窗口中的浏览器视图
		const currentBrowserView = win.getBrowserView();

		// 如果要设置的视图不等于当前窗口中的浏览器视图
		if (currentBrowserView !== viewManagement.viewMap[id]) {
			// 如果指定的视图已经加载初始URL
			if (viewManagement.viewStateMap[id].loadedInitialURL) {
				// 将指定的视图设置为当前窗口中的浏览器视图
				win.setBrowserView(viewManagement.viewMap[id]);
			} else {
				// 否则，将当前窗口中的浏览器视图设置为null
				win.setBrowserView(null);
			}

			// 更新当前窗口的选中视图状态为指定的视图id
			windowManagement.getWindowState(win).selectedView = id;
		}
	},

	/**
	 * 将焦点设置到指定视图
	 * @param {string} id 视图的标识符
	 * @returns {boolean} 操作是否成功
	 */
	focusView: function (id) {
		// 检查视图是否存在于viewMap中，并且视图的URL非空或正在加载中
		if (
			viewManagement.viewMap[id] &&
			(viewManagement.viewMap[id].webContents.getURL() !== "" || viewManagement.viewMap[id].webContents.isLoading())
		) {
			// 将视图的焦点设置为当前活动窗口
			viewManagement.viewMap[id].webContents.focus();
			return true;
		}
		// 如果视图存在于BrowserWindow中，则将焦点设置到视图所在的窗口
		else if (BrowserWindow.fromBrowserView(viewManagement.viewMap[id])) {
			BrowserWindow.fromBrowserView(viewManagement.viewMap[id]).webContents.focus();
			return true;
		}
	},

	/**
	 * 隐藏当前视图
	 * @param {Electron.WebContents} senderContents 发送消息的WebContents对象
	 */
	hideView: function (senderContents) {
		// 获取发送消息的WebContents对象所在的窗口并将其存储在win变量中
		const win = windowManagement.getWindow(senderContents).win;

		// 将当前窗口中的浏览器视图设置为null
		win.setBrowserView(null);

		// 更新当前窗口的选中视图状态为null
		windowManagement.getWindowState(win).selectedView = null;

		// 如果当前窗口获得焦点，则将焦点设置到当前窗口的webContents上
		if (win.isFocused()) {
			win.webContents.focus();
		}
	},

	/**
	 * 获取指定标识符的视图
	 * @param {string} id 视图的标识符
	 * @returns {Object|null} 指定标识符的视图对象，如果不存在则返回null
	 */
	getView: function (id) {
		return viewManagement.viewMap[id];
	},

	/**
	 * 从WebContents对象获取标识符
	 * @param {Electron.WebContents} senderContents WebContents对象
	 * @returns {string|null} 匹配的标识符，如果未找到则返回null
	 */
	getViewIDFromWebContents: function (senderContents) {
		// 遍历viewMap中的视图，查找与传入的WebContents对象匹配的视图标识符
		for (var id in viewManagement.viewMap) {
			if (viewManagement.viewMap[id].webContents === senderContents) {
				return id; // 如果找到匹配的WebContents对象，则返回对应的标识符
			}
		}
		return null; // 如果未找到匹配的WebContents对象，则返回null
	},

	/**
	 * 创建浏览器视图
	 * @param {*} existingViewId 已有视图的 ID
	 * @param {*} id 要创建的视图的 ID
	 * @param {*} webPreferencesString WebPreferences 对象的字符串表示形式
	 * @param {*} boundsString 视图的位置和大小的字符串表示形式
	 * @param {*} events 事件数组，包含要在视图上监听的事件名称
	 * @returns 创建的浏览器视图
	 */
	createView: function (existingViewId, id, webPreferencesString, boundsString, events) {
		// 检查是否存在相同 ID 的视图
		if (viewManagement.viewStateMap[id]) {
			console.warn("Creating duplicate view");
		}

		// 将要创建的视图添加到视图状态映射表中
		viewManagement.viewStateMap[id] = { loadedInitialURL: false };

		/**视图对象 */
		let view;

		if (existingViewId) {
			// 如果传入了现有视图的 ID，则从临时弹出视图映射表中获取对应的视图，并从映射表中删除该视图
			view = viewManagement.temporaryPopupViews[existingViewId];
			delete viewManagement.temporaryPopupViews[existingViewId];

			// 设置视图的背景颜色为白色，并将 loadedInitialURL 属性设置为 true
			view.setBackgroundColor("#fff");
			viewManagement.viewStateMap[id].loadedInitialURL = true;
		} else {
			// 如果没有传入已有视图的 ID，则创建新的浏览器视图
			view = new BrowserView({ webPreferences: Object.assign({}, viewManagement.defaultViewWebPreferences, JSON.parse(webPreferencesString)) });
		}

		// 遍历事件数组，为视图的 webContents 添加相应的事件处理函数
		events.forEach(function (event) {
			view.webContents.on(event, function (e) {
				var args = Array.prototype.slice.call(arguments).slice(1);

				/**获取视图所在的 BrowserWindow 对象（如果存在），或者获取当前窗口 */
				const eventTarget = BrowserWindow.fromBrowserView(view) || windowManagement.getCurrentWin();

				if (!eventTarget) {
					// 防止在关闭应用程序时出现错误
					return;
				}

				// 将事件和参数发送到主进程中的渲染进程
				eventTarget.webContents.send("view-event", {
					tabId: id,
					event: event,
					args: args,
				});
			});
		});

		// 处理选择蓝牙设备事件
		view.webContents.on("select-bluetooth-device", function (event, deviceList, callback) {
			event.preventDefault();
			callback("");
		});

		// 处理打开窗口事件
		view.webContents.setWindowOpenHandler(function (details) {
			// 如果传入的特性为空，则说明是从链接中打开的，应该打开一个新的标签页
			if (!details.features) {
				/**获取视图所在的 BrowserWindow 对象（如果存在），或者获取当前窗口 */
				const eventTarget = BrowserWindow.fromBrowserView(view) || windowManagement.getCurrentWin();

				eventTarget.webContents.send("view-event", {
					tabId: id,
					event: "new-tab",
					args: [details.url, !(details.disposition === "background-tab")],
				});

				return {
					action: "deny",
				};
			}

			return {
				action: "allow",
			};
		});

		// 移除事件监听器，防止 'new-window' 事件频繁触发
		view.webContents.removeAllListeners("-add-new-contents");

		// 处理创建弹出窗口事件
		view.webContents.on(
			"-add-new-contents",
			function (e, webContents, disposition, _userGesture, _left, _top, _width, _height, url, frameName, referrer, rawFeatures, postData) {
				// 检查是否应该过滤掉该弹出窗口
				if (!filterManagement.filterPopups(url)) {
					return;
				}

				/**弹窗ID */
				var popupId = Math.random().toString();

				// 创建新的浏览器视图，并将其添加到临时弹出视图映射表中
				var view = new BrowserView({ webPreferences: viewManagement.defaultViewWebPreferences, webContents: webContents });
				viewManagement.temporaryPopupViews[popupId] = view;

				/**获取视图所在的 BrowserWindow 对象（如果存在），或者获取当前窗口 */
				const eventTarget = BrowserWindow.fromBrowserView(view) || windowManagement.getCurrentWin();

				// 将事件和参数发送到主进程中的渲染进程
				eventTarget.webContents.send("view-event", {
					tabId: id,
					event: "did-create-popup",
					args: [popupId, url],
				});
			}
		);

		// 处理 IPC 消息
		view.webContents.on("ipc-message", function (e, channel, data) {
			var senderURL;
			try {
				senderURL = e.senderFrame.url;
			} catch (err) {
				console.warn("dropping message because senderFrame is destroyed", channel, data, err);
				return;
			}

			/**获取视图所在的 BrowserWindow 对象（如果存在），或者获取当前窗口 */
			const eventTarget = BrowserWindow.fromBrowserView(view) || windowManagement.getCurrentWin();

			// 将 IPC 消息和参数发送到主进程中的渲染进程
			eventTarget.webContents.send("view-ipc", {
				id: id,
				name: channel,
				data: data,
				frameId: e.frameId,
				frameURL: senderURL,
			});
		});

		// 处理 HTTP 身份验证事件，弹出登录框
		view.webContents.on("login", (event, authenticationResponseDetails, authInfo, callback) => {
			// 只处理 basic 认证
			if (authInfo.scheme !== "basic") {
				return;
			}

			event.preventDefault();

			promptManagement.createPrompt(
				{
					text: l("loginPromptTitle").replace("%h", authInfo.host),
					values: [
						{ placeholder: l("username"), id: "username", type: "text" },
						{ placeholder: l("password"), id: "password", type: "password" },
					],
					ok: l("dialogConfirmButton"),
					cancel: l("dialogSkipButton"),
					width: 400,
					height: 200,
				},
				function (result) {
					// 使用认证凭据重新发送请求
					callback(result.username, result.password);
				}
			);
		});

		// 处理页面开始导航事件
		view.webContents.on("did-start-navigation", viewManagement.handleExternalProtocol);

		/*
		 * It's possible for an HTTP request to redirect to an external app link
		 * (primary use case for this is OAuth from desktop app > render > back to app)
		 * and did-start-navigation isn't (always?) emitted for redirects, so we need this handler as well
		 */
		view.webContents.on("will-redirect", viewManagement.handleExternalProtocol);

		// 设置视图的位置和大小，并将其添加到视图映射表中
		view.setBounds(JSON.parse(boundsString));

		viewManagement.viewMap[id] = view;

		// 返回创建的视图对象
		return view;
	},

	/**
	 * 初始化函数
	 */
	initialize: function () {
		// 创建视图
		ipc.on("createView", function (e, args) {
			viewManagement.createView(args.existingViewId, args.id, args.webPreferencesString, args.boundsString, args.events);
		});

		// 销毁视图
		ipc.on("destroyView", function (e, id) {
			viewManagement.destroyView(id);
		});

		// 销毁所有视图
		ipc.on("destroyAllViews", function () {
			viewManagement.destroyAllViews();
		});

		// 设置视图
		ipc.on("setView", function (e, args) {
			viewManagement.setView(args.id, e.sender); // 设置视图对象与WebContents对象的映射关系

			viewManagement.setBounds(args.id, args.bounds); // 设置视图的边界

			if (args.focus && BrowserWindow.fromWebContents(e.sender) && BrowserWindow.fromWebContents(e.sender).isFocused()) {
				const couldFocus = viewManagement.focusView(args.id); // 如果窗口处于焦点状态，则尝试将焦点设置为当前视图
				if (!couldFocus) {
					// 如果不能设置焦点，则将焦点重新设置为WebContents对象
					e.sender.focus();
				}
			}
		});

		// 设置视图边界
		ipc.on("setBounds", function (e, args) {
			viewManagement.setBounds(args.id, args.bounds);
		});

		// 焦点设置为指定的视图
		ipc.on("focusView", function (e, id) {
			viewManagement.focusView(id);
		});

		// 隐藏当前视图
		ipc.on("hideView", function (e) {
			viewManagement.hideView(e.sender);
		});

		// 在视图中加载URL
		ipc.on("loadURLInView", function (e, args) {
			const win = windowManagement.getWindow(e.sender).win; // 获取窗口对象

			// 当第一个URL加载完毕后，设置背景颜色以便新标签页可以使用自定义背景
			if (!viewManagement.viewStateMap[args.id].loadedInitialURL) {
				// 在网站显示内容前等待一段时间，以便网站有机会显示自己的暗色主题
				viewManagement.viewMap[args.id].webContents.once("dom-ready", function () {
					viewManagement.viewMap[args.id].setBackgroundColor("#fff");
				});

				// 如果视图没有URL，则它还未被附加到窗口上
				if (args.id === windowManagement.getWindowState(win).selectedView) {
					win.setBrowserView(viewManagement.viewMap[args.id]);
				}
			}

			viewManagement.viewMap[args.id].webContents.loadURL(args.url); // 加载URL
			viewManagement.viewStateMap[args.id].loadedInitialURL = true;
		});

		// 调用视图方法
		ipc.on("callViewMethod", function (e, data) {
			var error, result;
			try {
				var webContents = viewManagement.viewMap[data.id].webContents;
				var methodOrProp = webContents[data.method];

				if (methodOrProp instanceof Function) {
					// 调用函数
					result = methodOrProp.apply(webContents, data.args);
				} else {
					// 设置属性
					if (data.args && data.args.length > 0) {
						webContents[data.method] = data.args[0];
					}

					// 读取属性
					result = methodOrProp;
				}
			} catch (e) {
				error = e;
			}

			if (result instanceof Promise) {
				// 如果返回类型是Promise，则处理异步结果
				result.then(function (result) {
					if (data.callId) {
						e.sender.send("async-call-result", { callId: data.callId, error: null, result });
					}
				});

				result.catch(function (error) {
					if (data.callId) {
						e.sender.send("async-call-result", { callId: data.callId, error, result: null });
					}
				});
			} else if (data.callId) {
				e.sender.send("async-call-result", { callId: data.callId, error, result });
			}
		});

		// 获取视图截图
		ipc.on("getCapture", function (e, data) {
			var view = viewManagement.viewMap[data.id];
			if (!view) {
				// 视图可能已被销毁
				return;
			}

			view.webContents.capturePage().then(function (img) {
				var size = img.getSize();

				if (size.width === 0 && size.height === 0) {
					return;
				}

				img = img.resize({ width: data.width, height: data.height });
				e.sender.send("captureData", { id: data.id, url: img.toDataURL() });
			});
		});

		// 保存视图截图
		ipc.on("saveViewCapture", function (e, data) {
			var view = viewManagement.viewMap[data.id];
			if (!view) {
				// 视图可能已被销毁
			}

			view.webContents.capturePage().then(function (image) {
				view.webContents.downloadURL(image.toDataURL());
			});
		});
	},
};

viewManagement.initialize();

// 将函数导出到全局命名空间中，以便其他模块可以使用。
global.getView = viewManagement.getView; 