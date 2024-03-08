import logger from "@base/logger";
import { isArray, isDate, isNumeric, isString } from "./default";
import { formatDate, parseDate, parseDecimal, parseInt1, parseThousands } from "./format";

export default {
	max: logger.decorator(max, "tool-max"),
	min: logger.decorator(min, "tool-min"),
	sum: logger.decorator(sum, "tool-sum"),
	avg: logger.decorator(avg, "tool-avg"),
	timeObject: logger.decorator(timeObject, "tool-time-object"),
	timeCountUp: logger.decorator(countup, "tool-time-count-up"),
	timeCountDown: logger.decorator(countdown, "tool-time-count-down"),
	calculateDateByDays: logger.decorator(calculateDateByDays, "tool-calculate-date-by-days"),
	calculateDateByMonths: logger.decorator(calculateDateByMonths, "tool-calculate-date-by-months"),
	calculateDateByYears: logger.decorator(calculateDateByYears, "tool-calculate-date-by-years"),
	calculateDateInterval: logger.decorator(calculateDateInterval, "tool-calculate-date-interval"),
	calculateFutureDateByDays: logger.decorator(calculateFutureDateByDays, "tool-calculate-future-date-by-days"),
	calculateFutureDateByMonths: logger.decorator(calculateFutureDateByMonths, "tool-calculate-future-date-by-months"),
	calculateFutureDateByYears: logger.decorator(calculateFutureDateByYears, "tool-calculate-future-date-by-years"),
};

/**
 * 找出数值数组中的最大值，并根据选项进行格式化输出。
 *
 * @param {number[]} values 数值数组
 * @param {object} option 选项对象
 * @param {string} option.type 数值类型，可选值为"date"、"int"或"float"
 * @param {string} [option.format] 格式化选项，可选值为"thousand"表示千位分隔，默认为转换为整数
 * @param {number} [option.place] 小数位数，仅在格式化选项为"float"且未指定小数位数时有效，默认为2
 * @returns {string} 格式化后的最大值
 *
 * @example
 * max([1, 2, 3], { type: "int" }); // 返回 "3"
 *
 * @example
 * max([new Date(2022, 0, 1), new Date(2023, 0, 1)], { type: "date", format: "yyyy-MM-dd" }); // 返回 "2023-01-01"
 *
 * @example
 * max([1000, 2000, 3000, 4000], { type: "int", format: "thousand" }); // 返回 "1,000"
 *
 * @example
 * max([3.1415, 2.71828, 1.4142], { type: "float", place: 4 }); // 返回 "3.1415"
 */
export function max(values, option) {
	if (!isArray(values)) {
		logger.error("[max] 参数异常：values<${0}>必须是数组类型.", JSON.stringify(values));
		return;
	}

	// 检查选项的类型是否为"date"、"int"或"float"
	if (!isDate(option.type) && !isInt(option.type) && !isNumeric(option.type)) {
		return "";
	}

	const isDate = option.type === "date";
	let maxVal;
	// 遍历数值数组
	values.forEach((val, i) => {
		if (i === 0) {
			// 初始化最大值，对于日期类型将调用工具函数parseDate进行解析，其他类型的默认初始值为0
			maxVal = isDate ? parseDate(val) : isNumeric(val) ? parseFloat(val) : 0;
			return;
		}

		// 更新最大值
		if (val > maxVal) {
			maxVal = val;
		}
	});

	// 如果最大值为空，则返回空字符串
	if (!maxVal) {
		return "";
	}

	// 根据选项格式化最大值
	if (isDate) {
		// 对于日期类型调用工具函数formatDate进行格式化，使用选项中指定的格式，如果未指定则默认为"yyyy-MM-dd hh:mm:ss"
		return formatDate(maxVal, option.format || "yyyy-MM-dd hh:mm:ss");
	} else {
		if (option.format === "thousand") {
			// 如果选项中指定了格式为"thousand"，则调用工具函数toThousands进行千位分隔，并使用选项中指定的小数位数，如果未指定则默认为2
			return parseThousands(maxVal, option.place || 2);
		} else if (isNumeric(option.type)) {
			// 对于浮点数类型，调用工具函数parseDecimal进行小数位处理，并使用选项中指定的小数位数，如果未指定则默认为2
			return parseDecimal(maxVal, option.place || 2);
		} else {
			// 默认情况下，将最大值转换为整数
			return parseInt1(maxVal);
		}
	}
}

/**
 * 找出数值数组中的最小值，并根据选项进行格式化输出。
 *
 * @param {number[]} values 数值数组
 * @param {object} option 选项对象
 * @param {string} option.type 数值类型，可选值为"date"、"int"或"float"
 * @param {string} [option.format] 格式化选项，可选值为"thousand"表示千位分隔，默认为转换为整数
 * @param {number} [option.place] 小数位数，仅在格式化选项为"float"且未指定小数位数时有效，默认为2
 * @returns {string} 格式化后的最小值
 *
 * @example
 * min([1, 2, 3], { type: "int" }); // 返回 "1"
 *
 * @example
 * min([4, 8, 2, 5], { type: "int" }); // 返回 "2"
 *
 * @example
 * min([1.5, 2.7, 3.1], { type: "float" }); // 返回 "1.50"
 *
 * @example
 * min([1000, 2000, 3000], { type: "float", format: "thousand", place: 0 }); // 返回 "1,000"
 *
 * @example
 * min([new Date(2022, 0, 1), new Date(2023, 0, 1)], { type: "date", format: "yyyy-MM-dd" }); // 返回 "2022-01-01"
 */
export function min(values, option) {
	if (!isArray(values)) {
		logger.error("[min] 参数异常：values<${0}>必须是数组类型.", JSON.stringify(values));
		return;
	}

	// 检查选项的类型是否为"date"、"int"或"float"
	if (!isDate(option.type) && !isInt(option.type) && !isNumeric(option.type)) {
		return "";
	}

	const isDate = isDate(option.type);
	let minVal;
	// 遍历数值数组
	values.forEach((val, i) => {
		if (i === 0) {
			// 初始化最小值，对于日期类型将调用工具函数parseDate进行解析，其他类型的默认初始值为0
			minVal = isDate ? parseDate(val) : isNumeric(val) ? parseFloat(val) : 0;
			return;
		}

		// 更新最小值
		if (val < minVal) {
			minVal = val;
		}
	});

	// 如果最小值为空，则返回空字符串
	if (!minVal) {
		return "";
	}

	// 根据选项格式化最小值
	if (isDate) {
		// 对于日期类型调用工具函数formatDate进行格式化，使用选项中指定的格式，如果未指定则默认为"yyyy-MM-dd hh:mm:ss"
		return formatDate(minVal, option.format || "yyyy-MM-dd hh:mm:ss");
	} else {
		if (option.format === "thousand") {
			// 如果选项中指定了格式为"thousand"，则调用工具函数toThousands进行千位分隔，并使用选项中指定的小数位数，如果未指定则默认为2
			return parseThousands(minVal, option.place || 2);
		} else if (isNumeric(option.type)) {
			// 对于浮点数类型，调用工具函数parseDecimal进行小数位处理，并使用选项中指定的小数位数，如果未指定则默认为2
			return parseDecimal(minVal, option.place || 2);
		} else {
			// 默认情况下，将最小值转换为整数
			return parseInt1(minVal);
		}
	}
}

/**
 * 计算数值数组的总和，并根据选项进行格式化输出。
 *
 * @param {number[]} values 数值数组
 * @param {object} option 选项对象
 * @param {string} option.type 数值类型，可选值为"int"或"float"
 * @param {string} [option.format] 格式化选项，可选值为"thousand"表示千位分隔，"float"表示小数位处理，默认为转换为整数
 * @param {number} [option.place] 小数位数，仅在format为"thousand"或"float"时有效，默认为2
 * @returns {string} 格式化后的总和
 *
 * @example
 * sum([1, 2, 3], { type: "int" }); // 返回 "6"
 *
 * @example
 * sum([1.5, 2.5, 3.5], { type: "float", format: "thousand", place: 3 }); // 返回 "7.500"
 */
export function sum(values, option) {
	if (!isArray(values)) {
		logger.error("[sum] 参数异常：values<${0}>必须是数组类型.", JSON.stringify(values));
		return;
	}

	// 检查选项的类型是否为"int"或"float"
	if (!isInt(option.type) && !isNumeric(option.type)) {
		return "";
	}

	let result = 0;
	// 遍历数值数组，并将每个数值累加到结果中
	values.forEach((val, i) => {
		// 如果数值是数字类型，则将其转换为浮点数后累加，否则默认为0
		result += isNumeric(val) ? parseFloat(val) : 0;
	});

	// 根据选项格式化结果
	if (option.format === "thousand") {
		// 如果选项中指定了格式为"thousand"，则调用工具函数toThousands进行千位分隔，并使用选项中指定的小数位数，如果未指定则默认为2
		return parseThousands(result, option.place || 2);
	} else if (isNumeric(option.type)) {
		// 对于浮点数类型，调用工具函数parseDecimal进行小数位处理，并使用选项中指定的小数位数，如果未指定则默认为2
		return parseDecimal(result, option.place || 2);
	} else {
		// 默认情况下，将结果转换为整数
		return parseInt1(result);
	}
}

/**
 * 计算数值数组的平均值，并根据选项进行格式化输出。
 *
 * @param {number[]} values 数值数组
 * @param {object} option 选项对象
 * @param {string} option.type 数值类型，可选值为"int"或"float"
 * @param {string} [option.format] 格式化选项，可选值为"thousand"表示千位分隔，默认为转换为浮点数
 * @param {number} [option.place] 小数位数，仅在格式化选项为"float"且未指定小数位数时有效，默认为2
 * @returns {string} 格式化后的平均值
 *
 * @example
 * avg([1, 2, 3], { type: "int" }); // 返回 "2"
 *
 * @example
 * avg([1.5, 2.5, 3.5], { type: "float", format: "thousand", place: 3 }); // 返回 "2.500"
 */
export function avg(values, option) {
	if (!isArray(values)) {
		logger.error("[avg] 参数异常：values<${0}>必须是数组类型.", JSON.stringify(values));
		return;
	}

	// 检查选项的类型是否为"int"或"float"
	if (option.type !== "int" && option.type !== "float") {
		return "";
	}

	let result = 0;
	// 遍历数值数组，并将每个数值累加到结果中
	values.forEach((val, i) => {
		// 如果数值是数字类型，则将其转换为浮点数后累加，否则默认为0
		result += isNumeric(val) ? parseFloat(val) : 0;
	});

	// 根据选项格式化结果
	if (option.format === "thousand") {
		// 如果选项中指定了格式为"thousand"，则调用工具函数toThousands进行千位分隔，并使用选项中指定的小数位数，如果未指定则默认为2
		return parseThousands(result / values.length, option.place || 2);
	} else {
		// 默认情况下，调用工具函数parseDecimal进行小数位处理，并使用选项中指定的小数位数，如果未指定则默认为2
		return parseDecimal(result / values.length, option.place || 2);
	}
}

/**
 * 获取时间数据对象函数
 * @param {object} timeData - 时间数据对象
 * @param {number} timeDiff - 与起始时间的时间差，单位为秒
 * @returns {object} - 时间数据对象
 */
export function timeObject(timeData, timeDiff) {
	var millisecondsInSecond = 1000;
	var minutesInHour = 60;
	var secondsInMinute = 60;
	var secondsInHour = minutesInHour * secondsInMinute;
	var secondsInDay = 24 * secondsInHour;
	var monthsInYear = 12;

	timeData.days = Math.floor(timeDiff / secondsInDay);
	timeData.year = Math.floor(timeData.days / 365);
	timeData.month = Math.floor(timeData.day / (365 / monthsInYear));
	timeData.day = Math.floor(timeData.days % 365);
	timeData.hour = Math.floor((timeDiff % secondsInDay) / secondsInHour);
	timeData.minute = Math.floor((timeDiff - (timeData.days * secondsInDay + timeData.hour * secondsInHour)) / minutesInHour);
	timeData.second = Math.floor(timeDiff % secondsInMinute);
	timeData.millisecond = Math.floor((timeDiff - Math.floor(timeDiff)) * millisecondsInSecond);

	// 添加前导零
	timeData.yearZero = timeData.year < 10 ? "0" + timeData.year : timeData.year;
	timeData.monthZero = timeData.month < 10 ? "0" + timeData.month : timeData.month;
	timeData.dayZero = timeData.day < 10 ? "0" + timeData.day : timeData.day;
	timeData.daysZero = timeData.days < 10 ? "0" + timeData.days : timeData.days;
	timeData.hourZero = timeData.hour < 10 ? "0" + timeData.hour : timeData.hour;
	timeData.minuteZero = timeData.minute < 10 ? "0" + timeData.minute : timeData.minute;
	timeData.secondZero = timeData.second < 10 ? "0" + timeData.second : timeData.second;
	timeData.millisecondZero =
		timeData.millisecond < 10 ? "00" + timeData.millisecond : timeData.millisecond < 100 ? "0" + timeData.millisecond : timeData.millisecond;

	return timeData;
}

/**
 * 计时器函数
 * @param {number|string} startTime - 开始时间，可以是时间戳或者日期字符串
 * @param {function} onTick - 每秒回调函数，接收一个参数，即当前时间数据对象
 */
export function countup(startTime, onTick) {
	// 如果没有指定startTime，则获取当前时间作为起始时间
	if (!startTime) {
		var now = new Date().getTime();
		startTime = parseInt(now / 1000);
	} else if (isNaN(startTime)) {
		// 如果startTime不是数字，则转换为时间戳
		startTime = startTime.replace(/-/g, "/");
		var now = new Date(startTime).getTime();
		startTime = parseInt(now / 1000);
	}

	var timeData = {}; // 时间数据对象

	var timer = setInterval(function () {
		var currentTime = new Date().getTime();
		var nowTime = parseInt(currentTime / 1000);
		var timeDiff = nowTime - startTime;

		// 获取时间数据对象
		timeData = timeObject(timeData, timeDiff);

		// 如果时间精度为3，则计算毫秒值，并添加前导零
		timeData.millisecondZero = timeData.msec = parseInt(1000 - (currentTime % 1000));
		if (timeData.msec < 10) {
			timeData.millisecondZero = "00" + timeData.msec;
		} else if (timeData.msec < 100) {
			timeData.millisecondZero = "0" + timeData.msec;
		} else if (timeData.msec === 1000) {
			timeData.msec = 0;
			timeData.millisecondZero = "00" + timeData.msec;
		}

		if (onTick) {
			// 执行每秒回调函数，并返回值用于判断是否停止计时器
			var stopTimer = onTick(timeData);
			if (stopTimer === true) {
				clearTimeout(timer);
			}
		}
	}, 100); // 定时器间隔为100毫秒
}

/**
 * 倒计时函数
 * @param {object|number} startTime - 开始时间，可以是时间对象或者秒数
 * @param {function} onTick - 每秒回调函数，接收一个参数，即当前时间数据对象
 * @param {function} onFinish - 倒计时结束回调函数，接收一个参数，即最终时间数据对象
 */
export function countdown(startTime, onTick, onFinish) {
	var timeData = {}; // 时间数据对象
	var interval = 100; // 定时器间隔，默认为100毫秒

	// 判断传入的startTime是时间对象还是数字
	if (typeof startTime === "object") {
		var now = parseInt(new Date().getTime() / 1000);
		var start = startTime.startTime ? parseInt(startTime.startTime) : 0;
		start = start === 0 ? now : start;
		var end = startTime.endTime;
		var timeDiff = start - now;
	} else {
		var now = 0;
		var timeDiff = 0;
		timeData.decimal = 0;
		var end = startTime;
	}

	timeData.time = end;
	timeData.finish = false;

	// 判断end是否为非数字，如果是则转换为时间戳
	if (isNaN(end)) {
		var formattedTime = end.substring(0, 19).replace(/-/g, "/");
		timeData.time = new Date(formattedTime).getTime() / 1000;
	}

	var timer = setInterval(function () {
		var currentTime = new Date().getTime();
		now = parseInt(currentTime / 1000 + timeDiff);
		var remainingTime = timeData.time - now;

		if (remainingTime <= 0) {
			currentTime = 0;
			remainingTime = 0;
		}

		// 获取时间数据对象
		if (remainingTime >= 0) {
			timeData = timeObject(timeData, remainingTime);
		}

		// 如果时间精度为3，则计算毫秒值，并添加前导零
		timeData.millisecondZero = timeData.msec = parseInt(1000 - (currentTime % 1000));
		if (timeData.msec < 10) {
			timeData.millisecondZero = "00" + timeData.msec;
		} else if (timeData.msec < 100) {
			timeData.millisecondZero = "0" + timeData.msec;
		} else if (timeData.msec === 1000 || remainingTime === 0) {
			timeData.msec = 0;
			timeData.millisecondZero = "00" + timeData.msec;
		}

		// 执行每秒回调函数
		if (onTick) {
			onTick(timeData);
		}

		// 判断倒计时结束条件
		if (remainingTime <= 0 || timeData.stop === true) {
			clearInterval(timer);
			timeData.finish = true;
			// 执行倒计时结束回调函数
			if (onFinish) {
				onFinish(timeData);
			}
		}
	}, interval);
}

/**
 * 根据给定的日期、天数量和起止类型计算日期（按天）
 *
 * @param {Date|string} start 起始日期，可以是 Date 对象或者符合日期格式的字符串
 * @param {number} days 天数，表示要往后推迟或前移的月份数量
 * @param {boolean} isStart 起止类型，true 表示返回起始日期，false 表示返回结束日期
 * @param {*} [defaultValue=null] 默认值，在参数错误时返回
 * @returns {Date|null} 计算后的日期对象，如果参数错误则返回默认值
 *
 * @example
 * // 从当前日期开始往后推迟两个月，并返回起始日期
 * var startDate = calculateDateByMonths(new Date(), 2, true);
 * console.log(startDate); // 输出起始日期，例如：Mon Oct 01 2023 00:00:00 GMT+0000 (Coordinated Universal Time)
 *
 * @example
 * // 从指定日期开始往前移动五个月，并返回结束日期
 * var endDate = calculateDateByMonths('2023-01-01', 5, false);
 * console.log(endDate); // 输出结束日期，例如：Fri May 31 2023 00:00:00 GMT+0000 (Coordinated Universal Time)
 */
export function calculateDateByDays(date, days, isStart, defaultValue) {
	if (isString(date)) {
		date = parseDate(date);
	}

	defaultValue = arguments.length > 2 ? defaultValue : null;
	if (!isDate(date)) {
		logger.warn("[calculateDateByDays] 参数警告：date<${0}>不是日期格式或者转换日期格式失败.", JSON.stringify(date));
		return defaultValue;
	} else {
		date = new Date(date.getTime());
	}

	if (!isNumeric(days)) {
		logger.warn("[calculateDateByDays] 参数警告：days<${0}>不是有效数字.", JSON.stringify(days));
		return defaultValue;
	}

	var newDate = new Date(date);
	if (isStart) {
		newDate.setDate(newDate.getDate() + days);
	} else {
		newDate.setDate(newDate.getDate() - days);
	}

	return newDate;
}

/**
 * 根据给定的日期、月份数量和起止类型计算日期（按月）
 *
 * @param {Date|string} start 起始日期，可以是 Date 对象或者符合日期格式的字符串
 * @param {number} months 月数，表示要往后推迟或前移的月份数量
 * @param {boolean} isStart 起止类型，true 表示返回起始日期，false 表示返回结束日期
 * @param {*} [defaultValue=null] 默认值，在参数错误时返回
 * @returns {Date|null} 计算后的日期对象，如果参数错误则返回默认值
 *
 * @example
 * // 从当前日期开始往后推迟两个月，并返回起始日期
 * var startDate = calculateDateByMonths(new Date(), 2, true);
 * console.log(startDate); // 输出起始日期，例如：Mon Oct 01 2023 00:00:00 GMT+0000 (Coordinated Universal Time)
 *
 * @example
 * // 从指定日期开始往前移动五个月，并返回结束日期
 * var endDate = calculateDateByMonths('2023-01-01', 5, false);
 * console.log(endDate); // 输出结束日期，例如：Fri May 31 2023 00:00:00 GMT+0000 (Coordinated Universal Time)
 */
export function calculateDateByMonths(date, months, isStart, defaultValue) {
	if (isString(date)) {
		date = parseDate(date);
	}

	defaultValue = arguments.length > 2 ? defaultValue : null;
	if (!isDate(date)) {
		logger.warn("[calculateDateByMonths] 参数警告：date<${0}>不是日期格式或者转换日期格式失败.", JSON.stringify(date));
		return defaultValue;
	} else {
		date = new Date(date.getTime());
	}

	if (!isNumeric(months)) {
		logger.warn("[calculateDateByMonths] 参数警告：months<${0}>不是有效数字.", JSON.stringify(months));
		return defaultValue;
	}

	// 结束日期是否滚动月份
	var startMonth = date.getMonth(); // 获取起始月份
	var startYear = date.getFullYear(); // 获取起始年份

	var nowMonth = startMonth; // 当前月份
	var nowYear = startYear; // 当前年份
	nowMonth += months; // 更新当前月份

	// 处理跨年情况
	while (nowMonth < 0 || nowMonth >= 12) {
		if (nowMonth < 0) {
			nowYear--; // 上一年
			nowMonth += 12;
		} else if (nowMonth >= 12) {
			nowYear++; // 下一年
			nowMonth -= 12;
		}
	}

	if (isStart) {
		return new Date(nowYear, nowMonth, 1);
	} else {
		return new Date(nowYear, nowMonth + 1, 0);
	}
}

/**
 * 根据给定的日期、年份数量和起止类型计算日期（按年）
 *
 * @param {Date|string} date 起始日期。可以是 Date 对象或日期的字符串表示形式。
 * @param {number} years 需要添加或减去的年数。正数表示增加，负数表示减少。
 * @param {boolean} isStart 确定计算年份的起始还是结束。为 true 表示起始，为 false 表示结束。
 * @param {*} [defaultValue=null] 参数错误时返回的默认值。
 * @returns {Date|null} 计算得到的日期，如果参数错误则返回 null。
 *
 * @example
 * const startDate = new Date(2022, 0, 1);
 * const endDate = calculateDateByYears(startDate, 5, false);
 * console.log(endDate); // 输出：Mon Dec 31 2026
 *
 * @example
 * const currentDate = new Date();
 * const previousYearStart = calculateDateByYears(currentDate, -1, true);
 * console.log(previousYearStart); // 输出：Sat Jan 01 2022
 *
 * @example
 * const specificDate = '2023-06-15';
 * const nextYearEnd = calculateDateByYears(specificDate, 1, false);
 * console.log(nextYearEnd); // 输出：Sun Dec 31 2024
 */
export function calculateDateByYears(date, years, isStart, defaultValue) {
	if (isString(date)) {
		date = parseDate(date);
	}

	defaultValue = arguments.length > 2 ? defaultValue : null;
	if (!isDate(date)) {
		logger.warn("[calculateDateByYears] 参数警告：date<${0}>不是日期格式或者转换日期格式失败.", JSON.stringify(date));
		return defaultValue;
	} else {
		date = new Date(date.getTime());
	}

	if (!isNumeric(years)) {
		logger.warn("[calculateDateByYears] 参数警告：years<${0}>不是有效数字.", JSON.stringify(years));
		return defaultValue;
	}

	// 结束日期是否滚动月份
	var nowYear = !isStart && years > 0 ? date.getFullYear() + years : date.getFullYear(); // 当前年
	if (isStart) {
		return new Date(nowYear, 0, 1);
	} else {
		return new Date(nowYear, 12, 0);
	}
}

/**
 * 计算两个日期之间的时间间隔。
 *
 * @param {Date|string} start 开始日期或日期字符串。
 * @param {Date|string} end 结束日期或日期字符串。
 * @param {string} [unit='ms'] 时间间隔的单位。可选值为：'ms'（毫秒）、's'（秒）、'm'（分钟）、'h'（小时）和 'd'（天）。
 * @param {number} [defaultValue=-1] 默认值，在日期格式无效或转换失败时返回。
 * @returns {number} 时间间隔，以指定的单位返回结果。
 *
 * @example
 * // 以毫秒为单位计算两个日期之间的时间间隔
 * const interval = calculateDateInterval(new Date('2022-01-01'), new Date('2022-01-02')); // 返回 86400000 （24 小时的毫秒数）
 *
 * // 以天为单位计算两个日期之间的时间间隔
 * const interval = calculateDateInterval('2022-01-01', '2022-01-05', 'd'); // 返回 4
 *
 * // 以小时为单位计算两个日期之间的时间间隔，并使用自定义默认值
 * const interval = calculateDateInterval('2022-01-01', '2022-01-02', 'h', 0); // 返回 24
 */
export function calculateDateInterval(start, end, unit, defaultValue) {
	if (isString(start)) {
		start = parseDate(start);
	}

	if (isString(end)) {
		end = parseDate(end);
	}

	defaultValue = arguments > 3 ? defaultValue : -1;
	if (!isDate(start) || !isDate(end)) {
		logger.warn(
			"[calculateDateInterval] 参数警告：start<${0}>或end<${1}>不是日期格式或者转换日期格式失败.",
			JSON.stringify(start),
			JSON.stringify(end)
		);
		return defaultValue;
	}

	unit = arguments.length < 3 ? "ms" : unit;
	const divisorMap = {
		ms: 1,
		s: 1000,
		m: 1000 * 60,
		h: 1000 * 60 * 60,
		d: 1000 * 60 * 60 * 24,
	};

	if (!divisorMap.hasOwnProperty(unit)) {
		logger.warn("[calculateDateInterval] 参数警告：unit<${0}>暂只支持d/h/m/s/ms之一", JSON.stringify(unit));
		unit = "ms";
	}

	return Math.abs(start * 1 - end * 1) / divisorMap[unit];
}

/**
 * 获取未来的日期（按天）
 *
 * @param {Date|string} date 起始日期，可以是 Date 对象或者符合日期格式的字符串
 * @param {number} number 天数
 * @param {*} [defaultValue=null] 默认值，在参数错误时返回
 * @returns {Date|null} 计算后的日期对象，如果参数错误则返回默认值
 *
 * @example
 * // 从当前日期开始往后推迟两天
 * var futureDate = calculateFutureDateByDays(new Date(), 2);
 * console.log(futureDate); // 输出未来的日期
 *
 * @example
 * // 从指定日期开始往后推迟五天
 * var futureDate = calculateFutureDateByDays('2023-01-01', 5);
 * console.log(futureDate); // 输出未来的日期
 */
export function calculateFutureDateByDays(date, number, defaultValue) {
	if (isString(date)) {
		date = parseDate(date);
	}

	defaultValue = arguments.length > 2 ? defaultValue : null;
	if (!isDate(date)) {
		logger.warn("[calculateFutureDateByDays] 参数警告：date<${0}>不是日期格式或者转换日期格式失败.", JSON.stringify(date));
		return defaultValue;
	}

	if (!isNumeric(number)) {
		logger.warn("[calculateFutureDateByDays] 参数警告：number<${0}>不是有效数字.", JSON.stringify(number));
		return defaultValue;
	}

	return new Date(date.getTime() + 60 * 60 * 1000 * 24 * number);
}

/**
 * 获取未来的日期（按月）
 *
 * @param {Date|string} date 起始日期，可以是 Date 对象或者符合日期格式的字符串
 * @param {number} number 月数，表示要往后推迟的月份数量
 * @param {*} [defaultValue=null] 默认值，在参数错误时返回
 * @returns {Date|null} 计算后的日期对象，如果参数错误则返回默认值
 *
 * @example
 * // 从当前日期开始往后推迟两个月
 * var futureDate = calculateFutureDateByMonths(new Date(), 2);
 * console.log(futureDate); // 输出未来的日期
 *
 * @example
 * // 从指定日期开始往后推迟五个月
 * var futureDate = calculateFutureDateByMonths('2023-01-01', 5);
 * console.log(futureDate); // 输出未来的日期
 */
export function calculateFutureDateByMonths(date, number, defaultValue) {
	defaultValue = arguments.length > 2 ? defaultValue : null;
	if (isString(date)) {
		date = parseDate(date);
	}

	if (!isDate(date)) {
		logger.warn("[calculateFutureDateByMonths] 参数警告：date<${0}>不是日期格式或者转换日期格式失败.", JSON.stringify(date));
		return defaultValue;
	} else {
		date = new Date(date.getTime());
	}

	if (!isNumeric(number)) {
		logger.warn("[calculateFutureDateByMonths] 参数警告：number<${0}>不是有效数字.", JSON.stringify(number));
		return defaultValue;
	}

	date.setMonth(date.getMonth() + number);

	return date;
}

/**
 * 获取未来的日期（按年）
 *
 * @param {Date|string} date - 起始日期。可以是 Date 对象或可转换为 Date 的字符串。
 * @param {number} number - 年份数，表示要增加的年数。
 * @param {*} [defaultValue=null] - 默认值，如果参数错误时返回的值，默认为 null。
 * @returns {Date} 计算后的未来日期。
 * @example
 * // 示例1: 将 2021 年 9 月 1 日增加3年。
 * const result1 = calculateFutureDateByYears(new Date(2021, 8, 1), 3);
 * console.log(result1); // 输出：Sat Sep 01 2024 00:00:00 GMT+0800 (中国标准时间)
 *
 * // 示例2: 将当前日期增加5年。
 * const result2 = calculateFutureDateByYears(new Date(), 5);
 * console.log(result2); // 输出：未来五年后的日期
 */
export function calculateFutureDateByYears(date, number, defaultValue) {
	if (isString(date)) {
		date = parseDate(date);
	}

	defaultValue = arguments.length > 2 ? defaultValue : null;
	if (!isDate(date)) {
		logger.warn("[calculateFutureDateByYears] 参数警告：date<${0}>不是日期格式或者转换日期格式失败.", JSON.stringify(date));
		return defaultValue;
	} else {
		date = new Date(date.getTime());
	}

	if (!isNumeric(number)) {
		logger.warn("[calculateFutureDateByYears] 参数警告：number<${0}>不是有效数字.", JSON.stringify(number));
		return defaultValue;
	}

	date.setYear(date.getFullYear() + number);

	return date;
}
