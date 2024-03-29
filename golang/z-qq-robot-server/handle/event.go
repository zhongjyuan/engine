package handle

import (
	"strings"

	"github.com/tencent-connect/botgo/dto"
	"github.com/tencent-connect/botgo/dto/message"
	"github.com/tencent-connect/botgo/event"
)

// ReadyHandler 可以处理 ws 的 ready 事件(捕获到连接成功的事件)
func ReadyHandler(processor Processor) event.ReadyHandler {
	return func(event *dto.WSPayload, data *dto.WSReadyData) {
		processor.Log.Infof("[%s] %v", event.Type, data.User)
	}
}

// ErrorNotifyHandler 当 ws 连接发生错误的时候，会回调，方便使用方监控相关错误
// 比如 reconnect invalidSession 等错误，错误可以转换为 bot.Err(连接关闭回调)
func ErrorNotifyHandler(processor Processor) event.ErrorNotifyHandler {
	return func(err error) {
		processor.Log.Trace(err)
	}
}

// PlainEventHandler 透传 handler
func PlainEventHandler(processor Processor) event.PlainEventHandler {
	return func(event *dto.WSPayload, message []byte) error {
		processor.Log.Tracef("[%s] %v", event.Type, message)
		return nil
	}
}

// GuildEventHandler 频道事件 handler
func GuildEventHandler(processor Processor) event.GuildEventHandler {
	return func(event *dto.WSPayload, data *dto.WSGuildData) error {
		processor.Log.Tracef("[%s] %v", event.Type, data)

		if event.Type == "GUILD_CREATE" { //当机器人加入频道时，获取频道的id
			processor.GuildID = data.ID
		}

		return nil
	}
}

// GuildMemberEventHandler 频道成员事件 handler
func GuildMemberEventHandler(processor Processor) event.GuildMemberEventHandler {
	return func(event *dto.WSPayload, data *dto.WSGuildMemberData) error {
		processor.Log.Tracef("[%s] %v", event.Type, data)
		return nil
	}
}

// ChannelEventHandler 子频道事件 handler
func ChannelEventHandler(processor Processor) event.ChannelEventHandler {
	return func(event *dto.WSPayload, data *dto.WSChannelData) error {
		processor.Log.Tracef("[%s] %v", event.Type, data)
		return nil
	}
}

// MessageEventHandler 消息事件 handler
func MessageEventHandler(processor Processor) event.MessageEventHandler {
	return func(event *dto.WSPayload, data *dto.WSMessageData) error {
		processor.Log.Tracef("[%s] %v", event.Type, data)
		return nil
	}
}

// MessageDeleteEventHandler 消息事件 handler
func MessageDeleteEventHandler(processor Processor) event.MessageDeleteEventHandler {
	return func(event *dto.WSPayload, data *dto.WSMessageDeleteData) error {
		processor.Log.Tracef("[%s] %v", event.Type, data)
		return nil
	}
}

// PublicMessageDeleteEventHandler 消息事件 handler
func PublicMessageDeleteEventHandler(processor Processor) event.PublicMessageDeleteEventHandler {
	return func(event *dto.WSPayload, data *dto.WSPublicMessageDeleteData) error {
		processor.Log.Tracef("[%s] %v", event.Type, data)
		return nil
	}
}

// DirectMessageDeleteEventHandler 消息事件 handler
func DirectMessageDeleteEventHandler(processor Processor) event.DirectMessageDeleteEventHandler {
	return func(event *dto.WSPayload, data *dto.WSDirectMessageDeleteData) error {
		processor.Log.Tracef("[%s] %v", event.Type, data)
		return nil
	}
}

// MessageReactionEventHandler 表情表态事件 handler
func MessageReactionEventHandler(processor Processor) event.MessageReactionEventHandler {
	return func(event *dto.WSPayload, data *dto.WSMessageReactionData) error {
		processor.Log.Tracef("[%s] %v", event.Type, data)
		return nil
	}
}

// ATMessageEventHandler at 机器人消息事件 handler
func ATMessageEventHandler(processor Processor) event.ATMessageEventHandler {
	return func(event *dto.WSPayload, data *dto.WSATMessageData) error {
		processor.Log.Tracef("[%s] %s", event.Type, data.Content)
		input := strings.ToLower(message.ETLInput(data.Content))
		processor.ProcessMessage(input, data)
		return nil
	}
}

// DirectMessageEventHandler 私信消息事件 handler
func DirectMessageEventHandler(processor Processor) event.DirectMessageEventHandler {
	return func(event *dto.WSPayload, data *dto.WSDirectMessageData) error {
		processor.Log.Tracef("[%s] %v", event.Type, data)
		return nil
	}
}

// AudioEventHandler 音频机器人事件 handler
func AudioEventHandler(processor Processor) event.AudioEventHandler {
	return func(event *dto.WSPayload, data *dto.WSAudioData) error {
		processor.Log.Tracef("[%s] %v", event.Type, data)
		return nil
	}
}

// MessageAuditEventHandler 消息审核事件 handler
func MessageAuditEventHandler(processor Processor) event.MessageAuditEventHandler {
	return func(event *dto.WSPayload, data *dto.WSMessageAuditData) error {
		processor.Log.Tracef("[%s] %v", event.Type, data)
		return nil
	}
}

// ThreadEventHandler 论坛主题事件 handler
func ThreadEventHandler(processor Processor) event.ThreadEventHandler {
	return func(event *dto.WSPayload, data *dto.WSThreadData) error {
		processor.Log.Tracef("[%s] %v", event.Type, data)
		return nil
	}
}

// PostEventHandler 论坛回帖事件 handler
func PostEventHandler(processor Processor) event.PostEventHandler {
	return func(event *dto.WSPayload, data *dto.WSPostData) error {
		processor.Log.Tracef("[%s] %v", event.Type, data)
		return nil
	}
}

// ReplyEventHandler 论坛帖子回复事件 handler
func ReplyEventHandler(processor Processor) event.ReplyEventHandler {
	return func(event *dto.WSPayload, data *dto.WSReplyData) error {
		processor.Log.Tracef("[%s] %v", event.Type, data)
		return nil
	}
}

// ForumAuditEventHandler 论坛帖子审核事件 handler
func ForumAuditEventHandler(processor Processor) event.ForumAuditEventHandler {
	return func(event *dto.WSPayload, data *dto.WSForumAuditData) error {
		processor.Log.Tracef("[%s] %v", event.Type, data)
		return nil
	}
}

// InteractionEventHandler 互动事件 handler
func InteractionEventHandler(processor Processor) event.InteractionEventHandler {
	return func(event *dto.WSPayload, data *dto.WSInteractionData) error {
		processor.Log.Tracef("[%s] %v", event.Type, data)
		return processor.ProcessInlineSearch(data)
	}
}
