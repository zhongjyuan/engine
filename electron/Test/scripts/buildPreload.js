/**文件流模块 */
const fs = require("fs");

/**路径模块 */
const path = require("path");

/**代码压缩和混淆 */
const uglify = require("uglify-js");

/**去除注释模块 */
const decomment = require("decomment");

/**输出文件的路径 */
const outFile = path.resolve(__dirname, "../dist/preload.js");

/**要合并的各个模块的路径 */
const modules = [
	"src/preload/index.js",
	"src/settings/preloadSettingManagement.js",
	"src/preload/textManagement.js",
	"src/preload/readerManagement.js",
	"src/preload/siteManagement.js",
	"src/preload/passwordManagement.js",
	"src/preload/translateManagement.js",
];

/**
 * 构建预加载 JavaScript 文件
 */
function buildPreload() {
	/**输出内容正文 */
	let output = "";

	// 循环遍历每个文件的路径，读取每个文件的内容，并将其拼接到output字符串中
	modules.forEach(function (script) {
		output += fs.readFileSync(path.resolve(__dirname, "../", script)) + ";\n";
	});

	output = decomment(output);

	const minified = uglify.minify(decomment(output), { mangle: true });

	fs.writeFileSync(outFile, minified.code, "utf-8");
}

// 如果这个脚本被其他脚本导入，则导出buildPreload函数
if (module.parent) {
	module.exports = buildPreload;
}

// 否则，直接调用buildPreload函数
else {
	buildPreload();
}
