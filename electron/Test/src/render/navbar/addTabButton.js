const uiManagement = require("../uiManagement.js");

/**
 * 添加标签页按钮对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月18日18:33:56
 */
const addTabButton = {
	/**元素对象 */
	element: document.getElementById("add-tab-button"),

	/**
	 * 初始化
	 */
	initialize: function () {
		// 获取“添加标签页”按钮元素，并为其添加点击事件监听器
		addTabButton.element.addEventListener("click", function (e) {
			// 当按钮被点击时，调用 uiManagement 模块的 addTab 方法添加新的标签页
			uiManagement.addTab();
		});
	},
};

module.exports = addTabButton;
