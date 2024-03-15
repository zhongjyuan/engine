
```json
{
	/**运行配置 */
	"configs": {
		/**任务栏是否置顶 */
		"topTaskBar": false,
		/**是否开启声音(声音尚未实现) */
		"sound": false,
		/**默认壁纸 */
		"wallpaper": "./assets/img/wall-paper/bg1.jpg",
		/**壁纸是否模糊处理 */
		"wallpaperBlur": false,
		/**幻灯片相关记录，由系统自动处理 */
		"wallpaperSlide": false,
		/**壁纸幻灯片顺序随机(否则顺序播放) */
		"wallpaperSlideRandom": true,
		/**壁纸幻灯片播放切换间隔(单位:分钟) */
		"wallpaperSlideItv": 1,
		/**记录最近一次切换壁纸的时刻 */
		"wallpaperSlideTime": 1519442460788,
		/**记录最近一次切换壁纸的index */
		"wallpaperSlideIndex": 8,
		/**最多可以打开几个窗口 */
		"openMax": 9,
		/**内部计数器，由系统自动处理 */
		"idCounter": 170,
		/**主题色 */
		"themeColor": "rgba(2,35,64,1)",
		/**是否从壁纸获取主题色(跨域壁纸无效) */
		"autoThemeColor": true,
		/**壁纸相册(其中preview字段可以省略) */
		"wallpapers": [
			{
				"image": "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
			},
			{
				"image": "./assets/img/wall-paper/bg1.jpg",
				"preview": "./assets/img/wall-paper/bg1_1.jpg"
			}
		],
		"shortcutsSortAuto": true,
		/**是否开启debug模式 */
		"debug": false,
		"winBlur": true
	},
	/**应用程序 */
	"apps": {
		/**系统设置 */
		"system": {
			/**是否显示地址栏 */
			"addressBar": false,
			/**自启动(表示不自启动，数字越大启动顺序越靠后) */
			"autoRun": 0,
			/**是否后置模式 */
			"background": false,
			/**角标 */
			"badge": 0,
			/**描述 */
			"desc": "系统设置面板",
			/**图标 */
			"icon": {
				"type": "fa",
				"bg": "#436fde",
				"content": "gear"
			},
			/**打开方式。normal,max,min,outer  */
			"openMode": "normal",
			/**是否是插件型窗口 */
			"plugin": false,
			/**窗口位置描述 */
			"position": {
				"x": "x*0.05",
				"y": "y*0.05",
				"left": true,
				"top": true,
				"autoOffset": true
			},
			/**版本号 */
			"version": "1.0.0",
			/**应用版权声明 */
			"poweredBy": "zhongjyuan",
			/**是否可变窗体尺寸 */
			"resizable": true,
			/**是否单例模式(不能多开) */
			"single": true,
			/**描述窗体大小 */
			"size": {
				"width": "920",
				"height": "590"
			},
			/**[必填]标题(应用名) */
			"title": "系统设置",
			/**[必填]url地址(推荐使用绝对地址，并以`//`开头) */
			"url": "./pages/system/index.html",
			/**自定义磁贴的url地址(留空则使用默认磁贴样式) */
			"customTile": "",
			/**是否为url自动添加随机token(减少浏览器读取页面缓存的概率) */
			"urlRandomToken": true
		}
	},
	/**桌面图标 */
	"shortcuts": [
		{
			/**分组标题 */
			"title": "系统应用",
			/**图标组(内部包含多个图标) */
			"children": [
				{
					/**应用标识 */
					"app": "website",
					/**应用标题 */
					"title": "官网",
					/**url query 键值对，如`{"a":"A","b":"B"}` */
					"params": {},
					/**url 锚点 */
					"hash": ""
				}
			]
		},
        {
            "app": "browser",
            "title": "浏览器",
            "params": {},
            "hash": ""
        }
	],
	/**磁贴 */
	"tiles": [
		{
			/**标题 */
			"title": "系统",
			"data": [
				{
					/**磁贴标识 */
					"i": "91",
					/**左偏移 */
					"x": 0,
					/**上偏移 */
					"y": 6,
					/**宽度 */
					"w": 2,
					/**高度 */
					"h": 2,
					/**应用标识 */
					"app": "app-store",
					/**标题 */
					"title": "应用商店",
					/**类似于桌面图标的params定义 */
					"params": {},
					/**类似于桌面图标的hash定义 */
					"hash": ""
				}
			]
		}
	],
	/**开始菜单 */
	"startMenu": {
		"width": 620,
		"height": 494,
		"sidebar": [
			{
				"app": "browser",
				"title": "浏览器",
				"params": {},
				"hash": ""
			},
			{
				"app": "system",
				"title": "系统设置"
			}
		],
		"menu": {
			"menu-1000": {
				"app": "system",
				"title": "系统设置",
				"params": {},
				"hash": ""
			},
			"menu-1010": {
				"app": "browser",
				"title": "浏览器",
				"params": {},
				"hash": ""
			},
			"menu-1020": {
				"title": "系统应用",
				"children": [
					{
						"app": "app-home",
						"title": "官网",
						"params": {},
						"hash": ""
					}
				]
			},
			"menu-1030": {
				"app": "gitee",
				"title": "gitee",
				"params": {},
				"hash": ""
			},
			"menu-1040": {
				"app": "github",
				"title": "github",
				"params": {},
				"hash": ""
			},
			"menu-1050": {
				"app": "gitlab",
				"title": "gitlab",
				"params": {},
				"hash": ""
			}
		}
	},
	/**运行时 */
	"runtime": {
		/**准备好 */
		"ready": false,

		/**客户端 */
		"clientSize": {
			"width": 0,
			"height": 0
		},

		/**桌面 */
		"desktopSize": {
			"width": 0,
			"height": 0
		},

		/**开始菜单 */
		"startMenu": {
			"width": 0,
			"height": 0,
			"drag": {
				"x": 0,
				"y": 0,
				"mDown": false
			}
		},
		"isSmallScreen": false,
		"isHorizontalScreen": true,

		/**语言 */
		"lang": "zh-cn",

		/**激活的窗口号 */
		"winActive": null,

		/**上一次激活的时间戳(惰性检查) */
		"winActiveTime": "Date.now()",

		/**窗口拖拽中 */
		"drag": false,

		/**时钟 */
		"time": "",

		/**总计窗口数 */
		"winOpenCounter": 0,

		/**目前打开的窗口数 */
		"winOpened": 0,

		/**数据 */
		"data": {},

		/**图标刷新动画辅助 */
		"shortcutsShow": true,

		/**插件小图标打开/关闭 */
		"pluginIconsOpen": false,

		/**日历打开/关闭 */
		"CalendarOpen": false,

		/**磁贴的尺寸(动态计算) */
		"tileSize": 0,

		/**磁贴框的尺寸(动态计算) */
		"tilesWidth": 0,

		/**磁贴框每一行最多几个组(计算得出) */
		"tilesGroupNum": 1,

		/**壁纸 */
		"wallpaper": "",

		/**壁纸宽高比 */
		"wallpaperScale": 1,

		/**图标的新参数input name */
		"shortcutNewParamName": "",

		/**图标的新参数input val */
		"shortcutNewParamValue": "",

		/**是否IE, */
		"isIE": false,

		/**菜单项的剪切板 */
		"menuItemCut": null,

		/**记录磁贴移动状态，防止移动触发点击 */
		"tileMoved": false,

		/**自定义磁贴iframe的随机token */
		"customTileRandomToken": "ZHONGJYUAN.util.randInt(1000, 9999)",

		/**桌面图标网格的宽高(int) */
		"shortcutsGrid": {
			"x": 0,
			"y": 0
		},

		/**即将插入在前的图标(视觉效果) */
		"shortcutInsert": null,

		/**即将拖动覆盖的图标(视觉效果) */
		"shortcutOver": null,

		/**移动端:菜单在左(反之在右) */
		"menuOnLeft": true,

		/**移动端响应式的图标尺寸 */
		"shortcutWidth": 0,

		/**移动端响应式的图标尺寸 */
		"shortcutHeight": 0,

		/** */
		"shortcutOpenedAt": "Date.now()"
	},
	"center": {
		"open": false,
		"unread": 0,
		"msgNum": 0,
		"msg": {}
	},
	"wins": {},
	"msgPres": {},
	"drawer": null,
	"shortSetting": null
}
```