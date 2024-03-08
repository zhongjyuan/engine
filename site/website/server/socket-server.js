const logger = require("./common/logger").category("socket", "server >>");
const cache = require("./common/cache");
const TCPClient = require("./tcp-client");
const SocketClient = require("./socket-client");

const CommonEvent = require("./route/socket/common");
const AccountEvent = require("./route/socket/account");

/**
 * Socket 服务端对象
 * @author zhongjyuan
 * @date   2024年1月18日15:02:23
 * @email  zhongjyuan@outlook.com
 */
class SocketServer {
	/**tcp 客户端对象 */
	tcpClients = {};

	/**
	 * Socket 服务端对象
	 * @param {*} io socket.io 中 Server对象
	 */
	constructor(io) {
		/**Socket.io 中 Server 对象 */
		this.server = io;

		/**Socket.io 监听连接事件 */
		this.server.on(
			"connection",
			/**
			 * 连接事件处理
			 * @param {*} socket Socket对象(用于管理 Socket 服务端与 Socket 客户端的一条连接)
			 */
			(socket) => {
				var { nsp, handshake } = socket;
				logger.info(`client ${socket.id}:${handshake.query.key} with ${handshake.headers.host}${nsp.name} => connection.`);

				/**Socket.io 连接后实例化 TCP 客户端[与服务器交互] */
				this.tcpClients[socket.id] = new TCPClient(socket);

				/**测试代码[正常是登录的时候才会进行TCP连接] */
				// this.tcpClients[socket.id].connect("Hi, this is tcp client!");

				/**Socket.io 中 Socket对象绑定全局事件 */
				this.socketDefaultEvent(socket);
				this.socketRequestEvent(socket);
				this.socketRoomEvent(socket);

				/**Socket.io 中 Socket对象绑定业务事件 */
				new CommonEvent(socket, this.tcpClients[socket.id]);
				new AccountEvent(socket, this.tcpClients[socket.id]);

				cache.setSocket(socket.id, socket);
			}
		);

		/**测试代码[nodejs充当一个socket.io客户端] */
		// new SocketClient();
	}

	/**
	 * Socket 请求事件绑定
	 * @param {*} socket Socket对象(用于管理 Socket 服务端与 Socket 客户端的一条连接)
	 */
	socketRequestEvent(socket) {
		const { nsp, handshake } = socket;

		/**[request]接收数据事件 */
		socket.on("request", (data) => {
			logger.trace(`client ${socket.id}:${handshake.query.key} with ${handshake.headers.host}${nsp.name} => data: ${data}.`);

			// var message = {
			// 	action: "room.join",
			// 	reaction: "response.message",
			// 	data: {
			// 		roomId: "940870777",
			// 	},
			// };

			try {
				data = JSON.parse(data);
				if (data.action && data.data) {
					this.server.emit(data.action, data.data);
				} else if (data.reaction && data.data) {
					socket.emit(data.reaction, `received: ${data.data}`);
				} else {
					socket.emit("response", `Invalid data format: ${JSON.stringify(data)}`);
				}
			} catch (error) {
				socket.emit("response", `Invalid JSON format: ${data}`);
			}
		});
	}

	/**
	 * Socket 房间事件绑定
	 * @param {*} socket Socket对象(用于管理 Socket 服务端与 Socket 客户端的一条连接)
	 */
	socketRoomEvent(socket) {
		const { nsp, handshake } = socket;

		/**[join]加入房间事件 */
		socket.on("room.join", (room) => {
			logger.trace(`client ${socket.id}:${handshake.query.key} with ${handshake.headers.host}${nsp.name} => room.join: ${room}.`);

			socket.join(room);
		});

		/**[leave]离开房间事件 */
		socket.on("room.leave", (room) => {
			logger.trace(`client ${socket.id}:${handshake.query.key} with ${handshake.headers.host}${nsp.name} => room.leave: ${room}.`);

			socket.leave(room);
		});
	}

	/**
	 * Socket 默认事件绑定
	 * @param {*} socket Socket对象(用于管理 Socket 服务端与 Socket 客户端的一条连接)
	 */
	socketDefaultEvent(socket) {
		const { nsp, handshake } = socket;

		/**[error]异常事件 */
		socket.on("error", (err) => {
			logger.error(`client ${socket.id}:${handshake.query.key} with ${handshake.headers.host}${nsp.name} => error: ${err}.`);
		});

		/**[timeout]超时事件 */
		socket.on("timeout", () => {
			logger.error(`client ${socket.id}:${handshake.query.key} with ${handshake.headers.host}${nsp.name} => timeout.`);

			socket.end(); // 关闭连接
		});

		/**[disconnect]断开连接事件 */
		socket.on("disconnect", (reason) => {
			logger.trace(`client ${socket.id}:${handshake.query.key} with ${handshake.headers.host}${nsp.name} => disconnected: ${reason}.`);

			this.tcpClients[socket.id].disconnect();

			cache.removeSocket(socket.id);
		});
	}
}

module.exports = SocketServer;
