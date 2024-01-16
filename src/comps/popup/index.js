import logger from "@common/logManagement";
import { uuid } from "@common/utils/default";
import { setStyle } from "@common/utils/dom";

import { comp_popup as htmlTemplate } from "./html";

/**
 * 弹窗 - 组件 - ZHONGJYUAN
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年5月18日14:14:26
 */
export default (() => {
	/**
	 * 打开弹窗
	 * @param {*} content 正文
	 * @param {*} title 标题
	 * @param {*} titlebarColor 标题栏底色
	 * @param {*} imgUrl 图片地址
	 */
	function open(content, title, titlebarColor, imgUrl) {
		import(/* webpackChunkName: "comp_popup" */ "./index.css");

		var { runtime, languager, getVariable } = window.zhongjyuan;
		var { translate } = languager;
		var { custom, comp_popup: setting } = runtime.setting;

		var key = uuid();
		var defaultOptions = {
			title: title || translate("popup.title"),
			imgUrl: imgUrl || getVariable("wechat-image"),
			content: content || translate("popup.content"),
			titlebarColor,
		};

		var componentElement = document.createElement("div");
		componentElement.innerHTML = htmlTemplate;
		componentElement.className = setting.domId;
		componentElement.setAttribute("class", setting.domId);
		componentElement.setAttribute("id", `${setting.domId}-${key}`);

		var imageElement = componentElement.querySelector("img");
		var titleElement = componentElement.querySelector(".title");
		var contentElement = componentElement.querySelector("p");
		var titlebarElement = componentElement.querySelector(".titlebar");
		var closeButtonElement = componentElement.querySelector(".close");

		if (defaultOptions.barColor) {
			setStyle(titlebarElement, "backgroundColor", defaultOptions.titlebarColor);
		}

		if (defaultOptions.title) {
			titleElement.textContent = defaultOptions.title;
		}

		if (defaultOptions.imgUrl) {
			imageElement.src = defaultOptions.imgUrl;
		}

		if (defaultOptions.content) {
			imageElement.alt = content;
			contentElement.innerHTML = content;
		}

		closeButtonElement.addEventListener("click", function () {
			componentElement.parentNode.removeChild(componentElement);
			delete setting.componentElements[`${setting.domId}-${key}`];
		});

		window.onclick = function (event) {
			if (event.target == componentElement) {
				componentElement.parentNode.removeChild(componentElement);
				delete setting.componentElements[`${setting.domId}-${key}`];
			}
		};

		var parentElement = document.getElementById(custom.rootElement) || document.body;
		parentElement.appendChild(componentElement);

		setting.componentElements[`${setting.domId}-${key}`] = componentElement;
	}

	return {
		open: logger.decorator(open, "popup-open"),
	};
})();
