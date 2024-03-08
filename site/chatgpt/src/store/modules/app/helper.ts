import { ss } from "@/utils/storage";

// 本地存储的键名
const LOCAL_NAME = "appSetting";

// 主题类型
export type Theme = "light" | "dark" | "auto";

// 语言类型
export type Language = "zh-CN" | "zh-TW" | "en-US";

// 应用程序状态接口
export interface AppState {
	siderCollapsed: boolean; // 侧边栏是否折叠
	theme: Theme; // 主题
	language: Language; // 语言
}

/**
 * 返回默认的应用程序设置
 */
export function defaultSetting(): AppState {
	return { siderCollapsed: false, theme: "light", language: "zh-CN" };
}

/**
 * 获取本地存储的应用程序设置
 */
export function getLocalSetting(): AppState {
	const localSetting: AppState | undefined = ss.get(LOCAL_NAME);
	return { ...defaultSetting(), ...localSetting };
}

/**
 * 设置应用程序设置到本地存储
 * @param setting - 要设置的应用程序状态
 */
export function setLocalSetting(setting: AppState): void {
	ss.set(LOCAL_NAME, setting);
}
