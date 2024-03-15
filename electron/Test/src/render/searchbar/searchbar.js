const EventEmitter = require("events");

const urlManagement = require("../utils/urlManagement.js");
const keyboardNavigation = require("../utils/keyboardNavigation.js");

const { webviews } = require("../webviewManagement.js");
const keyboardBindings = require("../keyboardBinding.js");

const searchbarPluginManagement = require("./searchbarPluginManagement.js");

/**
 * 搜索栏对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日19:58:51
 */
const searchbar = {
	/**搜索栏元素 */
	element: document.getElementById("searchbar"),

	/**关联的输入框 */
	textInput: null,

	/**事件发射器 */
	events: new EventEmitter(),

	/**
	 * 显示搜索栏，并关联输入框
	 * @param {*} textInput - 要与搜索栏关联的输入框
	 */
	show: function (textInput) {
		// 将搜索栏设置为可见
		searchbar.element.hidden = false;

		// 关联搜索栏与输入框
		searchbar.textInput = textInput;
	},

	/**
	 * 隐藏搜索栏
	 */
	hide: function () {
		// 取消与输入框的关联
		searchbar.textInput = null;

		// 隐藏搜索栏
		searchbar.element.hidden = true;

		// 清除所有搜索栏插件
		searchbarPluginManagement.clearAll();
	},

	/**
	 * 获取搜索栏的值
	 * @returns {string} - 搜索栏中的值
	 */
	getValue: function () {
		// 获取输入框中的文本内容
		var text = searchbar.textInput.value;

		// 移除选中部分的文本，返回剩余的文本内容
		return text.replace(text.substring(searchbar.textInput.selectionStart, searchbar.textInput.selectionEnd), "");
	},

	/**
	 * 显示搜索结果
	 * @param {string} text - 输入框中的文本内容
	 * @param {Event} event - 触发显示搜索结果的事件
	 */
	showResults: function (text, event) {
		// 找到真实的输入值，考虑到高亮的建议和刚按下的键
		// 删除键的行为与其他键不同，String.fromCharCode返回一个不可打印的字符（长度为1）

		var realText;
		if (event && event.keyCode !== 8) {
			// 如果有事件且不是删除键，则将输入的字符插入到文本中相应的位置
			realText = text.substring(0, searchbar.textInput.selectionStart) + event.key + text.substring(searchbar.textInput.selectionEnd, text.length);
		} else {
			// 否则，使用原始的文本内容
			realText = text;
		}

		// 运行搜索栏插件，显示搜索结果
		searchbarPluginManagement.run(realText, searchbar.textInput, event);
	},

	/**
	 * 在后台打开URL
	 * @param {*} url
	 */
	openURLInBackground: function (url) {
		// 用于在后台打开URL，而不离开搜索栏
		searchbar.events.emit("url-selected", { url: url, background: true });

		var i = searchbar.element.querySelector(".searchbar-item:focus");
		if (i) {
			// 如果有焦点在awesomebar结果项上，移除焦点
			i.blur();
		}
	},

	/**
	 * 打开URL
	 * @param {string} url - 要打开的URL地址
	 * @param {Event} event - 触发打开URL的事件
	 * @returns {boolean} - 是否成功打开URL
	 */
	openURL: function (url, event) {
		// 运行URL处理程序，查看是否有插件能够处理该URL
		var hasURLHandler = searchbarPluginManagement.runURLHandlers(url);
		if (hasURLHandler) {
			return;
		}

		// 如果事件存在且按下了控制键或元键，则在后台打开URL
		if (event && (window.platformType === "mac" ? event.metaKey : event.ctrlKey)) {
			searchbar.openURLInBackground(url);
			return true;
		} else {
			// 否则，触发 "url-selected" 事件，并将URL和是否在后台打开作为参数传递
			searchbar.events.emit("url-selected", { url: url, background: false });

			// 聚焦到webview，以便页面上的自动聚焦输入框起作用
			webviews.focus();

			return false;
		}
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		/**将搜索栏添加到键盘导航组 */
		keyboardNavigation.addToGroup("searchbar", searchbar.element);

		// mod+enter 导航到搜索栏URL + ".com"

		/**
		 * 定义快捷键"completeSearchbar"
		 * 当按下快捷键时执行相应操作
		 */
		keyboardBindings.defineShortcut("completeSearchbar", function () {
			if (searchbar.textInput) {
				// 如果搜索栏是打开的
				var value = searchbar.textInput.value;

				// 如果文本已经是一个URL，则导航到该页面
				if (urlManagement.isPossibleURL(value)) {
					searchbar.events.emit("url-selected", { url: value, background: false });
				} else {
					// 否则，将文本解析为URL并触发 "url-selected" 事件
					searchbar.events.emit("url-selected", { url: urlManagement.parse(value + ".com"), background: false });
				}
			}
		});
	},
};

searchbar.initialize();

searchbarPluginManagement.initialize(searchbar.openURL);

module.exports = searchbar;
