import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
	hide: true,
	top: 80,
	left: 360,
	opts: "desk",
	attr: null,
	dataset: null,
	data: {
		desk: { width: "310px", secwid: "200px" },
		task: { width: "220px", secwid: "120px", ispace: false }, // show the space for icons in menu
		app: { width: "310px", secwid: "200px" },
	},
	menus: {
		desk: [
			{
				name: "查看",
				icon: "view",
				type: "svg",
				opts: [
					{ name: "大图标", action: "toggleIconSize", payload: "large" },
					{ name: "中等图标", action: "toggleIconSize", payload: "medium" },
					{ name: "小图标", action: "toggleIconSize", payload: "small", dot: true },
					{ type: "hr" },
					{ name: "显示桌面图标", action: "toggleDesktop", check: true },
				],
			},
			{
				name: "排列方式",
				icon: "sort",
				type: "svg",
				opts: [
					{ name: "名称", action: "toggleSort", payload: "name" },
					{ name: "大小", action: "toggleSort", payload: "size" },
					{ name: "修改日期", action: "toggleSort", payload: "date" },
				],
			},
			{ name: "刷新", action: "refresh", type: "svg", icon: "refresh" },
			{ type: "hr" },
			{
				name: "新建",
				icon: "New",
				type: "svg",
				opts: [{ name: "文件夹" }, { name: "快捷方式" }, { name: "文本文档" }, { name: "ZIP 压缩文件" }],
			},
			{ type: "hr" },
			{ name: "显示设置", icon: "display", type: "svg", action: "SETTINGS", payload: "full" },
			{ name: "个性化", icon: "personalize", type: "svg", action: "SETTINGS", payload: "full" },
			{ type: "hr" },
			{ name: "下一个桌面背景", action: "wallpaper/next" },
			{ name: "在终端中打开", icon: "terminal", action: "app/openTerminal", payload: "C:\\Users\\zhongjyuan\\Desktop" },
			{ name: "关于", action: "desktop/openAbout", icon: "win/info", payload: true },
		],
		task: [
			{
				name: "排列图标",
				opts: [
					{ name: "居左", action: "toggleTaskAlign", payload: "left" },
					{ name: "居中", action: "toggleTaskAlign", payload: "center", dot: true },
				],
			},
			{ type: "hr" },
			{
				name: "搜索",
				opts: [
					{ name: "显示", action: "taskbar/showSearch", payload: true },
					{ name: "隐藏", action: "taskbar/showSearch", payload: false },
				],
			},
			{
				name: "小部件",
				opts: [
					{ name: "显示", action: "taskbar/showWidget", payload: true },
					{ name: "隐藏", action: "taskbar/showWidget", payload: false },
				],
			},
			{ type: "hr" },
			{ name: "显示桌面", action: "app/showDesktop" },
		],
		app: [
			{ name: "打开", action: "performApp", payload: "open" },
			{ name: "以管理员身份运行", action: "performApp", payload: "open", icon: "win/shield" },
			{ name: "打开文件所在的位置", dsb: true },
			{ name: "从开始菜单取消固定", dsb: true },
			{ name: "压缩为 ZIP 文件", dsb: true },
			{ name: "复制文件地址", dsb: true },
			{ name: "属性", dsb: true },
			{ type: "hr" },
			{ name: "删除快捷方式", action: "performApp", payload: "delshort" },
			{ name: "删除", action: "uninstallApp", payload: "delete" },
		],
	},
};

/**
 * 上下文菜单切片
 */
export const contextMenuSlice = createSlice({
	name: "context-menu", // 切片名称
	initialState, // 初始化状态

	reducers: {
		/**
		 * 改变菜单
		 *
		 * @param {Object} state - 当前状态对象
		 * @param {Object} action - 包含payload的动作对象
		 * @returns {Object} - 更新后的状态对象
		 */
		set: (state, action) => {
			// 复制原始状态对象以避免直接修改
			let tmpState = { ...state };

			tmpState = { ...action.payload }; // 设置菜单状态为传入的payload内容

			return tmpState; // 返回更新后的状态
		},

		/**
		 * 隐藏菜单
		 *
		 * @param {Object} state - 当前状态对象
		 * @param {Object} action - 包含payload的动作对象
		 * @returns {Object} - 更新后的状态对象
		 */
		hide: (state, action) => {
			// 复制原始状态对象以避免直接修改
			let tmpState = { ...state };

			tmpState.hide = true; // 设置隐藏状态为true

			return tmpState; // 返回更新后的状态
		},

		/**
		 * 显示菜单
		 *
		 * @param {Object} state - 当前状态对象
		 * @param {Object} action - 包含payload的动作对象
		 * @returns {Object} - 更新后的状态对象
		 */
		show: (state, action) => {
			// 复制原始状态对象以避免直接修改
			let tmpState = { ...state };

			tmpState.hide = false; // 设置隐藏状态为false
			tmpState.top = (action.payload && action.payload.top) || 272; // 设置菜单顶部位置
			tmpState.left = (action.payload && action.payload.left) || 430; // 设置菜单左侧位置
			tmpState.opts = (action.payload && action.payload.menu) || "desk"; // 设置菜单选项
			tmpState.attr = action.payload && action.payload.attr; // 设置菜单属性
			tmpState.dataset = action.payload && action.payload.dataset; // 设置菜单数据集

			return tmpState; // 返回更新后的状态
		},
	},
	extraReducers: (builder) => {
		builder.addDefaultCase((state) => state);
	},
});

// 每个 case reducer 函数会生成对应的 Action creators
export const actions = contextMenuSlice.actions;

export default contextMenuSlice.reducer;
