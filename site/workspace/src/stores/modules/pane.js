import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
	quicks: [
		{ ui: true, src: "wifi", name: "WiFi", state: "network.wifi.state", action: "setting/toggle" },
		{ ui: true, src: "bluetooth", name: "蓝牙", state: "devices.bluetooth", action: "setting/toggle" },
		{ ui: true, src: "airplane", name: "飞行模式", state: "network.airplane", action: "toggleFlight" },
		{ ui: true, src: "saver", name: "省电模式", state: "system.power.saver.state", action: "setting/toggle" },
		{ ui: true, src: "sun", name: "背景主题", state: "person.theme", action: "toggleTheme" },
		{ ui: true, src: "nightlight", name: "夜间模式", state: "system.display.nightlight.state", action: "setting/toggle" },
	],
	hide: true,
	banhide: true,
	calhide: true,
};

export const sideSlice = createSlice({
	name: "pane",
	initialState,
	reducers: {
		setTheme: (state, action) => {
			let tmpState = { ...state }; // 复制原始状态对象以避免直接修改
			tmpState.quicks[4].src = action.payload;
			return tmpState;
		},
		bandHide: (state, action) => {
			return { ...state, banhide: true };
		},
		bandToggle: (state, action) => {
			return { ...state, banhide: !state.banhide };
		},
		sideHide: (state, action) => {
			return { ...state, hide: true };
		},
		sideToggle: (state, action) => {
			return { ...state, hide: !state.hide };
		},
		calendarHide: (state, action) => {
			return { ...state, calhide: true };
		},
		calendarToggle: (state, action) => {
			return { ...state, calhide: !state.calhide };
		},
	},
	extraReducers: (builder) => {
		builder.addDefaultCase((state) => state);
	},
});

// 每个 case reducer 函数会生成对应的 Action creators
export const actions = sideSlice.actions;

export default sideSlice.reducer;
