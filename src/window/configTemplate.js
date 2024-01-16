/**window 配置模版 */
export default {
	/**抽屉 */
	drawer: null,
	/**快捷设置 */
	shortSetting: null,
	/**配置中心 */
	configs: {
		/**声音 */
		sound: false,
		/**窗体打开上限 */
		openMax: 9,
		/**唯一标识记录器 */
		idCounter: 0,
		/**任务栏置顶 */
		topTaskBar: true,
		/**主题色 */
		themeColor: "black",
		/**自动主题色 */
		autoThemeColor: true,
		/**壁纸 */
		wallpaper: "",
		/**壁纸模糊遮罩 */
		wallpaperBlur: false,
		/**壁纸轮播 */
		wallpaperSlide: false,
		/**壁纸随机轮播 */
		wallpaperSlideRandom: false,
		/**壁纸轮播间隔 */
		wallpaperSlideInterval: 0.1,
		/**壁纸上次轮播时间 */
		wallpaperSlideTime: Date.now(),
		/**壁纸轮播下标 */
		wallpaperSlideIndex: 0,
		/**壁纸集合 */
		wallpapers: [],
	},
	/**运行时对象 */
	runtime: {
		/**是否处于IE浏览器 */
		isIE: false,
		/**是否处于拖拽状态 */
		drag: false,
		/**是否处于准备状态 */
		ready: false,
		/**语言 */
		lang: "zh-cn",
		/**时间 */
		time: "",
		/**是否处于小屏状态 */
		isSmallScreen: false,
		/**是否处于横屏状态 */
		isHorizontalScreen: true,
		/**活动窗体 */
		winActive: "",
		/**活动窗体时间 */
		winActiveTime: Date.now(),
		/**打开窗体数 */
		winOpened: 0,
		/**打开窗体计数 */
		winOpenCounter: 0,
		/**是否显示快捷方式 */
		shortcutsShow: true,
		/**是否打开日历盒子 */
		calendarOpen: false,
		/**是否打开插件图标盒子 */
		pluginIconsOpen: false,
		/**磁条数量 */
		tileSize: 0,
		/**磁条宽度 */
		tileWidth: 0,
		/**磁条分组数 */
		tileGroupNum: 1,
		/**磁条处于移动状态 */
		tileMoved: false,
		/**自定义磁条令牌 */
		customTileToken: "",
		/**壁纸 */
		wallpaper: "",
		/**壁纸比例 */
		wallpaperScale: 1,
		/**快捷方式宽度 */
		shortcutWidth: 0,
		/**快捷方式高度 */
		shortcutHeight: 0,
		/**快捷方式结束 */
		shortcutOver: null,
		/**快捷方式插入 */
		shortcutInsert: null,
		/**快捷方式新参数名 */
		shortcutNewParamName: "",
		/**快捷方式新参数值 */
		shortcutNewParamValue: "",
		/**快捷方式打开时间 */
		shortcutOpenedAt: Date.now(),
		/**菜单靠左 */
		menuOnLeft: true,
		/**菜单项剪切 */
		menuItemCut: null,
		/**数据对象 */
		data: {},
		/**浏览器屏幕尺寸 */
		screenSize: {
			/**宽度 */
			width: 0,
			/**高度 */
			height: 0,
		},
		/**系统桌面尺寸 */
		desktopSize: {
			/**宽度 */
			width: 0,
			/**高度 */
			height: 0,
		},
		/**开始菜单 */
		startMenu: {
			/**宽度 */
			width: 0,
			/**高度 */
			height: 0,
			/**拖拽对象 */
			drag: {
				/**X轴定位 */
				x: 0,
				/**Y轴定位 */
				y: 0,
				/**鼠标是否处于按下状态 */
				mouseDown: false,
			},
		},
		/**快捷方式网格定位 */
		shortcutsGrid: {
			/**X轴定位 */
			x: 0,
			/**Y轴定位 */
			y: 0,
		},
	},
	/**应用中心 */
	apps: {},
	/**窗体中心 */
	wins: {},
	/**磁条集合 */
	tiles: [],
	/**应用商城集合 */
	appStore: [],
	/**快捷方式集合 */
	shortcuts: [],
	/**操作中心 */
	center: {
		/**是否处于打开状态 */
		open: false,
		/**消息中心 */
		message: {},
		/**消息未读数 */
		unreadCount: 0,
		/**消息总数 */
		messageCount: 0,
	},
	/**开始菜单中心 */
	startMenu: {
		/**是否处于打开状态 */
		open: false,
		/**宽度 */
		width: 800,
		/**高度 */
		height: 600,
		/**侧边栏中心 */
		sidebar: {
			/**是否处于打开状态 */
			open: false,
			/**按钮集合 */
			buttons: [],
		},
		/**菜单中心 */
		menu: {},
	},
	/**消息预览中心 */
	messagePreviews: {},
};
