var express = require("express");

/**用户路由容器(api/users/) */
var router = express.Router();

var cache = require("../../tools/cache");
var log4js = require("../../tools/log4js/logger");
var client = require("../../tools/socket/client");

const path = "[server/routes/user.js] >> ";
var logger = log4js.logger("framework");

var UserService = require("../service/user/userService");

/**列表路由 */
router.get("/list", function (req, res, next) {
	logger.trace(path + "request path /api/users/list.");

	var socketClient = new client();
	cache.putSocket(req.session.id, socketClient);

	var userService = new UserService(req, res, socketClient);
	userService.list();
});

module.exports = router;
