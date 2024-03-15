const settingManagement = require("../settings/renderSettingManagement.js");

/**
 * 统计管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日11:42:02
 */
const statisticalManagement = {
	/** 环境获取器数组 */
	envGetters: [],

	/** 使用数据缓存 */
	usageDataCache: {},

	/**
	 * 注册获取器函数
	 * @param {*} key - 键名
	 * @param {*} fn - 获取函数
	 */
	registerGetter: function (key, fn) {
		statisticalManagement.envGetters.push({ key, fn });
	},

	/**
	 * 获取指定键的值
	 * @param {*} key - 键名
	 * @returns {*} 指定键的值
	 */
	getValue: function (key) {
		return statisticalManagement.usageDataCache[key];
	},

	/**
	 * 设置指定键的值
	 * @param {*} key - 键名
	 * @param {*} value - 键值
	 */
	setValue: function (key, value) {
		statisticalManagement.usageDataCache[key] = value;
	},

	/**
	 * 将指定键的值增加指定的值
	 * @param {*} key - 键名
	 * @param {*} value - 增加的值
	 */
	incrementValue: function (key, value) {
		if (statisticalManagement.usageDataCache[key]) {
			statisticalManagement.usageDataCache[key]++;
		} else {
			statisticalManagement.usageDataCache[key] = 1;
		}
	},

	/**
	 * 上传统计数据
	 */
	upload: function () {
		// 如果不收集使用统计数据，则不上传
		if (settingManagement.get("collectUsageStats") === false) {
			return;
		}

		// 避免在打开多个窗口时重复上传
		if (!document.body.classList.contains("focused")) {
			return;
		}

		// 克隆一份使用数据，避免修改原本的缓存
		var usageData = Object.assign({}, statisticalManagement.usageDataCache || {});

		// 避免上传一周前的旧数据，以防上传失败后无限次上传
		if (usageData.created && Date.now() - usageData.created > 7 * 24 * 60 * 60 * 1000) {
			usageData = {};

			statisticalManagement.usageDataCache = {
				created: Date.now(),
			};
		}

		// 遍历所有注册的获取器函数，获取相应数据
		statisticalManagement.envGetters.forEach(function (getter) {
			try {
				usageData[getter.key] = getter.fn();
			} catch (e) {
				console.warn(e);
			}
		});

		// 发送 POST 请求上传数据
		fetch("https://api.zhongjyuan.club/v1/collect", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				clientID: settingManagement.get("clientID"),
				installTime: settingManagement.get("installTime"),
				os: process.platform,
				lang: navigator.language,
				appVersion: window.globalArgs["app-version"],
				appName: window.globalArgs["app-name"],
				isDev: "development-mode" in window.globalArgs,
				usageData: usageData,
			}),
		})
			.then(function () {
				// 上传成功后清空缓存
				statisticalManagement.usageDataCache = {
					created: Date.now(),
				};

				settingManagement.set("usageData", null);
			})
			.catch((e) => console.warn("failed to send usage statisticalManagement", e));
	},

	/**
	 * 初始化统计模块
	 */
	initialize: function () {
		// 延迟10s上传一次数据，之后每24小时上传一次
		setTimeout(statisticalManagement.upload, 10000);
		setInterval(statisticalManagement.upload, 24 * 60 * 60 * 1000);

		// 初始化使用数据缓存
		statisticalManagement.usageDataCache = settingManagement.get("usageData") || {
			created: Date.now(),
		};

		// 每分钟保存一次使用数据缓存
		setInterval(function () {
			if (settingManagement.get("collectUsageStats") === false) {
				settingManagement.set("usageData", null);
			} else {
				settingManagement.set("usageData", statisticalManagement.usageDataCache);
			}
		}, 60000);

		// 监听 collectUsageStats 参数的变化
		settingManagement.listen("collectUsageStats", function (value) {
			// 禁止收集使用数据时重置客户端ID
			if (value === false) {
				settingManagement.set("clientID", undefined);
			}

			// 如果还没有客户端ID，则生成一个随机ID
			else if (!settingManagement.get("clientID")) {
				settingManagement.set("clientID", Math.random().toString().slice(2));
			}
		});

		// 如果还没有安装时间，则设置安装时间
		if (!settingManagement.get("installTime")) {
			// 将安装时间四舍五入到最近的小时以减少唯一性
			const roundingFactor = 60 * 60 * 1000;

			settingManagement.set("installTime", Math.floor(Date.now() / roundingFactor) * roundingFactor);
		}

		// 注册contentTypeFilters的获取器函数
		statisticalManagement.registerGetter("contentTypeFilters", function () {
			return (settingManagement.get("filtering") || {}).contentTypes;
		});
	},
};

module.exports = statisticalManagement;
