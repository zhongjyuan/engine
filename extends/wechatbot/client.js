"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.AlreadyLogoutError = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _bl = require("bl");

var _bl2 = _interopRequireDefault(_bl);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _mime = require("mime");

var _mime2 = _interopRequireDefault(_mime);

var _formData = require("form-data");

var _formData2 = _interopRequireDefault(_formData);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _request = require("./request");

var _global = require("./global");

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
 * 微信客户端对象
 */


var WeChatClient = function () {
	/**
  * 微信客户端构造函数
  * @param {*} data 客户端数据对象
  */
	function WeChatClient(data) {
		_classCallCheck(this, WeChatClient);

		// 用EventEmitter扩展this对象，使其具备事件监听和触发的能力
		_lodash2.default.extend(this, new _events2.default());

		/**配置对象 */
		this._config = (0, _global.getConfig)();
		/**设备ID */
		this._deviceId = (0, _util.generateDeviceID)();
		/**当前用户对象 */
		this._user = {};
		/**请求Cookie */
		this._cookie = {};
		/**核心属性对象 */
		this._prop = {
			uuid: "",
			uin: "",
			sid: "",
			skey: "",
			passTicket: "",
			formatedSyncKey: "",
			webwxAuthTicket: "",
			webwxDataTicket: "",
			syncKey: { List: [] }
		};
		/**状态对象 */
		this.STATE = this._config.STATE;
		/**通用数据对象 */
		this._data = data || {};
		/**请求对象 */
		this._request = new _request.Request({ Cookie: this._cookie });
	}

	/**通用数据对象 */


	_createClass(WeChatClient, [{
		key: "_baseRequest",


		/**
   * 基础请求对象
   * @returns 基础请求对象
   */
		value: function _baseRequest() {
			return {
				Uin: parseInt(this._prop.uin),
				Sid: this._prop.sid,
				Skey: this._prop.skey,
				DeviceID: this._deviceId
			};
		}

		/**
   * 更新同步键
   * @param {*} data 同步数据对象
   */

	}, {
		key: "_updateSyncKey",
		value: function _updateSyncKey(data) {
			this.emit("update_synckey", data);
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

								this.emit("jsLogin_response", res);

								window = {
									QRLogin: {}
								};


								eval(res.data);
								(0, _util.equal)(window.QRLogin.code, 200, res);

								this._prop.uuid = window.QRLogin.uuid;

								return _context.abrupt("return", window.QRLogin.uuid);

							case 12:
								_context.prev = 12;
								_context.t0 = _context["catch"](0);

								this.emit("error", _context.t0);
								this.emit("jsLogin_error", _context.t0);
								_context.t0.tips = "获取UUID异常";
								throw _context.t0;

							case 18:
							case "end":
								return _context.stop();
						}
					}
				}, _callee, this, [[0, 12]]);
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
				var now, params, res, window;
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								_context2.prev = 0;
								now = Math.floor(Date.now() / 1000);
								params = {
									_: now.toString(),
									r: Math.floor(now / 1579).toString(),
									tip: 0,
									loginicon: true,
									uuid: this._prop.uuid
								};

								this.emit("loginCheck_request", { params: params, data: null });

								_context2.next = 6;
								return this._request({
									method: "GET",
									params: params,
									url: this._config.API_login
								});

							case 6:
								res = _context2.sent;

								this.emit("loginCheck_response", res);

								window = {};


								eval(res.data);
								(0, _util.notEqual)(window.code, 400, res);

								if (window.code === 200) {
									this.redirectUri = window.redirect_uri;
									this._config = (0, _global.getConfig)({ Domain: window.redirect_uri.match(/(?:\w+\.)+\w+/)[0] });
								} else if (window.code === 201 && window.userAvatar) {
									this._user.userAvatar = window.userAvatar;
								}

								return _context2.abrupt("return", window);

							case 15:
								_context2.prev = 15;
								_context2.t0 = _context2["catch"](0);

								this.emit("error", _context2.t0);
								this.emit("loginCheck_error", _context2.t0);
								_context2.t0.tips = "获取手机确认登录信息异常";
								throw _context2.t0;

							case 21:
							case "end":
								return _context2.stop();
						}
					}
				}, _callee2, this, [[0, 15]]);
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

				var params, res, pm;
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								_context3.prev = 0;
								params = {
									fun: "new",
									mod: "desktop",
									version: "v2"
								};

								this.emit("login_request", { params: params, data: null });

								_context3.next = 5;
								return this._request({
									method: "GET",
									params: params,
									headers: {
										extspam: this._config.UOSExtspam,
										"client-version": this._config.UOSClientVersion
									},
									url: this.redirectUri
								});

							case 5:
								res = _context3.sent;

								this.emit("login_response", res);

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
										} else if (/webwx.*?auth.*?ticket/i.test(item)) {
											_this2._prop.webwxAuthTicket = item.match(/=(.*?);/)[1];
										} else if (/wxuin/i.test(item)) {
											_this2._prop.uin = item.match(/=(.*?);/)[1];
										} else if (/wxsid/i.test(item)) {
											_this2._prop.sid = item.match(/=(.*?);/)[1];
										}
									});
									this._cookie = res.headers["set-cookie"];
								}
								_context3.next = 18;
								break;

							case 12:
								_context3.prev = 12;
								_context3.t0 = _context3["catch"](0);

								this.emit("error", _context3.t0);
								this.emit("login_error", _context3.t0);
								_context3.t0.tips = "登录异常";
								throw _context3.t0;

							case 18:
							case "end":
								return _context3.stop();
						}
					}
				}, _callee3, this, [[0, 12]]);
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
								params = { _: Math.floor(Date.now() / 1000).toString() };
								data = { BaseRequest: this._baseRequest() };

								this.emit("webwxinit_request", { params: params, data: data });

								_context4.next = 6;
								return this._request({
									method: "POST",
									data: data,
									params: params,
									url: this._config.API_webwxinit
								});

							case 6:
								res = _context4.sent;

								this.emit("webwxinit_response", res);

								initData = res.data;

								if (!(initData.BaseResponse.Ret == this._config.SYNCCHECK_RET_LOGOUT)) {
									_context4.next = 11;
									break;
								}

								throw new AlreadyLogoutError();

							case 11:

								(0, _util.equal)(initData.BaseResponse.Ret, 0, res);

								this._prop.skey = initData.SKey || this._prop.skey;

								this._updateSyncKey(initData);

								Object.assign(this._user, initData.User);

								return _context4.abrupt("return", initData);

							case 18:
								_context4.prev = 18;
								_context4.t0 = _context4["catch"](0);

								this.emit("error", _context4.t0);
								this.emit("webwxinit_error", _context4.t0);
								_context4.t0.tips = "初始化异常";
								throw _context4.t0;

							case 24:
							case "end":
								return _context4.stop();
						}
					}
				}, _callee4, this, [[0, 18]]);
			}));

			function init() {
				return _ref4.apply(this, arguments);
			}

			return init;
		}()

		/**
   * 发送手机状态通知
   * @param {string} toUserName - 接收通知的用户ID（可选）
   * @returns {Promise<void>} Promise 对象，表示手机状态通知操作完成
   */

	}, {
		key: "sendMobileNotification",
		value: function () {
			var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(toUserName) {
				var params, data, res, responseData;
				return regeneratorRuntime.wrap(function _callee5$(_context5) {
					while (1) {
						switch (_context5.prev = _context5.next) {
							case 0:
								_context5.prev = 0;
								params = {
									lang: this._config.Lang,
									pass_ticket: this._prop.passTicket
								};
								data = {
									Code: toUserName ? 1 : 3,
									BaseRequest: this._baseRequest(),
									FromUserName: this._user.UserName,
									ToUserName: toUserName || this._user.UserName,
									ClientMsgId: (0, _util.generateClientMsgID)()
								};

								this.emit("webwxstatusnotify_request", { params: params, data: data });

								_context5.next = 6;
								return this._request({
									method: "POST",
									data: data,
									params: params,
									url: this._config.API_webwxstatusnotify
								});

							case 6:
								res = _context5.sent;

								this.emit("webwxstatusnotify_response", res);

								responseData = res.data;


								(0, _util.equal)(responseData.BaseResponse.Ret, 0, res);
								_context5.next = 18;
								break;

							case 12:
								_context5.prev = 12;
								_context5.t0 = _context5["catch"](0);

								this.emit("error", _context5.t0);
								this.emit("webwxstatusnotify_error", _context5.t0);
								_context5.t0.tips = "手机状态通知异常";
								throw _context5.t0;

							case 18:
							case "end":
								return _context5.stop();
						}
					}
				}, _callee5, this, [[0, 12]]);
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
									r: +new Date(),
									seq: seq,
									lang: this._config.Lang,
									skey: this._prop.skey,
									pass_ticket: this._prop.passTicket
								};

								this.emit("webwxgetcontact_request", { params: params, data: null });

								_context6.next = 5;
								return this._request({
									method: "POST",
									params: params,
									url: this._config.API_webwxgetcontact
								});

							case 5:
								res = _context6.sent;

								this.emit("webwxgetcontact_response", res);

								data = res.data;

								(0, _util.equal)(data.BaseResponse.Ret, 0, res);

								return _context6.abrupt("return", data);

							case 12:
								_context6.prev = 12;
								_context6.t0 = _context6["catch"](0);

								this.emit("error", _context6.t0);
								this.emit("webwxgetcontact_error", _context6.t0);
								_context6.t0.tips = "获取通讯录异常";
								throw _context6.t0;

							case 18:
							case "end":
								return _context6.stop();
						}
					}
				}, _callee6, this, [[0, 12]]);
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
									r: +new Date(),
									type: "ex",
									lang: this._config.Lang,
									pass_ticket: this._prop.passTicket
								};
								data = {
									BaseRequest: this._baseRequest(),
									Count: contacts.length,
									List: contacts
								};

								this.emit("webwxbatchgetcontact_request", { params: params, data: data });

								_context7.next = 6;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxbatchgetcontact
								});

							case 6:
								res = _context7.sent;

								this.emit("webwxbatchgetcontact_response", res);

								responseData = res.data;

								(0, _util.equal)(responseData.BaseResponse.Ret, 0, res);

								return _context7.abrupt("return", responseData.ContactList);

							case 13:
								_context7.prev = 13;
								_context7.t0 = _context7["catch"](0);

								this.emit("error", _context7.t0);
								this.emit("webwxbatchgetcontact_error", _context7.t0);
								_context7.t0.tips = "批量获取联系人异常";
								throw _context7.t0;

							case 19:
							case "end":
								return _context7.stop();
						}
					}
				}, _callee7, this, [[0, 13]]);
			}));

			function fetchBatchContactInfo(_x4) {
				return _ref7.apply(this, arguments);
			}

			return fetchBatchContactInfo;
		}()

		/**
   * 执行同步检查
   * @returns {Promise<number>} Promise 对象，表示同步检查结果中的 selector 值
   */

	}, {
		key: "performSyncCheck",
		value: function () {
			var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
				var params, res, window;
				return regeneratorRuntime.wrap(function _callee8$(_context8) {
					while (1) {
						switch (_context8.prev = _context8.next) {
							case 0:
								_context8.prev = 0;
								params = {
									_: (Date.now() * 1).toString(),
									r: (Date.now() * 1).toString(),
									uin: this._prop.uin,
									sid: this._prop.sid,
									skey: this._prop.skey,
									deviceid: this._baseRequest().DeviceID,
									synckey: this._prop.formatedSyncKey
								};

								this.emit("synccheck_request", { params: params, data: null });

								_context8.next = 5;
								return this._request({
									method: "GET",
									params: params,
									url: this._config.API_synccheck
								});

							case 5:
								res = _context8.sent;

								this.emit("synccheck_response", res);

								window = {
									synccheck: {}
								};


								try {
									eval(res.data);
								} catch (ex) {
									window.synccheck = { retcode: "0", selector: "0" };
								}

								if (!(window.synccheck.retcode == this._config.SYNCCHECK_RET_LOGOUT)) {
									_context8.next = 11;
									break;
								}

								throw new AlreadyLogoutError();

							case 11:

								(0, _util.equal)(window.synccheck.retcode, this._config.SYNCCHECK_RET_SUCCESS, res);

								return _context8.abrupt("return", window.synccheck.selector);

							case 15:
								_context8.prev = 15;
								_context8.t0 = _context8["catch"](0);

								this.emit("error", _context8.t0);
								this.emit("synccheck_error", _context8.t0);
								_context8.t0.tips = "同步检查异常";
								throw _context8.t0;

							case 21:
							case "end":
								return _context8.stop();
						}
					}
				}, _callee8, this, [[0, 15]]);
			}));

			function performSyncCheck() {
				return _ref8.apply(this, arguments);
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
			var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
				var params, data, res, responseData;
				return regeneratorRuntime.wrap(function _callee9$(_context9) {
					while (1) {
						switch (_context9.prev = _context9.next) {
							case 0:
								_context9.prev = 0;
								params = {
									lang: this._config.Lang,
									sid: this._prop.sid,
									skey: this._prop.skey,
									pass_ticket: this._prop.passTicket
								};
								data = {
									BaseRequest: this._baseRequest(),
									SyncKey: this._prop.syncKey,
									rr: ~new Date()
								};

								this.emit("webwxsync_request", { params: params, data: data });

								_context9.next = 6;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxsync
								});

							case 6:
								res = _context9.sent;

								this.emit("webwxsync_response", res);

								responseData = res.data;

								if (!(responseData.BaseResponse.Ret == this._config.SYNCCHECK_RET_LOGOUT)) {
									_context9.next = 11;
									break;
								}

								throw new AlreadyLogoutError();

							case 11:

								(0, _util.equal)(responseData.BaseResponse.Ret, 0, res);

								this._updateSyncKey(responseData);
								this._prop.skey = responseData.SKey || this._prop.skey;

								return _context9.abrupt("return", responseData);

							case 17:
								_context9.prev = 17;
								_context9.t0 = _context9["catch"](0);

								this.emit("error", _context9.t0);
								this.emit("webwxsync_error", _context9.t0);
								_context9.t0.tips = "获取新信息异常";
								throw _context9.t0;

							case 23:
							case "end":
								return _context9.stop();
						}
					}
				}, _callee9, this, [[0, 17]]);
			}));

			function performSync() {
				return _ref9.apply(this, arguments);
			}

			return performSync;
		}()

		/**
   * 发送文本消息
   * @param {string} message - 要发送的消息内容
   * @param {string} toUserName - 目标用户的 UserName
   * @returns {Promise<Object>} Promise 对象，表示发送消息结果的数据对象
   * @throws {Error} 如果发送消息失败，则会抛出异常
   */

	}, {
		key: "sendTextMessage",
		value: function () {
			var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(message, toUserName) {
				var params, clientMessageId, data, res, responseData;
				return regeneratorRuntime.wrap(function _callee10$(_context10) {
					while (1) {
						switch (_context10.prev = _context10.next) {
							case 0:
								_context10.prev = 0;
								params = {
									lang: this._config.Lang,
									pass_ticket: this._prop.passTicket
								};
								clientMessageId = (0, _util.generateClientMsgID)();
								data = {
									Scene: 0,
									BaseRequest: this._baseRequest(),
									Msg: {
										Type: this._config.MSGTYPE_TEXT,
										Content: message,
										ToUserName: toUserName,
										LocalID: clientMessageId,
										ClientMsgId: clientMessageId,
										FromUserName: this._user["UserName"]
									}
								};

								this.emit("webwxsendmsg_request", { params: params, data: data });

								_context10.next = 7;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxsendmsg
								});

							case 7:
								res = _context10.sent;

								this.emit("webwxsendmsg_response", res);

								responseData = res.data;

								(0, _util.equal)(responseData.BaseResponse.Ret, 0, res);

								return _context10.abrupt("return", responseData);

							case 14:
								_context10.prev = 14;
								_context10.t0 = _context10["catch"](0);

								this.emit("error", _context10.t0);
								this.emit("webwxsendmsg_error", _context10.t0);
								_context10.t0.tips = "发送文本信息异常";
								throw _context10.t0;

							case 20:
							case "end":
								return _context10.stop();
						}
					}
				}, _callee10, this, [[0, 14]]);
			}));

			function sendTextMessage(_x5, _x6) {
				return _ref10.apply(this, arguments);
			}

			return sendTextMessage;
		}()

		/**
   * 发送表情消息
   * @param {string} id - 表情消息ID，可以是 MediaId 或 EMoticonMd5
   * @param {string} toUserName - 目标用户的 UserName
   * @returns {Promise<Object>} Promise 对象，表示发送消息结果的数据对象
   * @throws {Error} 如果发送消息失败，则会抛出异常
   */

	}, {
		key: "sendEmoticonMessage",
		value: function () {
			var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(id, toUserName) {
				var params, clientMessageId, data, res, responseData;
				return regeneratorRuntime.wrap(function _callee11$(_context11) {
					while (1) {
						switch (_context11.prev = _context11.next) {
							case 0:
								_context11.prev = 0;
								params = {
									fun: "sys",
									lang: this._config.Lang,
									pass_ticket: this._prop.passTicket
								};
								clientMessageId = (0, _util.generateClientMsgID)();
								data = {
									BaseRequest: this._baseRequest(),
									Scene: 0,
									Msg: {
										Type: this._config.MSGTYPE_EMOTICON,
										EmojiFlag: 2,
										ToUserName: toUserName,
										LocalID: clientMessageId,
										ClientMsgId: clientMessageId,
										FromUserName: this._user["UserName"]
									}
								};


								if (id.indexOf("@") === 0) {
									data.Msg.MediaId = id;
								} else {
									data.Msg.EMoticonMd5 = id;
								}
								this.emit("webwxsendemoticon_request", { params: params, data: data });

								_context11.next = 8;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxsendemoticon
								});

							case 8:
								res = _context11.sent;

								this.emit("webwxsendemoticon_response", res);

								responseData = res.data;

								(0, _util.equal)(responseData.BaseResponse.Ret, 0, res);

								return _context11.abrupt("return", responseData);

							case 15:
								_context11.prev = 15;
								_context11.t0 = _context11["catch"](0);

								this.emit("error", _context11.t0);
								this.emit("webwxsendemoticon_error", _context11.t0);
								_context11.t0.tips = "发送表情信息异常";
								throw _context11.t0;

							case 21:
							case "end":
								return _context11.stop();
						}
					}
				}, _callee11, this, [[0, 15]]);
			}));

			function sendEmoticonMessage(_x7, _x8) {
				return _ref11.apply(this, arguments);
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
			var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(file, filename, toUserName) {
				var name, type, size, ext, mediatype, data, buffer, clientMessageId, uploadMediaRequest, form, formDataPromise, params, requestData, res, mediaId;
				return regeneratorRuntime.wrap(function _callee12$(_context12) {
					while (1) {
						switch (_context12.prev = _context12.next) {
							case 0:
								_context12.prev = 0;
								name = void 0, type = void 0, size = void 0, ext = void 0, mediatype = void 0, data = void 0;

								// 根据不同类型的文件处理数据

								if (!(typeof File !== "undefined" && file.constructor == File || typeof Blob !== "undefined" && file.constructor == Blob)) {
									_context12.next = 9;
									break;
								}

								name = file.name || "file";
								type = file.type;
								size = file.size;
								data = file;
								_context12.next = 28;
								break;

							case 9:
								if (!Buffer.isBuffer(file)) {
									_context12.next = 18;
									break;
								}

								if (filename) {
									_context12.next = 12;
									break;
								}

								throw new Error("未知文件名");

							case 12:
								name = filename;
								type = _mime2.default.lookup(name);
								size = file.length;
								data = file;
								_context12.next = 28;
								break;

							case 18:
								if (!file.readable) {
									_context12.next = 28;
									break;
								}

								if (!(!file.path && !filename)) {
									_context12.next = 21;
									break;
								}

								throw new Error("未知文件名");

							case 21:
								name = _path2.default.basename(file.path || filename);
								type = _mime2.default.lookup(name);
								_context12.next = 25;
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
								buffer = _context12.sent;

								size = buffer.length;
								data = buffer;

							case 28:

								ext = name.match(/.*\.(.*)/);
								ext = ext ? ext[1].toLowerCase() : "";

								// 根据文件扩展名确定媒体类型
								_context12.t0 = ext;
								_context12.next = _context12.t0 === "bmp" ? 33 : _context12.t0 === "jpeg" ? 33 : _context12.t0 === "jpg" ? 33 : _context12.t0 === "png" ? 33 : _context12.t0 === "mp4" ? 35 : 37;
								break;

							case 33:
								mediatype = "pic";
								return _context12.abrupt("break", 38);

							case 35:
								mediatype = "video";
								return _context12.abrupt("break", 38);

							case 37:
								mediatype = "doc";

							case 38:
								clientMessageId = (0, _util.generateClientMsgID)();
								uploadMediaRequest = JSON.stringify({
									BaseRequest: this._baseRequest(),
									ClientMediaId: clientMessageId,
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
									if (_util.isBrowserEnv) {
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
								params = { f: "json" };
								_context12.next = 54;
								return formDataPromise;

							case 54:
								requestData = _context12.sent.data;

								this.emit("webwxuploadmedia_request", { params: params, data: requestData });

								// 发起上传请求
								_context12.t1 = this;
								_context12.t2 = params;
								_context12.t3 = requestData;
								_context12.t4 = this._config.API_webwxuploadmedia;
								_context12.next = 62;
								return formDataPromise;

							case 62:
								_context12.t5 = _context12.sent.headers;
								_context12.t6 = {
									method: "POST",
									params: _context12.t2,
									data: _context12.t3,
									url: _context12.t4,
									headers: _context12.t5
								};
								_context12.next = 66;
								return _context12.t1._request.call(_context12.t1, _context12.t6);

							case 66:
								res = _context12.sent;

								this.emit("webwxuploadmedia_response", res);

								mediaId = res.data.MediaId;
								return _context12.abrupt("return", {
									name: name,
									size: size,
									ext: ext,
									mediatype: mediatype,
									mediaId: mediaId
								});

							case 72:
								_context12.prev = 72;
								_context12.t7 = _context12["catch"](0);

								this.emit("error", _context12.t7);
								this.emit("webwxuploadmedia_error", _context12.t7);
								_context12.t7.tips = "上传媒体文件异常";
								throw _context12.t7;

							case 78:
							case "end":
								return _context12.stop();
						}
					}
				}, _callee12, this, [[0, 72]]);
			}));

			function uploadMedia(_x9, _x10, _x11) {
				return _ref12.apply(this, arguments);
			}

			return uploadMedia;
		}()

		/**
   * 发送图片消息
   * @param {string} mediaId - 媒体文件的ID
   * @param {string} toUserName - 接收方用户名
   * @returns {Promise<Object>} - 发送成功后返回的消息对象
   */

	}, {
		key: "sendPictureMessage",
		value: function () {
			var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(mediaId, toUserName) {
				var params, clientMessageId, data, res, responseData;
				return regeneratorRuntime.wrap(function _callee13$(_context13) {
					while (1) {
						switch (_context13.prev = _context13.next) {
							case 0:
								_context13.prev = 0;
								params = {
									f: "json",
									fun: "async",
									lang: this._config.Lang,
									pass_ticket: this._prop.passTicket
								};
								clientMessageId = (0, _util.generateClientMsgID)();
								data = {
									BaseRequest: this._baseRequest(),
									Scene: 0,
									Msg: {
										Type: this._config.MSGTYPE_IMAGE,
										MediaId: mediaId,
										ToUserName: toUserName,
										LocalID: clientMessageId,
										ClientMsgId: clientMessageId,
										FromUserName: this._user.UserName
									}
								};

								this.emit("webwxsendmsgimg_request", { params: params, data: data });

								_context13.next = 7;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxsendmsgimg
								});

							case 7:
								res = _context13.sent;

								this.emit("webwxsendmsgimg_response", res);

								responseData = res.data;

								(0, _util.equal)(responseData.BaseResponse.Ret, 0, res);

								return _context13.abrupt("return", responseData);

							case 14:
								_context13.prev = 14;
								_context13.t0 = _context13["catch"](0);

								this.emit("error", _context13.t0);
								this.emit("webwxsendmsgimg_error", _context13.t0);
								_context13.t0.tips = "发送图片异常";
								throw _context13.t0;

							case 20:
							case "end":
								return _context13.stop();
						}
					}
				}, _callee13, this, [[0, 14]]);
			}));

			function sendPictureMessage(_x12, _x13) {
				return _ref13.apply(this, arguments);
			}

			return sendPictureMessage;
		}()

		/**
   * 发送视频消息
   * @param {string} mediaId - 媒体文件的ID
   * @param {string} toUserName - 接收方用户名
   * @returns {Promise<Object>} - 发送成功后返回的消息对象
   */

	}, {
		key: "sendVideoMessage",
		value: function () {
			var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(mediaId, toUserName) {
				var params, clientMessageId, data, res, responseData;
				return regeneratorRuntime.wrap(function _callee14$(_context14) {
					while (1) {
						switch (_context14.prev = _context14.next) {
							case 0:
								_context14.prev = 0;
								params = {
									f: "json",
									fun: "async",
									lang: this._config.Lang,
									pass_ticket: this._prop.passTicket
								};
								clientMessageId = (0, _util.generateClientMsgID)();
								data = {
									BaseRequest: this._baseRequest(),
									Scene: 0,
									Msg: {
										Type: this._config.MSGTYPE_VIDEO,
										MediaId: mediaId,
										ToUserName: toUserName,
										LocalID: clientMessageId,
										ClientMsgId: clientMessageId,
										FromUserName: this._user.UserName
									}
								};

								this.emit("webwxsendmsgvedio_request", { params: params, data: data });

								_context14.next = 7;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxsendmsgvedio
								});

							case 7:
								res = _context14.sent;

								this.emit("webwxsendmsgvedio_response", res);

								responseData = res.data;

								(0, _util.equal)(responseData.BaseResponse.Ret, 0, res);

								return _context14.abrupt("return", responseData);

							case 14:
								_context14.prev = 14;
								_context14.t0 = _context14["catch"](0);

								this.emit("error", _context14.t0);
								this.emit("webwxsendmsgvedio_error", _context14.t0);
								_context14.t0.tips = "发送视频异常";
								throw _context14.t0;

							case 20:
							case "end":
								return _context14.stop();
						}
					}
				}, _callee14, this, [[0, 14]]);
			}));

			function sendVideoMessage(_x14, _x15) {
				return _ref14.apply(this, arguments);
			}

			return sendVideoMessage;
		}()

		/**
   * 发送文件消息
   * @param {string} mediaId - 媒体文件的ID
   * @param {string} name - 文件名
   * @param {number} size - 文件大小（字节）
   * @param {string} ext - 文件扩展名
   * @param {string} toUserName - 接收方用户名
   * @returns {Promise<Object>} - 发送成功后返回的消息对象
   */

	}, {
		key: "sendDocumentMessage",
		value: function () {
			var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(mediaId, name, size, ext, toUserName) {
				var params, clientMessageId, content, data, res, responseData;
				return regeneratorRuntime.wrap(function _callee15$(_context15) {
					while (1) {
						switch (_context15.prev = _context15.next) {
							case 0:
								_context15.prev = 0;
								params = {
									f: "json",
									fun: "async",
									lang: this._config.Lang,
									pass_ticket: this._prop.passTicket
								};
								clientMessageId = (0, _util.generateClientMsgID)();
								content = "\n\t\t\t\t<appmsg appid='wxeb7ec651dd0aefa9' sdkver=''>\n\t\t\t\t\t<title>" + name + "</title>\n\t\t\t\t\t<des></des>\n\t\t\t\t\t<action></action>\n\t\t\t\t\t<type>6</type>\n\t\t\t\t\t<content></content>\n\t\t\t\t\t<url></url>\n\t\t\t\t\t<lowurl></lowurl>\n\t\t\t\t\t<appattach>\n\t\t\t\t\t\t<totallen>" + size + "</totallen>\n\t\t\t\t\t\t<attachid>" + mediaId + "</attachid>\n\t\t\t\t\t\t<fileext>" + ext + "</fileext>\n\t\t\t\t\t</appattach>\n\t\t\t\t\t<extinfo></extinfo>\n\t\t\t\t</appmsg>";
								data = {
									BaseRequest: this._baseRequest(),
									Scene: 0,
									Msg: {
										Type: this._config.APPMSGTYPE_ATTACH,
										Content: content,
										ToUserName: toUserName,
										LocalID: clientMessageId,
										ClientMsgId: clientMessageId,
										FromUserName: this._user.UserName
									}
								};

								this.emit("webwxsendappmsg_request", { params: params, data: data });

								_context15.next = 8;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxsendappmsg
								});

							case 8:
								res = _context15.sent;

								this.emit("webwxsendappmsg_response", res);

								responseData = res.data;

								(0, _util.equal)(responseData.BaseResponse.Ret, 0, res);

								return _context15.abrupt("return", responseData);

							case 15:
								_context15.prev = 15;
								_context15.t0 = _context15["catch"](0);

								this.emit("error", _context15.t0);
								this.emit("webwxsendappmsg_error", _context15.t0);
								_context15.t0.tips = "发送文件异常";
								throw _context15.t0;

							case 21:
							case "end":
								return _context15.stop();
						}
					}
				}, _callee15, this, [[0, 15]]);
			}));

			function sendDocumentMessage(_x16, _x17, _x18, _x19, _x20) {
				return _ref15.apply(this, arguments);
			}

			return sendDocumentMessage;
		}()

		/**
   * 转发消息
   * @param {Object} message - 需要转发的消息对象
   * @param {string} toUserName - 接收方用户名
   * @returns {Promise<Object>} - 转发成功后返回的消息对象
   */

	}, {
		key: "forwardMessage",
		value: function () {
			var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(message, toUserName) {
				var params, clientMessageId, data, url, res, responseData;
				return regeneratorRuntime.wrap(function _callee16$(_context16) {
					while (1) {
						switch (_context16.prev = _context16.next) {
							case 0:
								_context16.prev = 0;
								params = {
									f: "json",
									fun: "async",
									lang: this._config.Lang,
									pass_ticket: this._prop.passTicket
								};
								clientMessageId = (0, _util.generateClientMsgID)();
								data = {
									BaseRequest: this._baseRequest(),
									Scene: 2,
									Msg: {
										Type: message.MsgType,
										MediaId: "",
										Content: message.Content.replace(/&lt;/g, "<").replace(/&gt;/g, ">"),
										ToUserName: toUserName,
										LocalID: clientMessageId,
										ClientMsgId: clientMessageId,
										FromUserName: this._user.UserName
									}
								};
								url = void 0;
								_context16.t0 = message.MsgType;
								_context16.next = _context16.t0 === this._config.MSGTYPE_TEXT ? 8 : _context16.t0 === this._config.MSGTYPE_IMAGE ? 11 : _context16.t0 === this._config.MSGTYPE_EMOTICON ? 13 : _context16.t0 === this._config.MSGTYPE_MICROVIDEO ? 23 : _context16.t0 === this._config.MSGTYPE_VIDEO ? 23 : _context16.t0 === this._config.MSGTYPE_APP ? 26 : 30;
								break;

							case 8:
								url = this._config.API_webwxsendmsg;
								if (message.SubMsgType === this._config.MSGTYPE_LOCATION) {
									data.Msg.Type = this._config.MSGTYPE_LOCATION;
									data.Msg.Content = message.OriContent.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
								}
								return _context16.abrupt("break", 32);

							case 11:
								url = this._config.API_webwxsendmsgimg;
								return _context16.abrupt("break", 32);

							case 13:
								params.fun = "sys";
								url = this._config.API_webwxsendemoticon;
								data.Msg.EMoticonMd5 = message.Content.replace(/^[\s\S]*?md5\s?=\s?"(.*?)"[\s\S]*?$/, "$1");

								if (data.Msg.EMoticonMd5) {
									_context16.next = 18;
									break;
								}

								throw new Error("商店表情不能转发");

							case 18:
								data.Scene = 0;
								data.Msg.EmojiFlag = 2;
								delete data.Msg.MediaId;
								delete data.Msg.Content;
								return _context16.abrupt("break", 32);

							case 23:
								url = this._config.API_webwxsendmsgvedio;
								data.Msg.Type = this._config.MSGTYPE_VIDEO;
								return _context16.abrupt("break", 32);

							case 26:
								url = this._config.API_webwxsendappmsg;
								data.Msg.Type = message.AppMsgType;
								data.Msg.Content = data.Msg.Content.replace(/^[\s\S]*?(<appmsg[\s\S]*?<attachid>)[\s\S]*?(<\/attachid>[\s\S]*?<\/appmsg>)[\s\S]*?$/, "$1" + message.MediaId + "$2");
								return _context16.abrupt("break", 32);

							case 30:
								this.emit("forwardMessage_error", new Error("该消息类型不能直接转发"));
								throw new Error("该消息类型不能直接转发");

							case 32:
								this.emit("forwardMessage_request", { params: params, data: data });

								_context16.next = 35;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: url
								});

							case 35:
								res = _context16.sent;

								this.emit("forwardMessage_response", res);

								responseData = res.data;

								(0, _util.equal)(responseData.BaseResponse.Ret, 0, res);

								return _context16.abrupt("return", responseData);

							case 42:
								_context16.prev = 42;
								_context16.t1 = _context16["catch"](0);

								this.emit("error", _context16.t1);
								this.emit("forwardMessage_error", _context16.t1);
								_context16.t1.tips = "转发消息异常";
								throw _context16.t1;

							case 48:
							case "end":
								return _context16.stop();
						}
					}
				}, _callee16, this, [[0, 42]]);
			}));

			function forwardMessage(_x21, _x22) {
				return _ref16.apply(this, arguments);
			}

			return forwardMessage;
		}()

		/**
   * 撤回消息
   * @param {string} messageId - 待撤回的消息ID
   * @param {string} toUserName - 消息所在的聊天对象的用户名
   * @returns {Promise<Object>} - 包含操作结果的对象
   */

	}, {
		key: "revokeMessage",
		value: function () {
			var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(messageId, toUserName) {
				var data, res, result;
				return regeneratorRuntime.wrap(function _callee17$(_context17) {
					while (1) {
						switch (_context17.prev = _context17.next) {
							case 0:
								_context17.prev = 0;
								data = {
									BaseRequest: this._baseRequest(),
									SvrMsgId: messageId,
									ToUserName: toUserName,
									ClientMsgId: (0, _util.generateClientMsgID)()
								};

								this.emit("webwxrevokemsg_request", { params: null, data: data });

								_context17.next = 5;
								return this._request({
									method: "POST",
									data: data,
									url: this._config.API_webwxrevokemsg
								});

							case 5:
								res = _context17.sent;

								this.emit("webwxrevokemsg_response", res);

								result = res.data;

								if (!(result.BaseResponse.Ret !== 0)) {
									_context17.next = 10;
									break;
								}

								throw new Error("\u64A4\u56DE\u6D88\u606F\u5931\u8D25: " + JSON.stringify(res));

							case 10:
								return _context17.abrupt("return", result);

							case 13:
								_context17.prev = 13;
								_context17.t0 = _context17["catch"](0);

								this.emit("error", _context17.t0);
								this.emit("webwxrevokemsg_error", _context17.t0);
								_context17.t0.tips = "撤回消息异常";
								throw _context17.t0;

							case 19:
							case "end":
								return _context17.stop();
						}
					}
				}, _callee17, this, [[0, 13]]);
			}));

			function revokeMessage(_x23, _x24) {
				return _ref17.apply(this, arguments);
			}

			return revokeMessage;
		}()

		/**
   * 获取消息图片或表情
   * @param {string} messageId - 消息ID
   * @returns {Promise<Object>} - 包含图片或表情数据和类型的对象
   */

	}, {
		key: "getMessageImg",
		value: function () {
			var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(messageId) {
				var params, res;
				return regeneratorRuntime.wrap(function _callee18$(_context18) {
					while (1) {
						switch (_context18.prev = _context18.next) {
							case 0:
								_context18.prev = 0;
								params = {
									type: "big",
									MsgID: messageId,
									skey: this._prop.skey
								};

								this.emit("webwxgetmsgimg_request", { params: params, data: null });

								_context18.next = 5;
								return this._request({
									method: "GET",
									params: params,
									responseType: "arraybuffer",
									url: this._config.API_webwxgetmsgimg
								});

							case 5:
								res = _context18.sent;

								this.emit("webwxgetmsgimg_response", res);

								return _context18.abrupt("return", {
									data: res.data,
									type: res.headers["content-type"]
								});

							case 10:
								_context18.prev = 10;
								_context18.t0 = _context18["catch"](0);

								this.emit("error", _context18.t0);
								this.emit("webwxgetmsgimg_error", _context18.t0);
								_context18.t0.tips = "获取图片或表情异常";
								throw _context18.t0;

							case 16:
							case "end":
								return _context18.stop();
						}
					}
				}, _callee18, this, [[0, 10]]);
			}));

			function getMessageImg(_x25) {
				return _ref18.apply(this, arguments);
			}

			return getMessageImg;
		}()

		/**
   * 获取视频
   * @param {string} messageId - 消息ID
   * @returns {Promise<Object>} - 包含视频数据和类型的对象
   */

	}, {
		key: "getMessageVideo",
		value: function () {
			var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(messageId) {
				var params, res;
				return regeneratorRuntime.wrap(function _callee19$(_context19) {
					while (1) {
						switch (_context19.prev = _context19.next) {
							case 0:
								_context19.prev = 0;
								params = {
									MsgID: messageId,
									skey: this._prop.skey
								};

								this.emit("webwxgetvideo_request", { params: params, data: null });

								_context19.next = 5;
								return this._request({
									method: "GET",
									headers: {
										Range: "bytes=0-"
									},
									params: params,
									responseType: "arraybuffer",
									url: this._config.API_webwxgetvideo
								});

							case 5:
								res = _context19.sent;

								this.emit("webwxgetvideo_response", res);

								return _context19.abrupt("return", {
									data: res.data,
									type: res.headers["content-type"]
								});

							case 10:
								_context19.prev = 10;
								_context19.t0 = _context19["catch"](0);

								this.emit("error", _context19.t0);
								this.emit("webwxgetvideo_error", _context19.t0);
								_context19.t0.tips = "获取视频异常";
								throw _context19.t0;

							case 16:
							case "end":
								return _context19.stop();
						}
					}
				}, _callee19, this, [[0, 10]]);
			}));

			function getMessageVideo(_x26) {
				return _ref19.apply(this, arguments);
			}

			return getMessageVideo;
		}()

		/**
   * 获取声音
   * @param {string} messageId - 消息ID
   * @returns {Promise<Object>} - 包含声音数据和类型的对象
   */

	}, {
		key: "getMessageVoice",
		value: function () {
			var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(messageId) {
				var params, res;
				return regeneratorRuntime.wrap(function _callee20$(_context20) {
					while (1) {
						switch (_context20.prev = _context20.next) {
							case 0:
								_context20.prev = 0;
								params = {
									MsgID: messageId,
									skey: this._prop.skey
								};

								this.emit("webwxgetvoice_request", { params: params, data: null });

								_context20.next = 5;
								return this._request({
									method: "GET",
									params: params,
									responseType: "arraybuffer",
									url: this._config.API_webwxgetvoice
								});

							case 5:
								res = _context20.sent;

								this.emit("webwxgetvoice_response", res);

								return _context20.abrupt("return", {
									data: res.data,
									type: res.headers["content-type"]
								});

							case 10:
								_context20.prev = 10;
								_context20.t0 = _context20["catch"](0);

								this.emit("error", _context20.t0);
								this.emit("webwxgetvoice_error", _context20.t0);
								_context20.t0.tips = "获取声音异常";
								throw _context20.t0;

							case 16:
							case "end":
								return _context20.stop();
						}
					}
				}, _callee20, this, [[0, 10]]);
			}));

			function getMessageVoice(_x27) {
				return _ref20.apply(this, arguments);
			}

			return getMessageVoice;
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
			var _ref21 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(FromUserName, MediaId, FileName) {
				var params, res;
				return regeneratorRuntime.wrap(function _callee21$(_context21) {
					while (1) {
						switch (_context21.prev = _context21.next) {
							case 0:
								_context21.prev = 0;
								params = {
									sender: FromUserName,
									mediaid: MediaId,
									filename: FileName,
									fromuser: this._user.UserName,
									pass_ticket: this._prop.passTicket,
									webwx_data_ticket: this._prop.webwxDataTicket
								};

								this.emit("webwxdownloadmedia_request", { params: params, data: null });

								_context21.next = 5;
								return this._request({
									method: "GET",
									params: params,
									responseType: "arraybuffer",
									url: this._config.API_webwxdownloadmedia
								});

							case 5:
								res = _context21.sent;

								this.emit("webwxdownloadmedia_response", res);

								return _context21.abrupt("return", {
									data: res.data,
									type: res.headers["content-type"]
								});

							case 10:
								_context21.prev = 10;
								_context21.t0 = _context21["catch"](0);

								this.emit("error", _context21.t0);
								this.emit("webwxdownloadmedia_error", _context21.t0);
								_context21.t0.tips = "获取文件异常";
								throw _context21.t0;

							case 16:
							case "end":
								return _context21.stop();
						}
					}
				}, _callee21, this, [[0, 10]]);
			}));

			function getDocument(_x28, _x29, _x30) {
				return _ref21.apply(this, arguments);
			}

			return getDocument;
		}()

		/**
   * 获取头像图片
   * @param {string} HeadImgUrl - 头像图片的URL
   * @returns {Promise<Object>} - 包含头像图片数据和类型的对象
   */

	}, {
		key: "getHeadImg",
		value: function () {
			var _ref22 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22(HeadImgUrl) {
				var res;
				return regeneratorRuntime.wrap(function _callee22$(_context22) {
					while (1) {
						switch (_context22.prev = _context22.next) {
							case 0:
								_context22.prev = 0;
								_context22.next = 3;
								return this._request({
									method: "GET",
									url: this._config.BaseHost + HeadImgUrl,
									responseType: "arraybuffer"
								});

							case 3:
								res = _context22.sent;

								this.emit("headimage_response", res);

								return _context22.abrupt("return", {
									data: res.data,
									type: res.headers["content-type"]
								});

							case 8:
								_context22.prev = 8;
								_context22.t0 = _context22["catch"](0);

								this.emit("error", _context22.t0);
								this.emit("headimage_error", _context22.t0);
								_context22.t0.tips = "获取头像异常";
								throw _context22.t0;

							case 14:
							case "end":
								return _context22.stop();
						}
					}
				}, _callee22, this, [[0, 8]]);
			}));

			function getHeadImg(_x31) {
				return _ref22.apply(this, arguments);
			}

			return getHeadImg;
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
			var _ref23 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23(UserName, Ticket) {
				var params, data, res, result;
				return regeneratorRuntime.wrap(function _callee23$(_context23) {
					while (1) {
						switch (_context23.prev = _context23.next) {
							case 0:
								_context23.prev = 0;
								params = {
									lang: this._config.Lang,
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

								this.emit("webwxverifyuser_request", { params: params, data: data });

								_context23.next = 6;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxverifyuser
								});

							case 6:
								res = _context23.sent;

								this.emit("webwxverifyuser_response", res);

								result = res.data;

								if (!(result.BaseResponse.Ret !== 0)) {
									_context23.next = 11;
									break;
								}

								throw new Error("\u901A\u8FC7\u597D\u53CB\u8BF7\u6C42\u5931\u8D25: " + JSON.stringify(res));

							case 11:
								return _context23.abrupt("return", result);

							case 14:
								_context23.prev = 14;
								_context23.t0 = _context23["catch"](0);

								this.emit("error", _context23.t0);
								this.emit("webwxverifyuser_error", _context23.t0);
								_context23.t0.tips = "通过好友请求异常";
								throw _context23.t0;

							case 20:
							case "end":
								return _context23.stop();
						}
					}
				}, _callee23, this, [[0, 14]]);
			}));

			function verifyUser(_x32, _x33) {
				return _ref23.apply(this, arguments);
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
			var _ref24 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24(UserName) {
				var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "\u6211\u662F" + this._user.NickName;
				var params, data, res, result;
				return regeneratorRuntime.wrap(function _callee24$(_context24) {
					while (1) {
						switch (_context24.prev = _context24.next) {
							case 0:
								_context24.prev = 0;
								params = {
									lang: this._config.Lang,
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

								this.emit("webwxverifyuser_request", { params: params, data: data });

								_context24.next = 6;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxverifyuser
								});

							case 6:
								res = _context24.sent;

								this.emit("webwxverifyuser_response", res);

								result = res.data;

								if (!(result.BaseResponse.Ret !== 0)) {
									_context24.next = 11;
									break;
								}

								throw new Error("\u6DFB\u52A0\u597D\u53CB\u5931\u8D25: " + JSON.stringify(res));

							case 11:
								return _context24.abrupt("return", result);

							case 14:
								_context24.prev = 14;
								_context24.t0 = _context24["catch"](0);

								this.emit("error", _context24.t0);
								this.emit("webwxverifyuser_error", _context24.t0);
								_context24.t0.tips = "添加好友异常";
								throw _context24.t0;

							case 20:
							case "end":
								return _context24.stop();
						}
					}
				}, _callee24, this, [[0, 14]]);
			}));

			function addFriend(_x35) {
				return _ref24.apply(this, arguments);
			}

			return addFriend;
		}()

		/**
   * 创建群聊
   * @param {string} Topic - 群聊的主题
   * @param {Array} MemberList - 成员列表，包含要邀请的成员的用户名
   * @returns {Promise<Object>} - 包含创建群聊后返回的数据的对象
   */

	}, {
		key: "createChatroom",
		value: function () {
			var _ref25 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25(Topic, MemberList) {
				var params, data, res, result;
				return regeneratorRuntime.wrap(function _callee25$(_context25) {
					while (1) {
						switch (_context25.prev = _context25.next) {
							case 0:
								_context25.prev = 0;
								params = {
									lang: this._config.Lang,
									r: ~new Date(),
									pass_ticket: this._prop.passTicket
								};
								data = {
									BaseRequest: this._baseRequest(),
									MemberCount: MemberList.length,
									MemberList: MemberList,
									Topic: Topic
								};

								this.emit("webwxcreatechatroom_request", { params: params, data: data });

								_context25.next = 6;
								return this._request({
									method: "POST",
									url: this._config.API_webwxcreatechatroom,
									params: params,
									data: data
								});

							case 6:
								res = _context25.sent;

								this.emit("webwxcreatechatroom_response", res);

								result = res.data;

								if (!(result.BaseResponse.Ret !== 0)) {
									_context25.next = 11;
									break;
								}

								throw new Error("\u521B\u5EFA\u7FA4\u5931\u8D25: " + JSON.stringify(res));

							case 11:
								return _context25.abrupt("return", result);

							case 14:
								_context25.prev = 14;
								_context25.t0 = _context25["catch"](0);

								this.emit("error", _context25.t0);
								this.emit("webwxcreatechatroom_error", _context25.t0);
								_context25.t0.tips = "创建群异常";
								throw _context25.t0;

							case 20:
							case "end":
								return _context25.stop();
						}
					}
				}, _callee25, this, [[0, 14]]);
			}));

			function createChatroom(_x36, _x37) {
				return _ref25.apply(this, arguments);
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
			var _ref26 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26(ChatRoomUserName, MemberList, fun) {
				var params, data, res, result;
				return regeneratorRuntime.wrap(function _callee26$(_context26) {
					while (1) {
						switch (_context26.prev = _context26.next) {
							case 0:
								_context26.prev = 0;
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
								this.emit("webwxupdatechatroom_request", { params: params, data: data });

								_context26.next = 7;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxupdatechatroom
								});

							case 7:
								res = _context26.sent;

								this.emit("webwxupdatechatroom_response", res);

								result = res.data;

								if (!(result.BaseResponse.Ret !== 0)) {
									_context26.next = 12;
									break;
								}

								throw new Error("\u9080\u8BF7\u6216\u8E22\u51FA\u7FA4\u6210\u5458\u5931\u8D25: " + JSON.stringify(res));

							case 12:
								return _context26.abrupt("return", result);

							case 15:
								_context26.prev = 15;
								_context26.t0 = _context26["catch"](0);

								this.emit("error", _context26.t0);
								this.emit("webwxupdatechatroom_error", _context26.t0);
								_context26.t0.tips = "邀请或踢出群成员异常";
								throw _context26.t0;

							case 21:
							case "end":
								return _context26.stop();
						}
					}
				}, _callee26, this, [[0, 15]]);
			}));

			function updateChatroom(_x38, _x39, _x40) {
				return _ref26.apply(this, arguments);
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
			var _ref27 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27(ChatRoomUserName, NewName) {
				var params, data, res, result;
				return regeneratorRuntime.wrap(function _callee27$(_context27) {
					while (1) {
						switch (_context27.prev = _context27.next) {
							case 0:
								_context27.prev = 0;
								params = {
									fun: "modtopic"
								};
								data = {
									BaseRequest: this._baseRequest(),
									ChatRoomName: ChatRoomUserName,
									NewTopic: NewName
								};

								this.emit("webwxupdatechatroom_request", { params: params, data: data });

								_context27.next = 6;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxupdatechatroom
								});

							case 6:
								res = _context27.sent;

								this.emit("webwxupdatechatroom_response", res);

								result = res.data;

								if (!(result.BaseResponse.Ret !== 0)) {
									_context27.next = 11;
									break;
								}

								throw new Error("\u66F4\u65B0\u7FA4\u540D\u5931\u8D25: " + JSON.stringify(res));

							case 11:
								_context27.next = 19;
								break;

							case 13:
								_context27.prev = 13;
								_context27.t0 = _context27["catch"](0);

								this.emit("error", _context27.t0);
								this.emit("webwxupdatechatroom_error", _context27.t0);
								_context27.t0.tips = "更新群名异常";
								throw _context27.t0;

							case 19:
							case "end":
								return _context27.stop();
						}
					}
				}, _callee27, this, [[0, 13]]);
			}));

			function updateChatRoomName(_x41, _x42) {
				return _ref27.apply(this, arguments);
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
			var _ref28 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28(UserName, RemarkName) {
				var params, data, res, result;
				return regeneratorRuntime.wrap(function _callee28$(_context28) {
					while (1) {
						switch (_context28.prev = _context28.next) {
							case 0:
								_context28.prev = 0;
								params = {
									lang: this._config.Lang,
									pass_ticket: this._prop.passTicket
								};
								data = {
									BaseRequest: this._baseRequest(),
									CmdId: 2,
									RemarkName: RemarkName,
									UserName: UserName
								};

								this.emit("webwxoplog_request", { params: params, data: data });

								_context28.next = 6;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxoplog
								});

							case 6:
								res = _context28.sent;

								this.emit("webwxoplog_response", res);

								result = res.data;

								if (!(result.BaseResponse.Ret !== 0)) {
									_context28.next = 11;
									break;
								}

								throw new Error("\u8BBE\u7F6E\u7528\u6237\u6807\u7B7E\u5931\u8D25: " + JSON.stringify(res));

							case 11:
								return _context28.abrupt("return", result);

							case 14:
								_context28.prev = 14;
								_context28.t0 = _context28["catch"](0);

								this.emit("error", _context28.t0);
								this.emit("webwxoplog_error", _context28.t0);
								_context28.t0.tips = "设置用户标签异常";
								throw _context28.t0;

							case 20:
							case "end":
								return _context28.stop();
						}
					}
				}, _callee28, this, [[0, 14]]);
			}));

			function updateRemarkName(_x43, _x44) {
				return _ref28.apply(this, arguments);
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
			var _ref29 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee29(UserName, OP, RemarkName) {
				var params, data, res, result;
				return regeneratorRuntime.wrap(function _callee29$(_context29) {
					while (1) {
						switch (_context29.prev = _context29.next) {
							case 0:
								_context29.prev = 0;
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

								this.emit("webwxoplog_request", { params: params, data: data });

								_context29.next = 6;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxoplog
								});

							case 6:
								res = _context29.sent;

								this.emit("webwxoplog_response", res);

								result = res.data;

								if (!(result.BaseResponse.Ret !== 0)) {
									_context29.next = 11;
									break;
								}

								throw new Error("\u7F6E\u9876\u6216\u53D6\u6D88\u7F6E\u9876\u5931\u8D25: " + JSON.stringify(res));

							case 11:
								return _context29.abrupt("return", result);

							case 14:
								_context29.prev = 14;
								_context29.t0 = _context29["catch"](0);

								this.emit("error", _context29.t0);
								this.emit("webwxoplog_error", _context29.t0);
								_context29.t0.tips = "置顶或取消置顶异常";
								throw _context29.t0;

							case 20:
							case "end":
								return _context29.stop();
						}
					}
				}, _callee29, this, [[0, 14]]);
			}));

			function opLog(_x45, _x46, _x47) {
				return _ref29.apply(this, arguments);
			}

			return opLog;
		}()

		/**
   * 发送状态报告
   * @param {Object} text - 状态报告文本，包含操作记录等信息
   * @returns {Promise<Object>} Promise 对象，表示发送状态报告的结果
   */

	}, {
		key: "sendStatReport",
		value: function () {
			var _ref30 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee30(text) {
				var params, data;
				return regeneratorRuntime.wrap(function _callee30$(_context30) {
					while (1) {
						switch (_context30.prev = _context30.next) {
							case 0:
								_context30.prev = 0;

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
									fun: "new",
									lang: this._config.Lang,
									pass_ticket: this._prop.passTicket
								};
								data = {
									BaseRequest: this._baseRequest(),
									Count: 1,
									List: [{
										Text: text,
										Type: 1
									}]
								};

								this.emit("webwxreport_request", { params: params, data: data });

								_context30.next = 8;
								return this._request({
									method: "POST",
									params: params,
									data: data,
									url: this._config.API_webwxreport
								});

							case 8:
								return _context30.abrupt("return", _context30.sent);

							case 11:
								_context30.prev = 11;
								_context30.t0 = _context30["catch"](0);

								this.emit("error", _context30.t0);
								this.emit("webwxreport_error", _context30.t0);
								_context30.t0.tips = "状态报告异常";
								throw _context30.t0;

							case 17:
							case "end":
								return _context30.stop();
						}
					}
				}, _callee30, this, [[0, 11]]);
			}));

			function sendStatReport(_x48) {
				return _ref30.apply(this, arguments);
			}

			return sendStatReport;
		}()

		/**
   * 登出
   * @returns {Promise<string>} Promise 对象，表示登出结果的消息字符串
   */

	}, {
		key: "logout",
		value: function () {
			var _ref31 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee31() {
				var params, res;
				return regeneratorRuntime.wrap(function _callee31$(_context31) {
					while (1) {
						switch (_context31.prev = _context31.next) {
							case 0:
								_context31.prev = 0;
								params = {
									type: 0,
									redirect: 1,
									lang: this._config.Lang,
									skey: this._prop.skey
								};

								this.emit("webwxlogout_request", { params: params, data: null });

								_context31.next = 5;
								return this._request({
									method: "POST",
									params: params,
									url: this._config.API_webwxlogout
								});

							case 5:
								res = _context31.sent;

								this.emit("webwxlogout_response", res);

								return _context31.abrupt("return", "登出成功");

							case 10:
								_context31.prev = 10;
								_context31.t0 = _context31["catch"](0);

								this.emit("error", _context31.t0);
								this.emit("webwxlogout_error", _context31.t0);
								return _context31.abrupt("return", "登出异常");

							case 15:
							case "end":
								return _context31.stop();
						}
					}
				}, _callee31, this, [[0, 10]]);
			}));

			function logout() {
				return _ref31.apply(this, arguments);
			}

			return logout;
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

		/**通用数据对象 */
		,
		get: function get() {
			return {
				_config: this._config,
				_deviceId: this._deviceId,
				_user: this._user,
				_cookie: this._cookie,
				_prop: this._prop,
				_data: this._data
			};
		}
	}]);

	return WeChatClient;
}();

exports.default = WeChatClient;
//# sourceMappingURL=client.js.map