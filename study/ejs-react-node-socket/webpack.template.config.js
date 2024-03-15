module.exports = {
	// 提供 mode 配置选项，告知 webpack 使用相应模式的内置优化
	mode: "production",
	// 基础目录，绝对路径，用于配置中解析入口起点（entry point）和 loader 默认使用当前目录，但是推荐在配置中传递一个值
	context: "C:\\project\\vueTest",
	// 此选项控制是否生成，以及如何生成 source map 使用 SourceMapDevToolPlugin 进行更细粒度的配置。查看 source-map-loader 来处理已有的 source map
	devtool: false,
	// 此选项可以配置是否polyfill或mock某些Node.js全局变量和模块。这可以使最初为Node.js环境编写的代码。在其他环境中允许
	node: {
		setImmediate: false,
		process: "mock",
		dgram: "empty",
		fs: "empty",
		net: "empty",
		tls: "empty",
		child_process: "empty",
	},
	// 默认为 ./src
	// 这里应用程序开始执行
	// webpack 开始打包
	output: {
		// path webpack 如何输出结果的相关选项
		path: "C:\\project\\vueTest\\dist", // string
		// 所有输出文件的目标路径
		// 必须是绝对路径（使用node.js的path模块）
		publicPath: "/",
		// 入口分块(entry chunk) 的文件名称模板
		filename: "js/[name].[contenthash:8].js",
		// 此选项决定了非入口(non-entry) chunk 文件的名称。有关可取的值的详细信息，请查看 output.filename 选项。
		chunkFilename: "js/[name].[contenthash:8].js",
	},
	//解析 配置模块如何解析，例如，挡在ES2015中调用import "loadsh",resolve选项能够对webpack查找“loadsh”的方式取做修改
	resolve: {
		// 创建import或require的别名，来确保模块引入变得简单、例如，一些位于 src/ 文件夹下的常用模块：
		alias: {
			"@": "C:\\project\\vueTest\\src",
			vue$: "vue/dist/vue.runtime.esm.js",
		},
		// 自动解析确定的扩展。默认值为['.wasm', '.mjs', '.js', '.json']
		// 能够使用户在引入模块时不带扩展： 如import File from '../path/to/file';
		extensions: [".js", ".jsx", ".vue", ".json"],
		// 告诉webpack 解析模块时应该搜索的目录，
		// 绝对路径和相对路径都能使用，但是要知道它们之间有一点差异
		// 通过查看当前目录以及祖先路径，相对路径将类似于Node查找‘node_modules’
		modules: [
			// 模块别名列表
			"node_modules",
			"C:\\project\\vueTest\\node_modules",
			"C:\\project\\vueTest\\node_modules\\@vue\\cli-service\\node_modules",
		],
	},
	// 这组选项与上面的resolve对象的属性集合相同，但是仅用于来解析webpack的loader包。
	resolveLoader: {
		modules: [
			"C:\\project\\vueTest\\node_modules\\@vue\\cli-plugin-eslint\\node_modules",
			"C:\\project\\vueTest\\node_modules\\@vue\\cli-plugin-babel\\node_modules",
			"node_modules",
			"C:\\project\\vueTest\\node_modules",
			"C:\\project\\vueTest\\node_modules\\@vue\\cli-service\\node_modules",
		],
	},
	// 模块  module 决定了 如何处理项目中的不同类型的模块
	module: {
		// 防止webpakc解析哪些任何与给定正则表达式匹配的文件。忽略的文件中不应该含有important,require,define的调用，或任何其他导入机制忽略大型的libaray可以提高构建性能
		noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
		// 模块规格 （匹配loader，解析器等选项）
		// loaders webpack可以使用loader来预处理文件。这允许你打包除javascript之外的任何静态资源,你可以使用node.js来更简单的编写自己的loader
		rules: [
			/* config.module.rule('vue') */
			{
				test: /\.vue$/,
				use: [
					{
						// 有一些性能开销较大的loader之前添加此loader,可以将结果缓存到磁盘里
						loader: "cache-loader",
						options: {
							cacheDirectory:
								"C:\\project\\vueTest\\node_modules\\.cache\\vue-loader",
							cacheIdentifier: "c12e2af6",
						},
					},
					{
						// 以及 `.vue` 文件中的 `<script>` 块
						loader: "vue-loader",
						options: {
							// 模板编译器的选项。当使用默认的 vue-template-compiler 的时候，你可以使用这个选项来添加自定义编译器指令、模块或通过 { preserveWhitespace: false } 放弃模板标签之间的空格。
							compilerOptions: {
								preserveWhitespace: false,
							},
							// 模板编译器的选项。当使用默认的 vue-template-compiler 的时候，你可以使用这个选项来添加自定义编译器指令、模块或通过 { preserveWhitespace: false } 放弃模板标签之间的空格。
							cacheDirectory:
								"C:\\project\\vueTest\\node_modules\\.cache\\vue-loader",
							cacheIdentifier: "c12e2af6",
						},
					},
				],
			},
			/* config.module.rule('images') */
			{
				test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
				use: [
					{
						// npm install --save-dev url-loader
						// npm install --save-dev file-loader
						// 用法" class="icon-link" href="#用法">
						// 加载文件为base64编码的URL
						// 以字节为单位
						// 当文件大于限制(以字节为单位)时，为文件指定加载器
						loader: "url-loader",
						options: {
							limit: 10240, // 以字节为单位
							fallback: {
								// 当文件大于限制(以字节为单位)时，为文件指定加载器
								loader: "file-loader",
								options: {
									name: "img/[name].[hash:8].[ext]",
								},
							},
						},
					},
				],
			},
			/* config.module.rule('svg') */
			{
				test: /\.(svg)(\?.*)?$/,
				use: [
					{
						// npm install --save-dev file-loader
						// 默认情况下，生成的文件的文件名就是文件内容的MD5哈希值并保留所引用资源的原始扩展名
						loader: "file-loader",
						options: {
							name: "img/[name].[hash:8].[ext]",
						},
						// 生成文件 file.png，输出到输出目录并返回 public URL。
						// "/public/path/0dcbbaa7013869e351f.png"
					},
				],
			},
			/* config.module.rule('media') */
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				use: [
					{
						// npm install --save-dev url-loader
						// npm install --save-dev file-loader
						// 用法" class="icon-link" href="#用法">
						// 加载文件为base64编码的URL
						// 以字节为单位
						// 当文件大于限制(以字节为单位)时，为文件指定加载器
						loader: "url-loader",
						options: {
							limit: 4096,
							fallback: {
								loader: "file-loader",
								options: {
									name: "media/[name].[hash:8].[ext]",
								},
							},
						},
					},
				],
			},
			/* config.module.rule('fonts') */
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
				use: [
					{
						// npm install --save-dev url-loader
						// npm install --save-dev file-loader
						// 用法" class="icon-link" href="#用法">
						// 加载文件为base64编码的URL
						// 以字节为单位
						// 当文件大于限制(以字节为单位)时，为文件指定加载器
						loader: "url-loader",
						options: {
							limit: 4096,
							fallback: {
								loader: "file-loader",
								options: {
									name: "fonts/[name].[hash:8].[ext]",
								},
							},
						},
					},
				],
			},
			// 一个简单地将pug模板编译成HTML的加载器
			/* config.module.rule('pug') */
			{
				test: /\.pug$/,
				use: [
					{
						loader: "pug-plain-loader",
					},
				],
			},
			/* config.module.rule('css') */
			{
				test: /\.css$/,
				oneOf: [
					/* config.module.rule('css').oneOf('vue-modules') */
					{
						resourceQuery: /module/,
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								// 加载.css文件
								loader: "css-loader",
								options: {
									sourceMap: false, // 启用/禁用 CSS 模块
									importLoaders: 2, // 在 css-loader 前应用的 loader 的数量
									modules: true, // 启用/禁用 CSS 模块
									localIdentName: "[name]_[local]_[hash:base64:5]",
								},
							},
							{
								// 加载器webpack来处理CSS与PostCSS
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
						],
					},
					/* config.module.rule('css').oneOf('vue') */
					{
						resourceQuery: /\?vue/,
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								loader: "css-loader",
								options: {
									sourceMap: false,
									importLoaders: 2, // 在 css-loader 前应用的 loader 的数量
								},
							},
							{
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
						],
					},
					/* config.module.rule('css').oneOf('normal-modules') */
					{
						test: /\.module\.\w+$/,
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								// 解释（interpret） @import 和 url(). 会import/require()后再解析它们
								// 引用合适的loader是file-loader和url-loader
								loader: "css-loader",
								options: {
									sourceMap: false,
									importLoaders: 2,
									modules: true,
									localIdentName: "[name]_[local]_[hash:base64:5]",
								},
							},
							{
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
						],
					},
					/* config.module.rule('css').oneOf('normal') */
					{
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								loader: "css-loader",
								options: {
									sourceMap: false,
									importLoaders: 2,
								},
							},
							{
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
						],
					},
				],
			},
			/* config.module.rule('postcss') */
			{
				test: /\.p(ost)?css$/,
				oneOf: [
					/* config.module.rule('postcss').oneOf('vue-modules') */
					{
						resourceQuery: /module/,
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								loader: "css-loader",
								options: {
									sourceMap: false,
									importLoaders: 2,
									modules: true,
									localIdentName: "[name]_[local]_[hash:base64:5]",
								},
							},
							{
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
						],
					},
					/* config.module.rule('postcss').oneOf('vue') */
					{
						resourceQuery: /\?vue/,
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								loader: "css-loader",
								options: {
									sourceMap: false,
									importLoaders: 2,
								},
							},
							{
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
						],
					},
					/* config.module.rule('postcss').oneOf('normal-modules') */
					{
						test: /\.module\.\w+$/,
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								loader: "css-loader",
								options: {
									sourceMap: false,
									importLoaders: 2,
									modules: true,
									localIdentName: "[name]_[local]_[hash:base64:5]",
								},
							},
							{
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
						],
					},
					/* config.module.rule('postcss').oneOf('normal') */
					{
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								loader: "css-loader",
								options: {
									sourceMap: false,
									importLoaders: 2,
								},
							},
							{
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
						],
					},
				],
			},
			// 加载一个SASS/SCSS文件并将其编译为CSS。
			/* config.module.rule('scss') */
			{
				test: /\.scss$/,
				oneOf: [
					/* config.module.rule('scss').oneOf('vue-modules') */
					{
						resourceQuery: /module/,
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								// 加载css
								loader: "css-loader",
								options: {
									sourceMap: false,
									importLoaders: 2,
									modules: true,
									localIdentName: "[name]_[local]_[hash:base64:5]",
								},
							},
							{
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
							{
								loader: "sass-loader",
								options: {
									sourceMap: false,
								},
							},
						],
					},

					/* config.module.rule('scss').oneOf('vue') */
					{
						resourceQuery: /\?vue/,
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								loader: "css-loader",
								options: {
									sourceMap: false,
									importLoaders: 2,
								},
							},
							{
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
							{
								// 加载一个SASS/SCSS文件并将其编译为CSS。
								loader: "sass-loader",
								options: {
									sourceMap: false,
								},
							},
						],
					},
					/* config.module.rule('scss').oneOf('normal-modules') */
					{
						test: /\.module\.\w+$/,
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								loader: "css-loader",
								options: {
									sourceMap: false,
									importLoaders: 2,
									modules: true,
									localIdentName: "[name]_[local]_[hash:base64:5]",
								},
							},
							{
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
							{
								// 加载一个SASS/SCSS文件并将其编译为CSS。
								loader: "sass-loader",
								options: {
									sourceMap: false,
								},
							},
						],
					},
					/* config.module.rule('scss').oneOf('normal') */
					{
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								loader: "css-loader",
								options: {
									sourceMap: false,
									importLoaders: 2,
								},
							},
							{
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
							{
								// 加载一个SASS/SCSS文件并将其编译为CSS。
								loader: "sass-loader",
								options: {
									sourceMap: false,
								},
							},
						],
					},
				],
			},
			/* config.module.rule('sass') */
			{
				test: /\.sass$/,
				oneOf: [
					/* config.module.rule('sass').oneOf('vue-modules') */
					{
						resourceQuery: /module/,
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								loader: "css-loader",
								options: {
									sourceMap: false,
									importLoaders: 2,
									modules: true,
									localIdentName: "[name]_[local]_[hash:base64:5]",
								},
							},
							{
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
							{
								// 加载一个SASS/SCSS文件并将其编译为CSS。
								loader: "sass-loader",
								options: {
									sourceMap: false,
									indentedSyntax: true,
								},
							},
						],
					},
					/* config.module.rule('sass').oneOf('vue') */
					{
						resourceQuery: /\?vue/,
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								loader: "css-loader",
								options: {
									sourceMap: false,
									importLoaders: 2,
								},
							},
							{
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
							{
								// 加载一个SASS/SCSS文件并将其编译为CSS。
								loader: "sass-loader",
								options: {
									sourceMap: false,
									indentedSyntax: true,
								},
							},
						],
					},
					/* config.module.rule('sass').oneOf('normal-modules') */
					{
						test: /\.module\.\w+$/,
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								loader: "css-loader",
								options: {
									sourceMap: false,
									importLoaders: 2,
									modules: true,
									localIdentName: "[name]_[local]_[hash:base64:5]",
								},
							},
							{
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
							{
								loader: "sass-loader",
								options: {
									sourceMap: false,
									indentedSyntax: true,
								},
							},
						],
					},
					/* config.module.rule('sass').oneOf('normal') */
					{
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								loader: "css-loader",
								options: {
									sourceMap: false,
									importLoaders: 2,
								},
							},
							{
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
							{
								loader: "sass-loader",
								options: {
									sourceMap: false,
									indentedSyntax: true,
								},
							},
						],
					},
				],
			},
			/* config.module.rule('less') */
			{
				test: /\.less$/,
				oneOf: [
					/* config.module.rule('less').oneOf('vue-modules') */
					{
						resourceQuery: /module/,
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								loader: "css-loader",
								options: {
									sourceMap: false,
									importLoaders: 2,
									modules: true,
									localIdentName: "[name]_[local]_[hash:base64:5]",
								},
							},
							{
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
							{
								loader: "less-loader",
								options: {
									sourceMap: false,
								},
							},
						],
					},
					/* config.module.rule('less').oneOf('vue') */
					{
						resourceQuery: /\?vue/,
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								loader: "css-loader",
								options: {
									sourceMap: false,
									importLoaders: 2,
								},
							},
							{
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
							{
								loader: "less-loader",
								options: {
									sourceMap: false,
								},
							},
						],
					},
					/* config.module.rule('less').oneOf('normal-modules') */
					{
						test: /\.module\.\w+$/,
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								loader: "css-loader",
								options: {
									sourceMap: false,
									importLoaders: 2,
									modules: true,
									localIdentName: "[name]_[local]_[hash:base64:5]",
								},
							},
							{
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
							{
								loader: "less-loader",
								options: {
									sourceMap: false,
								},
							},
						],
					},
					/* config.module.rule('less').oneOf('normal') */
					{
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								loader: "css-loader",
								options: {
									sourceMap: false,
									importLoaders: 2,
								},
							},
							{
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
							{
								loader: "less-loader",
								options: {
									sourceMap: false,
								},
							},
						],
					},
				],
			},
			/* config.module.rule('stylus') */
			{
				test: /\.styl(us)?$/,
				oneOf: [
					/* config.module.rule('stylus').oneOf('vue-modules') */
					{
						resourceQuery: /module/,
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								loader: "css-loader",
								options: {
									sourceMap: false,
									importLoaders: 2,
									modules: true,
									localIdentName: "[name]_[local]_[hash:base64:5]",
								},
							},
							{
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
							{
								loader: "stylus-loader",
								options: {
									sourceMap: false,
									preferPathResolver: "webpack",
								},
							},
						],
					},
					/* config.module.rule('stylus').oneOf('vue') */
					{
						resourceQuery: /\?vue/,
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								loader: "css-loader",
								options: {
									sourceMap: false,
									importLoaders: 2,
								},
							},
							{
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
							{
								loader: "stylus-loader",
								options: {
									sourceMap: false,
									preferPathResolver: "webpack",
								},
							},
						],
					},
					/* config.module.rule('stylus').oneOf('normal-modules') */
					{
						test: /\.module\.\w+$/,
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								loader: "css-loader",
								options: {
									sourceMap: false,
									importLoaders: 2,
									modules: true,
									localIdentName: "[name]_[local]_[hash:base64:5]",
								},
							},
							{
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
							{
								loader: "stylus-loader",
								options: {
									sourceMap: false,
									preferPathResolver: "webpack",
								},
							},
						],
					},
					/* config.module.rule('stylus').oneOf('normal') */
					{
						use: [
							{
								loader:
									"C:\\project\\vueTest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
								options: {
									publicPath: "../",
								},
							},
							{
								loader: "css-loader",
								options: {
									sourceMap: false,
									importLoaders: 2,
								},
							},
							{
								loader: "postcss-loader",
								options: {
									sourceMap: false,
								},
							},
							{
								loader: "stylus-loader",
								options: {
									sourceMap: false,
									preferPathResolver: "webpack",
								},
							},
						],
					},
				],
			},
			/* config.module.rule('js') */
			{
				test: /\.jsx?$/,
				exclude: [
					(filepath) => {
						// always transpile js in vue files
						if (/\.vue\.jsx?$/.test(filepath)) {
							return false;
						}
						// exclude dynamic entries from cli-service
						if (filepath.startsWith(cliServicePath)) {
							return true;
						}
						// check if this is something the user explicitly wants to transpile
						if (
							options.transpileDependencies.some((dep) => {
								if (typeof dep === "string") {
									return filepath.includes(path.normalize(dep));
								} else {
									return filepath.match(dep);
								}
							})
						) {
							return false;
						}
						// Don't transpile node_modules
						return /node_modules/.test(filepath);
					},
				],
				use: [
					{
						// 在一些性能开销较大的 loader 之前添加此 loader，以将结果缓存到磁盘里。
						loader: "cache-loader",
						options: {
							cacheDirectory:
								"C:\\project\\vueTest\\node_modules\\.cache\\babel-loader",
							cacheIdentifier: "1218c33d",
						},
					},
					{
						// 把这个 loader 放置在其他 loader 之前， 放置在这个 loader 之后的 loader 就会在一个单独的 worker 池(worker pool)中运行
						// 每个 worker 都是一个单独的有 600ms 限制的 node.js 进程。同时跨进程的数据交换也会被限制。
						loader: "thread-loader",
					},
					{
						// 这个包允许使用Babel和webpack传输JavaScript文件。
						loader: "babel-loader",
					},
				],
			},
			/* config.module.rule('eslint') */
			{
				enforce: "pre",
				test: /\.(vue|(j|t)sx?)$/,
				exclude: [
					/node_modules/,
					"C:\\project\\vueTest\\node_modules\\@vue\\cli-service\\lib",
				],
				use: [
					{
						loader: "eslint-loader",
						options: {
							extensions: [".js", ".jsx", ".vue"],
							cache: true,
							cacheIdentifier: "c384f39c",
							emitWarning: true,
							emitError: false,
							formatter: function (results) {
								let errors = 0;
								let warnings = 0;
								let fixableErrors = 0;
								let fixableWarnings = 0;

								const resultsWithMessages = results.filter(
									(result) => result.messages.length > 0
								);

								let output = resultsWithMessages
									.reduce((resultsOutput, result) => {
										const messages = result.messages.map(
											(message) => `${formatMessage(message, result)}\n\n`
										);

										errors += result.errorCount;
										warnings += result.warningCount;
										fixableErrors += result.fixableErrorCount;
										fixableWarnings += result.fixableWarningCount;

										return resultsOutput.concat(messages);
									}, [])
									.join("\n");

								output += "\n";
								output += formatSummary(
									errors,
									warnings,
									fixableErrors,
									fixableWarnings
								);

								return errors + warnings > 0 ? output : "";
							},
						},
					},
				],
			},
		],
	},
	// 优化
	optimization: {
		minimizer: [
			{
				options: {
					test: /\.js(\?.*)?$/i,
					warningsFilter: function () {
						return true;
					},
					extractComments: false,
					sourceMap: false,
					cache: true,
					cacheKeys: function (defaultCacheKeys) {
						return defaultCacheKeys;
					},
					parallel: true,
					include: undefined,
					exclude: undefined,
					minify: undefined,
					uglifyOptions: {
						compress: {
							arrows: false,
							collapse_vars: false,
							comparisons: false,
							computed_props: false,
							hoist_funs: false,
							hoist_props: false,
							hoist_vars: false,
							inline: false,
							loops: false,
							negate_iife: false,
							properties: false,
							reduce_funcs: false,
							reduce_vars: false,
							switches: false,
							toplevel: false,
							typeofs: false,
							booleans: true,
							if_return: true,
							sequences: true,
							unused: true,
							conditionals: true,
							dead_code: true,
							evaluate: true,
						},
						output: {
							comments: /^\**!|@preserve|@license|@cc_on/,
						},
						mangle: {
							safari10: true,
						},
					},
				},
			},
		],
		splitChunks: {
			cacheGroups: {
				vendors: {
					name: "chunk-vendors",
					test: /[\\\/]node_modules[\\\/]/,
					priority: -10,
					chunks: "initial",
				},
				common: {
					name: "chunk-common",
					minChunks: 2,
					priority: -20,
					chunks: "initial",
					reuseExistingChunk: true,
				},
			},
		},
	},
	// webpack插件列表
	plugins: [
		/* config.plugin('vue-loader') */
		// 它的职责是将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块。例如，如果你有一条匹配 /\.js$/ 的规则，那么它会应用到 .vue 文件里的 <script> 块
		new VueLoaderPlugin(),
		/* config.plugin('define') */
		// DefinePlugin 中 process.env 键的简写方式。
		new DefinePlugin({
			"process.env": {
				NODE_ENV: '"production"',
				VUE_APP_CLI_UI_URL: '""',
				BASE_URL: '"/"',
			},
		}),
		/* config.plugin('case-sensitive-paths') */
		// 这个Webpack插件强制所有必需模块的完整路径与磁盘上实际路径的精确情况匹配。使用这个插件可以帮助缓解在OSX上工作的开发人员与其他开发人员发生冲突，或者构建运行其他操作系统的机器，这些操作系统需要正确使用大小写的路径。
		new CaseSensitivePathsPlugin(),
		/* config.plugin('friendly-errors') */
		// 识别某些类的webpack错误并清理、聚合和优先化它们，以提供更好的开发人员体验。
		new FriendlyErrorsWebpackPlugin({
			additionalTransformers: [
				(error) => {
					if (error.webpackError) {
						const message =
							typeof error.webpackError === "string"
								? error.webpackError
								: error.webpackError.message || "";
						for (const { re, msg, type } of rules) {
							const match = message.match(re);
							if (match) {
								return Object.assign({}, error, {
									// type is necessary to avoid being printed as defualt error
									// by friendly-error-webpack-plugin
									type,
									shortMessage: msg(error, match),
								});
							}
						}
						// no match, unknown webpack error without a message.
						// friendly-error-webpack-plugin fails to handle this.
						if (!error.message) {
							return Object.assign({}, error, {
								type: "unknown-webpack-error",
								shortMessage: message,
							});
						}
					}
					return error;
				},
			],
			additionalFormatters: [
				(errors) => {
					errors = errors.filter((e) => e.shortMessage);
					if (errors.length) {
						return errors.map((e) => e.shortMessage);
					}
				},
			],
		}),
		// 为每个引入 CSS 的 JS 文件创建一个 CSS 文件 提取css到一个css文件中
		/* config.plugin('extract-css') */
		new MiniCssExtractPlugin({
			filename: "css/[name].[contenthash:8].css",
			chunkFilename: "css/[name].[contenthash:8].css",
		}),
		/* config.plugin('optimize-css') */
		// 优化css
		new OptimizeCssnanoPlugin({
			sourceMap: false,
			cssnanoOptions: {
				preset: [
					"default",
					{
						mergeLonghand: false,
						cssDeclarationSorter: false,
					},
				],
			},
		}),
		// 该插件会根据模块的相对路径生成一个四位数的hash作为模块id, 建议用于生产环境。
		/* config.plugin('hash-module-ids') */
		new HashedModuleIdsPlugin({
			hashDigest: "hex",
		}),

		/* config.plugin('named-chunks') */
		new NamedChunksPlugin((chunk) => {
			if (chunk.name) {
				return chunk.name;
			}

			const hash = require("hash-sum");
			const joinedHash = hash(
				Array.from(chunk.modulesIterable, (m) => m.id).join("_")
			);
			return `chunk-` + joinedHash;
		}),
		// 简单创建 HTML 文件，用于服务器访问
		//
		/* config.plugin('html') */
		new HtmlWebpackPlugin({
			templateParameters: (compilation, assets, pluginOptions) => {
				// enhance html-webpack-plugin's built in template params
				let stats;
				return Object.assign(
					{
						// make stats lazy as it is expensive
						get webpack() {
							return stats || (stats = compilation.getStats().toJson());
						},
						compilation: compilation,
						webpackConfig: compilation.options,
						htmlWebpackPlugin: {
							files: assets,
							options: pluginOptions,
						},
					},
					resolveClientEnv(options, true /* raw */)
				);
			},
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true,
				collapseBooleanAttributes: true,
				removeScriptTypeAttributes: true,
			},
			template: "C:\\project\\vueTest\\public\\index.html",
		}),
		/* config.plugin('pwa') */
		new HtmlPwaPlugin({
			name: "vueTest",
		}),
		/* config.plugin('preload') */
		new PreloadPlugin({
			rel: "preload",
			include: "initial",
			fileBlacklist: [/\.map$/, /hot-update\.js$/],
		}),
		/* config.plugin('prefetch') */
		// 预取出普通的模块请求(module request)，可以让这些模块在他们被 import 或者是 require 之前就解析并且编译。使用这个预取插件可以提升性能。可以多试试在编译前记录时间(profile)来决定最佳的预取的节点。
		new PreloadPlugin({
			rel: "prefetch",
			include: "asyncChunks",
		}),
		// 将单个文件或整个目录复制到构建目录。
		/* config.plugin('copy') */
		new CopyWebpackPlugin([
			{
				from: "C:\\project\\vueTest\\public",
				to: "C:\\project\\vueTest\\dist",
				toType: "dir",
				ignore: ["index.html", ".DS_Store"],
			},
		]),
		/* config.plugin('workbox') */
		new GenerateSW({
			exclude: [/\.map$/, /img\/icons\//, /favicon\.ico$/, /manifest\.json$/],
			cacheId: "vueTest",
		}),
	],
	entry: {
		app: ["./src/main.js"],
	},
};
