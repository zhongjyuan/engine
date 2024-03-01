const net = require("net");

const config = require("../config/server");

const cache = require("./common/cache");
const ExBuffer = require("./common/buffer/exBuffer");
const ByteBuffer = require("./common/buffer/byteBuffer");
const logger = require("./common/logger").category("tcp", "client >>");

/**
 * TCP 客户端对象
 * @author zhongjyuan
 * @date   2024年1月18日17:09:38
 * @email  zhongjyuan@outlook.com
 */
class TCPClient {
	/**
	 * TCP 客户端对象
	 * @param {*} socket Socket对象(用于管理 Socket 服务端与 Socket 客户端的一条连接)
	 */
	constructor(socket) {
		/**TCP 服务端主机 */
		this.serverHost = config.tcp.server.host;
		/**TCP 服务端端口 */
		this.serverPort = config.tcp.server.port;

		/**Socket对象(用于管理 Socket 服务端与 Socket 客户端的一条连接) */
		this.socket = socket;
		/**TCP 客户端 */
		this.client = new net.Socket();

		/**监听异常事件 */
		this.client.on("error", (error) => {
			logger.trace(`${this.info()} => error: ${error}`);
		});

		// disconnection => end => close
		/**监听结束事件 */
		this.client.on("end", () => {
			logger.trace(`${this.info()} => end.`);
		});

		/**监听关闭事件 */
		this.client.on("close", () => {
			logger.trace(`${this.info()} => close.`);

			this.state = 0;
		});

		/**监听数据事件 */
		this.client.on("data", this.onData);

		this.exBuffer = new ExBuffer().uint32Head().littleEndian();

		/**监听Buffer数据处理 */
		this.exBuffer.on("data", this.onBufferData);
	}

	/**
	 * 连接到 TCP 服务器
	 * @param {*} data 需要发送给服务器的数据 (可选)
	 */
	connect(data = "") {
		if (this.state != 1) {
			this.client.connect(this.serverPort, this.serverHost, () => {
				logger.info(`${this.info()} => connection.`);

				this.state = 1;

				if (data) this.write(data);
			});
		} else {
			logger.warn(`${this.info()} => connected.`);
		}
	}

	/**
	 * 断开与 TCP 服务器的连接
	 */
	disconnect() {
		logger.info(`${this.info()} => disconnection.`);

		this.cleanHealthInternal();

		this.client.end();
	}

	/**
	 * 获取 Socket 客户端和 TCP 服务端的信息
	 * @returns {string} 包含 Socket 客户端和 TCP 服务端信息的字符串
	 */
	info() {
		const { handshake } = this.socket;
		return `socket[${this.socket.id}:${handshake.query.key}] with tcp[${this.serverHost}:${this.serverPort}]`;
	}

	/**
	 * 获取 TCP 客户端对象
	 * @returns {Object} TCP 客户端对象
	 */
	getClient() {
		return this.client;
	}

	/**
	 * 创建健康轮询
	 * @param {*} internalId 健康轮询 ID
	 */
	createHealthInternal(internalId) {
		this.cleanHealthInternal();

		cache.setInternal(this.socket.id, internalId);

		logger.info(`${this.info()} => create health internal.`);
	}

	/**
	 * 清除健康轮询
	 */
	cleanHealthInternal() {
		clearInterval(cache.getInternal(this.socket.id));

		cache.removeInternal(this.socket.id);

		logger.info(`${this.info()} => clean health internal.`);
	}

	/**
	 * 订阅事件
	 * @param {*} eventName 事件名称
	 * @param {*} callback 回调函数
	 */
	on(eventName, callback) {
		logger.trace(`${this.info()} => on: ${eventName}`);

		// 订阅事件,会在onData中触发
		this.client.on(eventName, callback);
	}

	/**
	 * 一次性订阅事件
	 * @param {*} eventName 事件名称
	 * @param {*} callback 回调函数
	 */
	once(eventName, callback) {
		logger.trace(`${this.info()} => once: ${eventName}`);

		// 一次性订阅事件，会在 onData 中触发
		this.client.once(eventName, callback);
	}

	/**
	 * 写入数据（当前客户端向 TCP 服务端写入数据）
	 * @param {*} data 要写入的数据
	 */
	write(data) {
		logger.trace(`${this.info()} => write: ${data}`);

		// 判断是否已连接
		if (this.state) {
			this.client.write(data + "\r\n");
		} else {
			logger.debug(`${this.info()} => not connected: ${data}`);

			this.cleanHealthInternal();
		}
	}

	/**
	 * 数据事件处理（TCP 服务端发送数据监听）
	 * @param {*} data 接收到的数据
	 */
	onData = (data) => {
		logger.debug(`${this.info()} => data: ${data}`);

		this.exBuffer.put(data);
	};

	/**
	 * 监听Buffer数据进行处理
	 * @param {*} buffer 接收到的缓冲区数据
	 */
	onBufferData = (buffer) => {
		logger.debug(`${this.info()} => onBufferData: ${buffer}`);

		// 计算数据字节长度
		const dataByteLen = buffer.length - 20;

		// 创建ByteBuffer对象，并设置为小端序
		const responseBuffer = new ByteBuffer(buffer).littleEndian();

		// 解析缓冲区数据为一个数组
		const responseArray = responseBuffer
			.int32() // 读取32位整数
			.byte() // 读取一个字节
			.byte() // 读取一个字节
			.short() // 读取16位短整数
			.short() // 读取16位短整数
			.short() // 读取16位短整数
			.int32() // 读取32位整数
			.int32() // 读取32位整数
			.byteArray(null, dataByteLen) // 读取指定长度的字节数组
			.unpack(); // 解包

		// 提取tokenId、commandId和tenantId
		let tokenId = responseArray[5];
		let commandId = responseArray[6];
		let tenantId = responseArray[7];

		let tcpEventName = "";

		// 根据tokenId判断是否连接不上CCU服务器
		if (tokenId == 7) {
			this.socket.emit("excError", "连接不上CCU服务器,请联系管理员");
		} else {
			tcpEventName = tokenId + "_" + commandId + "_" + tenantId;
		}

		// 从缓存中移除消息
		cache.removeMessage(commandId + "_" + tenantId);

		// 触发事件：通过on和once进行订阅
		this.client.emit(tcpEventName, responseArray[8], tenantId);
	};

	/**
	 * 封装数据(当前客户端向TCP服务端发送数据前封装基础数据)
	 * @param {*} tokenId tcp消息令牌
	 * @param {*} commandId tcp消息时间戳
	 * @returns {ByteBuffer} 封装好基础数据的ByteBuffer对象
	 */
	encode(tokenId, commandId) {
		logger.trace(`${this.info()} => encode: ${tokenId},${commandId}`);

		// 创建ByteBuffer对象，并设置为小端序
		var buffer = new ByteBuffer().littleEndian();

		// 向buffer中写入数据
		buffer
			.byte(1) // 写入一个字节
			.byte(0) // 写入一个字节
			.short(0) // 写入一个16位短整数
			.short(-1) // 写入一个16位短整数
			.short(tokenId) // 写入一个16位短整数
			.int32(commandId); // 写入一个32位整数

		// 返回封装好基础数据的ByteBuffer对象
		return buffer;
	}
}

module.exports = TCPClient;
