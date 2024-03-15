const urlManagement = require("./utils/urlManagement.js");

const { webviews } = require("./webviewManagement.js");

/**
 * PDF 视图对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日11:58:08
 */
const PDFViewer = {
	/** PDF 视图的 URL */
	URL: {
		/** PDFViewer 基础 URL */
		base: urlManagement.getFileURL(__dirname + "/pages/pdfViewer/index.html"),
		/** 包含 PDF 文件 URL 的查询字符串 */
		queryString: "?url=%l",
	},

	/**
	 * 判断标签页是否是 PDFViewer 标签页
	 * @param {*} tabId 标签页 ID
	 * @returns {boolean} 是否是 PDFViewer 标签页
	 */
	isPDFViewer: function (tabId) {
		return window.tabs.get(tabId).url.startsWith(PDFViewer.URL.base);
	},

	/**
	 * 在 PDFViewer 中打印 PDF 文件
	 * @param {*} viewerTabId PDFViewer 标签页 ID
	 */
	printPDF: function (viewerTabId) {
		if (!PDFViewer.isPDFViewer(viewerTabId)) {
			throw new Error("attempting to print in a tab that isn't a PDF viewer");
		}

		webviews.callAsync(window.tabs.getSelected(), "executeJavaScript", "parentProcessActions.printPDF()");
	},

	/**
	 * 在 PDFViewer 中保存 PDF 文件
	 * @param {*} viewerTabId PDFViewer 标签页 ID
	 */
	savePDF: function (viewerTabId) {
		if (!PDFViewer.isPDFViewer(viewerTabId)) {
			throw new Error("attempting to save in a tab that isn't a PDF viewer");
		}

		webviews.callAsync(window.tabs.getSelected(), "executeJavaScript", "parentProcessActions.downloadPDF()");
	},

	/**
	 * 在 PDFViewer 中启动查找功能
	 * @param {*} viewerTabId PDFViewer 标签页 ID
	 */
	startFindInPage: function (viewerTabId) {
		if (!PDFViewer.isPDFViewer(viewerTabId)) {
			throw new Error("attempting to call startFindInPage in a tab that isn't a PDF viewer");
		}

		webviews.callAsync(window.tabs.getSelected(), "executeJavaScript", "parentProcessActions.startFindInPage()");
	},

	/**
	 * 在 PDFViewer 中关闭查找功能
	 * @param {*} viewerTabId PDFViewer 标签页 ID
	 */
	endFindInPage: function (viewerTabId) {
		if (!PDFViewer.isPDFViewer(viewerTabId)) {
			throw new Error("attempting to call endFindInPage in a tab that isn't a PDF viewer");
		}

		webviews.callAsync(window.tabs.getSelected(), "executeJavaScript", "parentProcessActions.endFindInPage()");
	},

	/**
	 * 处理打开 PDF 文件的事件，将 PDF 文件 URL 发送到 PDFViewer 页面中
	 * @param {*} event 事件名称
	 * @param {*} data 包含 PDF 文件 URL 和标签页 ID 的数据
	 */
	handlePDFOpenEvent: function (event, data) {
		// 如果没有传入标签页 ID，则根据 PDF 文件 URL 查找匹配的标签页
		if (!data.tabId) {
			var matchingTabs = window.tabs
				.get()
				.filter((t) => t.url === data.url)
				.sort((a, b) => {
					return b.lastActivity - a.lastActivity;
				});

			if (matchingTabs[0]) {
				data.tabId = matchingTabs[0].id;
			}
		}

		if (!data.tabId) {
			console.warn(
				"missing tab ID for PDF",
				data.url,
				window.tabs.get().map((t) => t.url)
			);
			return;
		}

		// 构造 PDFViewer 页面 URL，并将其加载到指定的标签页中
		var PDFurl = PDFViewer.URL.base + PDFViewer.URL.queryString.replace("%l", window.encodeURIComponent(data.url));

		webviews.update(data.tabId, PDFurl);
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		window.ipc.on("openPDF", PDFViewer.handlePDFOpenEvent);
	},
};

module.exports = PDFViewer;
