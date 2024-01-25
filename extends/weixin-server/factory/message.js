"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = MessageFactory;

var _global = require("../utils/global");

/* Message Object Example
{
    "FromUserName": "",
    "ToUserName": "",
    "Content": "",
    "StatusNotifyUserName": "",
    "ImgWidth": 0,
    "PlayLength": 0,
    "RecommendInfo": {},
    "StatusNotifyCode": 4,
    "NewMsgId": "",
    "Status": 3,
    "VoiceLength": 0,
    "ForwardFlag": 0,
    "AppMsgType": 0,
    "Ticket": "",
    "AppInfo": {...},
    "Url": "",
    "ImgStatus": 1,
    "MsgType": 1,
    "ImgHeight": 0,
    "MediaId": "",
    "MsgId": "",
    "FileName": "",
    "HasProductId": 0,
    "FileSize": "",
    "CreateTime": 0,
    "SubMsgType": 0
}
*/

var messageProto = {
	/**
  * 初始化消息对象
  * @param {Object} instance - 实例对象
  * @returns {Object} - 初始化后的消息对象
  */
	init: function init(instance) {
		var _this = this;

		this.MsgType = +this.MsgType;
		this.isSentBySelf = this.FromUserName === instance.user.UserName || this.FromUserName === "";

		this.OriginalContent = this.Content;
		if (this.FromUserName.indexOf("@@") === 0) {
			this.Content = this.Content.replace(/^@.*?(?=:)/, function (match) {
				var user = instance.contacts[_this.FromUserName].MemberList.find(function (member) {
					return member.UserName === match;
				});
				return user ? instance.Contact.getDisplayName(user) : match;
			});
		}

		this.Content = this.Content.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/<br\/>/g, "\n");
		this.Content = (0, _global.convertEmoji)(this.Content);

		return this;
	},

	/**
  * 判断消息是否由指定联系人发送
  * @param {Object} contact - 联系人对象
  * @returns {boolean} - 如果消息是由指定联系人发送则返回 true，否则返回 false
  * @example
  * const message = { FromUserName: '123', isSentBySelf: false };
  * const contact = { UserName: '123' };
  * const isSentBy = message.isSendBy(contact); // true
  */
	isSentBy: function isSentBy(contact) {
		return this.FromUserName === contact.UserName;
	},

	/**
  * 获取对方的用户名
  * @returns {string} - 对方的用户名
  * @example
  * const message = { FromUserName: '123', ToUserName: '456' };
  * const peerUserName = message.getPeerUserName(); // '456'
  */
	getPeerUserName: function getPeerUserName() {
		return this.isSentBySelf ? this.ToUserName : this.FromUserName;
	},

	/**
  * 获取消息的显示时间
  * @returns {string} - 消息的显示时间，格式为 "时:分"
  * @example
  * const message = { CreateTime: 1612345678 };
  * const displayTime = message.getDisplayTime(); // '12:34'
  */
	getDisplayTime: function getDisplayTime() {
		var time = new Date(1000 * this.CreateTime);
		return time.getHours() + ":" + (0, _global.formatNumber)(time.getMinutes(), 2);
	}
};

/**
 * 消息工厂函数，用于创建和扩展消息对象
 * @param {Object} instance - 实例对象
 * @returns {Object} - 包含 extend 方法的对象
 */
function MessageFactory(instance) {
	return {
		/**
   * 扩展消息对象
   * @param {Object} messageObj - 消息对象
   * @returns {Object} - 初始化后的消息对象
   * @example
   * const instance = {/* 实例对象 *\/};
   * const messageObj = {/* 消息对象 *\/};
   *
   * const messageFactory = MessageFactory(instance);
   *
   * const message = messageFactory.extend(messageObj);
   */
		extend: function extend(messageObj) {
			messageObj = Object.setPrototypeOf(messageObj, messageProto);
			return messageObj.init(instance);
		}
	};
}
//# sourceMappingURL=message.js.map