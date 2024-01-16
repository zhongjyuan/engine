const path = require("path");

/**
 * Webpack Node Server 打包配置[将nodejs服务端打包成server.js,包括配置也一起打包]
 * zhongjyuan@outlook.com
 */
module.exports = {
	target: "node",
	entry: {
		server: "./server.js", // 入口文件：server.ts
	},
	output: {
		publicPath: "/", // 输出目录的公共路径
		path: path.resolve(__dirname, "../dist"), // 输出目录的绝对路径
		filename: "[name].js?[chunkhash:8]", // 输出的文件名
		chunkFilename: "static/chunk/[name].js?[chunkhash:8]", // 按需加载时的文件名
	},
	resolve: {
		fallback: {
			bufferutil: require.resolve("bufferutil"),
			"utf-8-validate": require.resolve("utf-8-validate"),
		},
		alias: {
			"@common": path.resolve(__dirname, "../common"), // 别名 @common 对应的路径
			"@extends": path.resolve(__dirname, "../extends"), // 别名 @extends 对应的路径
			"@resources": path.resolve(__dirname, "../resources"), // 别名 @resources 对应的路径
			"@config": path.resolve(__dirname, "../config"), // 别名 @config 对应的路径
			"@server": path.resolve(__dirname, "../server"), // 别名 @server 对应的路径
			"@web": path.resolve(__dirname, "../web"), // 别名 @web 对应的路径
		},
		modules: [path.resolve(__dirname, "../node_modules")],
		extensions: [".tsx", ".ts", ".js", ".css", ".vue", ".json"], // 解析模块时自动解析的扩展名
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.tsx?$/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-typescript"],
					},
				},
				exclude: /node_modules/,
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
		],
	},
	plugins: [],
	optimization: {
		usedExports: true,
	},
	ignoreWarnings: [/Critical dependency: the request of a dependency is an expression/],
};
