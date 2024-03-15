const settingManagement = require("../settings/renderSettingManagement.js");

const urlManagement = require("./utils/urlManagement.js");

/**
 * webViews 对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日11:30:53
 */
const webviews = {
	/** 事件队列 */
	events: [],

	/** IPC事件队列 */
	IPCEvents: [],

	/** 当前选中的浏览器视图的ID */
	selectedId: null,

	/** 浏览器视图全屏模式映射表 */
	viewFullscreenMap: {}, // tabId, isFullscreen

	/** 占位符请求队列 */
	placeholderRequests: [],

	/** 异步回调函数映射表 */
	asyncCallbacks: {},

	/** 内部页面URL映射表 */
	internalPages: {
		error: urlManagement.getFileURL(__dirname + "/pages/error/index.html"),
	},

	/**
	 * 检查给定的tabId是否有对应的浏览器视图
	 * @param {*} tabId - 要检查的tabId
	 * @returns {boolean} - 如果有浏览器视图，则返回true；否则返回false
	 */
	hasViewForTab: function (tabId) {
		return tabId && window.tasks.getTaskContainingTab(tabId) && window.tasks.getTaskContainingTab(tabId).tabs.get(tabId).hasBrowserView;
	},

	/**
	 * 绑定一个IPC事件和相应的回调函数
	 * @param {*} name - 要绑定的IPC事件名称
	 * @param {*} fn - IPC事件触发时要调用的回调函数
	 */
	bindIPC: function (name, fn) {
		webviews.IPCEvents.push({
			name: name,
			fn: fn,
		});
	},

	/**
	 * 绑定一个事件和相应的回调函数
	 * @param {*} event - 要绑定的事件
	 * @param {*} fn - 事件触发时要调用的回调函数
	 */
	bindEvent: function (event, fn) {
		webviews.events.push({
			event: event,
			fn: fn,
		});
	},

	/**
	 * 解绑指定事件和回调函数
	 * @param {*} event - 要解绑的事件
	 * @param {*} fn - 要解绑的回调函数
	 */
	unbindEvent: function (event, fn) {
		for (var i = 0; i < webviews.events.length; i++) {
			if (webviews.events[i].event === event && webviews.events[i].fn === fn) {
				webviews.events.splice(i, 1);
				i--;
			}
		}
	},

	/**
	 * 触发指定事件，并将参数传递给回调函数
	 * @param {*} event - 要触发的事件
	 * @param {*} tabId - 与事件相关的tabId
	 * @param {*} args - 要传递给回调函数的参数
	 */
	emitEvent: function (event, tabId, args) {
		// 如果当前tab没有浏览器视图，则直接退出；因为后续的操作都需要浏览器视图
		if (!webviews.hasViewForTab(tabId)) {
			return;
		}

		// 遍历所有的事件
		webviews.events.forEach(function (ev) {
			// 如果事件匹配，则调用回调函数
			if (ev.event === event) {
				ev.fn.apply(this, [tabId].concat(args));
			}
		});
	},

	/**
	 *
	 * @param {*} margins
	 */
	adjustMargin: function (margins) {
		for (var i = 0; i < margins.length; i++) {
			webviews.viewMargins[i] += margins[i];
		}

		webviews.resize();
	},

	/**
	 * 视图边距数组
	 * 第一个元素表示顶部边距，第二个元素表示右侧边距，第三个元素表示底部边距，第四个元素表示左侧边距
	 */
	viewMargins: [0, 0, 0, 0], // top, right, bottom, left

	/**
	 * 获取当前视图的边界框（包括位置和大小）
	 * 如果当前视图处于全屏模式，则返回窗口的整个尺寸
	 * 如果不是全屏模式，则根据窗口大小、标题栏高度和视图边距计算边界框
	 * @returns {Object} - 边界框对象，包含四个属性：x、y、width 和 height
	 */
	getViewBounds: function () {
		// 如果当前视图是全屏模式，则返回整个窗口的大小
		if (webviews.viewFullscreenMap[webviews.selectedId]) {
			return {
				x: 0,
				y: 0,
				width: window.innerWidth,
				height: window.innerHeight,
			};
		} else {
			// 标题栏高度，默认为36
			let navbarHeight = 36;

			// 如果没有分离的标题栏，且当前系统是Linux或Windows，且窗口既不是最大化也不是全屏，则标题栏高度为48
			if (
				(window.platformType === "linux" || window.platformType === "windows") &&
				!webviewManagement.hasSeparateTitlebar &&
				!webviewManagement.windowIsMaximized &&
				!webviewManagement.windowIsFullscreen
			) {
				navbarHeight = 48;
			}

			// 计算视图的边界框
			let position = {
				x: 0 + Math.round(webviews.viewMargins[3]),
				y: 0 + Math.round(webviews.viewMargins[0]) + navbarHeight,
				width: window.innerWidth - Math.round(webviews.viewMargins[1] + webviews.viewMargins[3]),
				height: window.innerHeight - Math.round(webviews.viewMargins[0] + webviews.viewMargins[2]) - navbarHeight,
			};

			return position;
		}
	},

	/**
	 * 向窗口中添加浏览器视图
	 * @param {number} tabId - 标签页的唯一标识符
	 * @param {string} existingViewId - 已存在的视图的标识符（如果有的话）
	 */
	add: function (tabId, existingViewId) {
		/**选项卡对象 */
		var tabData = window.tabs.get(tabId);

		// 如果标签页滚动位置存在，则在创建视图之前调用滚动函数
		if (tabData.scrollPosition) {
			webviewManagement.scrollOnLoad(tabId, tabData.scrollPosition);
		}

		// 如果标签页被静音，则在创建视图时设置静音状态
		if (tabData.muted) {
			webviewManagement.setAudioMutedOnCreate(tabId, tabData.muted);
		}

		// 如果标签页是隐私模式，则将其分割为独立的会话
		if (tabData.private === true) {
			// 标签页ID是一个数字，remote.session.fromPartition 需要一个字符串，所以需要先转换成字符串
			var partition = tabId.toString();
		}

		// 发送消息给主进程，要求创建新的浏览器视图
		window.ipc.send("createView", {
			existingViewId,
			id: tabId,
			webPreferencesString: JSON.stringify({
				partition: partition || "persist:webcontent",
			}),
			boundsString: JSON.stringify(webviews.getViewBounds()),
			events: webviews.events.map((e) => e.event).filter((i, idx, arr) => arr.indexOf(i) === idx),
		});

		// 如果不存在现有的视图，则加载标签页的URL
		if (!existingViewId) {
			if (tabData.url) {
				window.ipc.send("loadURLInView", { id: tabData.id, url: urlManagement.parse(tabData.url) });
			} else if (tabData.private) {
				window.ipc.send("loadURLInView", { id: tabData.id, url: urlManagement.parse("z://newtab") });
			}
		}

		// 更新任务中的标签页信息，标记为拥有浏览器视图
		window.tasks.getTaskContainingTab(tabId).tabs.update(tabId, {
			hasBrowserView: true,
		});
	},

	/**
	 * 更新浏览器视图
	 * @param {number} id - 视图的唯一标识符
	 * @param {string} url - 要加载的URL
	 */
	update: function (id, url) {
		// 发送消息给主进程，要求在指定视图中加载URL
		window.ipc.send("loadURLInView", { id: id, url: urlManagement.parse(url) });
	},

	/**
	 * 销毁浏览器视图
	 * @param {number} id - 视图的唯一标识符
	 */
	destroy: function (id) {
		// 触发“视图隐藏”事件
		webviews.emitEvent("view-hidden", id);

		if (webviews.hasViewForTab(id)) {
			// 如果视图对应的标签对象存在，则更新标签对象的属性
			window.tasks.getTaskContainingTab(id).tabs.update(id, {
				hasBrowserView: false,
			});
		}

		// 发送消息给主进程，要求销毁视图
		window.ipc.send("destroyView", id);

		// 从全屏映射中移除该视图的标识符
		delete webviews.viewFullscreenMap[id];

		// 如果该视图是选定的视图，将选定的视图ID设置为null
		if (webviews.selectedId === id) {
			webviews.selectedId = null;
		}
	},

	/**
	 * 设置选定的浏览器视图
	 * @param {number} id - 视图的唯一标识符
	 * @param {Object} options - 选项参数
	 * @returns
	 */
	setSelected: function (id, options) {
		// 如果选项中未指定是否要聚焦于视图，则默认为聚焦

		// 触发“视图隐藏”事件
		webviews.emitEvent("view-hidden", webviews.selectedId);

		// 设置选定的视图ID
		webviews.selectedId = id;

		// 如果视图不存在，则创建新视图
		if (!webviews.hasViewForTab(id)) {
			// 创建新视图
			webviews.add(id);
		}

		// 如果有待处理的占位符请求，则更新占位符而不显示实际视图
		if (webviews.placeholderRequests.length > 0) {
			// 更新占位符
			webviews.requestPlaceholder();
			return;
		}

		// 发送消息给主进程，要求设置视图
		window.ipc.send("setView", {
			id: id,
			bounds: webviews.getViewBounds(), // 获取视图边界信息
			focus: !options || options.focus !== false, // 是否聚焦于视图，默认为 true
		});

		// 触发“视图显示”事件
		webviews.emitEvent("view-shown", id);
	},

	/**
	 * 请求占位符
	 * @param {*} reason - 请求的原因
	 */
	requestPlaceholder: function (reason) {
		// 将原因添加到占位符请求列表中
		if (reason && !webviews.placeholderRequests.includes(reason)) {
			webviews.placeholderRequests.push(reason);
		}

		if (webviews.placeholderRequests.length >= 1) {
			// 创建一个新的占位符
			var associatedTab = window.tasks.getTaskContainingTab(webviews.selectedId).tabs.get(webviews.selectedId);

			var img = associatedTab.previewImage;
			if (img) {
				webviewManagement.placeholderImg.src = img; // 设置占位符图片的源
				webviewManagement.placeholderImg.hidden = false; // 显示占位符图片
			} else if (associatedTab && associatedTab.url) {
				// 捕获当前标签页的截图
				webviewManagement.captureCurrentTab({ forceCapture: true });
			} else {
				// 隐藏占位符图片
				webviewManagement.placeholderImg.hidden = true;
			}
		}

		setTimeout(function () {
			// 等待确保图片可见后再隐藏浏览器视图
			// 确保在创建超时时和超时发生时之间没有删除占位符
			if (webviews.placeholderRequests.length > 0) {
				// 发送消息给主进程，要求隐藏当前视图
				window.ipc.send("hideCurrentView");

				// 触发“视图隐藏”事件
				webviews.emitEvent("view-hidden", webviews.selectedId);
			}
		}, 0);
	},

	/**
	 * 隐藏占位符
	 * @param {*} reason - 请求占位符被隐藏的原因
	 */
	hidePlaceholder: function (reason) {
		// 如果请求列表中包含原因，则移除该原因
		if (webviews.placeholderRequests.includes(reason)) {
			webviews.placeholderRequests.splice(webviews.placeholderRequests.indexOf(reason), 1);
		}

		if (webviews.placeholderRequests.length === 0) {
			// 多个请求可能同时请求占位符，但如果不再需要占位符，我们应该再次显示视图
			if (webviews.hasViewForTab(webviews.selectedId)) {
				// 发送消息给主进程，设置视图参数，让视图重新显示
				window.ipc.send("setView", {
					id: webviews.selectedId,
					bounds: webviews.getViewBounds(),
					focus: true,
				});

				// 触发“视图显示”事件
				webviews.emitEvent("view-shown", webviews.selectedId);
			}

			// 等待视图可见后再移除占位符
			setTimeout(function () {
				// 确保在超时后占位符没有被重新启用
				if (webviews.placeholderRequests.length === 0) {
					// 隐藏占位符图片
					webviewManagement.placeholderImg.hidden = true;
				}
			}, 400);
		}
	},

	/**
	 * 释放焦点
	 */
	releaseFocus: function () {
		// 发送消息给主进程，请求将焦点设置回主要的 Web 内容
		window.ipc.send("focusMainWebContents");
	},

	/**
	 * 设置焦点
	 */
	focus: function () {
		if (webviews.selectedId) {
			// 发送消息给主进程，请求将焦点设置在指定的 Web 视图上
			window.ipc.send("focusView", webviews.selectedId);
		}
	},

	/**
	 * 调整大小
	 */
	resize: function () {
		// 发送消息给主进程，请求设置选定Web视图的边界大小
		window.ipc.send("setBounds", { id: webviews.selectedId, bounds: webviews.getViewBounds() });
	},

	/**
	 * 回退页面，忽略重定向
	 * @param {*} id
	 */
	goBackIgnoringRedirects: function (id) {
		/**
		 * 如果当前页面是错误页面，我们实际上需要回退两个页面，因为最后一个页面会将我们发送回错误页面
		 * TODO 对于阅读器模式，如果最后一个页面被重定向到阅读器模式，我们也希望执行相同的操作（因为它也可能是一个无关的页面）
		 */

		var url = window.tabs.get(id).url;

		if (url.startsWith(urlManagement.parse("z://error"))) {
			webviews.callAsync(id, "canGoToOffset", -2, function (err, result) {
				if (!err && result === true) {
					webviews.callAsync(id, "goToOffset", -2);
				} else {
					webviews.callAsync(id, "goBack");
				}
			});
		} else {
			webviews.callAsync(id, "goBack");
		}
	},

	/**
	 * 以这样调用：
	 * callAsync(id, method, args, callback) -> 调用具有参数 args 的方法，运行回调函数并返回 (err, result)
	 * callAsync(id, method, callback) -> 调用不带参数的方法，运行回调函数并返回 (err, result)
	 * callAsync(id, property, value, callback) -> 将属性设置为 value
	 * callAsync(id, property, callback) -> 读取属性，运行回调函数并返回 (err, result)
	 */

	/**
	 * 在 Web 视图中异步调用方法或设置属性
	 * @param {*} id
	 * @param {*} method
	 * @param {*} argsOrCallback
	 * @param {*} callback
	 */
	callAsync: function (id, method, argsOrCallback, callback) {
		var cb = callback;
		var args = argsOrCallback;

		if (argsOrCallback instanceof Function && !cb) {
			args = [];
			cb = argsOrCallback;
		}

		if (!(args instanceof Array)) {
			args = [args];
		}

		if (cb) {
			var callId = Math.random();
			webviews.asyncCallbacks[callId] = cb;
		}

		window.ipc.send("callViewMethod", { id: id, callId: callId, method: method, args: args });
	},
};

/**
 * webView 管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日11:31:09
 */
const webviewManagement = {
	/** 占位图像元素 */
	placeholderImg: document.getElementById("webview-placeholder"),
	/** 是否使用单独的标题栏，根据设置模块中的配置决定 */
	hasSeparateTitlebar: settingManagement.get("useSeparateTitlebar"),
	/** 窗口是否处于最大化状态，对Windows上的导航栏高度产生影响 */
	windowIsMaximized: false,
	/** 窗口是否处于全屏状态 */
	windowIsFullscreen: false,

	/**
	 * 捕获当前选项卡的截图
	 * @param {*} options 选项
	 * @returns
	 */
	captureCurrentTab: function (options) {
		// 不要捕获私密选项卡的占位符
		if (window.tabs.get(window.tabs.getSelected()).private) {
			return;
		}

		// 当视图处于隐藏状态时，无法进行捕获
		if (webviews.placeholderRequests.length > 0 && !(options && options.forceCapture === true)) {
			return;
		}

		window.ipc.send("getCapture", {
			id: webviews.selectedId,
			width: Math.round(window.innerWidth / 10),
			height: Math.round(window.innerHeight / 10),
		});
	},

	/**
	 * 当页面URL发生变化时的处理函数
	 * @param {*} tab 选项卡
	 * @param {*} url URL
	 */
	onPageURLChange: function (tab, url) {
		// 如果URL以"https://"、"about:"、"chrome:"或"file://"开头，则将选项卡设置为安全，并更新URL
		if (url.indexOf("https://") === 0 || url.indexOf("about:") === 0 || url.indexOf("chrome:") === 0 || url.indexOf("file://") === 0) {
			window.tabs.update(tab, {
				secure: true,
				url: url,
			});
		} else {
			// 如果URL不满足上述条件，则将选项卡设置为非安全，并更新URL
			window.tabs.update(tab, {
				secure: false,
				url: url,
			});
		}

		// 调用选项卡的异步方法"setVisualZoomLevelLimits"，设置可视缩放级别的范围为1到3
		webviews.callAsync(tab, "setVisualZoomLevelLimits", [1, 3]);
	},

	/**
	 * 处理导航完成事件
	 * @param {*} tabId 选项卡ID
	 * @param {*} url URL
	 * @param {*} isInPlace 是否在当前位置
	 * @param {*} isMainFrame 是否为主框架
	 * @param {*} frameProcessId 框架进程ID
	 * @param {*} frameRoutingId 框架路由ID
	 */
	onNavigate: function (tabId, url, isInPlace, isMainFrame, frameProcessId, frameRoutingId) {
		// 如果是主框架，则调用onPageURLChange函数处理页面URL变化
		if (isMainFrame) {
			webviewManagement.onPageURLChange(tabId, url);
		}
	},

	/**
	 * 处理页面加载完成事件
	 * @param {*} tabId 选项卡ID
	 */
	onPageLoad: function (tabId) {
		// 如果选项卡ID与当前选中的选项卡ID相同，则在短时间后捕获当前选项卡的预览图像
		if (tabId === window.tabs.getSelected()) {
			// 有时页面直到did-finish-load事件发生后的短时间内才变得可见
			setTimeout(function () {
				webviewManagement.captureCurrentTab();
			}, 250);
		}
	},

	/**
	 * 加载时滚动页面到指定位置
	 * @param {*} tabId 选项卡ID
	 * @param {*} scrollPosition 滚动位置
	 */
	scrollOnLoad: function (tabId, scrollPosition) {
		// 定义监听器，处理指定tab加载完成事件
		const listener = function (eTabId) {
			if (eTabId === tabId) {
				// 可滚动内容可能要过一段时间才能可用，
				// 因此尝试滚动几次，但一旦我们成功滚动一次，就停止，以免覆盖后来发生的用户滚动尝试。
				for (let i = 0; i < 3; i++) {
					var done = false;
					setTimeout(function () {
						if (!done) {
							// 执行JavaScript代码，将窗口滚动到指定位置
							webviews.callAsync(
								tabId,
								"executeJavaScript",
								`(function() {
									window.scrollTo(0, ${scrollPosition});
									return window.scrollY === ${scrollPosition};
								})()`,
								function (err, completed) {
									if (!err && completed) {
										done = true;
									}
								}
							);
						}
					}, 750 * i);
				}

				// 解除监听器
				webviews.unbindEvent("did-finish-load", listener);
			}
		};

		// 绑定监听器，处理指定tab加载完成事件
		webviews.bindEvent("did-finish-load", listener);
	},

	/**
	 * 在页面创建时设置静音状态
	 * @param {*} tabId 选项卡ID
	 * @param {*} muted 是否静音
	 */
	setAudioMutedOnCreate: function (tabId, muted) {
		// 定义监听器，处理指定tab导航事件
		const listener = function () {
			// 调用异步方法，在指定的tab上设置音频静音状态
			webviews.callAsync(tabId, "setAudioMuted", muted);

			// 解除监听器
			webviews.unbindEvent("did-navigate", listener);
		};

		// 绑定监听器，处理指定tab导航事件
		webviews.bindEvent("did-navigate", listener);
	},

	/**
	 * 初始化管理模块
	 */
	initialize: function () {
		/**当进入 HTML 全屏模式时，执行操作来更新视图状态并调整大小。 */
		webviews.bindEvent("enter-html-full-screen", function (tabId) {
			// 将指定 tabId 对应的视图标记为进入全屏模式
			webviews.viewFullscreenMap[tabId] = true;

			// 调整视图大小以适应全屏模式
			webviews.resize();
		});

		/**当离开 HTML 全屏模式时，执行操作来更新视图状态并调整大小。 */
		webviews.bindEvent("leave-html-full-screen", function (tabId) {
			// 将指定 tabId 对应的视图标记为离开全屏模式
			webviews.viewFullscreenMap[tabId] = false;

			// 调整视图大小以适应离开全屏模式
			webviews.resize();
		});

		/**绑定事件处理程序到 webviews 的 "did-start-navigation" 事件。 */
		webviews.bindEvent("did-start-navigation", onNavigate);

		/**绑定事件处理程序到 webviews 的 "will-redirect" 事件。 */
		webviews.bindEvent("will-redirect", onNavigate);

		/**绑定事件处理程序到 webviews 的 "did-navigate" 事件，包括页面加载完毕后的回调。 */
		webviews.bindEvent("did-navigate", function (tabId, url, httpResponseCode, httpStatusText) {
			webviewManagement.onPageURLChange(tabId, url);
		});

		/**绑定事件处理程序到 webviews 的 "did-finish-load" 事件。 */
		webviews.bindEvent("did-finish-load", onPageLoad);

		/**绑定事件处理程序到 webviews 的 "page-title-updated" 事件，用于更新页面标题。 */
		webviews.bindEvent("page-title-updated", function (tabId, title, explicitSet) {
			window.tabs.update(tabId, {
				title: title,
			});
		});

		/**绑定事件处理程序到 webviews 的 "did-fail-load" 事件，处理页面加载失败的情况。 */
		webviews.bindEvent("did-fail-load", function (tabId, errorCode, errorDesc, validatedURL, isMainFrame) {
			if (errorCode && errorCode !== -3 && isMainFrame && validatedURL) {
				webviews.update(tabId, webviews.internalPages.error + "?ec=" + encodeURIComponent(errorCode) + "&url=" + encodeURIComponent(validatedURL));
			}
		});

		/**绑定事件处理程序到 webviews 的 "crashed" 事件，处理页面崩溃的情况。 */
		webviews.bindEvent("crashed", function (tabId, isKilled) {
			var url = window.tabs.get(tabId).url;

			window.tabs.update(tabId, {
				url: webviews.internalPages.error + "?ec=crash&url=" + encodeURIComponent(url),
			});

			// 现有进程崩溃，无法重用
			webviews.destroy(tabId);

			webviews.add(tabId);

			if (tabId === window.tabs.getSelected()) {
				webviews.setSelected(tabId);
			}
		});

		/**绑定 IPC（进程间通信）消息处理程序到 webviews，用于获取设置数据。 */
		webviews.bindIPC("getSettingsData", function (tabId, args) {
			if (!urlManagement.isInternalURL(window.tabs.get(tabId).url)) {
				throw new Error();
			}

			webviews.callAsync(tabId, "send", ["receiveSettingsData", settingManagement.list]);
		});

		/**绑定 IPC（进程间通信）消息处理程序到 webviews，用于更新设置数据。 */
		webviews.bindIPC("setSetting", function (tabId, args) {
			// 检查当前 webview 加载的 URL 是否是内部 URL
			if (!urlManagement.isInternalURL(window.tabs.get(tabId).url)) {
				throw new Error();
			}

			// 更新设置数据
			settingManagement.set(args[0].key, args[0].value);
		});

		/**绑定 IPC（进程间通信）消息处理程序到 webviews，更新选项卡的滚动位置数据。 */
		webviews.bindIPC("scroll-position-change", function (tabId, args) {
			// 更新选项卡的滚动位置信息
			window.tabs.update(tabId, {
				scrollPosition: args[0],
			});
		});

		/**监听窗口大小调整事件，并在一定时间内限制函数的调用频率 */
		window.addEventListener(
			"resize",
			window.throttle(function () {
				// 如果有占位请求，表示Web视图已隐藏，不执行resize操作
				if (webviews.placeholderRequests.length > 0) {
					return;
				}

				// 执行Web视图的resize操作
				webviews.resize();
			}, 75)
		);

		/**当离开窗口全屏模式时，执行操作以退出 HTML 全屏模式。 */
		ipc.on("leave-full-screen", function () {
			for (var view in webviews.viewFullscreenMap) {
				// 如果当前视图处于全屏模式
				if (webviews.viewFullscreenMap[view]) {
					// 通过调用webviews.callAsync方法，在相应的视图中执行JavaScript代码"document.exitFullscreen()"，从而退出HTML全屏模式
					webviews.callAsync(view, "executeJavaScript", "document.exitFullscreen()");
				}
			}
		});

		/**当窗口最大化时，执行操作来更新窗口状态并调整视图大小。 */
		ipc.on("maximize", function () {
			// 将窗口标记为最大化
			windowIsMaximized = true;

			// 调整视图大小以适应最大化窗口
			webviews.resize();
		});

		/**当取消最大化窗口时，执行操作来更新窗口状态并调整视图大小。 */
		ipc.on("unmaximize", function () {
			// 将窗口标记为非最大化
			windowIsMaximized = false;

			// 调整视图大小以适应取消最大化窗口
			webviews.resize();
		});

		/**当进入全屏模式时，执行操作来更新窗口状态并调整视图大小。 */
		ipc.on("enter-full-screen", function () {
			// 将窗口标记为进入全屏模式
			windowIsFullscreen = true;

			// 调整视图大小以适应全屏模式
			webviews.resize();
		});

		/**当离开全屏模式时，执行操作来更新窗口状态并调整视图大小。 */
		ipc.on("leave-full-screen", function () {
			// 将窗口标记为离开全屏模式
			windowIsFullscreen = false;

			// 调整视图大小以适应离开全屏模式
			webviews.resize();
		});

		/**处理视图事件 */
		ipc.on("view-event", function (e, args) {
			webviews.emitEvent(args.event, args.tabId, args.args);
		});

		/**处理异步调用结果 */
		ipc.on("async-call-result", function (e, args) {
			webviews.asyncCallbacks[args.callId](args.error, args.result);

			delete webviews.asyncCallbacks[args.callId];
		});

		/**处理视图间的 IPC 通信 */
		ipc.on("view-ipc", function (e, args) {
			// 视图可能在事件发生和在 UI 进程接收到事件之间被销毁
			if (!webviews.hasViewForTab(args.id)) {
				return;
			}

			webviews.IPCEvents.forEach(function (item) {
				if (item.name === args.name) {
					item.fn(args.id, [args.data], args.frameId, args.frameURL);
				}
			});
		});

		/**处理捕获数据消息 */
		ipc.on("captureData", function (e, data) {
			window.tabs.update(data.id, { previewImage: data.url });

			if (data.id === webviews.selectedId && webviews.placeholderRequests.length > 0) {
				webviewManagement.placeholderImg.src = data.url;
				webviewManagement.placeholderImg.hidden = false;
			}
		});

		/**当窗口获得焦点时，将焦点设置到视图上 */
		ipc.on("windowFocus", function () {
			if (webviews.placeholderRequests.length === 0 && document.activeElement.tagName !== "INPUT") {
				webviews.focus();
			}
		});

		/**监听设置变化的事件，并更新所有包含 file:// 开头的 URL 的 webviews 的设置数据。 */
		settingManagement.listen(function () {
			window.tasks.forEach(function (task) {
				task.tabs.forEach(function (tab) {
					if (tab.url.startsWith("file://")) {
						try {
							webviews.callAsync(tab.id, "send", ["receiveSettingsData", settingManagement.list]);
						} catch (e) {
							// webview might not actually exist
						}
					}
				});
			});
		});

		/**每15秒调用一次 captureCurrentTab 函数。 */
		setInterval(function () {
			webviewManagement.captureCurrentTab();
		}, 15000);
	},
};

module.exports = { webviews, webviewManagement };
