const SocketApi = require("../socket-event");
const AccountMessage = require("../message/account");

const AccountService = require("../service/account");

const logger = require("../common/logger").category("controller", "account >>");

/**
 * 账号控制器对象
 */
class AccountController {
	/**
	 * 账号控制器对象
	 * @param {*} socket socket.io socket对象
	 * @param {*} tcpClient tcp 客户端对象
	 */
	constructor(socket, tcpClient) {
		this.socket = socket;
		this.tcpClient = tcpClient;
	}

    /**
     * 注册
     * @param {*} data 
     */
	signup(data) {
		try {
            logger.trace(`${this.tcpClient.info()} => signup: ${data}`);

			new AccountService(this.socket, this.tcpClient).signup(AccountMessage.signup.tokenId, SocketApi.signup.response, data);
		} catch (e) {
            logger.error(`${this.tcpClient.info()} => signup: ${e}`);
		}
	}

	/**
	 * 登录
	 * @param {*} data 
	 */
	login(data) {
		try {
            logger.trace(`${this.tcpClient.info()} => login: ${data}`);

			new AccountService(this.socket, this.tcpClient).login(AccountMessage.login.tokenId, SocketApi.login.response, data);
		} catch (e) {
            logger.error(`${this.tcpClient.info()} => login: ${e}`);
		}
	}
}

module.exports = AccountController;
