/**
 * 获取当前日期并以字符串形式返回
 * @returns 当前日期的字符串表示，格式为 YYYY-MM-DD
 */
export function getCurrentDate() {
	const date = new Date(); // 创建一个新的 Date 对象来获取当前日期和时间
	const day = date.getDate(); // 获取当前日期中的日
	const month = date.getMonth() + 1; // 获取当前日期中的月份（注意要加 1，因为月份是从 0 开始计数的）
	const year = date.getFullYear(); // 获取当前日期中的年份
	return `${year}-${month}-${day}`; // 返回拼接后的年月日字符串
}
