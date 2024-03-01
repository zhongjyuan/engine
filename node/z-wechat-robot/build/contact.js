"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (botInstance) {
	var _ref;

	return _ref = {
		/**
   * 扩展联系人对象
   * @param {Object} contactInstance - 要扩展的联系人对象
   * @returns {Object} - 扩展并初始化后的联系人对象
   */
		extend: function extend(contactInstance) {
			contactInstance = Object.setPrototypeOf(contactInstance, contactProto);
			return contactInstance.init(botInstance);
		},

		/**
   * 根据用户名获取用户
   * @param {string} userName - 用户名
   * @returns {Object|null} - 用户对象，如果未找到则返回 null
   */
		getUserByUserName: function getUserByUserName(userName) {
			if (!botInstance._contacts) return null; // 如果成员列表为空，则直接返回 null

			return botInstance._contacts[userName] || null;
		}

	}, _defineProperty(_ref, "getUserByUserName", function getUserByUserName(contacts, userName) {
		if (!contacts) return null; // 如果成员列表为空，则直接返回 null

		// 使用数组的 find 方法查找匹配到的用户信息
		return contacts.find(function (contact) {
			return contact.username === userName;
		});
	}), _defineProperty(_ref, "searchUser", function searchUser(keyword) {
		var users = [];

		for (var key in botInstance._contacts) {
			if (botInstance._contacts[key].canSearch(keyword)) {
				users.push(botInstance._contacts[key]);
			}
		}

		return users;
	}), _defineProperty(_ref, "searchUser", function searchUser(contacts, keyword) {
		var users = [];

		for (var key in contacts) {
			if (contacts[key].canSearch(keyword)) {
				users.push(contacts[key]);
			}
		}

		return users;
	}), _defineProperty(_ref, "isSelf", function isSelf(contact) {
		return contact.isSelf || contact.UserName === botInstance._user.UserName;
	}), _defineProperty(_ref, "getDisplayName", function (_getDisplayName) {
		function getDisplayName(_x) {
			return _getDisplayName.apply(this, arguments);
		}

		getDisplayName.toString = function () {
			return _getDisplayName.toString();
		};

		return getDisplayName;
	}(function (contact) {
		if (isRoomContact(contact)) {
			if (contact.MemberCount >= 2) {
				return "[群] " + (contact.RemarkName || contact.DisplayName || contact.NickName || getDisplayName(contact.MemberList[0]) + "\u3001" + getDisplayName(contact.MemberList[1]));
			} else {
				return "[群] " + (contact.RemarkName || contact.DisplayName || contact.NickName || "" + getDisplayName(contact.MemberList[0]));
			}
		} else {
			return contact.DisplayName || contact.RemarkName || contact.NickName || contact.UserName;
		}
	})), _defineProperty(_ref, "isRoomContact", function isRoomContact(contact) {
		return contact.UserName ? /^@@|@chatroom$/.test(contact.UserName) : false;
	}), _defineProperty(_ref, "isSpContact", function isSpContact(contact) {
		return botInstance._config.SPECIALUSERS.indexOf(contact.UserName) >= 0;
	}), _defineProperty(_ref, "isPublicContact", function isPublicContact(contact) {
		return contact.VerifyFlag & botInstance._config.MM_USERATTRVERIFYFALG_BIZ_BRAND;
	}), _ref;
};

var _util = require("./util");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * 联系人对象
 */
var contactProto = {
	/**
  * 初始化联系人对象
  * @param {Object} botInstance - 实例对象(weixin对象)
  * @returns {Object} - 初始化后的联系人对象
  */
	init: function init(botInstance) {
		this._config = botInstance._config;

		this.OriginalNickName = this.OriginalNickName = this.NickName;
		this.OriginalRemarkName = this.OriginalRemarkName = this.RemarkName;
		this.OriginalDisplayName = this.OriginalDisplayName = this.DisplayName;

		this.NickName = (0, _util.convertEmoji)(this.NickName);
		this.RemarkName = (0, _util.convertEmoji)(this.RemarkName);
		this.DisplayName = (0, _util.convertEmoji)(this.DisplayName);

		this.isSelf = this.UserName === botInstance._user.UserName;

		return this;
	},

	/**
  * 获取显示名称
  * @returns {string} - 联系人的显示名称
  */
	getDisplayName: function getDisplayName() {
		if (this.isRoomContact(this)) {
			if (this.MemberCount >= 2) {
				return "[群] " + (this.RemarkName || this.DisplayName || this.NickName || this.getDisplayName(this.MemberList[0]) + "\u3001" + this.getDisplayName(this.MemberList[1]));
			} else {
				return "[群] " + (this.RemarkName || this.DisplayName || this.NickName || "" + this.getDisplayName(this.MemberList[0]));
			}
		} else {
			return this.DisplayName || this.RemarkName || this.NickName || this.UserName;
		}
	},

	/**
  * 判断联系人是否可以被搜索
  * @param {string} keyword - 搜索关键词
  * @returns {boolean} - 如果联系人可以被搜索则返回 true，否则返回 false
  * @example
  * const contact = { RemarkName: 'John', NickName: 'Doe' };
  * const canSearch = contact.canSearch('John'); // true
  * const canSearch2 = contact.canSearch('Jane'); // false
  */
	canSearch: function canSearch(keyword) {
		if (!keyword) return false;
		keyword = keyword.toUpperCase();

		var isSatisfy = function isSatisfy(key) {
			return (key || "").toUpperCase().indexOf(keyword) >= 0;
		};
		return isSatisfy(this.RemarkName) || isSatisfy(this.RemarkPYQuanPin) || isSatisfy(this.NickName) || isSatisfy(this.PYQuanPin) || isSatisfy(this.Alias) || isSatisfy(this.KeyWord);
	},

	/**
  * 是否为群聊联系人
  * @returns
  */
	isRoomContact: function isRoomContact() {
		return this.UserName ? /^@@|@chatroom$/.test(this.UserName) : false;
	},

	/**
  * 是否为特殊用户
  * @returns
  */
	isSpecialContact: function isSpecialContact() {
		return this._config.SPECIALUSERS.indexOf(this.UserName) >= 0;
	},

	/**
  * 是否为屏蔽联系人
  * @returns
  */
	isShieldUser: function isShieldUser() {
		return this._config.SHIELDUSERS.indexOf(this.UserName) >= 0;
	},

	/**
  * 是否为公众号联系人
  * @returns
  */
	isMPContact: function isMPContact() {
		return this.VerifyFlag & this._config.MM_USERATTRVERIFYFALG_BIZ_BRAND;
	}
};

/**
 * 联系人工厂函数
 * @param {*} botInstance 实例对象(WeChatBot对象)
 * @returns
 */
//# sourceMappingURL=contact.js.map