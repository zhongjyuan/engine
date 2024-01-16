/**
 * 全局事件
 */
export const global = {
	/**开始Load */
	LOAD_START: "LOAD_START",
	/**完成Load */
	LOAD_FINISH: "LOAD_FINISH",
	/**开始Ready */
	READY_START: "READY_START",
	/**完成Ready */
	READY_FINISH: "READY_FINISH",
	/**开始Init */
	INIT_START: "INIT_START",
	/**完成Init */
	INIT_FINISH: "INIT_FINISH",
};

/**
 * 字典事件
 */
export const dictionary = {
	PRE_ADD: "PRE_ADD",
	PRE_UPDATE: "PRE_UPDATE",
	PRE_DEL: "PRE_DEL",
	PRE_CLEAN: "PRE_CLEAN",
	ADD: "ADD",
	UPDATE: "UPDATE",
	DEL: "DEL",
	CLEAN: "CLEAN",
};

/**事件常量 */
export default {
	global: global,
	dictionary: dictionary,
};
