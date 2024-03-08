import logger from "@base/logger";
import { BROWSER } from "@common/consts/regular";
import { common as commonConsts } from "@common/consts/default";
import { isEmpty, isString } from "./default";

export default {
	type: logger.decorator(browserType, "tool-browser-type"),
	version: logger.decorator(browserVersion, "tool-browser-version"),
	resolution: logger.decorator(browserResolution, "tool-browser-resolution"),
	ie: logger.decorator(isIE, "tool-is-ie"),
	edge: logger.decorator(isEdge, "tool-is-edge"),
	opera: logger.decorator(isOpera, "tool-is-opera"),
	safari: logger.decorator(isSafari, "tool-is-safari"),
	chrome: logger.decorator(isChrome, "tool-is-chrome"),
	firefox: logger.decorator(isFirefox, "tool-is-firefox"),
};

/**
 * 获取指定用户代理字符串或当前浏览器类型
 * @param {string} [userAgent=navigator.userAgent] 用户代理字符串（可选）
 * @returns {string} 浏览器类型
 *
 * @example
 * browserType(); // 输出示例: "Chrome"
 * browserType("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"); // 输出示例: "Chrome"
 */
export function browserType(userAgent = navigator.userAgent) {
	var browserType = commonConsts.UNKNOWN;

	if (!isString(userAgent)) {
		logger.warn("[browserType] 参数警告：userAgent<${0}>不是字符串类型.", JSON.stringify(userAgent));
		return browserType + " | " + browserVersion;
	}

	if (isEmpty(userAgent)) {
		logger.warn("[browserType] 参数警告：userAgent<${0}>不能为空.", JSON.stringify(userAgent));
		return browserType;
	}

	userAgent = userAgent.toLowerCase();

	// 根据用户代理字符串判断浏览器类型
	if (BROWSER.opera.test(userAgent)) {
		browserType = BROWSER.operaName;
	} else if (BROWSER.firefox.test(userAgent)) {
		browserType = BROWSER.firefoxName;
	} else if (BROWSER.chrome.test(userAgent)) {
		browserType = BROWSER.chromeName;
	} else if (BROWSER.safari.test(userAgent)) {
		browserType = BROWSER.safariName;
	} else if (BROWSER.edge.test(userAgent)) {
		browserType = BROWSER.edgeName;
	} else if (BROWSER.ie.test(userAgent)) {
		browserType = BROWSER.ieName;
	}

	return browserType;
}

/**
 * 获取指定或当前浏览器的名称和版本号
 * @param {string} [userAgent=navigator.userAgent] 指定的用户代理字符串，默认为当前浏览器的用户代理字符串
 * @returns {string} 浏览器名称和版本号
 *
 * @example
 * browserVersion(); // 输出示例: "Chrome 91.0.4472.124"
 * browserVersion("Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)"); // 输出示例: "Internet Explorer 10.0"
 */
export function browserVersion(userAgent = navigator.userAgent) {
	var match = null;
	var browserType = commonConsts.UNKNOWN; // 默认浏览器名称为未知
	var browserVersion = commonConsts.UNKNOWN; // 默认版本号为空

	if (!isString(userAgent)) {
		logger.warn("[browserVersion] 参数警告：userAgent<${0}>不是字符串类型.", JSON.stringify(userAgent));
		return browserType + " | " + browserVersion;
	}

	if (isEmpty(userAgent)) {
		logger.warn("[browserVersion] 参数警告：userAgent<${0}>不能为空.", JSON.stringify(userAgent));
		return browserType + " | " + browserVersion;
	}

	userAgent = userAgent.toLowerCase();

	// 根据用户代理字符串判断浏览器名称和提取版本号
	if (BROWSER.opera.test(userAgent)) {
		browserType = BROWSER.operaName;
		match = userAgent.match(BROWSER.operaVersion); // 使用正则表达式提取版本号
	} else if (BROWSER.firefox.test(userAgent)) {
		browserType = BROWSER.firefoxName;
		match = userAgent.match(BROWSER.firefoxVersion); // 使用正则表达式提取版本号
	} else if (BROWSER.chrome.test(userAgent)) {
		browserType = BROWSER.chromeName;
		match = userAgent.match(BROWSER.chromeVersion); // 使用正则表达式提取版本号
	} else if (BROWSER.safari.test(userAgent)) {
		browserType = BROWSER.safariName;
		match = userAgent.match(BROWSER.safariVersion); // 使用正则表达式提取版本号
	} else if (BROWSER.edge.test(userAgent)) {
		browserType = BROWSER.edgeName;
		match = userAgent.match(BROWSER.edgeVersion); // 使用正则表达式提取版本号
	} else if (BROWSER.ie.test(userAgent)) {
		browserType = BROWSER.ieName;
		match = userAgent.match(BROWSER.ieVersion); // 使用正则表达式提取版本号
	}

	if (match !== null) {
		browserVersion = browserType === BROWSER.ieName ? match[2] : match[1]; // 提取到的版本号赋值给 fullVersion 变量
	}

	return browserType + " | " + browserVersion; // 返回浏览器名称和版本号的字符串
}

/**
 * 获取浏览器窗口的分辨率
 * @returns {Object} 包含浏览器窗口的宽度和高度的对象
 *
 * @example
 * var resolution = browserResolution();
 * console.log(resolution.width); // 输出浏览器窗口的宽度
 * console.log(resolution.height); // 输出浏览器窗口的高度
 */
export function browserResolution() {
	// 获取浏览器窗口的宽度
	var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

	// 获取浏览器窗口的高度
	var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

	// 返回包含浏览器窗口宽度和高度的对象
	return { width: width, height: height };
}

/**
 * 判断当前浏览器是否为 Internet Explorer (IE)
 * @returns {boolean} 如果当前浏览器是 IE，则返回 true；否则返回 false
 *
 * @example
 * var isIE = isIE();
 * console.log(isIE); // 可能输出 true 或 false
 *
 * @example
 * if (isIE()) {
 *     alert("您正在使用 Internet Explorer 浏览器");
 * } else {
 *     alert("您正在使用非 Internet Explorer 浏览器");
 * }
 */
export function isIE() {
	return browserType() === BROWSER.ieName;
}

/**
 * 判断当前浏览器是否为 Microsoft Edge 浏览器
 * @returns {boolean} 如果当前浏览器是 Microsoft Edge，则返回 true；否则返回 false
 *
 * @example
 * var isEdge = isEdge();
 * console.log(isEdge); // 可能输出 true 或 false
 *
 * @example
 * if (isEdge()) {
 *     alert("您正在使用 Microsoft Edge 浏览器");
 * } else {
 *     alert("您正在使用非 Microsoft Edge 浏览器");
 * }
 */
export function isEdge() {
	return browserType() === BROWSER.edgeName;
}

/**
 * 判断当前浏览器是否为 Opera 浏览器
 * @returns {boolean} 如果当前浏览器是 Opera，则返回 true；否则返回 false
 *
 * @example
 * var isOpera = isOpera();
 * console.log(isOpera); // 可能输出 true 或 false
 *
 * @example
 * if (isOpera()) {
 *     alert("您正在使用 Opera 浏览器");
 * } else {
 *     alert("您正在使用非 Opera 浏览器");
 * }
 */
export function isOpera() {
	return browserType() === BROWSER.operaName;
}

/**
 * 判断当前浏览器是否为 Chrome 浏览器
 * @returns {boolean} 如果当前浏览器是 Chrome，则返回 true；否则返回 false
 *
 * @example
 * var isChrome = isChrome();
 * console.log(isChrome); // 可能输出 true 或 false
 *
 * @example
 * if (isChrome()) {
 *     alert("您正在使用 Chrome 浏览器");
 * } else {
 *     alert("您正在使用非 Chrome 浏览器");
 * }
 */
export function isChrome() {
	return browserType() === BROWSER.chromeName;
}

/**
 * 判断当前浏览器是否为 Safari 浏览器
 * @returns {boolean} 如果当前浏览器是 Safari，则返回 true；否则返回 false
 *
 * @example
 * var isSafari = isSafari();
 * console.log(isSafari); // 可能输出 true 或 false
 *
 * @example
 * if (isSafari()) {
 *     alert("您正在使用 Safari 浏览器");
 * } else {
 *     alert("您正在使用非 Safari 浏览器");
 * }
 */
export function isSafari() {
	return browserType() === BROWSER.safariName;
}

/**
 * 判断当前浏览器是否为 Firefox 浏览器
 * @returns {boolean} 如果当前浏览器是 Firefox，则返回 true；否则返回 false
 *
 * @example
 * var isFirefox = isFirefox();
 * console.log(isFirefox); // 可能输出 true 或 false
 *
 * @example
 * if (isFirefox()) {
 *     alert("您正在使用 Firefox 浏览器");
 * } else {
 *     alert("您正在使用非 Firefox 浏览器");
 * }
 */
export function isFirefox() {
	return browserType() === BROWSER.firefoxName;
}
