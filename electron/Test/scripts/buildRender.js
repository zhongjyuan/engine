/**文件流模块 */
const fs = require("fs");

/**路径模块 */
const path = require("path");

/**代码压缩和混淆 */
const uglify = require("uglify-js");

/**去除注释模块 */
const decomment = require("decomment");

/**将 Node.js 风格的代码打包到浏览器中 */
const browserify = require("browserify");

/**在 Electron 中渲染 Node.js 风格的代码 */
const renderify = require("electron-renderify");

/**浏览器目录路径 */
const browserDir = path.resolve(__dirname, "../src/render/");

/**输出文件的路径 */
const outFile = path.resolve(__dirname, "../dist/bundle.js");

/**输出过程文件的路径 */
const intermediateOutput = path.resolve(__dirname, "../dist/build.js");

/**要合并的各个模块的路径 */
const modules = [
	"dist/language.js", // 本地化支持
	"src/render/index.js", // 浏览器主程序
];

/**
 * 构建浏览器 JavaScript 文件
 */
function buildBrowser() {
	// 首先，构建本地化支持
	require("./buildLocalization.js")();

	/**输出内容正文 */
	let output = "";

	// 循环遍历每个文件的路径，读取每个文件的内容，并将其拼接到output字符串中
	modules.forEach(function (script) {
		output += fs.readFileSync(path.resolve(__dirname, "../", script)) + ";\n";
	});

	// 将拼接好的output字符串写入intermediateOutput文件中
	fs.writeFileSync(intermediateOutput, decomment(output), "utf-8");

	// 使用browserify将intermediateOutput文件打包成浏览器端可用的JavaScript bundle
	const instance = browserify(intermediateOutput, {
		paths: [browserDir], // 指定文件查找路径
		ignoreMissing: false,
		node: true, // 在浏览器端使用Node.js风格的代码
		detectGlobals: false, // 禁用全局侦测
	});

	// 使用electron-renderify进行转换
	instance.transform(renderify);

	// 创建可写流来输出bundle文件
	const stream = fs.createWriteStream(outFile, { encoding: "utf-8" });

	instance
		.bundle()
		.on("error", function (e) {
			console.warn("\x1b[31m" + "Error while building: " + e.message + "\x1b[30m"); // 打印错误信息
		})
		.pipe(stream) // 将bundle输出到stream中
		.on("finish", function () {
			// 读取输出文件的内容
			let output = fs.readFileSync(outFile, "utf-8");

			// 去除注释
			output = decomment(output);

			// 压缩并混淆代码
			const minified = uglify.minify(output, {
				compress: true,
				mangle: true,
			});

			// 将压缩混淆后的代码重新写入输出文件
			fs.writeFileSync(outFile, output, "utf-8");
			// fs.writeFileSync(outFile, minified.code, "utf-8");
		});
}

// 如果这个脚本被其他脚本导入，则导出buildBrowser函数
if (module.parent) {
	module.exports = buildBrowser;
}

// 否则，直接调用buildBrowser函数
else {
	buildBrowser();
}
