import logger from "@base/logger";
import calendar from "@common/calendar";
import { twoDigits } from "@common/utils/default";
import { setStyle, queryParentElement } from "@common/utils/dom";

import { comp_calendar_plus as htmlTemplate } from "./html";

/**
 * 日历Plus - 组件 - ZHONGJYUAN
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年9月6日09:49:17
 */
export default (() => {
	/**
	 * 根据传入的日期对象获取年份、月份和日期，并以字符串形式返回
	 * @param {Date} date - 要提取年月日的日期对象
	 * @returns {string} - 格式为YYYY-MM-DD的日期字符串
	 *
	 * @example
	 *
	 * // 获取当前日期的字符串表示
	 * var currentDate = new Date();
	 * var dateString = formatYMD(currentDate); // dateString为"2022-01-11"
	 */
	function formatYMD(date) {
		// 获取年份、月份和日期，并以字符串形式返回
		return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
	}

	/**
	 * 在给定日期上添加指定天数，并返回结果日期的字符串表示
	 * @param {Date} date - 日期对象
	 * @param {number} days - 要添加的天数（可选，默认为1）
	 * @returns {string} - 格式为YYYY-MM-DD的日期字符串
	 *
	 * @example
	 *
	 * // 给定日期为2022年1月11日
	 * var date = new Date(2022, 0, 11);
	 *
	 * // 添加1天后的日期字符串
	 * var addedDate1 = addDate(date); // addedDate1为"2022-01-12"
	 *
	 * // 添加5天后的日期字符串
	 * var addedDate2 = addDate(date, 5); // addedDate2为"2022-01-16"
	 */
	function addDate(date, days) {
		// 检查days参数是否为undefined或空字符串，如果是，则将其默认值设置为1
		if (days === undefined || days === "") {
			days = 1;
		}

		// 创建一个新的Date对象，将传入的date参数作为初始值
		var newDate = new Date(date);

		// 在新的Date对象上增加指定的天数
		newDate.setDate(newDate.getDate() + days);

		// 获取增加后的日期的月份和日，并分别存储在month和day变量中
		var month = newDate.getMonth() + 1;
		var day = newDate.getDate();

		// 使用formatDate函数对month和day进行格式化，确保它们都是两位数的字符串形式
		var formattedMonth = twoDigits(month);
		var formattedDay = twoDigits(day);

		// 将年份、格式化后的月份和格式化后的日期拼接为字符串，使用"-"分隔
		return newDate.getFullYear() + "-" + formattedMonth + "-" + formattedDay;
	}

	/**
	 * 在给定日期上减去指定天数，并返回结果日期的字符串表示
	 * @param {Date} date - 日期对象
	 * @param {number} days - 要减去的天数（可选，默认为1）
	 * @returns {string} - 格式为YYYY-MM-DD的日期字符串
	 *
	 * @example
	 *
	 * // 给定日期为2022年1月11日
	 * var date = new Date(2022, 0, 11);
	 *
	 * // 减去1天后的日期字符串
	 * var cutDate1 = cutDate(date); // cutDate1为"2022-01-10"
	 *
	 * // 减去5天后的日期字符串
	 * var cutDate2 = cutDate(date, 5); // cutDate2为"2022-01-06"
	 */
	function cutDate(date, days) {
		// 检查days参数是否为undefined或空字符串，如果是，则将其默认值设置为1
		if (days === undefined || days === "") {
			days = 1;
		}

		// 创建一个新的Date对象，将传入的date参数作为初始值
		var newDate = new Date(date);

		// 在新的Date对象上减去指定的天数
		newDate.setDate(newDate.getDate() - days);

		// 获取减去后的日期的月份和日，并分别存储在month和day变量中
		var month = newDate.getMonth() + 1;
		var day = newDate.getDate();

		// 使用formatDate函数对month和day进行格式化，确保它们都是两位数的字符串形式
		var formattedMonth = twoDigits(month);
		var formattedDay = twoDigits(day);

		// 将年份、格式化后的月份和格式化后的日期拼接为字符串，使用"-"分隔
		return newDate.getFullYear() + "-" + formattedMonth + "-" + formattedDay;
	}

	/**
	 * 将字符串日期解析为农历日期
	 * @param {string} str - 要解析的日期字符串，格式为 "YYYY-MM-DD"，默认为当前日期
	 * @returns {object} - 包含农历年、月、日的对象 { year: 农历年, month: 农历月, day: 农历日 }
	 *
	 * @example
	 *
	 * // 解析2022年1月11日这一公历日期对应的农历日期
	 * var lunarDate1 = parseLunarDate("2022-01-11"); // lunarDate1为{year: 2021, month: 12, day: 9}
	 *
	 * // 解析当前日期（假设当前日期为2022年1月11日）对应的农历日期
	 * var lunarDate2 = parseLunarDate(); // lunarDate2为{year: 2021, month: 12, day: 9}
	 */
	function parseLunarDate(str) {
		if (!str) {
			// 如果str参数未定义或为空，则默认使用当前日期
			var D = new Date();
			var yy = D.getFullYear();
			var mm = D.getMonth() + 1;
			var dd = D.getDate();
			str = yy + "-" + mm + "-" + dd;
		}

		// 使用split方法将传入的日期字符串按照"-"分隔成年、月、日三个部分，并调用calendar.solar2lunar函数将其转换为农历日期
		str = str.split("-");
		return calendar.solar2lunar(str[0], str[1], str[2]);
	}

	/**
	 * 格式化字符串日期为农历日期字符串
	 * @param {string} str - 要格式化的日期字符串，格式为 "YYYY-MM-DD"
	 * @returns {string} - 格式化后的农历日期字符串
	 *
	 * @example
	 *
	 * // 格式化2022年1月11日这一公历日期对应的农历日期字符串
	 * var formattedLunarDate = formatLunarDate("2022-01-11"); // formattedLunarDate为"庚寅年(虎) 年 腊月初九 星期二 "
	 */
	function formatLunarDate(str) {
		var { comp_calendar_plus: setting } = window.zhongjyuan.runtime.setting;

		// 调用parseLunarDate函数将传入的日期字符串解析为农历日期对象
		var lunarDate = parseLunarDate(str);

		// 构建农历日期字符串，包括干支年、生肖、年、月、日、星期和节气（如果有）
		return (
			lunarDate.gzYear +
			"(" +
			lunarDate.animal +
			")" +
			setting.dates[0] +
			" " +
			lunarDate.gzMonth +
			setting.dates[1] +
			" " +
			lunarDate.gzDay +
			setting.dates[2] +
			" " +
			lunarDate.lunarMonthChina +
			lunarDate.lunarDayChina +
			" " +
			lunarDate.weekChina +
			" " +
			(lunarDate.term ? lunarDate.term : "")
		);
	}

	/**
	 * 给日期格添加鼠标悬停效果
	 * @param {number} r - 光标范围的半径，默认值为 80
	 * @example
	 *
	 * // 在页面加载完成后调用 lightHover 函数，设置光标范围半径为 100
	 * window.addEventListener("load", () => {
	 *   lightHover(100);
	 * });
	 */
	function lightHover(r = 80) {
		var { comp_calendar_plus: setting } = window.zhongjyuan.runtime.setting;

		// 获取组件元素
		var componentElement = setting.componentElement;

		// 监听鼠标移动事件
		componentElement.addEventListener("mousemove", function (e) {
			var x = e.pageX; // 鼠标横坐标
			var y = e.pageY; // 鼠标纵坐标

			// 获取所有日期格元素
			var tds = componentElement.querySelectorAll(".light_hover");

			// 循环遍历每一个日期格
			for (let index = 0; index < tds.length; index++) {
				var element = tds[index].getBoundingClientRect(); // 获取当前日期格的位置信息
				var L = element.x; // 日期格左边距离视口左边的距离
				var R = element.x + element.width; // 日期格右边距离视口左边的距离
				var T = element.y; // 日期格上边距离视口上边的距离
				var B = element.y + element.height; // 日期格下边距离视口上边的距离

				// 计算光标与日期格的距离
				var YT = T - y - r;
				var YB = B - y + r;
				var XL = L - x - r;
				var XR = R - x + r;

				// 如果光标超出日期格反应范围，则清除该日期格的背景样式
				if (YT > 0 || XL > 0 || YB < 0 || XR < 0) {
					tds[index].style.backgroundImage = "";
				}

				// 光标在日期格的反应范围内，给日期格添加背景样式
				else {
					//将盒子反应范围分成四个区域 上 下 左 右，分别处理光标从四个反向降临

					// 光标在日期格的上方
					if (YT < 0 && YT + r > 0) {
						// 光标在日期格的左上方
						if (XL < 0 && XL + r > 0) {
							var AB = Math.sqrt((x - L) * (x - L) + (y - T) * (y - T));
							var px = r - AB;
							tds[index].style.backgroundImage = `radial-gradient(circle ${px}px at top left, #3c3c3c, #1a1a1a)`;
						}

						// 光标在日期格的正上方
						else if (XL + r < 0 && XR - r > 0) {
							tds[index].style.backgroundImage = `radial-gradient(circle ${r - (T - y)}px at top, #3c3c3c, #1a1a1a)`;
						}

						// 光标在日期格的右上方
						else if (XR > 0 && XR - r < 0) {
							var AB = Math.sqrt((x - R) * (x - R) + (y - T) * (y - T));
							var px = r - AB;
							tds[index].style.backgroundImage = `radial-gradient(circle ${px}px at top right, #3c3c3c, #1a1a1a)`;
						}
					}

					// 光标在日期格的上下之间
					else if (YT + r < 0 && YB - r > 0) {
						// 光标在日期格的左边
						if (XL < 0 && XL + r > 0) {
							tds[index].style.backgroundImage = `radial-gradient(circle ${r - (L - x)}px at  left, #3c3c3c, #1a1a1a)`;
						}

						// 光标在日期格的右边
						else if (XR > 0 && XR - r < 0) {
							tds[index].style.backgroundImage = `radial-gradient(circle ${r - (x - R)}px at  right, #3c3c3c, #1a1a1a)`;
						}
					}

					// 光标在日期格的下方
					else if (YB > 0 && YB - r < 0) {
						// 光标在日期格的左下方
						if (XL < 0 && XL + r > 0) {
							var AB = Math.sqrt((x - L) * (x - L) + (y - B) * (y - B));
							var px = r - AB;
							tds[index].style.backgroundImage = `radial-gradient(circle ${px}px at bottom left, #3c3c3c, #1a1a1a)`;
						}

						// 光标在日期格的正下方
						else if (XL + r < 0 && XR - r > 0) {
							tds[index].style.backgroundImage = `radial-gradient(circle ${r - (y - B)}px at bottom, #3c3c3c, #1a1a1a)`;
						}

						// 光标在日期格的右下方
						else if (XR > 0 && XR - r < 0) {
							var AB = Math.sqrt((x - R) * (x - R) + (y - B) * (y - B));
							var px = r - AB;
							tds[index].style.backgroundImage = `radial-gradient(circle ${px}px at bottom right, #3c3c3c, #1a1a1a)`;
						}
					}
				}

				// 当光标在日期格内部时，给日期格添加背景色
				if (x > L && x < R && y > T && y < B) {
					tds[index].style.backgroundImage = "";
					tds[index].style.backgroundColor = "#7d7e7e";
				} else {
					tds[index].style.backgroundColor = "";
				}
			}
		});
	}

	/**
	 * 渲染日历
	 * @param {Date|string} setDate - 要设置的日期，可以是Date对象或者日期字符串。如果为空，则使用当前日期。
	 * @example
	 * renderCalendar(); // 渲染当前日期的日历
	 * renderCalendar("2024-01-20"); // 渲染指定日期的日历
	 */
	function renderCalendar(setDate) {
		var { comp_calendar_plus: setting } = window.zhongjyuan.runtime.setting; // 获取日历组件元素

		var componentElement = setting.componentElement; // 获取日历组件 DOM 元素
		var dateBox = componentElement.querySelectorAll("td"); // 获取日期格

		// 设置当前日期
		if (typeof setDate == "string") {
			setDate = new Date(setDate); // 将日期字符串转换为 Date 对象
		} else if (!setDate) {
			setDate = new Date(); // 如果日期为空，则使用当前日期
		}

		var setDate_yy = setDate.getFullYear(); // 获取年份
		var setDate_mm = setDate.getMonth() + 1; // 获取月份，注意月份是从 0 开始的，所以要加 1
		var setDate_dd = setDate.getDate(); // 获取日期
		var setDate_week = setDate.getDay(); // 获取星期几

		// 更新日历组件中显示日期的元素
		componentElement.querySelector(".date .d").innerHTML = `${setDate_yy}-${twoDigits(setDate_mm)}-${twoDigits(setDate_dd)}`;

		// 计算当前日期所在月份的1号
		var monthFirstDate = new Date(setDate_yy, setDate_mm - 1, 1);
		var monthFirstDate_yy = monthFirstDate.getFullYear();
		var monthFirstDate_mm = monthFirstDate.getMonth() + 1;
		var monthFirstDate_dd = monthFirstDate.getDate();
		var monthFirstDate_week = monthFirstDate.getDay(); // 本月一号是星期几

		// 当为周日时，将其置为7
		if (monthFirstDate_week == 0) {
			monthFirstDate_week = 7;
		}

		// 计算日历中第一天的日期
		let calendarDay = cutDate(`${monthFirstDate_yy}-${monthFirstDate_mm}-${monthFirstDate_dd}`, monthFirstDate_week - 1);

		for (let index = 0; index < dateBox.length; index++) {
			let calendarDate = calendarDay.split("-"); // 拆分第一天的日期为年、月、日
			let son = dateBox[index].children; // 获取当前日期格的子元素

			dateBox[index].classList = "light_hover"; // 添加样式
			son[0].innerHTML = calendarDate[2]; // 更新日期格中的日期
			var lunarDay = parseLunarDate(calendarDay); // 解析农历日期信息
			son[1].innerHTML = lunarDay.term ? lunarDay.term : lunarDay.lunarDayChina; // 更新日期格中的农历信息（如果有节气则显示节气，否则显示农历日期）

			// 判断是否为当前月份
			if (calendarDate[1] == monthFirstDate_mm) {
				if (formatYMD(new Date(calendarDay)) == formatYMD(new Date())) {
					dateBox[index].classList = "light_hover active click";
					componentElement.querySelector(".date2 .d2").innerHTML = `${setting.dates[3]} ${formatLunarDate(calendarDay)}`;
				} else if (new Date(calendarDay).getDate() == setDate_dd) {
					dateBox[index].classList = "light_hover click";
					componentElement.querySelector(".date2 .d2").innerHTML = formatLunarDate(calendarDay);
				}
			} else {
				dateBox[index].classList = "light_hover disable"; // 添加样式
			}
			dateBox[index].setAttribute("data-date", calendarDay); // 设置日期格的自定义属性"data-date"，存储日期信息

			calendarDay = addDate(calendarDay); // 获取下一天的日期
		}
	}

	/**
	 * 展示当前时间，并检查是否需要更新日历
	 * @example
	 * showTime(); // 在日历组件中展示当前时间，并检查是否需要更新日历
	 */
	function showTime() {
		var { comp_calendar_plus: setting } = window.zhongjyuan.runtime.setting;
		var componentElement = setting.componentElement;

		// 设置时区偏移量为8小时，并获取当前时间的时区偏移量和时间戳
		var timezone = 8;
		var offset_GMT = new Date().getTimezoneOffset();
		var nowDate = new Date().getTime();

		// 计算当前日期（根据本地时间和时区偏移量）
		var today = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);

		// 在日历组件中找到时间显示的元素（<h1>标签），将格式化后的时间设置为其内容
		componentElement.querySelector(".time h1").innerHTML = today.format(setting.format);

		// 检查当前日期是否与日历组件中的日期不一致，如果不一致则调用setCalendar()函数更新日历
		var setDate = new Date(componentElement.querySelector(".date .d").innerHTML);
		if (today.getDate() != setDate.getDate()) {
			renderCalendar();
		}
	}

	/**
	 * 显示日历组件，并设置相关样式和事件处理函数
	 * @param {string} color - 背景颜色
	 * @param {HTMLElement} dom - 指定的DOM元素
	 * @example
	 * show("#ff0000", document.getElementById("calendar"));
	 */
	function show(color, dom) {
		hide();

		import(/* webpackChunkName: "comp_calendar_plus" */ "./index.css");

		// 导入语言翻译函数和日历组件设置
		var { translate } = window.zhongjyuan.languager;
		var { comp_calendar_plus: setting } = window.zhongjyuan.runtime.setting;

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

		// 设置背景颜色
		setting.color = color || setting.color;
		setStyle(componentElement, "background", setting.color);
		setStyle(componentElement.querySelector(".time"), "background", setting.color);
		setStyle(componentElement.getElementsByTagName("table")[0], "background", setting.color);

		var spanElements = componentElement.getElementsByTagName("table")[0].getElementsByTagName("span");
		for (let j = 0; j < spanElements.length; j++) {
			setStyle(spanElements[j], "background", setting.color);
		}

		// 设置日期翻译名称列表
		setting.dates = [translate("date.year"), translate("date.month"), translate("date.day"), translate("date.today")];

		// 设置日历组件的周几缩写列表
		setting.weekShorts = [
			translate("week.mon.short"),
			translate("week.tues.short"),
			translate("week.wed.short"),
			translate("week.thur.short"),
			translate("week.fri.short"),
			translate("week.sat.short"),
			translate("week.sun.short"),
		];

		var weeks = componentElement.querySelectorAll("th");
		for (let index = 0; index < weeks.length; index++) {
			weeks[index].innerHTML = setting.weekShorts[index];
		}

		// 移除选中效果
		function removeSelect() {
			var dateBox = componentElement.querySelectorAll("td");
			for (let i = 0; i < dateBox.length; i++) {
				dateBox[i].classList.remove("click");
			}
		}

		// 显示日期
		componentElement.querySelector(".time p").innerHTML =
			_nowDate.getFullYear() +
			setting.dates[0] +
			(_nowDate.getMonth() + 1) +
			setting.dates[1] +
			_nowDate.getDate() +
			setting.dates[2] +
			" " +
			formatLunarDate();

		// 日期点击事件
		componentElement.querySelector(".time p").addEventListener("click", () => renderCalendar());
		componentElement.querySelector(".date .d").addEventListener("click", () => renderCalendar());

		// 下一个月点击事件
		componentElement.querySelector(".date .r").addEventListener("click", () => {
			var setDate = new Date(componentElement.querySelector(".date .d").innerHTML);
			setDate.setMonth(setDate.getMonth() + 1);
			renderCalendar(setDate);
		});

		// 上一个月点击事件
		componentElement.querySelector(".date .l").addEventListener("click", () => {
			var setDate = new Date(componentElement.querySelector(".date .d").innerHTML);
			setDate.setMonth(setDate.getMonth() - 1);
			renderCalendar(setDate);
		});

		// 日期格点击事件
		var dateBox = componentElement.querySelectorAll("td");
		for (let i = 0; i < dateBox.length; i++) {
			(function (element) {
				element.addEventListener("click", function (event) {
					removeSelect();
					element.classList.add("click");
					if (formatYMD(new Date(element.dataset.date)) == formatYMD(new Date())) {
						componentElement.querySelector(".date2 .d2").innerHTML = `${setting.dates[3]} ${formatLunarDate(element.dataset.date)}`;
					} else {
						componentElement.querySelector(".date2 .d2").innerHTML = formatLunarDate(element.dataset.date);
					}
				});
			})(dateBox[i]);
		}

		// 光晕效果
		lightHover();

		// 日历设置
		renderCalendar();

		// 时间
		showTime();

		setting.timeInterval = window.setInterval(showTime, 1000);
	}

	/**
	 * 隐藏日历组件
	 * @example
	 * hide();
	 */
	function hide() {
		// 导入日历组件设置
		var { comp_calendar_plus: setting } = window.zhongjyuan.runtime.setting;

		// 检查日历组件是否存在
		if (setting.componentElement) {
			// 移除日历组件
			setting.componentElement.remove();
		}
	}

	return {
		show: logger.decorator(show, "calendar-plus-show"),
		hide: logger.decorator(hide, "calendar-plus-hide"),
	};
})();
