const cache = require("../common/cache");
const config = require("../../config/server.json");
const logger = require("../common/logger").category("service", "common >>");

/**
 * 公共处理订阅对象
 * @author zhongjyuan
 * @date   2024年1月18日18:32:10
 * @email  zhongjyuan@outlook.com
 */
class CommonService {
	/**
	 * 账号处理订阅对象
	 * @param {*} socket Socket对象(用于管理 Socket 服务端与 Socket 客户端的一条连接)
	 * @param {*} tcpClient tcp客户端对象(与 TCP 服务端交互)
	 */
	constructor(socket, tcpClient) {
		/**Socket对象(用于管理 Socket 服务端与 Socket 客户端的一条连接) */
		this.socket = socket;
		/**tcp客户端对象(与 TCP 服务端交互) */
		this.tcpClient = tcpClient;
		/**命令标识 */
		this.commandId = Math.floor(process.uptime() * 1000) + parseInt(Math.random() * 50 + 0);
	}

	/**
	 * 健康检测
	 * @param {*} messageTokenId 消息令牌
	 * @param {*} socketEventName Socket事件名称
	 * @param {*} data 数据
	 */
	health(messageTokenId, socketEventName) {
		try {
			logger.trace(`${this.tcpClient.info()} => health.`);

			var tcpEventName = messageTokenId + "_" + this.commandId + "_zhongjyuan";
			// tcpEventName = messageTokenId;

			/**订阅TCP响应处理[TCP响应数据先到TCPClient中OnData先处理后再发出事件] */
			this.tcpClient.once(tcpEventName, (response) => {
				logger.debug(`tcp server health response: ${response}`);
				if (response === null) {
					response = "tcp server response data is null.";
				}
				this.socket.emit(socketEventName, response);
			});

			/**获取TCP客户端对象,将数据发送到TCP服务端 */
			// this.tcpClient.write(this.requestDataHandle(`${tcpEventName}_true`));

			/**健康检测(30s) */
			this.internalId = setInterval(() => {
				try {
					/**获取TCP客户端对象,将数据发送到TCP服务端 */
					this.tcpClient.write(this.requestDataHandle(true));
				} catch (e) {
					this.tcpClient.cleanHealthInternal();
					logger.error(`${this.tcpClient.info()} => health tcp: ${e}`);
				}
			}, config.tcp.healthInternal);

			this.tcpClient.createHealthInternal(this.internalId);
		} catch (e) {
			logger.error(`${this.tcpClient.info()} => health: ${e}`);
		}
	}

	/**
	 * 健康请求处理
	 * @param {*} data
	 */
	requestDataHandle(data) {
		return data.toString();
	}

	/**
	 * TCP消息发送
	 * @param {*} messageTokenId 消息令牌
	 * @param {*} socketEventName Socket事件名称
	 * @param {*} data 数据
	 * @param {*} tenantId 租户唯一标识
	 */
	tcpMessage(messageTokenId, socketEventName, data, tenantId = "zhongjyuan") {
		try {
			this.socketEventName = socketEventName;
			var tcpEventName = messageTokenId + "_" + this.commandId + "_" + tenantId;
			logger.trace(`${this.tcpClient.info()} => ${tcpEventName} message.`);

			/**订阅TCP响应处理[TCP响应数据先到TCPClient中OnData先处理后再发出事件] */
			this.tcpClient.once(tcpEventName, this.decode);

			this.tcpClient.write(this.encode(data));
			cache.setMessage(tenantId + "_" + messageTokenId, messageTokenId);
		} catch (e) {
			logger.error(`${this.tcpClient.info()} => ${tcpEventName} message: ${e}`);
		}
	}

	/**
	 * 加密(当前客户端向TCP服务端发送数据前进行数据包装)
	 * @param {*} data
	 * @returns
	 */
	encode(data) {
		var dataBuffer = null;
		var baseBuffer = this.tcpClient.encode(messageTokenId, this.commandId);
		if (data != null && data != undefined) {
			var dataByte = Buffer.from(data, "utf8");
			var dataByteLen = Buffer.byteLength(data);

			dataBuffer = baseBuffer.byte(0).int32(dataByteLen).byteArray(dataByte, dataByteLen).pack(true);
		} else {
			dataBuffer = baseBuffer.byte(0).pack(true);
		}

		return dataBuffer;
	}

	/**
	 * 解密(当前客户端接收TCP发送的数据进行解密[本次解密在tcp-client中onData中已经先进行解密过一次了])
	 * @param {*} response
	 * @param {*} tenantId
	 */
	decode(response, tenantId) {
		logger.trace(`${this.tcpClient.info()} => decode ${tenantId} message.`);
		if (response != null) {
			var responseByte = Buffer.from(response, "utf8");
			var responseByteLen = responseByte.length - 4;
			var responseBuffer = new ByteBuffer(responseByte).littleEndian();
			var responseArray = responseBuffer.int32().byteArray(null, responseByteLen).unpack();

			var dataLen = responseArray[0];
			var dataByte = Buffer.from(responseArray[1], "utf8");
			var dataBuffer = new ByteBuffer(dataByte).littleEndian();
			var dataArray = dataBuffer.byteArray(null, dataLen).unpack();

			var dataVaule = Buffer.from(dataArray[0], "utf8").toString();
			this.socket.emit(this.socketEventName, dataVaule);
		} else {
			this.socket.emit(this.socketEventName, "tcp server response data is null.");
		}
	}
}

module.exports = CommonService;
