import store from "@/stores";

export * from "./app";
export * from "./click";
export * from "./desktop";
export * from "./file";
export * from "./setting";
export * from "./taskbar";

/**
 * 页面加载完成时触发，执行 wallpaper/boot 动作
 * @param {Event} event - 页面加载事件对象
 */
export const windowOnLoad = (event) => {
	// 触发 wallpaper/boot 动作
	store.dispatch({ type: "wallpaper/boot" });
};

/**
 * 在页面加载后延迟一定时间后执行 wallpaper/boot 动作
 * @type {Timeout} - 延迟执行的定时器对象
 */
export const windowOnStart = setTimeout(() => {
	// 触发 wallpaper/boot 动作
	store.dispatch({ type: "wallpaper/boot" });
}, 5000);

/**
 * 响应鼠标点击事件，并根据条件进行对应的 action 分发
 * @param {MouseEvent} event - 鼠标点击事件对象
 */
export const windowOnClick = (event) => {
	// 定义需要处理的动作数组及对应的 action 类型
	var actions = [
		[["start"], "start/hide"], // 开始动作对应的隐藏动作
		[["widget"], "widget/hide"], // 控件动作对应的隐藏动作
		[["context-menu"], "context-menu/hide"], // 上下文菜单动作对应的隐藏动作
		[["band"], "pane/bandHide"], // band 动作对应的 pane 隐藏动作
		[["side"], "pane/sideHide"], // side 动作对应的 pane 隐藏动作
		[["calendar", "CALNPREV", "CALNNEXT"], "pane/calendarHide"], // 日历动作对应的 pane 隐藏动作
	];

	var actionSlice = "";
	var actionType = "";
	try {
		// 获取事件目标上的 data-action 属性，如果不存在则为空字符串
		actionSlice = event.target.dataset.slice || "";
		actionType = event.target.dataset.action || "";
	} catch (err) {
		// 处理可能的错误，比如获取不到 dataset 时的异常
	}

	// 获取事件目标的样式属性 --slice 的值
	var targetSlice = getComputedStyle(event.target).getPropertyValue("--slice");

	// 遍历 actions 数组，根据条件判断是否需要 dispatch 对应的 action
	actions.forEach((action, i) => {
		if (!action[0].includes(actionSlice) && !action[0].includes(actionType) && !action[0].includes(targetSlice)) {
			// 如果目标动作不是当前遍历到的动作，则进行分发对应的隐藏动作
			store.dispatch({ type: action[1] });
		}
	});
};

/**
 * 响应上下文菜单点击事件，执行鼠标点击处理并显示相关菜单
 * @param {MouseEvent} event - 上下文菜单点击事件对象
 */
export const windowOnContextMenu = (event) => {
	// 调用 windowOnClick 函数来处理鼠标点击事件
	windowOnClick(event);

	// 阻止默认的上下文菜单行为
	event.preventDefault();

	// 构建包含鼠标位置信息的数据对象
	var data = {
		top: event.clientY, // 鼠标位置的垂直坐标
		left: event.clientX, // 鼠标位置的水平坐标
	};

	// 如果目标元素具有 data-menu 属性
	if (event.target.dataset.menu != null) {
		// 将目标元素的 data-menu 属性及相关属性和数据集信息添加到 data 对象中
		data.menu = event.target.dataset.menu; // 目标元素的菜单属性值
		data.attr = event.target.attributes; // 目标元素的所有属性
		data.dataset = event.target.dataset; // 目标元素的数据集

		// 触发显示上下文菜单的 action
		store.dispatch({ type: "context-menu/show", payload: data });
	}
};

/**
 * 异步加载小部件数据，包括从维基百科获取历史事件和从新闻 API 获取新闻列表。
 */
export const loadWidget = async () => {
	// 创建临时小部件对象，使用 store 中的 widpane 数据进行初始化
	var tmpWdgt = {
		...store.getState().widpane,
	};

	// 获取当前日期
	var date = new Date();

	// 从维基百科 API 获取当天的历史事件数据
	// var wikiurl = "https://en.wikipedia.org/api/rest_v1/feed/onthisday/events";
	// await axios
	// 	.get(`${wikiurl}/${date.getMonth()}/${date.getDay()}`)
	// 	.then((res) => res.data)
	// 	.then((data) => {
	// 		// 从返回的数据中随机选择一个事件
	// 		var event = data.events[Math.floor(Math.random() * data.events.length)];

	// 		// 将事件的年份更新到当前日期
	// 		date.setYear(event.year);

	// 		// 格式化日期和事件，并存储到临时小部件对象中
	// 		tmpWdgt.data.date = date.toLocaleDateString("en-US", {
	// 			year: "numeric",
	// 			month: "short",
	// 			day: "numeric",
	// 		});
	// 		tmpWdgt.data.event = event;
	// 	})
	// 	.catch((error) => {});

	// 从新闻 API 获取新闻列表
	// await axios
	// 	.get("https://github.win11react.com/api-cache/news.json")
	// 	.then((res) => res.data)
	// 	.then((data) => {
	// 		// 格式化新闻标题，并存储到临时小部件对象中
	// 		var newsList = [];
	// 		data["articles"].forEach((e) => {
	// 			e.title = e["title"].split(`-`).slice(0, -1).join(`-`).trim();
	// 			newsList.push(e);
	// 		});
	// 		tmpWdgt.data.news = newsList;
	// 	})
	// 	.catch((error) => {});

	// 将更新后的临时小部件对象存储到 store 中
	store.dispatch({
		type: "widget/reset",
		payload: tmpWdgt,
	});
};
