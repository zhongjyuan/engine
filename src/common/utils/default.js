import logger from "@base/logger";

export default {
	uuid: logger.decorator(uuid, "tool-uuid"),
	lang: logger.decorator(lang, "tool-lang"),
	twoDigits: logger.decorator(twoDigits, "tool-two-digits"),
	currentTime: logger.decorator(currentTime, "tool-current-time"),
	evalObject: logger.decorator(evalObject, "tool-eval-object"),
	evalFunction: logger.decorator(evalFunction, "tool-eval-function"),
	typeChecker: logger.decorator(typeChecker, "tool-type-checker"),
	isNull: logger.decorator(isNull, "tool-is-null"),
	isUndefined: logger.decorator(isUndefined, "tool-is-undefined"),
	isNullOrUndefined: logger.decorator(isNullOrUndefined, "tool-is-null-or-undefined"),
	isInt: logger.decorator(isInt, "tool-is-int"),
	isDate: logger.decorator(isDate, "tool-is-date"),
	isArray: logger.decorator(isArray, "tool-is-array"),
	isString: logger.decorator(isString, "tool-is-string"),
	isNumber: logger.decorator(isNumber, "tool-is-number"),
	isNumeric: logger.decorator(isNumeric, "tool-is-numeric"),
	isBoolean: logger.decorator(isBoolean, "tool-is-boolean"),
	isFunction: logger.decorator(isFunction, "tool-is-function"),
	isNormal: logger.decorator(isNormal, "tool-is-normal"),
	isEmpty: logger.decorator(isEmpty, "tool-is-empty"),
	isObject: logger.decorator(isObject, "tool-is-object"),
	isBrowserEnv: logger.decorator(isBrowserEnv, "tool-is-browser-env"),
	delay: logger.decorator(delay, "tool-delay"),
	forEach: logger.decorator(forEach, "tool-for-each"),
	animate: logger.decorator(animate, "tool-animate"),
	debounce: logger.decorator(debounce, "tool-debounce"),
	throttle: logger.decorator(throttle, "tool-throttle"),
	singleton: logger.decorator(singleton, "tool-singleton"),
	pollWithRetry: logger.decorator(pollWithRetry, "tool-poll-with-retry"),
	waitForCondition: logger.decorator(waitForCondition, "tool-wait-for-condition"),
};

/**
 * 检查当前环境是否为浏览器环境
 * @returns {boolean} - 如果当前环境为浏览器环境，则返回 true；否则返回 false。
 *
 * @example
 * const browserEnv = isBrowserEnv();
 * console.log(browserEnv); // 输出 true 或 false，表示当前环境是否为浏览器环境
 */
export function isBrowserEnv() {
	return typeof window !== "undefined" && typeof document !== "undefined" && typeof document.createElement === "function";
}

/**
 * 解析并执行以字符串形式表示的函数。
 *
 * @param {string} functionString 字符串表示的函数。
 * @returns {*} - 函数执行的结果。
 * @example
 *
 * const fnString = 'console.log("Hello, World!")';
 * evalFunction(fnString); // 输出：Hello, World!
 */
export function evalFunction(functionString) {
	// 使用严格模式以确保代码在执行时遵循严格的语法规则
	return Function('"use strict";return (' + functionString + ")")();
}

/**
 * 将一个字符串解析为 JavaScript 对象
 * @param {string} string 待解析的字符串
 * @returns {object} 解析后的 JavaScript 对象
 * @example
 * const str1 = '{"name": "Alice", "age": 25, "city": "New York"}';
 * const obj1 = evalObject(str1);
 * console.log(obj1); // {name: "Alice", age: 25, city: "New York"}
 *
 * const str2 = '{"fruit": "apple", "color": "red"}';
 * const obj2 = evalObject(str2);
 * console.log(obj2); // {fruit: "apple", color: "red"}
 *
 * const str3 = '{"brand": "Nike", "size": "L", "price": 59.99}';
 * const obj3 = evalObject(str3);
 * console.log(obj3); // {brand: "Nike", size: "L", price: 59.99}
 *
 * // 使用 evalObject 方法直接将字符串解析为数组
 * const str4 = '["apple", "banana", "orange"]';
 * const arr2 = evalObject(str4);
 * console.log(arr2); // ["apple", "banana", "orange"]
 */
export function evalObject(string) {
	return eval("(" + string + ")");
}

/**
 * 类型判断函数
 * @param {string} type 要判断的类型
 * @returns {function} 类型判断函数
 *
 * @example
 * var isType = typeChecker("Array");
 * console.log(isType([1, 2, 3])); // 输出 true
 * console.log(isType("hello")); // 输出 false
 *
 * @example
 * var isArray = typeChecker("Array");
 * console.log(isArray([1, 2, 3])); // 输出 true
 * console.log(isArray("hello")); // 输出 false
 *
 * @example
 * var isFunction = typeChecker("Function");
 * console.log(isFunction(function() {})); // 输出 true
 * console.log(isFunction(123)); // 输出 false
 */
export function typeChecker(type) {
	if (!window.zhongjyuan.runtime.typeChecker[type]) {
		const checker = function (obj) {
			return Object.prototype.toString.call(obj) === "[object " + type + "]";
		};
		window.zhongjyuan.runtime.typeChecker[type] = checker;
	}
	return window.zhongjyuan.runtime.typeChecker[type];
}

/**
 * 判断对象是否为null
 * @param {any} object 要判断的对象
 * @returns {boolean} 对象是否为null，true表示是，false表示不是
 *
 * @example
 * const obj1 = null;
 * console.log(isNull(obj1)); // true
 *
 * const obj2 = undefined;
 * console.log(isNull(obj2)); // false
 *
 * const obj3 = 0;
 * console.log(isNull(obj3)); // false
 *
 * const obj4 = "";
 * console.log(isNull(obj4)); // false
 *
 * const obj5 = {};
 * console.log(isNull(obj5)); // false
 */
export function isNull(object) {
	return object === null;
}

/**
 * 判断对象是否为undefined
 * @param {any} object 要判断的对象
 * @returns {boolean} 对象是否为undefined，true表示是，false表示不是
 *
 * @example
 * const obj1 = undefined;
 * console.log(isUndefined(obj1)); // true
 *
 * const obj2 = null;
 * console.log(isUndefined(obj2)); // false
 *
 * const obj3 = 0;
 * console.log(isUndefined(obj3)); // false
 *
 * const obj4 = "";
 * console.log(isUndefined(obj4)); // false
 *
 * const obj5 = {};
 * console.log(isUndefined(obj5)); // false
 */
export function isUndefined(object) {
	return object === void 0;
}

/**
 * 判断对象是否为null或undefined
 * @param {any} object 要判断的对象
 * @returns {boolean} 对象是否为null或undefined，true表示是，false表示不是
 *
 * @example
 * const obj1 = null;
 * console.log(isNullOrUndefined(obj1)); // true
 *
 * const obj2 = undefined;
 * console.log(isNullOrUndefined(obj2)); // true
 *
 * const obj3 = 0;
 * console.log(isNullOrUndefined(obj3)); // false
 *
 * const obj4 = "";
 * console.log(isNullOrUndefined(obj4)); // false
 *
 * const obj5 = {};
 * console.log(isNullOrUndefined(obj5)); // false
 */
export function isNullOrUndefined(object) {
	return isNull(object) || isUndefined(object);
}

/**
 * 判断一个对象是否为日期类型。
 * @param {any} object 要判断的对象。
 * @returns {boolean} 如果对象是日期类型，则返回 true；否则返回 false。
 *
 * @example
 * console.log(isDate(new Date())); // 输出: true
 * console.log(isDate('2021-09-01')); // 输出: false
 */
export function isDate(object) {
	return typeChecker("Date")(object);
}

/**
 * 判断一个对象是否为数组类型。
 * @param {any} object 要判断的对象。
 * @returns {boolean} 如果对象是数组类型，则返回 true；否则返回 false。
 *
 * @example
 * console.log(isArray([1, 2, 3])); // 输出: true
 * console.log(isArray('Hello')); // 输出: false
 */
export function isArray(object) {
	return typeChecker("Array")(object);
}

/**
 * 判断一个对象是否为字符串类型。
 * @param {any} object 要判断的对象。
 * @returns {boolean} 如果对象是字符串类型，则返回 true；否则返回 false。
 *
 * @example
 * console.log(isString('Hello')); // 输出: true
 * console.log(isString(123)); // 输出: false
 */
export function isString(object) {
	return typeChecker("String")(object);
}

/**
 * 判断一个对象是否为数值类型。
 * @param {any} object 要判断的对象。
 * @returns {boolean} 如果对象是数值类型，则返回 true；否则返回 false。
 *
 * @example
 * console.log(isNumber(123)); // 输出: true
 * console.log(isNumber('Hello')); // 输出: false
 */
export function isNumber(object) {
	return typeChecker("Number")(object);
}

/**
 * 判断一个对象是否为布尔类型。
 * @param {any} object 要判断的对象。
 * @returns {boolean} 如果对象是布尔类型，则返回 true；否则返回 false。
 *
 * @example
 * console.log(isBoolean(true)); // 输出: true
 * console.log(isBoolean(123)); // 输出: false
 */
export function isBoolean(object) {
	return typeChecker("Boolean")(object);
}

/**
 * 判断一个对象是否为函数类型。
 * @param {any} object 要判断的对象。
 * @returns {boolean} 如果对象是函数类型，则返回 true；否则返回 false。
 *
 * @example
 * console.log(isFunction(() => {})); // 输出: true
 * console.log(isFunction(123)); // 输出: false
 */
export function isFunction(object) {
	return typeChecker("Function")(object);
}

/**
 * 判断对象是否为数字类型
 * @param {any} object 要判断的对象
 * @returns {boolean} 对象是否为数字类型，true表示是，false表示不是
 *
 * @example
 * console.log(isNumeric(123)); // true
 * console.log(isNumeric("456")); // true
 * console.log(isNumeric("abc")); // false
 * console.log(isNumeric(null)); // false
 * console.log(isNumeric({})); // false
 */
export function isNumeric(object) {
	return object - parseFloat(object) >= 0;
}

/**
 * 判断对象是否为整数类型
 * @param {any} object 要判断的对象
 * @returns {boolean} 对象是否为整数类型，true表示是，false表示不是
 *
 * @example
 * console.log(isInt(123)); // true
 * console.log(isInt("456")); // true
 * console.log(isInt(3.14)); // false
 * console.log(isInt("abc")); // false
 * console.log(isInt(null)); // false
 * console.log(isInt({})); // false
 */
export function isInt(object) {
	return isNumeric(object) && String(object).indexOf(".") === -1;
}

/**
 * 判断一个对象是否是正常的（非 undefined、null 或空字符串）
 * @param {*} object - 要判断的对象
 * @returns {boolean} - 如果对象是正常的，则返回 true；否则返回 false
 *
 * @example
 * console.log(isNormal("hello")); // 输出 true
 * console.log(isNormal(null)); // 输出 false
 * console.log(isNormal(undefined)); // 输出 false
 * console.log(isNormal("")); // 输出 false
 * console.log(isNormal(0)); // 输出 true
 * console.log(isNormal(false)); // 输出 true
 */
export function isNormal(object) {
	return !(typeof object === "undefined" || object === null || object === "");
}

/**
 * 判断对象是否为空
 * @param {any} object 要判断的对象
 * @returns {boolean} 对象是否为空的结果，true表示为空，false表示不为空
 *
 * @example
 * const obj1 = null;
 * console.log(isEmpty(obj1)); // true
 *
 * const obj2 = undefined;
 * console.log(isEmpty(obj2)); // true
 *
 * const obj3 = "";
 * console.log(isEmpty(obj3)); // true
 *
 * const obj4 = NaN;
 * console.log(isEmpty(obj4)); // true
 *
 * const obj5 = 0;
 * console.log(isEmpty(obj5)); // false
 *
 * const obj6 = "Hello";
 * console.log(isEmpty(obj6)); // false
 *
 * const obj7 = {};
 * console.log(isEmpty(obj7)); // false
 */
export function isEmpty(object) {
	return isNullOrUndefined(object) || (isString(object) && object === "") || Object.is(NaN, object);
}

/**
 * 判断对象是否为普通对象（Object）
 * @param {any} object 要判断的对象
 * @returns {boolean} 对象是否为普通对象，true表示是，false表示不是
 *
 * @example
 * const obj1 = {};
 * console.log(isObject(obj1)); // true
 *
 * const obj2 = [];
 * console.log(isObject(obj2)); // false
 *
 * const obj3 = null;
 * console.log(isObject(obj3)); // false
 *
 * const obj4 = "Hello";
 * console.log(isObject(obj4)); // false
 *
 * const obj5 = 123;
 * console.log(isObject(obj5)); // false
 */
export function isObject(object) {
	return (object && typeof object === "object" && Object.getPrototypeOf(object) === Object.prototype) || false;
}

/**
 * 生成指定长度的 UUID
 * @param {number} len UUID 的长度，默认为 36
 * @param {boolean} removeDash 是否移除连字符，默认为 false
 * @returns {string} 生成的 UUID
 */
export function uuid(len = 36, removeDash = false) {
	// 获取当前时间的毫秒数
	var d = new Date().getTime();

	// 定义模板字符串
	var result = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		// 生成随机数
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		// 根据模板替换字符
		return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
	});

	// 如果需要移除连字符，则将连字符替换为空字符串
	if (removeDash) {
		result = result.replace(/-/g, "");
	}

	// 返回指定长度的 UUID
	return result.substring(0, len);
}

/**
 * 获取用户的语言设置
 * @param {string} defaultLang 默认语言，例如 "en_us"
 * @returns {string} 用户的语言设置，例如 "zh_cn"
 *
 * @example
 * // 示例 1: 成功获取语言设置
 * lang(); // 返回用户的语言设置，例如 "en_us"
 *
 * @example
 * // 示例 2: 未获取到语言设置，返回默认语言
 * lang("fr_fr"); // 返回默认语言 "fr_fr"
 *
 * @example
 * // 示例 3: 未获取到语言设置且未传入默认语言，返回默认值 "zh_cn"
 * lang(); // 返回默认值 "zh_cn"
 */
export function lang(defaultLang) {
	// 获取用户的语言设置
	const language = (navigator.language || navigator.browserLanguage)?.toLowerCase();

	// 返回用户的语言设置，如果未获取到，则返回默认语言或者 "zh_cn"
	return language || defaultLang || window.zhongjyuan.runtime.lang;
}

/**
 * 在数字小于 10 时，在前面添加一个零。
 * @param {number} num - 要格式化的数字。
 * @returns {string} - 格式化后的字符串。
 *
 * @example
 * // 示例 1:
 * const result = twoDigits(5);
 * console.log(result); // 输出: "05"
 *
 * // 示例 2:
 * const result2 = twoDigits(15);
 * console.log(result2); // 输出: "15"
 */
export function twoDigits(num) {
	return num < 10 ? "0" + num : "" + num;
}

/**
 * 当前的日期和时间。
 *
 * @param {string} [format='YYYY-MM-DD HH:MM:SS'] - 日期和时间的格式，默认为 "YYYY-MM-DD HH:MM:SS"。
 * @returns {string} 当前的日期和时间，根据提供的格式进行格式化。
 * @example
 *
 * const defaultFormattedTime = currentTime(); // 使用默认的格式
 * console.log(defaultFormattedTime); // 输出当前的日期和时间，格式为 "YYYY-MM-DD HH:MM:SS"
 *
 * const customFormattedTime = currentTime('YYYY年MM月DD日 HH时mm分ss秒'); // 使用自定义的格式
 * console.log(customFormattedTime); // 输出当前的日期和时间，格式为 "YYYY年MM月DD日 HH时mm分ss秒"
 */
export function currentTime(format = "yyyy年MM月dd日 hh时mm分ss秒S毫秒 W 季度q ap 时区: GMT") {
	return new Date().format(format);
}

/**
 * 对数组或对象的每个元素执行回调函数。
 * @param {Array|Object} data 要遍历的数组或对象。
 * @param {Function} callback 对每个元素执行的回调函数。
 * @returns {undefined}
 *
 * @example
 * var arr = [1, 2, 3];
 * forEach(arr, function(item, index) {
 *   console.log(item, index);
 * });
 * // Output:
 * // 1 0
 * // 2 1
 * // 3 2
 *
 * var obj = { a: 1, b: 2, c: 3 };
 * forEach(obj, function(value, key) {
 *   console.log(key, value);
 * });
 * // Output:
 * // a 1
 * // b 2
 * // c 3
 */
export function forEach(data, callback) {
	if (!isArray(data) && !isObject(data)) {
		logger.error("[forEach] 参数异常：data<${0}>必须是数组类型或对象类型.", JSON.stringify(data));
		return;
	}

	if (!isFunction(callback)) {
		logger.error("[forEach] 参数异常：callback<${0}>必须是函数类型.", callback.toString());
		return;
	}

	if (isArray(data)) {
		data.forEach(callback);
	} else if (isObject(data)) {
		Object.keys(data).forEach(function (key) {
			callback.call(data, data[key], key);
		});
	}
}

/**
 * 延迟执行函数的包装器
 *
 * @param {Function} handler 要延迟执行的函数
 * @param {Function} callback 当函数成功执行时的回调函数
 * @param {number} maxTime 最大延迟时间（以毫秒为单位）
 * @returns {Object} 返回一个包含 `start` 和 `stop` 方法的对象
 *
 * @example
 * // 示例1: 创建一个延迟执行函数的实例，并启动延迟执行
 * var delayFunc = delay(function () {
 *   console.log('延迟执行函数');
 * }, function () {
 *   console.log('函数成功执行后的回调');
 * }, 2000);
 *
 * delayFunc.start(); // 开始延迟执行函数
 *
 * // 执行过程中如果需要取消延迟执行，可以调用 stop 方法：
 * delayFunc.stop(); // 取消延迟执行
 */
export function delay(handler, callback, maxTime) {
	if (!isFunction(handler)) {
		logger.error("[delay] 参数异常：handler<${0}>必须是函数类型.", handler.toString());
		return null;
	}

	if (!isFunction(callback)) {
		logger.error("[delay] 参数异常：callback<${0}>必须是函数类型.", callback.toString());
		return null;
	}

	if (!isNumber(maxTime)) {
		logger.error("[delay] 参数异常：maxTime<${0}>必须是数值类型.", JSON.stringify(maxTime));
		return null;
	}

	var key = uuid();
	return {
		/**始延迟执行函数 */
		start: function () {
			window.zhongjyuan.createRuntimeProperty("delay_timer", "object");
			window.zhongjyuan.runtime.delay_timer[key]
				? window.clearTimeout(window.zhongjyuan.runtime.delay_timer[key].timer)
				: (window.zhongjyuan.runtime.delay_timer[key] = { call: false, timer: null });

			window.zhongjyuan.runtime.delay_timer[key] = {
				call: false,
				timer: setTimeout(function () {
					if (isFunction(handler)) {
						handler();
						window.zhongjyuan.runtime.delay_timer[key].call = true;
					}
				}, maxTime),
			};
		},
		/**取消延迟执行 */
		stop: function () {
			if (window.zhongjyuan.runtime.delay_timer[key].call) {
				if (isFunction(callback)) callback();
			} else {
				window.clearTimeout(window.zhongjyuan.runtime.delay_timer[key].timer);
			}
			handler = null;
			callback = null;
		},
	};
}

/**
 * 单例函数
 *
 * @param {Function} handler 创建实例的函数
 * @returns {Function|null} 返回一个单例函数
 *
 * @example
 * // 示例1: 创建一个用于计数的单例对象
 * var counter = singleton(function () {
 *   var count = 0;
 *
 *   return {
 *     increment: function () {
 *       count++;
 *     },
 *     getCount: function () {
 *       return count;
 *     }
 *   };
 * })();
 *
 * counter.increment();
 * console.log(counter.getCount()); // 输出: 1
 *
 * counter.increment();
 * console.log(counter.getCount()); // 输出: 2
 *
 * @example
 * // 示例2: 创建一个单例网络请求对象
 * var ajax = singleton(function () {
 *   var instance = axios.create({
 *     baseURL: 'https://api.zhongjyuan.club'
 *   });
 *
 *   // 添加拦截器、设置认证信息等
 *   // ...
 *
 *   return instance;
 * });
 *
 * // 在应用程序中多处使用相同的axios实例
 * ajax.get('/users')
 *   .then(function (response) {
 *     console.log(response.data);
 *   })
 *   .catch(function (error) {
 * 	   console.error(error);
 *   });
 *
 * ajax.get('/posts')
 *   .then(function (response) {
 *     console.log(response.data);
 *   })
 *   .catch(function (error) {
 * 	   console.error(error);
 *   });
 */
export function singleton(handler) {
	var inst = null;
	const self = this;

	if (!isFunction(handler)) {
		logger.error("[singleton] 参数异常：handler<${0}>必须是函数类型.", handler.toString());
		return null;
	}

	return function () {
		return inst || (inst = handler.apply(self, arguments));
	};
}

/**
 * 执行动画效果
 * @param {Object} options 配置选项对象
 * @param {number} options.duration 动画持续时间（毫秒）
 * @param {Function} options.delta]用于计算动画效果变化量的函数
 * @param {Function} options.step 更新动画状态的函数
 * @param {Function} [options.callback] (可选) 动画完成后的回调函数
 * @param {number} [options.delay] (可选) 每次执行回调函数的时间间隔，默认为10毫秒
 *   @property {number} duration 动画持续时间（毫秒）
 *   @property {Function} delta 用于计算动画效果变化量的函数
 *   @property {Function} step 更新动画状态的函数
 *   @property {Function} callback (可选) 动画完成后的回调函数
 *   @property {number} delay (可选) 每次执行回调函数的时间间隔，默认为10毫秒
 *
 * @example
 * animate({
 *   duration: 1000,  // 动画时长（毫秒）
 *   delay: 10,       // 帧之间的延迟时间（毫秒）
 *   delta: function(progress) {
 *     // 使用线性插值计算变化量
 *     return progress;
 *   },
 *   step: function(delta) {
 *     // 根据变化量更新动画状态
 *     element.style.opacity = delta;
 *   },
 *   callback: function() {
 *     // 动画完成后的回调逻辑
 *     console.log("动画完成");
 *   },
 *   delay: 20
 * });
 *
 * @example
 * animate({
 *   duration: 500,
 *   delta: function(progress) {
 *     // 使用缓动函数计算变化量，实现更加平滑的动画效果
 *     return Math.pow(progress, 2);
 *   },
 *   step: function(delta) {
 *     // 根据变化量更新动画状态
 *     element.style.width = delta * 100 + "%";
 *   }
 * });
 */
export function animate(options) {
	var key = uuid();

	window.zhongjyuan.createRuntimeProperty("animate_interval", "object");
	window.zhongjyuan.runtime.animate_interval[key]
		? clearTimeout(window.zhongjyuan.runtime.animate_interval[key])
		: (window.zhongjyuan.runtime.animate_interval[key] = null);

	var start = new Date();
	window.zhongjyuan.runtime.animate_interval[key] = window.setInterval(function () {
		var timePassed = new Date() - start;

		var progress = timePassed / options.duration;
		if (progress > 1) progress = 1;

		var delta = options.delta(progress);
		options.step(delta);

		if (progress === 1) {
			window.clearInterval(window.zhongjyuan.runtime.animate_interval[key]);
			if (isFunction(options.callback)) {
				options.callback();
			}
		}
	}, options.delay || 10);
}

/**
 * 防抖函数，延迟执行指定函数，用于频繁触发的事件防止过快执行。
 *
 * @param {function} handler 要执行的函数
 * @param {number} delay 延迟时间（毫秒）
 * @param {boolean} immediate 是否立即执行一次，默认为false
 * @returns {function} 包装后的防抖函数
 *
 * @example
 * function saveData() {
 *   // 在输入框中频繁输入时将会等待500ms后才执行保存操作
 *   console.log('Saving data...')
 * }
 *
 * const debounceSaveData = debounce(saveData, 500);
 * input.addEventListener('input', debounceSaveData);
 *
 * @example
 * function showMessage() {
 *   // 点击按钮频繁触发时将会等待1000ms后才显示消息
 *   console.log('Button clicked!')
 * }
 *
 * const debounceShowMessage = debounce(showMessage, 1000, true);
 * button.addEventListener('click', debounceShowMessage);
 *
 * @example
 * function fetchData() {
 *   // 在搜索框中输入内容后将会等待300ms后才发起网络请求
 *   console.log('Fetching data...')
 * }
 *
 * const debounceFetchData = debounce(fetchData, 300);
 * searchInput.addEventListener('input', debounceFetchData);
 *
 * @example
 * function handleResize() {
 *   // 窗口大小改变时将会等待200ms后执行适应布局的操作
 *   console.log('Resizing window...')
 * }
 *
 * const debounceHandleResize = debounce(handleResize, 200);
 * window.addEventListener('resize', debounceHandleResize);
 */
export function debounce(handler, delay, immediate) {
	if (!isFunction(handler)) {
		logger.error("[debounce] 参数异常：handler<${0}>必须是函数类型.", handler.toString());
		return null;
	}

	if (!isNumber(delay)) {
		logger.error("[debounce] 参数异常：delay<${0}>必须是数值类型.", JSON.stringify(delay));
		return null;
	}

	if (!isBoolean(immediate)) {
		logger.error("[debounce] 参数异常：immediate<${0}>必须是Boolean类型.", JSON.stringify(immediate));
		return null;
	}

	if (immediate) {
		handler.apply(this, arguments);
	}

	var key = uuid();
	window.zhongjyuan.createRuntimeProperty("debounce_timer", "object");
	return function () {
		const that = this;
		const param = arguments;

		window.zhongjyuan.runtime.debounce_timer[key]
			? window.clearTimeout(window.zhongjyuan.runtime.debounce_timer[key])
			: (window.zhongjyuan.runtime.debounce_timer[key] = null);

		window.zhongjyuan.runtime.debounce_timer[key] = window.setTimeout(function () {
			handler.apply(that, param);
		}, delay);
	};
}

/**
 * 节流函数，控制函数在指定时间间隔内只执行一次。
 *
 * @param {function} handler - 要执行的函数
 * @param {number} intervalTime - 时间间隔（毫秒）
 * @returns {function} 包装后的节流函数
 *
 * @example
 * function handleScroll() {
 *   // 页面滚动时将每200ms执行一次处理函数
 *   console.log('Scrolling...')
 * }
 *
 * const throttleHandleScroll = throttle(handleScroll, 200);
 * window.addEventListener('scroll', throttleHandleScroll);
 *
 * @example
 * function sendRequest() {
 *   // 点击按钮发送请求时，在500ms内只能发送一次请求
 *   console.log('Sending request...')
 * }
 *
 * const throttleSendRequest = throttle(sendRequest, 500);
 * button.addEventListener('click', throttleSendRequest);
 *
 * @example
 * function handleMousemove() {
 *   // 鼠标移动时每100ms执行一次处理函数
 *   console.log('Moving mouse...')
 * }
 *
 * const throttleHandleMousemove = throttle(handleMousemove, 100);
 * document.addEventListener('mousemove', throttleHandleMousemove);
 */
export function throttle(handler, intervalTime) {
	if (!isFunction(handler)) {
		logger.error("[throttle] 参数异常：handler<${0}>必须是函数类型.", handler.toString());
		return null;
	}

	if (!isNumber(intervalTime)) {
		logger.error("[throttle] 参数异常：intervalTime<${0}>必须是数值类型.", JSON.stringify(intervalTime));
		return null;
	}

	var key = uuid();
	window.zhongjyuan.createRuntimeProperty("throttle_timer", "object");
	window.zhongjyuan.runtime.throttle_timer[key]
		? window.clearTimeout(window.zhongjyuan.runtime.throttle_timer[key].timer)
		: (window.zhongjyuan.runtime.throttle_timer[key] = { start: true, timer: null });

	return function () {
		const that = this;
		const param = arguments;

		if (window.zhongjyuan.runtime.throttle_timer[key].start) {
			window.zhongjyuan.runtime.throttle_timer[key].start = false;
			handler.apply(that, param);
		}

		if (!window.zhongjyuan.runtime.throttle_timer[key].timer) {
			window.zhongjyuan.runtime.throttle_timer[key].timer = window.setTimeout(function () {
				handler.apply(that, param);
				window.clearTimeout(window.zhongjyuan.runtime.throttle_timer[key].timer);
			}, intervalTime);
		}
	};
}

/**
 * 等待条件满足后执行回调函数
 * @param {boolean} condition 等待的条件
 * @param {Function} callback 条件满足时执行的回调函数
 * @param {number} [intervalTime=100] 轮询间隔时间（毫秒），默认为100毫秒
 *
 * @example
 * // 示例 1: 等待条件满足后执行回调函数
 * waitForCondition(true, function() {
 *   console.log("条件已满足");
 * });
 *
 * @example
 * // 示例 2: 设置自定义的轮询间隔时间
 * waitForCondition(myCondition, myCallback, 500); // 每500毫秒检查一次条件
 *
 * @example
 * // 示例 3: 条件立即满足时，立即执行回调函数
 * waitForCondition(false, function() {
 *   console.log("条件已满足");
 * }); // 回调函数会立即执行，不会延迟等待
 */
export function waitForCondition(condition, callback, intervalTime = 100) {
	if (!isBoolean(condition)) {
		logger.error("[waitForCondition] 参数异常：condition<${0}>必须是Boolean类型.", JSON.stringify(condition));
		return null;
	}

	if (!isFunction(callback)) {
		logger.error("[waitForCondition] 参数异常：callback<${0}>必须是函数类型.", callback.toString());
		return null;
	}

	if (!isNumber(intervalTime)) {
		logger.error("[waitForCondition] 参数异常：intervalTime<${0}>必须是数值类型.", JSON.stringify(intervalTime));
		return null;
	}

	var key = uuid();
	window.zhongjyuan.createRuntimeProperty("condition_interval", "object");
	window.zhongjyuan.runtime.condition_interval[key]
		? window.clearInterval(window.zhongjyuan.runtime.condition_interval[key])
		: (window.zhongjyuan.runtime.condition_interval[key] = null);

	window.zhongjyuan.runtime.condition_interval[key] = setInterval(function () {
		if (condition) {
			clearInterval(window.zhongjyuan.runtime.condition_interval[key]);
			callback();
		}
	}, intervalTime);
}

/**
 * 实现轮询函数，满足特定条件时执行回调函数。
 *
 * @param {Function} condition 检查条件是否满足的函数。
 * @param {Function} callback 在条件满足时执行的回调函数。
 * @param {number} [maxRetry=100] 最大重试次数，默认为100次。
 * @param {number} [intervalTime=100] 轮询间隔时间（毫秒），默认为100毫秒。
 * @example
 *
 * const checkCondition = () => {
 *   // 检查条件的具体逻辑实现
 * }
 *
 * const performCallback = () => {
 *   // 执行回调函数的具体逻辑实现
 * }
 *
 * pollWithRetry(checkCondition, performCallback, 10, 200);
 */
export function pollWithRetry(condition, callback, maxRetry = 100, intervalTime = 100) {
	if (!isBoolean(condition)) {
		logger.error("[pollWithRetry] 参数异常：condition<${0}>必须是Boolean类型.", JSON.stringify(condition));
		return null;
	}

	if (!isFunction(callback)) {
		logger.error("[pollWithRetry] 参数异常：callback<${0}>必须是函数类型.", callback.toString());
		return null;
	}

	if (!isNumber(maxRetry)) {
		logger.error("[pollWithRetry] 参数异常：maxRetry<${0}>必须是数值类型.", JSON.stringify(maxRetry));
		return null;
	}

	if (!isNumber(intervalTime)) {
		logger.error("[pollWithRetry] 参数异常：intervalTime<${0}>必须是数值类型.", JSON.stringify(intervalTime));
		return null;
	}

	var key = uuid();
	window.zhongjyuan.createRuntimeProperty("pol_interval", "object");
	window.zhongjyuan.runtime.pol_interval[key]
		? window.clearInterval(window.zhongjyuan.runtime.pol_interval[key])
		: (window.zhongjyuan.runtime.pol_interval[key] = { retry: 0, interval: null });

	window.zhongjyuan.runtime.pol_interval[key].interval = window.setInterval(() => {
		// 达到最大重试次数，不再继续轮询
		if (window.zhongjyuan.runtime.pol_interval[key].retry >= maxRetry) {
			window.clearInterval(window.zhongjyuan.runtime.pol_interval[key].interval);
			return;
		}

		try {
			// 条件满足，执行回调函数并清除轮询定时器
			if (condition()) {
				window.clearInterval(window.zhongjyuan.runtime.pol_interval[key].interval);
				callback();
			}
		} catch (error) {
			window.clearInterval(window.zhongjyuan.runtime.pol_interval[key].interval);
			logger.error("[pollWithRetry] error: ${0}", error.message);
		}

		window.zhongjyuan.runtime.pol_interval[key].retry++;
	}, intervalTime);
}
