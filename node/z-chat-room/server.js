// 引入所需的模块
const express = require("express"); // 引入 Express 框架
const path = require("path"); // 引入 path 模块
const cors = require("cors"); // 引入 CORS 模块
const serveStatic = require("serve-static"); // 引入 serve-static 模块

// 引入自定义模块
const roomRouter = require("./router/room"); // 引入 room 路由模块
const uploadRouter = require("./router/upload"); // 引入 upload 路由模块
const { md2html } = require("./helper/utils"); // 引入自定义工具函数

const app = express(); // 创建 Express 应用实例

const server = require("http").createServer(app); // 创建基于 Express 的 HTTP 服务器

let io = require("socket.io")(server); // 使用 Socket.IO 模块创建 WebSocket 服务器，并将其附加到 HTTP 服务器上

app.io = io; // 将 Socket.IO 实例挂载到 Express 应用上

// 使用 CORS 中间件处理跨域请求
app.use(cors());

// 设置视图模板引擎为 ejs
app.set("view engine", "ejs"); // 设置视图模板引擎为 ejs
app.set("views", path.join(__dirname, "views")); // 设置视图文件夹路径
app.engine("ejs", require("ejs").__express); // <-- this does the trick

// 设置静态文件目录和缓存时间
app.use(serveStatic(path.join(__dirname, "static"), { maxAge: "600000" }));

app.use("/upload", uploadRouter); // 挂载上传文件相关的路由
app.use("/", roomRouter); // 挂载聊天室相关的路由

// 处理未匹配到路由的情况，返回 404 错误
app.use(function (req, res) {
	res.status(404); // 设置状态码为 404
	res.send({ error: "Not found" }); // 发送错误信息
});

// 创建一个存储聊天室信息的 Map 对象
let rooms = new Map();

// 创建一个存储用户ID与聊天室ID映射关系的 Map 对象
let userID2roomID = new Map();

/**
 * 获取聊天室对象
 * @param {string} roomID - 聊天室ID
 * @returns {object} - 聊天室对象
 */
function getRoom(roomID) {
	// 从 rooms Map 中获取对应的聊天室对象
	let room = rooms.get(roomID);

	// 如果聊天室对象不存在，则创建新的聊天室对象并添加到 rooms Map 中
	if (!room) {
		room = {
			users: new Map(), // 存储用户信息的 Map 对象
			userNameSet: new Set(), // 存储用户名的 Set 对象
		};
		rooms.set(roomID, room);
	}

	// 返回聊天室对象
	return room;
}

io.sockets.on("connection", function (socket) {
	// 监听 "disconnect" 事件，当用户断开连接时触发
	socket.on("disconnect", () => {
		// 获取断开连接用户的聊天室ID
		let roomID = userID2roomID.get(socket.id);

		if (roomID) {
			// 如果用户有对应的聊天室ID，则获取对应的聊天室对象
			let room = getRoom(roomID);

			// 检查该用户是否存在于聊天室中
			if (room.users.has(socket.id)) {
				// 从 userID2roomID Map 中删除断开连接用户的映射关系
				userID2roomID.delete(socket.id);

				// 获取断开连接用户的用户名
				let userName = room.users.get(socket.id).userName;

				// 从聊天室的用户名集合中删除该用户名
				room.userNameSet.delete(userName);

				// 从聊天室的用户 Map 对象中删除该用户
				room.users.delete(socket.id);

				// 如果聊天室中没有用户了，则删除该聊天室
				if (room.users.size === 0) {
					rooms.delete(roomID);
				}

				// 准备发送的系统消息
				let data = {
					content: `${userName} left`,
					sender: "system",
					type: "TEXT",
				};

				// 向聊天室内所有用户发送 "message" 事件
				io.to(roomID).emit("message", data);
			}
		}
	});

	// 监听 "register" 事件，当用户注册时触发
	socket.on("register", function (userName, roomID = "/") {
		// 去除用户名两端的空格
		userName = userName.trim();

		// 获取对应的聊天室对象
		let room = getRoom(roomID);

		// 检查是否存在重复的用户名或用户名为 "system"
		if (room.userNameSet.has(userName) || userName === "system") {
			// 如果存在重复的用户名或 "system" 用户名，则发送 "conflict userName" 事件
			socket.emit("conflict userName");
		} else {
			// 如果用户名没有冲突，则将用户名添加到聊天室的用户名集合中
			room.userNameSet.add(userName);

			// 检查是否为第一个加入聊天室的用户
			let isFirstPerson = room.users.size === 0;

			// 将用户信息添加到聊天室的用户 Map 对象中
			room.users.set(socket.id, {
				userName,
				isAdmin: isFirstPerson, // 第一个加入的用户被设置为管理员
			});

			// 将用户ID与聊天室ID的映射关系添加到 userID2roomID Map 对象中
			userID2roomID.set(socket.id, roomID);

			// 用户加入聊天室
			socket.join(roomID);

			// 向客户端发送 "register success" 事件
			socket.emit("register success");

			// 准备发送的系统消息
			let data = {
				content: `${userName} join the chat`,
				sender: "system",
				type: "TEXT",
			};

			// 向聊天室内所有用户发送 "message" 事件
			io.to(roomID).emit("message", data);
		}
	});

	// 监听 "message" 事件，当用户发送消息时触发
	socket.on("message", function (data, roomID = "/") {
		// 获取对应的聊天室对象
		let room = getRoom(roomID);

		// 检查用户是否存在于聊天室中
		if (room.users.has(socket.id)) {
			// 检查数据是否存在
			if (!data) return;
			if (data.content === undefined) return;
			if (data.type === undefined) data.type = "TEXT";

			// 获取用户信息
			let user = room.users.get(socket.id);

			let kickMessage = undefined;
			// 如果用户是管理员且消息以 "kick" 开头，则执行踢人操作
			if (user.isAdmin) {
				if (data.content.startsWith("kick")) {
					let kickedUser = data.content.substring(4);
					kickedUser = kickedUser.trim();

					// 遍历聊天室中的用户
					for (let [id, user] of room.users.entries()) {
						if (user.userName === kickedUser) {
							// 从用户列表和用户名集合中删除被踢出的用户
							room.users.delete(id);
							room.userNameSet.delete(user.userName);

							// 准备发送的系统消息
							kickMessage = {
								content: `${user.userName} kicked out of chat room`,
								sender: "system",
								type: "TEXT",
							};
							break;
						}
					}
				}
			}

			// 如果用户没有用户名，则将用户名设置为 "Anonymous"
			if (user.userName === undefined || user.userName === "") {
				user.userName = "Anonymous";
			}

			// 设置消息发送者为用户的用户名
			data.sender = user.userName;

			// 如果消息类型是 "TEXT"，则将内容转换为 HTML 格式
			if (data.type === "TEXT") {
				data.content = md2html(data.content);
			}

			// 向聊天室内所有用户发送 "message" 事件
			io.to(roomID).emit("message", data);

			// 如果有踢人消息，则也向聊天室内所有用户发送踢人消息
			if (kickMessage) io.to(roomID).emit("message", kickMessage);
		} else {
			// 如果用户不存在于聊天室中，则发送登录已过期的系统消息给该用户
			let data = {
				content: `login has expired, please refresh the page or click change userName`,
				sender: "system",
				type: "TEXT",
			};
			socket.emit("message", data);
		}
	});
});

server.listen(process.env.PORT || 3000);
