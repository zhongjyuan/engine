import logger from "@common/logManagement";
import { isFunction } from "@common/utils/default";
import { addClass, getStyle, hasClass, removeClass, setStyle } from "@common/utils/dom";
import { imageThemeColor } from "@common/utils/image";

import { comp_login as htmlTemplate } from "./html";

/**
 * 登录 - 组件 - ZHONGJYUAN
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年8月31日20:06:33
 */
export default (() => {
	function show(callback) {
		hide();

		import(/* webpackChunkName: "comp_login" */ "./index.css");

		var { runtime, languager, getVariable } = window.zhongjyuan;
		var { translate } = languager;
		var { comp_login: setting } = runtime.setting;

		setting.componentElement = document.createElement("div");
		setting.componentElement.innerHTML = htmlTemplate;
		setting.componentElement.setAttribute("id", setting.domId);
		setting.componentElement.setAttribute("class", setting.domId);

		var captchaGroup = setting.componentElement.querySelector("#captcha-group");

		/**背景图片 */
		var loginBackgroundImage = getVariable("login-background");
		var staticBackground = setting.componentElement.querySelector(".static-background");
		setStyle(staticBackground, "backgroundImage", `url(${loginBackgroundImage})`);

		/**登录提交按钮 */
		var submitBtn = setting.componentElement.querySelector("#login-btn");
		var captchaInput = setting.componentElement.querySelector("#captcha");
		var userNameInput = setting.componentElement.querySelector("#username");
		var passwordInput = setting.componentElement.querySelector("#password");
		submitBtn.addEventListener("click", function (event) {
			event.preventDefault(); // 阻止默认提交行为

			setting.data = {
				code: 1,
				message: "登录成功!",
				userName: userNameInput.value,
				password: passwordInput.value,
				captcha: captchaInput.value,
			};

			isFunction(callback) && callback(setting.data);
		});

		/**切换背景按钮 */
		var switchBtn = setting.componentElement.querySelector("#switch-btn");
		var loginForm = setting.componentElement.querySelector("#login-form");
		var background = setting.componentElement.querySelector("#background");
		switchBtn.addEventListener("click", function () {
			if (hasClass(this, "active")) {
				removeClass(this, "active");
				addClass(this, "inactive");

				addClass(background, "switched");

				this.innerHTML = '<i class="fa fa-play"></i>';
				imageThemeColor(
					getStyle(staticBackground, "backgroundImage")
						.replace(/^url\(["']?/, "")
						.replace(/["']?\)$/, ""),
					(color) => setStyle(loginForm, "backgroundColor", color),
					0.8
				);
			} else if (hasClass(this, "inactive")) {
				removeClass(this, "inactive");
				addClass(this, "active");

				removeClass(background, "switched");

				switchBtn.innerHTML = '<i class="fa fa-pause"></i>';
				setStyle(loginForm, "backgroundColor", "#fff");
			}
		});

		/**发送验证码按钮 */
		var sendCaptchaBtn = setting.componentElement.querySelector("#send-captcha");
		sendCaptchaBtn.addEventListener("click", function () {
			setting.captchaInterval = window.setInterval(function () {
				setting.captchaCountDown--;
				sendCaptchaBtn.disabled = true;
				sendCaptchaBtn.innerHTML = `${translate("send.again")}(${setting.captchaCountDown})`;
				if (setting.captchaCountDown == 0) {
					window.clearInterval(setting.captchaInterval);
					sendCaptchaBtn.innerHTML = translate("send.captcha");
					sendCaptchaBtn.disabled = false;
					setting.captchaCountDown = 60;
				}
			}, 1000);
		});

		/**第三方二维码 */
		var thirdPartyLogin = setting.componentElement.querySelector("#third-party-login");
		var thirdPartyIcons = thirdPartyLogin.querySelectorAll("i");
		thirdPartyIcons.forEach(function (icon) {
			icon.addEventListener("click", function () {
				thirdPartyIcons.forEach(function (icon) {
					removeClass(icon, "active");
				});
				addClass(icon, "active");

				var index = Array.prototype.indexOf.call(thirdPartyIcons, icon);
				var qrcode = document.createElement("img");
				qrcode.src = getVariable("wechat-image");
				qrcode.alt = "qrcode-" + (index + 1);
				qrcode.style.width = "200px";
				qrcode.style.height = "200px";
				qrcode.style.margin = "20px auto";

				var dialog = document.createElement("div");
				dialog.style.position = "fixed";
				dialog.style.top = "0";
				dialog.style.left = "0";
				dialog.style.right = "0";
				dialog.style.bottom = "0";
				dialog.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
				dialog.style.display = "flex";
				dialog.style.justifyContent = "center";
				dialog.style.alignItems = "center";
				dialog.appendChild(qrcode);
				dialog.addEventListener("click", function () {
					document.body.removeChild(dialog);
				});

				document.body.appendChild(dialog);
			});
		});

		var parentElement = document.getElementById(runtime.setting.custom.rootElement) || document.body;
		parentElement.appendChild(setting.componentElement);
	}

	function hide() {
		var { comp_login: setting } = window.zhongjyuan.runtime.setting;
		if (setting.componentElement) setting.componentElement.remove();
	}

	return {
		show: logger.decorator(show, "login-show"),
		hide: logger.decorator(hide, "login-hide"),
	};
})();
