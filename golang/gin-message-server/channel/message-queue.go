package channel

import (
	"zhongjyuan/gin-message-server/common"
	"zhongjyuan/gin-message-server/model"
)

var AsyncMessageQueue chan int // 异步消息队列，用于存储消息的通道

var AsyncMessageQueueSize = 128 // 异步消息队列的大小

var AsyncMessageSenderNum = 2 // 异步消息发送者的数量

// init 用于初始化异步消息队列和启动异步消息发送者。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func init() {
	AsyncMessageQueue = make(chan int, AsyncMessageQueueSize) // 初始化异步消息队列
	for i := 0; i < AsyncMessageSenderNum; i++ {
		go asyncMessageSender() // 启动指定数量的异步消息发送者
	}
}

// LoadAsyncMessages loads async pending messages from database.
// We have to wait the database connection is ready.

// LoadAsyncMessages 用于加载异步待发送的消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func LoadAsyncMessages() {
	ids, err := model.GetAsyncPendingMessageIds() // 获取异步待发送消息的 ID 列表
	if err != nil {
		common.FatalLog("failed to load async pending messages: " + err.Error()) // 如果获取失败，则记录日志并返回
	}
	for _, id := range ids {
		AsyncMessageQueue <- id // 将每个消息的 ID 加入异步消息队列
	}
}

// asyncMessageSenderHelper 用于处理异步消息发送的辅助函数。
//
// 输入参数：
//   - message *model.MessageEntity: 要发送的消息实体。
//
// 输出参数：
//   - error: 执行过程中遇到的错误，如果成功发送消息则为 nil，否则为发送失败的详细信息。
func asyncMessageSenderHelper(message *model.MessageEntity) error {
	user, err := model.GetUserByID(message.UserId, false) // 获取消息所属用户信息
	if err != nil {
		return err // 如果获取用户信息失败，返回错误
	}

	channel_, err := model.GetChannelByName(message.Channel, user.Id, false) // 获取消息要发送的频道信息
	if err != nil {
		return err // 如果获取频道信息失败，返回错误
	}

	return SendMessage(message, user, channel_) // 发送消息给用户的指定频道
}

// asyncMessageSender 用于处理异步消息发送。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func asyncMessageSender() {
	for {
		id := <-AsyncMessageQueue                // 从异步消息队列中取出消息 ID
		message, err := model.GetMessageByID(id) // 根据消息 ID 获取消息实体
		if err != nil {
			common.SysError("async message sender error: " + err.Error()) // 如果获取消息失败，记录错误并继续下一轮循环
			continue
		}

		status := common.MessageSendStatusFailed                 // 默认设置消息发送状态为发送失败
		if err = asyncMessageSenderHelper(message); err != nil { // 调用辅助函数发送消息
			common.SysError("async message sender error: " + err.Error()) // 如果发送消息失败，记录错误
		} else {
			status = common.MessageSendStatusSent // 如果发送成功，将消息发送状态设置为已发送
		}

		if err = message.UpdateStatus(status); err != nil { // 更新消息状态至数据库
			common.SysError("async message sender error: " + err.Error()) // 如果更新状态失败，记录错误
		}
	}
}
