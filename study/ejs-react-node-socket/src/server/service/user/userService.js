var cache = require("../../../tools/cache");
var log4js = require("../../../tools/log4js/logger");
var byteBuffer = require("../../../tools/buffer/byteBuffer");

var logger = log4js.logger("user-service");

var messageConfig = require("../../message/user");
var messageProtocol = require("../../message/protocol");

/**
 * 用户服务
 * @param {*} socket WebSocket
 * @param {*} socketClient Socket客户端
 */
var UserService = function (socket, socketClient) {
	var userMessage = messageConfig.userMessage;

	/**列表查询 */
	this.list = function () {};
};

module.exports = exports = UserService;
