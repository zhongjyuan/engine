var cache = require("./common/cache");
var logger = require("./common/logger").category("framework");

/**
 * 格式化端口
 * @param {*} val 输入的端口号字符串
 * @returns 转换后的端口号，如果无法转换则返回原字符串或 false
 */
module.exports.normalize_port = function (val) {
	var port = parseInt(val, 10); // 将字符串转换为整数

	// 如果转换失败
	if (isNaN(port)) {
		return val; // 返回原字符串
	}

	if (port >= 0) {
		// 如果端口号合法
		return port; // 返回转换后的端口号
	}

	return false; // 端口号不合法，返回 false
};

/**
 * HTTP Server 异常处理
 * @param {*} error 抛出的异常对象
 * @param {*} req 请求对象
 * @param {*} res 响应对象
 */
module.exports.http_error = function (error, req, res) {
	// 如果异常不是由监听函数引起
	if (error.syscall !== "listen") {
		throw error; // 直接抛出异常
	}

	switch (
		error.code // 根据异常的错误码进行处理
	) {
		case "EACCES":
			console.error("requires elevated privileges"); // 输出错误信息
			process.exit(1); // 退出进程
			break;
		case "EADDRINUSE":
			console.error(" is already in use"); // 输出错误信息
			process.exit(1); // 退出进程
			break;
		default:
			throw error; // 抛出其他异常
	}
};

/**
 * HTTP Server 请求处理
 * @param {*} req 请求对象
 * @param {*} res 响应对象
 */
module.exports.http_request = function (req, res) {
	// logger.trace("http request => url: " + req.url);
};

/**
 * Express 异常处理
 * @param {*} err 抛出的异常对象
 * @param {*} req 请求对象
 * @param {*} res 响应对象
 * @param {*} next 下一个中间件函数
 */
module.exports.express_error = function (err, req, res, next) {
	logger.trace("express error => url: " + req.url + ";session: " + JSON.stringify(req.session));

	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");

	next();
};

/**
 * Express 请求处理中间件
 *
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 调用下一个中间件函数
 */
module.exports.express_request = function (req, res, next) {
	logger.trace("express request => url: " + req.url + ";session: " + JSON.stringify(req.session));

	// 调用下一个中间件函数，确保请求继续处理
	next();
};

/**
 * 记录访问量与访客量
 * @param {*} req 请求对象
 * @param {*} res 响应对象
 * @param {*} next 下一个中间件函数
 * @returns
 */
module.exports.express_visit = function (req, res, next) {
	// 统计总访问量和总访客数

	// 使用正则表达式排除资源类路由
	const resourceRegExp = /\.(ico|css|js|png|jpg|jpeg|gif|svg|mp3|mp4|webm|ogg|pdf|doc|docx|xls|xlsx)$/i;
	if (resourceRegExp.test(req.url)) {
		next();
		return;
	}

	// 从缓存中获取统计信息
	const stats = cache.get("stats");

	// 更新访问量和访客数
	stats.visits++;
	if (!req.session.visited) {
		req.session.visited = true;
		stats.visitors++;
	}

	// 更新当前用户在线时长
	if (req.session.startTime) {
		const currentTime = new Date();
		const sessionTime = Math.floor((new Date(currentTime) - new Date(req.session.startTime)) / 1000); // 秒数
		stats.onlineUsersTime = sessionTime;
		req.session.onlineTime = sessionTime;
	} else {
		req.session.startTime = new Date();
	}

	// 将更新后的统计信息重新存入缓存
	cache.set("stats", stats);

	next();
};

/**
 * 记录在线人数与在线时长
 * @param {*} req 请求对象
 * @param {*} res 响应对象
 * @param {*} next 下一个中间件函数
 * @returns
 */
module.exports.express_online = function (req, res, next) {
	// 统计总访问量和总访客数

	// 使用正则表达式排除资源类路由
	const resourceRegExp = /\.(ico|css|js|png|jpg|jpeg|gif|svg|mp3|mp4|webm|ogg|pdf|doc|docx|xls|xlsx)$/i;
	if (resourceRegExp.test(req.url)) {
		next();
		return;
	}

	// 从缓存中获取统计信息
	const stats = cache.get("stats");

	// 如果当前用户为已访问用户
	if (req.session.visited) {
		stats.onlineUsers++;
	}

	// 监听响应对象的 finish 事件，在响应返回之后执行回调函数
	res.on("finish", () => {
		if (req.session.visited) {
			stats.onlineUsers--;
		}
	});

	// 将更新后的统计信息重新存入缓存
	cache.set("stats", stats);

	next();
};

/**
 * 根据请求参数决定响应的格式
 * @param {*} req 请求对象
 * @param {*} res 响应对象
 * @param {*} next 下一个中间件函数
 * @param {*} data 响应数据
 */
module.exports.response = function (req, res, next, data) {
	if (req.query.html === "true" || req.query.html === "1") {
		// 如果 isHtml 为 true，则使用 HTML 格式输出
		const htmlStr = `
		  <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
			<div style="background-color: #f0f0f0; border-radius: 10px; padding: 20px;">
			  <pre>${JSON.stringify(data, null, 2)}</pre>
			</div>
		  </div>
		`;

		res.status(data.status).type("html").send(htmlStr);
	} else {
		res.status(data.status).type("json").send(JSON.stringify(data, null, 2));
	}
};
