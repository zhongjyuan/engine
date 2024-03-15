var HashMap = require("hashmap");

/**缓存 */
var cache = new HashMap();
exports.put = function (key, value) {
	cache.set(key, value);
};

exports.get = function (key) {
	return cache.get(key);
};

exports.remove = function (key) {
	cache.delete(key);
};

/**Socker缓存 */
var socketCache = new HashMap();
exports.putSocket = function (key, value) {
	socketCache.set(key, value);
};

exports.getSocket = function (key) {
	return socketCache.get(key);
};

exports.removeSocket = function (key) {
	socketCache.delete(key);
};

/**Message缓存 */
var messageCache = new HashMap();
exports.putMessage = function (key, value) {
	messageCache.set(key, value);
};

exports.getMessage = function (key) {
	return messageCache.get(key);
};

exports.removeMessage = function (key) {
	messageCache.delete(key);
};
