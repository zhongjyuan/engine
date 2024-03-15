const dragula = require("dragula");

const keyboardNavigation = require("../utils/keyboardNavigation.js");

const focusMode = require("../focusMode.js");
const modalMode = require("../modalMode.js");

const keyboardBindings = require("../keyboardBinding.js");

const uiManagement = require("../uiManagement.js");
const { webviews } = require("../webviewManagement.js");

const tabBarManagement = require("../navbar/tabBarManagement.js");
const tabEditManagement = require("../navbar/tabEditManagement.js");

const taskOverlayBuilder = require("./taskOverlayBuilder.js");

/**
 * 任务覆盖层管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月19日19:53:23
 */
const taskOverlayManagement = {
	/**任务区域的 DOM 元素 */
	taskContainer: document.getElementById("task-area"),

	/**切换任务按钮的 DOM 元素 */
	taskSwitcherButton: document.getElementById("switch-task-button"),

	/**添加任务按钮的 DOM 元素 */
	addTaskButton: document.getElementById("add-task"),

	/**添加任务按钮内的 span 元素 */
	addTaskLabel: document.getElementById("add-task").querySelector("span"),

	/**任务覆盖层导航栏的 DOM 元素 */
	taskOverlayNavbar: document.getElementById("task-overlay-navbar"),

	/**是否显示任务覆盖层 */
	isShown: false,

	/**任务覆盖层元素 */
	overlayElement: document.getElementById("task-overlay"),

	/**滚动定时器 */
	draggingScrollInterval: null,

	/**拖动标签的 dragula 实例 */
	tabDragula: dragula({
		direction: "vertical", // 拖动方向为垂直方向
		mirrorContainer: document.getElementById("task-overlay"), // 镜像容器为任务覆盖层
		moves: function (el, source, handle, sibling) {
			// 禁止按钮拖动，防止意外拖动
			var n = handle;

			while (n) {
				if (n.tagName === "BUTTON") {
					return false;
				}
				n = n.parentElement;
			}

			return true;
		},
	}),

	/**拖动任务的 dragula 实例 */
	taskDragula: dragula({
		direction: "vertical", // 拖动方向为垂直方向
		mirrorContainer: document.getElementById("task-overlay"), // 镜像容器为任务覆盖层
		containers: [document.getElementById("task-area")], // 可拖动的容器为 taskContainer
		moves: function (el, source, handle, sibling) {
			// 忽略来自标签元素的拖动事件，因为它们将由另一个 dragula 实例处理
			// 同样忽略输入框，因为使用输入框作为拖动手柄会破坏文本选择功能
			var n = handle;

			while (n) {
				if (n.classList.contains("task-tab-item") || n.tagName === "INPUT") {
					return false;
				}
				n = n.parentElement;
			}

			return true;
		},
	}),

	/**
	 * 从菜单中添加任务
	 * @returns {void}
	 */
	addTaskFromMenu: function () {
		// 如果处于专注模式，则无法创建新任务
		if (modalMode.enabled()) {
			return;
		}

		// 如果处于焦点模式，则无法创建新任务，并显示警告
		if (focusMode.enabled()) {
			focusMode.warn();
			return;
		}

		// 调用 uiManagement 模块中的 addTask 函数来添加任务
		uiManagement.addTask();

		// 显示任务覆盖层
		taskOverlayManagement.show();

		setTimeout(function () {
			// 600ms 后隐藏任务覆盖层
			taskOverlayManagement.hide();

			// 显示选中的标签页编辑器
			tabEditManagement.show(window.tabs.getSelected());
		}, 600);
	},

	/**
	 * 通过任务 id 获取任务容器
	 * @param {*} id - 任务的 id
	 * @returns {HTMLElement} - 返回匹配指定选择器的第一个元素，如果找不到匹配元素，则返回 null。
	 */
	getTaskContainer: function (id) {
		return document.querySelector('.task-container[data-task="{id}"]'.replace("{id}", id));
	},

	/**
	 * 当拖动时鼠标移动的处理函数
	 * @param {*} e - 鼠标事件对象
	 */
	onMouseMoveWhileDragging: function (e) {
		// 清除之前设定的滚动定时器
		clearInterval(taskOverlayManagement.draggingScrollInterval);

		// 如果鼠标位置小于 100，则向上滚动任务容器
		if (e.pageY < 100) {
			// 每 16 毫秒向上滚动任务容器 5 像素
			taskOverlayManagement.draggingScrollInterval = setInterval(function () {
				taskOverlayManagement.taskContainer.scrollBy(0, -5);
			}, 16);
		}

		// 如果鼠标位置大于窗口高度减去 125，则向下滚动任务容器
		else if (e.pageY > window.innerHeight - 125) {
			// 每 16 毫秒向下滚动任务容器 5 像素
			taskOverlayManagement.draggingScrollInterval = setInterval(function () {
				taskOverlayManagement.taskContainer.scrollBy(0, 5);
			}, 16);
		}
	},

	/**
	 * 开始记录鼠标拖动
	 */
	startMouseDragRecording: function () {
		// 监听鼠标移动事件，调用 onMouseMoveWhileDragging 函数
		window.addEventListener("mousemove", taskOverlayManagement.onMouseMoveWhileDragging);
	},

	/**
	 * 结束记录鼠标拖动
	 */
	endMouseDragRecording: function () {
		// 移除鼠标移动事件的监听
		window.removeEventListener("mousemove", taskOverlayManagement.onMouseMoveWhileDragging);

		// 清除滚动定时器
		clearInterval(taskOverlayManagement.draggingScrollInterval);
	},

	/**
	 * 显示任务覆盖层
	 *
	 * @returns {void}
	 */
	show: function () {
		/* 在焦点模式下禁用 */
		if (focusMode.enabled()) {
			focusMode.warn();
			return;
		}

		webviews.requestPlaceholder("taskOverlay");

		// 给 body 添加样式，显示任务覆盖层
		document.body.classList.add("task-overlay-is-shown");

		// 隐藏标签编辑器
		tabEditManagement.hide();

		// 清空任务搜索输入框的值
		document.getElementById("task-search-input").value = "";

		// 将 isShown 设置为 true，表示任务覆盖层已显示
		this.isShown = true;

		// 给任务切换按钮添加 active 样式
		taskOverlayManagement.taskSwitcherButton.classList.add("active");

		// 渲染任务覆盖层
		taskOverlayManagement.render();

		// 显示任务覆盖层
		this.overlayElement.hidden = false;

		// 滚动并聚焦到选中的元素
		var currentTabElement = document.querySelector('.task-tab-item[data-tab="{id}"]'.replace("{id}", window.tasks.getSelected().tabs.getSelected()));

		if (currentTabElement) {
			currentTabElement.classList.add("fakefocus");
			currentTabElement.focus();
		}
	},

	/**
	 * 渲染任务覆盖层
	 *
	 * @returns {void}
	 */
	render: function () {
		// 设置 tabDragula 的容器为 addTaskButton
		taskOverlayManagement.tabDragula.containers = [taskOverlayManagement.addTaskButton];

		// 清空任务容器
		empty(taskOverlayManagement.taskContainer);

		// 显示任务元素
		window.tasks.forEach(function (task, index) {
			const el = taskOverlayBuilder.createTaskContainer(task, index, {
				tabSelect: function () {
					uiManagement.switchTask(task.id);

					uiManagement.switchTab(this.getAttribute("data-tab"));

					taskOverlayManagement.hide();
				},
				tabDelete: function (item) {
					var tabId = item.getAttribute("data-tab");

					window.tasks.get(task.id).tabs.destroy(tabId);

					webviews.destroy(tabId);

					tabBarManagement.updateAll();

					// 如果没有剩余的标签，移除任务
					if (task.tabs.count() === 0) {
						// 从任务覆盖层中移除任务元素
						taskOverlayManagement.getTaskContainer(task.id).remove();

						// 关闭任务
						uiManagement.closeTask(task.id);
					}
				},
			});

			// 将任务元素添加到任务容器中
			taskOverlayManagement.taskContainer.appendChild(el);

			// 将任务标签容器添加到 tabDragula 的容器中
			taskOverlayManagement.tabDragula.containers.push(el.getElementsByClassName("task-tabs-container")[0]);
		});
	},

	/**
	 * 隐藏任务覆盖层
	 *
	 * @returns {void}
	 */
	hide: function () {
		// 如果任务覆盖层已经显示
		if (this.isShown) {
			// 将 isShown 设置为 false
			this.isShown = false;

			// 隐藏覆盖层元素
			taskOverlayManagement.overlayElement.hidden = true;

			// 等待动画完成后移除标签元素
			setTimeout(function () {
				if (!taskOverlayManagement.isShown) {
					// 清空任务容器
					empty(taskOverlayManagement.taskContainer);

					// 隐藏任务覆盖层的占位符
					webviews.hidePlaceholder("taskOverlay");
				}
			}, 250);

			// 清空 tabDragula 的容器
			taskOverlayManagement.tabDragula.containers = [];

			// 从 body 的类中移除 task-overlay-is-shown 类
			document.body.classList.remove("task-overlay-is-shown");

			// 获取待删除的任务元素
			var pendingDeleteTasks = document.body.querySelectorAll(".task-container.deleting");
			for (var i = 0; i < pendingDeleteTasks.length; i++) {
				// 关闭待删除的任务
				uiManagement.closeTask(pendingDeleteTasks[i].getAttribute("data-task"));
			}

			// 如果当前标签已被删除，则切换到最近的标签
			if (!window.tabs.getSelected()) {
				var mostRecentTab = window.tabs.get().sort(function (a, b) {
					return b.lastActivity - a.lastActivity;
				})[0];

				if (mostRecentTab) {
					uiManagement.switchTab(mostRecentTab.id);
				}
			}

			// 强制 UI 重新渲染
			uiManagement.switchTask(window.tasks.getSelected().id);
			uiManagement.switchTab(window.tabs.getSelected());

			// 从 taskSwitcherButton 的类中移除 active 类
			taskOverlayManagement.taskSwitcherButton.classList.remove("active");
		}
	},

	/**
	 * 切换任务覆盖层的显示状态
	 *
	 * @returns {void}
	 */
	toggle: function () {
		// 隐藏任务覆盖层
		if (this.isShown) {
			taskOverlayManagement.hide();
		}

		// 显示任务覆盖层
		else {
			taskOverlayManagement.show();
		}
	},

	/**
	 * 初始化任务搜索功能
	 *
	 * @returns {void}
	 */
	initializeSearch: function () {
		var container = document.querySelector(".task-search-input-container");
		var input = document.getElementById("task-search-input");

		input.placeholder = l("tasksSearchTabs") + " (ZHONGJYUAN)";

		container.addEventListener("click", (e) => {
			e.stopPropagation();
			input.focus();
		});

		taskOverlayManagement.overlayElement.addEventListener("keyup", function (e) {
			if (e.key.toLowerCase() === "t" && document.activeElement.tagName !== "INPUT") {
				input.focus();
			}
		});

		input.addEventListener("input", function (e) {
			var search = input.value.toLowerCase().trim();

			if (!search) {
				// 重置覆盖层
				taskOverlayManagement.render();

				input.focus();

				return;
			}

			var totalTabMatches = 0;

			window.tasks.forEach(function (task) {
				var taskContainer = document.querySelector(`.task-container[data-task="${task.id}"]`);

				var taskTabMatches = 0;
				task.tabs.forEach(function (tab) {
					var tabContainer = document.querySelector(`.task-tab-item[data-tab="${tab.id}"]`);

					var searchText = (task.name + " " + tab.title + " " + tab.url).toLowerCase();

					const searchMatches = search.split(" ").every((word) => searchText.includes(word));
					if (searchMatches) {
						tabContainer.hidden = false;

						taskTabMatches++;
						totalTabMatches++;

						// 第一个匹配项
						if (totalTabMatches === 1) {
							tabContainer.classList.add("fakefocus");
						} else {
							tabContainer.classList.remove("fakefocus");
						}
					} else {
						tabContainer.hidden = true;
					}
				});

				if (taskTabMatches === 0) {
					taskContainer.hidden = true;
				} else {
					taskContainer.hidden = false;
					taskContainer.classList.remove("collapsed");
				}
			});
		});

		input.addEventListener("keypress", function (e) {
			if (e.keyCode === 13) {
				var firstTab = taskOverlayManagement.overlayElement.querySelector(".task-tab-item:not([hidden])");
				if (firstTab) {
					firstTab.click();
				}
			}
		});
	},

	/**
	 * 初始化任务覆盖层的功能。
	 */
	initialize: function () {
		// 初始化搜索功能。
		taskOverlayManagement.initializeSearch();

		// 添加键盘导航帮助器，用于处理任务覆盖层的键盘导航。
		keyboardNavigation.addToGroup("taskOverlay", taskOverlayManagement.overlayElement);

		// 当在标签栏上向下滑动时显示任务覆盖层。
		document.getElementById("navbar").addEventListener("wheel", function (e) {
			if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
				return;
			}

			if (e.deltaY < -30 && e.deltaX < 10) {
				taskOverlayManagement.show();

				e.stopImmediatePropagation();
			}
		});

		// 定义快捷键，用于切换任务覆盖层的显示/隐藏状态。
		keyboardBindings.defineShortcut("toggleTasks", function () {
			if (taskOverlayManagement.isShown) {
				taskOverlayManagement.hide();
			} else {
				taskOverlayManagement.show();
			}
		});

		// 处理按键事件，用于隐藏任务覆盖层。
		keyboardBindings.defineShortcut({ keys: "esc" }, function (e) {
			taskOverlayManagement.hide();
		});

		// 处理按键事件，用于进入编辑模式。
		keyboardBindings.defineShortcut("enterEditMode", function (e) {
			taskOverlayManagement.hide();
		});

		// 处理添加任务的操作。
		keyboardBindings.defineShortcut("addTask", taskOverlayManagement.addTaskFromMenu);

		window.ipc.on("addTask", taskOverlayManagement.addTaskFromMenu);

		/* 处理标签拖放事件，用于重新排列标签 */

		taskOverlayManagement.tabDragula.on("drag", function () {
			taskOverlayManagement.overlayElement.classList.add("is-dragging-tab");
		});

		taskOverlayManagement.tabDragula.on("dragend", function () {
			taskOverlayManagement.overlayElement.classList.remove("is-dragging-tab");
		});

		taskOverlayManagement.tabDragula.on("over", function (el, container, source) {
			if (container === taskOverlayManagement.addTaskButton) {
				taskOverlayManagement.addTaskButton.classList.add("drag-target");
			}
		});

		taskOverlayManagement.tabDragula.on("out", function (el, container, source) {
			if (container === taskOverlayManagement.addTaskButton) {
				taskOverlayManagement.addTaskButton.classList.remove("drag-target");
			}
		});

		taskOverlayManagement.tabDragula.on("drop", function (el, target, source, sibling) {
			var tabId = el.getAttribute("data-tab");

			// 从原来的任务中删除标签
			var previousTask = window.tasks.get(source.getAttribute("data-task"));
			var oldTab = previousTask.tabs.splice(previousTask.tabs.getIndex(tabId), 1)[0];

			// 如果被删除的标签是当前激活的，找到该任务中最近的标签，激活它。
			if (oldTab.selected) {
				var mostRecentTab = previousTask.tabs.get().sort(function (a, b) {
					return b.lastActivity - a.lastActivity;
				})[0];

				if (mostRecentTab) {
					previousTask.tabs.setSelected(mostRecentTab.id);
				}

				// 在新的任务中不应该被选中
				oldTab.selected = false;
			}

			// 如果原来的任务中没有任何标签了，则销毁该任务
			if (previousTask.tabs.count() === 0) {
				uiManagement.closeTask(previousTask.id);

				taskOverlayManagement.getTaskContainer(previousTask.id).remove();
			}

			var newTask;

			// 如果把标签拖到“添加任务”按钮上，则创建一个新的任务。
			if (target === taskOverlayManagement.addTaskButton) {
				newTask = window.tasks.get(window.tasks.add());

				// 从该按钮中删除标签，并重新创建在任务覆盖层中
				el.remove();
			}

			// 否则，将该标签添加到指定的任务中
			else {
				newTask = window.tasks.get(target.getAttribute("data-task"));
			}

			if (sibling) {
				var adjacentTadId = sibling.getAttribute("data-tab");
			}

			var newIdx;
			// 找到将标签插入新任务中的位置
			if (adjacentTadId) {
				newIdx = newTask.tabs.getIndex(adjacentTadId);
			} else {
				// 标签被插入到末尾
				newIdx = newTask.tabs.count();
			}

			// 在正确的位置插入标签
			newTask.tabs.splice(newIdx, 0, oldTab);

			tabBarManagement.updateAll();

			taskOverlayManagement.show();
		});

		/* 处理任务拖放事件，用于重新排列任务 */

		taskOverlayManagement.taskDragula.on("drop", function (el, target, source, sibling) {
			var droppedTaskId = el.getAttribute("data-task");
			if (sibling) {
				var adjacentTaskId = sibling.getAttribute("data-task");
			}

			// 从任务列表中删除该任务
			var droppedTask = window.tasks.splice(window.tasks.getIndex(droppedTaskId), 1)[0];

			// 找到它应该被插入的位置
			if (adjacentTaskId) {
				var newIdx = window.tasks.getIndex(adjacentTaskId);
			} else {
				var newIdx = window.tasks.getLength();
			}

			// 重新插入该任务
			window.tasks.splice(newIdx, 0, droppedTask);
		});

		/* 处理鼠标拖动事件，用于自动滚动容器 */

		taskOverlayManagement.tabDragula.on("drag", function () {
			taskOverlayManagement.startMouseDragRecording();
		});

		taskOverlayManagement.tabDragula.on("dragend", function () {
			taskOverlayManagement.endMouseDragRecording();
		});

		taskOverlayManagement.taskDragula.on("drag", function () {
			taskOverlayManagement.startMouseDragRecording();
		});

		taskOverlayManagement.taskDragula.on("dragend", function () {
			taskOverlayManagement.endMouseDragRecording();
		});

		// 更新界面和处理其他相关操作。
		taskOverlayManagement.taskSwitcherButton.title = l("viewTasks");
		taskOverlayManagement.addTaskLabel.textContent = l("newTask");

		taskOverlayManagement.taskSwitcherButton.addEventListener("click", function () {
			taskOverlayManagement.toggle();
		});

		taskOverlayManagement.addTaskButton.addEventListener("click", function (e) {
			uiManagement.switchTask(window.tasks.add());

			taskOverlayManagement.hide();
		});

		taskOverlayManagement.taskOverlayNavbar.addEventListener("click", function () {
			taskOverlayManagement.hide();
		});

		// 监听任务状态同步变化事件
		window.tasks.on("state-sync-change", function () {
			if (taskOverlayManagement.isShown) {
				taskOverlayManagement.render();
			}
		});
	},
};

module.exports = taskOverlayManagement;
