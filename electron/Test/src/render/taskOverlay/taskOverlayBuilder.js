const searchEngine = require("../utils/searchEngine.js");
const urlManagement = require("../utils/urlManagement.js");

const uiManagement = require("../uiManagement.js");

const searchbarHelper = require("../searchbar/searchbarHelper.js");

/**
 * 任务覆盖构造对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月19日19:52:19
 */
const taskOverlayBuilder = {
	/**用于确定“亮色”网站图标的最小亮度值 */
	faviconMinimumLuminance: 70,

	/**
	 * 获取任务的相对日期
	 * @param {*} task - 任务对象
	 * @returns {string|null} - 相对日期字符串或 null
	 */
	getTaskRelativeDate: function (task) {
		// 获取显示相对日期的最小时间
		var minimumTime = new Date();
		minimumTime.setHours(0);
		minimumTime.setMinutes(0);
		minimumTime.setSeconds(0);
		minimumTime = minimumTime.getTime();
		minimumTime -= 5 * 24 * 60 * 60 * 1000;

		var time = window.tasks.getLastActivity(task.id);
		var d = new Date(time);

		// 为最近的任务不显示具体时间，以节省空间
		if (time > minimumTime) {
			return null;
		} else {
			return new Intl.DateTimeFormat(navigator.language, {
				month: "long",
				day: "numeric",
				year: "numeric",
			}).format(d);
		}
	},

	/**
	 * 切换任务的折叠状态
	 * @param {*} taskContainer - 包含任务的容器元素
	 * @param {*} task - 任务对象
	 */
	toggleCollapsed: function (taskContainer, task) {
		// 更新任务的折叠状态
		window.tasks.update(task.id, { collapsed: !window.tasks.isCollapsed(task.id) });

		// 切换容器元素的折叠类名
		taskContainer.classList.toggle("collapsed");

		// 切换折叠按钮的图标
		var collapseButton = taskContainer.querySelector(".task-collapse-button");
		collapseButton.classList.toggle("carbon:chevron-right");
		collapseButton.classList.toggle("carbon:chevron-down");

		// 设置折叠按钮的 aria-expanded 属性
		if (window.tasks.isCollapsed(task.id)) {
			collapseButton.setAttribute("aria-expanded", "false");
		} else {
			collapseButton.setAttribute("aria-expanded", "true");
		}
	},

	/**
	 * 创建任务相关的HTML元素
	 */
	create: {
		/**
		 * 创建任务的HTML元素
		 */
		task: {
			/**
			 * 创建折叠按钮的HTML元素
			 * @param {*} taskContainer - 任务容器的DOM元素
			 * @param {*} task - 任务对象
			 * @returns - 折叠按钮的HTML元素
			 */
			collapseButton: function (taskContainer, task) {
				var collapseButton = document.createElement("button");
				collapseButton.className = "task-collapse-button i";
				collapseButton.setAttribute("tabindex", "-1");

				// 设置按钮的属性
				collapseButton.setAttribute("aria-haspopup", "true");
				if (window.tasks.isCollapsed(task.id)) {
					collapseButton.classList.add("carbon:chevron-right");
					collapseButton.setAttribute("aria-expanded", "false");
				} else {
					collapseButton.classList.add("carbon:chevron-down");
					collapseButton.setAttribute("aria-expanded", "true");
				}

				// 添加点击事件监听器
				collapseButton.addEventListener("click", function (e) {
					e.stopPropagation();
					taskOverlayBuilder.toggleCollapsed(taskContainer, task);
				});

				return collapseButton;
			},

			/**
			 * 创建任务名称输入框的HTML元素
			 * @param {*} task - 任务对象
			 * @param {*} taskIndex - 任务索引
			 * @returns - 任务名称输入框的HTML元素
			 */
			nameInputField: function (task, taskIndex) {
				// 创建一个输入框元素
				var input = document.createElement("input");
				input.classList.add("task-name");
				input.classList.add("mousetrap");

				// 设置输入框的属性和值
				var taskName = l("defaultTaskName").replace("%n", taskIndex + 1);
				input.placeholder = taskName;
				input.value = task.name || taskName;
				input.spellcheck = false;

				// 添加键盘事件监听器
				input.addEventListener("keyup", function (e) {
					// 如果按下回车键
					if (e.keyCode === 13) {
						this.blur(); // 失去焦点
					}

					// 更新任务名称
					window.tasks.update(task.id, { name: this.value });
				});

				// 添加焦点事件监听器
				input.addEventListener("focusin", function (e) {
					// 如果任务已折叠，则失去焦点
					if (window.tasks.isCollapsed(task.id)) {
						this.blur();

						return;
					}

					// 选中文本
					this.select();
				});

				// 返回输入框元素
				return input;
			},

			/**
			 * 创建删除按钮的HTML元素
			 * @param {*} container - 任务容器的DOM元素
			 * @param {*} task - 任务对象
			 * @returns - 删除按钮的HTML元素
			 */
			deleteButton: function (container, task) {
				// 创建按钮元素
				var deleteButton = document.createElement("button");
				deleteButton.className = "task-delete-button i carbon:trash-can";
				deleteButton.tabIndex = -1; // 键盘导航辅助功能所需

				// 添加点击事件监听器
				deleteButton.addEventListener("click", function (e) {
					if (task.tabs.isEmpty()) {
						container.remove();
						uiManagement.closeTask(task.id);
					} else {
						container.classList.add("deleting");
						setTimeout(function () {
							if (container.classList.contains("deleting")) {
								container.style.opacity = 0;
								// 使用setTimeout而不是transitionend，因为如果元素从DOM中移除，transitionend将不起作用
								setTimeout(function () {
									container.remove();
									uiManagement.closeTask(task.id);
								}, 500);
							}
						}, 10000);
					}
				});

				return deleteButton;
			},

			/**
			 * 创建删除警告消息的HTML元素
			 * @param {*} container - 任务容器的DOM元素
			 * @param {*} task - 任务对象
			 * @returns - 删除警告消息的HTML元素
			 */
			deleteWarning: function (container, task) {
				// 创建一个div元素作为删除警告消息
				var deleteWarning = document.createElement("div");
				deleteWarning.className = "task-delete-warning";

				// 设置警告消息的文本内容
				deleteWarning.innerHTML = l("taskDeleteWarning").unsafeHTML;

				// 添加点击事件监听器，以便在单击警告消息时移除"deleting"类
				deleteWarning.addEventListener("click", function (e) {
					container.classList.remove("deleting");
				});

				return deleteWarning; // 返回删除警告消息的HTML元素
			},

			/**
			 * 创建任务操作容器的HTML元素
			 * @param {*} taskContainer - 任务容器的DOM元素
			 * @param {*} task - 任务对象
			 * @param {*} taskIndex - 任务索引
			 * @returns - 任务操作容器的HTML元素
			 */
			actionContainer: function (taskContainer, task, taskIndex) {
				// 创建一个div元素作为任务操作容器
				var taskActionContainer = document.createElement("div");
				taskActionContainer.className = "task-action-container";

				// 添加折叠按钮
				var collapseButton = this.collapseButton(taskContainer, task);
				taskActionContainer.appendChild(collapseButton);

				// 添加任务名称输入框
				var input = this.nameInputField(task, taskIndex);
				taskActionContainer.appendChild(input);

				// 添加删除按钮
				var deleteButton = this.deleteButton(taskContainer, task);
				taskActionContainer.appendChild(deleteButton);

				return taskActionContainer; // 返回任务操作容器的HTML元素
			},

			/**
			 * 创建任务信息容器的HTML元素
			 * @param {*} task - 任务对象
			 * @returns - 任务信息容器的HTML元素
			 */
			infoContainer: function (task) {
				// 创建一个div元素作为任务信息容器
				var infoContainer = document.createElement("div");
				infoContainer.className = "task-info-container";

				// 获取相对日期
				var date = taskOverlayBuilder.getTaskRelativeDate(task);

				// 如果存在相对日期，则创建span元素显示日期，并添加到任务信息容器中
				if (date) {
					var dateEl = document.createElement("span");
					dateEl.className = "task-date";
					dateEl.textContent = date;
					infoContainer.appendChild(dateEl);
				}

				// 创建span元素用于显示最后浏览的标签页标题
				var lastTabEl = document.createElement("span");
				lastTabEl.className = "task-last-tab-title";
				var lastTabTitle = task.tabs.get().sort((a, b) => b.lastActivity - a.lastActivity)[0].title;

				// 如果存在最后浏览的标签页标题，则进行处理并添加到任务信息容器中
				if (lastTabTitle) {
					lastTabTitle = searchbarHelper.getRealTitle(lastTabTitle);
					if (lastTabTitle.length > 40) {
						lastTabTitle = lastTabTitle.substring(0, 40) + "...";
					}
					lastTabEl.textContent = searchbarHelper.getRealTitle(lastTabTitle);
				}
				infoContainer.appendChild(lastTabEl);

				// 创建数组用于存储favicons
				var favicons = [];
				var faviconURLs = [];

				// 获取最后浏览的标签页的favicons，并添加到favicons数组和faviconURLs数组中
				task.tabs
					.get()
					.sort((a, b) => b.lastActivity - a.lastActivity)
					.forEach(function (tab) {
						if (tab.favicon) {
							favicons.push(tab.favicon);
							faviconURLs.push(tab.favicon.url);
						}
					});

				// 如果存在favicons，则创建span元素用于显示favicons，并添加到任务信息容器中
				if (favicons.length > 0) {
					var faviconsEl = document.createElement("span");
					faviconsEl.className = "task-favicons";
					favicons = favicons.filter((i, idx) => faviconURLs.indexOf(i.url) === idx);

					favicons.forEach(function (favicon) {
						var img = document.createElement("img");
						img.src = favicon.url;
						if (favicon.luminance < taskOverlayBuilder.faviconMinimumLuminance) {
							img.classList.add("dark-favicon");
						}
						faviconsEl.appendChild(img);
					});

					infoContainer.appendChild(faviconsEl);
				}

				return infoContainer; // 返回任务信息容器的HTML元素
			},

			/**
			 * 创建任务信息容器的HTML元素
			 * @param {*} task - 任务对象
			 * @param {*} taskIndex - 任务在任务列表中的位置
			 * @param {*} events - 事件对象
			 * @returns - 任务信息容器的HTML元素
			 */
			container: function (task, taskIndex, events) {
				// 创建一个div元素作为任务信息容器
				var container = document.createElement("div");
				container.className = "task-container";

				// 检查任务是否被选中和折叠，并设置相应的样式类
				if (task.id !== window.tasks.getSelected().id && window.tasks.isCollapsed(task.id)) {
					container.classList.add("collapsed");
				}
				if (task.id === window.tasks.getSelected().id) {
					container.classList.add("selected");
				}

				// 设置任务ID和点击事件监听器
				container.setAttribute("data-task", task.id);
				container.addEventListener("click", function (e) {
					if (window.tasks.isCollapsed(task.id)) {
						taskOverlayBuilder.toggleCollapsed(container, task);
					}
				});

				// 创建包含任务操作按钮的容器，并添加到任务信息容器中
				var taskActionContainer = this.actionContainer(container, task, taskIndex);
				container.appendChild(taskActionContainer);

				// 创建包含任务信息的容器，并添加到任务信息容器中
				var infoContainer = this.infoContainer(task);
				container.appendChild(infoContainer);

				// 创建删除任务的警告框，并添加到任务信息容器中
				var deleteWarning = this.deleteWarning(container, task);
				container.appendChild(deleteWarning);

				// 创建包含任务标签页的容器，并添加到任务信息容器中
				var tabContainer = taskOverlayBuilder.create.tab.container(task, events);
				container.appendChild(tabContainer);

				return container; // 返回任务信息容器的HTML元素
			},
		},

		/**
		 * 创建任务标签相关的HTML元素
		 */
		tab: {
			/**
			 * 创建任务标签页的HTML元素
			 * @param {*} tabContainer - 任务标签页容器的HTML元素
			 * @param {*} task - 任务对象
			 * @param {*} tab - 标签页对象
			 * @param {*} events - 事件对象
			 * @returns - 任务标签页的HTML元素
			 */
			element: function (tabContainer, task, tab, events) {
				var data = {
					classList: ["task-tab-item"],
					delete: events.tabDelete,
					showDeleteButton: true,
				};

				// 根据标签页的私密属性和网站图标设置相应的图标和样式类
				if (tab.private) {
					data.icon = "carbon:view-off";
				} else if (tab.favicon) {
					data.iconImage = tab.favicon.url;

					// 如果网站图标的亮度低于阈值，则添加"has-dark-favicon"样式类
					if (tab.favicon.luminance && tab.favicon.luminance < taskOverlayBuilder.faviconMinimumLuminance) {
						data.classList.push("has-dark-favicon");
					}
				}

				// 获取标签页的URL的来源和搜索引擎信息，并设置标题和副标题
				var source = urlManagement.getSourceURL(tab.url);
				var searchQuery = searchEngine.getSearch(source);

				if (searchQuery) {
					data.title = searchQuery.search;
					data.secondaryText = searchQuery.engine;
				} else {
					data.title = tab.title || l("newTabLabel");
					data.secondaryText = urlManagement.basicURL(source);
				}

				// 使用searchbarUtils.createItem方法创建任务标签页元素
				var el = searchbarHelper.createItem(data);

				el.setAttribute("data-tab", tab.id);

				// 添加点击事件监听器
				el.addEventListener("click", function (e) {
					if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
						events.tabSelect.call(this, e);
					}
				});

				// 返回任务标签页的HTML元素
				return el;
			},

			/**
			 * 创建任务标签页容器的HTML元素
			 * @param {*} task - 任务对象
			 * @param {*} events - 事件对象
			 * @returns - 任务标签页容器的HTML元素
			 */
			container: function (task, events) {
				var tabContainer = document.createElement("ul");
				tabContainer.className = "task-tabs-container";
				tabContainer.setAttribute("data-task", task.id);

				// 遍历任务的标签页列表，创建并添加每个标签页元素到容器中
				if (task.tabs) {
					for (var i = 0; i < task.tabs.count(); i++) {
						var el = this.element(tabContainer, task, task.tabs.getAtIndex(i), events);
						tabContainer.appendChild(el);
					}
				}

				return tabContainer; // 返回任务标签页容器的HTML元素
			},
		},
	},

	/**
	 * 创建任务容器的HTML元素
	 * @param {*} task - 任务对象
	 * @param {*} index - 任务在列表中的索引
	 * @param {*} events - 事件对象
	 * @returns - 任务容器的HTML元素
	 */
	createTaskContainer: function (task, index, events) {
		return taskOverlayBuilder.create.task.container(task, index, events);
	},
};

module.exports = taskOverlayBuilder;
