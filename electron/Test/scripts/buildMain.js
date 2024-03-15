/**文件流模块 */
const fs = require("fs");

/**路径模块 */
const path = require("path");

/**去除注释模块 */
const decomment = require("decomment");

/**输出文件的路径 */
const outFile = path.resolve(__dirname, "../main.js");

/**要合并的各个模块的路径 */
const modules = [
	"dist/language.js", // 包含本地化支持的模块
	"src/main/windowManagement.js", // 窗口管理模块
	"src/main/menuManagement.js", // 菜单管理模块
	"src/main/touchBarManagement.js", // TouchBar管理模块
	"src/main/regeditManagement.js", // 注册表管理模块
	"src/main/index.js", // 主进程模块
	"src/settings/mainSettingManagement.js", // 设置管理模块
	"src/main/filterManagement.js", // 广告拦截模块
	"src/main/viewManagement.js", // 视图管理模块
	"src/main/downloadManagement.js", // 下载管理模块
	"src/main/userAgentManagement.js", // 用户代理管理模块
	"src/main/permissionManagement.js", // 权限管理模块
	"src/main/promptManagement.js", // 对话框管理模块
	"src/main/remoteMenuManagement.js", // 右键菜单管理模块
	"src/main/remoteActionManagement.js", // 行为管理模块
	"src/main/passwordManagement.js", // 密码管理模块
	"src/main/proxyManagement.js", // 代理管理模块
	"src/main/themeManagement.js", // 主题管理模块
];

/**
 * 构建主进程 JavaScript 文件
 */
function buildMain() {
	// 首先，构建本地化支持
	require("./buildLocalization.js")();

	/**输出内容正文 */
	let output = "";

	// 循环遍历每个模块的路径，读取每个模块文件的内容，并将其拼接到output字符串中
	modules.forEach(function (script) {
		output += fs.readFileSync(path.resolve(__dirname, "../", script)) + ";\n";
	});

	// 去除代码注释
	// output = decomment(output);

	// 将拼接好的output字符串写入outFile文件中
	fs.writeFileSync(outFile, output, "utf-8");
}

// 如果这个脚本被其他脚本导入，则导出buildMain函数
if (module.parent) {
	module.exports = buildMain;
}

// 否则，直接调用buildMain函数
else {
	buildMain();
}
