// 常量对象
import consts from "./consts";
window.zhongjyuan.const = {
	...window.zhongjyuan.const,
	...consts,
};

// 枚举对象
import enums from "./enums";
window.zhongjyuan.enum = {
	...window.zhongjyuan.enum,
	...enums,
};

// 工具对象
import tool from "./utils";
window.zhongjyuan.tool = {
	...window.zhongjyuan.tool,
	...tool,
};

// 事件管理对象
import eventManager from "./event";

// 外设管理对象
import peripheralManager from "./peripheral";

// 存储管理对象
import StorageManager from "./storage";

// 日历管理对象
import calendarManager from "./calendar";

// 配置事件对象
import ConfigurateEventDispatcher from "./event/ConfigurateEventDispatcher";

// 基础函数 + 基础对象
window.zhongjyuan = {
	...window.zhongjyuan,
	event: eventManager,
	...peripheralManager,
	storage: {
		local: new StorageManager("localStorage"),
		session: new StorageManager("sessionStorage"),
	},
	calendar: calendarManager,

	configurate: new ConfigurateEventDispatcher(),
};

import AudioManagement from "../base/AudioManager"; // 音频管理对象

// 音频管理对象
window.zhongjyuan.audio = {
	...window.zhongjyuan.audio,
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
