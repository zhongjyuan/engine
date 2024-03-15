var cache = require("../../../tools/cache");
var log4js = require("../../../tools/log4js/logger");
var subscribe = require("../../../tools/socket/subscribe");
var byteBuffer = require("../../../tools/buffer/byteBuffer");

var logger = log4js.logger("login-service");

var messageConfig = require("../../message/auth");
var messageProtocol = require("../../message/protocol");

/**
 * 登录服务
 * @param {*} socket 
 * @param {*} socketClient 
 */
var LoginService = function (socket, socketClient) {
	var authMessage = messageConfig.authMessage;

	var type = authMessage.Login.type;
	var tokenId = authMessage.Login.tokenId;
	var commandId = Math.floor(process.uptime() * 1000);

	var messageName = tokenId + "_" + commandId + "_" + 0;
	socketClient.generatorEvent(messageName, this.decode);

	var userName = null;

	/**
	 * 登录
	 * @param {*} account 账号
	 * @param {*} password 密码
	 * @param {*} address 地址
	 */
	this.login = function (account, password, address) {
		userName = account;

		var accountBuffer = Buffer.from(account).toByteArray();
		var passwordBuffer = Buffer.from(password).toByteArray();
		var addressBuffer = Buffer.from(address).toByteArray();

		var accountLength = Buffer.byteLength(account);
		var passwordLength = Buffer.byteLength(password);
		var addressLength = Buffer.byteLength(address);

		var buffer = messageProtocol.encode(tokenId, commandId);
		var requestBuffer = buffer
			.byte(type)
			.byte(1)
			.int32(accountLength)
			.byteArray(accountBuffer, accountLength)
			.int32(passwordLength)
			.byteArray(passwordBuffer, passwordLength)
			.int32(addressLength)
			.byteArray(addressBuffer, addressLength)
			.pack(true);

		logger.info("login...");
		socketClient.startClient(requestBuffer);
	};

	/**
	 * 解析数据
	 * @param {*} data 响应数据
	 * @param {*} agentId 代理主键
	 */
	this.decode = function (data, agentId) {
		var responseBuffer = Buffer.from(data);

		var responseBufferLength = responseBuffer.length - 5;
		var responseByteBuffer = new byteBuffer(responseBuffer).littleEndian();
		var responseArr = responseByteBuffer
			.byte()
			.int32()
			.byteArray(null, responseBufferLength)
			.unpack();

		var success = responseArr[0];
		if (success) {
			var dataLength = responseArr[1];
			var dataBuffer = responseArr[2];
			var dataByteBuffer = new byteBuffer(dataBuffer).littleEndian();
			var dataByteBufferLength = dataBuffer.length - dataLength - 4;
			var dataArr = dataByteBuffer
				.byteArray(null, dataByteBufferLength)
				.int32()
				.byteArray(null, len)
				.unpack();

			var sessionId = dataArr[0].toString();
			var user = dataArr[2].toString();
			logger.info(
				">> login success, sessionId:" + sessionId + ", user:" + user
			);

			var userInfo = JSON.parse(user);
			var account = initAccount(userInfo);

			//保存用户socket信息 用于提用户下线
			cache.putSocket("webSocket_" + userInfo.user_name, socket);
			cache.putSocket("socketClient_" + userInfo.user_name, socket);
			socket.emit(subscribe.login.success, JSON.stringify(account));
		} else {
			clearInterval(cache.getSocket(socket.id));

			var responseBuffer = Buffer.from(data);
			var responseByteBuffer = new byteBuffer(responseBuffer).littleEndian();
			var response = responseByteBuffer
				.byte()
				.setPrefixString()
				.byte()
				.unpack();

			/**密码错误 */
			if (response[2] == 1) {
				socket.emit("login_fail", "userName or password is wrong");
			} else if (response[2] == 5) {
				/**初始密码,需要修改密码 */
				socket.emit("needUpdatePassword", userName);
			} else {
				socket.emit("login_fail", response[1]);
			}

			logger.error(
				">> login error, code:" + response[1] + ", message:" + response[2]
			);
		}
	};

	/**
	 * 初始化账号信息
	 * @param {*} userInfo 用户详情
	 * @returns
	 */
	function initAccount(userInfo) {
		var account = {};

		account.isLogin = 1;
		account.userId = userInfo.user_id;
		account.userName = userInfo.user_name;
		account.lastModifyPassword = userInfo.pwd_lastmodify_date;

		var accountConfig = {};
		var configArr = userInfo.configs;
		for (var config in configArr) {
			accountConfig[configArr[config].config_item_name] = [];
			accountConfig[configArr[config].config_item_name].push(
				configArr[config].config_item_value
			);
		}
		account.configs = accountConfig;

		return account;
	}
};

module.exports = exports = LoginService;