/**
 * 格式化日期
 * @author zhongjyuan
 * @date   2023年5月12日10:07:49
 * @email  zhongjyuan@outlook.com
 * @param {string} format - 日期格式字符串，默认为 "yyyy-MM-dd hh:mm:ss"
 * @returns {string} 格式化后的日期字符串
 *
 * @example
 * const date = new Date();
 * const formattedDate = date.format(); // 默认格式 "yyyy-MM-dd hh:mm:ss"
 * console.log(formattedDate); // 输出格式化后的日期字符串
 *
 * @example
 * const date = new Date();
 * const formattedDate = date.format("yyyy年MM月dd日 hh时mm分ss秒");
 * console.log(formattedDate); // 输出格式化后的日期字符串
 *
 * @example
 * const date = new Date();
 * const formattedDate = date.format("yyyy年MM月dd日 hh时mm分ss秒S毫秒 W 季度q ap 时区: GMT");
 * console.log(formattedDate); // 输出格式化后的日期字符串："2023年07月18日 07时51分12秒52毫秒 星期二 季度3 下午 时区: GMT+08:00"
 */
Date.prototype.format = function (format) {
	const cache = new Map();
	if (!format) {
		format = "yyyy-MM-dd HH:mm:ss";
	}

	const o = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours() % 12 === 0 ? 12 : this.getHours() % 12,
		"H+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		S: this.getMilliseconds(),
		"y+": ((year) => {
			const key = `${year}+${format}`;
			if (cache.has(key)) {
				return cache.get(key);
			}
			const value = year.toString().substr(4 - (format.match(/y+/) || [""])[0].length);
			cache.set(key, value);
			return value;
		})(this.getFullYear()),
		W: (function (date) {
			const key = `W+${date}`;
			if (cache.has(key)) {
				return cache.get(key);
			}
			const num = date.getDay();
			const CN_DAY = ["日", "一", "二", "三", "四", "五", "六"];
			const value = `星期${CN_DAY[num]}`;
			cache.set(key, value);
			return value;
		})(this),
		ap: (function () {
			const currentHour = new Date().getHours();
			if (5 <= currentHour && currentHour < 7) {
				return "凌晨";
			} else if (7 <= currentHour && currentHour < 9) {
				return "早上";
			} else if (9 <= currentHour && currentHour < 12) {
				return "上午";
			} else if (12 <= currentHour && currentHour < 14) {
				return "中午";
			} else if (14 <= currentHour && currentHour < 18) {
				return "下午";
			} else if (18 <= currentHour && currentHour < 20) {
				return "傍晚";
			} else if (20 <= currentHour && currentHour < 24) {
				return "晚上";
			} else {
				return "深夜";
			}
		})(),
		GMT: (function () {
			const offset = new Date().getTimezoneOffset() / -60;
			const hours = Math.abs(Math.floor(offset)).toString().padStart(2, "0");
			const minutes = Math.abs((offset % 1) * 60)
				.toString()
				.padStart(2, "0");
			const sign = offset >= 0 ? "+" : "-";
			return `GMT${sign}${hours}:${minutes}`;
		})(),
	};

	for (let k in o) {
		const reg = new RegExp("(" + k + ")");
		if (reg.test(format)) {
			format = format.replace(reg, (match, group) => {
				if (group === "yyyy") {
					return o[k];
				}
				if (group === "GMT") {
					return o[k];
				}
				return group.length === 1 ? o[k] : ("00" + o[k]).substring(("" + o[k]).length);
			});
		}
	}

	return format;
};

// 引入基础样式
require("./base.css");

/**ZHONGJYUAN 对象 */
window.zhongjyuan = window.zhongjyuan || {};

/**ZHONGJYUAN 配置对象 */
window.zhongjyuan.setting = window.zhongjyuan.setting || {};

/**ZHONGJYUAN 枚举对象 */
window.zhongjyuan.enum = window.zhongjyuan.enum || {};

/**ZHONGJYUAN 常量对象 */
window.zhongjyuan.const = window.zhongjyuan.const || {};

/**ZHONGJYUAN 日志对象 */
window.zhongjyuan.logger = window.zhongjyuan.logger || {};

/**ZHONGJYUAN 调试对象 */
window.zhongjyuan.debugger = window.zhongjyuan.debugger || {};

/**ZHONGJYUAN 多语言对象 */
window.zhongjyuan.languager = window.zhongjyuan.languager || {};

/**ZHONGJYUAN 工具对象 */
window.zhongjyuan.tool = window.zhongjyuan.tool || {};

/**ZHONGJYUAN 组件对象 */
window.zhongjyuan.comp = window.zhongjyuan.comp || {};

/**ZHONGJYUAN 窗体对象 */
window.zhongjyuan.window = window.zhongjyuan.window || {};

/**ZHONGJYUAN 运行时对象 */
window.zhongjyuan.runtime = window.zhongjyuan.runtime || {};
/**ZHONGJYUAN 运行时 配置对象 */
window.zhongjyuan.runtime.setting = window.zhongjyuan.runtime.setting || {};
/**ZHONGJYUAN 运行时 多语言集 */
window.zhongjyuan.runtime.languages = window.zhongjyuan.runtime.languages || [];
/**ZHONGJYUAN 运行时 Load堆栈集 */
window.zhongjyuan.runtime.loadStack = window.zhongjyuan.runtime.loadStack || [];
/**ZHONGJYUAN 运行时 Ready堆栈集 */
window.zhongjyuan.runtime.readyStack = window.zhongjyuan.runtime.readyStack || [];
/**ZHONGJYUAN 运行时 动态装载Style集 */
window.zhongjyuan.runtime.loadStyle = window.zhongjyuan.runtime.loadStyle || [];
/**ZHONGJYUAN 运行时 动态装载Script集 */
window.zhongjyuan.runtime.loadScript = window.zhongjyuan.runtime.loadScript || [];
/**ZHONGJYUAN 运行时 动态装载Prefetch集 */
window.zhongjyuan.runtime.loadPrefetch = window.zhongjyuan.runtime.loadPrefetch || [];
/**ZHONGJYUAN 运行时 变量对象 */
window.zhongjyuan.runtime.variable = window.zhongjyuan.runtime.variable || {};
/**ZHONGJYUAN 运行时 类型校验对象 */
window.zhongjyuan.runtime.typeChecker = window.zhongjyuan.runtime.typeChecker || {};

/** ######FUNCTION###### */

/**
 * 在加载之后添加处理程序
 * @param {Function} handler 要添加到加载堆栈的处理程序
 * @example
 * // 创建一个处理函数
 * function myHandler() {
 *   // 执行一些操作
 *   console.log('加载完成后执行的处理程序');
 * }
 *
 * // 添加处理函数到加载堆栈
 * addLoadAfter(myHandler);
 */
export function addLoad(handler) {
	window.zhongjyuan.runtime.loadStack.push(handler);
}

/**
 * 执行加载完成后的处理程序
 * 遍历加载堆栈中的每个处理程序，并执行它们
 * @example
 * // 创建一个处理函数
 * function myHandler() {
 *   // 执行一些操作
 *   console.log('加载完成后执行的处理程序');
 * }
 *
 * // 添加处理函数到加载堆栈
 * addLoadAfter(myHandler);
 *
 * // 执行加载完成后的处理程序
 * executeLoadAfter(); // 输出：加载完成后执行的处理程序
 */
export function executeLoad() {
	// 异步操作完成后调用 resolve()，表示执行完成
	// 或者在出现错误时调用 reject()，表示执行出错
	return new Promise((resolve, reject) => {
		try {
			let count = window.zhongjyuan.runtime.loadStack.length;

			window.zhongjyuan.runtime.loadStack.forEach(function (handler) {
				if (handler && typeof handler === "function") handler();
				count--;
			});

			if (count === 0) resolve();
		} catch (error) {
			reject();
		}
	});
}

/**
 * 添加准备完成后的处理函数
 * @param {Function} handler 要添加到准备堆栈的处理函数
 * @example
 * // 创建一个处理函数
 * function myHandler() {
 *   // 执行一些操作
 *   console.log('准备完成后执行的处理函数');
 * }
 *
 * // 添加处理函数到准备堆栈
 * addReady(myHandler);
 */
export function addReady(handler) {
	window.zhongjyuan.runtime.readyStack.push(handler);
}

/**
 * 执行准备完成后的处理函数
 * 遍历准备堆栈中的每个处理函数，并执行它们
 * @example
 * // 创建一个处理函数
 * function myHandler() {
 *   // 执行一些操作
 *   console.log('准备完成后执行的处理函数');
 * }
 *
 * // 添加处理函数到准备堆栈
 * addReady(myHandler);
 *
 * // 执行准备完成后的处理函数
 * executeReady(); // 输出：准备完成后执行的处理函数
 */
export function executeReady() {
	// 异步操作完成后调用 resolve()，表示执行完成
	// 或者在出现错误时调用 reject()，表示执行出错
	return new Promise((resolve, reject) => {
		try {
			let count = window.zhongjyuan.runtime.readyStack.length;

			window.zhongjyuan.runtime.readyStack.forEach(function (handler) {
				if (handler && typeof handler === "function") handler();
				count--;
			});

			if (count === 0) resolve();
		} catch (error) {
			reject();
		}
	});
}

/**
 * 设置变量的值
 * @param {string} key 变量的键名
 * @param {string} value 变量的值
 * @param {boolean} [path=false] 是否将值中的反斜杠转换为正斜杠，默认为 false
 * @example
 * // 设置一个名为 "username" 的变量值为 "John"
 * setVariable("username", "John");
 *
 * // 设置一个名为 "path" 的变量值为 "C:\project\file.js"，并将反斜杠转换为正斜杠
 * setVariable("path", "C:\\project\\file.js", true);
 */
export function setVariable(key, value, path) {
	if (key) window.zhongjyuan.runtime.variable[key] = path ? value.replace(/\\/g, "/") : value;
}

/**
 * 获取变量的值
 * @param {string} key 变量的键名
 * @returns {string|undefined} 变量的值，如果键名不存在则返回 undefined
 * @example
 * // 获取名为 "username" 的变量值
 * const username = getVariable("username");
 * console.log(username); // 输出变量值
 *
 * // 获取名为 "age" 的变量值
 * const age = getVariable("age");
 * console.log(age); // 输出变量值
 */
export function getVariable(key) {
	if (key) return window.zhongjyuan.runtime.variable[key];
	return null;
}

/**
 * 创建运行时属性，并设置默认值和类型校验规则
 * @param {string} name - 属性名
 * @param {string} type - 属性类型，可选值为 "object"、"array"、"string"、"number"、"boolean"
 * @param {boolean} check - 是否进行值类型校验，true 表示进行校验，false 表示不进行校验
 */
export function createRuntimeProperty(name, type = "object", check = false) {
	if (!window.zhongjyuan.runtime[name]) {
		Object.defineProperty(window.zhongjyuan.runtime, name, {
			get: function () {
				return this.value;
			},
			set: function (newValue) {
				if (check && typeof newValue !== type) {
					throw new TypeError(`${name}属性值类型错误，必须为${type}`);
				}
				this.value = newValue;
			},
			// writable: true, // 指定属性是否可被修改。设为 false 时，属性的值将变为只读。
			enumerable: false, // 指定属性是否可枚举。设为 false 时，属性将不会出现在 for...in 循环中。
			configurable: true, // 指定属性是否可配置。设为 false 时，属性的特性将无法再被修改，并且无法通过 delete 操作符删除属性。
		});

		const defaultValue = function (type) {
			switch (type) {
				case "object":
					return {};
				case "array":
					return [];
				case "string":
					return "";
				case "number":
					return 0;
				case "boolean":
					return false;
				default:
					return undefined;
			}
		};

		// 设置默认值
		window.zhongjyuan.runtime[name] = defaultValue(type);
	}
}

/**
 * 动态加载样式表
 * @param {string} url - 样式表的 URL
 * @param {Function} callback - 可选的回调函数，在样式表加载完成后执行
 *
 * @example
 * const url = "https://zhongjyuan.com/styles.css";
 * loadStyle(url, (style) => {
 *   console.log("Stylesheet loaded:", style.href);
 * });
 */
export function loadStyle(url, callback) {
	const style = document.createElement("link");
	style.rel = "stylesheet";
	style.type = "text/css";
	style.href = url;

	if (callback && typeof callback === "function") {
		// 样式表加载完成时，移除事件监听器并执行回调函数
		const onReadyStateChange = () => {
			if (style.readyState === "loaded" || style.readyState === "complete") {
				style.removeEventListener("readystatechange", onReadyStateChange);
				callback(style);
			}
		};

		// 样式表加载完成时，移除事件监听器并执行回调函数
		const onLoad = () => {
			style.removeEventListener("load", onLoad);
			callback(style);
		};

		style.addEventListener("load", onLoad);
		style.addEventListener("readystatechange", onReadyStateChange);
	}

	// 将样式表添加到文档的头部
	document.head.appendChild(style);
	window.zhongjyuan.runtime.loadStyle.push(style);
}

/**
 * 动态加载脚本文件
 * @param {string} url - 脚本文件的 URL
 * @param {Function} callback - 可选的回调函数，在脚本加载完成后执行
 * @param {boolean} body - 是否将脚本添加到 body 部分，默认为 false，即添加到头部
 *
 * @example
 * const url = "https://zhongjyuan.com/script.js";
 * loadScript(url, (script) => {
 *   console.log("Script loaded:", script.src);
 * }, true);
 */
export function loadScript(url, callback, body = false) {
	const script = document.createElement("script");
	script.type = "text/javascript";
	script.src = url;

	if (callback && typeof callback === "function") {
		const onReadyStateChange = () => {
			// 脚本加载完成时，移除事件监听器并执行回调函数
			if (script.readyState === "loaded" || script.readyState === "complete") {
				script.removeEventListener("readystatechange", onReadyStateChange);
				callback(script);
			}
		};

		// 脚本加载完成时，移除事件监听器并执行回调函数
		const onLoad = () => {
			script.removeEventListener("load", onLoad);
			callback(script);
		};
		script.addEventListener("load", onLoad);
		script.addEventListener("readystatechange", onReadyStateChange);
	}

	body ? document.body.appendChild(script) : document.head.appendChild(script);
	window.zhongjyuan.runtime.loadScript.push({ body: body, script: script });
}

/**
 * 预加载资源
 * @param {string} url - 资源的 URL
 * @param {Function} callback - 可选的回调函数，在资源加载完成后执行
 *
 * @example
 * const url = "https://zhongjyuan.com/resource";
 * loadPrefetch(url, (link) => {
 *   console.log("Resource preloaded:", link.href);
 * });
 */
export function loadPrefetch(url, callback) {
	const link = document.createElement("link");
	link.rel = "prefetch";
	link.href = url;

	let called = false;
	if (callback && typeof callback === "function") {
		const onReadyStateChange = () => {
			// 脚本加载完成时，移除事件监听器并执行回调函数
			if (!called && (this.readyState === "loaded" || this.readyState === "complete")) {
				called = true;
				callback(link);
			}
		};

		// 脚本加载完成时，移除事件监听器并执行回调函数
		const onLoad = () => {
			if (!called) {
				called = true;
				callback(link);
			}
		};

		const onError = () => {
			throw new Error(`Failed to prefetch resource ${url}`);
		};

		link.addEventListener("load", onLoad);
		link.addEventListener("error", onError);
		link.addEventListener("readystatechange", onReadyStateChange);

		setTimeout(() => {
			if (!called) {
				called = true;
				callback(link);
			}
		}, 1000);
	}

	document.head.appendChild(link);
	window.zhongjyuan.runtime.loadPrefetch.push(link);
}

/**
 * 注册页面加载完成后执行的处理函数
 * @param {Function} handler 页面加载完成后要执行的处理函数
 * @example
 * // 注册一个处理函数，在页面加载完成后弹出提示框
 * onLoad(function() {
 *   alert("页面加载完成");
 * });
 */
export function onLoad(handler) {
	const oldLoad = window.onload;

	// 重新定义 onload 事件处理函数
	window.onload = function () {
		// 如果之前存在 onload 处理函数，则执行它
		oldLoad?.();

		// 执行传入的处理函数
		if (handler && typeof handler === "function") handler();

		// 在 executeLoad 完成后执行 executeReady 的异步操作链
		// 首先定义了 executeLoad 和 executeReady 函数，每个函数返回一个 Promise 对象，以便进行异步操作。然后，我们使用 executeLoad().then().then().catch() 的方式创建了异步操作链
		// executeLoad 执行后会返回一个 Promise 对象。然后，我们在第一个 then 处理函数中执行 executeReady 并返回其 Promise 对象。这样，executeReady 的结果将成为第二个 then 处理函数的输入
		// 如果任何一个异步操作出现错误，都会跳转到 catch 处理函数进行异常处理。
		window.zhongjyuan
			.executeLoad()
			.then(() => {
				return window.zhongjyuan.executeReady();
			})
			.then(() => {
				// isDefault成功处理逻辑
				window.zhongjyuan.notify.send("load-finish", "zhongjyuan", "27");
			})
			.catch((error) => {
				// 异常处理逻辑
				window.zhongjyuan.notify.send("load-exception", "zhongjyuan", "undefined");
			});
	};
}

import setting from "../setting"; // 设置对象

/**
 * ZHONGJYUAN 基础对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年7月12日16:18:24
 */
export const information = {
	/**名称 */
	name: "ZHONGJYUAN",
	/**版本 */
	version: "v1.0.0",
	/**作者 */
	author: "zhongjyuan",
	/**邮箱 */
	email: "zhongjyuan@outlook.com",
	/**官网 */
	website: "https://zhongjyuan.club",
	/**版权 */
	copyright: "copyright@2023 zhongjyuan.club",
	/**声明 */
	statement: "接下来过的每一天,都是余生中最年轻的一天!",
	/**授权证书 */
	authorization: "社区版",
	/**序列号 */
	serialnumber: "940870777",
};

// 基础信息
window.zhongjyuan = {
	...window.zhongjyuan,
	...information,
	setting: setting,
	runtime: {
		...window.zhongjyuan.runtime,
		...information,
		setting: setting,
	},
};
