package message

import (
	"os"
	"path/filepath"
	"strings"
	"zhongjyuan/wechatgpt/core"
)

// IFileMessageHandler 文件消息处理
type IFileMessageHandler struct{}

// 此行代码用于确保 IFileMessageHandler 类型实现了 IMessageHandler 接口。
var _ IMessageHandler = (*IFileMessageHandler)(nil)

// FileMessageHandler 函数用于创建文件消息处理器实例。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - IMessageHandler: 返回 IFileMessageHandler 实例作为 IMessageHandler 接口。
func FileMessageHandler() IMessageHandler {
	// 返回 IFileMessageHandler 实例指针作为 IMessageHandler 接口
	return &IFileMessageHandler{}
}

// Handle 方法用于处理文件消息。
//
// 输入参数：
//   - message: 要处理的消息对象。
//
// 输出参数：
//   - error: 如果处理过程中发生错误，则返回非空的 error；否则返回 nil。
func (handler *IFileMessageHandler) Handle(message *core.Message) error {

	// 获取文件名
	fileName := message.FileName
	if fileName == "" {
		fileName = message.MsgId
	}

	// 判断并添加拓展名
	if !strings.Contains(fileName, ".") {
		switch {
		case message.IsPicture():
			fileName += ".PNG"
		case message.IsVideo():
			fileName += ".MP4"
		case message.IsVoice():
			fileName += ".MP3"
		}
	}

	// 获取消息发送者信息
	sender, err := message.Sender()
	if err != nil {
		return err
	}

	// 拼接文件路径
	var filePath = sender.NickName

	// 是否来自群消息
	if message.IsFromGroup() {
		groupSender, err := message.SenderInGroup()
		if err != nil {
			return err
		}

		filePath = filepath.Join(sender.NickName, groupSender.NickName)
	}

	// 获取当前项目路径
	currentDir, err := os.Getwd()
	if err != nil {
		return err
	}

	// 保存文件到本地
	message.SaveFileToLocal(filepath.Join(currentDir, filePath, fileName))

	// 其他类型消息暂不处理，直接返回 nil
	return nil
}
