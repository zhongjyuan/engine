import logger from "../logManagement";
import { isInt, isArray, isString, isDate } from "./default";
import { parseDate } from "./format";

export default {
	isWorkDay: logger.decorator(isWorkDay, "tool-is-workDay"),
	setWorkDays: logger.decorator(setWorkDays, "tool-set-workDays"),
};

/**
 * 设置工作日数组。
 *
 * @param {number[]} days 工作日数组。必须为数字的数组。
 *
 * @example
 * setWorkDays([1, 2, 3, 4, 5]); // 设置工作日数组为周一至周五
 *
 * @example
 * setWorkDays([0, 6]); // 设置工作日数组为周末（周日和周六）
 *
 * @example
 * setWorkDays(); // 参数错误：days不是数组类型
 */
export function setWorkDays(days) {
	if (!isArray(days)) {
		logger.error("[setWorkDays] 参数异常：days<${0}>必须是数组类型.", JSON.stringify(days));
		return;
	}

	window.zhongjyuan.createRuntimeProperty("workDays", "array");
	days.forEach(function (day, index) {
		if (isInt(day)) {
			day = parseInt(day, 10);
			if (day < 0 || day > 6) {
				logger.error("[setWorkDays] 参数异常：days<${0}>数据项${1}数据范围必须是0-6.", JSON.stringify(days), index);
				return;
			}

			if (window.zhongjyuan.runtime.workDays.indexOf(day) === -1) {
				window.zhongjyuan.runtime.workDays.push(day);
			}
		} else {
			logger.error("[setWorkDays] 参数异常：days<${0}>数据项${1}必须是数字", JSON.stringify(days), index);
		}
	});
}

/**
 * 判断日期是否为工作日。
 *
 * @param {Date|string} date 需要判断的日期。可以是 Date 对象或者表示日期的字符串。
 *
 * @returns {boolean} 如果是工作日则返回 true，否则返回 false。
 *
 * @example
 * isWorkDay(new Date()); // 判断今天是否为工作日
 *
 * @example
 * isWorkDay("2023-01-01"); // 判断指定日期（字符串格式）是否为工作日
 */
export function isWorkDay(date) {
	if (isString(date)) {
		date = parseDate(date);
	}

	if (!isDate(date)) {
		logger.warn("[isWorkDay] 参数异常：date<${0}>必须是日期类型或者能转换为日期类型", JSON.stringify(date));
		return false;
	}

	window.zhongjyuan.createRuntimeProperty("workDays", "array");
	return window.zhongjyuan.runtime.workDays.indexOf(date.getDay()) !== -1;
}
