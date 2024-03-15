const tabBarManagement = require("./tabBarManagement.js");

/**
 * 标签页活动管理对象(为标签页添加一个功能，即当标签页长时间未活动时，将其视觉上进行淡化显示)
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日12:37:38
 */
const tabActivityManagement = {
	/** 指定标签页长时间未活动时的阈值时间（毫秒） */
	minFadeAge: 330000, // 5.5 minutes

	/**
	 * 刷新标签页状态
	 */
	refresh: function () {
		window.requestAnimationFrame(function () {
			// 获取当前所有标签页的列表
			var tabSet = window.tabs.get();

			// 获取当前被选中的标签页
			var selected = window.tabs.getSelected();

			// 获取当前时间
			var time = Date.now();

			// 遍历所有标签页
			tabSet.forEach(function (tab) {
				// 如果当前标签页是被选中的标签页，则不进行淡化处理
				if (selected === tab.id) {
					tabBarManagement.getTab(tab.id).classList.remove("fade");
					return;
				}

				// 如果标签页已经超过一定时间没有活动，并且不是当前选中的标签页，则进行淡化处理
				if (time - tab.lastActivity > tabActivityManagement.minFadeAge) {
					tabBarManagement.getTab(tab.id).classList.add("fade");
				} else {
					tabBarManagement.getTab(tab.id).classList.remove("fade");
				}
			});
		});
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		// 每隔一定时间刷新标签页状态
		setInterval(tabActivityManagement.refresh, 7500); // Refresh every 7.5 seconds

		// 监听标签页选择事件，当选择不同标签页时刷新标签页状态
		window.tasks.on("tab-selected", tabActivityManagement.refresh);
	},
};

module.exports = tabActivityManagement;
