/**
 * 组件对象
 * @author zhongjyuan
 * @date   2023年5月13日18:48:33
 * @email  zhongjyuan@outlook.com
 */
ZHONGJYUAN.component = {
	/**
	 * 生成 fontawesome HTML 代码
	 * @author zhongjyuan
	 * @date   2023年5月15日16:05:15
	 * @email  zhongjyuan@outlook.com
	 * @param {*} name 字体图标名称
	 * @param {*} space 是否在图标后添加空格
	 */
	fontawesomeHtml: function(name, space) {
		if (typeof space === "undefined") {
			space = true;
		}

		return "<i class='fa fa-fw fa-" + name + "'></i>" + (space ? " " : "");
	},

	/**
	 * 提交表单
	 * @author zhongjyuan
	 * @date   2023年5月13日18:49:42
	 * @email  zhongjyuan@outlook.com
	 * @param {*} action 动作
	 * @param {*} params 参数
	 */
	submitForm: function(action, params) {
		// 创建新的 form 元素，并设置属性和位置
		var form = $("<form>", {
			action: action,
			method: "post",
			target: "_self",
			css: { position: "absolute", left: "-9999px", display: "none" },
		});

		// 遍历 params 对象，为每个属性创建 input 元素并添加到 form 中
		$.each(params, function(key, value) {
			$("<input>")
				.attr({
					type: "hidden",
					name: key,
					value: value,
				})
				.appendTo(form);
		});

		// 判断浏览器是否支持非可见元素提交，若不支持则使用 GET 请求代替 POST 请求
		if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
			$("<input>")
				.attr({ type: "hidden", name: "_returnType", value: "get" })
				.appendTo(form);
			form.attr("method", "get");
		}

		// 将 form 元素添加到 body 中，并触发提交事件
		form.appendTo(document.body).submit();

		// 在表单提交后，完成回调函数时删除该元素
		form.remove();
	},

	/**
	 * 加载对象[程序资源加载时展示]
	 * @author zhongjyuan
	 * @date   2023年5月17日15:20:52
	 * @email  zhongjyuan@outlook.com
	 */
	loading: (function() {
		var tpl = `
        <div class="box" id="loading-box">
            <p class="title">
                <span id="loading-software-name"></span
                ><span id="loading-lang-init"></span>
            </p>
            <p id="on-load-file-name">...</p>
            <div class="circle-box">
                <div class="circle"></div>
                <div id="text-percent">0</div>
                <div class="mask right">
                    <div id="loading-right" class="circle right"></div>
                </div>
                <div class="mask left">
                    <div id="loading-left" class="circle left"></div>
                </div>
            </div>
        </div>
        <p id="loading-powered-by"></p>
        `;

		/**加载最大资源数 */
		var loadMax = 5;
		/**加载真实资源数 */
		var loadReal = 5;
		/**加载虚拟资源数 */
		var loadSham = loadMax - loadReal;
		/**加载完成资源数 */
		var loadComplete = 0;
		/**加载消息 */
		var loadMessage = "...";
		/**防撕裂 */
		var flagFifty = false;

		/**加载元素对象 */
		var loadElement;
		/**第一次加载时间 */
		var firstLoadTime;
		/**加载动画轮询载体 */
		var loadingAnimationInterval;
		/**加载虚拟资源轮询载体 */
		var loadShamResourceInterval;
		/**校验加载完成轮询载体 */
		var checkLoadCompleteInterval;

		/**
		 * 加载完成记录
		 * @author zhongjyuan
		 * @date   2023年6月5日16:15:21
		 * @email  zhongjyuan@outlook.com
		 * @param {*} message 加载消息
		 */
		function completeUp(message) {
			loadComplete++;
			if (message) loadMessage = message + "[" + loadComplete + "/" + loadMax + "]";
		}

		/**
		 * 加载动画渲染轮询
		 * @author zhongjyuan
		 * @date   2023年6月5日16:15:45
		 * @email  zhongjyuan@outlook.com
		 */
		function loadAnimationInterval() {
			loadingAnimationInterval = setInterval(function() {
				var percent = parseInt((loadComplete / loadMax) * 100);

				loadElement.querySelector("#on-load-file-name").innerHTML = ZHONGJYUAN.isDebug ? loadMessage : ZHONGJYUAN.api.lang("LoadingStandby");
				loadElement.querySelector("#text-percent").innerHTML = percent + "%";

				//loading动画
				var deg = percent * 3.6;
				var degRight = deg - 180;
				if (degRight > 0) {
					degRight = 0;
				}

				if (!flagFifty && percent >= 50) {
					setTimeout(function() {
						flagFifty = true;
					}, 500);
				}

				var degLeft = deg - 360;
				if (degLeft < -180) {
					degLeft = -180;
				}

				loadElement.querySelector("#loading-right").style.transform = "rotate(" + degRight + "deg)";
				if (flagFifty) {
					loadElement.querySelector("#loading-left").style.transform = "rotate(" + degLeft + "deg)";
				}
			}, 200);
		}

		/**
		 * 加载虚拟资源
		 * @author zhongjyuan
		 * @date   2023年6月5日16:20:51
		 * @email  zhongjyuan@outlook.com
		 */
		function loadShamInterval() {
			loadShamResourceInterval = setInterval(function() {
				if (loadSham > 0) {
					loadSham--;
					loadComplete++;
					loadMessage = "shamResources[" + loadComplete + "/" + loadMax + "]";
				}
			}, 1000);
		}

		/**
		 * 校验是否完成轮询
		 * @author zhongjyuan
		 * @date   2023年6月5日16:21:03
		 * @email  zhongjyuan@outlook.com
		 */
		function checkCompleteInterval() {
			firstLoadTime = Date.now();
			checkLoadCompleteInterval = setInterval(function() {
				var fastLoad = Date.now() - firstLoadTime < 500;
				if (!fastLoad) loadElement.style.opacity = 1;
				if (loadComplete === loadMax) {
					clearInterval(loadShamResourceInterval);
					clearInterval(checkLoadCompleteInterval);
					loadMessage = ZHONGJYUAN.api.lang("LoadingCompleted");
					setTimeout(
						function() {
							clearInterval(loadingAnimationInterval);
							document.getElementById(ZHONGJYUAN.static.custom.rootElement).removeChild(loadElement);
							ZHONGJYUAN.executeLoad();
						},
						fastLoad ? 0 : 1000
					);
				}
			}, 100);
		}

		/**
		 * 展示加载画面
		 * @author zhongjyuan
		 * @date   2023年6月5日16:21:27
		 * @email  zhongjyuan@outlook.com
		 * @param {*} max 最大资源
		 * @param {*} real 真实资源
		 */
		function show(max, real) {
			loadElement = document.createElement("div");
			loadElement.innerHTML = tpl;
			loadElement.setAttribute("id", "loading");

			loadElement.querySelector("#loading-box").style.display = "block";
			loadElement.querySelector("#loading-software-name").innerHTML = ZHONGJYUAN.static.name;
			loadElement.querySelector("#loading-lang-init").innerHTML = ZHONGJYUAN.api.lang("LoadingInitializing");
			loadElement.querySelector("#loading-powered-by").innerHTML = ZHONGJYUAN.api.lang("LoadingPoweredBy");

			document.getElementById(ZHONGJYUAN.static.custom.rootElement).appendChild(loadElement);

			loadMax = max;
			loadReal = real || max;
			loadSham = loadMax - loadReal;
			loadMessage = "...";

			loadAnimationInterval();
			loadShamInterval();
		}

		return {
			show: show,
			completeUp: completeUp,
			checkComplete: checkCompleteInterval,
		};
	})(),

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

			imageElement.src = imgUrl || ZHONGJYUAN.getVariable("weChatImage");
			imageElement.alt = content || ZHONGJYUAN.api.lang("PopUpDefaultContent");
			titleElement.textContent = title || ZHONGJYUAN.api.lang("PopUpDefaultTitle");
			contentElement.innerHTML = content || ZHONGJYUAN.api.lang("PopUpDefaultContent");

			closeButton.addEventListener("click", close);
			window.onclick = function(event) {
				if (event.target == popupElement) {
					close();
				}
			};

			// 将弹窗添加到页面
			document.getElementById(ZHONGJYUAN.static.custom.rootElement).appendChild(popupElement);
		}

		/**
		 * 关闭弹窗
		 * @author zhongjyuan
		 * @date   2023年5月18日14:15:46
		 * @email  zhongjyuan@outlook.com
		 */
		function close() {
			document.getElementById(ZHONGJYUAN.static.custom.rootElement).removeChild(popupElement);
		}

		return {
			open: open,
		};
	})(),

	/**
	 * 登录对象[程序资源加载完成后展示]
	 * @author zhongjyuan
	 * @date   2023年5月18日15:32:36
	 * @email  zhongjyuan@outlook.com
	 */
	login: (function() {
		var tpl = `
        <div id="background">
            <div class="dynamic-background"></div>
            <div class="static-background"></div>
        </div>
        <div id="login-form">
            <div id="login-header">
                <img id="logo" src="./favicon.ico" alt="logo" />
                <h2 id="description">欢迎登录</h2>
            </div>
            <div id="login-body">
                <form>
                    <div class="input-group">
                        <i class="fa fa-mobile"></i>
                        <input id="username" type="text" placeholder="请输入手机号" value="17370115370" />
                    </div>
                    <div class="input-group">
                        <i class="fa fa-lock"></i>
                        <input id="password" type="password" placeholder="请输入密码" value="zhongjyuan" />
                    </div>
                    <div id="captcha-group">
                        <input id="captcha" type="text" placeholder="请输入验证码" />
                        <button id="send-captcha">发送验证码</button>
                    </div>
                    <div id="third-party-login">
                        <span>第三方登录：</span>
                        <i class="fa fa-weixin"></i>
                        <i class="fa fa-qq"></i>
                        <i class="fa fa-weibo"></i>
                    </div>
                    <button id="login-btn">登录</button>
                </form>
            </div>
            <div id="login-footer">
                <span>没有账号？</span>
                <a href="#">立即注册</a>
            </div>
        </div>
        <button id="switch-btn" class="active"><i class="fa fa-pause"></i></button>
        `;

		/**数据对象 */
		var data = { code: 0, message: "登录失败!" };
		/**60秒倒计时 */
		var countdown = 60;

		/**登录元素对象 */
		var loginElement;
		/**背景元素对象 */
		var background;
		/**切换按钮对象 */
		var switchBtn;
		/**登录表单对象 */
		var loginForm;
		/**验证码分组 */
		var captchaGroup;
		/**发送验证码按钮对象 */
		var sendCaptchaBtn;
		/**静态背景对象 */
		var staticBackground;

		/**第三方登录对象 */
		var thirdPartyLogin;
		/**第三方登录图标集 */
		var thirdPartyIcons;

		/**提交按钮对象 */
		var submitBtn;
		/**用户名文本 */
		var userNameInput;
		/**密码文本 */
		var passwordInput;
		/**验证码文本 */
		var captchaInput;

		/**
		 * 切换背景
		 * @author zhongjyuan
		 * @date   2023年5月18日16:22:00
		 * @email  zhongjyuan@outlook.com
		 */
		function switchBackground() {
			if (this.classList.contains("active")) {
				background.classList.add("switched");
				this.classList.replace("active", "inactive");
				switchBtn.innerHTML = '<i class="fa fa-play"></i>';
				const backgroundImage = window.getComputedStyle(staticBackground).backgroundImage;
				ZHONGJYUAN.helper.io.image.toThemeColor(
					backgroundImage.replace(/^url\(["']?/, "").replace(/["']?\)$/, ""),
					function(color) {
						loginForm.style.backgroundColor = color;
					},
					0.8
				);
			} else if (this.classList.contains("inactive")) {
				background.classList.remove("switched");
				this.classList.replace("inactive", "active");
				switchBtn.innerHTML = '<i class="fa fa-pause"></i>';
				loginForm.style.backgroundColor = "#fff";
			}
		}

		/**
		 * 发送验证码
		 * @author zhongjyuan
		 * @date   2023年5月18日16:22:04
		 * @email  zhongjyuan@outlook.com
		 */
		function sendCaptcha() {
			var timer = setInterval(function() {
				countdown--;
				sendCaptchaBtn.innerHTML = "重新发送(" + countdown + ")";
				sendCaptchaBtn.disabled = true;
				if (countdown == 0) {
					clearInterval(timer);
					sendCaptchaBtn.innerHTML = "发送验证码";
					sendCaptchaBtn.disabled = false;
					countdown = 60;
				}
			}, 1000);
		}

		/**
		 * 显示
		 * @author zhongjyuan
		 * @date   2023年5月18日16:22:09
		 * @email  zhongjyuan@outlook.com
		 * @param {*} callback 回调函数
		 */
		function show(callback) {
			loginElement = document.createElement("div");
			loginElement.innerHTML = tpl;
			loginElement.setAttribute("id", "login-container");

			background = loginElement.querySelector("#background");
			switchBtn = loginElement.querySelector("#switch-btn");
			loginForm = loginElement.querySelector("#login-form");
			captchaGroup = loginElement.querySelector("#captcha-group");
			sendCaptchaBtn = loginElement.querySelector("#send-captcha");
			staticBackground = loginElement.querySelector(".static-background");

			/**背景图片 */
			var loginBackgroundImage = ZHONGJYUAN.getVariable("loginBackgroundImage");
			if (loginBackgroundImage) staticBackground.style.backgroundImage = `url(${loginBackgroundImage})`;

			userNameInput = loginElement.querySelector("#username");
			passwordInput = loginElement.querySelector("#password");
			captchaInput = loginElement.querySelector("#captcha");

			/**切换背景按钮 */
			switchBtn.addEventListener("click", switchBackground);

			/**发送验证码按钮 */
			sendCaptchaBtn.addEventListener("click", sendCaptcha);

			/**第三方二维码 */
			thirdPartyLogin = loginElement.querySelector("#third-party-login");
			thirdPartyIcons = thirdPartyLogin.querySelectorAll("i");
			thirdPartyIcons.forEach(function(icon) {
				icon.addEventListener("click", function() {
					thirdPartyIcons.forEach(function(icon) {
						icon.classList.remove("active");
					});
					icon.classList.add("active");
					var index = Array.prototype.indexOf.call(thirdPartyIcons, icon);
					var qrcode = document.createElement("img");
					qrcode.src = ZHONGJYUAN.getVariable("weChatImage");
					qrcode.alt = "qrcode-" + (index + 1);
					qrcode.style.width = "200px";
					qrcode.style.height = "200px";
					qrcode.style.margin = "20px auto";
					var dialog = document.createElement("div");
					dialog.style.position = "fixed";
					dialog.style.top = "0";
					dialog.style.left = "0";
					dialog.style.right = "0";
					dialog.style.bottom = "0";
					dialog.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
					dialog.style.display = "flex";
					dialog.style.justifyContent = "center";
					dialog.style.alignItems = "center";
					dialog.appendChild(qrcode);
					document.body.appendChild(dialog);
					dialog.addEventListener("click", function() {
						document.body.removeChild(dialog);
					});
				});
			});

			/**登录提交按钮 */
			submitBtn = loginElement.querySelector("#login-btn");
			submitBtn.addEventListener("click", function(event) {
				event.preventDefault(); // 阻止默认提交行为
				data.code = 1;
				data.message = "登录成功!";
				data.userName = userNameInput.value;
				data.password = passwordInput.value;
				data.captcha = captchaInput.value;
				if (typeof callback === "function") {
					callback(data);
				}
			});

			document.getElementById(ZHONGJYUAN.static.custom.rootElement).appendChild(loginElement);
		}

		/**
		 * 隐藏
		 * @author zhongjyuan
		 * @date   2023年6月5日16:27:07
		 * @email  zhongjyuan@outlook.com
		 */
		function hide() {
			document.getElementById(ZHONGJYUAN.static.custom.rootElement).removeChild(loginElement);
		}

		return { show: show, hide: hide };
	})(),
};
