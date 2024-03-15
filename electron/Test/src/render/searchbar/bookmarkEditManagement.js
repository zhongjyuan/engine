const autocomplete = require("../utils/autoManagement.js");

const places = require("../places/places.js");

const webviewMenu = require("../webviewMenuManagement.js");

/**
 * 书签编辑管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日19:53:42
 */
const bookmarkEditManagement = {
	/**实例 */
	instance: null,

	/**
	 * 用于生成标签元素的方法，返回一个 button 元素。
	 *
	 * @param {string} tag - 标签名
	 * @param {boolean} selected - 是否为选中状态
	 * @param {function} onClick - 点击事件处理函数
	 * @param {object} options - 其他选项配置
	 * @returns {HTMLElement} - 生成的标签元素
	 */
	getTagElement: function (tag, selected, onClick, options = {}) {
		// 创建一个 button 元素
		var button = document.createElement("button");
		button.className = "tag";
		button.textContent = tag;

		// 如果为选中状态，添加相应的 CSS 类名和 ARIA 属性值
		if (selected) {
			button.classList.add("selected");
			button.setAttribute("aria-pressed", true);
		} else {
			button.classList.add("suggested");
			button.setAttribute("aria-pressed", false);
		}

		// 添加点击事件处理函数
		button.addEventListener("click", function () {
			onClick();

			// 如果已选中并且设置了自动移除选中标签，则移除该标签元素
			if (button.classList.contains("selected") && options.autoRemove !== false) {
				button.remove();
			} else {
				button.classList.remove("suggested");
				button.classList.add("selected");
			}
		});

		// 如果设置了 onModify 选项，则添加上下文菜单的监听器
		if (options.onModify) {
			button.addEventListener("contextmenu", function () {
				webviewMenu.open([
					[
						{
							label: l("bookmarksRenameTag"), // 重命名标签处理函数
							click: function () {
								// 弹出提示框，获取新的标签名
								const res = window.ipc.sendSync("prompt", {
									text: "",
									values: [{ placeholder: l("bookmarksRenameTag"), id: "name", type: "text" }],
									ok: l("dialogConfirmButton"),
									cancel: l("dialogSkipButton"),
									width: 500,
									height: 140,
								});

								if (!res || !res.name) {
									return;
								}

								const newName = res.name;

								// 遍历所有书签项，更新包含该标签的项的标签列表
								places.getAllItems(function (items) {
									items.forEach(function (item) {
										if (item.tags.includes(tag)) {
											item.tags = item.tags.filter((t) => t !== tag);
											item.tags.push(newName);
											places.updateItem(item.url, { tags: item.tags });
										}
									});

									// 更新标签列表
									setTimeout(function () {
										options.onModify();
									}, 50);
								});
							},
						},
						{
							label: l("bookmarksDeleteTag"), // 删除标签处理函数
							click: function () {
								// 遍历所有书签项，更新包含该标签的项的标签列表
								places.getAllItems(function (items) {
									items.forEach(function (item) {
										if (item.tags.includes(tag)) {
											item.tags = item.tags.filter((t) => t !== tag);
											places.updateItem(item.url, { tags: item.tags });
										}
									});

									// 更新标签列表
									setTimeout(function () {
										options.onModify();
									}, 50);
								});
							},
						},
						{
							label: l("deleteBookmarksWithTag"), // 删除所有包含该标签的书签项处理函数
							click: function () {
								// 遍历所有书签项，删除包含该标签的项
								places.getAllItems(function (items) {
									items.forEach(function (item) {
										if (item.tags.includes(tag)) {
											places.deleteHistory(item.url);
										}
									});

									// 更新标签列表
									setTimeout(function () {
										options.onModify();
									}, 50);
								});
							},
						},
					],
				]);
			});
		}

		return button;
	},

	/**
	 * 渲染书签编辑器
	 * @param {*} url 书签URL
	 * @param {*} options 选项对象
	 * @returns {Promise} 返回书签编辑器的实例
	 */
	render: async function (url, options = {}) {
		bookmarkEditManagement.instance = {};

		// 通过异步操作从 places API 获取书签信息
		bookmarkEditManagement.instance.bookmark = await new Promise(function (resolve, reject) {
			places.getItem(url, (item) => resolve(item));
		});

		var editor = document.createElement("div");
		editor.className = "bookmark-editor searchbar-item";

		if (options.simplified) {
			editor.className += " simplified";
		}

		if (!options.simplified) {
			// 标题输入
			var title = document.createElement("span");
			title.className = "title wide";
			title.textContent = bookmarkEditManagement.instance.bookmark.title;
			editor.appendChild(title);

			// URL
			var URLSpan = document.createElement("div");
			URLSpan.className = "bookmark-url";
			URLSpan.textContent = bookmarkEditManagement.instance.bookmark.url;
			editor.appendChild(URLSpan);
		}

		// 标签区域
		var tagArea = document.createElement("div");
		tagArea.className = "tag-edit-area";
		editor.appendChild(tagArea);

		if (!options.simplified) {
			// 保存按钮
			var saveButton = document.createElement("button");
			saveButton.className = "action-button always-visible i carbon:checkmark";
			saveButton.tabIndex = -1;

			editor.appendChild(saveButton);
			saveButton.addEventListener("click", function () {
				editor.remove();
				bookmarkEditManagement.instance.onClose(bookmarkEditManagement.instance.bookmark);
				bookmarkEditManagement.instance = null;
			});
		}

		// 删除按钮
		var delButton = document.createElement("button");
		delButton.className = "action-button always-visible bookmark-delete-button i carbon:trash-can";
		delButton.tabIndex = -1;

		editor.appendChild(delButton);
		delButton.addEventListener("click", function () {
			editor.remove();
			bookmarkEditManagement.instance.onClose(null);
			bookmarkEditManagement.instance = null;
		});

		var tags = {
			selected: [],
			suggested: [],
		};

		// 显示标签
		bookmarkEditManagement.instance.bookmark.tags.forEach(function (tag) {
			tagArea.appendChild(
				bookmarkEditManagement.getTagElement(tag, true, function () {
					places.toggleTag(bookmarkEditManagement.instance.bookmark.url, tag);
				})
			);
		});
		tags.selected = bookmarkEditManagement.instance.bookmark.tags;

		// 获取建议标签并显示
		places.getSuggestedTags(bookmarkEditManagement.instance.bookmark.url, function (suggestions) {
			tags.suggested = tags.suggested.concat(suggestions);

			tags.suggested
				.filter((tag, idx) => {
					return tags.suggested.indexOf(tag) === idx && !tags.selected.includes(tag);
				})
				.slice(0, 3)
				.forEach(function (tag, idx) {
					tagArea.appendChild(
						bookmarkEditManagement.getTagElement(tag, false, function () {
							places.toggleTag(bookmarkEditManagement.instance.bookmark.url, tag);
						})
					);
				});

			// 添加新标签的选项
			var newTagInput = document.createElement("input");
			newTagInput.className = "tag-input";
			newTagInput.placeholder = l("bookmarksAddTag");
			newTagInput.classList.add("mousetrap");
			newTagInput.spellcheck = false;
			tagArea.appendChild(newTagInput);

			newTagInput.addEventListener("keypress", function (e) {
				if (e.keyCode !== 8 && e.keyCode !== 13) {
					places.getAllTagsRanked(bookmarkEditManagement.instance.bookmark.url, function (results) {
						autocomplete.autocomplete(
							newTagInput,
							results.map((r) => r.tag)
						);
					});
				}
			});

			newTagInput.addEventListener("change", function () {
				var val = this.value;
				if (!tags.selected.includes(val)) {
					places.toggleTag(bookmarkEditManagement.instance.bookmark.url, val);
					tagArea.insertBefore(
						bookmarkEditManagement.getTagElement(val, true, function () {
							places.toggleTag(bookmarkEditManagement.instance.bookmark.url, val);
						}),
						tagArea.firstElementChild
					);
				}
				this.value = "";
			});

			if (options.autoFocus) {
				newTagInput.focus();
			}
		});

		return editor;
	},

	/**
	 * 显示书签编辑器
	 * @param {*} url 书签的URL
	 * @param {*} replaceItem 要替换的元素
	 * @param {*} onClose 关闭编辑器时的回调函数
	 * @param {*} options 选项对象
	 */
	show: function (url, replaceItem, onClose, options) {
		// 如果当前已经存在编辑器实例，则移除之前的编辑器
		if (bookmarkEditManagement.instance) {
			if (bookmarkEditManagement.instance.editor && bookmarkEditManagement.instance.editor.parentNode) {
				bookmarkEditManagement.instance.editor.remove();
			}

			if (bookmarkEditManagement.instance.onClose) {
				bookmarkEditManagement.instance.onClose(bookmarkEditManagement.instance.bookmark);
			}

			bookmarkEditManagement.instance = null;
		}

		// 渲染书签编辑器
		bookmarkEditManagement.render(url, options).then(function (editor) {
			// 隐藏原始元素，将编辑器插入到原始元素前面
			replaceItem.hidden = true;
			replaceItem.parentNode.insertBefore(editor, replaceItem);

			// 更新当前编辑器实例的属性
			bookmarkEditManagement.instance.editor = editor;
			bookmarkEditManagement.instance.onClose = onClose;
		});
	},
};

module.exports = bookmarkEditManagement;
