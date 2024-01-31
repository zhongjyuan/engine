package message

import (
	"log"
	"zhongjyuan/wechat/config"
	"zhongjyuan/wechat/core"
)

type HandleType string

const (
	UserHandler  HandleType = "user"
	GroupHandler HandleType = "group"
)

// IMessageHandler 消息处理接口
type IMessageHandler interface {
	Handle(*core.Message) error
	ReplyText(*core.Message) error
}

// handlers 所有消息类型类型的处理器
var handlers map[HandleType]IMessageHandler

func init() {
	handlers = make(map[HandleType]IMessageHandler)

	handlers[UserHandler] = UserMessageHandler()
	handlers[GroupHandler] = GroupMessageHandler()
}

// Handler 全局处理入口
func Handler(message *core.Message) {
	// log.Printf("hadler Received message : %v", message.Content)

	// 处理群消息
	if message.IsSendByGroup() {
		handlers[GroupHandler].Handle(message)
		return
	}

	// 好友申请
	if message.IsFriendAdd() {
		if config.LoadConfig().AutoPass {
			_, err := message.Agree("您好呀!这里是君烛科技AI小助手，您可以向我提问任何问题。")
			if err != nil {
				log.Fatalf("add friend agree error : %v", err)
				return
			}
		}
	}

	// 私聊
	handlers[UserHandler].Handle(message)
}
