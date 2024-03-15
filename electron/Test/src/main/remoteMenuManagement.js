/**
 * 远端菜单管理对象(右键菜单)
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日19:28:19
 */
const remoteMenuManagement = {
	/**
	 * 初始化
	 */
	initialize: function () {
		// 创建一个空的上下文菜单
		ipc.on("open-context-menu", function (e, data) {
			var menu = new Menu();

			// 遍历上下文菜单的模板，生成菜单项并添加到菜单中
			data.template.forEach(function (section) {
				section.forEach(function (item) {
					// 将菜单项的 click 事件重写为发送 "context-menu-item-selected" 的 IPC 事件，携带菜单 ID 和菜单项 ID 作为参数
					var id = item.click;
					item.click = function () {
						e.sender.send("context-menu-item-selected", { menuId: data.id, itemId: id });
					};

					// 如果菜单项有子菜单，在子菜单中也重写所有菜单项的 click 事件
					if (item.submenu) {
						for (var i = 0; i < item.submenu.length; i++) {
							(function (id) {
								item.submenu[i].click = function () {
									e.sender.send("context-menu-item-selected", { menuId: data.id, itemId: id });
								};
							})(item.submenu[i].click);
						}
					}

					// 将菜单项添加到菜单中
					menu.append(new MenuItem(item));
				});

				// 添加一个分隔符，用于分隔不同的菜单项
				menu.append(new MenuItem({ type: "separator" }));
			});

			// 监听菜单即将关闭的事件，当菜单关闭时，发送 "context-menu-will-close" 的 IPC 事件，携带菜单 ID 作为参数
			menu.on("menu-will-close", function () {
				e.sender.send("context-menu-will-close", { menuId: data.id });
			});

			// 在指定位置弹出菜单
			menu.popup({ x: data.x, y: data.y });
		});
	},
};

remoteMenuManagement.initialize();