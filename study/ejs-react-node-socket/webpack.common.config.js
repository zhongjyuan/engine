var webpack = require("webpack");

var ExtractTextPlugin = require("extract-text-webpack-plugin"); // css文件单独打包
var OptimizeCssplugin = require("optimize-css-assets-webpack-plugin"); // 压缩css文件

module.exports = {
	resolve: {
		extensions: ["", ".js", ".jsx"],
	},
};
