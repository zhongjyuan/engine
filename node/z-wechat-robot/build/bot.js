"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _contact = require("./contact");

var _contact2 = _interopRequireDefault(_contact);

var _message = require("./message");

var _message2 = _interopRequireDefault(_message);

var _client = require("./client");

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 微信机器人对象，继承自WeChatClient类
 */
var WeChatBot = function (_WeChatClient) {
	_inherits(WeChatBot, _WeChatClient);

	/**
  * 构造函数
  * @param {Object} data - 包含微信账号登录信息的数据对象
  */
	function WeChatBot() {
		var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, WeChatBot);

		/**状态 */
		var _this = _possibleConstructorReturn(this, (WeChatBot.__proto__ || Object.getPrototypeOf(WeChatBot)).call(this, data));

		_this._state = _this.STATE.init;

		/**所有联系人的集合 */
		_this._contacts = {};

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

		/**Contact工厂对象 */
		_this._Contact = (0, _contact2.default)(_this);
		/**Message工厂对象 */
		_this._Message = (0, _message2.default)(_this);
		return _this;
	}

	/**
  * 获取好友列表
  * @returns {Array} - 包含好友信息的数组
  */


	_createClass(WeChatBot, [{
		key: "_getPollingMessage",


		/**
   * @description 获取轮询消息的默认文本内容
   * @return {String} 默认文本内容
   */
		value: function _getPollingMessage() {
			return "Bot Health：" + new Date().toLocaleString();
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
   * 开始同步消息
   * @param {number} id - 当前同步操作的ID
   */

	}, {
		key: "_syncPolling",
		value: function _syncPolling() {
			var _this2 = this;

			var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ++this._syncPollingId;

			// 如果当前状态不是登录状态，或者当前同步操作的ID与传入的ID不一致，则直接返回
			if (this._state !== this.STATE.login || this._syncPollingId !== id) {
				return;
			}

			// 调用 performSyncCheck 方法检查同步状态
			this.performSyncCheck().then(function (selector) {
				_this2.emit("synccheck_selector", selector);
				// 如果同步状态不是正常状态，则调用sync方法进行同步
				if (+selector !== _this2._config.SYNCCHECK_SELECTOR_NORMAL) {
					return _this2.performSync().then(function (data) {
						_this2._syncErrorCount = 0;
						_this2._handleSync(data);
					});
				}
			}).then(function () {
				_this2._lastSyncTime = Date.now(); // 更新最后同步时间，并继续进行同步操作
				_this2._syncPolling(id);
			}).catch(function (err) {
				// 如果当前状态已经不是登录状态，则直接返回
				if (_this2._state !== _this2.STATE.login) {
					return;
				}

				// 如果出现已经退出登录的错误，则停止操作
				if (err instanceof _client.AlreadyLogoutError) {
					_this2.stop();
					return;
				}

				if (++_this2._syncErrorCount > 2) {
					_this2.emit("error", new Error("\u8FDE\u7EED" + _this2._syncErrorCount + "\u6B21\u540C\u6B65\u5931\u8D25\uFF0C5s\u540E\u5C1D\u8BD5\u91CD\u542F"));

					clearTimeout(_this2._retryPollingId);

					setTimeout(function () {
						return _this2.restart();
					}, 5 * 1000);
				} else {
					clearTimeout(_this2._retryPollingId);

					_this2._retryPollingId = setTimeout(function () {
						return _this2._syncPolling(id);
					}, 2000 * _this2._syncErrorCount);
				}
			});
		}

		/**
   * 检查轮询状态
   */

	}, {
		key: "_checkPolling",
		value: function _checkPolling() {
			var _this3 = this;

			// 如果当前状态已经不是登录状态，则直接返回
			if (this._state !== this.STATE.login) {
				return;
			}

			var interval = Date.now() - this._lastSyncTime;
			if (interval > 1 * 60 * 1000) {
				this.emit("error", new Error("\u72B6\u6001\u540C\u6B65\u8D85\u8FC7" + interval / 1000 + "s\u672A\u54CD\u5E94\uFF0C5s\u540E\u5C1D\u8BD5\u91CD\u542F"));

				clearTimeout(this._checkPollingId);
				setTimeout(function () {
					return _this3.restart();
				}, 5 * 1000);
			} else {
				this.emit("polling");

				this.sendMobileNotification();

				this.sendMessage(this._getPollingMessage(), this._getPollingTarget());

				clearTimeout(this._checkPollingId);

				this._checkPollingId = setTimeout(function () {
					return _this3._checkPolling();
				}, this._getPollingInterval());
			}
		}

		/**
   * 处理同步数据
   * @param {Object} data - 同步数据
   */

	}, {
		key: "_handleSync",
		value: function _handleSync(data) {
			if (!data) {
				this.restart();
				return;
			}

			if (data.AddMsgCount) {
				this._handleMessage(data.AddMsgList);
			}

			if (data.ModContactCount) {
				this._handleContact(data.ModContactList);
			}
		}

		/**
   * 处理消息数据
   * @param {Array} data - 消息数据列表
   */

	}, {
		key: "_handleMessage",
		value: function _handleMessage(data) {
			var _this4 = this;

			data.forEach(function (message) {
				Promise.resolve().then(function () {
					if (!_this4._contacts[message.FromUserName] || message.FromUserName.startsWith("@@") && _this4._contacts[message.FromUserName].MemberCount == 0) {
						return _this4.fetchBatchContactInfo([{ UserName: message.FromUserName }]).then(function (contacts) {
							_this4._handleContact(contacts);
						});
					}
				}).then(function () {
					message = _this4._Message.extend(message);

					if (message.MsgType === _this4._config.MSGTYPE_STATUSNOTIFY) {
						var userList = message.StatusNotifyUserName.split(",").filter(function (UserName) {
							return !_this4._contacts[UserName];
						}).map(function (UserName) {
							return { UserName: UserName };
						});

						Promise.all(_.chunk(userList, 50).map(function () {
							var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(list) {
								var res;
								return regeneratorRuntime.wrap(function _callee$(_context) {
									while (1) {
										switch (_context.prev = _context.next) {
											case 0:
												_context.next = 2;
												return _this4.fetchBatchContactInfo(list);

											case 2:
												res = _context.sent;

												_this4._handleContact(res);

											case 4:
											case "end":
												return _context.stop();
										}
									}
								}, _callee, _this4);
							}));

							return function (_x3) {
								return _ref.apply(this, arguments);
							};
						}())).catch(function (err) {
							_this4.emit("error", err);
						});
					}

					if (message.ToUserName === "filehelper" && message.Content === "退出wechatgpt" || /^(.\udf1a\u0020\ud83c.){3}$/.test(message.Content)) {
						_this4.stop();
					}

					_this4.emit("message", message);
				}).catch(function (err) {
					_this4.emit("error", err);
				});
			});
		}

		/**
   * 处理联系人数据
   * @param {Array} data - 联系人数据列表
   */

	}, {
		key: "_handleContact",
		value: function _handleContact(data) {
			var _this5 = this;

			if (!data || data.length == 0) {
				return;
			}

			data.forEach(function (contact) {
				if (_this5._contacts[contact.UserName]) {
					var oldContact = _this5._contacts[contact.UserName];

					// 清除无效的字段
					for (var i in contact) {
						contact[i] || delete contact[i];
					}

					Object.assign(oldContact, contact);

					_this5._Contact.extend(oldContact);
				} else {
					_this5._contacts[contact.UserName] = _this5._Contact.extend(contact);
				}
			});

			this.emit("contact", data);
		}

		/**
   * 获取联系人列表，包括好友、群聊、公众号等
   * @param {number} Seq - 联系人列表的起始标识，默认为0
   * @returns {Promise<Array>} - 联系人列表数组
   */

	}, {
		key: "contactList",
		value: function () {
			var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
				var _this6 = this;

				var Seq = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
				var contacts;
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								contacts = [];
								return _context2.abrupt("return", this.fetchContacts(Seq).then(function (res) {
									contacts = res.MemberList || [];
									if (res.Seq) {
										return _this6.contactList(res.Seq).then(function (contacts) {
											return contacts = contacts.concat(contacts || []);
										});
									}
								}).then(function () {
									if (Seq == 0) {
										// 批量获取空群聊的详细信息
										var emptyGroup = contacts.filter(function (contact) {
											return contact.UserName.startsWith("@@") && contact.MemberCount == 0;
										});
										if (emptyGroup.length != 0) {
											return _this6.fetchBatchContactInfo(emptyGroup).then(function (contacts) {
												return contacts = contacts.concat(contacts || []);
											});
										} else {
											return contacts;
										}
									} else {
										return contacts;
									}
								}).catch(function () {
									return contacts;
								}));

							case 2:
							case "end":
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function contactList() {
				return _ref2.apply(this, arguments);
			}

			return contactList;
		}()

		/**
   * 登录微信机器人
   * @returns {Promise} - 登录成功时返回一个Promise对象，否则返回错误信息
   */

	}, {
		key: "_login",
		value: function () {
			var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
				var _this7 = this;

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
									return _this7.checkLogin().then(function (res) {
										if (res.code === 201 && res.userAvatar) {
											_this7.emit("user-avatar", res.userAvatar);
										}

										if (res.code !== 200) {
											return checkLogin();
										} else {
											return res;
										}
									});
								};

								// 首先获取UUID，然后触发uuid事件，并将当前状态设置为uuid


								return _context3.abrupt("return", this.getUUID().then(function (uuid) {
									_this7.emit("uuid", uuid);

									_this7._state = _this7.STATE.uuid;

									return checkLogin();
								}).then(function (res) {
									_this7.emit("redirect-uri", res.redirect_uri);

									return _this7.login();
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
				var _this8 = this;

				return regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								return _context4.abrupt("return", this.init().then(function (data) {
									// 更新联系人列表
									_this8._handleContact(data.ContactList);

									// 发送移动端通知
									_this8.sendMobileNotification();

									// 获取联系人列表并更新
									_this8.contactList().then(function (contacts) {
										_this8._handleContact(contacts);
									});

									// 触发init和login事件
									_this8.emit("init", data);

									_this8._state = _this8.STATE.login;
									_this8._lastSyncTime = Date.now();

									_this8._syncPolling();
									_this8._checkPolling();

									_this8.emit("login");
								}).catch(function (err) {
									return _this8.emit("error", err);
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
								_context5.prev = 0;

								this.emit("start");
								_context5.next = 4;
								return this._login();

							case 4:
								_context5.next = 6;
								return this._init();

							case 6:
								_context5.next = 12;
								break;

							case 8:
								_context5.prev = 8;
								_context5.t0 = _context5["catch"](0);

								this.emit("error", _context5.t0);
								this.stop();

							case 12:
							case "end":
								return _context5.stop();
						}
					}
				}, _callee5, this, [[0, 8]]);
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
				var data;
				return regeneratorRuntime.wrap(function _callee6$(_context6) {
					while (1) {
						switch (_context6.prev = _context6.next) {
							case 0:
								_context6.prev = 0;

								this.emit("restart");
								_context6.next = 4;
								return this._init();

							case 4:
								_context6.next = 29;
								break;

							case 6:
								_context6.prev = 6;
								_context6.t0 = _context6["catch"](0);

								if (!(_context6.t0 instanceof _client.AlreadyLogoutError)) {
									_context6.next = 11;
									break;
								}

								this.stop();
								return _context6.abrupt("return");

							case 11:
								if (!_context6.t0.response) {
									_context6.next = 15;
									break;
								}

								throw _context6.t0;

							case 15:
								this.emit("error", new Error("重启时网络错误，60s后进行最后一次重启"));

								_context6.next = 18;
								return new Promise(function (resolve) {
									setTimeout(resolve, 60 * 1000);
								});

							case 18:
								_context6.prev = 18;
								_context6.next = 21;
								return this.init();

							case 21:
								data = _context6.sent;

								this._handleContact(data.ContactList);
								_context6.next = 29;
								break;

							case 25:
								_context6.prev = 25;
								_context6.t1 = _context6["catch"](18);

								this.emit("error", _context6.t1);
								this.stop();

							case 29:
							case "end":
								return _context6.stop();
						}
					}
				}, _callee6, this, [[0, 6], [18, 25]]);
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
			clearTimeout(this._retryPollingId);
			clearTimeout(this._checkPollingId);

			this.logout();

			this._state = this.STATE.logout;

			this.emit("logout");
		}

		/**
   * 发送消息
   * @param {string|object} message - 要发送的消息内容，可以是文本或多媒体对象
   * @param {string} toUserName - 接收消息的用户标识
   * @returns {Promise} - 返回一个Promise对象，表示发送消息的异步操作
   */

	}, {
		key: "sendMessage",
		value: function () {
			var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(message, toUserName) {
				var _this9 = this;

				return regeneratorRuntime.wrap(function _callee7$(_context7) {
					while (1) {
						switch (_context7.prev = _context7.next) {
							case 0:
								if (!((typeof message === "undefined" ? "undefined" : _typeof(message)) !== "object")) {
									_context7.next = 4;
									break;
								}

								return _context7.abrupt("return", this.sendTextMessage(message, toUserName));

							case 4:
								if (!message.emoticonMd5) {
									_context7.next = 8;
									break;
								}

								return _context7.abrupt("return", this.sendEmoticonMessage(message.emoticonMd5, toUserName));

							case 8:
								return _context7.abrupt("return", this.uploadMedia(message.file, message.filename, toUserName).then(function (res) {
									switch (res.ext) {
										case "bmp":
										case "jpeg":
										case "jpg":
										case "png":
											// 如果是图片文件，则调用sendPictureMessage方法发送图片消息
											return _this9.sendPictureMessage(res.mediaId, toUserName);
										case "gif":
											// 如果是GIF文件，则调用sendEmoticonMessage方法发送表情消息
											return _this9.sendEmoticonMessage(res.mediaId, toUserName);
										case "mp4":
											// 如果是视频文件，则调用sendVideoMessage方法发送视频消息
											return _this9.sendVideoMessage(res.mediaId, toUserName);
										default:
											// 其他类型的文件，则调用sendDocumentMessage方法发送文件消息
											return _this9.sendDocumentMessage(res.mediaId, res.name, res.size, res.ext, toUserName);
									}
								}));

							case 9:
							case "end":
								return _context7.stop();
						}
					}
				}, _callee7, this);
			}));

			function sendMessage(_x5, _x6) {
				return _ref7.apply(this, arguments);
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
	}, {
		key: "delFile",
		value: function delFile(dic, fileName) {
			var filePath = "./wechatgpt/" + dic + "/" + fileName;

			_fs2.default.existsSync(filePath) && _fs2.default.unlinkSync(filePath);
		}
	}, {
		key: "saveFile",
		value: function saveFile(dic, fileName, data) {
			var dirPath = "./wechatgpt/" + dic;

			if (!_fs2.default.existsSync(dirPath)) {
				_fs2.default.mkdirSync(dirPath, { recursive: true });
			}

			_fs2.default.writeFileSync(_path2.default.join(dirPath, fileName), data);
		}
	}, {
		key: "friendList",
		get: function get() {
			var contacts = [];

			// 遍历联系人列表，获取好友信息
			for (var key in this._contacts) {
				var contact = this._contacts[key];

				// 构造好友对象，并添加到数组中
				contacts.push({
					username: contact["UserName"],
					nickname: this._Contact.getDisplayName(contact),
					py: contact["RemarkPYQuanPin"] ? contact["RemarkPYQuanPin"] : contact["PYQuanPin"],
					avatar: contact.AvatarUrl
				});
			}

			return contacts;
		}
	}]);

	return WeChatBot;
}(_client2.default);

exports.default = WeChatBot;
//# sourceMappingURL=bot.js.map