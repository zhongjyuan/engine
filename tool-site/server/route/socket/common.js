const socketEvent = require("../../socket-event");

const CommonController = require("../../controller/common");

const logger = require("../../common/logger").category("socket", "common-events >>");

/**
 * 公共事件订阅对象
 * @author zhongjyuan
 * @date   2024年1月18日18:23:14
 * @email  zhongjyuan@outlook.com
 */
class CommonEvent {
	/**
	 * 公共处理订阅对象
	 * @param {*} socket Socket对象(用于管理 Socket 服务端与 Socket 客户端的一条连接)
	 * @param {*} tcpClient tcp客户端对象(与 TCP 服务端交互)
	 */
	constructor(socket, tcpClient) {
		logger.trace(`${tcpClient.info()} => subscribe.`);

		/**健康事件监听处理 */
		socket.on(socketEvent.health.request, function (data) {
			logger.trace(`${tcpClient.info()} => ${socketEvent.signup.request}: ${data}`);

			new CommonController(socket, tcpClient).health();
		});
	}
}

module.exports = CommonEvent;
