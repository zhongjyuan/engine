const cache = require("../cache");
const client = require("./client");
const log4js = require("../log4js/logger");
const exBuffer = require("../buffer/exBuffer");
const byteBuffer = require("../buffer/byteBuffer");

const path = "[socket/server.js] >> ";
const logger = log4js.logger("framework");
const application = require("../../../public/config/application");

var subscribe = require("../../tools/socket/subscribe");
var main = require("../../ser../../server/socket/mainBind");

/**
 * 绑定
 * @param {*} io socket.io
 */
exports.bind = function (io) {
	/**WebSocket Server监听connection事件 */
	io.on("connection", function (socket) {
		var socketClient = new client();
		socketClient.initwScoket(socket);

		main.bind(socket, socketClient);

		/**Socket监听disconnect事件 */
		socket.on("disconnect", function () {
			logger.info(path + "socket client: " + socket.id + " disconnect.");
			clearInterval(cache.getSocket(socket.id)); //停止心跳包发送数据
			socketClient.disconnectClient();
		});

		logger.info(path + "socket client: " + socket.id + " connection.");
	});
};
