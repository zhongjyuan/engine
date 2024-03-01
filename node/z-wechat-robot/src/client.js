import _ from "lodash";

import bl from "bl";
import path from "path";
import mime from "mime";
import FormData from "form-data";
import EventEmitter from "events";

import { Request } from "./request";
import { getConfig } from "./global";
import { equal, notEqual, isBrowserEnv, generateDeviceID, generateClientMsgID } from "./util";

export class AlreadyLogoutError extends Error {
	constructor(message = "already logout") {
		super(message);

		this.constructor = AlreadyLogoutError;

		this.__proto__ = AlreadyLogoutError.prototype;
	}
}

/**
 * 微信客户端对象
 */
export default class WeChatClient {
	/**
	 * 微信客户端构造函数
	 * @param {*} data 客户端数据对象
	 */
	constructor(data) {
		// 用EventEmitter扩展this对象，使其具备事件监听和触发的能力
		_.extend(this, new EventEmitter());

		/**配置对象 */
		this._config = getConfig();
		/**设备ID */
		this._deviceId = generateDeviceID();
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
			syncKey: { List: [] },
		};
		/**状态对象 */
		this.STATE = this._config.STATE;
		/**通用数据对象 */
		this._data = data || {};
		/**请求对象 */
		this._request = new Request({ Cookie: this._cookie });
	}

	/**通用数据对象 */
	set Data(data) {
		/**
		 * 遍历 data 对象的键，并将对应键的值复制给 this 对象的相应属性
		 */
		Object.keys(data).forEach((key) => {
			Object.assign(this[key], data[key]);
		});
	}

	/**通用数据对象 */
	get Data() {
		return {
			_config: this._config,
			_deviceId: this._deviceId,
			_user: this._user,
			_cookie: this._cookie,
			_prop: this._prop,
			_data: this._data,
		};
	}

	/**
	 * 基础请求对象
	 * @returns 基础请求对象
	 */
	_baseRequest() {
		return {
			Uin: parseInt(this._prop.uin),
			Sid: this._prop.sid,
			Skey: this._prop.skey,
			DeviceID: this._deviceId,
		};
	}

	/**
	 * 更新同步键
	 * @param {*} data 同步数据对象
	 */
	_updateSyncKey(data) {
		this.emit("update_synckey", data);
		if (data.SyncKey) {
			this._prop.syncKey = data.SyncKey;
		}

		let syncKeyList = [];

		if (data.SyncCheckKey) {
			for (let item of data.SyncCheckKey.List) {
				syncKeyList.push(`${item.Key}_${item.Val}`);
			}
		} else if (!this._prop.formatedSyncKey && data.SyncKey) {
			for (let item of data.SyncKey.List) {
				syncKeyList.push(`${item.Key}_${item.Val}`);
			}
		}

		this._prop.formatedSyncKey = syncKeyList.join("|");
	}

	/**
	 * 获取 UUID
	 * @returns {Promise<string>} Promise 对象，包含获取到的 UUID 字符串
	 */
	async getUUID() {
		try {
			const res = await this._request({
				method: "POST",
				url: this._config.API_jsLogin,
			});
			this.emit("jsLogin_response", res);

			let window = {
				QRLogin: {},
			};

			eval(res.data);
			equal(window.QRLogin.code, 200, res);

			this._prop.uuid = window.QRLogin.uuid;

			return window.QRLogin.uuid;
		} catch (err) {
			this.emit("error", err);
			this.emit("jsLogin_error", err);
			err.tips = "获取UUID异常";
			throw err;
		}
	}

	/**
	 * 检查登录状态
	 * @returns {Promise<object>} Promise 对象，包含检查结果的对象
	 */
	async checkLogin() {
		try {
			let now = Math.floor(Date.now() / 1000);

			let params = {
				_: now.toString(),
				r: Math.floor(now / 1579).toString(),
				tip: 0,
				loginicon: true,
				uuid: this._prop.uuid,
			};
			this.emit("loginCheck_request", { params: params, data: null });

			const res = await this._request({
				method: "GET",
				params: params,
				url: this._config.API_login,
			});
			this.emit("loginCheck_response", res);

			let window = {};

			eval(res.data);
			notEqual(window.code, 400, res);

			if (window.code === 200) {
				this.redirectUri = window.redirect_uri;
				this._config = getConfig({ Domain: window.redirect_uri.match(/(?:\w+\.)+\w+/)[0] });
			} else if (window.code === 201 && window.userAvatar) {
				this._user.userAvatar = window.userAvatar;
			}

			return window;
		} catch (err) {
			this.emit("error", err);
			this.emit("loginCheck_error", err);
			err.tips = "获取手机确认登录信息异常";
			throw err;
		}
	}

	/**
	 * 登录
	 * @returns {Promise<void>} Promise 对象，表示登录操作完成
	 */
	async login() {
		try {
			let params = {
				fun: "new",
				mod: "desktop",
				version: "v2",
			};
			this.emit("login_request", { params: params, data: null });

			const res = await this._request({
				method: "GET",
				params: params,
				headers: {
					extspam: this._config.UOSExtspam,
					"client-version": this._config.UOSClientVersion,
				},
				url: this.redirectUri,
			});
			this.emit("login_response", res);

			let pm = res.data.match(/<ret>(.*)<\/ret>/);
			if (pm && pm[1] === "0") {
				this._prop.skey = res.data.match(/<skey>(.*)<\/skey>/)[1];
				this._prop.sid = res.data.match(/<wxsid>(.*)<\/wxsid>/)[1];
				this._prop.uin = res.data.match(/<wxuin>(.*)<\/wxuin>/)[1];
				this._prop.passTicket = res.data.match(/<pass_ticket>(.*)<\/pass_ticket>/)[1];
			}

			if (res.headers["set-cookie"]) {
				res.headers["set-cookie"].forEach((item) => {
					if (/webwx.*?data.*?ticket/i.test(item)) {
						this._prop.webwxDataTicket = item.match(/=(.*?);/)[1];
					} else if (/webwx.*?auth.*?ticket/i.test(item)) {
						this._prop.webwxAuthTicket = item.match(/=(.*?);/)[1];
					} else if (/wxuin/i.test(item)) {
						this._prop.uin = item.match(/=(.*?);/)[1];
					} else if (/wxsid/i.test(item)) {
						this._prop.sid = item.match(/=(.*?);/)[1];
					}
				});
				this._cookie = res.headers["set-cookie"];
			}
		} catch (err) {
			this.emit("error", err);
			this.emit("login_error", err);
			err.tips = "登录异常";
			throw err;
		}
	}

	/**
	 * 初始化微信
	 * @returns {Promise<Object>} Promise 对象，表示初始化操作完成，并返回初始化后的数据对象
	 */
	async init() {
		try {
			const params = { _: Math.floor(Date.now() / 1000).toString() };
			const data = { BaseRequest: this._baseRequest() };
			this.emit("webwxinit_request", { params: params, data: data });

			const res = await this._request({
				method: "POST",
				data: data,
				params: params,
				url: this._config.API_webwxinit,
			});
			this.emit("webwxinit_response", res);

			const initData = res.data;
			if (initData.BaseResponse.Ret == this._config.SYNCCHECK_RET_LOGOUT) {
				throw new AlreadyLogoutError();
			}

			equal(initData.BaseResponse.Ret, 0, res);

			this._prop.skey = initData.SKey || this._prop.skey;

			this._updateSyncKey(initData);

			Object.assign(this._user, initData.User);

			return initData;
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxinit_error", err);
			err.tips = "初始化异常";
			throw err;
		}
	}

	/**
	 * 发送手机状态通知
	 * @param {string} toUserName - 接收通知的用户ID（可选）
	 * @returns {Promise<void>} Promise 对象，表示手机状态通知操作完成
	 */
	async sendMobileNotification(toUserName) {
		try {
			const params = {
				lang: this._config.Lang,
				pass_ticket: this._prop.passTicket,
			};

			const data = {
				Code: toUserName ? 1 : 3,
				BaseRequest: this._baseRequest(),
				FromUserName: this._user.UserName,
				ToUserName: toUserName || this._user.UserName,
				ClientMsgId: generateClientMsgID(),
			};
			this.emit("webwxstatusnotify_request", { params: params, data: data });

			const res = await this._request({
				method: "POST",
				data: data,
				params: params,
				url: this._config.API_webwxstatusnotify,
			});
			this.emit("webwxstatusnotify_response", res);

			const responseData = res.data;

			equal(responseData.BaseResponse.Ret, 0, res);
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxstatusnotify_error", err);
			err.tips = "手机状态通知异常";
			throw err;
		}
	}

	/**
	 * 获取通讯录
	 * @param {number} seq - 通讯录序列号（可选，默认为0）
	 * @returns {Promise<Object>} Promise 对象，表示获取通讯录的结果
	 */
	async fetchContacts(seq = 0) {
		try {
			const params = {
				r: +new Date(),
				seq: seq,
				lang: this._config.Lang,
				skey: this._prop.skey,
				pass_ticket: this._prop.passTicket,
			};
			this.emit("webwxgetcontact_request", { params: params, data: null });

			const res = await this._request({
				method: "POST",
				params: params,
				url: this._config.API_webwxgetcontact,
			});
			this.emit("webwxgetcontact_response", res);

			const data = res.data;
			equal(data.BaseResponse.Ret, 0, res);

			return data;
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxgetcontact_error", err);
			err.tips = "获取通讯录异常";
			throw err;
		}
	}

	/**
	 * 批量获取联系人详细信息
	 * @param {Array} contacts - 联系人列表
	 * @returns {Promise<Array>} - Promise 对象，表示批量获取联系人详细信息的结果
	 */
	async fetchBatchContactInfo(contacts) {
		try {
			const params = {
				r: +new Date(),
				type: "ex",
				lang: this._config.Lang,
				pass_ticket: this._prop.passTicket,
			};

			const data = {
				BaseRequest: this._baseRequest(),
				Count: contacts.length,
				List: contacts,
			};
			this.emit("webwxbatchgetcontact_request", { params: params, data: data });

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxbatchgetcontact,
			});
			this.emit("webwxbatchgetcontact_response", res);

			const responseData = res.data;
			equal(responseData.BaseResponse.Ret, 0, res);

			return responseData.ContactList;
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxbatchgetcontact_error", err);
			err.tips = "批量获取联系人异常";
			throw err;
		}
	}

	/**
	 * 执行同步检查
	 * @returns {Promise<number>} Promise 对象，表示同步检查结果中的 selector 值
	 */
	async performSyncCheck() {
		try {
			const params = {
				_: (Date.now() * 1).toString(),
				r: (Date.now() * 1).toString(),
				uin: this._prop.uin,
				sid: this._prop.sid,
				skey: this._prop.skey,
				deviceid: this._baseRequest().DeviceID,
				synckey: this._prop.formatedSyncKey,
			};
			this.emit("synccheck_request", { params: params, data: null });

			const res = await this._request({
				method: "GET",
				params: params,
				url: this._config.API_synccheck,
			});
			this.emit("synccheck_response", res);

			let window = {
				synccheck: {},
			};

			try {
				eval(res.data);
			} catch (ex) {
				window.synccheck = { retcode: "0", selector: "0" };
			}

			if (window.synccheck.retcode == this._config.SYNCCHECK_RET_LOGOUT) {
				throw new AlreadyLogoutError();
			}

			equal(window.synccheck.retcode, this._config.SYNCCHECK_RET_SUCCESS, res);

			return window.synccheck.selector;
		} catch (err) {
			this.emit("error", err);
			this.emit("synccheck_error", err);
			err.tips = "同步检查异常";
			throw err;
		}
	}

	/**
	 * 执行同步操作
	 * @returns {Promise<Object>} Promise 对象，表示同步结果的数据对象
	 */
	async performSync() {
		try {
			const params = {
				lang: this._config.Lang,
				sid: this._prop.sid,
				skey: this._prop.skey,
				pass_ticket: this._prop.passTicket,
			};

			const data = {
				BaseRequest: this._baseRequest(),
				SyncKey: this._prop.syncKey,
				rr: ~new Date(),
			};
			this.emit("webwxsync_request", { params: params, data: data });

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxsync,
			});
			this.emit("webwxsync_response", res);

			const responseData = res.data;

			if (responseData.BaseResponse.Ret == this._config.SYNCCHECK_RET_LOGOUT) {
				throw new AlreadyLogoutError();
			}

			equal(responseData.BaseResponse.Ret, 0, res);

			this._updateSyncKey(responseData);
			this._prop.skey = responseData.SKey || this._prop.skey;

			return responseData;
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxsync_error", err);
			err.tips = "获取新信息异常";
			throw err;
		}
	}

	/**
	 * 发送文本消息
	 * @param {string} message - 要发送的消息内容
	 * @param {string} toUserName - 目标用户的 UserName
	 * @returns {Promise<Object>} Promise 对象，表示发送消息结果的数据对象
	 * @throws {Error} 如果发送消息失败，则会抛出异常
	 */
	async sendTextMessage(message, toUserName) {
		try {
			const params = {
				lang: this._config.Lang,
				pass_ticket: this._prop.passTicket,
			};

			const clientMessageId = generateClientMsgID();
			const data = {
				Scene: 0,
				BaseRequest: this._baseRequest(),
				Msg: {
					Type: this._config.MSGTYPE_TEXT,
					Content: message,
					ToUserName: toUserName,
					LocalID: clientMessageId,
					ClientMsgId: clientMessageId,
					FromUserName: this._user["UserName"],
				},
			};
			this.emit("webwxsendmsg_request", { params: params, data: data });

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxsendmsg,
			});
			this.emit("webwxsendmsg_response", res);

			const responseData = res.data;
			equal(responseData.BaseResponse.Ret, 0, res);

			return responseData;
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxsendmsg_error", err);
			err.tips = "发送文本信息异常";
			throw err;
		}
	}

	/**
	 * 发送表情消息
	 * @param {string} id - 表情消息ID，可以是 MediaId 或 EMoticonMd5
	 * @param {string} toUserName - 目标用户的 UserName
	 * @returns {Promise<Object>} Promise 对象，表示发送消息结果的数据对象
	 * @throws {Error} 如果发送消息失败，则会抛出异常
	 */
	async sendEmoticonMessage(id, toUserName) {
		try {
			const params = {
				fun: "sys",
				lang: this._config.Lang,
				pass_ticket: this._prop.passTicket,
			};

			const clientMessageId = generateClientMsgID();
			const data = {
				BaseRequest: this._baseRequest(),
				Scene: 0,
				Msg: {
					Type: this._config.MSGTYPE_EMOTICON,
					EmojiFlag: 2,
					ToUserName: toUserName,
					LocalID: clientMessageId,
					ClientMsgId: clientMessageId,
					FromUserName: this._user["UserName"],
				},
			};

			if (id.indexOf("@") === 0) {
				data.Msg.MediaId = id;
			} else {
				data.Msg.EMoticonMd5 = id;
			}
			this.emit("webwxsendemoticon_request", { params: params, data: data });

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxsendemoticon,
			});
			this.emit("webwxsendemoticon_response", res);

			const responseData = res.data;
			equal(responseData.BaseResponse.Ret, 0, res);

			return responseData;
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxsendemoticon_error", err);
			err.tips = "发送表情信息异常";
			throw err;
		}
	}

	/**
	 * 上传媒体文件
	 * @param {Stream|Buffer} file - 要上传的文件流或缓冲区
	 * @param {string} filename - 文件名（可选）
	 * @param {string} toUserName - 接收方用户名（可选）
	 * @returns {Promise<Object>} - 上传成功后返回的媒体信息对象
	 */
	async uploadMedia(file, filename, toUserName) {
		try {
			let name, type, size, ext, mediatype, data;

			// 根据不同类型的文件处理数据
			if ((typeof File !== "undefined" && file.constructor == File) || (typeof Blob !== "undefined" && file.constructor == Blob)) {
				name = file.name || "file";
				type = file.type;
				size = file.size;
				data = file;
			} else if (Buffer.isBuffer(file)) {
				if (!filename) {
					throw new Error("未知文件名");
				}
				name = filename;
				type = mime.lookup(name);
				size = file.length;
				data = file;
			} else if (file.readable) {
				if (!file.path && !filename) {
					throw new Error("未知文件名");
				}
				name = path.basename(file.path || filename);
				type = mime.lookup(name);
				const buffer = await new Promise((resolve, reject) => {
					file.pipe(
						bl((err, buffer) => {
							if (err) {
								reject(err);
							} else {
								resolve(buffer);
							}
						})
					);
				});
				size = buffer.length;
				data = buffer;
			}

			ext = name.match(/.*\.(.*)/);
			ext = ext ? ext[1].toLowerCase() : "";

			// 根据文件扩展名确定媒体类型
			switch (ext) {
				case "bmp":
				case "jpeg":
				case "jpg":
				case "png":
					mediatype = "pic";
					break;
				case "mp4":
					mediatype = "video";
					break;
				default:
					mediatype = "doc";
			}

			const clientMessageId = generateClientMsgID();

			const uploadMediaRequest = JSON.stringify({
				BaseRequest: this._baseRequest(),
				ClientMediaId: clientMessageId,
				TotalLen: size,
				StartPos: 0,
				DataLen: size,
				MediaType: 4,
				UploadType: 2,
				FromUserName: this._user.UserName,
				ToUserName: toUserName || this._user.UserName,
			});

			const form = new FormData();
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
				knownLength: size,
			});

			const formDataPromise = new Promise((resolve, reject) => {
				if (isBrowserEnv) {
					resolve({
						data: form,
						headers: {},
					});
				} else {
					form.pipe(
						bl((err, buffer) => {
							if (err) {
								reject(err);
							} else {
								resolve({
									data: buffer,
									headers: form.getHeaders(),
								});
							}
						})
					);
				}
			});

			var params = { f: "json" };
			var requestData = (await formDataPromise).data;
			this.emit("webwxuploadmedia_request", { params: params, data: requestData });

			// 发起上传请求
			const res = await this._request({
				method: "POST",
				params: params,
				data: requestData,
				url: this._config.API_webwxuploadmedia,
				headers: (await formDataPromise).headers,
			});
			this.emit("webwxuploadmedia_response", res);

			const mediaId = res.data.MediaId;

			return {
				name: name,
				size: size,
				ext: ext,
				mediatype: mediatype,
				mediaId: mediaId,
			};
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxuploadmedia_error", err);
			err.tips = "上传媒体文件异常";
			throw err;
		}
	}

	/**
	 * 发送图片消息
	 * @param {string} mediaId - 媒体文件的ID
	 * @param {string} toUserName - 接收方用户名
	 * @returns {Promise<Object>} - 发送成功后返回的消息对象
	 */
	async sendPictureMessage(mediaId, toUserName) {
		try {
			const params = {
				f: "json",
				fun: "async",
				lang: this._config.Lang,
				pass_ticket: this._prop.passTicket,
			};

			const clientMessageId = generateClientMsgID();
			const data = {
				BaseRequest: this._baseRequest(),
				Scene: 0,
				Msg: {
					Type: this._config.MSGTYPE_IMAGE,
					MediaId: mediaId,
					ToUserName: toUserName,
					LocalID: clientMessageId,
					ClientMsgId: clientMessageId,
					FromUserName: this._user.UserName,
				},
			};
			this.emit("webwxsendmsgimg_request", { params: params, data: data });

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxsendmsgimg,
			});
			this.emit("webwxsendmsgimg_response", res);

			const responseData = res.data;
			equal(responseData.BaseResponse.Ret, 0, res);

			return responseData;
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxsendmsgimg_error", err);
			err.tips = "发送图片异常";
			throw err;
		}
	}

	/**
	 * 发送视频消息
	 * @param {string} mediaId - 媒体文件的ID
	 * @param {string} toUserName - 接收方用户名
	 * @returns {Promise<Object>} - 发送成功后返回的消息对象
	 */
	async sendVideoMessage(mediaId, toUserName) {
		try {
			const params = {
				f: "json",
				fun: "async",
				lang: this._config.Lang,
				pass_ticket: this._prop.passTicket,
			};

			const clientMessageId = generateClientMsgID();
			const data = {
				BaseRequest: this._baseRequest(),
				Scene: 0,
				Msg: {
					Type: this._config.MSGTYPE_VIDEO,
					MediaId: mediaId,
					ToUserName: toUserName,
					LocalID: clientMessageId,
					ClientMsgId: clientMessageId,
					FromUserName: this._user.UserName,
				},
			};
			this.emit("webwxsendmsgvedio_request", { params: params, data: data });

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxsendmsgvedio,
			});
			this.emit("webwxsendmsgvedio_response", res);

			const responseData = res.data;
			equal(responseData.BaseResponse.Ret, 0, res);

			return responseData;
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxsendmsgvedio_error", err);
			err.tips = "发送视频异常";
			throw err;
		}
	}

	/**
	 * 发送文件消息
	 * @param {string} mediaId - 媒体文件的ID
	 * @param {string} name - 文件名
	 * @param {number} size - 文件大小（字节）
	 * @param {string} ext - 文件扩展名
	 * @param {string} toUserName - 接收方用户名
	 * @returns {Promise<Object>} - 发送成功后返回的消息对象
	 */
	async sendDocumentMessage(mediaId, name, size, ext, toUserName) {
		try {
			const params = {
				f: "json",
				fun: "async",
				lang: this._config.Lang,
				pass_ticket: this._prop.passTicket,
			};

			const clientMessageId = generateClientMsgID();
			const content = `
				<appmsg appid='wxeb7ec651dd0aefa9' sdkver=''>
					<title>${name}</title>
					<des></des>
					<action></action>
					<type>6</type>
					<content></content>
					<url></url>
					<lowurl></lowurl>
					<appattach>
						<totallen>${size}</totallen>
						<attachid>${mediaId}</attachid>
						<fileext>${ext}</fileext>
					</appattach>
					<extinfo></extinfo>
				</appmsg>`;

			const data = {
				BaseRequest: this._baseRequest(),
				Scene: 0,
				Msg: {
					Type: this._config.APPMSGTYPE_ATTACH,
					Content: content,
					ToUserName: toUserName,
					LocalID: clientMessageId,
					ClientMsgId: clientMessageId,
					FromUserName: this._user.UserName,
				},
			};
			this.emit("webwxsendappmsg_request", { params: params, data: data });

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxsendappmsg,
			});
			this.emit("webwxsendappmsg_response", res);

			const responseData = res.data;
			equal(responseData.BaseResponse.Ret, 0, res);

			return responseData;
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxsendappmsg_error", err);
			err.tips = "发送文件异常";
			throw err;
		}
	}

	/**
	 * 转发消息
	 * @param {Object} message - 需要转发的消息对象
	 * @param {string} toUserName - 接收方用户名
	 * @returns {Promise<Object>} - 转发成功后返回的消息对象
	 */
	async forwardMessage(message, toUserName) {
		try {
			const params = {
				f: "json",
				fun: "async",
				lang: this._config.Lang,
				pass_ticket: this._prop.passTicket,
			};

			const clientMessageId = generateClientMsgID();
			let data = {
				BaseRequest: this._baseRequest(),
				Scene: 2,
				Msg: {
					Type: message.MsgType,
					MediaId: "",
					Content: message.Content.replace(/&lt;/g, "<").replace(/&gt;/g, ">"),
					ToUserName: toUserName,
					LocalID: clientMessageId,
					ClientMsgId: clientMessageId,
					FromUserName: this._user.UserName,
				},
			};

			let url;
			switch (message.MsgType) {
				case this._config.MSGTYPE_TEXT:
					url = this._config.API_webwxsendmsg;
					if (message.SubMsgType === this._config.MSGTYPE_LOCATION) {
						data.Msg.Type = this._config.MSGTYPE_LOCATION;
						data.Msg.Content = message.OriContent.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
					}
					break;
				case this._config.MSGTYPE_IMAGE:
					url = this._config.API_webwxsendmsgimg;
					break;
				case this._config.MSGTYPE_EMOTICON:
					params.fun = "sys";
					url = this._config.API_webwxsendemoticon;
					data.Msg.EMoticonMd5 = message.Content.replace(/^[\s\S]*?md5\s?=\s?"(.*?)"[\s\S]*?$/, "$1");
					if (!data.Msg.EMoticonMd5) {
						throw new Error("商店表情不能转发");
					}
					data.Scene = 0;
					data.Msg.EmojiFlag = 2;
					delete data.Msg.MediaId;
					delete data.Msg.Content;
					break;
				case this._config.MSGTYPE_MICROVIDEO:
				case this._config.MSGTYPE_VIDEO:
					url = this._config.API_webwxsendmsgvedio;
					data.Msg.Type = this._config.MSGTYPE_VIDEO;
					break;
				case this._config.MSGTYPE_APP:
					url = this._config.API_webwxsendappmsg;
					data.Msg.Type = message.AppMsgType;
					data.Msg.Content = data.Msg.Content.replace(
						/^[\s\S]*?(<appmsg[\s\S]*?<attachid>)[\s\S]*?(<\/attachid>[\s\S]*?<\/appmsg>)[\s\S]*?$/,
						`$1${message.MediaId}$2`
					);
					break;
				default:
					this.emit("forwardMessage_error", new Error("该消息类型不能直接转发"));
					throw new Error("该消息类型不能直接转发");
			}
			this.emit("forwardMessage_request", { params: params, data: data });

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: url,
			});
			this.emit("forwardMessage_response", res);

			const responseData = res.data;
			equal(responseData.BaseResponse.Ret, 0, res);

			return responseData;
		} catch (err) {
			this.emit("error", err);
			this.emit("forwardMessage_error", err);
			err.tips = "转发消息异常";
			throw err;
		}
	}

	/**
	 * 撤回消息
	 * @param {string} messageId - 待撤回的消息ID
	 * @param {string} toUserName - 消息所在的聊天对象的用户名
	 * @returns {Promise<Object>} - 包含操作结果的对象
	 */
	async revokeMessage(messageId, toUserName) {
		try {
			const data = {
				BaseRequest: this._baseRequest(),
				SvrMsgId: messageId,
				ToUserName: toUserName,
				ClientMsgId: generateClientMsgID(),
			};
			this.emit("webwxrevokemsg_request", { params: null, data: data });

			const res = await this._request({
				method: "POST",
				data: data,
				url: this._config.API_webwxrevokemsg,
			});
			this.emit("webwxrevokemsg_response", res);

			const result = res.data;
			if (result.BaseResponse.Ret !== 0) {
				throw new Error(`撤回消息失败: ${JSON.stringify(res)}`);
			}

			return result;
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxrevokemsg_error", err);
			err.tips = "撤回消息异常";
			throw err;
		}
	}

	/**
	 * 获取消息图片或表情
	 * @param {string} messageId - 消息ID
	 * @returns {Promise<Object>} - 包含图片或表情数据和类型的对象
	 */
	async getMessageImg(messageId) {
		try {
			const params = {
				type: "big",
				MsgID: messageId,
				skey: this._prop.skey,
			};
			this.emit("webwxgetmsgimg_request", { params: params, data: null });

			const res = await this._request({
				method: "GET",
				params: params,
				responseType: "arraybuffer",
				url: this._config.API_webwxgetmsgimg,
			});
			this.emit("webwxgetmsgimg_response", res);

			return {
				data: res.data,
				type: res.headers["content-type"],
			};
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxgetmsgimg_error", err);
			err.tips = "获取图片或表情异常";
			throw err;
		}
	}

	/**
	 * 获取视频
	 * @param {string} messageId - 消息ID
	 * @returns {Promise<Object>} - 包含视频数据和类型的对象
	 */
	async getMessageVideo(messageId) {
		try {
			const params = {
				MsgID: messageId,
				skey: this._prop.skey,
			};
			this.emit("webwxgetvideo_request", { params: params, data: null });

			const res = await this._request({
				method: "GET",
				headers: {
					Range: "bytes=0-",
				},
				params: params,
				responseType: "arraybuffer",
				url: this._config.API_webwxgetvideo,
			});
			this.emit("webwxgetvideo_response", res);

			return {
				data: res.data,
				type: res.headers["content-type"],
			};
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxgetvideo_error", err);
			err.tips = "获取视频异常";
			throw err;
		}
	}

	/**
	 * 获取声音
	 * @param {string} messageId - 消息ID
	 * @returns {Promise<Object>} - 包含声音数据和类型的对象
	 */
	async getMessageVoice(messageId) {
		try {
			const params = {
				MsgID: messageId,
				skey: this._prop.skey,
			};
			this.emit("webwxgetvoice_request", { params: params, data: null });

			const res = await this._request({
				method: "GET",
				params: params,
				responseType: "arraybuffer",
				url: this._config.API_webwxgetvoice,
			});
			this.emit("webwxgetvoice_response", res);

			return {
				data: res.data,
				type: res.headers["content-type"],
			};
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxgetvoice_error", err);
			err.tips = "获取声音异常";
			throw err;
		}
	}

	/**
	 * 获取文件
	 * @param {string} FromUserName - 发送者用户名
	 * @param {string} MediaId - 文件的媒体ID
	 * @param {string} FileName - 文件名
	 * @returns {Promise<Object>} - 包含文件数据和类型的对象
	 */
	async getMessageDocument(FromUserName, MediaId, FileName) {
		try {
			const params = {
				sender: FromUserName,
				mediaid: MediaId,
				filename: FileName,
				fromuser: this._user.UserName,
				pass_ticket: this._prop.passTicket,
				webwx_data_ticket: this._prop.webwxDataTicket,
			};
			this.emit("webwxdownloadmedia_request", { params: params, data: null });

			const res = await this._request({
				method: "GET",
				params: params,
				responseType: "arraybuffer",
				url: this._config.API_webwxdownloadmedia,
			});
			this.emit("webwxdownloadmedia_response", res);

			return {
				data: res.data,
				type: res.headers["content-type"],
			};
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxdownloadmedia_error", err);
			err.tips = "获取文件异常";
			throw err;
		}
	}

	/**
	 * 获取头像图片
	 * @param {string} HeadImgUrl - 头像图片的URL
	 * @returns {Promise<Object>} - 包含头像图片数据和类型的对象
	 */
	async getHeadImg(HeadImgUrl) {
		try {
			const res = await this._request({
				method: "GET",
				url: this._config.BaseHost + HeadImgUrl,
				responseType: "arraybuffer",
			});
			this.emit("headimage_response", res);

			return {
				data: res.data,
				type: res.headers["content-type"],
			};
		} catch (err) {
			this.emit("error", err);
			this.emit("headimage_error", err);
			err.tips = "获取头像异常";
			throw err;
		}
	}

	/**
	 * 通过好友请求
	 * @param {string} UserName - 好友的用户名
	 * @param {string} Ticket - 好友的验证票据
	 * @returns {Promise<Object>} - 包含通过好友请求后返回的数据的对象
	 */
	async verifyUser(UserName, Ticket) {
		try {
			const params = {
				lang: this._config.Lang,
				pass_ticket: this._prop.passTicket,
			};

			const data = {
				BaseRequest: this._baseRequest(),
				Opcode: 3,
				VerifyUserListSize: 1,
				VerifyUserList: [
					{
						Value: UserName,
						VerifyUserTicket: Ticket,
					},
				],
				VerifyContent: "",
				SceneListCount: 1,
				SceneList: [33],
				skey: this._prop.skey,
			};
			this.emit("webwxverifyuser_request", { params: params, data: data });

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxverifyuser,
			});
			this.emit("webwxverifyuser_response", res);

			const result = res.data;
			if (result.BaseResponse.Ret !== 0) {
				throw new Error(`通过好友请求失败: ${JSON.stringify(res)}`);
			}

			return result;
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxverifyuser_error", err);
			err.tips = "通过好友请求异常";
			throw err;
		}
	}

	/**
	 * 添加好友
	 * @param {string} UserName - 好友的用户名
	 * @param {string} [content=我是${this._user.NickName}] - 验证消息内容，默认为当前用户的昵称
	 * @returns {Promise<Object>} - 包含添加好友后返回的数据的对象
	 */
	async addFriend(UserName, content = `我是${this._user.NickName}`) {
		try {
			const params = {
				lang: this._config.Lang,
				pass_ticket: this._prop.passTicket,
			};

			const data = {
				BaseRequest: this._baseRequest(),
				Opcode: 2,
				VerifyUserListSize: 1,
				VerifyUserList: [
					{
						Value: UserName,
						VerifyUserTicket: "",
					},
				],
				VerifyContent: content,
				SceneListCount: 1,
				SceneList: [33],
				skey: this._prop.skey,
			};
			this.emit("webwxverifyuser_request", { params: params, data: data });

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxverifyuser,
			});
			this.emit("webwxverifyuser_response", res);

			const result = res.data;
			if (result.BaseResponse.Ret !== 0) {
				throw new Error(`添加好友失败: ${JSON.stringify(res)}`);
			}

			return result;
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxverifyuser_error", err);
			err.tips = "添加好友异常";
			throw err;
		}
	}

	/**
	 * 创建群聊
	 * @param {string} Topic - 群聊的主题
	 * @param {Array} MemberList - 成员列表，包含要邀请的成员的用户名
	 * @returns {Promise<Object>} - 包含创建群聊后返回的数据的对象
	 */
	async createChatroom(Topic, MemberList) {
		try {
			const params = {
				lang: this._config.Lang,
				r: ~new Date(),
				pass_ticket: this._prop.passTicket,
			};

			const data = {
				BaseRequest: this._baseRequest(),
				MemberCount: MemberList.length,
				MemberList: MemberList,
				Topic: Topic,
			};
			this.emit("webwxcreatechatroom_request", { params: params, data: data });

			const res = await this._request({
				method: "POST",
				url: this._config.API_webwxcreatechatroom,
				params: params,
				data: data,
			});
			this.emit("webwxcreatechatroom_response", res);

			const result = res.data;
			if (result.BaseResponse.Ret !== 0) {
				throw new Error(`创建群失败: ${JSON.stringify(res)}`);
			}

			return result;
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxcreatechatroom_error", err);
			err.tips = "创建群异常";
			throw err;
		}
	}

	/**
	 * 更新群聊信息（添加、删除或邀请成员）
	 * @param {string} ChatRoomUserName - 群聊的用户名
	 * @param {Array} MemberList - 成员列表，包含要操作的成员的用户名
	 * @param {string} fun - 操作类型，可选值为 "addmember"、"delmember" 或 "invitemember"
	 * @returns {Promise<Object>} - 包含更新群聊后返回的数据的对象
	 */
	async updateChatroom(ChatRoomUserName, MemberList, fun) {
		try {
			const params = {
				fun: fun,
			};

			const data = {
				BaseRequest: this._baseRequest(),
				ChatRoomName: ChatRoomUserName,
			};

			if (fun === "addmember") {
				data.AddMemberList = MemberList.toString();
			} else if (fun === "delmember") {
				data.DelMemberList = MemberList.toString();
			} else if (fun === "invitemember") {
				data.InviteMemberList = MemberList.toString();
			}
			this.emit("webwxupdatechatroom_request", { params: params, data: data });

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxupdatechatroom,
			});
			this.emit("webwxupdatechatroom_response", res);

			const result = res.data;
			if (result.BaseResponse.Ret !== 0) {
				throw new Error(`邀请或踢出群成员失败: ${JSON.stringify(res)}`);
			}

			return result;
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxupdatechatroom_error", err);
			err.tips = "邀请或踢出群成员异常";
			throw err;
		}
	}

	/**
	 * 更新群名
	 * @param {string} ChatRoomUserName - 群的用户名
	 * @param {string} NewName - 群的新名字
	 * @returns {Promise<void>} - 执行结果的Promise对象
	 */
	async updateChatRoomName(ChatRoomUserName, NewName) {
		try {
			const params = {
				fun: "modtopic",
			};

			const data = {
				BaseRequest: this._baseRequest(),
				ChatRoomName: ChatRoomUserName,
				NewTopic: NewName,
			};
			this.emit("webwxupdatechatroom_request", { params: params, data: data });

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxupdatechatroom,
			});
			this.emit("webwxupdatechatroom_response", res);

			const result = res.data;
			if (result.BaseResponse.Ret !== 0) {
				throw new Error(`更新群名失败: ${JSON.stringify(res)}`);
			}
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxupdatechatroom_error", err);
			err.tips = "更新群名异常";
			throw err;
		}
	}

	/**
	 * 更新联系人的备注名
	 * @param {string} UserName - 联系人的用户名
	 * @param {string} RemarkName - 联系人的备注名
	 * @returns {Promise<Object>} - 包含操作结果的对象
	 */
	async updateRemarkName(UserName, RemarkName) {
		try {
			const params = {
				lang: this._config.Lang,
				pass_ticket: this._prop.passTicket,
			};

			const data = {
				BaseRequest: this._baseRequest(),
				CmdId: 2,
				RemarkName: RemarkName,
				UserName: UserName,
			};
			this.emit("webwxoplog_request", { params: params, data: data });

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxoplog,
			});
			this.emit("webwxoplog_response", res);

			const result = res.data;
			if (result.BaseResponse.Ret !== 0) {
				throw new Error(`设置用户标签失败: ${JSON.stringify(res)}`);
			}

			return result;
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxoplog_error", err);
			err.tips = "设置用户标签异常";
			throw err;
		}
	}

	/**
	 * 置顶或取消置顶联系人
	 * @param {string} UserName - 联系人的用户名
	 * @param {number} OP - 操作类型，0表示取消置顶，1表示置顶
	 * @param {string} RemarkName - 联系人的备注名
	 * @returns {Promise<Object>} - 包含操作结果的对象
	 */
	async opLog(UserName, OP, RemarkName) {
		try {
			const params = {
				pass_ticket: this._prop.passTicket,
			};

			const data = {
				BaseRequest: this._baseRequest(),
				CmdId: 3,
				OP: OP,
				RemarkName: RemarkName,
				UserName: UserName,
			};
			this.emit("webwxoplog_request", { params: params, data: data });

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxoplog,
			});
			this.emit("webwxoplog_response", res);

			const result = res.data;
			if (result.BaseResponse.Ret !== 0) {
				throw new Error(`置顶或取消置顶失败: ${JSON.stringify(res)}`);
			}

			return result;
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxoplog_error", err);
			err.tips = "置顶或取消置顶异常";
			throw err;
		}
	}

	/**
	 * 发送状态报告
	 * @param {Object} text - 状态报告文本，包含操作记录等信息
	 * @returns {Promise<Object>} Promise 对象，表示发送状态报告的结果
	 */
	async sendStatReport(text) {
		try {
			text = text || {
				type: "[action-record]",
				data: {
					actions: [
						{
							type: "click",
							action: "发送框",
							time: +new Date(),
						},
					],
				},
			};

			text = JSON.stringify(text);

			const params = {
				fun: "new",
				lang: this._config.Lang,
				pass_ticket: this._prop.passTicket,
			};

			const data = {
				BaseRequest: this._baseRequest(),
				Count: 1,
				List: [
					{
						Text: text,
						Type: 1,
					},
				],
			};
			this.emit("webwxreport_request", { params: params, data: data });

			return await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxreport,
			});
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxreport_error", err);
			err.tips = "状态报告异常";
			throw err;
		}
	}

	/**
	 * 登出
	 * @returns {Promise<string>} Promise 对象，表示登出结果的消息字符串
	 */
	async logout() {
		try {
			const params = {
				type: 0,
				redirect: 1,
				lang: this._config.Lang,
				skey: this._prop.skey,
			};
			this.emit("webwxlogout_request", { params: params, data: null });

			const res = await this._request({
				method: "POST",
				params: params,
				url: this._config.API_webwxlogout,
			});
			this.emit("webwxlogout_response", res);

			return "登出成功";
		} catch (err) {
			this.emit("error", err);
			this.emit("webwxlogout_error", err);
			return "登出异常";
		}
	}
}
