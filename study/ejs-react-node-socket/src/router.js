var express = require("express");
var router = express.Router();

var viewRouter = require("./views/router");
var serverRouter = require("./server/router");

router.use("/api", serverRouter);
router.use("/", viewRouter);

module.exports = router;