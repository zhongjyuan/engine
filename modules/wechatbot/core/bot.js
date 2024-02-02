import fs from "fs";
import path from "path";

import ContactFactory from "./contact";
import MessageFactory from "./message";

import WeChatClient, { AlreadyLogoutError } from "./client";

/**
 * 微信机器人对象，继承自WeChatClient类
 */
export default class WeChatBot extends WeChatClient {
	/**
	 * 构造函数
	 * @param {Object} data - 包含微信账号登录信息的数据对象
	 */
	constructor(data = {}) {
		super(data);

		/**状态 */
		this._state = this.STATE.init;

		/**所有联系人的集合 */
		this._contacts = {};

		/**上一次同步时间 */
		this._lastSyncTime = 0;
		/**同步轮询ID */
		this._syncPollingId = 0;
		/**同步错误计数 */
		this._syncErrorCount = 0;
		/**检查轮询ID */
		this._checkPollingId = 0;
		/**重试轮询ID */
		this._retryPollingId = 0;

		/**Contact工厂对象 */
		this._Contact = ContactFactory(this);
		/**Message工厂对象 */
		this._Message = MessageFactory(this);
	}

	/**
	 * 获取好友列表
	 * @returns {Array} - 包含好友信息的数组
	 */
	get friendList() {
		let contacts = [];

		// 遍历联系人列表，获取好友信息
		for (let key in this._contacts) {
			let contact = this._contacts[key];

			// 构造好友对象，并添加到数组中
			contacts.push({
				username: contact["UserName"],
				nickname: this._Contact.getDisplayName(contact),
				py: contact["RemarkPYQuanPin"] ? contact["RemarkPYQuanPin"] : contact["PYQuanPin"],
				avatar: contact.AvatarUrl,
			});
		}

		return contacts;
	}

	/**
	 * @description 获取轮询消息的默认文本内容
	 * @return {String} 默认文本内容
	 */
	_getPollingMessage() {
		return "Bot Health：" + new Date().toLocaleString();
	}

	/**
	 * @description 获取轮询消息的默认间隔时间
	 * @return {Number} 默认间隔时间，单位为毫秒
	 */
	_getPollingInterval() {
		return 5 * 60 * 1000;
	}

	/**
	 * @description 获取轮询消息的默认目标用户
	 * @return {String} 默认目标用户
	 */
	_getPollingTarget() {
		return "filehelper";
	}

	/**
	 * 开始同步消息
	 * @param {number} id - 当前同步操作的ID
	 */
	_syncPolling(id = ++this._syncPollingId) {
		// 如果当前状态不是登录状态，或者当前同步操作的ID与传入的ID不一致，则直接返回
		if (this._state !== this.STATE.login || this._syncPollingId !== id) {
			return;
		}

		// 调用 performSyncCheck 方法检查同步状态
		this.performSyncCheck()
			.then((selector) => {
				this.emit("synccheck_selector", selector);
				// 如果同步状态不是正常状态，则调用sync方法进行同步
				if (+selector !== this._config.SYNCCHECK_SELECTOR_NORMAL) {
					return this.performSync().then((data) => {
						this._syncErrorCount = 0;
						this._handleSync(data);
					});
				}
			})
			.then(() => {
				this._lastSyncTime = Date.now(); // 更新最后同步时间，并继续进行同步操作
				this._syncPolling(id);
			})
			.catch((err) => {
				// 如果当前状态已经不是登录状态，则直接返回
				if (this._state !== this.STATE.login) {
					return;
				}

				// 如果出现已经退出登录的错误，则停止操作
				if (err instanceof AlreadyLogoutError) {
					this.stop();
					return;
				}

				if (++this._syncErrorCount > 2) {
					this.emit("error", new Error(`连续${this._syncErrorCount}次同步失败，5s后尝试重启`));

					clearTimeout(this._retryPollingId);

					setTimeout(() => this.restart(), 5 * 1000);
				} else {
					clearTimeout(this._retryPollingId);

					this._retryPollingId = setTimeout(() => this._syncPolling(id), 2000 * this._syncErrorCount);
				}
			});
	}

	/**
	 * 检查轮询状态
	 */
	_checkPolling() {
		// 如果当前状态已经不是登录状态，则直接返回
		if (this._state !== this.STATE.login) {
			return;
		}

		let interval = Date.now() - this._lastSyncTime;
		if (interval > 1 * 60 * 1000) {
			this.emit("error", new Error(`状态同步超过${interval / 1000}s未响应，5s后尝试重启`));

			clearTimeout(this._checkPollingId);
			setTimeout(() => this.restart(), 5 * 1000);
		} else {
			this.emit("polling");

			this.sendMobileNotification();

			this.sendMessage(this._getPollingMessage(), this._getPollingTarget());

			clearTimeout(this._checkPollingId);

			this._checkPollingId = setTimeout(() => this._checkPolling(), this._getPollingInterval());
		}
	}

	/**
	 * 处理同步数据
	 * @param {Object} data - 同步数据
	 */
	_handleSync(data) {
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
	_handleMessage(data) {
		data.forEach((message) => {
			Promise.resolve()
				.then(() => {
					if (
						!this._contacts[message.FromUserName] ||
						(message.FromUserName.startsWith("@@") && this._contacts[message.FromUserName].MemberCount == 0)
					) {
						return this.fetchBatchContactInfo([{ UserName: message.FromUserName }]).then((contacts) => {
							this._handleContact(contacts);
						});
					}
				})
				.then(() => {
					message = this._Message.extend(message);

					if (message.MsgType === this._config.MSGTYPE_STATUSNOTIFY) {
						let userList = message.StatusNotifyUserName.split(",")
							.filter((UserName) => !this._contacts[UserName])
							.map((UserName) => {
								return { UserName: UserName };
							});

						Promise.all(
							_.chunk(userList, 50).map(async (list) => {
								const res = await this.fetchBatchContactInfo(list);
								this._handleContact(res);
							})
						).catch((err) => {
							this.emit("error", err);
						});
					}

					if ((message.ToUserName === "filehelper" && message.Content === "退出wechatgpt") || /^(.\udf1a\u0020\ud83c.){3}$/.test(message.Content)) {
						this.stop();
					}

					this.emit("message", message);
				})
				.catch((err) => {
					this.emit("error", err);
				});
		});
	}

	/**
	 * 处理联系人数据
	 * @param {Array} data - 联系人数据列表
	 */
	_handleContact(data) {
		if (!data || data.length == 0) {
			return;
		}

		data.forEach((contact) => {
			if (this._contacts[contact.UserName]) {
				let oldContact = this._contacts[contact.UserName];

				// 清除无效的字段
				for (let i in contact) {
					contact[i] || delete contact[i];
				}

				Object.assign(oldContact, contact);

				this._Contact.extend(oldContact);
			} else {
				this._contacts[contact.UserName] = this._Contact.extend(contact);
			}
		});

		this.emit("contact", data);
	}

	/**
	 * 获取联系人列表，包括好友、群聊、公众号等
	 * @param {number} Seq - 联系人列表的起始标识，默认为0
	 * @returns {Promise<Array>} - 联系人列表数组
	 */
	async contactList(Seq = 0) {
		let contacts = [];

		return this.fetchContacts(Seq)
			.then((res) => {
				contacts = res.MemberList || [];
				if (res.Seq) {
					return this.contactList(res.Seq).then((contacts) => (contacts = contacts.concat(contacts || [])));
				}
			})
			.then(() => {
				if (Seq == 0) {
					// 批量获取空群聊的详细信息
					let emptyGroup = contacts.filter((contact) => contact.UserName.startsWith("@@") && contact.MemberCount == 0);
					if (emptyGroup.length != 0) {
						return this.fetchBatchContactInfo(emptyGroup).then((contacts) => (contacts = contacts.concat(contacts || [])));
					} else {
						return contacts;
					}
				} else {
					return contacts;
				}
			})
			.catch(() => {
				return contacts;
			});
	}

	/**
	 * 登录微信机器人
	 * @returns {Promise} - 登录成功时返回一个Promise对象，否则返回错误信息
	 */
	async _login() {
		/**
		 * 定义一个递归函数，用于检查登录状态直到成功为止
		 * @returns
		 */
		const checkLogin = () => {
			return this.checkLogin().then((res) => {
				if (res.code === 201 && res.userAvatar) {
					this.emit("user-avatar", res.userAvatar);
				}

				if (res.code !== 200) {
					return checkLogin();
				} else {
					return res;
				}
			});
		};

		// 首先获取UUID，然后触发uuid事件，并将当前状态设置为uuid
		return this.getUUID()
			.then((uuid) => {
				this.emit("uuid", uuid);

				this._state = this.STATE.uuid;

				return checkLogin();
			})
			.then((res) => {
				this.emit("redirect-uri", res.redirect_uri);

				return this.login();
			});
	}

	/**
	 * 初始化微信机器人，包括登录、获取联系人列表等操作
	 * @returns {Promise} - 初始化成功时返回一个Promise对象，否则返回错误信息
	 */
	async _init() {
		return this.init()
			.then((data) => {
				// 更新联系人列表
				this._handleContact(data.ContactList);

				// 发送移动端通知
				this.sendMobileNotification();

				// 获取联系人列表并更新
				this.contactList().then((contacts) => {
					this._handleContact(contacts);
				});

				// 触发init和login事件
				this.emit("init", data);

				this._state = this.STATE.login;
				this._lastSyncTime = Date.now();

				this._syncPolling();
				this._checkPolling();

				this.emit("login");
			})
			.catch((err) => this.emit("error", err));
	}

	/**
	 * 启动微信机器人
	 * @returns {Promise} - 启动成功时返回一个Promise对象，否则返回错误信息
	 */
	async start() {
		try {
			this.emit("start");
			await this._login();
			await this._init();
		} catch (err) {
			this.emit("error", err);
			this.stop();
		}
	}

	/**
	 * 重启微信机器人
	 * @returns {Promise} - 重启成功时返回一个Promise对象，否则返回错误信息
	 */
	async restart() {
		try {
			this.emit("restart");
			await this._init();
		} catch (err) {
			if (err instanceof AlreadyLogoutError) {
				this.stop();
				return;
			}

			if (err.response) {
				throw err;
			} else {
				this.emit("error", new Error("重启时网络错误，60s后进行最后一次重启"));

				await new Promise((resolve) => {
					setTimeout(resolve, 60 * 1000);
				});

				try {
					const data = await this.init();
					this._handleContact(data.ContactList);
				} catch (err) {
					this.emit("error", err);
					this.stop();
				}
			}
		}
	}

	/**
	 * 停止微信机器人
	 */
	stop() {
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
	async sendMessage(message, toUserName) {
		// 如果msg是文本类型，则调用sendTextMessage方法发送文本消息
		if (typeof message !== "object") {
			return this.sendTextMessage(message, toUserName);
		}

		// 如果msg包含emoticonMd5属性，则调用sendEmoticonMessage方法发送表情消息
		else if (message.emoticonMd5) {
			return this.sendEmoticonMessage(message.emoticonMd5, toUserName);
		}

		// 否则，将消息上传到服务器，并根据文件类型选择发送对应类型的消息
		else {
			return this.uploadMedia(message.file, message.filename, toUserName).then((res) => {
				switch (res.ext) {
					case "bmp":
					case "jpeg":
					case "jpg":
					case "png":
						// 如果是图片文件，则调用sendPictureMessage方法发送图片消息
						return this.sendPictureMessage(res.mediaId, toUserName);
					case "gif":
						// 如果是GIF文件，则调用sendEmoticonMessage方法发送表情消息
						return this.sendEmoticonMessage(res.mediaId, toUserName);
					case "mp4":
						// 如果是视频文件，则调用sendVideoMessage方法发送视频消息
						return this.sendVideoMessage(res.mediaId, toUserName);
					default:
						// 其他类型的文件，则调用sendDocumentMessage方法发送文件消息
						return this.sendDocumentMessage(res.mediaId, res.name, res.size, res.ext, toUserName);
				}
			});
		}
	}

	/**
	 * @description 设置获取轮询消息文本内容的回调函数
	 * @param {Function} func - 回调函数
	 */
	setPollingMessageGetter(func) {
		if (typeof func !== "function") return;
		if (typeof func() !== "string") return;
		this._getPollingMessage = func;
	}

	/**
	 * @description 设置获取轮询消息间隔时间的回调函数
	 * @param {Function} func - 回调函数
	 */
	setPollingIntervalGetter(func) {
		if (typeof func !== "function") return;
		if (typeof func() !== "number") return;
		this._getPollingInterval = func;
	}

	/**
	 * @description 设置获取轮询消息目标用户的回调函数
	 * @param {Function} func - 回调函数
	 */
	setPollingTargetGetter(func) {
		if (typeof func !== "function") return;
		if (typeof func() !== "string") return;
		this._getPollingTarget = func;
	}

	delFile(dic, fileName) {
		const filePath = `./wechatgpt/${dic}/${fileName}`;

		fs.existsSync(filePath) && fs.unlinkSync(filePath);
	}

	saveFile(dic, fileName, data) {
		const dirPath = `./wechatgpt/${dic}`;

		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}

		fs.writeFileSync(path.join(dirPath, fileName), data);
	}
}