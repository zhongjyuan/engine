var urlManagement = require("./utils/urlManagement.js");

var { webviews } = require("./webviewManagement.js");

var readerDecision = require("./readerDecision.js");

var keyboardBindings = require("./keyboardBinding.js");

/**
 * 阅读视图对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日11:51:59
 */
var readerView = {
	/** 阅读视图的 URL */
	URL: urlManagement.getFileURL(__dirname + "/reader/index.html"),

	/**
	 * 获取带有指定 URL 的阅读器视图的 URL
	 * @param {*} url
	 * @returns
	 */
	getReaderURL: function (url) {
		return readerView.URL + "?url=" + url;
	},

	/**
	 * 判断指定标签页是否处于阅读器模式
	 * @param {*} tabId
	 * @returns
	 */
	isReader: function (tabId) {
		return window.tabs.get(tabId).url.indexOf(readerView.URL) === 0;
	},

	/**
	 * 获取用于进入或退出阅读器模式的按钮元素
	 * @param {*} tabId
	 * @returns
	 */
	getButton: function (tabId) {
		// TODO better icon
		var button = document.createElement("button");
		button.className = "reader-button tab-icon i carbon:notebook";

		button.setAttribute("data-tab", tabId);
		button.setAttribute("role", "button");

		button.addEventListener("click", function (e) {
			e.stopPropagation();

			if (readerView.isReader(tabId)) {
				readerView.exit(tabId);
			} else {
				readerView.enter(tabId);
			}
		});

		readerView.updateButton(tabId, button);

		return button;
	},

	/**
	 * 更新指定标签页的按钮样式和标题
	 * @param {*} tabId
	 * @param {*} button
	 */
	updateButton: function (tabId, button) {
		var button = button || document.querySelector('.reader-button[data-tab="{id}"]'.replace("{id}", tabId));
		var tab = window.tabs.get(tabId);

		if (readerView.isReader(tabId)) {
			button.classList.add("is-reader");
			button.setAttribute("title", l("exitReaderView"));
		} else {
			button.classList.remove("is-reader");
			button.setAttribute("title", l("enterReaderView"));

			if (tab.readerable) {
				button.classList.add("can-reader");
			} else {
				button.classList.remove("can-reader");
			}
		}
	},

	/**
	 * 进入阅读器模式
	 * @param {*} tabId
	 * @param {*} url
	 */
	enter: function (tabId, url) {
		var newURL = readerView.URL + "?url=" + encodeURIComponent(url || window.tabs.get(tabId).url);

		window.tabs.update(tabId, { url: newURL });

		webviews.update(tabId, newURL);
	},

	/**
	 * 退出阅读器模式
	 * @param {*} tabId
	 */
	exit: function (tabId) {
		var src = urlManagement.getSourceURL(window.tabs.get(tabId).url);

		// this page should not be automatically readerable in the future
		readerDecision.setURLStatus(src, false);

		window.tabs.update(tabId, { url: src });

		webviews.update(tabId, src);
	},

	/**
	 * 打印文章
	 * @param {*} tabId
	 */
	printArticle: function (tabId) {
		if (!readerView.isReader(tabId)) {
			throw new Error("attempting to print in a tab that isn't a reader page");
		}

		webviews.callAsync(window.tabs.getSelected(), "executeJavaScript", "parentProcessActions.printArticle()");
	},

	/**
	 * 初始化阅读器视图
	 */
	initialize: function () {
		// update the reader button on page load

		webviews.bindEvent("did-start-navigation", function (tabId, url, isInPlace, isMainFrame, frameProcessId, frameRoutingId) {
			if (isInPlace) {
				return;
			}

			// if this URL has previously been marked as readerable, load reader view without waiting for the page to load
			if (readerDecision.shouldRedirect(url) === 1) {
				readerView.enter(tabId, url);
			} else if (isMainFrame) {
				window.tabs.update(tabId, {
					readerable: false, // assume the new page can't be readered, we'll get another message if it can
				});

				readerView.updateButton(tabId);
			}
		});

		/** */
		webviews.bindIPC("canReader", function (tab) {
			// if automatic reader mode has been enabled for this domain, and the page is readerable, enter reader mode
			if (readerDecision.shouldRedirect(window.tabs.get(tab).url) >= 0) {
				readerView.enter(tab);
			}

			window.tabs.update(tab, {
				readerable: true,
			});

			readerView.updateButton(tab);
		});

		// add a keyboard shortcut to enter reader mode

		/** */
		keyboardBindings.defineShortcut("toggleReaderView", function () {
			if (readerView.isReader(window.tabs.getSelected())) {
				readerView.exit(window.tabs.getSelected());
			} else {
				readerView.enter(window.tabs.getSelected());
			}
		});
	},
};

readerView.initialize();

module.exports = readerView;
