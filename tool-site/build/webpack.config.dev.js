const path = require("path");

const { merge } = require("webpack-merge");

const commonConfig = require("./webpack.config.common.js");

/**
 * Webpack 客户端运行时配置
 * zhongjyuan@outlook.com
 */
module.exports = merge(commonConfig, {
	mode: "development",
	devtool: "inline-source-map", // 开启这个可以在开发环境中调试代码 eval-source-map
	devServer: {
		static: [
			path.join(__dirname, "../config"), //
			path.join(__dirname, "../extends"), //
			path.join(__dirname, "../resources"), //
		], // 指定静态资源目录
		compress: true, // 启用或禁用压缩静态资源
		liveReload: false, // 启用或禁用LiveReload功能，在代码更改时自动刷新页面
		historyApiFallback: {
			ignoreCase: true, // 全局不区分大小写
			rewrites: [
				{ from: /^\/config\/Language\.json$/i, to: "/config/language.json" }, // 重写路径为大小写敏感的 "/config/Language.json"
			],
		},
		hot: true, // 启用热模块替换（HMR）功能，用于在开发过程中实时更新模块而无需刷新整个页面
		open: true, // 在Dev Server启动时自动打开浏览器窗口
		port: 1210, // 指定服务器端口，默认为8080
		// onBeforeSetupMiddleware: function(devServer) {
		// 	devServer.app.use((req, res, next) => {
		// 		const originalUrl = req.url.toLowerCase();
		// 		if (originalUrl !== req.url) {
		// 			res.redirect(301, originalUrl); // 重定向为原始URL的小写版本
		// 		} else {
		// 			next();
		// 		}
		// 	});
		// },
	},
});
