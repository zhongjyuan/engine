const commonConfig = require("./webpack.config.common.js");

const { merge } = require("webpack-merge");

const TerserPlugin = require("terser-webpack-plugin");

/**
 * Webpack 客户端构建包配置
 * zhongjyuan@outlook.com
 */
module.exports = merge(commonConfig, {
	mode: "production", // 模式设置为生产模式
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					output: {
						comments: false, // 注释不会被保留和提取到生成的 JavaScript 文件中
					},
					compress: {
						comments: false, // 禁用对 JavaScript 文件中注释的保留和提取
					},
					mangle: {
						eval: true, // 是否混淆 eval 内部的变量
						toplevel: true, // 是否应用顶层作用域的变量名混淆
						keep_fnames: false, // 不保留函数名
					},
					compress: {
						drop_console: false, // 移除控制台输出
						drop_debugger: false, // 移除 debugger 语句
					},
				},
			}),
		],
		runtimeChunk: "single",
		splitChunks: {
			chunks: "async", // 共有三个值可选：initial(初始模块)、async(按需加载模块)和all(全部模块)
			minSize: 30 * 1000, // 模块超过30k自动被抽离成公共模块
			maxSize: Infinity,
			minChunks: 1, // 表示一个模块最少被引用的次数，只有被引用超过该次数的模块才会被拆分。
			maxAsyncRequests: 5, // 异步加载chunk的并发请求数量<=5
			maxInitialRequests: 3, // 一个入口并发加载的chunk数量<=3
			name: false, // 默认由模块名+hash命名，名称相同时多个模块将合并为1个，可以设置为function

			cacheGroups: {
				//公用模块抽离
				scripts: {
					name: "common", // 抽离出来的公共模块名称
					chunks: "initial",
					minSize: 0, //大于0个字节
					minChunks: 2, //在分割之前，这个代码块最小应该被引用的次数
				},
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendors", // 从 node_modules 中抽离出来的公共模块名称
					chunks: "all",
				},
			},
		},
	},
});
