/**
 * 将 HTML 中的特殊字符进行转义处理
 * @param source 待处理的 HTML 字符串
 * @returns 转义后的 HTML 字符串
 */
export function encodeHTML(source: string) {
	return source
		.replace(/&/g, "&amp;") // 替换 & 符号
		.replace(/</g, "&lt;") // 替换 < 符号
		.replace(/>/g, "&gt;") // 替换 > 符号
		.replace(/"/g, "&quot;") // 替换 " 符号
		.replace(/'/g, "&#39;"); // 替换 ' 符号
}

/**
 * 判断文本是否包含代码块
 * @param text 要检查的文本
 * @returns 是否包含代码块
 */
export function includeCode(text: string | null | undefined) {
	const regexp = /^(?:\s{4}|\t).+/gm; // 匹配代码块的正则表达式
	return !!(
		(
			text?.includes(" = ") || // 检查文本中是否包含等号，可能是代码块的一部分
			text?.match(regexp)
		) // 使用正则表达式判断是否为代码块
	);
}

/**
 * 复制文本到剪贴板
 * @param options 复制文本的选项，包括 text（要复制的文本）和 origin（是否使用 textarea 元素）
 */
export function copyText(options: { text: string; origin?: boolean }) {
	const props = { origin: true, ...options }; // 合并默认选项和传入选项

	let input: HTMLInputElement | HTMLTextAreaElement; // 输入框元素变量

	if (props.origin)
		input = document.createElement("textarea"); // 如果设置为使用 textarea 元素
	else input = document.createElement("input"); // 默认使用 input 元素

	input.setAttribute("readonly", "readonly"); // 设置输入框为只读
	input.value = props.text; // 设置输入框的值为待复制文本
	document.body.appendChild(input); // 将输入框添加到页面中
	input.select(); // 选择输入框中的内容
	if (document.execCommand("copy")) document.execCommand("copy"); // 执行复制操作
	document.body.removeChild(input); // 复制完成后移除输入框
}
