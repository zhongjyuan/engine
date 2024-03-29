/**
 * 将值存储到本地存储中
 *
 * @param {string} key - 要存储值的键名
 * @param {any} value - 要存储的值
 * @param {boolean} serialize - 是否序列化存储的值，默认为 false
 * @param {boolean} changed - 是否存储发生变化，默认为 true
 */
export const setLocalStorage = (key, value, serialize = false, changed = true) => {
	if (changed) {
		localStorage.setItem(key, serialize ? JSON.stringify(value) : value); // 如果changed为true，则将值以JSON格式存储到本地存储中
	}
};

/**
 * 从本地存储中获取指定键的值，如果存在则解析为对象，否则返回默认值
 *
 * @param {string} key - 要获取值的键名
 * @param {any} defaultValue - 默认值，如果未找到指定键的值则返回该默认值
 * @param {boolean} deserialize - 是否解析存储的值为对象，默认为 false
 * @returns {any} 存储的值（可能经过解析）或默认值
 */
export const getLocalStorageOrDefault = (key, defaultValue, deserialize = false) => {
	var storedValue = localStorage.getItem(key);
	return storedValue ? (deserialize ? JSON.parse(storedValue) : storedValue) : defaultValue;
};
