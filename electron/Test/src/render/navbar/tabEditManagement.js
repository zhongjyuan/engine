const urlManagement = require("../utils/urlManagement.js");
const keyboardNavigation = require("../utils/keyboardNavigation.js");

const modalMode = require("../modalMode.js");

const { webviews } = require("../webviewManagement.js");

const bookmarkButton = require("./bookmarkButton.js");
const blockingButton = require("./blockingButton.js");

const searchbar = require("../searchbar/searchbar.js");

/**
 * 标签页编辑管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日12:40:28
 */
const tabEditManagement = {
	/** 书签按钮元素 */
	bookmarkButtonElement: null,

	/** 输入框 */
	input: document.getElementById("tab-editor-input"),
	
	/** 编辑器容器 */
	container: document.getElementById("tab-editor"),

	/**
	 * 显示编辑模式
	 * @param {string} tabId - 标签页 ID
	 * @param {string} editingValue - 编辑的值
	 * @param {boolean} showSearchbar - 是否显示搜索栏
	 * @returns
	 */
	show: function (tabId, editingValue, showSearchbar) {
		/* 编辑模式不可用于模态模式。*/
		if (modalMode.enabled()) {
			return;
		}

		tabEditManagement.container.hidden = false;

		// 更新书签图标
		bookmarkButton.update(tabId, tabEditManagement.bookmarkButtonElement);

		// 更新内容阻止切换
		blockingButton.update(tabId, tabEditManagement.blockingButton);

		// 请求编辑模式的占位符
		webviews.requestPlaceholder("editMode");

		// 添加样式类
		document.body.classList.add("is-edit-mode");

		var currentURL = urlManagement.getSourceURL(window.tabs.get(tabId).url);
		if (currentURL === "z://newtab") {
			currentURL = "";
		}

		tabEditManagement.input.value = editingValue || currentURL;
		tabEditManagement.input.focus();
		if (!editingValue) {
			tabEditManagement.input.select();
		}

		tabEditManagement.input.scrollLeft = 0;

		// 显示搜索栏
		searchbar.show(tabEditManagement.input);

		if (showSearchbar !== false) {
			if (editingValue) {
				searchbar.showResults(editingValue, null);
			} else {
				searchbar.showResults("", null);
			}
		}

		/* 动画 */
		if (window.tabs.count() > 1) {
			window.requestAnimationFrame(function () {
				var item = document.querySelector(`.tab-item[data-tab="${tabId}"]`);
				var originCoordinates = item.getBoundingClientRect();

				var finalCoordinates = document.querySelector("#tabs").getBoundingClientRect();

				var translateX = Math.min(Math.round(originCoordinates.x - finalCoordinates.x) * 0.45, window.innerWidth);

				tabEditManagement.container.style.opacity = 0;
				tabEditManagement.container.style.transform = `translateX(${translateX}px)`;
				window.requestAnimationFrame(function () {
					tabEditManagement.container.style.transition = "0.135s all";
					tabEditManagement.container.style.opacity = 1;
					tabEditManagement.container.style.transform = "";
				});
			});
		}
	},

	/**
	 * 隐藏编辑模式
	 */
	hide: function () {
		tabEditManagement.container.hidden = true;
		tabEditManagement.container.removeAttribute("style");

		tabEditManagement.input.blur();
		searchbar.hide();

		document.body.classList.remove("is-edit-mode");

		// 隐藏编辑模式的占位符
		webviews.hidePlaceholder("editMode");
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		// 设置输入框的提示文本
		tabEditManagement.input.setAttribute("placeholder", l("searchbarPlaceholder"));

		// 创建书签图标
		tabEditManagement.bookmarkButtonElement = bookmarkButton.create();
		tabEditManagement.container.appendChild(tabEditManagement.bookmarkButtonElement);

		// 创建内容阻止切换开关
		tabEditManagement.blockingButton = blockingButton.create();
		tabEditManagement.container.appendChild(tabEditManagement.blockingButton);

		// 将编辑器容器添加到键盘导航组
		keyboardNavigation.addToGroup("searchbar", tabEditManagement.container);

		// keypress doesn't fire on delete key - use keyup instead
		tabEditManagement.input.addEventListener("keyup", function (e) {
			if (e.keyCode === 8) {
				searchbar.showResults(this.value, e);
			}
		});

		tabEditManagement.input.addEventListener("keypress", function (e) {
			if (e.keyCode === 13) {
				// return key pressed; update the url
				if (this.getAttribute("data-autocomplete") && this.getAttribute("data-autocomplete").toLowerCase() === this.value.toLowerCase()) {
					// special case: if the typed input is capitalized differently from the actual URL that was autocompleted (but is otherwise the same), then we want to open the actual URL instead of what was typed.

					searchbar.openURL(this.getAttribute("data-autocomplete"), e);
				} else {
					searchbar.openURL(this.value, e);
				}
			} else if (e.keyCode === 9) {
				return;
				// tab key, do nothing - in keydown listener
			} else if (e.keyCode === 16) {
				return;
				// shift key, do nothing
			} else if (e.keyCode === 8) {
				return;
				// delete key is handled in keyUp
			} else {
				// show the searchbar
				searchbar.showResults(this.value, e);
			}

			// on keydown, if the autocomplete result doesn't change, we move the selection instead of regenerating it to avoid race conditions with typing. Adapted from https://github.com/patrickburke/jquery.inlineComplete

			var v = e.key;
			var sel = this.value.substring(this.selectionStart, this.selectionEnd).indexOf(v);

			if (v && sel === 0) {
				this.selectionStart += 1;
				e.preventDefault();
			}
		});

		document.getElementById("webviews").addEventListener("click", function () {
			tabEditManagement.hide();
		});
	},
};

tabEditManagement.initialize();

module.exports = tabEditManagement;
