const fs = require("fs"); // 导入文件系统模块
const https = require("https"); // 导入 HTTP 模块

const listURL = "https://tranco-list.eu/download/ZGPG/full"; // 要下载的 URL

const limitTopSites = 10000; // 网站排名限制
const filePath = __dirname + `/sites.json`; // 文件保存路径

// 将数据保存到 JSON 文件
function saveTopSites(path, data) {
	fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

// 发起 HTTPS 请求
let request = https
	.get(listURL, function (result) {
		var data = "";

		result.on("data", (d) => {
			// 通过正则表达式避免下载整个列表（数据量较大）
			const rex = new RegExp(`^${limitTopSites},`, "gm");

			data += d.toString();
			if (rex.test(d.toString())) {
				result.emit("end");
				return;
			}
		});

		result.on("end", () => {
			let sites = [];

			// 解析数据并保存至数组
			data.split("\n").forEach((line) => {
				let [rank, site] = line.split(",");
				if (rank > limitTopSites) return;
				sites.push(site.replace(/[\n\r]/g, ""));
			});

			saveTopSites(filePath, sites); // 保存数据到文件
		});
	})
	.on("error", (e) => {});

request.shouldKeepAlive = false; // 关闭 keep-alive
