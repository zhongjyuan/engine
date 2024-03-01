const express = require("express");

/**账号路由容器(api/account/) */
var router = express.Router();

const logger = require("../../common/logger").category("server", "api >>");

/**健康 */
router.get("/health", function(req, res, next) {
	logger.trace(`health => query: ${req.query}.`);
});

module.exports = router;
