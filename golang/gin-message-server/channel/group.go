package channel

import (
	"errors"
	"fmt"
	"strings"
	"zhongjyuan/gin-message-server/common"
	"zhongjyuan/gin-message-server/model"
)

// SendGroupMessage 用于向群组发送消息
//
// 输入参数：
//   - message: 消息实体，包含标题、内容、接收者等信息
//   - user: 用户实体，表示消息发送者
//   - channel_: 渠道实体，表示消息发送的渠道
//
// 输出参数：
//   - error: 发送消息过程中发生的错误，如果发送成功则返回 nil
func SendGroupMessage(message *model.MessageEntity, user *model.UserEntity, channel_ *model.ChannelEntity) error {
	// 将父渠道的AppId和AccountId分别拆分为子渠道和子目标
	subChannels := strings.Split(channel_.AppId, "|")
	subTargets := strings.Split(channel_.AccountId, "|")
	if len(subChannels) != len(subTargets) {
		return errors.New("无效的群组消息配置，子通道数量与子目标数量不一致")
	}

	errMessage := ""
	for i := 0; i < len(subChannels); i++ {
		// 设置消息的接收者和渠道为当前子通道和子目标
		message.To = subTargets[i]
		message.Channel = subChannels[i]

		// 获取当前子通道实体
		subChannel, err := model.GetChannelByName(subChannels[i], user.Id, false)
		if err != nil {
			return errors.New("获取群组消息子通道失败：" + err.Error())
		}

		// 检查子通道类型是否为群组
		if subChannel.Type == common.TypeGroup {
			return errors.New("群组消息子通道不能是群组消息")
		}

		// 发送消息到当前子通道
		if err = SendMessage(message, user, subChannel); err != nil {
			errMessage += fmt.Sprintf("发送群组消息子通道 %s 失败：%s\n", subChannels[i], err.Error())
		}
	}

	// 如果有发送失败的子通道，则返回错误信息
	if errMessage != "" {
		return errors.New(errMessage)
	}

	return nil
}
