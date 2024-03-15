var uiManagement = require("../../uiManagement.js");

var searchbarHelper = require("../searchbarHelper.js");
var searchbarPluginManagement = require("../searchbarPluginManagement.js");

/**
 *
 */
const restoreTaskPlugin = {
	/**
	 * 获取格式化标题
	 * @param {*} tab
	 * @returns
	 */
	getFormattedTitle: function (tab) {
		if (tab.title) {
			var title = searchbarHelper.getRealTitle(tab.title);
			return '"' + (title.length > 45 ? title.substring(0, 45).trim() + "..." : title) + '"';
		} else {
			return l("newTabLabel");
		}
	},

	/**
	 * 显示恢复任务
	 */
	showRestoreTask: function () {
		searchbarPluginManagement.reset("restoreTask"); // 重置插件

		// 获取倒数第二个任务
		var lastTask = window.tasks.slice().sort((a, b) => {
			return window.tasks.getLastActivity(b.id) - window.tasks.getLastActivity(a.id);
		})[1];

		var recentTabs = lastTask.tabs
			.get()
			.sort((a, b) => b.lastActivity - a.lastActivity)
			.slice(0, 3); // 获取最近三个标签页

		var taskDescription;
		if (recentTabs.length === 1) {
			taskDescription = restoreTaskPlugin.getFormattedTitle(recentTabs[0]);
		} else if (recentTabs.length === 2) {
			taskDescription = l("taskDescriptionTwo")
				.replace("%t", restoreTaskPlugin.getFormattedTitle(recentTabs[0]))
				.replace("%t", restoreTaskPlugin.getFormattedTitle(recentTabs[1]));
		} else {
			taskDescription = l("taskDescriptionThree")
				.replace("%t", restoreTaskPlugin.getFormattedTitle(recentTabs[0]))
				.replace("%t", restoreTaskPlugin.getFormattedTitle(recentTabs[1]))
				.replace("%n", lastTask.tabs.count() - 2);
		}

		searchbarPluginManagement.addResult("restoreTask", {
			title: l("returnToTask"),
			descriptionBlock: taskDescription,
			icon: "carbon:redo",
			click: function (e) {
				var thisTask = window.tasks.getSelected().id;
				uiManagement.switchTask(lastTask.id);
				uiManagement.closeTask(thisTask);
			},
		});
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		searchbarPluginManagement.register("restoreTask", {
			index: 0, // 索引
			trigger: function (text) {
				return !text && performance.now() < 15000 && window.tasks.getSelected().tabs.isEmpty() && window.createdNewTaskOnStartup; // 触发条件
			},
			showResults: restoreTaskPlugin.showRestoreTask, // 显示结果函数
		});
	},
};

module.exports = restoreTaskPlugin; // 导出初始化函数
