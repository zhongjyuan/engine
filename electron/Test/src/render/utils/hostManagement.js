/**
 * 主机管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月19日18:43:58
 */
const hostManagement = {
	/**主机数组 */
	hosts: [],

	/**hosts文件路径 */
	HOSTS_FILE: process.platform === "win32" ? "C:/Windows/System32/drivers/etc/hosts" : "/etc/hosts",

	/**
	 * 从文件内容中截取指定长度的行数
	 * @param {string} data - 文件内容
	 * @param {number} limit - 截取的长度限制
	 * @returns {Array} - 截取后的行数组
	 */
	truncatedFileLines: function (data, limit) {
		// 如果文件内容超过限制长度，则截取前limit个字符，并按行分割，保留最后一行
		return data.length > limit ? data.substring(0, limit).split("\n").slice(0, -1) : data.split("\n");
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		// 异步读取hosts文件内容
		fs.readFile(hostManagement.HOSTS_FILE, "utf8", function (err, data) {
			if (err) {
				console.warn("error retrieving hosts file", err);
				return;
			}

			/**主机名 Map 集 */
			var hostsMap = {}; // 用于去重的主机名哈希表

			/**行内容 */
			const lines = hostManagement.truncatedFileLines(data, 128 * 1024); // 限制文件内容为128KB以内

			lines.forEach(function (line) {
				// 如果该行以"#"开头，则为注释行，直接跳过
				if (line.startsWith("#")) {
					return;
				}

				line.split(/\s/g).forEach(function (host) {
					// 如果主机名不为空、不是广播地址和保留主机名，并且未出现在哈希表中，则将其添加到主机名数组和哈希表中
					if (host.length > 0 && host !== "255.255.255.255" && host !== "broadcasthost" && !hostsMap[host]) {
						hostManagement.hosts.push(host);
						hostsMap[host] = true;
					}
				});
			});
		});
	},
};

hostManagement.initialize();

module.exports = hostManagement;
