import logger from "@base/logger";
import { common as commonConsts } from "@common/consts/default";
import { isEmpty } from "./default";

export default {
	os: logger.decorator(osType, "tool-os-type"),
	version: logger.decorator(osVersion, "tool-os-version"),
	resolution: logger.decorator(osResolution, "tool-os-resolution"),
	mac: logger.decorator(isMac, "tool-is-mac"),
	ios: logger.decorator(isIOS, "tool-is-ios"),
	linux: logger.decorator(isLinux, "tool-is-linux"),
	windows: logger.decorator(isWindows, "tool-is-windows"),
	android: logger.decorator(isAndroid, "tool-is-android"),
	mobile: logger.decorator(isMobile, "tool-is-mobile"),
};

/**
 * 获取用户操作系统名称
 *
 * @param {string} [userAgent=navigator.userAgent] - 可选的用户代理字符串，用于判断操作系统名称
 * @returns {string} - 操作系统名称，如 "Windows", "Mac OS", "Linux", "iOS", "Android" 或 "Unknown"
 *
 * @example
 * // 不传入参数，使用浏览器提供的用户代理字符串
 * const osName = osType();
 * console.log(osName); // 输出用户操作系统名称
 *
 * @example
 * // 传入自定义的用户代理字符串
 * const customUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.1234.0 Safari/537.36";
 * const osName = osType(customUserAgent);
 * console.log(osName); // 输出用户操作系统名称
 */
export function osType(userAgent = navigator.userAgent) {
	var systemType = commonConsts.UNKNOWN;

	if (!isString(userAgent)) {
		logger.warn("[osType] 参数警告：userAgent<${0}>不是字符串类型.", JSON.stringify(userAgent));
		return browserType + " | " + browserVersion;
	}

	if (isEmpty(userAgent)) {
		logger.warn("[osType] 参数警告：userAgent<${0}>不能为空.", JSON.stringify(userAgent));
		return systemType;
	}

	userAgent = userAgent.toLowerCase();

	if (/windows/.test(userAgent)) {
		systemType = "Windows"; // Windows 操作系统
	}

	if (/macintosh/.test(userAgent)) {
		systemType = "Mac OS"; // Mac OS 操作系统
	}

	if (/linux/.test(userAgent)) {
		systemType = "Linux"; // Linux 操作系统
	}

	if (/iphone|ipad|ipod/.test(userAgent)) {
		systemType = "iOS"; // iOS 操作系统（iPhone、iPad、iPod）
	}

	if (/android/.test(userAgent)) {
		systemType = "Android"; // Android 操作系统
	}

	return systemType; // 未知操作系统
}

/**
 * 获取操作系统版本信息
 * @param {string} [userAgent=navigator.userAgent] - 可选的用户代理字符串，用于判断操作系统版本
 * @returns {string} 操作系统版本信息
 *
 * @example
 * osVersion(); // 输出示例: "Windows 10"
 */
export function osVersion(userAgent = navigator.userAgent) {
	var systemType = commonConsts.UNKNOWN;
	var systemVersion = commonConsts.UNKNOWN;

	if (!isString(userAgent)) {
		logger.warn("[osVersion] 参数警告：userAgent<${0}>不是字符串类型.", JSON.stringify(userAgent));
		return browserType + " | " + browserVersion;
	}

	if (isEmpty(userAgent)) {
		logger.warn("[osVersion] 参数警告：userAgent<${0}>不能为空.", JSON.stringify(userAgent));
		return systemType + " | " + systemVersion;
	}
	userAgent = userAgent.toLowerCase();

	// 检测 Windows 操作系统
	if (/windows/.test(userAgent)) {
		systemType = "Windows";
		if (/windows nt 5.0/.test(userAgent)) {
			// Windows 2000
			systemVersion = "Windows 2000";
		} else if (/windows nt 5.1|windows xp/.test(userAgent)) {
			// Windows XP
			systemVersion = "Windows XP";
		} else if (/windows nt 5.2/.test(userAgent)) {
			// Windows Server 2003
			systemVersion = "Windows Server 2003";
		} else if (/windows nt 6.0/.test(userAgent)) {
			// Windows Vista
			systemVersion = "Windows Vista";
		} else if (/windows nt 6.1|windows 7/.test(userAgent)) {
			// Windows 7
			systemVersion = "Windows 7";
		} else if (/windows nt 6.2|windows 8/.test(userAgent)) {
			// Windows 8
			systemVersion = "Windows 8";
		} else if (/windows nt 6.3|windows 8.1/.test(userAgent)) {
			// Windows 8.1
			systemVersion = "Windows 8.1";
		} else if (/windows nt 10.0|windows 10/.test(userAgent)) {
			// Windows 10
			systemVersion = "Windows 10";
		}
	}

	// 检测 macOS
	if (/macintosh/.test(userAgent)) {
		systemType = "Mac OS";

		if (/mac os x 10_0/.test(userAgent)) {
			// Cheetah
			systemVersion = "Cheetah";
		} else if (/mac os x 10_1/.test(userAgent)) {
			// Puma
			systemVersion = "Puma";
		} else if (/mac os x 10_2/.test(userAgent)) {
			// Jaguar
			systemVersion = "Jaguar";
		} else if (/mac os x 10_3/.test(userAgent)) {
			// Panther
			systemVersion = "Panther";
		} else if (/mac os x 10_4/.test(userAgent)) {
			// Tiger
			systemVersion = "Tiger";
		} else if (/mac os x 10_5/.test(userAgent)) {
			// Leopard
			systemVersion = "Leopard";
		} else if (/mac os x 10_6/.test(userAgent)) {
			// Snow Leopard
			systemVersion = "Snow Leopard";
		} else if (/mac os x 10_7/.test(userAgent)) {
			// Lion
			systemVersion = "Lion";
		} else if (/mac os x 10_8/.test(userAgent)) {
			// Mountain Lion
			systemVersion = "Mountain Lion";
		} else if (/mac os x 10_9/.test(userAgent)) {
			// Mavericks
			systemVersion = "Mavericks";
		} else if (/mac os x 10_10/.test(userAgent)) {
			// Yosemite
			systemVersion = "Yosemite";
		} else if (/mac os x 10_11/.test(userAgent)) {
			// El Capitan
			systemVersion = "El Capitan";
		} else if (/mac os x 10_12/.test(userAgent)) {
			// Sierra
			systemVersion = "Sierra";
		} else if (/mac os x 10_13/.test(userAgent)) {
			// High Sierra
			systemVersion = "High Sierra";
		} else if (/mac os x 10_14/.test(userAgent)) {
			// Mojave
			systemVersion = "Mojave";
		} else if (/mac os x 10_15/.test(userAgent)) {
			// Catalina
			systemVersion = "Catalina";
		} else if (/mac os x 11_0/.test(userAgent) || /mac os 11_0/.test(userAgent)) {
			// Big Sur
			systemVersion = "Big Sur";
		}
	}

	// 检测 iOS 设备
	if (/iphone|ipad|ipod/.test(userAgent)) {
		systemType = "iOS";

		var match = userAgent.match(/os (\d+)_(\d+)_?(\d+)?/);
		if (match !== null) {
			systemVersion = [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3] || 0, 10)];
			systemVersion = systemVersion.join(".");
		}
	}

	// 检测 Android 设备
	if (/android/.test(userAgent)) {
		systemType = "Android";

		var match = userAgent.match(/android\s([0-9\.]*)/);
		if (match !== null) {
			systemVersion = match[1];
		}
	}

	return systemType + " | " + systemVersion;
}

/**
 * 获取操作系统的屏幕分辨率
 * @returns {object} 包含屏幕宽度和高度的对象
 *
 * @example
 * osResolution(); // 输出示例: { width: 1920, height: 1080 }
 */
export function osResolution() {
	return {
		width: window.screen.width,
		height: window.screen.height,
	};
}

/**
 * 判断当前操作系统是否为 macOS
 * @returns {boolean} 如果当前操作系统是 macOS，则返回 true；否则返回 false
 *
 * @example
 * var isMac = isMac();
 * console.log(isMac); // 可能输出 true 或 false
 *
 * @example
 * if (isMac()) {
 *     alert("您正在使用 macOS 操作系统");
 * } else {
 *     alert("您正在使用非 macOS 操作系统");
 * }
 */
export function isMac() {
	return osType() === "Mac";
}

/**
 * 判断当前操作系统是否为 iOS
 * @returns {boolean} 如果当前操作系统是 iOS，则返回 true；否则返回 false
 *
 * @example
 * var isIOS = isIOS();
 * console.log(isIOS); // 可能输出 true 或 false
 *
 * @example
 * if (isIOS()) {
 *     alert("您正在使用 iOS 操作系统");
 * } else {
 *     alert("您正在使用非 iOS 操作系统");
 * }
 */
export function isIOS() {
	return osType() === "iOS";
}

/**
 * 判断当前操作系统是否为 Linux
 * @returns {boolean} 如果当前操作系统是 Linux，则返回 true；否则返回 false
 *
 * @example
 * var isLinux = isLinux();
 * console.log(isLinux); // 可能输出 true 或 false
 *
 * @example
 * if (isLinux()) {
 *     alert("您正在使用 Linux 操作系统");
 * } else {
 *     alert("您正在使用非 Linux 操作系统");
 * }
 */
export function isLinux() {
	return osType() === "Linux";
}

/**
 * 判断当前操作系统是否为 Windows
 * @returns {boolean} 如果当前操作系统是 Windows，则返回 true；否则返回 false
 *
 * @example
 * var isWindows = isWindows();
 * console.log(isWindows); // 可能输出 true 或 false
 *
 * @example
 * if (isWindows()) {
 *     alert("您正在使用 Windows 操作系统");
 * } else {
 *     alert("您正在使用非 Windows 操作系统");
 * }
 */
export function isWindows() {
	return osType() === "Windows";
}

/**
 * 判断当前操作系统是否为 Android
 * @returns {boolean} 如果当前操作系统是 Android，则返回 true；否则返回 false
 *
 * @example
 * var isAndroid = isAndroid();
 * console.log(isAndroid); // 可能输出 true 或 false
 *
 * @example
 * if (isAndroid()) {
 *     alert("您正在使用 Android 操作系统");
 * } else {
 *     alert("您正在使用非 Android 操作系统");
 * }
 */
export function isAndroid() {
	return osType() === "Android";
}

/**
 * 判断当前设备是否为移动设备（手机或平板）
 * @param {string} [userAgent=navigator.userAgent] 可选的用户代理字符串，用于判断当前设备是否为移动设备
 * @returns {boolean} 如果当前设备是移动设备，则返回 true；否则返回 false
 *
 * @example
 * var isMobile = isMobile();
 * console.log(isMobile); // 可能输出 true 或 false
 *
 * @example
 * if (isMobile()) {
 *     alert("您正在使用移动设备");
 * } else {
 *     alert("您正在使用非移动设备");
 * }
 */
export function isMobile(userAgent = navigator.userAgent) {
	return window.zhongjyuan.const.regular.MOBILE.test(userAgent);
}
