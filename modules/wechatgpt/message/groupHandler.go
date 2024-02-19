package message

import (
	"log"
	"strings"
	"zhongjyuan/wechatgpt/chatgpt"
	"zhongjyuan/wechatgpt/core"
)

// GroupMessageHandler 群消息处理
type IGroupMessageHandler struct{}

// 此行代码用于确保 IGroupMessageHandler 类型实现了 IMessageHandler 接口。
var _ IMessageHandler = (*IGroupMessageHandler)(nil)

// GroupMessageHandler 函数用于创建群消息处理器实例。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - IMessageHandler: 返回 IGroupMessageHandler 实例作为 IMessageHandler 接口。
func GroupMessageHandler() IMessageHandler {
	// 返回 IGroupMessageHandler 实例指针作为 IMessageHandler 接口
	return &IGroupMessageHandler{}
}

// Handle 用于处理群组消息，如果消息是文本类型则调用 ReplyText 方法进行回复。
//
// 输入参数：
//   - message: 要处理的消息对象。
//
// 输出参数：
//   - error: 如果处理过程中发生错误，则返回非空的 error；否则返回 nil。
func (handler *IGroupMessageHandler) Handle(message *core.Message) error {
	if !message.IsText() || !message.IsAt() || message.IsSendBySelf() {
		return nil
	}

	// 获取消息发送者信息
	sender, err := message.Sender()
	if err != nil {
		log.Printf("get sender in message error :%v \n", err)
		return err
	}

	// 获取@机器人的联系人信息
	groupSender, err := message.SenderInGroup()
	if err != nil {
		log.Printf("get sender in group error :%v \n", err)
		return err
	}

	// 记录消息日志
	log.Printf("Received Group %v Text Message : %v", sender.NickName+" - "+groupSender.NickName, message.Content)

	// 获取当前登录用户
	self, err := message.Bot().CurrentUser()
	if err != nil {
		log.Printf("get user in bot error :%v \n", err)
		return err
	}

	// 替换掉@文本，然后向GPT发起请求
	replaceText := "@" + self.NickName
	requestText := strings.TrimSpace(strings.ReplaceAll(message.Content, replaceText, ""))

	// 向ChatGPT发起请求获取回复
	reply, err := chatgpt.Completions(sender.NickName+"/"+groupSender.NickName, requestText)
	if err != nil {
		log.Printf("chatgpt request error: %v \n", err)
		message.ReplyText("机器人又奔溃了，我一会发现了就去修。")
		return err
	}

	// 如果回复为空则不进行处理
	if reply == "" {
		return nil
	}

	// 清理回复文本，并拼接@发送者的文本消息
	reply = strings.TrimSpace(reply)
	reply = strings.Trim(reply, "\n")

	replyText := "@" + groupSender.NickName + reply

	// 向群组发送回复消息
	_, err = message.ReplyText(replyText)
	if err != nil {
		log.Printf("group message reply error: %v \n", err)
		return err
	}

	return nil
}
