// 引入Express框架
const express = require("express");
// 创建一个路由实例
const router = express.Router();
// 引入multer模块，用于文件上传
const multer = require("multer");
// 引入uuid模块，用于生成唯一标识符
const { v4: uuid } = require("uuid");

// 上传文件存储路径
const upload_path = "./static/upload";

// 创建Multer实例，配置上传目录和文件名
const upload = multer({
	storage: multer.diskStorage({
		// 指定文件存储目录
		destination: function (req, file, callback) {
			callback(null, upload_path);
		},
		// 自定义文件名
		filename: function (req, file, callback) {
			// 获取文件后缀名
			let extension = file.originalname.split(".").pop();
			callback(null, file.originalname);
		},
	}),
});

// 处理POST请求，上传文件
router.post("/", upload.single("file"), (req, res, next) => {
	const { file } = req;

	// 返回上传文件的路径
	res.json({
		path: "/upload/" + file.filename,
	});
});

// 导出路由模块
module.exports = router;
