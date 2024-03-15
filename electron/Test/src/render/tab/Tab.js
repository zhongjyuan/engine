/**
 * 标签页对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月19日19:50:51
 */
class Tab {
	/**不应保存到磁盘的标签页属性 */
	static temporaryProperties = ["hasAudio", "previewImage", "loaded", "hasBrowserView"];

	/**
	 * 构造函数
	 * @param {Array} tabs - 标签页数组
	 * @param {Object} parentTaskList - 父任务列表对象
	 */
	constructor(tabs, parentTaskList) {
		/**标签页数组 */
		this.tabs = tabs || [];

		/**父任务列表 */
		this.parentTaskList = parentTaskList;
	}

	/**
	 * 返回标签页的数量
	 * @returns {number} - 标签页的数量
	 */
	count() {
		return this.tabs.length;
	}

	/**
	 * 检查标签页是否为空
	 * @returns {boolean} - 如果标签页为空，则返回true；否则返回false
	 */
	isEmpty() {
		if (!this.tabs || this.tabs.length === 0) {
			return true;
		}

		if (this.tabs.length === 1 && !this.tabs[0].url) {
			return true;
		}

		return false;
	}

	/**
	 * 对每个标签页执行指定的操作
	 * @param {Function} fun - 要对每个标签页执行的操作
	 */
	forEach(fun) {
		this.tabs.forEach(fun);
	}

	/**
	 * 检查是否存在指定ID的标签页
	 * @param {*} id - 要检查的标签页的ID
	 * @returns {boolean} - 如果存在指定ID的标签页则返回true，否则返回false
	 */
	has(id) {
		return this.getIndex(id) > -1;
	}

	/**
	 * 将指定ID的标签页按偏移量进行移动
	 * @param {*} id - 要移动的标签页的ID
	 * @param {number} offset - 移动的偏移量，正数表示向后移动，负数表示向前移动
	 */
	moveBy(id, offset) {
		/**标签页索引 */
		var currentIndex = this.getIndex(id);

		/**标签页新索引 */
		var newIndex = currentIndex + offset;

		/**标签页索引对应的原本标签页 */
		var newIndexTab = this.getAtIndex(newIndex);
		if (newIndexTab) {
			/**标签页索引对应的标签页 */
			var currentTab = this.getAtIndex(currentIndex);

			this.splice(currentIndex, 1, newIndexTab);
			this.splice(newIndex, 1, currentTab);
		}
		// 这里不需要触发事件，因为 splice 方法会自动触发事件
	}

	/**
	 * 从标签页列表中删除或替换元素，并触发相应事件
	 * @param  {...any} args - splice 方法的参数
	 * @returns {Array} - 返回被删除的元素数组
	 */
	splice(...args) {
		/**要删除的标签页的任务的ID */
		const containingTask = this.parentTaskList.find((t) => t.tabs === this).id; // 获取包含要删除的标签页的任务的ID

		this.parentTaskList.emit("tab-splice", containingTask, ...args);

		return this.tabs.splice.apply(this.tabs, args);
	}

	/**
	 * 从标签页列表中删除或替换元素，但不触发相应事件
	 * @param  {...any} args - splice 方法的参数
	 * @returns {Array} - 返回被删除的元素数组
	 */
	spliceNoEmit(...args) {
		return this.tabs.splice.apply(this.tabs, args);
	}

	/**
	 * 获取标签页信息
	 * @param {*} id - 要获取信息的标签页的ID，如果未提供ID，则返回所有标签页的副本数组
	 * @returns {*} - 如果提供了ID，则返回该ID对应标签页的副本；如果未提供ID，则返回所有标签页的副本数组
	 */
	get(id) {
		if (!id) {
			// 未提供ID，返回所有标签页的副本数组
			// 返回副本数组是为了防止在返回的标签页被修改时影响到原始标签页对象

			/**标签页返回数组 */
			var tabsToReturn = [];

			for (var i = 0; i < this.tabs.length; i++) {
				tabsToReturn.push(Object.assign({}, this.tabs[i]));
			}

			return tabsToReturn;
		}

		// 提供了ID，返回该ID对应标签页的副本
		for (var i = 0; i < this.tabs.length; i++) {
			if (this.tabs[i].id === id) {
				return Object.assign({}, this.tabs[i]);
			}
		}

		// 未找到对应ID的标签页，返回undefined
		return undefined;
	}

	/**
	 * 获取指定ID的标签页在列表中的索引位置
	 * @param {*} id - 要获取索引位置的标签页的ID
	 * @returns {number} - 如果找到了指定ID的标签页，则返回其在列表中的索引位置；如果未找到，则返回-1
	 */
	getIndex(id) {
		for (var i = 0; i < this.tabs.length; i++) {
			if (this.tabs[i].id === id) {
				return i;
			}
		}

		return -1;
	}

	/**
	 * 获取指定索引位置的标签页
	 * @param {number} index - 要获取的标签页的索引位置
	 * @returns {*} - 如果存在指定索引位置的标签页，则返回该标签页；如果不存在，则返回undefined
	 */
	getAtIndex(index) {
		return this.tabs[index] || undefined;
	}

	/**
	 * 选中指定ID的标签页
	 * @param {*} id - 要选中的标签页的ID
	 * @param {boolean} emit - 是否发送"tab-selected"事件，默认为true
	 * @throws {ReferenceError} 如果要选中的标签页不存在，则抛出引用错误
	 */
	setSelected(id, emit = true) {
		if (!this.has(id)) {
			throw new ReferenceError("Attempted to select a tab that does not exist.");
		}

		for (var i = 0; i < this.tabs.length; i++) {
			if (this.tabs[i].id === id) {
				this.tabs[i].selected = true;
				this.tabs[i].lastActivity = Date.now();
			} else if (this.tabs[i].selected) {
				this.tabs[i].selected = false;
				this.tabs[i].lastActivity = Date.now();
			}
		}

		/**触发事件 */
		if (emit) {
			this.parentTaskList.emit("tab-selected", id, this.parentTaskList.getTaskContainingTab(id).id);
		}
	}

	/**
	 * 获取当前选中的标签页的ID
	 * @returns {*} - 如果存在选中的标签页，则返回其ID；如果不存在选中的标签页，则返回null
	 */
	getSelected() {
		for (var i = 0; i < this.tabs.length; i++) {
			if (this.tabs[i].selected) {
				return this.tabs[i].id;
			}
		}

		return null;
	}

	/**
	 * 获取当前选中的标签页在列表中的索引位置
	 * @returns {*} - 如果存在选中的标签页，则返回其在列表中的索引位置；如果不存在选中的标签页，则返回null
	 */
	getSelectedIndex() {
		for (var i = 0; i < this.tabs.length; i++) {
			if (this.tabs[i].selected) {
				return i;
			}
		}

		return null;
	}

	/**
	 * 添加一个标签页到列表中
	 * @param {Object} tab - 要添加的标签页对象
	 *     @property {string} id - 标签页ID（可选，如果未提供则生成随机ID）
	 *     @property {string} url - 标签页URL（默认为空字符串）
	 *     @property {string} title - 标签页标题（默认为空字符串）
	 *     @property {boolean} muted - 是否静音（默认为false）
	 *     @property {boolean} secure - 是否为安全连接
	 *     @property {boolean} loaded - 是否已加载（默认为false）
	 *     @property {boolean} private - 是否为私密标签页（默认为false）
	 *     @property {boolean} selected - 是否为当前选中状态（默认为false）
	 *     @property {boolean} readerable - 是否可阅读模式（默认为false）
	 *     @property {string} themeColor - 标签页的主题颜色
	 *     @property {number} scrollPosition - 标签页的滚动位置（默认为0）
	 *     @property {string} backgroundColor - 标签页的背景颜色
	 *     @property {number} lastActivity - 上次活动时间（默认为当前时间戳）
	 *     @property {boolean} hasAudio - 是否包含音频
	 *     @property {boolean} isFileView - 是否为文件视图
	 *     @property {string} previewImage - 预览图像
	 *     @property {boolean} hasBrowserView - 是否包含浏览器视图
	 * @param {Object} options - 选项参数
	 *     @property {boolean} atEnd - 是否将新标签页添加到列表末尾（默认为false，在当前选中标签页的后面插入）
	 * @param {boolean} emit - 是否触发事件（默认为true）
	 * @returns {string} - 新添加的标签页的ID
	 */
	add(tab = {}, options = {}, emit = true) {
		/**标签页ID */
		var tabId = String(tab.id || Math.round(Math.random() * 100000000000000000)); // 生成一个随机的标签页ID

		/**标签页对象 */
		var newTab = {
			id: tabId, // 标签页ID
			url: tab.url || "", // 标签页URL，默认为空字符串
			title: tab.title || "", // 标签页标题，默认为空字符串
			muted: tab.muted || false, // 是否静音，默认为false
			secure: tab.secure, // 是否为安全连接
			loaded: tab.loaded || false, // 是否已加载，默认为false
			private: tab.private || false, // 是否为私密标签页，默认为false
			selected: tab.selected || false, // 是否为当前选中状态，默认为false
			readerable: tab.readerable || false, // 是否可阅读模式，默认为false
			themeColor: tab.themeColor, // 标签页的主题颜色
			scrollPosition: tab.scrollPosition || 0, // 标签页的滚动位置，默认为0
			backgroundColor: tab.backgroundColor, // 标签页的背景颜色
			lastActivity: tab.lastActivity || Date.now(), // 上次活动时间，默认为当前时间戳
			hasAudio: false, // 是否包含音频
			isFileView: false, // 是否为文件视图
			previewImage: "", // 预览图像
			hasBrowserView: false, // 是否包含浏览器视图
		};

		// 将新标签页添加到列表中
		if (options.atEnd) {
			this.tabs.push(newTab);
		} else {
			this.tabs.splice(this.getSelectedIndex() + 1, 0, newTab);
		}

		/**触发事件 */
		if (emit) {
			this.parentTaskList.emit("tab-added", tabId, newTab, options, this.parentTaskList.getTaskContainingTab(tabId).id);
		}

		return tabId;
	}

	/**
	 * 更新标签页的属性
	 * @param {string} id - 要更新的标签页的ID
	 * @param {Object} data - 包含要更新的属性和值的对象
	 *     @property {string} url - 要更新的标签页的URL
	 *     @property {string} title - 要更新的标签页的标题
	 *     @property {boolean} muted - 要更新的标签页的静音状态
	 *     @property {boolean} secure - 要更新的标签页的安全连接状态
	 *     @property {boolean} loaded - 要更新的标签页的加载状态
	 *     @property {boolean} private - 要更新的标签页的私密状态
	 *     @property {boolean} selected - 要更新的标签页的选中状态
	 *     @property {boolean} readerable - 要更新的标签页的阅读模式状态
	 *     @property {string} themeColor - 要更新的标签页的主题颜色
	 *     @property {number} scrollPosition - 要更新的标签页的滚动位置
	 *     @property {string} backgroundColor - 要更新的标签页的背景颜色
	 *     @property {number} lastActivity - 要更新的标签页的上次活动时间
	 *     @property {boolean} hasAudio - 要更新的标签页是否包含音频
	 *     @property {boolean} isFileView - 要更新的标签页是否为文件视图
	 *     @property {string} previewImage - 要更新的标签页的预览图像
	 *     @property {boolean} hasBrowserView - 要更新的标签页是否包含浏览器视图
	 * @param {boolean} emit - 是否触发事件，默认为true
	 */
	update(id, data, emit = true) {
		// 检查要更新的标签页是否存在
		if (!this.has(id)) {
			throw new ReferenceError("Attempted to update a tab that does not exist.");
		}

		/**标签页索引 */
		const index = this.getIndex(id); // 获取标签页在列表中的索引位置

		// 遍历传入的属性和值，逐个更新标签页的属性
		for (var key in data) {
			// 如果传入的值是undefined，抛出异常
			if (data[key] === undefined) {
				throw new ReferenceError("Key " + key + " is undefined.");
			}

			// 更新标签页的属性值
			this.tabs[index][key] = data[key];

			// 触发事件
			if (emit) {
				this.parentTaskList.emit("tab-updated", id, key, data[key], this.parentTaskList.getTaskContainingTab(id).id);
			}

			// 如果更新了url属性，重置滚动位置为0，并触发相应的事件
			if (key === "url") {
				this.tabs[index].scrollPosition = 0;

				// 触发事件
				if (emit) {
					this.parentTaskList.emit("tab-updated", id, "scrollPosition", 0, this.parentTaskList.getTaskContainingTab(id).id);
				}
			}
		}
	}

	/**
	 * 销毁标签页
	 * @param {*} id - 要销毁的标签页的ID
	 * @param {*} emit - 是否触发事件，默认为true
	 * @returns {number|boolean} - 如果成功删除了标签页，则返回其在列表中的索引位置；如果标签页不存在，返回false
	 */
	destroy(id, emit = true) {
		/**标签页索引 */
		const index = this.getIndex(id); // 获取要删除的标签页在列表中的索引位置

		if (index < 0) return false;

		/**要删除的标签页的任务的ID */
		const containingTask = this.parentTaskList.getTaskContainingTab(id).id; // 获取包含要删除的标签页的任务的ID

		// 将要删除的标签页转换为永久状态并存入所在任务的历史记录中
		tasks.getTaskContainingTab(id).tabHistory.push(this.toPermanentState(this.tabs[index]));

		// 从标签页列表中删除要删除的标签页
		this.tabs.splice(index, 1);

		// 触发事件
		if (emit) {
			this.parentTaskList.emit("tab-destroyed", id, containingTask);
		}

		// 返回删除标签页后其在列表中的索引位置
		return index;
	}

	/**
	 * 将临时标签页对象转换为永久标签页对象
	 * @param {Object} tab - 要转换的标签页对象
	 * @returns {Object} - 返回永久标签页对象
	 */
	toPermanentState(tab) {
		/**临时属性 */
		let result = {};

		// 移除在页面重新加载时会丢失的临时属性
		Object.keys(tab)
			.filter((key) => !Tab.temporaryProperties.includes(key))
			.forEach((key) => (result[key] = tab[key]));

		return result;
	}

	/**
	 * 获取可字符串化的状态
	 * @returns {Array} - 返回可字符串化的标签页状态数组
	 */
	getStringifyableState() {
		return this.tabs.map((tab) => this.toPermanentState(tab));
	}
}

module.exports = Tab;
