const path = require("path");

const { commonHtmlConfig } = require("./common.config");

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
		window: "./src/window.js",
		comp: "./src/comp.js",
		win: "./src/win.js",
		demo: "./demo.ts",
		index: "./index.js"
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
			"@common": path.resolve(__dirname, "../src/common"), // 别名 @common 对应的路径
			"@comp": path.resolve(__dirname, "../src/comps"), // 别名 @comp 对应的路径
			"@demo": path.resolve(__dirname, "../src/demo"), // 别名 @demo 对应的路径
			"@window": path.resolve(__dirname, "../src/window"), // 别名 @window 对应的路径
		},
		extensions: [".tsx", ".ts", ".js", ".css", ".vue", ".json"], // 解析模块时自动解析的扩展名
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/, // 匹配以 .ts 或 .tsx 结尾的文件
				use: "ts-loader", // 使用 ts-loader 加载器处理这些文件
				exclude: /node_modules/, // 排除 node_modules 目录下的文件
			},
			{
				test: /\.(js)$/, // 匹配以 .js 结尾的文件
				exclude: /node_modules/, // 排除 node_modules 目录下的文件
				use: {
					loader: "babel-loader", // 使用 babel-loader 加载器处理这些文件
					options: {
						presets: ["@babel/preset-env"], // 使用的预设配置
					},
				},
			},
			{
				test: /\.html$/, // 匹配以 .html 结尾的文件
				use: [
					{
						loader: "html-loader", // 使用 html-loader 加载器处理这些文件
						options: {
							minimize: true, // 最小化处理 HTML 文件
						},
					},
				],
			},
			{
				test: /\.less$/i,
				use: [
					process.env.NODE_ENV === "development" ? "style-loader" : MiniCssExtractPlugin.loader, // 根据环境选择不同的 CSS 加载器[development:直接设置到head上,否则就按需加载]
					"css-loader",
					"less-loader",
				],
			},
			{
				test: /\.(sa|sc|c)ss$/, // 匹配以 .sass、.scss 或 .css 结尾的文件
				use: [
					process.env.NODE_ENV === "development" ? "style-loader" : MiniCssExtractPlugin.loader, // 根据环境选择不同的 CSS 加载器[development:直接设置到head上,否则就按需加载]
					"css-loader", // 处理 CSS 文件
					"postcss-loader", // 使用 postcss-loader 加载器处理这些文件
				],
				exclude: /node_modules/, // 排除 node_modules 目录下的文件
			},
			{
				test: /\.(ico)$/i, // 匹配以 .ico 结尾的文件
				type: "asset/resource", // 将文件作为资源模块处理
				generator: {
					filename: "assets/icon-[name].[ext]?hash=[hash:8]&[query]", // 输出的文件名
				},
			},
			{
				test: /\.(png|jpe?g|gif|svg|webp)$/, // 匹配以 .png、.jpg、.jpeg、.gif、.svg 或 .webp 结尾的文件
				use: [
					{
						loader: "url-loader", // 使用 url-loader 加载器处理这些文件
						options: {
							limit: 8192, // 小于 8KB 的文件转换为 base64 URL
							name: "assets/image-[name].[ext]?hash=[hash:8]&[query]", // 输出的文件名
						},
					},
				],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i, // 匹配以 .woff、.woff2、.eot、.ttf 或 .otf 结尾的文件
				type: "asset/resource", // 将文件作为资源模块处理
				generator: {
					filename: "assets/font-[name].[ext]?hash=[hash:8]&[query]", // 输出的文件名
				},
			},
			{
				test: /\.(mp4|webm|ogg|ogv|avi|mov|flv|mpeg|wmv)(\?.*)?$/, // 匹配以 .mp4、.webm、.ogg、.ogv、.avi、.mov、.flv、.mpeg 或 .wmv 结尾的文件
				type: "asset/resource", // 将文件作为资源模块处理
				generator: {
					filename: "assets/video-[name].[ext]?hash=[hash:8]&[query]", // 输出的文件名
				},
			},
			{
				test: /\.(mp3|wav|m4a|ogg|wma|aac|amr|mid|midi|ac3|ape|flac|opus)(\?.*)?$/, // 匹配以 .mp3、.wav、.m4a、.ogg、.wma、.aac、.amr、.mid、.midi、.ac3、.ape、.flac 或 .opus 结尾的文件
				type: "asset/resource", // 将文件作为资源模块处理
				generator: {
					filename: "assets/audio-[name].[ext]?hash=[hash:8]&[query]", // 输出的文件名
				},
			},
			{
				test: /\.vue$/, // 匹配以 .vue 结尾的文件
				loader: "vue-loader", // 使用 vue-loader 加载器处理这些文件
				options: {
					compilerOptions: {
						preserveWhitespace: false, // 不保留空白字符
					},
					loaders: {
						html: "vue-template-loader", // 使用 vue-template-loader 处理 HTML 部分
					},
				},
			},
		],
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
