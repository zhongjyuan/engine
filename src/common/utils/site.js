import logger from "../logManagement";

export default {
	reload: logger.decorator(reload, "tool-reload"),
	domain: logger.decorator(domain, "tool-domain"),
	isSiteUrl: logger.decorator(isSiteUrl, "tool-is-site-url"),
	currentUrl: logger.decorator(currentUrl, "tool-current-url"),
	currentTitle: logger.decorator(currentTitle, "tool-current-title"),
	openFullscreen: logger.decorator(openFullscreen, "tool-open-fullscreen"),
	closeFullscreen: logger.decorator(closeFullscreen, "tool-close-fullscreen"),
};

/**
 * 根据主机名提取域名信息
 * @param {string} [hostname] 主机名或URL，默认为当前页面的主机名
 * @returns {string} 域名信息（以'.'开头）
 *
 * @example
 * domain(); // '.zhongjyuan.com'
 *
 * @example
 * domain('www.zhongjyuan.com'); // '.zhongjyuan.com'
 *
 * @example
 * domain('localhost'); // 'localhost'
 */
export function domain(hostname) {
	var host = hostname || location.hostname; // 如果未提供主机名，则使用当前页面的主机名

	var ip = window.zhongjyuan.const.regular.IP;
	if (ip.test(host) === true || host === "localhost") {
		// 如果主机名是IP地址或者是'localhost'，直接返回主机名
		return host;
	}

	var regex = /([^]*).*/;
	var match = host.match(regex);
	if (match) {
		host = match[1]; // 使用正则表达式提取主机名部分（去除子域名和顶级域名之外的内容）
	}

	if (host) {
		var strAry = host.split(".");
		if (strAry.length > 1) {
			host = strAry[strAry.length - 2] + "." + strAry[strAry.length - 1]; // 只保留域名的最后两部分，用'.'连接起来
		}
	}

	return "." + host; // 返回完整的域名信息（以'.'开头）
}

/**
 * 判断URL是否为网站链接
 * @param {string} url 待判断的URL
 * @returns {boolean} 如果URL是以 'http://' 或 'https://' 开头，则返回true，否则返回false。
 *
 * @example
 * isSiteUrl('http://www.zhongjyuan.com'); // 返回 true
 * isSiteUrl('https://www.zhongjyuan.com'); // 返回 true
 * isSiteUrl('ftp://www.zhongjyuan.com'); // 返回 false
 */
export function isSiteUrl(url) {
	return url && (url.indexOf("http://") === 0 || url.indexOf("https://") === 0);
}

/**
 * 执行页面刷新操作
 *
 * 重新加载当前页面
 * @example
 * // 当点击按钮时执行页面刷新操作
 * document.getElementById('refreshButton').addEventListener('click', function() {
 *   reload(); // 执行页面刷新操作
 * });
 */
export function reload() {
	window.location.reload();
}

/**
 * 当前页面的 URL 或指定 URL 的值。
 *
 * @param {string=} url 可选参数，用于指定获取 URL 的页面。
 * @returns {string} 当前页面的 URL 或指定 URL 的值。
 * @example
 *
 * const currentUrl = currentUrl();
 * console.log(currentUrl); // 输出当前页面的 URL
 *
 * const specificUrl = currentUrl("https://example.com");
 * console.log(specificUrl); // 输出指定 URL 的值
 */
export function currentUrl(url = window.location.href) {
	return url;
}

/**
 * 当前页面的标题。
 *
 * @returns {string} 当前页面的标题。
 * @example
 *
 * const title = currentTitle();
 * console.log(title); // 输出当前页面的标题
 */
export function currentTitle() {
	return document.title;
}

/**
 * 开启全屏模式。
 *
 * @param {Element} [element=document.documentElement] - 要进入全屏模式的元素，默认为 document.documentElement。
 * @example
 * // 进入全屏模式，默认全屏整个文档
 * enterFullscreen();
 * @example
 * // 进入全屏模式，只全屏某个元素
 * const element = document.getElementById('myElement');
 * enterFullscreen(element);
 */
export function openFullscreen(element = document.documentElement) {
	//W3C
	if (element.requestFullscreen) {
		element.requestFullscreen();
	}

	//FireFox
	else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	}

	//Chrome等
	else if (element.webkitRequestFullScreen) {
		element.webkitRequestFullScreen();
	}

	//IE11
	else if (element.msRequestFullscreen) {
		element.body.msRequestFullscreen();
	}
}

/**
 * 关闭全屏显示
 *
 * @param {Element} [element=document] 待关闭全屏显示的元素，默认为 document
 *
 * @example
 * // 默认情况下，关闭 document 的全屏显示
 * closeFullscreen();
 *
 * @example
 * // 关闭指定元素（例如一个 <div> 元素）的全屏显示
 * const element = document.getElementById('fullscreenDiv');
 * closeFullscreen(element);
 */
export function closeFullscreen(element = document) {
	// W3C
	if (element.exitFullscreen) {
		element.exitFullscreen(); // 退出全屏显示
	}

	// Firefox
	else if (element.mozCancelFullScreen) {
		element.mozCancelFullScreen(); // 取消 Firefox 全屏显示
	}

	// Chrome 等
	else if (element.webkitCancelFullScreen) {
		element.webkitCancelFullScreen(); // 取消 Chrome 全屏显示
	}

	// IE11
	else if (element.msExitFullscreen) {
		element.msExitFullscreen(); // 退出 IE11 全屏显示
	}
}
