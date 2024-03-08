package channel

import (
	"bytes"
	"errors"
	"net/http"
	"strings"
	"zhongjyuan/gin-message-server/common"
	"zhongjyuan/gin-message-server/model"
)

func SendCustomMessage(message *model.MessageEntity, user *model.UserEntity, channel_ *model.ChannelEntity) error {
	url := channel_.URL
	if strings.HasPrefix(url, "http:") {
		return errors.New("自定义通道必须使用 HTTPS 协议")
	}
	if strings.HasPrefix(url, common.ServerAddress) {
		return errors.New("自定义通道不能使用本服务地址")
	}
	template := channel_.Other
	template = strings.Replace(template, "$url", message.URL, -1)
	template = strings.Replace(template, "$to", message.To, -1)
	template = strings.Replace(template, "$title", message.Title, -1)
	template = strings.Replace(template, "$description", message.Description, -1)
	template = strings.Replace(template, "$content", message.Content, -1)
	reqBody := []byte(template)
	resp, err := http.Post(url, "application/json", bytes.NewReader(reqBody))
	if err != nil {
		return err
	}
	if resp.StatusCode != 200 {
		return errors.New(resp.Status)
	}
	return nil
}
