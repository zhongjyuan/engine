/**拖拽配置 */
const drag = {
	/**样式对象 */
	style: {
		/**定位对象 */
		position: {
			/**X轴定位 */
			x: 0,
			/**Y轴定位 */
			y: 0,
			/**顶部定位 */
			top: true,
			/**左侧定位 */
			left: true,
			/**自动偏移 */
			autoOffset: true,
		},
		/**尺寸对象 */
		size: {
			/**宽度 */
			width: 0,
			/**高度 */
			height: 0,
		},
	},
	/**拖拽对象 */
	drag: {
		/**X轴定位 */
		x: 0,
		/**Y轴定位 */
		y: 0,
		/**前面位置下标 */
		lastIndex: 0,
		/**后面位置下标 */
		nextIndex: 0,
		/**处于鼠标按下状态 */
		mouseDown: false,
		/**是否处于大小变更状态 */
		resizable: false,
		/**是否处于重新定位状态 */
		positionable: false,
	},
};

export default {
	/**语言配置 */
	lang: "auto",
	/**语言配置 */
	languages: {},
	/**语言资源 */
	langResources: "./config/language.json",
	/**Header授权信息 */
	authorization: "Basic V2ViQXBwOnNhcGlAMTIzNA==",
	/**版本信息 */
	copyright: "Copyright @" + new Date().getFullYear() + " ZHONGJYUAN版权所有",
	/**工作日配置 */
	workDays: [1, 2, 3, 4, 5],

	/**自定义配置  */
	custom: {
		/**根节点元素 */
		rootElement: "zhongjyuan",
		/**VUE根节点元素 */
		vueRootElement: "win",
		/**VUE渲染之前根节点元素 */
		vueRootElementBefore: "app",
	},

	/**调试配置 */
	debugger: {
		/**断点暂停时长(判断是否开启调试) */
		timeout: 10,
		/**开启调试回调函数 */
		callback: () => {},
	},

	/**日志配置 */
	logger: {
		/**级别[ERROR: 0;WARN: 1;INFO: 2;DEBUG: 3;TRACE: 4,] */
		level: 2,
		/**输出堆栈信息 */
		stack: [3],
		/**错误日志 */
		ERROR: {
			/**错误日志级别 */
			level: 0,
			/**错误日志颜色配置 */
			color: {
				/**堆栈正文颜色 */
				stack: "#000000",
				/**前缀正文颜色 */
				prefix: "#fadfa3",
				/**内容正文颜色 */
				content: "#ffffff",
				/**时间正文颜色 */
				timestamp: "#333333",
			},
			/**错误日志背景颜色配置 */
			background: {
				/**堆栈正文颜色 */
				stack: "#FF6347",
				/**前缀正文颜色 */
				prefix: "#030307",
				/**内容正文颜色 */
				content: "#FFDAB9",
				/**时间正文颜色 */
				timestamp: "#FF6347",
			},
		},
		WARN: {
			level: 1, // 警告日志级别
			color: { stack: "#000000", prefix: "#fadfa3", content: "#ffffff", timestamp: "#333333" }, // 警告日志颜色配置
			background: { stack: "#FFD700", prefix: "#030307", content: "#F0E68C", timestamp: "#FFD700" }, // 警告日志背景颜色配置
		},
		INFO: {
			level: 2, // 信息日志级别
			color: { stack: "#000000", prefix: "#fadfa3", content: "#ffffff", timestamp: "#333333" }, // 信息日志颜色配置
			background: { stack: "#4CAF50", prefix: "#030307", content: "#C5E1A5", timestamp: "#4CAF50" }, // 信息日志背景颜色配置
		},
		DEBUG: {
			level: 3, // 调试日志级别
			color: { stack: "#000000", prefix: "#fadfa3", content: "#ffffff", timestamp: "#333333" }, // 调试日志颜色配置
			background: { stack: "#00BCD4", prefix: "#030307", content: "#B2EBF2", timestamp: "#00BCD4" }, // 调试日志背景颜色配置
		},
		TRACE: {
			level: 4, // 追踪日志级别
			color: { stack: "#000000", prefix: "#fadfa3", content: "#ffffff", timestamp: "#333333" }, // 追踪日志颜色配置
			background: { stack: "#86A8E7", prefix: "#030307", content: "#B4C6E7", timestamp: "#86A8E7" }, // 追踪日志背景颜色配置
		},
		/**前缀样式 */
		prefixStyle: "color: ${0}; background: ${1}; padding: 3px; border-radius: 3px 0 0 3px;",
		/**正文样式 */
		contentStyle: "color: ${0}; background: ${1}; padding: 3px; border-radius: 0 3px 3px 0;",
		/**时间样式 */
		timestampStyle: "color: ${0}; background: ${1}; padding: 3px; border-radius: 0 0 0 0;",
		/**堆栈样式 */
		stackStyle: "color: ${0}; background: ${1}; padding: 3px; border-radius: 3px 3px 3px 3px; margin: 3px",
	},

	/**服务端配置 */
	server: {
		/**服务主机 */
		host: "",
		/**服务版本 */
		version: "v1",
		/**平台服务 */
		platServer: { url: "/plat", version: "v1" },
		/**WebSocket服务 */
		socketServer: { url: "/socket", version: "v1" },
		/**公共服务 */
		commonServer: { url: "/common", version: "v1" },
		/**反馈服务 */
		feedbackServer: { url: "/feedback", version: "v1" },
		/**文件服务 */
		fileServer: { url: "/file", version: "v1" },
		/**预览服务 */
		previewServer: { url: "/preview", version: "v1" },
		/**流程服务 */
		flowServer: { url: "/flow", version: "v1" },
		/**表单服务 */
		formServer: { url: "/form", version: "v1" },
		/**报表服务 */
		reportServer: { url: "/report", version: "v1" },
		/**内容服务 */
		contentServer: { url: "/content", version: "v1" },
		/**集成服务 */
		integrateServer: { url: "/integrate", version: "v1" },
	},

	/**随机配置 */
	random: {
		/**随机字符 */
		characters: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
	},

	/**唯一标识配置 */
	id: {
		/**最小值 */
		min: 100000000,
		/**最大值 */
		max: 999999999,
		/**窗体前缀 */
		winPrefix: "win-",
		/**菜单前缀 */
		menuPrefix: "menu-",
		/**消息前缀 */
		messagePrefix: "message-",
		/**消息预览前缀 */
		messagePreviewPrefix: "messagePreview-",
	},

	/**令牌配置 */
	token: {
		/**最小值 */
		min: 1000,
		/**最大值 */
		max: 999999,
		/**名称 */
		name: "access_token",
	},

	/**登录配置 */
	login: {
		/**二维码登录 */
		qrcodes: {
			qq: {
				enable: false,
				title: "QQ",
			},
			wechat: {
				enable: false,
				title: "微信",
			},
			weibo: {
				enable: false,
				title: "微博",
			},
			alipay: {
				enable: false,
				title: "支付宝",
			},
			douyin: {
				enable: false,
				title: "抖音",
			},
			ewechat: {
				enable: false,
				title: "企业微信",
			},
			dingtalk: {
				enable: false,
				title: "钉钉",
			},
		},
	},

	/**单点配置 */
	sso: {
		/**方式:redirect(重定向[当个中转点]);AuthToken(认证令牌);AuthUser(认证用户) */
		way: "redirect",
		/**认证地址 */
		authUrl: "/sso/auth",
		/**重定向地址 */
		redirectUrl: "/sso/redirect",
		/**回调地址 */
		callbackUrl: "/sso/callback",
	},

	/**页面配置 */
	page: {
		login: "/login.html",
		index: "/index.html",
		sso: "/sso.html",
		401: "/401.html",
		403: "/403.html",
		/**匿名页面 */
		anons: ["/sso.html", "/login.html", "/401.html", "/403.html"],
	},

	/**拖拽配置 */
	drag: drag,

	/**图标配置 */
	icon: {
		/**上 */
		up: "up",
		/**下 */
		down: "down",
		/**左 */
		left: "left",
		/**右 */
		right: "right",
		/**电源 */
		power: "power ",
		/**文档 */
		document: "document",
		/**图片 */
		image: "image",
		/**视频 */
		video: "video",
		/**音乐 */
		music: "music",
		/**创建/新增 */
		create: "create",
		/**更新/修改 */
		update: "update",
		/**删除/移除 */
		delete: "delete",
		/**查询/检索 */
		select: "select",
		/**查看/预览 */
		view: "view",
		/**阅读/读取 */
		read: "read",
		/**重置 */
		reset: "reset",
		/**批量 */
		batch: "batch",
		/**暂存/草稿 */
		draft: "draft",
		/**取消/关闭 */
		cancel: "cancel",
		/**提交/确定 */
		submit: "submit",
		/**调整/变更 */
		change: "change",
		/** 转换 */
		convert: "convert",
		/**恢复/还原 */
		revert: "revert",
		/**合并 */
		union: "union",
		/** 拆分 */
		split: "split",
		/** 打印 */
		print: "print",
		/**上传 */
		upload: "upload",
		/**下载 */
		download: "download",
		/**导入 */
		import: "import",
		/**导出 */
		export: "export",
		/** 设置权*/
		setting: "setting",
		/** 操作 */
		operate: "operate",
		/** 跳过 */
		skip: "skip",
		/** 关联 */
		link: "link",
		/** 移动 */
		move: "move",
		/** 复制 */
		copy: "copy",
		/** 粘贴 */
		paste: "paste",
		/** 复核 */
		check: "check",
		/** 处理 */
		handle: "handle",
		/** 授权 */
		warrant: "warrant",
		/** 废弃 */
		abandon: "abandon",
		/** 发布 */
		publish: "publish",
		/** 回滚 */
		rollback: "rollback",
		/** 发起/初始化 */
		initiate: "initiate",
		/**撤销/回滚 */
		revoke: "revoke",
		/** 审批 */
		approve: "approve",
		/** 驳回 */
		reject: "reject",
		/** 调整 */
		adjust: "adjust",
		/** 抄送 */
		cc: "cc",
		/** 催办 */
		urge: "urge",
		/** 转发 */
		forward: "forward",
		/** 转办 */
		transfer: "transfer",
		/** 传阅 */
		circulate: "circulate",
		/** 归档 */
		archive: "archive",
		/** 加签 */
		addSign: "addSign",
		/** 播放 */
		play: "play",
		/** 点赞 */
		like: "like",
		/** 分享 */
		share: "share",
		/** 评论 */
		comment: "comment",
		/**开始 */
		start: "desktop",
		/**消息 */
		message: "message",
		/**刷新 */
		refresh: "refresh",
		/**壁纸 */
		wallpaper: "wallpaper",
		/**主题色 */
		themecolor: "themecolor",
		/**全屏 */
		fullscreen: "fullscreen",
		/**正常屏 */
		normalscreen: "normalscreen",
		/**安装 */
		install: "install",
		/**卸载 */
		uninstall: "uninstall",
		/**打开 */
		open: "open",
		/**关闭 */
		close: "close",
		/**外部 */
		outer: "outer",
		/**还原 */
		restore: "restore",
		/**最大化 */
		maximize: "maximize",
		/**最小化 */
		minimize: "minimize",
		/**关于 */
		aboutus: "aboutus",
	},

	/**开关配置 */
	switch: {
		/**存储数据可变更 */
		changeStorage: true,
		/**数据中心显示 */
		showDataCenter: true,
		/**关闭之前询问 */
		askCloseBefore: true,
		/**IE浏览器提醒 */
		remindInIE: true,
		/**启用单点 */
		useSSO: false,
		/**启用扫码登录 */
		useQRCode: false,
		/**启用WebSocket */
		useSocket: false,
		/**启用租户 */
		useTenant: false,
		/**启用上传 */
		useUpload: false,
		/**启用预览 */
		usePreview: false,
		/**启用下载 */
		useDownload: false,
		/**启用多标签 */
		useMultipleTab: true,
		/**启用二维码登录 */
		useQRCodeLogin: false,
		/**启用浏览器多标签 */
		useBrowserMultipleTab: true,
		/**显示反馈入口 */
		showFeedback: false,
		/**显示多语言 */
		showLanguage: false,
		/**显示应用下载 */
		showAppDownload: false,
	},

	/**超时配置 */
	timeout: {
		/**JSONP请求 */
		jsonp: 10000,
		/**上传(-1标识不限时) */
		upload: -1,
		/**请求(三分钟) */
		request: 1000 * 60 * 3,
	},

	/**持续配置[一般用于定时] */
	duration: {
		/**预览显示时长 */
		previewTime: 5000,
	},

	/**轮询配置[一般用于循环] */
	interval: {
		/**健康轮询 */
		healthTime: 500,
	},

	/**屏幕配置 */
	screen: {
		/**小屏阈值[宽度] */
		smallThreshold: 768,
	},

	/**消息配置 */
	message: {
		/**健康(ping) */
		ping: "win-ping",
		/**健康(pong) */
		pong: "win-pong",
		/**执行 */
		eval: "win-eval",
		/**触发 */
		emit: "win-emit",
		/**事件 */
		event: "win-event",
		/**打开事件 */
		openEvent: "win-event-open",
		/**关闭事件 */
		closeEvent: "win-event-close",
		/**准备完成事件 */
		readyEvent: "win-event-ready",
		/**大小变更事件 */
		resizeEvent: "win-event-resize",
		/**数据变更事件 */
		dataChangeEvent: "win-event-dataChange",
		/**桌面点击事件 */
		desktopClickEvent: "desktop-event-click",
		/**桌面鼠标抬起事件 */
		desktopMouseUpEvent: "desktop-event-mouse-up",
		/**桌面鼠标按下事件 */
		desktopMouseDownEvent: "desktop-event-mouse-down",
		/**桌面鼠标移动事件 */
		desktopMouseMoveEvent: "desktop-event-mouse-move",
	},

	/**存储配置 */
	storage: {
		/**静态后缀值[存储键为静态配置时生效] */
		suffix: "zhongjyuan",
		/**基础数据 */
		basicDataKey: "basic.json",
		/**浏览器数据 */
		browserDataKey: "browse.json",
	},

	/**Cookie配置 */
	cookie: {
		/**Secure 属性 */
		secure: true,
		/**设置cookie值时是否采用主域名(子域名可共享cookie) */
		useMainDomain: true,
		/**
		 * SameSite 属性
		 * - Strict：在跨站点请求中，浏览器不会发送 Cookie。
		 * - Lax（默认值）：在跨站点的 GET 请求和安全 POST 请求中，浏览器会发送 Cookie，但对于跨站点的 POST、PUT、DELETE 请求等，或者跨站点链接的 GET 请求，浏览器不会发送 Cookie。
		 * - None：浏览器总是在跨站点请求中发送 Cookie。请注意，要使用 None 值，必须同时将 Secure 属性设置为 true，即只能在 HTTPS 连接下使用。
		 */
		sameSite: "Strict",
	},

	/**Html配置 */
	html: {
		/**特殊字符转义编码 */
		escape: {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#039;",
		},
		unescape: [
			{
				reg: /&amp;/g,
				val: "&",
			},
			{
				reg: /&lt;/g,
				val: "<",
			},
			{
				reg: /&gt;/g,
				val: ">",
			},
			{
				reg: /&quot;/g,
				val: '"',
			},
			{
				reg: /&#039;/g,
				val: "'",
			},
		],
	},

	/**窗体配置 */
	win: {
		/**打开模式 */
		openmode: {
			/**最小化 */
			min: "min",
			/**最大化 */
			max: "max",
			/**外部 */
			outer: "outer",
			/**常规 */
			normal: "normal",
		},
		/**函数对象 */
		method: {
			/**获取唯一标识 */
			GET_ID: "id",
			/**获取系统版本 */
			GET_VERSION: "version",
			/**获取应用版本 */
			GET_APP_VERSION: "appVersion",
			/**发送消息 */
			MESSAGE: "message",
			/**发送简单消息 */
			SIMPLE_MESSAGE: "simpleMessage",
			/**发送确认消息 */
			CONFIRM_MESSAGE: "confirmMessage",
			/**打开应用 */
			OPEN_APP: "openApp",
			/**关闭应用 */
			CLOASE_APP: "closeApp",
			/**安装应用 */
			INSTALL_APP: "installApp",
			/**卸载应用 */
			UNINSTALL_APP: "uninstallApp",
			/**导入应用 */
			IMPORT_APP: "importApp",
			/**导出应用 */
			EXPORT_APP: "exportApp",
			/**执行 */
			EVAL: "eval",
			/**最小化 */
			MINIMIZE: "minimize",
			/**最大化 */
			MAXIMIZE: "maximize",
			/**隐藏 */
			HIDE: "hide",
			/**展示 */
			SHOW: "show",
			/**还原 */
			RESTORE: "restore",
			/**刷新 */
			REFRESH: "refresh",
			/**设置窗体属性 */
			SET_WIN_ATTRIBUTE: "setWinAttribute",
			/**设置应用角标 */
			SET_APP_BADGE: "setAppBadge",
			/**设置壁纸 */
			SET_WALLPAPER: "setWallpaper",
			/**设置主题色 */
			SET_THEME_COLOR: "setThemeColor",
			/**设置地址栏 */
			SET_URL_BAR: "setUrlBar",
			/**后退地址栏 */
			BACK_URL_BAR: "backUrlBar",
			/**后退地址栏是否可行 */
			BACK_URL_BAR_AVAILABLE: "backUrlBarAvailable",
			/**前进地址栏 */
			FORWARD_URL_BAR: "forwardUrlBar",
			/**前进地址栏是否可行 */
			FORWARD_URL_BAR_AVAILABLE: "forwardUrlBarAvailable",
			/**运行时数据 */
			RUNTIME_DATA: "runtimeData",
			/**配置数据 */
			CONFIGS_DATA: "configData",
			/**窗体数据 */
			WIN_DATA: "winData",
		},
	},

	/**应用配置 */
	app: {
		/**信任应用 */
		trusted: ["system"],
		/**锁定应用 */
		locked: ["fa", "system", "browser", "color-picker"],
	},

	/**日历配置 */
	calendar: {
		solarFestival: {
			d0101: "元旦节",
			d0202: "世界湿地日",
			d0210: "国际气象节",
			d0214: "情人节",
			d0301: "国际海豹日",
			d0303: "全国爱耳日",
			d0305: "学雷锋纪念日",
			d0308: "妇女节",
			d0312: "植树节 孙中山逝世纪念日",
			d0314: "国际警察日",
			d0315: "消费者权益日",
			d0317: "中国国医节 国际航海日",
			d0321: "世界森林日 消除种族歧视国际日 世界儿歌日",
			d0322: "世界水日",
			d0323: "世界气象日",
			d0324: "世界防治结核病日",
			d0325: "全国中小学生安全教育日",
			d0330: "巴勒斯坦国土日",
			d0401: "愚人节 全国爱国卫生运动月(四月) 税收宣传月(四月)",
			d0407: "世界卫生日",
			d0422: "世界地球日",
			d0423: "世界图书和版权日",
			d0424: "亚非新闻工作者日",
			d0501: "劳动节",
			d0504: "青年节",
			d0505: "碘缺乏病防治日",
			d0508: "世界红十字日",
			d0512: "国际护士节",
			d0515: "国际家庭日",
			d0517: "世界电信日",
			d0518: "国际博物馆日",
			d0520: "全国学生营养日",
			d0522: "国际生物多样性日",
			d0523: "国际牛奶日",
			d0531: "世界无烟日",
			d0601: "国际儿童节",
			d0605: "世界环境日",
			d0606: "全国爱眼日",
			d0617: "防治荒漠化和干旱日",
			d0623: "国际奥林匹克日",
			d0625: "全国土地日",
			d0626: "国际禁毒日",
			d0701: "香港回归纪念日 中共诞辰 世界建筑日",
			d0702: "国际体育记者日",
			d0707: "抗日战争纪念日",
			d0711: "世界人口日",
			d0730: "非洲妇女日",
			d0801: "建军节",
			d0808: "中国男子节(爸爸节)",
			d0815: "抗日战争胜利纪念",
			d0908: "国际扫盲日 国际新闻工作者日",
			d0909: "毛泽东逝世纪念",
			d0910: "中国教师节",
			d0914: "世界清洁地球日",
			d0916: "国际臭氧层保护日",
			d0918: "九一八事变纪念日",
			d0920: "国际爱牙日",
			d0927: "世界旅游日",
			d0928: "孔子诞辰",
			d1001: "国庆节 世界音乐日 国际老人节",
			d1002: "国际和平与民主自由斗争日",
			d1004: "世界动物日",
			d1006: "老人节",
			d1008: "全国高血压日 世界视觉日",
			d1009: "世界邮政日 万国邮联日",
			d1010: "辛亥革命纪念日 世界精神卫生日",
			d1013: "世界保健日 国际教师节",
			d1014: "世界标准日",
			d1015: "国际盲人节(白手杖节)",
			d1016: "世界粮食日",
			d1017: "世界消除贫困日",
			d1022: "世界传统医药日",
			d1024: "联合国日 世界发展信息日",
			d1031: "世界勤俭日",
			d1107: "十月社会主义革命纪念日",
			d1108: "中国记者日",
			d1109: "全国消防安全宣传教育日",
			d1110: "世界青年节",
			d1111: "国际科学与和平周(本日所属的一周)",
			d1112: "孙中山诞辰纪念日",
			d1114: "世界糖尿病日",
			d1117: "国际大学生节 世界学生节",
			d1121: "世界问候日 世界电视日",
			d1129: "国际声援巴勒斯坦人民国际日",
			d1201: "世界艾滋病日",
			d1203: "世界残疾人日",
			d1205: "国际经济和社会发展志愿人员日",
			d1208: "国际儿童电视日",
			d1209: "世界足球日",
			d1210: "世界人权日",
			d1212: "西安事变纪念日",
			d1213: "南京大屠杀(1937年)纪念日！紧记血泪史！",
			d1220: "澳门回归纪念",
			d1221: "国际篮球日",
			d1224: "平安夜",
			d1225: "圣诞节",
			d1226: "毛泽东诞辰纪念",
		},
		lunarFestival: {
			d0101: "春节",
			d0115: "元宵节",
			d0202: "龙抬头节",
			d0323: "妈祖生辰",
			d0505: "端午节",
			d0707: "七夕情人节",
			d0715: "中元节",
			d0815: "中秋节",
			d0909: "重阳节",
			d1015: "下元节",
			d1208: "腊八节",
			d1223: "小年",
			d0100: "除夕",
		},
	},

	/**日历组件配置 */
	comp_calendar: {
		...drag,
		/**DOM元素标识 */
		domId: "comp-calendar",
		/**十年 */
		ten: 0,
		/**展示模式(年|月|日) */
		mode: 0,
		/**颜色 */
		color: "rgb(89, 65, 20)",
		/**延时对象 */
		delayTimer: null,
		/**轮询对象 */
		timeInterval: null,
		/**设置年份 */
		setYear: null,
		/**设置月份 */
		setMonth: null,
		/**设置日期 */
		setDate: null,
		/**当前年份 */
		currentYear: null,
		/**当前月份 */
		currentMonth: null,
		/**当前日期 */
		currentDate: null,
		/**周末集 */
		weeks: [],
		/**月份集 */
		months: [],
		/**周末简写集 */
		weekShorts: [],
		/**组件元素对象 */
		componentElement: null,
	},

	/**日历Plus组件配置 */
	comp_calendar_plus: {
		...drag,
		/**DOM元素标识 */
		domId: "comp-calendar-plus",
		/**颜色 */
		color: "#1a1a1a",
		/**时间格式 */
		format: "ap HH:mm:ss",
		/**周末集 */
		weeks: [],
		/**月份集 */
		months: [],
		/**周末简写集 */
		weekShorts: [],
		/**轮询对象 */
		timeInterval: null,
		/**组件元素对象 */
		componentElement: null,
	},

	/**时间组件配置 */
	comp_time: {
		...drag,
		/**DOM元素标识 */
		domId: "comp-time",
		/**时间格式 */
		format: "yyyy年MM月dd日 ap HH:mm:ss",
		/**轮询载体 */
		interval: null,
		/**父级元素对象 */
		parentElement: null,
		/**组件元素对象 */
		componentElement: null,
	},

	/**计时组件配置 */
	comp_time_up: {
		...drag,
		/**DOM元素标识 */
		domId: "comp-time-up",
		/**标题 */
		title: "从${0}至今已经过去",
		/**展示年 */
		year: true,
		/**展示月 */
		month: true,
		/**展示天 */
		day: true,
		/**展示时 */
		hour: true,
		/**展示分 */
		minute: true,
		/**展示秒 */
		second: true,
		/**展示毫秒 */
		millisecond: true,
		/**轮询载体 */
		interval: null,
		/**组件元素对象 */
		componentElement: null,
	},

	/**倒计时组件配置 */
	comp_time_down: {
		...drag,
		/**DOM元素标识 */
		domId: "comp-time-down",
		/**标题 */
		title: "距${0}还有",
		/**完成标题 */
		finishTitle: "${0}倒计时完成",
		/**展示年 */
		year: true,
		/**展示月 */
		month: true,
		/**展示天 */
		day: true,
		/**展示时 */
		hour: true,
		/**展示分 */
		minute: true,
		/**展示秒 */
		second: true,
		/**展示毫秒 */
		millisecond: true,
		/**轮询载体 */
		interval: null,
		/**组件元素对象 */
		componentElement: null,
	},

	/**弹窗组件配置 */
	comp_popup: {
		...drag,
		/**DOM元素标识 */
		domId: "comp-popup",
		/**组件元素对象 */
		componentElements: {},
	},

	/**登录组件配置 */
	comp_login: {
		...drag,
		/**DOM元素标识 */
		domId: "comp-login",
		/**回调数据对象 */
		callbackData: {},
		/**验证码轮询对象 */
		captchaInterval: null,
		/**验证码倒计时 */
		captchaCountDown: 60,
		/**组件元素对象 */
		componentElement: null,
	},

	/**检索组件配置 */
	comp_search: {
		...drag,
		/**DOM元素标识 */
		domId: "comp-search",
		/**icon */
		icon: "",
		/**主题色 */
		color: "",
		/**保留数量 */
		reserve: 3,
		/**检索结果 */
		results: [],
		historyLimit: 10,
		historyKey: "search_history",
		/**检索历史 */
		historys: [],
		/**回调函数 */
		callback: null,
		/**输出延时 */
		outputDelay: 10,
		/**输出延时 */
		outputTimers: [],
		/**组件元素对象 */
		componentElement: null,
	},

	/**进度组件配置 */
	comp_progress: {
		...drag,
		/**DOM元素标识 */
		domId: "comp-progress",
		/**加载最大资源数 */
		max: 5,
		/**加载真实资源数 */
		real: 5,
		/**加载虚拟资源数 */
		sham: 0,
		/**防撕裂 */
		fifty: false,
		/**加载消息 */
		message: "",
		/**加载完成资源数 */
		complete: 0,
		/**加载完成回调 */
		callback: null,
		/**第一次加载时间 */
		firstTime: null,
		/**父级元素对象 */
		parentElement: null,
		/**组件元素对象 */
		componentElement: null,
		/**加载动画轮询载体 */
		loadingAnimationInterval: null,
		/**加载虚拟资源轮询载体 */
		loadShamResourceInterval: null,
		/**校验加载完成轮询载体 */
		checkLoadCompleteInterval: null,
	},

	/**水印组件配置 */
	comp_watermark: {
		...drag,
		/**DOM元素唯一标识 */
		domId: "comp-watermark",
		/**时间格式 */
		timeFormat: "yyyy年MM月dd日 ap HH:mm",
		/**宽度 */
		width: 280,
		/**高度 */
		height: 200,
		/**旋转角度((-15 * Math.PI) / 150) */
		angle: -0.3141592653589793,
		/**文字大小 */
		fontSize: "16px",
		/**文字类型 */
		fontType: "Microsoft JhengHei",
		/**文本内容的对齐方式 */
		textAlign: "left",
		/**行高 */
		lineHeight: 20,
		/**填充绘画颜色 */
		fillStyle: "rgba(190, 190, 190, 0.30)",
		/**绘制文本时使用的当前文本基线 */
		textBaseline: "middle",
		/**轮询函数 */
		internal: null,
		/**轮询跳过[类似停止效果] */
		internalJump: false,
		/**轮询时长[一分钟] */
		internalTime: 60000,
		/**水印div */
		div_style_cssText: "position: absolute; pointerEvents: none; width: 100%; height: 100%; top: 0px; left: 0px; z-index: 999;",
		/**水印背景存储 */
		background: "",
	},

	/**取色器组件配置 */
	comp_color_picker: {
		...drag,
		/**DOM元素标识 */
		domId: "comp-color-picker",
		/**取色模式 */
		mode: "hex",
		hsb: { h: 0, s: 100, b: 100 },
		rgba: { r: 0, g: 0, b: 0, a: 1 },
		/**鼠标点击X定位 */
		downX: 0,
		/**鼠标点击Y定位 */
		downY: 0,
		/**鼠标移动X定位 */
		moveX: 0,
		/**鼠标移动Y定位 */
		moveY: 0,
		/**面板顶部偏移定位 */
		pancelTop: 0,
		/**面板左侧偏移定位 */
		pancelLeft: 0,
		/**色块按钮顶部偏移定位 */
		pickerButtonTop: 0,
		/**色块按钮左侧偏移定位 */
		pickerButtonLeft: 0,
		/**组件父级元素对象 */
		parentElement: null,
		/**组件元素对象 */
		componentElement: null,
		/**组件遮罩元素对象 */
		componentMaskElement: null,
		/**组件面板元素对象 */
		componentPancelElement: null,
		/**组件色块元素对象 */
		componentPaletteElement: null,
		/**组件展示颜色元素对象 */
		componentShowColorElement: null,
		/**组件色块按钮元素对象 */
		componentPickerButtonElement: null,
		/**组件色条元素对象 */
		componentPickerColorBarElement: null,
		/**组件取色文本框元素对象 */
		componentPickerColorInputElement: null,
		/**组件取色模式按钮元素对象 */
		componentModeButtonElement: null,
		/**组件输入区域元素对象 */
		componentInputWrapElement: null,
	},

	/**人群背景组件配置 */
	comp_wallpaper_crowd: {
		...drag,
		/**DOM元素标识 */
		domId: "comp-wallpaper-crowd",
		/**人物集合 */
		peoples: [],
		/**任务行为集合 */
		peopleWalks: [],
		/**舞台上人物集合 */
		onStagePeoples: [],
		/**舞台下任务集合 */
		offStagePeoples: [],
		/**舞台对象 */
		stage: { width: 0, height: 0 },
		/**人物图片素材对象 */
		imgElement: null,
		/**组件元素对象 */
		componentElement: null,
	},

	/**流星背景组件配置 */
	comp_wallpaper_meteor: {
		...drag,
		/**DOM元素标识 */
		domId: "comp-wallpaper-meteor",
		/**组件元素对象 */
		componentElement: null,
	},

	/**设置组件配置 */
	comp_setting: {
		...drag,
		/**DOM元素标识 */
		domId: "comp-setting",
		/**面板上偏移量(针对按钮上侧) */
		topOffset: 5,
		/**面板左偏移量(针对按钮左侧) */
		leftOffset: 15,
		/**组件元素对象 */
		componentElement: null,
	},
};
