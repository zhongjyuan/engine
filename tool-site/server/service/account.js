const logger = require("../common/logger").category("service", "account >>");

/**
 * 账号处理订阅对象
 */
class AccountService {
	/**
	 * 账号处理订阅对象
	 * @param {*} socket socket.io socket对象
	 * @param {*} tcpClient tcp 客户端对象
	 */
	constructor(socket, tcpClient) {
		this.socket = socket;
		this.tcpClient = tcpClient;
		this.commandId = Math.floor(process.uptime() * 1000) + parseInt(Math.random() * 50 + 0);
	}

	/**
	 * 注册
	 * @param {*} messageTokenId 令牌
	 * @param {*} socketEventName Socket事件名称
	 * @param {*} data 数据
	 */
	signup(messageTokenId, socketEventName, data) {
		try {
			logger.trace(`${this.tcpClient.info()} => signup: ${data}`);

			var tcpEventName = messageTokenId + "_" + this.commandId + "_zhongjyuan";
			// tcpEventName = data;

			/**订阅TCP响应处理[TCP响应数据先到TCPClient中OnData先处理后再发出事件] */
			this.tcpClient.once(tcpEventName, (response) => {
				if (response === null) {
					response = "tcp server response data is null.";
				}
				this.socket.emit(socketEventName, response);
			});

			/**获取TCP客户端对象,将数据发送到TCP服务端 */
			this.tcpClient.write(this.requestDataHandle(data));
		} catch (e) {
			logger.error(`${this.tcpClient.info()} => signup: ${e}`);
		}
	}

	/**
	 * 登录
	 * @param {*} messageTokenId 令牌
	 * @param {*} socketEventName Socket事件名称
	 * @param {*} data 数据
	 */
	login(messageTokenId, socketEventName, data) {
		try {
			logger.trace(`${this.tcpClient.info()} => login: ${data}`);

			var tcpEventName = messageTokenId + "_" + this.commandId + "_zhongjyuan";
			// tcpEventName = data;

			/**订阅TCP响应处理[TCP响应数据先到TCPClient中OnData先处理后再发出事件] */
			this.tcpClient.once(tcpEventName, (response) => {
				if (response === null) {
					response = "tcp server response data is null.";
				}
				this.socket.emit(socketEventName, response);
			});

			/**获取TCP客户端对象,将数据发送到TCP服务端 */
			this.tcpClient.connect(this.requestDataHandle(data));
		} catch (e) {
			logger.error(`${this.tcpClient.info()} => login: ${e}`);
		}
	}

	/**
	 * 请求数据处理
	 * @param {*} data
	 */
	requestDataHandle(data) {
		return data;
	}
}

module.exports = AccountService;
