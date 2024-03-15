/**
 * 设置管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月18日10:13:45
 */
const settingManagement = {
	/**设置文件的路径 */
	filePath: window.globalArgs["user-data-path"] + (window.isWindows ? "\\" : "/") + "settings.json",

	/**存储设置的对象 */
	list: {},

	/**监听设置更改的回调函数数组 */
	changeCallbacks: [],

	/**
	 * 执行设置项变化时注册的回调函数
	 * @param {string} key - 设置项的键名
	 */
	invokeChangeListeners(key) {
		settingManagement.changeCallbacks.forEach(function (listener) {
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
	registerChangeListener: function (key, callback) {
		if (key && callback) {
			// 执行回调函数，并传入当前设置项的值
			callback(settingManagement.get(key));

			// 将回调函数添加到监听列表中
			settingManagement.changeCallbacks.push({ key, callback });
		} else if (key) {
			// 如果未提供回调函数，则将其视为全局监听函数
			settingManagement.changeCallbacks.push({ callback: key });
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

		// 向主进程发送设置更改的消息
		window.ipc.send("settingChanged", key, value);

		// 执行设置项变化时注册的回调函数
		settingManagement.invokeChangeListeners(key);
	},

	/**
	 * 初始化设置对象
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

		if (fileData) {
			// 解析设置文件的内容，并保存到列表中
			settingManagement.list = JSON.parse(fileData);
		}

		// 执行设置项变化时注册的回调函数
		settingManagement.invokeChangeListeners();

		// 监听设置变化的消息
		window.ipc.on("settingChanged", function (e, key, value) {
			// 更新设置项的值
			settingManagement.list[key] = value;

			// 执行设置项变化时注册的回调函数
			settingManagement.invokeChangeListeners(key);
		});
	},
};

settingManagement.initialize();

module.exports = settingManagement;
