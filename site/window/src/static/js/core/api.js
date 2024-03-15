/**
 * 接口对象
 * @author zhongjyuan
 * @date   2023年5月15日14:32:53
 * @email  zhongjyuan@outlook.com
 */
ZHONGJYUAN.api = {
	/**
	 * 唯一标识
	 * @author zhongjyuan
	 * @date   2023年5月15日14:48:34
	 * @email  zhongjyuan@outlook.com
	 * @returns
	 */
	id: function() {
		ZHONGJYUAN.logger.trace("api.[id]");
		var vue = ZHONGJYUAN.vue;

		var result = vue.configs.idCounter++ + "";

		ZHONGJYUAN.logger.debug("api.[id] result:${0}", result);
		return result;
	},

	/**
	 * 多语言
	 * @author zhongjyuan
	 * @date   2023年5月15日14:50:37
	 * @email  zhongjyuan@outlook.com
	 * @param {*} key 多语言键
	 * @returns
	 */
	lang: function(key) {
		ZHONGJYUAN.logger.trace("api.[lang] key:${0}", key);
		var lang = ZHONGJYUAN.static.lang;
		var languages = ZHONGJYUAN.static.languages;

		var result = languages[lang] ? languages[lang][key] : "";

		ZHONGJYUAN.logger.debug("api.[lang] key:${0};result:${1}", key, result);
		return result;
	},

	/**
	 * 版本信息
	 * @author zhongjyuan
	 * @date   2023年5月15日14:49:01
	 * @email  zhongjyuan@outlook.com
	 * @returns
	 */
	version: function() {
		ZHONGJYUAN.logger.trace("api.[version]");

		var version = ZHONGJYUAN.static.version;

		ZHONGJYUAN.logger.debug("api.[version] result:${0}", version);
		return version;
	},

	/**
	 * 令牌信息
	 * @author zhongjyuan
	 * @date   2023年5月15日14:51:09
	 * @email  zhongjyuan@outlook.com
	 * @returns
	 */
	token: function() {
		ZHONGJYUAN.logger.trace("api.[token]");
		var token = ZHONGJYUAN.static.token;

		var result = ZHONGJYUAN.helper.random.int(token.min, token.max);

		ZHONGJYUAN.logger.debug("api.[token] result:${0}", result);
		return result;
	},

	/**
	 * 令牌对象
	 * @author zhongjyuan
	 * @date   2023年5月15日14:51:42
	 * @email  zhongjyuan@outlook.com
	 * @param {*} name 令牌名称[为空时,取 ZHONGJYUAN.static.token.name]
	 * @param {*} token 令牌值[为空时,随机生成]
	 * @returns
	 */
	tokenObject: function(name, token) {
		ZHONGJYUAN.logger.trace("api.[tokenObject] name:${0};token:${1}", name, token);
		var that = ZHONGJYUAN.api;
		var tokenConfig = ZHONGJYUAN.static.token;

		var params = {};
		name || (name = tokenConfig.name);
		params[name] = token || (token = that.token());

		ZHONGJYUAN.logger.debug("api.[tokenObject] result:${0}", JSON.stringify(params));
		return params;
	},

	/**
	 * F5刷新
	 * @author zhongjyuan
	 * @date   2023年5月15日14:34:04
	 * @email  zhongjyuan@outlook.com
	 */
	f5: function() {
		ZHONGJYUAN.logger.trace("api.[f5]");

		ZHONGJYUAN.static.switch.askBeforeClose = false;
		ZHONGJYUAN.helper.f5();
	},

	/**
	 * 重置
	 * @author zhongjyuan
	 * @date   2023年5月15日14:49:20
	 * @email  zhongjyuan@outlook.com
	 */
	reset: function() {
		ZHONGJYUAN.logger.trace("api.[reset]");
		var template = ZHONGJYUAN.static.template;
		var vue = ZHONGJYUAN.vue;

		var data = template.basic;
		for (var i in data) {
			if (i !== "apps") {
				vue.$set(vue, i, data[i]);
			}
		}

		vue.$set(vue, "apps", {});
	},

	/**
	 * 计算表达式字符串并将结果整型化
	 * @author zhongjyuan
	 * @date   2023年5月15日14:52:41
	 * @email  zhongjyuan@outlook.com
	 * @param {*} str 计算表达式[其中x和y将被替换为屏幕的宽和高]
	 */
	evalNum: function(str) {
		ZHONGJYUAN.logger.trace("api.[evalNum] expression:${0}", str);

		var result = 0;
		if (isNaN(str)) {
			try {
				if (!/^[\dxy+\-*\/()\s.]*$/.test(str)) {
					//防xss的过滤
					str = "600";
				}
				var query = "var x=ZHONGJYUAN.vue.runtime.screenSize.width;var y=ZHONGJYUAN.vue.runtime.screenSize.height-40;" + str;
				result = eval(query);
			} catch (e) {
				ZHONGJYUAN.logger.error(e);
			}
		} else {
			result = str;
		}

		ZHONGJYUAN.logger.debug("api.[evalNum] result:${0}", result);
		return parseInt(result);
	},

	/**
	 * 窗口最高下标
	 */
	_winMaxZIndex: 0,

	/**
	 * 获取窗口最高下标
	 * @author zhongjyuan
	 * @date   2023年5月15日14:59:36
	 * @email  zhongjyuan@outlook.com
	 * @returns
	 */
	getWinMaxZIndex: function() {
		ZHONGJYUAN.logger.trace("api.[getWinMaxZIndex]");
		var that = ZHONGJYUAN.api;

		that._winMaxZIndex++;
		var result = that._winMaxZIndex;

		ZHONGJYUAN.logger.debug("api.[getWinMaxZIndex] result:${0}", result);
		return result;
	},

	/**
	 * 设置窗口最高下标
	 * @author zhongjyuan
	 * @date   2023年5月15日14:59:41
	 * @email  zhongjyuan@outlook.com
	 * @param {*} index 窗口下标
	 */
	setWinMaxZIndex: function(index) {
		ZHONGJYUAN.logger.trace("api.[setWinMaxZIndex] index:${0}", index);
		var that = ZHONGJYUAN.api;

		ZHONGJYUAN.logger.debug("api.[setWinMaxZIndex] index:${0}", index);
		that._winMaxZIndex = index;
	},

	/**
	 * 设置背景
	 * @author zhongjyuan
	 * @date   2023年5月15日15:00:27
	 * @email  zhongjyuan@outlook.com
	 * @param {*} url 文件地址
	 */
	setWallpaper: function(url) {
		ZHONGJYUAN.logger.trace("api.[setWallpaper] url:${0}", url);
		var vue = ZHONGJYUAN.vue;

		ZHONGJYUAN.logger.debug("api.[setWallpaper] url:${0}", url);
		vue.configs.wallpaper = url;
	},

	/**
	 * 主题颜色
	 * @author zhongjyuan
	 * @date   2023年5月15日15:00:44
	 * @email  zhongjyuan@outlook.com
	 */
	setThemeColor: function(color) {
		ZHONGJYUAN.logger.trace("api.[setThemeColor] color:${0}", color);
		var vue = ZHONGJYUAN.vue;

		ZHONGJYUAN.logger.debug("api.[setThemeColor] color:${0}", color);
		vue.configs.themeColor = color;
	},

	/**
	 * 增加桌面快捷方式
	 * @author zhongjyuan
	 * @date   2023年5月15日15:01:23
	 * @email  zhongjyuan@outlook.com
	 * @param {*} data 数据
	 */
	addShortcut: function(data) {
		ZHONGJYUAN.logger.trace("api.[addShortcut] data:${0}", JSON.stringify(data));
		var vue = ZHONGJYUAN.vue;

		var shortcutTemplate = ZHONGJYUAN.static.template.shortcut;
		if (typeof data === "string") {
			var app = vue.apps[data];
			if (!app) {
				ZHONGJYUAN.logger.warn("api.[addShortcut] app not exist! ${0}", data);
				return;
			}

			shortcutTemplate = ZHONGJYUAN.helper.json.merge(shortcutTemplate, {
				app: data,
				title: app.title,
			});
		} else {
			shortcutTemplate = ZHONGJYUAN.helper.json.merge(shortcutTemplate, data);
		}

		ZHONGJYUAN.logger.debug("api.[addShortcut] data:${0};shortcut:${1}", JSON.stringify(data), JSON.stringify(shortcutTemplate));
		vue.shortcuts.push(shortcutTemplate);
	},

	/**
	 * 移除桌面快捷方式
	 * @author zhongjyuan
	 * @date   2023年5月15日15:17:02
	 * @email  zhongjyuan@outlook.com
	 * @param {*} app 应用
	 */
	removeShortcut: function(app) {
		ZHONGJYUAN.logger.trace("api.[removeShortcut] app:${0}", JSON.stringify(app));
		var vue = ZHONGJYUAN.vue;

		for (var index = vue.shortcuts.length - 1; index >= 0; index--) {
			var shortcut = vue.shortcuts[index];
			if (shortcut.children) {
				for (var j = shortcut.children.length - 1; j >= 0; j--) {
					var shortcutChildren = shortcut.children[j];
					if (shortcutChildren.app === app) {
						shortcut.children.splice(j, 1);
					}
				}
			} else {
				if (shortcut.app === app) {
					vue.shortcuts.splice(index, 1);
				}
			}
		}
		ZHONGJYUAN.logger.debug("api.[removeShortcut] app:${0}", JSON.stringify(app));
	},

	/**
	 * 增加开始菜单项
	 * @author zhongjyuan
	 * @date   2023年5月15日15:02:31
	 * @email  zhongjyuan@outlook.com
	 * @param {*} appId 应用唯一标识
	 */
	addStartMenu: function(appId) {
		ZHONGJYUAN.logger.trace("api.[addStartMenu] appId:${0}", JSON.stringify(appId));
		var vue = ZHONGJYUAN.vue;

		var menuTemplate = ZHONGJYUAN.static.template.menu;
		var menuIdPrefix = ZHONGJYUAN.static.id.menuPrefix;

		if (typeof appId === "string") {
			var app = vue.apps[appId];
			if (!app) {
				ZHONGJYUAN.logger.warn("api.[addStartMenu] app not exist! ${0}", appId);
				return;
			}

			menuTemplate = ZHONGJYUAN.helper.json.merge(menuTemplate, {
				app: appId,
				title: app.title,
			});
		} else {
			menuTemplate = ZHONGJYUAN.helper.json.merge(menuTemplate, appId);
		}

		var runtimeId = vue.win_set_id(that.startMenu.menu, menuTemplate, menuIdPrefix);
		ZHONGJYUAN.logger.debug("api.[addStartMenu] appId:${0};app:${1};runtimeId:${2}", JSON.stringify(appId), JSON.stringify(menuTemplate), runtimeId);
	},

	/**
	 * 移除开始菜单项
	 * @author zhongjyuan
	 * @date   2023年5月15日15:20:51
	 * @email  zhongjyuan@outlook.com
	 * @param {*} app 应用
	 * @param {*} parent 父级菜单
	 */
	removeStartMenu: function(app, parent) {
		ZHONGJYUAN.logger.trace("api.[removeStartMenu] app:${0};parent:${1}", JSON.stringify(app), JSON.stringify(parent));
		var that = ZHONGJYUAN.api;
		var vue = ZHONGJYUAN.vue;

		var menu = parent ? parent.children : vue.startMenu.menu;
		for (var i in menu) {
			var item = menu[i];
			if (item.app === app) {
				vue.$delete(menu, i);
			}

			if (item.children) {
				that.removeStartMenu(null, item);
			}
		}
		ZHONGJYUAN.logger.debug(
			"api.[removeStartMenu] app:${0};parent:${1};menu:${2}",
			JSON.stringify(app),
			JSON.stringify(parent),
			JSON.stringify(menu)
		);
	},

	/**
	 * 增加开始菜单侧边栏按钮
	 * @author zhongjyuan
	 * @date   2023年5月15日15:03:22
	 * @email  zhongjyuan@outlook.com
	 * @param {*} data 数据
	 */
	addStartMenuSidebarButton: function(data) {
		ZHONGJYUAN.logger.trace("api.[addStartMenuSidebarButton] data:${0}", JSON.stringify(data));
		var vue = ZHONGJYUAN.vue;

		var sidebarButtonTemplate = ZHONGJYUAN.static.template.sidebarButton;
		if (typeof data === "string") {
			var app = vue.apps[data];
			if (!app) {
				ZHONGJYUAN.logger.warn("api.[addStartMenuSidebarButton] app not exist! ${0}", app);
				return;
			}

			sidebarButtonTemplate = ZHONGJYUAN.helper.json.merge(sidebarButtonTemplate, {
				app: data,
				title: app.title,
			});
		} else {
			sidebarButtonTemplate = ZHONGJYUAN.helper.json.merge(sidebarButtonTemplate, data);
		}

		vue.startMenu.sidebar.buttons.unshift(sidebarButtonTemplate);
		ZHONGJYUAN.logger.debug(
			"api.[addStartMenuSidebarButton] data:${0};sidebarButton:${1}",
			JSON.stringify(data),
			JSON.stringify(sidebarButtonTemplate)
		);
	},

	/**
	 * 移除开始菜单侧边栏按钮
	 * @author zhongjyuan
	 * @date   2023年5月15日15:23:58
	 * @email  zhongjyuan@outlook.com
	 * @param {*} app 应用
	 */
	removeStartMenuSidebarButton: function(app) {
		ZHONGJYUAN.logger.trace("api.[removeStartMenuSidebarButton] app:${0}", JSON.stringify(app));
		var vue = ZHONGJYUAN.vue;

		for (var index = vue.startMenu.sidebar.buttons.length - 1; index >= 0; index--) {
			var button = vue.startMenu.sidebar.buttons[index];
			if (button.app === app) {
				vue.startMenu.sidebar.buttons.splice(index, 1);
			}
		}
		ZHONGJYUAN.logger.debug("api.[removeStartMenuSidebarButton] app:${0}", JSON.stringify(app));
	},

	/**
	 * 增加磁条分组
	 * @author zhongjyuan
	 * @date   2023年5月15日15:05:45
	 * @email  zhongjyuan@outlook.com
	 * @param {*} title 标题
	 */
	addTileGroup: function(title) {
		ZHONGJYUAN.logger.trace("api.[addTileGroup] title:${0}", title);
		var that = ZHONGJYUAN.api;
		var vue = ZHONGJYUAN.vue;

		title = title ? title : that.id();
		var tileGroup = { title: "分组" + title, data: [] };
		vue.tiles.push(tileGroup);

		ZHONGJYUAN.logger.debug("api.[addTileGroup] tileGroup:${0}", JSON.stringify(tileGroup));
		return vue.tiles.length - 1;
	},

	/**
	 * 增加磁条
	 * @author zhongjyuan
	 * @date   2023年5月15日15:07:12
	 * @email  zhongjyuan@outlook.com
	 * @param {*} data 数据
	 * @param {*} group 磁条组
	 */
	addTile: function(data, group) {
		ZHONGJYUAN.logger.trace("api.[addTile] data:${0};group:${1}", JSON.stringify(data), group);
		var that = ZHONGJYUAN.api;
		var vue = ZHONGJYUAN.vue;

		if (!group) group = 0;

		if (vue.tiles.length <= 0) {
			that.addTileGroup();
		}

		var tileTemplate = ZHONGJYUAN.static.template.tile;
		tileTemplate.id = that.id();

		if (typeof data === "string") {
			var app = vue.apps[data];
			if (!app) {
				ZHONGJYUAN.logger.warn("api.[addTile] app not exist! ${0}", app);
				return;
			}

			tileTemplate = ZHONGJYUAN.helper.json.merge(tileTemplate, {
				app: data,
				title: app.title,
			});
		} else {
			tileTemplate = ZHONGJYUAN.helper.json.merge(tileTemplate, data);
		}

		vue.tiles[group].data.push(tileTemplate);
		ZHONGJYUAN.logger.debug("api.[addTile] data:${0};group:${1};tile:${2}", JSON.stringify(data), group, JSON.stringify(tile));
	},

	/**
	 * 移除磁条
	 * @author zhongjyuan
	 * @date   2023年5月15日15:26:32
	 * @email  zhongjyuan@outlook.com
	 * @param {*} app 应用
	 */
	removeTile: function(app) {
		ZHONGJYUAN.logger.trace("api.[removeTile] app:${0}", JSON.stringify(app));
		var vue = ZHONGJYUAN.vue;

		vue.tiles.forEach(function(group) {
			for (var index = group.data.length - 1; index >= 0; index--) {
				var tile = group.data[index];
				if (tile.app === app) {
					group.data.splice(index, 1);
				}
			}
		});
		ZHONGJYUAN.logger.debug("api.[removeTile] app:${0}", JSON.stringify(app));
	},

	/**
	 * 应用处理对象
	 * @author zhongjyuan
	 * @date   2023年5月15日15:08:46
	 * @email  zhongjyuan@outlook.com
	 */
	app: {
		/**
		 * 根据WinID获取应用
		 * @param {*} winId
		 */
		getByWinId: function(winId) {
			ZHONGJYUAN.logger.trace("api.app.[getByWinId] winId:${0}", winId);
			var vue = ZHONGJYUAN.vue;

			var app = vue.wins[winId].app;
			if (typeof app === "string") {
				app = vue.apps[app];
			}

			ZHONGJYUAN.logger.debug("api.app.[getByWinId] winId:${0};app:${1}", winId, JSON.stringify(app));
			return app;
		},

		/**
		 * 是否存在
		 * @author zhongjyuan
		 * @date   2023年5月15日15:09:05
		 * @email  zhongjyuan@outlook.com
		 * @param {*} data 数据
		 */
		isExist: function(data) {
			ZHONGJYUAN.logger.trace("api.app.[isExist] data:${0}", JSON.stringify(data));
			var vue = ZHONGJYUAN.vue;

			var id = "";
			if (typeof data === "string") {
				id = data;
			} else {
				id = data.app;
			}
			var result = ZHONGJYUAN.helper.check.isNormal(vue.apps[id]);

			ZHONGJYUAN.logger.debug("api.app.[isExist] data:${0};result:${1}", JSON.stringify(data), result);
			return result;
		},

		/**
		 * 是否锁定应用
		 * @author zhongjyuan
		 * @date   2023年5月15日15:10:51
		 * @email  zhongjyuan@outlook.com
		 * @param {*} appId 应用唯一标识
		 * @returns
		 */
		isLocked: function(appId) {
			ZHONGJYUAN.logger.trace("api.app.[isLocked] appId:${0}", appId);

			var locks = ZHONGJYUAN.static.app.locked;
			var result = ZHONGJYUAN.helper.check.inArray(locks, appId);

			ZHONGJYUAN.logger.debug("api.app.[isLocked] appId:${0};result:${1}", appId, result);
			return result;
		},

		/**
		 * 是否信任应用
		 * @author zhongjyuan
		 * @date   2023年5月15日15:11:48
		 * @email  zhongjyuan@outlook.com
		 * @param {*} appId 应用唯一标识
		 * @returns
		 */
		isTrusted: function(appId) {
			ZHONGJYUAN.logger.trace("api.app.[isTrusted] appId:${0}", appId);

			var trusts = ZHONGJYUAN.static.app.trusted;
			var result = ZHONGJYUAN.helper.check.inArray(trusts, appId);

			ZHONGJYUAN.logger.debug("api.app.[isTrusted] appId:${0};result:${1}", appId, result);
			return result;
		},

		/**
		 * 安装应用
		 * @author zhongjyuan
		 * @date   2023年5月15日15:12:00
		 * @email  zhongjyuan@outlook.com
		 * @param {*} appId 应用唯一标识
		 * @param {*} data 应用数据
		 */
		install: function(appId, data) {
			ZHONGJYUAN.logger.trace("api.app.[install] appId:${0};data:${1}", appId, JSON.stringify(data));
			var that = ZHONGJYUAN.api;
			var vue = ZHONGJYUAN.vue;

			var appTemplate = ZHONGJYUAN.static.template.app;

			if (that.app.isLocked()) {
				that.message.simple(that.lang("AddAppFailed") + that.lang("AppLockedCanNotChange"));
				return false;
			}

			var app = ZHONGJYUAN.helper.json.merge(appTemplate, data);
			app.url = that.url.appendParamToken(app.url);

			vue.$set(vue.apps, appId, app);
			ZHONGJYUAN.logger.debug("api.app.[install] appId:${0};data:${1};app:${2}", appId, JSON.stringify(data), JSON.stringify(app));
			return true;
		},

		/**
		 * 卸载应用
		 * @author zhongjyuan
		 * @date   2023年5月15日15:30:38
		 * @email  zhongjyuan@outlook.com
		 * @param {*} app 应用
		 * @returns
		 */
		uninstall: function(app) {
			ZHONGJYUAN.logger.trace("api.app.[uninstall] app:${0}", JSON.stringify(app));
			var that = ZHONGJYUAN.api;
			var vue = ZHONGJYUAN.vue;

			if (that.app.isLocked()) {
				that.message.simple(that.lang("UninstallFailed") + that.lang("AppLockedCanNotChange"));
				return false;
			}

			// 删除桌面快捷图标
			that.removeShortcut(app);

			// 删除侧边栏菜单项
			that.removeStartMenu(app);

			// 删除侧边栏按钮
			that.removeStartMenuSidebarButton(app);

			// 删除磁贴
			that.removeTile(app);

			// 删除应用
			vue.$delete(vue.apps, app);

			ZHONGJYUAN.logger.debug("api.app.[uninstall] app:${0}", JSON.stringify(app));
			return true;
		},

		/**
		 * 打开应用
		 * @author zhongjyuan
		 * @date   2023年5月15日15:30:44
		 * @email  zhongjyuan@outlook.com
		 * @param {*} app 应用
		 * @param {*} options 可选配置
		 * @returns
		 */
		open: function(app, options) {
			ZHONGJYUAN.logger.trace("api.app.[open] app:${0};options:${1}", JSON.stringify(app), JSON.stringify(options));
			var vue = ZHONGJYUAN.vue;

			var appTemplate = ZHONGJYUAN.static.template.app;
			if (typeof app === "object") {
				app = ZHONGJYUAN.helper.json.merge(appTemplate, app);
			}

			ZHONGJYUAN.logger.debug("api.app.[open] app:${0};options:${1}", JSON.stringify(app), JSON.stringify(options));
			return vue.app_open(app, options);
		},

		/**
		 * 关闭应用
		 * @author zhongjyuan
		 * @date   2023年5月15日15:31:11
		 * @email  zhongjyuan@outlook.com
		 * @param {*} app 应用
		 * @param {*} options 可选配置
		 */
		close: function(app, options) {
			ZHONGJYUAN.logger.trace("api.app.[close] app:${0};options:${1}", JSON.stringify(app), JSON.stringify(options));
			var vue = ZHONGJYUAN.vue;

			ZHONGJYUAN.logger.debug("api.app.[close] app:${0};options:${1}", JSON.stringify(app), JSON.stringify(options));
			return vue.app_close(app, options);
		},

		/**
		 * 打开系统设置
		 * @author zhongjyuan
		 * @date   2023年5月23日15:31:51
		 * @email  zhongjyuan@outlook.com
		 */
		openSystem: function() {
			ZHONGJYUAN.logger.trace("api.app.[openSystem]");
			var that = ZHONGJYUAN.api;

			that.app.open("system");
		},

		/**
		 * 打开系统设置-壁纸设置
		 * @author zhongjyuan
		 * @date   2023年5月23日15:32:43
		 * @email  zhongjyuan@outlook.com
		 */
		openWallpaper: function() {
			ZHONGJYUAN.logger.trace("api.app.[openWallpaperManage]");
			var that = ZHONGJYUAN.api;

			that.app.open("system", {
				data: { nav: "wallpaper-manage" },
			});
		},

		/**
		 * 打开系统设置-取色器
		 */
		openColors: function() {
			ZHONGJYUAN.logger.trace("api.app.[openThemeColor]");
			var that = ZHONGJYUAN.api;

			that.app.open("system", {
				data: { nav: "theme-color" },
			});
		},

		/**
		 * 打开系统设置-关于我们
		 * @author zhongjyuan
		 * @date   2023年5月15日15:31:22
		 * @email  zhongjyuan@outlook.com
		 */
		openAboutUs: function() {
			ZHONGJYUAN.logger.trace("api.app.[openAboutUs]");
			var that = ZHONGJYUAN.api;

			that.app.open("system", {
				data: { nav: "about-us" },
			});
		},
	},

	/**
	 * 子窗口处理对象
	 * @author zhongjyuan
	 * @date   2023年5月15日15:33:45
	 * @email  zhongjyuan@outlook.com
	 */
	win: {
		/**
		 * 唯一标识
		 * @author zhongjyuan
		 * @date   2023年5月15日15:33:59
		 * @email  zhongjyuan@outlook.com
		 * @returns
		 */
		id: function() {
			ZHONGJYUAN.logger.trace("api.win.[id]");
			var that = ZHONGJYUAN.api;

			var result = that.id();

			ZHONGJYUAN.logger.debug("api.win.[id] result:${0}", result);
			return result;
		},

		/**
		 * 版本信息
		 * @author zhongjyuan
		 * @date   2023年5月15日15:34:07
		 * @email  zhongjyuan@outlook.com
		 * @returns
		 */
		version: function() {
			ZHONGJYUAN.logger.debug("api.win.[version]");
			var that = ZHONGJYUAN.api;

			var result = that.version();

			ZHONGJYUAN.logger.debug("api.win.[version] result:${0}", result);
			return result;
		},

		/**
		 * 应用版本信息
		 * @author zhongjyuan
		 * @date   2023年5月15日15:34:22
		 * @email  zhongjyuan@outlook.com
		 * @param {*} data 数据对象
		 * @param {*} winId 窗口唯一标识
		 * @returns
		 */
		appVersion: function(data, winId) {
			ZHONGJYUAN.logger.trace("api.win.[appVersion] data:${0};winId:${1}", JSON.stringify(data), winId);
			var that = ZHONGJYUAN.api;

			var app = data ? data : that.app.getByWinId(winId);
			var result = app ? app.version : null;

			ZHONGJYUAN.logger.debug("api.win.[appVersion] app:${0};winId:${1};result:${2}", JSON.stringify(app), winId, result);
			return result;
		},

		/**
		 * 发送消息
		 * @author zhongjyuan
		 * @date   2023年5月15日15:34:37
		 * @email  zhongjyuan@outlook.com
		 * @param {*} data 消息内容
		 */
		message: function(data) {
			ZHONGJYUAN.logger.trace("api.win.[message] data:${0}", JSON.stringify(data));
			var that = ZHONGJYUAN.api;

			that.message.win(data[0], data[1]);
			ZHONGJYUAN.logger.debug("api.win.[message] data:${0}", JSON.stringify(data));
		},

		/**
		 * 简单消息
		 * @author zhongjyuan
		 * @date   2023年5月15日15:34:45
		 * @email  zhongjyuan@outlook.com
		 * @param {*} content 消息正文
		 */
		simpleMessage: function(content) {
			ZHONGJYUAN.logger.trace("api.win.[simpleMessage] content:${0}", content);
			var that = ZHONGJYUAN.api;

			that.message.simple(content);
			ZHONGJYUAN.logger.debug("api.win.[simpleMessage] content:${0}", content);
		},

		/**
		 * 确认消息
		 * @author zhongjyuan
		 * @date   2023年6月5日15:32:56
		 * @email  zhongjyuan@outlook.com
		 * @param {*} content 消息正文
		 * @param {*} callback 回调函数
		 */
		confirmMessage: function(content, callback) {
			ZHONGJYUAN.logger.trace("api.win.[confirmMessage] content:${0};callback", content);
			var that = ZHONGJYUAN.api;

			that.message.confirm(content, callback);
			ZHONGJYUAN.logger.debug("api.win.[confirmMessage] content:${0};callback", content);
		},

		/**
		 * 打开应用
		 * @author zhongjyuan
		 * @date   2023年5月15日15:34:59
		 * @email  zhongjyuan@outlook.com
		 * @param {*} data 数据
		 */
		openApp: function(data) {
			ZHONGJYUAN.logger.trace("api.win.[openApp] data:${0}", JSON.stringify(data));
			var that = ZHONGJYUAN.api;

			ZHONGJYUAN.logger.debug("api.win.[openApp] data:${0}", JSON.stringify(data));
			return ZHONGJYUAN.helper.check.isArray(data) ? that.app.open(data[0], data[1]) : that.app.open(data);
		},

		/**
		 * 关闭应用
		 * @author zhongjyuan
		 * @date   2023年5月15日15:35:47
		 * @email  zhongjyuan@outlook.com
		 * @param {*} data 数据
		 */
		closeApp: function(data) {
			ZHONGJYUAN.logger.trace("api.win.[closeApp] data:${0}", JSON.stringify(data));
			var that = ZHONGJYUAN.api;

			that.app.close(data);
			ZHONGJYUAN.logger.debug("api.win.[closeApp] data:${0}", JSON.stringify(data));
		},

		/**
		 * 安装应用
		 * @author zhongjyuan
		 * @date   2023年5月15日15:36:23
		 * @email  zhongjyuan@outlook.com
		 * @param {*} data 应用数据
		 * @param {*} winId 窗口唯一标识
		 */
		installApp: function(data, winId) {
			ZHONGJYUAN.logger.trace("api.win.[installApp] data:${0};winId:${1}", JSON.stringify(data), winId);
			var that = ZHONGJYUAN.api;

			that.message.confirm(that.lang("ChildMethodSetupConfirm"), function() {
				var api = ZHONGJYUAN.api;
				var vue = ZHONGJYUAN.vue;
				var logger = ZHONGJYUAN.logger;

				//子页安装应用、图标、侧边栏、菜单、磁贴
				if (data.apps) {
					for (var appid in data.apps) {
						var app = data.apps[appid];
						api.app.install(appid, app);
					}
				}

				// 快捷图标
				if (data.shortcuts) {
					data.shortcuts.forEach(function(shortcut) {
						if (api.app.isExist(shortcut)) api.addShortcut(shortcut);
					});
				}

				// 侧边栏
				if (data.sidebar) {
					data.sidebar.forEach(function(button) {
						if (api.app.isExist(button)) api.addStartMenuSidebarButton(button);
					});
				}

				// 磁条
				if (data.tiles) {
					data.tiles.forEach(function(tile) {
						if (api.app.isExist(tile)) api.addTile(tile);
					});
				}

				// 菜单
				if (data.menu) {
					var hasError = false;

					var setMenuAttribute = function(item) {
						item.open = false;
						if (!item.hash) {
							item.hash = "";
						}

						if (!item.params) {
							item.params = {};
						}

						if (item.children) {
							for (var i in item.children) {
								var child = item.children[i];
								setMenuAttribute(child);
							}
						} else {
							if (!api.app.isExist(item)) {
								hasError = true;
								logger.warn("api.win.[installApp] menu not exist! ${0}", JSON.stringify(item));
							}
						}
					};

					if (!hasError) {
						for (var i in data.menu) {
							var menu = data.menu[i];
							setMenuAttribute(menu);
							vue.$set(vue.startMenu.menu, i, menu);
						}
					}
				}

				var win = vue.wins[winId];
				api.message.win(api.lang("ChildMethodSetupSuccessMsgTitle"), api.lang("ChildMethodSetupSuccessMsgContent") + win.url);
				logger.debug("api.win.[installApp] data:${0};winId:${1}'win:${2}", JSON.stringify(data), winId, JSON.stringify(win));
			});
		},

		/**
		 * 卸载应用
		 * @author zhongjyuan
		 * @date   2023年5月15日15:43:07
		 * @email  zhongjyuan@outlook.com
		 * @param {*} data 应用数据
		 * @param {*} winId 窗口唯一标识
		 */
		uninstallApp: function(data, winId) {
			ZHONGJYUAN.logger.trace("api.win.[uninstallApp] data:${0};winId:${1}", JSON.stringify(data), winId);
			var that = ZHONGJYUAN.api;

			that.message.confirm(that.lang("ChildMethodUninstallConfirm"), function() {
				var api = ZHONGJYUAN.api;
				var vue = ZHONGJYUAN.vue;
				var logger = ZHONGJYUAN.logger;

				var list = [];
				if (typeof data === "string") {
					list.push(data);
				} else {
					list = data;
				}

				list.forEach(function(app) {
					api.app.uninstall(app);
				});

				var win = vue.wins[winId];
				api.message.win(api.lang("ChildMethodUninstallSuccessMsgTitle"), api.lang("ChildMethodUninstallSuccessMsgContent") + win.url);
				logger.debug("api.win.[uninstallApp] data:${0};winId:${1};win:${2}", JSON.stringify(data), winId, JSON.stringify(win));
			});
		},

		/**
		 * 导入应用数据
		 * @author zhongjyuan
		 * @date   2023年5月15日15:52:09
		 * @email  zhongjyuan@outlook.com
		 * @param {*} data 数据
		 * @param {*} winId 窗口唯一标识
		 * @returns
		 */
		importApp: function(data, winId) {
			ZHONGJYUAN.logger.trace("api.win.[importApp] data:${0};winId:${1}", JSON.stringify(data), winId);
			var that = ZHONGJYUAN.api;
			var vue = ZHONGJYUAN.vue;

			if (!that.app.isTrusted(vue.wins[winId].app)) {
				ZHONGJYUAN.logger.warn("api.win.[importApp] app not trusted! ${0}", JSON.stringify(vue.wins[winId].app));
				return false;
			}

			that.import(data);

			ZHONGJYUAN.logger.debug("api.win.[importApp] data:${0};winId:${1}", JSON.stringify(data), winId);
			return true;
		},

		/**
		 * 导出应用数据
		 * @author zhongjyuan
		 * @date   2023年5月15日15:52:14
		 * @email  zhongjyuan@outlook.com
		 * @param {*} data 数据
		 * @param {*} winId 窗口唯一标识
		 * @returns
		 */
		exportApp: function(data, winId) {
			ZHONGJYUAN.logger.trace("api.win.[exportApp] data:${0};winId", JSON.stringify(data), winId);
			var that = ZHONGJYUAN.api;
			var vue = ZHONGJYUAN.vue;

			if (!that.app.isTrusted(vue.wins[winId].app)) {
				ZHONGJYUAN.logger.warn("api.win.[exportApp] app not trusted! ${0}", JSON.stringify(vue.wins[winId].app));
				return false;
			}

			ZHONGJYUAN.logger.debug("api.win.[exportApp] data:${0};winId:${1}", JSON.stringify(data), winId);
			return that.export();
		},

		/**
		 * 执行计算
		 * @author zhongjyuan
		 * @date   2023年5月15日15:52:20
		 * @email  zhongjyuan@outlook.com
		 * @param {*} data 数据
		 * @param {*} winId 窗口唯一标识
		 * @returns
		 */
		eval: function(data, winId) {
			ZHONGJYUAN.logger.trace("api.win.[eval] data:${0};winId:${1}", JSON.stringify(data), winId);
			var that = ZHONGJYUAN.api;
			var vue = ZHONGJYUAN.vue;

			if (!that.app.isTrusted(vue.wins[winId].app)) {
				ZHONGJYUAN.logger.warn("api.win.[eval] app not trusted! ${0}", JSON.stringify(vue.wins[winId].app));
				return false;
			}

			ZHONGJYUAN.logger.debug("api.win.[eval] data:${0};winId:${1}", JSON.stringify(data), winId);
			return eval(data);
		},

		/**
		 * 最小化
		 * @author zhongjyuan
		 * @date   2023年5月15日15:52:35
		 * @email  zhongjyuan@outlook.com
		 * @param {*} data 数据
		 * @param {*} winId 窗口唯一标识
		 */
		minimize: function(data, winId) {
			ZHONGJYUAN.logger.trace("api.win.[minimize] data:${0};winId:${1}", JSON.stringify(data), winId);
			var vue = ZHONGJYUAN.vue;

			ZHONGJYUAN.logger.debug("api.win.[minimize] data:${0};winId:${1}", JSON.stringify(data), winId);
			vue.win_minimize(data ? data : winId);
		},

		/**
		 * 最大化
		 * @author zhongjyuan
		 * @date   2023年5月15日15:52:45
		 * @email  zhongjyuan@outlook.com
		 * @param {*} data 数据
		 * @param {*} winId 窗口唯一标识
		 */
		maximize: function(data, winId) {
			ZHONGJYUAN.logger.trace("api.win.[maximize] data:${0};winId:${1}", JSON.stringify(data), winId);
			var vue = ZHONGJYUAN.vue;

			ZHONGJYUAN.logger.debug("api.win.[maximize] data:${0};winId:${1}", JSON.stringify(data), winId);
			vue.win_maximize(data ? data : winId);
		},

		/**
		 * 隐藏
		 * @author zhongjyuan
		 * @date   2023年5月15日15:53:06
		 * @email  zhongjyuan@outlook.com
		 * @param {*} data 数据
		 * @param {*} winId 窗口唯一标识
		 */
		hide: function(data, winId) {
			ZHONGJYUAN.logger.trace("api.win.[hide] data:${0};winId:${1}", JSON.stringify(data), winId);
			var vue = ZHONGJYUAN.vue;

			ZHONGJYUAN.logger.debug("api.win.[hide] data:${0};winId:${1}", JSON.stringify(data), winId);
			vue.win_hide(data ? data : winId);
		},

		/**
		 * 显示
		 * @author zhongjyuan
		 * @date   2023年5月15日15:53:11
		 * @email  zhongjyuan@outlook.com
		 * @param {*} data 数据
		 * @param {*} winId 窗口唯一标识
		 */
		show: function(data, winId) {
			ZHONGJYUAN.logger.trace("api.win.[show] data:${0};winId:${1}", JSON.stringify(data), winId);
			var vue = ZHONGJYUAN.vue;

			ZHONGJYUAN.logger.debug("api.win.[show] data:${0};winId:${1}", JSON.stringify(data), winId);
			vue.win_show(data ? data : winId);
			vue.win_set_active(data ? data : winId);
		},

		/**
		 * 复原
		 * @author zhongjyuan
		 * @date   2023年5月15日15:53:24
		 * @email  zhongjyuan@outlook.com
		 * @param {*} data 数据
		 * @param {*} winId 窗口唯一标识
		 */
		restore: function(data, winId) {
			ZHONGJYUAN.logger.trace("api.win.[restore] data:${0};winId:${1}", JSON.stringify(data), winId);
			var vue = ZHONGJYUAN.vue;

			ZHONGJYUAN.logger.debug("api.win.[restore] data:${0};winId:${1}", JSON.stringify(data), winId);
			vue.win_restore(data ? data : winId);
		},

		/**
		 * 刷新
		 * @author zhongjyuan
		 * @date   2023年5月15日15:53:50
		 * @email  zhongjyuan@outlook.com
		 * @param {*} data 数据
		 * @param {*} winId 窗口唯一标识
		 */
		refresh: function(data, winId) {
			ZHONGJYUAN.logger.trace("api.win.[refresh] data:${0};winId:${1}", JSON.stringify(data), winId);
			var vue = ZHONGJYUAN.vue;

			ZHONGJYUAN.logger.debug("api.win.[refresh] data:${0};winId:${1}", JSON.stringify(data), winId);
			vue.win_refresh(data ? data : winId);
		},

		/**
		 * 设置窗口属性
		 * @author zhongjyuan
		 * @date   2023年5月15日15:53:57
		 * @email  zhongjyuan@outlook.com
		 * @param {*} data 数据
		 * @param {*} winId 窗口唯一标识
		 */
		setWinAttribute: function(data, winId) {
			ZHONGJYUAN.logger.trace("api.win.[setWinAttribute] data:${0};winId:${1}", JSON.stringify(data), winId);
			var vue = ZHONGJYUAN.vue;

			if (!vue.wins[winId]) {
				ZHONGJYUAN.logger.warn("api.win.[setWinAttribute] win not exist! ${0}", winId);
				return;
			}

			for (var key in data) {
				vue.$set(vue.wins[winId], key, data[key]);
			}

			ZHONGJYUAN.logger.debug("api.win.[setWinAttribute] winId:${0};data:${1}", winId, JSON.stringify(data));
		},

		/**
		 * 设置数字标识
		 * @author zhongjyuan
		 * @date   2023年5月15日15:54:36
		 * @email  zhongjyuan@outlook.com
		 * @param {*} data 数据对象
		 * @param {*} winId 窗口唯一标识
		 */
		setAppBadge: function(data, winId) {
			ZHONGJYUAN.logger.trace("api.win.[setAppBadge] data:${0};winId:${1}", JSON.stringify(data), winId);
			var that = ZHONGJYUAN.api;
			var vue = ZHONGJYUAN.vue;

			var app = ZHONGJYUAN.helper.check.isArray(data) ? vue.apps[data[0]] : that.app.getByWinId(winId);

			if (!app) {
				ZHONGJYUAN.logger.warn("api.win.[setAppBadge] app not exist! data:${0};winId:${1}", JSON.stringify(data), winId);
				return false;
			}

			app.badge = ZHONGJYUAN.helper.check.isArray(data) ? vue.apps[data[1]] : data;

			ZHONGJYUAN.logger.debug("api.win.[setAppBadge] data:${0};winId:${1};app:${2}", JSON.stringify(data), winId, JSON.stringify(app));
			return true;
		},

		/**
		 * 设置背景
		 * @author zhongjyuan
		 * @date   2023年5月15日15:56:41
		 * @email  zhongjyuan@outlook.com
		 * @param {*} url URL地址
		 */
		setWallpaper: function(url) {
			ZHONGJYUAN.logger.trace("api.win.[setWallpaper] url:${0}", url);
			var that = ZHONGJYUAN.api;

			return that.setWallpaper(url);
		},

		/**
		 * 设置主题色
		 * @author zhongjyuan
		 * @date   2023年5月15日15:56:49
		 * @email  zhongjyuan@outlook.com
		 * @param {*} color 颜色
		 * @returns
		 */
		setThemeColor: function(color) {
			ZHONGJYUAN.logger.trace("api.win.[setThemeColor] color:${0}", color);
			var that = ZHONGJYUAN.api;

			return that.setThemeColor(color);
		},

		/**
		 * 设置地址栏地址
		 * @author zhongjyuan
		 * @date   2023年5月15日15:57:04
		 * @email  zhongjyuan@outlook.com
		 * @param {*} url URL地址
		 * @param {*} winId 窗口唯一标识
		 */
		setUrlBar: function(url, winId) {
			ZHONGJYUAN.logger.trace("api.win.[setUrlBar] url:${0};winId:${1}", url, winId);
			var vue = ZHONGJYUAN.vue;

			var win = vue.wins[winId];
			if (!win) {
				ZHONGJYUAN.logger.warn("api.win.[setUrlBar] win not exist! ${0}", winId);
				return;
			}

			win.urlBar = url;

			var history = win.history;
			var posMax = history.urls.length - 1;

			// 判断当前位置是否在历史记录的末尾
			if (posMax === history.pos) {
				// 判断新的 URL 是否和当前 URL 相同
				if (history.urls[posMax] !== url) {
					history.urls.push(url);
					history.pos++;
				}
			} else {
				var posNext = history.pos + 1;
				var posPre = history.pos - 1;
				var posNow = history.pos;
				var urlNext = history.urls[posNext];
				var urlPre = history.urls[posPre];
				var urlNow = history.urls[posNow];
				if (urlNext !== url && urlPre !== url && urlNow !== url) {
					history.urls.splice(posNext, 999);
					history.urls.push(url);
					history.pos++;
				}
			}
			ZHONGJYUAN.logger.debug("api.win.[setUrlBar] url:${0};winId:${1}", url, winId);
		},

		/**
		 * 后退地址栏
		 * @author zhongjyuan
		 * @date   2023年5月15日15:57:29
		 * @email  zhongjyuan@outlook.com
		 * @param {*} data 数据
		 * @param {*} winId 窗口唯一标识
		 */
		backUrlBar: function(data, winId) {
			ZHONGJYUAN.logger.trace("api.win.[backUrlBar] data:${0};winId:${1}", JSON.stringify(data), winId);
			var that = ZHONGJYUAN.api;
			var vue = ZHONGJYUAN.vue;

			winId = data || winId;
			var win = vue.wins[winId];
			if (!win) {
				ZHONGJYUAN.logger.warn("api.win.[backUrlBar] win not exist! ${0}", winId);
				return;
			}

			var history = win.history;
			if (that.child.backUrlBarAvailable(winId)) {
				win.url = win.urlBar = history.urls[--history.pos];
			}
			ZHONGJYUAN.logger.debug("api.win.[backUrlBar] data:${0};winId:${1}", JSON.stringify(data), winId);
		},

		/**
		 * 后退地址栏是否可行
		 * @author zhongjyuan
		 * @date   2023年5月15日15:57:38
		 * @email  zhongjyuan@outlook.com
		 * @param {*} data 数据
		 * @param {*} winId 窗口唯一标识
		 * @returns
		 */
		backUrlBarAvailable: function(data, winId) {
			ZHONGJYUAN.logger.trace("api.win.[backUrlBarAvailable] data:${0};winId:${1}", JSON.stringify(data), winId);
			var vue = ZHONGJYUAN.vue;

			winId = data || winId;
			var win = vue.wins[winId];
			if (!win) {
				ZHONGJYUAN.logger.warn("api.win.[backUrlBarAvailable] win not exist! ${0}", winId);
				return false;
			}

			var history = win.history;
			var result = history.pos > 0 && history.urls[history.pos - 1];

			ZHONGJYUAN.logger.debug("api.win.[backUrlBarAvailable] data:${0};winId:${1};result:${2}", JSON.stringify(data), winId, result);
			return result;
		},

		/**
		 * 前进地址栏
		 * @author zhongjyuan
		 * @date   2023年5月15日15:58:32
		 * @email  zhongjyuan@outlook.com
		 * @param {*} data 数据
		 * @param {*} winId 窗口唯一标识
		 */
		forwardUrlBar: function(data, winId) {
			ZHONGJYUAN.logger.trace("api.win.[forwardUrlBar] data:${0};winId:${1}", JSON.stringify(data), winId);
			var that = ZHONGJYUAN.api;
			var vue = ZHONGJYUAN.vue;

			winId = data || winId;
			var win = vue.wins[winId];
			if (!win) {
				ZHONGJYUAN.logger.warn("api.win.[forwardUrlBar] win not exist! ${0}", winId);
				return;
			}

			var history = win.history;
			if (that.child.forwardUrlBarAvailable(winId)) {
				win.url = win.urlBar = history.urls[++history.pos];
			}
			ZHONGJYUAN.logger.debug("api.win.[forwardUrlBar] data:${0};winId:${1}", JSON.stringify(data), winId);
		},

		/**
		 * 前进地址栏是否可行
		 * @author zhongjyuan
		 * @date   2023年5月15日15:58:37
		 * @email  zhongjyuan@outlook.com
		 * @param {*} data 数据
		 * @param {*} winId 窗口唯一标识
		 * @returns
		 */
		forwardUrlBarAvailable: function(data, winId) {
			ZHONGJYUAN.logger.trace("api.win.[forwardUrlBarAvailable] data:${0};winId:${1}", JSON.stringify(data), winId);
			var vue = ZHONGJYUAN.vue;

			winId = data || winId;
			var win = vue.wins[winId];
			if (!win) {
				ZHONGJYUAN.logger.warn("api.win.[forwardUrlBarAvailable] win not exist! ${0}", winId);
				return;
			}

			var history = win.history;
			var posMax = history.urls.length - 1;
			var result = history.pos < posMax && history.urls[history.pos + 1];

			ZHONGJYUAN.logger.debug("api.win.[forwardUrlBarAvailable] data:${0};winId:${1};result:${2}", JSON.stringify(data), winId, result);
			return result;
		},

		/**
		 * 获取运行时数据
		 * @author zhongjyuan
		 * @date   2023年5月15日15:58:52
		 * @email  zhongjyuan@outlook.com
		 * @returns
		 */
		runtimeData: function() {
			ZHONGJYUAN.logger.trace("api.win.[runtimeData]");
			var vue = ZHONGJYUAN.vue;

			return vue.runtime;
		},

		/**
		 * 获取配置数据
		 * @author zhongjyuan
		 * @date   2023年5月15日15:58:58
		 * @email  zhongjyuan@outlook.com
		 * @returns
		 */
		configData: function() {
			ZHONGJYUAN.logger.trace("api.win.[configData]");
			var vue = ZHONGJYUAN.vue;

			return vue.configs;
		},

		/**
		 * 获取Win数据
		 * @author zhongjyuan
		 * @date   2023年5月15日15:59:07
		 * @email  zhongjyuan@outlook.com
		 * @param {*} winId 窗口唯一标识
		 */
		winData: function(data, winId) {
			ZHONGJYUAN.logger.trace("api.win.[winData] winId:${0}", winId);
			var vue = ZHONGJYUAN.vue;

			var win = vue.wins[winId];
			if (!win) {
				ZHONGJYUAN.logger.warn("api.win.[winData] win not exist! ${0}", winId);
				return null;
			}

			return ZHONGJYUAN.helper.json.deepCopy(win);
		},
	},

	/**
	 * URL处理对象
	 * @author zhongjyuan
	 * @date   2023年5月15日14:55:31
	 * @email  zhongjyuan@outlook.com
	 */
	url: {
		/**
		 * URL地址增加参数与哈希值
		 * @author zhongjyuan
		 * @date   2023年5月15日14:55:38
		 * @email  zhongjyuan@outlook.com
		 * @param {*} url URL地址
		 * @param {*} name 参数名
		 * @param {*} value 参数值
		 * @param {*} hash 哈希值
		 * @returns
		 */
		appendParam: function(url, name, value, hash) {
			ZHONGJYUAN.logger.trace("api.url.[appendParam] url:${0};name:${1};value:${2};hash:${3}", url, name, value, hash);
			var that = ZHONGJYUAN.api;

			if (!name || !value) {
				ZHONGJYUAN.logger.wran("api.url.[appendParam] name or value is empty! ${0}", url);
				return;
			}

			var params = {};
			params[name] = value;
			var result = that.url.appendParams(url, params, hash);

			ZHONGJYUAN.logger.debug("api.url.[appendParam] url:${0};name:${1};value:${2};hash:${3};result:${4}", url, name, value, hash, result);
			return result;
		},

		/**
		 * URL地址增加令牌参数和哈希值
		 * @author zhongjyuan
		 * @date   2023年5月15日14:55:44
		 * @email  zhongjyuan@outlook.com
		 * @param {*} url URL地址
		 * @param {*} name 令牌名[为空时,取 ZHONGJYUAN.static.token.name]
		 * @param {*} value 令牌值[为空时,随机生成]
		 * @param {*} hash 哈希值
		 */
		appendParamToken: function(url, name, value, hash) {
			ZHONGJYUAN.logger.trace("api.url.[appendParamToken] url:${0};name:${1};value:${2};hash:${3}", url, name, value, hash);
			var that = ZHONGJYUAN.api;

			var result = that.url.appendParams(url, that.tokenObject(name, value), hash);

			ZHONGJYUAN.logger.debug("api.url.[appendParamToken] url:${0};name:${1};value:${2};hash:${3};result:${4}", url, name, value, hash, result);
			return result;
		},

		/**
		 * URL地址增加参数与哈希值
		 * @author zhongjyuan
		 * @date   2023年5月15日14:56:02
		 * @email  zhongjyuan@outlook.com
		 * @param {*} url URL地址
		 * @param {*} params 参数对象
		 * @param {*} hash 哈希值
		 * @returns
		 */
		appendParams: function(url, params, hash) {
			ZHONGJYUAN.logger.trace("api.url.[appendParams] url:${0};params:${1};hash:${2}", url, JSON.stringify(params), hash);

			var object = ZHONGJYUAN.helper.url.parseObject(url);

			if (params) {
				object.params = ZHONGJYUAN.helper.json.merge(object.params, params);
			}

			if (hash) {
				object.hash = hash;
			}

			var paramCount = 0;
			var paramString = "?";
			for (var param in object.params) {
				paramCount++;
				paramString += param + "=" + object.params[param] + "&";
			}

			if (!paramCount) {
				paramString = "";
			}

			var result =
				object.protocol +
				"://" +
				object.host +
				(object.port === 80 || !object.port ? "" : ":" + object.port) +
				object.path +
				paramString +
				(object.hash ? "#" + object.hash : "");

			ZHONGJYUAN.logger.debug(
				"api.url.[appendParams] url:${0};params:${1};hash:${2};result:${3}",
				url,
				JSON.stringify(params),
				hash,
				JSON.stringify(result)
			);
			return result;
		},

		/**
		 * URL地址移除参数
		 * @author zhongjyuan
		 * @date   2023年5月15日14:56:30
		 * @email  zhongjyuan@outlook.com
		 * @param {*} url URL地址
		 * @param {*} name 参数名
		 * @returns
		 */
		removeParam: function(url, name) {
			ZHONGJYUAN.logger.trace("api.url.[removeParam] url:${0};name:${1}", url, name);

			if (!name) {
				ZHONGJYUAN.logger.warn("api.url.[removeParam] name is empty! ${0}", url);
				return;
			}

			var object = ZHONGJYUAN.helper.url.parseObject(url);

			var paramCount = 0;
			var paramString = "?";
			for (var param in object.params) {
				if (param !== name) {
					paramCount++;
					paramString += param + "=" + object.params[i] + "&";
				}
			}

			if (!paramCount) {
				paramString = "";
			}

			var result =
				object.protocol +
				"://" +
				object.host +
				(object.port === 80 ? "" : ":" + object.port) +
				object.path +
				paramString +
				(object.hash ? "#" + object.hash : "");

			ZHONGJYUAN.logger.debug("api.url.[removeParam] url:${0};name:${1};result:${2}", url, name, JSON.stringify(result));
			return result;
		},

		/**
		 * URL地址移除令牌参数
		 * @author zhongjyuan
		 * @date   2023年5月15日14:56:41
		 * @email  zhongjyuan@outlook.com
		 * @param {*} url URL 字符串
		 * @param {*} name 令牌名[为空时,取 ZHONGJYUAN.static.token.name]
		 * @returns
		 */
		removeParamToken: function(url, name) {
			ZHONGJYUAN.logger.trace("api.url.[removeParamToken] url:${0};name:${1}", url, name);
			var that = ZHONGJYUAN.api;
			var token = ZHONGJYUAN.static.token;

			name || (name = token.name);
			that.url.removeParam(url, name);
		},
	},

	/**
	 * 事件处理对象
	 * @author zhongjyuan
	 * @date   2023年5月15日14:54:26
	 * @email  zhongjyuan@outlook.com
	 */
	event: {
		/**
		 * 窗口发生变化时触发
		 * @author zhongjyuan
		 * @date   2023年5月15日14:54:35
		 * @email  zhongjyuan@outlook.com
		 */
		resize: function() {
			if (typeof window.CustomEvent === "function") {
				window.dispatchEvent(
					new CustomEvent(ZHONGJYUAN.static.message.resizeEvent, {
						bubbles: true,
						cancelable: true,
					})
				);
			} else {
				var event = document.createEvent("Event");
				event.initEvent(ZHONGJYUAN.static.message.resizeEvent, true, true);
				window.dispatchEvent(event);
			}
		},
	},

	/**
	 * Iframe处理对象
	 * @author zhongjyuan
	 * @date   2023年5月15日15:32:30
	 * @email  zhongjyuan@outlook.com
	 */
	iframe: {
		_click_lock_children: {},
		/**
		 * 点击处理对象
		 * @author zhongjyuan
		 * @date   2023年5月15日15:32:36
		 * @email  zhongjyuan@outlook.com
		 */
		onClick: {
			/**存储需要跟踪的 iframe 元素列表 */
			iframes: [],

			/**存储定时器句柄，用于定期检测 */
			interval: null,

			/**定义了每隔多少毫秒检测一次元素是否被点击 */
			resolution: 200,

			/**
			 * 构造函数，创建一个新的 iframe 对象，包含该 iframe 元素本身、处理元素点击的回调函数、和该 iframe 的 ID；
			 */
			Iframe: function() {
				this.element = arguments[0];
				this.callback = arguments[1];
				this.id = arguments[2];
				this.hasTracked = false;
			},

			/**
			 * 添加需要跟踪的 iframe 元素到 iframes 数组中，并开启定期检测的定时器。如果未有其他元素加入，则创建一个新的定时器
			 * @author zhongjyuan
			 * @date   2023年5月15日15:32:59
			 * @email  zhongjyuan@outlook.com
			 * @param {*} element iframe元素对象
			 * @param {*} callback 回调函数
			 * @param {*} id iframe唯一标识
			 */
			track: function(element, callback, id) {
				ZHONGJYUAN.logger.trace("api.iframe.onClick.[track] element:${0};callback;id:${1}", JSON.stringify(element), id);
				this.iframes.push(new this.Iframe(element, callback, id));
				if (!this.interval) {
					var _this = this;
					this.interval = setInterval(function() {
						_this.checkClick();
					}, this.resolution);
				}
			},

			/**
			 * 当发生点击事件时，查看该事件的目标元素与所有已跟踪的 iframe 是否匹配，如果发现匹配的目标元素，且之前该 iframe 没有被跟踪过，则执行该 iframe 需要执行的回调函数；否则，重置该 iframe 已经被跟踪的状态标记
			 * @author zhongjyuan
			 * @date   2023年5月15日15:33:07
			 * @email  zhongjyuan@outlook.com
			 */
			checkClick: function() {
				// ZHONGJYUAN.logger.trace("api.iframe.onClick.[checkClick]");
				if (document.activeElement) {
					var activeElement = document.activeElement;
					for (var index in this.iframes) {
						var iframeId = this.iframes[index].id;
						if (!document.getElementById(iframeId)) {
							delete this.iframes[index];
							continue;
						}

						if (activeElement === this.iframes[index].element) {
							if (this.iframes[index].hasTracked === false) {
								this.iframes[index].callback.apply(window, []);
								this.iframes[index].hasTracked = true;
							}
						} else {
							this.iframes[index].hasTracked = false;
						}
					}
				}
			},
		},
	},

	/**
	 * 消息处理对象
	 * @author zhongjyuan
	 * @date   2023年5月15日14:57:09
	 * @email  zhongjyuan@outlook.com
	 */
	message: {
		/**
		 * 简单消息
		 * @author zhongjyuan
		 * @date   2023年5月15日14:57:16
		 * @email  zhongjyuan@outlook.com
		 * @param {*} content 消息正文
		 */
		simple: function(content) {
			ZHONGJYUAN.logger.trace("api.message.[simple] content:${0}", content);
			!layer || layer.msg(content, { zIndex: 19930012 });
		},

		/**
		 * 确认消息
		 * @author zhongjyuan
		 * @date   2023年5月15日14:57:30
		 * @email  zhongjyuan@outlook.com
		 * @param {*} content 消息正文
		 * @param {*} callback 回调函数
		 */
		confirm: function(content, callback) {
			ZHONGJYUAN.logger.trace("api.message.[confirm] content:${0};callback", content);
			var layerConfirm = layer.confirm(
				content,
				{
					skin: "zhongjyuan",
					zIndex: 19930010,
				},
				function() {
					layer.close(layerConfirm);
					callback();
				}
			);
		},

		/**
		 * 窗口消息
		 * @author zhongjyuan
		 * @date   2023年5月15日14:57:37
		 * @email  zhongjyuan@outlook.com
		 * @param {*} title 标题
		 * @param {*} content 正文
		 */
		win: function(title, content) {
			ZHONGJYUAN.logger.trace("api.message.[win] title:${0};content:${1}", title, content);
			var vue = ZHONGJYUAN.vue;

			var messageIdPrefix = ZHONGJYUAN.static.id.messagePrefix;
			var messagePreviewIdPrefix = ZHONGJYUAN.static.id.messagePreviewPrefix;
			var messagePreviewTimeout = ZHONGJYUAN.static.timeout.messagePreview;

			var options = {
				title: title,
				content: content,
				key: Math.random(),
			};

			// 将消息添加到中心 message 中
			var runtimeId = vue.win_set_id(vue.center.message, options, messageIdPrefix);

			// 更新消息数量并增加未读数
			vue.center.messageCount++;
			if (!vue.center.open) {
				vue.center.unreadCount++;
			}

			// 计算在 messagePreviews 中空缺的 index 值
			var indexs = {};
			for (var messagePreview in vue.messagePreviews) {
				var message = vue.messagePreviews[messagePreview];
				if (message) {
					var index = message.index;
					indexs[index] = true;
				}
			}

			var newIndex;
			for (newIndex = 0; newIndex < 99; newIndex++) {
				if (!indexs[newIndex]) {
					break;
				}
			}

			// 将消息添加到 messagePreviews 中
			var messagePreviewId = vue.win_set_id(
				vue.messagePreviews,
				ZHONGJYUAN.helper.json.merge(options, {
					index: newIndex,
				}),
				messagePreviewIdPrefix
			);

			// 设置定时器，5 秒后将消息从 messagePreviews 中清除
			setTimeout(function() {
				vue.messagePreviews[messagePreviewId] = null;
			}, messagePreviewTimeout);

			ZHONGJYUAN.logger.debug(
				"api.message.[win] title:${0};content:${1};runtimeId:${2};messagePreviewId:${3}",
				title,
				content,
				runtimeId,
				messagePreviewId
			);
		},
	},

	/**
	 * 格式化数据
	 * @author zhongjyuan
	 * @date   2023年5月15日15:48:30
	 * @email  zhongjyuan@outlook.com
	 * @param {*} json
	 */
	format: function(json) {
		ZHONGJYUAN.logger.trace("api.[format] json:${0}", JSON.stringify(json));

		var basicTemplate = ZHONGJYUAN.static.template.basic;
		var appTemplate = ZHONGJYUAN.static.template.app;

		var data = ZHONGJYUAN.helper.json.merge(basicTemplate, json, true);

		// 格式化应用数据
		for (var app in data.apps) {
			var app = ZHONGJYUAN.helper.json.merge(appTemplate, data.apps[i], true);
			data.apps[i] = app;
		}

		// 格式化桌面快捷图标数据
		data.shortcuts.forEach(function(shortcut) {
			shortcut.drag = { mouseDown: false, left: 0, top: 0 };
			if (shortcut.children) {
				shortcut.children.forEach(function(item) {
					item.drag = { mouseDown: false, left: 0, top: 0 };
				});
			}
		});

		/**
		 * 设置菜单属性
		 * @param {*} menu 菜单对象
		 */
		var setMenuAttribute = function(menu) {
			menu.open = false;
			if (menu.children) {
				for (var index in menu.children) {
					var childMenu = menu.children[index];
					setMenuAttribute(childMenu);
				}
			}
		};

		data.startMenu.open = false;
		data.startMenu.sidebar = {
			buttons: data.startMenu.sidebar,
		};
		data.startMenu.sidebar.open = false;

		for (var i in data.startMenu.menu) {
			var item = data.startMenu.menu[i];
			setMenuAttribute(item);
		}

		ZHONGJYUAN.logger.debug("api.[format] json:${0};data:${1}", JSON.stringify(json), JSON.stringify(data));
		return data;
	},

	/**
	 * 导入数据
	 * @author zhongjyuan
	 * @date   2023年5月15日15:48:42
	 * @email  zhongjyuan@outlook.com
	 * @param {*} json json数据
	 */
	import: function(json) {
		ZHONGJYUAN.logger.trace("api.[import] json:${0}", JSON.stringify(json));
		var that = ZHONGJYUAN.api;
		var vue = ZHONGJYUAN.vue;

		that.reset();

		var data = that.format(json);
		vue.$set(vue, "apps", data.apps);
		for (var i in data) {
			if (i !== "apps") {
				vue.$set(vue, i, data[i]);
			}
		}

		ZHONGJYUAN.logger.debug("api.[import] json:${0};data:${1}", JSON.stringify(json), JSON.stringify(data));
		vue.runtime_initialize();
	},

	/**
	 * 导出数据
	 * @author zhongjyuan
	 * @date   2023年5月15日15:49:52
	 * @email  zhongjyuan@outlook.com
	 * @returns
	 */
	export: function() {
		// ZHONGJYUAN.logger.trace("api.[export]");
		var that = ZHONGJYUAN.api;

		var result = {};

		result.apps = that.vueData("apps");
		result.configs = that.vueData("configs");

		var shortcuts = that.vueData("shortcuts");
		shortcuts.forEach(function(shortcut) {
			delete shortcut.drag;
			if (shortcut.children) {
				shortcut.children.forEach(function(t) {
					delete t.drag;
				});
			}
		});
		result.shortcuts = shortcuts;

		var tiles = that.vueData("tiles");
		tiles.forEach(function(tileGroup) {
			tileGroup.data.forEach(function(t) {
				delete t.moved;
			});
		});
		result.tiles = tiles;

		var removeMenuAttribute = function(item) {
			delete item.open;
			if (item.children) {
				for (var i in item.children) {
					var child = item.children[i];
					removeMenuAttribute(child);
				}
			}
		};

		var startMenu = that.vueData("startMenu");
		delete startMenu.open;
		delete startMenu.sidebar.open;
		startMenu.sidebar = startMenu.sidebar.buttons;
		for (var i in startMenu.menu) {
			var item = startMenu.menu[i];
			removeMenuAttribute(item);
		}
		result.startMenu = startMenu;

		// ZHONGJYUAN.logger.debug("api.[export] result:${0}", JSON.stringify(result));
		return result;
	},

	/**
	 * Vue实例中获取数据
	 * @author zhongjyuan
	 * @date   2023年6月5日15:59:04
	 * @email  zhongjyuan@outlook.com
	 * @param {*} name 属性名称
	 * @returns
	 */
	vueData: function(name) {
		// ZHONGJYUAN.logger.trace("api.[vueData] name:${0}", name);
		var vue = ZHONGJYUAN.vue;

		var data = name ? vue.$data[name] : vue.$data;
		var result = ZHONGJYUAN.helper.json.deepCopy(data);

		// ZHONGJYUAN.logger.trace("api.[vueData] name:${0};result:${1}", name, JSON.stringify(result));
		return result;
	},
};
