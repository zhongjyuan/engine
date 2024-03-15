/**
 * 设置管理对象(静态页面)
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月21日16:37:49
 */
var settingManagement = {
	/**标记设置是否已加载 */
	loaded: false,

	/**存储设置的对象 */
	list: {},

	/**加载完成后的回调函数数组 */
	onLoadCallbacks: [],

	/**监听设置更改的回调函数数组 */
	onChangeCallbacks: [],

	/**
	 * 执行设置项变化时注册的回调函数
	 * @param {string} key - 设置项的键名
	 */
	invoke(key) {
		settingManagement.onChangeCallbacks.forEach(function (listener) {
			if (!key || !listener.key || listener.key === key) {
				if (listener.key) {
					listener.callback(settings.list[listener.key]); // 执行监听器的回调函数
				} else {
					listener.callback(key); // 执行监听器的回调函数
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
			// 先获取当前值
			settingManagement.get(key, callback);

			// 将回调函数添加到监听列表中
			settingManagement.onChangeCallbacks.push({ key, callback });
		} else if (key) {
			// 如果未提供回调函数，则将其视为全局监听函数
			settingManagement.onChangeCallbacks.push({ callback: key });
		}
	},

	/**
	 * 获取指定设置的值
	 * @param {*} key - 设置的键名
	 * @param {*} callback - 回调函数
	 */
	get: function (key, callback) {
		// 从缓存中获取设置值（如果已加载）
		if (settingManagement.loaded) {
			callback(settingManagement.list[key]);
		}

		// 如果设置尚未加载，则等待加载完成后再返回值
		else {
			settingManagement.onLoadCallbacks.push({
				key: key,
				callback: callback,
			});
		}
	},

	/**
	 * 设置指定键名的设置项值
	 * @param {string} key - 设置项的键名
	 * @param {*} value - 设置项的值
	 */
	set: function (key, value) {
		// 保存新值到列表中
		settingManagement.list[key] = value;

		// 向主线程发送设置消息
		postMessage({ message: "setSetting", key, value });

		// 触发监听器的回调函数
		settingManagement.invoke(key);
	},

	/**
	 * 请求加载设置数据
	 */
	load: function () {
		// 向主线程发送获取设置数据的消息
		postMessage({ message: "getSettingsData" });
	},

	/**
	 * 注册加载完成后的回调函数
	 * @param {*} callback - 回调函数
	 */
	onLoad: function (callback) {
		// 如果设置已加载，则直接执行回调函数
		if (settingManagement.loaded) {
			callback();
		} else {
			settingManagement.onLoadCallbacks.push({
				key: "",
				callback: callback,
			});
		}
	},
};

/** 监听主线程发送的消息 */
window.addEventListener("message", function (e) {
	// 保存设置数据到列表中
	if (e.data.message && e.data.message === "receiveSettingsData") {
		settingManagement.list = e.data.settings;

		if (!settingManagement.loaded) {
			// 执行加载完成后的回调函数
			settingManagement.onLoadCallbacks.forEach(function (item) {
				item.callback(settings.list[item.key]);
			});
			settingManagement.onLoadCallbacks = [];
		}

		// 标记设置已加载
		settingManagement.loaded = true;

		// 触发监听器的回调函数
		settingManagement.invoke();
	}
});

// 请求加载设置数据
settingManagement.load();
