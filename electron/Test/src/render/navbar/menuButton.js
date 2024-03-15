const settingManagement = require("../../settings/renderSettingManagement.js");

const keyboardBinding = require("../keyboardBinding.js");

/**
 * 菜单按钮对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日12:34:40
 */
const menuButton = {
	/**元素对象 */
	element: document.getElementById("menu-button"),

	/**
	 * 显示二级菜单的方法
	 */
	showSecondaryMenu: function () {
		// 获取菜单按钮和导航栏的位置信息
		var navbar = document.getElementById("navbar");
		var navbarRect = navbar.getBoundingClientRect();

		var buttonRect = menuButton.element.getBoundingClientRect();

		// 发送消息给主进程，通知其显示二级菜单，并传递菜单的位置信息
		window.ipc.send("showSecondaryMenu", {
			x: Math.round(buttonRect.left),
			y: Math.round(navbarRect.bottom),
		});
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		// 为菜单按钮添加点击事件监听器，点击时显示二级菜单
		menuButton.element.addEventListener("click", function (e) {
			menuButton.showSecondaryMenu();
		});

		// 定义快捷键 "showMenu"，用于显示二级菜单
		keyboardBinding.defineShortcut("showMenu", function () {
			// 如果不使用独立标题栏，并且当前环境是 Windows 或 Linux，则显示二级菜单
			if (!settingManagement.get("useSeparateTitlebar") && (window.platformType === "windows" || window.platformType === "linux")) {
				menuButton.showSecondaryMenu();
			}
		});
	},
};

module.exports = menuButton;
