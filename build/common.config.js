const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	commonRuleConfig: [
		{
			test: /\.(ts|tsx)$/, // 匹配以 .ts 或 .tsx 结尾的文件
			exclude: /\/(node_modules|modules)\//, // 排除 node_modules 目录下的文件
			use: "ts-loader", // 使用 ts-loader 加载器处理这些文件
		},
		{
			test: /\.(js)$/, // 匹配以 .js 结尾的文件
			exclude: /\/(node_modules|modules)\//, // 排除 node_modules 目录下的文件
			use: {
				loader: "babel-loader", // 使用 babel-loader 加载器处理这些文件
				options: {
					presets: ["@babel/preset-env"], // 使用的预设配置
				},
			},
		},
		{
			test: /\.html$/, // 匹配以 .html 结尾的文件
			exclude: /\/(node_modules|modules)\//, // 排除 node_modules 目录下的文件
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
			exclude: /\/(node_modules|modules)\//, // 排除 node_modules 目录下的文件
			use: [
				process.env.NODE_ENV === "development" ? "style-loader" : MiniCssExtractPlugin.loader, // 根据环境选择不同的 CSS 加载器[development:直接设置到head上,否则就按需加载]
				"css-loader",
				"less-loader",
			],
		},
		{
			test: /\.(sa|sc|c)ss$/, // 匹配以 .sass、.scss 或 .css 结尾的文件
			exclude: /\/(node_modules|modules)\//, // 排除 node_modules 目录下的文件
			use: [
				process.env.NODE_ENV === "development" ? "style-loader" : MiniCssExtractPlugin.loader, // 根据环境选择不同的 CSS 加载器[development:直接设置到head上,否则就按需加载]
				"css-loader", // 处理 CSS 文件
				"postcss-loader", // 使用 postcss-loader 加载器处理这些文件
			],
		},
		{
			test: /\.(ico)$/i, // 匹配以 .ico 结尾的文件
			type: "asset/resource", // 将文件作为资源模块处理
			exclude: /\/(node_modules|modules)\//, // 排除 node_modules 目录下的文件
			generator: {
				filename: "assets/icon-[name].[ext]?hash=[hash:8]&[query]", // 输出的文件名
			},
		},
		{
			test: /\.(png|jpe?g|gif|svg|webp)$/, // 匹配以 .png、.jpg、.jpeg、.gif、.svg 或 .webp 结尾的文件
			exclude: /\/(node_modules|modules)\//, // 排除 node_modules 目录下的文件
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
			exclude: /\/(node_modules|modules)\//, // 排除 node_modules 目录下的文件
			generator: {
				filename: "assets/font-[name].[ext]?hash=[hash:8]&[query]", // 输出的文件名
			},
		},
		{
			test: /\.(mp4|webm|ogg|ogv|avi|mov|flv|mpeg|wmv)(\?.*)?$/, // 匹配以 .mp4、.webm、.ogg、.ogv、.avi、.mov、.flv、.mpeg 或 .wmv 结尾的文件
			type: "asset/resource", // 将文件作为资源模块处理
			exclude: /\/(node_modules|modules)\//, // 排除 node_modules 目录下的文件
			generator: {
				filename: "assets/video-[name].[ext]?hash=[hash:8]&[query]", // 输出的文件名
			},
		},
		{
			test: /\.(mp3|wav|m4a|ogg|wma|aac|amr|mid|midi|ac3|ape|flac|opus)(\?.*)?$/, // 匹配以 .mp3、.wav、.m4a、.ogg、.wma、.aac、.amr、.mid、.midi、.ac3、.ape、.flac 或 .opus 结尾的文件
			type: "asset/resource", // 将文件作为资源模块处理
			exclude: /\/(node_modules|modules)\//, // 排除 node_modules 目录下的文件
			generator: {
				filename: "assets/audio-[name].[ext]?hash=[hash:8]&[query]", // 输出的文件名
			},
		},
		{
			test: /\.vue$/, // 匹配以 .vue 结尾的文件
			loader: "vue-loader", // 使用 vue-loader 加载器处理这些文件
			exclude: /\/(node_modules|modules)\//, // 排除 node_modules 目录下的文件
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
	/**公共配置[html-webpack-plugin] */
	commonHtmlConfig: {
		minify: {
			collapseWhitespace: true,
			removeComments: true,
			useShortDoctype: true,
			minifyCSS: true,
			minifyJS: true,
		},
	},
};
