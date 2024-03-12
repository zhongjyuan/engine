package channel

import (
	"errors"
	"fmt"
	"strings"
	"zhongjyuan/gin-message-server/common"
	"zhongjyuan/gin-message-server/model"
)

func SendEmailMessage(message *model.MessageEntity, user *model.UserEntity, channel_ *model.ChannelEntity) error {
	if message.To != "" {
		if user.Profile.SendEmailToOthers != common.SendEmailToOthersAllowed && user.Role < common.RoleAdminUser {
			return errors.New("没有权限发送邮件给其他人，请联系管理员为你添加该权限")
		}
		user.Email = message.To
	}
	if user.Email == "" {
		return errors.New("未配置邮箱地址")
	}
	subject := message.Title
	content := message.Content
	if subject == common.SystemName || subject == "" {
		subject = message.Description
	} else {
		content = fmt.Sprintf("描述：%s\n\n%s", message.Description, message.Content)
	}
	var err error
	message.HTMLContent, err = common.ConvertMarkdownToHTML(content)
	if err != nil {
		common.SysLog(err.Error())
	}
	user.Email = strings.ReplaceAll(user.Email, "|", ";")
	return common.SendEmail(subject, user.Email, message.HTMLContent)
}
