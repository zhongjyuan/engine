import logger from "@base/logger";
import { HTML } from "@common/consts/regular";
import { isInt, isArray, isString, isNumber, isFunction, isNumeric, isNullOrUndefined, isUndefined, isDate, isNull, isEmpty } from "./default";

export default {
	specialcharToEncode: logger.decorator(specialcharToEncode, "tool-specialchar-to-encode"),
	specialcharToDecode: logger.decorator(specialcharToDecode, "tool-specialchar-to-decode"),
	escapeHtml: logger.decorator(escapeHtml, "tool-escape-html"),
	unescapeHtml: logger.decorator(unescapeHtml, "tool-unescape-html"),
	matchPairHtml: logger.decorator(matchPairHtml, "tool-match-pair-html"),
	removeWhitespace: logger.decorator(removeWhitespace, "tool-remove-whitespace"),
	truncateWithEllipsis: logger.decorator(truncateWithEllipsis, "tool-truncate-with-ellipsis"),
	camelCase: logger.decorator(camelCase, "tool-camel-case"),
	reverseCamelCase: logger.decorator(reverseCamelCase, "tool-reverse-camel-case"),
	capitalize: logger.decorator(capitalize, "tool-capitalize"),
	capitalizeTypeName: logger.decorator(capitalizeTypeName, "tool-capitalize-type-name"),
	extractFunctionDoc: logger.decorator(extractFunctionDoc, "tool-extract-function-doc"),
	parseInt: logger.decorator(parseInt1, "tool-parse-int"),
	parseDate: logger.decorator(parseDate, "tool-parse-date"),
	parseDecimal: logger.decorator(parseDecimal, "tool-parse-decimal"),
	parsePercent: logger.decorator(parsePercent, "tool-parse-percent"),
	parseThousands: logger.decorator(parseThousands, "tool-parse-thousands"),
	amountToChinese: logger.decorator(amountToChinese, "tool-amount-to-chinese"),
	parseDocumentFragment: logger.decorator(parseDocumentFragment, "tool-parse-document-fragment"),
	formatUrl: logger.decorator(formatUrl, "tool-format-url"),
	formatJson: logger.decorator(formatJson, "tool-format-json"),
	formatDate: logger.decorator(formatDate, "tool-format-date"),
	formatString: logger.decorator(formatString, "tool-format-string"),
	formatTimestamp: logger.decorator(formatTimestamp, "tool-format-timestamp"),
};

/**
 * 将字符串中的特殊字符进行转义编码
 * @param {string} str - 需要进行转义编码的字符串
 * @returns {string} - 转义编码后的字符串
 *
 * @example
 * const result1 = specialcharToEncode("Hello & World");
 * console.log(result1);
 * // Output:
 * // "Hello &amp; World"
 *
 * @example
 * const result2 = specialcharToEncode("<script>alert('XSS')</script>");
 * console.log(result2);
 * // Output:
 * // "&lt;script&gt;alert(&#039;XSS&#039;)&lt;/script&gt;"
 */
export const specialcharToEncode = (function () {
	return function (html) {
		if (isEmpty(html)) {
			logger.error("[specialcharToEncode] 参数异常：html<${0}>是必须的.", JSON.stringify(html));
			return "";
		}

		// 包含 HTML 特殊字符
		if (HTML.char.test(html)) {
			html = html.replace(HTML.char, function (match) {
				return window.zhongjyuan.runtime.setting.html.escape[match];
			});
		} else {
			// 包含 &，但未包含其他 HTML 特殊字符
			html = html.replace(/&/g, "&amp;");
		}

		return html;
	};
})();

/**
 * 将字符串中的转义的特殊字符进行解码
 * @param {string} str - 需要进行解码的字符串
 * @returns {string} - 解码后的字符串
 *
 * @example
 * const result1 = specialcharToDecode("Hello &amp; World");
 * console.log(result1);
 * // Output:
 * // "Hello & World"
 *
 * @example
 * const result2 = specialcharToDecode("&lt;script&gt;alert(&#039;XSS&#039;)&lt;/script&gt;");
 * console.log(result2);
 * // Output:
 * // "<script>alert('XSS')</script>"
 */
export const specialcharToDecode = (function () {
	return function (html) {
		if (isEmpty(html)) {
			logger.error("[specialcharToDecode] 参数异常：html<${0}>是必须的.", JSON.stringify(html));
			return "";
		}

		if (HTML.specialchar.test(html)) {
			for (let i = 0; i < window.zhongjyuan.runtime.setting.html.unescape.length; i++) {
				const char = window.zhongjyuan.runtime.setting.html.unescape[i];
				html = html.replace(char.reg, char.val);
			}
		}

		return html;
	};
})();

/**
 * 对字符串中的HTML字符进行转义。
 * @param {string} html 要转义的字符串。
 * @returns {string} 转义后的字符串。
 *
 * @example
 * var str = '<script>alert("Hello!");</script>';
 * var escapedStr = escapeHtml(str);
 * console.log(escapedStr);
 * // Output: &lt;script&gt;alert(&quot;Hello!&quot;);&lt;/script&gt;
 */
export function escapeHtml(html) {
	if (!isString(html)) {
		logger.error("[escapeHtml] 参数异常：html<${0}>必须是字符串类型.", JSON.stringify(html));
		return "";
	}

	// 包含 HTML 特殊字符
	if (HTML.char.test(html)) {
		html = html.replace(HTML.char, function (match) {
			return window.zhongjyuan.runtime.setting.html.escape[match];
		});
	} else {
		// 包含 &，但未包含其他 HTML 特殊字符
		html = html.replace(/&/g, "&amp;");
	}

	return html;
}

/**
 * 对字符串中的HTML转义字符进行反转义。
 * @param {string} html 要反转义的字符串。
 * @returns {string} 反转义后的字符串。
 *
 * @example
 * var escapedStr = '&lt;script&gt;alert(&quot;Hello!&quot;);&lt;/script&gt;';
 * var unescapedStr = unescapeHtml(escapedStr);
 * console.log(unescapedStr);
 * // Output: <script>alert("Hello!");</script>
 */
export function unescapeHtml(html) {
	if (!isString(html)) {
		logger.error("[unescapeHtml] 参数异常：html<${0}>必须是字符串类型.", JSON.stringify(html));
		return "";
	}

	if (HTML.specialchar.test(html)) {
		for (let i = 0; i < window.zhongjyuan.runtime.setting.html.unescape.length; i++) {
			const char = window.zhongjyuan.runtime.setting.html.unescape[i];
			html = html.replace(char.reg, char.val);
		}
	}

	html.replace(/&#([\d]+);/g, function ($0, $1) {
		return String.fromCharCode(parseInt($1, 10));
	});

	return html;
}

/**
 * 匹配给定HTML字符串中指定标签的开标签和闭标签，并返回匹配对信息的对象。
 *
 * @param {string} html 给定的HTML字符串
 * @param {string} tagName 指定的HTML标签名
 * @returns {Object} 包含指定HTML标签的匹配对信息的对象
 *
 * @example
 * const html = '<div>Content 1</div><span>Content 2</span>';
 * const tagName = 'div';
 * const result = matchPairHtml(html, tagName);
 * console.log(result);
 * // Output: { '1-1': { sourceCode: '<div>Content 1</div>', content: 'Content 1' } }
 *
 * @example
 * const html = '<p>Paragraph 1</p><p>Paragraph 2</p>';
 * const tagName = 'p';
 * const result = matchPairHtml(html, tagName);
 * console.log(result);
 * // Output: { '1-1': { sourceCode: '<p>Paragraph 1</p>', content: 'Paragraph 1' }, '2-1': { sourceCode: '<p>Paragraph 2</p>', content: 'Paragraph 2' } }
 */
export function matchPairHtml(html, tagName) {
	const patt = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "gi"); // 匹配指定标签的开标签和闭标签
	const startPatt = new RegExp(`^<${tagName}\\b[^>]*>$`, "i"); // 只匹配指定标签的开标签
	const endPatt = new RegExp(`^<\\/${tagName}>$`, "i"); // 只匹配指定标签的闭标签

	let rst; // 存储每次迭代的模式匹配结果
	let repeat = 0; // 跟踪嵌套级别（重复标签的数量）
	let group = 0; // 跟踪每个嵌套级别的组号
	const indexDD = {}; // 存储每个匹配对的索引信息

	while ((rst = patt.exec(html))) {
		// 检查是否为开标签
		if (startPatt.test(rst[0])) {
			repeat++;

			// 第一次出现时，增加组号
			if (repeat === 1) {
				group++;
			}

			// 使用嵌套级别和组号作为键，存储索引信息（开始索引和结束索引）
			indexDD[`${repeat}-${group}`] = {
				start: rst.index,
				end: -1, // 结束索引，在下面的代码中更新
				reverseEnd: -1, // 反转的结束索引，在下面的代码中更新
			};
		}

		// 检查是否为闭标签
		if (endPatt.test(rst[0])) {
			// 更新对应开标签的索引信息（结束索引和反转的结束索引）
			indexDD[`${repeat}-${group}`].end = rst.index + rst[0].length;
			indexDD[`${repeat}-${group}`].reverseEnd = html.length - patt.lastIndex;
			repeat--;
		}
	}

	const matchObj = {}; // 存储最终结果的对象

	for (const key in indexDD) {
		if (Object.hasOwnProperty.call(indexDD, key)) {
			const { start, end, reverseEnd } = indexDD[key];

			// 提取开始索引和结束索引之间的HTML源代码并修整
			const sourceCode = html.slice(start, end).trim();

			// 提取反转的开始索引和结束索引之间的内容并修整
			const content = html
				.slice(reverseEnd, html.length - start)
				.trim()
				.split("")
				.reverse()
				.join("");

			// 将源代码和内容存储为matchObj的属性
			matchObj[key] = { sourceCode, content };
		}
	}

	return matchObj; // 返回包含指定HTML标签的匹配对信息的对象
}

/**
 * 去除字符串两端的空白字符
 * @param {string} string 输入的字符串
 * @returns {string} 去除空白字符后的字符串
 *
 * @example
 * // 示例 1: 去除字符串两端的空白字符
 * const originalString = "  hello world  ";
 * const trimmedString = removeWhitespace(originalString);
 * console.log(trimmedString); // 输出 "hello world"
 *
 * @example
 * // 示例 2: 参数为非字符串类型，打印警告信息
 * removeWhitespace(123); // 输出警告信息: "[helper] removeWhitespace 参数string非字符串类型"
 *
 * @example
 * // 示例 3: 参数为空值或者非字符串类型，返回空字符串
 * const emptyString = removeWhitespace(); // 返回 ""
 */
export function removeWhitespace(string) {
	// 检查参数是否为字符串类型，如果不是则打印警告信息
	if (!isString(string)) {
		logger.error("[removeWhitespace] 参数异常：string<${0}>必须是字符串类型.", JSON.stringify(string));
		return string;
	}

	// 使用正则表达式替换字符串两端的空白字符为空字符串
	return (string || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
}

/**
 * 截断字符串并添加省略号
 * @param {string} str 要截断的字符串
 * @param {number} len 目标长度
 * @param {string} [ellipsis="..."] 省略号，默认为 "..."
 * @returns {string} 截断后的字符串
 * @throws {TypeError} 参数类型错误时抛出异常
 *
 * @example
 * truncateWithEllipsis("Hello, World!", 5, "..."); // 返回 "Hello..."
 *
 * @example
 * truncateWithEllipsis("This is a long sentence.", 10); // 返回 "This is a..."
 */
export function truncateWithEllipsis(str, len, ellipsis = "...") {
	if (!isString(str)) {
		logger.error("[truncateWithEllipsis] 参数异常：str<${0}>必须是字符串类型.", JSON.stringify(str));
		return;
	}

	if (!isNumber(len)) {
		logger.error("[truncateWithEllipsis] 参数异常：len<${0}?必须是整数类型.", JSON.stringify(len));
		return;
	}

	if (len <= 0) {
		logger.error("[truncateWithEllipsis]参数异常：len<${0}?必须大于0.", JSON.stringify(len));
		return "";
	}

	str = removeWhitespace(str);
	if (str.length <= len) {
		logger.error("[truncateWithEllipsis]参数异常：len<${0}?必须大于str<${1}>长度.", JSON.stringify(len), JSON.stringify(str));
		return str;
	}

	return str.slice(0, len - ellipsis.length) + ellipsis;
}

/**
 * 驼峰处理
 * @param {string} string 字符串
 * @param {boolean} [capitalizeFirstLetter=false] - 是否将转换后的字符串首字母大写。
 * @returns {string} 转换后的驼峰命名法字符串。
 *
 * @example
 * var result = camelCase("hello_world");
 * console.log(result); // 输出 "helloWorld"
 */
export function camelCase(string, capitalizeFirstLetter) {
	if (!isString(string)) {
		logger.error("[camelCase] 参数异常：string<${0}>必须是字符串类型.", JSON.stringify(string));
		return string;
	}

	capitalizeFirstLetter = capitalizeFirstLetter || false;

	let camelCaseString = removeWhitespace(string);
	camelCaseString = camelCaseString.replace(/([:\-_]+(.))/g, function (_, separator, letter, offset) {
		return offset ? letter.toUpperCase() : letter;
	});

	if (capitalizeFirstLetter) {
		camelCaseString = camelCaseString.charAt(0).toUpperCase() + camelCaseString.slice(1);
	}

	return camelCaseString;
}

/**
 * 将驼峰命名法形式的字符串转换为反驼峰形式（以特定分隔符连接的小写形式）。
 *
 * @param {string} string - 要进行反驼峰处理的字符串。
 * @param {string} [separator="_"] - 用于连接的分隔符（默认为下划线）。
 * @returns {string} - 反驼峰处理后的字符串。
 *
 * @example
 * // 示例1：使用默认分隔符
 * const result1 = reverseCamelCase('helloWorld'); // 输出 'hello_world'
 *
 * @example
 * // 示例2：使用自定义分隔符
 * const result2 = reverseCamelCase('helloWorld', '-'); // 输出 'hello-world'
 */
export function reverseCamelCase(string, separator) {
	if (!isString(string)) {
		logger.error("[reverseCamelCase] 参数异常：string<${0}>必须是字符串类型.", JSON.stringify(string));
		return string;
	}

	separator = separator || "_"; // 默认分隔符为下划线

	let camelCaseString = removeWhitespace(string);
	camelCaseString = camelCaseString.replace(/[A-Z]/g, function (match, offset) {
		return (offset ? separator : "") + match.toLowerCase();
	});

	return camelCaseString;
}

/**
 * 首字母大写
 * @param {string} string 字符串
 * @returns {string} 转换后的字符串。
 *
 * @example
 * var result = capitalize("hello");
 * console.log(result); // 输出 "Hello"
 */
export function capitalize(string) {
	if (!isString(string) || isEmpty(string)) {
		logger.error("[capitalize] 参数异常：string<${0}>必须是字符串类型且不能为空.", JSON.stringify(string));
		return string;
	}

	return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * 根据输入的参数类型，将类型名称转换为驼峰命名法并返回结果
 * @param {string|function} type 类型
 * @returns {string} 转换后的驼峰命名法字符串，如果无法转换则返回空字符串。
 *
 * @example
 * var result1 = capitalizeTypeName("hello_world");
 * console.log(result1); // 输出 "HelloWorld"
 *
 * function MyFunction() {}
 * var result2 = capitalizeTypeName(MyFunction);
 * console.log(result2); // 输出 "MyFunction"
 */
export function capitalizeTypeName(type) {
	let result = "";
	if (isString(type) && !isEmpty(type)) {
		result = capitalize(type);
	} else if (isFunction(type)) {
		result = type.toString().match(/^function\s*?(\w+)\(/);
		if (isArray(result)) {
			result = capitalize(result[1]);
		}
	}

	return result;
}

/**
 * 从函数中提取注释文档
 * @param {Function} func 目标函数
 * @returns {string} 函数的注释文档
 *
 * @example
 * // 示例 1: 提取函数的注释文档
 * function myFunction() {
 *   // 这是一个示例函数
 *   return "Hello, world!";
 * }
 * const doc = extractFunctionDoc(myFunction);
 * console.log(doc); // 输出 "这是一个示例函数"
 *
 * @example
 * // 示例 2: 参数为空值或非函数类型时，返回空字符串
 * const doc = extractFunctionDoc(); // 返回 ""
 *
 * @example
 * // 示例 3: 函数没有注释时，返回空字符串
 * function myFunction() {
 *   return "Hello, world!";
 * }
 * const doc = extractFunctionDoc(myFunction);
 * console.log(doc); // 输出 ""
 */
export function extractFunctionDoc(func) {
	if (!isFunction(func)) {
		logger.error("[extractFunctionDoc] 参数异常：func<${0}>必须是函数类型.", JSON.stringify(func));
		return "";
	}

	// 使用正则表达式匹配函数的注释文档部分
	var match = func.toString().match(/\/\*\*\s*([\s\S]*?)\*\//);

	// 如果匹配成功，返回匹配到的注释文档（去除换行符和破折号）
	return match ? match[1].replace(/\r/g, "").replace(/-/g, "") : "";
}

/**
 * 将参数转换为整数(四舍五入)
 * @param {number|string} number 需要转换的数字或字符串。
 * @param {number} [defaultValue=0] 可选:如果无法转换，设置默认值。
 * @returns {number}转换后的整数。
 * @example
 * console.log(parseInt("10")); // 输出 10
 * console.log(parseInt("10.9")); // 输出 11（四舍五入后取整）
 * console.log(parseInt("abc", 0)); // 输出 0（无法转换，默认返回0）
 * console.log(parseInt("abc")); // 输出 0（无法转换，默认返回0）
 * console.log(parseInt(5.8)); // 输出 6（四舍五入后取整）
 * console.log(parseInt(15)); // 输出 15
 */
export function parseInt1(number, defaultValue) {
	if (!isNumeric(number)) {
		logger.warn("[parseInt] 参数警告：number<${0}>不是数值类型.", JSON.stringify(number));
		return arguments.length < 2 ? 0 : defaultValue; // 如果number不是数值类型，则返回默认值
	}

	return parseInt(Math.round(parseFloat(number)), 10); // 使用内置的parseInt和parseFloat函数将number转换为整数
}

/**
 * 转小数
 * @param {string|number} number 数值
 * @param {number} places 可选：小数点位数(默认两位)
 * @param {number} min 可选：最小值(数值小于最小值则返回最小值)
 * @param {number} max 可选：最大值(数值大于最大值则返回最大值)
 * @param {string|number} [defaultValue="0.00"] 可选：默认值(0.00)
 * @returns {string} 范围限制后的指定小数位数的数字字符串。
 * @example
 * console.log(parseDecimal("10.5678", 2)); // 输出 "10.57"
 * console.log(parseDecimal("5.6789", 2, 0, 10)); // 输出 "5.68"，在允许的最小值到最大值之间
 * console.log(parseDecimal("15.9876", 2, 20, 30)); // 输出 "20.00"，超过允许的最大值，被限制为最大值
 * console.log(parseDecimal("25.1234", 2, 20, 30)); // 输出 "25.12"，在允许的最小值到最大值之间
 * console.log(parseDecimal(8.9, 1, 5, 15, "10.0")); // 输出 "8.9"，在允许的最小值到最大
 */
export function parseDecimal(number, places, min, max, defaultValue) {
	if (!isNumeric(number)) {
		logger.warn("[parseDecimal] 参数警告：number<${0}>不是数值类型.", JSON.stringify(number));
		return arguments.length < 5 ? "0.00" : defaultValue;
	}

	if (!isNullOrUndefined(places) && (!isInt(places) || (isInt(places) && parseFloat(places) < 0))) {
		logger.warn("[parseDecimal] 参数警告：places<${0}>不是整数类型.", JSON.stringify(places));
		places = 2;
	}

	var minValue;
	if (!isNullOrUndefined(min)) {
		if (isNumeric(min)) {
			minValue = parseFloat(min);
			if (parseFloat(number) < minValue) {
				number = parseFloat(min);
			}
		} else {
			logger.warn("[parseDecimal] 参数警告：min<${0}>不是数值类型.", JSON.stringify(min));
		}
	}

	var maxValue;
	if (!isNullOrUndefined(max)) {
		if (isNumeric(max)) {
			maxValue = parseFloat(max);
			if (parseFloat(number) > parseFloat(max)) {
				number = parseFloat(max);
			}
		} else {
			logger.warn("[parseDecimal] 参数警告：max<${0}>不是数值类型.", JSON.stringify(max));
		}
	}

	if (!isUndefined(minValue) && !isUndefined(maxValue)) {
		if (minValue > maxValue) {
			logger.warn("[parseDecimal] 参数警告：min<${0}>数值比max<${1}>数值大.", minValue, maxValue);
		}
	}

	return parseFloat(number).toFixed(places);
}

/**
 * 转百分比
 * @param {string|number} number 数值
 * @param {number} places 可选：小数点位数(默认两位)
 * @param {string|number} defaultValue 可选：默认值('')
 * @returns {string} 转换后的百分比字符串。
 *
 * @example
 * // 示例1：将0.75转换为百分比字符串，并保留2位小数
 * var result1 = parsePercent(0.75, 2);
 * console.log(result1); // 输出"75.00%"
 *
 * @example
 * // 示例2：将0.5转换为百分比字符串，默认保留0位小数
 * var result2 = parsePercent(0.5);
 * console.log(result2); // 输出"50%"
 */
export function parsePercent(number, places, defaultValue) {
	if (!isNumeric(number)) {
		logger.warn("[parsePercent] 参数警告：number<${0}>不是数值类型.", JSON.stringify(number));
		return arguments.length < 3 ? "" : defaultValue;
	}

	if (!isNullOrUndefined(places) && (!isInt(places) || (isInt(places) && parseFloat(places) < 0))) {
		logger.warn("[parsePercent] 参数警告：places<${0}>不是整数类型.", JSON.stringify(places));
		places = 0;
	}

	return (number * 100).toFixed(places || 0) + "%";
}

/**
 * 转千分位
 * @param {string|number} number 数值
 * @param {number} places 可选：小数点位数(默认两位)
 * @param {string|number} defaultValue 可选：默认值('')
 * @returns {string} 转换后的千位分隔符字符串。
 *
 * @example
 * // 示例1：将 10000.5 转换为千位分隔符字符串，不保留小数位
 * var result1 = parseThousands(10000.5);
 * console.log(result1); // 输出 "10,000"
 *
 * @example
 * // 示例2：将 12345.6789 转换为千位分隔符字符串，保留两位小数
 * var result2 = parseThousands(12345.6789, 2);
 * console.log(result2); // 输出 "12,345.68"
 *
 * @example
 * // 示例3：将 -9876.54321 转换为千位分隔符字符串，默认保留0位小数
 * var result3 = parseThousands(-9876.54321);
 * console.log(result3); // 输出 "-9,877"
 */
export function parseThousands(number, places, defaultValue) {
	// 判断 number 是否为数字
	if (!isNumeric(number)) {
		// 如果参数 number 不是数字格式，则根据参数个数决定是否输出警告信息
		logger.warn("[toThousands] 参数警告：number<${0}>不是数值类型.", JSON.stringify(number));
		return arguments.length < 3 ? "" : defaultValue;
	}

	// 判断 places 是否为整数
	if (!isNullOrUndefined(places) && (!isInt(places) || (isInt(places) && parseFloat(places) < 0))) {
		logger.warn("[toThousands] 参数警告：places<${0}>不是整数类型.", JSON.stringify(places));
		places = 0;
	}

	// 将 number 转换为浮点数形式
	number = parseFloat(number);

	var lt = number < 0;
	number = Math.abs(number).toFixed(places || 0);
	var decimal = "";
	var integer = "";

	// 检查是否有小数部分
	if (number.indexOf(".") !== -1) {
		decimal = number.substr(number.indexOf(".") + 1);
		number = number.substr(0, number.indexOf("."));
	}

	// 循环处理整数部分，每三位加一个逗号分隔符
	while (number.length > 3) {
		integer = "," + number.slice(-3) + integer;
		number = number.slice(0, number.length - 3);
	}

	if (number) {
		integer = number + integer;
	}

	// 拼接正负号、整数部分和小数部分，并返回结果
	return (lt ? "-" : "") + integer + (decimal ? "." + decimal : "");
}

/**
 * 金额转换为中文大写
 * @param {number} amount 金额
 * @returns {string} 转换后的中文大写字符串。
 *
 * @example
 * var result = amountToChinese(12345.67);
 * console.log(result); // 输出 "壹万贰仟叁佰肆拾伍元陆角柒分"
 */
export function amountToChinese(amount) {
	if (!isNumeric(amount)) {
		logger.warn("[amountToChinese] 参数警告：amount<${0}>不是数值类型.", JSON.stringify(amount));
		return amount.toString();
	}

	let unit = "京亿万仟佰拾兆万仟佰拾亿仟佰拾万仟佰拾元角分厘";

	let str = "";
	amount += "000"; // 添加五个零以处理厘的精度

	let i = amount.indexOf(".");
	if (i >= 0) {
		amount = amount.substring(0, i) + amount.substr(i + 1, 3);
	}

	if (unit.length < amount.length) {
		logger.warn("[amountToChinese] 参数amount<${0}>超出可转换范围.", JSON.stringify(amount));
		return amount.toString();
	} else {
		unit = unit.substr(unit.length - amount.length);
	}

	for (i = 0; i < amount.length; i++) {
		str += "零壹贰叁肆伍陆柒捌玖".charAt(amount.charAt(i)) + unit.charAt(i);
	}

	return str
		.replace(/零角零分零厘$/, "整")
		.replace(/零[仟佰拾]/g, "零")
		.replace(/零{2,}/g, "零")
		.replace(/零([亿|万])/g, "$1")
		.replace(/零+元/, "元")
		.replace(/亿零{0,3}万/, "亿")
		.replace(/^元/, "零元");
}

/**
 * 将字符串转换为日期对象
 * @param {string} strDate 要转换的字符串日期
 * @param {Date|null} defaultValue 默认值，如果转换失败则返回该值，默认为null
 * @returns {Date|null} 转换后的日期对象，如果转换失败则返回defaultValue
 *
 * @example
 * parseDate("2023-07-12 10:30:00");
 * // 返回日期对象: Wed Jul 12 2023 10:30:00 GMT+0800 (中国标准时间)
 *
 * parseDate("2010/01/01", new Date());
 * // 返回日期对象: Fri Jan 01 2010 00:00:00 GMT+0800 (中国标准时间)
 *
 * parseDate("09:30:00");
 * // 返回日期对象: Thu Jan 01 1970 09:30:00 GMT+0800 (中国标准时间)
 *
 * parseDate("2022年12月31日 23:59:59", new Date());
 * // 返回日期对象: Sat Dec 31 2022 23:59:59 GMT+0800 (中国标准时间)
 *
 * parseDate("invalid date");
 * // 返回null
 */
export function parseDate(strDate, defaultValue) {
	if (isDate(strDate)) {
		return strDate;
	}

	defaultValue = arguments.length === 2 ? defaultValue : null;
	if (!isString(strDate) || isEmpty(strDate)) {
		logger.warn("[parseDate] 参数警告：strDate<${0}>是必须的.", JSON.stringify(strDate));
		return defaultValue;
	}

	// 将中文字符转换为标准分隔符和格式
	strDate = strDate.toLowerCase();
	strDate = strDate.replace("年", "-").replace("月", "-").replace("日", " ").replace("时", ":").replace("分", "").replace("t", " ").replace("z", "");

	var reg = /^(\d{4})([-|/])(\d{1,2})\2(\d{1,2})(\s(\d{1,2}):(\d{1,2})(:(\d{1,2}))?)?(.\d{1,4})?$/;
	var result = strDate.match(reg);
	if (isNull(result)) {
		// 匹配时间格式：HH:mm:ss
		reg = /^(\d{1,2}):(\d{1,2})(:(\d{1,2}))?$/;
		result = strDate.match(reg);

		if (isNull(result)) {
			return defaultValue;
		}

		// 构建日期对象，年份、月份、日期设置为默认日期（1970-01-01）
		let date = new Date(1970, 1, 1, result[1], result[2], result[4] || 0);

		// 检查时间部分是否与输入一致
		if (
			date.getHours() !== ((result[1] && parseFloat(result[1])) || 0) ||
			date.getMinutes() !== ((result[2] && parseFloat(result[2])) || 0) ||
			date.getSeconds() !== ((result[4] && parseFloat(result[4])) || 0)
		) {
			return defaultValue;
		}

		return date;
	} else {
		// 匹配日期格式：yyyy-MM-dd HH:mm:ss
		result[3] = result[3] - 1; // 月份需要减1，Date对象中月份从0开始计数
		let date = new Date(result[1], result[3], result[4], result[6] || 0, result[7] || 0, result[9] || 0);

		if (
			date.getFullYear() !== parseFloat(result[1]) ||
			date.getMonth() !== parseFloat(result[3]) ||
			date.getDate() !== parseFloat(result[4]) ||
			date.getHours() !== ((result[6] && parseFloat(result[6])) || 0) ||
			date.getMinutes() !== ((result[7] && parseFloat(result[7])) || 0) ||
			date.getSeconds() !== ((result[9] && parseFloat(result[9])) || 0)
		) {
			return defaultValue;
		}

		return date;
	}
}

/**
 * 将 HTML 字符串转换为 DocumentFragment 对象，并返回其第一个子节点。
 * @param {string} html Html内容
 * @returns {Node|null} 转换后的 DocumentFragment 的第一个子节点，如果无效则返回 null。
 *
 * @example
 * var template = "<div>Hello, World!</div>";
 * var result = parseDocumentFragment(template);
 * console.log(result); // 输出包含 "Hello, World!" 的 div 元素
 */
export function parseDocumentFragment(html) {
	if (!isString(html)) {
		logger.error("[parseDocumentFragment] 参数异常：html<${0}>必须是字符串类型.", JSON.stringify(html));
		return;
	}

	if (isEmpty(html)) {
		logger.error("[parseDocumentFragment] 参数异常：html<${0}>是必须的.", JSON.stringify(html));
		return;
	}

	const wrap = document.createElement("div");
	const fragment = document.createDocumentFragment();

	wrap.innerHTML = html;
	fragment.appendChild(wrap);

	return fragment.firstChild;
}

/**
 * 格式化 URL
 * @param {string} url - 要格式化的 URL
 * @returns {string} - 格式化后的 URL
 *
 * @example
 * const url = "zhongjyuan.com";
 * const formattedUrl = format(url);
 * console.log(formattedUrl);
 * // Output:
 * // //zhongjyuan.com
 */
export function formatUrl(url) {
	if (!isString(url)) {
		logger.error("[formatUrl] 参数异常：url<${0}>必须是字符串类型.", JSON.stringify(url));
		return;
	}

	if (isEmpty(url)) {
		logger.error("[formatUrl] 参数异常：url<${0}>是必须的.", JSON.stringify(url));
		return;
	}

	url = url.replace(/(^\s*)|(\s*$)/g, "");
	var preg = /^(https?:\/\/|\.\.?\/|\/\/?)/i;
	if (!preg.test(url)) {
		url = "//" + url;
	}

	return url;
}

/**
 * 格式化 JSON 数据
 * @param {string | object} json - 要格式化的 JSON 数据
 * @param {number} [space=4] - 缩进的空格数，默认为 4
 * @returns {string} - 格式化后的 JSON 字符串
 *
 * @example
 * const json1 = '{"name":"John","age":30,"city":"New York"}';
 * const formattedJson1 = format(json1);
 * console.log(formattedJson1);
 * // Output:
 * // {
 * //     "name": "John",
 * //     "age": 30,
 * //     "city": "New York"
 * // }
 *
 * @example
 * const json2 = { "name": "John", "age": 30, "city": "New York" };
 * const formattedJson2 = format(json2, 2);
 * console.log(formattedJson2);
 * // Output:
 * // {
 * //   "name": "John",
 * //   "age": 30,
 * //   "city": "New York"
 * // }
 */
export function formatJson(json, space = 4) {
	if (!json) {
		logger.error("[formatJson] 参数异常：json<${0}>是必须的.", JSON.stringify(json));
		return "";
	}

	if (isString(json)) {
		json = JSON.parse(json);
	}

	return JSON.stringify(json, null, space);
}

/**
 * 格式化字符串
 * @param {string} template 模板字符串
 * @param {...any} values 变量值
 * @returns {string} 格式化后的字符串
 * @example
 * const message = formatString("Hello, ${0}! Today is ${1}.", "Alice", "Monday");
 * console.log(message); // "Hello, Alice! Today is Monday."
 */
export function formatString(template, ...values) {
	if (!isString(template)) {
		logger.error("[formatString] 参数异常：template<${0}>必须是字符串类型.", JSON.stringify(template));
		return;
	}

	if (isEmpty(template)) {
		logger.error("[formatString] 参数异常：template<${0}>是必须的.", JSON.stringify(template));
		return;
	}

	// 获取变量值的数量
	const num = values.length;

	// 初始化格式化后的字符串为模板字符串
	let formattedString = template;

	// 循环遍历变量值，并将模板字符串中的占位符替换为相应的变量值
	for (let i = 0; i < num; i++) {
		// 构建占位符的正则表达式，例如：/\$\{0\}/g
		const pattern = `\\$\\{${i}\\}`;
		const re = new RegExp(pattern, "g");

		// 使用变量值替换模板字符串中的占位符
		formattedString = formattedString.replace(re, values[i]);
	}

	// 返回格式化后的字符串
	return formattedString;
}

/**
 * 格式化日期对象或日期字符串。
 *
 * @param {Date|string} date 待格式化的日期对象或日期字符串。
 * @param {string} [format='yyyy-MM-dd hh:mm:ss'] 格式化的目标字符串格式，默认为 'yyyy-MM-dd hh:mm:ss'。
 *
 * @returns {string} 格式化后的日期字符串，若输入无效则返回空字符串。
 *
 * @example
 * formatDate(new Date('2023-07-12T14:36:00'), 'yyyy-MM-dd HH:mm:ss');
 * // 返回 '2023-07-12 14:36:00'
 *
 * formatDate('2023-07-12T14:36:00', 'MM/dd/yyyy');
 * // 返回 '07/12/2023'
 *
 * formatDate('invalid-date-string');
 * // 返回 ''
 */
export function formatDate(date, format = "yyyy-MM-dd hh:mm:ss") {
	return date.format(format);
}

/**
 * 将时间戳转换为指定格式的字符串
 * @param {number} timestamp - 时间戳
 * @param {string} [format="yyyy-MM-dd hh:mm:ss"] - 格式化字符串，默认为 "yyyy-MM-dd hh:mm:ss"
 * @returns {string} - 格式化后的日期字符串
 *
 * @example
 * const result1 = formatTimestamp(1626159312);
 * console.log(result1);
 * // Output:
 * // "2021-07-13 10:48:32"
 *
 * @example
 * const result2 = formatTimestamp(1626159312000, "yyyy年MM月dd日 hh时mm分ss秒");
 * console.log(result2);
 * // Output:
 * // "2021年07月13日 10时48分32秒"
 */
export function formatTimestamp(timestamp, format = "yyyy-MM-dd hh:mm:ss") {
	return new Date(timestamp).format(format);
}
