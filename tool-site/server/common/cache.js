var HashMap = require("hashmap");
var cache = new HashMap();

exports.all = function () {};

/**缓存 */
/**
 * 将指定键值对存储到缓存中
 * @param {string} key - 键名
 * @param {*} value - 值
 */
exports.set = function (key, value) {
	cache.set(key, value);
};
/**
 * 从缓存中获取指定键名对应的值
 * @param {string} key - 键名
 * @returns {*} 缓存中对应键的值，如果不存在则返回undefined
 */
exports.get = function (key) {
	return cache.get(key);
};
/**
 * 从缓存中删除指定键名对应的值
 * @param {string} key - 键名
 */
exports.remove = function (key) {
	cache.delete(key);
};

/**Socket 对象 缓存 */
/**
 * 设置 Socket Server 对象
 * @param {*} value - Socket Server 对象
 */
exports.setServer = function (value) {
	cache.set(`SOCKET_SERVER`, value);
};
/**
 * 获取 Socket Server 对象
 * @returns {*} Socket Server 对象，如果不存在则返回undefined
 */
exports.getServer = function () {
	return cache.get(`SOCKET_SERVER`);
};
/**
 * 删除 Socket Server 对象
 */
exports.removeServer = function () {
	cache.delete(`SOCKET_SERVER`);
};

/**Socket 对象 缓存 */
/**
 * 设置 Socket 对象
 * @param {string} key - 键名
 * @param {*} value - Socket 对象
 */
exports.setSocket = function (key, value) {
	cache.set(`SOCKET_${key}`, value);
};
/**
 * 获取指定键名对应的 Socket 对象
 * @param {string} key - 键名
 * @returns {*} 缓存中对应键的值，如果不存在则返回undefined
 */
exports.getSocket = function (key) {
	return cache.get(`SOCKET_${key}`);
};
/**
 * 删除指定键名对应的 Socket 对象
 * @param {string} key - 键名
 */
exports.removeSocket = function (key) {
	cache.delete(`SOCKET_${key}`);
};

/**Internal 缓存 */
/**
 * 设置 Internal 值
 * @param {string} key - 键名
 * @param {*} value - Internal 值
 */
exports.setInternal = function (key, value) {
	cache.set(`INTERNAL_${key}`, value);
};
/**
 * 获取指定键名对应的 Internal 值
 * @param {string} key - 键名
 * @returns {*} 缓存中对应键的值，如果不存在则返回undefined
 */
exports.getInternal = function (key) {
	return cache.get(`INTERNAL_${key}`);
};
/**
 * 删除指定键名对应的 Internal 值
 * @param {string} key - 键名
 */
exports.removeInternal = function (key) {
	cache.delete(`INTERNAL_${key}`);
};

/**Message缓存 */
/**
 * 设置 Message 值
 * @param {string} key - 键名
 * @param {*} value - Message 值
 */
exports.setMessage = function (key, value) {
	cache.set(`MESSAGE_${key}`, value);
};
/**
 * 获取指定键名对应的 Message 值
 * @param {string} key - 键名
 * @returns {*} 缓存中对应键的值，如果不存在则返回undefined
 */
exports.getMessage = function (key) {
	return cache.get(`MESSAGE_${key}`);
};
/**
 * 删除指定键名对应的 Message 值
 * @param {string} key - 键名
 */
exports.removeMessage = function (key) {
	cache.delete(`MESSAGE_${key}`);
};
