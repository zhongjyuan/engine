/**
 * 菜单管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月14日18:11:56
 */
const menuManagement = {
	/**
	 * 获取格式化后的键盘映射条目
	 * @param {string} keybinding - 要获取对应映射条目的键位
	 * @returns {string|null} 格式化后的键盘映射条目，或 null（如果找不到对应映射）
	 */
	formatKeyMapEntry: function (keybinding) {
		// 从设置中获取键盘映射配置中对应键位的数值
		const value = settingManagement.get("keyMap")?.[keybinding];

		// 如果获取到了对应键位的数值
		if (value) {
			// 如果值是一个数组，表示有多个条目，则返回第一个条目，并将'mod'替换为'CmdOrCtrl'
			if (Array.isArray(value)) {
				return value[0].replace("mod", "CmdOrCtrl");
			} else {
				// 如果只有一个条目，则将'mod'替换为'CmdOrCtrl'后返回
				return value.replace("mod", "CmdOrCtrl");
			}
		}

		// 如果没有获取到对应键位的数值，则返回null
		return null;
	},

	/**
	 * 构建应用菜单
	 * @param {Object} options - 选项对象
	 * @returns {Menu} 应用菜单
	 */
	buildAppMenu: function (options = {}) {
		/**
		 * 生成Tab、任务等菜单项的配置数组
		 * @returns {Array<Object>} 菜单项的配置数组
		 */
		var tabTaskMenuItems = [
			{
				/** 显示在菜单中的文本 */
				label: l("appMenuNewTab"),
				/** 快捷键 */
				accelerator: menuManagement.formatKeyMapEntry("addTab") || "CmdOrCtrl+t",
				/**
				 * 点击事件处理函数
				 * @param {*} item - 被点击的菜单项
				 * @param {*} window - 当前窗口对象
				 * @param {*} event - 点击事件对象
				 */
				click: function (item, window, event) {
					// 如果不是通过快捷键触发的，则向窗口发送IPC消息'addTab'
					if (!event.triggeredByAccelerator) {
						sendIPCToWindow(window, "addTab");
					}
				},
			},
			{
				/** 显示在菜单中的文本 */
				label: l("appMenuNewPrivateTab"),
				/** 快捷键 */
				accelerator: menuManagement.formatKeyMapEntry("addPrivateTab") || "shift+CmdOrCtrl+p",
				/**
				 * 点击事件处理函数
				 * @param {*} item - 被点击的菜单项
				 * @param {*} window - 当前窗口对象
				 * @param {*} event - 点击事件对象
				 */
				click: function (item, window, event) {
					// 如果不是通过快捷键触发的，则向窗口发送IPC消息'addPrivateTab'
					if (!event.triggeredByAccelerator) {
						sendIPCToWindow(window, "addPrivateTab");
					}
				},
			},
			{
				/** 显示在菜单中的文本 */
				label: l("appMenuNewTask"),
				/** 快捷键 */
				accelerator: menuManagement.formatKeyMapEntry("addTask") || "CmdOrCtrl+n",
				/**
				 * 点击事件处理函数
				 * @param {*} item - 被点击的菜单项
				 * @param {*} window - 当前窗口对象
				 * @param {*} event - 点击事件对象
				 */
				click: function (item, window, event) {
					// 如果不是通过快捷键触发的，则向窗口发送IPC消息'addTask'
					if (!event.triggeredByAccelerator) {
						sendIPCToWindow(window, "addTask");
					}
				},
			},
			{
				/** 显示在菜单中的文本 */
				label: l("appMenuNewWindow"),
				/** 快捷键 */
				accelerator: menuManagement.formatKeyMapEntry("addWindow") || "shift+CmdOrCtrl+n",
				/**
				 * 点击事件处理函数
				 */
				click: function () {
					// 如果当前处于焦点模式，则弹出提示框，否则创建一个新窗口
					if (isFocusMode) {
						promptManagement.showFocusModeDialog2();
					} else {
						createWindow();
					}
				},
			},
		];

		/**
		 * 生成个人相关操作的菜单项配置数组
		 * @returns {Array<Object>} 菜单项的配置数组
		 */
		var personalMenuItems = [
			{
				/** 显示在菜单中的文本 */
				label: l("appMenuBookmarks"),
				/** 快捷键 */
				accelerator: menuManagement.formatKeyMapEntry("showBookmarks") || "CmdOrCtrl+b",
				/**
				 * 点击事件处理函数
				 * @param {*} item - 被点击的菜单项
				 * @param {*} window - 当前窗口对象
				 * @param {*} event - 点击事件对象
				 */
				click: function (item, window, event) {
					// 如果不是通过快捷键触发的，则向窗口发送IPC消息'showBookmarks'
					if (!event.triggeredByAccelerator) {
						sendIPCToWindow(window, "showBookmarks");
					}
				},
			},
			{
				/** 显示在菜单中的文本 */
				label: l("appMenuHistory"),
				/** 快捷键 */
				accelerator: menuManagement.formatKeyMapEntry("showHistory") || "Shift+CmdOrCtrl+h",
				/**
				 * 点击事件处理函数
				 * @param {*} item - 被点击的菜单项
				 * @param {*} window - 当前窗口对象
				 * @param {*} event - 点击事件对象
				 */
				click: function (item, window, event) {
					// 如果不是通过快捷键触发的，则向窗口发送IPC消息'showHistory'
					if (!event.triggeredByAccelerator) {
						sendIPCToWindow(window, "showHistory");
					}
				},
			},
		];

		/**
		 * 生成偏好设置操作的菜单项配置对象
		 * @returns {Object} 菜单项的配置对象
		 */
		var preferencesMenuItem = {
			/** 显示在菜单中的文本 */
			label: l("appMenuPreferences"),
			/** 快捷键 */
			accelerator: "CmdOrCtrl+,",
			/**
			 * 点击事件处理函数
			 * @param {*} item - 被点击的菜单项
			 * @param {*} window - 当前窗口对象
			 */
			click: function (item, window) {
				// 向窗口发送IPC消息'addTab'
				sendIPCToWindow(window, "addTab", {
					// 向窗口发送IPC消息
					url: "file://" + __dirname + "/src/pages/settings/index.html",
				});
			},
		};

		/**
		 * 生成退出应用程序菜单项配置对象
		 * @returns {Object} 菜单项的配置对象
		 */
		var quitMenuItem = {
			/** 显示在菜单中的文本 */
			label: l("appMenuQuit").replace("%n", app.name),
			/** 快捷键 */
			accelerator: menuManagement.formatKeyMapEntry("quitMin") || "CmdOrCtrl+Q",
			/**
			 * 点击事件处理函数
			 * @param {*} item - 被点击的菜单项
			 * @param {*} window - 当前窗口对象
			 * @param {*} event - 点击事件对象
			 */
			click: function (item, window, event) {
				// 如果不是通过快捷键触发的
				if (!event.triggeredByAccelerator) {
					// 退出应用程序
					app.quit();
				}
			},
		};

		/**
		 * 生成文件菜单配置对象
		 * @returns {Object} 菜单配置对象
		 */
		var fileMenuItem = {
			/** 显示在菜单中的文本 */
			label: l("appMenuFile"),
			/**二级菜单数组 */
			submenu: [
				...(!options.secondary ? tabTaskMenuItems : []), // 如果不是辅助窗口，则包含子菜单
				...(!options.secondary ? [{ type: "separator" }] : []), // 如果不是辅助窗口，则添加分隔线
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuSavePageAs"),
					/** 快捷键 */
					accelerator: "CmdOrCtrl+s",
					/**
					 * 点击事件处理函数
					 * @param {*} item - 被点击的菜单项
					 * @param {*} window - 当前窗口对象
					 */
					click: function (item, window) {
						// 向窗口发送IPC消息
						sendIPCToWindow(window, "saveCurrentPage");
					},
				},
				{
					/**分隔线 */
					type: "separator",
				},
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuPrint"),
					/** 快捷键 */
					accelerator: "CmdOrCtrl+p",
					/**
					 * 点击事件处理函数
					 * @param {*} item - 被点击的菜单项
					 * @param {*} window - 当前窗口对象
					 */
					click: function (item, window) {
						// 向窗口发送IPC消息
						sendIPCToWindow(window, "print");
					},
				},
				...(!options.secondary && process.platform === "linux" ? [{ type: "separator" }] : []), // 如果是Linux系统，则添加分隔线
				...(!options.secondary && process.platform === "linux" ? [quitMenuItem] : []), // 如果是Linux系统，则添加“退出”菜单项
			],
		};

		/**
		 * 生成编辑菜单配置对象
		 * @returns {Object} 菜单配置对象
		 */
		var editMenuItem = {
			/** 显示在菜单中的文本 */
			label: l("appMenuEdit"),
			/**二级菜单数组 */
			submenu: [
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuUndo"),
					/** 快捷键 */
					accelerator: "CmdOrCtrl+Z",
					/**角色 */
					role: "undo",
				},
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuRedo"),
					/** 快捷键 */
					accelerator: "Shift+CmdOrCtrl+Z",
					/**角色 */
					role: "redo",
				},
				{
					/**分隔线 */
					type: "separator",
				},
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuCut"),
					/** 快捷键 */
					accelerator: "CmdOrCtrl+X",
					/**角色 */
					role: "cut",
				},
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuCopy"),
					/** 快捷键 */
					accelerator: "CmdOrCtrl+C",
					/**角色 */
					role: "copy",
				},
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuPaste"),
					/** 快捷键 */
					accelerator: "CmdOrCtrl+V",
					/**角色 */
					role: "paste",
				},
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuSelectAll"),
					/** 快捷键 */
					accelerator: "CmdOrCtrl+A",
					/**角色 */
					role: "selectall",
				},
				{
					/**分隔线 */
					type: "separator",
				},
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuFind"),
					/** 快捷键 */
					accelerator: "CmdOrCtrl+F",
					/**
					 * 点击事件处理函数
					 * @param {*} item - 被点击的菜单项
					 * @param {*} window - 当前窗口对象
					 */
					click: function (item, window) {
						// 向窗口发送IPC消息
						sendIPCToWindow(window, "findInPage");
					},
				},
				...(!options.secondary && !isMac ? [{ type: "separator" }] : []), // 如果不是辅助窗口且不是Mac系统，则添加分隔线
				...(!options.secondary && !isMac ? [preferencesMenuItem] : []), // 如果不是辅助窗口且不是Mac系统，则添加“首选项”菜单项
			],
		};

		/**
		 * 生成视图菜单配置对象
		 * @returns {Object} 菜单配置对象
		 */
		var viewMenuItem = {
			/** 显示在菜单中的文本 */
			label: l("appMenuView"),
			/**二级菜单数组 */
			submenu: [
				...(!options.secondary ? personalMenuItems : []), // 如果不是辅助窗口，则添加个人数据项
				...(!options.secondary ? [{ type: "separator" }] : []), // 如果不是辅助窗口，则添加分隔线
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuZoomIn"),
					/**快捷键 */
					accelerator: "CmdOrCtrl+Plus",
					/**
					 * 点击事件处理函数
					 * @param {*} item - 被点击的菜单项
					 * @param {*} window - 当前窗口对象
					 */
					click: function (item, window) {
						// 向窗口发送IPC消息，执行放大操作
						sendIPCToWindow(window, "zoomIn");
					},
				},
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuZoomOut"),
					/**快捷键 */
					accelerator: "CmdOrCtrl+-",
					/**
					 * 点击事件处理函数
					 * @param {*} item - 被点击的菜单项
					 * @param {*} window - 当前窗口对象
					 */
					click: function (item, window) {
						// 向窗口发送IPC消息，执行缩小操作
						sendIPCToWindow(window, "zoomOut");
					},
				},
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuActualSize"),
					/**快捷键 */
					accelerator: "CmdOrCtrl+0",
					/**
					 * 点击事件处理函数
					 * @param {*} item - 被点击的菜单项
					 * @param {*} window - 当前窗口对象
					 */
					click: function (item, window) {
						// 向窗口发送IPC消息，恢复实际大小
						sendIPCToWindow(window, "zoomReset");
					},
				},
				{
					/**分隔线 */
					type: "separator",
				},
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuFocusMode"),
					/**快捷键 */
					accelerator: undefined,
					/**复选框 */
					type: "checkbox",
					/**默认未选中 */
					checked: false,
					/**
					 * 点击事件处理函数
					 * @param {*} item - 被点击的菜单项
					 * @param {*} window - 当前窗口对象
					 */
					click: function (item, window) {
						if (isFocusMode) {
							isFocusMode = false;
							windowManagement.getOpenWins().forEach((win) => sendIPCToWindow(win, "exitFocusMode")); // 退出焦点模式
						} else {
							isFocusMode = true;
							windowManagement.getOpenWins().forEach((win) => sendIPCToWindow(win, "enterFocusMode")); // 进入焦点模式

							// 等待隐藏选项卡后再显示提示信息，使提示信息更清晰
							setTimeout(function () {
								remoteActionManagement.showFocusModeDialog1();
							}, 16);
						}
					},
				},
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuFullScreen"),
					/**快捷键 */
					accelerator: (function () {
						if (process.platform == "darwin") {
							return "Ctrl+Command+F"; // macOS的全屏快捷键
						} else {
							return "F11"; // 其他系统的全屏快捷键
						}
					})(),
					/**角色为切换全屏 */
					role: "togglefullscreen",
				},
			],
		};

		/**
		 * 生成开发者菜单配置对象
		 * @returns {Object} 菜单配置对象
		 */
		var developerMenuItem = {
			/** 显示在菜单中的文本 */
			label: l("appMenuDeveloper"),
			/**二级菜单数组 */
			submenu: [
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuInspectPage"),
					/**快捷键 */
					accelerator: (function () {
						if (process.platform == "darwin") {
							return "Cmd+Alt+I"; // macOS的快捷键
						} else {
							return "Ctrl+Shift+I"; // 其他系统的快捷键
						}
					})(),
					/**
					 * 点击事件处理函数
					 * @param {*} item - 被点击的菜单项
					 * @param {*} window - 当前窗口对象
					 */
					click: function (item, window) {
						// 向窗口发送IPC消息，执行页面检查操作
						sendIPCToWindow(window, "inspectPage");
					},
				},
				// 这里定义了第二个相同的菜单项（但是隐藏），以提供两个不同的快捷键
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuInspectPage"),
					/**不可见 */
					visible: false,
					/**快捷键 */
					accelerator: "f12",
					/**
					 * 点击事件处理函数
					 * @param {*} item - 被点击的菜单项
					 * @param {*} window - 当前窗口对象
					 */
					click: function (item, window) {
						// 点击事件
						sendIPCToWindow(window, "inspectPage"); // 向窗口发送IPC消息，执行页面检查操作
					},
				},
				{
					/**分割线 */
					type: "separator",
				},
				...(isDevelopmentMode // 如果是开发者模式
					? [
							{
								/** 显示在菜单中的文本 */
								label: l("appMenuReloadBrowser"),
								/**快捷键 */
								accelerator: isDevelopmentMode ? "alt+CmdOrCtrl+R" : undefined,
								/**
								 * 点击事件处理函数
								 * @param {*} item - 被点击的菜单项
								 * @param {*} window - 当前窗口对象
								 */
								click: function (item, window) {
									// 销毁所有视图
									viewManagement.destroyAllViews();

									// 关闭所有窗口
									windowManagement.getOpenWins().forEach((win) => win.close());

									// 创建新窗口
									createWindow();
								},
							},
					  ]
					: []),
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuInspectBrowser"),
					/**快捷键 */
					accelerator: (function () {
						if (isMac) {
							return "Shift+Cmd+Alt+I"; // macOS的快捷键
						} else {
							return "Ctrl+Shift+Alt+I"; // 其他系统的快捷键
						}
					})(),
					/**
					 * 点击事件处理函数
					 * @param {*} item - 被点击的菜单项
					 * @param {*} window - 当前窗口对象
					 */
					click: function (item, window) {
						// 切换开发者工具的显示/隐藏状态
						if (window) window.toggleDevTools();
					},
				},
			],
		};

		/**
		 * 生成帮助菜单配置对象
		 * @returns {Object} 菜单配置对象
		 */
		var helpMenuItem = {
			/** 显示在菜单中的文本 */
			label: l("appMenuHelp"),
			/**角色为“帮助” */
			role: "help",
			/**二级菜单数组 */
			submenu: [
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuKeyboardShortcuts"),
					/**
					 * 点击事件处理函数
					 */
					click: function () {
						// 点击事件会打开一个新标签页并加载指定的链接
						openTabInWindow("https://gitee.com/zhongjyuan-team/workbench/wikis/Shortcuts");
					},
				},
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuReportBug"),
					/**
					 * 点击事件处理函数
					 */
					click: function () {
						// 点击事件会打开一个新标签页并加载指定的链接
						openTabInWindow("https://gitee.com/zhongjyuan-team/workbench/issues/new");
					},
				},
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuTakeTour"),
					/**
					 * 点击事件处理函数
					 */
					click: function () {
						// 点击事件会打开一个新标签页并加载指定的链接
						openTabInWindow("https://gitee.com/zhongjyuan-team/workbench/tour/");
					},
				},
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuViewGithub"),
					/**
					 * 点击事件处理函数
					 */
					click: function () {
						// 点击事件会打开一个新标签页并加载指定的链接
						openTabInWindow("https://gitee.com/zhongjyuan-team/workbench");
					},
				},
				...(!isMac ? [{ type: "separator" }] : []), // 如果不是在 macOS 平台上，则添加一个分隔线
				...(!isMac
					? [
							{
								/** 显示在菜单中的文本 */
								label: l("appMenuAbout").replace("%n", app.name),
								/**
								 * 点击事件处理函数
								 * @param {*} item - 被点击的菜单项
								 * @param {*} window - 当前窗口对象
								 */
								click: function (item, window) {
									var info = [app.name + " v" + app.getVersion(), "Chromium v" + process.versions.chrome];
									electron.dialog.showMessageBox({
										type: "info",
										title: l("appMenuAbout").replace("%n", app.name), // 弹窗的标题
										message: info.join("\n"), // 弹窗的消息内容
										buttons: [l("closeDialog")], // 按钮文本
									});
								},
							},
					  ]
					: []),
			],
		};

		/**
		 * 生成 macOS 上的 Tab菜单项的配置数组
		 * @returns {Array<Object>} 菜单项的配置数组
		 */
		var darwinTabMenuItems = [
			{
				/** 显示在菜单中的文本 */
				label: app.name,
				/**二级菜单数组 */
				submenu: [
					{
						/** 显示在菜单中的文本 */
						label: l("appMenuAbout").replace("%n", app.name),
						/**角色为“关于” */
						role: "about",
					},
					{
						/**分隔线 */
						type: "separator",
					},
					preferencesMenuItem, // 引用之前定义过的偏好设置菜单项
					{
						/** 显示在菜单中的文本 */
						label: "Services",
						/**角色为“服务” */
						role: "services",
						/**二级菜单数组 */
						submenu: [],
					},
					{
						/**分隔线 */
						type: "separator",
					},
					{
						/** 显示在菜单中的文本 */
						label: l("appMenuHide").replace("%n", app.name),
						/**快捷键 */
						accelerator: "CmdOrCtrl+H",
						/**角色为“隐藏应用” */
						role: "hide",
					},
					{
						/** 显示在菜单中的文本 */
						label: l("appMenuHideOthers"),
						/**快捷键 */
						accelerator: "CmdOrCtrl+Alt+H",
						/**角色为“隐藏其他应用” */
						role: "hideothers",
					},
					{
						/** 显示在菜单中的文本 */
						label: l("appMenuShowAll"),
						/**角色为“显示所有应用” */
						role: "unhide",
					},
					{
						/**分隔线 */
						type: "separator",
					},
					quitMenuItem, // 引用之前定义过的退出菜单项
				],
			},
		];

		/**
		 * 生成 macOS 上的 Tab 窗口菜单项的配置数组
		 * @returns {Array} Tab 窗口菜单项的配置数组
		 */
		var darwinTabWindowMenuItems = [
			{
				/** 显示在菜单中的文本 */
				label: l("appMenuWindow"),
				/**角色为“窗口” */
				role: "window",
				/**二级菜单数组 */
				submenu: [
					{
						/** 显示在菜单中的文本 */
						label: l("appMenuMinimize"),
						/**快捷键 */
						accelerator: "CmdOrCtrl+M",
						/**角色为“最小化” */
						role: "minimize",
					},
					{
						/** 显示在菜单中的文本 */
						label: l("appMenuClose"),
						/**快捷键 */
						accelerator: "CmdOrCtrl+W",
						/**
						 *
						 * @param {*} item
						 * @param {*} window
						 * @returns
						 */
						click: function (item, window) {
							// 如果有窗口且没有窗口处于焦点状态，则关闭开发工具窗口
							if (windowManagement.getOpenWins().length > 0 && !windowManagement.getOpenWins().some((win) => win.isFocused())) {
								var contents = webContents.getAllWebContents();
								for (var i = 0; i < contents.length; i++) {
									if (contents[i].isDevToolsFocused()) {
										contents[i].closeDevTools();
										return;
									}
								}
							}
							// 否则，此事件将在主窗口中处理
						},
					},
					{
						/** 显示在菜单中的文本 */
						label: l("appMenuAlwaysOnTop"),
						/**复选框 */
						type: "checkbox",
						/**据设置的值决定是否选中复选框 */
						checked: settingManagement.get("windowAlwaysOnTop") || false,
						/**
						 *
						 * @param {*} item
						 * @param {*} window
						 */
						click: function (item, window) {
							windowManagement.getOpenWins().forEach(function (win) {
								win.setAlwaysOnTop(item.checked);
							});

							// 将设置保存到窗口总是置顶设置中
							settingManagement.set("windowAlwaysOnTop", item.checked);
						},
					},
					{
						/**分隔线 */
						type: "separator",
					},
					{
						/** 显示在菜单中的文本 */
						label: l("appMenuBringToFront"),
						/**角色为“置于前面” */
						role: "front",
					},
				],
			},
		];

		var tabTemplate = [
			...(options.secondary ? tabTaskMenuItems : []),
			...(options.secondary ? [{ type: "separator" }] : []),
			...(options.secondary ? personalMenuItems : []),
			...(options.secondary ? [{ type: "separator" }] : []),
			...(options.secondary ? [preferencesMenuItem] : []),
			...(options.secondary ? [{ type: "separator" }] : []),
			...(isMac ? darwinTabMenuItems : []),
			fileMenuItem,
			editMenuItem,
			viewMenuItem,
			developerMenuItem,
			...(isMac ? darwinTabWindowMenuItems : []),
			helpMenuItem,
			...(options.secondary && !isMac ? [{ type: "separator" }] : []),
			...(options.secondary && !isMac ? [quitMenuItem] : []),
		];

		// 使用菜单模板构建应用菜单
		return Menu.buildFromTemplate(tabTemplate);
	},

	/**
	 * 创建 macOS Dock 菜单
	 * @param {Object} options - 选项对象
	 */
	createDockMenu: function (options = {}) {
		if (isMac) {
			var Menu = electron.Menu; // 引入 electron 的 Menu 模块

			var template = [
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuNewTab"),
					/**
					 *
					 * @param {*} item
					 * @param {*} window
					 */
					click: function (item, window) {
						// 发送 IPC 消息到窗口，执行添加标签页的操作
						sendIPCToWindow(window, "addTab");
					},
				},
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuNewPrivateTab"),
					/**
					 *
					 * @param {*} item
					 * @param {*} window
					 */
					click: function (item, window) {
						// 发送 IPC 消息到窗口，执行添加私密标签页的操作
						sendIPCToWindow(window, "addPrivateTab");
					},
				},
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuNewTask"),
					/**
					 *
					 * @param {*} item
					 * @param {*} window
					 */
					click: function (item, window) {
						// 发送 IPC 消息到窗口，执行添加任务的操作
						sendIPCToWindow(window, "addTask");
					},
				},
				{
					/** 显示在菜单中的文本 */
					label: l("appMenuNewWindow"),
					/**
					 *
					 */
					click: function () {
						if (isFocusMode) {
							// 显示焦点模式对话框
							remoteActionManagement.showFocusModeDialog2();
						} else {
							// 创建新窗口
							createWindow();
						}
					},
				},
			];

			// 使用模板构建 Dock 菜单，并设置给 app 的 dock 属性
			app.dock.setMenu(Menu.buildFromTemplate(template));
		}
	},
};
