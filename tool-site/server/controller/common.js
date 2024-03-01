const socketEvent = require("../socket-event");

const CommonMessage = require("../message/common");
const CommonService = require("../service/common");

const logger = require("../common/logger").category("controller", "common >>");

/**
 * 公共控制器对象
 * @author zhongjyuan
 * @date   2024年1月18日18:31:00
 * @email  zhongjyuan@outlook.com
 */
class CommonController {
	/**
	 * 公共控制器对象
	 * @param {*} socket Socket对象(用于管理 Socket 服务端与 Socket 客户端的一条连接)
	 * @param {*} tcpClient tcp客户端对象(与 TCP 服务端交互)
	 */
	constructor(socket, tcpClient) {
		/**Socket对象(用于管理 Socket 服务端与 Socket 客户端的一条连接) */
		this.socket = socket;
		/**tcp客户端对象(与 TCP 服务端交互) */
		this.tcpClient = tcpClient;
	}

    /**
     * 健康检测[心跳包]
     */
	health() {
		try {
            logger.trace(`${this.tcpClient.info()} => health.`);

			new CommonService(this.socket, this.tcpClient).health(CommonMessage.health.tokenId, socketEvent.health.response);
		} catch (e) {
            logger.error(`${this.tcpClient.info()} => health: ${e}`);
		}
	}
}

module.exports = CommonController;
