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

/**平台参数 */
const platform = process.argv.find((arg) => arg.match("platform")).split("=")[1];

/**
 * 将平台字符串转换为架构对象
 * @param {string} platform 平台字符串
 * @returns {Arch} 架构对象
 */
function toArch(platform) {
	// 根据平台字符串返回对应的架构对象
	switch (platform) {
		case "amd64":
			return Arch.x64;
		case "armhf":
			return Arch.armv7l;
		case "arm64":
			return Arch.arm64;
		default:
			return Arch.universal;
	}
}

/**
 * 包构建后执行的函数
 * @param {string} packagePath 包路径
 */
async function afterPackageBuilt(packagePath) {
	// 定义安装程序选项
	const installerOptions = {
		artifactName: `${name}-\${version}-\${arch}.rpm`, // 安装包文件名
		packageName: name, // 包名称
		icon: "icons/favicon.png", // 图标路径
		category: "Network;WebBrowser", // 类别
		packageCategory: "Network", // 包类别
		mimeTypes: ["x-scheme-handler/http", "x-scheme-handler/https", "text/html"], // MIME 类型
		synopsis: "Every day that follows will be the youngest day in the rest of my life!", // 简介
		description: "A System level workbench.", // 描述
		maintainer: "zhongjyuan <zhongjyuan@outlook.com>", // 维护者
		depends: [
			// 依赖
			"libsecret-1-0",
			"libasound2",
			"libc6",
			"libcap2",
			"libgtk2.0-0",
			"libudev0 | libudev1",
			"libgcrypt11 | libgcrypt20",
			"libnotify4",
			"libnss3",
			"libxss1",
			"libxtst6",
			"python | python3",
			"xdg-utils",
		],
		afterInstall: "resources/postinst_script", // 安装后执行的脚本
		afterRemove: "resources/prerm_script", // 移除后执行的脚本
	};

	// 定义构建选项
	const options = {
		linux: {
			target: ["deb"], // 目标为 deb 包
		},
		directories: {
			buildResources: "resources", // 构建资源路径
			output: "dist/app/", // 输出路径
		},
		deb: installerOptions, // deb 包选项
	};

	console.log("Creating package (this may take a while)");

	// 执行构建
	builder
		.build({
			prepackaged: path, // 预打包路径
			targets: Platform.LINUX.createTarget(["deb"], toArch(platform)), // 构建目标
			config: options, // 配置选项
		})
		.then(() => console.log("Successfully created package.")) // 构建成功
		.catch((err) => {
			// 构建出错
			console.error(err, err.stack);
			process.exit(1); // 退出进程
		});
}

// 创建 Linux 平台的包，并在构建完成后执行 afterPackageBuilt 函数
package("linux", { arch: toArch(platform) }).then(afterPackageBuilt);
