const { webviews } = require("./webviewManagement.js");

/**
 * webview 手势管理对象(用于处理webview手势)
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日11:16:07
 */
const webviewGestureManagement = {
	/**重置滑动手势距离的定时器ID */
	swipeGestureDistanceResetTimeout: -1,
	/**重置滚动手势距离的定时器ID */
	swipeGestureScrollResetTimeout: -1,
	/**低速滑动手势的定时器ID */
	swipeGestureLowVelocityTimeout: -1,
	/**手势完成前的延迟时间（毫秒） */
	swipeGestureDelay: 100,
	/**滚动手势完成前的延迟时间（毫秒） */
	swipeGestureScrollDelay: 750,
	/**手势被视为几乎完成之前允许经过的时间（毫秒） */
	swipeGestureVelocityDelay: 70,

	/**鼠标在水平方向上的移动距离 */
	horizontalMouseMove: 0,
	/**鼠标在垂直方向上的移动距离 */
	verticalMouseMove: 0,

	/**鼠标向左滑动的移动距离 */
	leftMouseMove: 0,
	/**鼠标向右滑动的移动距离 */
	rightMouseMove: 0,

	/**开始滚动时左侧的滚动位置 */
	beginningScrollLeft: null,
	/**开始滚动时右侧的滚动位置 */
	beginningScrollRight: null,
	/**当前鼠标是否在一个iframe中 */
	isInFrame: false,

	/**是否已显示滑动箭头 */
	hasShownSwipeArrow: false,

	/**初始缩放键状态 */
	initialZoomKeyState: null,
	/**初始辅助键状态 */
	initialSecondaryKeyState: null,

	/**webview的最小缩放比例 */
	webviewMinZoom: 0.5,
	/**webview的最大缩放比例 */
	webviewMaxZoom: 3.0,

	/**
	 * 显示返回箭头
	 * @returns
	 */
	showBackArrow: function () {
		// this is temporarily disabled until we find a way to make it work with BrowserViews
		return;
		var backArrow = document.getElementById("leftArrowContainer");
		backArrow.classList.toggle("shown");
		backArrow.classList.toggle("animating");

		setTimeout(function () {
			backArrow.classList.toggle("shown");
		}, 600);

		setTimeout(function () {
			backArrow.classList.toggle("animating");
		}, 900);
	},

	/**
	 * 显示前进箭头
	 * @returns
	 */
	showForwardArrow: function () {
		// this is temporarily disabled until we find a way to make it work with BrowserViews
		return;
		var forwardArrow = document.getElementById("rightArrowContainer");
		forwardArrow.classList.toggle("shown");
		forwardArrow.classList.toggle("animating");

		setTimeout(function () {
			forwardArrow.classList.toggle("shown");
		}, 600);

		setTimeout(function () {
			forwardArrow.classList.toggle("animating");
		}, 900);
	},

	/**
	 * 根据指定的增量调整webview的缩放比例
	 * @param {*} tabId
	 * @param {*} amt
	 */
	zoomWebviewBy: function (tabId, amt) {
		webviews.callAsync(tabId, "zoomFactor", function (err, oldFactor) {
			webviews.callAsync(
				tabId,
				"zoomFactor",
				Math.min(webviewGestureManagement.webviewMaxZoom, Math.max(webviewGestureManagement.webviewMinZoom, oldFactor + amt))
			);
		});
	},

	/**
	 * 放大webview
	 * @param {*} tabId
	 * @returns
	 */
	zoomWebviewIn: function (tabId) {
		return webviewGestureManagement.zoomWebviewBy(tabId, 0.2);
	},

	/**
	 * 缩小webview
	 * @param {*} tabId
	 * @returns
	 */
	zoomWebviewOut: function (tabId) {
		return webviewGestureManagement.zoomWebviewBy(tabId, -0.2);
	},

	/**
	 * 重置webview的缩放比例为默认值
	 * @param {*} tabId
	 */
	resetWebviewZoom: function (tabId) {
		webviews.callAsync(tabId, "zoomFactor", 1.0);
	},

	/**
	 * 重置移动距离计数器
	 */
	resetDistanceCounters: function () {
		webviewGestureManagement.horizontalMouseMove = 0; // 水平移动距离重置为0
		webviewGestureManagement.verticalMouseMove = 0; // 垂直移动距离重置为0
		webviewGestureManagement.leftMouseMove = 0; // 向左移动距离重置为0
		webviewGestureManagement.rightMouseMove = 0; // 向右移动距离重置为0

		webviewGestureManagement.hasShownSwipeArrow = false; // 标志位重置为false

		webviewGestureManagement.initialZoomKeyState = null; // 初始缩放键状态重置为null
		webviewGestureManagement.initialSecondaryKeyState = null; // 初始辅助键状态重置为null
	},

	/**
	 * 重置滚动计数器
	 */
	resetScrollCounters: function () {
		webviewGestureManagement.beginningScrollLeft = null; // 左侧开始滚动位置重置为null
		webviewGestureManagement.beginningScrollRight = null; // 右侧开始滚动位置重置为null
		webviewGestureManagement.isInFrame = false; // 是否在iframe中的标志位重置为false
	},

	/**
	 * 手势低速触发时的处理函数
	 * @returns
	 */
	onSwipeGestureLowVelocity: function () {
		// 如果当前鼠标在一个iframe中，无法检测滚动位置，因此不触发后退手势
		if (webviewGestureManagement.isInFrame) {
			return;
		}

		// 调用webviews对象的callAsync方法获取当前选中的标签页的缩放因子
		webviews.callAsync(window.tabs.getSelected(), "getZoomFactor", function (err, result) {
			const minScrollDistance = 150 * result; // 最小滚动距离为150乘以缩放因子

			if (
				webviewGestureManagement.leftMouseMove / webviewGestureManagement.rightMouseMove > 5 ||
				webviewGestureManagement.rightMouseMove / webviewGestureManagement.leftMouseMove > 5
			) {
				// 向左滑动以前进
				if (
					webviewGestureManagement.leftMouseMove - webviewGestureManagement.beginningScrollRight > minScrollDistance &&
					Math.abs(webviewGestureManagement.horizontalMouseMove / webviewGestureManagement.verticalMouseMove) > 3
				) {
					if (webviewGestureManagement.beginningScrollRight < 5) {
						webviewGestureManagement.resetDistanceCounters(); // 重置距离计数器
						webviewGestureManagement.resetScrollCounters(); // 重置滚动计数器
						webviews.callAsync(window.tabs.getSelected(), "goForward"); // 调用webviews对象的callAsync方法前进到下一页
					}
				}

				// 向右滑动以后退
				if (
					webviewGestureManagement.rightMouseMove + webviewGestureManagement.beginningScrollLeft > minScrollDistance &&
					Math.abs(webviewGestureManagement.horizontalMouseMove / webviewGestureManagement.verticalMouseMove) > 3
				) {
					if (webviewGestureManagement.beginningScrollLeft < 5) {
						webviewGestureManagement.resetDistanceCounters(); // 重置距离计数器
						webviewGestureManagement.resetScrollCounters(); // 重置滚动计数器
						webviews.goBackIgnoringRedirects(window.tabs.getSelected()); // 调用webviews对象的goBackIgnoringRedirects方法后退到上一页（忽略重定向）
					}
				}
			}
		});
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		// 绑定IPC事件，当webview接收到wheel-event事件时，执行回调函数
		webviews.bindIPC("wheel-event", function (tabId, e) {
			// 将字符串类型的事件转换为对象类型
			e = JSON.parse(e);

			if (e.defaultPrevented) {
				return;
			}

			// 垂直方向上的移动距离
			webviewGestureManagement.verticalMouseMove += e.deltaY;

			// 水平方向上的移动距离
			webviewGestureManagement.horizontalMouseMove += e.deltaX;

			// 根据deltaX的正负值来更新左右移动距离
			if (e.deltaX > 0) {
				webviewGestureManagement.leftMouseMove += e.deltaX;
			} else {
				webviewGestureManagement.rightMouseMove += e.deltaX * -1;
			}

			// 获取缩放和辅助键的状态
			var platformZoomKey = navigator.platform === "MacIntel" ? e.metaKey : e.ctrlKey;
			var platformSecondaryKey = navigator.platform === "MacIntel" ? e.ctrlKey : false;

			// 如果当前页面还没有进行滚动，则需要查找当前鼠标指针所在的元素
			if (webviewGestureManagement.beginningScrollLeft === null || webviewGestureManagement.beginningScrollRight === null) {
				// 执行JavaScript代码来查找当前鼠标指针所在的元素，并获取左右滚动位置和是否处于iframe中的状态
				webviews.callAsync(
					window.tabs.getSelected(),
					"executeJavaScript",
					`
					(function () {
						var left = 0
						var right = 0
						var isInFrame = false;
						
						var n = document.elementFromPoint(${e.clientX}, ${e.clientY})
						while (n) {
							if (n.tagName === 'IFRAME') {
								isInFrame = true;
							}

							if (n.scrollLeft !== undefined) {
								left = Math.max(left, n.scrollLeft)
								right = Math.max(right, n.scrollWidth - n.clientWidth - n.scrollLeft)
							}

							n = n.parentElement
						}

						return {left, right, isInFrame}
					})()
					`,
					function (err, result) {
						// 如果发生错误，则输出警告信息
						if (err) {
							console.warn(err);
							return;
						}

						// 如果当前页面还没有进行滚动，就保存左右滚动位置和是否处于iframe中的状态
						if (webviewGestureManagement.beginningScrollLeft === null || webviewGestureManagement.beginningScrollRight === null) {
							webviewGestureManagement.beginningScrollLeft = result.left;
							webviewGestureManagement.beginningScrollRight = result.right;
						}

						webviewGestureManagement.isInFrame = webviewGestureManagement.isInFrame || result.isInFrame;
					}
				);
			}

			// 如果缩放按键的初始状态还没有被记录，则需要记录缩放按键的初始状态
			if (webviewGestureManagement.initialZoomKeyState === null) {
				webviewGestureManagement.initialZoomKeyState = platformZoomKey;
			}

			// 如果辅助按键的初始状态还没有被记录，则需要记录辅助按键的初始状态
			if (webviewGestureManagement.initialSecondaryKeyState === null) {
				webviewGestureManagement.initialSecondaryKeyState = platformSecondaryKey;
			}

			// 如果移动距离超过一定阈值，则触发手势操作
			if (Math.abs(e.deltaX) >= 20 || Math.abs(e.deltaY) >= 20) {
				// 取消之前可能存在的手势操作
				clearTimeout(webviewGestureManagement.swipeGestureLowVelocityTimeout);

				// 设置一个定时器，用于在一定时间后触发手势操作
				webviewGestureManagement.swipeGestureLowVelocityTimeout = setTimeout(
					webviewGestureManagement.onSwipeGestureLowVelocity,
					webviewGestureManagement.swipeGestureVelocityDelay
				);

				// 如果水平移动距离超过阈值，并且水平移动距离与垂直移动距离的比值大于2.5，并且还没有显示箭头，则显示相应的箭头
				if (
					webviewGestureManagement.horizontalMouseMove < -150 &&
					Math.abs(webviewGestureManagement.horizontalMouseMove / webviewGestureManagement.verticalMouseMove) > 2.5 &&
					!webviewGestureManagement.hasShownSwipeArrow
				) {
					webviewGestureManagement.hasShownSwipeArrow = true;
					webviewGestureManagement.showBackArrow();
				} else if (
					webviewGestureManagement.horizontalMouseMove > 150 &&
					Math.abs(webviewGestureManagement.horizontalMouseMove / webviewGestureManagement.verticalMouseMove) > 2.5 &&
					!webviewGestureManagement.hasShownSwipeArrow
				) {
					webviewGestureManagement.hasShownSwipeArrow = true;
					webviewGestureManagement.showForwardArrow();
				}
			}

			// 取消之前可能存在的定时器
			clearTimeout(webviewGestureManagement.swipeGestureDistanceResetTimeout);
			clearTimeout(webviewGestureManagement.swipeGestureScrollResetTimeout);

			// 设置两个新的定时器，用于在一定时间后进行计数器的重置
			webviewGestureManagement.swipeGestureDistanceResetTimeout = setTimeout(
				webviewGestureManagement.resetDistanceCounters,
				webviewGestureManagement.swipeGestureDelay
			);
			webviewGestureManagement.swipeGestureScrollResetTimeout = setTimeout(
				webviewGestureManagement.resetScrollCounters,
				webviewGestureManagement.swipeGestureScrollDelay
			);

			/* cmd-key while scrolling should zoom in and out */
			// 如果按下了缩放按键，则根据垂直移动距离来触发页面的放大或缩小操作
			if (platformZoomKey && webviewGestureManagement.initialZoomKeyState) {
				if (webviewGestureManagement.verticalMouseMove > 50) {
					webviewGestureManagement.verticalMouseMove = -10;
					webviewGestureManagement.zoomWebviewOut(window.tabs.getSelected());
				}

				if (webviewGestureManagement.verticalMouseMove < -50) {
					webviewGestureManagement.verticalMouseMove = -10;
					webviewGestureManagement.zoomWebviewIn(window.tabs.getSelected());
				}
			}
		});
	},
};

module.exports = webviewGestureManagement;
