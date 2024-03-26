import store from "@/stores";

import * as Actions from "@/actions";

/**
 * 处理上下文菜单点击事件。
 * @param {Event} event - 点击事件。
 * @param {Object} menus - 菜单项数据。
 */
export const windowOnContextMenu = (event, menus) => {
	// 阻止事件冒泡
	event.stopPropagation();

	// 解构出事件目标的数据集中的 slice、action 和 payload
	var { slice, action, payload } = event.target.dataset;

	var type = action; // 将 action 设置为默认的 type
	if (slice) {
		// 如果存在 slice，则将 slice 和 action 拼接作为新的 type
		type = `${slice}/${action}`;
	}

	var data = { type, payload };

	if (data.type) {
		if (!slice) {
			// 对非标准 action 类型进行处理
			Actions[data.type](data.payload, menus);
		} else {
			// 发起 Redux action
			store.dispatch(data);
		}

		store.dispatch({ type: "context-menu/hide" }); // 隐藏菜单
	}
};