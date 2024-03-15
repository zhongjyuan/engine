
import "../../css/core/core.css";
import "../../css/core/core-grid.css";

import "../../css/component/loading.css";
import "../../css/component/popup.css";
import "../../css/component/login.css";

ZHONGJYUAN.windowOnMessage();

ZHONGJYUAN.setVariable("rootElement", ZHONGJYUAN.static.rootElement);
ZHONGJYUAN.setVariable("vueRootElement", ZHONGJYUAN.static.vueRootElement);
ZHONGJYUAN.setVariable("vueBeforeRootElement", ZHONGJYUAN.static.vueBeforeRootElement);

import vueTemplate from "../../../components/custom/core/win.html";
ZHONGJYUAN.setVariable("vueTemplate", vueTemplate);

import systemTemplate from "../../../components/custom/core/system.html";
ZHONGJYUAN.setVariable("systemTemplate", systemTemplate);

import browserTemplate from "../../../components/custom/core/browser.html";
ZHONGJYUAN.setVariable("browserTemplate", browserTemplate);

import storeTemplate from "../../../components/custom/core/store.html";
ZHONGJYUAN.setVariable("storeTemplate", storeTemplate);

import favicon from "../../../../favicon.ico";
ZHONGJYUAN.setVariable("favicon", favicon, true);

import gif_error_0 from "../../image/error/0.gif";
ZHONGJYUAN.setVariable("gif_error_0", gif_error_0, true);
import png_error_0 from "../../image/error/0.png";
ZHONGJYUAN.setVariable("png_error_0", png_error_0, true);

import gif_404_0 from "../../image/404/0.gif";
ZHONGJYUAN.setVariable("gif_404_0", gif_404_0, true);
import png_404_0 from "../../image/404/0.png";
ZHONGJYUAN.setVariable("png_404_0", png_404_0, true);
import png_404_1 from "../../image/404/1.png";
ZHONGJYUAN.setVariable("png_404_1", png_404_1, true);

import weChatImage from "../../image/wechat.png";
ZHONGJYUAN.setVariable("weChatImage", weChatImage, true);

import loginBackgroundImage from "../../image/wall-paper/13.jpg";
ZHONGJYUAN.setVariable("loginBackgroundImage", loginBackgroundImage, true);

/**
 * 初始化加载
 * @author zhongjyuan
 * @date   2023年6月1日17:06:48
 * @email  zhongjyuan@outlook.com
 */
ZHONGJYUAN.onLoad(function() {
	ZHONGJYUAN.logger.trace("window.[onLoad]: begin");
	var lang = ZHONGJYUAN.static.lang;
	var helper = ZHONGJYUAN.helper;
	var component = ZHONGJYUAN.component;

	if (lang.toLocaleLowerCase() === "auto") {
		lang = helper.lang().toLowerCase();
	}

	var fileUrl = "./config/langs/" + lang + ".json";
	helper.io.request(fileUrl, "GET", function(error, responseText) {
		if (!error) {
			ZHONGJYUAN.loadLanguage(responseText);
			ZHONGJYUAN.loadResources();
		} else {
			lang = "en";
			fileUrl = "./config/langs/" + lang + ".json";
			helper.io.request(fileUrl, "GET", function(error, responseText) {
				if (!error) {
					ZHONGJYUAN.loadLanguage(responseText);
					ZHONGJYUAN.loadResources();
				} else {
					component.popup.open("语言加载失败</br>扫码快速反馈-v-");
					ZHONGJYUAN.logger.error("window.[onLoad]: request langs error.");
				}
			});
		}
	});
	ZHONGJYUAN.logger.trace("window.[onLoad]: end");
});

/**
 * 增加访问记录[ZHONGJYUAN.loadResources()后执行(1)]
 * @author zhongjyuan
 * @date   2023年6月1日17:06:54
 * @email  zhongjyuan@outlook.com
 */
ZHONGJYUAN.addOnLoad(function() {
	ZHONGJYUAN.logger.trace("window.[onLoad accessRecord]: begin");
	var helper = ZHONGJYUAN.helper;
	var component = ZHONGJYUAN.component;

	helper.io.request("https://ipinfo.io/json?token=1425e6edd5b9a7", "GET", function(error, responseText) {
		if (!error) {
			var response = JSON.parse(responseText);
			const ip = response.ip;
			const loc = response.loc;
			const org = response.org;
			const city = response.city;
			const region = response.region;
			const country = response.country;
			const timezone = response.timezone;
			const userAgent = navigator.userAgent;

			const object = {
				ip: ip,
				loc: loc,
				org: org,
				city: city,
				region: region,
				country: country,
				timezone: timezone,
				userAgent: userAgent,
				time: new Date().toISOString(),
			};
			ZHONGJYUAN.logger.debug("window.[onLoad accessRecord] result:${0}", JSON.stringify(object));
		} else {
			component.popup.open("定位失败</br>扫码快速反馈-v-");
			ZHONGJYUAN.logger.error("window.[onLoad accessRecord]: request ipinfo error");
		}
	});
	ZHONGJYUAN.logger.trace("window.[onLoad accessRecord]: end");
});

/**
 * 增加配置加载[ZHONGJYUAN.loadResources()后执行(2)]
 * @author zhongjyuan
 * @date   2023年6月1日17:07:01
 * @email  zhongjyuan@outlook.com
 */
ZHONGJYUAN.addOnLoad(function() {
	ZHONGJYUAN.logger.trace("window.[onLoad configInitialize]: begin");
	var helper = ZHONGJYUAN.helper;
	var component = ZHONGJYUAN.component;
	var fileName = ZHONGJYUAN.static.storage.basic;

	var loadName = helper.url.parseObject().params.load;
	if (helper.check.isNormal(loadName)) {
		if (loadName === fileName && localStorage.getItem(fileName)) {
			ZHONGJYUAN.initialize();
			return;
		}
		fileName = loadName;
	}

	var fileUrl = /^\w+$/.test(fileName) ? "./config/" + fileName + ".json" : "./config/" + fileName;
	ZHONGJYUAN.logger.debug("window.[onLoad configInitialize]: fileName: " + fileUrl);
	helper.io.request(fileUrl, "GET", function(error, responseText) {
		if (!error) {
			ZHONGJYUAN.initialize(JSON.parse(responseText));
		} else {
			component.popup.open("配置读取失败</br>扫码快速反馈-v-");
			ZHONGJYUAN.logger.error("window.[onLoad configInitialize]: request configs error");
		}
	});
	ZHONGJYUAN.logger.trace("window.[onLoad configInitialize]: end");
});

/**
 * 增加自动运行[ZHONGJYUAN.initialize()后执行(2)]
 * @author zhongjyuan
 * @date   2023年6月1日17:07:08
 * @email  zhongjyuan@outlook.com
 */
ZHONGJYUAN.addOnReady(function() {
	ZHONGJYUAN.logger.trace("window.[onReady autoRun]: begin");
	var vue = ZHONGJYUAN.vue;

	var autoRunApp = [];
	for (var i in vue.apps) {
		if (vue.apps[i].autoRun > 0) {
			autoRunApp.push(i);
		}
	}
	ZHONGJYUAN.logger.debug("window.[onReady autoRun] autoRunApp:${0}", JSON.stringify(autoRunApp));

	autoRunApp.sort(function(a, b) {
		return vue.apps[b].autoRun - vue.apps[a].autoRun;
	});

	autoRunApp.forEach(function(app) {
		var winId = vue.app_open(app, {});
		if (vue.apps[app].plugin && vue.runtime.isSmallScreen) {
			vue.$nextTick(function() {
				vue.win_minimize(winId);
			});
		}
	});
	ZHONGJYUAN.logger.trace("window.[onReady autoRun]: end");
});

/**
 * 增加社区版提醒[ZHONGJYUAN.initialize()后执行(3)]
 * @author zhongjyuan
 * @date   2023年6月1日17:07:15
 * @email  zhongjyuan@outlook.com
 */
ZHONGJYUAN.addOnReady(function() {
	ZHONGJYUAN.logger.trace("window.[onReady serial]: begin ${0}", !ZHONGJYUAN.static.serialNumber);
	if (ZHONGJYUAN.static.serialNumber) {
		setTimeout(function() {
			ZHONGJYUAN.api.message.win(
				"window v" + ZHONGJYUAN.static.version + " 开发版1",
				"当前为开发版，欢迎大家一起参与学习讨论。<br/>更多信息请访问:<br/>ZHONGJYUAN官网：" +
					'<a style="color: white" target="_blank" href="http://www.zhongjyuan.club">http://www.zhongjyuan.club</a>' +
					'<p>欢迎大家扫码关注公众号回复:"加群",进群讨论交流，提出您对WINDOW的建议~<br/><br/>' +
					'<img style="width: 100%" src="./assets/image/wechat.png"/></p>'
			);
		}, 1500);
	}
	ZHONGJYUAN.logger.trace("window.[onReady serial]: end");
});

/**
 * 增加离开警告[ZHONGJYUAN.initialize()后执行(4)]
 * @author zhongjyuan
 * @date   2023年6月5日14:16:50
 * @email  zhongjyuan@outlook.com
 */
ZHONGJYUAN.addOnReady(function() {
	ZHONGJYUAN.logger.trace("window.[onReady beforeunload]: begin");
	if (window.addEventListener) {
		window.addEventListener("beforeunload", function(event) {
			if (!ZHONGJYUAN.static.switch.askBeforeClose) return;
			event.returnValue = ZHONGJYUAN.api.lang("BeforeUnload");
		});
	} else {
		window.attachEvent("onbeforeunload", function() {
			if (!ZHONGJYUAN.static.switch.askBeforeClose) return;
			window.event.returnValue = ZHONGJYUAN.api.lang("BeforeUnload");
		});
	}
	ZHONGJYUAN.logger.trace("window.[onReady beforeunload]: end");
});
