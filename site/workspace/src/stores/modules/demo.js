import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
	value: 0,
};

export const demoSlice = createSlice({
	name: "demo",
	initialState,
	reducers: {
		increment: (state) => {
			// Redux Toolkit 允许我们在 reducers 写 "可变" 逻辑。它
			// 并不是真正的改变状态值，因为它使用了 Immer 库
			// 可以检测到“草稿状态“ 的变化并且基于这些变化生产全新的
			// 不可变的状态
			state.value += 1;
		},
		decrement: (state) => {
			state.value -= 1;
		},
		incrementByAmount: (state, action) => {
			state.value += action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addDefaultCase((state) => state);
	},
});

// 每个 case reducer 函数会生成对应的 Action creators
export const actions = demoSlice.actions;

export default demoSlice.reducer;
