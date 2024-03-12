package common

const (
	SendEmailToOthersAllowed    = 1 // SendEmailToOthersAllowed 表示允许发送邮件给他人。
	SendEmailToOthersDisallowed = 2 // SendEmailToOthersDisallowed 表示禁止发送邮件给他人。
)

const (
	SaveMessageToDatabaseAllowed    = 1 // SaveMessageToDatabaseAllowed 表示允许将消息保存到数据库。
	SaveMessageToDatabaseDisallowed = 2 // SaveMessageToDatabaseDisallowed 表示禁止将消息保存到数据库。
)

const (
	MessageSendStatusUnknown      = 0 // MessageSendStatusUnknown 表示消息发送状态未知。
	MessageSendStatusPending      = 1 // MessageSendStatusPending 表示消息发送状态为待发送。
	MessageSendStatusSent         = 2 // MessageSendStatusSent 表示消息发送状态为已发送。
	MessageSendStatusFailed       = 3 // MessageSendStatusFailed 表示消息发送状态为发送失败。
	MessageSendStatusAsyncPending = 4 // MessageSendStatusAsyncPending 表示消息发送状态为异步发送待处理。
)

const (
	ChannelStatusUnknown  = 0 // ChannelStatusUnknown 表示频道状态未知。
	ChannelStatusEnabled  = 1 // ChannelStatusEnabled 表示频道已启用。
	ChannelStatusDisabled = 2 // ChannelStatusDisabled 表示频道已禁用。
)

const (
	WebHookStatusUnknown  = 0 // WebHookStatusUnknown 表示 WebHook 状态未知。
	WebHookStatusEnabled  = 1 // WebHookStatusEnabled 表示 WebHook 已启用。
	WebHookStatusDisabled = 2 // WebHookStatusDisabled 表示 WebHook 已禁用。
)

const (
	// TypeEmail 表示类型为电子邮件。
	TypeEmail = "email"

	// TypeWeChatTestAccount 表示类型为企业微信测试号。
	TypeWeChatTestAccount = "test"

	// TypeWeChatCorpAccount 表示类型为企业微信应用。
	TypeWeChatCorpAccount = "corp_app"

	// TypeCorp 表示类型为企业微信。
	TypeCorp = "corp"

	// TypeLark 表示类型为飞书。
	TypeLark = "lark"

	// TypeDing 表示类型为钉钉。
	TypeDing = "ding"

	// TypeTelegram 表示类型为Telegram。
	TypeTelegram = "telegram"

	// TypeDiscord 表示类型为Discord。
	TypeDiscord = "discord"

	// TypeBark 表示类型为Bark。
	TypeBark = "bark"

	// TypeClient 表示类型为客户端。
	TypeClient = "client"

	// TypeNone 表示类型为无。
	TypeNone = "none"

	// TypeOneBot 表示类型为OneBot。
	TypeOneBot = "one_bot"

	// TypeGroup 表示类型为群组。
	TypeGroup = "group"

	// TypeLarkApp 表示类型为飞书应用。
	TypeLarkApp = "lark_app"

	// TypeCustom 表示类型为自定义。
	TypeCustom = "custom"

	// TypeTencentAlarm 表示类型为腾讯告警。
	TypeTencentAlarm = "tencent_alarm"
)
