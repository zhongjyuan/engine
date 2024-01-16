import logger from "../logManagement";

export default {
	isLandscape: logger.decorator(isLandscape, "tool-is-landscape"),
	isSmallScreen: logger.decorator(isSmallScreen, "tool-is-small-screen"),
};

/**
 * 判断当前设备是否处于横屏模式（宽度大于高度）
 * @returns {boolean} 如果当前设备处于横屏模式，则返回 true；否则返回 false
 *
 * @example
 * var isLandscape = isLandscape();
 * console.log(isLandscape); // 可能输出 true 或 false
 *
 * @example
 * if (isLandscape()) {
 *     alert("您的设备处于横屏模式");
 * } else {
 *     alert("您的设备处于竖屏模式");
 * }
 */
export function isLandscape() {
	var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

	return width > height;
}

/**
 * 判断当前屏幕宽度是否小于指定阈值
 * @param {number} [threshold=768] 指定的阈值，如果未提供则默认为 768
 * @returns {boolean} 如果当前屏幕宽度小于阈值，则返回 true；否则返回 false
 *
 * @example
 * var isSmallScreen = isSmallScreen();
 * console.log(isSmallScreen); // 可能输出 true 或 false
 *
 * @example
 * if (isSmallScreen()) {
 *     alert("您正在使用小屏幕设备");
 * } else {
 *     alert("您正在使用非小屏幕设备");
 * }
 *
 * @example
 * var customThreshold = 1024;
 * var isSmallScreen = checkIfSmallScreen(customThreshold);
 * console.log(isSmallScreen); // 可能输出 true 或 false
 */
export function isSmallScreen(threshold) {
	if (!threshold) {
		threshold = window.zhongjyuan.runtime.setting.screen.smallThreshold;
	}

	var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

	return width < threshold;
}
