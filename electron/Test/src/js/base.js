/**
 * 将一个数值限制在指定的范围内。
 * @param {number} n - 需要被限制的数值。
 * @param {number} min - 限制的最小值。
 * @param {number} max - 限制的最大值。
 * @returns {number} - 被限制在指定范围内的数值。
 */
function clamp(n, min, max) {
	return Math.max(Math.min(n, max), min);
}

/**
 * 从域名字符串中移除 'www.' 前缀
 * @param {string} domain - 要处理的域名字符串
 * @returns {string} 处理后的域名字符串
 */
function removeWWW(domain) {
	return domain.replace(/^www\./i, "");
}

/**
 * 防抖函数
 * @param {Function} fn - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} - 经过防抖处理后的函数
 */
function debounce(fn, delay) {
	var timer = null;
	return function () {
		var context = this;
		var args = arguments;
		clearTimeout(timer);
		timer = setTimeout(function () {
			fn.apply(context, args);
		}, delay);
	};
}

/**
 * 节流函数
 * @param {Function} fn - 要执行的函数
 * @param {number} threshhold - 间隔时间（毫秒）
 * @param {Object} scope - 函数执行的作用域
 * @returns {Function} - 经过节流处理后的函数
 */
function throttle(fn, threshhold, scope) {
	threshhold || (threshhold = 250);
	var last, deferTimer;
	return function () {
		var context = scope || this;

		var now = +new Date();
		var args = arguments;
		if (last && now < last + threshhold) {
			// 如果在指定的间隔时间内再次触发函数，则清除之前的延迟执行，并重新设置新的延迟执行
			clearTimeout(deferTimer);
			deferTimer = setTimeout(function () {
				last = now;
				fn.apply(context, args);
			}, threshhold);
		} else {
			last = now;
			fn.apply(context, args);
		}
	};
}

/**定义主题对应的颜色值 */
const metaThemeValues = {
	light: "#fff",
	dark: "rgb(36, 41, 47)",
	sepia: "rgb(247, 231, 199)",
};

/**
 * 判断当前时间是否为夜间模式。
 * @returns {boolean} 如果是夜间模式返回 true，否则返回 false。
 */
function isNight() {
	var hours = new Date().getHours();
	return hours > 21 || hours < 6;
}

/**
 * 格式化驼峰命名格式的字符串，将首字母大写并用空格分隔单词。
 * @param {string} text - 驼峰命名格式的字符串。
 * @returns {string} - 格式化后的字符串。
 */
function formatCamelCase(text) {
	var result = text.replace(/([A-Z])/g, " $1");
	return result.charAt(0).toUpperCase() + result.slice(1);
}
