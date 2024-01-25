"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Request = undefined;

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _global = require("./global");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 创建一个用于发送 HTTP 请求的实例
 * @param {object} defaults - 默认配置选项
 * @returns {function} - 发送请求的函数
 *
 * @example
 * const request = Request({
 *   headers: {
 *     "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36",
 *     "connection": "close"
 *   },
 *   timeout: 60000,
 *   httpAgent: false,
 *   httpsAgent: false,
 *   Cookie: {
 *     pgv_pvi: randomString(),
 *     pgv_si: randomString("s")
 *   }
 * });
 *
 * const options = {
 *   method: "GET",
 *   url: "https://api.zhongjyuan.com/data",
 *   params: {
 *     id: 12345
 *   }
 * };
 *
 * request(options)
 *   .then((response) => {
 *     console.log(response.data);
 *   })
 *   .catch((error) => {
 *     console.error(error);
 *   });
 */
var Request =
/**
 * 构造函数
 *
 * @constructor
 * @param {object} [defaults] - 默认配置项
 * @param {object} [defaults.headers] - 默认请求头
 * @param {string} [defaults.headers.user-agent] - 默认 User-Agent 头
 * @param {string} [defaults.headers.connection] - 默认 Connection 头
 * @param {number} [defaults.timeout=60000] - 默认超时时间（毫秒）
 * @param {boolean} [defaults.httpAgent=false] - 是否开启 HTTP Keep-Alive
 * @param {boolean} [defaults.httpsAgent=false] - 是否开启 HTTPS Keep-Alive
 *
 * @example
 * const request = Request({
 *   headers: {
 *     "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36",
 *     "connection": "close"
 *   },
 *   timeout: 60000,
 *   httpAgent: false,
 *   httpsAgent: false,
 *   Cookie: {
 *     pgv_pvi: randomString(),
 *     pgv_si: randomString("s")
 *   }
 * });
 *
 * const options = {
 *   method: "GET",
 *   url: "https://api.zhongjyuan.com/data",
 *   params: {
 *     id: 12345
 *   }
 * };
 *
 * request(options)
 *   .then((response) => {
 *     console.log(response.data);
 *   })
 *   .catch((error) => {
 *     console.error(error);
 *   });
 */
exports.Request = function Request(defaults) {
	var _this = this;

	_classCallCheck(this, Request);

	// 对传入的默认配置进行处理
	defaults = defaults || {};
	defaults.headers = defaults.headers || {};

	// 如果不是浏览器环境，则设置默认 User-Agent 和 Connection 头
	if (!_global.isBrowserEnv) {
		defaults.headers["user-agent"] = defaults.headers["user-agent"] || "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36";
		defaults.headers["connection"] = defaults.headers["connection"] || "close";
	}

	// 设置默认超时时间、HTTP Keep-Alive 和 HTTPS Keep-Alive
	defaults.timeout = 1000 * 60;
	defaults.httpAgent = false;
	defaults.httpsAgent = false;

	// 创建 Axios 实例
	this.axios = _axios2.default.create(defaults);

	// 如果不是浏览器环境，则设置 Cookie 和拦截器
	if (!_global.isBrowserEnv) {
		// 初始化 Cookie，并生成随机的 pgv_pvi 和 pgv_si 属性
		this.Cookie = defaults.Cookie || {};
		this.Cookie["pgv_pvi"] = (0, _global.randomString)();
		this.Cookie["pgv_si"] = (0, _global.randomString)("s");

		// 添加请求拦截器，将 Cookie 添加到请求头中
		this.axios.interceptors.request.use(function (config) {
			config.headers["cookie"] = Object.keys(_this.Cookie).map(function (key) {
				return key + "=" + _this.Cookie[key];
			}).join("; ");
			return config;
		}, function (err) {
			return Promise.reject(err);
		});

		// 添加响应拦截器，解析 Set-Cookie 头并更新 Cookie
		this.axios.interceptors.response.use(function (res) {
			var setCookie = res.headers["set-cookie"];
			if (setCookie) {
				setCookie.forEach(function (item) {
					var pm = item.match(/^(.+?)\s?\=\s?(.+?);/);
					if (pm) {
						_this.Cookie[pm[1]] = pm[2];
					}
				});
			}
			return res;
		}, function (err) {
			if (err && err.response) {
				delete err.response.request;
				delete err.response.config;
			}
			return Promise.reject(err);
		});
	}

	// 返回一个封装好的请求方法
	this.request = function (options) {
		return _this.axios.request(options);
	};

	return this.request;
};
//# sourceMappingURL=request.js.map