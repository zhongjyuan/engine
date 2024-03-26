import { createSlice } from "@reduxjs/toolkit";

import { setLocalStorage, updatePropertyValue } from "@/utils";

export const initialState = {
	bootlogo: "bootlogo",
	system: {
		power: {
			saver: {
				state: false,
			},
			battery: 100,
		},
		display: {
			brightness: 100,
			nightlight: {
				state: false,
			},
			connect: false,
		},
	},
	person: {
		name: "ZHONGJYUAN",
		theme: "light",
		color: "blue",
		avatar: "avatar",
	},
	devices: {
		bluetooth: false,
	},
	network: {
		wifi: {
			state: true,
		},
		airplane: false,
	},
	privacy: {
		location: {
			state: false,
		},
	},
};

/**
 * 设置页面主题为初始状态中个人设置的主题。
 */
document.body.dataset.theme = initialState.person.theme;

/**
 * 处理状态更新并将更改保存到本地存储。
 *
 * @param {object} tmpState - 临时状态对象
 * @param {boolean} changed - 标识状态是否有更改
 * @returns {object} - 更新后的临时状态对象
 */
const handle = (tmpState, changed) => {
	setLocalStorage("setting", tmpState, changed);
	return tmpState;
};

/**
 * 创建设置切片（slice）用于管理设置状态。
 * @param {object} initialState - 初始状态对象
 */
export const settingSlice = createSlice({
	name: "setting", // 切片名称，用于标识状态的一部分
	initialState, // 初始状态对象，包含设置的初始值

	// Reducers包含用于处理不同动作的函数
	reducers: {
		/**
		 * 设置值
		 * @param {object} state - 当前状态对象
		 * @param {object} action - 包含路径和新值的动作对象
		 * @returns {object} 更新后的状态对象
		 */
		set: (state, action) => {
			let tmpState = { ...state }; // 复制原始状态对象以避免直接修改
			tmpState = updatePropertyValue(tmpState, action.payload.path, action.payload.value); // 更新属性值
			return handle(tmpState, true); // 调用处理函数并返回更新后的状态
		},

		/**
		 * 加载设置
		 * @param {object} state - 当前状态对象
		 * @param {object} action - 包含要加载的设置信息的动作对象
		 * @returns {object} 更新后的状态对象
		 */
		load: (state, action) => {
			let tmpState = { ...state }; // 复制原始状态对象以避免直接修改
			tmpState = { ...action.payload }; // 覆盖整个状态对象
			return handle(tmpState, true); // 调用处理函数并返回更新后的状态
		},

		/**
		 * 切换设置
		 * @param {object} state - 当前状态对象
		 * @param {object} action - 包含要切换的设置信息的动作对象
		 * @returns {object} 更新后的状态对象
		 */
		toggle: (state, action) => {
			let tmpState = { ...state }; // 复制原始状态对象以避免直接修改
			tmpState = updatePropertyValue(tmpState, action.payload); // 更新属性值
			return handle(tmpState, true); // 调用处理函数并返回更新后的状态
		},

		/**
		 * 设置主题
		 * @param {object} state - 当前状态对象
		 * @param {object} action - 包含新主题信息的动作对象
		 * @returns {object} 更新后的状态对象
		 */
		setTheme: (state, action) => {
			let tmpState = { ...state }; // 复制原始状态对象以避免直接修改
			tmpState.person.theme = action.payload; // 更新主题
			return handle(tmpState, true); // 调用处理函数并返回更新后的状态
		},

		/**
		 * 切换飞行模式
		 * @param {object} state - 当前状态对象
		 * @param {object} action - 包含切换飞行模式信息的动作对象
		 * @returns {object} 更新后的状态对象
		 */
		network: (state, action) => {
			let tmpState = { ...state }; // 复制原始状态对象以避免直接修改
			let airPlaneModeStatus = tmpState.network.airplane; // 获取飞行模式状态
			if (tmpState.network.wifi.state === true && !airPlaneModeStatus) {
				tmpState = updatePropertyValue(tmpState, "network.wifi.state"); // 更新网络Wi-Fi状态
			}
			if (tmpState.devices.bluetooth === true && !airPlaneModeStatus) {
				tmpState = updatePropertyValue(tmpState, "devices.bluetooth"); // 更新蓝牙状态
			}
			tmpState = updatePropertyValue(tmpState, "network.airplane"); // 更新飞行模式状态
			return handle(tmpState, true); // 调用处理函数并返回更新后的状态
		},
	},
	extraReducers: (builder) => {
		builder.addDefaultCase((state) => handle(state, false));
	},
});

// 每个 case reducer 函数会生成对应的 Action creators
export const actions = settingSlice.actions;

export default settingSlice.reducer;
