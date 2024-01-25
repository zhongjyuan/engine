import { getConfig } from "../config";
import { convertEmoji } from "../utils/global";

const Config = getConfig();

/* Contact Object Example
{
  "Uin": 0,
  "UserName": "",
  "NickName": "",
  "HeadImgUrl": "",
  "ContactFlag": 3,
  "MemberCount": 0,
  "MemberList": [],
  "RemarkName": "",
  "HideInputBarFlag": 0,
  "Sex": 0,
  "Signature": "",
  "VerifyFlag": 8,
  "OwnerUin": 0,
  "PYInitial": "",
  "PYQuanPin": "",
  "RemarkPYInitial": "",
  "RemarkPYQuanPin": "",
  "StarFriend": 0,
  "AppAccountFlag": 0,
  "Statues": 0,
  "AttrStatus": 0,
  "Province": "",
  "City": "",
  "Alias": "Urinxs",
  "SnsFlag": 0,
  "UniFriend": 0,
  "DisplayName": "",
  "ChatRoomId": 0,
  "KeyWord": "gh_",
  "EncryChatRoomId": ""
}
*/

/**
 * 根据用户名从成员列表中获取用户信息
 * @param {Array} memberList - 成员列表
 * @param {string} username - 用户名
 * @returns {Object|null} - 匹配到的用户信息，如果未找到则返回 null
 * @example
 * const memberList = [
 *   { username: 'user1', nickname: '小明' },
 *   { username: 'user2', nickname: '小红' },
 *   { username: 'user3', nickname: '小刚' },
 * ];
 * const user = getUserByUsername(memberList, 'user2'); // { username: 'user2', nickname: '小红' }
 */
export function getUserByUsername(memberList, username) {
	if (!memberList.length) return null; // 如果成员列表为空，则直接返回 null

	// 使用数组的 find 方法查找匹配到的用户信息
	return memberList.find((contact) => contact.username === username);
}

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
export function getDisplayName(contact) {
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
}

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
export function isRoomContact(contact) {
	return contact.UserName ? /^@@|@chatroom$/.test(contact.UserName) : false;
}

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
export function isSpContact(contact) {
	return Config.SPECIALUSERS.indexOf(contact.UserName) >= 0;
}

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
export function isPublicContact(contact) {
	return contact.VerifyFlag & Config.MM_USERATTRVERIFYFALG_BIZ_BRAND;
}

const contactProto = {
	/**
	 * 初始化联系人对象
	 * @param {Object} instance - 实例对象
	 * @returns {Object} - 初始化后的联系人对象
	 */
	init: function (instance) {
		// 纠正错误以后保持兼容
		this.OriginalNickName = this.OriginalNickName = this.NickName;
		this.OriginalRemarkName = this.OriginalRemarkName = this.RemarkName;
		this.OriginalDisplayName = this.OriginalDisplayName = this.DisplayName;
		this.NickName = convertEmoji(this.NickName);
		this.RemarkName = convertEmoji(this.RemarkName);
		this.DisplayName = convertEmoji(this.DisplayName);
		this.isSelf = this.UserName === instance.user.UserName;

		return this;
	},

	/**
	 * 获取显示名称
	 * @returns {string} - 联系人的显示名称
	 */
	getDisplayName: function () {
		return getDisplayName(this);
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
};

export default function ContactFactory(instance) {
	return {
		/**
		 * 扩展联系人对象
		 * @param {Object} contactObj - 要扩展的联系人对象
		 * @returns {Object} - 扩展并初始化后的联系人对象
		 */
		extend: function (contactObj) {
			contactObj = Object.setPrototypeOf(contactObj, contactProto);
			return contactObj.init(instance);
		},

		/**
		 * 根据用户名获取用户
		 * @param {string} UserName - 用户名
		 * @returns {Object|null} - 用户对象，如果未找到则返回 null
		 */
		getUserByUserName: function (UserName) {
			return instance.contacts[UserName] || null;
		},

		/**
		 * 根据关键词搜索用户
		 * @param {string} keyword - 搜索关键词
		 * @returns {Array} - 包含符合搜索条件的用户对象的数组
		 * @example
		 * const factory = ContactFactory(instance);
		 * const users = factory.getSearchUser('John');
		 */
		getSearchUser: function (keyword) {
			let users = [];
			for (let key in instance.contacts) {
				if (instance.contacts[key].canSearch(keyword)) {
					users.push(instance.contacts[key]);
				}
			}
			return users;
		},

		/**
		 * 判断联系人是否为自己
		 * @param {Object} contact - 联系人对象
		 * @returns {boolean} - 如果联系人是自己则返回 true，否则返回 false
		 * @example
		 * const factory = ContactFactory(instance);
		 * const contact = { UserName: '123', isSelf: false };
		 * const isSelf = factory.isSelf(contact); // false
		 */
		isSelf: function (contact) {
			return contact.isSelf || contact.UserName === instance.user.UserName;
		},

		getDisplayName,
		isRoomContact,
		isPublicContact,
		isSpContact,
	};
}
