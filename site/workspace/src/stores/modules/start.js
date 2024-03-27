import { createSlice } from "@reduxjs/toolkit";

import { allApps } from "./app";

export const pinnedAppNames = [
	"终端",
	"文件资源管理器",
	"便笺",
	"记事本",
	"邮件",
	"天气",
	"日历",
	"地图",
	"录音机",
	"相机",
	"照片",
	"电影和电视",
	"Store",
	"Microsoft Edge",
];

export const pinnedApps = allApps
	.filter((x) => pinnedAppNames.includes(x.name))
	.sort((a, b) => {
		return pinnedAppNames.indexOf(a.name) > pinnedAppNames.indexOf(b.name) ? 1 : -1;
	});

export const recentAppNames = ["终端", "任务管理器", "文件资源管理器", "Microsoft Edge", "计算器", "天气", "日历", "地图"];

export const recentApps = allApps
	.filter((x) => recentAppNames.includes(x.name))
	.sort((a, b) => {
		return recentAppNames.indexOf(a.name) > recentAppNames.indexOf(b.name) ? 1 : -1;
	});

export const initialState = {
	pinnedApps: pinnedApps,
	pinnedAppNames: pinnedAppNames,
	recentApps: recentApps,
	recentAppNames: recentAppNames,
	hide: true,
	menu: false,
	showAll: false,
	alpha: false,
	pwctrl: false,
	currentAlpha: "A",
	quickSearch: [
		["faClock", 1, "历史上的今天"],
		["faChartLine", null, "今日行情"],
		["faFilm", null, "近期电影"],
		["faNewspaper", 1, "头条新闻"],
	],
};

/**
 * 创建开始菜单切片（slice）用于管理开始菜单状态。
 */
export const startSlice = createSlice({
	name: "start", // 切片名称，用于标识状态的一部分
	initialState, // 初始状态对象

	reducers: {
		/**
		 * 显示菜单
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 */
		show: (state, action) => {
			return {
				...state,
				menu: true, // 设置菜单为显示状态
				hide: false, // 隐藏状态设为false
				pwctrl: false, // 密码控制设为false
			};
		},

		/**
		 * 隐藏菜单
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 */
		hide: (state, action) => {
			return {
				...state,
				hide: true, // 隐藏菜单
				showAll: false, // 显示所有设为false
				pwctrl: false, // 密码控制设为false
			};
		},

		/**
		 * 切换隐藏状态
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 */
		toggle: (state, action) => {
			return {
				...state,
				hide: !(state.hide || !state.menu), // 切换隐藏状态
				menu: true, // 设置菜单为显示状态
				alpha: false, // alpha状态设为false
				currentAlpha: "A", // 设置当前alpha值为"A"
				pwctrl: false, // 密码控制设为false
				showAll: state.menu && state.showAll ? true : null, // 根据条件设置showAll状态
			};
		},

		/**
		 * 切换显示/隐藏所有菜单项
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 */
		showAll: (state, action) => {
			return {
				...state,
				showAll: !state.showAll, // 切换显示所有状态
				alpha: false, // alpha状态设为false
				pwctrl: false, // 密码控制设为false
				currentAlpha: "A", // 设置当前alpha值为"A"
			};
		},

		/**
		 * 切换ALPHA功能状态
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 */
		setAlpha: (state, action) => {
			return {
				...state,
				alpha: !state.alpha, // 切换alpha状态
				pwctrl: false, // 密码控制设为false
				currentAlpha: action.payload || "A", // 设置当前alpha值为传入的payload值，默认为"A"
			};
		},

		/**
		 * 切换到搜索状态
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 */
		showSearch: (state, action) => {
			return {
				...state,
				hide: !(state.hide || state.menu), // 切换隐藏状态
				menu: false, // 关闭菜单
				pwctrl: false, // 密码控制设为false
			};
		},

		/**
		 * 开启密码控制状态
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 */
		passwordCtrl: (state, action) => {
			return {
				...state,
				pwctrl: true, // 开启密码控制状态
			};
		},
	},
	extraReducers: (builder) => {
		/**
		 * 处理默认情况
		 * @param {Object} state - 当前状态
		 * @returns {Object} 当前状态
		 */
		builder.addDefaultCase((state) => state); // 处理其他类型的动作，默认情况下返回当前状态
	},
});

// 每个 case reducer 函数会生成对应的 Action creators
export const actions = startSlice.actions;

export default startSlice.reducer;
