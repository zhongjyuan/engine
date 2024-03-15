var express = require("express");

/**主程序路由容器(api/) */
var router = express.Router();

var cache = require("../../tools/cache");
var log4js = require("../../tools/log4js/logger");
var client = require("../../tools/socket/client");

const path = "[server/routes/index.js] >> ";
var logger = log4js.logger("framework");

var HealthService = require("../service/healthService");
var LoginService = require("../service/auth/loginService");
var SignupService = require("../service/auth/signupService");

/**注册路由 */
router.get("/signup", function (req, res, next) {
	logger.trace(path + "request path /api/signup.");

	var socketClient = new client();
	cache.putSocket(req.session.id, socketClient);

	var signupService = new SignupService(req, res, socketClient);
	signupService.signup(req.query.username, req.query.password);
});

/**登录路由 */
router.get("/login", function (req, res, next) {
	logger.trace(path + "request path /api/login.");

	var socketClient = new client();
	cache.putSocket(req.session.id, socketClient);

	var loginService = new LoginService(req, res, socketClient);
	loginService.login(req.query.username, req.query.password);

	//开启心跳检测
	new HealthService(socketClient).health();
});

/**登出路由 */
router.get("/logout", function (req, res, next) {
	logger.trace(path + "request path /api/logout.");

	req.session.username = null;
	res.json({
		status: true,
	});
});

module.exports = router;
