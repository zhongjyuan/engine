const focusMode = require("./focusMode.js");
const modalMode = require("./modalMode.js");

const uiManagement = require("./uiManagement.js");
const { webviews } = require("./webviewManagement.js");
const webviewGestures = require("./webviewGestureManagement.js");

const tabEditManagement = require("./navbar/tabEditManagement.js");
const taskOverlay = require("./taskOverlay/taskOverlayManagement.js");

const findinpage = require("./pageFinds.js");

const PDFViewer = require("./pdfViewer.js");
const readerView = require("./readerView.js");

/**
 *	webview 菜单控制对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日11:25:39
 */
const webviewMenuControl = {
	/**
	 * 初始化
	 */
	initialize: function () {
		window.ipc.on("zoomIn", function () {
			webviewGestures.zoomWebviewIn(window.tabs.getSelected());
		});

		window.ipc.on("zoomOut", function () {
			webviewGestures.zoomWebviewOut(window.tabs.getSelected());
		});

		window.ipc.on("zoomReset", function () {
			webviewGestures.resetWebviewZoom(window.tabs.getSelected());
		});

		window.ipc.on("print", function () {
			// PDF 视图
			if (PDFViewer.isPDFViewer(window.tabs.getSelected())) {
				PDFViewer.printPDF(window.tabs.getSelected());
			}

			// 阅读模式
			else if (readerView.isReader(window.tabs.getSelected())) {
				readerView.printArticle(window.tabs.getSelected());
			}

			//
			else if (webviews.placeholderRequests.length === 0) {
				webviews.callAsync(window.tabs.getSelected(), "executeJavaScript", "window.print()");
			}
		});

		window.ipc.on("findInPage", function () {
			/* Page search is not available in modal mode. */
			if (modalMode.enabled()) {
				return;
			}

			findinpage.start();
		});

		window.ipc.on("inspectPage", function () {
			webviews.callAsync(window.tabs.getSelected(), "toggleDevTools");
		});

		window.ipc.on("openEditor", function () {
			tabEditManagement.show(window.tabs.getSelected());
		});

		window.ipc.on("showBookmarks", function () {
			tabEditManagement.show(window.tabs.getSelected(), "!bookmarks ");
		});

		window.ipc.on("showHistory", function () {
			tabEditManagement.show(window.tabs.getSelected(), "!history ");
		});

		window.ipc.on("addTab", function (e, data) {
			/* new tabs can't be created in modal mode */
			if (modalMode.enabled()) {
				return;
			}

			/* new tabs can't be created in focus mode */
			if (focusMode.enabled()) {
				focusMode.warn();
				return;
			}

			var newTabId = window.tabs.add({
				url: data.url || "",
			});

			uiManagement.addTab(newTabId, {
				enterEditMode: !data.url, // only enter edit mode if the new tab is empty
			});
		});

		window.ipc.on("saveCurrentPage", async function () {
			var currentTab = window.tabs.get(window.tabs.getSelected());

			// new tabs cannot be saved
			if (!currentTab.url) {
				return;
			}

			// if the current tab is a PDF, let the PDF viewer handle saving the document
			if (PDFViewer.isPDFViewer(window.tabs.getSelected())) {
				PDFViewer.savePDF(window.tabs.getSelected());
				return;
			}

			if (window.tabs.get(window.tabs.getSelected()).isFileView) {
				webviews.callAsync(window.tabs.getSelected(), "downloadURL", [window.tabs.get(window.tabs.getSelected()).url]);
			} else {
				var savePath = await window.ipc.invoke("showSaveDialog", {
					defaultPath: currentTab.title.replace(/[/\\]/g, "_"),
				});

				// savePath will be undefined if the save dialog is canceled
				if (savePath) {
					if (!savePath.endsWith(".html")) {
						savePath = savePath + ".html";
					}
					webviews.callAsync(window.tabs.getSelected(), "savePage", [savePath, "HTMLComplete"]);
				}
			}
		});

		window.ipc.on("addPrivateTab", function () {
			/* new tabs can't be created in modal mode */
			if (modalMode.enabled()) {
				return;
			}

			/* new tabs can't be created in focus mode */
			if (focusMode.enabled()) {
				focusMode.warn();
				return;
			}

			uiManagement.addTab(
				window.tabs.add({
					private: true,
				})
			);
		});

		window.ipc.on("toggleTaskOverlay", function () {
			taskOverlay.toggle();
		});

		window.ipc.on("goBack", function () {
			webviews.callAsync(window.tabs.getSelected(), "goBack");
		});

		window.ipc.on("goForward", function () {
			webviews.callAsync(window.tabs.getSelected(), "goForward");
		});
	},
};

module.exports = webviewMenuControl;
