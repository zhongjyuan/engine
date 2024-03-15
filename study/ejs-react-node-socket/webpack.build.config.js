var path = require("path");
var webpack = require("webpack");

var ExtractTextPlugin = require("extract-text-webpack-plugin"); // css文件单独打包
var OptimizeCssplugin = require("optimize-css-assets-webpack-plugin"); // 压缩css文件

module.exports = {
	devtool: false,
	entry: {
		bundle: __dirname + "/src/main.js",
		vendor: ["react", "react-dom", "redux", "react-redux"],
		common: [__dirname + "/public/js/index.js"],
		custom: [
			__dirname + "/public/js/main/login.js",
			__dirname + "/public/css/index.css",
			__dirname + "/public/css/main/login.css",
		],
	},
	output: {
		path: __dirname + "/public/build",
		filename: "[name].js",
		publicPath: "/public/build/",
		chunkFilename: "[name].[chunkhash:5].chunk.js",
	},
	resolve: {
		extensions: ["", ".js", ".jsx"],
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify("production"),
			},
		}),
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			compress: {
				warnings: false,
			},
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names: ["vendor", "runtime"],
			filename: "[name].js",
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names: ["common"],
			chunks: ["common"],
			filename: "[name].js",
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names: ["custom"],
			chunks: ["custom"],
			filename: "[name].js",
		}),
		new ExtractTextPlugin("main.css"),
		new OptimizeCssplugin(),
	],
	module: {
		loaders: [
			{ test: /\.(jpg|jpeg|png|git|webp|svg)$/, loader: "url?limit=819200" },
			{
				test: /\.jsx{0,1}$/,
				loader:
					"babel-loader?" +
					JSON.stringify({ presets: ["react", "es2015", "stage-0"] }),
				exclude: /node_modules/,
				include: __dirname,
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract("style", "css!postcss"),
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract("style", "css!postcss!sass"),
			},
		],
	},
	postcss: [
		require("autoprefixer"), //调用autoprefixer插件,css3自动补全
	],
	babel: {
		plugins: [
			"transform-runtime",
			[
				"import",
				{
					libraryName: "antd",
					style: "css",
				},
			],
		],
	},
};
