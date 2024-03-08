package channel

import (
	"errors"
	"zhongjyuan/gin-message-server/common"
	"zhongjyuan/gin-message-server/model"
)

func SendMessage(message *model.MessageEntity, user *model.UserEntity, channel_ *model.ChannelEntity) error {
	switch channel_.Type {
	case common.TypeEmail:
		return SendEmailMessage(message, user, channel_)
	case common.TypeWeChatTestAccount:
		return SendWeChatTestMessage(message, user, channel_)
	case common.TypeWeChatCorpAccount:
		return SendWeChatCorpMessage(message, user, channel_)
	case common.TypeCorp:
		return SendCorpMessage(message, user, channel_)
	case common.TypeLark:
		return SendLarkMessage(message, user, channel_)
	case common.TypeDing:
		return SendDingMessage(message, user, channel_)
	case common.TypeBark:
		return SendBarkMessage(message, user, channel_)
	case common.TypeClient:
		return SendClientMessage(message, user, channel_)
	case common.TypeTelegram:
		return SendTelegramMessage(message, user, channel_)
	case common.TypeDiscord:
		return SendDiscordMessage(message, user, channel_)
	case common.TypeNone:
		return nil
	case common.TypeOneBot:
		return SendOneBotMessage(message, user, channel_)
	case common.TypeGroup:
		return SendGroupMessage(message, user, channel_)
	case common.TypeLarkApp:
		return SendLarkAppMessage(message, user, channel_)
	case common.TypeCustom:
		return SendCustomMessage(message, user, channel_)
	case common.TypeTencentAlarm:
		return SendTencentAlarmMessage(message, user, channel_)
	default:
		return errors.New("不支持的消息通道：" + channel_.Type)
	}
}
