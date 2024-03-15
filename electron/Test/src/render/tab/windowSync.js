const uiManagement = require("../uiManagement.js");

const taskOverlayManagement = require("../taskOverlay/taskOverlayManagement.js");

/**
 * 窗口同步对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月19日19:51:49
 */
const windowSync = {
	/**延迟发送事件的定时器 */
	syncTimeout: null,

	/**待发送到主进程的事件列表 */
	pendingEvents: [],

	/**
	 * 将 pendingEvents 中的事件发送到主进程
	 */
	sendEvents: function () {
		// 发送窗口状态变化事件到主进程
		window.ipc.send("tab-state-change", windowSync.pendingEvents);

		// 清空待发送事件列表
		windowSync.pendingEvents = [];

		// 重置同步超时定时器
		windowSync.syncTimeout = null;
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		// 监听所有任务相关事件
		window.tasks.on("*", function (...data) {
			// 如果事件类型是状态同步变化，则跳过
			if (data[0] === "state-sync-change") {
				return;
			}

			// 将事件数据添加到待发送事件列表
			windowSync.pendingEvents.push(data);

			// 如果同步超时定时器不存在
			if (!windowSync.syncTimeout) {
				// 设置延迟发送事件
				windowSync.syncTimeout = setTimeout(windowSync.sendEvents, 0);
			}
		});

		// 监听来自主进程的窗口状态变化事件
		window.ipc.on("tab-state-change-receive", function (e, data) {
			const { sourceWindowId, events } = data;
			events.forEach(function (event) {
				const priorSelectedTask = window.tasks.getSelected().id;

				// close window if its task is destroyed
				if (
					(event[0] === "task-destroyed" && event[1] === priorSelectedTask) ||
					(event[0] === "tab-destroyed" && event[2] === priorSelectedTask && window.tasks.getSelected().tabs.count() === 1)
				) {
					window.ipc.invoke("close");
					window.ipc.removeAllListeners("tab-state-change-receive");
					return;
				}

				switch (event[0]) {
					case "task-added":
						window.tasks.add(event[2], event[3], false);
						break;
					case "task-selected":
						window.tasks.setSelected(event[1], false, sourceWindowId);
						break;
					case "task-destroyed":
						window.tasks.destroy(event[1], false);
						break;
					case "tab-added":
						window.tasks.get(event[4]).tabs.add(event[2], event[3], false);
						break;
					case "tab-updated":
						var obj = {};
						obj[event[2]] = event[3];
						window.tasks.get(event[4]).tabs.update(event[1], obj, false);
						break;
					case "task-updated":
						var obj = {};
						obj[event[2]] = event[3];
						window.tasks.update(event[1], obj, false);
						break;
					case "tab-selected":
						window.tasks.get(event[2]).tabs.setSelected(event[1], false);
						break;
					case "tab-destroyed":
						window.tasks.get(event[2]).tabs.destroy(event[1], false);
						break;
					case "tab-splice":
						window.tasks.get(event[1]).tabs.spliceNoEmit(...event.slice(2));
						break;
					case "state-sync-change":
						break;
					default:
						throw new Error("unimplemented event");
				}

				// UI updates

				if (event[0] === "task-selected" && event[1] === priorSelectedTask) {
					// our task is being taken by another window
					//switch to an empty task not open in any window, if possible
					var newTaskCandidates = window.tasks
						.filter((task) => task.tabs.isEmpty() && !task.selectedInWindow && !task.name)
						.sort((a, b) => {
							return window.tasks.getLastActivity(b.id) - window.tasks.getLastActivity(a.id);
						});

					if (newTaskCandidates.length > 0) {
						uiManagement.switchTask(newTaskCandidates[0].id);
					} else {
						uiManagement.addTask();
					}

					taskOverlayManagement.show();
				}

				//if a tab was added or removed from our task, force a rerender
				if ((event[0] === "tab-splice" && event[1] === priorSelectedTask) || (event[0] === "tab-destroyed" && event[2] === priorSelectedTask)) {
					uiManagement.switchTask(window.tasks.getSelected().id);
					uiManagement.switchTab(window.tabs.getSelected());
				}
			});

			// 发射自定义的状态同步变化事件，通知其他模块或组件状态变化
			window.tasks.emit("state-sync-change");
		});
	},
};

module.exports = windowSync;
