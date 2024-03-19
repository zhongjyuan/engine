import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "./modules/demo/counterSlice";

// configureStore 创建一个 redux 数据
const store = configureStore({
	reducer: {
		counter: counterReducer,
	},
});
export default store;
