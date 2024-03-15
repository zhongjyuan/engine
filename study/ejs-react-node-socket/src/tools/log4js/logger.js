
/**
 * 日志打印工具
 */
var path = require("path");
var log4js = require("log4js");

/**
 * 日志配置
 */
exports.configure = function () {
	/**https://blog.csdn.net/weixin_42214717/article/details/128332445 */
	log4js.configure(path.join(__dirname, "../../../public/config/log4js.json"));
};

/**
 * 根据名称获取日志打印对象
 * @param {*} name 
 * @returns 
 */
exports.logger = function (name) {
	var myLogger = log4js.getLogger(name);
	myLogger.log(log4js.levels.INFO);
	return myLogger;
};

/**
 * 用于Express 挂载
 * @returns 
 */
exports.useLog = function (category) {
	return log4js.connectLogger(log4js.getLogger(category), {
		level: log4js.levels.INFO,
	});
};
