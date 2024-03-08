import logger from "@base/logger";
import { countup } from "@common/utils/math";
import { setStyle } from "@common/utils/dom";
import { formatString } from "@common/utils/format";

import { comp_time_up as htmlTemplate } from "./html";

/**
 * 时间计时 - 组件 - ZHONGJYUAN
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年8月31日11:42:26
 */
export default (() => {
	/**
	 * 隐藏时间
	 */
	function hide() {
		var { comp_time_up: setting } = window.zhongjyuan.runtime.setting;

		if (setting?.interval) window.clearInterval(setting.interval);

		if (setting.componentElement) setting.componentElement.remove();

		delete setting.componentElement;
	}

	/**
	 * 显示时间
	 */
	function show(startTime, callback, opt = {}) {
		hide();
		import(/* webpackChunkName: "comp_time_up" */ "./index.css");

		var { custom, comp_time_up: setting } = window.zhongjyuan.runtime.setting;

		var componentElement = document.createElement("div");
		componentElement.setAttribute("id", setting.domId);
		componentElement.setAttribute("class", setting.domId);
		componentElement.innerHTML = htmlTemplate;

		var parentElement = document.getElementById(custom.rootElement) || document.body;
		parentElement.appendChild(componentElement);

		var options = {
			startTime: startTime || new Date().format("yyyy-MM-dd HH:mm:ss"),
			callback: callback || function (time) {},
			title: opt.hasOwnProperty("title") ? opt.title : setting.title,
			year: opt.hasOwnProperty("year") ? opt.year : setting.year,
			month: opt.hasOwnProperty("month") ? opt.month : setting.month,
			day: opt.hasOwnProperty("day") ? opt.day : setting.day,
			hour: opt.hasOwnProperty("hour") ? opt.hour : setting.hour,
			minute: opt.hasOwnProperty("minute") ? opt.minute : setting.minute,
			second: opt.hasOwnProperty("second") ? opt.second : setting.second,
			millisecond: opt.hasOwnProperty("millisecond") ? opt.millisecond : setting.millisecond,
		};

		// 定义选项数组
		var timeArray = ["year", "month", "day", "hour", "minute", "second", "millisecond"];

		componentElement.querySelector("#content").innerHTML = formatString(options.title, new Date(options.startTime).format("yyyy年MM月dd日 HH:mm:ss"));
		countup(options.startTime, function (time) {
			// 遍历选项数组
			timeArray.forEach((option) => {
				var element = componentElement.querySelector(`#${option}`);
				if (options[option]) {
					element.innerHTML = time[`${option}Zero`];
				} else {
					setStyle(componentElement.querySelector(`.${option}`), { display: "none" });
				}
			});

			options.callback(time);
		});

		setting.componentElement = componentElement;
	}

	return {
		show: logger.decorator(show, "time-up-show"),
		hide: logger.decorator(hide, "time-up-hide"),
	};
})();
