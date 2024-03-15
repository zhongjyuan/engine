/**文件流模块 */
const fs = require("fs");

/**路径模块 */
const path = require("path");

/**代码压缩和混淆 */
const CleanCSS = require("clean-css");

/**输出文件的路径 */
const outFile = path.resolve(__dirname, "../dist/bundle.css");

/**要合并的各个模块的路径 */
const modules = [
	"src/css/base.css",
	"src/render/css/windowControls.css",
	"src/render/css/modalMode.css",
	"src/render/css/tabBarManagement.css",
	"src/render/css/tabEditManagement.css",
	"src/render/css/taskOverlayManagement.css",
	"src/render/css/webviewManagement.css",
	"src/render/css/pageNewTab.css",
	"src/render/css/searchbar.css",
	"src/render/css/searchbarItem.css",
	"src/render/css/bookmarkManagement.css",
	"src/render/css/pageFinds.css",
	"src/render/css/downloadManagement.css",
	"src/render/css/passwordManagement.css",
	"src/render/css/passwordCapture.css",
	"src/render/css/passwordViewer.css",
	"node_modules/dragula/dist/dragula.min.css",
];

/**
 * 构建浏览器 Style 文件
 */
function buildBrowserStyles() {
	/**输出内容正文 */
	let output = "";

	// 循环遍历每个文件的路径，读取每个文件的内容，并将其拼接到output字符串中
	modules.forEach(function (script) {
		output += fs.readFileSync(path.resolve(__dirname, "../", script)) + "\n";
	});

	// 压缩并混淆代码
	const minified = new CleanCSS().minify(output).styles;

	// 将拼接好的output字符串写入outFile文件中
	fs.writeFileSync(outFile, minified, "utf-8");
}

// 如果这个脚本被其他脚本导入，则导出buildBrowserStyles函数
if (module.parent) {
	module.exports = buildBrowserStyles;
}

// 否则，直接调用buildBrowserStyles函数
else {
	buildBrowserStyles();
}
