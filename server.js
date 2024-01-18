#!/usr/bin/env node

/**用于实时加载ES6 语法 */
// require("@babel/register");

/**模块依赖信息 */
const path = require("path");
const http = require("http");
const morgan = require("morgan");
const express = require("express");
const { Server } = require("socket.io");
const session = require("express-session"); // 替代cookie-parser和cookie-session

/**程序配置载体 */
const config = require("./config/server");
/**公共模块 */
const base = require("./server/base");
/**log4js日志系统定义 */
const log4js = require("./config/log4js");
const logger = require("./server/common/logger");
/**缓存对象 */
const cache = require("./server/common/cache");

/**Socket服务端对象 */
const SocketServer = require("./server/socket-server");

/**程序端口(Express与WebSocket统一端口) */
const port = base.normalize_port(process.env.PORT || config.port);

/**主程序 */
const app = express();

/**全局日志挂载 */
logger.configure(log4js);
app.use(morgan("combined"));
app.use(logger.useLog("access"));

/**会话挂载[maxAge:80000ms,即80s后session和相应的cookie失效过期] */
app.use(
	session({
		resave: true,
		name: "zhongjyuan.web",
		secret: "zhongjyuan.secret",
		cookie: { maxAge: 800000 },
		saveUninitialized: true,
	})
);

cache.set("stats", {
	visits: 0, // 总访问量
	visitors: 0, // 总访客数
	onlineUsers: 0, // 在线人数
	startTime: new Date(),
});

/**全局处理挂载[request先到HttpServer再到Express] */
app.use(base.express_visit);
app.use(base.express_online);
app.use(base.express_error);
app.use(base.express_request);

/**全局资源挂载 */
app.use("/api", require("./server/server-api"));
app.use("/view", require("./server/server-route"));
if (process.env.NODE_ENV === "production") {
	// 如果环境变量为 production，则将静态文件映射到当前目录
	app.use("/", express.static(path.join(__dirname, "./")));
} else {
	// 否则将静态文件映射到 dist 目录（开发环境）
	app.use("/", express.static(path.join(__dirname, "./dist")));
}

/**HttpServer */
const server = http.createServer(app);
server.on("error", base.http_error); // 当服务器发生错误时回调
server.on("request", base.http_request); // 当有新的请求到达时回调

/**WebSocket Server(Express和webSocket服务器代码之间共享一个服务器示例,以达到同一端口) */
const socketServer = new SocketServer(new Server(server, config.socket));
cache.setServer(socketServer);

/**HttpServer 监听 */
server.listen(port, () => {
	logger.category("framework").info(`server is running on port ${port}`);
});
