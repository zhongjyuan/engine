/**
 * 主题管理对象(与render/utils/themeManagement功能一样[无node])
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月19日19:32:07
 */
const themeManagement = {
	/**
	 * 启用深色模式
	 */
	enableDarkMode: function () {
		// 在 body 标签中添加 class 为 dark-mode 的样式类
		document.body.classList.add("dark-mode");

		// 将 isDarkMode 属性设置为 true
		window.isDarkMode = true;

		// 使用 requestAnimationFrame 方法，在下一次重绘前执行回调函数
		window.requestAnimationFrame(function () {
			// 向 window 对象发送自定义事件 themechange
			window.dispatchEvent(new CustomEvent("themechange"));
		});
	},

	/**
	 * 禁用深色模式
	 */
	disableDarkMode: function () {
		// 在 body 标签中移除 class 为 dark-mode 的样式类
		document.body.classList.remove("dark-mode");

		// 将 isDarkMode 属性设置为 false
		window.isDarkMode = false;

		// 使用 requestAnimationFrame 方法，在下一次重绘前执行回调函数
		window.requestAnimationFrame(function () {
			// 向 window 对象发送自定义事件 themechange
			window.dispatchEvent(new CustomEvent("themechange"));
		});
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		// 监听 darkThemeIsActive 设置的更改事件
		settingManagement.listen("darkThemeIsActive", (value) => {
			value === true ? themeManagement.enableDarkMode() : themeManagement.disableDarkMode();
		});
	},
};

themeManagement.initialize();
