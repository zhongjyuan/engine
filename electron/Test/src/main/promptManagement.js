/**
 * 提示管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月15日17:55:19
 */
const promptManagement = {
	/**存储用户的选择结果 */
	promptAnswer: null,

	/**存储提示框的选项 */
	promptOptions: null,

	/**
	 * 创建提示框窗口
	 * @param {*} options 提示框的选项
	 * @param {*} callback 回调函数，用于返回用户的选择结果
	 */
	createPrompt: function (options, callback) {
		/**解构选项对象，获取父窗口、宽度和高度等属性 */
		promptManagement.promptOptions = options;

		const { parent, width = 360, height = 140 } = options;

		/**创建一个 BrowserWindow 对象，用于显示提示框 */
		var promptWindow = new BrowserWindow({
			width: width,
			height: height,
			parent: parent != null ? parent : windowManagement.getCurrentWin(),
			show: false,
			modal: true,
			alwaysOnTop: true,
			title: options.title,
			autoHideMenuBar: true,
			frame: false,
			webPreferences: {
				nodeIntegration: false,
				sandbox: true,
				contextIsolation: true,
				preload: __dirname + "/src/pages/prompt/prompt.js",
			},
		});

		// 在提示框窗口关闭时触发 "closed" 事件，并调用回调函数将用户选择结果作为参数传递给它
		promptWindow.on("closed", () => {
			promptWindow = null;
			callback(promptManagement.promptAnswer);
		});

		// 加载提示框的 HTML 页面
		promptWindow.loadURL("file://" + __dirname + "/src/pages/prompt/index.html");

		// 在窗口准备好显示后展示出来
		promptWindow.once("ready-to-show", () => {
			promptWindow.show();
		});
	},

	/**
	 * 初始化函数
	 */
	initialize: function () {
		// 监听 "show-prompt" 事件，当渲染器进程发送该事件时，调用 createPrompt 函数并传递相关选项和回调函数
		ipc.on("show-prompt", function (options, callback) {
			promptManagement.createPrompt(options, callback);
		});

		// 监听 "open-prompt" 事件，当渲染器进程请求打开提示框时，返回一个包含提示框文本、按钮标签等信息的 JSON 字符串作为返回值。
		ipc.on("open-prompt", function (event) {
			event.returnValue = JSON.stringify({
				label: promptManagement.promptOptions.text,
				ok: promptManagement.promptOptions.ok,
				values: promptManagement.promptOptions.values,
				cancel: promptManagement.promptOptions.cancel,
				darkMode: settingManagement.get("darkMode"),
			});
		});

		// 监听 "close-prompt" 事件，当提示框窗口关闭时，将用户的选择结果保存在 promptAnswer 变量中。
		ipc.on("close-prompt", function (event, data) {
			promptManagement.promptAnswer = data;
		});

		// 监听 "prompt" 事件，当渲染器进程发送该事件时，调用 createPrompt 函数，并将回调函数的结果作为返回值返回给渲染器进程
		ipc.on("prompt", function (event, data) {
			promptManagement.createPrompt(data, function (result) {
				event.returnValue = result;
			});
		});
	},
};

promptManagement.initialize();