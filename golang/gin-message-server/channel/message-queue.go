package channel

import (
	"zhongjyuan/gin-message-server/common"
	"zhongjyuan/gin-message-server/model"
)

var AsyncMessageQueue chan int
var AsyncMessageQueueSize = 128
var AsyncMessageSenderNum = 2

func init() {
	AsyncMessageQueue = make(chan int, AsyncMessageQueueSize)
	for i := 0; i < AsyncMessageSenderNum; i++ {
		go asyncMessageSender()
	}
}

// LoadAsyncMessages loads async pending messages from database.
// We have to wait the database connection is ready.
func LoadAsyncMessages() {
	ids, err := model.GetAsyncPendingMessageIds()
	if err != nil {
		common.FatalLog("failed to load async pending messages: " + err.Error())
	}
	for _, id := range ids {
		AsyncMessageQueue <- id
	}
}

func asyncMessageSenderHelper(message *model.MessageEntity) error {
	user, err := model.GetUserByID(message.UserId, false)
	if err != nil {
		return err
	}
	channel_, err := model.GetChannelByName(message.Channel, user.Id, false)
	if err != nil {
		return err
	}
	return SendMessage(message, user, channel_)
}

func asyncMessageSender() {
	for {
		id := <-AsyncMessageQueue
		message, err := model.GetMessageByID(id)
		if err != nil {
			common.SysError("async message sender error: " + err.Error())
			continue
		}
		err = asyncMessageSenderHelper(message)
		status := common.MessageSendStatusFailed
		if err != nil {
			common.SysError("async message sender error: " + err.Error())
		} else {
			status = common.MessageSendStatusSent
		}
		err = message.UpdateStatus(status)
		if err != nil {
			common.SysError("async message sender error: " + err.Error())
		}
	}
}
