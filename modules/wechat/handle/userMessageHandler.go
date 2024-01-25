package handle

import (
	"log"
	"strings"
	"wechat/chatgpt"

	"github.com/eatmoreapple/openwechat"
)

// UserMessageHandler 私聊消息处理
type IUserMessageHandler struct {
}

var _ MessageHandlerInterface = (*IUserMessageHandler)(nil)

// NewUserMessageHandler 创建私聊处理器
func UserMessageHandler() MessageHandlerInterface {
	return &IUserMessageHandler{}
}

// handle 处理消息
func (handler *IUserMessageHandler) handle(message *openwechat.Message) error {
	if message.IsText() {
		return handler.ReplyText(message)
	}

	return nil
}

// ReplyText 发送文本消息到群
func (handler *IUserMessageHandler) ReplyText(message *openwechat.Message) error {
	// 接收私聊消息
	sender, err := message.Sender()
	log.Printf("Received User %v Text Message : %v", sender.NickName, message.Content)

	// 向GPT发起请求
	requestText := strings.TrimSpace(message.Content)
	requestText = strings.Trim(message.Content, "\n")
	reply, err := chatgpt.Completions(requestText)
	if err != nil {
		log.Printf("chatgpt request error: %v \n", err)
		message.ReplyText("机器人奔溃了，我一会发现了就去修。")
		return err
	}

	if reply == "" {
		return nil
	}

	// 回复用户
	reply = strings.TrimSpace(reply)
	reply = strings.Trim(reply, "\n")
	_, err = message.ReplyText(reply)
	if err != nil {
		log.Printf("response user error: %v \n", err)
	}

	return err
}
