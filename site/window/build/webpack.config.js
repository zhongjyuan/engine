const path = require("path");
const glob = require("glob");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const UglifyJsWebpackPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");

const Cssnano = require("cssnano");
const Autoprefixer = require("autoprefixer");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

const ImageminPlugin = require("imagemin-webpack-plugin").default;
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");

/**是否删除Console输出 */
const dropConsole = false;

/**
 * Webpack全局配置
 * @author zhongjyuan
 * @date   2023年5月17日14:13:46
 * @email  zhongjyuan@outlook.com
 */
module.exports = {
	mode: "production",
	entry: {
		main: "./build/main.js",
		component: "./build/component.js",
		win: "./src/static/js/core/win.js",
		window: "./src/static/js/core/window.js",
	},
	output: {
		publicPath: "/",
		path: path.resolve(__dirname, "../dist"),
		filename: "static/[name].[chunkhash:8].js",
		chunkFilename: "static/[name].[chunkhash:8].js",
	},
	module: {
		rules: [
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					process.env.NODE_ENV === "development" ? "style-loader" : MiniCssExtractPlugin.loader,
					{ loader: "css-loader" },
					{
						loader: "postcss-loader",
						options: {
							sourceMap: true,
							plugins: [Autoprefixer({})],
						},
					},
				],
				exclude: /node_modules/,
			},
			{
				test: /\.js$/,
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: ["babel-preset-env"],
						},
					},
				],
				exclude: /node_modules/,
			},
			{
				test: /\.(png|jpe?g|gif|webp|icon)$/i,
				use: [
					{
						loader: "url-loader",
						options: {
							limit: 8192,
							name: "[path][name].[ext]?[hash:8]",
							outputPath: (url, resourcePath, context) => {
								return path.join(
									"assets",
									path
										.relative(context, resourcePath)
										.replace(new RegExp(`\\${path.sep}`, "g"), "/")
										.replace(/^src\/static/, "")
								);
							},
						},
					},
					// 图片压缩
					{
						loader: "image-webpack-loader", // 压缩图片
						options: {
							// 这里可以单独配置每种图片格式的压缩参数
							mozjpeg: {
								progressive: true,
								quality: 65,
							},
							// optipng.enabled: false will disable optipng
							optipng: {
								enabled: false,
							},
							pngquant: {
								quality: [0.65, 0.9],
								speed: 4,
							},
							gifsicle: {
								interlaced: false,
							},

							// the webp option will enable WEBP
							webp: {
								quality: 75,
							},
						},
					},
				],
			},
			{
				test: /favicon\.ico$/,
				use: [
					{
						loader: "url-loader",
						options: {
							limit: 8192, // 8KB
							name: "[path][name].[ext]?[hash:8]",
							outputPath: (url, resourcePath, context) => {
								return path.join(
									"assets",
									path
										.relative(context, resourcePath)
										.replace(new RegExp(`\\${path.sep}`, "g"), "/")
										.replace(/^src\/static/, "")
								);
							},
						},
					},
				],
			},
			{
				test: /\.svg$/,
				use: [
					{
						loader: "svg-url-loader",
						options: {
							limit: 4096,
							name: "[path][name].[ext]?[hash:8]",
							outputPath: (url, resourcePath, context) => {
								return path.join(
									"assets",
									path
										.relative(context, resourcePath)
										.replace(new RegExp(`\\${path.sep}`, "g"), "/")
										.replace(/^src\/static/, "")
								);
							},
						},
					},
				],
			},
			{
				test: /\.(webm|ogg|wav|flac|aac)(\?.*)?$/,
				loader: "url-loader",
				options: {
					limit: 10000,
					name: "[path][name].[ext]?[hash:8]",
					outputPath: (url, resourcePath, context) => {
						return path.join(
							"assets",
							path
								.relative(context, resourcePath)
								.replace(new RegExp(`\\${path.sep}`, "g"), "/")
								.replace(/^src\/static/, "")
						);
					},
				},
			},
			{
				test: /\.(woff2?|eot|ttf|otf|txt)(\?.*)?$/,
				loader: "url-loader",
				options: {
					limit: 10000,
					name: "[path][name].[ext]?[hash:8]",
					outputPath: (url, resourcePath, context) => {
						return path.join(
							"assets",
							path
								.relative(context, resourcePath)
								.replace(new RegExp(`\\${path.sep}`, "g"), "/")
								.replace(/^src\/static/, "")
						);
					},
				},
			},
			{
				test: /\.(txt)(\?.*)?$/,
				loader: "url-loader",
				options: {
					name: "[path][name].[ext]?[hash:8]",
					outputPath: (url, resourcePath, context) => {
						return path.join(
							"assets",
							path
								.relative(context, resourcePath)
								.replace(new RegExp(`\\${path.sep}`, "g"), "/")
								.replace(/^src\/static/, "")
						);
					},
				},
			},
			{
				test: /\.(mp3|mp4)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "[path][name].[ext]?[hash:8]",
							outputPath: (url, resourcePath, context) => {
								return path.join(
									"assets",
									path
										.relative(context, resourcePath)
										.replace(new RegExp(`\\${path.sep}`, "g"), "/")
										.replace(/^src\/static/, "")
								);
							},
						},
					},
				],
			},
			{ test: /\.html$/, use: "raw-loader" },
			{
				test: /\.vue$/,
				loader: "vue-loader",
				options: {
					compilerOptions: {
						preserveWhitespace: false,
					},
					loaders: {
						html: "vue-template-loader",
					},
				},
			},
		],
	},
	resolve: {
		extensions: [".js", ".vue", ".json"],
		alias: {
			vue$: "vue/dist/vue.esm.js",
		},
	},
	plugins: [
		new VueLoaderPlugin(),
		new CleanWebpackPlugin({
			dry: false,
			verbose: true,
			cleanStaleWebpackAssets: true,
			protectWebpackAssets: false,
		}),
		new MiniCssExtractPlugin({
			filename: "static/[name].[chunkhash:8].css",
			chunkFilename: "static/[name].[chunkhash:8].css",
		}),
		new UglifyJsWebpackPlugin({
			uglifyOptions: {
				warnings: false,
				compress: {
					drop_console: dropConsole, // 删除所有的console语句
					reduce_vars: true, // 把使用多次的静态值自动定义为变量
				},
				output: {
					comments: false, // 不保留注释
				},
			},
			parallel: true,
		}),
		new OptimizeCssAssetsWebpackPlugin({
			assetNameRegExp: /\.css$/g,
			cssProcessor: Cssnano,
			cssProcessorPluginOptions: {
				preset: [
					"default",
					{
						discardComments: {
							removeAll: true,
						},
						normalizeUnicode: false,
					},
				],
			},
			canPrint: true,
		}),
		new HtmlWebpackPlugin({
			template: "./src/index.html",
			excludeChunks: ["win"],
			minify: {
				collapseWhitespace: true,
				removeComments: true,
				useShortDoctype: true,
				minifyCSS: true,
				minifyJS: true,
			},
		}),
		new ImageminPlugin({
			test: /\.(jpe?g|png)$/i,
			plugins: [imageminMozjpeg({ quality: 75, progressive: true }), imageminPngquant({ quality: [0.65, 0.9], speed: 4 })],
		}),
	],
	optimization: {
		minimizer: [new TerserWebpackPlugin()],
		runtimeChunk: "single",
		splitChunks: {
			chunks: "async", // 共有三个值可选：initial(初始模块)、async(按需加载模块)和all(全部模块)
			minSize: 30 * 1000, // 模块超过30k自动被抽离成公共模块
			maxAsyncRequests: 5, // 异步加载chunk的并发请求数量<=5
			maxInitialRequests: 3, // 一个入口并发加载的chunk数量<=3
			name: true, // 默认由模块名+hash命名，名称相同时多个模块将合并为1个，可以设置为function

			cacheGroups: {
				//公用模块抽离
				scripts: {
					name: "common",
					chunks: "initial",
					minSize: 0, //大于0个字节
					minChunks: 2, //在分割之前，这个代码块最小应该被引用的次数
				},
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendors",
					chunks: "all",
				},
			},
		},
	},
};
