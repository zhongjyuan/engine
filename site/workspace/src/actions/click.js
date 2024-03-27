import store from "@/stores";

import * as Actions from "@/actions";

/**
 * 处理点击事件并触发相应的 dispatch 操作
 *
 * @param {Event} event - 点击事件对象
 * @param {any} businessData - 业务相关数据，默认为 null
 * @param {function} beforeCallback - 发送操作之前的回调函数，默认为空函数
 * @param {function} afterCallback - 发送操作之后的回调函数，默认为空函数
 */
export const clickDispatch = (event, businessData = null, beforeCallback = (data) => {}, afterCallback = (data) => {}) => {
	// 阻止事件冒泡(会影响组件隐藏：windowOnClick)
	// event.stopPropagation();

	var { slice, action, payload } = event.target.dataset;

	var data = {
		type: slice ? `${slice}/${action}` : action,
		payload,
		business: businessData,
	};

	if (data.type) {
		beforeCallback(data);

		var dispatchAction = !slice ? Actions[data.type] : store.dispatch;
		dispatchAction(data);

		afterCallback(data);
	}
};

/**
 * 处理上下文菜单点击事件。
 * @param {Event} event - 点击事件。
 * @param {Object} menus - 菜单项数据。
 */
export const contextMenuClickDispatch = (event, menus) => {
	// 阻止事件冒泡
	event.stopPropagation();

	clickDispatch(
		event,
		menus,
		(data) => {},
		(data) => {
			store.dispatch({ type: "context-menu/hide" });
		}
	);
};

/**
 * 处理开始菜单点击事件。
 * @param {Event} event - 点击事件。
 */
export const startMenuClick = (event) => {
	clickDispatch(
		event,
		null,
		(data) => {},
		(data) => {
			// 如果动作类型为"full"或者"app/setBrowserLink"，则隐藏开始菜单
			if (data.type && (data.payload == "full" || data.type == "app/setBrowserLink")) {
				store.dispatch({ type: "start/hide" });
			}

			// 如果动作类型为"start/setAlpha"，则滚动至指定字符位置
			if (data.type == "start/setAlpha") {
				var target = document.getElementById("char" + data.payload); // 获取目标元素
				if (target) {
					target.parentNode.scrollTop = target.offsetTop; // 滚动至目标元素位置
				} else {
					var defaultTarget = document.getElementById("charA"); // 如果找不到目标元素，则滚动至起始位置
					defaultTarget.parentNode.scrollTop = 0;
				}
			}
		}
	);
};
