/**
 * 将值存储到本地存储，如果指定的键已经存在，则根据changed参数决定是否覆盖。
 *
 * @param {string} key - 存储的键名
 * @param {any} value - 要存储的值
 * @param {boolean} changed - 是否根据changed参数决定是否覆盖，默认为true
 */
export const setLocalStorage = (key, value, changed = true) => {
	if (changed) {
		localStorage.setItem(key, JSON.stringify(value)); // 如果changed为true，则将值以JSON格式存储到本地存储中
	}
};

/**
 * 从本地存储中获取指定键的值，如果键不存在则返回默认值。
 *
 * @param {string} key - 要获取值的键名
 * @param {any} defaultValue - 默认值，如果键不存在时返回该默认值
 * @returns {any} - 获取到的值或默认值
 */
export const getLocalStorageOrDefault = (key, defaultValue) => {
	// 从本地存储中获取指定键的值，如果存在则解析为对象，否则返回默认值
	return (localStorage.getItem(key) && JSON.parse(localStorage.getItem(key))) || defaultValue;
};
