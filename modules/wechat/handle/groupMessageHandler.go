package handle

import (
	"log"
	"strings"
	"wechat/chatgpt"
	"wechat/core"
)

// GroupMessageHandler 群消息处理
type IGroupMessageHandler struct{}

var _ MessageHandlerInterface = (*IGroupMessageHandler)(nil)

// GroupMessageHandler 创建群消息处理器
func GroupMessageHandler() MessageHandlerInterface {
	return &IGroupMessageHandler{}
}

// handle 处理消息
func (handler *IGroupMessageHandler) handle(message *core.Message) error {
	if message.IsText() {
		return handler.ReplyText(message)
	}

	return nil
}

// ReplyText 发送文本消息到群
func (handler *IGroupMessageHandler) ReplyText(message *core.Message) error {

	// 不是@的不处理
	if !message.IsAt() {
		return nil
	}

	// 接收群消息
	sender, err := message.Sender()
	if err != nil {
		log.Printf("message sender error: %v \n", err)
		message.ReplyText("机器人又奔溃了，我一会发现了就去修。")
		return err
	}

	group := core.Group{sender}
	log.Printf("Received Group %v Text Message : %v", group.NickName, message.Content)

	// 替换掉@文本，然后向GPT发起请求
	replaceText := "@" + sender.NickName
	requestText := strings.TrimSpace(strings.ReplaceAll(message.Content, replaceText, ""))
	reply, err := chatgpt.Completions(requestText)
	if err != nil {
		log.Printf("chatgpt request error: %v \n", err)
		message.ReplyText("机器人又奔溃了，我一会发现了就去修。")
		return err
	}

	if reply == "" {
		return nil
	}

	// 获取@我的联系人
	groupSender, err := message.SenderInGroup()
	if err != nil {
		log.Printf("get sender in group error :%v \n", err)
		return err
	}

	// 回复@我的联系人
	reply = strings.TrimSpace(reply)
	reply = strings.Trim(reply, "\n")

	atText := "@" + groupSender.NickName
	replyText := atText + reply

	_, err = message.ReplyText(replyText)
	if err != nil {
		log.Printf("response group error: %v \n", err)
	}

	return err
}
