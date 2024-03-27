import store from "@/stores";

import { deepClone } from "@/utils";

/**
 * 根据菜单中指定位置的选项是否被选中来刷新操作。
 * @param {Object} pl - 传入的参数对象。
 * @param {Object} menu - 菜单对象。
 */
export const refreshDesktop = (context) => {
	var { business: menu } = context;

	// 检查菜单中指定位置的选项是否被选中
	var isOptionSelected = menu.menus.desk[0].opts[4].check;

	if (isOptionSelected) {
		// 如果选中，则先发送 desktop/hide 类型的操作到 store
		store.dispatch({ type: "desktop/hide" });

		// 延迟 100 毫秒后发送 desktop/show 类型的操作到 store
		setTimeout(() => {
			store.dispatch({ type: "desktop/show" });
		}, 100);
	}
};

/**
 * 切换桌面选项的状态并发送相应操作到 store。
 * @param {Object} payload - 要传递给 store 的数据。
 * @param {Object} menu - 菜单对象。
 */
export const toggleDesktopDisplay = (context) => {
	var { business: menu } = context;

	// 复制一份菜单对象，避免直接修改传入的参数
	var updatedMenu = deepClone(menu);

	// 切换桌面选项的状态（选中/未选中）
	updatedMenu.menus.desk[0].opts[4].check = !updatedMenu.menus.desk[0].opts[4].check;

	// 发送 desktop/toggle 类型的操作到 store
	store.dispatch({ type: "desktop/toggle" });

	// 发送 context-menu/set 类型的操作到 store，payload 为更新后的菜单对象
	store.dispatch({ type: "context-menu/set", payload: updatedMenu });
};

/**
 * 改变排序方式操作，根据传入的排序参数和菜单对象执行相应的操作。
 * @param {string} sort - 排序参数，可以是 "name", "size" 或其他。
 * @param {Object} menu - 菜单对象。
 */
export const toggleDesktopSort = (context) => {
	var { payload: sort, business: menu } = context;

	// 复制一份菜单对象，避免直接修改传入的参数
	var updatedMenu = deepClone(menu);

	// 将所有排序选项的提示点重置为 false
	updatedMenu.menus.desk[1].opts[0].dot = false;
	updatedMenu.menus.desk[1].opts[1].dot = false;
	updatedMenu.menus.desk[1].opts[2].dot = false;

	// 根据传入的排序参数设置不同的操作
	if (sort == "name") {
		updatedMenu.menus.desk[1].opts[0].dot = true;
	} else if (sort == "size") {
		updatedMenu.menus.desk[1].opts[1].dot = true;
	} else {
		updatedMenu.menus.desk[1].opts[2].dot = true;
	}

	// 调用 refresh 函数刷新菜单显示
	refreshDesktop({ business: updatedMenu });

	// 发送 desktop/sort 类型的操作到 store，payload 为排序参数
	store.dispatch({ type: "desktop/sort", payload: sort });

	// 发送 context-menu/set 类型的操作到 store，payload 为更新后的菜单对象
	store.dispatch({ type: "context-menu/set", payload: updatedMenu });
};

/**
 * 改变图标大小操作，根据传入的大小参数和菜单对象执行相应的操作。
 * @param {string} size - 图标大小参数，可以是 "large", "medium" 或其他。
 * @param {Object} menu - 菜单对象。
 */
export const toggleDesktopIconSize = (context) => {
	var { payload: size, business: menu } = context;

	// 复制一份菜单对象，避免直接修改传入的参数
	var updatedMenu = deepClone(menu);

	// 将所有选项的提示点重置为 false
	updatedMenu.menus.desk[0].opts.forEach((option) => (option.dot = false));

	// 默认图标大小系数设为 1
	var iconSizeFactor = 1;

	// 根据传入的大小参数设置不同的操作
	switch (size) {
		case "large":
			updatedMenu.menus.desk[0].opts[0].dot = true;
			iconSizeFactor = 1.5;
			break;
		case "medium":
			updatedMenu.menus.desk[0].opts[1].dot = true;
			iconSizeFactor = 1.2;
			break;
		default:
			updatedMenu.menus.desk[0].opts[2].dot = true;
	}

	// 调用 refresh 函数刷新菜单显示
	refreshDesktop({ business: updatedMenu });

	// 发送 desktop/setSize 类型的操作到 store，payload 为图标大小系数
	store.dispatch({ type: "desktop/setSize", payload: iconSizeFactor });

	// 发送 context-menu/set 类型的操作到 store，payload 为更新后的菜单对象
	store.dispatch({ type: "context-menu/set", payload: updatedMenu });
};
