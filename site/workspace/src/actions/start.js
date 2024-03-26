import store from "@/stores";

/**
 * 处理开始菜单点击事件。
 * @param {Event} event - 点击事件。
 */
export const startMenuClick = (event) => {
	// 解构出事件目标的数据集中的 slice、action 和 payload
	var { slice, action, payload } = event.target.dataset;

	var type = action; // 将 action 设置为默认的 type
	if (slice) {
		// 如果存在 slice，则将 slice 和 action 拼接作为新的 type
		type = `${slice}/${action}`;
	}

	var data = { type, payload };

	// 如果存在动作类型，则触发对应的dispatch操作
	if (data.type) {
		store.dispatch(data);
	}

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
};
