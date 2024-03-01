var express = require("express");
var router = express.Router();

var base = require("./base");
var logger = require("./common/logger").category("framework", "[server-api.js] >> ");

/**所有路由 */
router.all("/*", function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild");
	res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
	next();
});

/**测试路由 */
router.get("/products/list", function (req, res, next) {
	base.response(req, res, next, {
		time: Math.floor(Date.now() / 1000),
		code: 0x01,
		success: true,
		message: "操作成功!",
		data: [
			{ name: "Product A", price: 10 },
			{ name: "Product B", price: 20 },
		],
		status: 200,
	});
});

// router.use("/", require("./route/api/common"));
// router.use("/uses", require("./route/api/user"));

module.exports = router;
