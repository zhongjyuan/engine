var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var config = require("../webpack.server.config");

new WebpackDevServer(webpack(config), {
	hot: true,
	contentBase: __dirname,
	stats: {
		colors: true,
	},
}).listen(7078, "localhost", function (err) {
	if (err) {
		console.log(err);
	}

	console.log("Listening at localhost:7078");
});
