/**文件流模块 */
const fs = require("fs");

/**压缩模块 */
const archiver = require("archiver");

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
	/* 如果输出目录不存在，则创建输出目录 */
	if (!fs.existsSync("dist/app")) {
		// 如果输出目录不存在
		fs.mkdirSync("dist/app"); // 创建输出目录
	}

	/* 创建 zip 文件 */
	var output = fs.createWriteStream("dist/app/" + name + "-v" + version + "-windows" + (packagePath.includes("ia32") ? "-ia32" : "") + ".zip"); // 创建 zip 文件

	// 创建一个 archiver 对象，用于压缩文件为 zip 格式
	var archive = archiver("zip", {
		zlib: { level: 9 }, // 设置压缩级别为最高
	});

	archive.directory(packagePath, name + "-v" + version); // 将 packagePath 目录下的文件添加到压缩包中
	archive.pipe(output); // 将压缩包数据流导向 output
	await archive.finalize(); // 完成压缩

	// 如果不是 32 位架构
	if (!packagePath.includes("ia32")) {
		// 引入 electron-installer-windows 模块
		const installer = require("electron-installer-windows");

		const options = {
			src: packagePath, // 源文件路径
			icon: "icons/favicon.ico", // 图标路径
			dest: "dist/app/" + name + "-installer-x64", // 目标路径
			animation: "icons/windows-installer.gif", // 安装过程中的动画路径
			licenseUrl: "https://gitee.com/zhongjyuan-team/workbench/blob/master/LICENSE", // 许可证链接
			noMsi: true, // 不生成 MSI 安装文件
		};

		console.log("Creating package (this may take a while)");

		// 复制许可证文件到包目录下
		fs.copyFileSync("LICENSE", packagePath + "/LICENSE");

		// 创建安装程序
		await installer(options)
			.then(function () {
				fs.renameSync(
					"./dist/app/" + name + "-installer-x64/" + name + "-" + version + "-setup.exe",
					"./dist/app/" + name + "-" + version + "-setup.exe"
				); // 重命名安装程序文件
			})
			.catch((err) => {
				console.error(err, err.stack);
				process.exit(1);
			});
	}
}

// 同时创建多个包会导致 electron-rebuild 出错，所以改为逐个构建不同架构的包
package("win32", { arch: Arch.x64 }) // 创建 64 位架构的包
	.then(afterPackageBuilt) // 构建完成后执行 afterPackageBuilt 函数
	.then(function () {
		return createPackage("win32", { arch: Arch.ia32 }); // 创建 32 位架构的包
	})
	.then(afterPackageBuilt); // 构建完成后执行 afterPackageBuilt 函数
