"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _debug2 = require("debug");

var _debug3 = _interopRequireDefault(_debug2);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _global = require("./utils/global");

var _contact = require("./factory/contact");

var _contact2 = _interopRequireDefault(_contact);

var _message = require("./factory/message");

var _message2 = _interopRequireDefault(_message);

var _core = require("./core");

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = (0, _debug3.default)("weixin");

if (!_global.isBrowserEnv) {
	process.on("uncaughtException", function (err) {
		console.log("uncaughtException", err);
	});
}

/**
 * 微信客户端类，继承自WeixinCore类
 */

var Weixin = function (_WeixinCore) {
	_inherits(Weixin, _WeixinCore);

	/**
  * 构造函数
  * @param {Object} data - 包含微信账号登录信息的数据对象
  */
	function Weixin() {
		var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Weixin);

		// 用EventEmitter扩展this对象，使其具备事件监听和触发的能力
		var _this = _possibleConstructorReturn(this, (Weixin.__proto__ || Object.getPrototypeOf(Weixin)).call(this, data));

		_lodash2.default.extend(_this, new _events2.default());

		/**所有联系人的集合 */
		_this._contacts = {};
		/**状态 */
		_this._state = _this._config.STATE.init;
		/**上一次同步时间 */
		_this._lastSyncTime = 0;
		/**同步轮询ID */
		_this._syncPollingId = 0;
		/**同步错误计数 */
		_this._syncErrorCount = 0;
		/**检查轮询ID */
		_this._checkPollingId = 0;
		/**重试轮询ID */
		_this._retryPollingId = 0;

		// 通过ContactFactory创建Contact对象，并传入当前Weixin实例
		/**Contact对象 */
		_this._Contact = (0, _contact2.default)(_this);
		// 通过MessageFactory创建Message对象，并传入当前Weixin实例
		/**Message对象 */
		_this._Message = (0, _message2.default)(_this);
		return _this;
	}

	/**
  * @description 获取轮询消息的默认文本内容
  * @return {String} 默认文本内容
  */


	_createClass(Weixin, [{
		key: "_getPollingMessage",
		value: function _getPollingMessage() {
			return "心跳：" + new Date().toLocaleString();
		}

		/**
   * @description 获取轮询消息的默认间隔时间
   * @return {Number} 默认间隔时间，单位为毫秒
   */

	}, {
		key: "_getPollingInterval",
		value: function _getPollingInterval() {
			return 5 * 60 * 1000;
		}

		/**
   * @description 获取轮询消息的默认目标用户
   * @return {String} 默认目标用户
   */

	}, {
		key: "_getPollingTarget",
		value: function _getPollingTarget() {
			return "filehelper";
		}

		/**
   * 获取好友列表
   * @returns {Array} - 包含好友信息的数组
   */

	}, {
		key: "contactList",


		/**
   * 获取联系人列表，包括好友、群聊、公众号等
   * @param {number} Seq - 联系人列表的起始标识，默认为0
   * @returns {Promise<Array>} - 联系人列表数组
   */
		value: function () {
			var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
				var _this2 = this;

				var Seq = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
				var contacts;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								contacts = [];
								return _context.abrupt("return", this.fetchContacts(Seq).then(function (res) {
									contacts = res.MemberList || [];
									if (res.Seq) {
										return _this2.contactList(res.Seq).then(function (_contacts) {
											return contacts = contacts.concat(_contacts || []);
										});
									}
								}).then(function () {
									if (Seq == 0) {
										// 批量获取空群聊的详细信息
										var emptyGroup = contacts.filter(function (contact) {
											return contact.UserName.startsWith("@@") && contact.MemberCount == 0;
										});
										if (emptyGroup.length != 0) {
											return _this2.fetchBatchContactInfo(emptyGroup).then(function (_contacts) {
												return contacts = contacts.concat(_contacts || []);
											});
										} else {
											return contacts;
										}
									} else {
										return contacts;
									}
								}).catch(function (err) {
									// 发生错误时触发错误事件，并返回已经获取到的联系人列表
									_this2.emit("error", err);
									return contacts;
								}));

							case 2:
							case "end":
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function contactList() {
				return _ref.apply(this, arguments);
			}

			return contactList;
		}()

		/**
   * 发送消息
   * @param {string|object} msg - 要发送的消息内容，可以是文本或多媒体对象
   * @param {string} toUserName - 接收消息的用户标识
   * @returns {Promise} - 返回一个Promise对象，表示发送消息的异步操作
   */

	}, {
		key: "sendMessage",
		value: function () {
			var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(msg, toUserName) {
				var _this3 = this;

				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								if (!((typeof msg === "undefined" ? "undefined" : _typeof(msg)) !== "object")) {
									_context2.next = 4;
									break;
								}

								return _context2.abrupt("return", this.sendTextMessage(msg, toUserName));

							case 4:
								if (!msg.emoticonMd5) {
									_context2.next = 8;
									break;
								}

								return _context2.abrupt("return", this.sendEmoticonMessage(msg.emoticonMd5, toUserName));

							case 8:
								return _context2.abrupt("return", this.uploadMedia(msg.file, msg.filename, toUserName).then(function (res) {
									switch (res.ext) {
										case "bmp":
										case "jpeg":
										case "jpg":
										case "png":
											// 如果是图片文件，则调用sendPictureMessage方法发送图片消息
											return _this3.sendPictureMessage(res.mediaId, toUserName);
										case "gif":
											// 如果是GIF文件，则调用sendEmoticonMessage方法发送表情消息
											return _this3.sendEmoticonMessage(res.mediaId, toUserName);
										case "mp4":
											// 如果是视频文件，则调用sendVideoMessage方法发送视频消息
											return _this3.sendVideoMessage(res.mediaId, toUserName);
										default:
											// 其他类型的文件，则调用sendDocumentMessage方法发送文件消息
											return _this3.sendDocumentMessage(res.mediaId, res.name, res.size, res.ext, toUserName);
									}
								}));

							case 9:
							case "end":
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function sendMessage(_x3, _x4) {
				return _ref2.apply(this, arguments);
			}

			return sendMessage;
		}()

		/**
   * @description 设置获取轮询消息文本内容的回调函数
   * @param {Function} func - 回调函数
   */

	}, {
		key: "setPollingMessageGetter",
		value: function setPollingMessageGetter(func) {
			if (typeof func !== "function") return;
			if (typeof func() !== "string") return;
			this._getPollingMessage = func;
		}

		/**
   * @description 设置获取轮询消息间隔时间的回调函数
   * @param {Function} func - 回调函数
   */

	}, {
		key: "setPollingIntervalGetter",
		value: function setPollingIntervalGetter(func) {
			if (typeof func !== "function") return;
			if (typeof func() !== "number") return;
			this._getPollingInterval = func;
		}

		/**
   * @description 设置获取轮询消息目标用户的回调函数
   * @param {Function} func - 回调函数
   */

	}, {
		key: "setPollingTargetGetter",
		value: function setPollingTargetGetter(func) {
			if (typeof func !== "function") return;
			if (typeof func() !== "string") return;
			this._getPollingTarget = func;
		}

		/**
   * 开始同步消息
   * @param {number} id - 当前同步操作的ID
   */

	}, {
		key: "syncPolling",
		value: function syncPolling() {
			var _this4 = this;

			var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ++this._syncPollingId;

			// 如果当前状态不是登录状态，或者当前同步操作的ID与传入的ID不一致，则直接返回
			if (this._state !== this._config.STATE.login || this._syncPollingId !== id) {
				return;
			}

			// 调用 performSyncCheck 方法检查同步状态
			this.performSyncCheck().then(function (selector) {
				debug("Sync Check Selector: ", selector);

				// 如果同步状态不是正常状态，则调用sync方法进行同步
				if (+selector !== _this4._config.SYNCCHECK_SELECTOR_NORMAL) {
					return _this4.performSync().then(function (data) {
						_this4._syncErrorCount = 0;
						_this4.handleSync(data);
					});
				}
			}).then(function () {
				// 更新最后同步时间，并继续进行同步操作
				_this4._lastSyncTime = Date.now();
				_this4.syncPolling(id);
			}).catch(function (err) {
				// 如果当前状态已经不是登录状态，则直接返回
				if (_this4._state !== _this4._config.STATE.login) {
					return;
				}

				debug(err);

				// 如果出现已经退出登录的错误，则停止操作
				if (err instanceof _core.AlreadyLogoutError) {
					_this4.stop();
					return;
				}

				// 否则，触发错误事件，并根据同步错误次数进行重试或重启操作
				_this4.emit("error", err);

				if (++_this4._syncErrorCount > 2) {
					var _err = new Error("\u8FDE\u7EED" + _this4._syncErrorCount + "\u6B21\u540C\u6B65\u5931\u8D25\uFF0C5s\u540E\u5C1D\u8BD5\u91CD\u542F");
					debug(_err);
					_this4.emit("error", _err);

					clearTimeout(_this4._retryPollingId);
					setTimeout(function () {
						return _this4.restart();
					}, 5 * 1000);
				} else {
					clearTimeout(_this4._retryPollingId);
					_this4._retryPollingId = setTimeout(function () {
						return _this4.syncPolling(id);
					}, 2000 * _this4._syncErrorCount);
				}
			});
		}

		/**
   * 检查轮询状态
   */

	}, {
		key: "checkPolling",
		value: function checkPolling() {
			var _this5 = this;

			// 如果当前状态已经不是登录状态，则直接返回
			if (this._state !== this._config.STATE.login) {
				return;
			}

			var interval = Date.now() - this._lastSyncTime;
			if (interval > 1 * 60 * 1000) {
				var err = new Error("\u72B6\u6001\u540C\u6B65\u8D85\u8FC7" + interval / 1000 + "s\u672A\u54CD\u5E94\uFF0C5s\u540E\u5C1D\u8BD5\u91CD\u542F");
				debug(err);
				this.emit("error", err);

				clearTimeout(this._checkPollingId);
				setTimeout(function () {
					return _this5.restart();
				}, 5 * 1000);
			} else {
				debug("心跳");

				this.sendMobileNotification().catch(function (err) {
					debug(err);
					_this5.emit("error", err);
				});

				this.sendMessage(this._getPollingMessage(), this._getPollingTarget()).catch(function (err) {
					debug(err);
					_this5.emit("error", err);
				});

				clearTimeout(this._checkPollingId);

				this._checkPollingId = setTimeout(function () {
					return _this5.checkPolling();
				}, this._getPollingInterval());
			}
		}

		/**
   * 处理同步数据
   * @param {Object} data - 同步数据
   */

	}, {
		key: "handleSync",
		value: function handleSync(data) {
			if (!data) {
				this.restart();
				return;
			}

			if (data.AddMsgCount) {
				debug("syncPolling messages count: ", data.AddMsgCount);
				this.handleMessage(data.AddMsgList);
			}

			if (data.ModContactCount) {
				debug("syncPolling ModContactList count: ", data.ModContactCount);
				this.handleContact(data.ModContactList);
			}
		}

		/**
   * 处理消息数据
   * @param {Array} data - 消息数据列表
   */

	}, {
		key: "handleMessage",
		value: function handleMessage(data) {
			var _this6 = this;

			data.forEach(function (msg) {
				Promise.resolve().then(function () {
					if (!_this6._contacts[msg.FromUserName] || msg.FromUserName.startsWith("@@") && _this6._contacts[msg.FromUserName].MemberCount == 0) {
						return _this6.batchGetContact([{
							UserName: msg.FromUserName
						}]).then(function (contacts) {
							_this6.handleContact(contacts);
						}).catch(function (err) {
							debug(err);
							_this6.emit("error", err);
						});
					}
				}).then(function () {
					msg = _this6._Message.extend(msg);
					_this6.emit("message", msg);

					if (msg.MsgType === _this6._config.MSGTYPE_STATUSNOTIFY) {
						var userList = msg.StatusNotifyUserName.split(",").filter(function (UserName) {
							return !_this6._contacts[UserName];
						}).map(function (UserName) {
							return {
								UserName: UserName
							};
						});

						Promise.all(_lodash2.default.chunk(userList, 50).map(function (list) {
							return _this6.batchGetContact(list).then(function (res) {
								debug("batchGetContact data length: ", res.length);
								_this6.handleContact(res);
							});
						})).catch(function (err) {
							debug(err);
							_this6.emit("error", err);
						});
					}

					if (msg.ToUserName === "filehelper" && msg.Content === "退出wechat4u" || /^(.\udf1a\u0020\ud83c.){3}$/.test(msg.Content)) {
						_this6.stop();
					}
				}).catch(function (err) {
					_this6.emit("error", err);
					debug(err);
				});
			});
		}

		/**
   * 处理联系人数据
   * @param {Array} data - 联系人数据列表
   */

	}, {
		key: "handleContact",
		value: function handleContact(data) {
			var _this7 = this;

			if (!data || data.length == 0) {
				return;
			}

			data.forEach(function (contact) {
				if (_this7._contacts[contact.UserName]) {
					var oldContact = _this7._contacts[contact.UserName];

					// 清除无效的字段
					for (var i in contact) {
						contact[i] || delete contact[i];
					}

					Object.assign(oldContact, contact);

					_this7._Contact.extend(oldContact);
				} else {
					_this7._contacts[contact.UserName] = _this7._Contact.extend(contact);
				}
			});

			this.emit("contacts-updated", data);
		}

		/**
   * 登录微信机器人
   * @returns {Promise} - 登录成功时返回一个Promise对象，否则返回错误信息
   */

	}, {
		key: "_login",
		value: function () {
			var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
				var _this8 = this;

				var checkLogin;
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								/**
         * 定义一个递归函数，用于检查登录状态直到成功为止
         * @returns
         */
								checkLogin = function checkLogin() {
									return _this8.checkLogin().then(function (res) {
										if (res.code === 201 && res.userAvatar) {
											_this8.emit("user-avatar", res.userAvatar);
										}

										if (res.code !== 200) {
											debug("checkLogin: ", res.code);
											return checkLogin();
										} else {
											return res;
										}
									});
								};

								// 首先获取UUID，然后触发uuid事件，并将当前状态设置为uuid


								return _context3.abrupt("return", this.getUUID().then(function (uuid) {
									debug("getUUID: ", uuid);
									_this8.emit("uuid", uuid);

									_this8._state = _this8._config.STATE.uuid;
									return checkLogin();
								}).then(function (res) {
									debug("checkLogin: ", res.redirect_uri);
									return _this8.login();
								}));

							case 2:
							case "end":
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function _login() {
				return _ref3.apply(this, arguments);
			}

			return _login;
		}()

		/**
   * 初始化微信机器人，包括登录、获取联系人列表等操作
   * @returns {Promise} - 初始化成功时返回一个Promise对象，否则返回错误信息
   */

	}, {
		key: "_init",
		value: function () {
			var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
				var _this9 = this;

				return regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								return _context4.abrupt("return", this.init().then(function (data) {
									// 更新联系人列表
									_this9.handleContact(data.ContactList);

									// 发送移动端通知
									_this9.sendMobileNotification().catch(function (err) {
										return _this9.emit("error", err);
									});

									// 获取联系人列表并更新
									_this9.contactList().then(function (contacts) {
										debug("getContact count: ", contacts.length);
										_this9.handleContact(contacts);
									});

									// 触发init和login事件
									_this9.emit("init", data);

									_this9._lastSyncTime = Date.now();
									_this9._state = _this9._config.STATE.login;

									_this9.syncPolling();
									_this9.checkPolling();

									_this9.emit("login");
								}));

							case 1:
							case "end":
								return _context4.stop();
						}
					}
				}, _callee4, this);
			}));

			function _init() {
				return _ref4.apply(this, arguments);
			}

			return _init;
		}()

		/**
   * 启动微信机器人
   * @returns {Promise} - 启动成功时返回一个Promise对象，否则返回错误信息
   */

	}, {
		key: "start",
		value: function () {
			var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
				return regeneratorRuntime.wrap(function _callee5$(_context5) {
					while (1) {
						switch (_context5.prev = _context5.next) {
							case 0:
								debug("启动中...");
								_context5.prev = 1;
								_context5.next = 4;
								return this._login();

							case 4:
								_context5.next = 6;
								return this._init();

							case 6:
								_context5.next = 13;
								break;

							case 8:
								_context5.prev = 8;
								_context5.t0 = _context5["catch"](1);

								debug(_context5.t0);
								this.emit("error", _context5.t0);
								this.stop();

							case 13:
							case "end":
								return _context5.stop();
						}
					}
				}, _callee5, this, [[1, 8]]);
			}));

			function start() {
				return _ref5.apply(this, arguments);
			}

			return start;
		}()

		/**
   * 重启微信机器人
   * @returns {Promise} - 重启成功时返回一个Promise对象，否则返回错误信息
   */

	}, {
		key: "restart",
		value: function () {
			var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
				var _err2, data;

				return regeneratorRuntime.wrap(function _callee6$(_context6) {
					while (1) {
						switch (_context6.prev = _context6.next) {
							case 0:
								debug("重启中...");
								_context6.prev = 1;
								_context6.next = 4;
								return this._init();

							case 4:
								_context6.next = 32;
								break;

							case 6:
								_context6.prev = 6;
								_context6.t0 = _context6["catch"](1);

								if (!(_context6.t0 instanceof _core.AlreadyLogoutError)) {
									_context6.next = 11;
									break;
								}

								this.emit("logout");
								return _context6.abrupt("return");

							case 11:
								if (!_context6.t0.response) {
									_context6.next = 15;
									break;
								}

								throw _context6.t0;

							case 15:
								_err2 = new Error("重启时网络错误，60s后进行最后一次重启");


								debug(_err2);
								this.emit("error", _err2);

								_context6.next = 20;
								return new Promise(function (resolve) {
									setTimeout(resolve, 60 * 1000);
								});

							case 20:
								_context6.prev = 20;
								_context6.next = 23;
								return this.init();

							case 23:
								data = _context6.sent;

								this.handleContact(data.ContactList);
								_context6.next = 32;
								break;

							case 27:
								_context6.prev = 27;
								_context6.t1 = _context6["catch"](20);

								debug(_context6.t1);
								this.emit("error", _context6.t1);

								this.stop();

							case 32:
							case "end":
								return _context6.stop();
						}
					}
				}, _callee6, this, [[1, 6], [20, 27]]);
			}));

			function restart() {
				return _ref6.apply(this, arguments);
			}

			return restart;
		}()

		/**
   * 停止微信机器人
   */

	}, {
		key: "stop",
		value: function stop() {
			debug("登出中...");

			clearTimeout(this._retryPollingId);
			clearTimeout(this._checkPollingId);

			this.logout();

			this._state = this._config.STATE.logout;

			this.emit("logout");
		}
	}, {
		key: "friendList",
		get: function get() {
			var members = [];

			// 遍历联系人列表，获取好友信息
			for (var key in this._contacts) {
				var member = this._contacts[key];

				// 构造好友对象，并添加到数组中
				members.push({
					username: member["UserName"],
					nickname: this._Contact.getDisplayName(member),
					py: member["RemarkPYQuanPin"] ? member["RemarkPYQuanPin"] : member["PYQuanPin"],
					avatar: member.AvatarUrl
				});
			}

			return members;
		}
	}]);

	return Weixin;
}(_core2.default);

exports.default = Weixin;
//# sourceMappingURL=weixin.js.map