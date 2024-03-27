import { createSelector } from "reselect";

/**
 * 创建一个 selector，用于处理启动菜单数据并返回更新后的启动菜单对象。
 * @param {object} state - 应用程序状态对象，包含所有应用程序和启动菜单信息。
 * @returns {object} - 更新后的启动菜单对象。
 */
export const processStartMenuSelector = createSelector(
	// 选择器函数接受应用程序状态对象，并提取其中的应用程序和启动菜单信息
	(state) => state.apps,
	(state) => state.startmenu,
	(apps, startmenu) => {
		// 从 startmenu 对象中解构出 pinnedApps 和 recentApps
		const { pinnedApps, recentApps } = startmenu;

		// 计算 pinnedApps 末尾需要的空槽位数量
		const emptySlots = (6 - (pinnedApps.length % 6)) % 6;

		// 在 pinnedApps 末尾添加空槽位
		const updatedPnApps = [...pinnedApps, ...Array(emptySlots).fill({ empty: true })];

		// 更新 recentApps 中每个应用程序的 lastUsed 字段
		const updatedRcApps = recentApps.map((app) => {
			let updatedLastUsed = app.lastUsed;
			if (updatedLastUsed < 0) {
				updatedLastUsed = "最近添加";
			} else if (updatedLastUsed < 10) {
				updatedLastUsed = "刚刚";
			} else if (updatedLastUsed < 60) {
				updatedLastUsed += "分钟前";
			} else if (updatedLastUsed < 360) {
				updatedLastUsed = `${Math.floor(updatedLastUsed / 60)}小时前`;
			}
			return { ...app, lastUsed: updatedLastUsed };
		});

		// 创建一个数组，按照名称首字母对应的顺序存储应用程序
		const categorizedApps = Array(27)
			.fill()
			.map(() => []);

		// 过滤掉"h"应用程序，并按名称对剩余应用程序进行排序
		const filteredApps = Object.keys(apps)
			.filter((x) => x != "hz")
			.map((key) => apps[key]);

		filteredApps.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

		// 根据应用程序名称的首字母将应用程序组织到 categorizedApps 数组中
		filteredApps.forEach((app) => {
			const firstLetter = app.name.trim().toUpperCase().charCodeAt(0);
			const index = firstLetter > 64 && firstLetter < 91 ? firstLetter - 64 : 0;
			categorizedApps[index].push(app);
		});

		// 返回包含处理后应用程序数据的更新后启动菜单对象
		return {
			...startmenu,
			pinnedApps: updatedPnApps,
			recentApps: updatedRcApps,
			contApps: categorizedApps,
			allApps: filteredApps,
		};
	}
);
