package channel

import (
	"errors"
	"zhongjyuan/gin-message-server/common"
	"zhongjyuan/gin-message-server/model"
)

// SendMessage 用于根据不同的消息通道类型发送消息。
//
// 输入参数：
//   - message *model.MessageEntity: 消息实体对象，包含消息内容和描述等信息。
//   - user *model.UserEntity: 用户实体对象，用于获取用户相关信息。
//   - channel_ *model.ChannelEntity: 渠道实体对象，包含渠道相关信息。
//
// 输出参数：
//   - error: 发送消息过程中遇到的错误，如果成功发送消息则为 nil，否则为发送消息失败的详细信息。
func SendMessage(message *model.MessageEntity, user *model.UserEntity, channel_ *model.ChannelEntity) error {
	switch channel_.Type {
	case common.TypeEmail:
		return SendEmailMessage(message, user, channel_) // 调用发送邮件消息的函数
	case common.TypeWeChatTestAccount:
		return SendWeChatTestMessage(message, user, channel_) // 调用发送企业微信测试账号消息的函数
	case common.TypeWeChatCorpAccount:
		return SendWeChatCorpMessage(message, user, channel_) // 调用发送企业微信企业账号消息的函数
	case common.TypeCorp:
		return SendCorpMessage(message, user, channel_) // 调用发送企业消息的函数
	case common.TypeLark:
		return SendLarkMessage(message, user, channel_) // 调用发送Lark消息的函数
	case common.TypeDing:
		return SendDingMessage(message, user, channel_) // 调用发送钉钉消息的函数
	case common.TypeBark:
		return SendBarkMessage(message, user, channel_) // 调用发送Bark消息的函数
	case common.TypeClient:
		return SendClientMessage(message, user, channel_) // 调用发送客户端消息的函数
	case common.TypeTelegram:
		return SendTelegramMessage(message, user, channel_) // 调用发送Telegram消息的函数
	case common.TypeDiscord:
		return SendDiscordMessage(message, user, channel_) // 调用发送Discord消息的函数
	case common.TypeNone:
		return nil
	case common.TypeOneBot:
		return SendOneBotMessage(message, user, channel_) // 调用发送OneBot消息的函数
	case common.TypeGroup:
		return SendGroupMessage(message, user, channel_) // 调用发送群组消息的函数
	case common.TypeLarkApp:
		return SendLarkAppMessage(message, user, channel_) // 调用发送Lark应用消息的函数
	case common.TypeCustom:
		return SendCustomMessage(message, user, channel_) // 调用发送自定义消息的函数
	case common.TypeTencentAlarm:
		return SendTencentAlarmMessage(message, user, channel_) // 调用发送腾讯告警消息的函数
	default:
		return errors.New("不支持的消息通道：" + channel_.Type)
	}
}
