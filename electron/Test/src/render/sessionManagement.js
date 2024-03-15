const settingManagement = require("../settings/renderSettingManagement.js");

const uiManagement = require("./uiManagement.js");
const tabManagement = require("./tabManagement.js");

const tabEditManagement = require("./navbar/tabEditManagement.js");
const taskOverlay = require("./taskOverlay/taskOverlayManagement.js");

/**
 * 会话管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日11:44:02
 */
const sessionManagement = {
	/**保存会话数据的文件路径 */
	savePath: window.globalArgs["user-data-path"] + (window.platformType === "windows" ? "\\sessionRestore.json" : "/sessionRestore.json"),

	/** */
	previousState: null,

	/**
	 * 保存会话数据
	 * @param {boolean} forceSave 是否强制保存
	 * @param {boolean} sync 是否同步保存
	 */
	save: function (forceSave, sync) {
		// 只有一个窗口（被聚焦的）应该负责保存会话恢复数据
		if (!document.body.classList.contains("focused")) {
			return;
		}

		var stateString = JSON.stringify(window.tasks.getStringifyableState());

		var data = {
			version: 2,
			state: JSON.parse(stateString),
			saveTime: Date.now(),
		};

		// 保存除私密标签以外的所有标签

		for (var i = 0; i < data.state.tasks.length; i++) {
			data.state.tasks[i].tabs = data.state.tasks[i].tabs.filter(function (tab) {
				return !tab.private;
			});
		}

		// 如果启动选项是“打开一个新的空白任务”，则不保存当前任务中的任何标签
		if (settingManagement.get("startupTabOption") === 3) {
			for (var i = 0; i < data.state.tasks.length; i++) {
				if (window.tasks.get(data.state.tasks[i].id).selectedInWindow) {
					// 需要重新获取任务，因为临时属性已被删除
					data.state.tasks[i].tabs = [];
				}
			}
		}

		// 强制保存或会话数据发生变化时才进行保存
		if (forceSave === true || stateString !== sessionManagement.previousState) {
			if (sync === true) {
				fs.writeFileSync(sessionManagement.savePath, JSON.stringify(data));
			} else {
				fs.writeFile(sessionManagement.savePath, JSON.stringify(data), function (err) {
					if (err) {
						console.warn(err);
					}
				});
			}
			sessionManagement.previousState = stateString;
		}
	},

	/**
	 * 从文件中恢复会话数据
	 */
	restoreFromFile: function () {
		var savedStringData;

		try {
			savedStringData = fs.readFileSync(sessionManagement.savePath, "utf-8");
		} catch (e) {
			console.warn("failed to read session restore data", e);
		}

		var startupConfigOption = settingManagement.get("startupTabOption") || 2;

		/*
		 * 1 - reopen last task
		 * 2 - open new task, keep old tabs in background
		 * 3 - discard old tabs and open new task
		 */

		try {
			// 第一次运行，显示导览
			if (!savedStringData) {
				// 创建一个新的任务
				window.tasks.setSelected(window.tasks.add());

				var newTabId = window.tasks.getSelected().tabs.add({
					// url: "https://zhongjyuan.club",
					url: "https://gitee.com/zhongjyuan",
				});

				uiManagement.addTab(newTabId, {
					enterEditMode: false,
				});

				return;
			}

			var data = JSON.parse(savedStringData);

			// 数据无法恢复
			if ((data.version && data.version !== 2) || (data.state && data.state.tasks && data.state.tasks.length === 0)) {
				window.tasks.setSelected(window.tasks.add());

				uiManagement.addTab(window.tasks.getSelected().tabs.add());

				return;
			}

			// 添加保存的任务

			data.state.tasks.forEach(function (task) {
				// 恢复任务项
				window.tasks.add(task);

				/*
				 * 如果任务只包含私密标签，会话数据中不会包含任何标签，但是任务必须始终至少有一个标签，因此如果任务没有标签，则创建一个新的空标签。
				 */
				if (task.tabs.length === 0) {
					window.tasks.get(task.id).tabs.add();
				}
			});

			var mostRecentTasks = window.tasks.slice().sort((a, b) => {
				return window.tasks.getLastActivity(b.id) - window.tasks.getLastActivity(a.id);
			});

			if (mostRecentTasks.length > 0) {
				window.tasks.setSelected(mostRecentTasks[0].id);
			}

			// 切换到之前选择的任务
			if (window.tasks.getSelected().tabs.isEmpty() || startupConfigOption === 1) {
				uiManagement.switchTask(mostRecentTasks[0].id);
				if (window.tasks.getSelected().tabs.isEmpty()) {
					tabEditManagement.show(window.tasks.getSelected().tabs.getSelected());
				}
			}

			// 尝试重用之前的空任务
			else {
				window.createdNewTaskOnStartup = true;
				var lastTask = window.tasks.getAtIndex(window.tasks.getLength() - 1);
				if (lastTask && lastTask.tabs.isEmpty() && !lastTask.name) {
					uiManagement.switchTask(lastTask.id);
					tabEditManagement.show(lastTask.tabs.getSelected());
				} else {
					uiManagement.addTask();
				}
			}
		} catch (e) {
			// 恢复会话数据时发生错误

			console.error("restoring session failed: ", e);

			var backupSavePath = require("path").join(window.globalArgs["user-data-path"], "sessionRestoreBackup-" + Date.now() + ".json");

			fs.writeFileSync(backupSavePath, savedStringData);

			// 销毁恢复过程中创建的标签
			tabManagement.initialize();

			// 创建一个带有错误信息的新标签
			var newTask = window.tasks.add();

			var newSessionErrorTab = window.tasks.get(newTask).tabs.add({
				url: "file://" + __dirname + "/pages/error/sessionRestore.html?backupLoc=" + encodeURIComponent(backupSavePath),
			});

			uiManagement.switchTask(newTask);
			uiManagement.switchTab(newSessionErrorTab);
		}
	},

	/**
	 * 与窗口同步会话数据
	 */
	syncWithWindow: function () {
		const data = window.ipc.sendSync("request-tab-state");
		console.log("got from window", data);

		// 恢复任务项
		data.tasks.forEach(function (task) {
			window.tasks.add(task, undefined, false);
		});

		// 在此窗口中重用现有任务或创建新任务
		// 与 windowSync.js 相同
		var newTaskCandidates = window.tasks
			.filter((task) => task.tabs.isEmpty() && !task.selectedInWindow && !task.name)
			.sort((a, b) => {
				return window.tasks.getLastActivity(b.id) - window.tasks.getLastActivity(a.id);
			});

		if (newTaskCandidates.length > 0) {
			uiManagement.switchTask(newTaskCandidates[0].id);
			tabEditManagement.show(window.tasks.getSelected().tabs.getSelected());
		} else {
			uiManagement.addTask();
		}
	},

	/**
	 * 恢复会话
	 */
	restore: function () {
		if (Object.hasOwn(window.globalArgs, "initial-window")) {
			sessionManagement.restoreFromFile();
		} else {
			sessionManagement.syncWithWindow();
		}

		if (settingManagement.get("newWindowOption") === 2 && !Object.hasOwn(window.globalArgs, "launch-window")) {
			taskOverlay.show();
		}
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		setInterval(sessionManagement.save, 30000);

		window.onbeforeunload = function (e) {
			sessionManagement.save(true, true);
			// 用于通知其他窗口，此窗口中的任务不再打开
			// 这理想情况下应该在 windowSync 中完成，但需要同步运行，而 windowSync 不支持
			window.ipc.send("tab-state-change", [["task-updated", window.tasks.getSelected().id, "selectedInWindow", null]]);
		};

		window.ipc.on("read-tab-state", function (e) {
			window.ipc.send("return-tab-state", window.tasks.getCopyableState());
		});
	},
};

module.exports = sessionManagement;
