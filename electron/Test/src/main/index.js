/**文件系统模块，用于文件操作 */
const fs = require("fs");

/**路径模块，用于处理文件路径 */
const path = require("path");

/**Electron 模块 */
const electron = require("electron");

const {
	app, // 控制应用程序生命周期的模块
	protocol, // 控制协议处理的模块
	BrowserView,
	BrowserWindow, // 创建原生浏览器窗口的模块
	webContents, // 网页内容模块
	session, // 会话管理模块
	ipcMain: ipc, // 主进程与渲染进程之间进行通信的模块
	Menu, // 菜单模块
	MenuItem, // 菜单项模块
	crashReporter, // 崩溃报告模块
	dialog, // 对话框模块
	nativeTheme, // 原生主题模块
	shell, // 执行外部命令和打开外部链接的模块
} = electron;

// 配置崩溃报告功能
crashReporter.start({
	submitURL: "https://zhongjyuan.net", // 崩溃报告提交的 URL 地址
	uploadToServer: false, // 是否将崩溃报告上传到服务器，这里设置为 false，即不上传
	compress: true, // 是否压缩崩溃报告文件，这里设置为 true，即压缩
});

// 检查命令行参数是否包含 "-v" 或 "--version"
if (process.argv.some((arg) => arg === "-v" || arg === "--version")) {
	// 输出应用程序的名称和版本信息
	console.log(app.getName() + ": " + app.getVersion());
	console.log("Chromium: " + process.versions.chrome);

	// 退出应用程序
	process.exit();
}

/**安装程序是否正在运行 */
let isInstallerRunning = false;

/**
 * 将一个数值限制在指定的范围内。
 * @param {number} n - 需要被限制的数值。
 * @param {number} min - 限制的最小值。
 * @param {number} max - 限制的最大值。
 * @returns {number} - 被限制在指定范围内的数值。
 */
function clamp(n, min, max) {
	return Math.max(Math.min(n, max), min);
}

// 检查当前操作系统是否为 Windows
if (isWindows) {
	// 使用异步函数立即执行函数来处理 Windows 平台的特定逻辑
	(async function () {
		/**获取 Squirrel 安装程序命令 */
		var squirrelCommand = process.argv[1];

		// 如果是安装或更新命令，则设置安装程序正在运行，并执行注册表安装
		if (squirrelCommand === "--squirrel-install" || squirrelCommand === "--squirrel-updated") {
			// 标识安装程序正在运行
			isInstallerRunning = true;

			// 调用注册表安装函数
			await regeditManagement.install();
		}

		// 如果是卸载命令，则设置安装程序正在运行，并执行注册表卸载
		if (squirrelCommand === "--squirrel-uninstall") {
			// 标识安装程序正在运行
			isInstallerRunning = true;

			// 调用注册表卸载函数
			await regeditManagement.uninstall();
		}

		// 如果是启动命令，则退出应用程序
		if (require("electron-squirrel-startup")) {
			app.quit();
		}
	})();
}

// 如果是开发模式
if (isDevelopmentMode) {
	// 获取当前应用程序的用户数据路径，并在路径末尾添加 '-development'
	app.setPath("userData", app.getPath("userData") + "-development");
}

// 解决 Electron 应用程序在聚焦时出现闪烁的问题
app.commandLine.appendSwitch("disable-backgrounding-occluded-windows", "true");

/**应用程序的用户数据路径 */
var userDataPath = app.getPath("userData");

/**首页页面路径 */
const indexPage = "file://" + __dirname + "/index.html";

/**placesService 页面路径 */
const placesServicePage = "file://" + __dirname + "/src/render/places/placesService.html";

/**placesService 窗体对象 */
let placesServiceWindow = null;

/**主菜单 */
var mainMenu = null;
/**辅助菜单 */
var secondaryMenu = null;

/**是否为首个实例 */
const isFirstInstance = app.requestSingleInstanceLock();

// 如果当前不是首个应用程序实例，则退出应用程序
if (!isFirstInstance) {
	app.quit();
	
	process.exit();
}

/**
 * 保存窗口位置和大小信息到用户数据路径中的文件
 */
var saveWindowBounds = function () {
	// 检查当前是否存在窗口实例
	if (windowManagement.getCurrentWin()) {
		// 获取当前窗口的位置和大小信息，并标记是否处于最大化状态
		var bounds = Object.assign(windowManagement.getCurrentWin().getBounds(), {
			maximized: windowManagement.getCurrentWin().isMaximized(),
		});

		// 将窗口位置和大小信息以JSON格式写入到用户数据路径中的文件“windowBounds.json”中
		fs.writeFileSync(path.join(userDataPath, "windowBounds.json"), JSON.stringify(bounds));
	}
};

/**
 * 创建一个窗口，并根据先前的窗口位置信息设置窗口的位置和大小。
 * @returns {Electron.BrowserWindow} - 创建的窗口对象。
 */
function createWindow() {
	var bounds;

	try {
		// 读取存储的窗口位置信息
		var data = fs.readFileSync(path.join(userDataPath, "windowBounds.json"), "utf-8");
		bounds = JSON.parse(data);
	} catch (e) {}

	if (!bounds) {
		// 如果未找到窗口位置信息文件，则使用默认窗口位置（全屏）
		var size = electron.screen.getPrimaryDisplay().workAreaSize;
		bounds = {
			x: 0,
			y: 0,
			width: size.width,
			height: size.height,
			maximized: true,
		};
	}

	// 获取当前活动的屏幕，并调整窗口位置使其适应屏幕
	/**当前活动的屏幕 */
	var containingRect = electron.screen.getDisplayMatching(bounds).workArea;

	// 确保窗口位置在可见区域内
	bounds = {
		x: clamp(bounds.x, containingRect.x, containingRect.x + containingRect.width - bounds.width),
		y: clamp(bounds.y, containingRect.y, containingRect.y + containingRect.height - bounds.height),
		width: clamp(bounds.width, 0, containingRect.width),
		height: clamp(bounds.height, 0, containingRect.height),
		maximized: bounds.maximized,
	};

	// 使用调整后的位置信息创建窗口
	return createWindowWithBounds(bounds);
}

/**
 * 创建具有给定边界的窗口
 * @param {Object} bounds - 窗口边界参数
 * @returns {BrowserWindow} - 创建的窗口实例
 */
function createWindowWithBounds(bounds) {
	/**新的BrowserWindow实例 */
	const newWin = new BrowserWindow({
		width: bounds.width, // 窗口宽度
		height: bounds.height, // 窗口高度
		x: bounds.x, // 窗口相对于屏幕左上角的x坐标
		y: bounds.y, // 窗口相对于屏幕左上角的y坐标
		minWidth: isWindows ? 400 : 320, // 窗口的最小宽度
		minHeight: 350, // 窗口的最小高度
		titleBarStyle: settingManagement.get("useSeparateTitlebar") ? "default" : "hidden", // 标题栏样式
		trafficLightPosition: { x: 12, y: 10 }, // macOS上按钮位置
		icon: __dirname + "/favicon.ico", // 窗口图标
		frame: settingManagement.get("useSeparateTitlebar"), // 是否显示窗口边框
		alwaysOnTop: settingManagement.get("windowAlwaysOnTop"), // 窗口是否始终在最顶层
		backgroundColor: "#fff", // 窗口背景颜色
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			nodeIntegrationInWorker: true, // ProcessSpawner使用
			additionalArguments: [
				"--user-data-path=" + userDataPath, // 用户数据存储路径
				"--app-version=" + app.getVersion(), // 应用程序版本
				"--app-name=" + app.getName(), // 应用程序名称
				"--window-id=" + windowManagement.nextId, // 窗口ID
				...(isDevelopmentMode ? ["--development-mode"] : []), // 是否开发模式
				...(windowManagement.getOpenWins().length === 0 ? ["--initial-window"] : []), // 是否初始窗口
				...(windowManagement.hasEverCreatedWindow ? [] : ["--launch-window"]), // 是否启动窗口
			],
		},
	});

	// 在Windows和Linux上，总是使用左上角的菜单按钮
	// 如果设置了frame：false，则不会产生任何效果，但在Linux上如果启用了"use separate titlebar"，则会应用此设置
	if (!isMac) {
		newWin.setMenuBarVisibility(false);
	}

	// 加载应用程序的index.html文件
	newWin.loadURL(indexPage);

	// 如果窗口被最大化，则最大化窗口
	if (bounds.maximized) {
		newWin.maximize();

		newWin.webContents.once("did-finish-load", function () {
			sendIPCToWindow(newWin, "maximize");
		});
	}

	newWin.on("close", function () {
		// 保存窗口大小以便下次启动应用程序时使用
		saveWindowBounds();
	});

	// 窗口获得焦点时触发
	newWin.on("focus", function () {
		if (!windowManagement.getWindowState(newWin).isMinimized) {
			sendIPCToWindow(newWin, "windowFocus");
		}
	});

	// 最小化窗口时触发
	newWin.on("minimize", function () {
		sendIPCToWindow(newWin, "minimize");
		windowManagement.getWindowState(newWin).isMinimized = true;
	});

	// 恢复窗口时触发
	newWin.on("restore", function () {
		windowManagement.getWindowState(newWin).isMinimized = false;
	});

	// 最大化窗口时触发
	newWin.on("maximize", function () {
		sendIPCToWindow(newWin, "maximize");
	});

	// 取消最大化窗口时触发
	newWin.on("unmaximize", function () {
		sendIPCToWindow(newWin, "unmaximize");
	});

	// 窗口获得焦点时触发
	newWin.on("focus", function () {
		sendIPCToWindow(newWin, "focus");
	});

	// 窗口失去焦点时触发
	newWin.on("blur", function () {
		// 如果该窗口的开发工具处于焦点状态，则此检查将返回false，我们将保持窗口上的focused类
		if (BrowserWindow.getFocusedWindow() !== newWin) {
			sendIPCToWindow(newWin, "blur");
		}
	});

	// 进入全屏模式时触发
	newWin.on("enter-full-screen", function () {
		sendIPCToWindow(newWin, "enter-full-screen");
	});

	// 离开全屏模式时触发
	newWin.on("leave-full-screen", function () {
		sendIPCToWindow(newWin, "leave-full-screen");
		newWin.setMenuBarVisibility(false);
	});

	// 进入HTML全屏模式时触发
	newWin.on("enter-html-full-screen", function () {
		sendIPCToWindow(newWin, "enter-html-full-screen");
	});

	// 离开HTML全屏模式时触发
	newWin.on("leave-html-full-screen", function () {
		sendIPCToWindow(newWin, "leave-html-full-screen");
		newWin.setMenuBarVisibility(false);
	});

	/*
	 * 处理鼠标按钮事件
	 * 在macOS上不支持，在Linux上已经有默认处理程序，
	 * 因此注册处理程序会导致事件发生两次。
	 * 参见：https://github.com/electron/electron/issues/18322
	 */
	if (isWindows) {
		newWin.on("app-command", function (e, command) {
			if (command === "browser-backward") {
				sendIPCToWindow(newWin, "goBack");
			} else if (command === "browser-forward") {
				sendIPCToWindow(newWin, "goForward");
			}
		});
	}

	// 阻止通过拖放加载远程页面，以防止远程页面具有Node访问权限
	newWin.webContents.on("will-navigate", function (e, url) {
		if (url !== indexPage) {
			e.preventDefault();
		}
	});

	// 设置触摸栏
	newWin.setTouchBar(touchBarManagement.build());

	// 添加窗口到管理器并返回
	windowManagement.addWin(newWin);

	return newWin;
}

/**
 * 向窗口发送 IPC 消息。
 * @param {Electron.BrowserWindow} win - 目标窗口对象。
 * @param {string} action - 要发送的消息动作。
 * @param {*} data - 要发送的数据。
 * @returns {void}
 */
function sendIPCToWindow(win, action, data) {
	// 检查窗口是否已被销毁，如果是则忽略该消息
	if (win && win.isDestroyed()) {
		console.warn("ignoring message " + action + " sent to destroyed win");
		return;
	}

	// 检查窗口是否存在并且正在加载主框架
	if (win && win.webContents && win.webContents.isLoadingMainFrame()) {
		// 在 did-finish-load 事件之后的短暂时间内，isLoading 仍然可能为 true，
		// 因此等待一段时间来确认页面确实正在加载
		setTimeout(function () {
			if (win.webContents.isLoadingMainFrame()) {
				win.webContents.once("did-finish-load", function () {
					win.webContents.send(action, data || {});
				});
			} else {
				win.webContents.send(action, data || {});
			}
		}, 0);
	}

	// 如果窗口存在，则直接发送 IPC 消息
	else if (win) {
		win.webContents.send(action, data || {});
	}

	// 如果窗口不存在，则创建一个新窗口，并在新窗口加载完成后发送 IPC 消息
	else {
		var win = createWindow();
		win.webContents.once("did-finish-load", function () {
			win.webContents.send(action, data || {});
		});
	}
}

/**
 * 在当前窗口中打开一个新标签页。
 * @param {string} url - 要打开的 URL。
 * @returns {void}
 */
function openTabInWindow(url) {
	sendIPCToWindow(windowManagement.getCurrentWin(), "addTab", {
		url: url,
	});
}

/**
 * 处理命令行参数，并在当前窗口中执行相应操作。
 * @param {Array<string>} argv - 命令行参数数组。
 * @returns {void}
 */
function handleCommandLineArguments(argv) {
	// 必须先发生 "ready" 事件，才能使用该函数

	if (argv) {
		argv.forEach(function (arg, idx) {
			if (arg && arg.toLowerCase() !== __dirname.toLowerCase()) {
				// URL
				if (arg.indexOf("://") !== -1) {
					sendIPCToWindow(windowManagement.getCurrentWin(), "addTab", {
						url: arg,
					});
				}

				// 搜索
				else if (idx > 0 && argv[idx - 1] === "-s") {
					sendIPCToWindow(windowManagement.getCurrentWin(), "addTab", {
						url: arg,
					});
				}

				// 本地文件 (.html, .mht, mhtml, .pdf)
				else if (/\.(m?ht(ml)?|pdf)$/.test(arg) && fs.existsSync(arg)) {
					sendIPCToWindow(windowManagement.getCurrentWin(), "addTab", {
						url: "file://" + path.resolve(arg),
					});
				}
			}
		});
	}
}

// 在 Electron 应用程序准备就绪后执行一次
app.once("ready", function () {
	// 创建一个 BrowserWindow 实例，配置窗口的大小、显示状态和 webPreferences
	placesServiceWindow = new BrowserWindow({
		width: 300,
		height: 300,
		show: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	// 加载 placesServicePage 的 URL
	placesServiceWindow.loadURL(placesServicePage);
});

// 当 Electron 应用程序准备就绪时，执行回调函数
app.on("ready", function () {
	appIsReady = true; // 标记应用程序已准备就绪
	settingManagement.set("restartNow", false); // 设置重启标志为false

	// 如果正在运行安装程序，则不显示任何内容
	if (isInstallerRunning) {
		return;
	}

	// 创建新的窗口(index.html)
	const newWin = createWindow();

	// 当页面加载完成时执行回调
	newWin.webContents.on("did-finish-load", function () {
		// 如果作为默认浏览器在 Linux 上传递了 URL 作为命令行参数，则打开该 URL
		handleCommandLineArguments(process.argv);

		// 如果存在来自 "open-url" 事件的 URL（在 Mac 上）
		if (global.URLToOpen) {
			// 如果之前设置了要打开的 URL（可能是从 macOS 上打开链接），则打开它
			sendIPCToWindow(newWin, "addTab", {
				url: global.URLToOpen,
			});

			global.URLToOpen = null;
		}
	});

	// 构建应用程序菜单
	mainMenu = menuManagement.buildAppMenu();

	// 设置应用程序菜单
	Menu.setApplicationMenu(mainMenu);

	// 创建 Dock 菜单
	menuManagement.createDockMenu();
});

// 当应用程序接收到 "open-url" 事件时执行回调函数
app.on("open-url", function (e, url) {
	if (appIsReady) {
		// 如果应用程序已准备就绪，则向当前窗口发送 IPC 消息，添加一个新标签页并加载指定的 URL
		sendIPCToWindow(windowManagement.getCurrentWin(), "addTab", {
			url: url,
		});
	} else {
		global.URLToOpen = url; // 否则将接收到的 URL 存储在全局变量中，稍后在 createWindow 回调中处理
	}
});

// 在 macOS 上支持 Handoff 功能
app.on("continue-activity", function (e, type, userInfo, details) {
	// 检查事件类型是否为 'NSUserActivityTypeBrowsingWeb' 并且存在 web 页面 URL
	if (type === "NSUserActivityTypeBrowsingWeb" && details.webpageURL) {
		e.preventDefault(); // 防止默认操作

		// 向当前窗口发送 IPC 消息，添加一个新标签页并加载指定的 URL
		sendIPCToWindow(windowManagement.getCurrentWin(), "addTab", {
			url: details.webpageURL,
		});
	}
});

// 处理应用程序的第二个实例
app.on("second-instance", function (e, argv, workingDir) {
	// 检测当前是否存在窗口实例
	if (windowManagement.getCurrentWin()) {
		// 检测当前窗口是否最小化
		if (windowManagement.getCurrentWin().isMinimized()) {
			// 如果最小化，则恢复窗口
			windowManagement.getCurrentWin().restore();
		}

		windowManagement.getCurrentWin().focus(); // 让窗口获得焦点

		// 使用新的 URL 添加一个标签页
		handleCommandLineArguments(argv); // 处理命令行参数
	}
});

/**
 * 当应用程序被激活时触发，通常是当用户点击应用程序的 Dock 图标时发生。
 * https://github.com/electron/electron/blob/master/docs/api/app.md#event-activate-os-x
 *
 * 在所有标签页都关闭且最小化时，通过单击应用程序 Dock 图标打开一个新标签页。
 */
app.on("activate", function (/* e, hasVisibleWindows */) {
	// 如果没有窗口实例且应用程序已准备好，则打开一个新窗口
	if (!windowManagement.getCurrentWin() && appIsReady) {
		createWindow();
	}
});

// 监听名为 'focusMainWebContents' 的主进程 IPC 事件
ipc.on("focusMainWebContents", function () {
	// 获取当前窗口的 webContents，并让其获得焦点
	windowManagement.getCurrentWin().webContents.focus();
});

// 监听名为 'showSecondaryMenu' 的主进程 IPC 事件
ipc.on("showSecondaryMenu", function (event, data) {
	// 如果 secondaryMenu 不存在，则构建一个带有 secondary 标记的应用菜单
	if (!secondaryMenu) {
		secondaryMenu = menuManagement.buildAppMenu({ secondary: true });
	}

	// 弹出 secondaryMenu 菜单，并指定位置为 data.x, data.y
	secondaryMenu.popup({
		x: data.x,
		y: data.y,
	});
});

// 监听名为 'handoffUpdate' 的主进程 IPC 事件
ipc.on("handoffUpdate", function (e, data) {
	// 如果 app.setUserActivity 存在，并且传入的数据中包含有效的 URL（以 'http' 开头）
	if (app.setUserActivity && data.url && data.url.startsWith("http")) {
		// 设置用户活动类型为 'NSUserActivityTypeBrowsingWeb'，并指定 URL
		app.setUserActivity("NSUserActivityTypeBrowsingWeb", {}, data.url);
	}

	// 否则，如果 app.invalidateCurrentActivity 存在
	else if (app.invalidateCurrentActivity) {
		// 使当前用户活动无效
		app.invalidateCurrentActivity();
	}
});

// 监听名为 'quit' 的主进程 IPC 事件
ipc.on("quit", function () {
	// 调用 app.quit() 方法退出应用程序
	app.quit();
});

// 监听名为 'tab-state-change' 的主进程 IPC 事件
ipc.on("tab-state-change", function (e, events) {
	// 获取所有窗口，并对每个窗口执行以下操作
	windowManagement.getOpenWins().forEach(function (win) {
		// 如果窗口中的 webContents 的 ID 不等于事件发送者的 ID
		if (win.webContents.id !== e.sender.id) {
			// 向窗口中的 webContents 发送 'tab-state-change-receive' IPC 事件，并传递以下数据
			win.webContents.send("tab-state-change-receive", {
				// 来源窗口的 ID，即发送 'tab-state-change' 事件的窗口 ID
				sourceWindowId: windowManagement.getWindow(e.sender).id,
				// 事件数据，即传入 'tab-state-change' 事件的第二个参数
				events,
			});
		}
	});
});

// 监听名为 'request-tab-state' 的主进程 IPC 事件
ipc.on("request-tab-state", function (e) {
	// 查找除了发送者之外的所有窗口
	const otherWindow = windowManagement.getOpenWins().find((w) => w.webContents.id !== e.sender.id);

	// 如果没有其他窗口存在
	if (!otherWindow) {
		// 抛出错误，指示未找到作为标签状态源的次要窗口
		throw new Error("secondary window doesn't exist as source for tab state");
	}

	// 一次性监听名为 'return-tab-state' 的 IPC 事件
	ipc.once("return-tab-state", function (e2, data) {
		// 将接收到的数据设置为返回值
		e.returnValue = data;
	});

	// 向其他窗口的 webContents 发送 'read-tab-state' IPC 事件
	otherWindow.webContents.send("read-tab-state");
});

// 监听名为 'places-request' 的 IPC 事件
ipc.on("places-request", function (e, data) {
	// 向 placesServiceWindow 的 webContents 发送 'places-request' IPC 事件，并传递发送者的 ID 和数据
	placesServiceWindow.webContents.send("places-request", e.sender.id, data);
});