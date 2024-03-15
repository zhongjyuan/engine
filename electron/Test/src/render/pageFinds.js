const { webviews } = require("./webviewManagement.js");

const keyboardBindings = require("./keyboardBinding.js");

const PDFViewer = require("./pdfViewer.js");

/**
 * 页面查找对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日12:02:10
 */
var pageFind = {
	/**当前活动的标签页 */
	activeTab: null,

	/**查找栏的容器元素 */
	container: document.getElementById("findinpage-bar"),

	/**输入框元素 */
	input: document.getElementById("findinpage-input"),

	/**匹配计数元素 */
	counter: document.getElementById("findinpage-count"),

	/**上一个匹配按钮元素 */
	previous: document.getElementById("findinpage-previous-match"),

	/**下一个匹配按钮元素 */
	next: document.getElementById("findinpage-next-match"),

	/**结束查找按钮元素 */
	endButton: document.getElementById("findinpage-end"),

	/**
	 * 开始查找
	 * @param {*} options
	 */
	start: function (options) {
		// 释放焦点
		webviews.releaseFocus();

		// 设置输入框的占位符
		pageFind.input.placeholder = l("searchInPage");

		// 获取当前活动的标签页
		pageFind.activeTab = window.tabs.getSelected();

		// 调用 PDFViewer 模块中的方法开始查找
		if (PDFViewer.isPDFViewer(pageFind.activeTab)) {
			PDFViewer.startFindInPage(pageFind.activeTab);
		}

		pageFind.counter.textContent = "";
		pageFind.container.hidden = false; // 显示查找栏
		pageFind.input.focus(); // 输入框获取焦点
		pageFind.input.select(); // 选中输入框的内容

		if (pageFind.input.value) {
			// 在标签页中调用 findInPage 方法进行查找
			webviews.callAsync(pageFind.activeTab, "findInPage", pageFind.input.value);
		}
	},

	/**
	 * 结束查找
	 * @param {*} options
	 */
	end: function (options) {
		options = options || {};
		var action = options.action || "keepSelection";

		// 隐藏查找栏
		pageFind.container.hidden = true;

		if (pageFind.activeTab) {
			// 在标签页中调用 stopFindInPage 方法停止查找
			webviews.callAsync(pageFind.activeTab, "stopFindInPage", action);

			// 调用 PDFViewer 模块中的方法结束查找
			if (tabs.get(pageFind.activeTab) && PDFViewer.isPDFViewer(pageFind.activeTab)) {
				PDFViewer.endFindInPage(pageFind.activeTab);
			}

			// 在标签页中调用 focus 方法恢复焦点
			webviews.callAsync(pageFind.activeTab, "focus");
		}

		// 将当前活动的标签页设为 null
		pageFind.activeTab = null;
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		// 点击输入框时释放焦点
		pageFind.input.addEventListener("click", function () {
			webviews.releaseFocus();
		});

		// 点击结束查找按钮时调用 end 方法
		pageFind.endButton.addEventListener("click", function () {
			pageFind.end();
		});

		// 输入框内容改变时调用标签页中的 findInPage 方法进行查找
		pageFind.input.addEventListener("input", function (e) {
			if (this.value) {
				webviews.callAsync(pageFind.activeTab, "findInPage", pageFind.input.value);
			}
		});

		// 按下回车键时调用标签页中的 findInPage 方法进行查找
		pageFind.input.addEventListener("keypress", function (e) {
			// Return/Enter 键
			if (e.keyCode === 13) {
				webviews.callAsync(pageFind.activeTab, "findInPage", [
					pageFind.input.value,
					{
						forward: !e.shiftKey, // 如果按下了 Shift 键，则查找上一个匹配项
						findNext: false,
					},
				]);
			}
		});

		// 点击上一个匹配按钮时调用标签页中的 findInPage 方法查找上一个匹配项
		pageFind.previous.addEventListener("click", function (e) {
			webviews.callAsync(pageFind.activeTab, "findInPage", [
				pageFind.input.value,
				{
					forward: false,
					findNext: false,
				},
			]);

			// 输入框获取焦点
			pageFind.input.focus();
		});

		// 点击下一个匹配按钮时调用标签页中的 findInPage 方法查找下一个匹配项
		pageFind.next.addEventListener("click", function (e) {
			webviews.callAsync(pageFind.activeTab, "findInPage", [
				pageFind.input.value,
				{
					forward: true,
					findNext: false,
				},
			]);

			// 输入框获取焦点
			pageFind.input.focus();
		});

		// 绑定事件：当标签页隐藏时调用 end 方法结束查找
		webviews.bindEvent("view-hidden", function (tabId) {
			if (tabId === pageFind.activeTab) {
				pageFind.end();
			}
		});

		// 绑定事件：开始导航时调用 end 方法结束查找
		webviews.bindEvent("did-start-navigation", function (tabId, url, isInPlace, isMainFrame, frameProcessId, frameRoutingId) {
			if (!isInPlace && tabId === pageFind.activeTab) {
				pageFind.end();
			}
		});

		// 绑定事件：在页面中找到匹配项时更新计数
		webviews.bindEvent("found-in-page", function (tabId, data) {
			if (data.matches !== undefined) {
				var text;

				if (data.matches === 1) {
					text = l("findMatchesSingular");
				} else {
					text = l("findMatchesPlural");
				}

				pageFind.counter.textContent = text.replace("%i", data.activeMatchOrdinal).replace("%t", data.matches);
			}
		});

		// 定义快捷键：点击链接时调用 end 方法激活选择
		keyboardBindings.defineShortcut("followLink", function () {
			pageFind.end({ action: "activateSelection" });
		});

		// 定义快捷键：按下 Esc 键时调用 end 方法
		keyboardBindings.defineShortcut({ keys: "esc" }, function (e) {
			pageFind.end();
		});
	},
};

module.exports = pageFind;
