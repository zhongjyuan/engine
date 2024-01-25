package handle

import (
	"log"
	"wechat/config"
	"wechat/core"
)

const (
	UserHandler  = "user"
	GroupHandler = "group"
)

type HandleType string

// MessageHandlerInterface 消息处理接口
type MessageHandlerInterface interface {
	handle(*core.Message) error
	ReplyText(*core.Message) error
}

// handlers 所有消息类型类型的处理器
var handlers map[HandleType]MessageHandlerInterface

func init() {
	handlers = make(map[HandleType]MessageHandlerInterface)
	handlers[UserHandler] = UserMessageHandler()
	handlers[GroupHandler] = GroupMessageHandler()
}

// Handler 全局处理入口
func Handler(message *core.Message) {
	log.Printf("hadler Received message : %v", message.Content)

	// 处理群消息
	if message.IsSendByGroup() {
		handlers[GroupHandler].handle(message)
		return
	}

	// 好友申请
	if message.IsFriendAdd() {
		if config.LoadConfig().AutoPass {
			_, err := message.Agree("你好呀！我是基于chatGPT引擎开发的微信机器人，你可以向我提问任何问题。")
			if err != nil {
				log.Fatalf("add friend agree error : %v", err)
				return
			}
		}
	}

	// 私聊
	handlers[UserHandler].handle(message)
}
