const net = require("net");
const EventEmitter = require("events");

const cache = require("../cache");
const log4js = require("../log4js/logger");
const exBuffer = require("../buffer/exBuffer");
const byteBuffer = require("../buffer/byteBuffer");

const path = "[socket/client.js]";
const logger = log4js.logger("framework");
var subscribe = require("../../tools/socket/subscribe");
const application = require("../../../public/config/application");

/**Socket客户端 */
const socketClient = function () {
	const host = application.server.host;
	const port = application.server.port;

	const client = new net.Socket();
	const emitter = new EventEmitter.EventEmitter(this);

	let socketServer = {};
	const buffer = new exBuffer().uint32Head().littleEndian();

	/**设置webSocket实例,用于Gccp断线通知H5页面展示 */
	this.initwScoket = function (server) {
		socketServer = server;
	};

	/**
	 * Socket客户端启动
	 * @param {*} data
	 */
	this.startClient = function (data) {
		client.connect(port, host, function () {
			logger.info(path + "client connection to: " + host + ":" + port);
		});
		client.write(data);
	};

	/**Socket客户端断开 */
	this.disconnectClient = function () {
		logger.info(path + "client disconnection.");
		client.end();
	};

	/**Socket客户端获取 */
	this.getClient = function () {
		return client;
	};

	/**绑定message decode方法(事件只执行一次) */
	this.generatorEvent = function (eventName, fun) {
		emitter.once(eventName, fun);
	};

	/**绑定message decode方法(事件可以重复被激活使用) */
	this.generatorLoopEvent = function (eventName, fun) {
		emitter.on(eventName, fun);
	};

	/**Socket监听data事件 */
	client.on("data", function (data) {
		logger.info(path + "client receive socket data, length:" + data.length);
		buffer.put(data);
	});

	/**Socket监听end事件 */
	client.on("end", function () {
		logger.info(path + "client receive socket data end.");
	});

	/**Socket监听error事件 */
	client.on("error", function (err) {
		logger.info(path + "client error: " + err);
		if (err.code == "ECONNRESET") {
			socketServer.server.sockets.emit(
				subscribe.server.disconnect,
				"中控服务器服务端断开连接"
			);
		}

		if (err.message == "This socket is closed") {
			clearInterval(cache.getSocket(socketServer.id));
			socketServer.emit(
				subscribe.socketclient.disconnect,
				"客服端Socket与Gccp断开连接"
			);
		}
	});

	/**Socket监听close事件 */
	client.on("close", function () {
		clearInterval(cache.getSocket(socketServer.id));
		logger.info(path + "client closed.");
	});

	/**ExBuffer监听data事件(Socket监听data后转发) */
	buffer.on("data", function (buffer) {
		logger.info(path + " >> deal client packet, length:" + buffer.length);

		/**响应业务内容长度 */
		const dataLen = buffer.length - 20;
		/**响应内容ByteBuffer */
		const responseByteBuffer = new byteBuffer(buffer).littleEndian();
		/**响应内容集 */
		const responseArr = responseByteBuffer
			.int32()
			.byte()
			.byte()
			.short()
			.short()
			.short()
			.int32()
			.int32()
			.byteArray(null, dataLen)
			.unpack();

		logger.info(
			path +
				" >> client receive packet:[" +
				responseArr[0] +
				"," +
				responseArr[1] +
				"," +
				responseArr[2] +
				"," +
				responseArr[3] +
				"," +
				responseArr[4] +
				"," +
				responseArr[5] +
				"," +
				responseArr[6] +
				"," +
				responseArr[7] +
				"]"
		);

		let tokenId = responseArr[5];
		let commandId = responseArr[6];
		let agentId = responseArr[7];
		let messageName = "";

		if (tokenId == 7) {
			/**响应业务内容Buffer */
			const dataBuffer = Buffer.from(responseArr[8]);
			/**响应业务内容ByteBuffer */
			const dataByteBuffer = new byteBuffer(dataBuffer).littleEndian();
			/**响应业务内容集 */
			const dataArr = dataByteBuffer.int32().int32().unpack();

			responseArr[8] = null;
			agentId = dataArr[1];
			tokenId = cache.getMessage(commandId + "_" + agentId);

			socketServer.emit(
				subscribe.tenant.disconnect,
				"连接不上CCU服务器,请联系管理员"
			);
		}
		messageName = tokenId + "_" + commandId + "_" + agentId;
		logger.info(path + " >> trigger decode event: " + messageName);

		emitter.emit(messageName, responseArr[8], agentId);
		cache.removeMessage(commandId + "_" + agentId);
		logger.info(path + " >> exit...");
	});
};

module.exports = exports = socketClient;
