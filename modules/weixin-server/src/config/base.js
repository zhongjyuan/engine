export default {
	/**语言设置 */
	LANG: "zh-CN",
	/**资源路径 */
	RES_PATH: "/zh_CN/htmledition/v2/",
	/**情正则表达式 */
	EMOTICON_REG: 'img\\sclass="(qq)?emoji (qq)?emoji([\\da-f]*?)"\\s(text="[^<>(\\s]*")?\\s?src="[^<>(\\s]*"\\s*',

	/**操作日志命令 ID */
	oplogCmdId: {
		/**置顶联系人 */
		TOPCONTACT: 3,
		/**修改备注名称 */
		MODREMARKNAME: 2,
	},

	/**微信状态常量 */
	STATE: {
		/**初始状态 */
		init: "init",
		/**UUID 状态 */
		uuid: "uuid",
		/**登录状态 */
		login: "login",
		/**登出状态 */
		logout: "logout",
	},

	/**表情符号标记，表示GIF格式 */
	EMOJI_FLAG_GIF: 2,

	/**超时同步检查 */
	TIMEOUT_SYNC_CHECK: 0,

	/**微信同步检查返回值：成功 */
	SYNCCHECK_RET_SUCCESS: 0,
	/**微信同步检查返回值：已退出 */
	SYNCCHECK_RET_LOGOUT: 1101,
	/**微信同步检查 Selector 类型：普通消息 */
	SYNCCHECK_SELECTOR_NORMAL: 0,
	/**微信同步检查 Selector 类型：新消息 */
	SYNCCHECK_SELECTOR_MSG: 2,
	/**微信同步检查 Selector 类型：手机端打开微信 */
	SYNCCHECK_SELECTOR_MOBILEOPEN: 7,

	/**新闻助手，提供新闻资讯服务 */
	SP_CONTACT_NEWSAPP: "newsapp",
	/**文件助手，用于发送和接收文件 */
	SP_CONTACT_FILE_HELPER: "filehelper",
	/**推荐助手，用于发送好友推荐消息 */
	SP_CONTACT_RECOMMEND_HELPER: "fmessage",

	/**普通联系人 */
	CONTACTFLAG_CONTACT: 1,
	/**可以聊天的联系人 */
	CONTACTFLAG_CHATCONTACT: 2,
	/**群聊 */
	CONTACTFLAG_CHATROOMCONTACT: 4,
	/**黑名单联系人 */
	CONTACTFLAG_BLACKLISTCONTACT: 8,
	/**公众号或服务号 */
	CONTACTFLAG_DOMAINCONTACT: 16,
	/**隐身联系人 */
	CONTACTFLAG_HIDECONTACT: 32,
	/**星标联系人 */
	CONTACTFLAG_FAVOURCONTACT: 64,
	/**第三方应用的联系人 */
	CONTACTFLAG_3RDAPPCONTACT: 128,
	/**SNS黑名单联系人 */
	CONTACTFLAG_SNSBLACKLISTCONTACT: 256,
	/**被对方删除后仍然收到通知的联系人 */
	CONTACTFLAG_NOTIFYCLOSECONTACT: 512,
	/**置顶联系人 */
	CONTACTFLAG_TOPCONTACT: 2048,

	/**企业认证 */
	MM_USERATTRVERIFYFALG_BIZ: 1,
	/**已通过名人认证 */
	MM_USERATTRVERIFYFALG_FAMOUS: 2,
	/**已通过政府及媒体等大V认证 */
	MM_USERATTRVERIFYFALG_BIZ_BIG: 4,
	/**已通过品牌资质认证 */
	MM_USERATTRVERIFYFALG_BIZ_BRAND: 8,
	/**已通过微信认证 */
	MM_USERATTRVERIFYFALG_BIZ_VERIFIED: 16,

	/**微信消息通知关闭 */
	MM_NOTIFY_CLOSE: 0,
	/**微信消息通知打开 */
	MM_NOTIFY_OPEN: 1,

	/**微信声音关闭 */
	MM_SOUND_CLOSE: 0,
	/**微信声音打开 */
	MM_SOUND_OPEN: 1,

	/**微信表情类型：网络表情 */
	MM_EMOTICON_WEB: "_web",

	/**微信发送文件状态：排队中 */
	MM_SEND_FILE_STATUS_QUEUED: 0,
	/**微信发送文件状态：发送中 */
	MM_SEND_FILE_STATUS_SENDING: 1,
	/**微信发送文件状态：发送成功 */
	MM_SEND_FILE_STATUS_SUCCESS: 2,
	/**微信发送文件状态：发送失败 */
	MM_SEND_FILE_STATUS_FAIL: 3,
	/**微信发送文件状态：取消发送 */
	MM_SEND_FILE_STATUS_CANCEL: 4,

	/**文本消息 */
	MM_DATA_TEXT: 1,
	/**富文本消息 */
	MM_DATA_HTML: 2,
	/**图片消息 */
	MM_DATA_IMG: 3,
	/**私人文本消息 */
	MM_DATA_PRIVATEMSG_TEXT: 11,
	/**私人富文本消息 */
	MM_DATA_PRIVATEMSG_HTML: 12,
	/**私人图片消息 */
	MM_DATA_PRIVATEMSG_IMG: 13,
	/**语音消息 */
	MM_DATA_VOICEMSG: 34,
	/**推送邮件消息 */
	MM_DATA_PUSHMAIL: 35,
	/**Qmsg消息 */
	MM_DATA_QMSG: 36,
	/**验证消息 */
	MM_DATA_VERIFYMSG: 37,
	/**推送系统消息 */
	MM_DATA_PUSHSYSTEMMSG: 38,
	/**QQ离线消息-图片 */
	MM_DATA_QQLIXIANMSG_IMG: 39,
	/**可能是好友的消息 */
	MM_DATA_POSSIBLEFRIEND_MSG: 40,
	/**名片消息 */
	MM_DATA_SHARECARD: 42,
	/**视频消息 */
	MM_DATA_VIDEO: 43,
	/**iPhone导出的视频消息 */
	MM_DATA_VIDEO_IPHONE_EXPORT: 44,
	/**表情消息 */
	MM_DATA_EMOJI: 47,
	/**位置消息 */
	MM_DATA_LOCATION: 48,
	/**App消息 */
	MM_DATA_APPMSG: 49,
	/**Voip消息 */
	MM_DATA_VOIPMSG: 50,
	/**状态通知消息 */
	MM_DATA_STATUSNOTIFY: 51,
	/**Voip通知消息 */
	MM_DATA_VOIPNOTIFY: 52,
	/**Voip邀请消息 */
	MM_DATA_VOIPINVITE: 53,
	/**小视频消息 */
	MM_DATA_MICROVIDEO: 62,
	/**系统通知消息 */
	MM_DATA_SYSNOTICE: 9999,
	/**系统消息 */
	MM_DATA_SYS: 10000,
	/**撤回消息 */
	MM_DATA_RECALLED: 10002,

	/**文本消息 */
	MSGTYPE_TEXT: 1,
	/**图片消息 */
	MSGTYPE_IMAGE: 3,
	/**语音消息 */
	MSGTYPE_VOICE: 34,
	/**验证消息 */
	MSGTYPE_VERIFYMSG: 37,
	/**可能是好友的消息 */
	MSGTYPE_POSSIBLEFRIEND_MSG: 40,
	/**名片消息 */
	MSGTYPE_SHARECARD: 42,
	/**视频消息 */
	MSGTYPE_VIDEO: 43,
	/**小视频消息 */
	MSGTYPE_MICROVIDEO: 62,
	/**表情消息 */
	MSGTYPE_EMOTICON: 47,
	/**位置消息 */
	MSGTYPE_LOCATION: 48,
	/**App消息 */
	MSGTYPE_APP: 49,
	/**Voip消息 */
	MSGTYPE_VOIPMSG: 50,
	/**状态通知消息 */
	MSGTYPE_STATUSNOTIFY: 51,
	/**Voip通知消息 */
	MSGTYPE_VOIPNOTIFY: 52,
	/**Voip邀请消息 */
	MSGTYPE_VOIPINVITE: 53,
	/**系统通知消息 */
	MSGTYPE_SYSNOTICE: 9999,
	/**系统消息 */
	MSGTYPE_SYS: 10000,
	/**撤回消息 */
	MSGTYPE_RECALLED: 10002,

	/**文本类型消息 */
	APPMSGTYPE_TEXT: 1,
	/**图片类型消息 */
	APPMSGTYPE_IMG: 2,
	/**音频类型消息 */
	APPMSGTYPE_AUDIO: 3,
	/**视频类型消息 */
	APPMSGTYPE_VIDEO: 4,
	/**URL类型消息 */
	APPMSGTYPE_URL: 5,
	/**附件类型消息 */
	APPMSGTYPE_ATTACH: 6,
	/**打开类型消息 */
	APPMSGTYPE_OPEN: 7,
	/**表情类型消息 */
	APPMSGTYPE_EMOJI: 8,
	/**声音提醒类型消息 */
	APPMSGTYPE_VOICE_REMIND: 9,
	/**扫描商品类型消息 */
	APPMSGTYPE_SCAN_GOOD: 10,
	/**商品类型消息 */
	APPMSGTYPE_GOOD: 13,
	/**表情类型消息 */
	APPMSGTYPE_EMOTION: 15,
	/**卡券票据类型消息 */
	APPMSGTYPE_CARD_TICKET: 16,
	/**实时分享位置类型消息 */
	APPMSGTYPE_REALTIME_SHARE_LOCATION: 17,
	/**转账类型消息 */
	APPMSGTYPE_TRANSFERS: 2000,
	/**红包类型消息 */
	APPMSGTYPE_RED_ENVELOPES: 2001,
	/**读者类型消息 */
	APPMSGTYPE_READER_TYPE: 100001,

	/**准备发送状态 */
	MSG_SEND_STATUS_READY: 0,
	/**正在发送状态 */
	MSG_SEND_STATUS_SENDING: 1,
	/**发送成功状态 */
	MSG_SEND_STATUS_SUCC: 2,
	/**发送失败状态 */
	MSG_SEND_STATUS_FAIL: 5,

	/**图片类型媒体上传 */
	UPLOAD_MEDIA_TYPE_IMAGE: 1,
	/**视频类型媒体上传 */
	UPLOAD_MEDIA_TYPE_VIDEO: 2,
	/**音频类型媒体上传 */
	UPLOAD_MEDIA_TYPE_AUDIO: 3,
	/**附件类型媒体上传 */
	UPLOAD_MEDIA_TYPE_ATTACHMENT: 4,

	/**个人信息标识符，表示没有变化 */
	PROFILE_BITFLAG_NOCHANGE: 0,
	/**个人信息标识符，表示有变化 */
	PROFILE_BITFLAG_CHANGE: 190,

	/**群聊通知状态，表示开启通知 */
	CHATROOM_NOTIFY_OPEN: 1,
	/**群聊通知状态，表示关闭通知 */
	CHATROOM_NOTIFY_CLOSE: 0,

	/**状态通知代码，表示已读状态 */
	StatusNotifyCode_READED: 1,
	/**状态通知代码，表示进入会话状态 */
	StatusNotifyCode_ENTER_SESSION: 2,
	/**状态通知代码，表示初始化状态 */
	StatusNotifyCode_INITED: 3,
	/**状态通知代码，表示同步会话状态 */
	StatusNotifyCode_SYNC_CONV: 4,
	/**状态通知代码，表示退出会话状态 */
	StatusNotifyCode_QUIT_SESSION: 5,

	/**验证用户操作码，表示添加联系人 */
	VERIFYUSER_OPCODE_ADDCONTACT: 1,
	/**验证用户操作码，表示发送请求 */
	VERIFYUSER_OPCODE_SENDREQUEST: 2,
	/**验证用户操作码，表示验证通过 */
	VERIFYUSER_OPCODE_VERIFYOK: 3,
	/**验证用户操作码，表示验证拒绝 */
	VERIFYUSER_OPCODE_VERIFYREJECT: 4,
	/**验证用户操作码，表示发送方回复 */
	VERIFYUSER_OPCODE_SENDERREPLY: 5,
	/**验证用户操作码，表示接收方回复 */
	VERIFYUSER_OPCODE_RECVERREPLY: 6,

	/**添加场景标识符，表示QQ添加 */
	ADDSCENE_PF_QQ: 4,
	/**添加场景标识符，表示邮箱添加 */
	ADDSCENE_PF_EMAIL: 5,
	/**添加场景标识符，表示联系人添加 */
	ADDSCENE_PF_CONTACT: 6,
	/**添加场景标识符，表示微信添加 */
	ADDSCENE_PF_WEIXIN: 7,
	/**添加场景标识符，表示群聊添加 */
	ADDSCENE_PF_GROUP: 8,
	/**添加场景标识符，表示未知添加 */
	ADDSCENE_PF_UNKNOWN: 9,
	/**添加场景标识符，表示手机添加 */
	ADDSCENE_PF_MOBILE: 10,
	/**添加场景标识符，表示网页添加 */
	ADDSCENE_PF_WEB: 33,

	/**按键码，表示退格键 */
	KEYCODE_BACKSPACE: 8,
	/**按键码，表示回车键 */
	KEYCODE_ENTER: 13,
	/**按键码，表示Shift键 */
	KEYCODE_SHIFT: 16,
	/**按键码，表示ESC键 */
	KEYCODE_ESC: 27,
	/**按键码，表示删除键 */
	KEYCODE_DELETE: 34,
	/**按键码，表示向左箭头键 */
	KEYCODE_ARROW_LEFT: 37,
	/**按键码，表示向上箭头键 */
	KEYCODE_ARROW_UP: 38,
	/**按键码，表示向右箭头键 */
	KEYCODE_ARROW_RIGHT: 39,
	/**按键码，表示向下箭头键 */
	KEYCODE_ARROW_DOWN: 40,
	/**按键码，表示数字2键 */
	KEYCODE_NUM2: 50,
	/**按键码，表示@符号键 */
	KEYCODE_AT: 64,
	/**按键码，表示数字加号键 */
	KEYCODE_NUM_ADD: 107,
	/**按键码，表示数字减号键 */
	KEYCODE_NUM_MINUS: 109,
	/**按键码，表示加号键 */
	KEYCODE_ADD: 187,
	/**按键码，表示减号键 */
	KEYCODE_MINUS: 189,

	/**特殊用户列表 */
	SPECIALUSERS: [
		"newsapp",
		"fmessage",
		"filehelper",
		"weibo",
		"qqmail",
		"fmessage",
		"tmessage",
		"qmessage",
		"qqsync",
		"floatbottle",
		"lbsapp",
		"shakeapp",
		"medianote",
		"qqfriend",
		"readerapp",
		"blogapp",
		"facebookapp",
		"masssendapp",
		"meishiapp",
		"feedsapp",
		"voip",
		"blogappweixin",
		"weixin",
		"brandsessionholder",
		"weixinreminder",
		"wxid_novlwrv3lqwv11",
		"gh_22b87fa7cb3c",
		"officialaccounts",
		"notification_messages",
		"wxid_novlwrv3lqwv11",
		"gh_22b87fa7cb3c",
		"wxitil",
		"userexperience_alarm",
		"notification_messages",
	],
};
