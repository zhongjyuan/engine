const settingManagement = require("../settings/renderSettingManagement.js");

const searchEngine = require("./utils/searchEngine.js");
const urlManagement = require("./utils/urlManagement.js");

const focusMode = require("./focusMode.js");

const statisticalManagement = require("./statisticalManagement.js");
const { webviews } = require("./webviewManagement.js");

const tabBarManagement = require("./navbar/tabBarManagement.js");
const tabEditManagement = require("./navbar/tabEditManagement.js");

const searchbar = require("./searchbar/searchbar.js");

/**
 * UI 管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日11:38:04
 */
const uiManagement = {
	/**
	 * 创建一个新任务(标签页分组)
	 */
	addTask: function () {
		// 设置当前选中的任务为新创建的任务
		window.tasks.setSelected(window.tasks.add());

		// 更新标签栏的显示
		tabBarManagement.updateAll();

		// 添加一个新标签页
		uiManagement.addTab();
	},

	/**
	 * 更改当前选中的任务并更新用户界面
	 * @param {number} id - 要切换到的任务的ID
	 */
	switchTask: function (id) {
		// 设置选中的任务
		window.tasks.setSelected(id);

		// 更新标签栏
		tabBarManagement.updateAll();

		// 获取任务的数据
		var task = window.tasks.get(id);

		// 如果任务有标签页
		if (task.tabs.count() > 0) {
			var selectedTab = task.tabs.getSelected();

			// 如果任务没有选中的标签页，则切换到最近活动的标签页
			if (!selectedTab) {
				selectedTab = task.tabs.get().sort(function (a, b) {
					return b.lastActivity - a.lastActivity;
				})[0].id;
			}

			// 切换到选中的标签页
			uiManagement.switchTab(selectedTab);
		} else {
			// 创建新的标签页
			uiManagement.addTab();
		}

		// 设置窗口标题
		uiManagement.setWindowTitle(task);
	},

	/**
	 * 销毁一个任务对象及其关联的 Webview
	 * @param {number} id - 任务的ID
	 */
	destroyTask: function (id) {
		var task = window.tasks.get(id);

		// 遍历任务中的每个标签页，并销毁它们对应的 Webview
		task.tabs.forEach(function (tab) {
			webviews.destroy(tab.id);
		});

		// 销毁任务对象
		window.tasks.destroy(id);
	},

	/**
	 * 关闭一个任务，并切换到下一个最近使用的任务或创建一个新的任务
	 * @param {number} taskId - 要关闭的任务的ID
	 * @returns {number} - 新创建的任务的ID或切换到的任务的ID
	 */
	closeTask: function (taskId) {
		// 记录当前选中的任务
		var previousCurrentTask = window.tasks.getSelected().id;

		// 销毁指定的任务
		uiManagement.destroyTask(taskId);

		// 如果当前选中的任务已被销毁，则需要找到另一个任务进行切换
		if (taskId === previousCurrentTask) {
			// 如果没有任务剩余，则创建一个新任务
			if (window.tasks.getLength() === 0) {
				return uiManagement.addTask();
			}

			// 切换到最近活动的任务
			else {
				// 遍历所有任务，返回每个任务的ID和最近活动时间
				var recentTaskList = window.tasks.map(function (task) {
					return { id: task.id, lastActivity: window.tasks.getLastActivity(task.id) };
				});

				// 找到最近活动的任务
				const mostRecent = recentTaskList.reduce((latest, current) => (current.lastActivity > latest.lastActivity ? current : latest));

				// 切换到最近活动的任务
				return uiManagement.switchTask(mostRecent.id);
			}
		}
	},

	/**
	 * 创建一个新的标签页，并进行相关操作
	 * @param {number} [tabId=tabs.add()] - 标签页的ID，默认为新添加的标签页的ID
	 * @param {Object} [options={}] - 创建选项，可配置是否进入编辑模式和后台打开等
	 * @param {boolean} [options.enterEditMode=true] - 是否在创建标签页时进入编辑模式
	 * @param {boolean} [options.openInBackground=false] - 是否在后台打开标签页而不切换到它
	 */
	addTab: function (tabId = window.tabs.add(), options = {}) {
		/*
		 * 如果以下任一条件成立，则添加新标签页时应销毁当前标签页：
		 * 当前标签页为空且非私密，而新标签页是私密的
		 * 当前标签页为空且新标签页有URL
		 */

		if (
			!options.openInBackground &&
			!window.tabs.get(window.tabs.getSelected()).url &&
			((!window.tabs.get(window.tabs.getSelected()).private && window.tabs.get(tabId).private) || window.tabs.get(tabId).url)
		) {
			// 销毁当前标签页
			uiManagement.destroyTab(window.tabs.getSelected());
		}

		// 在标签栏中添加标签页
		tabBarManagement.addTab(tabId);

		// 在Webview中添加标签页
		webviews.add(tabId);

		// 根据选项决定是否聚焦到Webview
		if (!options.openInBackground) {
			uiManagement.switchTab(tabId, {
				focusWebview: options.enterEditMode === false,
			});

			// 显示标签编辑器
			if (options.enterEditMode !== false) {
				tabEditManagement.show(tabId);
			}
		}

		// 将新标签页滚动到可见区域
		else {
			tabBarManagement.getTab(tabId).scrollIntoView();
		}
	},

	/**
	 * 切换到指定的标签页，并更新 webview、状态、标签栏等
	 * @param {*} id - 要切换到的标签页的ID
	 * @param {*} options - 选项参数
	 */
	switchTab: function (id, options) {
		options = options || {};

		// 设置选中的标签页
		window.tabs.setSelected(id);

		// 设置活跃的标签页
		tabBarManagement.setActiveTab(id);

		// 如果选项中未明确指定不聚焦 webview，则聚焦 webview
		webviews.setSelected(id, {
			focus: options.focusWebview !== false,
		});

		// 隐藏标签编辑器
		tabEditManagement.hide();

		// 如果标签页没有 URL，则添加 "is-ntp" 类到 body 元素中
		if (!window.tabs.get(id).url) {
			document.body.classList.add("is-ntp");
		}

		// 如果标签页有 URL，则移除 "is-ntp" 类
		else {
			document.body.classList.remove("is-ntp");
		}
	},

	/**
	 * 销毁一个标签页及其关联的 Webview
	 * @param {number} id - 要销毁的标签页的ID
	 */
	destroyTab: function (id) {
		// 从标签栏中移除标签页
		tabBarManagement.removeTab(id);

		// 从状态中移除标签页并返回该标签页的索引
		window.tabs.destroy(id);

		// 销毁 Webview
		webviews.destroy(id);
	},

	/**
	 * 关闭一个标签页，并切换到下一个标签页或创建一个新的标签页
	 * @param {number} tabId - 要关闭的标签页的ID
	 */
	closeTab: function (tabId) {
		/* 在焦点模式下禁用 */
		if (focusMode.enabled()) {
			focusMode.warn();
			return;
		}

		// 如果要关闭的标签页是当前选中的标签页
		if (tabId === window.tabs.getSelected()) {
			var currentIndex = window.tabs.getIndex(window.tabs.getSelected());
			var nextTab = window.tabs.getAtIndex(currentIndex - 1) || window.tabs.getAtIndex(currentIndex + 1);

			// 销毁指定的标签页
			uiManagement.destroyTab(tabId);

			// 切换到下一个标签页
			if (nextTab) {
				uiManagement.switchTab(nextTab.id);
			}

			// 创建新的标签页
			else {
				uiManagement.addTab();
			}
		}

		// 销毁指定的标签页
		else {
			uiManagement.destroyTab(tabId);
		}
	},

	/**
	 * 将指定的标签页向左移动一格
	 * @param {number} [tabId=window.tabs.getSelected()] - 标签页的ID，默认为当前选中的标签页的ID
	 */
	moveTabLeft: function (tabId = window.tabs.getSelected()) {
		window.tabs.moveBy(tabId, -1);
		tabBarManagement.updateAll();
	},

	/**
	 * 将指定的标签页向右移动一格
	 * @param {number} [tabId=window.tabs.getSelected()] - 标签页的ID，默认为当前选中的标签页的ID
	 */
	moveTabRight: function (tabId = window.tabs.getSelected()) {
		window.tabs.moveBy(tabId, 1);
		tabBarManagement.updateAll();
	},

	/**
	 * 更改当前选中的任务并更新用户界面
	 * @param {*} task - 任务对象
	 */
	setWindowTitle: function (task) {
		// 如果任务有名称，则将任务名称设置为窗口标题，如果名称超过100个字符，则截断并添加省略号
		if (task.name) {
			document.title = task.name.length > 100 ? task.name.substring(0, 100) + "..." : task.name;
		}

		// 如果任务没有名称，则将窗口标题设置为 "zhongjyuan"
		else {
			document.title = "zhongjyuan";
		}
	},

	/**
	 * 初始化设置管理模块
	 */
	initialize: function () {
		/** 监听任务更新事件，当任务名称发生变化且当前选中的任务被更新时，更新窗口标题 */
		window.tasks.on("task-updated", function (id, key) {
			// 如果更新的是任务名称且更新的任务为当前选中的任务，则更新窗口标题
			if (key === "name" && id === window.tasks.getSelected().id) {
				uiManagement.setWindowTitle(window.tasks.get(id));
			}
		});

		/** 监听任务更新事件，当标签页的 URL发生变化且当前选中的标签页被更新时，则移除 "is-ntp" 类 */
		window.tasks.on("tab-updated", function (id, key) {
			// 如果更新的是当前选中的标签页的 URL，则移除 "is-ntp" 类
			if (key === "url" && id === window.tabs.getSelected()) {
				document.body.classList.remove("is-ntp");
			}
		});

		/**当创建新标签页时的 webview 绑定事件处理 */
		webviews.bindEvent("new-tab", function (tabId, url, openInForeground) {
			var newTabId = window.tabs.add({
				url: url,
				private: window.tabs.get(tabId).private, // 从当前标签页继承私密状态
			});

			uiManagement.addTab(newTabId, {
				enterEditMode: false,
				openInBackground: !settingManagement.get("openTabsInForeground") && !openInForeground,
			});
		});

		/**当创建弹出窗口时的 webview 绑定事件处理 */
		webviews.bindEvent("did-create-popup", function (tabId, popupId, initialURL) {
			var popupTabId = window.tabs.add({
				url: initialURL, // 在大多数情况下，初始 URL 将在弹出窗口加载后被覆盖，但如果 URL 是一个下载文件，它将保持不变
				private: window.tabs.get(tabId).private, // 从当前标签页继承私密状态
			});

			// 添加弹出窗口的标签页到标签栏
			tabBarManagement.addTab(popupTabId);

			// 添加弹出窗口的 webview
			webviews.add(popupTabId, popupId);

			// 切换到弹出窗口的标签页
			uiManagement.switchTab(popupTabId);
		});

		/**关闭窗口的 webview 绑定 IPC 事件处理 */
		webviews.bindIPC("close-window", function (tabId, args) {
			// 关闭指定的标签页
			uiManagement.closeTab(tabId);
		});

		/**当通过搜索栏选中 URL 时的事件处理 */
		searchbar.events.on("url-selected", function (data) {
			// 增加搜索引擎的搜索次数统计
			var searchbarQuery = searchEngine.getSearch(urlManagement.parse(data.url));
			if (searchbarQuery) {
				statisticalManagement.incrementValue("searchCounts." + searchbarQuery.engine);
			}

			if (data.background) {
				var newTabId = window.tabs.add({
					url: data.url,
					private: window.tabs.get(window.tabs.getSelected()).private,
				});

				uiManagement.addTab(newTabId, {
					enterEditMode: false,
					openInBackground: true,
				});
			} else {
				webviews.update(window.tabs.getSelected(), data.url);
				tabEditManagement.hide();
			}
		});

		/**当标签栏选中标签页时的事件处理 */
		tabBarManagement.events.on("tab-selected", function (id) {
			// 切换到指定的标签页
			uiManagement.switchTab(id);
		});

		/**当标签栏关闭标签页时的事件处理 */
		tabBarManagement.events.on("tab-closed", function (id) {
			// 关闭指定的标签页
			uiManagement.closeTab(id);
		});

		/**设置文件视图的 IPC 事件处理 */
		window.ipc.on("set-file-view", function (e, data) {
			window.tabs.get().forEach(function (tab) {
				if (tab.url === data.url) {
					// 更新标签页的文件视图状态
					window.tabs.update(tab.id, { isFileView: data.isFileView });
				}
			});
		});
	},
};

uiManagement.initialize();

module.exports = uiManagement;
