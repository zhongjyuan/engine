import store from "@/stores";
import { getLocalStorageOrDefault } from "@/utils";

/**
 * 加载设置信息函数，用于初始化应用程序的设置信息。
 */
export const loadSettings = () => {
	// 从 localStorage 中获取设置信息，如果不存在则初始化为空对象
	var setting = getLocalStorageOrDefault("setting", {});

	// 如果设置中的个人信息为 null，则使用 store 中的 setting 数据进行初始化
	if (setting.person == null) {
		setting = JSON.parse(JSON.stringify(store.getState().setting));

		// 检查系统是否支持 prefers-color-scheme，并根据当前设置为 dark 模式
		if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
			setting.person.theme = "dark";
		}
	}

	// 如果当前主题不是 light，则调用 toggleTheme 函数切换主题
	if (setting.person.theme != "light") toggleTheme();

	// 将加载的设置信息存储到 store 中
	store.dispatch({ type: "setting/load", payload: setting });

	// 在非开发模式下，加载小部件数据
	if (import.meta.env.MODE != "development") {
		loadWidget();
	}
};

/**
 * 切换主题功能，根据当前主题状态切换为另一种主题。
 */
export const toggleTheme = () => {
	// 获取当前设置中的主题信息
	var currentTheme = store.getState().setting.person.theme;

	// 切换主题为相反的模式
	var newTheme = currentTheme === "light" ? "dark" : "light";

	// 设置文档 body 的数据属性来应用新主题
	document.body.dataset.theme = newTheme;

	// 设置不同主题对应的图标
	var icon = newTheme === "light" ? "sun" : "moon";

	// 分发更新主题的操作到 store
	store.dispatch({ type: "setting/setTheme", payload: newTheme });

	// 分发更新面板主题的操作到 store
	store.dispatch({ type: "sidepane/setTheme", payload: icon });

	// 根据主题设置值更新墙纸，0 表示 light，1 表示 dark
	store.dispatch({ type: "wallpaper/set", payload: newTheme === "light" ? 0 : 1 });
};

/**
 * 切换飞行模式函数，用于在应用程序中切换飞行模式状态。
 */
export const toggleFlight = () => {
	// 调度切换飞行模式动作，将payload设为空字符串
	store.dispatch({ type: "setting/network", payload: "" });
};

/**
 * 更新电池状态的函数
 * @param {object} bt - 包含电池状态信息的对象
 */
export const toggleBattery = (batteryInfo) => {
	let batteryLevel = batteryInfo.level * 100 || 100; // 计算电量百分比，如果未提供则默认为100%

	if (batteryInfo.charging) {
		// 如果正在充电
		batteryLevel = -batteryLevel; // 将电量设为负数表示正在充电
	}

	store.dispatch({
		type: "setting/set", // 设置状态值的动作类型
		payload: {
			path: "system.power.battery", // 要更新的状态路径
			value: batteryLevel, // 更新后的电量值
		},
	});
};
