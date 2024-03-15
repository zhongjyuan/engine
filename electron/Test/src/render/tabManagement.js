const Task = require("./tab/Task.js");

/**
 * 标签页管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日11:41:50
 */
const tabManagement = {
	/**
	 * 初始化函数
	 */
	initialize: function () {
		// 创建全局变量tasks并初始化为一个新的Task实例
		window.tasks = new Task();

		// 初始化tabs变量为undefined
		window.tabs = undefined;
	},
};

module.exports = tabManagement;
