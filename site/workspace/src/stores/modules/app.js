import { createSlice } from "@reduxjs/toolkit";

export const allApps = [
	{
		name: "Start",
		icon: "home",
		type: "action",
		action: "STARTMENU",
	},
	{
		name: "Search",
		icon: "search",
		type: "action",
		action: "SEARCHMENU",
	},
	{
		name: "Widget",
		icon: "widget",
		type: "action",
		action: "WIDGETS",
	},
	{
		name: "回收站",
		icon: "bin0",
		type: "app",
	},
	{
		name: "此电脑",
		icon: "win/user",
		type: "app",
		action: "EXPLORER",
	},
	{
		name: "Windows 安全中心",
		icon: "security",
		type: "app",
	},
	{
		name: "设置",
		icon: "settings",
		type: "app",
		action: "SETTINGS",
	},
	{
		name: "任务管理器",
		icon: "taskmanager",
		type: "app",
		action: "TASKMANAGER",
	},
	{
		name: "文件资源管理器",
		icon: "explorer",
		type: "app",
		action: "EXPLORER",
	},
	{
		name: "终端",
		icon: "terminal",
		type: "app",
		action: "TERMINAL",
	},
	{
		name: "截图工具",
		icon: "snip",
		type: "app",
	},
	{
		name: "闹钟和时钟",
		icon: "alarm",
		type: "app",
	},
	{
		name: "计算器",
		icon: "calculator",
		type: "app",
		action: "CALCUAPP",
	},
	{
		name: "记事本",
		icon: "notepad",
		type: "app",
		action: "NOTEPAD",
	},
	{
		name: "便笺",
		icon: "notes",
		type: "app",
	},
	{
		name: "邮件",
		icon: "mail",
		type: "app",
		action: "app/external",
		payload: "mailto:inwinter04@163.com",
	},
	{
		name: "天气",
		icon: "weather",
		type: "app",
	},
	{
		name: "日历",
		icon: "calendar",
		type: "app",
	},
	{
		name: "地图",
		icon: "maps",
		type: "app",
	},
	{
		name: "录音机",
		icon: "voice",
		type: "app",
	},
	{
		name: "相机",
		icon: "camera",
		type: "app",
		action: "CAMERA",
	},
	{
		name: "照片",
		icon: "photos",
		type: "app",
	},
	{
		name: "电影和电视",
		icon: "movies",
		type: "app",
	},
	{
		name: "手机连接",
		icon: "yphone",
		type: "app",
	},
	{
		name: "反馈中心",
		icon: "feedback",
		type: "app",
	},
	{
		name: "提示",
		icon: "tips",
		type: "app",
	},
	{
		name: "入门",
		icon: "getstarted",
		type: "app",
		action: "OOBE",
	},
	{
		name: "讲述人",
		icon: "narrator",
		type: "app",
	},
	{
		name: "资讯",
		icon: "news",
		type: "app",
	},
	{
		name: "获取帮助",
		icon: "help",
		type: "app",
		action: "app/external",
		payload: "https://win11react-docs.andrewstech.me/",
	},
	{
		name: "Store",
		icon: "store",
		type: "app",
		action: "WNSTORE",
	},
	{
		name: "Cortana",
		icon: "cortana",
		type: "app",
	},
	{
		name: "OneDrive",
		icon: "oneDrive",
		type: "app",
	},
	{
		name: "OneNote",
		icon: "onenote",
		type: "app",
	},
	{
		name: "Outlook",
		icon: "outlook",
		type: "app",
	},
	{
		name: "Xbox",
		icon: "xbox",
		type: "app",
	},
	{
		name: "Skype",
		icon: "skype",
		type: "app",
	},
	{
		name: "Teams",
		icon: "teams",
		type: "app",
	},
	{
		name: "To Do",
		icon: "todo",
		type: "app",
	},
	{
		name: "Office",
		icon: "msoffice",
		type: "app",
	},
	{
		name: "Microsoft Edge",
		icon: "edge",
		type: "app",
		action: "MSEDGE",
	},
];

export const apps = allApps.filter((app) => {
	return app.type === "app";
});

export const initialState = () => {
	const defaultState = {};

	for (var i = 0; i < apps.length; i++) {
		defaultState[apps[i].icon] = apps[i];
		defaultState[apps[i].icon].size = "full";
		defaultState[apps[i].icon].hide = true;
		defaultState[apps[i].icon].max = null;
		defaultState[apps[i].icon].z = 0;

		if (apps[i].icon == "") {
			defaultState[apps[i].icon].size = "mini";
			defaultState[apps[i].icon].hide = false;
			defaultState[apps[i].icon].max = true;
			defaultState[apps[i].icon].z = 1;
		}
	}

	defaultState.hz = 2;

	return defaultState;
};

export const appSlice = createSlice({
	name: "app",
	initialState: initialState(),
	reducers: {
		/**
		 * 打开外部链接并在新标签页中显示
		 *
		 * @param {Object} state - 当前状态对象（未使用）
		 * @param {Object} action - 包含操作信息的对象
		 */
		external: (state, action) => {
			// 在新标签页中打开指定链接
			window.open(action.payload, "_blank");
		},

		/**
		 * 显示桌面上所有未隐藏的窗口，并调整它们的 z-index
		 *
		 * @param {object} state - 包含窗口状态信息的原始状态对象
		 * @param {Object} action - 包含操作信息的对象
		 * @returns {object} - 更新后的状态对象，包含调整后的窗口信息
		 */
		showDesktop: (state, action) => {
			// 复制原始状态对象以避免直接修改
			let tmpState = { ...state };

			// 遍历每个窗口
			Object.keys(tmpState).forEach((key) => {
				const obj = tmpState[key];

				// 如果窗口未隐藏，则进行调整
				if (!obj.hide) {
					obj.max = false;

					// 如果窗口的 z-index 等于最高 z-index，将最高 z-index 减一
					if (obj.z === tmpState.hz) {
						tmpState.hz -= 1;
					}

					obj.z = -1;
					tmpState[key] = obj;
				}
			});

			// return tmpState; // 返回更新后的状态对象
		},

		/**
		 * 生成 Edge 链接并更新状态的函数
		 * @param {object} state - 原始状态对象
		 * @param {Object} action - 包含操作信息的对象
		 * @returns {object} - 更新后的状态对象
		 */
		setBrowserLink: (state, action) => {
			let { payload } = action;
			let tmpState = { ...state };
			let obj = { ...tmpState["edge"] };

			// 根据 payload 设置 Edge 链接的 URL
			obj.url = payload && payload.startsWith("http") ? payload : payload ? `https://www.bing.com/search?q=${payload}` : null;

			// 设置 Edge 链接的大小、显示状态和是否最大化
			obj.size = "full";
			obj.hide = false;
			obj.max = true;

			// 更新 Edge 链接的 z-index，并递增 tmpState 中的 hz 值
			obj.z = ++tmpState.hz;

			// 更新 tmpState 中的 edge 对象
			tmpState["edge"] = obj;

			// return tmpState; // 返回更新后的 state 对象
		},

		/**
		 * 打开终端窗口，并设置初始目录
		 *
		 * @param {Object} state - 当前状态对象
		 * @param {Object} action - 包含操作信息的对象，包括新的目录路径
		 * @returns {Object} - 更新后的状态对象，包含打开的终端窗口信息
		 */
		openTerminal: (state, action) => {
			// 复制原始状态对象以避免直接修改
			let tmpState = { ...state };

			// 获取终端窗口信息并复制一份
			let terminal = { ...tmpState["terminal"] };

			// 设置终端窗口的目录为传入的新目录路径
			terminal.dir = action.payload;

			// 设置终端窗口大小为全屏
			terminal.size = "full";

			// 显示终端窗口
			terminal.hide = false;

			// 最大化终端窗口
			terminal.max = true;

			// 增加最高 z-index，并将当前窗口的 z-index 设置为最高值
			tmpState.hz += 1;
			terminal.z = tmpState.hz;

			// 更新状态对象中的终端窗口信息
			tmpState["terminal"] = terminal;

			// return tmpState; // 返回更新后的状态对象
		},

		/**
		 * 添加一个应用程序到状态对象中
		 *
		 * @param {Object} state - 当前状态对象
		 * @param {Object} action - 包含应用程序信息的对象
		 * @returns {Object} - 更新后的状态对象，包含新增的应用程序信息
		 */
		addApp: (state, action) => {
			// 复制原始状态对象以避免直接修改
			let tmpState = { ...state };

			// 将新应用程序信息添加到状态对象中，并设置初始属性值
			tmpState[action.payload.icon] = action.payload;
			tmpState[action.payload.icon].size = "full";
			tmpState[action.payload.icon].hide = true;
			tmpState[action.payload.icon].max = null;
			tmpState[action.payload.icon].z = 0;

			// return tmpState;
		},

		/**
		 * 从状态对象中删除指定的应用程序信息
		 *
		 * @param {Object} state - 当前状态对象
		 * @param {Object} action - 包含要删除的应用程序名称的对象
		 * @returns {Object} - 更新后的状态对象，不包含被删除的应用程序信息
		 */
		removeApp: (state, action) => {
			// 复制原始状态对象以避免直接修改
			let tmpState = { ...state };

			// 删除指定名称的应用程序信息
			delete tmpState[action.payload];

			// return tmpState; // 返回更新后的状态对象
		},
	},
	extraReducers: (builder) => {
		builder.addDefaultCase((state, action) => {
			// 获取状态对象的所有键
			let keys = Object.keys(state);

			// 遍历状态对象的每个键
			for (var i = 0; i < keys.length; i++) {
				let obj = state[keys[i]];

				// 判断当前对象是否匹配 action 类型
				if (obj.action == action.type) {
					// 复制原始状态对象以避免直接修改
					let tmpState = { ...state };

					// 根据不同的 payload 执行相应的操作
					switch (action.payload) {
						case "full": // 将对象设置为 full 大小
							obj.size = "full";
							obj.hide = false;
							obj.max = true;
							tmpState.hz += 1;
							obj.z = tmpState.hz;
							break;
						case "close": // 关闭对象
							obj.hide = true;
							obj.max = null;
							obj.z = -1;
							tmpState.hz -= 1;
							break;
						case "mxmz": // 最小化或最大化对象
							obj.size = ["mini", "full"][obj.size != "full" ? 1 : 0];
							obj.hide = false;
							obj.max = true;
							tmpState.hz += 1;
							obj.z = tmpState.hz;
							break;
						case "togg": // 切换对象的显示状态
							if (obj.z != tmpState.hz) {
								obj.hide = false;
								if (!obj.max) {
									tmpState.hz += 1;
									obj.z = tmpState.hz;
									obj.max = true;
								} else {
									obj.z = -1;
									obj.max = false;
								}
							} else {
								obj.max = !obj.max;
								obj.hide = false;
								if (obj.max) {
									tmpState.hz += 1;
									obj.z = tmpState.hz;
								} else {
									obj.z = -1;
									tmpState.hz -= 1;
								}
							}
							break;
						case "mnmz": // 最小化对象
							obj.max = false;
							obj.hide = false;
							if (obj.z == tmpState.hz) {
								tmpState.hz -= 1;
							}
							obj.z = -1;
							break;
						case "resize": // 调整对象大小
							obj.size = "cstm";
							obj.hide = false;
							obj.max = true;
							if (obj.z != tmpState.hz) tmpState.hz += 1;
							obj.z = tmpState.hz;
							obj.dim = action.dim;
							break;
						case "front": // 置顶对象
							obj.hide = false;
							obj.max = true;
							if (obj.z != tmpState.hz) {
								tmpState.hz += 1;
								obj.z = tmpState.hz;
							}
							break;
					}

					tmpState[keys[i]] = obj;
					return tmpState;
				}
			}
		});
	},
});

// 每个 case reducer 函数会生成对应的 Action creators
export const actions = appSlice.actions;

export default appSlice.reducer;
