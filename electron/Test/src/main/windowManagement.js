/**当前操作系统是否为 macOS */
const isMac = process.platform === "darwin";

/**当前操作系统是否为 Windows */
const isWindows = process.platform === "win32";

/**应用程序是否在开发模式 */
const isDevelopmentMode = process.argv.some((arg) => arg === "--development-mode");

/**是否处于焦点模式 */
var isFocusMode = false;

/**应用程序是否已准备就绪 */
var appIsReady = false;

/**
 * 窗体管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月14日17:07:30
 */
const windowManagement = {
	/**
	 * 下一个窗口ID
	 */
	nextId: 1,

	/**
	 * 窗体数组
	 */
	windows: [],

	/**
	 * 是否已经创建过串口
	 */
	hasEverCreatedWindow: false,

	/**
	 * 获取所有打开的窗口
	 * @returns {Array} 包含所有未关闭窗口的数组
	 */
	getOpenWins: function () {
		// 使用过滤器筛选出未关闭的窗口，并使用映射函数返回窗口对象
		return windowManagement.windows.filter((window) => !window.closed).map((window) => window.win);
	},

	/**
	 * 获取当前窗口对象
	 * @returns {BrowserWindow|null} 当前窗口对象，如果不存在则返回 null
	 */
	getCurrentWin: function () {
		// 过滤掉已关闭的窗口并根据最后聚焦时间排序，获取最后聚焦的窗口对象
		const lastFocused = windowManagement.windows.filter((window) => !window.closed).sort((a, b) => b.state.lastFocused - a.state.lastFocused)[0];

		// 如果最后聚焦的窗口存在，则返回该窗口对象
		if (lastFocused) {
			return lastFocused.win;
		}

		// 如果最后聚焦的窗口不存在，则返回 null
		else {
			return null;
		}
	},

	/**
	 * 根据 webContents 对象获取窗体对象
	 * @param {Electron.WebContents} webContents - 要获取窗口的 webContents 对象
	 * @returns {Window|null} 包含指定 webContents 的窗体对象，如果不存在则返回 null
	 */
	getWindow: function (webContents) {
		// 使用数组的 find() 方法查找包含指定 webContents 的窗口对象
		return windowManagement.windows.find((window) => window.win.webContents.id === webContents.id);
	},

	/**
	 * 获取指定窗体的状态对象
	 * @param {BrowserWindow} win - 要获取状态的窗口对象
	 * @returns {Object|null} 包含指定窗体状态的对象，如果窗体不存在则返回 null
	 */
	getWindowState: function (win) {
		// 使用数组的 find() 方法查找包含指定窗口对象的窗口，并返回其状态对象
		return windowManagement.windows.find((window) => window.win === win).state;
	},

	/**
	 * 添加窗口对象到管理器中
	 * @param {BrowserWindow} win - 要添加的窗口对象
	 */
	addWin: function (win) {
		// 将标志设置为 true，表示已经创建过窗口
		windowManagement.hasEverCreatedWindow = true;

		// 将窗口对象添加到窗口管理器的数组中，包括唯一的标识符和状态对象
		windowManagement.windows.push({
			id: windowManagement.nextId.toString(),
			win: win,
			state: {},
		});

		// 在窗口获取焦点时更新最后获取焦点的时间戳
		win.on("focus", function () {
			windowManagement.getWindowState(win).lastFocused = Date.now();
		});

		// 在窗口关闭时处理一些清理工作
		win.on("close", function () {
			// 如果窗口仍然有附加的 BrowserView，手动将其移除，以便管理器可以自行处理
			win.setBrowserView(null);

			// 标记窗口为已关闭
			windowManagement.windows.find((window) => window.win === win).closed = true;
		});

		// 在窗口关闭后从窗口管理器中移除该窗口
		win.on("closed", function () {
			windowManagement.removeWin(win);

			// 如果没有其他窗口且不是在 macOS 上运行，则退出应用程序
			if (windowManagement.windows.length === 0 && !isMac) {
				app.quit();
			}
		});

		// 更新下一个窗口标识符
		windowManagement.nextId++;
	},

	/**
	 * 从管理器中移除窗口对象
	 * @param {BrowserWindow} win - 要移除的窗口对象
	 */
	removeWin: function (win) {
		// 使用 findIndex() 方法找到包含指定窗口对象的窗口在数组中的索引，并使用 splice() 方法将其从数组中移除
		windowManagement.windows.splice(
			windowManagement.windows.findIndex((window) => window.win === win),
			1
		);

		// 当所有窗口都关闭时，执行 BrowserView 的卸载操作
		if (windowManagement.windows.length === 0) {
			// src\main\viewManager.js
			viewManagement.destroyAllViews();
		}
	},
};