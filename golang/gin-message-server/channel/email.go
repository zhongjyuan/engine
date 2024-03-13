package channel

import (
	"errors"
	"fmt"
	"strings"
	"zhongjyuan/gin-message-server/common"
	"zhongjyuan/gin-message-server/model"
)

// SendEmailMessage 用于向用户发送邮件消息
//
// 输入参数：
//   - message: 消息实体，包含标题、内容、接收者等信息
//   - user: 用户实体，表示消息接收用户
//   - channel_: 渠道实体，表示消息发送的渠道
//
// 输出参数：
//   - error: 发送消息过程中发生的错误，如果发送成功则返回 nil
func SendEmailMessage(message *model.MessageEntity, user *model.UserEntity, channel_ *model.ChannelEntity) error {
	// 检查是否需要发送邮件给其他人，权限检查
	if message.To != "" {
		if user.Profile.SendEmailToOthers != common.SendEmailToOthersAllowed && user.Role < common.RoleAdminUser {
			return errors.New("没有权限发送邮件给其他人，请联系管理员为你添加该权限")
		}
		user.Email = message.To
	}

	// 检查用户是否配置了邮箱地址
	if user.Email == "" {
		return errors.New("未配置邮箱地址")
	}

	// 设置邮件主题和内容
	subject := message.Title
	content := message.Content
	if subject == common.SystemName || subject == "" {
		subject = message.Description
	} else {
		content = fmt.Sprintf("描述：%s\n\n%s", message.Description, message.Content)
	}

	var err error
	// 将消息内容转换为HTML格式
	message.HTMLContent, err = common.ConvertMarkdownToHTML(content)
	if err != nil {
		common.SysLog(err.Error())
	}

	// 替换邮件地址中的分隔符
	user.Email = strings.ReplaceAll(user.Email, "|", ";")

	// 发送邮件
	return common.SendEmail(subject, user.Email, message.HTMLContent)
}
