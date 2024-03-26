import { createSlice } from "@reduxjs/toolkit";

import { getLocalStorageOrDefault, setLocalStorage } from "@/utils";

const defaultWallpapes = [
	"A/0.mp4",
	"A/1.mp4",
	"A/2.mp4",
	"A/3.mp4",
	"B/0.mp4",
	"B/1.mp4",
	"B/2.mp4",
	"A/0.jpg",
	"A/1.jpg",
	"A/dark-0.jpg",
	"B/0.jpg",
	"B/1.jpg",
	"B/2.jpg",
	"B/3.jpg",
	"C/0.jpg",
	"C/1.jpg",
	"C/2.jpg",
	"C/3.jpg",
	"D/0.jpg",
	"D/1.jpg",
	"D/2.jpg",
	"D/3.jpg",
	"E/0.jpg",
	"E/1.jpg",
	"E/2.jpg",
	"E/3.jpg",
	"F/0.jpg",
	"F/1.jpg",
	"G/0.jpg",
	"G/1.jpg",
	"G/2.jpg",
	"H/0.jpg",
	"H/1.jpg",
	"H/2.jpg",
	"H/3.jpg",
	"H/4.jpg",
	"H/5.jpg",
	"I/0.jpg",
	"I/1.jpg",
	"I/2.jpg",
	"I/3.jpg",
	"I/4.jpg",
	"I/5.jpg",
	"I/6.jpg",
	"I/7.jpg",
	"I/8.jpg",
	"I/9.jpg",
	"I/10.jpg",
	"I/11.jpg",
];

var wps = getLocalStorageOrDefault("wps", 3);
var locked = getLocalStorageOrDefault("locked", true);

export const initialState = {
	themes: ["default", "dark", "A", "B", "D", "C"],
	images: ["jpg", "png", "jpeg", "gif"],
	videos: ["mp4", "webm", "jpeg", "ogg"],
	wps: wps,
	src: defaultWallpapes[wps],
	default: defaultWallpapes[wps],
	locked: locked,
	locksrc: "/static/image/wallpaper/lock/0.jpg",
	booted: false || import.meta.env.MODE == "development",
	act: "",
	dir: 0,
};

/**
 * 创建壁纸切片（slice）用于管理壁纸状态。
 */
export const wallpaperSlice = createSlice({
	name: "wallpaper", // 切片名称，用于标识状态的一部分
	initialState, // 初始状态对象

	reducers: {
		/**
		 * 锁定壁纸
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 * 作用：锁定壁纸并更新相关状态
		 */
		lock: (state, action) => {
			setLocalStorage("locked", true);
			return {
				...state,
				locked: true,
				dir: -1,
			};
		},

		/**
		 * 解锁壁纸
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 * 作用：解锁壁纸并更新相关状态
		 */
		unlock: (state, action) => {
			setLocalStorage("locked", false);
			return {
				...state,
				locked: false,
				dir: 0,
			};
		},

		/**
		 * 切换至下一张壁纸
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 * 作用：切换至下一张壁纸并更新相关状态
		 */
		next: (state, action) => {
			let twps = (state.wps + 1) % defaultWallpapes.length;

			setLocalStorage("wps", twps);
			return {
				...state,
				wps: twps,
				src: defaultWallpapes[twps],
			};
		},

		/**
		 * 壁纸重启完成
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 * 作用：壁纸重启完成并更新相关状态
		 */
		boot: (state, action) => {
			return {
				...state,
				booted: true,
				dir: 0,
				act: "",
			};
		},

		/**
		 * 重启壁纸
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 * 作用：重启壁纸并更新相关状态
		 */
		restart: (state, action) => {
			return {
				...state,
				booted: false,
				dir: -1,
				locked: true,
				act: "restart",
			};
		},

		/**
		 * 关闭壁纸
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 * 作用：关闭壁纸并更新相关状态
		 */
		shutdown: (state, action) => {
			return {
				...state,
				booted: false,
				dir: -1,
				locked: true,
				act: "shutdn",
			};
		},

		/**
		 * 设置壁纸
		 * @param {Object} state - 当前状态
		 * @param {Object} action - 动作对象
		 * @returns {Object} 更新后的状态
		 * 作用：设置指定壁纸并更新相关状态
		 */
		set: (state, action) => {
			var isIndex = !Number.isNaN(parseInt(action.payload)),
				wps = 0,
				src = "";

			if (isIndex) {
				wps = getLocalStorageOrDefault("wps", 0);
				src = defaultWallpapes[wps] ? defaultWallpapes[wps] : defaultWallpapes[0];
			} else {
				const idx = defaultWallpapes.findIndex((item) => item === action.payload);
				setLocalStorage("wps", idx);
				src = action.payload;
				wps = defaultWallpapes[idx];
			}

			return {
				...state,
				wps: wps,
				src: src,
			};
		},
	},
	extraReducers: (builder) => {
		builder.addDefaultCase((state) => state); // 处理其他类型的动作，默认情况下返回当前状态
	},
});

// 每个 case reducer 函数会生成对应的 Action creators
export const actions = wallpaperSlice.actions;

export default wallpaperSlice.reducer;
