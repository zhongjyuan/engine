const searchbar = require("../searchbar");
const searchbarPluginManagement = require("../searchbarPluginManagement");

/**
 * 快捷按钮插件对象
 */
const shortcutButtonPlugin = {
	/**
	 * 定义快捷按钮的图标和文本
	 */
	shortcuts: [
		{
			icon: "recently-viewed", // 图标名称
			text: "!history ", // 对应的文本
		},
		{
			icon: "star",
			text: "!bookmarks ",
		},
		{
			icon: "overflow-menu-horizontal",
			text: "!",
		},
	],

	/**
	 * 显示快捷按钮
	 * @param {string} text - 输入框中的文本
	 * @param {HTMLElement} input - 输入框的DOM元素
	 * @param {Event} event - 触发显示快捷按钮的事件
	 */
	showShortcutButtons: function (text, input, event) {
		var container = searchbarPluginManagement.getContainer("shortcutButtons"); // 获取容器元素

		searchbarPluginManagement.reset("shortcutButtons"); // 重置容器内容

		shortcutButtonPlugin.shortcuts.forEach(function (shortcut) {
			var el = document.createElement("button"); // 创建按钮元素
			el.className = "searchbar-shortcut i carbon:" + shortcut.icon; // 设置按钮样式类名
			el.title = shortcut.text; // 设置按钮标题
			el.tabIndex = -1;
			el.addEventListener("click", function () {
				// 添加点击事件监听器
				input.value = shortcut.text; // 将按钮对应的文本设置到输入框中
				input.focus(); // 输入框获取焦点
				searchbar.showResults(shortcut.text); // 显示搜索结果
			});

			container.appendChild(el); // 将按钮添加到容器中
		});
	},

	/**
	 * 初始化快捷按钮插件
	 */
	initialize: function () {
		searchbarPluginManagement.register("shortcutButtons", {
			// 注册快捷按钮插件
			index: 10, // 设置插件的索引
			trigger: function (text) {
				// 设置触发条件
				return !text; // 输入框中没有文本时触发
			},
			showResults: shortcutButtonPlugin.showShortcutButtons, // 设置显示结果的函数
		});
	},
};

module.exports = shortcutButtonPlugin; // 导出初始化函数
