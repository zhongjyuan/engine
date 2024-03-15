// 将命令行参数中的键值对存储到globalArgs对象中

// 创建一个空的全局对象globalArgs
window.globalArgs = {};

// 遍历命令行参数数组
process.argv.forEach(function (arg) {
	// 如果该参数以"--"开头，则表示它是一个键值对
	if (arg.startsWith("--")) {
		var key = arg.split("=")[0].replace("--", ""); // 从参数中提取出键名
		var value = arg.split("=")[1]; // 从参数中提取出键值
		globalArgs[key] = value; // 将键值对存储到globalArgs对象中
	}
});

// 导入Node.js模块到渲染进程中

// 导入fs模块（用于文件系统操作）
window.fs = require("fs");

// 导入electron模块（用于与主进程通信）
window.electron = require("electron");

// 导入electron模块中的clipboard对象（用于访问剪贴板功能）
window.clipboard = require("electron").clipboard;

// 导入EventEmitter模块（用于事件处理）
window.EventEmitter = require("events");

// 将ipcRenderer对象存储到全局变量ipc中
window.ipc = electron.ipcRenderer;

/**当前操作系统是否为 macOS */
window.isMac = process.platform === "darwin";

/**当前操作系统是否为 Windows */
window.isWindows = process.platform === "win32";

// 获取窗口唯一标识
window.windowId = window.globalArgs["window-id"];

// 根据操作系统类型向页面添加不同的类名，以便样式可以根据不同的操作系统进行调整

/**小写用户代理字符串 */
var userAgent = navigator.userAgent.toLowerCase();

// 如果用户代理字符串中包含"mac"
if (userAgent.includes("mac")) {
	window.platformType = "mac"; // 将platformType变量设置为"mac"
	document.body.classList.add("mac"); // 向body元素添加.mac类名
}

// 如果用户代理字符串中包含"win"
else if (userAgent.includes("win")) {
	window.platformType = "windows"; // 将platformType变量设置为"windows"
	document.body.classList.add("windows"); // 向body元素添加.windows类名
}

// 其他情况（例如Linux）
else {
	window.platformType = "linux"; // 将platformType变量设置为"linux"
	document.body.classList.add("linux"); // 向body元素添加.linux类名
}

// 如果当前设备支持触摸屏，则向页面添加.touch类
if (navigator.maxTouchPoints > 0) {
	document.body.classList.add("touch"); // 向body元素添加.touch类名
}

// 当进入全屏模式时，向body元素添加.fullscreen类
window.ipc.on("enter-full-screen", function () {
	document.body.classList.add("fullscreen");
});

// 当退出全屏模式时，从body元素移除.fullscreen类
window.ipc.on("leave-full-screen", function () {
	document.body.classList.remove("fullscreen");
});

// 当窗口最大化时，向body元素添加.maximized类
window.ipc.on("maximize", function () {
	document.body.classList.add("maximized");
});

// 当窗口取消最大化时，从body元素移除.maximized类
window.ipc.on("unmaximize", function () {
	document.body.classList.remove("maximized");
});

// 向body元素添加.focused类
document.body.classList.add("focused");

// 当窗口获得焦点时，向body元素添加.focused类
window.ipc.on("focus", function () {
	document.body.classList.add("focused");
});

// 当窗口失去焦点时，从body元素移除.focused类
window.ipc.on("blur", function () {
	document.body.classList.remove("focused");
});

/**
 * 函数节流的实现
 *
 * @param {*} fn 需要节流的函数
 * @param {*} threshhold 节流时间（单位为毫秒），默认值为250毫秒
 * @param {*} scope 函数执行的上下文对象（即this指向的对象），如果不传递该参数，默认值为undefined
 * @returns 返回一个新的函数，该函数实现了节流的功能
 */
window.throttle = function (fn, threshhold, scope) {
	// 如果threshhold参数没有传递，则默认为250毫秒
	threshhold || (threshhold = 250);

	// 定义两个变量：last和deferTimer
	var last, deferTimer;

	// 返回一个新的函数
	return function () {
		// 定义context变量，它表示函数执行的上下文对象
		var context = scope || this;

		// 获取当前时间
		var now = +new Date();

		// 获取函数的参数列表
		var args = arguments;

		// 如果距离上一次执行fn函数的时间小于threshhold，则延迟执行fn函数
		if (last && now < last + threshhold) {
			// 取消之前设置的定时器
			clearTimeout(deferTimer);

			// 设置一个新的定时器，在threshhold毫秒后执行fn函数
			deferTimer = setTimeout(function () {
				last = now;
				fn.apply(context, args);
			}, threshhold);
		} else {
			// 否则立即执行fn函数
			last = now;
			fn.apply(context, args);
		}
	};
};

/**
 * 函数防抖的实现
 *
 * @param {*} fn 需要防抖的函数
 * @param {*} delay 防抖时间（单位为毫秒）
 * @returns 返回一个新的函数，该函数实现了防抖的功能
 */
window.debounce = function (fn, delay) {
	// 定义一个变量timer，用于存储定时器的ID
	var timer = null;

	// 返回一个新函数
	return function () {
		// 获取函数执行的上下文对象和参数列表
		var context = this;
		var args = arguments;

		// 清除之前设置的定时器
		clearTimeout(timer);

		// 设置一个新的定时器，在delay毫秒后执行fn函数
		timer = setTimeout(function () {
			fn.apply(context, args);
		}, delay);
	};
};

/**
 * 清空指定节点的所有子元素
 *
 * @param {*} node 需要清空子元素的节点
 */
window.empty = function (node) {
	// 定义一个变量n，用于存储需要删除的子元素
	var n;

	// 使用循环删除节点的第一个子元素，直到没有子元素为止
	while ((n = node.firstElementChild)) {
		node.removeChild(n);
	}
};

/**
 * 监听页面加载完成事件
 */
window.addEventListener("load", function () {
	/**鼠标是否按下 */
	var isMouseDown = false;
	/**是否正在拖拽 */
	var isDragging = false;
	/**鼠标移动距离 */
	var distance = 0;

	/**鼠标按下事件处理函数 */
	document.body.addEventListener("mousedown", function () {
		isMouseDown = true;
		isDragging = false;
		distance = 0;
	});

	/**鼠标松开事件处理函数 */
	document.body.addEventListener("mouseup", function () {
		isMouseDown = false;
	});

	/**获取所有窗口拖拽手柄元素 */
	var dragHandles = document.getElementsByClassName("windowDragHandle");

	/**
	 * 遍历拖拽手柄元素，添加鼠标移动事件处理函数
	 */
	for (var i = 0; i < dragHandles.length; i++) {
		dragHandles[i].addEventListener("mousemove", function (e) {
			/**如果鼠标按下，则表示正在拖拽 */
			if (isMouseDown) {
				isDragging = true;
				/**加鼠标移动距离 */
				distance += Math.abs(e.movementX) + Math.abs(e.movementY);
			}
		});
	}

	/**点击事件处理函数 */
	document.body.addEventListener(
		"click",
		function (e) {
			/**
			 * 如果正在拖拽并且移动距离超过阈值，则阻止事件传播
			 */
			if (isDragging && distance >= 10.0) {
				e.stopImmediatePropagation();
				isDragging = false;
			}
		},
		true
	);
});

// 初始化标签状态
require("tabManagement.js").initialize();
// 初始化窗口同步
require("tab/windowSync.js").initialize();
// 初始化窗口控制
require("windowControls.js").initialize();

// 初始化导航栏菜单按钮
require("navbar/menuButton.js").initialize();
// 初始化导航栏新增标签按钮
require("navbar/addTabButton.js").initialize();
// 初始化导航栏导航按钮
require("navbar/navigationButton.js").initialize();

// 初始化导航栏标签活动状态
require("navbar/tabActivityManagement.js").initialize();
// 初始化导航栏标签颜色
require("navbar/tabColorManagement.js").initialize();

// 初始化下载管理
require("downloadManagement.js").initialize();
// 初始化 Web 视图菜单
require("webviewMenuManagement.js").initialize();
// 初始化上下文菜单
require("contextMenuManagement.js").initialize();
// 初始化菜单渲染器
require("webviewMenuControls").initialize();
// 初始化默认键绑定
require("keyboardBindingControls").initialize();
// 初始化 PDF 阅读器
require("pdfViewer.js").initialize();
// 初始化自动填充设置
require("autofillSetup.js").initialize();

// 初始化密码管理器
require("password/passwordFactory.js").initialize();
// 初始化密码捕获
require("password/passwordCapture.js").initialize();
// 初始化密码查看器
require("password/passwordViewer.js").initialize();

// 初始化主题设置
require("utils/themeManagement.js").initialize();

// 初始化用户脚本
require("scriptManagement.js").initialize();
// 初始化统计信息
require("statisticalManagement.js").initialize();

// 初始化任务覆盖层
require("taskOverlay/taskOverlayManagement.js").initialize();

// 初始化页面翻译
require("pageTranslations.js").initialize();
// 初始化会话恢复
require("sessionManagement.js").initialize();
// 初始化书签转换
require("bookmarkManagement.js").initialize();
// 初始化新标签页
require("pageNewTab.js").initialize();
// 初始化 Mac Handoff
require("macHandoff.js").initialize();

// 默认搜索栏插件

// 初始化地点搜索插件
require("searchbar/plugins/places.js").initialize();
// 初始化即时答案插件
require("searchbar/plugins/instantAnswer.js").initialize();
// 初始化打开的标签页搜索插件
require("searchbar/plugins/searchOpenTabs.js").initialize();
// 初始化 Bangs 插件
require("searchbar/plugins/bangs.js").initialize();
// 初始化自定义 Bangs
require("searchbar/bangPluginManagement.js").initialize();
// 初始化搜索建议插件
require("searchbar/plugins/searchSuggestions.js").initialize();
// 初始化地点建议插件
require("searchbar/plugins/placeSuggestions.js").initialize();
// 初始化更新通知
require("searchbar/plugins/updateNotifications.js").initialize();
// 初始化恢复任务插件
require("searchbar/plugins/restoreTask.js").initialize();
// 初始化书签管理器
require("searchbar/bookmarkManagement.js").initialize();
// 初始化历史记录查看器
require("searchbar/historyManagement.js").initialize();
// 初始化开发模式通知
require("searchbar/plugins/developmentNotification.js").initialize();
// 初始化快捷按钮
require("searchbar/plugins/shortcutButtons.js").initialize();
// 初始化计算器插件
require("searchbar/plugins/calculator.js").initialize();

// 所有内容加载完成后，启动会话恢复
require("sessionManagement.js").restore();
