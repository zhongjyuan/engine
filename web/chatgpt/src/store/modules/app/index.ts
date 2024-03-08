import { defineStore } from "pinia";
import type { AppState, Language, Theme } from "./helper";
import { getLocalSetting, setLocalSetting } from "./helper";
import { store } from "@/store";

/**
 * 定义应用程序状态存储
 */
export const useAppStore = defineStore("app-store", {
	state: (): AppState => getLocalSetting(), // 初始化状态为本地存储的设置
	actions: {
		/**
		 * 设置侧边栏是否折叠
		 * @param collapsed - 是否折叠
		 */
		setSiderCollapsed(collapsed: boolean) {
			this.siderCollapsed = collapsed;
			this.recordState();
		},

		/**
		 * 设置主题
		 * @param theme - 主题
		 */
		setTheme(theme: Theme) {
			this.theme = theme;
			this.recordState();
		},

		/**
		 * 设置语言
		 * @param language - 语言
		 */
		setLanguage(language: Language) {
			if (this.language !== language) {
				this.language = language;
				this.recordState();
			}
		},

		/**
		 * 记录状态到本地存储
		 */
		recordState() {
			setLocalSetting(this.$state);
		},
	},
});

/**
 * 返回应用程序状态存储实例
 */
export function useAppStoreWithOut() {
	return useAppStore(store);
}
