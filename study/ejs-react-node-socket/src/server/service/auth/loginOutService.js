var cache = require("../../../tools/cache");
var log4js = require("../../../tools/log4js/logger");
var byteBuffer = require("../../../tools/buffer/byteBuffer");

var logger = log4js.logger("loginOut-service");

var messageConfig = require("../../message/auth");
var messageProtocol = require("../../message/protocol");

/**
 * 登出服务
 * @param {*} socket WebSocket
 * @param {*} socketClient Socket客户端
 */
var LoginOutService = function (socket, socketClient) {
	var authMessage = messageConfig.authMessage;

	var type = authMessage.Logout.type;
	var tokenId = authMessage.Logout.tokenId;
	var commandId = Math.floor(process.uptime() * 1000);

	var messageName = tokenId + "_" + commandId + "_" + 0;
	socketClient.generatorEvent(messageName, this.decode);

    /**
     * 登出
     */
	this.loginOut = function () {

		var buffer = messageProtocol.encode(tokenId, commandId);
		var requestBuffer = buffer.byte(type).byte(1).pack(true);

		logger.info("loginOut...");
        socketClient.getClient().write(requestBuffer);
	};

	/**
	 * 解析数据
	 * @param {*} data 响应数据
	 * @param {*} agentId 代理主键
	 */
	this.decode = function (data, agentId) {

	};
};

module.exports = exports = LoginOutService;