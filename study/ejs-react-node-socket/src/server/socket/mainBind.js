var cache = require("../../tools/cache");
const log4js = require("../../tools/log4js/logger");
var subscribe = require("../../tools/socket/subscribe");
var config = require("../../../public/config/application");

const path = "[socket/mainBind.js] >> ";
const logger = log4js.logger("framework");

var HealthService = require("../service/healthService");
var LoginService = require("../service/auth/loginService");
var SignupService = require("../service/auth/signupService");
var LoginOutService = require("../service/auth/loginOutService");

/**
 * 认证模块绑定
 * @param {*} socket WebSocket
 * @param {*} socketClient Socket客户端
 */
exports.bind = function (socket, socketClient) {
	/**注册订阅 */
	socket.on(subscribe.signup.request, function (data) {
		logger.info(path + "handle: " + subscribe.signup.request);
	});

	/**登录订阅 */
	socket.on(subscribe.login.request, function (data) {
		logger.info(path + "handle: " + subscribe.login.request);

		var loginService = new LoginService(socket, socketClient);
		var param = JSON.parse(data);
		var username = param.username;
		var password = param.password;

		let ip = "127.0.0.1";
		const address = socket.client.conn.remoteAddress;
		//如果ip是ip6模式 需要去除::ffff:
		let regx =
			/((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/g;
		let addresses = regx.exec(address);
		if (addresses && addresses.length > 0) {
			ip = addresses[0];
		}

		loginService.login(username, password, ip);

		new HealthService(socketClient).health();

		if (config.loginUnique) {
			var userSocket = map.getSocket("webSocket_" + username);
			if (userSocket != null && userSocket != undefined) {
				userSocket.emit("loginUnique", "该账号在别处登录,请重新登录");
				userSocket.disconnect(true);
			}
			map.removeSocket("webSocket_" + username);
		}
	});

	/**登出订阅 */
	socket.on(subscribe.loginout.request, function (data) {
		logger.info(path + "handle: " + subscribe.loginout.request);

		var loginOutService = new LoginOutService(socketClient);
		loginOutService.loginOut();
	});
};
