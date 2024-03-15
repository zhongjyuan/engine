import config from "./config/config.js";

/**数据类型 */
const Type = {};

/**默认工作日 */
const workDays = [1, 2, 3, 4, 5];

/**
 * 判断一个对象是否属于指定的类型。
 * @param {string} type 要判断的类型名称。
 * @returns {Function} 返回一个函数，该函数用于判断对象是否属于指定类型。
 *
 * @example
 * // 创建用于判断数组的函数
 * var isArray = isType('Array');
 * console.log(isArray([1, 2, 3])); // 输出: true
 *
 * // 创建用于判断字符串的函数
 * var isString = isType('String');
 * console.log(isString('Hello')); // 输出: true
 *
 * // 创建用于判断数字的函数
 * var isNumber = isType('Number');
 * console.log(isNumber(42)); // 输出: true
 */
let isType = function(type) {
	if (!Type[type]) {
		Type[type] = function(obj) {
			return Object.prototype.toString.call(obj) === "[object " + type + "]";
		};
	}
	return Type[type];
};

/**
 * 应用缓存的Key后缀
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @returns
 * @example
 * config.storageKeyType = "const";
 * config.storageKeySuffix = "example";
 *
 * let suffix = storageKeySuffix(); // 调用storageKeySuffix函数
 * console.log(suffix); // 输出："_example"
 *
 * config.storageKeyType = "dynamic";
 * window.location.port = "8080";
 *
 * suffix = storageKeySuffix(); // 再次调用storageKeySuffix函数
 * console.log(suffix); // 输出："8080"
 */
let storageKeySuffix = function() {
	let suffix;

	// 检查存储键类型是否为 "const"
	if (config.storageKeyType === "const") {
		// 如果是，则将suffix赋值为config.storageKeySuffix，如果未定义，则为默认值"zhongjyuan"
		suffix = config.storageKeySuffix || "zhongjyuan";
	} else {
		// 否则，将suffix赋值为当前页面的端口号
		suffix = window.location.port;
	}

	// 根据suffix的值，确定使用不同的后缀函数
	if (suffix) {
		// 如果suffix存在，则定义一个名为keySuffix的函数，返回带下划线前缀的suffix
		keySuffix = function() {
			return `_${suffix}`;
		};
	} else {
		// 如果suffix不存在，则定义一个名为keySuffix的函数，返回空字符串
		keySuffix = function() {
			return "";
		};
	}

	// 返回实际的后缀字符串
	return keySuffix();
};

/**
 * 应用缓存的Key
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @param {*} key 键
 * @returns
 * @example
 * config.storageKeyType = "const";
 * config.storageKeySuffix = "example";
 *
 * let key1 = "data";
 * let mergedKey1 = storageKey(key1); // 调用storageKey函数，在key后面添加后缀
 * console.log(mergedKey1); // 输出："data_example"
 *
 * config.storageKeyType = "dynamic";
 * window.location.port = "8080";
 *
 * let key2 = "info";
 * let mergedKey2 = storageKey(key2); // 调用storageKey函数，不添加后缀
 * console.log(mergedKey2); // 输出："info"
 */
let storageKey = function(key) {
	const suffix = storageKeySuffix(); // 获取存储键的后缀

	if (suffix) {
		mergeKey = function(key) {
			if (typeof key !== "string") {
				throw new Error("key 必须是字符串！！"); // 如果key不是字符串，则抛出错误
			}
			return `${key}${suffix}`; // 返回将后缀添加到key后面的结果
		};
	} else {
		mergeKey = function(key) {
			if (typeof key !== "string") {
				throw new Error("key 必须是字符串！！"); // 如果key不是字符串，则抛出错误
			}
			return key; // 返回原始的key值
		};
	}

	return mergeKey(key); // 调用合并函数，返回最终的存储键
};

/**
 * 存储管理对象
 * @param {string} storage 存储对象名称
 *                        可选值："localStorage"、"sessionStorage"
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @website http://zhongjyuan.club
 */
class storageManager {
	/**
	 * 存储管理对象
	 * @param {*} storage 存储对象
	 */
	constructor(storage) {
		this.storage = storage;
	}

	/**
	 * 设置存储键
	 * @param {*} key 存储键
	 */
	set(key) {
		// 获取已存在的存储键列表
		let keys = this.getParse();
		// 将传入的键生成带后缀的存储键并添加到列表中
		keys.push(storageKey(key));
		// 去除重复的存储键
		keys = Array.from(new Set([...keys]));
		// 将更新后的存储键列表存储在指定的存储对象中
		window[this.storage].setItem(getAppStoreKey("window_storage_keys"), JSON.stringify(keys));
	}

	/**
	 * 获取存储键列表值
	 */
	get() {
		return window[this.storage].getItem(storageKey("window_storage_keys"));
	}

	/**
	 * 移除指定存储键及其对应的值
	 * @param {*} key 存储键
	 */
	remove(key) {
		// 获取已存在的存储键列表
		let keys = this.getParse();
		// 过滤掉要移除的存储键
		keys = keys.filter((k) => k !== storageKey(key));
		// 从存储对象中移除指定存储键及其对应的值
		window[this.storage].removeItem(storageKey(key));
		// 更新存储键列表
		window[this.storage].setItem(storageKey("window_storage_keys"), JSON.stringify(keys));
	}

	/**
	 * 获取解析后的存储键列表
	 */
	getParse() {
		// 获取存储键列表
		let keys = this.get();
		// 若存在存储键列表，则进行解析并返回
		return keys ? JSON.parse(keys) : [];
	}

	/**
	 * 清除存储对象中的所有存储键及对应的值
	 */
	clear() {
		// 获取已存在的存储键列表
		let keys = this.getParse();
		// 遍历存储键列表，逐一移除对应的存储键和值
		for (let key of keys) {
			window[this.storage].removeItem(key);
		}
		// 清空存储键列表
		window[this.storage].removeItem(storageKey("window_storage_keys"));
	}
}

/**
 * 存储Map集
 */
const storageMap = {
	localStorage: new storageManager("localStorage"),
	sessionStorage: new storageManager("sessionStorage"),
};

/**
 * 工具对象
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @website http://zhongjyuan.club
 */
const utils = {
	/**
	 * 根据指定的存储类型获取对应的值。
	 * @param {string} storage 存储类型名。
	 * @returns {*} 对应存储类型的值。
	 *
	 * @example
	 * const storageMap = {
	 * 	localStorage: new storageManager("localStorage"),
	 * 	sessionStorage: new storageManager("sessionStorage"),
	 * };
	 * var result = utils.storage("localStorage");
	 * console.log(result);
	 * // Output: "storageManager"
	 */
	storage: (storage) => storageMap[storage],

	/**
	 * 应用缓存的Key后缀
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @website http://zhongjyuan.club
	 * @returns
	 * @example
	 * config.storageKeyType = "const";
	 * config.storageKeySuffix = "example";
	 *
	 * let suffix = storageKeySuffix(); // 调用storageKeySuffix函数
	 * console.log(suffix); // 输出："_example"
	 *
	 * config.storageKeyType = "dynamic";
	 * window.location.port = "8080";
	 *
	 * suffix = storageKeySuffix(); // 再次调用storageKeySuffix函数
	 * console.log(suffix); // 输出："8080"
	 */
	storageKeySuffix: () => storageKeySuffix(),

	/**
	 * 应用缓存的Key
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @website http://zhongjyuan.club
	 * @param {*} key 键
	 * @returns
	 * @example
	 * config.storageKeyType = "const";
	 * config.storageKeySuffix = "example";
	 *
	 * let key1 = "data";
	 * let mergedKey1 = storageKey(key1); // 调用storageKey函数，在key后面添加后缀
	 * console.log(mergedKey1); // 输出："data_example"
	 *
	 * config.storageKeyType = "dynamic";
	 * window.location.port = "8080";
	 *
	 * let key2 = "info";
	 * let mergedKey2 = storageKey(key2); // 调用storageKey函数，不添加后缀
	 * console.log(mergedKey2); // 输出："info"
	 */
	storageKey: (key) => storageKey(key),

	/**
	 * 判断一个对象是否属于指定的类型。
	 * @param {string} type 要判断的类型名称。
	 * @returns {Function} 返回一个函数，该函数用于判断对象是否属于指定类型。
	 *
	 * @example
	 * // 创建用于判断数组的函数
	 * var isArray = isType('Array');
	 * console.log(isArray([1, 2, 3])); // 输出: true
	 *
	 * // 创建用于判断字符串的函数
	 * var isString = isType('String');
	 * console.log(isString('Hello')); // 输出: true
	 *
	 * // 创建用于判断数字的函数
	 * var isNumber = isType('Number');
	 * console.log(isNumber(42)); // 输出: true
	 */
	isType: (type) => isType(type),

	/**
	 * 判断一个对象是否为日期类型。
	 * @param {any} object 要判断的对象。
	 * @returns {boolean} 如果对象是日期类型，则返回 true；否则返回 false。
	 *
	 * @example
	 * console.log(isDate(new Date())); // 输出: true
	 * console.log(isDate('2021-09-01')); // 输出: false
	 */
	isDate: (object) => isType("Date")(object),

	/**
	 * 判断一个对象是否为数组类型。
	 * @param {any} object 要判断的对象。
	 * @returns {boolean} 如果对象是数组类型，则返回 true；否则返回 false。
	 *
	 * @example
	 * console.log(isArray([1, 2, 3])); // 输出: true
	 * console.log(isArray('Hello')); // 输出: false
	 */
	isArray: (object) => isType("Array")(object),

	/**
	 * 判断一个对象是否为字符串类型。
	 * @param {any} object 要判断的对象。
	 * @returns {boolean} 如果对象是字符串类型，则返回 true；否则返回 false。
	 *
	 * @example
	 * console.log(isString('Hello')); // 输出: true
	 * console.log(isString(123)); // 输出: false
	 */
	isString: (object) => isType("String")(object),

	/**
	 * 判断一个对象是否为数值类型。
	 * @param {any} object 要判断的对象。
	 * @returns {boolean} 如果对象是数值类型，则返回 true；否则返回 false。
	 *
	 * @example
	 * console.log(isNumber(123)); // 输出: true
	 * console.log(isNumber('Hello')); // 输出: false
	 */
	isNumber: (object) => isType("Number")(object),

	/**
	 * 判断一个对象是否为布尔类型。
	 * @param {any} object 要判断的对象。
	 * @returns {boolean} 如果对象是布尔类型，则返回 true；否则返回 false。
	 *
	 * @example
	 * console.log(isBoolean(true)); // 输出: true
	 * console.log(isBoolean(123)); // 输出: false
	 */
	isBoolean: (object) => isType("Boolean")(object),

	/**
	 * 判断一个对象是否为函数类型。
	 * @param {any} object 要判断的对象。
	 * @returns {boolean} 如果对象是函数类型，则返回 true；否则返回 false。
	 *
	 * @example
	 * console.log(isFunction(() => {})); // 输出: true
	 * console.log(isFunction(123)); // 输出: false
	 */
	isFunction: (object) => isType("Function")(object),

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
	isNull: (object) => object === null,

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
	isUndefined: (object) => object === void 0,

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
	isNullOrUndefined: (object) => utils.isNull(obj) || utils.isUndefined(obj),

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
	isEmpty: (object) => utils.isNull(object) || utils.isUndefined(object) || (utils.isString(object) && object === "") || Object.is(NaN, object),

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
	isObject: (object) => (object && typeof object === "object" && Object.getPrototypeOf(object) === Object.prototype) || false,

	/**
	 * 判断对象是否为简单对象（Object）
	 * @param {any} object 要判断的对象
	 * @returns {boolean} 对象是否为简单对象，true表示是，false表示不是
	 *
	 * @example
	 * const obj1 = {};
	 * console.log(isSimpleObject(obj1)); // true
	 *
	 * const obj2 = [];
	 * console.log(isSimpleObject(obj2)); // false
	 *
	 * const obj3 = null;
	 * console.log(isSimpleObject(obj3)); // false
	 *
	 * const obj4 = "Hello";
	 * console.log(isSimpleObject(obj4)); // false
	 *
	 * const obj5 = 123;
	 * console.log(isSimpleObject(obj5)); // false
	 */
	isSimpleObject: (object) => (object && typeof object === "object" && Object.getPrototypeOf(object) === Object.prototype) || false,

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
	isNumeric: (object) => object - parseFloat(object) >= 0,

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
	isInt: (object) => utils.isNumeric(object) && String(object).indexOf(".") === -1,

	/**
	 * 检查对象是否具有指定属性的函数
	 *
	 * @param {Object} obj 要检查的对象
	 * @param {string} prop 要检查的属性名
	 * @returns {boolean} 如果对象具有指定属性，则返回true；否则返回false
	 *
	 * @example
	 * // 示例1: 检查对象是否具有指定属性
	 * var person = { name: 'John', age: 25 };
	 *
	 * console.log(utils.hasOwn(person, 'name')); // 输出: true
	 * console.log(utils.hasOwn(person, 'age')); // 输出: true
	 * console.log(utils.hasOwn(person, 'city')); // 输出: false
	 *
	 * @example
	 * // 示例2: 检查对象是否具有继承属性
	 * function Person() {
	 *   this.name = 'John';
	 * }
	 *
	 * Person.prototype.age = 25;
	 *
	 * var john = new Person();
	 *
	 * console.log(utils.hasOwn(john, 'name')); // 输出: true
	 * console.log(utils.hasOwn(john, 'age')); // 输出: false
	 */
	hasOwn: function(obj, prop) {
		return Object.prototype.hasOwnProperty.call(obj, prop);
	},

	/**
	 * 检查对象是否具有一组指定属性的函数
	 *
	 * @param {Object} obj 要检查的对象
	 * @param {Array} props 要检查的属性名数组
	 * @returns {boolean} 如果对象具有全部指定的属性，则返回true；否则返回false
	 *
	 * @example
	 * // 示例1: 检查对象是否具有指定属性
	 * var person = { name: 'John', age: 25, city: 'New York' };
	 *
	 * console.log(utils.hasOwns(person, ['name', 'age'])); // 输出: true
	 * console.log(utils.hasOwns(person, ['name', 'city'])); // 输出: true
	 * console.log(utils.hasOwns(person, ['name', 'gender'])); // 输出: false
	 */
	hasOwns: function(obj, props) {
		if (!utils.isArray(props)) {
			utils.warn("utils.hasOwns 参数错误：props必须为数组");
		}

		let result = true;
		props.forEach(function(prop) {
			if (!utils.hasOwn(obj, prop)) {
				result = false;
				return false;
			}
		});

		return result;
	},

	/**
	 * 对数组或对象的每个元素执行回调函数。
	 * @param {Array|Object} data 要遍历的数组或对象。
	 * @param {Function} callback 对每个元素执行的回调函数。
	 * @returns {undefined}
	 *
	 * @example
	 * var arr = [1, 2, 3];
	 * utils.forEach(arr, function(item, index) {
	 *   console.log(item, index);
	 * });
	 * // Output:
	 * // 1 0
	 * // 2 1
	 * // 3 2
	 *
	 * var obj = { a: 1, b: 2, c: 3 };
	 * utils.forEach(obj, function(value, key) {
	 *   console.log(key, value);
	 * });
	 * // Output:
	 * // a 1
	 * // b 2
	 * // c 3
	 */
	forEach: function(data, callback) {
		if (!utils.isArray(data) && !utils.isObject(data)) {
			utils.warn("utils.forEach 参数错误：data不是数组类型和对象", data);
			return;
		}

		if (!utils.isFunction(callback)) {
			utils.warn("utils.forEach 参数错误：callback不是函数类型", callback);
			return;
		}

		if (utils.isArray(data)) {
			data.forEach(callback);
		} else if (utils.isObject(data)) {
			Object.keys(data).forEach(function(key) {
				callback.call(data, data[key], key);
			});
		}
	},

	/**
	 * 去除数组中的重复元素，返回一个新数组。
	 * @param {Array} arr 要去重的数组。
	 * @returns {Array} 去重后的新数组。
	 *
	 * @example
	 * var arr = [1, 2, 2, 3, 4, 4, 5];
	 * var uniqueArr = utils.unique(arr);
	 * console.log(uniqueArr); // [1, 2, 3, 4, 5]
	 */
	unique: function(array) {
		if (!utils.isArray(array)) {
			utils.warn("utils.unique 参数错误：array不是数组类型", array);
			return [];
		}
		return [...new Set(arr)];
	},

	/**
	 * 合并多个数组，并可选择是否去除重复元素。
	 * @param {...Array} arrays 要合并的多个数组。
	 * @returns {Array} 合并后的数组。
	 *
	 * @example
	 * var arr1 = [1, 2, 3];
	 * var arr2 = [4, 5];
	 * var mergedArr = utils.merge(arr1, arr2);
	 * console.log(mergedArr); // [1, 2, 3, 4, 5]
	 *
	 * var arr3 = [1, 2, 3];
	 * var arr4 = [2, 3, 4];
	 * var mergedUniqueArr = utils.merge(arr3, arr4, true);
	 * console.log(mergedUniqueArr); // [1, 2, 3, 4]
	 */
	merge: function(...arrays) {
		var result = [];
		let isUnique = false;

		if (arrays.length && utils.isBoolean(arrays[arrays.length - 1])) {
			isUnique = arrays[arrays.length - 1];
			arrays.splice(arrays.length - 1, 1);
		}

		result = Array.prototype.concat.apply(result, arrays);

		if (isUnique) {
			return utils.unique(result);
		}

		return result;
	},

	/**
	 * 交换数组或对象中指定索引的两个元素的值。
	 * @param {Array|Object} array 要操作的数组或对象。
	 * @param {number|string} index1 要交换的第一个元素的索引。
	 * @param {number|string} index2 要交换的第二个元素的索引。
	 *
	 * @example
	 * var arr = [1, 2, 3, 4, 5];
	 * utils.transpose(arr, 1, 3);
	 * console.log(arr); // [1, 4, 3, 2, 5]
	 *
	 * var obj = { a: 10, b: 20, c: 30 };
	 * utils.transpose(obj, 'b', 'c');
	 * console.log(obj); // { a: 10, b: 30, c: 20 }
	 */
	transpose: function(array, index1, index2) {
		if (!utils.isArray(array) && !utils.isObject(array)) {
			utils.warn("utils.transpose 参数错误：array不是数组类型和对象", array);
			return;
		}

		if (!utils.hasOwn(array, index1) || !utils.hasOwn(array, index2)) {
			utils.warn("utils.transpose array不存在index1或者index2属性", arguments);
			return;
		}

		var temp = array[index1];
		array[index1] = array[index2];
		array[index2] = temp;
	},

	/**
	 * 将参数转换为整数(四舍五入)
	 * @param {number|string} number 需要转换的数字或字符串。
	 * @param {number} [defaultValue=0] 可选:如果无法转换，设置默认值。
	 * @returns {number}转换后的整数。
	 * @example
	 * console.log(utils.parseInt("10")); // 输出 10
	 * console.log(utils.parseInt("10.9")); // 输出 11（四舍五入后取整）
	 * console.log(utils.parseInt("abc", 0)); // 输出 0（无法转换，默认返回0）
	 * console.log(utils.parseInt("abc")); // 输出 0（无法转换，默认返回0）
	 * console.log(utils.parseInt(5.8)); // 输出 6（四舍五入后取整）
	 * console.log(utils.parseInt(15)); // 输出 15
	 */
	parseInt: function(number, defaultValue) {
		if (!utils.isNumeric(number)) {
			arguments.length < 2 && utils.warn("utils.parseInt 参数错误：number不是数值类型", number);
			return arguments.length < 2 ? 0 : defaultValue; // 如果number不是数值类型，则返回默认值
		}

		return parseInt(Math.round(parseFloat(number)), 10); // 使用内置的parseInt和parseFloat函数将number转换为整数
	},

	/**
	 * 转小数
	 * @param {string|number} number 数值
	 * @param {number} places 可选：小数点位数(默认两位)
	 * @param {number} min 可选：最小值(数值小于最小值则返回最小值)
	 * @param {number} max 可选：最大值(数值大于最大值则返回最大值)
	 * @param {string|number} [defaultValue="0.00"] 可选：默认值(0.00)
	 * @returns {string} 范围限制后的指定小数位数的数字字符串。
	 * @example
	 * console.log(utils.parseDecimal("10.5678", 2)); // 输出 "10.57"
	 * console.log(utils.parseDecimal("5.6789", 2, 0, 10)); // 输出 "5.68"，在允许的最小值到最大值之间
	 * console.log(utils.parseDecimal("15.9876", 2, 20, 30)); // 输出 "20.00"，超过允许的最大值，被限制为最大值
	 * console.log(utils.parseDecimal("25.1234", 2, 20, 30)); // 输出 "25.12"，在允许的最小值到最大值之间
	 * console.log(utils.parseDecimal(8.9, 1, 5, 15, "10.0")); // 输出 "8.9"，在允许的最小值到最大
	 */
	parseDecimal: function(number, places, min, max, defaultValue) {
		if (!utils.isNumeric(number)) {
			utils.warn("utils.parseDecimal 参数错误：number不是数值类型", number);
			return arguments.length < 5 ? "0.00" : defaultValue;
		}

		if (!utils.isNullOrUndefined(places)) {
			if (!utils.isInt(places) || (utils.isInt(places) && parseFloat(places) < 0)) {
				utils.warn("utils.parseDecimal 参数错误：places不是整数类型", places);
				places = 2;
			}
		} else {
			places = 2;
		}

		var minValue;
		if (!utils.isNullOrUndefined(min)) {
			if (utils.isNumeric(min)) {
				minValue = parseFloat(min);
				if (parseFloat(number) < minValue) {
					number = parseFloat(min);
				}
			} else {
				utils.warn("utils.parseDecimal 参数错误：min不是数值类型", min);
			}
		}

		var maxValue;
		if (!utils.isNullOrUndefined(max)) {
			if (utils.isNumeric(max)) {
				maxValue = parseFloat(max);
				if (parseFloat(number) > parseFloat(max)) {
					number = parseFloat(max);
				}
			} else {
				utils.warn("utils.parseDecimal 参数错误：max不是数值类型", max);
			}
		}

		if (!utils.isUndefined(minValue) && !utils.isUndefined(maxValue)) {
			if (minValue > maxValue) {
				utils.warn("utils.parseDecimal 参数错误：min比参数max大", minValue, maxValue);
			}
		}

		return parseFloat(number).toFixed(places);
	},

	/**
	 * 转百分比
	 * @param {string|number} number 数值
	 * @param {number} places 可选：小数点位数(默认两位)
	 * @param {string|number} defaultValue 可选：默认值('')
	 * @returns {string} 转换后的百分比字符串。
	 *
	 * @example
	 * // 示例1：将0.75转换为百分比字符串，并保留2位小数
	 * var result1 = utils.parsePercent(0.75, 2);
	 * console.log(result1); // 输出"75.00%"
	 *
	 * @example
	 * // 示例2：将0.5转换为百分比字符串，默认保留0位小数
	 * var result2 = utils.parsePercent(0.5);
	 * console.log(result2); // 输出"50%"
	 */
	parsePercent: function(number, places, defaultValue) {
		if (!utils.isNumeric(number)) {
			utils.warn("utils.parsePercent 参数错误：number不是数值类型", number);
			return arguments.length < 3 ? "" : defaultValue;
		}

		if (!utils.isNullOrUndefined(places)) {
			if (!utils.isInt(places) || (utils.isInt(places) && parseFloat(places) < 0)) {
				utils.warn("utils.parsePercent 参数错误：places不是整数类型", places);
				places = 0;
			}
		} else {
			places = 0;
		}

		return (number * 100).toFixed(places || 0) + "%";
	},

	/**
	 * 转千分位
	 * @param {string|number} number 数值
	 * @param {number} places 可选：小数点位数(默认两位)
	 * @param {string|number} defaultValue 可选：默认值('')
	 * @returns {string} 转换后的千位分隔符字符串。
	 *
	 * @example
	 * // 示例1：将 10000.5 转换为千位分隔符字符串，不保留小数位
	 * var result1 = utils.toThousands(10000.5);
	 * console.log(result1); // 输出 "10,000"
	 *
	 * @example
	 * // 示例2：将 12345.6789 转换为千位分隔符字符串，保留两位小数
	 * var result2 = utils.toThousands(12345.6789, 2);
	 * console.log(result2); // 输出 "12,345.68"
	 *
	 * @example
	 * // 示例3：将 -9876.54321 转换为千位分隔符字符串，默认保留0位小数
	 * var result3 = utils.toThousands(-9876.54321);
	 * console.log(result3); // 输出 "-9,877"
	 */
	toThousands: function(number, places, defaultValue) {
		// 判断 number 是否为数字
		if (!utils.isNumeric(number)) {
			// 如果参数 number 不是数字格式，则根据参数个数决定是否输出警告信息
			utils.warn("utils.toThousands 参数错误：number不是数值类型", number);
			return arguments.length < 3 ? "" : defaultValue;
		}

		// 判断 places 是否为整数
		if (!utils.isNullOrUndefined(places)) {
			if (!utils.isInt(places) || (utils.isInt(places) && parseFloat(places) < 0)) {
				utils.warn("utils.toThousands 参数错误：places不是整数类型", places);
				places = 0;
			}
		} else {
			places = 0;
		}

		// 将 number 转换为浮点数形式
		number = parseFloat(number);

		var lt = number < 0;
		number = Math.abs(number).toFixed(places || 0);
		var decimal = "";
		var integer = "";

		// 检查是否有小数部分
		if (number.indexOf(".") !== -1) {
			decimal = number.substr(number.indexOf(".") + 1);
			number = number.substr(0, number.indexOf("."));
		}

		// 循环处理整数部分，每三位加一个逗号分隔符
		while (number.length > 3) {
			integer = "," + number.slice(-3) + integer;
			number = number.slice(0, number.length - 3);
		}
		if (number) {
			integer = number + integer;
		}

		// 拼接正负号、整数部分和小数部分，并返回结果
		return (lt ? "-" : "") + integer + (decimal ? "." + decimal : "");
	},

	/**
	 * 将字符串转换为日期对象
	 * @param {string} strDate 要转换的字符串日期
	 * @param {Date|null} defaultValue 默认值，如果转换失败则返回该值，默认为null
	 * @returns {Date|null} 转换后的日期对象，如果转换失败则返回defaultValue
	 *
	 * @example
	 * parseDate("2023-07-12 10:30:00");
	 * // 返回日期对象: Wed Jul 12 2023 10:30:00 GMT+0800 (中国标准时间)
	 *
	 * parseDate("2010/01/01", new Date());
	 * // 返回日期对象: Fri Jan 01 2010 00:00:00 GMT+0800 (中国标准时间)
	 *
	 * parseDate("09:30:00");
	 * // 返回日期对象: Thu Jan 01 1970 09:30:00 GMT+0800 (中国标准时间)
	 *
	 * parseDate("2022年12月31日 23:59:59", new Date());
	 * // 返回日期对象: Sat Dec 31 2022 23:59:59 GMT+0800 (中国标准时间)
	 *
	 * parseDate("invalid date");
	 * // 返回null
	 */
	parseDate: function(strDate, defaultValue) {
		if (utils.isDate(strDate)) {
			return strDate;
		}

		defaultValue = arguments.length === 2 ? defaultValue : null;
		if (!utils.isString(strDate) || strDate === "") {
			return defaultValue;
		}

		// 将中文字符转换为标准分隔符和格式
		strDate = strDate.toLowerCase();
		strDate = strDate
			.replace("年", "-")
			.replace("月", "-")
			.replace("日", " ")
			.replace("时", ":")
			.replace("分", "")
			.replace("t", " ")
			.replace("z", "");

		var reg = /^(\d{4})([-|/])(\d{1,2})\2(\d{1,2})(\s(\d{1,2}):(\d{1,2})(:(\d{1,2}))?)?(.\d{1,4})?$/;
		var result = strDate.match(reg);
		if (utils.isNull(result)) {
			// 匹配时间格式：HH:mm:ss
			reg = /^(\d{1,2}):(\d{1,2})(:(\d{1,2}))?$/;
			result = strDate.match(reg);

			if (utils.isNull(result)) {
				return defaultValue;
			}

			// 构建日期对象，年份、月份、日期设置为默认日期（1970-01-01）
			let date = new Date(1970, 1, 1, result[1], result[2], result[4] || 0);

			// 检查时间部分是否与输入一致
			if (
				date.getHours() !== ((result[1] && parseFloat(result[1])) || 0) ||
				date.getMinutes() !== ((result[2] && parseFloat(result[2])) || 0) ||
				date.getSeconds() !== ((result[4] && parseFloat(result[4])) || 0)
			) {
				return defaultValue;
			}

			return date;
		} else {
			// 匹配日期格式：yyyy-MM-dd HH:mm:ss
			result[3] = result[3] - 1; // 月份需要减1，Date对象中月份从0开始计数
			let date = new Date(result[1], result[3], result[4], result[6] || 0, result[7] || 0, result[9] || 0);

			if (
				date.getFullYear() !== parseFloat(result[1]) ||
				date.getMonth() !== parseFloat(result[3]) ||
				date.getDate() !== parseFloat(result[4]) ||
				date.getHours() !== ((result[6] && parseFloat(result[6])) || 0) ||
				date.getMinutes() !== ((result[7] && parseFloat(result[7])) || 0) ||
				date.getSeconds() !== ((result[9] && parseFloat(result[9])) || 0)
			) {
				return defaultValue;
			}
			return date;
		}
	},

	/**
	 * 格式化日期对象或日期字符串。
	 *
	 * @param {Date|string} date 待格式化的日期对象或日期字符串。
	 * @param {string} [format='yyyy-MM-dd hh:mm:ss'] 格式化的目标字符串格式，默认为 'yyyy-MM-dd hh:mm:ss'。
	 *
	 * @returns {string} 格式化后的日期字符串，若输入无效则返回空字符串。
	 *
	 * @example
	 * formatDate(new Date('2023-07-12T14:36:00'), 'yyyy-MM-dd HH:mm:ss');
	 * // 返回 '2023-07-12 14:36:00'
	 *
	 * formatDate('2023-07-12T14:36:00', 'MM/dd/yyyy');
	 * // 返回 '07/12/2023'
	 *
	 * formatDate('invalid-date-string');
	 * // 返回 ''
	 */
	formatDate: function(date, format = "yyyy-MM-dd hh:mm:ss") {
		if (!utils.isString(date) && !utils.isDate(date)) {
			return "";
		}

		if (utils.isString(date)) {
			if (date === "") {
				return "";
			}
			date = utils.parseDate(date);

			if (utils.isNull(date)) {
				return "";
			}
		}

		if (date.getFullYear() === 1573) {
			return "";
		}

		const hours = date.getHours();
		var o = {
			"M+": date.getMonth() + 1, // 月份
			"d+": date.getDate(), // 日
			"h+": hours, // 小时
			"H+": hours, // 支持24小时解析
			"m+": date.getMinutes(), // 分
			"s+": date.getSeconds(), // 秒
		};

		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		}

		for (var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}

		return format;
	},

	/**
	 * 计算两个日期之间的时间间隔。
	 *
	 * @param {Date|string} start 开始日期或日期字符串。
	 * @param {Date|string} end 结束日期或日期字符串。
	 * @param {string} [unit='ms'] 时间间隔的单位。可选值为：'ms'（毫秒）、's'（秒）、'm'（分钟）、'h'（小时）和 'd'（天）。
	 * @param {number} [defaultValue=-1] 默认值，在日期格式无效或转换失败时返回。
	 * @returns {number} 时间间隔，以指定的单位返回结果。
	 *
	 * @example
	 * // 以毫秒为单位计算两个日期之间的时间间隔
	 * const interval = getDateInterval(new Date('2022-01-01'), new Date('2022-01-02')); // 返回 86400000 （24 小时的毫秒数）
	 *
	 * // 以天为单位计算两个日期之间的时间间隔
	 * const interval = getDateInterval('2022-01-01', '2022-01-05', 'd'); // 返回 4
	 *
	 * // 以小时为单位计算两个日期之间的时间间隔，并使用自定义默认值
	 * const interval = getDateInterval('2022-01-01', '2022-01-02', 'h', 0); // 返回 24
	 */
	getDateInterval: function(start, end, unit, defaultValue) {
		if (utils.isString(start)) {
			start = utils.parseDate(start);
		}

		if (utils.isString(end)) {
			end = utils.parseDate(end);
		}

		defaultValue = arguments > 3 ? defaultValue : -1;
		if (!utils.isDate(start) || !utils.isDate(end)) {
			utils.warn("utils.getDateInterval 参数错误：start或end不是日期格式或者转换日期格式失败", start, end);
			return defaultValue;
		}

		unit = arguments.length < 3 ? "ms" : unit;
		const divisorMap = {
			ms: 1,
			s: 1000,
			m: 1000 * 60,
			h: 1000 * 60 * 60,
			d: 1000 * 60 * 60 * 24,
		};

		if (!divisorMap.hasOwnProperty(unit)) {
			utils.warn("utils.getDateInterval 参数错误：unit暂只支持d/h/m/s/ms之一", start, end, unit);
			unit = "ms";
		}

		return Math.abs(start * 1 - end * 1) / divisorMap[unit];
	},

	/**
	 * 获取未来的日期（按天）
	 *
	 * @param {Date|string} date 起始日期，可以是 Date 对象或者符合日期格式的字符串
	 * @param {number} number 天数
	 * @param {*} [defaultValue=null] 默认值，在参数错误时返回
	 * @returns {Date|null} 计算后的日期对象，如果参数错误则返回默认值
	 *
	 * @example
	 * // 从当前日期开始往后推迟两天
	 * var futureDate = utils.getFutureDate(new Date(), 2);
	 * console.log(futureDate); // 输出未来的日期
	 *
	 * @example
	 * // 从指定日期开始往后推迟五天
	 * var futureDate = utils.getFutureDate('2023-01-01', 5);
	 * console.log(futureDate); // 输出未来的日期
	 */
	getFutureDateByDays: function(date, number, defaultValue) {
		if (utils.isString(date)) {
			date = utils.parseDate(date);
		}

		defaultValue = arguments.length > 2 ? defaultValue : null;
		if (!utils.isDate(date)) {
			utils.warn("utils.getFutureDateByDays 参数错误：date不是日期格式或者不能转换日期类型", date);
			return defaultValue;
		}

		if (!utils.isNumeric(number)) {
			utils.warn("utils.getFutureDateByDays 参数错误：number不是有效数字", number);
			return defaultValue;
		}

		return new Date(date.getTime() + 60 * 60 * 1000 * 24 * number);
	},

	/**
	 * 获取未来的日期（按月）
	 *
	 * @param {Date|string} date 起始日期，可以是 Date 对象或者符合日期格式的字符串
	 * @param {number} number 月数，表示要往后推迟的月份数量
	 * @param {*} [defaultValue=null] 默认值，在参数错误时返回
	 * @returns {Date|null} 计算后的日期对象，如果参数错误则返回默认值
	 *
	 * @example
	 * // 从当前日期开始往后推迟两个月
	 * var futureDate = utils.getFutureDateByMonths(new Date(), 2);
	 * console.log(futureDate); // 输出未来的日期
	 *
	 * @example
	 * // 从指定日期开始往后推迟五个月
	 * var futureDate = utils.getFutureDateByMonths('2023-01-01', 5);
	 * console.log(futureDate); // 输出未来的日期
	 */
	getFutureDateByMonths: function(date, number, defaultValue) {
		defaultValue = arguments.length > 2 ? defaultValue : null;
		if (utils.isString(date)) {
			date = utils.parseDate(date);
		}

		if (!utils.isDate(date)) {
			utils.warn("utils.getFutureDateByMonths 参数错误：date不是日期格式或者不能转换日期类型", date);
			return defaultValue;
		} else {
			date = new Date(date.getTime());
		}

		if (!utils.isNumeric(number)) {
			utils.warn("utils.getFutureDateByMonths 参数错误：number不是有效数字", number);
			return defaultValue;
		}

		date.setMonth(date.getMonth() + number);

		return date;
	},

	/**
	 * 获取未来的日期（按年）
	 *
	 * @param {Date|string} date - 起始日期。可以是 Date 对象或可转换为 Date 的字符串。
	 * @param {number} number - 年份数，表示要增加的年数。
	 * @param {*} [defaultValue=null] - 默认值，如果参数错误时返回的值，默认为 null。
	 * @returns {Date} 计算后的未来日期。
	 * @example
	 * // 示例1: 将 2021 年 9 月 1 日增加3年。
	 * const result1 = getFutureDateByYears(new Date(2021, 8, 1), 3);
	 * console.log(result1); // 输出：Sat Sep 01 2024 00:00:00 GMT+0800 (中国标准时间)
	 *
	 * // 示例2: 将当前日期增加5年。
	 * const result2 = getFutureDateByYears(new Date(), 5);
	 * console.log(result2); // 输出：未来五年后的日期
	 */
	getFutureDateByYears: function(date, number, defaultValue) {
		if (utils.isString(date)) {
			date = utils.parseDate(date);
		}

		defaultValue = arguments.length > 2 ? defaultValue : null;
		if (!utils.isDate(date)) {
			utils.warn("utils.getFutureDateByYears 参数错误：date不是日期格式或者不能转换日期类型", date);
			return defaultValue;
		} else {
			date = new Date(date.getTime());
		}

		if (!utils.isNumeric(number)) {
			utils.warn("utils.getFutureDateByYears 参数错误：number不是有效数字", number);
			return defaultValue;
		}

		date.setYear(date.getFullYear() + number);

		return date;
	},

	/**
	 * 根据给定的日期、月份数量和起止类型计算日期（按月）
	 *
	 * @param {Date|string} start 起始日期，可以是 Date 对象或者符合日期格式的字符串
	 * @param {number} months 月数，表示要往后推迟或前移的月份数量
	 * @param {boolean} isStart 起止类型，true 表示返回起始日期，false 表示返回结束日期
	 * @param {*} [defaultValue=null] 默认值，在参数错误时返回
	 * @returns {Date|null} 计算后的日期对象，如果参数错误则返回默认值
	 *
	 * @example
	 * // 从当前日期开始往后推迟两个月，并返回起始日期
	 * var startDate = utils.calculateDateByMonths(new Date(), 2, true);
	 * console.log(startDate); // 输出起始日期，例如：Mon Oct 01 2023 00:00:00 GMT+0000 (Coordinated Universal Time)
	 *
	 * @example
	 * // 从指定日期开始往前移动五个月，并返回结束日期
	 * var endDate = utils.calculateDateByMonths('2023-01-01', 5, false);
	 * console.log(endDate); // 输出结束日期，例如：Fri May 31 2023 00:00:00 GMT+0000 (Coordinated Universal Time)
	 */
	calculateDateByMonths: function(date, number, isStart, defaultValue) {
		if (utils.isString(date)) {
			date = utils.parseDate(date);
		}

		defaultValue = arguments.length > 2 ? defaultValue : null;
		if (!utils.isDate(date)) {
			utils.warn("utils.calculateDateByMonths 参数错误：date不是日期格式或者不能转换日期类型", date);
			return defaultValue;
		} else {
			date = new Date(date.getTime());
		}

		if (!utils.isNumeric(number)) {
			utils.warn("utils.calculateDateByMonths 参数错误：number不是有效数字", number);
			return defaultValue;
		}

		// 结束日期是否滚动月份
		var startMonth = start.getMonth(); // 获取起始月份
		var startYear = start.getFullYear(); // 获取起始年份

		var nowMonth = startMonth; // 当前月份
		var nowYear = startYear; // 当前年份
		nowMonth += months; // 更新当前月份

		// 处理跨年情况
		while (nowMonth < 0 || nowMonth >= 12) {
			if (nowMonth < 0) {
				nowYear--; // 上一年
				nowMonth += 12;
			} else if (nowMonth >= 12) {
				nowYear++; // 下一年
				nowMonth -= 12;
			}
		}

		if (isStart) {
			return new Date(nowYear, nowMonth, 1);
		} else {
			return new Date(nowYear, nowMonth + 1, 0);
		}
	},

	/**
	 * 根据给定的日期、年份数量和起止类型计算日期（按年）
	 *
	 * @param {Date|string} date 起始日期。可以是 Date 对象或日期的字符串表示形式。
	 * @param {number} number 需要添加或减去的年数。正数表示增加，负数表示减少。
	 * @param {boolean} isStart 确定计算年份的起始还是结束。为 true 表示起始，为 false 表示结束。
	 * @param {*} [defaultValue=null] 参数错误时返回的默认值。
	 * @returns {Date|null} 计算得到的日期，如果参数错误则返回 null。
	 *
	 * @example
	 * const startDate = new Date(2022, 0, 1);
	 * const endDate = calculateDateByYears(startDate, 5, false);
	 * console.log(endDate); // 输出：Mon Dec 31 2026
	 *
	 * @example
	 * const currentDate = new Date();
	 * const previousYearStart = calculateDateByYears(currentDate, -1, true);
	 * console.log(previousYearStart); // 输出：Sat Jan 01 2022
	 *
	 * @example
	 * const specificDate = '2023-06-15';
	 * const nextYearEnd = calculateDateByYears(specificDate, 1, false);
	 * console.log(nextYearEnd); // 输出：Sun Dec 31 2024
	 */
	calculateDateByYears: function(date, number, isStart, defaultValue) {
		if (utils.isString(date)) {
			date = utils.parseDate(date);
		}

		defaultValue = arguments.length > 2 ? defaultValue : null;
		if (!utils.isDate(date)) {
			utils.warn("utils.calculateDateByYears 参数错误：date不是日期格式或者不能转换日期类型", date);
			return defaultValue;
		} else {
			date = new Date(date.getTime());
		}

		if (!utils.isNumeric(number)) {
			utils.warn("utils.calculateDateByYears 参数错误：number不是有效数字", number);
			return defaultValue;
		}

		// 结束日期是否滚动月份
		var nowYear = !isStart && number > 0 ? date.getFullYear() + number : date.getFullYear(); // 当前年
		if (isStart) {
			return new Date(nowYear, 0, 1);
		} else {
			return new Date(nowYear, 12, 0);
		}
	},

	/**
	 * 设置工作日数组。
	 *
	 * @param {number[]} days 工作日数组。必须为数字的数组。
	 *
	 * @example
	 * utils.setWorkDays([1, 2, 3, 4, 5]); // 设置工作日数组为周一至周五
	 *
	 * @example
	 * utils.setWorkDays([0, 6]); // 设置工作日数组为周末（周日和周六）
	 *
	 * @example
	 * utils.setWorkDays(); // 参数错误：days不是数组类型
	 */
	setWorkDays: function(days) {
		if (!utils.isArray(days)) {
			utils.warn("utils.setWorkDays 参数错误：days不是数组类型", days);
			return;
		}

		workDays.length = 0;
		days.forEach(function(day, i) {
			if (utils.isInt(day)) {
				day = parseInt(day, 10);
				if (day < 0 || day > 6) {
					utils.warn("utils.setWorkDays 参数错误：days数据项数据范围必须是0-6", day, i);
				}

				if (workDays.indexOf(day) === -1) {
					workDays.push(day);
				}
			} else {
				utils.warn("utils.setWorkDays 参数错误：days数据项不是数字", day, i);
			}
		});
	},

	/**
	 * 判断日期是否为工作日。
	 *
	 * @param {Date|string} date 需要判断的日期。可以是 Date 对象或者表示日期的字符串。
	 *
	 * @returns {boolean} 如果是工作日则返回 true，否则返回 false。
	 *
	 * @example
	 * utils.isWorkDay(new Date()); // 判断今天是否为工作日
	 *
	 * @example
	 * utils.isWorkDay("2023-01-01"); // 判断指定日期（字符串格式）是否为工作日
	 */
	isWorkDay: function(date) {
		if (utils.isString(date)) {
			date = utils.parseDate(date);
		}

		if (!utils.isDate(date)) {
			utils.warn("utils.isWorkDay 参数错误：date不是日期格式或者不能转换日期类型", date);
		}

		return workDays.indexOf(date.getDay()) !== -1;
	},

	/**
	 * GUID
	 * @param {number} len 长度(1<=len<=27)
	 * @returns {string} 生成的 GUID。
	 *
	 * @example
	 * // 示例1：生成默认长度的 GUID（27位）
	 * var result1 = utils.guid();
	 * console.log(result1); // 输出类似 "a3b7c5d0f2e1g9i8j2k1m3n7p"
	 *
	 * @example
	 * // 示例2：生成指定长度的 GUID（10位）
	 * var result2 = utils.guid(10);
	 * console.log(result2); // 输出类似 "a3b7c5d0f2"
	 */
	guid: function(len = 27) {
		const result = "xxxxxxxxxxxx4xxxyxxxxxxxxxx".replace(/[xy]/g, function(c) {
			const r = (Math.random() * 16) | 0;
			const v = c === "x" ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});

		return result.substring(0, len);
	},

	/**
	 * 去除空格(前后空格)
	 * @param {string} string 字符串
	 * @returns {string} 去除空格后的字符串。
	 *
	 * @example
	 * var result = utils.trim("  Hello, World!  ");
	 * console.log(result); // 输出 "Hello, World!"
	 */
	trim: function(string) {
		if (!utils.isString(string)) {
			utils.warn("utils.trim 参数错误：string不是字符串类型");
			return;
		}
		return (string || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
	},

	/**
	 * 驼峰处理
	 * @param {string} string 字符串
	 * @returns {string} 转换后的驼峰命名法字符串。
	 *
	 * @example
	 * var result = utils.camelCase("hello_world");
	 * console.log(result); // 输出 "helloWorld"
	 */
	camelCase: function(string) {
		if (!utils.isString(string)) {
			utils.warn("utils.camelCase 参数错误：string不是字符串类型");
			return string;
		}

		return string.replace(/([:\-_]+(.))/g, function(_, separator, letter, offset) {
			return offset ? letter.toUpperCase() : letter;
		});
	},

	/**
	 * 首字母大写
	 * @param {string} string 字符串
	 * @returns {string} 转换后的字符串。
	 *
	 * @example
	 * var result = utils.capitalize("hello");
	 * console.log(result); // 输出 "Hello"
	 */
	capitalize: function(string) {
		if (!utils.isString(string)) {
			utils.warn("utils.capitalize 参数错误：string不是字符串类型", string);
			return;
		}

		if (string === "") {
			return string;
		}

		return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
	},

	/**
	 * 根据输入的参数类型，将类型名称转换为驼峰命名法并返回结果
	 * @param {string|function} type 类型
	 * @returns {string} 转换后的驼峰命名法字符串，如果无法转换则返回空字符串。
	 *
	 * @example
	 * var result1 = utils.capitalizeTypeName("hello_world");
	 * console.log(result1); // 输出 "HelloWorld"
	 *
	 * function MyFunction() {}
	 * var result2 = utils.capitalizeTypeName(MyFunction);
	 * console.log(result2); // 输出 "MyFunction"
	 */
	capitalizeTypeName: function(type) {
		if (utils.isString(type) && type !== "") {
			return utils.capitalize(type);
		} else if (utils.isFunction(type)) {
			var result = type.toString().match(/^function\s*?(\w+)\(/);
			if (utils.isArray(result)) {
				return utils.capitalize(result[1]);
			}
		}
		return "";
	},

	/**
	 * 金额转换为中文大写
	 * @param {number} amount 金额
	 * @returns {string} 转换后的中文大写字符串。
	 *
	 * @example
	 * var result = utils.amountToChinese(12345.67);
	 * console.log(result); // 输出 "壹万贰仟叁佰肆拾伍元陆角柒分"
	 */
	amountToChinese: function(amount) {
		if (!utils.isNumeric(amount)) {
			utils.warn("utils.amountToChinese 参数错误：amount不是数值类型", amount);
			return amount.toString();
		}

		let unit = "京亿万仟佰拾兆万仟佰拾亿仟佰拾万仟佰拾元角分";

		let str = "";
		amount += "00";

		let i = amount.indexOf(".");
		if (i >= 0) {
			amount = amount.substring(0, i) + amount.substr(i + 1, 2);
		}

		if (unit.length < amount.length) {
			utils.warn("utils.amountToChinese 参数amount超出可转换范围", amount);
			return amount.toString();
		} else {
			unit = unit.substr(unit.length - amount.length);
		}

		for (i = 0; i < amount.length; i++) {
			str += "零壹贰叁肆伍陆柒捌玖".charAt(amount.charAt(i)) + unit.charAt(i);
		}

		return str
			.replace(/零角零分$/, "整")
			.replace(/零[仟佰拾]/g, "零")
			.replace(/零{2,}/g, "零")
			.replace(/零([亿|万])/g, "$1")
			.replace(/零+元/, "元")
			.replace(/亿零{0,3}万/, "亿")
			.replace(/^元/, "零元");
	},

	/**
	 * 是否DOM元素
	 * @param {*} element 元素对象
	 * @returns {boolean} 如果变量是 DOM 元素，则返回 true，否则返回 false。
	 *
	 * @example
	 * var divElement = document.createElement("div");
	 * var isDomElement = utils.isDom(divElement);
	 * console.log(isDomElement); // 输出 true
	 *
	 * var str = "Hello, World!";
	 * var isDomStr = utils.isDom(str);
	 * console.log(isDomStr); // 输出 false
	 */
	isDom: function(element) {
		var d = document.createElement("element");
		try {
			d.appendChild(element.cloneNode(true));
			return element.nodeType === 1;
		} catch (e) {
			return element === window || element === document;
		}
	},

	/**
	 * DOM元素查询
	 * @param {string|Element} element 元素名称
	 * @param {Document} dom DOM对象
	 * @returns {Element|null} 查询到的 DOM 元素，如果未找到则返回 null。
	 *
	 * @example
	 * var divElement = utils.query("#myDiv");
	 * console.log(divElement); // 输出查询到的 DOM 元素
	 *
	 * var containerElement = document.getElementById("container");
	 * var result = utils.query(containerElement);
	 * console.log(result); // 输出 containerElement
	 */
	query: function(element, dom = document) {
		if (utils.isString(element)) {
			return dom.querySelector(element);
		} else {
			return element;
		}
	},

	/**
	 * DOM元素查询(一组)
	 * @param {string|Element} element 元素名称
	 * @param {Document} dom DOM对象
	 * @returns {NodeList|Element[]} 查询到的 DOM 元素列表或数组，如果未找到则返回空列表或空数组。
	 *
	 * @example
	 * var list = utils.queryAll(".item");
	 * console.log(list); // 输出查询到的 DOM 元素列表或数组
	 *
	 * var containerElement = document.getElementById("container");
	 * var result = utils.queryAll(containerElement);
	 * console.log(result); // 输出包含 containerElement 的数组
	 */
	queryAll: function(element, dom = document) {
		if (utils.isString(element)) {
			return dom.querySelectorAll(element);
		} else {
			return element;
		}
	},

	/**
	 * 将 HTML 字符串转换为 DocumentFragment 对象，并返回其第一个子节点。
	 * @param {string} html Html内容
	 * @returns {Node|null} 转换后的 DocumentFragment 的第一个子节点，如果无效则返回 null。
	 *
	 * @example
	 * var template = "<div>Hello, World!</div>";
	 * var result = utils.transformDocumentFragment(template);
	 * console.log(result); // 输出包含 "Hello, World!" 的 div 元素
	 */
	transformDocumentFragment: function(html) {
		const wrap = document.createElement("div");
		const fragment = document.createDocumentFragment();

		wrap.innerHTML = html;
		fragment.appendChild(wrap);

		return fragment.firstChild;
	},

	/**
	 * 检查一个元素是否具有指定的 CSS 类名。
	 * @param {Element} element 元素对象
	 * @param {string} className 样式类名
	 * @returns {boolean} 如果元素具有指定的类名，则返回 true；否则返回 false。
	 *
	 * @example
	 * var element = document.getElementById("myElement");
	 * var hasClass = utils.hasClass(element, "active");
	 * console.log(hasClass); // 检查元素是否具有 "active" 类名
	 */
	hasClass: function(element, className) {
		if (!utils.isDom(element)) {
			utils.warn("utils.hasClass 参数错误：element不是html元素", element);
			return false;
		}

		if (!utils.isString(className)) {
			utils.warn("utils.hasClass 参数错误：className不是字符串类型", className);
			return false;
		}

		if (className.indexOf(" ") !== -1) {
			utils.warn("utils.hasClass 参数错误：className不能包含空格", className);
			return false;
		}

		if (element.classList) {
			return element.classList.contains(className);
		} else {
			return (" " + element.className + " ").indexOf(" " + className + " ") > -1;
		}
	},

	/**
	 * 向一个元素添加指定的 CSS 类名。
	 * @param {Element} element 元素对象
	 * @param {string} classNames 样式类名(支持多个[空格隔开])
	 *
	 * @example
	 * var element = document.getElementById("myElement");
	 * utils.addClass(element, "active");
	 *
	 * // 添加多个类名
	 * utils.addClass(element, "bold italic");
	 */
	addClass: function(element, classNames) {
		if (!utils.isDom(element)) {
			utils.warn("utils.addClass 参数错误：element不是html元素", element);
			return;
		}

		if (!utils.isString(classNames)) {
			utils.warn("utils.addClass 参数错误：classNames不是字符串类型", classNames);
			return;
		}

		var originClassName = element.className;
		var currentClassNames = (classNames || "").split(" ");

		for (var i = 0, j = currentClassNames.length; i < j; i++) {
			var currentClassName = currentClassNames[i];
			if (!currentClassName) continue;

			if (element.classList) {
				element.classList.add(currentClassName);
			} else {
				if (!utils.hasClass(element, currentClassName)) {
					originClassName += " " + currentClassName;
				}
			}
		}

		if (!element.classList) {
			element.className = originClassName;
		}
	},

	/**
	 * 从一个元素中移除指定的 CSS 类名。
	 * @param {Element} element 元素对象
	 * @param {string} classNames 样式类名(支持多个[空格隔开])
	 *
	 * @example
	 * var element = document.getElementById("myElement");
	 * utils.removeClass(element, "active");
	 *
	 * // 移除多个类名
	 * utils.removeClass(element, "bold italic");
	 */
	removeClass: function(element, classNames) {
		if (!utils.isDom(element)) {
			utils.warn("utils.removeClass 参数错误：element不是html元素", element);
			return;
		}

		if (!utils.isString(classNames)) {
			utils.warn("utils.removeClass 参数错误：classNames不是字符串类型", classNames);
			return;
		}

		var originClassName = " " + element.className + " ";
		var currentClassNames = classNames.split(" ");

		for (var i = 0, j = currentClassNames.length; i < j; i++) {
			var currentClassName = currentClassNames[i];
			if (!currentClassName) continue;

			if (element.classList) {
				element.classList.remove(currentClassName);
			} else {
				if (utils.hasClass(element, currentClassName)) {
					originClassName = originClassName.replace(" " + currentClassName + " ", " ");
				}
			}
		}

		if (!element.classList) {
			element.className = utils.trim(originClassName);
		}
	},

	/**
	 * 判断一个元素是否隐藏（不可见）。
	 * @param {Element} element 元素对象
	 * @returns {boolean} - 如果元素隐藏，则返回true；否则返回false。
	 *
	 * @example
	 * var element = document.getElementById("myElement");
	 * if (utils.isHidden(element)) {
	 *   console.log("元素隐藏");
	 * } else {
	 *   console.log("元素可见");
	 * }
	 */
	isHidden: function(element) {
		if (!utils.isDom(element)) {
			utils.warn("utils.isHidden 参数错误：element不是html元素", element);
			return false;
		}

		return !(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
	},

	/**
	 * 获取样式
	 * @param {Element} element 元素对象
	 * @param {string} styleName 样式名
	 * @param {*} defaultValue 样式默认值
	 * @returns {*} - 返回指定样式属性的值，若获取失败则返回默认值。
	 *
	 * @example
	 * var element = document.getElementById("myElement");
	 * var color = utils.getStyle(element, "color");
	 * console.log("元素的颜色值为：" + color);
	 */
	getStyle: function(element, styleName, defaultValue) {
		if (!utils.isDom(element)) {
			utils.warn("utils.getStyle 参数错误：element不是html元素", element);
			return defaultValue;
		}

		if (!utils.isString(styleName)) {
			utils.warn("utils.getStyle 参数错误：styleName不是字符串类型", styleName);
			return defaultValue;
		}

		defaultValue = arguments.length > 2 ? defaultValue : null;

		styleName = utils.camelCase(styleName);
		if (styleName === "float") {
			styleName = "cssFloat";
		}

		try {
			var computed = document.defaultView.getComputedStyle(element, "");
			return element.style[styleName] || computed ? computed[styleName] : defaultValue;
		} catch (e) {
			return element.style[styleName];
		}
	},

	/**
	 * 设置样式
	 * @param {Element} element 元素对象
	 * @param {string|Object} styleName 样式名
	 * @param {*} value 样式值
	 *
	 * @example
	 * var element = document.getElementById("myElement");
	 *
	 * // 设置单个样式属性
	 * utils.setStyle(element, "color", "red");
	 *
	 * // 设置多个样式属性
	 * utils.setStyle(element, {
	 *   color: "red",
	 *   backgroundColor: "blue"
	 * });
	 */
	setStyle: function(element, styleName, value) {
		if (!utils.isDom(element)) {
			utils.warn("utils.setStyle 参数错误：element不是html元素", element);
			return;
		}

		if (!utils.isString(styleName) && !utils.isObject(styleName)) {
			utils.warn("utils.setStyle 参数错误：styleName不是字符串类型和对象类型", styleName);
			return;
		}

		if (typeof styleName === "object") {
			for (var prop in styleName) {
				if (styleName.hasOwnProperty(prop)) {
					utils.setStyle(element, prop, styleName[prop]);
				}
			}
		} else {
			styleName = utils.camelCase(styleName);
			element.style[styleName] = value;
		}
	},

	/**
	 * 开启事件监听
	 * @param {Element} element 元素对象
	 * @param {string} event 事件名称
	 * @param {Function} handler 事件处理
	 *
	 * @example
	 * var element = document.getElementById("myButton");
	 *
	 * utils.on(element, "click", function(event) {
	 *   console.log("按钮被点击了");
	 * });
	 */
	on: function(element, event, handler) {
		if (!utils.isDom(element)) {
			utils.warn("utils.on 参数错误：element不是html元素", element);
			return;
		}

		if (!utils.isString(event)) {
			utils.warn("utils.on 参数错误：event不是字符串类型", event);
			return;
		}

		if (!utils.isFunction(handler)) {
			utils.warn("utils.on 参数错误：handler不是函数类型", handler);
			return;
		}

		element.addEventListener(event, handler, false);
	},

	/**
	 * 关闭事件监听
	 * @param {Element} element 元素对象
	 * @param {string} event 事件名称
	 * @param {Function} handler 事件处理
	 *
	 * @example
	 * var element = document.getElementById("myButton");
	 * var clickHandler = function(event) {
	 *   console.log("按钮被点击了");
	 * };
	 *
	 * utils.on(element, "click", clickHandler);
	 *
	 * // 解绑事件处理函数
	 * utils.off(element, "click", clickHandler);
	 */
	off: function(element, event, handler) {
		if (!utils.isDom(element)) {
			utils.warn("utils.off 参数错误：element不是html元素", element);
			return;
		}

		if (!utils.isString(event)) {
			utils.warn("utils.off 参数错误：event不是字符串类型", event);
			return;
		}

		if (!utils.isFunction(handler)) {
			utils.warn("utils.off 参数错误：handler不是函数类型", handler);
			return;
		}

		element.removeEventListener(event, handler, false);
	},

	/**
	 * 一次性事件监听
	 * @param {Element} element 元素对象
	 * @param {string} event 事件名称
	 * @param {Function} handler 事件处理
	 *
	 * @example
	 * var element = document.getElementById("myButton");
	 *
	 * utils.once(element, "click", function(event) {
	 *   console.log("按钮被点击了");
	 * });
	 */
	once: function(element, event, handler) {
		if (!utils.isDom(element)) {
			utils.warn("utils.once 参数错误：element不是html元素", element);
			return;
		}

		if (!utils.isString(event)) {
			utils.warn("utils.once 参数错误：event不是字符串类型", event);
			return;
		}

		if (!utils.isFunction(handler)) {
			utils.warn("utils.once 参数错误：handler不是函数类型", handler);
			return;
		}

		var listener = function() {
			if (handler) {
				handler.apply(this, arguments);
			}
			utils.off(element, event, listener);
		};

		utils.on(element, event, listener);
	},

	/**
	 * 检查命名空间是否存在。
	 * @param {string} namespace 命名空间名称，使用点号（.）分隔多个层级。
	 * @param {Object} root 根对象，要检查命名空间是否存在的对象。
	 * @returns {boolean} 如果命名空间存在则返回 true，否则返回 false。
	 *
	 * @example
	 * var myApp = {
	 *   utils: {
	 *     config: {
	 *       debug: true
	 *     }
	 *   }
	 * };
	 *
	 * console.log(utils.isExistNamespace('myApp')); // true
	 * console.log(utils.isExistNamespace('myApp.utils')); // true
	 * console.log(utils.isExistNamespace('myApp.utils.config')); // true
	 * console.log(utils.isExistNamespace('myApp.utils.tools')); // false
	 */
	isExistNamespace: function(namespace, root) {
		if (!utils.isString(namespace) || namespace === "") {
			utils.warn("utils.isExistNamespace 参数错误：namespace不是字符串类型", namespace);
		}

		if (utils.isNullOrUndefined(root)) {
			utils.warn("utils.isExistNamespace 参数错误：root未知", root);
		}

		var names = namespace.split(".");
		for (var i = 0, len = names.length; i < len; i++) {
			if (!root.hasOwnProperty(names[i])) {
				return false;
			}
			root = root[names[i]];
		}

		return true;
	},

	/**
	 * 创建命名空间并返回该命名空间的最后一级对象。
	 * @param {string} namespace 命名空间名称，使用点号（.）分隔多个层级。
	 * @param {Object} root 根对象，在该对象下创建命名空间。
	 * @returns {Object} 返回命名空间的最后一级对象。
	 *
	 * @example
	 * var myNamespace = utils.namespace('myApp.utils', window);
	 * console.log(myNamespace); // { utils: {} }
	 *
	 * myNamespace.config = { debug: true };
	 * console.log(window.myApp.utils.config); // { debug: true }
	 */
	namespace: function(namespace, root) {
		if (!utils.isString(namespace)) {
			utils.warn("utils.namespace 参数错误：namespace不是字符串类型", namespace);
		}

		if (utils.isNullOrUndefined(root)) {
			utils.warn("utils.namespace 参数错误：root未知", root);
		}

		if (namespace === "") {
			return root;
		}

		var names = namespace.split(".");
		names.forEach(function(name) {
			if (root.hasOwnProperty(name)) {
				root = root[name];
			} else {
				root[name] = {};
				root = root[name];
			}
		});

		return root;
	},

	/**
	 * 对字符串中的HTML字符进行转义。
	 * @param {string} target 要转义的字符串。
	 * @returns {string} 转义后的字符串。
	 *
	 * @example
	 * var str = '<script>alert("Hello!");</script>';
	 * var escapedStr = utils.escapeHtml(str);
	 * console.log(escapedStr);
	 * // Output: &lt;script&gt;alert(&quot;Hello!&quot;);&lt;/script&gt;
	 */
	escapeHtml: function(target) {
		if (!utils.isString(target)) {
			utils.warn("utils.escapeHtml 参数错误：target不是字符串类型", target);
			return "";
		}

		return target
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;");
	},

	/**
	 * 对字符串中的HTML转义字符进行反转义。
	 * @param {string} target 要反转义的字符串。
	 * @returns {string} 反转义后的字符串。
	 *
	 * @example
	 * var escapedStr = '&lt;script&gt;alert(&quot;Hello!&quot;);&lt;/script&gt;';
	 * var unescapedStr = utils.unescapeHtml(escapedStr);
	 * console.log(unescapedStr);
	 * // Output: <script>alert("Hello!");</script>
	 */
	unescapeHtml: function(target) {
		if (!utils.isString(target)) {
			utils.warn("utils.unescapeHtml 参数错误：target不是字符串类型", target);
			return "";
		}

		return target
			.replace(/&quot;/g, '"')
			.replace(/&gt;/g, ">")
			.replace(/&lt;/g, "<")
			.replace(/&amp;/g, "&")
			.replace(/&#([\d]+);/g, function($0, $1) {
				return String.fromCharCode(parseInt($1, 10));
			});
	},

	/**
	 * 匹配给定HTML字符串中指定标签的开标签和闭标签，并返回匹配对信息的对象。
	 *
	 * @param {string} html 给定的HTML字符串
	 * @param {string} tagName 指定的HTML标签名
	 * @returns {Object} 包含指定HTML标签的匹配对信息的对象
	 *
	 * @example
	 * const html = '<div>Content 1</div><span>Content 2</span>';
	 * const tagName = 'div';
	 * const result = matchPairHtml(html, tagName);
	 * console.log(result);
	 * // Output: { '1-1': { sourceCode: '<div>Content 1</div>', content: '1 tnetnoC' } }
	 *
	 * @example
	 * const html = '<p>Paragraph 1</p><p>Paragraph 2</p>';
	 * const tagName = 'p';
	 * const result = matchPairHtml(html, tagName);
	 * console.log(result);
	 * // Output: { '1-1': { sourceCode: '<p>Paragraph 1</p>', content: '1 hparagraP' }, '2-1': { sourceCode: '<p>Paragraph 2</p>', content: '2 hparagraP' } }
	 */
	matchPairHtml(html, tagName) {
		const patt = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "gi"); // 匹配指定标签的开标签和闭标签
		const startPatt = new RegExp(`^<${tagName}\\b[^>]*>$`, "i"); // 只匹配指定标签的开标签
		const endPatt = new RegExp(`^<\\/${tagName}>$`, "i"); // 只匹配指定标签的闭标签

		let rst; // 存储每次迭代的模式匹配结果
		let repeat = 0; // 跟踪嵌套级别（重复标签的数量）
		let group = 0; // 跟踪每个嵌套级别的组号
		const indexDD = {}; // 存储每个匹配对的索引信息

		while ((rst = patt.exec(html))) {
			// 检查是否为开标签
			if (startPatt.test(rst[0])) {
				repeat++;

				// 第一次出现时，增加组号
				if (repeat === 1) {
					group++;
				}

				// 使用嵌套级别和组号作为键，存储索引信息（开始索引和结束索引）
				indexDD[`${repeat}-${group}`] = {
					start: rst.index,
					end: -1, // 结束索引，在下面的代码中更新
					reverseEnd: -1, // 反转的结束索引，在下面的代码中更新
				};
			}

			// 检查是否为闭标签
			if (endPatt.test(rst[0])) {
				// 更新对应开标签的索引信息（结束索引和反转的结束索引）
				indexDD[`${repeat}-${group}`].end = rst.index + rst[0].length;
				indexDD[`${repeat}-${group}`].reverseEnd = html.length - patt.lastIndex;
				repeat--;
			}
		}

		const matchObj = {}; // 存储最终结果的对象

		for (const key in indexDD) {
			if (Object.hasOwnProperty.call(indexDD, key)) {
				const { start, end, reverseEnd } = indexDD[key];

				// 提取开始索引和结束索引之间的HTML源代码并修整
				const sourceCode = html.slice(start, end).trim();

				// 提取反转的开始索引和结束索引之间的内容并修整
				const content = html
					.slice(reverseEnd, html.length - start)
					.trim()
					.split("")
					.reverse()
					.join("");

				// 将源代码和内容存储为matchObj的属性
				matchObj[key] = { sourceCode, content };
			}
		}

		return matchObj; // 返回包含指定HTML标签的匹配对信息的对象
	},

	/**
	 * 根据主机名提取域名信息
	 * @param {string} [hostname] 主机名或URL，默认为当前页面的主机名
	 * @returns {string} 域名信息（以'.'开头）
	 *
	 * @example
	 * getDomain(); // '.zhongjyuan.com'
	 *
	 * @example
	 * getDomain('www.zhongjyuan.com'); // '.zhongjyuan.com'
	 *
	 * @example
	 * getDomain('localhost'); // 'localhost'
	 */
	getDomain: function(hostname) {
		var host = hostname || location.hostname; // 如果未提供主机名，则使用当前页面的主机名
		var ip = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

		if (ip.test(host) === true || host === "localhost") {
			// 如果主机名是IP地址或者是'localhost'，直接返回主机名
			return host;
		}

		var regex = /([^]*).*/;
		var match = host.match(regex);

		if (match) {
			host = match[1]; // 使用正则表达式提取主机名部分（去除子域名和顶级域名之外的内容）
		}

		if (host) {
			var strAry = host.split(".");
			if (strAry.length > 1) {
				host = strAry[strAry.length - 2] + "." + strAry[strAry.length - 1]; // 只保留域名的最后两部分，用'.'连接起来
			}
		}

		return "." + host; // 返回完整的域名信息（以'.'开头）
	},

	/**
	 * 判断URL是否为网站链接
	 * @param {string} url 待判断的URL
	 * @returns {boolean} 如果URL是以 'http://' 或 'https://' 开头，则返回true，否则返回false。
	 *
	 * @example
	 * isSiteUrl('http://www.zhongjyuan.com'); // 返回 true
	 * isSiteUrl('https://www.zhongjyuan.com'); // 返回 true
	 * isSiteUrl('ftp://www.zhongjyuan.com'); // 返回 false
	 */
	isSiteUrl: function(url) {
		return url && (url.indexOf("http://") === 0 || url.indexOf("https://") === 0);
	},

	/**
	 * 拼接多个路径为一个完整路径
	 * @param {...string} paths 多个路径参数
	 * @returns {string} 拼接后的完整路径
	 *
	 * @example
	 * // 示例1：
	 * const result1 = joinPath('path1', 'path2', 'path3');
	 * console.log(result1);
	 * // 输出: path1/path2/path3
	 *
	 * @example
	 * // 示例2：
	 * const result2 = joinPath('/path1/', '/path2', 'path3/');
	 * console.log(result2);
	 * // 输出: /path1/path2/path3
	 */
	joinPath(...paths) {
		if (paths.length === 1) {
			return paths[0];
		}

		return paths.reduce((pre, cur, i) => {
			if (i === 0) {
				return cur;
			}

			if (pre.endsWith("/")) {
				pre = pre.slice(0, -1);
			}

			if (cur.startsWith("/")) {
				cur = cur.slice(1);
			}

			return `${pre}/${cur}`;
		}, "");
	},

	/**
	 * 从 URL 中获取指定参数的值。
	 * @param {string} name 要获取的参数名。
	 * @param {string} [url] URL 字符串，默认为当前页面的 URL。
	 * @param {boolean} [decode=true] 是否对参数值进行解码，默认为 true。
	 * @returns {string|null} 参数的值，如果不存在返回 null。
	 *
	 * @example
	 * // URL：https://www.example.com/?name=John&age=25
	 * var value = utils.getQueryString('name');
	 * console.log(value);
	 * // Output: "John"
	 */
	getQueryString: function(name, url, decode) {
		if (!utils.isString(name) || name === "") {
			utils.warn("utils.getQueryString 参数错误：name必须为字符串且不为空", arguments);
			return "";
		}
		decode = utils.isBoolean(decode) ? decode : true;
		url = url || (window && window.location.href) || "";

		name = name.replace(/[\[\]]/g, "\\$&");
		const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");

		const results = regex.exec(url);
		if (!results) return null;

		if (!results[2]) return "";

		const val = results[2].replace(/\+/g, " ");

		return decode ? decodeURIComponent(val) : val;
	},

	/**
	 * 设置查询字符串参数并返回新的URL
	 * @param {object} params 参数对象
	 * @param {string} url 原始URL，默认为当前页面的URL
	 * @param {boolean} encode 是否对参数值进行编码，默认为true
	 * @returns {string} 新的URL
	 *
	 * @example
	 * const params = { key1: 'value1', key2: 'value2' };
	 * const url = utils.setQueryString(params, 'https://example.com');
	 * console.log(url); // https://example.com?key1=value1&key2=value2
	 */
	setQueryString: function(params, url, encode) {
		if (!utils.isObject(params)) {
			utils.warn("utils.setUrlParam 参数错误：params不是对象类型", params);
		}
		encode = utils.isBoolean(encode) ? encode : true;
		url = url || (window && window.location.href) || "";

		let isEmpty = url === "";
		let noParam = true;
		let urls = null;
		// url === ''时，返回key=val&key=val
		if (!isEmpty) {
			if (url.indexOf("#") > -1) {
				urls = url.split("#");
				url = urls.slice(1).join("#");
			}

			noParam = url.indexOf("?") === -1;
			url = noParam ? url + "?" : url;
		}

		utils.forEach(params, function(val, key) {
			if (utils.isEmpty(val)) {
				val = "";
			} else {
				val = encode ? encodeURIComponent(val) : val;
			}

			url += (noParam ? "" : "&") + key + "=" + val;
			if (noParam) {
				noParam = false;
			}
		});

		return urls ? `${urls[0]}#${url}` : url;
	},

	/**
	 * 在URL中追加查询字符串参数并返回新的URL
	 * @param {object} params 参数对象
	 * @param {string} url 原始URL，默认为当前页面的URL
	 * @returns {string} 新的URL
	 *
	 * @example
	 * const params = { key1: 'value1', key2: 'value2' };
	 * const url = utils.appendQuery(params, 'https://example.com');
	 * console.log(url); // https://example.com?key1=value1&key2=value2
	 */
	appendQuery(params, url) {
		if (!utils.isObject(params)) {
			utils.warn("utils.appendQuery 参数错误：params不是对象类型", params);
			return;
		}
		url = url || (window && window.location.href) || "";

		let urls = null;
		if (url.indexOf("#") > -1) {
			urls = url.split("#");
			url = urls.slice(1).join("#");
		}

		const [baseUrl, queryString] = url.split("?");
		let query = params;
		if (queryString) {
			query = queryString.split("&").reduce((tempObj, temp) => {
				const [key, val] = temp.split("=");
				tempObj[key] = decodeURIComponent(val);
				return tempObj;
			}, {});
			Object.assign(query, params);
		}

		const str = Object.keys(query)
			.map((key) => `${key}=${encodeURIComponent(query[key])}`)
			.join("&");

		return `${urls ? urls[0] + "#" : ""}${baseUrl}?${str}`;
	},

	/**
	 * 向URL追加随机查询参数并返回新的URL
	 * @param {string} url URL字符串，默认为当前页面的URL
	 * @param {string} random 自定义的随机值，默认为null
	 * @param {boolean} refresh 是否强制刷新页面，默认为false
	 * @returns {string} 新的URL
	 *
	 * @example
	 * const newUrl = utils.appendRandomQuery();
	 * console.log(newUrl); // 追加随机查询参数后的新URL
	 *
	 * @example
	 * const customRandom = 'custom';
	 * const newUrl = utils.appendRandomQuery('https://example.com', customRandom, true);
	 * console.log(newUrl); // https://example.com?_=custom
	 *
	 * @example
	 * const existingUrl = 'https://example.com?key=value';
	 * const newUrl = utils.appendRandomQuery(existingUrl, null, true);
	 * console.log(newUrl); // https://example.com?key=value&_=randomValue
	 */
	appendRandomQuery(url = window.location.href, random, refresh) {
		const getRandom = function() {
			return utils.getQueryString("_");
		};

		let orgiUrl = url;
		let urls = null;
		if (url.indexOf("#") > -1) {
			urls = url.split("#");
			url = urls[0];
		}

		if (!refresh && /_=[^&]/.test(url)) {
			return orgiUrl;
		}

		random = random || getRandom() || utils.guid(8);

		if (urls) {
			return `${url}${url.indexOf("?") > -1 ? "&" : "?"}_=${random}#${urls.slice(1).join("#")}`;
		} else {
			return `${orgiUrl}${url.indexOf("?") > -1 ? "&" : "?"}_=${random}`;
		}
	},

	/**
	 * 解析URL中的查询字符串参数并返回参数对象
	 * @param {string} url URL字符串
	 * @param {string} separator 参数分隔符，默认为"&"
	 * @param {boolean} decode 是否解码参数值，默认为false
	 * @returns {object} 参数对象
	 *
	 * @example
	 * const url = "https://example.com?key1=value1&key2=value2";
	 * const params = utils.parseQuery(url);
	 * console.log(params); // { key1: 'value1', key2: 'value2' }
	 */
	parseQuery: function(url, separator = "&", decode) {
		if (!utils.isString(url)) {
			utils.warn("utils.parseQuery 参数错误：url不是字符串类型", url);
		}

		let patRes;
		const params = {};
		const regex = new RegExp(`[?${separator}]([^=]*)(=([^${separator}#]*)|${separator}|#|$)`, "g");
		while ((patRes = regex.exec(url))) {
			params[patRes[1]] = decode ? decodeURIComponent(patRes[3] || "") : patRes[3] || "";
		}

		return params;
	},

	/**
	 * 替换URL中的路径参数并返回新的URL
	 * @param {string} url URL字符串
	 * @param {object} params 参数对象
	 * @returns {string} 新的URL
	 *
	 * @example
	 * const url = "https://example.com/user/{userId}/profile";
	 * const params = { userId: 123 };
	 * const newUrl = utils.replacePathParams(url, params);
	 * console.log(newUrl); // https://example.com/user/123/profile
	 */
	replacePathParams(url, params) {
		if (!utils.isObject(params)) {
			utils.warn("utils.replacePathParams 参数错误：params不是对象类型", params);
		}

		url = url.replace(/{([^}]*)}/g, function(pat, param) {
			if (params && params.hasOwnProperty(param)) {
				return params[param];
			}

			return pat;
		});

		return url;
	},

	/**
	 * 深层合并对象函数，将一个对象的属性递归地合并到另一个对象中。
	 *
	 * @param {Object} target 目标对象，属性将被合并到该对象中。
	 * @param {Object} obj 源对象，其属性将被合并到目标对象中。
	 * @param {boolean} overwrite 可选参数，指示是否覆盖目标对象中已有的属性，默认为 true。
	 * @param {boolean} deep 可选参数，指示是否进行深层合并，默认为 true。如果为 false，则只进行浅层合并。
	 *
	 * @returns {Object} 合并后的目标对象。
	 *
	 * @example
	 * const target = { a: { b: 1 } };
	 * const obj = { a: { c: 2 } };
	 *
	 * // 使用深层合并将 obj 的属性合并到 target 中
	 * const merged = deepMerge(target, obj);
	 * console.log(merged); // 输出：{ a: { b: 1, c: 2 } }
	 *
	 * @example
	 * const user = {
	 *   name: 'John',
	 *   address: {
	 *     city: 'New York',
	 *     country: 'USA'
	 *   }
	 * };
	 * const updates = {
	 *   address: {
	 *     city: 'San Francisco'
	 *   },
	 *   age: 30
	 * };
	 *
	 * // 使用深层合并将 updates 的属性合并到 user 中，更新地址的城市和添加年龄属性
	 * deepMerge(user, updates);
	 * console.log(user);
	 * // 输出：
	 * // {
	 * //   name: 'John',
	 * //   address: {
	 * //     city: 'San Francisco',
	 * //     country: 'USA'
	 * //   },
	 * //   age: 30
	 * // }
	 */
	deepMerge: function(target, obj, overwrite = true, deep = true) {
		if (!utils.isPlainObject(target) || !utils.isPlainObject(obj)) {
			utils.warn("utils.deepMerge 参数错误：target或者obj参数不是对象类型", target, obj);
			return target;
		}

		overwrite = !!overwrite;
		deep = !!deep;

		var props = Object.keys(obj);
		for (var i = 0, len = props.length; i < len; i++) {
			if (target.hasOwnProperty(props[i]) && !overwrite) {
				continue;
			}

			if (deep && utils.isPlainObject(obj[props[i]])) {
				target[props[i]] = {};
				utils.assign(target[props[i]], obj[props[i]], overwrite, deep);
			} else {
				target[props[i]] = obj[props[i]];
			}
		}

		return target;
	},

	/**
	 * @method http
	 * @param options {object} 配置对象
	 * @param options.type {string} 请求类型
	 * @param options.url {string} 请求地址
	 * @param options.contentType {string} 请求消息主体编码，默认是application/x-www-form-urlencoded
	 * @param options.data {object|string|number} 请求数据，适用于options.type为'PUT', 'POST', and 'PATCH'
	 * @param options.params {object} URL参数
	 * @param options.beforeSend {function} 请求前钩子函数，默认参数是当前options
	 * @param options.success {function} 请求成功函数
	 * @param options.error {function} 请求失败执行函数
	 * @param options.complete {function} 请求执行完成函数，不管成功失败都会执行
	 * @param options.dataType {string} 请求返回数据类型，默认是JSON
	 * @param options.timeout {number} 请求超时时间，单位毫秒
	 * @param options.context {object} 相关回调函数上下文，默认是window
	 * @param options.headers {object} 请求头信息
	 * @param options.host {string} 请求host
	 * @param options.crossSite {boolean} 是否跨域访问，默认为false
	 * @returns {Promise} - 返回一个Promise对象，用于处理请求结果
	 *
	 * @example
	 * http({
	 *   method: 'get',
	 *   url: 'https://api.zhongjyuan.club/plat/user/list',
	 *   headers: {
	 *     'Authorization': 'Bearer xxxxxxxx'
	 *   },
	 *   params: {
	 *     id: 6254084
	 *   },
	 *   success: function(data, response) {
	 *     console.log('请求成功', data);
	 *   },
	 *   error: function(error, options) {
	 *     console.error('请求失败', error);
	 *   }
	 * });
	 *
	 * @example
	 * http({
	 *   method: 'post',
	 *   url: 'https://api.zhongjyuan.club/plat/user/create',
	 *   headers: {
	 *     'Content-Type': 'application/json'
	 *   },
	 *   data: {
	 *     name: 'JinYuan Zhong',
	 *     age: 25,
	 *     email: 'zhongjyuan@outlook.com'
	 *   },
	 *   success: function(data, response) {
	 *     console.log('创建成功', data);
	 *   },
	 *   error: function(error, options) {
	 *     console.error('创建失败', error);
	 *   }
	 * });
	 */
	http: function(options) {
		if (utils.isEmpty(options)) {
			utils.warn("utils.http 参数为空", options);
		}

		var defaultOpts = {
			method: "get",
			url: "",
			baseURL: config.host,
			withCredentials: false,
			timeout: config.timeout || 20000,
			headers: { "content-type": "application/json" },
			data: {},
			params: {},
			responseType: "json",
			validateStatus: function(status) {
				return status >= 200 && status < 300;
			},
		};
		var isAbsolutePath = config.platServer.url.indexOf("/") === 0;
		var absoPathArr = isAbsolutePath ? config.platServer.url.split("/") : [];
		var mapDefaultOpts = function() {
			var propMap = {
				method: "type",
				url: "url",
				baseURL: "host",
				timeout: "timeout",
				headers: "headers",
				data: "data",
				params: "params",
				responseType: "dataType",
				withCredentials: "crossSite",
				onUploadProgress: "onUploadProgress",
				cancelToken: "cancelToken",
			};

			if (!utils.isEmpty(options["contentType"])) {
				options.headers = options.headers || {};
				if (String(options["contentType"]).toLowerCase() === "json") {
					options.headers["content-type"] = "application/json";
				} else {
					options.headers["content-type"] = options["contentType"];
				}
			}

			for (var prop in propMap) {
				if (options.hasOwnProperty(propMap[prop])) {
					// 设置配置属性为null，则表示删除默认的请求属性
					if (utils.isNull(options[propMap[prop]])) {
						delete defaultOpts[prop];
						continue;
					}
					switch (prop) {
						// 处理大小写问题
						case "headers":
							let header = options[propMap[prop]];
							if (utils.isPlainObject(header)) {
								Object.keys(header).forEach(function(key) {
									defaultOpts[prop][key.toLowerCase()] = header[key];
								});
							}
							break;
						case "params":
							defaultOpts[prop] = Object.assign(defaultOpts[prop], options[propMap[prop]]);
							break;
						// get请求，data参数转为params参数
						case "data" && defaultOpts["method"].toLowerCase() === "get":
							defaultOpts["params"] = Object.assgin(defaultOpts["params"], options[propMap[prop]]);
							break;
						case "url":
							if (
								options["url"].indexOf("http://") === 0 ||
								options["url"].indexOf("https://") === 0 ||
								(isAbsolutePath && absoPathArr.length > 1 && options["url"].indexOf(`/${absoPathArr[1]}/`) === 0)
							) {
								delete defaultOpts["baseURL"];
								if (options.hasOwnProperty("host")) {
									delete options["host"];
								}
							}

							defaultOpts[prop] = options[propMap[prop]];
							break;
						case "timeout":
							let timeout = options[propMap[prop]] || config.timeout || 20000;
							if (timeout < 0) {
								timeout = null;
							}

							defaultOpts["timeout"] = timeout;
							break;
						default:
							defaultOpts[prop] = options[propMap[prop]];
					}
				}
			}
		};
		var context = options.context || window;

		try {
			if (utils.isFunction(options.beforeSend)) {
				options.beforeSend.call(context, options);
			}
			mapDefaultOpts();

			// mock处理
			mock(defaultOpts, options);

			// 处理表单数据，data为js对象则stringify处理
			if (
				defaultOpts["headers"]["content-type"] === "application/x-www-form-urlencoded" &&
				(utils.isPlainObject(defaultOpts["data"]) || utils.isArray(defaultOpts["data"]))
			) {
				defaultOpts["data"] = qs.stringify(defaultOpts["data"]);
			}
		} catch (err) {
			console.error(err);
			return Promise.reject(err);
		}

		return axios(defaultOpts)
			.then(function(response) {
				var data = response.data;
				if (utils.isFunction(options.success)) {
					options.success.call(context, data, response);
				}

				if (utils.isFunction(options.complete)) {
					options.complete.call(context, data, response);
				}

				return data;
			})
			.catch(function(error) {
				if (utils.isFunction(options.complete)) {
					options.complete.call(context, error, options);
				}

				throw error;
			});
	},

	/**
	 * 单例函数
	 *
	 * @param {Function} fn 创建实例的函数
	 * @returns {Function|null} 返回一个单例函数
	 *
	 * @example
	 * // 示例1: 创建一个用于计数的单例对象
	 * var counter = utils.getSingleton(function () {
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
	 * });
	 *
	 * counter.increment();
	 * console.log(counter.getCount()); // 输出: 1
	 *
	 * counter.increment();
	 * console.log(counter.getCount()); // 输出: 2
	 *
	 * @example
	 * // 示例2: 创建一个单例网络请求对象
	 * var ajax = utils.getSingleton(function () {
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
	singleton: function(fn) {
		var inst = null;
		const self = this;

		if (!utils.isFunction(fn)) {
			utils.warn("utils.singleton 参数错误：fn必须为函数", fn);
			return null;
		}

		return function() {
			return inst || (inst = fn.apply(self, arguments));
		};
	},

	/**
	 * 延迟执行函数的包装器
	 *
	 * @param {Function} fn 要延迟执行的函数
	 * @param {Function} callback 当函数成功执行时的回调函数
	 * @param {number} maxTime 最大延迟时间（以毫秒为单位）
	 * @returns {Object} 返回一个包含 `start` 和 `stop` 方法的对象
	 *
	 * @example
	 * // 示例1: 创建一个延迟执行函数的实例，并启动延迟执行
	 * var delayFunc = utils.delay(function () {
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
	delay: function(fn, callback, maxTime) {
		var timer = null;
		var isCall = false;

		return {
			start: function() {
				if (timer) {
					clearTimeout(timer);
				}

				timer = setTimeout(function() {
					if (typeof fn === "function") {
						fn();
						isCall = true;
					}
				}, maxTime);
			},
			stop: function() {
				if (isCall) {
					if (typeof callback === "function") {
						callback();
					}
				} else {
					clearTimeout(timer);
				}

				timer = null;
				isCall = false;
				fn = null;
				callback = null;
			},
		};
	},

	/**
	 * 执行动画效果
	 * @param {Object} opts 配置选项对象
	 *   @property {number} duration 动画持续时间（毫秒）
	 *   @property {Function} delta 用于计算动画效果变化量的函数
	 *   @property {Function} step 更新动画状态的函数
	 *   @property {Function} callback (可选) 动画完成后的回调函数
	 *   @property {number} delay (可选) 每次执行回调函数的时间间隔，默认为10毫秒
	 *
	 * @example
	 * animate({
	 *   duration: 1000,
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
	animate(options) {
		var start = new Date();
		var id = window.setInterval(function() {
			var timePassed = new Date() - start;
			var progress = timePassed / options.duration;
			if (progress > 1) progress = 1;
			var delta = options.delta(progress);
			options.step(delta);
			if (progress === 1) {
				window.clearInterval(id);
				if (utils.isFunction(options.callback)) {
					options.callback();
				}
			}
		}, options.delay || 10);
	},

	/**
	 * 防抖函数，延迟执行指定函数，用于频繁触发的事件防止过快执行。
	 *
	 * @param {function} fn 要执行的函数
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
	debounce(fn, delay, immediate) {
		let timer = null;
		if (immediate) {
			fn.apply(this, arguments);
		}
		return function() {
			const that = this;
			const param = arguments;
			if (timer) {
				window.clearTimeout(timer);
			}

			timer = window.setTimeout(function() {
				fn.apply(that, param);
			}, delay);
		};
	},

	/**
	 * 节流函数，控制函数在指定时间间隔内只执行一次。
	 *
	 * @param {function} fn - 要执行的函数
	 * @param {number} interval - 时间间隔（毫秒）
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
	throttle(fn, interval) {
		let timer = null;
		let isStart = true;
		return function() {
			const param = arguments;
			const that = this;
			if (isStart) {
				isStart = false;
				fn.apply(that, param);
			}

			if (!timer) {
				timer = window.setTimeout(function() {
					fn.apply(that, param);
					window.clearTimeout(timer);
					timer = null;
				}, interval);
			}
		};
	},

	/**
	 * 从目标对象中获取指定路径的属性值
	 *
	 * @param {Object} target 目标对象
	 * @param {string} path 属性路径，以点号分隔
	 * @param {boolean} [validate=false] 是否验证路径的有效性，默认为 false
	 * @return {*} 属性值
	 *
	 * @example
	 * // 示例一：获取单层属性值
	 * const obj = {
	 *   name: 'John',
	 *   age: 30,
	 * };
	 * const name = getPropertyValue(obj, 'name');
	 * console.log(name); // 输出: John
	 *
	 * @example
	 * // 示例二：获取多层嵌套属性值
	 * const obj2 = {
	 *   person: {
	 *     name: 'Alice',
	 *     age: 25,
	 *   },
	 * };
	 * const age = getPropertyValue(obj2, 'person.age');
	 * console.log(age); // 输出: 25
	 *
	 * @example
	 * // 示例三：验证路径有效性
	 * const obj3 = {
	 *   a: {
	 *     b: {
	 *       c: 'Hello World',
	 *     },
	 *   },
	 * };
	 * const value = getPropertyValue(obj3, 'a.b.d', true);
	 * console.log(value); // 输出: undefined，因为路径 'a.b.d' 无效
	 */
	getPropertyValue(target, path = "", valid = false) {
		if (!target || utils.isEmpty(path)) return;
		let effective = /^(\w|\d|\$)(\w|\d|\$|-)*(\.(\w|\d|\$)(\w|\d|\$|-)*)*$/.test(path);
		if (valid && !effective) return;
		let paths = path.split(".");
		let currentModel = target;
		let value;
		for (let i = 0; i < paths.length; i++) {
			let key = paths[i];
			currentModel = currentModel[key];
			if (utils.isEmpty(currentModel) && i < paths.length - 1) break;
			if (i === paths.length - 1) value = currentModel;
		}
		return value;
	},

	/**
	 * @namespace localStorage
	 * @description 提供操作浏览器 localStorage 的方法
	 */
	localStorage: {
		/**
		 * @method localStorage.set
		 * @description 设置 localStorage 中的数据
		 * @param {string} key 存储的键名
		 * @param {string|object} value 存储的值（可以是字符串或对象）
		 * @param {boolean} [manage=false] 是否增加管理(统一清除)
		 * @returns {boolean} 是否设置成功
		 * @example
		 * localStorage.set('username', 'John');
		 * localStorage.set('userInfo', { name: 'John', age: 25 }, true);
		 */
		set: function(key, value, manage = false) {
			if (!utils.isString(key) || key === "" || utils.isNullOrUndefined(value)) {
				utils.warn("utils.localStorage.set 参数错误：key不能为空或者value不能为undefined/null");
				return false;
			}

			if (typeof value === "object") {
				value = JSON.stringify(value);
			}

			try {
				window.localStorage.setItem(storageKey(key), value);
				manage && storageMap["localStorage"].set(key);
			} catch (err) {
				console.log(`localStorage 存储异常：${err}`);
			}
			return true;
		},

		/**
		 * @method localStorage.get
		 * @description 获取 localStorage 中存储的数据
		 * @param {string} key 要获取的键名
		 * @param {*} [defaultValue=null] 默认值（可选）
		 * @returns {string|null} 存储的值，如果不存在则返回默认值
		 * @example
		 * const username = localStorage.get('username');
		 * const userInfo = localStorage.get('userInfo', null);
		 */
		get: function(key, defaultValue) {
			defaultValue = arguments.length === 2 ? defaultValue : null;
			if (!utils.isString(key) || key === "") {
				arguments.length < 2 && utils.warn("utils.localStorage.get 参数错误：key必须为字符串，且不能为空");
				return defaultValue;
			}

			const val = window.localStorage.getItem(storageKey(key));
			if (!utils.isNull(val)) {
				return val;
			}

			return defaultValue;
		},

		/**
		 * @method localStorage.remove
		 * @description 移除 localStorage 中指定的数据
		 * @param {string} key 要移除的键名
		 * @returns {boolean} 是否删除成功
		 * @example
		 * localStorage.remove('username');
		 */
		remove: function(key) {
			if (!utils.isString(key) || key === "") {
				utils.warn("utils.localStorage.remove 参数错误：key不能为空");
				return false;
			}

			window.localStorage.removeItem(storageKey(key));
			return true;
		},

		/**
		 * @method localStorage.clear
		 * @description 清空整个 localStorage 中的所有数据
		 * @example
		 * localStorage.clear();
		 */
		clear: function() {
			window.localStorage.clear();
		},
	},

	/**
	 * @namespace sessionStorage
	 * @description 提供操作浏览器 sessionStorage 的方法
	 */
	sessionStorage: {
		/**
		 * 存储数据到sessionStorage中
		 *
		 * @method sessionStorage.set
		 * @param {string} key 键名
		 * @param {string|object} value 值
		 * @param {boolean} [manage=false] 是否增加管理(统一清除)
		 * @return {boolean} 表示是否设置成功
		 *
		 * @example
		 * sessionStorage.set('username', 'John');
		 * sessionStorage.set('userInfo', { name: 'John', age: 28 }, true);
		 */
		set: function(key, value, manage = false) {
			if (!utils.isString(key) || key === "" || utils.isNullOrUndefined(value)) {
				utils.warn("utils.sessionStorage.set 参数错误：key不能为空或者value不能为undefined/null");
				return false;
			}

			if (typeof value === "object") {
				value = JSON.stringify(value);
			}

			try {
				window.sessionStorage.setItem(storageKey(key), value);
				manage && storageMap["sessionStorage"].set(key);
			} catch (err) {
				console.log(`sessionStorage 存储异常：${err}`);
			}

			return true;
		},

		/**
		 * 从sessionStorage中获取指定键的值
		 *
		 * @method sessionStorage.get
		 * @param {string} key 键名
		 * @param {*} [defaultValue=null] 默认值（可选）
		 * @return {string|null} 键对应的值，如果键不存在则返回默认值或null
		 *
		 * @example
		 * const username = sessionStorage.get('username');
		 * const userInfo = sessionStorage.get('userInfo', { name: 'Guest' });
		 */
		get: function(key, defaultValue) {
			defaultValue = arguments.length === 2 ? defaultValue : null;
			if (!utils.isString(key) || key === "") {
				arguments.length < 2 && utils.warn("utils.sessionStorage.get 参数错误：key必须为字符串，且不能为空");
				return defaultValue;
			}

			const val = window.sessionStorage.getItem(storageKey(key));
			if (!utils.isNull(val)) {
				return val;
			}

			return defaultValue;
		},

		/**
		 * 从sessionStorage中移除指定的键值对
		 *
		 * @method sessionStorage.remove
		 * @param {string} key 键名
		 * @return {boolean} 是否删除成功
		 *
		 * @example
		 * sessionStorage.remove('username');
		 */
		remove: function(key) {
			if (!utils.isString(key) || key === "") {
				utils.warn("utils.sessionStorage.remove 参数错误：key不能为空");
				return false;
			}
			window.sessionStorage.removeItem(storageKey(key));
			return true;
		},

		/**
		 * 清空sessionStorage中所有的键值对
		 *
		 * @method sessionStorage.clear
		 *
		 * @example
		 * sessionStorage.clear();
		 */
		clear: function() {
			window.sessionStorage.clear();
		},
	},

	/**
	 * @namespace cookie
	 * @description 提供操作浏览器 cookie 的方法
	 */
	cookie: {
		/**
		 * @method cookie.set
		 * @desc 设置Cookie
		 * @param {string} key 键名
		 * @param {string|number|boolean} value 值
		 * @param {number} expiredays 过期时间（天数）
		 * @param {boolean} [noStoreKey=false] 是否不设置存储键（可选，默认为false）
		 * @returns {boolean} 表示是否设置成功
		 * @example
		 * // 设置名为"username"的Cookie，值为"zhongjyuan"，过期时间为7天
		 * var success = utils.cookie.set('username', 'zhongjyuan', 7);
		 */
		set: function(key, value, expiredays, noStoreKey) {
			var date;
			if (!utils.isString(key) || key === "" || utils.isNullOrUndefined(value)) {
				utils.warn("utils.cookie.set 参数错误：key不能为空或者value不能为undefined/null");
				return false;
			}

			if (utils.isInt(expiredays)) {
				date = new Date();
				date.setDate(date.getDate() + expiredays);
			}

			document.cookie =
				(noStoreKey ? key : storageKey(key)) +
				"=" +
				escape(value) +
				(!date ? "" : ";expires=" + date.toGMTString()) +
				(config.useCookieMainDomain ? ";domain=" + utils.getDomain() : "") +
				";path=/;SameSite=" +
				config.cookieSameSite;

			return true;
		},

		/**
		 * @method cookie.get
		 * @desc 获取Cookie的值
		 * @param {string} key 键名
		 * @param {*} [defaultValue=null] 默认值（可选，默认为null）
		 * @param {boolean} [noStoreKey=false] 否不检索存储键（可选，默认为false）
		 * @returns {string|null} Cookie的值，如果未找到则返回默认值
		 * @example
		 * // 获取名为"username"的Cookie的值，如果不存在则返回"default"
		 * var username = utils.cookie.get('username', 'default');
		 */
		get: function(key, defaultValue, noStoreKey) {
			defaultValue = arguments.length === 2 ? defaultValue : null;
			if (!utils.isString(key) || key === "") {
				utils.warn("utils.cookie.get 参数错误：key不能为空");
				return defaultValue;
			}

			var arr = document.cookie.match(new RegExp("(^| )" + (noStoreKey ? key : getAppStoreKey(key)) + "=([^;]*)(;|$)"));

			if (utils.isArray(arr)) {
				return unescape(arr[2]);
			}

			return defaultValue;
		},

		/**
		 * @method cookie.remove
		 * @desc 移除Cookie
		 * @param {string} key 键名
		 * @param {boolean} [noStoreKey] 是否不移除存储的键，默认为false
		 * @returns {boolean} 是否成功移除了Cookie
		 * @example
		 * utils.cookie.remove('username');
		 */
		remove: function(key, noStoreKey) {
			return utils.cookie.set(key, "", -1000, noStoreKey);
		},
	},

	/**
	 * @namespace math
	 * @description 提供数字统计方法
	 */
	math: {
		/**
		 * 找出数值数组中的最大值，并根据选项进行格式化输出。
		 *
		 * @param {number[]} values 数值数组
		 * @param {object} option 选项对象
		 * @param {string} option.type 数值类型，可选值为"date"、"int"或"float"
		 * @param {string} [option.format] 格式化选项，可选值为"thousand"表示千位分隔，默认为转换为整数
		 * @param {number} [option.place] 小数位数，仅在格式化选项为"float"且未指定小数位数时有效，默认为2
		 * @returns {string} 格式化后的最大值
		 *
		 * @example
		 * max([1, 2, 3], { type: "int" }); // 返回 "3"
		 *
		 * @example
		 * max([new Date(2022, 0, 1), new Date(2023, 0, 1)], { type: "date", format: "yyyy-MM-dd" }); // 返回 "2023-01-01"
		 *
		 * @example
		 * max([1000, 2000, 3000, 4000], { type: "int", format: "thousand" }); // 返回 "1,000"
		 *
		 * @example
		 * max([3.1415, 2.71828, 1.4142], { type: "float", place: 4 }); // 返回 "3.1415"
		 */
		max(values, option) {
			// 检查选项的类型是否为"date"、"int"或"float"
			if (option.type !== "date" && option.type !== "int" && option.type !== "float") {
				return "";
			}

			const isDate = option.type === "date";
			let maxVal;
			// 遍历数值数组
			values.forEach((val, i) => {
				if (i === 0) {
					// 初始化最大值，对于日期类型将调用工具函数parseDate进行解析，其他类型的默认初始值为0
					maxVal = isDate ? utils.parseDate(val) : utils.isNumeric(val) ? parseFloat(val) : 0;
					return;
				}

				// 更新最大值
				if (val > maxVal) {
					maxVal = val;
				}
			});

			// 如果最大值为空，则返回空字符串
			if (!maxVal) {
				return "";
			}

			// 根据选项格式化最大值
			if (isDate) {
				// 对于日期类型调用工具函数formatDate进行格式化，使用选项中指定的格式，如果未指定则默认为"yyyy-MM-dd hh:mm:ss"
				return utils.formatDate(maxVal, option.format || "yyyy-MM-dd hh:mm:ss");
			} else {
				if (option.format === "thousand") {
					// 如果选项中指定了格式为"thousand"，则调用工具函数toThousands进行千位分隔，并使用选项中指定的小数位数，如果未指定则默认为2
					return utils.toThousands(maxVal, option.place || 2);
				} else if (option.type === "float") {
					// 对于浮点数类型，调用工具函数parseDecimal进行小数位处理，并使用选项中指定的小数位数，如果未指定则默认为2
					return utils.parseDecimal(maxVal, option.place || 2);
				} else {
					// 默认情况下，将最大值转换为整数
					return utils.parseInt(maxVal);
				}
			}
		},

		/**
		 * 找出数值数组中的最小值，并根据选项进行格式化输出。
		 *
		 * @param {number[]} values 数值数组
		 * @param {object} option 选项对象
		 * @param {string} option.type 数值类型，可选值为"date"、"int"或"float"
		 * @param {string} [option.format] 格式化选项，可选值为"thousand"表示千位分隔，默认为转换为整数
		 * @param {number} [option.place] 小数位数，仅在格式化选项为"float"且未指定小数位数时有效，默认为2
		 * @returns {string} 格式化后的最小值
		 *
		 * @example
		 * min([1, 2, 3], { type: "int" }); // 返回 "1"
		 *
		 * @example
		 * min([4, 8, 2, 5], { type: "int" }); // 返回 "2"
		 *
		 * @example
		 * min([1.5, 2.7, 3.1], { type: "float" }); // 返回 "1.50"
		 *
		 * @example
		 * min([1000, 2000, 3000], { type: "float", format: "thousand", place: 0 }); // 返回 "1,000"
		 *
		 * @example
		 * min([new Date(2022, 0, 1), new Date(2023, 0, 1)], { type: "date", format: "yyyy-MM-dd" }); // 返回 "2022-01-01"
		 */
		min(values, option) {
			// 检查选项的类型是否为"date"、"int"或"float"
			if (option.type !== "date" && option.type !== "int" && option.type !== "float") {
				return "";
			}

			const isDate = option.type === "date";
			let minVal;
			// 遍历数值数组
			values.forEach((val, i) => {
				if (i === 0) {
					// 初始化最小值，对于日期类型将调用工具函数parseDate进行解析，其他类型的默认初始值为0
					minVal = isDate ? utils.parseDate(val) : utils.isNumeric(val) ? parseFloat(val) : 0;
					return;
				}

				// 更新最小值
				if (val < minVal) {
					minVal = val;
				}
			});

			// 如果最小值为空，则返回空字符串
			if (!minVal) {
				return "";
			}

			// 根据选项格式化最小值
			if (isDate) {
				// 对于日期类型调用工具函数formatDate进行格式化，使用选项中指定的格式，如果未指定则默认为"yyyy-MM-dd hh:mm:ss"
				return utils.formatDate(minVal, option.format || "yyyy-MM-dd hh:mm:ss");
			} else {
				if (option.format === "thousand") {
					// 如果选项中指定了格式为"thousand"，则调用工具函数toThousands进行千位分隔，并使用选项中指定的小数位数，如果未指定则默认为2
					return utils.toThousands(minVal, option.place || 2);
				} else if (option.type === "float") {
					// 对于浮点数类型，调用工具函数parseDecimal进行小数位处理，并使用选项中指定的小数位数，如果未指定则默认为2
					return utils.parseDecimal(minVal, option.place || 2);
				} else {
					// 默认情况下，将最小值转换为整数
					return utils.parseInt(minVal);
				}
			}
		},

		/**
		 * 计算数值数组的总和，并根据选项进行格式化输出。
		 *
		 * @param {number[]} values 数值数组
		 * @param {object} option 选项对象
		 * @param {string} option.type 数值类型，可选值为"int"或"float"
		 * @param {string} [option.format] 格式化选项，可选值为"thousand"表示千位分隔，"float"表示小数位处理，默认为转换为整数
		 * @param {number} [option.place] 小数位数，仅在format为"thousand"或"float"时有效，默认为2
		 * @returns {string} 格式化后的总和
		 *
		 * @example
		 * sum([1, 2, 3], { type: "int" }); // 返回 "6"
		 *
		 * @example
		 * sum([1.5, 2.5, 3.5], { type: "float", format: "thousand", place: 3 }); // 返回 "7.500"
		 */
		sum(values, option) {
			// 检查选项的类型是否为"int"或"float"
			if (option.type !== "int" && option.type !== "float") {
				return "";
			}

			let result = 0;
			// 遍历数值数组，并将每个数值累加到结果中
			values.forEach((val, i) => {
				// 如果数值是数字类型，则将其转换为浮点数后累加，否则默认为0
				result += utils.isNumeric(val) ? parseFloat(val) : 0;
			});

			// 根据选项格式化结果
			if (option.format === "thousand") {
				// 如果选项中指定了格式为"thousand"，则调用工具函数toThousands进行千位分隔，并使用选项中指定的小数位数，如果未指定则默认为2
				return utils.toThousands(result, option.place || 2);
			} else if (option.type === "float") {
				// 对于浮点数类型，调用工具函数parseDecimal进行小数位处理，并使用选项中指定的小数位数，如果未指定则默认为2
				return utils.parseDecimal(result, option.place || 2);
			} else {
				// 默认情况下，将结果转换为整数
				return utils.parseInt(result);
			}
		},

		/**
		 * 计算数值数组的平均值，并根据选项进行格式化输出。
		 *
		 * @param {number[]} values 数值数组
		 * @param {object} option 选项对象
		 * @param {string} option.type 数值类型，可选值为"int"或"float"
		 * @param {string} [option.format] 格式化选项，可选值为"thousand"表示千位分隔，默认为转换为浮点数
		 * @param {number} [option.place] 小数位数，仅在格式化选项为"float"且未指定小数位数时有效，默认为2
		 * @returns {string} 格式化后的平均值
		 *
		 * @example
		 * average([1, 2, 3], { type: "int" }); // 返回 "2"
		 *
		 * @example
		 * average([1.5, 2.5, 3.5], { type: "float", format: "thousand", place: 3 }); // 返回 "2.500"
		 */
		average(values, option) {
			// 检查选项的类型是否为"int"或"float"
			if (option.type !== "int" && option.type !== "float") {
				return "";
			}

			let result = 0;
			// 遍历数值数组，并将每个数值累加到结果中
			values.forEach((val, i) => {
				// 如果数值是数字类型，则将其转换为浮点数后累加，否则默认为0
				result += utils.isNumeric(val) ? parseFloat(val) : 0;
			});

			// 根据选项格式化结果
			if (option.format === "thousand") {
				// 如果选项中指定了格式为"thousand"，则调用工具函数toThousands进行千位分隔，并使用选项中指定的小数位数，如果未指定则默认为2
				return utils.toThousands(result / values.length, option.place || 2);
			} else {
				// 默认情况下，调用工具函数parseDecimal进行小数位处理，并使用选项中指定的小数位数，如果未指定则默认为2
				return utils.parseDecimal(result / values.length, option.place || 2);
			}
		},
	},
};

export default utils;
