import logger from "@base/logger";
import { queryParentElement } from "@common/utils/dom";

import { comp_wallpaper_meteor as htmlTemplate } from "./html";

/**
 * 流星 - 组件 - ZHONGJYUAN
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年8月31日20:06:33
 */
export default (() => {
	/**
	 * 显示流星
	 * @param {HTMLElement|String} dom DOM对象或DOM对象ID
	 */
	function show(dom) {
		hide();

		import(/* webpackChunkName: "comp_wallpaper_meteor" */ "./index.css");

		const { comp_wallpaper_meteor: setting } = window.zhongjyuan.runtime.setting;

		const componentElement = document.createElement("div");
		componentElement.innerHTML = htmlTemplate;
		componentElement.setAttribute("id", setting.domId);
		componentElement.setAttribute("class", setting.domId);

		const parentElement = queryParentElement(dom);
		parentElement.appendChild(componentElement);

		setting.componentElement = componentElement;
	}

	/**隐藏流星 */
	function hide() {
		const { comp_wallpaper_meteor: setting } = window.zhongjyuan.runtime.setting;
		if (setting.componentElement) setting.componentElement.remove();
	}

	return {
		show: logger.decorator(show, "meteor-show"),
		hide: logger.decorator(hide, "meteor-hide"),
	};
})();
