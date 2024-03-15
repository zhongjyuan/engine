import "../../css/core/core-grid.css";

import "../../css/component/popup.css";

import favicon from "../../../../favicon.ico";
import gif_error_0 from "../../image/error/0.gif";
import png_error_0 from "../../image/error/0.png";
import gif_404_0 from "../../image/404/0.gif";
import png_404_0 from "../../image/404/0.png";
import png_404_1 from "../../image/404/1.png";
import weChatImage from "../../image/wechat.png";

/**
 * 应用处理对象[应用需要引入该对象]
 * @author zhongjyuan
 * @date   2023年6月7日19:13:38
 * @email  zhongjyuan@outlook.com
 */
window.ZHONGJYUANWIN = {
	/**
	 * 父级处理对象
	 * @author zhongjyuan
	 * @date   2023年6月28日16:06:51
	 * @email  zhongjyuan@outlook.com
	 */
	_ZHONGJYUAN: null,

	/**
	 * 创建完成
	 * @author zhongjyuan
	 * @date   2023年6月8日11:40:49
	 * @email  zhongjyuan@outlook.com
	 */
	_created: false,

	/**
	 * 唯一标识计量
	 * @author zhongjyuan
	 * @date   2023年6月8日11:40:27
	 * @email  zhongjyuan@outlook.com
	 */
	_idCounter: 0,

	/**
	 * 回调函数对象[执行事件回调]
	 * @author zhongjyuan
	 * @date   2023年6月8日11:40:34
	 * @email  zhongjyuan@outlook.com
	 */
	_callbacks: {},

	/**
	 * 回调函数[ready时回调]
	 * @author zhongjyuan
	 * @date   2023年6月8日11:40:44
	 * @email  zhongjyuan@outlook.com
	 */
	_callbackReady: null,

	/**
	 * 回调函数[监听到事件时回调]
	 * @author zhongjyuan
	 * @date   2023年6月8日11:40:55
	 * @email  zhongjyuan@outlook.com
	 */
	_callbackEvent: function() {},

	/**
	 * 窗体唯一标识
	 * @author zhongjyuan
	 * @date   2023年6月8日11:41:16
	 * @email  zhongjyuan@outlook.com
	 */
	id: "",

	/**
	 * 窗体密钥
	 * @author zhongjyuan
	 * @date   2023年6月8日11:41:20
	 * @email  zhongjyuan@outlook.com
	 */
	secrete: "",

	/**
	 * 窗体在被创造时赋予的数据，常被用于窗体通信。
	 * @author zhongjyuan
	 * @date   2023年6月8日11:41:23
	 * @email  zhongjyuan@outlook.com
	 */
	data: null,

	/**
	 * 历史地址
	 * @author zhongjyuan
	 * @date   2023年6月8日11:41:27
	 * @email  zhongjyuan@outlook.com
	 */
	oldUrl: "",

	/**
	 * 准备处理
	 * @author zhongjyuan
	 * @date   2023年6月8日11:41:32
	 * @email  zhongjyuan@outlook.com
	 * @param {*} callback 回调函数
	 * @returns
	 */
	onReady: function(callback) {
		if (!window.parent || !window.parent.ZHONGJYUAN) {
			this.popup.open("该应用暂不支持单独打开</br>请前往<a href='http://zhongjyuan.club'>云桌面</a>用浏览器打开</br>或者扫码快速反馈-v-");
			return;
		}
		this._ZHONGJYUAN = window.parent.ZHONGJYUAN;

		this._ZHONGJYUAN.logger.trace("win.[onReady]");
		if (this._callbackReady === false) {
			this._ZHONGJYUAN.logger.warn("win.[onReady] ready completed.");
			return;
		}

		if (!callback) {
			callback = function() {};
		}

		this._callbackReady = callback;
	},

	/**
	 * 事件处理
	 * @author zhongjyuan
	 * @date   2023年6月8日12:10:48
	 * @email  zhongjyuan@outlook.com
	 * @param {*} callback 回调函数
	 */
	onEvent: function(callback) {
		this._ZHONGJYUAN.logger.trace("win.[onEvent]");
		this._callbackEvent = callback;
	},

	/**
	 * 触发事件
	 * @author zhongjyuan
	 * @date   2023年6月8日12:10:55
	 * @email  zhongjyuan@outlook.com
	 * @param {*} event 事件名称
	 * @param {*} data 事件数据
	 * @param {*} target 事件目标
	 */
	emit: function(event, data, target) {
		this._ZHONGJYUAN.logger.trace(
			"win.[onEvent] event:${0};data:${1};target:${2}",
			JSON.stringify(event),
			JSON.stringify(data),
			JSON.stringify(target)
		);
		var session = this._idCounter++;
		parent.postMessage(
			{
				from: [ZHONGJYUANWIN.id, ZHONGJYUANWIN.secrete],
				type: this._ZHONGJYUAN.static.message.emit,
				session: session,
				emit: {
					event: event,
					data: data,
					target: target,
				},
			},
			"*"
		);
	},

	/**
	 * 执行事件
	 * @author zhongjyuan
	 * @date   2023年6月8日12:11:01
	 * @email  zhongjyuan@outlook.com
	 * @param {*} method 执行方法名
	 * @param {*} data 执行数据
	 * @param {*} callback 回调函数
	 */
	eval: function(method, data, callback) {
		this._ZHONGJYUAN.logger.trace("win.[eval] method:${0};data:${1};callback", method, JSON.stringify(data));
		var session = this._idCounter++;
		this._callbacks[session] = callback;
		parent.postMessage(
			{
				from: [ZHONGJYUANWIN.id, ZHONGJYUANWIN.secrete],
				type: this._ZHONGJYUAN.static.message.eval,
				session: session,
				eval: {
					method: method,
					data: data,
				},
			},
			"*"
		);
	},

	/**
	 * 获取Win数据
	 * @author zhongjyuan
	 * @date   2023年6月8日12:11:07
	 * @email  zhongjyuan@outlook.com
	 * @param {*} winId
	 * @returns
	 */
	winData: function(winId) {
		this._ZHONGJYUAN.logger.trace("win.[winData] winId:${0}", winId);
		try {
			var win = this._ZHONGJYUAN.vue.wins[winId];
			if (!win) {
				return null;
			}

			var iframeId = win.iframeId;
			var iframe = parent.document.getElementById(iframeId);
			if (!iframe) {
				return null;
			}

			this._ZHONGJYUAN.logger.debug("win.[winData] result:${0}", JSON.stringify(iframe.contentWindow));
			return iframe.contentWindow;
		} catch (e) {
			this._ZHONGJYUAN.logger.error("win.[winData] ${0}", JSON.stringify(e));
		}
	},

	/**
	 * 打开
	 * @author zhongjyuan
	 * @date   2023年6月8日12:11:12
	 * @email  zhongjyuan@outlook.com
	 * @param {*} url
	 */
	open: function(url) {
		this._ZHONGJYUAN.logger.trace("win.[open] url:${0}", url);
		this.eval(this._ZHONGJYUAN.static.win.method.OPEN_APP, [
			{
				url: url,
			},
		]);
	},

	/**
	 * 跳转
	 * @author zhongjyuan
	 * @date   2023年6月19日11:21:49
	 * @email  zhongjyuan@outlook.com
	 * @param {*} url
	 */
	jump: function(url) {
		this._ZHONGJYUAN.logger.trace("win.[jump] url:${0}", url);
		if (this.id) {
			this.eval(this._ZHONGJYUAN.static.win.method.SET_WIN_ATTRIBUTE, {
				url: url,
				urlBar: url,
			});
		} else {
			try {
				location.href = url;
			} catch (e) {
				alert("不正确的地址");
			}
		}
	},

	/**
	 * 窗体消息监听
	 * @author zhongjyuan
	 * @date   2023年6月7日15:06:09
	 * @email  zhongjyuan@outlook.com
	 */
	winOnMessage: function() {
		if (!window.parent || !window.parent.ZHONGJYUAN) {
			return;
		}
		this._ZHONGJYUAN = window.parent.ZHONGJYUAN;

		this._ZHONGJYUAN.logger.trace("core.[winOnMessage] begin.");

		var messageHandle = function(event) {
			ZHONGJYUANWIN._ZHONGJYUAN.logger.trace("winMessage.[event] event:${0}", JSON.stringify(event));

			var data = event.data;
			switch (data.type) {
				case ZHONGJYUANWIN._ZHONGJYUAN.static.message.ping:
					if (ZHONGJYUANWIN.id) {
						parent.postMessage(
							{
								from: [ZHONGJYUANWIN.id, ZHONGJYUANWIN.secrete],
								type: ZHONGJYUANWIN._ZHONGJYUAN.static.message.pong,
							},
							"*"
						);

						if (ZHONGJYUANWIN._callbackReady) {
							var result = ZHONGJYUANWIN._callbackReady(); //执行ready的回调
							ZHONGJYUANWIN._callbackReady = false; //清空ready
							if (result !== false) {
								ZHONGJYUANWIN.emit(ZHONGJYUANWIN._ZHONGJYUAN.static.message.readyEmit, null, true); //发送ready事件
							}
						}

						if (!ZHONGJYUANWIN._created) {
							ZHONGJYUANWIN.eval(ZHONGJYUANWIN._ZHONGJYUAN.static.win.method.WIN_DATA, {}, function(data) {
								if (data.title === "") {
									ZHONGJYUANWIN.eval(ZHONGJYUANWIN._ZHONGJYUAN.static.win.method.SET_WIN_ATTRIBUTE, { title: document.title });
								}
							});

							//F5屏蔽大法
							var check = function(event) {
								event = event || window.event;
								if ((event.which || event.keyCode) === 116) {
									if (event.preventDefault) {
										event.preventDefault();
										ZHONGJYUANWIN.eval(ZHONGJYUANWIN._ZHONGJYUAN.static.win.method.REFRESH, ZHONGJYUANWIN.id);
									} else {
										event.keyCode = 0;
										event.returnValue = false;
										ZHONGJYUANWIN.eval(ZHONGJYUANWIN._ZHONGJYUAN.static.win.method.REFRESH, ZHONGJYUANWIN.id);
									}
								}
							};

							if (document.addEventListener) {
								document.addEventListener("keydown", check, false);
							} else {
								document.attachEvent("onkeydown", check);
							}

							ZHONGJYUANWIN._created = true;
						}
					} else {
						ZHONGJYUANWIN.id = data.id;
						ZHONGJYUANWIN.secrete = data.secrete;
						ZHONGJYUANWIN.data = data.data;

						//实时更新url
						var url = location.href;
						if (ZHONGJYUANWIN.oldUrl !== url) {
							ZHONGJYUANWIN.oldUrl = url;
							ZHONGJYUANWIN.eval(ZHONGJYUANWIN._ZHONGJYUAN.static.win.method.SET_URL_BAR, url);
						}
					}
					break;
				case ZHONGJYUANWIN._ZHONGJYUAN.static.message.eval:
					var session = data.session;
					var result = data.result;
					if (ZHONGJYUANWIN._callbacks[session]) {
						ZHONGJYUANWIN._callbacks[session](result);
					}
					break;
				case ZHONGJYUANWIN._ZHONGJYUAN.static.message.event:
					ZHONGJYUANWIN._callbackEvent(data);
					break;
			}
		};

		if (window.attachEvent) {
			window.attachEvent("message", messageHandle);
		} else {
			window.addEventListener("message", messageHandle);
		}
		this._ZHONGJYUAN.logger.trace("core.[winOnMessage] end.");
	},

	/**
	 * 弹窗对象[需要弹层提示信息时展示]
	 * @author zhongjyuan
	 * @date   2023年5月18日14:14:26
	 * @email  zhongjyuan@outlook.com
	 */
	popup: (function() {
		var tpl = `
			<div class="titlebar">
				<span class="title"></span>
				<button class="close" title="关闭">&times;</button>
			</div>
			<div class="content">
				<img alt="" />
				<p></p>
			</div>
			`;

		/**弹窗元素对象 */
		var popupElement;

		/**关闭按钮对象 */
		var closeButton;
		/**标题元素对象 */
		var titleElement;
		/**图片元素对象 */
		var imageElement;
		/**正文元素对象 */
		var contentElement;
		/**标题栏元素对象 */
		var titlebarElement;

		/**
		 * 增加渐变色动画背景
		 * @author zhongjyuan
		 * @date   2023年6月26日18:02:32
		 * @email  zhongjyuan@outlook.com
		 */
		function addGradientAnimation() {
			const backgrounds = document.getElementsByClassName("animatedBackground");
			if (backgrounds.length > 0) return;

			const newBackground = document.createElement("div");
			newBackground.className = "animatedBackground";
			document.body.appendChild(newBackground);
		}

		/**
		 * 打开弹窗
		 * @author zhongjyuan
		 * @date   2023年5月16日19:07:54
		 * @email  zhongjyuan@outlook.com
		 * @param {*} content 正文
		 * @param {*} title 标题
		 * @param {*} imgUrl 图片地址
		 * @param {*} barColor 头部颜色
		 */
		function open(content, title, imgUrl, barColor) {
			addGradientAnimation();

			popupElement = document.createElement("div");
			popupElement.innerHTML = tpl;
			popupElement.setAttribute("class", "popup-container");

			titlebarElement = popupElement.querySelector(".titlebar");
			closeButton = popupElement.querySelector(".close");
			titleElement = popupElement.querySelector(".title");
			imageElement = popupElement.querySelector("img");
			contentElement = popupElement.querySelector("p");

			if (barColor) {
				titlebarElement.style.backgroundColor = barColor;
			}

			imageElement.src = imgUrl || weChatImage;
			imageElement.alt = "系统出现异常,请扫码联系管理员!";
			titleElement.textContent = title || "系统提醒";
			contentElement.innerHTML = content || "系统出现异常,请扫码联系管理员!";

			closeButton.addEventListener("click", close);
			window.onclick = function(event) {
				if (event.target == popupElement) {
					close();
				}
			};

			// 将弹窗添加到页面
			document.body.appendChild(popupElement);
		}

		/**
		 * 关闭弹窗
		 * @author zhongjyuan
		 * @date   2023年5月18日14:15:46
		 * @email  zhongjyuan@outlook.com
		 */
		function close() {
			document.body.removeChild(popupElement);
		}

		return {
			open: open,
		};
	})(),
};

ZHONGJYUANWIN.winOnMessage();
