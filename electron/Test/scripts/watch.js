/**路径模块 */
const path = require("path");

/**文件监视模块 */
const chokidar = require("chokidar");

// 定义目录路径

/**主进程代码目录 */
const mainDir = path.resolve(__dirname, "../src/main");

/**预加载代码目录 */
const preloadDir = path.resolve(__dirname, "../src/preload");

/**浏览器代码目录 */
const browserDir = path.resolve(__dirname, "../src/render");

/**浏览器样式代码目录 */
const browserStyleDir = path.resolve(__dirname, "../src/render/css");

// 引入构建模块

/**构建主进程代码模块 */
const buildMain = require("./buildMain.js");

/**构建预加载代码模块 */
const buildPreload = require("./buildPreload.js");

/**构建浏览器代码模块 */
const buildBrowser = require("./buildBrowser.js");

/**构建浏览器样式代码目录 */
const buildBrowserStyles = require("./buildBrowserStyles.js");

// 监听主进程代码目录的变化，一旦发生改变，重新构建主进程代码
chokidar.watch(mainDir).on("change", function () {
	console.log("rebuilding main"); // 打印日志：重新构建主进程代码
	buildMain(); // 调用构建主进程代码的函数
});

// 监听预加载脚本目录的变化，一旦发生改变，重新构建预加载脚本
chokidar.watch(preloadDir).on("change", function () {
	console.log("rebuilding preload script");
	buildPreload();
});

// 监听工作台 JavaScript 目录的变化，一旦发生改变，重新构建工作台代码
chokidar.watch(browserDir, { ignored: browserStyleDir }).on("change", function () {
	console.log("rebuilding render");
	buildBrowser();
});

// 监听工作台样式表目录的变化，一旦发生改变，重新构建工作台样式表
chokidar.watch(browserStyleDir).on("change", function () {
	console.log("rebuilding render styles");
	buildBrowserStyles();
});
