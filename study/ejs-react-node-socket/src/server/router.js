var express = require("express");

/**服务端路由容器(api/) */
var router = express.Router();

/**所有路由 */
router.all("/*", function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
	);
	res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
	next();
});

import indexRouter from "./routes/index";
import userRouter from "./routes/user";

router.use("/", indexRouter);
router.use("/uses", userRouter);

module.exports = router;