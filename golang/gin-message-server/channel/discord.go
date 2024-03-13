package channel

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"zhongjyuan/gin-message-server/model"
)

// discordMessageRequest 用于表示向Discord发送消息的请求结构体
type discordMessageRequest struct {
	Content string `json:"content"` // 消息内容
}

// discordMessageResponse 用于表示Discord消息发送的响应结构体
type discordMessageResponse struct {
	Code    int    `json:"code"`    // 响应状态码
	Message string `json:"message"` // 响应消息
}

// SendDiscordMessage 用于向Discord发送消息
//
// 输入参数：
//   - message: 消息实体，包含标题、内容、接收者等信息
//   - user: 用户实体，表示消息接收用户
//   - channel_: 渠道实体，表示消息发送的渠道
//
// 输出参数：
//   - error: 发送消息过程中发生的错误，如果发送成功则返回 nil
func SendDiscordMessage(message *model.MessageEntity, user *model.UserEntity, channel_ *model.ChannelEntity) error {
	// 如果内容为空，则使用描述作为内容
	if message.Content == "" {
		message.Content = message.Description
	}

	// 构建Discord消息请求结构体
	messageRequest := discordMessageRequest{
		Content: message.Content,
	}

	// 根据消息接收者设置消息内容
	if message.To != "" {
		messageRequest.Content = ""
		ids := strings.Split(message.To, "|")
		for _, id := range ids {
			messageRequest.Content = "<@" + id + "> " + messageRequest.Content
		}
		messageRequest.Content = messageRequest.Content + message.Content
	}

	// 将消息请求结构体转换为JSON格式
	jsonData, err := json.Marshal(messageRequest)
	if err != nil {
		return err
	}

	// 发起POST请求发送Discord消息
	resp, err := http.Post(channel_.URL, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}

	// 检查响应状态码，如果是204表示成功
	if resp.StatusCode == http.StatusNoContent {
		return nil
	}

	// 解析响应的结构体
	var res discordMessageResponse
	err = json.NewDecoder(resp.Body).Decode(&res)
	if err != nil {
		return err
	}

	// 检查响应中的状态码和消息，如果不成功则返回错误
	if res.Code != 0 {
		return errors.New(res.Message)
	}

	// 如果状态码是400，则返回状态信息
	if resp.StatusCode == http.StatusBadRequest {
		return errors.New(resp.Status)
	}

	return nil
}
