import {
	onLoad,
	addLoad,
	executeLoad,
	addReady,
	executeReady,
	setVariable,
	getVariable,
	createRuntimeProperty,
	loadStyle,
	loadScript,
	loadPrefetch,
} from "./common/base"; // 基础函数

// import debugManagement from "./common/debugManagement"; // 调试管理对象
import logManagement from "./common/logManagement"; // 日志管理对象
import langManagement from "./common/langManagement"; // 语言管理对象
import eventManagement from "./common/eventManagement"; // 事件管理对象
import calendarManagement from "./common/calendarManagement"; // 日历管理对象

import StorageManagement from "./common/StorageManagement"; // 存储管理对象
import ClavierManagement from "./common/peripheral/ClavierManagement"; // 键盘管理对象
import CursorManagement from "./common/peripheral/CursorManagement"; // 光标管理对象
import MouseManagement from "./common/peripheral/MouseManagement"; // 鼠标管理对象
import TouchManagement from "./common/peripheral/TouchManagement"; // 触屏管理对象

import SimpleConfigInfo from "./common/event/SimpleConfigInfo"; // 简单配置对象
import NotificationManagement from "./common/event/NotificationManagement"; // 消息管理对象

// 基础函数 + 基础对象
window.zhongjyuan = {
	...window.zhongjyuan,
	onLoad: logManagement.decorator(onLoad, "on-load"),
	addLoad: logManagement.decorator(addLoad, "add-load"),
	executeLoad: logManagement.decorator(executeLoad, "execute-load"),
	addReady: logManagement.decorator(addReady, "add-ready"),
	executeReady: logManagement.decorator(executeReady, "execute-ready"),
	setVariable: logManagement.decorator(setVariable, "set-variable"),
	getVariable: logManagement.decorator(getVariable, "get-variable"),
	createRuntimeProperty: logManagement.decorator(createRuntimeProperty, "create-runtime-property"),
	loadStyle: logManagement.decorator(loadStyle, "load-style"),
	loadScript: logManagement.decorator(loadScript, "load-script"),
	loadPrefetch: logManagement.decorator(loadPrefetch, "load-prefetch"),

	calendar: calendarManagement,
	event: eventManagement,
	languager: langManagement,
	logger: logManagement,

	config: new SimpleConfigInfo(),
	notify: new NotificationManagement(),
	storage: {
		localStorage: new StorageManagement("localStorage"),
		sessionStorage: new StorageManagement("sessionStorage"),
	},
	clavier: new ClavierManagement(),
	cursor: new CursorManagement(),
	mouse: new MouseManagement(),
	touch: new TouchManagement(),
};

import statusEnum from "./common/enums/status"; // 状态枚举对象
import permissionEnum from "./common/enums/permission"; // 权限枚举对象

// 枚举对象
window.zhongjyuan.enum = {
	...window.zhongjyuan.enum,
	status: statusEnum,
	permission: permissionEnum,
};

import defaultConst from "./common/consts/default"; // 默认常量对象
import eventConst from "./common/consts/event"; // 事件常量对象
import httpConst from "./common/consts/http"; // HTTP常量对象
import languageConst from "./common/consts/language"; // 语言常量对象
import peripheralConst from "./common/consts/peripheral"; // 键鼠常量对象
import regularConst from "./common/consts/regular"; // 规则常量对象
import typeConst from "./common/consts/type"; // 类型常量对象
import weatherConst from "./common/consts/weather"; // 天气常量对象

// 常量对象
window.zhongjyuan.const = {
	...window.zhongjyuan.const,
	...defaultConst,
	event: eventConst,
	http: httpConst,
	language: languageConst,
	peripheral: peripheralConst,
	regular: regularConst,
	type: typeConst,
	weather: weatherConst,
};

import array from "./common/utils/array"; // 数组函数对象
import browse from "./common/utils/browse"; // 浏览器函数对象
import business from "./common/utils/business"; // 业务函数对象
import color from "./common/utils/color"; // 颜色函数对象
import common from "./common/utils/default"; // 默认函数对象
import dom from "./common/utils/dom"; // DOM函数对象
import file from "./common/utils/file"; // 文件函数对象
import format from "./common/utils/format"; // 格式化函数对象
import image from "./common/utils/image"; // 图像函数对象
import math from "./common/utils/math"; // 计算函数对象
import object from "./common/utils/object"; // 对象函数对象
import random from "./common/utils/random"; // 随机函数对象
import request from "./common/utils/request"; // 请求函数对象
import screen from "./common/utils/screen"; // 屏幕函数对象
import site from "./common/utils/site"; // 站点函数对象
import storage from "./common/utils/storage"; // 存储函数对象
import system from "./common/utils/system"; // 系统函数对象

// 工具函数
window.zhongjyuan.tool = {
	...window.zhongjyuan.tool,
	array: array,
	browse: browse,
	...business,
	color: color,
	...common,
	dom: dom,
	file: file,
	...format,
	image: image,
	math: math,
	object: object,
	random: random,
	...request,
	screen: screen,
	site: site,
	storage: storage,
	system: system,
};

import calendarComp from "./comps/calendar/index"; // 日历组件
import calendarPlusComp from "./comps/calendar_plus/index"; // 日历 Plus 组件
import colorPickerComp from "./comps/color_picker/index"; // 取色器 组件
import contextMenuComp from "./comps/context_menu/index"; // 右键菜单 组件
import loginComp from "./comps/login/index"; // 登录 组件
import popupComp from "./comps/popup/index"; // 弹窗 组件
import progressComp from "./comps/progress/index"; // 进度 组件
import searchComp from "./comps/search/index"; // 查询 组件
import settingComp from "./comps/setting/index"; // 设置 组件
import socketComp from "./comps/socket/index"; // Socket 组件
import timeComp from "./comps/time/index"; // 时间 组件
import timeDownComp from "./comps/time_down/index"; // 倒计时 组件
import timeUpComp from "./comps/time_up/index"; // 计时 组件
import wallpaperPeopleComp from "./comps/wallpaper_crowd/index"; // 人群背景 组件
import wallpaperMeteorComp from "./comps/wallpaper_meteor/index"; // 流星背景 组件
import watermarkComp from "./comps/watermark/index"; // 水印 组件

// 组件对象
window.zhongjyuan.comp = {
	...window.zhongjyuan.comp,
	calendar: calendarComp,
	calendarPlus: calendarPlusComp,
	colorPicker: colorPickerComp,
	contextMenu: contextMenuComp,
	login: loginComp,
	popup: popupComp,
	progress: progressComp,
	search: searchComp,
	setting: settingComp,
	socket: socketComp,
	time: {
		...timeComp,
		down: timeDownComp,
		up: timeUpComp,
	},
	wallpaper: {
		people: wallpaperPeopleComp,
		meteor: wallpaperMeteorComp,
	},
	watermark: watermarkComp,
};

import appConfigTemplate from "./window/app/configTemplate"; // Window 应用配置模版
import buttonConfigTemplate from "./window/button/configTemplate"; // Window 按钮配置模版
import menuConfigTemplate from "./window/menu/configTemplate"; // Window 菜单配置模版
import shortcutConfigTemplate from "./window/shortcut/configTemplate"; // Window 快捷配置模版
import tileConfigTemplate from "./window/tile/configTemplate"; // Window 磁贴配置模版
import winConfigTemplate from "./window/win/configTemplate"; // Window 窗口配置模版
import windowConfigTemplate from "./window/configTemplate"; // Window 配置模版

// Window 对象
window.zhongjyuan.window = {
	...window.zhongjyuan.window,
	appConfigTemplate: appConfigTemplate,
	buttonConfigTemplate: buttonConfigTemplate,
	menuConfigTemplate: menuConfigTemplate,
	shortcutConfigTemplate: shortcutConfigTemplate,
	tileConfigTemplate: tileConfigTemplate,
	winConfigTemplate: winConfigTemplate,
	windowConfigTemplate: windowConfigTemplate,
};

export default window.zhongjyuan;

// ========================================================================================================================

/**动态增加HTML元素 */
window.zhongjyuan.addLoad(() => {
	document.title = `${window.zhongjyuan.runtime.name} | ${window.zhongjyuan.runtime.version} | ${window.zhongjyuan.runtime.authorization}`;

	/**异步加载外部资源（gsap、jquery、fontawesome） */
	import(/* webpackChunkName: "jquery" */ "@extends/jquery/jquery.3.7.1.min.js").then((module) => {
		window.$ = module.default; /**将 jQuery 绑定到全局变量中 */
		window.jQuery = module.default; /**将 jQuery 绑定到全局变量中 */
		import(/* webpackChunkName: "jquery.slimscroll" */ "@extends/jquery/jquery.slimscroll.1.3.8.min.js");
		import(/* webpackChunkName: "fontawesome" */ "@extends/fontawesome-6.4.2/css/all.min.css");
		import(/* webpackChunkName: "gsap" */ "@extends/gsap/gsap.3.12.2.min.js");
	});

	const head = document.head;
	const body = document.body;

	/**创建 link 元素，用于设置网页图标 */
	const favicon = document.createElement("link");
	favicon.rel = "shortcut icon";
	favicon.type = "image/x-icon";
	favicon.href = "./favicon.ico";
	favicon.media = "screen";
	head.appendChild(favicon);

	const metaTags = [
		{ httpEquiv: "Expires", content: "0" } /**设置缓存过期时间为0，禁止缓存 */,
		{ httpEquiv: "Cache", content: "no-cache" } /**禁止缓存 */,
		{ httpEquiv: "Pragma", content: "no-cache" } /**禁止缓存 */,
		{ httpEquiv: "Cache-control", content: "no-cache" } /**禁止缓存 */,
		{ httpEquiv: "Content-Type", content: "text/html; charset=UTF-8" } /**设置内容类型和字符集为UTF-8 */,
		{ name: "X-UA-Compatible", content: "IE=edge,chrome=1" } /**在IE和Chrome浏览器中使用最新的渲染引擎 */,
		{ name: "renderer", content: "webkit" } /**使用Webkit渲染引擎 */,
		{ name: "HandheldFriendly", content: "True" } /**适配手持设备 */,
		{ name: "msapplication-tap-highlight", content: "no" } /**禁用触摸高亮效果 */,
		{ name: "apple-mobile-web-app-capable", content: "yes" } /**开启web app功能 */,
		{ name: "apple-mobile-web-app-title", content: "Title" } /**设置Web应用标题 */,
		{ name: "apple-mobile-web-app-status-bar-style", content: "black" } /**设置状态栏样式为黑色 */,
		{ name: "viewport", content: "width=device-width, initial-scale=1.0" } /**设置视口宽度及初始缩放比例 */,
		{ name: "description", content: window.zhongjyuan.statement },
		{ name: "keywords", content: `${window.zhongjyuan.name},${window.zhongjyuan.version},${window.zhongjyuan.authorization}` },
		{ name: "author", content: window.zhongjyuan.author },
		{ name: "google", content: "notranslate" },
	];

	/**遍历需要添加的 meta 标签数组 */
	for (const meta of metaTags) {
		/**创建 meta 元素 */
		const metaTag = document.createElement("meta");
		if (meta.httpEquiv) {
			/**如果 http-equiv 属性不为空，则将其添加到 meta 元素中 */
			metaTag.setAttribute("http-equiv", meta.httpEquiv);
		} else {
			/**否则将 name 属性添加到 meta 元素中 */
			metaTag.setAttribute("name", meta.name);
		}
		/**将 content 属性添加到 meta 元素中 */
		metaTag.setAttribute("content", meta.content);
		/**将 meta 元素添加到文档头部标签中 */
		head.appendChild(metaTag);
	}

	/**创建根元素 div */
	const rootElement = document.createElement("div");
	rootElement.setAttribute("id", window.zhongjyuan.runtime.setting.custom.rootElement);
	rootElement.setAttribute("class", window.zhongjyuan.runtime.setting.custom.rootElement);

	/**创建 Vue 根元素前的占位元素 div */
	const vueBeforeRootElement = document.createElement("div");
	vueBeforeRootElement.setAttribute("id", window.zhongjyuan.runtime.setting.custom.vueRootElementBefore);
	vueBeforeRootElement.setAttribute("class", window.zhongjyuan.runtime.setting.custom.vueRootElementBefore);

	rootElement.appendChild(vueBeforeRootElement);
	body.appendChild(rootElement);
});

/**开启水印组件 */
window.zhongjyuan.addLoad(() => {
	watermarkComp.set({ author: window.zhongjyuan.runtime.author, website: window.zhongjyuan.runtime.website, email: window.zhongjyuan.runtime.email });
});

/**事件订阅 */
window.zhongjyuan.addLoad(() => {
	window.zhongjyuan.notify.on(
		"load-finish",
		(name, age) => {
			console.log(`My name is ${name}, and I am ${age} years old.`);
		},
		this
	);

	window.zhongjyuan.notify.on(
		"load-exception",
		(name, age) => {
			console.log(`My name is ${name}, and I am ${age} years old.`);
		},
		this
	);
});

import AudioManagement from "./common/AudioManagement"; // 音频管理对象

/**全局音频装载 */
window.zhongjyuan.addLoad(() => {
	window.zhongjyuan.cursor.load("finger", "./resources/images/finger.png");
	window.zhongjyuan.audio = {
		loop: new AudioManagement("./resources/audios/loop.mp3", false),
		waou: new AudioManagement("./resources/audios/waou.mp3", false),
		open: new AudioManagement("./resources/audios/open.mp3", false),
		start: new AudioManagement("./resources/audios/start.mp3", false),
		error: new AudioManagement("./resources/audios/error.mp3", false),
		notify: new AudioManagement("./resources/audios/notify.mp3", false),
		enheng: new AudioManagement("./resources/audios/enheng.mp3", false),
		boling: new AudioManagement("./resources/audios/boling.mp3", false),
		wooden: new AudioManagement("./resources/audios/wooden.mp3", false),
		refresh: new AudioManagement("./resources/audios/refresh.mp3", false),
		diu: new AudioManagement("./resources/audios/diu.ogg", false),
		fly: new AudioManagement("./resources/audios/fly.ogg", false),
		warn: new AudioManagement("./resources/audios/warn.ogg", false),
		wave: new AudioManagement("./resources/audios/wave.ogg", false),
		move: new AudioManagement("./resources/audios/move.ogg", false),
		evil: new AudioManagement("./resources/audios/evil.ogg", false),
		bang: new AudioManagement("./resources/audios/bang.ogg", false),
		ding: new AudioManagement("./resources/audios/ding.ogg", false),
		wond: new AudioManagement("./resources/audios/wond.ogg", false),
		crush: new AudioManagement("./resources/audios/crush.ogg", false),
		click: new AudioManagement("./resources/audios/click.ogg", false),
		dudui: new AudioManagement("./resources/audios/dudui.ogg", false),
		break: new AudioManagement("./resources/audios/break.ogg", false),
		smash: new AudioManagement("./resources/audios/smash.ogg", false),
		shoot: new AudioManagement("./resources/audios/shoot.ogg", false),
		light: new AudioManagement("./resources/audios/light.ogg", false),
		sweep: new AudioManagement("./resources/audios/sweep.ogg", false),
		water: new AudioManagement("./resources/audios/water.ogg", false),
		hammer: new AudioManagement("./resources/audios/hammer.ogg", false),
		dingling: new AudioManagement("./resources/audios/dingling.ogg", false),
		lightning: new AudioManagement("./resources/audios/lightning.ogg", false),
	};
});
