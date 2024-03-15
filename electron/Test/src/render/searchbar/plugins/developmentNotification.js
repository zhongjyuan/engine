const searchbarPluginManagement = require("../searchbarPluginManagement.js");

/**
 * 开发模式通知插件对象
 */
const developmentNotificationPlugin = {
	/**
	 * 初始化
	 */
	initialize: function () {
		// 注册名为“developmentModeNotification”的搜索栏插件
		searchbarPluginManagement.register("developmentModeNotification", {
			index: 0, // 插件在搜索栏中的位置
			trigger: function (text) {
				// 触发插件的条件：全局变量window.globalArgs中存在“development-mode”属性
				return "development-mode" in window.globalArgs;
			},
			showResults: function () {
				// 显示结果的函数
				searchbarPluginManagement.reset("developmentModeNotification"); // 重置插件
				searchbarPluginManagement.addResult("developmentModeNotification", {
					title: "Development Mode Enabled", // 添加一条包含标题“Development Mode Enabled”的结果
				});
			},
		});
	},
};

module.exports = developmentNotificationPlugin;
