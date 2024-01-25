"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.AlreadyLogoutError = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bl = require("bl");

var _bl2 = _interopRequireDefault(_bl);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _mime = require("mime");

var _mime2 = _interopRequireDefault(_mime);

var _debug2 = require("debug");

var _debug3 = _interopRequireDefault(_debug2);

var _formData = require("form-data");

var _formData2 = _interopRequireDefault(_formData);

var _config = require("./config");

var _request = require("./utils/request");

var _assert = require("./utils/assert");

var _global = require("./utils/global");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = (0, _debug3.default)("core");

var AlreadyLogoutError = exports.AlreadyLogoutError = function (_Error) {
	_inherits(AlreadyLogoutError, _Error);

	function AlreadyLogoutError() {
		var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "already logout";

		_classCallCheck(this, AlreadyLogoutError);

		var _this = _possibleConstructorReturn(this, (AlreadyLogoutError.__proto__ || Object.getPrototypeOf(AlreadyLogoutError)).call(this, message));

		_this.constructor = AlreadyLogoutError;

		_this.__proto__ = AlreadyLogoutError.prototype;
		return _this;
	}

	return AlreadyLogoutError;
}(Error);

/**
 * 微信核心类
 */


var WeixinCore = function () {
	/**
  * 创建一个 WechatCore 的实例
  * @param {Object} data - 数据对象
  */
	function WeixinCore(data) {
		_classCallCheck(this, WeixinCore);

		this.STATE = (0, _config.getConfig)().STATE;

		/**
   * 存储核心属性的对象
   * @type {Object}
   */
		this._prop = {
			uuid: "",
			uin: "",
			sid: "",
			skey: "",
			passTicket: "",
			formatedSyncKey: "",
			webwxDataTicket: "",
			syncKey: { List: [] }
		};

		/**
   * 用户信息
   * @type {Object}
   */
		this._user = {};

		/**
   * 存储 COOKIE 的对象
   * @type {Object}
   */
		this._cookie = {};

		/**
   * 配置信息
   * @type {Object}
   */
		this._config = (0, _config.getConfig)();

		/**
   * 存储数据对象
   * @type {Object}
   */
		this._data = data || {};

		/**
   * 请求对象
   * @type {Request}
   */
		this._request = new _request.Request({ Cookie: this._cookie });
	}

	/**
  * 设置 botData 对象
  * @param {Object} data - 数据对象
  */


	_createClass(WeixinCore, [{
		key: "_baseRequest",


		/**
   * 获取基础请求数据
   * @returns {Object} 基础请求数据对象
   */
		value: function _baseRequest() {
			return {
				Uin: parseInt(this._prop.uin),
				Sid: this._prop.sid,
				Skey: this._prop.skey,
				DeviceID: (0, _global.generateDeviceID)()
			};
		}

		/**
   * 更新同步键
   * @param {Object} data - 同步数据对象
   */

	}, {
		key: "_updateSyncKey",
		value: function _updateSyncKey(data) {
			if (data.SyncKey) {
				this._prop.syncKey = data.SyncKey;
			}

			var syncKeyList = [];

			if (data.SyncCheckKey) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = data.SyncCheckKey.List[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var item = _step.value;

						syncKeyList.push(item.Key + "_" + item.Val);
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
			} else if (!this._prop.formatedSyncKey && data.SyncKey) {
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = data.SyncKey.List[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var _item = _step2.value;

						syncKeyList.push(_item.Key + "_" + _item.Val);
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}
			}

			this._prop.formatedSyncKey = syncKeyList.join("|");
		}

		/**
   * 获取 UUID
   * @returns {Promise<string>} Promise 对象，包含获取到的 UUID 字符串
   */

	}, {
		key: "getUUID",
		value: function () {
			var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
				var res, window;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.prev = 0;
								_context.next = 3;
								return this._request({
									method: "POST",
									url: this._config.API_jsLogin
								});

							case 3:
								res = _context.sent;
								window = {
									QRLogin: {}
								};

								// res.data: "window.QRLogin.code = xxx; ..."

								eval(res.data);
								(0, _assert.equal)(window.QRLogin.code, 200, res);

								this._prop.uuid = window.QRLogin.uuid;
								return _context.abrupt("return", window.QRLogin.uuid);

							case 11:
								_context.prev = 11;
								_context.t0 = _context["catch"](0);

								debug(_context.t0);
								_context.t0.tips = "获取UUID失败";
								throw _context.t0;

							case 16:
							case "end":
								return _context.stop();
						}
					}
				}, _callee, this, [[0, 11]]);
			}));

			function getUUID() {
				return _ref.apply(this, arguments);
			}

			return getUUID;
		}()

		/**
   * 检查登录状态
   * @returns {Promise<object>} Promise 对象，包含检查结果的对象
   */

	}, {
		key: "checkLogin",
		value: function () {
			var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
				var params, res, window;
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								_context2.prev = 0;
								params = {
									tip: 0,
									loginicon: true,
									uuid: this._prop.uuid
								};
								_context2.next = 4;
								return this._request({
									method: "GET",
									params: params,
									url: this._config.API_login
								});

							case 4:
								res = _context2.sent;
								window = {};


								eval(res.data);
								(0, _assert.notEqual)(window.code, 400, res);

								if (window.code === 200) {
									this._config = (0, _config.getConfig)(window.redirect_uri.match(/(?:\w+\.)+\w+/)[0]);
									this.rediUri = window.redirect_uri;
								} else if (window.code === 201 && window.userAvatar) {
									// this._user.userAvatar = window.userAvatar
								}
								return _context2.abrupt("return", window);

							case 12:
								_context2.prev = 12;
								_context2.t0 = _context2["catch"](0);

								debug(_context2.t0);
								_context2.t0.tips = "获取手机确认登录信息失败";
								throw _context2.t0;

							case 17:
							case "end":
								return _context2.stop();
						}
					}
				}, _callee2, this, [[0, 12]]);
			}));

			function checkLogin() {
				return _ref2.apply(this, arguments);
			}

			return checkLogin;
		}()

		/**
   * 登录
   * @returns {Promise<void>} Promise 对象，表示登录操作完成
   */

	}, {
		key: "login",
		value: function () {
			var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
				var _this2 = this;

				var res, pm;
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								_context3.prev = 0;
								_context3.next = 3;
								return this._request({
									method: "GET",
									params: {
										fun: "new"
									},
									url: this.rediUri
								});

							case 3:
								res = _context3.sent;
								pm = res.data.match(/<ret>(.*)<\/ret>/);

								if (pm && pm[1] === "0") {
									this._prop.skey = res.data.match(/<skey>(.*)<\/skey>/)[1];
									this._prop.sid = res.data.match(/<wxsid>(.*)<\/wxsid>/)[1];
									this._prop.uin = res.data.match(/<wxuin>(.*)<\/wxuin>/)[1];
									this._prop.passTicket = res.data.match(/<pass_ticket>(.*)<\/pass_ticket>/)[1];
								}
								if (res.headers["set-cookie"]) {
									res.headers["set-cookie"].forEach(function (item) {
										if (/webwx.*?data.*?ticket/i.test(item)) {
											_this2._prop.webwxDataTicket = item.match(/=(.*?);/)[1];
										} else if (/wxuin/i.test(item)) {
											_this2._prop.uin = item.match(/=(.*?);/)[1];
										} else if (/wxsid/i.test(item)) {
											_this2._prop.sid = item.match(/=(.*?);/)[1];
										}
									});
								}
								_context3.next = 14;
								break;

							case 9:
								_context3.prev = 9;
								_context3.t0 = _context3["catch"](0);

								debug(_context3.t0);
								_context3.t0.tips = "登录失败";
								throw _context3.t0;

							case 14:
							case "end":
								return _context3.stop();
						}
					}
				}, _callee3, this, [[0, 9]]);
			}));

			function login() {
				return _ref3.apply(this, arguments);
			}

			return login;
		}()

		/**
   * 初始化微信
   * @returns {Promise<Object>} Promise 对象，表示初始化操作完成，并返回初始化后的数据对象
   */

	}, {
		key: "init",
		value: function () {
			var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
				var params, data, res, initData;
				return regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								_context4.prev = 0;
								params = {
									r: ~new Date(),
									skey: this._prop.skey,
									pass_ticket: this._prop.passTicket
								};
								data = {
									BaseRequest: this._baseRequest()
								};
								_context4.next = 5;
								return this._request({
									method: "POST",
									data: data,
									params: params,
									url: this._config.API_webwxinit
								});

							case 5:
								res = _context4.sent;
								initData = res.data;

								if (!(initData.BaseResponse.Ret == this._config.SYNCCHECK_RET_LOGOUT)) {
									_context4.next = 9;
									break;
								}

								throw new AlreadyLogoutError();

							case 9:

								(0, _assert.equal)(initData.BaseResponse.Ret, 0, res);

								this._prop.skey = initData.SKey || this._prop.skey;

								this._updateSyncKey(initData);

								Object.assign(this._user, initData.User);

								return _context4.abrupt("return", initData);

							case 16:
								_context4.prev = 16;
								_context4.t0 = _context4["catch"](0);

								debug(_context4.t0);
								_context4.t0.tips = "微信初始化失败";
								throw _context4.t0;

							case 21:
							case "end":
								return _context4.stop();
						}
					}
				}, _callee4, this, [[0, 16]]);
			}));

			function init() {
				return _ref4.apply(this, arguments);
			}

			return init;
		}()

		/**
   * 发送手机状态通知
   * @param {string} to - 接收通知的用户ID（可选）
   * @returns {Promise<void>} Promise 对象，表示手机状态通知操作完成
   */

	}, {
		key: "sendMobileNotification",
		value: function () {
			var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(to) {
				var params, data, res, responseData;
				return regeneratorRuntime.wrap(function _callee5$(_context5) {
					while (1) {
						switch (_context5.prev = _context5.next) {
							case 0:
								_context5.prev = 0;
								params = {
									lang: "zh_CN",
									pass_ticket: this._prop.passTicket
								};
								data = {
									Code: to ? 1 : 3,
									BaseRequest: this._baseRequest(),
									FromUserName: this._user.UserName,
									ToUserName: to || this._user.UserName,
									ClientMsgId: (0, _global.generateClientMsgID)()
								};
								_context5.next = 5;
								return this._request({
									method: "POST",
									data: data,
									params: params,
									url: this._config.API_webwxstatusnotify
								});

							case 5:
								res = _context5.sent;
								responseData = res.data;


								(0, _assert.equal)(responseData.BaseResponse.Ret, 0, res);
								_context5.next = 15;
								break;

							case 10:
								_context5.prev = 10;
								_context5.t0 = _context5["catch"](0);

								debug(_context5.t0);
								_context5.t0.tips = "手机状态通知失败";
								throw _context5.t0;

							case 15:
							case "end":
								return _context5.stop();
						}
					}
				}, _callee5, this, [[0, 10]]);
			}));

			function sendMobileNotification(_x2) {
				return _ref5.apply(this, arguments);
			}

			return sendMobileNotification;
		}()

		/**
   * 获取通讯录
   * @param {number} seq - 通讯录序列号（可选，默认为0）
   * @returns {Promise<Object>} Promise 对象，表示获取通讯录的结果
   */

	}, {
		key: "fetchContacts",
		value: function () {
			var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
				var seq = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
				var params, res, data;
				return regeneratorRuntime.wrap(function _callee6$(_context6) {
					while (1) {
						switch (_context6.prev = _context6.next) {
							case 0:
								_context6.prev = 0;
								params = {
									seq: seq,
									lang: "zh_CN",
									r: +new Date(),
									skey: this._prop.skey,
									pass_ticket: this._prop.passTicket
								};
								_context6.next = 4;
								return this._request({
									method: "POST",
									params: params,
									url: this._config.API_webwxgetcontact
								});

							case 4:
								res = _context6.sent;
								data = res.data;

								(0, _assert.equal)(data.BaseResponse.Ret, 0, res);

								return _context6.abrupt("return", data);

							case 10:
								_context6.prev = 10;
								_context6.t0 = _context6["catch"](0);

								debug(_context6.t0);
								_context6.t0.tips = "获取通讯录失败";
								throw _context6.t0;

							case 15:
							case "end":
								return _context6.stop();
						}
					}
				}, _callee6, this, [[0, 10]]);
			}));

			function fetchContacts() {
				return _ref6.apply(this, arguments);
			}

			return fetchContacts;
		}()

		/**
   * 批量获取联系人详细信息
   * @param {Array} contacts - 联系人列表
   * @returns {Promise<Array>} - Promise 对象，表示批量获取联系人详细信息的结果
   */

	}, {
		key: "fetchBatchContactInfo",
		value: function () {
			var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(contacts) {
				var params, data, res, responseData;
				return regeneratorRuntime.wrap(function _callee7$(_context7) {
					while (1) {
						switch (_context7.prev = _context7.next) {
							case 0:
								_context7.prev = 0;
								params = {
									type: "ex",
									lang: "zh_CN",
									r: +new Date(),
									pass_ticket: this._prop.passTicket
								};
								data = {
									BaseRequest: this._baseRequest(),
									Count: contacts.length,
									List: contacts
								};
								_context7.next = 5;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxbatchgetcontact
								});

							case 5:
								res = _context7.sent;
								responseData = res.data;

								(0, _assert.equal)(responseData.BaseResponse.Ret, 0, res);

								return _context7.abrupt("return", responseData.ContactList);

							case 11:
								_context7.prev = 11;
								_context7.t0 = _context7["catch"](0);

								debug(_context7.t0);
								_context7.t0.tips = "批量获取联系人失败";
								throw _context7.t0;

							case 16:
							case "end":
								return _context7.stop();
						}
					}
				}, _callee7, this, [[0, 11]]);
			}));

			function fetchBatchContactInfo(_x4) {
				return _ref7.apply(this, arguments);
			}

			return fetchBatchContactInfo;
		}()

		/**
   * 发送状态报告
   * @param {Object} text - 状态报告文本，包含操作记录等信息
   * @returns {Promise<Object>} Promise 对象，表示发送状态报告的结果
   */

	}, {
		key: "sendStatReport",
		value: function () {
			var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(text) {
				var params, data;
				return regeneratorRuntime.wrap(function _callee8$(_context8) {
					while (1) {
						switch (_context8.prev = _context8.next) {
							case 0:
								_context8.prev = 0;

								text = text || {
									type: "[action-record]",
									data: {
										actions: [{
											type: "click",
											action: "发送框",
											time: +new Date()
										}]
									}
								};

								text = JSON.stringify(text);

								params = {
									pass_ticket: this._prop.passTicket,
									fun: "new",
									lang: "zh_CN"
								};
								data = {
									BaseRequest: this._baseRequest(),
									Count: 1,
									List: [{
										Text: text,
										Type: 1
									}]
								};
								_context8.next = 7;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxreport
								});

							case 7:
								return _context8.abrupt("return", _context8.sent);

							case 10:
								_context8.prev = 10;
								_context8.t0 = _context8["catch"](0);

								debug(_context8.t0);
								_context8.t0.tips = "状态报告失败";
								throw _context8.t0;

							case 15:
							case "end":
								return _context8.stop();
						}
					}
				}, _callee8, this, [[0, 10]]);
			}));

			function sendStatReport(_x5) {
				return _ref8.apply(this, arguments);
			}

			return sendStatReport;
		}()

		/**
   * 执行同步检查
   * @returns {Promise<number>} Promise 对象，表示同步检查结果中的 selector 值
   */

	}, {
		key: "performSyncCheck",
		value: function () {
			var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
				var params, res, window;
				return regeneratorRuntime.wrap(function _callee9$(_context9) {
					while (1) {
						switch (_context9.prev = _context9.next) {
							case 0:
								_context9.prev = 0;
								params = {
									r: +new Date(),
									sid: this._prop.sid,
									uin: this._prop.uin,
									skey: this._prop.skey,
									deviceid: (0, _global.generateDeviceID)(),
									synckey: this._prop.formatedSyncKey
								};
								_context9.next = 4;
								return this._request({
									method: "GET",
									params: params,
									url: this._config.API_synccheck
								});

							case 4:
								res = _context9.sent;
								window = {
									synccheck: {}
								};


								try {
									eval(res.data);
								} catch (ex) {
									window.synccheck = { retcode: "0", selector: "0" };
								}

								if (!(window.synccheck.retcode == this._config.SYNCCHECK_RET_LOGOUT)) {
									_context9.next = 9;
									break;
								}

								throw new AlreadyLogoutError();

							case 9:

								(0, _assert.equal)(window.synccheck.retcode, this._config.SYNCCHECK_RET_SUCCESS, res);

								return _context9.abrupt("return", window.synccheck.selector);

							case 13:
								_context9.prev = 13;
								_context9.t0 = _context9["catch"](0);

								debug(_context9.t0);
								_context9.t0.tips = "同步失败";
								throw _context9.t0;

							case 18:
							case "end":
								return _context9.stop();
						}
					}
				}, _callee9, this, [[0, 13]]);
			}));

			function performSyncCheck() {
				return _ref9.apply(this, arguments);
			}

			return performSyncCheck;
		}()

		/**
   * 执行同步操作
   * @returns {Promise<Object>} Promise 对象，表示同步结果的数据对象
   */

	}, {
		key: "performSync",
		value: function () {
			var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
				var params, data, res, responseData;
				return regeneratorRuntime.wrap(function _callee10$(_context10) {
					while (1) {
						switch (_context10.prev = _context10.next) {
							case 0:
								_context10.prev = 0;
								params = {
									lang: "zh_CN",
									sid: this._prop.sid,
									skey: this._prop.skey,
									pass_ticket: this._prop.passTicket
								};
								data = {
									BaseRequest: this._baseRequest(),
									SyncKey: this._prop.syncKey,
									rr: ~new Date()
								};
								_context10.next = 5;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxsync
								});

							case 5:
								res = _context10.sent;
								responseData = res.data;

								if (!(responseData.BaseResponse.Ret == this._config.SYNCCHECK_RET_LOGOUT)) {
									_context10.next = 9;
									break;
								}

								throw new AlreadyLogoutError();

							case 9:

								(0, _assert.equal)(responseData.BaseResponse.Ret, 0, res);

								this._updateSyncKey(responseData);
								this._prop.skey = responseData.SKey || this._prop.skey;

								return _context10.abrupt("return", responseData);

							case 15:
								_context10.prev = 15;
								_context10.t0 = _context10["catch"](0);

								debug(_context10.t0);
								_context10.t0.tips = "获取新信息失败";
								throw _context10.t0;

							case 20:
							case "end":
								return _context10.stop();
						}
					}
				}, _callee10, this, [[0, 15]]);
			}));

			function performSync() {
				return _ref10.apply(this, arguments);
			}

			return performSync;
		}()

		/**
   * 登出
   * @returns {Promise<string>} Promise 对象，表示登出结果的消息字符串
   */

	}, {
		key: "logout",
		value: function () {
			var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
				var params, res;
				return regeneratorRuntime.wrap(function _callee11$(_context11) {
					while (1) {
						switch (_context11.prev = _context11.next) {
							case 0:
								_context11.prev = 0;
								params = {
									type: 0,
									redirect: 1,
									lang: "zh_CN",
									skey: this._prop.skey
								};
								_context11.next = 4;
								return this._request({
									method: "POST",
									params: params,
									url: this._config.API_webwxlogout
								});

							case 4:
								res = _context11.sent;
								return _context11.abrupt("return", "登出成功");

							case 8:
								_context11.prev = 8;
								_context11.t0 = _context11["catch"](0);

								debug(_context11.t0);
								return _context11.abrupt("return", "可能登出成功");

							case 12:
							case "end":
								return _context11.stop();
						}
					}
				}, _callee11, this, [[0, 8]]);
			}));

			function logout() {
				return _ref11.apply(this, arguments);
			}

			return logout;
		}()

		/**
   * 发送文本消息
   * @param {string} msg - 要发送的消息内容
   * @param {string} to - 目标用户的 UserName
   * @returns {Promise<Object>} Promise 对象，表示发送消息结果的数据对象
   * @throws {Error} 如果发送消息失败，则会抛出异常
   */

	}, {
		key: "sendTextMessage",
		value: function () {
			var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(msg, to) {
				var params, clientMsgId, data, res, responseData;
				return regeneratorRuntime.wrap(function _callee12$(_context12) {
					while (1) {
						switch (_context12.prev = _context12.next) {
							case 0:
								_context12.prev = 0;
								params = {
									lang: "zh_CN",
									pass_ticket: this._prop.passTicket
								};
								clientMsgId = (0, _global.generateClientMsgID)();
								data = {
									Scene: 0,
									BaseRequest: this._baseRequest(),
									Msg: {
										Type: this._config.MSGTYPE_TEXT,
										Content: msg,
										ToUserName: to,
										LocalID: clientMsgId,
										ClientMsgId: clientMsgId,
										FromUserName: this._user["UserName"]
									}
								};
								_context12.next = 6;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxsendmsg
								});

							case 6:
								res = _context12.sent;
								responseData = res.data;

								(0, _assert.equal)(responseData.BaseResponse.Ret, 0, res);

								return _context12.abrupt("return", responseData);

							case 12:
								_context12.prev = 12;
								_context12.t0 = _context12["catch"](0);

								debug(_context12.t0);
								_context12.t0.tips = "发送文本信息失败";
								throw _context12.t0;

							case 17:
							case "end":
								return _context12.stop();
						}
					}
				}, _callee12, this, [[0, 12]]);
			}));

			function sendTextMessage(_x6, _x7) {
				return _ref12.apply(this, arguments);
			}

			return sendTextMessage;
		}()

		/**
   * 发送表情消息
   * @param {string} id - 表情消息ID，可以是 MediaId 或 EMoticonMd5
   * @param {string} to - 目标用户的 UserName
   * @returns {Promise<Object>} Promise 对象，表示发送消息结果的数据对象
   * @throws {Error} 如果发送消息失败，则会抛出异常
   */

	}, {
		key: "sendEmoticonMessage",
		value: function () {
			var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(id, to) {
				var params, clientMsgId, data, res, responseData;
				return regeneratorRuntime.wrap(function _callee13$(_context13) {
					while (1) {
						switch (_context13.prev = _context13.next) {
							case 0:
								_context13.prev = 0;
								params = {
									fun: "sys",
									lang: "zh_CN",
									pass_ticket: this._prop.passTicket
								};
								clientMsgId = (0, _global.generateClientMsgID)();
								data = {
									BaseRequest: this._baseRequest(),
									Scene: 0,
									Msg: {
										Type: this._config.MSGTYPE_EMOTICON,
										EmojiFlag: 2,
										ToUserName: to,
										LocalID: clientMsgId,
										ClientMsgId: clientMsgId,
										FromUserName: this._user["UserName"]
									}
								};


								if (id.indexOf("@") === 0) {
									data.Msg.MediaId = id;
								} else {
									data.Msg.EMoticonMd5 = id;
								}

								_context13.next = 7;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxsendemoticon
								});

							case 7:
								res = _context13.sent;
								responseData = res.data;

								(0, _assert.equal)(responseData.BaseResponse.Ret, 0, res);

								return _context13.abrupt("return", responseData);

							case 13:
								_context13.prev = 13;
								_context13.t0 = _context13["catch"](0);

								debug(_context13.t0);
								_context13.t0.tips = "发送表情信息失败";
								throw _context13.t0;

							case 18:
							case "end":
								return _context13.stop();
						}
					}
				}, _callee13, this, [[0, 13]]);
			}));

			function sendEmoticonMessage(_x8, _x9) {
				return _ref13.apply(this, arguments);
			}

			return sendEmoticonMessage;
		}()

		/**
   * 上传媒体文件
   * @param {Stream|Buffer} file - 要上传的文件流或缓冲区
   * @param {string} filename - 文件名（可选）
   * @param {string} toUserName - 接收方用户名（可选）
   * @returns {Promise<Object>} - 上传成功后返回的媒体信息对象
   */

	}, {
		key: "uploadMedia",
		value: function () {
			var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(file, filename, toUserName) {
				var name, type, size, ext, mediatype, data, buffer, clientMsgId, uploadMediaRequest, form, formDataPromise, res, mediaId;
				return regeneratorRuntime.wrap(function _callee14$(_context14) {
					while (1) {
						switch (_context14.prev = _context14.next) {
							case 0:
								_context14.prev = 0;
								name = void 0, type = void 0, size = void 0, ext = void 0, mediatype = void 0, data = void 0;

								// 根据不同类型的文件处理数据

								if (!(typeof File !== "undefined" && file.constructor == File || typeof Blob !== "undefined" && file.constructor == Blob)) {
									_context14.next = 9;
									break;
								}

								name = file.name || "file";
								type = file.type;
								size = file.size;
								data = file;
								_context14.next = 28;
								break;

							case 9:
								if (!Buffer.isBuffer(file)) {
									_context14.next = 18;
									break;
								}

								if (filename) {
									_context14.next = 12;
									break;
								}

								throw new Error("未知文件名");

							case 12:
								name = filename;
								type = _mime2.default.lookup(name);
								size = file.length;
								data = file;
								_context14.next = 28;
								break;

							case 18:
								if (!file.readable) {
									_context14.next = 28;
									break;
								}

								if (!(!file.path && !filename)) {
									_context14.next = 21;
									break;
								}

								throw new Error("未知文件名");

							case 21:
								name = _path2.default.basename(file.path || filename);
								type = _mime2.default.lookup(name);
								_context14.next = 25;
								return new Promise(function (resolve, reject) {
									file.pipe((0, _bl2.default)(function (err, buffer) {
										if (err) {
											reject(err);
										} else {
											resolve(buffer);
										}
									}));
								});

							case 25:
								buffer = _context14.sent;

								size = buffer.length;
								data = buffer;

							case 28:

								ext = name.match(/.*\.(.*)/);
								ext = ext ? ext[1].toLowerCase() : "";

								// 根据文件扩展名确定媒体类型
								_context14.t0 = ext;
								_context14.next = _context14.t0 === "bmp" ? 33 : _context14.t0 === "jpeg" ? 33 : _context14.t0 === "jpg" ? 33 : _context14.t0 === "png" ? 33 : _context14.t0 === "mp4" ? 35 : 37;
								break;

							case 33:
								mediatype = "pic";
								return _context14.abrupt("break", 38);

							case 35:
								mediatype = "video";
								return _context14.abrupt("break", 38);

							case 37:
								mediatype = "doc";

							case 38:
								clientMsgId = (0, _global.generateClientMsgID)();
								uploadMediaRequest = JSON.stringify({
									BaseRequest: this._baseRequest(),
									ClientMediaId: clientMsgId,
									TotalLen: size,
									StartPos: 0,
									DataLen: size,
									MediaType: 4,
									UploadType: 2,
									FromUserName: this._user.UserName,
									ToUserName: toUserName || this._user.UserName
								});
								form = new _formData2.default();

								form.append("name", name);
								form.append("type", type);
								form.append("lastModifiedDate", new Date().toGMTString());
								form.append("size", size);
								form.append("mediatype", mediatype);
								form.append("uploadmediarequest", uploadMediaRequest);
								form.append("webwx_data_ticket", this._prop.webwxDataTicket);
								form.append("pass_ticket", encodeURI(this._prop.passTicket));
								form.append("filename", data, {
									filename: name,
									contentType: type,
									knownLength: size
								});

								formDataPromise = new Promise(function (resolve, reject) {
									if (_global.isBrowserEnv) {
										resolve({
											data: form,
											headers: {}
										});
									} else {
										form.pipe((0, _bl2.default)(function (err, buffer) {
											if (err) {
												reject(err);
											} else {
												resolve({
													data: buffer,
													headers: form.getHeaders()
												});
											}
										}));
									}
								});

								// 发起上传请求

								_context14.t1 = this;
								_context14.t2 = { f: "json" };
								_context14.t3 = this._config.API_webwxuploadmedia;
								_context14.next = 56;
								return formDataPromise;

							case 56:
								_context14.t4 = _context14.sent.headers;
								_context14.t5 = {
									method: "POST",
									params: _context14.t2,
									data: null,
									url: _context14.t3,
									headers: _context14.t4
								};
								_context14.next = 60;
								return _context14.t1._request.call(_context14.t1, _context14.t5);

							case 60:
								res = _context14.sent;
								mediaId = res.data.MediaId;
								return _context14.abrupt("return", {
									name: name,
									size: size,
									ext: ext,
									mediatype: mediatype,
									mediaId: mediaId
								});

							case 65:
								_context14.prev = 65;
								_context14.t6 = _context14["catch"](0);

								debug(_context14.t6);
								_context14.t6.tips = "上传媒体文件失败";
								throw _context14.t6;

							case 70:
							case "end":
								return _context14.stop();
						}
					}
				}, _callee14, this, [[0, 65]]);
			}));

			function uploadMedia(_x10, _x11, _x12) {
				return _ref14.apply(this, arguments);
			}

			return uploadMedia;
		}()

		/**
   * 发送图片消息
   * @param {string} mediaId - 媒体文件的ID
   * @param {string} to - 接收方用户名
   * @returns {Promise<Object>} - 发送成功后返回的消息对象
   */

	}, {
		key: "sendPictureMessage",
		value: function () {
			var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(mediaId, to) {
				var params, clientMsgId, data, res, responseData;
				return regeneratorRuntime.wrap(function _callee15$(_context15) {
					while (1) {
						switch (_context15.prev = _context15.next) {
							case 0:
								_context15.prev = 0;
								params = {
									f: "json",
									fun: "async",
									lang: "zh_CN",
									pass_ticket: this._prop.passTicket
								};
								clientMsgId = (0, _global.generateClientMsgID)();
								data = {
									BaseRequest: this._baseRequest(),
									Scene: 0,
									Msg: {
										Type: this._config.MSGTYPE_IMAGE,
										MediaId: mediaId,
										ToUserName: to,
										LocalID: clientMsgId,
										ClientMsgId: clientMsgId,
										FromUserName: this._user.UserName
									}
								};
								_context15.next = 6;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxsendmsgimg
								});

							case 6:
								res = _context15.sent;
								responseData = res.data;

								(0, _assert.equal)(responseData.BaseResponse.Ret, 0, res);

								return _context15.abrupt("return", responseData);

							case 12:
								_context15.prev = 12;
								_context15.t0 = _context15["catch"](0);

								debug(_context15.t0);
								_context15.t0.tips = "发送图片失败";
								throw _context15.t0;

							case 17:
							case "end":
								return _context15.stop();
						}
					}
				}, _callee15, this, [[0, 12]]);
			}));

			function sendPictureMessage(_x13, _x14) {
				return _ref15.apply(this, arguments);
			}

			return sendPictureMessage;
		}()

		/**
   * 发送视频消息
   * @param {string} mediaId - 媒体文件的ID
   * @param {string} to - 接收方用户名
   * @returns {Promise<Object>} - 发送成功后返回的消息对象
   */

	}, {
		key: "sendVideoMessage",
		value: function () {
			var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(mediaId, to) {
				var params, clientMsgId, data, res, responseData;
				return regeneratorRuntime.wrap(function _callee16$(_context16) {
					while (1) {
						switch (_context16.prev = _context16.next) {
							case 0:
								_context16.prev = 0;
								params = {
									f: "json",
									fun: "async",
									lang: "zh_CN",
									pass_ticket: this._prop.passTicket
								};
								clientMsgId = (0, _global.generateClientMsgID)();
								data = {
									BaseRequest: this._baseRequest(),
									Scene: 0,
									Msg: {
										Type: this._config.MSGTYPE_VIDEO,
										MediaId: mediaId,
										ToUserName: to,
										LocalID: clientMsgId,
										ClientMsgId: clientMsgId,
										FromUserName: this._user.UserName
									}
								};
								_context16.next = 6;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxsendmsgvedio
								});

							case 6:
								res = _context16.sent;
								responseData = res.data;

								(0, _assert.equal)(responseData.BaseResponse.Ret, 0, res);

								return _context16.abrupt("return", responseData);

							case 12:
								_context16.prev = 12;
								_context16.t0 = _context16["catch"](0);

								debug(_context16.t0);
								_context16.t0.tips = "发送视频失败";
								throw _context16.t0;

							case 17:
							case "end":
								return _context16.stop();
						}
					}
				}, _callee16, this, [[0, 12]]);
			}));

			function sendVideoMessage(_x15, _x16) {
				return _ref16.apply(this, arguments);
			}

			return sendVideoMessage;
		}()

		/**
   * 发送文件消息
   * @param {string} mediaId - 媒体文件的ID
   * @param {string} name - 文件名
   * @param {number} size - 文件大小（字节）
   * @param {string} ext - 文件扩展名
   * @param {string} to - 接收方用户名
   * @returns {Promise<Object>} - 发送成功后返回的消息对象
   */

	}, {
		key: "sendDocumentMessage",
		value: function () {
			var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(mediaId, name, size, ext, to) {
				var params, clientMsgId, content, data, res, responseData;
				return regeneratorRuntime.wrap(function _callee17$(_context17) {
					while (1) {
						switch (_context17.prev = _context17.next) {
							case 0:
								_context17.prev = 0;
								params = {
									f: "json",
									fun: "async",
									lang: "zh_CN",
									pass_ticket: this._prop.passTicket
								};
								clientMsgId = (0, _global.generateClientMsgID)();
								content = "\n\t\t\t\t<appmsg appid='wxeb7ec651dd0aefa9' sdkver=''>\n\t\t\t\t\t<title>" + name + "</title>\n\t\t\t\t\t<des></des>\n\t\t\t\t\t<action></action>\n\t\t\t\t\t<type>6</type>\n\t\t\t\t\t<content></content>\n\t\t\t\t\t<url></url>\n\t\t\t\t\t<lowurl></lowurl>\n\t\t\t\t\t<appattach>\n\t\t\t\t\t\t<totallen>" + size + "</totallen>\n\t\t\t\t\t\t<attachid>" + mediaId + "</attachid>\n\t\t\t\t\t\t<fileext>" + ext + "</fileext>\n\t\t\t\t\t</appattach>\n\t\t\t\t\t<extinfo></extinfo>\n\t\t\t\t</appmsg>";
								data = {
									BaseRequest: this._baseRequest(),
									Scene: 0,
									Msg: {
										Type: this._config.APPMSGTYPE_ATTACH,
										Content: content,
										ToUserName: to,
										LocalID: clientMsgId,
										ClientMsgId: clientMsgId,
										FromUserName: this._user.UserName
									}
								};
								_context17.next = 7;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxsendappmsg
								});

							case 7:
								res = _context17.sent;
								responseData = res.data;

								(0, _assert.equal)(responseData.BaseResponse.Ret, 0, res);

								return _context17.abrupt("return", responseData);

							case 13:
								_context17.prev = 13;
								_context17.t0 = _context17["catch"](0);

								debug(_context17.t0);
								_context17.t0.tips = "发送文件失败";
								throw _context17.t0;

							case 18:
							case "end":
								return _context17.stop();
						}
					}
				}, _callee17, this, [[0, 13]]);
			}));

			function sendDocumentMessage(_x17, _x18, _x19, _x20, _x21) {
				return _ref17.apply(this, arguments);
			}

			return sendDocumentMessage;
		}()

		/**
   * 转发消息
   * @param {Object} msg - 需要转发的消息对象
   * @param {string} to - 接收方用户名
   * @returns {Promise<Object>} - 转发成功后返回的消息对象
   */

	}, {
		key: "forwardMessage",
		value: function () {
			var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(msg, to) {
				var params, clientMsgId, data, url, pm, res, responseData;
				return regeneratorRuntime.wrap(function _callee18$(_context18) {
					while (1) {
						switch (_context18.prev = _context18.next) {
							case 0:
								_context18.prev = 0;
								params = {
									f: "json",
									fun: "async",
									lang: "zh_CN",
									pass_ticket: this._prop.passTicket
								};
								clientMsgId = (0, _global.generateClientMsgID)();
								data = {
									BaseRequest: this._baseRequest(),
									Scene: 2,
									Msg: {
										Type: msg.MsgType,
										MediaId: "",
										Content: msg.Content.replace(/&lt;/g, "<").replace(/&gt;/g, ">"),
										ToUserName: to,
										LocalID: clientMsgId,
										ClientMsgId: clientMsgId,
										FromUserName: this._user.UserName
									}
								};
								url = void 0, pm = void 0;
								_context18.t0 = msg.MsgType;
								_context18.next = _context18.t0 === this._config.MSGTYPE_TEXT ? 8 : _context18.t0 === this._config.MSGTYPE_IMAGE ? 11 : _context18.t0 === this._config.MSGTYPE_EMOTICON ? 13 : _context18.t0 === this._config.MSGTYPE_MICROVIDEO ? 23 : _context18.t0 === this._config.MSGTYPE_VIDEO ? 23 : _context18.t0 === this._config.MSGTYPE_APP ? 26 : 30;
								break;

							case 8:
								url = this._config.API_webwxsendmsg;
								if (msg.SubMsgType === this._config.MSGTYPE_LOCATION) {
									data.Msg.Type = this._config.MSGTYPE_LOCATION;
									data.Msg.Content = msg.OriContent.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
								}
								return _context18.abrupt("break", 31);

							case 11:
								url = this._config.API_webwxsendmsgimg;
								return _context18.abrupt("break", 31);

							case 13:
								params.fun = "sys";
								url = this._config.API_webwxsendemoticon;
								data.Msg.EMoticonMd5 = msg.Content.replace(/^[\s\S]*?md5\s?=\s?"(.*?)"[\s\S]*?$/, "$1");

								if (data.Msg.EMoticonMd5) {
									_context18.next = 18;
									break;
								}

								throw new Error("商店表情不能转发");

							case 18:
								data.Scene = 0;
								data.Msg.EmojiFlag = 2;
								delete data.Msg.MediaId;
								delete data.Msg.Content;
								return _context18.abrupt("break", 31);

							case 23:
								url = this._config.API_webwxsendmsgvedio;
								data.Msg.Type = this._config.MSGTYPE_VIDEO;
								return _context18.abrupt("break", 31);

							case 26:
								url = this._config.API_webwxsendappmsg;
								data.Msg.Type = msg.AppMsgType;
								data.Msg.Content = data.Msg.Content.replace(/^[\s\S]*?(<appmsg[\s\S]*?<attachid>)[\s\S]*?(<\/attachid>[\s\S]*?<\/appmsg>)[\s\S]*?$/, "$1" + msg.MediaId + "$2");
								return _context18.abrupt("break", 31);

							case 30:
								throw new Error("该消息类型不能直接转发");

							case 31:
								_context18.next = 33;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: url
								});

							case 33:
								res = _context18.sent;
								responseData = res.data;

								(0, _assert.equal)(responseData.BaseResponse.Ret, 0, res);

								return _context18.abrupt("return", responseData);

							case 39:
								_context18.prev = 39;
								_context18.t1 = _context18["catch"](0);

								debug(_context18.t1);
								_context18.t1.tips = "转发消息失败";
								throw _context18.t1;

							case 44:
							case "end":
								return _context18.stop();
						}
					}
				}, _callee18, this, [[0, 39]]);
			}));

			function forwardMessage(_x22, _x23) {
				return _ref18.apply(this, arguments);
			}

			return forwardMessage;
		}()

		/**
   * 撤回消息
   * @param {string} msgId - 待撤回的消息ID
   * @param {string} toUserName - 消息所在的聊天对象的用户名
   * @returns {Promise<Object>} - 包含操作结果的对象
   */

	}, {
		key: "revokeMessage",
		value: function () {
			var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(msgId, toUserName) {
				var data, res, result;
				return regeneratorRuntime.wrap(function _callee19$(_context19) {
					while (1) {
						switch (_context19.prev = _context19.next) {
							case 0:
								_context19.prev = 0;
								data = {
									BaseRequest: this._baseRequest(),
									SvrMsgId: msgId,
									ToUserName: toUserName,
									ClientMsgId: (0, _global.generateClientMsgID)()
								};
								_context19.next = 4;
								return this._request({
									method: "POST",
									url: this._config.API_webwxrevokemsg,
									data: data
								});

							case 4:
								res = _context19.sent;
								result = res.data;

								if (!(result.BaseResponse.Ret !== 0)) {
									_context19.next = 8;
									break;
								}

								throw new Error("\u64A4\u56DE\u6D88\u606F\u5931\u8D25: " + JSON.stringify(res));

							case 8:
								return _context19.abrupt("return", result);

							case 11:
								_context19.prev = 11;
								_context19.t0 = _context19["catch"](0);

								debug(_context19.t0);
								_context19.t0.tips = "撤回消息失败";
								throw _context19.t0;

							case 16:
							case "end":
								return _context19.stop();
						}
					}
				}, _callee19, this, [[0, 11]]);
			}));

			function revokeMessage(_x24, _x25) {
				return _ref19.apply(this, arguments);
			}

			return revokeMessage;
		}()

		/**
   * 获取消息图片或表情
   * @param {string} msgId - 消息ID
   * @returns {Promise<Object>} - 包含图片或表情数据和类型的对象
   */

	}, {
		key: "getMessageImg",
		value: function () {
			var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(msgId) {
				var params, res;
				return regeneratorRuntime.wrap(function _callee20$(_context20) {
					while (1) {
						switch (_context20.prev = _context20.next) {
							case 0:
								_context20.prev = 0;
								params = {
									type: "big",
									MsgID: msgId,
									skey: this._prop.skey
								};
								_context20.next = 4;
								return this._request({
									method: "GET",
									params: params,
									responseType: "arraybuffer",
									url: this._config.API_webwxgetmsgimg
								});

							case 4:
								res = _context20.sent;
								return _context20.abrupt("return", {
									data: res.data,
									type: res.headers["content-type"]
								});

							case 8:
								_context20.prev = 8;
								_context20.t0 = _context20["catch"](0);

								debug(_context20.t0);
								_context20.t0.tips = "获取图片或表情失败";
								throw _context20.t0;

							case 13:
							case "end":
								return _context20.stop();
						}
					}
				}, _callee20, this, [[0, 8]]);
			}));

			function getMessageImg(_x26) {
				return _ref20.apply(this, arguments);
			}

			return getMessageImg;
		}()

		/**
   * 获取视频
   * @param {string} msgId - 消息ID
   * @returns {Promise<Object>} - 包含视频数据和类型的对象
   */

	}, {
		key: "getMessageVideo",
		value: function () {
			var _ref21 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(msgId) {
				var params, res;
				return regeneratorRuntime.wrap(function _callee21$(_context21) {
					while (1) {
						switch (_context21.prev = _context21.next) {
							case 0:
								_context21.prev = 0;
								params = {
									MsgID: msgId,
									skey: this._prop.skey
								};
								_context21.next = 4;
								return this._request({
									method: "GET",
									headers: {
										Range: "bytes=0-"
									},
									params: params,
									responseType: "arraybuffer",
									url: this._config.API_webwxgetvideo
								});

							case 4:
								res = _context21.sent;
								return _context21.abrupt("return", {
									data: res.data,
									type: res.headers["content-type"]
								});

							case 8:
								_context21.prev = 8;
								_context21.t0 = _context21["catch"](0);

								debug(_context21.t0);
								_context21.t0.tips = "获取视频失败";
								throw _context21.t0;

							case 13:
							case "end":
								return _context21.stop();
						}
					}
				}, _callee21, this, [[0, 8]]);
			}));

			function getMessageVideo(_x27) {
				return _ref21.apply(this, arguments);
			}

			return getMessageVideo;
		}()

		/**
   * 获取声音
   * @param {string} msgId - 消息ID
   * @returns {Promise<Object>} - 包含声音数据和类型的对象
   */

	}, {
		key: "getMessageVoice",
		value: function () {
			var _ref22 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22(msgId) {
				var params, res;
				return regeneratorRuntime.wrap(function _callee22$(_context22) {
					while (1) {
						switch (_context22.prev = _context22.next) {
							case 0:
								_context22.prev = 0;
								params = {
									MsgID: msgId,
									skey: this._prop.skey
								};
								_context22.next = 4;
								return this._request({
									method: "GET",
									params: params,
									responseType: "arraybuffer",
									url: this._config.API_webwxgetvoice
								});

							case 4:
								res = _context22.sent;
								return _context22.abrupt("return", {
									data: res.data,
									type: res.headers["content-type"]
								});

							case 8:
								_context22.prev = 8;
								_context22.t0 = _context22["catch"](0);

								debug(_context22.t0);
								_context22.t0.tips = "获取声音失败";
								throw _context22.t0;

							case 13:
							case "end":
								return _context22.stop();
						}
					}
				}, _callee22, this, [[0, 8]]);
			}));

			function getMessageVoice(_x28) {
				return _ref22.apply(this, arguments);
			}

			return getMessageVoice;
		}()

		/**
   * 获取头像图片
   * @param {string} HeadImgUrl - 头像图片的URL
   * @returns {Promise<Object>} - 包含头像图片数据和类型的对象
   */

	}, {
		key: "getHeadImg",
		value: function () {
			var _ref23 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23(HeadImgUrl) {
				var url, res;
				return regeneratorRuntime.wrap(function _callee23$(_context23) {
					while (1) {
						switch (_context23.prev = _context23.next) {
							case 0:
								_context23.prev = 0;
								url = this._config.origin + HeadImgUrl;
								_context23.next = 4;
								return this._request({
									method: "GET",
									url: url,
									responseType: "arraybuffer"
								});

							case 4:
								res = _context23.sent;
								return _context23.abrupt("return", {
									data: res.data,
									type: res.headers["content-type"]
								});

							case 8:
								_context23.prev = 8;
								_context23.t0 = _context23["catch"](0);

								debug(_context23.t0);
								_context23.t0.tips = "获取头像失败";
								throw _context23.t0;

							case 13:
							case "end":
								return _context23.stop();
						}
					}
				}, _callee23, this, [[0, 8]]);
			}));

			function getHeadImg(_x29) {
				return _ref23.apply(this, arguments);
			}

			return getHeadImg;
		}()

		/**
   * 获取文件
   * @param {string} FromUserName - 发送者用户名
   * @param {string} MediaId - 文件的媒体ID
   * @param {string} FileName - 文件名
   * @returns {Promise<Object>} - 包含文件数据和类型的对象
   */

	}, {
		key: "getDocument",
		value: function () {
			var _ref24 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24(FromUserName, MediaId, FileName) {
				var params, res;
				return regeneratorRuntime.wrap(function _callee24$(_context24) {
					while (1) {
						switch (_context24.prev = _context24.next) {
							case 0:
								_context24.prev = 0;
								params = {
									sender: FromUserName,
									mediaid: MediaId,
									filename: FileName,
									fromuser: this._user.UserName,
									pass_ticket: this._prop.passTicket,
									webwx_data_ticket: this._prop.webwxDataTicket
								};
								_context24.next = 4;
								return this._request({
									method: "GET",
									params: params,
									responseType: "arraybuffer",
									url: this._config.API_webwxdownloadmedia
								});

							case 4:
								res = _context24.sent;
								return _context24.abrupt("return", {
									data: res.data,
									type: res.headers["content-type"]
								});

							case 8:
								_context24.prev = 8;
								_context24.t0 = _context24["catch"](0);

								debug(_context24.t0);
								_context24.t0.tips = "获取文件失败";
								throw _context24.t0;

							case 13:
							case "end":
								return _context24.stop();
						}
					}
				}, _callee24, this, [[0, 8]]);
			}));

			function getDocument(_x30, _x31, _x32) {
				return _ref24.apply(this, arguments);
			}

			return getDocument;
		}()

		/**
   * 通过好友请求
   * @param {string} UserName - 好友的用户名
   * @param {string} Ticket - 好友的验证票据
   * @returns {Promise<Object>} - 包含通过好友请求后返回的数据的对象
   */

	}, {
		key: "verifyUser",
		value: function () {
			var _ref25 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25(UserName, Ticket) {
				var params, data, res, result;
				return regeneratorRuntime.wrap(function _callee25$(_context25) {
					while (1) {
						switch (_context25.prev = _context25.next) {
							case 0:
								_context25.prev = 0;
								params = {
									lang: "zh_CN",
									pass_ticket: this._prop.passTicket
								};
								data = {
									BaseRequest: this._baseRequest(),
									Opcode: 3,
									VerifyUserListSize: 1,
									VerifyUserList: [{
										Value: UserName,
										VerifyUserTicket: Ticket
									}],
									VerifyContent: "",
									SceneListCount: 1,
									SceneList: [33],
									skey: this._prop.skey
								};
								_context25.next = 5;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxverifyuser
								});

							case 5:
								res = _context25.sent;
								result = res.data;

								if (!(result.BaseResponse.Ret !== 0)) {
									_context25.next = 9;
									break;
								}

								throw new Error("\u901A\u8FC7\u597D\u53CB\u8BF7\u6C42\u5931\u8D25: " + JSON.stringify(res));

							case 9:
								return _context25.abrupt("return", result);

							case 12:
								_context25.prev = 12;
								_context25.t0 = _context25["catch"](0);

								debug(_context25.t0);
								_context25.t0.tips = "通过好友请求失败";
								throw _context25.t0;

							case 17:
							case "end":
								return _context25.stop();
						}
					}
				}, _callee25, this, [[0, 12]]);
			}));

			function verifyUser(_x33, _x34) {
				return _ref25.apply(this, arguments);
			}

			return verifyUser;
		}()

		/**
   * 添加好友
   * @param {string} UserName - 好友的用户名
   * @param {string} [content=我是${this._user.NickName}] - 验证消息内容，默认为当前用户的昵称
   * @returns {Promise<Object>} - 包含添加好友后返回的数据的对象
   */

	}, {
		key: "addFriend",
		value: function () {
			var _ref26 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26(UserName) {
				var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "\u6211\u662F" + this._user.NickName;
				var params, data, res, result;
				return regeneratorRuntime.wrap(function _callee26$(_context26) {
					while (1) {
						switch (_context26.prev = _context26.next) {
							case 0:
								_context26.prev = 0;
								params = {
									lang: "zh_CN",
									pass_ticket: this._prop.passTicket
								};
								data = {
									BaseRequest: this._baseRequest(),
									Opcode: 2,
									VerifyUserListSize: 1,
									VerifyUserList: [{
										Value: UserName,
										VerifyUserTicket: ""
									}],
									VerifyContent: content,
									SceneListCount: 1,
									SceneList: [33],
									skey: this._prop.skey
								};
								_context26.next = 5;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxverifyuser
								});

							case 5:
								res = _context26.sent;
								result = res.data;

								if (!(result.BaseResponse.Ret !== 0)) {
									_context26.next = 9;
									break;
								}

								throw new Error("\u6DFB\u52A0\u597D\u53CB\u5931\u8D25: " + JSON.stringify(res));

							case 9:
								return _context26.abrupt("return", result);

							case 12:
								_context26.prev = 12;
								_context26.t0 = _context26["catch"](0);

								debug(_context26.t0);
								_context26.t0.tips = "添加好友失败";
								throw _context26.t0;

							case 17:
							case "end":
								return _context26.stop();
						}
					}
				}, _callee26, this, [[0, 12]]);
			}));

			function addFriend(_x36) {
				return _ref26.apply(this, arguments);
			}

			return addFriend;
		}()

		// Topic: Chatroom name
		// MemberList format:
		// [
		//   {"UserName":"@250d8d156ad9f8b068c2e3df3464ecf2"},
		//   {"UserName":"@42d725733741de6ac53cbe3738d8dd2e"}
		// ]
		/**
   * 创建群聊
   * @param {string} Topic - 群聊的主题
   * @param {Array} MemberList - 成员列表，包含要邀请的成员的用户名
   * @returns {Promise<Object>} - 包含创建群聊后返回的数据的对象
   */

	}, {
		key: "createChatroom",
		value: function () {
			var _ref27 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27(Topic, MemberList) {
				var params, data, res, result;
				return regeneratorRuntime.wrap(function _callee27$(_context27) {
					while (1) {
						switch (_context27.prev = _context27.next) {
							case 0:
								_context27.prev = 0;
								params = {
									lang: "zh_CN",
									r: ~new Date(),
									pass_ticket: this._prop.passTicket
								};
								data = {
									BaseRequest: this._baseRequest(),
									MemberCount: MemberList.length,
									MemberList: MemberList,
									Topic: Topic
								};
								_context27.next = 5;
								return this._request({
									method: "POST",
									url: this._config.API_webwxcreatechatroom,
									params: params,
									data: data
								});

							case 5:
								res = _context27.sent;
								result = res.data;

								if (!(result.BaseResponse.Ret !== 0)) {
									_context27.next = 9;
									break;
								}

								throw new Error("\u521B\u5EFA\u7FA4\u5931\u8D25: " + JSON.stringify(res));

							case 9:
								return _context27.abrupt("return", result);

							case 12:
								_context27.prev = 12;
								_context27.t0 = _context27["catch"](0);

								debug(_context27.t0);
								_context27.t0.tips = "创建群失败";
								throw _context27.t0;

							case 17:
							case "end":
								return _context27.stop();
						}
					}
				}, _callee27, this, [[0, 12]]);
			}));

			function createChatroom(_x37, _x38) {
				return _ref27.apply(this, arguments);
			}

			return createChatroom;
		}()

		/**
   * 更新群聊信息（添加、删除或邀请成员）
   * @param {string} ChatRoomUserName - 群聊的用户名
   * @param {Array} MemberList - 成员列表，包含要操作的成员的用户名
   * @param {string} fun - 操作类型，可选值为 "addmember"、"delmember" 或 "invitemember"
   * @returns {Promise<Object>} - 包含更新群聊后返回的数据的对象
   */

	}, {
		key: "updateChatroom",
		value: function () {
			var _ref28 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28(ChatRoomUserName, MemberList, fun) {
				var params, data, res, result;
				return regeneratorRuntime.wrap(function _callee28$(_context28) {
					while (1) {
						switch (_context28.prev = _context28.next) {
							case 0:
								_context28.prev = 0;
								params = {
									fun: fun
								};
								data = {
									BaseRequest: this._baseRequest(),
									ChatRoomName: ChatRoomUserName
								};


								if (fun === "addmember") {
									data.AddMemberList = MemberList.toString();
								} else if (fun === "delmember") {
									data.DelMemberList = MemberList.toString();
								} else if (fun === "invitemember") {
									data.InviteMemberList = MemberList.toString();
								}

								_context28.next = 6;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxupdatechatroom
								});

							case 6:
								res = _context28.sent;
								result = res.data;

								if (!(result.BaseResponse.Ret !== 0)) {
									_context28.next = 10;
									break;
								}

								throw new Error("\u9080\u8BF7\u6216\u8E22\u51FA\u7FA4\u6210\u5458\u5931\u8D25: " + JSON.stringify(res));

							case 10:
								return _context28.abrupt("return", result);

							case 13:
								_context28.prev = 13;
								_context28.t0 = _context28["catch"](0);

								debug(_context28.t0);
								_context28.t0.tips = "邀请或踢出群成员失败";
								throw _context28.t0;

							case 18:
							case "end":
								return _context28.stop();
						}
					}
				}, _callee28, this, [[0, 13]]);
			}));

			function updateChatroom(_x39, _x40, _x41) {
				return _ref28.apply(this, arguments);
			}

			return updateChatroom;
		}()

		/**
   * 更新群名
   * @param {string} ChatRoomUserName - 群的用户名
   * @param {string} NewName - 群的新名字
   * @returns {Promise<void>} - 执行结果的Promise对象
   */

	}, {
		key: "updateChatRoomName",
		value: function () {
			var _ref29 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee29(ChatRoomUserName, NewName) {
				var params, data, res, result;
				return regeneratorRuntime.wrap(function _callee29$(_context29) {
					while (1) {
						switch (_context29.prev = _context29.next) {
							case 0:
								_context29.prev = 0;
								params = {
									fun: "modtopic"
								};
								data = {
									BaseRequest: this._baseRequest(),
									ChatRoomName: ChatRoomUserName,
									NewTopic: NewName
								};
								_context29.next = 5;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxupdatechatroom
								});

							case 5:
								res = _context29.sent;
								result = res.data;

								if (!(result.BaseResponse.Ret !== 0)) {
									_context29.next = 9;
									break;
								}

								throw new Error("\u66F4\u65B0\u7FA4\u540D\u5931\u8D25: " + JSON.stringify(res));

							case 9:
								_context29.next = 16;
								break;

							case 11:
								_context29.prev = 11;
								_context29.t0 = _context29["catch"](0);

								debug(_context29.t0);
								_context29.t0.tips = "更新群名失败";
								throw _context29.t0;

							case 16:
							case "end":
								return _context29.stop();
						}
					}
				}, _callee29, this, [[0, 11]]);
			}));

			function updateChatRoomName(_x42, _x43) {
				return _ref29.apply(this, arguments);
			}

			return updateChatRoomName;
		}()

		/**
   * 更新联系人的备注名
   * @param {string} UserName - 联系人的用户名
   * @param {string} RemarkName - 联系人的备注名
   * @returns {Promise<Object>} - 包含操作结果的对象
   */

	}, {
		key: "updateRemarkName",
		value: function () {
			var _ref30 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee30(UserName, RemarkName) {
				var params, data, res, result;
				return regeneratorRuntime.wrap(function _callee30$(_context30) {
					while (1) {
						switch (_context30.prev = _context30.next) {
							case 0:
								_context30.prev = 0;
								params = {
									lang: "zh_CN",
									pass_ticket: this._prop.passTicket
								};
								data = {
									BaseRequest: this._baseRequest(),
									CmdId: 2,
									RemarkName: RemarkName,
									UserName: UserName
								};
								_context30.next = 5;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxoplog
								});

							case 5:
								res = _context30.sent;
								result = res.data;

								if (!(result.BaseResponse.Ret !== 0)) {
									_context30.next = 9;
									break;
								}

								throw new Error("\u8BBE\u7F6E\u7528\u6237\u6807\u7B7E\u5931\u8D25: " + JSON.stringify(res));

							case 9:
								return _context30.abrupt("return", result);

							case 12:
								_context30.prev = 12;
								_context30.t0 = _context30["catch"](0);

								debug(_context30.t0);
								_context30.t0.tips = "设置用户标签失败";
								throw _context30.t0;

							case 17:
							case "end":
								return _context30.stop();
						}
					}
				}, _callee30, this, [[0, 12]]);
			}));

			function updateRemarkName(_x44, _x45) {
				return _ref30.apply(this, arguments);
			}

			return updateRemarkName;
		}()

		/**
   * 置顶或取消置顶联系人
   * @param {string} UserName - 联系人的用户名
   * @param {number} OP - 操作类型，0表示取消置顶，1表示置顶
   * @param {string} RemarkName - 联系人的备注名
   * @returns {Promise<Object>} - 包含操作结果的对象
   */

	}, {
		key: "opLog",
		value: function () {
			var _ref31 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee31(UserName, OP, RemarkName) {
				var params, data, res, result;
				return regeneratorRuntime.wrap(function _callee31$(_context31) {
					while (1) {
						switch (_context31.prev = _context31.next) {
							case 0:
								_context31.prev = 0;
								params = {
									pass_ticket: this._prop.passTicket
								};
								data = {
									BaseRequest: this._baseRequest(),
									CmdId: 3,
									OP: OP,
									RemarkName: RemarkName,
									UserName: UserName
								};
								_context31.next = 5;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxoplog
								});

							case 5:
								res = _context31.sent;
								result = res.data;

								if (!(result.BaseResponse.Ret !== 0)) {
									_context31.next = 9;
									break;
								}

								throw new Error("\u7F6E\u9876\u6216\u53D6\u6D88\u7F6E\u9876\u5931\u8D25: " + JSON.stringify(res));

							case 9:
								return _context31.abrupt("return", result);

							case 12:
								_context31.prev = 12;
								_context31.t0 = _context31["catch"](0);

								debug(_context31.t0);
								_context31.t0.tips = "置顶或取消置顶失败";
								throw _context31.t0;

							case 17:
							case "end":
								return _context31.stop();
						}
					}
				}, _callee31, this, [[0, 12]]);
			}));

			function opLog(_x46, _x47, _x48) {
				return _ref31.apply(this, arguments);
			}

			return opLog;
		}()
	}, {
		key: "Data",
		set: function set(data) {
			var _this3 = this;

			/**
    * 遍历 data 对象的键，并将对应键的值复制给 this 对象的相应属性
    */
			Object.keys(data).forEach(function (key) {
				Object.assign(_this3[key], data[key]);
			});
		}

		/**
   * 获取 botData 对象
   * @returns {Object} botData 对象
   */
		,
		get: function get() {
			return {
				/**
     * 存储 PROP 属性的对象
     * @type {Object}
     */
				PROP: this._prop,
				/**
     * 存储 CONF 属性的对象
     * @type {Object}
     */
				CONF: this._config,
				/**
     * 存储 COOKIE 属性的对象
     * @type {Object}
     */
				COOKIE: this._cookie,
				/**
     * 存储 user 属性的对象
     * @type {Object}
     */
				user: this._user
			};
		}
	}]);

	return WeixinCore;
}();

exports.default = WeixinCore;
//# sourceMappingURL=core.js.map