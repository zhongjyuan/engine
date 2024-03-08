package common

const (
	SendEmailToOthersAllowed    = 1
	SendEmailToOthersDisallowed = 2
)

const (
	SaveMessageToDatabaseAllowed    = 1
	SaveMessageToDatabaseDisallowed = 2
)

const (
	MessageSendStatusUnknown      = 0
	MessageSendStatusPending      = 1
	MessageSendStatusSent         = 2
	MessageSendStatusFailed       = 3
	MessageSendStatusAsyncPending = 4
)

const (
	ChannelStatusUnknown  = 0
	ChannelStatusEnabled  = 1
	ChannelStatusDisabled = 2
)

const (
	WebhookStatusUnknown  = 0
	WebhookStatusEnabled  = 1
	WebhookStatusDisabled = 2
)

const (
	TypeEmail             = "email"
	TypeWeChatTestAccount = "test"
	TypeWeChatCorpAccount = "corp_app"
	TypeCorp              = "corp"
	TypeLark              = "lark"
	TypeDing              = "ding"
	TypeTelegram          = "telegram"
	TypeDiscord           = "discord"
	TypeBark              = "bark"
	TypeClient            = "client"
	TypeNone              = "none"
	TypeOneBot            = "one_bot"
	TypeGroup             = "group"
	TypeLarkApp           = "lark_app"
	TypeCustom            = "custom"
	TypeTencentAlarm      = "tencent_alarm"
)
