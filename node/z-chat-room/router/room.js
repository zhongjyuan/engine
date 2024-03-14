// 引入Express框架
const express = require("express");
// 创建一个路由实例
const router = express.Router();

// 处理所有GET请求，匹配所有路径
router.get("*", (req, res, next) => {
	// 渲染名为"chat"的视图模板
	res.render("index");
});

// 导出路由模块
module.exports = router;
