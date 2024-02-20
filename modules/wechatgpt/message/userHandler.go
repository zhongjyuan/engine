package message

import (
	"strings"
	"zhongjyuan/wechatgpt/chatgpt"
	"zhongjyuan/wechatgpt/core"
)

// IUserMessageHandler 私聊消息处理
type IUserMessageHandler struct{}

// 此行代码用于确保 IUserMessageHandler 类型实现了 IMessageHandler 接口。
var _ IMessageHandler = (*IUserMessageHandler)(nil)

// UserMessageHandler 函数用于创建私聊消息处理器实例。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - IMessageHandler: 返回 IUserMessageHandler 实例作为 IMessageHandler 接口。
func UserMessageHandler() IMessageHandler {
	// 返回 IUserMessageHandler 实例指针作为 IMessageHandler 接口
	return &IUserMessageHandler{}
}

// Handle 方法用于处理私聊消息。
//
// 输入参数：
//   - message: 要处理的消息对象。
//
// 输出参数：
//   - error: 如果处理过程中发生错误，则返回非空的 error；否则返回 nil。
func (handler *IUserMessageHandler) Handle(message *core.Message) error {
	// 如果消息为文本类型，则调用 ReplyText 方法回复消息
	if !message.IsText() || message.IsSendBySelf() {
		return nil
	}

	// 获取消息发送者信息
	sender, err := message.Sender()
	if err != nil {
		message.Bot().Logger().Error("message sender unknown error: %v \n", err)
		return err
	}

	// 向 GPT 发起请求
	requestText := strings.TrimSpace(message.Content)
	requestText = strings.Trim(requestText, "\n")

	// 向ChatGPT发起请求获取回复
	reply, err := chatgpt.Completions(sender.NickName, requestText)
	if err != nil {
		message.Bot().Logger().Error("chatgpt request error: %v \n", err)
		message.ReplyText("机器人奔溃了，我一会发现了就去修。")
		return err
	}

	// 如果回复为空则不进行处理
	if reply == "" {
		return nil
	}

	// 回复给联系人
	replyText := strings.TrimSpace(reply)
	replyText = strings.Trim(replyText, "\n")

	_, err = message.ReplyText(replyText)
	if err != nil {
		message.Bot().Logger().Error("message reply user error: %v \n", err)
		return err
	}

	// 其他类型消息暂不处理，直接返回 nil
	return nil
}
