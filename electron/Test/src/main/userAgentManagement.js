/**
 * 用户代理管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月15日17:36:35
 */
const userAgentManagement = {
	/**默认用户代理 */
	defaultUserAgent: app.userAgentFallback,

	/**是否存在自定义用户代理设置 */
	hasCustomUserAgent: false,

	/**自定义用户代理 */
	customUserAgent: app.userAgentFallback,

	/**
	 * 获取 Firefox 用户代理
	 * @returns {string} Firefox 用户代理
	 */
	getFirefoxUA: function () {
		/**不同操作系统的根用户代理 */
		const rootUAs = {
			mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:FXVERSION.0) Gecko/20100101 Firefox/FXVERSION.0",
			windows: "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:FXVERSION.0) Gecko/20100101 Firefox/FXVERSION.0",
			linux: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:FXVERSION.0) Gecko/20100101 Firefox/FXVERSION.0",
		};

		/**根据不同操作系统获取相应的根用户代理 */
		let rootUA;

		if (isWindows) {
			rootUA = rootUAs.windows;
		} else if (isMac) {
			rootUA = rootUAs.mac;
		} else {
			rootUA = rootUAs.linux;
		}

		/*
		 * 根据时间计算出合适的 Firefox 版本号，以字符串的形式拼接 Firefox 用户代理
		 * 假设每次发布新版本的时间间隔为 4.1 周，从 2021 年 8 月 10 日开始计算
		 */
		const fxVersion = 91 + Math.floor((Date.now() - 1628553600000) / (4.1 * 7 * 24 * 60 * 60 * 1000));

		return rootUA.replace(/FXVERSION/g, fxVersion);
	},

	/**
	 * 启用谷歌用户代理切换功能
	 * @param {Electron.Session} session - 当前会话
	 */
	enableGoogleUASwitcher: function (session) {
		session.webRequest.onBeforeSendHeaders((details, callback) => {
			// 如果不存在自定义用户代理设置且请求 URL 包括 accounts.google.com，则修改请求头 User-Agent，模拟 Firefox 浏览器访问 Google 账号页面
			if (!userAgentManagement.hasCustomUserAgent && details.url.includes("accounts.google.com")) {
				const url = new URL(details.url);
				if (url.hostname === "accounts.google.com") {
					details.requestHeaders["User-Agent"] = userAgentManagement.getFirefoxUA();
				}
			}

			// 设置额外的请求头信息以模拟 Chromium 浏览器
			const chromiumVersion = process.versions.chrome.split(".")[0];
			details.requestHeaders["SEC-CH-UA"] = `"Chromium";v="${chromiumVersion}", " Not A;Brand";v="99"`;
			details.requestHeaders["SEC-CH-UA-MOBILE"] = "?0";

			callback({ cancel: false, requestHeaders: details.requestHeaders });
		});
	},

	/**
	 * 初始化函数
	 */
	initialize: function () {
		// 如果存在自定义用户代理设置，则使用设置的用户代理，否则对默认用户代理进行处理
		if (settingManagement.get("customUserAgent")) {
			userAgentManagement.hasCustomUserAgent = true;
			userAgentManagement.customUserAgent = settingManagement.get("customUserAgent");
		} else {
			// 默认用户代理处理
			customUserAgent = userAgentManagement.defaultUserAgent
				.replace(/Electron\/\S+\s/, "") // 去除 Electron 标识
				.replace(/ZHONGJYUAN\/\S+\s/, "") // 去除 ZHONGJYUAN 标识
				.replace(
					process.versions.chrome,
					process.versions.chrome
						.split(".")
						.map((v, idx) => (idx === 0 ? v : "0"))
						.join(".")
				); // 将 Chrome 版本号调整为以 0 结尾的格式
		}

		// 设置用户代理
		app.userAgentFallback = userAgentManagement.customUserAgent;

		// 在应用准备就绪时启用谷歌用户代理切换功能
		app.once("ready", function () {
			userAgentManagement.enableGoogleUASwitcher(session.defaultSession);
		});

		// 在每次创建新的会话时启用谷歌用户代理切换功能
		app.on("session-created", userAgentManagement.enableGoogleUASwitcher);
	},
};

userAgentManagement.initialize();