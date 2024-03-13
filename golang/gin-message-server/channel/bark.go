package channel

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"zhongjyuan/gin-message-server/model"
)

// barkMessageRequest 用于定义推送消息请求结构体
type barkMessageRequest struct {
	Title string `json:"title"` // 标题字段
	Body  string `json:"body"`  // 正文字段
	URL   string `json:"url"`   // URL字段
}

// barkMessageResponse 用于定义推送消息响应结构体
type barkMessageResponse struct {
	Code    int    `json:"code"`    // 响应状态码
	Message string `json:"message"` // 响应消息
}

// SendBarkMessage 用于发送推送消息到指定渠道
//
// 输入参数：
//   - message: 消息实体，包含标题、内容和URL信息
//   - user: 用户实体，表示消息接收用户
//   - channel_: 渠道实体，表示消息发送的渠道
//
// 输出参数：
//   - error: 发送消息过程中发生的错误，如果发送成功则返回 nil
func SendBarkMessage(message *model.MessageEntity, user *model.UserEntity, channel_ *model.ChannelEntity) error {
	// 构建请求URL
	url := fmt.Sprintf("%s/%s", channel_.URL, channel_.Secret)

	// 构建推送消息请求结构体
	req := barkMessageRequest{
		Title: message.Title,
		Body:  message.Content,
		URL:   message.URL,
	}

	// 如果消息内容为空，则使用描述作为正文
	if message.Content == "" {
		req.Body = message.Description
	}

	// 将请求结构体转换为JSON格式
	reqBody, err := json.Marshal(req)
	if err != nil {
		return err
	}

	// 发起POST请求发送推送消息
	resp, err := http.Post(url, "application/json", bytes.NewReader(reqBody))
	if err != nil {
		return err
	}

	// 解析响应数据
	var res barkMessageResponse
	if err = json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return err
	}

	// 根据响应状态码判断是否发送成功
	if res.Code != 200 {
		return errors.New(res.Message)
	}

	return nil
}
