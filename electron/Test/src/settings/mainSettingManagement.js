/**
 * 设置管理对象(主进程)
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日19:01:28
 */
const settingManagement = {
	/**设置文件的路径 */
	filePath: userDataPath + (isWindows ? "\\" : "/") + "settings.json",

	/**存储设置项的对象 */
	list: {},

	/**设置项变更时的回调函数列表 */
	onChangeCallbacks: [],

	/**
	 * 将设置项写入文件
	 */
	writeToFile: function () {
		/*
		同时从多个地方写入设置文件会导致数据损坏，因此需要做以下处理：
		* 从渲染进程将数据转发到主进程，只在主进程中进行写入操作
		* 在主进程中，将多个保存请求放入队列中（通过 promise 链式调用），以便逐个执行
		*/

		/**
		 * 执行新的文件写入操作
		 * @returns {Promise}
		 */
		function newFileWrite() {
			return fs.promises.writeFile(settingManagement.filePath, JSON.stringify(settingManagement.list));
		}

		/**
		 * 获取当前正在进行的文件写入操作
		 * @returns {Promise}
		 */
		function ongoingFileWrite() {
			return settingManagement.fileWritePromise || Promise.resolve();
		}

		// 将当前写入操作添加到队列中
		settingManagement.fileWritePromise = ongoingFileWrite()
			.then(newFileWrite)
			.then(() => (settingManagement.fileWritePromise = null));
	},

	/**
	 * 执行设置项变化时注册的回调函数
	 * @param {string} key - 设置项的键名
	 */
	invoke(key) {
		settingManagement.onChangeCallbacks.forEach(function (listener) {
			if (!key || !listener.key || listener.key === key) {
				if (listener.key) {
					listener.callback(settingManagement.list[listener.key]);
				} else {
					listener.callback(key);
				}
			}
		});
	},

	/**
	 * 注册监听指定键名的设置项变化
	 * @param {string} key - 设置项的键名
	 * @param {Function} callback - 回调函数
	 */
	listen: function (key, callback) {
		if (key && callback) {
			// 执行回调函数，并传入当前设置项的值
			callback(settingManagement.get(key));

			// 将回调函数添加到监听列表中
			settingManagement.onChangeCallbacks.push({ key, callback });
		} else if (key) {
			// 如果未提供回调函数，则将其视为全局监听函数
			settingManagement.onChangeCallbacks.push({ callback: key });
		}
	},

	/**
	 * 获取指定键名的设置项值
	 * @param {string} key - 设置项的键名
	 * @returns {*} - 设置项的值
	 */
	get: function (key) {
		return settingManagement.list[key];
	},

	/**
	 * 设置指定键名的设置项值
	 * @param {string} key - 设置项的键名
	 * @param {*} value - 设置项的值
	 */
	set: function (key, value) {
		// 更新设置项的值
		settingManagement.list[key] = value;

		// 将设置项写入文件
		settingManagement.writeToFile();

		// 执行设置项变化时注册的回调函数
		settingManagement.invoke(key);

		// 向所有窗口发送设置项变化的消息
		windowManagement.getOpenWins().forEach(function (win) {
			win.webContents.send("settingChanged", key, value);
		});
	},

	/**
	 * 初始化设置管理模块
	 */
	initialize: function () {
		/**设置文件数据 */
		var fileData;

		try {
			// 从文件中读取已保存的设置信息
			fileData = fs.readFileSync(settingManagement.filePath, "utf-8");
		} catch (e) {
			if (e.code !== "ENOENT") {
				console.warn(e);
			}
		}

		// 解析设置文件的内容，并保存到列表中
		if (fileData) {
			settingManagement.list = JSON.parse(fileData);
		}

		// 监听设置变化的消息
		ipc.on("settingChanged", function (e, key, value) {
			// 更新设置项的值
			settingManagement.list[key] = value;

			// 将设置项写入文件
			settingManagement.writeToFile();

			// 执行设置项变化时注册的回调函数
			settingManagement.invoke(key);

			// 向其他窗口发送设置项变化的消息
			windowManagement.getOpenWins().forEach(function (win) {
				if (win.webContents.id !== e.sender.id) {
					win.webContents.send("settingChanged", key, value);
				}
			});
		});
	},
};

settingManagement.initialize();
