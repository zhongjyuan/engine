import logger from "@base/logger";

import { comp_time as htmlTemplate } from "./html";

/**
 * 时间 - 组件 - ZHONGJYUAN
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
		var { comp_time: setting } = window.zhongjyuan.runtime.setting;

		if (setting?.interval) clearInterval(setting.interval);

		if (setting.componentElement) setting.componentElement.remove();
	}

	/**
	 * 显示时间
	 */
	function show() {
		hide();

		import(/* webpackChunkName: "comp_time" */ "./index.css");

		var { custom, comp_time: setting } = window.zhongjyuan.runtime.setting;

		setting.componentElement = document.createElement("div");
		setting.componentElement.setAttribute("id", setting.domId);
		setting.componentElement.setAttribute("class", setting.domId);
		setting.componentElement.innerHTML = htmlTemplate;
		setting.componentElement.textContent = new Date().format(setting.format);

		var parentElement = document.getElementById(custom.rootElement) || document.body;
		parentElement.appendChild(setting.componentElement);

		setting.interval = setInterval(() => {
			setting.componentElement.textContent = new Date().format(setting.format);
		}, 1000);
	}

	return {
		show: logger.decorator(show, "time-show"),
		hide: logger.decorator(hide, "time-hide"),
	};
})();
