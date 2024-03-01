import app from "./app"; // Window 应用对象
import button from "./button"; // Window 按钮对象
import menu from "./menu"; // Window 菜单对象
import shortcut from "./shortcut"; // Window 快捷对象
import tile from "./tile"; // Window 磁贴对象
import win from "./win"; // Window 窗口对象

import configTemplate from "./configTemplate"; // Window 配置模版

// Window 对象
window.zhongjyuan.window = {
	...window.zhongjyuan.window,
	app: app,
	button: button,
	menu: menu,
	shortcut: shortcut,
	tile: tile,
	win: win,
	config: {
		template: configTemplate,
	},
};
