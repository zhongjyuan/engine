import { convertEmoji } from "./util";

/**
 * 联系人对象
 */
const contactProto = {
	/**
	 * 初始化联系人对象
	 * @param {Object} botInstance - 实例对象(weixin对象)
	 * @returns {Object} - 初始化后的联系人对象
	 */
	init: function (botInstance) {
		this._config = botInstance._config;

		this.OriginalNickName = this.OriginalNickName = this.NickName;
		this.OriginalRemarkName = this.OriginalRemarkName = this.RemarkName;
		this.OriginalDisplayName = this.OriginalDisplayName = this.DisplayName;

		this.NickName = convertEmoji(this.NickName);
		this.RemarkName = convertEmoji(this.RemarkName);
		this.DisplayName = convertEmoji(this.DisplayName);

		this.isSelf = this.UserName === botInstance._user.UserName;

		return this;
	},

	/**
	 * 获取显示名称
	 * @returns {string} - 联系人的显示名称
	 */
	getDisplayName: function () {
		if (this.isRoomContact(this)) {
			if (this.MemberCount >= 2) {
				return (
					"[群] " +
					(this.RemarkName ||
						this.DisplayName ||
						this.NickName ||
						`${this.getDisplayName(this.MemberList[0])}、${this.getDisplayName(this.MemberList[1])}`)
				);
			} else {
				return "[群] " + (this.RemarkName || this.DisplayName || this.NickName || `${this.getDisplayName(this.MemberList[0])}`);
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
	canSearch: function (keyword) {
		if (!keyword) return false;
		keyword = keyword.toUpperCase();

		let isSatisfy = (key) => (key || "").toUpperCase().indexOf(keyword) >= 0;
		return (
			isSatisfy(this.RemarkName) ||
			isSatisfy(this.RemarkPYQuanPin) ||
			isSatisfy(this.NickName) ||
			isSatisfy(this.PYQuanPin) ||
			isSatisfy(this.Alias) ||
			isSatisfy(this.KeyWord)
		);
	},

	/**
	 * 是否为群聊联系人
	 * @returns
	 */
	isRoomContact: function () {
		return this.UserName ? /^@@|@chatroom$/.test(this.UserName) : false;
	},

	/**
	 * 是否为特殊用户
	 * @returns
	 */
	isSpecialContact: function () {
		return this._config.SPECIALUSERS.indexOf(this.UserName) >= 0;
	},

	/**
	 * 是否为屏蔽联系人
	 * @returns
	 */
	isShieldUser: function () {
		return this._config.SHIELDUSERS.indexOf(this.UserName) >= 0;
	},

	/**
	 * 是否为公众号联系人
	 * @returns
	 */
	isMPContact() {
		return this.VerifyFlag & this._config.MM_USERATTRVERIFYFALG_BIZ_BRAND;
	},
};

/**
 * 联系人工厂函数
 * @param {*} botInstance 实例对象(WeChatBot对象)
 * @returns
 */
export default function (botInstance) {
	return {
		/**
		 * 扩展联系人对象
		 * @param {Object} contactInstance - 要扩展的联系人对象
		 * @returns {Object} - 扩展并初始化后的联系人对象
		 */
		extend: function (contactInstance) {
			contactInstance = Object.setPrototypeOf(contactInstance, contactProto);
			return contactInstance.init(botInstance);
		},

		/**
		 * 根据用户名获取用户
		 * @param {string} userName - 用户名
		 * @returns {Object|null} - 用户对象，如果未找到则返回 null
		 */
		getUserByUserName: function (userName) {
			if (!botInstance._contacts) return null; // 如果成员列表为空，则直接返回 null

			return botInstance._contacts[userName] || null;
		},

		/**
		 * 根据用户名从成员列表中获取用户信息
		 * @param {Array} contacts - 成员列表
		 * @param {string} username - 用户名
		 * @returns {Object|null} - 匹配到的用户信息，如果未找到则返回 null
		 * @example
		 * const contacts = [
		 *   { username: 'user1', nickname: '小明' },
		 *   { username: 'user2', nickname: '小红' },
		 *   { username: 'user3', nickname: '小刚' },
		 * ];
		 * const user = getUserByUsername(contacts, 'user2'); // { username: 'user2', nickname: '小红' }
		 */
		getUserByUserName: function (contacts, userName) {
			if (!contacts) return null; // 如果成员列表为空，则直接返回 null

			// 使用数组的 find 方法查找匹配到的用户信息
			return contacts.find((contact) => contact.username === userName);
		},

		/**
		 * 根据关键词搜索用户
		 * @param {string} keyword - 搜索关键词
		 * @returns {Array} - 包含符合搜索条件的用户对象的数组
		 * @example
		 * const factory = ContactFactory(botInstance);
		 * const users = factory.searchUser('John');
		 */
		searchUser: function (keyword) {
			let users = [];

			for (let key in botInstance._contacts) {
				if (botInstance._contacts[key].canSearch(keyword)) {
					users.push(botInstance._contacts[key]);
				}
			}

			return users;
		},

		/**
		 * 根据关键词搜索用户
		 * @param {string} keyword - 搜索关键词
		 * @returns {Array} - 包含符合搜索条件的用户对象的数组
		 * @example
		 * const factory = ContactFactory(botInstance);
		 * const users = factory.searchUser('John');
		 */
		searchUser: function (contacts, keyword) {
			let users = [];

			for (let key in contacts) {
				if (contacts[key].canSearch(keyword)) {
					users.push(contacts[key]);
				}
			}

			return users;
		},

		/**
		 * 判断联系人是否为自己
		 * @param {Object} contact - 联系人对象
		 * @returns {boolean} - 如果联系人是自己则返回 true，否则返回 false
		 * @example
		 * const factory = ContactFactory(botInstance);
		 * const contact = { UserName: '123', isSelf: false };
		 * const isSelf = factory.isSelf(contact); // false
		 */
		isSelf: function (contact) {
			return contact.isSelf || contact.UserName === botInstance._user.UserName;
		},

		/**
		 * 获取联系人的显示名称
		 * @param {Object} contact - 联系人信息
		 * @returns {string} - 联系人的显示名称
		 * @example
		 * const roomContact = {
		 *   RemarkName: '备注名',
		 *   DisplayName: '显示名称',
		 *   NickName: '昵称',
		 *   MemberCount: 2,
		 *   MemberList: [
		 *     { DisplayName: '成员1' },
		 *     { DisplayName: '成员2' }
		 *   ]
		 * };
		 * const userContact = {
		 *   DisplayName: '显示名称',
		 *   RemarkName: '备注名',
		 *   NickName: '昵称',
		 *   UserName: '用户名'
		 * };
		 * const displayName = getDisplayName(roomContact); // "[群] 显示名称"
		 * const displayName2 = getDisplayName(userContact); // "显示名称"
		 */
		getDisplayName: function (contact) {
			if (isRoomContact(contact)) {
				if (contact.MemberCount >= 2) {
					return (
						"[群] " +
						(contact.RemarkName ||
							contact.DisplayName ||
							contact.NickName ||
							`${getDisplayName(contact.MemberList[0])}、${getDisplayName(contact.MemberList[1])}`)
					);
				} else {
					return "[群] " + (contact.RemarkName || contact.DisplayName || contact.NickName || `${getDisplayName(contact.MemberList[0])}`);
				}
			} else {
				return contact.DisplayName || contact.RemarkName || contact.NickName || contact.UserName;
			}
		},

		/**
		 * 判断联系人是否为群聊联系人
		 * @param {Object} contact - 联系人信息
		 * @returns {boolean} - 如果联系人是群聊联系人则返回 true，否则返回 false
		 * @example
		 * const roomContact = { UserName: '@@1234567890@chatroom' };
		 * const userContact = { UserName: 'user1' };
		 * const isRoom = isRoomContact(roomContact); // true
		 * const isRoom2 = isRoomContact(userContact); // false
		 */
		isRoomContact: function (contact) {
			return contact.UserName ? /^@@|@chatroom$/.test(contact.UserName) : false;
		},

		/**
		 * 判断联系人是否为特殊用户
		 * @param {Object} contact - 联系人信息
		 * @returns {boolean} - 如果联系人是特殊用户则返回 true，否则返回 false
		 * @example
		 * const specialContact = { UserName: 'specialUser1' };
		 * const normalContact = { UserName: 'user1' };
		 * const isSpecial = isSpContact(specialContact); // true
		 * const isSpecial2 = isSpContact(normalContact); // false
		 */
		isSpContact: function (contact) {
			return botInstance._config.SPECIALUSERS.indexOf(contact.UserName) >= 0;
		},

		/**
		 * 判断联系人是否为公众号联系人
		 * @param {Object} contact - 联系人信息
		 * @returns {boolean} - 如果联系人是公众号联系人则返回 true，否则返回 false
		 * @example
		 * const publicContact = { VerifyFlag: 8 };
		 * const normalContact = { VerifyFlag: 0 };
		 * const isPublic = isPublicContact(publicContact); // true
		 * const isPublic2 = isPublicContact(normalContact); // false
		 */
		isPublicContact: function (contact) {
			return contact.VerifyFlag & botInstance._config.MM_USERATTRVERIFYFALG_BIZ_BRAND;
		},
	};
}
