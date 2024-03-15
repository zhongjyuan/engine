var cache = require("../../../tools/cache");
var log4js = require("../../../tools/log4js/logger");
var byteBuffer = require("../../../tools/buffer/byteBuffer");

var logger = log4js.logger("signup-service");

var messageConfig = require("../../message/auth");
var messageProtocol = require("../../message/protocol");

/**
 * 注册服务
 * @param {*} socket WebSocket
 * @param {*} socketClient Socket客户端
 */
var SignupService = function (socket, socketClient) {
	var authMessage = messageConfig.authMessage;

	var type = authMessage.Signup.type;
	var tokenId = authMessage.Signup.tokenId;
	var commandId = Math.floor(process.uptime() * 1000);

	var messageName = tokenId + "_" + commandId + "_" + 0;
	socketClient.generatorEvent(messageName, this.decode);

	var userName = null;

	/**
	 * 注册
	 * @param {*} account 账号
	 * @param {*} password 密码
	 * @param {*} address 地址
	 */
	this.signup = function (account, password, address) {};

	/**
	 * 解析数据
	 * @param {*} data 响应数据
	 * @param {*} agentId 代理主键
	 */
	this.decode = function (data, agentId) {
		var responseBuffer = Buffer.from(data);

		var responseBufferLength = responseBuffer.length - 5;
		var responseByteBuffer = new byteBuffer(responseBuffer).littleEndian();
		var responseArr = responseByteBuffer
			.byte()
			.int32()
			.byteArray(null, responseBufferLength)
			.unpack();

		var success = responseArr[0];
		if (success) {
			logger.info(">> signup success.");
		} else {
			clearInterval(cache.getSocket(socket.id));

			logger.error(">> login signup, code: xxx, message: xxx");
		}
	};
};

module.exports = exports = SignupService;
