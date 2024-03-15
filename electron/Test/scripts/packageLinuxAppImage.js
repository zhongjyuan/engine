/**electron-builder 库 */
const builder = require("electron-builder");

/**构建包函数 */
const package = require("./package.js");

/**package.json 文件 */
const packageFile = require("./../package.json");

/**架构对象 */
const Arch = builder.Arch;

/**平台对象 */
const Platform = builder.Platform;

/**项目名称 */
const name = packageFile.name;

/**项目版本 */
const version = packageFile.version;

/**
 * 包构建后执行的函数
 * @param {*} packagePath 包路径
 */
async function afterPackageBuilt(packagePath) {
	/**
	 * 构建配置选项
	 */
	const options = {
		linux: {
			target: ["AppImage"], // 设置目标为 AppImage
			icon: "icons/favicon.png", // 设置应用程序图标
			category: "Network", // 设置应用程序的类别
			packageCategory: "Network", // 设置打包的类别
			mimeTypes: ["x-scheme-handler/http", "x-scheme-handler/https", "text/html"], // 设置支持的 MIME 类型
			synopsis: "Every day that follows will be the youngest day in the rest of my life!", // 设置简介
			description: "A System level workbench.", // 设置描述
			maintainer: "zhongjyuan <zhongjyuan@outlook.com>", // 设置维护者
		},
		directories: {
			output: "dist/app/", // 设置输出目录
		},
	};

	console.log("Creating package (this may take a while)");

	builder
		.build({
			prepackaged: packagePath, // 设置事先打包好的路径
			targets: Platform.LINUX.createTarget(["AppImage"], Arch.x64), // 创建目标为 Linux 的 AppImage
			config: options, // 设置构建配置选项
		})
		.then(() => console.log("Successfully created package."))
		.catch((err) => {
			console.error(err, err.stack);
			process.exit(1);
		});
}

// 创建 Linux 平台的包，并在构建完成后执行 afterPackageBuilt 函数
package("linux", { arch: Arch.x64 }).then(afterPackageBuilt);
