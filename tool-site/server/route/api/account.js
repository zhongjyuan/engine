const express = require("express");

/**账号路由容器(api/account/) */
var router = express.Router();

const logger = require("../../common/logger").category("server", "api >>");

/**注册 */
router.get("/signup", function(req, res, next) {
	logger.trace(`signup => query: ${req.query}.`);
});

/**登录 */
router.get("/login", function(req, res, next) {
	logger.trace(`login => query: ${req.query}.`);
});

/**登录 */
router.get("/login", function(req, res, next) {
	logger.trace(`login => query: ${req.query}.`);
});

/**登出 */
router.get("/logout", function(req, res, next) {
	logger.trace(`logout => query: ${req.query}.`);
});
