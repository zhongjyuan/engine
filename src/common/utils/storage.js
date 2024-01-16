import logger from "../logManagement";
import { isArray, isEmpty, isInt, isNull, isNullOrUndefined, isObject, isString } from "./default";

export default {
	suffix: logger.decorator(storageKeySuffix, "tool-storage-key-suffix"),
	key: logger.decorator(storageKey, "tool-storage-key"),
	local: localStorage,
	session: sessionStorage,
	cookie: cookie,
};

/**
 * 生成存储键的后缀字符串
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @param {boolean} dynamic 是否使用动态后缀
 * @param {string} suffix 静态后缀值，默认为 "zhongjyuan"
 * @returns {string} 存储键的后缀字符串
 *
 * @example
 * storageKeySuffix(); // 假设当前窗口的端口号为 "8080"，返回 "_8080"
 *
 * @example
 * storageKeySuffix(false); // 返回 "_zhongjyuan"
 *
 * @example
 * storageKeySuffix(false, "example"); // 返回 "_example"
 */
export function storageKeySuffix(dynamic = true, suffix = window.zhongjyuan.runtime.setting.storage.suffix) {
	let keySuffix;

	if (dynamic) {
		suffix = window.location.port;
	}

	// 根据suffix的值，确定使用不同的后缀函数
	if (suffix) {
		// 如果suffix存在，则定义一个名为keySuffix的函数，返回带下划线前缀的suffix
		keySuffix = function () {
			return `_${suffix}`;
		};
	} else {
		// 如果suffix不存在，则定义一个名为keySuffix的函数，返回空字符串
		keySuffix = function () {
			return "";
		};
	}

	// 返回实际的后缀字符串
	return keySuffix();
}

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
 * console.log(mergedKey2); // 输出："info_8080"
 */
export function storageKey(key) {
	if (!isString(key)) {
		throw new Error(`key<${JSON.stringify(key)}>必须是字符串类型.`);
	}

	let mergeKey;
	const suffix = storageKeySuffix(); // 获取存储键的后缀

	if (suffix) {
		mergeKey = function (key) {
			return `${key}${suffix}`; // 返回将后缀添加到key后面的结果
		};
	} else {
		mergeKey = function (key) {
			return key; // 返回原始的key值
		};
	}

	return mergeKey(key); // 调用合并函数，返回最终的存储键
}

/**
 * @namespace localStorage
 * @description 提供操作浏览器 localStorage 的方法
 */
export const localStorage = (function () {
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
	function set(key, value, manage = false) {
		if (!isString(key) || isEmpty(key)) {
			throw new Error(`key<${JSON.stringify(key)}>必须是字符串类型且不能为空.`);
		}

		if (isNullOrUndefined(value)) {
			throw new Error(`value<${JSON.stringify(value)}>不能为空.`);
		}

		if (isObject(value) || isArray(value)) {
			value = JSON.stringify(value);
		}

		try {
			window.localStorage.setItem(storageKey(key), value);
			manage && window.zhongjyuan.storage["localStorage"].set(key);
		} catch (err) {
			throw new Error(`localStorage 存储异常：${err}`);
		}
	}

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
	function get(key, defaultValue) {
		if (!isString(key) || isEmpty(key)) {
			throw new Error(`key<${JSON.stringify(key)}>必须是字符串类型且不能为空.`);
		}
		defaultValue = arguments.length === 2 ? defaultValue : null;

		const value = window.localStorage.getItem(storageKey(key));
		return isNull(value) ? defaultValue : value;
	}

	/**
	 * @method localStorage.remove
	 * @description 移除 localStorage 中指定的数据
	 * @param {string} key 要移除的键名
	 * @returns {boolean} 是否删除成功
	 * @example
	 * localStorage.remove('username');
	 */
	function remove(key) {
		if (!isString(key) || isEmpty(key)) {
			throw new Error(`key<${JSON.stringify(key)}>必须是字符串类型且不能为空.`);
		}

		window.localStorage.removeItem(storageKey(key));
	}

	/**
	 * @method localStorage.clear
	 * @description 清空整个 localStorage 中的所有数据
	 * @example
	 * localStorage.clear();
	 */
	function clear() {
		window.localStorage.clear();
	}

	return {
		set: logger.decorator(set, "tool-local-storage.set"),
		get: logger.decorator(get, "tool-local-storage.get"),
		remove: logger.decorator(remove, "tool-local-storage.remove"),
		clear: logger.decorator(clear, "tool-local-storage.clear"),
	};
})();

/**
 * @namespace sessionStorage
 * @description 提供操作浏览器 sessionStorage 的方法
 */
export const sessionStorage = (function () {
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
	function set(key, value, manage = false) {
		if (!isString(key) || isEmpty(key)) {
			throw new Error(`key<${JSON.stringify(key)}>必须是字符串类型且不能为空.`);
		}

		if (isNullOrUndefined(value)) {
			throw new Error(`value<${JSON.stringify(value)}>不能为空.`);
		}

		if (isObject(value) || isArray(value)) {
			value = JSON.stringify(value);
		}

		try {
			window.sessionStorage.setItem(storageKey(key), value);
			manage && window.zhongjyuan.storage["sessionStorage"].set(key);
		} catch (err) {
			throw new Error(`sessionStorage 存储异常：${err}`);
		}
	}

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
	function get(key, defaultValue) {
		if (!isString(key) || isEmpty(key)) {
			throw new Error(`key<${JSON.stringify(key)}>必须是字符串类型且不能为空.`);
		}
		defaultValue = arguments.length === 2 ? defaultValue : null;

		const value = window.sessionStorage.getItem(storageKey(key));
		return isNull(value) ? defaultValue : value;
	}

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
	function remove(key) {
		if (!isString(key) || isEmpty(key)) {
			throw new Error(`key<${JSON.stringify(key)}>必须是字符串类型且不能为空.`);
		}

		window.sessionStorage.removeItem(storageKey(key));
	}

	/**
	 * 清空sessionStorage中所有的键值对
	 *
	 * @method sessionStorage.clear
	 *
	 * @example
	 * sessionStorage.clear();
	 */
	function clear() {
		window.sessionStorage.clear();
	}

	return {
		set: logger.decorator(set, "tool-session-storage.set"),
		get: logger.decorator(get, "tool-session-storage.get"),
		remove: logger.decorator(remove, "tool-session-storage.remove"),
		clear: logger.decorator(clear, "tool-session-storage.clear"),
	};
})();

/**
 * @namespace cookie
 * @description 提供操作浏览器 cookie 的方法
 */
export const cookie = (function () {
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
	 * var success = cookie.set('username', 'zhongjyuan', 7);
	 */
	function set(key, value, expiredays, noStoreKey) {
		if (!isString(key) || isEmpty(key)) {
			throw new Error(`key<${JSON.stringify(key)}>必须是字符串类型且不能为空.`);
		}

		if (isNullOrUndefined(value)) {
			throw new Error(`value<${JSON.stringify(value)}>不能为空.`);
		}

		if (!isInt(expiredays)) {
			throw new Error(`expiredays<${JSON.stringify(expiredays)}>必须是整数类型.`);
		}

		var date;
		if (isInt(expiredays)) {
			date = new Date();
			date.setDate(date.getDate() + expiredays);
		}

		document.cookie =
			(noStoreKey ? key : storageKey(key)) +
			"=" +
			escape(value) +
			(!date ? "" : ";expires=" + date.toGMTString()) +
			(window.zhongjyuan.runtime.setting.cookie.useMainDomain ? ";domain=" + getDomain() : "") +
			";path=/;SameSite=" +
			window.zhongjyuan.runtime.setting.cookie.sameSite +
			(window.zhongjyuan.runtime.setting.cookie.secure ? ";Secure" : "");
	}

	/**
	 * @method cookie.get
	 * @desc 获取Cookie的值
	 * @param {string} key 键名
	 * @param {*} [defaultValue=null] 默认值（可选，默认为null）
	 * @param {boolean} [noStoreKey=false] 否不检索存储键（可选，默认为false）
	 * @returns {string|null} Cookie的值，如果未找到则返回默认值
	 * @example
	 * // 获取名为"username"的Cookie的值，如果不存在则返回"default"
	 * var username = cookie.get('username', 'default');
	 */
	function get(key, defaultValue, noStoreKey) {
		if (!isString(key) || isEmpty(key)) {
			throw new Error(`key<${JSON.stringify(key)}>必须是字符串类型且不能为空.`);
		}
		defaultValue = arguments.length >= 2 ? defaultValue : null;

		var arr = document.cookie.match(new RegExp("(^| )" + (noStoreKey ? key : storageKey(key)) + "=([^;]*)(;|$)"));
		return isArray(arr) ? unescape(arr[2]) : defaultValue;
	}

	/**
	 * @method cookie.remove
	 * @desc 移除Cookie
	 * @param {string} key 键名
	 * @param {boolean} [noStoreKey] 是否不移除存储的键，默认为false
	 * @returns {boolean} 是否成功移除了Cookie
	 * @example
	 * cookie.remove('username');
	 */
	function remove(key, noStoreKey) {
		if (!isString(key) || isEmpty(key)) {
			throw new Error(`key<${JSON.stringify(key)}>必须是字符串类型且不能为空.`);
		}

		return cookie.set(key, "", -1000, noStoreKey);
	}

	return {
		set: logger.decorator(set, "tool-cookie-storage.set"),
		get: logger.decorator(get, "tool-cookie-storage.get"),
		remove: logger.decorator(remove, "tool-cookie-storage.remove"),
	};
})();
