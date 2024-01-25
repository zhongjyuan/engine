import logger from "@base/logger";
import { isArray, isBoolean, isEmpty, isFunction, isNull, isObject, isString } from "./default";

export default {
	urlToObject: logger.decorator(urlToObject, "tool-url-to-object"),
	urlParamValue: logger.decorator(urlParamValue, "tool-url-param-value"),
	getQueryString: logger.decorator(getQueryString, "tool-get-query-string"),
	setQueryString: logger.decorator(setQueryString, "tool-set-query-string"),
	appendQuery: logger.decorator(appendQuery, "tool-append-query"),
	appendRandomQuery: logger.decorator(appendRandomQuery, "tool-append-random-query"),
	parseQuery: logger.decorator(parseQuery, "tool-parse-query"),
	replacePathParams: logger.decorator(replacePathParams, "tool-replace-path-params"),
	joinPath: logger.decorator(joinPath, "tool-join-path"),
	http: http,
	jsonp: jsonp,
	request: request,
};

/**
 * 解析 URL 并返回解析结果的对象
 * @param {string} url - 要解析的 URL
 * @returns {object} - 包含解析结果的对象
 *
 * @example
 * const url = "https://window.zhongjyuan.com/path?param1=value1&param2=value2";
 * const result = urlToObject(url);
 * console.log(result);
 * // Output:
 * // {
 * //   source: "https://window.zhongjyuan.com/path?param1=value1&param2=value2",
 * //   protocol: "https",
 * //   host: "window.zhongjyuan.com",
 * //   port: "",
 * //   query: "?param1=value1&param2=value2",
 * //   params: {
 * //     param1: "value1",
 * //     param2: "value2"
 * //   },
 * //   file: "path",
 * //   hash: "",
 * //   path: "/path",
 * //   relative: "",
 * //   segments: ["path"]
 * // }
 */
export function urlToObject(url) {
	url || (url = location.href);
	var a = document.createElement("a");
	a.href = url;
	a.href = a.href;

	return {
		source: url,
		protocol: a.protocol.replace(":", ""),
		host: a.hostname,
		port: a.port,
		query: a.search,
		params: (function () {
			var ret = {},
				seg = a.search.replace(/^\?/, "").split("&"),
				len = seg.length,
				i = 0,
				s;
			for (; i < len; i++) {
				if (!seg[i]) {
					continue;
				}
				s = seg[i].split("=");
				ret[s[0]] = s[1];
			}
			return ret;
		})(),
		file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ""])[1],
		hash: a.hash.replace("#", ""),
		path: a.pathname.replace(/^([^\/])/, "/$1"),
		relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ""])[1],
		segments: a.pathname.replace(/^\//, "").split("/"),
	};
}

/**
 * 获取URL中指定参数的值
 * @param {string} paramName 参数名称
 * @param {string} url URL地址，默认为当前页面URL
 * @returns {string|null} 参数的值，如果未找到则返回null
 *
 * @example
 * // 示例 1: 获取URL中的id参数值
 * urlParamValue("id", "https://example.com/?id=123"); // 返回 "123"
 *
 * @example
 * // 示例 2: URL中不存在指定参数，返回null
 * urlParamValue("name", "https://example.com/"); // 返回 null
 *
 * @example
 * // 示例 3: 使用默认URL获取参数值
 * // 当前页面URL为 "https://example.com/?page=1"
 * urlParamValue("page"); // 返回 "1"
 */
export function urlParamValue(paramName, url = window.location.href) {
	// 创建URLSearchParams对象并解析URL的查询参数部分
	const searchParams = new URLSearchParams(new URL(url).search);

	// 判断是否存在指定的参数，并返回参数的值
	// 如果不存在，则返回null
	return searchParams.has(paramName) ? searchParams.get(paramName) : null;
}

/**
 * 从 URL 中获取指定参数的值。
 * @param {string} name 要获取的参数名。
 * @param {string} [url] URL 字符串，默认为当前页面的 URL。
 * @param {boolean} [decode=true] 是否对参数值进行解码，默认为 true。
 * @returns {string|null} 参数的值，如果不存在返回 null。
 *
 * @example
 * // URL：https://www.example.com/?name=John&age=25
 * var value = getQueryString('name');
 * console.log(value);
 * // Output: "John"
 */
export function getQueryString(name, url, decode) {
	if (!isString(name) || isEmpty(name)) {
		logger.error("[getQueryString] 参数异常：name<${0}>必须是字符串类型且不为空.", JSON.stringify(name));
		return "";
	}
	decode = isBoolean(decode) ? decode : true;
	url = url || (window && window.location.href) || "";

	name = name.replace(/[\[\]]/g, "\\$&");
	const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");

	const results = regex.exec(url);
	if (!results) return null;

	if (!results[2]) return "";

	const val = results[2].replace(/\+/g, " ");

	return decode ? decodeURIComponent(val) : val;
}

/**
 * 设置查询字符串参数并返回新的URL
 * @param {object} params 参数对象
 * @param {string} url 原始URL，默认为当前页面的URL
 * @param {boolean} encode 是否对参数值进行编码，默认为true
 * @returns {string} 新的URL
 *
 * @example
 * const params = { key1: 'value1', key2: 'value2' };
 * const url = setQueryString(params, 'https://example.com');
 * console.log(url); // https://example.com?key1=value1&key2=value2
 */
export function setQueryString(params, url, encode) {
	if (!isObject(params)) {
		logger.error("[setQueryString] 参数异常：params<${0}>必须是对象类型.", JSON.stringify(params));
		return "";
	}
	encode = isBoolean(encode) ? encode : true;
	url = url || (window && window.location.href) || "";

	let isEmpty = url === "";
	let noParam = true;
	let urls = null;
	// url === ''时，返回key=val&key=val
	if (!isEmpty) {
		if (url.indexOf("#") > -1) {
			urls = url.split("#");
			url = urls.slice(1).join("#");
		}

		noParam = url.indexOf("?") === -1;
		url = noParam ? url + "?" : url;
	}

	forEach(params, function (val, key) {
		if (isEmpty(val)) {
			val = "";
		} else {
			val = encode ? encodeURIComponent(val) : val;
		}

		url += (noParam ? "" : "&") + key + "=" + val;
		if (noParam) {
			noParam = false;
		}
	});

	return urls ? `${urls[0]}#${url}` : url;
}

/**
 * 在URL中追加查询字符串参数并返回新的URL
 * @param {object} params 参数对象
 * @param {string} url 原始URL，默认为当前页面的URL
 * @returns {string} 新的URL
 *
 * @example
 * const params = { key1: 'value1', key2: 'value2' };
 * const url = appendQuery(params, 'https://example.com');
 * console.log(url); // https://example.com?key1=value1&key2=value2
 */
export function appendQuery(params, url) {
	if (!isObject(params)) {
		logger.error("[appendQuery] 参数异常：params<${0}>必须是对象类型.", JSON.stringify(params));
		return;
	}
	url = url || (window && window.location.href) || "";

	let urls = null;
	if (url.indexOf("#") > -1) {
		urls = url.split("#");
		url = urls.slice(1).join("#");
	}

	const [baseUrl, queryString] = url.split("?");
	let query = params;
	if (queryString) {
		query = queryString.split("&").reduce((tempObj, temp) => {
			const [key, val] = temp.split("=");
			tempObj[key] = decodeURIComponent(val);
			return tempObj;
		}, {});
		Object.assign(query, params);
	}

	const str = Object.keys(query)
		.map((key) => `${key}=${encodeURIComponent(query[key])}`)
		.join("&");

	return `${urls ? urls[0] + "#" : ""}${baseUrl}?${str}`;
}

/**
 * 向URL追加随机查询参数并返回新的URL
 * @param {string} url URL字符串，默认为当前页面的URL
 * @param {string} random 自定义的随机值，默认为null
 * @param {boolean} refresh 是否强制刷新页面，默认为false
 * @returns {string} 新的URL
 *
 * @example
 * const newUrl = appendRandomQuery();
 * console.log(newUrl); // 追加随机查询参数后的新URL
 *
 * @example
 * const customRandom = 'custom';
 * const newUrl = appendRandomQuery('https://example.com', customRandom, true);
 * console.log(newUrl); // https://example.com?_=custom
 *
 * @example
 * const existingUrl = 'https://example.com?key=value';
 * const newUrl = appendRandomQuery(existingUrl, null, true);
 * console.log(newUrl); // https://example.com?key=value&_=randomValue
 */
export function appendRandomQuery(url = window.location.href, random, refresh) {
	const getRandom = function () {
		return getQueryString("_");
	};

	let orgiUrl = url;
	let urls = null;
	if (url.indexOf("#") > -1) {
		urls = url.split("#");
		url = urls[0];
	}

	if (!refresh && /_=[^&]/.test(url)) {
		return orgiUrl;
	}

	random = random || getRandom() || uuid(8);

	if (urls) {
		return `${url}${url.indexOf("?") > -1 ? "&" : "?"}_=${random}#${urls.slice(1).join("#")}`;
	} else {
		return `${orgiUrl}${url.indexOf("?") > -1 ? "&" : "?"}_=${random}`;
	}
}

/**
 * 解析URL中的查询字符串参数并返回参数对象
 * @param {string} url URL字符串
 * @param {string} separator 参数分隔符，默认为"&"
 * @param {boolean} decode 是否解码参数值，默认为false
 * @returns {object} 参数对象
 *
 * @example
 * const url = "https://example.com?key1=value1&key2=value2";
 * const params = parseQuery(url);
 * console.log(params); // { key1: 'value1', key2: 'value2' }
 */
export function parseQuery(url, separator = "&", decode) {
	if (!isString(url)) {
		logger.error("[parseQuery] 参数异常：url<${0}>必须是字符串类型.", JSON.stringify(url));
		return "";
	}

	let patRes;
	const params = {};
	const regex = new RegExp(`[?${separator}]([^=]*)(=([^${separator}#]*)|${separator}|#|$)`, "g");
	while ((patRes = regex.exec(url))) {
		params[patRes[1]] = decode ? decodeURIComponent(patRes[3] || "") : patRes[3] || "";
	}

	return params;
}

/**
 * 替换URL中的路径参数并返回新的URL
 * @param {string} url URL字符串
 * @param {object} params 参数对象
 * @returns {string} 新的URL
 *
 * @example
 * const url = "https://example.com/user/{userId}/profile";
 * const params = { userId: 123 };
 * const newUrl = replacePathParams(url, params);
 * console.log(newUrl); // https://example.com/user/123/profile
 */
export function replacePathParams(url, params) {
	if (!isString(url)) {
		logger.error("[replacePathParams] 参数异常：url<${0}>必须是字符串类型.", JSON.stringify(url));
		return "";
	}

	if (!isObject(params)) {
		logger.error("[replacePathParams] 参数异常：params<${0}>必须是对象类型.", JSON.stringify(params));
		return url;
	}

	url = url.replace(/{([^}]*)}/g, function (pat, param) {
		if (params && params.hasOwnProperty(param)) {
			return params[param];
		}

		return pat;
	});

	return url;
}

/**
 * 拼接多个路径为一个完整路径
 * @param {...string} paths 多个路径参数
 * @returns {string} 拼接后的完整路径
 *
 * @example
 * // 示例1：
 * const result1 = joinPath('path1', 'path2', 'path3');
 * console.log(result1);
 * // 输出: path1/path2/path3
 *
 * @example
 * // 示例2：
 * const result2 = joinPath('/path1/', '/path2', 'path3/');
 * console.log(result2);
 * // 输出: /path1/path2/path3
 */
export function joinPath(...paths) {
	if (paths.length === 1) {
		return paths[0];
	}

	return paths.reduce((pre, cur, i) => {
		if (i === 0) {
			return cur;
		}

		if (pre.endsWith("/")) {
			pre = pre.slice(0, -1);
		}

		if (cur.startsWith("/")) {
			cur = cur.slice(1);
		}

		return `${pre}/${cur}`;
	}, "");
}

/**
 * 发送 JSONP 请求
 *
 * @param {string} url - 请求的 URL
 * @param {Object} data - 请求的数据对象
 * @param {Function} callback - 请求成功后的回调函数
 * @param {string} [data_name=data] - 请求数据参数名，默认为 "data"
 * @param {string} [callback_name=callback] - 回调函数参数名，默认为 "callback"
 * @param {number} [timeout=10000] - 请求超时时间，默认为 10000 毫秒
 *
 * @example
 * // 示例1：使用默认参数发送 JSONP 请求
 * function handleResponse(data) {
 *   console.log(data);
 * }
 *
 * jsonp("https://api.window.zhongjyuan.com/user/list", { key: "value" }, handleResponse);
 *
 * @example
 * // 示例2：自定义请求数据参数名和回调函数参数名
 * function handleResponse(data) {
 *   console.log(data);
 * }
 *
 * jsonp("https://api.window.zhongjyuan.com/user/list", { key: "value" }, handleResponse, "params", "cb");
 *
 * @example
 * // 示例3：自定义超时时间
 * function handleResponse(data) {
 *   console.log(data);
 * }
 *
 * jsonp("https://api.window.zhongjyuan.com/user/list", { key: "value" }, handleResponse, "params", "cb", 5000);
 */
export function jsonp(url, data, callback, data_name, callback_name, timeout = window.zhongjyuan.runtime.setting.timeout.jsonp) {
	logger.trace("[jsonp](${0})", JSON.stringify(Array.from(arguments)));
	// 设置默认的请求数据参数名和回调函数参数名
	data_name = data_name || "data";
	callback_name = callback_name || "callback";

	// 生成唯一的回调函数名称
	var func_name = "callback_" + Date.now() + "_" + Math.floor(Math.random() * 1000); // 使用时间戳和随机数生成函数名称

	// 在全局对象中存储回调函数
	window.zhongjyuan.createRuntimeProperty("jsonp_funcs", "object");
	window.zhongjyuan.runtime.jsonp_funcs[func_name]
		? delete window.zhongjyuan.runtime.jsonp_funcs[func_name]
		: (window.zhongjyuan.runtime.jsonp_funcs[func_name] = callback);

	// 设置超时定时器
	var timer = setTimeout(function () {
		logger.error("[jsonp] ${0} => request timeout.", url);
		cleanup();
	}, timeout);

	// 处理请求的 URL
	var rel = url;
	if (url.indexOf("?") < 0) {
		rel += "?";
	} else if (/[?&]$/.test(url)) {
		// 判断是否需要添加 &
		rel += "&";
	}

	// 拼接回调函数参数
	rel += callback_name + "=" + encodeURIComponent('window.zhongjyuan.runtime.jsonp_funcs["' + func_name + '"]');
	if (data) {
		var data_str = JSON.stringify(data);
		data_str = encodeURIComponent(data_str);
		rel += "&" + data_name + "=" + data_str;
	}

	// 加载脚本，发送 JSONP 请求
	window.zhongjyuan.loadScript(rel, cleanup);
	logger.debug("[jsonp] => ${0}, ${1}, ${2}", url, data_name, callback_name, rel);

	/**
	 * 清理资源的内部函数
	 */
	function cleanup() {
		clearTimeout(timer);
		delete window.zhongjyuan.runtime.jsonp_funcs[func_name];
	}
}

/**
 * 发起 XMLHttpRequest 请求
 * @param {string} url - 请求的 URL
 * @param {string} method - 请求方法，默认为 "GET"
 * @param {function} callback - 请求完成后的回调函数，接收两个参数：error（错误信息，若无错误则为 null）和 response（响应文本）
 * @param {boolean} cache - 是否允许缓存，默认为 true
 * @example
 * request("https://api.example.com/data", "GET", function(error, response) {
 *   if (error) {
 *     console.error("请求失败:", error);
 *   } else {
 *     console.log("请求成功，响应数据:", response);
 *   }
 * });
 * @example
 * request("https://api.example.com/post", "POST", function(error, response) {
 *   // 处理请求结果
 * }, false);
 */
export async function request(url, method, callback, cache) {
	logger.trace("[request](${0})", JSON.stringify(Array.from(arguments)));

	// 默认允许缓存
	if (cache === undefined) cache = true;

	var xmlhttp;
	if (!method) method = "GET";

	try {
		// 创建 XMLHttpRequest 对象
		xmlhttp = new XMLHttpRequest();
	} catch (e) {
		// 创建失败时记录错误并退出函数
		logger.error("[request] create xmlhttprequest error: ${0}.", e.message);
		return;
	}

	// 打开连接
	xmlhttp.open(method, url);

	if (cache) {
		// 允许缓存
		xmlhttp.setRequestHeader("Cache-Control", "max-age=0");
		xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
	}

	// 监听请求状态变化事件
	xmlhttp.onreadystatechange = function () {
		logger.trace("[request] [${0}]${1} => statechange: ${2} | ${3}.", method, url, xmlhttp.readyState, xmlhttp.status);
		// 请求完成
		if (xmlhttp.readyState === 4) {
			if (xmlhttp.status === 200) {
				callback(null, xmlhttp.responseText);
			} else {
				callback(xmlhttp.status, xmlhttp.responseText);
			}
		}
	};

	try {
		xmlhttp.send(null);
		logger.debug("[request](${0}, ${1}, ${2}) => ", url, method, callback.toString(), cache);
	} catch (e) {
		logger.error("[request] [${0}]${1} => error: ${2}.", method, url, e.message);
		callback(e, "");
	}
}

/**
 * @method http
 * @param options {object} 配置对象
 * @param options.type {string} 请求类型
 * @param options.url {string} 请求地址
 * @param options.contentType {string} 请求消息主体编码，默认是application/x-www-form-urlencoded
 * @param options.data {object|string|number} 请求数据，适用于options.type为'PUT', 'POST', and 'PATCH'
 * @param options.params {object} URL参数
 * @param options.beforeSend {function} 请求前钩子函数，默认参数是当前options
 * @param options.success {function} 请求成功函数
 * @param options.error {function} 请求失败执行函数
 * @param options.complete {function} 请求执行完成函数，不管成功失败都会执行
 * @param options.dataType {string} 请求返回数据类型，默认是JSON
 * @param options.timeout {number} 请求超时时间，单位毫秒
 * @param options.context {object} 相关回调函数上下文，默认是window
 * @param options.headers {object} 请求头信息
 * @param options.host {string} 请求host
 * @param options.crossSite {boolean} 是否跨域访问，默认为false
 * @property options.type {string} 请求类型
 * @property options.url {string} 请求地址
 * @property options.contentType {string} 请求消息主体编码，默认是application/x-www-form-urlencoded
 * @property options.data {object|string|number} 请求数据，适用于options.type为'PUT', 'POST', and 'PATCH'
 * @property options.params {object} URL参数
 * @property options.beforeSend {function} 请求前钩子函数，默认参数是当前options
 * @property options.success {function} 请求成功函数
 * @property options.error {function} 请求失败执行函数
 * @property options.complete {function} 请求执行完成函数，不管成功失败都会执行
 * @property options.dataType {string} 请求返回数据类型，默认是JSON
 * @property options.timeout {number} 请求超时时间，单位毫秒
 * @property options.context {object} 相关回调函数上下文，默认是window
 * @property options.headers {object} 请求头信息
 * @property options.host {string} 请求host
 * @property options.crossSite {boolean} 是否跨域访问，默认为false
 * @returns {Promise} - 返回一个Promise对象，用于处理请求结果
 *
 * @example
 * http({
 *   method: 'get',
 *   url: 'https://api.window.zhongjyuan.club/plat/user/list',
 *   headers: {
 *     'Authorization': 'Bearer xxxxxxxx'
 *   },
 *   params: {
 *     id: 6254084
 *   },
 *   success: function(data, response) {
 *     console.log('请求成功', data);
 *   },
 *   error: function(error, options) {
 *     console.error('请求失败', error);
 *   }
 * });
 *
 * @example
 * http({
 *   method: 'post',
 *   url: 'https://api.window.zhongjyuan.club/plat/user/create',
 *   headers: {
 *     'Content-Type': 'application/json'
 *   },
 *   data: {
 *     name: 'JinYuan Zhong',
 *     age: 25,
 *     email: 'zhongjyuan@outlook.com'
 *   },
 *   success: function(data, response) {
 *     console.log('创建成功', data);
 *   },
 *   error: function(error, options) {
 *     console.error('创建失败', error);
 *   }
 * });
 */
export async function http(options) {
	logger.trace("[http](${0})", JSON.stringify(Array.from(arguments)));
	if (isEmpty(options)) {
		logger.error("[http] 参数异常：options<${0}>是必须的.", JSON.stringify(options));
		return null;
	}

	var defaultOpts = {
		method: "get",
		url: "",
		baseURL: window.zhongjyuan.runtime.setting.server.host,
		withCredentials: false,
		timeout: window.zhongjyuan.runtime.setting.timeout.request || 20000,
		headers: { "content-type": "application/json" },
		data: {},
		params: {},
		responseType: "json",
		validateStatus: function (status) {
			return status >= 200 && status < 300;
		},
	};
	var isAbsolutePath = window.zhongjyuan.runtime.setting.server.platServer.url.indexOf("/") === 0;
	var absoPathArr = isAbsolutePath ? window.zhongjyuan.runtime.setting.server.platServer.url.split("/") : [];
	var mapDefaultOpts = function () {
		var propMap = {
			method: "type",
			url: "url",
			baseURL: "host",
			timeout: "timeout",
			headers: "headers",
			data: "data",
			params: "params",
			responseType: "dataType",
			withCredentials: "crossSite",
			onUploadProgress: "onUploadProgress",
			cancelToken: "cancelToken",
		};

		if (!isEmpty(options["contentType"])) {
			options.headers = options.headers || {};
			if (String(options["contentType"]).toLowerCase() === "json") {
				options.headers["content-type"] = "application/json";
			} else {
				options.headers["content-type"] = options["contentType"];
			}
		}

		for (var prop in propMap) {
			if (options.hasOwnProperty(propMap[prop])) {
				// 设置配置属性为null，则表示删除默认的请求属性
				if (isNull(options[propMap[prop]])) {
					delete defaultOpts[prop];
					continue;
				}
				switch (prop) {
					// 处理大小写问题
					case "headers":
						let header = options[propMap[prop]];
						if (isObject(header)) {
							Object.keys(header).forEach(function (key) {
								defaultOpts[prop][key.toLowerCase()] = header[key];
							});
						}
						break;
					case "params":
						defaultOpts[prop] = Object.assign(defaultOpts[prop], options[propMap[prop]]);
						break;
					// get请求，data参数转为params参数
					case "data" && defaultOpts["method"].toLowerCase() === "get":
						defaultOpts["params"] = Object.assgin(defaultOpts["params"], options[propMap[prop]]);
						break;
					case "url":
						if (
							options["url"].indexOf("http://") === 0 ||
							options["url"].indexOf("https://") === 0 ||
							(isAbsolutePath && absoPathArr.length > 1 && options["url"].indexOf(`/${absoPathArr[1]}/`) === 0)
						) {
							delete defaultOpts["baseURL"];
							if (options.hasOwnProperty("host")) {
								delete options["host"];
							}
						}

						defaultOpts[prop] = options[propMap[prop]];
						break;
					case "timeout":
						let timeout = options[propMap[prop]] || window.zhongjyuan.runtime.setting.timeout.request || 20000;
						if (timeout < 0) {
							timeout = null;
						}

						defaultOpts["timeout"] = timeout;
						break;
					default:
						defaultOpts[prop] = options[propMap[prop]];
				}
			}
		}
	};
	var context = options.context || window;

	try {
		if (isFunction(options.beforeSend)) {
			options.beforeSend.call(context, options);
		}
		mapDefaultOpts();

		// mock处理
		// mock(defaultOpts, options);

		// 处理表单数据，data为js对象则stringify处理
		if (
			defaultOpts["headers"]["content-type"] === "application/x-www-form-urlencoded" &&
			(isObject(defaultOpts["data"]) || isArray(defaultOpts["data"]))
		) {
			defaultOpts["data"] = qs.stringify(defaultOpts["data"]);
		}
	} catch (err) {
		logger.error("[http] options build => error: ${0}.", err.message);
		return Promise.reject(err);
	}

	logger.debug("[http](${0}) => [${0}]${1}", JSON.stringify(options), defaultOpts.method, defaultOpts.url);
	return axios(defaultOpts)
		.then(function (response) {
			logger.debug("[http](${0}) => ${1}.", JSON.stringify(defaultOpts), JSON.stringify(response));
			var data = response.data;
			if (isFunction(options.success)) {
				options.success.call(context, data, response);
			}

			if (isFunction(options.complete)) {
				options.complete.call(context, data, response);
			}

			return data;
		})
		.catch(function (error) {
			logger.debug("[http](${0}) => error: ${1}.", JSON.stringify(defaultOpts), error.message);
			if (isFunction(options.complete)) {
				options.complete.call(context, error, options);
			}

			throw error;
		});
}
