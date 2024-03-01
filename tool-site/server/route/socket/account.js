const socketEvent = require("../../socket-event");

const AccountController = require("../../controller/account");

const logger = require("../../common/logger").category("socket", "account-events >>");

/**
 * 账号事件订阅对象
 * @author zhongjyuan
 * @date   2024年1月18日18:30:04
 * @email  zhongjyuan@outlook.com
 */
class AccountEvent {
	/**
	 * 账号处理订阅对象
	 * @param {*} socket Socket对象(用于管理 Socket 服务端与 Socket 客户端的一条连接)
	 * @param {*} tcpClient tcp客户端对象(与 TCP 服务端交互)
	 */
	constructor(socket, tcpClient) {
		logger.trace(`${tcpClient.info()} => subscribe.`);

		/**注册事件监听处理 */
		socket.on(socketEvent.signup.request, function (data) {
			logger.trace(`${tcpClient.info()} => ${socketEvent.signup.request}: ${data}`);

			new AccountController(socket, tcpClient).signup(data);
		});

		/**登录事件监听处理 */
		socket.on(socketEvent.login.request, function (data) {
			logger.trace(`${tcpClient.info()} => ${socketEvent.login.request}: ${data}`);

			new AccountController(socket, tcpClient).login(data);
		});
	}
}

module.exports = AccountEvent;
