import store from "@/stores";

/**
 * 改变任务栏对齐方式操作，根据传入的对齐参数和菜单对象执行相应的操作。
 * @param {string} align - 对齐参数，可以是 "left" 或 "right"。
 * @param {Object} menu - 菜单对象。
 */
export const toggleTaskAlign = (context) => {
	var { payload: align, business: menu } = context;
	
	// 复制一份菜单对象，避免直接修改传入的参数
	var updatedMenu = { ...menu };

	// 获取当前任务栏对齐方式
	var currentAlign = align === "left" ? 0 : 1;

	// 如果当前对齐方式已经是目标对齐方式，则直接返回，不执行后续操作
	if (updatedMenu.menus.task[0].opts[currentAlign].dot) {
		return;
	}

	// 将所有对齐选项的提示点重置为 false
	updatedMenu.menus.task[0].opts.forEach((option) => (option.dot = false));

	// 根据传入的对齐参数设置不同的操作
	updatedMenu.menus.task[0].opts[currentAlign].dot = true;

	// 发送 taskbar/alignToggle 类型的操作到 store
	store.dispatch({ type: "taskbar/alignToggle" });

	// 发送 context-menu/set 类型的操作到 store，payload 为更新后的菜单对象
	store.dispatch({ type: "context-menu/set", payload: updatedMenu });
};

/**
 * 隐藏应用预览。(鼠标离开隐藏预览)
 */
export const hidePreview = () => {
	store.dispatch({ type: "taskbar/hidePreview" });
};

/**
 * 显示应用预览。(鼠标停留显示预览)
 * @param {Event} event - 事件对象，用于获取目标元素。
 */
export const showPreview = (event) => {
	// 获取事件目标元素
	var ele = event.target;

	// 向上查找具有"value"属性的父元素
	while (ele && ele.getAttribute("value") == null) {
		ele = ele.parentElement;
	}

	// 获取应用名称
	var appPrev = ele.getAttribute("value");

	// 计算元素左侧相对于视口的位置
	var xpos = window.scrollX + ele.getBoundingClientRect().left;

	// 计算偏移百分比
	var offsetx = Math.round((xpos * 10000) / window.innerWidth) / 100;

	// 分发显示应用预览的动作至 store
	store.dispatch({
		type: "taskbar/showPreview",
		payload: {
			app: appPrev, // 应用名称
			pos: offsetx, // 位置偏移百分比
		},
	});
};
