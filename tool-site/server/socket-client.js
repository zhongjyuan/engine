const io = require("socket.io-client");
const config = require("../config/server");
const logger = require("./common/logger").category("socket", "client >>");

/**
 * Socket 客户端对象
 * @author zhongjyuan
 * @date   2024年1月18日15:01:45
 * @email  zhongjyuan@outlook.com
 */
class SocketClient {
	/**socket.io socket对象 */
	socket = null;

	/**
	 * 创建一个 Socket 客户端对象
	 */
	constructor() {
		// 使用 socket.io-client 创建一个 socket 对象，并连接指定的 URL 和配置
		this.socket = io(config.socket.url, config.socket);

		// 监听连接成功事件
		this.socket.on("connect", this.onConnect);

		// 监听断开连接事件
		this.socket.on("disconnect", this.onDisConnect);
	}

	/**
	 * 连接成功回调函数
	 */
	onConnect() {
		logger.info(`connection to: ${config.socket.url}`);
	}

	/**
	 * 断开连接回调函数
	 */
	onDisConnect() {
		logger.trace(`disconnect`);
	}
}

module.exports = exports = SocketClient;
