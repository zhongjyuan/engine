var cache = require("../../tools/cache");
var log4js = require("../../tools/log4js/logger");
var byteBuffer = require("../../tools/buffer/byteBuffer");

const path = "[HealthService] >> ";
var logger = log4js.logger("service");

var messageConfig = require("../message/common");
var messageProtocol = require("../message/protocol");

/**
 * 健康检测服务
 * @param {*} socket WebSocket
 * @param {*} socketClient Socket客户端
 */
var HealthService = function (socket, socketClient) {
	var commonMessage = messageConfig.commonMessage;

	var type = commonMessage.Health.type;
	var tokenId = commonMessage.Health.tokenId;
	var commandId = Math.floor(process.uptime() * 1000);

	var messageName = tokenId + "_" + commandId + "_" + 0;
	socketClient.generatorEvent(messageName, this.decode);

	var interId;

	/**健康检测(30s) */
	this.health = function () {
		interId = setInterval(function () {
			try {
				var buffer = messageProtocol.encode(tokenId, commandId);
				var requestBuffer = buffer.pack(true);
				var client = socketClient.getClient();
				client.write(requestBuffer);
			} catch (e) {
				clearInterval(interId);
			}
		}, 30000);
		map.put(socket.id, interId);
	};

	/**停止检测 */
	this.stop = function () {
		clearInverval(interId);
	};

	this.decode = function (data) {
		logger.debug(path + "decode [" + messageName + "] data: " + data);
	};
};

module.exports = exports = HealthService;
