import logger from "@common/logManagement";
import { twoDigits } from "@common/utils/default";
import { setStyle, animateScale, queryParentElement } from "@common/utils/dom";

import { comp_calendar as htmlTemplate } from "./html";

/**
 * 日历 - 组件 - ZHONGJYUAN
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年7月14日17:22:28
 */
export default (() => {
	/**
	 * 生成指定日期的日历布局字符串。
	 * @param {number} year - 指定的年份。
	 * @param {number} month - 指定的月份。
	 * @param {number} date - 指定的日期。
	 * @returns {string} 日期布局字符串。
	 *
	 * @example
	 * // 示例：
	 * var year = 2022;
	 * var month = 11;
	 * var date = 1;
	 * var layout = _renderDataLayout(year, month, date);
	 * console.log(layout); // 打印生成的日期布局字符串。
	 */
	function _renderDataLayout(setYear, setMonth, setDate) {
		var { comp_calendar: setting } = window.zhongjyuan.runtime.setting;

		// 判断是否为当前年份和月份，若是则将 setDate 设置为当前日期，否则将 setDate 设为1
		if (setYear === setting.currentYear && setMonth === setting.currentMonth) {
			setDate = setting.currentDate;
		} else {
			setDate = 1;
		}

		// 创建新的 Date 对象
		var _oDate = new Date();
		var _date;

		// 设置 _oDate 的日期、月份和年份
		_oDate.setDate(setDate);
		_oDate.setMonth(setMonth);
		_oDate.setFullYear(setYear);

		// 创建 _date 对象并设置为 _oDate 的副本
		_date = new Date(_oDate);
		_date.setDate(0);

		// 获取上一个月的最后一天的日期
		var _prevDays = _date.getDate();

		// 创建 _date 对象并设置为 _oDate 的副本
		_date = new Date(_oDate);
		_date.setDate(1);

		// 获取指定月份的第一天的星期几
		var _week = _date.getDay();

		// 创建 _date 对象并设置为 _oDate 的副本
		_date = new Date(_oDate);
		_date.setDate(1);
		_date.setMonth(setMonth + 1);
		_date.setDate(0);

		// 获取指定月份的总天数
		var _allDays = _date.getDate();

		// 初始化变量和日期字符串
		var str = "";
		var num = 0;
		var i;

		// 如果 _week 是 0，则表示星期日，将其设置为 7
		if (_week === 0) {
			_week = 7;
		}

		// 生成上一个月的灰色日期格子的 HTML 字符串
		for (i = 0; i < _week; i++) {
			str = '<li class="grey">' + (_prevDays - i) + "</li>" + str;
			num++;
		}

		// 生成当前月份的日期格子的 HTML 字符串
		for (i = 0; i < _allDays; i++) {
			if (i === setDate - 1) {
				str += '<li class="active">' + (i + 1) + "</li>";
			} else {
				str += "<li>" + (i + 1) + "</li>";
			}
			num++;
		}

		// 生成下一个月的灰色日期格子的 HTML 字符串
		for (i = 0; i < 42 - num; i++) {
			str += '<li class="grey">' + (i + 1) + "</li>";
		}

		// 返回生成的日期布局字符串
		return str;
	}

	/**
	 * 生成指定年份的布局字符串。
	 * @param {number} setYear - 指定的年份。
	 * @returns {string} 年份布局字符串。
	 *
	 * @example
	 * // 示例：
	 * var year = 2022;
	 * var layout = _renderYearLayout(year);
	 * console.log(layout); // 打印生成的年份布局字符串。
	 */
	function _renderYearLayout(setYear) {
		var { comp_calendar: setting } = window.zhongjyuan.runtime.setting;

		// 初始化变量和日期字符串
		var str = "";

		// 计算当前十年范围的起始年份，并将结果赋给变量 num
		var num = Math.floor(setYear / 10) * 10;

		// 计算当前十年范围的起始年份和结束年份
		var start = num - 1;
		var end = num + 10;

		// 使用循环生成包含当前十年范围内的年份格子的 HTML 字符串
		for (var i = 0; i < 12; i++) {
			// 判断当前年份是否为选定的年份，并且在起始年份和结束年份之间
			if (start + i === setting.setYear && start + i >= num && start + i < end) {
				str += '<li class="active">' + (start + i) + "</li>";
			}
			// 如果是起始年份或结束年份，则添加灰色样式类名
			else if (i === 0 || i === 11) {
				str += '<li class="grey">' + (start + i) + "</li>";
			}
			// 其他情况下不添加特殊样式类名
			else {
				str += "<li>" + (start + i) + "</li>";
			}
		}

		// 返回生成的年份布局字符串
		return str;
	}

	/**
	 * 构建年份选择器布局和逻辑
	 * @param {number} setYear - 当前选中的年份。
	 *
	 * @example
	 * // 示例：
	 * var setYear = 2022;
	 * _renderYear(setYear);
	 */
	function _renderYear(setYear) {
		// 获取全局对象 window.zhongjyuan.runtime.setting 中的 comp_calendar 配置
		var { comp_calendar: setting } = window.zhongjyuan.runtime.setting;

		// 将 comp_calendar 对象中的 componentElement 赋值给变量 componentElement
		var componentElement = setting.componentElement;
		// 在 componentElement 中找到时间框元素，并将其赋值给变量 boxTimeElement
		var boxTimeElement = componentElement.querySelector("#_box_time");
		// 在 boxTimeElement 中找到类名为 _normal 的元素，并将其赋值给变量 normalElement
		var normalElement = boxTimeElement.getElementsByClassName("_normal")[0];
		// 在 boxTimeElement 中找到类名为 comp_calendar 的元素，并将其赋值给变量 calendarElement
		var calendarElement = boxTimeElement.getElementsByClassName("calendar")[0];
		// 在 calendarElement 中找到所有的 strong 元素，并将其赋值给变量 strongElement
		var strongElement = calendarElement.getElementsByTagName("strong");
		// 在 boxTimeElement 中找到类名为 _tenyears 的元素，并将其赋值给变量 yearElement
		var yearElement = boxTimeElement.getElementsByClassName("_tenyears")[0];
		// 通过 yearElement 找到第一个子元素，并将其赋值给变量 yearulElement
		var yearulElement = yearElement.firstElementChild;
		// 通过 yearulElement 找到所有的 li 元素，并将其赋值给变量 yearliElements
		var yearliElements = yearulElement.getElementsByTagName("li");

		// 使用 _renderYearLayout 函数生成包含前一十年、当前十年和后一十年的年份格子的 HTML 字符串，并将其设置为 yearulElement 的 HTML 内容
		yearulElement.innerHTML = _renderYearLayout(setYear - 10) + _renderYearLayout(setYear) + _renderYearLayout(setYear + 10);
		// 使用循环遍历 yearliElements，为每个年份格子添加点击事件处理函数
		for (var i = 0; i < yearliElements.length; i++) {
			yearliElements[i].onclick = function () {
				// 清除所有年份格子的 active 类名
				for (var i = 0; i < yearliElements.length; i++) {
					yearliElements[i].className === "active" && (yearliElements[i].className = "");
				}
				// 将当前点击的年份格子添加 active 类名
				this.className = "active";
				// 将年份字符串转换为整数，并将其赋值给 setYear 变量
				setYear = parseInt(this.innerHTML);
				// 清除 comp_calendar 对象中的延时定时器，并设置一个新的延时定时器
				window.clearTimeout(setting.delayTimer);
				setting.delayTimer = setTimeout(function () {
					// 在延时定时器的回调函数中，设置 comp_calendar 的模式为 1，更新显示当前选定的年份
					setting.mode = 1;
					strongElement[0].innerHTML = setYear;
					// 显示月份选择器，并调用 animateScale 函数进行布局
					monthElement.style.display = "block";
					animateScale(monthElement);
					// 隐藏默认年份选择器样式，并隐藏年份选择器
					normalElement.style.display = "none";
					yearElement.style.display = "none";
				}, 200);
			};
		}
	}

	/**
	 * 构建月份选择器布局和逻辑
	 *
	 * @example
	 * // 示例：
	 * _renderMonth();
	 */
	function _renderMonth() {
		var { comp_calendar: setting } = window.zhongjyuan.runtime.setting;
		var componentElement = setting.componentElement;

		// 获取相关的元素
		var i = 0,
			boxTimeElement = componentElement.querySelector("#_box_time"), // 时间框元素
			monthElement = boxTimeElement.getElementsByClassName("_years_months")[0], // 月份选择器元素
			monthliElements = monthElement.getElementsByTagName("li"), // 月份格子元素集合
			calendarElement = boxTimeElement.getElementsByClassName("calendar")[0], // 日历元素
			strongElement = calendarElement.getElementsByTagName("strong"), // 显示日期的元素
			normalElement = boxTimeElement.getElementsByClassName("_normal")[0], // 默认时间框元素
			yearElement = boxTimeElement.getElementsByClassName("_tenyears")[0]; // 年份选择器元素

		// 根据当前选中的月份设置对应的格子为 active
		for (i = 0; i < 3; i++) {
			monthliElements[setting.setMonth + i * 12].className = "active";
		}

		// 遍历月份格子，并为每个格子添加点击事件处理函数
		for (i = 0; i < monthliElements.length; i++) {
			// 使用闭包保存循环变量i的值
			(function (n) {
				monthliElements[n].onclick = function () {
					var i;
					// 清除所有月份格子的类名
					for (i = 0; i < monthliElements.length; i++) {
						monthliElements[i].className = "";
					}

					// 设置当前选中的月份
					setting.setMonth = n % 12;
					// 清除所有月份格子的类名
					for (i = 0; i < monthliElements.length; i++) {
						monthliElements[i].className = "";
					}

					// 根据当前选中的月份设置对应的格子为 active
					for (i = 0; i < 3; i++) {
						monthliElements[setting.setMonth + i * 12].className = "active";
					}

					// 清除 comp_calendar 对象中的延时定时器，并设置一个新的延时定时器
					window.clearTimeout(setting.delayTimer);
					setting.delayTimer = setTimeout(function () {
						// 设置 comp_calendar 的模式为 0，更新显示当前选定的年份和月份
						setting.mode = 0;
						strongElement[0].innerHTML = `${setting.setYear}${setting.dates[0]}${setting.setMonth + 1}${setting.dates[1]}`;

						// 隐藏月份选择器样式，并显示默认时间框元素
						monthElement.style.display = "none";
						normalElement.style.display = "block";
						animateScale(normalElement); // 进行布局

						yearElement.style.display = "none";

						_showDate(); // 显示日期
					}, 200);
				};
			})(i);
		}
	}

	/**
	 * 构建日历布局和逻辑
	 *
	 * @example
	 * // 示例：
	 * _renderCalendar();
	 */
	function _renderCalendar() {
		var { comp_calendar: setting } = window.zhongjyuan.runtime.setting;
		var componentElement = setting.componentElement;

		// 获取相关的元素
		var boxTimeElement = componentElement.querySelector("#_box_time"); // 时间框元素

		// 设置组件颜色
		var maskElement = componentElement.getElementsByClassName("mask")[0];
		setStyle(maskElement, "background", setting.color);

		// 显示星期
		_showWeek();

		// 显示月份
		_showMonth();
		_showMonth();
		_showMonth();

		// 显示时间
		_showTime();

		// 每秒钟更新一次时间显示
		setting.timeInterval = setInterval(_showTime, 1000);

		var timeElement = boxTimeElement.getElementsByClassName("div-time");
		timeElement[1].onclick = _onTimeClick;

		var calendarElement = boxTimeElement.getElementsByClassName("calendar")[0]; // 日历元素
		var strongElement = calendarElement.getElementsByTagName("strong"); // 显示日期的元素
		strongElement[0].onclick = _onStrongClick;

		var headerElement = componentElement.getElementsByClassName("_header")[0];
		var headerSpanElement = headerElement.getElementsByTagName("span");
		headerSpanElement[0].onclick = _onHeaderLiftClick;
		headerSpanElement[1].onclick = _onHeaderRightClick;

		// 构建月份选择器布局和逻辑
		_renderMonth();

		// 显示日期
		_showDate();
	}

	/**
	 * 点击时间触发的事件处理函数
	 */
	function _onTimeClick() {
		var { comp_calendar: setting } = window.zhongjyuan.runtime.setting;
		var componentElement = setting.componentElement;

		// 获取相关的元素
		var boxTimeElement = componentElement.querySelector("#_box_time"); // 时间框元素
		var normalElement = boxTimeElement.getElementsByClassName("_normal")[0]; // 默认时间框元素
		var yearElement = boxTimeElement.getElementsByClassName("_tenyears")[0]; // 年份选择器元素
		var monthElement = boxTimeElement.getElementsByClassName("_years_months")[0]; // 月份选择器元素
		var monthliElements = monthElement.getElementsByTagName("li"); // 月份格子元素集合

		// 清除延时定时器
		window.clearTimeout(setting.delayTimer);

		// 设置年、月、日为当前日期
		setting.setYear = setting.currentYear;
		setting.setMonth = setting.currentMonth;
		setting.setDate = setting.currentDate;

		// 显示日期
		_showDate();

		setting.mode = 0; // 将模式设置为0，以显示选定的年份和月份

		monthElement.style.display = "none"; // 隐藏月份选择器样式
		normalElement.style.display = "block"; // 显示默认时间框元素
		yearElement.style.display = "none"; // 隐藏年份选择器样式

		// 清除所有月份格子的类名
		for (var i = 0; i < monthliElements.length; i++) {
			monthliElements[i].className = "";
		}

		// 设置当前选中的月份格子为 active
		monthliElements[setting.setMonth].className = "active";
	}

	/**
	 * 点击Strong元素触发的事件处理函数
	 */
	function _onStrongClick() {
		var { comp_calendar: setting } = window.zhongjyuan.runtime.setting;
		var componentElement = setting.componentElement;

		var boxTimeElement = componentElement.querySelector("#_box_time");

		var calendarElement = boxTimeElement.getElementsByClassName("calendar")[0];
		var strongElement = calendarElement.getElementsByTagName("strong");

		var normalElement = boxTimeElement.getElementsByClassName("_normal")[0];

		var yearElement = boxTimeElement.getElementsByClassName("_tenyears")[0];

		var monthElement = boxTimeElement.getElementsByClassName("_years_months")[0];
		var monthliElements = monthElement.getElementsByTagName("li");

		window.clearTimeout(setting.delayTimer);

		if (setting.mode === 0) {
			strongElement[0].innerHTML = setting.setYear; // 设置strong元素的内容为选定的年份
			monthElement.style.display = "block"; // 显示月份选择器样式
			animateScale(monthElement);
			normalElement.style.display = "none"; // 隐藏默认时间框元素
			yearElement.style.display = "none"; // 隐藏年份选择器样式
		} else if (setting.mode === 1) {
			setting.ten = 0;
			strongElement[0].innerHTML = Math.floor(setting.setYear / 10) * 10 + "-" + (Math.floor(setting.setYear / 10) * 10 + 9); // 设置strong元素的内容为选定的年份范围
			monthElement.style.display = "none"; // 隐藏月份选择器样式
			normalElement.style.display = "none"; // 隐藏默认时间框元素
			yearElement.style.display = "block"; // 显示年份选择器样式
			animateScale(yearElement);
		} else if (setting.mode === 2) {
			strongElement[0].innerHTML = `${setting.setYear}${setting.dates[0]}${setting.setMonth + 1}${setting.dates[1]}`; // 设置strong元素的内容为选定的年份和月份
			monthElement.style.display = "none"; // 隐藏月份选择器样式
			normalElement.style.display = "block"; // 显示默认时间框元素
			animateScale(normalElement);
			yearElement.style.display = "none"; // 隐藏年份选择器样式
		}

		// 清除所有月份格子的类名
		for (var i = 0; i < monthliElements.length; i++) {
			monthliElements[i].className = "";
		}

		// 设置当前选中的月份格子为 active
		for (var i = 0; i < 3; i++) {
			monthliElements[setting.setMonth + i * 12].className = "active";
		}

		if (setting.mode === 1) {
			_renderYear(setting.setYear); // 根据选定的年份构建年份选择器的内容
		}

		if (setting.mode === 2) {
			_showDate(); // 显示日期
		}

		setting.mode++; // 模式递增
		setting.mode = setting.mode % 3; // 保证模式在0、1、2之间循环切换
	}

	/**
	 * 点击日历头部左侧箭头触发的事件处理函数
	 */
	function _onHeaderLiftClick() {
		var { comp_calendar: setting } = window.zhongjyuan.runtime.setting;
		var componentElement = setting.componentElement;

		var boxTimeElement = componentElement.querySelector("#_box_time"),
			calendarElement = boxTimeElement.getElementsByClassName("calendar")[0],
			strongElement = calendarElement.getElementsByTagName("strong"),
			yearElement = boxTimeElement.getElementsByClassName("_tenyears")[0],
			yearulElement = yearElement.firstElementChild,
			monthElement = boxTimeElement.getElementsByClassName("_years_months")[0],
			monthulElement = monthElement.getElementsByTagName("ul")[0],
			dayElement = calendarElement.getElementsByClassName("_days")[0].getElementsByTagName("ul")[0];

		if (setting.mode === 0) {
			setting.setMonth--; // 设置当前月份为上一个月
			if (setting.setMonth === -1) {
				setting.setMonth = 11; // 如果上一个月是比当前月份小一年的12月，则将当前月份设置为12月
				setting.setYear--; // 当前年份减一
			}

			_showDate(); // 显示日期

			dayElement.style.transition = "0s"; // 设置日历表格的过渡效果时间
			dayElement.style.top = "-25.2rem"; // 将日历表格下移
			window.setTimeout(function () {
				dayElement.style.transition = "0.5s"; // 0.5秒过渡效果
				dayElement.style.top = "-12.6rem"; // 将日历表格上移
			}, 10);
		} else if (setting.mode === 1) {
			setting.setYear--; // 设置当前年份为上一年
			monthulElement.style.transition = "0s"; // 设置月份选择器的过渡效果时间
			monthulElement.style.top = "-21.6rem"; // 将月份选择器下移
			window.setTimeout(function () {
				monthulElement.style.transition = "0.5s"; // 0.5秒过渡效果
				monthulElement.style.top = "-10.8rem"; // 将月份选择器上移
			}, 10);
			strongElement[0].innerHTML = setting.setYear; // 设置选定年份的 strong 元素的内容
		} else if (setting.mode === 2) {
			setting.ten--; // 设置当前十年为前一个十年

			var _temp = setting.setYear + 10 * setting.ten; // 计算出当前选定的十年区间的开始年份
			strongElement[0].innerHTML = Math.floor(_temp / 10) * 10 + "-" + (Math.floor(_temp / 10) * 10 + 9); // 设置选定年份的 strong 元素的内容为新的十年区间
			_renderYear(_temp); // 根据新的十年区间构建年份选择器的内容

			yearulElement.style.transition = "0s"; // 设置年份选择器的过渡效果时间
			yearulElement.style.top = "-21.6rem"; // 将年份选择器下移
			window.setTimeout(function () {
				yearulElement.style.transition = "0.5s"; // 0.5秒过渡效果
				yearulElement.style.top = "-10.8rem"; // 将年份选择器上移
			}, 10);
		}
	}

	/**
	 * 点击日历头部右侧箭头触发的事件处理函数
	 */
	function _onHeaderRightClick() {
		var { comp_calendar: setting } = window.zhongjyuan.runtime.setting;
		var componentElement = setting.componentElement;

		var boxTimeElement = componentElement.querySelector("#_box_time"),
			calendarElement = boxTimeElement.getElementsByClassName("calendar")[0],
			strongElement = calendarElement.getElementsByTagName("strong"),
			yearElement = boxTimeElement.getElementsByClassName("_tenyears")[0],
			yearulElement = yearElement.firstElementChild,
			monthElement = boxTimeElement.getElementsByClassName("_years_months")[0],
			monthulElement = monthElement.getElementsByTagName("ul")[0],
			dayElement = calendarElement.getElementsByClassName("_days")[0].getElementsByTagName("ul")[0];

		if (setting.mode === 0) {
			setting.setMonth++; // 设置当前月份为下一个月
			if (setting.setMonth === 12) {
				setting.setMonth = 0; // 如果下一个月是比当前月份大一年的1月，则将当前月份设置为1月
				setting.setYear++; // 当前年份加一
			}

			_showDate(); // 显示日期

			dayElement.style.transition = "0s"; // 设置日历表格的过渡效果时间
			dayElement.style.top = "0"; // 将日历表格上移
			window.setTimeout(function () {
				dayElement.style.transition = "0.5s"; // 0.5秒过渡效果
				dayElement.style.top = "-12.6rem"; // 将日历表格下移
			}, 10);
		} else if (setting.mode === 1) {
			setting.setYear++; // 设置当前年份为下一年
			monthulElement.style.transition = "0s"; // 设置月份选择器的过渡效果时间
			monthulElement.style.top = "0"; // 将月份选择器上移
			window.setTimeout(function () {
				monthulElement.style.transition = "0.5s"; // 0.5秒过渡效果
				monthulElement.style.top = "-10.8rem"; // 将月份选择器下移
			}, 10);
			strongElement[0].innerHTML = setting.setYear; // 设置选定年份的 strong 元素的内容
		} else if (setting.mode === 2) {
			setting.ten++; // 设置当前十年为后一个十年

			var _temp = setting.setYear + 10 * setting.ten; // 计算出当前选定的十年区间的开始年份
			strongElement[0].innerHTML = Math.floor(_temp / 10) * 10 + "-" + (Math.floor(_temp / 10) * 10 + 9); // 设置选定年份的 strong 元素的内容为新的十年区间
			_renderYear(_temp); // 根据新的十年区间构建年份选择器的内容

			yearulElement.style.transition = "0s"; // 设置年份选择器的过渡效果时间
			yearulElement.style.top = "0"; // 将年份选择器上移
			window.setTimeout(function () {
				yearulElement.style.transition = "0.5s"; // 0.5秒过渡效果
				yearulElement.style.top = "-10.8rem"; // 将年份选择器下移
			}, 10);
		}
	}

	/**
	 * 在日历组件中显示月份选项
	 */
	function _showMonth() {
		var { comp_calendar: setting } = window.zhongjyuan.runtime.setting;
		var componentElement = setting.componentElement;

		// 获取月份选择器的DOM元素
		var boxTimeElement = componentElement.querySelector("#_box_time");
		var monthElement = boxTimeElement.getElementsByClassName("_years_months")[0];
		var monthulElement = monthElement.getElementsByTagName("ul")[0];

		// 遍历所有月份，创建li元素并添加到月份选择器中
		setting.months.forEach(function (month) {
			var li = document.createElement("li");
			li.innerHTML = month;
			monthulElement.appendChild(li);
		});
	}

	/**
	 * 在日历组件中显示星期缩写选项
	 */
	function _showWeek() {
		var { comp_calendar: setting } = window.zhongjyuan.runtime.setting;
		var componentElement = setting.componentElement;

		// 获取星期选择器的DOM元素
		var boxTimeElement = componentElement.querySelector("#_box_time");
		var weekElement = boxTimeElement.getElementsByClassName("_week")[0];

		// 遍历所有星期缩写，创建span元素并添加到星期选择器中
		setting.weekShorts.forEach(function (short) {
			var span = document.createElement("span");
			span.innerHTML = short;
			weekElement.appendChild(span);
		});
	}

	/**
	 * 在日历组件中显示日期
	 */
	function _showDate() {
		var { translate } = window.zhongjyuan.languager;
		var { comp_calendar: setting } = window.zhongjyuan.runtime.setting;
		var componentElement = setting.componentElement;

		var str = "",
			boxTimeElement = componentElement.querySelector("#_box_time"),
			calendarElement = boxTimeElement.getElementsByClassName("calendar")[0],
			strongElement = calendarElement.getElementsByTagName("strong"),
			dayElement = calendarElement.getElementsByClassName("_days")[0].getElementsByTagName("ul")[0];

		// 根据当前选定的年份和月份，生成日期字符串
		if (setting.setMonth === 0) {
			str =
				_renderDataLayout(setting.setYear - 1, 11, setting.setDate) +
				_renderDataLayout(setting.setYear, setting.setMonth, setting.setDate) +
				_renderDataLayout(setting.setYear, setting.setMonth + 1, setting.setDate);
		} else if (setting.setMonth === 11) {
			str =
				_renderDataLayout(setting.setYear, setting.setMonth - 1, setting.setDate) +
				_renderDataLayout(setting.setYear, setting.setMonth, setting.setDate) +
				_renderDataLayout(setting.setYear + 1, 0, setting.setDate);
		} else {
			str =
				_renderDataLayout(setting.setYear, setting.setMonth - 1, setting.setDate) +
				_renderDataLayout(setting.setYear, setting.setMonth, setting.setDate) +
				_renderDataLayout(setting.setYear, setting.setMonth + 1, setting.setDate);
		}

		// 将生成的日期字符串设置为日历组件中的日期元素的innerHTML属性值
		dayElement.innerHTML = str;

		// 设置日历组件中的年份和月份显示
		strongElement[0].innerHTML = `${setting.setYear}${translate("date.year")}${setting.setMonth + 1}${translate("date.month")}`;
	}

	/**
	 * 在日历组件中显示时间和日期
	 */
	function _showTime() {
		var { comp_calendar: setting } = window.zhongjyuan.runtime.setting;
		var componentElement = setting.componentElement;

		var boxTimeElement = componentElement.querySelector("#_box_time");
		var div_time = boxTimeElement.getElementsByClassName("div-time");

		// 获取当前时间信息
		var date = new Date();
		var hour = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();

		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var week = date.getDay();

		// 格式化时间字符串
		var str = twoDigits(hour) + ":" + twoDigits(minute) + ":" + twoDigits(second);
		// 将格式化后的时间字符串设置为时间显示元素的innerHTML属性值
		div_time[0].innerHTML = str;

		// 格式化日期字符串
		str = `${year}${setting.dates[0]}${month}${setting.dates[1]}${day}${setting.dates[2]} ${setting.weeks[week]}`;
		// 将格式化后的日期字符串设置为日期显示元素的innerHTML属性值
		div_time[1].innerHTML = str;
	}

	/**
	 * 在指定的DOM元素中显示日历组件
	 * @param {HTMLElement} dom - 要展示日历的DOM元素
	 */
	function show(color, dom) {
		hide();

		import(/* webpackChunkName: "comp_calendar" */ "./index.css");

		var { translate } = window.zhongjyuan.languager;
		var { comp_calendar: setting } = window.zhongjyuan.runtime.setting;

		// 获取当前时间信息
		var _nowDate = new Date();

		// 创建日历组件的根元素
		var componentElement = document.createElement("div");
		componentElement.innerHTML = htmlTemplate;
		componentElement.setAttribute("id", setting.domId);
		componentElement.setAttribute("class", setting.domId);

		// 将日历组件添加到指定DOM元素的父元素中
		var parentElement = queryParentElement(dom);
		parentElement.appendChild(componentElement);
		setting.componentElement = componentElement;

		// 设置日期翻译名称列表
		setting.dates = [translate("date.year"), translate("date.month"), translate("date.day"), translate("date.today")];

		// 设置日历组件的周几名称列表
		setting.weeks = [
			translate("week.sun"),
			translate("week.mon"),
			translate("week.tues"),
			translate("week.wed"),
			translate("week.thur"),
			translate("week.fri"),
			translate("week.sat"),
		];

		// 设置日历组件的周几缩写列表
		setting.weekShorts = [
			translate("week.sun.short"),
			translate("week.mon.short"),
			translate("week.tues.short"),
			translate("week.wed.short"),
			translate("week.thur.short"),
			translate("week.fri.short"),
			translate("week.sat.short"),
		];

		// 设置日历组件的月份名称列表
		setting.months = [
			translate("month.jan"),
			translate("month.feb"),
			translate("month.mar"),
			translate("month.apr"),
			translate("month.may"),
			translate("month.june"),
			translate("month.july"),
			translate("month.aug"),
			translate("month.sept"),
			translate("month.oct"),
			translate("month.nov"),
			translate("month.dec"),
		];

		// 设置日历组件的其他属性
		setting.ten = 0;
		setting.mode = 0;
		setting.color = color || setting.color;
		setting.delayTimer = null;
		setting.timeInterval = null;
		setting.setYear = _nowDate.getFullYear();
		setting.setMonth = _nowDate.getMonth();
		setting.setDate = _nowDate.getDate();

		setting.currentYear = setting.setYear;
		setting.currentMonth = setting.setMonth;
		setting.currentDate = setting.setDate;

		// 构建日历
		_renderCalendar();
	}

	function hide() {
		var { comp_calendar: setting } = window.zhongjyuan.runtime.setting;
		if (setting.componentElement) setting.componentElement.remove();
	}

	return {
		show: logger.decorator(show, "calendar-show"),
		hide: logger.decorator(hide, "calendar-hide"),
	};
})();
