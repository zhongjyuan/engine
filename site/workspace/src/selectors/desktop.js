import { createSelector } from "reselect";

/**
 * 选择器函数，用于对桌面应用进行排序
 * @param {Object} state - Redux 状态对象
 * @returns {Object} 排序后的桌面状态对象
 */
export const sortedAppsSelector = createSelector(
	// 从状态对象中获取桌面信息
	(state) => state.desktop, // 提取桌面相关信息
	(desktop) => {
		const { sort, apps } = desktop; // 解构赋值获取排序方式和应用列表

		// 根据不同的排序方式对应用进行排序
		const sortedApps = [...apps].sort((a, b) => {
			// 按名称排序
			if (sort === "name") {
				return a.name.localeCompare(b.name); // 使用 localeCompare 进行字符串比较
			} else if (sort === "size") {
				// 按名称字符的 ASCII 值排序
				return (a.name.charCodeAt(0) % a.name.length) - (b.name.charCodeAt(0) % b.name.length);
			} else if (sort === "date") {
				// 按特定规则排序
				const indexA = (a.name.length * 13) % a.name.length;
				const indexB = (b.name.length * 17) % b.name.length;
				return a.name.charCodeAt(indexA) - b.name.charCodeAt(indexB);
			}
			return 0; // 默认返回 0
		});

		// 返回更新后的桌面状态对象
		return { ...desktop, apps: sortedApps };
	}
);
