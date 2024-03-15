/**electron-builder 库 */
const builder = require("electron-builder");

/**架构对象 */
const Arch = builder.Arch;

/**平台对象 */
const Platform = builder.Platform;

/**
 * 将平台和架构转换为路径
 * @param {*} platform 平台类型
 * @param {*} arch 架构类型
 * @returns 对应的路径
 */
function toPath(platform, arch) {
	// 如果是 Windows 平台
	if (platform == "win32") {
		switch (arch) {
			case Arch.ia32: // 如果是 32 位架构
				return "dist/app/win-ia32-unpacked"; // 返回对应的路径
			default:
				return "dist/app/win-unpacked"; // 返回默认路径
		}
	}

	// 如果是 Linux 平台
	else if (platform == "linux") {
		switch (arch) {
			case Arch.x64: // 如果是 64 位架构
				return "dist/app/linux-unpacked"; // 返回对应的路径
			case Arch.armv7l: // 如果是 ARM v7 架构
				return "dist/app/linux-armv7l-unpacked"; // 返回对应的路径
			case Arch.arm64: // 如果是 ARM 64 架构
				return "dist/app/linux-arm64-unpacked"; // 返回对应的路径
			default:
				return "dist/app/linux-unpacked"; // 返回默认路径
		}
	}

	// 如果是 MacOS 平台
	else if (platform == "mac") {
		switch (arch) {
			case Arch.arm64: // 如果是 ARM 64 架构
				return "dist/app/mac-arm64"; // 返回对应的路径
			case Arch.x64: // 如果是 64 位架构
				return "dist/app/mac"; // 返回对应的路径
			default:
				return "dist/app/mac"; // 返回默认路径
		}
	}
}

/**
 * 打包函数
 * @param {*} platform 平台类型
 * @param {*} extraOptions 额外参数
 * @returns
 */
module.exports = function (platform, extraOptions) {
	const options = {
		files: [
			// 包含的文件和排除的文件列表
			"**/*",
			"!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}",
			"!**/{appveyor.yml,.travis.yml,circle.yml}",
			"!**/node_modules/*.d.ts",
			"!**/*.map",
			"!**/*.md",
			"!**/._*",
			"!**/icons/source",
			"!**/icons/favicon.icns",
			"!dist/app",
			"!localization/",
			"!scripts/",
			"!**/src/main",
			"!**/node_modules/@types/",
			"!**/node_modules/pdfjs-dist/legacy",
			"!**/node_modules/pdfjs-dist/lib",
			"!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}",
		],
		linux: {
			target: [
				// Linux 目标设置
				{
					target: "dir", // 目标类型为目录
					arch: ["x64", "armv7l", "ia32", "arm64"], // 支持的架构
				},
			],
		},
		win: {
			// Windows 目标设置
			target: "dir", // 目标类型为目录
			icon: "icons/favicon.ico", // 设置图标路径
		},
		mac: {
			// MacOS 目标设置
			icon: "icons/favicon.icns", // 设置图标路径
			target: "dir", // 目标类型为目录
			darkModeSupport: true, // 启用暗黑模式支持
			extendInfo: {
				// 扩展信息设置
				NSHumanReadableCopyright: null,
				CFBundleDocumentTypes: [
					// MacOS 文档类型设置
					{
						CFBundleTypeName: "HTML document",
						CFBundleTypeRole: "Viewer",
						LSItemContentTypes: ["public.html"],
					},
					{
						CFBundleTypeName: "XHTML document",
						CFBundleTypeRole: "Viewer",
						LSItemContentTypes: ["public.xhtml"],
					},
				],
				NSUserActivityTypes: ["NSUserActivityTypeBrowsingWeb"], // macOS handoff support
				LSFileQuarantineEnabled: true, // https://github.com/minbrowser/min/issues/2073
			},
		},
		directories: {
			// 目录设置
			output: "dist/app", // 输出目录路径
			buildResources: "resources", // 构建资源目录路径
		},
		protocols: [
			// 协议设置
			{
				name: "HTTP link",
				schemes: ["http", "https"], // 支持的协议
			},
			{
				name: "File",
				schemes: ["file"], // 支持的协议
			},
		],
		asar: false, // 是否使用 asar 打包
	};

	let target = (function () {
		// 根据平台和额外选项创建目标
		if (platform == "win32") {
			// 如果是 Windows 平台
			return Platform.WINDOWS.createTarget(["dir"], extraOptions.arch); // 创建相应的目标
		} else if (platform == "linux") {
			// 如果是 Linux 平台
			return Platform.LINUX.createTarget(["dir"], extraOptions.arch); // 创建相应的目标
		} else if (platform == "mac") {
			// 如果是 MacOS 平台
			return Platform.MAC.createTarget(["dir"], extraOptions.arch); // 创建相应的目标
		}
	})();

	return builder
		.build({
			targets: target, // 设置目标
			config: options, // 设置配置选项
		})
		.then(() => {
			// 返回构建完成后的路径
			return Promise.resolve(toPath(platform, extraOptions.arch));
		});
};
