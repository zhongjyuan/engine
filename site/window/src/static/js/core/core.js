/**
 * 处理对象
 * @author zhongjyuan
 * @date   2023年6月7日15:24:59
 * @email  zhongjyuan@outlook.com
 */
window.ZHONGJYUAN = {
	/**
	 * 变量对象
	 * @author zhongjyuan
	 * @date   2023年6月8日11:19:40
	 * @email  zhongjyuan@outlook.com
	 */
	variable: {},

	/**
	 * Load函数堆栈集合
	 * @author zhongjyuan
	 * @date   2023年6月7日15:26:20
	 * @email  zhongjyuan@outlook.com
	 */
	loadStack: [],

	/**
	 * Ready函数堆栈集合
	 * @author zhongjyuan
	 * @date   2023年6月7日15:26:40
	 * @email  zhongjyuan@outlook.com
	 */
	readyStack: [],

	/**
	 * 是否开启Debug日志
	 * @author zhongjyuan
	 * @date   2023年6月5日16:20:08
	 * @email  zhongjyuan@outlook.com
	 * @returns {Boolean}
	 */
	isDebug: function() {
		return ZHONGJYUAN.logger.getLevel >= 3;
	},

	/**
	 * debug 日志
	 * @author zhongjyuan
	 * @date   2023年5月16日17:07:39
	 * @email  zhongjyuan@outlook.com
	 * @param {*} content 日志内容
	 */
	debug: function(content) {
		ZHONGJYUAN.logger.debug(content);
	},

	/**
	 * 多语言
	 * @author zhongjyuan
	 * @date   2023年5月15日14:50:37
	 * @email  zhongjyuan@outlook.com
	 * @param {*} key 多语言键
	 * @returns {String}
	 */
	lang: function(key) {
		ZHONGJYUAN.logger.trace("core.[lang] key:${0}", key);

		var result = ZHONGJYUAN.static.languages[ZHONGJYUAN.static.lang] ? ZHONGJYUAN.static.languages[ZHONGJYUAN.static.lang][key] : "";

		ZHONGJYUAN.logger.debug("core.[lang] key:${0};result:${1}", key, result);
		return result;
	},

	/**
	 * 加载[页面完成后执行]
	 * @author zhongjyuan
	 * @date   2023年5月16日17:08:13
	 * @email  zhongjyuan@outlook.com
	 * @param {*} callback 回调函数
	 */
	onLoad: function(callback) {
		const oldLoad = window.onload;
		window.onload = function() {
			if (oldLoad && typeof oldLoad === "function") {
				oldLoad();
			}
			callback();
		};
	},

	/**
	 * 设置变量
	 * @author zhongjyuan
	 * @date   2023年6月7日15:40:13
	 * @email  zhongjyuan@outlook.com
	 * @param {*} key 键
	 * @param {*} value 值
	 * @param {*} path 路径处理
	 * @returns {Boolean}
	 */
	setVariable: function(key, value, path) {
		if (!key) return;
		ZHONGJYUAN.variable[key] = path ? value.replace(/\\/g, "/") : value;
	},

	/**
	 * 获取变量
	 * @author zhongjyuan
	 * @date   2023年6月7日15:40:36
	 * @email  zhongjyuan@outlook.com
	 * @param {*} key 键
	 * @returns {String|Object}
	 */
	getVariable: function(key) {
		if (!key) return;
		return ZHONGJYUAN.variable[key];
	},

	/**
	 * 增加 OnLoad 堆栈回调函数
	 * @author zhongjyuan
	 * @date   2023年5月16日17:08:35
	 * @email  zhongjyuan@outlook.com
	 * @param {*} callback 回调函数
	 */
	addOnLoad: function(callback) {
		ZHONGJYUAN.loadStack.push(callback);
	},

	/**
	 * 执行Load堆栈回调函数
	 * @author zhongjyuan
	 * @date   2023年6月7日11:01:35
	 * @email  zhongjyuan@outlook.com
	 */
	executeLoad: function() {
		ZHONGJYUAN.logger.debug("core.[executeLoad] loadStack length: ${0}", ZHONGJYUAN.loadStack.length);
		ZHONGJYUAN.loadStack.forEach(function(callback) {
			if (typeof callback === "function") callback();
		});
	},

	/**
	 * 增加 OnReady 堆栈回调函数
	 * @author zhongjyuan
	 * @date   2023年5月16日17:08:41
	 * @email  zhongjyuan@outlook.com
	 * @param {*} callback 回调函数
	 */
	addOnReady: function(callback) {
		ZHONGJYUAN.readyStack.push(callback);
	},

	/**
	 * 执行Ready堆栈回调函数
	 * @author zhongjyuan
	 * @date   2023年6月7日11:01:54
	 * @email  zhongjyuan@outlook.com
	 */
	executeReady: function() {
		ZHONGJYUAN.logger.debug("core.[executeReady] readyStack length: ${0}", ZHONGJYUAN.readyStack.length);
		ZHONGJYUAN.readyStack.forEach(function(callback) {
			if (typeof callback === "function") callback();
		});
	},

	/**
	 * 加载语言数据
	 * @author zhongjyuan
	 * @date   2023年5月16日17:03:34
	 * @email  zhongjyuan@outlook.com
	 * @param {*} language 语言数据
	 */
	loadLanguage: function(language) {
		ZHONGJYUAN.logger.trace("core.[loadLanguage] language:${0}", language);
		if (!ZHONGJYUAN.helper.check.isNormal(language)) {
			ZHONGJYUAN.logger.error("core.[loadLanguage] language data not normal.");
			return;
		}

		var json = eval("(" + language + ")");
		ZHONGJYUAN.static.languages[ZHONGJYUAN.static.lang] = json;
		ZHONGJYUAN.logger.trace("core.[loadLanguage] result:${0}", JSON.stringify(json));
	},

	/**
	 * 加载资源数据
	 * @author zhongjyuan
	 * @date   2023年5月16日17:05:37
	 * @email  zhongjyuan@outlook.com
	 */
	loadResources: function() {
		ZHONGJYUAN.logger.trace("core.[loadResources]: begin");

		document.title = ZHONGJYUAN.static.name;

		ZHONGJYUAN.component.loading.show(7, 6);

		/**  加载资源 */
		const versionTail = "?v=" + ZHONGJYUAN.static.version;

		// font-awesome.min.css
		ZHONGJYUAN.helper.loadStyle("components/font-awesome/css/font-awesome.min.css" + versionTail, function() {
			ZHONGJYUAN.component.loading.completeUp("font-awesome.min.css");
		});

		// fontawesome-webfont.woff2
		ZHONGJYUAN.helper.loadPrefetch("components/font-awesome/fonts/fontawesome-webfont.woff2" + versionTail, function() {
			ZHONGJYUAN.component.loading.completeUp("fontawesome-webfont.woff2");
		});

		// element-icons.woff
		ZHONGJYUAN.helper.loadPrefetch("components/element-ui/fonts/element-icons.woff" + versionTail, function() {
			ZHONGJYUAN.component.loading.completeUp("element-icons.woff");
		});

		// element-ui.css
		ZHONGJYUAN.helper.loadPrefetch("components/element-ui/index.css" + versionTail, function() {
			ZHONGJYUAN.component.loading.completeUp("element-ui.css");
		});

		// element-ui.js
		ZHONGJYUAN.helper.loadPrefetch("components/element-ui/index.js" + versionTail, function() {
			ZHONGJYUAN.component.loading.completeUp("element-ui.js");
		});

		// layer.full.js [默认link layer.css]
		ZHONGJYUAN.helper.loadScript("components/layer/layer.full.js" + versionTail, function() {
			ZHONGJYUAN.component.loading.completeUp("layer.full.js");
		});

		ZHONGJYUAN.component.loading.checkComplete();
		ZHONGJYUAN.logger.trace("core.[loadResources]: end");
	},

	/**
	 * 初始化
	 * @author zhongjyuan
	 * @date   2023年5月16日17:08:47
	 * @email  zhongjyuan@outlook.com
	 * @param {*} data 初始化数据
	 */
	initialize: function(data) {
		ZHONGJYUAN.logger.trace("core.[initialize] data:${0}", JSON.stringify(data));

		data = data
			? data
			: localStorage.getItem(ZHONGJYUAN.static.storage.basic)
			? JSON.parse(localStorage.getItem(ZHONGJYUAN.static.storage.basic))
			: ZHONGJYUAN.static.template.basic;

		data = ZHONGJYUAN.api.format(data);
		ZHONGJYUAN.logger.debug("core.[initialize] lang:${0}", ZHONGJYUAN.static.lang);
		ZHONGJYUAN.component.popup.open("初始化成功，当前语言：" + ZHONGJYUAN.static.lang + "</br>扫码快速登录-v-");

		ZHONGJYUAN.component.login.show(function(callbackData) {
			ZHONGJYUAN.component.login.hide();
			ZHONGJYUAN.logger.debug("core.[login] response:${0}", JSON.stringify(callbackData));

			ZHONGJYUAN.render.start(data);

			ZHONGJYUAN.executeReady();
		});
	},

	/**
	 * 主界面消息监听
	 * @author zhongjyuan
	 * @date   2023年6月7日10:47:29
	 * @email  zhongjyuan@outlook.com
	 */
	windowOnMessage: function() {
		ZHONGJYUAN.logger.trace("core.[windowOnMessage] begin.");

		/**
		 * 窗体验证
		 * @author zhongjyuan
		 * @date   2023年6月5日14:19:28
		 * @email  zhongjyuan@outlook.com
		 * @param {*} from 来自
		 * @returns {Boolean}
		 */
		var win_verify = function(from) {
			var id = from[0];
			var secrete = from[1];

			var win = ZHONGJYUAN.vue.wins[id];
			if (win) {
				if (win.secrete === secrete) {
					return true;
				} else {
					ZHONGJYUAN.vue.win_close(id);
					ZHONGJYUAN.api.message.win(ZHONGJYUAN.api.lang("SecurityRisk"), ZHONGJYUAN.api.lang("SecurityRiskDetail"));
				}
			}

			return false;
		};

		/**
		 * 消息处理
		 * @author zhongjyuan
		 * @date   2023年6月7日11:14:15
		 * @email  zhongjyuan@outlook.com
		 * @param {*} event 事件对象
		 * @returns {Object}
		 */
		var messageHandle = function(event) {
			ZHONGJYUAN.logger.trace("windowMessage.[event] event:${0}", JSON.stringify(event));

			var data = event.originalEvent || event.data;
			if ($.inArray(data.type, [ZHONGJYUAN.static.message.pong, ZHONGJYUAN.static.message.eval, ZHONGJYUAN.static.message.emit]) < 0) {
				ZHONGJYUAN.logger.warn("windowMessage.[event] event type no treatment! ${0}", data.type);
				return;
			}

			var from = data.from;
			var wins = ZHONGJYUAN.vue.wins;

			var id = from[0];
			var win = wins[id];
			if (!win) {
				ZHONGJYUAN.logger.warn("windowMessage.[event] win not exist! ${0}", id);
				return;
			}

			if (!win_verify(from)) {
				ZHONGJYUAN.logger.error("windowMessage.[event] win verify fail! ${0}", JSON.stringify(from));
				return;
			}

			switch (data.type) {
				case ZHONGJYUAN.static.message.pong:
					win.pong = Date.now();
					break;
				case ZHONGJYUAN.static.message.eval:
					// 调用 ZHONGJYUAN.api.win 对象中的指定方法，并将 data.eval.data 作为参数传递给该方法进行处理
					var result = ZHONGJYUAN.api.win[data.eval.method].call(ZHONGJYUAN.api.win, data.eval.data, id);
					(!window.frames[id] && !window.frames[id].postMessage) ||
						window.frames[id].postMessage(
							{
								type: ZHONGJYUAN.static.message.eval,
								result: result,
								session: data.session,
							},
							"*"
						);
					break;
				case ZHONGJYUAN.static.message.emit:
					var target = data.emit.target;

					var sendList = [];
					if (typeof target === "string") {
						sendList.push(target);
					} else if (ZHONGJYUAN.helper.check.isArray(target)) {
						sendList = target;
					} else if (target === true) {
						for (var i in wins) {
							sendList.push(i);
						}
					}

					var parsedFrom = ZHONGJYUAN.helper.url.parseObject(win.urlOrigin);
					sendList.forEach(function(t) {
						var parsedTo = ZHONGJYUAN.helper.url.parseObject(wins[t].urlOrigin);
						!window.frames[t] ||
							window.frames[t].postMessage(
								{
									type: ZHONGJYUAN.static.message.event,
									event: data.emit.event,
									target: sendList,
									data: data.emit.data,
									session: data.session,
									from: id,
									sameOrigin: parsedFrom.protocol === parsedTo.protocol && parsedFrom.host === parsedTo.host && parsedFrom.port === parsedTo.port,
								},
								"*"
							);
					});
					break;
			}
		};

		if (window.attachEvent) {
			window.attachEvent("message", messageHandle);
		} else {
			window.addEventListener("message", messageHandle);
		}

		ZHONGJYUAN.logger.trace("core.[windowOnMessage] end.");
	},
};

/**
 * 增加安全轮询
 * @author zhongjyuan
 * @date   2023年6月9日16:58:17
 * @email  zhongjyuan@outlook.com
 */
setInterval(function() {
	document.addEventListener("keydown", function(event) {
		// 禁止保存 ctrl+s
		if ((event.ctrlKey || event.metaKey) && event.key === "s") {
			event.preventDefault();
			window.alert("当前网站不允许进行此操作，请扫码联系管理员哦！");
		}
		// 禁止 F12 和 Tab 键
		if (event.key === "F12" || event.key === "Tab") {
			event.preventDefault();
			window.alert("当前网站不允许进行此操作，请扫码联系管理员哦！");
		}
	});

	// document.addEventListener("contextmenu", function(event) {
	// 	var target = event.target;
	// 	if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
	// 		event.preventDefault();
	// 		alert("当前网站不允许进行此操作，请扫码联系管理员哦！");
	// 	}
	// });

	// document.addEventListener("copy", function(event) {
	// 	const target = event.target;
	// 	if (!target.matches('input[type="text"], textarea')) {
	// 		event.preventDefault();
	// 		alert("当前网站不允许进行此操作，请扫码联系管理员哦！");
	// 	}
	// });

	// document.addEventListener("cut", function(event) {
	// 	const target = event.target;
	// 	if (!target.matches('input[type="text"], textarea')) {
	// 		event.preventDefault();
	// 		alert("当前网站不允许进行此操作，请扫码联系管理员哦！");
	// 	}
	// });

	// document.addEventListener("paste", function(event) {
	// 	const target = event.target;
	// 	if (!target.matches('input[type="text"], textarea')) {
	// 		event.preventDefault();
	// 		alert("当前网站不允许进行此操作，请扫码联系管理员哦！");
	// 	}
	// });
}, 1000);

/**【1】字母和数字键的键码值(keyCode)
按键	keyCode	按键	keyCode	按键	keyCode	按键	keyCode
A	    65	    J	    74	    S	    83	    1	    49
B	    66	    K	    75	    T	    84	    2	    50
C	    67	    L	    76	    U	    85	    3	    51
D	    68	    M	    77	    V	    86	    4	    52
E	    69	    N	    78	    W	    87	    5	    53
F	    70	    O	    79	    X	    88	    6	    54
G	    71	    P	    80	    Y	    89	    7	    55
H	    72	    Q	    81	    Z	    90	    8	    56
I	    73	    R	    82	    0	    48	    9	    57

【2】数字键盘上的键的键码值(keyCode)
按键	keyCode	按键	keyCode
0	    96	    8	    104
1	    97	    9	    105
2	    98	    *	    106
3	    99	    +	    107
4	    100	    Enter	108
5	    101	    -	    109
6	    102	    .	    110
7	    103	    /	    111

【3】功能键键码值(keyCode)
按键	keyCode	按键	keyCode
F1	    112	    F7	    118
F2	    113	    F8	    119
F3	    114	    F9	    120
F4	    115	    F10	    121
F5	    116	    F11	    122
F6	    117	    F12	    123

【4】控制键键码值(keyCode)
按键	    keyCode	按键	    keyCode	    按键	    keyCode	    按键	keyCode
BackSpace	8	    Esc	        27	    Right Arrow	    39	        -_	    189
Tab	        9	    Spacebar	32	    Dw Arrow	    40	        .>	    190
Clear	    12	    Page Up	    33	    Insert	        45	        /?	    191
Enter	    13	    Page Down	34	    Delete	        46	        `~	    192
Shift	    16	    End	        35	    Num Lock	    144	        [{	    219
Control	    17	    Home	    36	    ;:	            186	        |	    220
Alt	        18	    Left Arrow	37	    =+	            187	        ]}	    221
Cape Lock	20	    Up Arrow	38	    ,<	            188	        '"	    222

【5】多媒体键码值(keyCode)

按键	keyCode
音量加	175
音量减	174
停止	179
静音	173
浏览器	172
邮件	180
搜索	170
收藏	171
 */
