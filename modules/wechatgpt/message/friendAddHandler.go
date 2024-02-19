package message

import (
	"log"
	"zhongjyuan/wechatgpt/config"
	"zhongjyuan/wechatgpt/core"
)

// IFriendAddMessageHandler 添加好友消息处理
type IFriendAddMessageHandler struct{}

// 此行代码用于确保 IFriendAddMessageHandler 类型实现了 IMessageHandler 接口。
var _ IMessageHandler = (*IFriendAddMessageHandler)(nil)

// FriendAddMessageHandler 函数用于创建添加好友消息处理器实例。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - IMessageHandler: 返回 IFriendAddMessageHandler 实例作为 IMessageHandler 接口。
func FriendAddMessageHandler() IMessageHandler {
	// 返回 IFriendAddMessageHandler 实例指针作为 IMessageHandler 接口
	return &IFriendAddMessageHandler{}
}

// Handle 方法用于处理添加好友消息。
//
// 输入参数：
//   - message: 要处理的消息对象。
//
// 输出参数：
//   - error: 如果处理过程中发生错误，则返回非空的 error；否则返回 nil。
func (handler *IFriendAddMessageHandler) Handle(message *core.Message) error {
	if config.LoadConfig().AutoPass {
		_, err := message.Agree("您好呀!这里是君烛科技AI小助手，您可以向我提问任何问题。")
		if err != nil {
			log.Fatalf("add friend agree error : %v", err)
			return err
		}
	}

	// 其他类型消息暂不处理，直接返回 nil
	return nil
}
