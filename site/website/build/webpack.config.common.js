const path = require("path");

const { commonRuleConfig, commonHtmlConfig } = require("./common.config");

const { VueLoaderPlugin } = require("vue-loader");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

/**
 * Webpack 公共配置
 * zhongjyuan@outlook.com
 */
module.exports = {
	entry: {
		zhongjyuan: "./src/zhongjyuan.js",
		window: "./src/parent.js",
		win: "./src/children.js",
		demo: "./demo.ts",
		index: "./index.js",
	},
	output: {
		publicPath: "/", // 输出目录的公共路径
		path: path.resolve(__dirname, "../dist"), // 输出目录的绝对路径
		filename: "static/[name].js?hash=[chunkhash:8]", // 输出的文件名
		chunkFilename: "static/chunk/[name].js?hash=[chunkhash:8]", // 按需加载时的文件名
	},
	resolve: {
		alias: {
			vue$: "vue/dist/vue.esm.js", // 使用 Vue 的别名
			"@resources": path.resolve(__dirname, "../resources"), // 别名 @resources 对应的路径
			"@extends": path.resolve(__dirname, "../extends"), // 别名 @extends 对应的路径
			"@config": path.resolve(__dirname, "../config"), // 别名 @config 对应的路径
			"@server": path.resolve(__dirname, "../server"), // 别名 @server 对应的路径
			"@base": path.resolve(__dirname, "../src/base"), // 别名 @base 对应的路径
			"@common": path.resolve(__dirname, "../src/common"), // 别名 @common 对应的路径
			"@comp": path.resolve(__dirname, "../src/comps"), // 别名 @comp 对应的路径
			"@demo": path.resolve(__dirname, "../src/demo"), // 别名 @demo 对应的路径
			"@window": path.resolve(__dirname, "../src/window"), // 别名 @window 对应的路径
		},
		extensions: [".tsx", ".ts", ".js", ".css", ".vue", ".json"], // 解析模块时自动解析的扩展名
	},
	module: {
		rules: [...commonRuleConfig],
	},
	plugins: [
		// new VueLoaderPlugin(),
		new CssMinimizerPlugin(),
		new MiniCssExtractPlugin({
			filename: "static/[name].css?hash=[chunkhash:8]", // 提取的 CSS 文件名
			chunkFilename: "static/chunk/[name].css?hash=[chunkhash:8]", // 按需加载时的文件名
		}),
		new CleanWebpackPlugin({
			dry: false,
			verbose: true,
			cleanStaleWebpackAssets: true,
			protectWebpackAssets: false,
			cleanOnceBeforeBuildPatterns: ["**/*"], // 清理输出目录的文件和子目录
		}),
		new HtmlWebpackPlugin({
			filename: "demo.html", // 输出的 HTML 文件名
			template: "./demo.html", // 使用的模板文件
			excludeChunks: ["zhongjyuan", "comp", "window", "win", "index", "server"], // 排除的入口文件
			...commonHtmlConfig, // 共同的 HTML 配置
		}),
		new HtmlWebpackPlugin({
			filename: "index.html", // 输出的 HTML 文件名
			template: "./index.html", // 使用的模板文件
			excludeChunks: ["comp", "win", "demo", "server"], // 排除的入口文件
			...commonHtmlConfig, // 共同的 HTML 配置
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: "./favicon.ico", to: "favicon.ico" }, // 复制 favicon.ico 文件
				{ from: "./client.html", to: "client.html" }, // 复制 socket-client.html 文件
				{ from: "./server.js", to: "server.js" }, // 复制 server.js 文件
				{ from: "./config", to: "config" }, // 复制 config 目录及其内容
				{ from: "./resources", to: "resources" }, // 复制 static/assets 目录及其内容
				{
					from: "./extends",
					to: "extends",
					filter: (resourcePath) => {
						// 在这里定义过滤逻辑，返回 true 表示保留文件，返回 false 表示排除文件
						// 这里假设需要排除 extends/fontawesome 子目录及其内容
						const excludeDirs = [/\/fontawesome\//];
						return !excludeDirs.some((regex) => regex.test(resourcePath));
					},
				},
			],
		}),
	],
};
