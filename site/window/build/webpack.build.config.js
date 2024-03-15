const fs = require("fs");
const path = require("path");
const glob = require("glob");

const { merge } = require("webpack-merge");
const baseConf = require("./webpack.config");

// const glob = require("glob-all");
const CleanCSS = require("clean-css");
const UglifyJs = require("uglify-js");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MergeJsonFilesPlugin = require("./plugins/merge-json-files-plugin");

/**
 * 窗体首页文件
 * @author zhongjyuan
 * @date   2023年6月26日11:50:43
 * @email  zhongjyuan@outlook.com
 * @param {*} directory 遍历目录路劲
 * @returns
 */
function windowIndexFiles(directory) {
	const srcPath = path.resolve(__dirname, "../src");
	let htmlFiles = [];

	const files = fs.readdirSync(directory);

	for (const file of files) {
		const filePath = path.join(directory, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			if (file === "demo" || file === "window-react") continue;
			htmlFiles = htmlFiles.concat(windowIndexFiles(filePath));
		} else if (file.endsWith(".html")) {
			const relativePath = path.relative(srcPath, filePath);
			htmlFiles.push(relativePath);
		}
	}

	return htmlFiles;
}

/**窗体首页集合 */
const windowIndexs = windowIndexFiles(path.resolve(__dirname, "../src/program"));

/**窗体Html处理插件集合 */
const windowHtmlPlugins = windowIndexs.map((file) => {
	const filename = file.replace("\\index.html", "");

	// 窗体需要排除main.js，window.js与component.js
	let excludeChunks = ["main", "component", "window"];
	if (filename.endsWith("system")) {
		excludeChunks = ["window"];
	} else if (filename.endsWith("colorPicker")) {
		excludeChunks = ["main", "window"];
	}

	return new HtmlWebpackPlugin({
		filename: `${filename}/index.html`,
		template: `./src/${filename}/index.html`,
		inject: "head",
		excludeChunks: excludeChunks,
		minify: {
			minifyJS: true,
			minifyCSS: true,
			removeComments: true,
			useShortDoctype: true,
			collapseWhitespace: true,
		},
	});
});

/**
 * Webpack打包配置
 * @author zhongjyuan
 * @date   2023年5月17日14:11:50
 * @email  zhongjyuan@outlook.com
 */
module.exports = merge(baseConf, {
	plugins: [
		new MergeJsonFilesPlugin({
			pattern: "src/configuration/basic/*.json",
			filename: "basic.json",
			outputPath: "dist/config",
		}),
		new MergeJsonFilesPlugin({
			pattern: "src/configuration/store/*.json",
			filename: "store.json",
			outputPath: "dist/config",
		}),
		...windowHtmlPlugins,
		new CopyWebpackPlugin({
			patterns: [
				// 压缩 JS
				{
					from: "./src/components",
					to: "components",
					transform(content, path) {
						if (path.endsWith(".js")) {
							let res = UglifyJs.minify(content.toString());
							return res.error ? content : res.code;
						}
						if (path.endsWith(".css")) {
							return new CleanCSS({ level: 1 }).minify(content).styles;
						}
						// TODO: 图片类型与字体类型压缩
						return content;
					},
					transformPath(targetPath, absolutePath) {
						return targetPath.replace("src", "");
					},
					globOptions: {
						ignore: ["**/custom/**"],
					},
				},
				{ from: "./src/static/favicon.ico", to: "" },
				{ from: "./src/static/js/use", to: "static/use" },
				{ from: "./src/static/icon", to: "assets/icon" },
				{ from: "./src/static/image", to: "assets/image" },
				{ from: "./src/static/media", to: "assets/media" },
				{ from: "./src/configuration/langs", to: "config/langs" },
				{
					from: "./src/program",
					to: "program",
					filter: (resourcePath) => {
						const regex = /index.html/;
						return !regex.test(resourcePath) || resourcePath.includes("/demo/");
					},
				},
			],
		}),
	],
});
