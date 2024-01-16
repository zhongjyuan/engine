import logger from "../logManagement";

export default {
	int: logger.decorator(randomInt, "tool-random-int"),
	string: logger.decorator(randomString, "tool-random-string"),
	color: logger.decorator(randomColor, "tool-random-color"),
};

/**
 * 生成指定范围内的随机整数
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @returns {number} - 返回指定范围内的随机整数
 *
 * @example
 * console.log(int(1, 10)); // 输出介于 1 和 10 之间的一个随机整数
 * console.log(int(-5, 5)); // 输出介于 -5 和 5 之间的一个随机整数
 */
export function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * 生成指定长度的随机字符串
 * @param {number} length - 字符串长度
 * @param {string[]} exclude - 要排除的字符数组（可选）
 * @param {string[]} append - 要追加的字符数组（可选）
 * @returns {string} - 返回生成的随机字符串
 *
 * @example
 * console.log(string(8)); // 输出一个包含大小写字母和数字的长度为 8 的随机字符串
 * console.log(string(10, ["a", "b"])); // 输出一个不包含字符 "a" 和 "b" 的长度为 10 的随机字符串
 * console.log(string(12, [], ["!", "@"])); // 输出一个包含大小写字母、数字以及字符 "!" 和 "@" 的长度为 12 的随机字符串
 */
export function randomString(length, exclude = [], append = []) {
	if (length < 1) {
		logger.error("[randomString] 参数异常：length<${0}>必须大于0.", JSON.stringify(length));
		return;
	}

	let { characters } = window.zhongjyuan.runtime.setting.random;
	let result = "";

	if (exclude.length > 0) {
		const excludeChars = exclude.join("");
		characters = characters.replace(new RegExp(`[${excludeChars}]`, "g"), "");
	}

	if (append.length > 0) {
		characters += append.join("");
	}

	for (let i = 0; i < length; i++) {
		const index = Math.floor(Math.random() * characters.length);
		result += characters.charAt(index);
	}

	return result;
}

/**
 * 生成一个随机的 RGB 颜色字符串
 * @returns {string} - 返回生成的随机 RGB 颜色字符串
 *
 * @example
 * console.log(color()); // 输出一个随机的 RGB 颜色字符串，如 "rgb(135,88,201)"
 */
export function randomColor() {
	let red = randomInt(0, 200);
	let green = randomInt(0, 200);
	let blue = randomInt(0, 200);
	return `rgb(${red},${green},${blue})`;
}
