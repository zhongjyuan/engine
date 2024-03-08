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
} from "./base"; // 基础函数

// require("./debuger"); // 调试管理对象

import logger from "./logger"; // 日志管理对象
import languager from "./languager"; // 语言管理对象
import NoticeEventDispatcher from "./NoticeEventDispatcher"; // 消息管理对象

// 基础函数 + 基础对象
window.zhongjyuan = {
	...window.zhongjyuan,
	onLoad: logger.decorator(onLoad, "on-load"),
	addLoad: logger.decorator(addLoad, "add-load"),
	executeLoad: logger.decorator(executeLoad, "execute-load"),
	addReady: logger.decorator(addReady, "add-ready"),
	executeReady: logger.decorator(executeReady, "execute-ready"),
	setVariable: logger.decorator(setVariable, "set-variable"),
	getVariable: logger.decorator(getVariable, "get-variable"),
	createRuntimeProperty: logger.decorator(createRuntimeProperty, "create-runtime-property"),
	loadStyle: logger.decorator(loadStyle, "load-style"),
	loadScript: logger.decorator(loadScript, "load-script"),
	loadPrefetch: logger.decorator(loadPrefetch, "load-prefetch"),

	logger: logger,
	languager: languager,

	notify: new NoticeEventDispatcher(),
};
