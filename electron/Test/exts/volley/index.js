const fs = require("fs"); // 引入文件系统模块
const https = require("https"); // 引入HTTPS模块

const filePath = __dirname + "/volley.txt"; // 文件路径

const easylistOptions = {
	hostname: "easylist.to", // 主机名
	port: 443, // 端口号
	path: "/easylist/easylist.txt", // 路径
	method: "GET", // 请求方法
};

const easyprivacyOptions = {
	hostname: "easylist.to", // 主机名
	port: 443, // 端口号
	path: "/easylist/easyprivacy.txt", // 路径
	method: "GET", // 请求方法
};

// 发起 HTTPS 请求
function makeRequest(options, callback) {
	var request = https // 创建 HTTPS 请求对象
		.request(options, function (response) {
			// 请求回调函数
			response.setEncoding("utf8"); // 设置响应编码为 UTF-8

			var data = "";
			response.on("data", function (chunk) {
				// 监听数据接收事件
				data += chunk;
			});

			response.on("end", function () {
				// 监听数据接收完成事件
				callback(data); // 调用回调函数处理数据
			});
		})
		.on("error", (e) => {}); // 错误处理函数

	request.shouldKeepAlive = false; // 关闭 keep-alive
	request.end(); // 发送请求
}

// 获取 EasyList 和 EasyPrivacy 数据
makeRequest(easylistOptions, function (easylist) {
	// EasyList 请求回调函数
	makeRequest(easyprivacyOptions, function (easyprivacy) {
		// EasyPrivacy 请求回调函数
		var data = easylist + easyprivacy; // 将 EasyList 和 EasyPrivacy 数据合并

		data = data
			.split("\n") // 按行分割数据
			.filter(function (line) {
				// 过滤无效行
				return (
					!line.includes("##") && // 包含 "##" 的行为 element hiding rules
					!line.includes("#@") && // 包含 "#@" 的行为 element hiding exceptions
					!line.trim().startsWith("!") // 以 "!" 开头的行为注释
				);
			})
			.join("\n"); // 重新连接有效行

		fs.writeFileSync(filePath, data); // 将数据写入文件
	});
});
