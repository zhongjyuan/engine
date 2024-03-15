/**文件流模块 */
const fs = require("fs");

/**路径模块 */
const path = require("path");

/**压缩模块 */
const archiver = require("archiver");

/**同步执行外部命令模块 */
const { execSync } = require("child_process");

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
 * 转架构对象
 * @param {*} platform 平台类型
 * @returns
 */
function toArch(platform) {
	switch (platform) {
		case "x86":
			return Arch.x64;
		case "arm64":
			return Arch.arm64;
	}
}

/**
 * 包构建后执行的函数
 * @param {*} packagePath 包路径
 */
async function afterPackageBuilt(packagePath) {
	if (platform === "arm64") {
		// 对于 arm64 平台，执行签名命令
		execSync("codesign -s - -a arm64 -f --deep " + packagePath + "/" + name + ".app");
	}

	/* 如果输出目录不存在，则创建输出目录 */
	if (!fs.existsSync("dist/app")) {
		fs.mkdirSync("dist/app");
	}

	/* 创建 zip 文件 */
	var output = fs.createWriteStream("dist/app/" + name + "-v" + version + "-mac-" + platform + ".zip");
	var archive = archiver("zip", {
		zlib: { level: 9 }, // 设置压缩级别为最高
	});

	archive.directory(path.resolve(packagePath, name + ".app"), name + ".app"); // 将指定路径下的文件添加到压缩包中

	archive.pipe(output); // 将压缩包数据流导向 output
	archive.finalize(); // 完成压缩
}

// 创建指定平台和架构的包，并在构建完成后执行 afterPackageBuilt 函数
package("mac", { arch: toArch(platform) }).then(afterPackageBuilt);
