import bl from "bl";
import path from "path";
import mime from "mime";
import _debug from "debug";
import FormData from "form-data";

import { getConfig } from "./config";
import { Request } from "./utils/request";
import { equal, notEqual } from "./utils/assert";
import { isBrowserEnv, generateDeviceID, generateClientMsgID } from "./utils/global";

const debug = _debug("core");

export class AlreadyLogoutError extends Error {
	constructor(message = "already logout") {
		super(message);

		this.constructor = AlreadyLogoutError;

		this.__proto__ = AlreadyLogoutError.prototype;
	}
}

/**
 * 微信核心类
 */
export default class WeixinCore {
	/**
	 * 创建一个 WechatCore 的实例
	 * @param {Object} data - 数据对象
	 */
	constructor(data) {
		this.STATE = getConfig().STATE;
		
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
			syncKey: { List: [] },
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
		this._config = getConfig();

		/**
		 * 存储数据对象
		 * @type {Object}
		 */
		this._data = data || {};

		/**
		 * 请求对象
		 * @type {Request}
		 */
		this._request = new Request({ Cookie: this._cookie });
	}

	/**
	 * 设置 botData 对象
	 * @param {Object} data - 数据对象
	 */
	set Data(data) {
		/**
		 * 遍历 data 对象的键，并将对应键的值复制给 this 对象的相应属性
		 */
		Object.keys(data).forEach((key) => {
			Object.assign(this[key], data[key]);
		});
	}

	/**
	 * 获取 botData 对象
	 * @returns {Object} botData 对象
	 */
	get Data() {
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
			user: this._user,
		};
	}

	/**
	 * 获取基础请求数据
	 * @returns {Object} 基础请求数据对象
	 */
	_baseRequest() {
		return {
			Uin: parseInt(this._prop.uin),
			Sid: this._prop.sid,
			Skey: this._prop.skey,
			DeviceID: generateDeviceID(),
		};
	}

	/**
	 * 更新同步键
	 * @param {Object} data - 同步数据对象
	 */
	_updateSyncKey(data) {
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

			let window = {
				QRLogin: {},
			};

			// res.data: "window.QRLogin.code = xxx; ..."

			eval(res.data);
			equal(window.QRLogin.code, 200, res);

			this._prop.uuid = window.QRLogin.uuid;
			return window.QRLogin.uuid;
		} catch (err) {
			debug(err);
			err.tips = "获取UUID失败";
			throw err;
		}
	}

	/**
	 * 检查登录状态
	 * @returns {Promise<object>} Promise 对象，包含检查结果的对象
	 */
	async checkLogin() {
		try {
			let params = {
				tip: 0,
				loginicon: true,
				uuid: this._prop.uuid,
			};

			const res = await this._request({
				method: "GET",
				params: params,
				url: this._config.API_login,
			});

			let window = {};

			eval(res.data);
			notEqual(window.code, 400, res);

			if (window.code === 200) {
				this._config = getConfig(window.redirect_uri.match(/(?:\w+\.)+\w+/)[0]);
				this.rediUri = window.redirect_uri;
			} else if (window.code === 201 && window.userAvatar) {
				// this._user.userAvatar = window.userAvatar
			}
			return window;
		} catch (err) {
			debug(err);
			err.tips = "获取手机确认登录信息失败";
			throw err;
		}
	}

	/**
	 * 登录
	 * @returns {Promise<void>} Promise 对象，表示登录操作完成
	 */
	async login() {
		try {
			const res = await this._request({
				method: "GET",
				params: {
					fun: "new",
				},
				url: this.rediUri,
			});

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
					} else if (/wxuin/i.test(item)) {
						this._prop.uin = item.match(/=(.*?);/)[1];
					} else if (/wxsid/i.test(item)) {
						this._prop.sid = item.match(/=(.*?);/)[1];
					}
				});
			}
		} catch (err) {
			debug(err);
			err.tips = "登录失败";
			throw err;
		}
	}

	/**
	 * 初始化微信
	 * @returns {Promise<Object>} Promise 对象，表示初始化操作完成，并返回初始化后的数据对象
	 */
	async init() {
		try {
			const params = {
				r: ~new Date(),
				skey: this._prop.skey,
				pass_ticket: this._prop.passTicket,
			};

			const data = {
				BaseRequest: this._baseRequest(),
			};

			const res = await this._request({
				method: "POST",
				data: data,
				params: params,
				url: this._config.API_webwxinit,
			});

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
			debug(err);
			err.tips = "微信初始化失败";
			throw err;
		}
	}

	/**
	 * 发送手机状态通知
	 * @param {string} to - 接收通知的用户ID（可选）
	 * @returns {Promise<void>} Promise 对象，表示手机状态通知操作完成
	 */
	async sendMobileNotification(to) {
		try {
			const params = {
				lang: "zh_CN",
				pass_ticket: this._prop.passTicket,
			};

			const data = {
				Code: to ? 1 : 3,
				BaseRequest: this._baseRequest(),
				FromUserName: this._user.UserName,
				ToUserName: to || this._user.UserName,
				ClientMsgId: generateClientMsgID(),
			};

			const res = await this._request({
				method: "POST",
				data: data,
				params: params,
				url: this._config.API_webwxstatusnotify,
			});

			const responseData = res.data;

			equal(responseData.BaseResponse.Ret, 0, res);
		} catch (err) {
			debug(err);
			err.tips = "手机状态通知失败";
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
				seq: seq,
				lang: "zh_CN",
				r: +new Date(),
				skey: this._prop.skey,
				pass_ticket: this._prop.passTicket,
			};

			const res = await this._request({
				method: "POST",
				params: params,
				url: this._config.API_webwxgetcontact,
			});

			const data = res.data;
			equal(data.BaseResponse.Ret, 0, res);

			return data;
		} catch (err) {
			debug(err);
			err.tips = "获取通讯录失败";
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
				type: "ex",
				lang: "zh_CN",
				r: +new Date(),
				pass_ticket: this._prop.passTicket,
			};

			const data = {
				BaseRequest: this._baseRequest(),
				Count: contacts.length,
				List: contacts,
			};

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxbatchgetcontact,
			});

			const responseData = res.data;
			equal(responseData.BaseResponse.Ret, 0, res);

			return responseData.ContactList;
		} catch (err) {
			debug(err);
			err.tips = "批量获取联系人失败";
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
				pass_ticket: this._prop.passTicket,
				fun: "new",
				lang: "zh_CN",
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

			return await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxreport,
			});
		} catch (err) {
			debug(err);
			err.tips = "状态报告失败";
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
				r: +new Date(),
				sid: this._prop.sid,
				uin: this._prop.uin,
				skey: this._prop.skey,
				deviceid: generateDeviceID(),
				synckey: this._prop.formatedSyncKey,
			};

			const res = await this._request({
				method: "GET",
				params: params,
				url: this._config.API_synccheck,
			});

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
			debug(err);
			err.tips = "同步失败";
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
				lang: "zh_CN",
				sid: this._prop.sid,
				skey: this._prop.skey,
				pass_ticket: this._prop.passTicket,
			};

			const data = {
				BaseRequest: this._baseRequest(),
				SyncKey: this._prop.syncKey,
				rr: ~new Date(),
			};

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxsync,
			});

			const responseData = res.data;

			if (responseData.BaseResponse.Ret == this._config.SYNCCHECK_RET_LOGOUT) {
				throw new AlreadyLogoutError();
			}

			equal(responseData.BaseResponse.Ret, 0, res);

			this._updateSyncKey(responseData);
			this._prop.skey = responseData.SKey || this._prop.skey;

			return responseData;
		} catch (err) {
			debug(err);
			err.tips = "获取新信息失败";
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
				lang: "zh_CN",
				skey: this._prop.skey,
			};

			const res = await this._request({
				method: "POST",
				params: params,
				url: this._config.API_webwxlogout,
			});

			return "登出成功";
		} catch (err) {
			debug(err);
			return "可能登出成功";
		}
	}

	/**
	 * 发送文本消息
	 * @param {string} msg - 要发送的消息内容
	 * @param {string} to - 目标用户的 UserName
	 * @returns {Promise<Object>} Promise 对象，表示发送消息结果的数据对象
	 * @throws {Error} 如果发送消息失败，则会抛出异常
	 */
	async sendTextMessage(msg, to) {
		try {
			const params = {
				lang: "zh_CN",
				pass_ticket: this._prop.passTicket,
			};

			const clientMsgId = generateClientMsgID();
			const data = {
				Scene: 0,
				BaseRequest: this._baseRequest(),
				Msg: {
					Type: this._config.MSGTYPE_TEXT,
					Content: msg,
					ToUserName: to,
					LocalID: clientMsgId,
					ClientMsgId: clientMsgId,
					FromUserName: this._user["UserName"],
				},
			};

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxsendmsg,
			});

			const responseData = res.data;
			equal(responseData.BaseResponse.Ret, 0, res);

			return responseData;
		} catch (err) {
			debug(err);
			err.tips = "发送文本信息失败";
			throw err;
		}
	}

	/**
	 * 发送表情消息
	 * @param {string} id - 表情消息ID，可以是 MediaId 或 EMoticonMd5
	 * @param {string} to - 目标用户的 UserName
	 * @returns {Promise<Object>} Promise 对象，表示发送消息结果的数据对象
	 * @throws {Error} 如果发送消息失败，则会抛出异常
	 */
	async sendEmoticonMessage(id, to) {
		try {
			const params = {
				fun: "sys",
				lang: "zh_CN",
				pass_ticket: this._prop.passTicket,
			};

			const clientMsgId = generateClientMsgID();
			const data = {
				BaseRequest: this._baseRequest(),
				Scene: 0,
				Msg: {
					Type: this._config.MSGTYPE_EMOTICON,
					EmojiFlag: 2,
					ToUserName: to,
					LocalID: clientMsgId,
					ClientMsgId: clientMsgId,
					FromUserName: this._user["UserName"],
				},
			};

			if (id.indexOf("@") === 0) {
				data.Msg.MediaId = id;
			} else {
				data.Msg.EMoticonMd5 = id;
			}

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxsendemoticon,
			});

			const responseData = res.data;
			equal(responseData.BaseResponse.Ret, 0, res);

			return responseData;
		} catch (err) {
			debug(err);
			err.tips = "发送表情信息失败";
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

			const clientMsgId = generateClientMsgID();

			const uploadMediaRequest = JSON.stringify({
				BaseRequest: this._baseRequest(),
				ClientMediaId: clientMsgId,
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

			// 发起上传请求
			const res = await this._request({
				method: "POST",
				params: { f: "json" },
				data: null, // (await formDataPromise).data,
				url: this._config.API_webwxuploadmedia,
				headers: (await formDataPromise).headers,
			});

			const mediaId = res.data.MediaId;

			return {
				name: name,
				size: size,
				ext: ext,
				mediatype: mediatype,
				mediaId: mediaId,
			};
		} catch (err) {
			debug(err);
			err.tips = "上传媒体文件失败";
			throw err;
		}
	}

	/**
	 * 发送图片消息
	 * @param {string} mediaId - 媒体文件的ID
	 * @param {string} to - 接收方用户名
	 * @returns {Promise<Object>} - 发送成功后返回的消息对象
	 */
	async sendPictureMessage(mediaId, to) {
		try {
			const params = {
				f: "json",
				fun: "async",
				lang: "zh_CN",
				pass_ticket: this._prop.passTicket,
			};

			const clientMsgId = generateClientMsgID();

			const data = {
				BaseRequest: this._baseRequest(),
				Scene: 0,
				Msg: {
					Type: this._config.MSGTYPE_IMAGE,
					MediaId: mediaId,
					ToUserName: to,
					LocalID: clientMsgId,
					ClientMsgId: clientMsgId,
					FromUserName: this._user.UserName,
				},
			};

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxsendmsgimg,
			});

			const responseData = res.data;
			equal(responseData.BaseResponse.Ret, 0, res);

			return responseData;
		} catch (err) {
			debug(err);
			err.tips = "发送图片失败";
			throw err;
		}
	}

	/**
	 * 发送视频消息
	 * @param {string} mediaId - 媒体文件的ID
	 * @param {string} to - 接收方用户名
	 * @returns {Promise<Object>} - 发送成功后返回的消息对象
	 */
	async sendVideoMessage(mediaId, to) {
		try {
			const params = {
				f: "json",
				fun: "async",
				lang: "zh_CN",
				pass_ticket: this._prop.passTicket,
			};

			const clientMsgId = generateClientMsgID();

			const data = {
				BaseRequest: this._baseRequest(),
				Scene: 0,
				Msg: {
					Type: this._config.MSGTYPE_VIDEO,
					MediaId: mediaId,
					ToUserName: to,
					LocalID: clientMsgId,
					ClientMsgId: clientMsgId,
					FromUserName: this._user.UserName,
				},
			};

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxsendmsgvedio,
			});

			const responseData = res.data;
			equal(responseData.BaseResponse.Ret, 0, res);

			return responseData;
		} catch (err) {
			debug(err);
			err.tips = "发送视频失败";
			throw err;
		}
	}

	/**
	 * 发送文件消息
	 * @param {string} mediaId - 媒体文件的ID
	 * @param {string} name - 文件名
	 * @param {number} size - 文件大小（字节）
	 * @param {string} ext - 文件扩展名
	 * @param {string} to - 接收方用户名
	 * @returns {Promise<Object>} - 发送成功后返回的消息对象
	 */
	async sendDocumentMessage(mediaId, name, size, ext, to) {
		try {
			const params = {
				f: "json",
				fun: "async",
				lang: "zh_CN",
				pass_ticket: this._prop.passTicket,
			};

			const clientMsgId = generateClientMsgID();

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
					ToUserName: to,
					LocalID: clientMsgId,
					ClientMsgId: clientMsgId,
					FromUserName: this._user.UserName,
				},
			};

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxsendappmsg,
			});

			const responseData = res.data;
			equal(responseData.BaseResponse.Ret, 0, res);

			return responseData;
		} catch (err) {
			debug(err);
			err.tips = "发送文件失败";
			throw err;
		}
	}

	/**
	 * 转发消息
	 * @param {Object} msg - 需要转发的消息对象
	 * @param {string} to - 接收方用户名
	 * @returns {Promise<Object>} - 转发成功后返回的消息对象
	 */
	async forwardMessage(msg, to) {
		try {
			const params = {
				f: "json",
				fun: "async",
				lang: "zh_CN",
				pass_ticket: this._prop.passTicket,
			};

			const clientMsgId = generateClientMsgID();
			let data = {
				BaseRequest: this._baseRequest(),
				Scene: 2,
				Msg: {
					Type: msg.MsgType,
					MediaId: "",
					Content: msg.Content.replace(/&lt;/g, "<").replace(/&gt;/g, ">"),
					ToUserName: to,
					LocalID: clientMsgId,
					ClientMsgId: clientMsgId,
					FromUserName: this._user.UserName,
				},
			};

			let url, pm;
			switch (msg.MsgType) {
				case this._config.MSGTYPE_TEXT:
					url = this._config.API_webwxsendmsg;
					if (msg.SubMsgType === this._config.MSGTYPE_LOCATION) {
						data.Msg.Type = this._config.MSGTYPE_LOCATION;
						data.Msg.Content = msg.OriContent.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
					}
					break;
				case this._config.MSGTYPE_IMAGE:
					url = this._config.API_webwxsendmsgimg;
					break;
				case this._config.MSGTYPE_EMOTICON:
					params.fun = "sys";
					url = this._config.API_webwxsendemoticon;
					data.Msg.EMoticonMd5 = msg.Content.replace(/^[\s\S]*?md5\s?=\s?"(.*?)"[\s\S]*?$/, "$1");
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
					data.Msg.Type = msg.AppMsgType;
					data.Msg.Content = data.Msg.Content.replace(
						/^[\s\S]*?(<appmsg[\s\S]*?<attachid>)[\s\S]*?(<\/attachid>[\s\S]*?<\/appmsg>)[\s\S]*?$/,
						`$1${msg.MediaId}$2`
					);
					break;
				default:
					throw new Error("该消息类型不能直接转发");
			}

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: url,
			});

			const responseData = res.data;
			equal(responseData.BaseResponse.Ret, 0, res);

			return responseData;
		} catch (err) {
			debug(err);
			err.tips = "转发消息失败";
			throw err;
		}
	}

	/**
	 * 撤回消息
	 * @param {string} msgId - 待撤回的消息ID
	 * @param {string} toUserName - 消息所在的聊天对象的用户名
	 * @returns {Promise<Object>} - 包含操作结果的对象
	 */
	async revokeMessage(msgId, toUserName) {
		try {
			const data = {
				BaseRequest: this._baseRequest(),
				SvrMsgId: msgId,
				ToUserName: toUserName,
				ClientMsgId: generateClientMsgID(),
			};

			const res = await this._request({
				method: "POST",
				url: this._config.API_webwxrevokemsg,
				data: data,
			});

			const result = res.data;
			if (result.BaseResponse.Ret !== 0) {
				throw new Error(`撤回消息失败: ${JSON.stringify(res)}`);
			}
			return result;
		} catch (err) {
			debug(err);
			err.tips = "撤回消息失败";
			throw err;
		}
	}

	/**
	 * 获取消息图片或表情
	 * @param {string} msgId - 消息ID
	 * @returns {Promise<Object>} - 包含图片或表情数据和类型的对象
	 */
	async getMessageImg(msgId) {
		try {
			const params = {
				type: "big",
				MsgID: msgId,
				skey: this._prop.skey,
			};

			const res = await this._request({
				method: "GET",
				params: params,
				responseType: "arraybuffer",
				url: this._config.API_webwxgetmsgimg,
			});

			return {
				data: res.data,
				type: res.headers["content-type"],
			};
		} catch (err) {
			debug(err);
			err.tips = "获取图片或表情失败";
			throw err;
		}
	}

	/**
	 * 获取视频
	 * @param {string} msgId - 消息ID
	 * @returns {Promise<Object>} - 包含视频数据和类型的对象
	 */
	async getMessageVideo(msgId) {
		try {
			const params = {
				MsgID: msgId,
				skey: this._prop.skey,
			};

			const res = await this._request({
				method: "GET",
				headers: {
					Range: "bytes=0-",
				},
				params: params,
				responseType: "arraybuffer",
				url: this._config.API_webwxgetvideo,
			});

			return {
				data: res.data,
				type: res.headers["content-type"],
			};
		} catch (err) {
			debug(err);
			err.tips = "获取视频失败";
			throw err;
		}
	}

	/**
	 * 获取声音
	 * @param {string} msgId - 消息ID
	 * @returns {Promise<Object>} - 包含声音数据和类型的对象
	 */
	async getMessageVoice(msgId) {
		try {
			const params = {
				MsgID: msgId,
				skey: this._prop.skey,
			};

			const res = await this._request({
				method: "GET",
				params: params,
				responseType: "arraybuffer",
				url: this._config.API_webwxgetvoice,
			});

			return {
				data: res.data,
				type: res.headers["content-type"],
			};
		} catch (err) {
			debug(err);
			err.tips = "获取声音失败";
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
			const url = this._config.origin + HeadImgUrl;

			const res = await this._request({
				method: "GET",
				url: url,
				responseType: "arraybuffer",
			});

			return {
				data: res.data,
				type: res.headers["content-type"],
			};
		} catch (err) {
			debug(err);
			err.tips = "获取头像失败";
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
	async getDocument(FromUserName, MediaId, FileName) {
		try {
			const params = {
				sender: FromUserName,
				mediaid: MediaId,
				filename: FileName,
				fromuser: this._user.UserName,
				pass_ticket: this._prop.passTicket,
				webwx_data_ticket: this._prop.webwxDataTicket,
			};

			const res = await this._request({
				method: "GET",
				params: params,
				responseType: "arraybuffer",
				url: this._config.API_webwxdownloadmedia,
			});

			return {
				data: res.data,
				type: res.headers["content-type"],
			};
		} catch (err) {
			debug(err);
			err.tips = "获取文件失败";
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
				lang: "zh_CN",
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

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxverifyuser,
			});

			const result = res.data;
			if (result.BaseResponse.Ret !== 0) {
				throw new Error(`通过好友请求失败: ${JSON.stringify(res)}`);
			}
			return result;
		} catch (err) {
			debug(err);
			err.tips = "通过好友请求失败";
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
				lang: "zh_CN",
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

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxverifyuser,
			});

			const result = res.data;
			if (result.BaseResponse.Ret !== 0) {
				throw new Error(`添加好友失败: ${JSON.stringify(res)}`);
			}

			return result;
		} catch (err) {
			debug(err);
			err.tips = "添加好友失败";
			throw err;
		}
	}

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
	async createChatroom(Topic, MemberList) {
		try {
			const params = {
				lang: "zh_CN",
				r: ~new Date(),
				pass_ticket: this._prop.passTicket,
			};

			const data = {
				BaseRequest: this._baseRequest(),
				MemberCount: MemberList.length,
				MemberList: MemberList,
				Topic: Topic,
			};

			const res = await this._request({
				method: "POST",
				url: this._config.API_webwxcreatechatroom,
				params: params,
				data: data,
			});

			const result = res.data;
			if (result.BaseResponse.Ret !== 0) {
				throw new Error(`创建群失败: ${JSON.stringify(res)}`);
			}

			return result;
		} catch (err) {
			debug(err);
			err.tips = "创建群失败";
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

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxupdatechatroom,
			});

			const result = res.data;
			if (result.BaseResponse.Ret !== 0) {
				throw new Error(`邀请或踢出群成员失败: ${JSON.stringify(res)}`);
			}

			return result;
		} catch (err) {
			debug(err);
			err.tips = "邀请或踢出群成员失败";
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

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxupdatechatroom,
			});

			const result = res.data;
			if (result.BaseResponse.Ret !== 0) {
				throw new Error(`更新群名失败: ${JSON.stringify(res)}`);
			}
		} catch (err) {
			debug(err);
			err.tips = "更新群名失败";
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
				lang: "zh_CN",
				pass_ticket: this._prop.passTicket,
			};

			const data = {
				BaseRequest: this._baseRequest(),
				CmdId: 2,
				RemarkName: RemarkName,
				UserName: UserName,
			};

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxoplog,
			});

			const result = res.data;
			if (result.BaseResponse.Ret !== 0) {
				throw new Error(`设置用户标签失败: ${JSON.stringify(res)}`);
			}

			return result;
		} catch (err) {
			debug(err);
			err.tips = "设置用户标签失败";
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

			const res = await this._request({
				method: "POST",
				params: params,
				data: data,
				url: this._config.API_webwxoplog,
			});

			const result = res.data;
			if (result.BaseResponse.Ret !== 0) {
				throw new Error(`置顶或取消置顶失败: ${JSON.stringify(res)}`);
			}

			return result;
		} catch (err) {
			debug(err);
			err.tips = "置顶或取消置顶失败";
			throw err;
		}
	}
}
