import { createSlice } from "@reduxjs/toolkit";

import { allApps } from "./app";

export const desktopAppNames = ["回收站", "此电脑", "文件资源管理器", "Store", "Microsoft Edge"];

export const desktopApps = allApps
	.filter((x) => desktopAppNames.includes(x.name))
	.sort((a, b) => {
		return desktopAppNames.indexOf(a.name) > desktopAppNames.indexOf(b.name) ? 1 : -1;
	});

export const initialState = {
	apps: desktopApps,
	appNames: desktopAppNames,
	hide: false,
	size: 1,
	sort: "none",
	aboutOpen: false,
};

export const desktopSlice = createSlice({
	name: "desktop",
	initialState,
	reducers: {
		sort: (state, action) => {
			return { ...state, sort: action.payload || "none" };
		},
		hide: (state, action) => {
			return { ...state, hide: true };
		},
		show: (state, action) => {
			return { ...state, hide: false };
		},
		toggle: (state, action) => {
			return { ...state, hide: !state.hide };
		},
		setSize: (state, action) => {
			return { ...state, size: action.payload };
		},
		addApp: (state, action) => {
			let arr = [...state.apps];

			arr.push(action.payload);

			// localStorage.setItem("desktop", JSON.stringify(arr.map((x) => x.name)));

			return { ...state, apps: arr };
		},
		removeApp: (state, action) => {
			let arr = state.apps.filter((x) => x.name != action.payload);

			// localStorage.setItem("desktop", JSON.stringify(arr.map((x) => x.name)));

			return { ...state, apps: arr };
		},
		aboutToggle: (state, action) => {
			return { ...state, aboutOpen: action.payload };
		},
	},
	extraReducers: (builder) => {
		builder.addDefaultCase((state) => state);
	},
});

// 每个 case reducer 函数会生成对应的 Action creators
export const actions = desktopSlice.actions;

export default desktopSlice.reducer;
