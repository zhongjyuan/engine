const path = require("path");
const punycode = require("punycode");

/**顶级域名列表 */
const sites = require("../../../exts/site/sites.json");
/**公共后缀列表 */
const suffixes = require("../../../exts/suffix/suffixes.json");

const searchEngine = require("./searchEngine.js");
const hostManagement = require("./hostManagement.js");

/**
 * URL管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月19日19:39:35
 */
const urlManagement = {
	/** www前缀正则匹配 */
	wwwRegex: /^www\./,

	/** 用于判断是否为合法的IPv4地址的正则表达式 */
	validIP4Regex: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/i,

	/** 用于判断是否为合法域名的正则表达式 */
	validDomainRegex: /^(?!-)(?:.*@)*?([a-z0-9-._]+[a-z0-9]|\[[:a-f0-9]+\])/i,

	/** 用于判断是否为Unicode字符的正则表达式 */
	unicodeRegex: /[^\u0000-\u00ff]/,

	/** 用于去除URL中的协议部分的正则表达式 */
	removeProtocolRegex: /^(https?|file):\/\//i,

	/** 用于匹配URL中的协议部分的正则表达式 */
	protocolRegex: /^[a-z0-9]+:\/\//, // URI schemes can be alphanum

	/**
	 * 去除域名前的www
	 * @param {*} domain 域名
	 * @returns 处理后的域名
	 */
	removeWWW: function (domain) {
		return domain.startsWith("www.") ? domain.slice(4) : domain;
	},

	/**
	 * 去除URL末尾的斜杠
	 * @param {*} url URL
	 * @returns 处理后的URL
	 */
	removeTrailingSlash: function (url) {
		return url.endsWith("/") ? url.slice(0, -1) : url;
	},

	/**
	 * 判断给定的字符串是否为URL
	 * @param {*} url 字符串
	 * @returns 是否为URL
	 */
	isURL: function (url) {
		return urlManagement.protocolRegex.test(url) || url.indexOf("about:") === 0 || url.indexOf("chrome:") === 0 || url.indexOf("data:") === 0;
	},

	/**
	 * 判断URL是否为内部URL
	 * @param {*} url URL
	 * @returns 是否为内部URL
	 */
	isInternalURL: function (url) {
		return url.startsWith(urlManagement.getFileURL(__dirname));
	},

	/**
	 * 判断给定的字符串是否为可能的URL
	 * @param {*} url 字符串
	 * @returns 是否为可能的URL
	 */
	isPossibleURL: function (url) {
		if (urlManagement.isURL(url)) {
			return true;
		} else {
			if (url.indexOf(" ") >= 0) {
				return false;
			}
		}

		const domain = urlManagement.getDomain(url);

		return hostManagement.hosts.includes(domain);
	},

	/**
	 * 判断URL是否缺少协议部分
	 * @param {*} url URL
	 * @returns 是否缺少协议部分
	 */
	isURLMissingProtocol: function (url) {
		return !urlManagement.protocolRegex.test(url);
	},

	/**
	 * 检查URL是否支持HTTPS升级
	 * @param {*} url URL
	 * @returns 是否支持HTTPS升级
	 */
	isHTTPSUpgreadable: function (url) {
		// TODO：解析并删除所有子域，只保留父域和顶级域名
		const domain = urlManagement.removeWWW(urlManagement.getDomain(url)); // 列表中没有子域

		// 检查域名是否在支持HTTPS升级的网站列表中
		return sites.includes(domain);
	},

	/**
	 * 去除URL中的协议部分
	 * @param {*} url URL
	 * @returns 去除协议部分后的URL
	 */
	removeProtocol: function (url) {
		if (!urlManagement.isURL(url)) {
			return url;
		}

		return url.replace(urlManagement.removeProtocolRegex, "");
	},

	/**
	 * 获取基本的URL，去除协议和末尾斜杠
	 * @param {*} url URL
	 * @returns 基本URL
	 */
	basicURL: function (url) {
		return urlManagement.removeWWW(urlManagement.removeProtocol(urlManagement.removeTrailingSlash(url)));
	},

	/**
	 * 获取格式化的URL，去除协议、去除www、去除末尾斜杠
	 * @param {*} url URL
	 * @returns 格式化后的URL
	 */
	prettyURL: function (url) {
		try {
			var urlOBJ = new URL(url);
			return urlManagement.removeWWW(urlManagement.removeTrailingSlash(urlOBJ.hostname + urlOBJ.pathname));
		} catch (e) {
			// URL constructor will throw an error on malformed URLs
			return url;
		}
	},

	/**
	 * 获取域名
	 * @param {*} url URL
	 * @returns 域名
	 */
	getDomain: function (url) {
		// 去掉协议部分，保留域名及其后续内容
		url = urlManagement.removeProtocol(url);

		// 使用正则表达式将URL按照斜杠和冒号分割，并取第一部分作为域名
		return url.split(/[/:]/)[0].toLowerCase();
	},

	/**
	 * 验证域名是否合法
	 * @param {*} domain 域名
	 * @returns 是否合法
	 */
	validateDomain: function (domain) {
		// 如果域名包含Unicode字符，则转换为ASCII格式
		domain = urlManagement.unicodeRegex.test(domain) ? punycode.toASCII(domain) : domain;

		// 使用正则表达式检查域名是否符合规范
		if (!urlManagement.validDomainRegex.test(domain)) {
			return false;
		}
		const cleanDomain = RegExp.$1;
		// 检查域名长度是否超过255个字符
		if (cleanDomain.length > 255) {
			return false;
		}

		// 检查域名是否为IPv4/IPv6地址或已知主机名
		if (
			urlManagement.validIP4Regex.test(cleanDomain) ||
			(cleanDomain.startsWith("[") && cleanDomain.endsWith("]")) ||
			hostManagement.hosts.includes(cleanDomain)
		) {
			return true;
		}
		// 检查域名是否有公共后缀
		return suffixes.find((s) => cleanDomain.endsWith(s)) !== undefined;
	},

	/**
	 * 解析URL
	 * @param {*} url URL
	 * @returns 解析后的URL
	 */
	parse: function (url) {
		// 去除首尾空格
		url = url.trim();

		// 如果URL为空，则返回about:blank页面
		if (!url) {
			return "about:blank";
		}

		// 如果URL以view-source:开头，则递归调用解析函数并加上view-source:前缀
		if (url.indexOf("view-source:") === 0) {
			var realURL = url.replace("view-source:", "");
			return "view-source:" + urlManagement.parse(realURL);
		}

		// 如果URL以 z:开头，则将其转化为正确的 file:// 地址
		if (url.startsWith("z:")) {
			try {
				var urlObj = new URL(url);
				var pathname = urlObj.pathname.replace("//", "");
				if (/^[a-zA-Z]+$/.test(pathname)) {
					// 只允许字母路径
					return urlManagement.getFileURL(path.join(__dirname, "pages", pathname, "index.html") + urlObj.search);
				}
			} catch (e) {}
		}

		// 如果URL以支持的协议开头，且不是内部URL，则优先使用HTTPS协议
		if (urlManagement.isURL(url)) {
			if (!urlManagement.isInternalURL(url) && url.startsWith("http://")) {
				const noProtoURL = urlManagement.removeProtocol(url);

				if (urlManagement.isHTTPSUpgreadable(noProtoURL)) {
					return "https://" + noProtoURL;
				}
			}
			return url;
		}

		// 如果URL不包含协议，并且是一个有效的域名，则优先使用HTTPS协议
		if (urlManagement.isURLMissingProtocol(url) && urlManagement.validateDomain(urlManagement.getDomain(url))) {
			if (urlManagement.isHTTPSUpgreadable(url)) {
				// 检查是否支持HTTPS
				return "https://" + url;
			}
			return "http://" + url;
		}

		// 否则，使用当前的搜索引擎进行搜索
		return searchEngine.getCurrent().searchURL.replace("%s", encodeURIComponent(url));
	},

	/**
	 * 获取源URL，用于将内部URL转换为展示的URL
	 * @param {*} url URL
	 * @returns 源URL
	 */
	getSourceURL: function (url) {
		// 将内部URL（如PDF查看器或阅读器视图）转换为它们所显示页面的URL
		if (urlManagement.isInternalURL(url)) {
			var representedURL;
			try {
				// 从URL的查询参数中获取表示的URL
				representedURL = new URLSearchParams(new URL(url).search).get("url");
			} catch (e) {}
			if (representedURL) {
				return representedURL;
			} else {
				try {
					// 获取页面名称和URL对象
					var pageName = url.match(/\/pages\/([a-zA-Z]+)\//);
					var urlObj = new URL(url);
					if (pageName) {
						// 使用 z: 协议构造内部URL
						return "z://" + pageName[1] + urlObj.search;
					}
				} catch (e) {}
			}
		}

		return url;
	},

	/**
	 * 获取文件URL
	 * @param {*} path 文件路径
	 * @returns 文件URL
	 */
	getFileURL: function (path) {
		// 如果是Windows系统，则将反斜杠转换为正斜杠，并使用正确的 file://格式
		if (window.platformType === "windows") {
			// 将反斜杠替换为正斜杠
			path = path.replace(/\\/g, "/");
			// https://blogs.msdn.microsoft.com/ie/2006/12/06/file-uris-in-windows/

			// UNC路径
			if (path.startsWith("//")) {
				return encodeURI("file:" + path);
			} else {
				return encodeURI("file:///" + path);
			}
		} else {
			// 否则，直接使用file://格式
			return encodeURI("file://" + path);
		}
	},
};

module.exports = urlManagement;
