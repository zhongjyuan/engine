package channel

import (
	"bytes"
	"errors"
	"net/http"
	"strings"
	"zhongjyuan/gin-message-server/common"
	"zhongjyuan/gin-message-server/model"
)

// SendCustomMessage 用于通过自定义通道发送消息给指定用户
//
// 输入参数：
//   - message: 消息实体，包含标题、内容、URL等信息
//   - user: 用户实体，表示消息接收用户
//   - channel_: 渠道实体，表示消息发送的渠道
//
// 输出参数：
//   - error: 发送消息过程中发生的错误，如果发送成功则返回 nil
func SendCustomMessage(message *model.MessageEntity, user *model.UserEntity, channel_ *model.ChannelEntity) error {
	// 获取通道的URL地址
	url := channel_.URL

	// 检查通道是否使用了HTTP协议，如果是则返回错误
	if strings.HasPrefix(url, "http:") {
		return errors.New("自定义通道必须使用 HTTPS 协议")
	}

	// 检查通道是否使用了本服务地址作为URL，如果是则返回错误
	if strings.HasPrefix(url, common.ServerAddress) {
		return errors.New("自定义通道不能使用本服务地址")
	}

	// 替换模板中的变量为实际消息内容
	template := channel_.Other
	template = strings.Replace(template, "$url", message.URL, -1)
	template = strings.Replace(template, "$to", message.To, -1)
	template = strings.Replace(template, "$title", message.Title, -1)
	template = strings.Replace(template, "$description", message.Description, -1)
	template = strings.Replace(template, "$content", message.Content, -1)

	// 构建请求Body
	reqBody := []byte(template)

	// 发起POST请求发送自定义消息
	resp, err := http.Post(url, "application/json", bytes.NewReader(reqBody))
	if err != nil {
		return err
	}

	// 检查响应状态码，非200则返回错误
	if resp.StatusCode != 200 {
		return errors.New(resp.Status)
	}

	return nil
}
