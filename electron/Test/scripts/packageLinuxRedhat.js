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
 * 将平台字符串转换为架构对象
 * @param {string} platform 平台字符串
 * @returns {Arch} 架构对象
 */
function toArch(platform) {
	switch (platform) {
		case "amd64":
			return Arch.x64;
		case "armhf":
			return Arch.armv71;
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
	const installerOptions = {
		artifactName: `${name}-\${version}-\${arch}.rpm`,
		packageName: name,
		icon: "icons/favicon.png",
		category: "Network",
		packageCategory: "Network",
		mimeTypes: ["x-scheme-handler/http", "x-scheme-handler/https", "text/html"], // 设置支持的 MIME 类型
		synopsis: "Every day that follows will be the youngest day in the rest of my life!", // 设置简介
		description: "A System level workbench.", // 设置描述
		maintainer: "zhongjyuan <zhongjyuan@outlook.com>", // 设置维护者
	};

	const options = {
		linux: {
			target: ["rpm"],
		},
		directories: {
			output: "dist/app/",
		},
		rpm: installerOptions,
	};

	console.log("Creating package (this may take a while)");

	builder
		.build({
			prepackaged: path,
			targets: Platform.LINUX.createTarget(["rpm"], Arch.x64),
			config: options,
		})
		.then(() => console.log("Successfully created package."))
		.catch((err) => {
			console.error(err, err.stack);
			process.exit(1);
		});
}

// 创建 Linux 平台的包，并在构建完成后执行 afterPackageBuilt 函数
package("linux", { arch: Arch.x64 }).then(afterPackageBuilt);
