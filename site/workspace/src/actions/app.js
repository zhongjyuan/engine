import store from "@/stores";

import { generateName, setLocalStorage, getLocalStorageOrDefault } from "@/utils";

/**
 * 执行应用程序操作，根据传入的操作和菜单对象执行相应的操作。
 * @param {string} act - 操作类型，可以是 "open" 或 "delshort"。
 * @param {HTMLElement} menu - 菜单元素。
 */
export const performApp = (act, menu) => {
	// 解构出事件目标的数据集中的 slice、action 和 payload
	var { slice, action, payload } = menu.dataset;

	// 构建包含类型和载荷的数据对象
	var data = {
		type: slice ? `${slice}/${action}` : action,
		payload,
	};

	// 如果是打开应用程序操作
	if (act == "open") {
		// 如果存在操作类型，则发送对应的操作到 store
		if (data.type) store.dispatch(action);
	}

	// 如果是删除快捷方式操作
	else if (act == "delshort") {
		if (data.type) {
			// 获取当前所有应用程序
			var apps = store.getState().apps;

			// 查找需要删除的应用程序
			var matchingAppKey = Object.keys(apps).find((key) => {
				var app = apps[key];
				return (app.slice === slice && app.action === action) || (app.payload === payload && app.payload !== null);
			});

			if (matchingAppKey) {
				// 获取匹配的应用程序
				var matchingApp = apps[matchingAppKey];

				// 如果找到匹配的应用程序，则发送删除桌面应用程序的操作到 store
				store.dispatch({ type: "desktop/removeApp", payload: matchingApp.name });
			}
		}
	}
};

/**
 * 安装应用程序，将应用程序数据添加到已安装应用列表并更新桌面布局。
 * @param {Object} data - 应用程序数据对象。
 */
export const installApp = (data) => {
	// 克隆传入的应用程序数据，并设置类型为 "app"，pwa 属性为 true
	var app = { ...data, type: "app", pwa: true };

	// 获取本地存储中的已安装应用列表
	var installed = JSON.parse(getLocalStorageOrDefault("installed", "[]"));

	// 将新应用程序添加到已安装应用列表中
	installed.push(app);
	setLocalStorage("installed", JSON.stringify(installed));

	// 获取本地存储中的桌面布局数据
	var desktopApps = JSON.parse(getLocalStorageOrDefault("desktop") || JSON.stringify(store.getState().desktop.appNames));

	// 将新应用程序名称添加到桌面布局数据中
	desktopApps.push(app.name);
	setLocalStorage("desktop", JSON.stringify(desktopApps));

	// 生成应用程序动作名称并将其分配给应用程序对象
	app.action = generateName();

	// 发送添加应用程序的操作到 store
	store.dispatch({ type: "app/addApp", payload: app });

	// 发送添加桌面应用程序的操作到 store
	store.dispatch({ type: "desktop/addApp", payload: app });

	// 发送窗口存储操作到 store
	store.dispatch({ type: "WNSTORE", payload: "mnmz" });
};

/**
 * 删除应用程序，根据传入的操作和菜单对象执行相应的操作。
 * @param {string} act - 操作类型，可以是 "delete"。
 * @param {HTMLElement} menu - 菜单元素。
 */
export const uninstallApp = (act, menu) => {
	// 解构出事件目标的数据集中的 slice、action 和 payload
	var { slice, action, payload } = menu.dataset;

	// 构建包含类型和载荷的数据对象
	var data = {
		type: slice ? `${slice}/${action}` : action,
		payload,
	};

	// 如果是删除应用程序操作
	if (act == "delete") {
		if (data.type) {
			// 获取当前所有应用程序
			var apps = store.getState().apps;

			// 查找需要删除的应用程序
			var matchingAppKey = Object.keys(apps).find((key) => apps[key].slice === slice && apps[key].action === action);

			// 如果找到匹配的应用程序
			if (matchingAppKey) {
				// 获取匹配的应用程序
				var app = apps[matchingAppKey];

				// 如果是渐进式网络应用（PWA）
				if (app.pwa == true) {
					// 发送关闭应用程序的操作到 store
					store.dispatch({ type: app.action, payload: "close" });

					// 发送删除应用程序的操作到 store
					store.dispatch({ type: "app/removeApp", payload: app.icon });

					// 获取本地存储中的已安装应用列表
					var installed = getLocalStorageOrDefault("installed", "[]");
					installed = JSON.parse(installed);

					// 过滤掉被删除应用的信息
					installed = installed.filter((x) => x.icon != app.icon);

					// 更新本地存储中的已安装应用列表
					setLocalStorage("installed", JSON.stringify(installed));

					// 发送删除桌面应用程序的操作到 store
					store.dispatch({ type: "desktop/removeApp", payload: app.name });
				}
			}
		}
	}
};
