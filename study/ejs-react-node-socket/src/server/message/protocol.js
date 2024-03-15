var log4js = require("../../tools/log4js/logger");
var byteBuffer = require("../../tools/buffer/byteBuffer");

var logger = log4js.logger("message-protocol");

//与Gccp通信,通用部分协议拼接
/*
 主版本号  byte
 子版本号  byte
 构建版本号 short
 是否需要版本（默认-1）short
 code(消息的tokenId) short
 command(时间戳) int
 */
exports.encode = function (tokenId, commandId) {
	logger.info("node 发送消息：tokenId=" + tokenId + ",commandId=" + commandId);

	var buffer = new byteBuffer().littleEndian();
	buffer.byte(1).byte(0).short(0).short(-1).short(tokenId).int32(commandId); //这里不打包,到具体处理封装完毕协议之后再打包处理

	return buffer;
};

exports.decode = function () {};
