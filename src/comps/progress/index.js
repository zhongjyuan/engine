import logger from "@common/logManagement";
import { isEmpty, isFunction, isInt } from "@common/utils/default";
import { setStyle } from "@common/utils/dom";
import { parsePercent } from "@common/utils/format";

import { comp_progress as htmlTemplate } from "./html";

/**
 * 进度 - 组件 - ZHONGJYUAN
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年8月22日16:30:06
 */
export default (() => {
	/**
	 * 加载完成记录
	 * @author zhongjyuan
	 * @date   2023年6月5日16:15:21
	 * @email  zhongjyuan@outlook.com
	 * @param {*} message 加载消息
	 */
	function completeUp(message) {
		var { comp_progress: setting } = window.zhongjyuan.runtime.setting;

		if (setting.complete == setting.max) return;
		setting.complete++;
		if (message) {
			setting.message = `${message}[${setting.complete}/${setting.max}]`;
		}
	}

	/**
	 * 加载动画渲染轮询
	 * @author zhongjyuan
	 * @date   2023年6月5日16:15:45
	 * @email  zhongjyuan@outlook.com
	 */
	function loadAnimationInterval() {
		var { logger, runtime } = window.zhongjyuan;
		var { comp_progress: setting } = runtime.setting;

		setting.loadingAnimationInterval = setInterval(function () {
			var percent = setting.complete / setting.max;

			var percentElement = setting.componentElement.querySelector("#percent");
			var resourceNameElement = setting.componentElement.querySelector("#resource-name");

			percentElement.innerHTML = parsePercent(percent, 2);
			resourceNameElement.innerHTML = logger.isDebug() ? setting.message : setting.translate["progress.moment"];

			//loading动画
			var deg = percent * 3.6 * 100;
			var degRight = deg - 180;
			if (degRight > 0) {
				degRight = 0;
			}

			if (!setting.fifty && percent >= 0.5) {
				setTimeout(function () {
					setting.fifty = true;
				}, 500);
			}

			var degLeft = deg - 360;
			if (degLeft < -180) {
				degLeft = -180;
			}

			setting.componentElement.querySelector("#percent-right").style.transform = `rotate(${degRight}deg)`;
			if (setting.fifty) {
				setting.componentElement.querySelector("#percent-left").style.transform = `rotate(${degLeft}deg)`;
			}
		}, 200);
	}

	/**
	 * 加载虚拟资源
	 * @author zhongjyuan
	 * @date   2023年6月5日16:20:51
	 * @email  zhongjyuan@outlook.com
	 */
	function loadShamInterval() {
		var { comp_progress: setting } = window.zhongjyuan.runtime.setting;

		setting.loadShamResourceInterval = setInterval(function () {
			if (setting.sham > 0) {
				setting.sham--;
				setting.complete++;
				setting.message = `sham-resources[${setting.complete}/${setting.max}]`;
			}
		}, 1000);
	}

	/**
	 * 校验是否完成轮询
	 * @author zhongjyuan
	 * @date   2023年6月5日16:21:03
	 * @email  zhongjyuan@outlook.com
	 */
	function checkCompleteInterval() {
		var { languager, runtime } = window.zhongjyuan;
		var { comp_progress: setting } = runtime.setting;

		setting.firstTime = Date.now();
		setting.checkLoadCompleteInterval = setInterval(function () {
			var fastLoad = Date.now() - setting.firstTime < 500;

			if (!fastLoad) {
				setStyle(setting.componentElement, "opacity", "1");
			}

			if (setting.complete === setting.max) {
				window.clearInterval(setting.loadShamResourceInterval);
				window.clearInterval(setting.checkLoadCompleteInterval);

				setting.message = setting.translate["progress.complete"];

				setTimeout(
					function () {
						window.clearInterval(setting.loadingAnimationInterval);
						setting.parentElement.removeChild(setting.componentElement);
						setting.callback && setting.callback();
						setting.complete = 0;
					},
					fastLoad ? 0 : 1000
				);
			}
		}, 100);
	}

	/**
	 * 展示加载画面
	 * @author zhongjyuan
	 * @date   2023年6月5日16:21:27
	 * @email  zhongjyuan@outlook.com
	 * @param {*} max 最大资源
	 * @param {*} real 真实资源
	 * @param {*} callback 完成回调
	 */
	function show(max, real, callback) {
		if (!isInt(max)) {
			throw new Error(`参数异常：max<${JSON.stringify(max)}>必须是整数类型.`);
		}

		if (max < 1) {
			throw new Error(`参数异常：max<${JSON.stringify(max)}>必须大于0.`);
		}

		if (!isInt(real)) {
			throw new Error(`参数异常：real<${JSON.stringify(real)}>必须是整数类型.`);
		}

		if (real > max) {
			throw new Error(`参数异常：real<${JSON.stringify(real)}>必须大于max<${JSON.stringify(max)}>.`);
		}
		import(/* webpackChunkName: "comp_progress" */ "./index.css");

		var { languager, runtime } = window.zhongjyuan;
		var { translate } = languager;
		var { name, statement } = runtime;
		var { comp_progress: setting } = window.zhongjyuan.runtime.setting;

		setting.max = max;
		setting.real = real || max;
		setting.sham = setting.max - setting.real;
		setting.message = "...";
		setting.translate = {
			"progress.moment": translate("progress.moment"),
			"progress.complete": translate("progress.complete"),
		};

		setting.componentElement = document.createElement("div");
		setting.componentElement.innerHTML = htmlTemplate;
		setting.componentElement.setAttribute("id", setting.domId);
		setting.componentElement.setAttribute("class", setting.domId);

		setting.componentElement.querySelector("#progress-box").style.display = "block";
		setting.componentElement.querySelector("#software-name").innerHTML = name;
		setting.componentElement.querySelector("#software-describe").innerHTML = translate("progress.describe");
		setting.componentElement.querySelector("#software-statement").innerHTML = statement;

		setting.parentElement = document.getElementById(runtime.setting.custom.rootElement) || document.body;
		setting.parentElement.appendChild(setting.componentElement);

		if (!isEmpty(callback) && isFunction(callback)) setting.callback = callback;

		loadAnimationInterval();
		loadShamInterval();
		checkCompleteInterval();
	}

	return {
		show: logger.decorator(show, "progress-show"),
		completeUp: logger.decorator(completeUp, "progress-complete-up"),
		checkComplete: logger.decorator(checkCompleteInterval, "progress-check-complete"),
	};
})();
