import logger from "@common/logManagement";
import { mouseDrag } from "@common/utils/dom";

import { comp_setting as htmlTemplate, comp_setting_0, comp_setting_1, comp_setting_2 } from "./html";

/**
 * 设置 - 组件 - ZHONGJYUAN
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
		var { comp_setting: setting } = window.zhongjyuan.runtime.setting;

		if (setting.componentElement) setting.componentElement.remove();
	}

	/**
	 * 显示时间
	 */
	function show() {
		hide();
		import(/* webpackChunkName: "comp_setting" */ "./index.css");

		var { custom, comp_setting: setting } = window.zhongjyuan.runtime.setting;

		var componentElement = document.createElement("div");
		componentElement.setAttribute("id", setting.domId);
		componentElement.setAttribute("class", setting.domId);
		componentElement.innerHTML = htmlTemplate;

		var parentElement = document.getElementById(custom.rootElement) || document.body;
		parentElement.appendChild(componentElement);

		setting.componentElement = componentElement;

		var data = componentElement.querySelector("#data");
		var menuList = componentElement.querySelector("#menu");
		var menuItems = [
			{ name: "用户信息", link: "链接1" },
			{ name: "设备状态", link: "链接2" },
			{ name: "设备控制", link: "链接3" },
			{ name: "退出", link: "链接3" },
		];

		menuItems.forEach((item, index) => {
			var menu = document.createElement("li");
			menu.textContent = item.name;
			menu.classList.add("menu-item");
			menuList.appendChild(menu);

			// 添加其他操作...
			let compSetting = null;
			switch (index) {
				case 0:
					compSetting = comp_setting_0;
					break;
				case 1:
					compSetting = comp_setting_1;
					break;
				case 2:
					compSetting = comp_setting_2;
					break;
				default:
					compSetting = comp_setting_0;
			}

			menu.addEventListener("click", () => {
				var prevSelected = menuList.querySelector(".selected");
				if (prevSelected) prevSelected.classList.remove("selected");

				menu.classList.add("selected");

				var title = componentElement.querySelector("#title");
				title.textContent = item.name;
				data.innerHTML = compSetting;

				if (item.name === "退出") {
					hide();

					zhongjyuan.comp.login.show(function (date) {
						zhongjyuan.comp.login.hide();
						zhongjyuan.comp.setting.show();
					});
				}
			});

			if (index === 0) {
				menu.classList.add("selected");

				var title = componentElement.querySelector("#title");
				title.textContent = item.name;

				data.innerHTML = compSetting;
			}
		});

		var hrefList = componentElement.querySelector("#panel-left-bottom");
		var hrefItems = [
			{ name: "版本信息", link: "链接1" },
			{ name: "隐私政策", link: "链接2" },
			{ name: "操作手册", link: "链接3" },
		];

		var innerHtml = "";
		hrefItems.forEach((item, index) => {
			innerHtml += ` <span style="cursor: pointer" onclick="window.location.href='${item.link}';">${item.name}</span> |`;
		});
		hrefList.innerHTML = innerHtml.slice(0, -1);

		var setButton = componentElement.querySelector("#set-button");
		var setPanel = componentElement.querySelector("#set-panel");

		// 设置按钮点击事件
		setButton.addEventListener("click", function () {
			if (setPanel.style.display === "none") {
				setPanel.style.width = `${Math.floor(window.innerWidth * 0.5)}px`;
				setPanel.style.height = `${Math.floor(window.innerHeight * 0.5)}px`;

				setPanel.style.left = `${setButton.offsetLeft + setting.leftOffset}px`;
				setPanel.style.bottom = `calc(100% - ${setButton.offsetTop - setting.topOffset}px)`;

				setPanel.style.display = "flex";
			} else {
				setPanel.style.display = "none";
			}
		});

		// 窗口大小变化事件
		window.addEventListener("resize", function () {
			var isFullscreen = setPanel.classList.contains("fullscreen");

			if (isFullscreen) {
				setPanel.style.width = `${Math.floor(window.innerWidth)}px`;
				setPanel.style.height = `${Math.floor(window.innerHeight)}px`;

				setPanel.style.top = "0px";
				setPanel.style.left = "0px";
			} else {
				setPanel.style.removeProperty("top");

				setPanel.style.width = `${Math.floor(window.innerWidth * 0.5)}px`;
				setPanel.style.height = `${Math.floor(window.innerHeight * 0.5)}px`;

				setPanel.style.left = `${setButton.offsetLeft + setting.leftOffset}px`;
				setPanel.style.bottom = `calc(100% - ${setButton.offsetTop - setting.topOffset}px)`;
			}
		});

		var fullscreen = componentElement.querySelector("#fullscreen");
		fullscreen.addEventListener("click", function () {
			var isFullscreen = setPanel.classList.contains("fullscreen");

			if (!isFullscreen) {
				setPanel.classList.add("fullscreen");

				fullscreen.classList.add("fa-compress");
				fullscreen.classList.remove("fa-expand");

				setPanel.style.width = `${Math.floor(window.innerWidth)}px`;
				setPanel.style.height = `${Math.floor(window.innerHeight)}px`;

				setPanel.style.top = "0px";
				setPanel.style.left = "0px";
			} else {
				setPanel.style.removeProperty("top");
				setPanel.classList.remove("fullscreen");

				fullscreen.classList.add("fa-expand");
				fullscreen.classList.remove("fa-compress");

				setPanel.style.width = `${Math.floor(window.innerWidth * 0.5)}px`;
				setPanel.style.height = `${Math.floor(window.innerHeight * 0.5)}px`;

				setPanel.style.left = `${setButton.offsetLeft + setting.leftOffset}px`;
				setPanel.style.bottom = `calc(100% - ${setButton.offsetTop - setting.topOffset}px)`;
			}
		});
	}

	return {
		show: logger.decorator(show, "setting-show"),
		hide: logger.decorator(hide, "setting-hide"),
	};
})();
