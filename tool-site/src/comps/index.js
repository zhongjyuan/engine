import calendarComp from "./calendar"; // 日历组件
import calendarPlusComp from "./calendar_plus"; // 日历 Plus 组件
import colorPickerComp from "./color_picker"; // 取色器 组件
import contextMenuComp from "./context_menu"; // 右键菜单 组件
import loginComp from "./login"; // 登录 组件
import popupComp from "./popup"; // 弹窗 组件
import progressComp from "./progress"; // 进度 组件
import searchComp from "./search"; // 查询 组件
import settingComp from "./setting"; // 设置 组件
import socketComp from "./socket"; // Socket 组件
import timeComp from "./time"; // 时间 组件
import timeDownComp from "./time_down"; // 倒计时 组件
import timeUpComp from "./time_up"; // 计时 组件
import wallpaperPeopleComp from "./wallpaper_crowd"; // 人群背景 组件
import wallpaperMeteorComp from "./wallpaper_meteor"; // 流星背景 组件
import watermarkComp from "./watermark"; // 水印 组件

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
