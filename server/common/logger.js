/**
 * 日志打印工具
 */
var log4js = require("log4js");

exports.levels = log4js.levels;

/**
 * 日志配置
 */
exports.configure = function(configPath) {
	/**https://blog.csdn.net/weixin_42214717/article/details/128332445 */
	log4js.configure(configPath);
};

/**
 * 根据名称获取日志打印对象
 * @param {*} name
 * @returns
 */
exports.category = function(category, path = "") {
	if (path != "") {
		return {
			trace: function(message, ...args) {
				log4js.getLogger(category).trace("%s " + message, path, ...args);
			},
			debug: function(message, ...args) {
				log4js.getLogger(category).debug("%s " + message, path, ...args);
			},
			info: function(message, ...args) {
				log4js.getLogger(category).info("%s " + message, path, ...args);
			},
			warn: function(message, ...args) {
				log4js.getLogger(category).warn("%s " + message, path, ...args);
			},
			error: function(message, ...args) {
				log4js.getLogger(category).error("%s " + message, path, ...args);
			},
			fatal: function(message, ...args) {
				log4js.getLogger(category).fatal("%s " + message, path, ...args);
			},
			mark: function(message, ...args) {
				log4js.getLogger(category).mark("%s " + message, path, ...args);
			},
		};
	}
	return log4js.getLogger(category);
};

/**
 * 用于Express 挂载
 * @returns
 */
exports.useLog = function(category, level = log4js.levels.INFO) {
	return log4js.connectLogger(log4js.getLogger(category), {
		level: level,
	});
};
