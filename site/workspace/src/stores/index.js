import { configureStore } from "@reduxjs/toolkit";

import demoReducer from "@/stores/modules/demo";

import appReducer from "@/stores/modules/app";
import contextMenuReducer from "@/stores/modules/context-menu";
import desktopReducer from "@/stores/modules/desktop";
import fileExplorerReducer from "@/stores/modules/file-explorer";
import globalReducer from "@/stores/modules/global";
import settingReducer from "@/stores/modules/setting";
import sidepaneReducer from "@/stores/modules/pane";
import startMenuReducer from "@/stores/modules/start";
import taskbarReducer from "@/stores/modules/taskbar";
import wallpaperReducer from "@/stores/modules/wallpaper";
import widgetpaneReducer from "@/stores/modules/widget";

// configureStore 创建一个 redux 数据
const store = configureStore({
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
	reducer: {
		counter: demoReducer,
		apps: appReducer,
		contextmenu: contextMenuReducer,
		desktop: desktopReducer,
		fileexplorer: fileExplorerReducer,
		global: globalReducer,
		setting: settingReducer,
		sidepane: sidepaneReducer,
		startmenu: startMenuReducer,
		taskbar: taskbarReducer,
		wallpaper: wallpaperReducer,
		widgetpane: widgetpaneReducer,
	},
});
export default store;
