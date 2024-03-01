/**全局配置装载 */
window.zhongjyuan.addLoad(() => {
	const icon = require("@resources/favicon.ico");
	const wechatImage = require("@resources/wechat.png");
	const crowdPeoplesImage = require("@resources/images/comp-crowd-peoples-sheet.png");
	const loginBackgroundImage = require("@resources/images/comp-login-background-0.jpg");

	// 使用 CommonJS 的 require 语法导入 ICO 文件时，不需要使用 .default。
	// 使用 CommonJS 的 require 语法导入 PNG 文件时，需要使用 .default。
	// 使用 CommonJS 的 require 语法导入 JPG 文件时，需要使用 .default。

	window.zhongjyuan.setVariable("icon", icon, true);
	window.zhongjyuan.setVariable("wechat-image", wechatImage.default, true);
	window.zhongjyuan.setVariable("crowd-config", { src: crowdPeoplesImage.default, rows: 15, cols: 7 });
	window.zhongjyuan.setVariable("login-background", loginBackgroundImage.default, true);
});

/**开启离开警告 */
window.zhongjyuan.addReady(() => {
	if (window.addEventListener) {
		window.addEventListener("beforeunload", function (event) {
			event.preventDefault();
			event.returnValue = window.zhongjyuan.languager.translate("alert.close.before");
		});
	} else {
		window.attachEvent("onbeforeunload", function () {
			window.event.returnValue = window.zhongjyuan.languager.translate("alert.close.before");
		});
	}
});

/**开启搜索框 */
window.zhongjyuan.addReady(() => {
	window.zhongjyuan.comp.search.show();
});

/**登录跳转 */
// window.zhongjyuan.addReady(() => {
// 	window.zhongjyuan.comp.login.show((date) => {
// 		window.zhongjyuan.comp.login.hide();
// 		window.zhongjyuan.comp.setting.show();
// 	});
// });

/**
 * 初始化加载[onLoad => load => ready]
 * @author zhongjyuan
 * @date   2023年6月1日17:06:48
 * @email  zhongjyuan@outlook.com
 */
window.zhongjyuan.onLoad(() => {
	var { setting } = window.zhongjyuan.runtime;
	if (setting.lang.toLocaleLowerCase() === "auto") setting.lang = window.zhongjyuan.languager.currentLanguage();

	window.zhongjyuan.tool.request(setting.langResources, "GET", function (error, responseText) {
		if (!error) {
			window.zhongjyuan.runtime.languages = eval("(" + responseText + ")");
		}
	});
});
