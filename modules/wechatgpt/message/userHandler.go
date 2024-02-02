package message

import (
	"log"
	"strings"
	"zhongjyuan/wechatgpt/chatgpt"
	"zhongjyuan/wechatgpt/core"
)

// UserMessageHandler 私聊消息处理
type IUserMessageHandler struct{}

var _ IMessageHandler = (*IUserMessageHandler)(nil)

// NewUserMessageHandler 创建私聊处理器
func UserMessageHandler() IMessageHandler {
	return &IUserMessageHandler{}
}

// Handle 处理消息
func (handler *IUserMessageHandler) Handle(message *core.Message) error {
	if message.IsText() {
		return handler.ReplyText(message)
	}

	return nil
}

// ReplyText 发送文本消息到群
func (handler *IUserMessageHandler) ReplyText(message *core.Message) error {
	// 接收私聊消息
	sender, err := message.Sender()
	if err != nil {
		log.Printf("message sender unknown error: %v \n", err)
		message.ReplyText("机器人又奔溃了，我一会发现了就去修。")
		return err
	}
	log.Printf("Received user %v Text Message : %v", sender.NickName, message.Content)

	// 向GPT发起请求
	requestText := strings.TrimSpace(message.Content)
	requestText = strings.Trim(requestText, "\n")

	reply, err := chatgpt.Completions(sender.NickName, requestText)
	if err != nil {
		log.Printf("chatgpt request error: %v \n", err)
		message.ReplyText("机器人奔溃了，我一会发现了就去修。")
		return err
	}

	if reply == "" {
		return nil
	}

	// 回复联系人
	reply = strings.TrimSpace(reply)
	reply = strings.Trim(reply, "\n")

	_, err = message.ReplyText(reply)
	if err != nil {
		log.Printf("response user error: %v \n", err)
	}

	return err
}
