const fs = require("fs"); // 导入文件系统模块
const path = require("path");
const https = require("https"); // 导入 HTTP 模块
const { domainToASCII } = require("url");

const listURL = "https://publicsuffix.org/list/public_suffix_list.dat"; // 要下载的 URL

const filePath = path.join(__dirname, "/suffixes.json"); // 文件保存路径

// 将数据保存到 JSON 文件
function saveTopSites(path, data) {
	fs.writeFileSync(
		path,
		JSON.stringify(
			data.sort().sort((a, b) => a.length - b.length),
			null,
			2
		) + "\n"
	);
}

// 发起 HTTPS 请求获取公共后缀列表数据
const request = https
	.get(listURL, function (result) {
		var data = "";

		// 监听数据收集事件
		result.on("data", (d) => {
			data += d;
		});

		// 数据接收完毕时触发该事件
		result.on("end", () => {
			var suffixes = [];

			// 解析数据并保存至数组
			data.split("\n").forEach((line) => {
				// 跳过空行、注释行以及超过两个点号的行
				if (line.length === 0 || line.startsWith("//") || line.startsWith("!") || line.split(".").length > 2) {
					return;
				}

				// 去除通配符前缀"*."
				if (line.startsWith("*.")) {
					line = line.slice(2);
				}

				// 将域名转换为 ASCII 编码格式
				line = domainToASCII(line);
				suffixes.push(`.${line}`);
			});

			saveTopSites(filePath, suffixes); // 保存数据到文件
		});
	})
	.on("error", (e) => {});

request.shouldKeepAlive = false; // 关闭 keep-alive
