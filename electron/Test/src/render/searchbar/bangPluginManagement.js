const fs = require("fs");

const { relativeDate } = require("../utils/formatManagement.js");

const focusMode = require("../focusMode.js");

const uiManagement = require("../uiManagement.js");
const { webviews } = require("../webviewManagement.js");

const bookmarkManagement = require("../bookmarkManagement.js");

const blockingButton = require("../navbar/blockingButton.js");
const tabEditManagement = require("../navbar/tabEditManagement.js");
const searchbarPluginManagement = require("../searchbar/searchbarPluginManagement.js");
const taskOverlayManagement = require("../taskOverlay/taskOverlayManagement.js");

const places = require("../places/places.js");
const bangsPlugin = require("./plugins/bangs.js");

/**
 * 感叹号插件管理对象(自定义命令)
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日19:53:18
 */
const bangPluginManagement = {
	/**
	 * 将当前标签移动到指定任务
	 * @param {*} taskId - 目标任务的 ID
	 */
	moveTask: function (taskId) {
		// 从当前任务中移除标签
		const currentTab = window.tabs.get(window.tabs.getSelected());

		window.tabs.destroy(currentTab.id);

		// 确保任务中至少存在一个标签
		if (window.tabs.count() === 0) {
			window.tabs.add();
		}

		// 将标签添加到指定任务中
		const newTask = window.tasks.get(taskId);
		newTask.tabs.add(currentTab, { atEnd: true });

		// 切换到新的任务和标签
		uiManagement.switchTask(newTask.id);
		uiManagement.switchTab(currentTab.id);

		// 显示任务覆盖
		taskOverlayManagement.show();

		// 设置任务覆盖自动隐藏
		setTimeout(function () {
			taskOverlayManagement.hide();
		}, 600);
	},

	/**
	 * 切换到指定任务
	 * @param {*} taskId - 目标任务的 ID
	 * @returns
	 */
	switchTask: function (taskId) {
		/* 在焦点模式下禁用 */
		if (focusMode.enabled()) {
			focusMode.warn();
			return;
		}

		// 如果没有指定任务，则显示所有任务
		if (!taskId) {
			taskOverlayManagement.show();
			return;
		}

		// 切换到指定任务
		uiManagement.switchTask(taskId);
	},

	/**
	 * 根据任务名称或索引返回对应的任务
	 * @param {*} text - 任务名称或索引
	 * @returns {Task} - 匹配到的任务实例
	 */
	getTaskByNameOrNumber: function (text) {
		// 将输入文本转换为数字
		const textAsNumber = parseInt(text);

		// 使用 find 方法查找匹配到的任务
		return window.tasks.find((task, index) => (task.name && task.name.toLowerCase() === text) || index + 1 === textAsNumber);
	},

	/**
	 * 根据最后活动时间排序的任务数组
	 * 如果存在搜索字符串，则使用基本模糊搜索过滤结果
	 * @param {*} text - 搜索字符串
	 * @returns {Array} - 排序和过滤后的任务数组
	 */
	searchAndSortTasks: function (text) {
		// 获取任务结果并添加最后活动时间属性
		let taskResults = window.tasks
			.filter((t) => t.id !== window.tasks.getSelected().id)
			.map((t) => Object.assign({}, { task: t }, { lastActivity: window.tasks.getLastActivity(t.id) }));

		// 根据最后活动时间进行排序
		taskResults = taskResults.sort(function (a, b) {
			return b.lastActivity - a.lastActivity;
		});

		if (text !== "") {
			// 模糊搜索
			const searchText = text.toLowerCase();

			// 使用搜索字符串过滤结果
			taskResults = taskResults.filter(function (t) {
				const task = t.task;
				const taskName = (task.name ? task.name : l("defaultTaskName").replace("%n", window.tasks.getIndex(task.id) + 1)).toLowerCase();
				const exactMatch = taskName.indexOf(searchText) !== -1;
				const fuzzyTitleScore = taskName.score(searchText, 0.5);

				return exactMatch || fuzzyTitleScore > 0.4;
			});
		}

		return taskResults;
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		// 注册自定义命令：查看设置
		bangsPlugin.registerCustomBang({
			phrase: "!settings",
			snippet: l("viewSettings"),
			isAction: true,
			fn: function (text) {
				webviews.update(window.tabs.getSelected(), "z://settings");
			},
		});

		// 注册自定义命令：返回
		bangsPlugin.registerCustomBang({
			phrase: "!back",
			snippet: l("goBack"),
			isAction: true,
			fn: function (text) {
				webviews.callAsync(window.tabs.getSelected(), "goBack");
			},
		});

		// 注册自定义命令：前进
		bangsPlugin.registerCustomBang({
			phrase: "!forward",
			snippet: l("goForward"),
			isAction: true,
			fn: function (text) {
				webviews.callAsync(window.tabs.getSelected(), "goForward");
			},
		});

		// 注册自定义命令：截屏
		bangsPlugin.registerCustomBang({
			phrase: "!screenshot",
			snippet: l("takeScreenshot"),
			isAction: true,
			fn: function (text) {
				setTimeout(function () {
					// wait so that the view placeholder is hidden
					window.ipc.send("saveViewCapture", { id: window.tabs.getSelected() });
				}, 400);
			},
		});

		// 注册自定义命令：清除历史记录
		bangsPlugin.registerCustomBang({
			phrase: "!clearhistory",
			snippet: l("clearHistory"),
			isAction: true,
			fn: function (text) {
				if (confirm(l("clearHistoryConfirmation"))) {
					places.deleteAllHistory();
					window.ipc.invoke("clearStorageData");
				}
			},
		});

		// 注册自定义命令：启用内容屏蔽
		bangsPlugin.registerCustomBang({
			phrase: "!enableblocking",
			snippet: l("enableBlocking"), // 显示在搜索建议中的文本
			isAction: true, // 是否为动作型命令
			fn: function (text) {
				// 调用内容屏蔽的启用方法
				blockingButton.enable(window.tabs.get(tabs.getSelected()).url);
			},
		});

		// 注册自定义命令：禁用内容屏蔽
		bangsPlugin.registerCustomBang({
			phrase: "!disableblocking",
			snippet: l("disableBlocking"),
			isAction: true,
			fn: function (text) {
				blockingButton.disable(window.tabs.get(window.tabs.getSelected()).url);
			},
		});

		// 注册自定义命令：移动到任务
		bangsPlugin.registerCustomBang({
			phrase: "!movetotask",
			snippet: l("moveToTask"),
			isAction: false,
			showSuggestions: function (text, input, event) {
				searchbarPluginManagement.reset("bangs");

				const taskResults = bangPluginManagement.searchAndSortTasks(text);

				taskResults.forEach(function (t, idx) {
					const task = t.task;
					const lastActivity = t.lastActivity;

					const taskName = task.name ? task.name : l("defaultTaskName").replace("%n", window.tasks.getIndex(task.id) + 1);

					const data = {
						title: taskName,
						secondaryText: relativeDate(lastActivity),
						fakeFocus: text && idx === 0,
						click: function () {
							tabEditManagement.hide();

							/* disabled in focus mode */
							if (focusMode.enabled()) {
								focusMode.warn();
								return;
							}

							bangPluginManagement.moveTask(task.id);
						},
					};

					searchbarPluginManagement.addResult("bangs", data);
				});
			},
			fn: function (text) {
				/* disabled in focus mode */
				if (focusMode.enabled()) {
					focusMode.warn();
					return;
				}

				// 使用第一个搜索结果
				// 如果没有搜索文本或没有结果，则需要创建一个新任务
				let task = bangPluginManagement.searchAndSortTasks(text)[0]?.task;
				if (!text || !task) {
					task = window.tasks.get(
						window.tasks.add(
							{
								name: text,
							},
							window.tasks.getIndex(window.tasks.getSelected().id) + 1
						)
					);
				}

				return bangPluginManagement.moveTask(task.id);
			},
		});

		// 注册自定义命令：切换任务
		bangsPlugin.registerCustomBang({
			phrase: "!task",
			snippet: l("switchToTask"),
			isAction: false,
			showSuggestions: function (text, input, event) {
				searchbarPluginManagement.reset("bangs");

				const taskResults = bangPluginManagement.searchAndSortTasks(text);

				taskResults.forEach(function (t, idx) {
					const task = t.task;
					const lastActivity = t.lastActivity;

					const taskName = task.name ? task.name : l("defaultTaskName").replace("%n", window.tasks.getIndex(task.id) + 1);

					const data = {
						title: taskName,
						secondaryText: relativeDate(lastActivity),
						fakeFocus: text && idx === 0,
						click: function () {
							tabEditManagement.hide();
							bangPluginManagement.switchTask(task.id);
						},
					};

					searchbarPluginManagement.addResult("bangs", data);
				});
			},
			fn: function (text) {
				if (text) {
					// switch to the first search result
					bangPluginManagement.switchTask(bangPluginManagement.searchAndSortTasks(text)[0].task.id);
				} else {
					taskOverlayManagement.show();
				}
			},
		});

		// 注册自定义命令：创建新任务
		bangsPlugin.registerCustomBang({
			phrase: "!newtask",
			snippet: l("createTask"), // 显示在搜索建议中的文本
			isAction: true, // 是否为动作型命令
			fn: function (text) {
				/* 在专注模式下禁用 */
				if (focusMode.enabled()) {
					focusMode.warn(); // 在专注模式下给出警告
					return;
				}

				taskOverlayManagement.show(); // 显示任务覆盖层

				setTimeout(function () {
					uiManagement.addTask(); // 调用添加任务的方法
					if (text) {
						window.tasks.update(window.tasks.getSelected().id, { name: text }); // 如果有文本，更新任务名称
					}
				}, 600);
			},
		});

		// 注册自定义命令：关闭任务
		bangsPlugin.registerCustomBang({
			phrase: "!closetask",
			snippet: l("closeTask"), // 显示在搜索建议中的文本
			isAction: false, // 是否为动作型命令
			fn: function (text) {
				const currentTask = window.tasks.getSelected(); // 获取当前选中的任务

				let taskToClose;
				if (text) {
					taskToClose = bangPluginManagement.getTaskByNameOrNumber(text); // 如果有文本，通过名称或编号获取要关闭的任务
				} else {
					taskToClose = window.tasks.getSelected(); // 否则关闭当前选中的任务
				}

				if (taskToClose) {
					uiManagement.closeTask(taskToClose.id); // 调用关闭任务的方法
					if (currentTask.id === taskToClose.id) {
						// 如果关闭的是当前任务
						taskOverlayManagement.show(); // 显示任务覆盖层
						setTimeout(function () {
							taskOverlayManagement.hide(); // 600 毫秒后隐藏任务覆盖层
						}, 600);
					}
				}
			},
		});

		// 注册自定义命令：命名任务
		bangsPlugin.registerCustomBang({
			phrase: "!nametask",
			snippet: l("nameTask"), // 显示在搜索建议中的文本
			isAction: false, // 是否为动作型命令
			fn: function (text) {
				window.tasks.update(window.tasks.getSelected().id, { name: text }); // 更新当前选中的任务名称
			},
		});

		// 注册自定义命令：导入书签
		bangsPlugin.registerCustomBang({
			phrase: "!importbookmarks",
			snippet: l("importBookmarks"), // 显示在搜索建议中的文本
			isAction: true, // 是否为动作型命令
			fn: async function () {
				const filePath = await window.ipc.invoke("showOpenDialog", {
					filters: [{ name: "HTML files", extensions: ["htm", "html"] }], // 限制文件选择对话框只能选择 HTML 文件
				});

				// 如果没有选择文件，则返回
				if (!filePath) {
					return;
				}

				fs.readFile(filePath[0], "utf-8", function (err, data) {
					// 以 UTF-8 编码读取文件内容
					if (err || !data) {
						console.warn(err); // 如果出现错误或者文件内容为空，则打印警告信息
						return;
					}
					bookmarkManagement.import(data); // 调用导入书签的方法，并传入文件内容
				});
			},
		});

		// 注册自定义命令：导出书签
		bangsPlugin.registerCustomBang({
			phrase: "!exportbookmarks",
			snippet: l("exportBookmarks"), // 显示在搜索建议中的文本
			isAction: true, // 是否为动作型命令
			fn: async function () {
				const data = await bookmarkManagement.exportAll(); // 导出所有书签数据
				// 保存结果
				const savePath = await window.ipc.invoke("showSaveDialog", { defaultPath: "bookmarks.html" }); // 弹出保存文件对话框，设置默认文件名为"bookmarks.html"

				fs.writeFileSync(savePath, data); // 将数据写入文件
			},
		});

		// 注册自定义命令：添加书签
		bangsPlugin.registerCustomBang({
			phrase: "!addbookmark",
			snippet: l("addBookmark"), // 显示在搜索建议中的文本
			fn: function (text) {
				const url = window.tabs.get(window.tabs.getSelected()).url; // 获取当前选中标签页的 URL
				if (url) {
					places.updateItem(
						url,
						{
							isBookmarked: true, // 将该 URL 设置为已收藏
							tags: text ? text.split(/\s/g).map((t) => t.replace("#", "").trim()) : [], // 如果有文本输入，则将其作为标签进行处理
						},
						() => {} // 更新完成后的回调函数，这里为空函数
					);
				}
			},
		});
	},
};

module.exports = bangPluginManagement;
