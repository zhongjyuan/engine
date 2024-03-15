const { webviews } = require("../webviewManagement.js");

/**
 * 导航按钮对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日12:35:48
 */
const navigationButton = {
	/** 保存标签栏元素 */
	tabsList: document.getElementById("tabs-inner"),

	/** 保存导航栏容器元素 */
	container: document.getElementById("toolbar-navigation-buttons"),

	/** 保存“返回”按钮元素 */
	backButton: document.getElementById("back-button"),

	/** 保存“前进”按钮元素 */
	forwardButton: document.getElementById("forward-button"),

	/**
	 * 更新导航栏按钮的状态
	 */
	update: function () {
		// 如果当前标签页没有 URL，则禁用“返回”和“前进”按钮
		if (!window.tabs.get(window.tabs.getSelected()).url) {
			navigationButton.backButton.disabled = true;
			navigationButton.forwardButton.disabled = true;
			return;
		}

		// 调用当前标签页的 webview 对象的方法，检查是否可以返回
		webviews.callAsync(window.tabs.getSelected(), "canGoBack", function (err, canGoBack) {
			if (err) {
				return;
			}

			navigationButton.backButton.disabled = !canGoBack;
		});

		// 调用当前标签页的 webview 对象的方法，检查是否可以前进
		webviews.callAsync(window.tabs.getSelected(), "canGoForward", function (err, canGoForward) {
			if (err) {
				return;
			}

			navigationButton.forwardButton.disabled = !canGoForward;

			// 更新导航栏容器的样式，以反映“前进”按钮是否可用
			if (canGoForward) {
				navigationButton.container.classList.add("can-go-forward");
			} else {
				navigationButton.container.classList.remove("can-go-forward");
			}
		});
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		// 显示导航栏容器
		navigationButton.container.hidden = false;

		// 为“返回”按钮添加点击事件监听器
		navigationButton.backButton.addEventListener("click", function (e) {
			webviews.goBackIgnoringRedirects(window.tabs.getSelected());
		});

		// 为“前进”按钮添加点击事件监听器
		navigationButton.forwardButton.addEventListener("click", function () {
			webviews.callAsync(window.tabs.getSelected(), "goForward");
		});

		// 监听鼠标进入导航栏容器的事件，如果标签栏没有超出容器的宽度，则禁用标签栏滚动
		navigationButton.container.addEventListener("mouseenter", function () {
			if (navigationButton.tabsList.scrollWidth <= navigationButton.tabsList.clientWidth) {
				navigationButton.tabsList.classList.add("disable-scroll");
			}
		});

		// 监听鼠标离开导航栏容器的事件，启用标签栏滚动
		navigationButton.container.addEventListener("mouseleave", function () {
			navigationButton.tabsList.classList.remove("disable-scroll");
		});

		// 监听标签页切换事件和 webview 导航事件，更新导航栏按钮状态
		window.tasks.on("tab-selected", navigationButton.update);
		webviews.bindEvent("did-navigate", navigationButton.update);
		webviews.bindEvent("did-navigate-in-page", navigationButton.update);
	},
};

module.exports = navigationButton;
