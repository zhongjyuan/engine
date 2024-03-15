const places = require("../places/places.js");
const searchbar = require("../searchbar/searchbar.js");
const bookmarkEditManagement = require("../searchbar/bookmarkEditManagement.js");
const searchbarPluginManagement = require("../searchbar/searchbarPluginManagement.js");

/**
 * 书签按钮对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日12:32:55
 */
const bookmarkButton = {
	/**
	 * 创建星形按钮
	 * @returns {HTMLElement} - 星形按钮元素
	 */
	create: function () {
		const button = document.createElement("button");
		button.className = "tab-editor-button bookmarks-button i carbon:star";

		button.setAttribute("aria-pressed", false);
		button.setAttribute("title", l("addBookmark"));
		button.setAttribute("aria-label", l("addBookmark"));

		button.addEventListener("click", function (e) {
			bookmarkButton.onClick(button);
		});

		return button;
	},

	/**
	 * 点击星形按钮时执行的操作
	 * @param {HTMLElement} button - 星形按钮元素
	 */
	onClick: function (button) {
		var tabId = button.getAttribute("data-tab");

		// 清除搜索栏插件
		searchbarPluginManagement.clearAll();

		// 更新书签状态，并添加到书签中
		places.updateItem(
			window.tabs.get(tabId).url,
			{
				isBookmarked: true,
				title: tabs.get(tabId).title,
			},
			function () {
				// 更新按钮样式
				button.classList.remove("carbon:star");
				button.classList.add("carbon:star-filled");
				button.setAttribute("aria-pressed", true);

				// 创建一个容器元素用于插入书签编辑器
				var editorInsertionPoint = document.createElement("div");
				searchbarPluginManagement.getContainer("simpleBookmarkTagInput").appendChild(editorInsertionPoint);

				// 显示书签编辑器
				bookmarkEditManagement.show(
					window.tabs.get(window.tabs.getSelected()).url,
					editorInsertionPoint,
					function (newBookmark) {
						if (!newBookmark) {
							// 如果书签被删除，则恢复按钮初始状态
							button.classList.add("carbon:star");
							button.classList.remove("carbon:star-filled");
							button.setAttribute("aria-pressed", false);
							searchbar.showResults("");
							searchbar.associatedInput.focus();
						}
					},
					{ simplified: true, autoFocus: true }
				);
			}
		);
	},

	/**
	 * 更新星形按钮的状态
	 * @param {string} tabId - 选项卡ID
	 * @param {HTMLElement} button - 星形按钮元素
	 */
	update: function (tabId, button) {
		button.setAttribute("data-tab", tabId);
		const currentURL = window.tabs.get(tabId).url;

		// 没有URL无法添加书签，隐藏按钮
		if (!currentURL) {
			button.hidden = true;
		} else {
			button.hidden = false;
		}

		// 检查页面是否已添加到书签中，并更新按钮样式
		places.getItem(currentURL, function (item) {
			if (item && item.isBookmarked) {
				button.classList.remove("carbon:star");
				button.classList.add("carbon:star-filled");
				button.setAttribute("aria-pressed", true);
			} else {
				button.classList.add("carbon:star");
				button.classList.remove("carbon:star-filled");
				button.setAttribute("aria-pressed", false);
			}
		});
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		// 注册搜索栏插件
		searchbarPluginManagement.register("simpleBookmarkTagInput", {
			index: 0,
		});
	},
};

bookmarkButton.initialize();

module.exports = bookmarkButton;
