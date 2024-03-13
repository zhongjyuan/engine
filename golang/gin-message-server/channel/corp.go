package channel

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"zhongjyuan/gin-message-server/model"
)

// corpMessageRequest 用于定义企业微信消息请求结构体
type corpMessageRequest struct {
	MessageType string   `json:"msgtype"` // 消息类型
	Text        struct { // 文本消息结构体
		Content string `json:"content"` // 文本内容
	} `json:"text"`
	Markdown struct { // Markdown消息结构体
		Content string `json:"content"` // Markdown内容
	} `json:"markdown"`
	MentionedList []string `json:"mentioned_list"` // 提及的用户列表
}

// corpMessageResponse 用于定义企业微信消息响应结构体
type corpMessageResponse struct {
	Code    int    `json:"errcode"` // 响应状态码
	Message string `json:"errmsg"`  // 响应消息
}

// SendCorpMessage 用于发送企业微信消息到指定渠道
//
// 输入参数：
//   - message: 消息实体，包含标题、内容和URL信息
//   - user: 用户实体，表示消息接收用户
//   - channel_: 渠道实体，表示消息发送的渠道
//
// 输出参数：
//   - error: 发送消息过程中发生的错误，如果发送成功则返回 nil
func SendCorpMessage(message *model.MessageEntity, user *model.UserEntity, channel_ *model.ChannelEntity) error {
	// 创建企业微信消息请求结构体
	messageRequest := corpMessageRequest{
		MessageType: "text",
	}

	// 根据消息内容是否为空设置消息类型和内容
	if message.Content == "" {
		messageRequest.MessageType = "text"
		messageRequest.Text.Content = message.Description
	} else {
		messageRequest.MessageType = "markdown"
		messageRequest.Markdown.Content = message.Content
	}

	// 如果有指定@的用户，则设置提及的用户列表
	if message.To != "" {
		messageRequest.MentionedList = strings.Split(message.To, "|")
	}

	// 将消息请求结构体转换为JSON格式
	jsonData, err := json.Marshal(messageRequest)
	if err != nil {
		return err
	}

	// 发起POST请求发送企业微信消息
	resp, err := http.Post(channel_.URL, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}

	// 解析响应数据
	var res corpMessageResponse
	if err = json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return err
	}

	// 根据响应状态码判断是否发送成功
	if res.Code != 0 {
		return errors.New(res.Message)
	}
	return nil
}
