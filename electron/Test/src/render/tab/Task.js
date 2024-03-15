/**Tab 对象 */
const Tab = require("./Tab.js");

/**Stack 对象 */
const Stack = require("./Stack.js");

/**
 * 任务对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月19日19:51:22
 */
class Task {
	/**静态属性数组，用于存储临时属性 */
	static temporaryProperties = ["selectedInWindow"];

	/**
	 * 构造函数
	 */
	constructor() {
		/**存储所有任务的数组，每个任务都包括id、name、tabs、tabHistory和selectedInWindow等属性 */
		this.tasks = [];

		/**存储所有事件的数组 */
		this.events = [];

		/**存储所有待执行的回调函数 */
		this.pendingCallbacks = [];

		/**记录setTimeout返回的定时器ID */
		this.pendingCallbackTimeout = null;
	}

	/**
	 * 获取一个随机id
	 * @returns {number}
	 */
	static getRandomId() {
		return Math.round(Math.random() * 100000000000000000);
	}

	/**
	 * 绑定事件监听器
	 * @param {*} name 事件名称
	 * @param {*} fn 监听器函数
	 */
	on(name, fn) {
		this.events.push({ name, fn });
	}

	/**
	 * 触发事件
	 * @param {*} name 事件名称
	 * @param  {...any} data 事件参数
	 */
	emit(name, ...data) {
		// 遍历所有事件监听器
		this.events.forEach((listener) => {
			// 如果事件名称匹配或者是通配符"*"，则执行监听器函数
			if (listener.name === name || listener.name === "*") {
				// 将函数和参数包装成数组，存储到待执行回调函数数组中
				this.pendingCallbacks.push([listener.fn, (listener.name === "*" ? [name] : []).concat(data)]);

				// 如果定时器没有被创建，则创建一个定时器，在下一次事件循环中执行所有待执行回调函数
				if (!this.pendingCallbackTimeout) {
					this.pendingCallbackTimeout = setTimeout(() => {
						this.pendingCallbacks.forEach((t) => t[0].apply(this, t[1]));
						this.pendingCallbacks = []; // 清空待执行回调函数数组
						this.pendingCallbackTimeout = null; // 清空定时器ID
					}, 0);
				}
			}
		});
	}

	/**
	 * 查找指定id的任务
	 * @param {*} id 任务id
	 * @returns {object|null} 如果找到则返回任务对象，否则返回null
	 */
	get(id) {
		return this.find((task) => task.id === id) || null;
	}

	/**
	 * 查找指定id的任务在任务数组中的索引
	 * @param {*} id 任务id
	 * @returns {number} 如果找到则返回索引，否则返回-1
	 */
	getIndex(id) {
		return this.tasks.findIndex((task) => task.id === id);
	}

	/**
	 * 获取指定索引处的任务
	 * @param {*} index 索引值
	 * @returns {object} 任务对象
	 */
	getAtIndex(index) {
		return this.tasks[index];
	}

	/**
	 * 获取在当前窗口中选中的任务
	 * @returns {object|null} 如果找到则返回任务对象，否则返回null
	 */
	getSelected() {
		return this.find((task) => task.selectedInWindow === windowId);
	}

	/**
	 * 设置在指定窗口中选中的任务
	 * @param {*} id 任务id
	 * @param {boolean} emit 是否触发事件
	 * @param {*} onWindow 窗口id
	 */
	setSelected(id, emit = true, onWindow = windowId) {
		for (var i = 0; i < this.tasks.length; i++) {
			if (this.tasks[i].selectedInWindow === onWindow) {
				this.tasks[i].selectedInWindow = null;
			}

			if (this.tasks[i].id === id) {
				this.tasks[i].selectedInWindow = onWindow;
			}
		}

		if (onWindow === windowId) {
			window.tabs = this.get(id).tabs;
			if (emit) {
				this.emit("task-selected", id);
				if (window.tabs.getSelected()) {
					this.emit("tab-selected", window.tabs.getSelected(), id);
				}
			}
		}
	}

	/**
	 * 判断指定任务是否已经折叠起来
	 * @param {*} id 任务id
	 * @returns {boolean}
	 */
	isCollapsed(id) {
		var task = this.get(id);
		return task.collapsed || (task.collapsed === undefined && Date.now() - window.tasks.getLastActivity(task.id) > 7 * 24 * 60 * 60 * 1000);
	}

	/**
	 * 获取任务数组的长度
	 * @returns {number}
	 */
	getLength() {
		return this.tasks.length;
	}

	/**
	 * 对每个任务执行指定的函数
	 * @param {*} fun 要执行的函数
	 */
	forEach(fun) {
		return this.tasks.forEach(fun);
	}

	/**
	 * 对任务数组执行map操作，返回一个新数组
	 * @param {*} fun 要执行的函数
	 * @returns {array}
	 */
	map(fun) {
		return this.tasks.map(fun);
	}

	/**
	 * 查找指定任务在任务数组中的索引
	 * @param {*} task 任务对象
	 * @returns {number} 如果找到则返回索引，否则返回-1
	 */
	indexOf(task) {
		return this.tasks.indexOf(task);
	}

	/**
	 * 对任务数组执行splice操作，返回被移除的任务数组
	 * @param  {...any} args splice方法的参数
	 * @returns {array}
	 */
	splice(...args) {
		return this.tasks.splice.apply(this.tasks, args);
	}

	/**
	 * 对任务数组执行slice操作，返回截取后的新数组
	 * @param  {...any} args slice方法的参数
	 * @returns {array}
	 */
	slice(...args) {
		return this.tasks.slice.apply(this.tasks, args);
	}

	/**
	 * 对任务数组执行filter操作，返回过滤后的新数组
	 * @param  {...any} args filter方法的参数
	 * @returns {array}
	 */
	filter(...args) {
		return this.tasks.filter.apply(this.tasks, args);
	}

	/**
	 * 查找指定条件的任务
	 * @param {*} filter 过滤函数
	 * @returns {object|null} 如果找到则返回任务对象，否则返回null
	 */
	find(filter) {
		for (var i = 0, len = this.tasks.length; i < len; i++) {
			if (filter(this.tasks[i], i, this.tasks)) {
				return this.tasks[i];
			}
		}
	}

	/**
	 * 向任务数组中添加一个任务
	 * @param {*} task 任务对象
	 * @param {number} index 要添加到的位置
	 * @param {boolean} emit 是否触发事件
	 * @returns {number} 新任务的id
	 */
	add(task = {}, index, emit = true) {
		/**新任务对象 */
		const newTask = {
			id: task.id || String(Task.getRandomId()), // 任务ID，默认为随机生成的字符串
			name: task.name || null, // 任务名称，默认为null
			tabs: new Tab(task.tabs, this), // 标签页对象，使用给定的标签页数组初始化
			tabHistory: new Stack(task.tabHistory), // 标签页历史记录对象，使用给定的历史记录数组初始化
			collapsed: task.collapsed, // 折叠状态，默认为undefined（区分"未折叠"和"从未折叠"）
			selectedInWindow: task.selectedInWindow || null, // 在窗口中选择的标签页，默认为null
		};

		// 在指定位置插入任务
		if (index) {
			this.tasks.splice(index, 0, newTask);
		}

		// 将任务添加到末尾
		else {
			this.tasks.push(newTask);
		}

		// 触发任务添加事件
		if (emit) {
			this.emit("task-added", newTask.id, Object.assign({}, newTask, { tabHistory: task.tabHistory, tabs: task.tabs }), index);
		}

		// 返回新任务的ID
		return newTask.id;
	}

	/**
	 * 更新指定任务的属性
	 * @param {*} id - 任务ID
	 * @param {*} data - 要更新的属性
	 * @param {boolean} emit - 是否触发事件
	 */
	update(id, data, emit = true) {
		// 根据ID获取要更新的任务
		let task = this.get(id);

		// 如果任务不存在，则抛出引用错误
		if (!task) {
			throw new ReferenceError("Attempted to update a task that does not exist.");
		}

		// 遍历传入的属性对象
		for (var key in data) {
			// 如果属性值为undefined，则抛出引用错误
			if (data[key] === undefined) {
				throw new ReferenceError("Key " + key + " is undefined.");
			}

			// 更新任务的属性值
			task[key] = data[key];

			// 如果需要触发事件，则触发"task-updated"事件
			if (emit) {
				this.emit("task-updated", id, key, data[key]);
			}
		}
	}

	/**
	 * 销毁任务
	 * @param {string} id - 要销毁的任务的标识符
	 * @param {boolean} emit - 是否触发相关事件，默认为true
	 * @returns {number|false} - 返回被移除任务的索引，如果任务不存在则返回false
	 */
	destroy(id, emit = true) {
		// 获取任务在任务数组中的索引
		const index = this.getIndex(id);

		if (emit) {
			// 遍历任务的所有标签页，触发"tab-destroyed"事件
			this.get(id).tabs.forEach((tab) => this.emit("tab-destroyed", tab.id, id));

			// 触发"task-destroyed"事件
			this.emit("task-destroyed", id);
		}

		// 如果任务索引小于0，表示任务不存在，直接返回false
		if (index < 0) return false;

		// 从任务数组中移除指定索引的任务
		this.tasks.splice(index, 1);

		// 返回被移除任务的索引
		return index;
	}

	/**
	 * 获取指定任务中最近活动的标签页的活动时间
	 * @param {*} id - 要查询的任务的标识符
	 * @returns {number} - 返回最近活动的标签页的活动时间，如果任务不存在或任务没有标签页，则返回0
	 */
	getLastActivity(id) {
		// 获取指定任务的标签页数组
		var tabs = this.get(id).tabs;

		// 初始化最近活动标签页的活动时间为0
		var lastActivity = 0;

		// 遍历任务的所有标签页
		for (var i = 0; i < tabs.count(); i++) {
			// 如果标签页的活动时间比lastActivity大，则更新lastActivity
			if (tabs.getAtIndex(i).lastActivity > lastActivity) {
				lastActivity = tabs.getAtIndex(i).lastActivity;
			}
		}

		// 返回最近活动标签页的活动时间，如果任务不存在或任务没有标签页，则返回0
		return lastActivity;
	}

	/**
	 * 获取可序列化的任务状态，用于将任务状态转换为字符串
	 * @returns {Object} - 返回可序列化的任务状态对象，该对象包含tasks属性，其中tasks属性是一个数组，表示所有任务的状态
	 */
	getStringifyableState() {
		return {
			tasks: this.tasks
				// 将每个任务对象的标签页数组转换为可序列化的状态
				.map((task) => Object.assign({}, task, { tabs: task.tabs.getStringifyableState() }))
				// 移除临时属性，保留任务对象的基本属性
				.map(function (task) {
					// remove temporary properties from task
					let result = {};
					Object.keys(task)
						.filter((key) => !Task.temporaryProperties.includes(key))
						.forEach((key) => (result[key] = task[key]));
					return result;
				}),
		};
	}

	/**
	 * 获取可复制的任务状态，用于创建任务状态的副本
	 * @returns {Object} - 返回可复制的任务状态对象，该对象包含tasks属性，其中tasks属性是一个数组，表示所有任务的状态的副本
	 */
	getCopyableState() {
		return {
			tasks: this.tasks.map((task) => Object.assign({}, task, { tabs: task.tabs.tabs })),
		};
	}

	/**
	 * 查找包含指定标签页的任务
	 * @param {*} tabId - 要查找的标签页ID
	 * @returns {Object|null} - 返回包含指定标签页的任务对象，如果未找到则返回null
	 */
	getTaskContainingTab(tabId) {
		return this.find((task) => task.tabs.has(tabId)) || null;
	}
}

module.exports = Task;
