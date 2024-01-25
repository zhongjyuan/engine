import _debug from "debug";
const debug = _debug("global");

/**
 * 检查当前环境是否为浏览器环境
 * @returns {boolean} - 如果当前环境为浏览器环境，则返回 true；否则返回 false。
 *
 * @example
 * const browserEnv = isBrowserEnv();
 * console.log(browserEnv); // 输出 true 或 false，表示当前环境是否为浏览器环境
 */
export function isBrowserEnv() {
	return typeof window !== "undefined" && typeof document !== "undefined" && typeof document.createElement === "function";
}

/**
 * 格式化数字，将数字转换为指定长度的字符串，并在不足长度时在前面补零
 * @param {number} number - 要格式化的数字
 * @param {number} length - 格式化后的字符串长度
 * @returns {string} - 格式化后的字符串
 *
 * @example
 * const formattedNumber = formatNumber(5, 3);
 * console.log(formattedNumber); // 输出 "005"
 *
 * const formattedNumber2 = formatNumber(123, 2);
 * console.log(formattedNumber2); // 输出 "123"
 */
export function formatNumber(number, length) {
	number = (isNaN(number) ? 0 : number).toString();
	let paddingLength = length - number.length;

	return paddingLength > 0 ? [new Array(paddingLength + 1).join("0"), number].join("") : number;
}

/**
 * 生成一个随机数字符串，用于设置 Cookie 中的 pgv_pvi 和 pgv_si 属性
 * @param {string} [prefix=""] - 字符串前缀
 * @returns {string} - 随机数字符串
 *
 * @example
 * const string = randomString("prefix"); // 生成以 "prefix" 为前缀的随机数字符串
 * console.log(string); // 输出类似于 "prefix1234567890" 的字符串
 */
export function randomString(prefix = "") {
	const randomNum = Math.round(Math.random() || 0.5) * 2147483647;
	const currentTimeStamp = +new Date() % 1e10;
	const randomString = `${prefix}${randomNum * currentTimeStamp}`;

	return randomString;
}

/**
 * 生成客户端消息 ID
 * @returns {string} - 客户端消息 ID
 */
export function generateClientMsgID() {
	return (Date.now() + Math.random().toFixed(3)).replace(".", "");
}

/**
 * 生成设备 ID
 * @returns {string} - 设备 ID
 */
export function generateDeviceID() {
	return "e" + ("" + Math.random().toFixed(15)).substring(2, 17);
}

/**
 * 将包含表情符号的字符串转换为对应的 Unicode 表情字符
 * @param {string} inputString - 包含表情符号的字符串
 * @returns {string} - 转换后的字符串
 */
export function convertEmoji(inputString) {
	// 如果输入字符串为空，则返回空字符串
	if (!inputString) {
		return "";
	}

	// 表情符号映射关系
	const emojiMap = {
		"1f639": "1f602", // 替换 1f639 表情为 1f602
		"1f64d": "1f614", // 替换 1f64d 表情为 1f614
	};

	try {
		// 使用正则表达式替换匹配到的表情符号
		return inputString.replace(/<span.*?class="emoji emoji(.*?)"><\/span>/g, (match, capture) => {
			const emojiCode = emojiMap[capture.toLowerCase()] || capture;

			const codePoints = [];
			if (emojiCode.length === 4 || emojiCode.length === 5) {
				codePoints.push("0x" + emojiCode); // 添加第一个代码点
			} else if (emojiCode.length === 8) {
				codePoints.push("0x" + emojiCode.slice(0, 4)); // 添加第一个代码点
				codePoints.push("0x" + emojiCode.slice(4, 8)); // 添加第二个代码点
			} else if (emojiCode.length === 10) {
				codePoints.push("0x" + emojiCode.slice(0, 5)); // 添加第一个代码点
				codePoints.push("0x" + emojiCode.slice(5, 10)); // 添加第二个代码点
			} else {
				throw new Error("Unknown emoji characters"); // 抛出错误，表示未知的表情字符
			}

			return String.fromCodePoint(...codePoints); // 使用代码点生成 Unicode 表情字符
		});
	} catch (error) {
		debug(error);
		return "*"; // 发生错误时返回星号作为占位符
	}
}
