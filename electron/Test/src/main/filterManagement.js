/**引入 ABP 过滤列表解析器模块 */
var parser = require("./exts/abp/filter-parser.js");

/**
 * 过滤拦截管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月15日12:02:39
 */
const filterManagement = {
	/**默认设置 */
	defaultSetting: {
		/**阻挡级别，默认为1 */
		blockingLevel: 1,
		/**需要过滤的内容类型，默认为空数组 */
		contentTypes: [],
		/**异常的域名列表，默认为空数组 */
		exceptionDomains: [],
	},

	/**当前配置 */
	currentSetting: {
		/**阻挡级别，默认为0 */
		blockingLevel: 0,
		/**需要过滤的内容类型，默认为空数组（可选类型有：script, image） */
		contentTypes: [],
		/**异常的域名列表，默认为空数组 */
		exceptionDomains: [],
	},

	/**全局参数 */
	globalParams: [
		// Microsoft 平台使用的参数
		"msclkid",
		// Google 平台使用的参数
		"gclid",
		"dclid",
		// Facebook 平台使用的参数
		"fbclid",
		// Yandex 平台使用的参数
		"yclid",
		"_openstat",
		// Adobe 平台使用的参数
		"icid",
		// Instagram 平台使用的参数
		"igshid",
		// Mailchimp 平台使用的参数
		"mc_eid",
	],

	/**特定网站的参数列表 */
	siteParams: {
		"www.ebay.com": ["_trkparms"],
		"www.amazon.com": ["_ref", "ref_", "pd_rd_r", "pd_rd_w", "pf_rd_i", "pf_rd_m", "pf_rd_p", "pf_rd_r", "pf_rd_s", "pf_rd_t", "pd_rd_wg"],
	},

	/**这个对象用于将 Electron 和 ABP（Adblock Plus）之间不同的资源类型名称进行映射 */
	elementTypeMap: {
		/**主框架资源类型，在 Electron 中称为 mainFrame，在 ABP 中称为 document */
		mainFrame: "document",
		/**子框架资源类型，在 Electron 中称为 subFrame，在 ABP 中称为 subdocument */
		subFrame: "subdocument",
		/**样式表资源类型，在 Electron 中保持不变，在 ABP 中也称为 stylesheet */
		stylesheet: "stylesheet",
		/**脚本资源类型，在 Electron 中保持不变，在 ABP 中也称为 script */
		script: "script",
		/**图像资源类型，在 Electron 中保持不变，在 ABP 中也称为 image */
		image: "image",
		/**对象资源类型，在 Electron 中保持不变，在 ABP 中也称为 object */
		object: "object",
		/**XHR 资源类型，即 XMLHttpRequest，在 Electron 中称为 xhr，在 ABP 中称为 xmlhttprequest */
		xhr: "xmlhttprequest",
		/**其他资源类型，在 Electron 中保持不变，在 ABP 中也称为 other */
		other: "other",
	},

	/**用于跟踪被阻止请求的数量 */
	blockedRequestsCount: 0,

	/**过滤数据对象 */
	filterData: {},

	/**
	 * 从域名字符串中移除 'www.' 前缀
	 * @param {string} domain - 要处理的域名字符串
	 * @returns {string} 处理后的域名字符串
	 */
	removeWWWPrefix: function (domain) {
		return domain.replace(/^www\./i, "");
	},

	/**
	 * 移除跟踪参数
	 * @param {string} url - 要处理的 URL
	 * @returns {string} 处理后的 URL
	 */
	removeTrackingParams: function (url) {
		try {
			/**将 URL 字符串转换为 URL 对象 */
			var urlObj = new URL(url);

			// 遍历 URL 参数
			for (const param of urlObj.searchParams) {
				if (
					filterManagement.globalParams.includes(param[0]) || // 如果全局参数列表中包含该参数
					(filterManagement.siteParams[urlObj.hostname] && filterManagement.siteParams[urlObj.hostname].includes(param[0])) // 或者该网站的参数列表中包含该参数
				) {
					// 则删除该参数
					urlObj.searchParams.delete(param[0]);
				}
			}

			// 返回处理后的 URL 字符串
			return urlObj.toString();
		} catch (e) {
			console.warn(e); // 捕获异常并输出警告信息
			// 返回原始的 URL 字符串
			return url;
		}
	},

	/**
	 * 判断请求是否来自第三方
	 * @param {string} baseDomain - 基础域名
	 * @param {string} requestURL - 请求的 URL
	 * @returns {boolean} 是否来自第三方
	 */
	isRequestFromThirdParty: function (baseDomain, requestURL) {
		// 移除基础域名的 'www.' 前缀
		baseDomain = filterManagement.removeWWWPrefix(baseDomain);

		/**获取请求 URL 的域名，并移除 'www.' 前缀 */
		var requestDomain = filterManagement.removeWWWPrefix(parser.getUrlHost(requestURL));

		// 判断基础域名和请求域名是否相同，如果相同则不是第三方请求，返回 false
		// 如果不相同，则判断两个域名的主机是否为同源，如果是同源则不是第三方请求，返回 false
		// 如果都不满足，则认为是第三方请求，返回 true
		return !(parser.isSameOriginHost(baseDomain, requestDomain) || parser.isSameOriginHost(requestDomain, baseDomain));
	},

	/**
	 * 检查请求域名是否在异常域名列表中
	 * @param {string} domain - 要检查的域名
	 * @returns {boolean} 是否在异常域名列表中
	 */
	isRequestDomainException: function (domain) {
		// 移除 'www.' 前缀并判断是否在异常域名列表中
		return filterManagement.currentSetting.exceptionDomains.includes(filterManagement.removeWWWPrefix(domain));
	},

	/**
	 * 过滤弹出窗口
	 * @param {string} url - 要过滤的 URL
	 * @returns {boolean} 是否过滤该 URL
	 */
	filterPopups: function (url) {
		// 如果 URL 不以 'http://' 或 'https://' 开头，则认为是不安全的，需要过滤
		if (!/^https?:\/\//i.test(url)) {
			return true;
		}

		/**获取 URL 的域名 */
		const domain = parser.getUrlHost(url);

		// 如果阻止级别大于 0 且域名不在异常列表中，则继续判断
		if (filterManagement.currentSetting.blockingLevel > 0 && !filterManagement.isRequestDomainException(domain)) {
			// 如果阻止级别为 2 或者为 1 但请求来自第三方，则继续判断
			if (
				filterManagement.currentSetting.blockingLevel === 2 ||
				(filterManagement.currentSetting.blockingLevel === 1 && filterManagement.isRequestFromThirdParty(domain, url))
			) {
				// 如果 URL 符合弹出窗口过滤规则，则阻止该请求
				if (parser.matches(filterManagement.filterData, url, { domain: domain, elementType: "popup" })) {
					filterManagement.blockedRequestsCount++;
					return false;
				}
			}
		}

		// URL 不符合任何过滤规则，返回 true 继续加载该请求
		return true;
	},

	/**
	 * 处理网络请求的逻辑
	 * @param {*} details - 请求的详细信息，包括 URL、资源类型、请求头等
	 * @param {*} callback - 回调函数，用于返回处理后的请求信息
	 */
	handleRequest: function (details, callback) {
		/**请求域名 */
		let domain;

		// 如果该请求是主框架或子框架，则可能不存在 webContentsId
		if (details.webContentsId) {
			// 获取请求的域名
			domain = parser.getUrlHost(webContents.fromId(details.webContentsId).getURL());
		}

		/**判断该域名是否是异常域名 */
		const isExceptionDomain = domain && filterManagement.isRequestDomainException(domain);

		// 根据设定的过滤选项和例外域名，对 URL 进行处理，并根据处理结果决定是否阻止请求或重定向请求
		/**处理后的请求 URL */
		const modifiedURL =
			filterManagement.currentSetting.blockingLevel > 0 && !isExceptionDomain ? filterManagement.removeTrackingParams(details.url) : details.url;

		// 如果请求不是以 "http://" 或 "https://" 开头，或者是主框架的资源类型（mainFrame），则不进行处理，直接返回原始请求信息
		if (!(details.url.startsWith("http://") || details.url.startsWith("https://")) || details.resourceType === "mainFrame") {
			callback({
				cancel: false,
				requestHeaders: details.requestHeaders,
				redirectURL: modifiedURL !== details.url ? modifiedURL : undefined,
			});
			return;
		}

		// 如果设定了需要屏蔽的内容类型（如 JavaScript 或图片），则根据资源类型判断是否需要取消请求
		if (filterManagement.currentSetting.contentTypes.length > 0) {
			for (var i = 0; i < filterManagement.currentSetting.contentTypes.length; i++) {
				if (details.resourceType === filterManagement.currentSetting.contentTypes[i]) {
					callback({
						cancel: true,
						requestHeaders: details.requestHeaders,
					});
					return;
				}
			}
		}

		// 如果设定了阻止级别大于 0，并且不是例外域名，根据阻止级别和是否为第三方请求，以及匹配过滤规则的结果，决定是否取消请求
		if (filterManagement.currentSetting.blockingLevel > 0 && !isExceptionDomain) {
			if (
				(filterManagement.currentSetting.blockingLevel === 1 && (!domain || filterManagement.isRequestFromThirdParty(domain, details.url))) ||
				filterManagement.currentSetting.blockingLevel === 2
			) {
				var matchesFilters = parser.matches(filterManagement.filterData, details.url, {
					domain: domain,
					elementType: filterManagement.elementTypeMap[details.resourceType],
				});

				if (matchesFilters) {
					filterManagement.blockedRequestsCount++;

					callback({
						cancel: true,
						requestHeaders: details.requestHeaders,
					});
					return;
				}
			}
		}

		// 最后，通过回调函数返回处理后的请求信息，包括是否取消请求、是否重定向请求、以及可能修改后的请求头信息
		callback({
			cancel: false,
			requestHeaders: details.requestHeaders,
			redirectURL: modifiedURL !== details.url ? modifiedURL : undefined,
		});
	},

	/**
	 * 在指定会话（session）上注册网络请求过滤器，该函数接受一个参数 ses，表示要注册过滤器的会话对象
	 * 该函数通过 ses.webRequest.onBeforeRequest 方法注册一个处理网络请求的回调函数 handleRequest
	 * @param {*} session - 要注册过滤器的会话对象
	 */
	registerRequestFilter: function (session) {
		// 使用 session.webRequest.onBeforeRequest 方法注册一个处理网络请求的回调函数 handleRequest
		session.webRequest.onBeforeRequest(filterManagement.handleRequest);
	},

	/**
	 * 设置过滤选项
	 * @param {Object} settings - 过滤选项设置
	 *   - contentTypes {Array} - 需要屏蔽的资源类型（如 JavaScript 或图片）
	 *   - blockingLevel {number} - 阻止级别，可取值为 0、1 或 2，其中 0 表示不阻止任何请求，
	 *                             1 表示只阻止第三方请求，2 表示阻止所有请求
	 *   - exceptionDomains {Array} - 例外域名，即不进行处理的域名列表
	 */
	setFilteringSettings: function (settings) {
		// 如果没有传入 settings，则将其设为一个空对象
		if (!settings) {
			settings = {};
		}

		// 将传入的 settings 与默认设置 defaultFilteringSettings 进行合并，确保所有属性都被正确设置
		for (var key in filterManagement.defaultSetting) {
			if (settings[key] === undefined) {
				settings[key] = filterManagement.defaultSetting[key];
			}
		}

		// 如果需要阻止请求，并且当前还未初始化过过滤列表，则初始化一次
		if (settings.blockingLevel > 0 && !(filterManagement.currentSetting.blockingLevel > 0)) {
			filterManagement.initializeFilters();
		}

		// 更新过滤选项中需要屏蔽的资源类型、阻止级别和例外域名列表
		filterManagement.currentSetting.contentTypes = settings.contentTypes;
		filterManagement.currentSetting.blockingLevel = settings.blockingLevel;
		filterManagement.currentSetting.exceptionDomains = settings.exceptionDomains.map((d) => filterManagement.removeWWWPrefix(d));
	},

	/**
	 * 初始化过滤列表
	 */
	initializeFilters: function () {
		// 清除旧数据，以防止冲突
		filterManagement.filterData = {};

		// 读取并解析 ext/volley/volley.txt 文件
		fs.readFile(path.join(__dirname, "ext/volley/volley.txt"), "utf8", function (err, data) {
			if (err) {
				return; // 如果发生错误，不进行任何操作
			}
			parser.parse(data, filterManagement.filterData);
		});

		// 读取并解析 ext/volley/default.txt 文件
		fs.readFile(path.join(__dirname, "ext/volley/default.txt"), "utf8", function (err, data) {
			if (err) {
				return; // 如果发生错误，不进行任何操作
			}
			parser.parse(data, filterManagement.filterData);
		});

		// 读取并解析用户数据目录下的 customFilters.txt 文件
		fs.readFile(path.join(app.getPath("userData"), "customVolleys.txt"), "utf8", function (err, data) {
			if (!err && data) {
				parser.parse(data, filterManagement.filterData);
			}
		});
	},

	/**
	 * 初始化函数，包括定时器、注册网络过滤器和监听设置变化等操作
	 */
	initialize: function () {
		// 每隔一分钟定时执行的函数
		setInterval(function () {
			// 如果有未保存的被阻止请求数量
			if (filterManagement.blockedRequestsCount > 0) {
				/**获取当前系统中已保存的被阻止请求数量 */
				var current = settingManagement.get("filteringBlockedCount");

				// 如果当前数量不存在，则初始化为 0
				if (!current) {
					current = 0;
				}

				// 将未保存的被阻止请求数量累加到系统设置中
				settingManagement.set("filteringBlockedCount", current + filterManagement.blockedRequestsCount);

				// 将未保存的被阻止请求数量重置为零
				filterManagement.blockedRequestsCount = 0;
			}
		}, 60000); // 60秒（即一分钟）的时间间隔

		// 当应用程序准备就绪时，注册网络过滤器到默认会话上
		app.once("ready", function () {
			filterManagement.registerRequestFilter(session.defaultSession);
		});

		// 当新的会话创建时，注册网络过滤器
		app.on("session-created", filterManagement.registerRequestFilter);

		// 监听设置中的 "filtering" 项的变化
		settingManagement.listen("filtering", function (value) {
			if (value && typeof value.trackers === "boolean") {
				if (value.trackers === true) {
					value.blockingLevel = 2;
				} else if (value.trackers === false) {
					value.blockingLevel = 0;
				}
				delete value.trackers;
				settingManagement.set("filtering", value);
			}

			// 根据获取到的值设置过滤选项
			filterManagement.setFilteringSettings(value);
		});
	},
};

// 初始化设置管理模块
filterManagement.initialize();