import { createSlice } from "@reduxjs/toolkit";

import { getLocalStorageOrDefault, setLocalStorage } from "@/utils";

import { allApps } from "./app";

export const taskbarAppNames = ["设置", "文件资源管理器", "Microsoft Edge"];

export const taskbarApps = allApps.filter((x) => taskbarAppNames.includes(x.name));

var taskbarAlign = getLocalStorageOrDefault("taskbar-align", "center");

export const initialState = {
	apps: taskbarApps,
	appNames: taskbarAppNames,
	prev: false,
	prevApp: "",
	prevPos: 0,
	align: taskbarAlign,
	search: true,
	widgets: true,
	audio: 3,
};

/**
 * 创建任务栏切片（slice）用于管理任务栏状态。
 */
export const taskbarSlice = createSlice({
	name: "taskbar", // 切片名称，用于标识状态的一部分
	initialState, // 初始状态对象

	reducers: {
		/**
		 * 添加任务
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 */
		add: (state, action) => {
			return state;
		},

		/**
		 * 移除任务
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 */
		remove: (state, action) => {
			return state;
		},

		/**
		 * 将任务栏对齐方式设置为居中
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 */
		setAlign: (state, action) => {
			setLocalStorage("taskbar-align", "center");
			return {
				...state,
				align: "center",
			};
		},

		/**
		 * 将任务栏对齐方式设置为左侧
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 */
		setAlignLeft: (state, action) => {
			setLocalStorage("taskbar-align", "left");
			return {
				...state,
				align: "left",
			};
		},

		/**
		 * 切换任务栏对齐方式（左侧和居中之间切换）
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 */
		alignToggle: (state, action) => {
			const alignment = state.align == "left" ? "center" : "left";
			setLocalStorage("taskbar-align", alignment);
			return {
				...state,
				align: alignment,
			};
		},

		/**
		 * 显示/隐藏上一个应用程序预览
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 */
		showPreview: (state, action) => {
			return {
				...state,
				prev: true,
				prevApp: (action.payload && action.payload.app) || "store",
				prevPos: (action.payload && action.payload.pos) || 50,
			};
		},

		/**
		 * 隐藏上一个应用程序预览
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 */
		hidePreview: (state, action) => {
			return {
				...state,
				prev: false,
			};
		},

		/**
		 * 切换搜索状态
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 */
		showSearch: (state, action) => {
			return {
				...state,
				search: action.payload == "true",
			};
		},

		/**
		 * 切换小部件状态
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 */
		showWidget: (state, action) => {
			return {
				...state,
				widgets: action.payload == "true",
			};
		},

		/**
		 * 设置音频状态
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 */
		setAudio: (state, action) => {
			return {
				...state,
				audio: action.payload,
			};
		},
	},
	extraReducers: (builder) => {
		builder.addDefaultCase((state) => state); // 处理其他类型的动作，默认情况下返回当前状态
	},
});

// 每个 case reducer 函数会生成对应的 Action creators
export const actions = taskbarSlice.actions;

export default taskbarSlice.reducer;
