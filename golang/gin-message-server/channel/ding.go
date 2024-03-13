package channel

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"
	"zhongjyuan/gin-message-server/model"
)

// dingMessageRequest 用于定义钉钉消息请求的结构体
type dingMessageRequest struct {
	MessageType string `json:"msgtype"` // 消息类型，可以是"text"或"markdown"
	Text        struct {
		Content string `json:"content"` // 文本消息内容
	} `json:"text"`
	Markdown struct {
		Title string `json:"title"` // Markdown消息标题
		Text  string `json:"text"`  // Markdown消息内容
	} `json:"markdown"`
	At struct {
		AtUserIds []string `json:"atUserIds"` // @的用户ID列表
		IsAtAll   bool     `json:"isAtAll"`   // 是否@所有人
	}
}

// dingMessageResponse 用于定义钉钉消息响应的结构体
type dingMessageResponse struct {
	Code    int    `json:"errcode"` // 错误码，0表示成功，非0表示失败
	Message string `json:"errmsg"`  // 错误信息描述
}

// SendDingMessage 用于通过钉钉发送消息给指定用户
//
// 输入参数：
//   - message: 消息实体，包含标题、内容、接收者等信息
//   - user: 用户实体，表示消息接收用户
//   - channel_: 渠道实体，表示消息发送的渠道
//
// 输出参数：
//   - error: 发送消息过程中发生的错误，如果发送成功则返回 nil
func SendDingMessage(message *model.MessageEntity, user *model.UserEntity, channel_ *model.ChannelEntity) error {
	// 构建钉钉消息请求的结构体
	messageRequest := dingMessageRequest{
		MessageType: "text",
	}

	// 根据消息内容判断消息类型并设置相应字段
	if message.Content == "" {
		messageRequest.MessageType = "text"
		messageRequest.Text.Content = message.Description
	} else {
		messageRequest.MessageType = "markdown"
		messageRequest.Markdown.Title = message.Title
		messageRequest.Markdown.Text = message.Content
	}

	// 根据消息接收者设置@相关字段
	if message.To != "" {
		if message.To == "@all" {
			messageRequest.At.IsAtAll = true
		} else {
			messageRequest.At.AtUserIds = strings.Split(message.To, "|")
		}
	}

	// 生成时间戳和签名
	timestamp := time.Now().UnixMilli()
	sign, err := dingSign(channel_.Secret, timestamp)
	if err != nil {
		return err
	}

	// 将消息请求结构体转换为JSON格式
	jsonData, err := json.Marshal(messageRequest)
	if err != nil {
		return err
	}

	// 发起POST请求发送钉钉消息
	resp, err := http.Post(fmt.Sprintf("%s&timestamp=%d&sign=%s", channel_.URL, timestamp, sign), "application/json",
		bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}

	// 解析钉钉消息响应的结构体
	var res dingMessageResponse
	if err = json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return err
	}

	// 检查钉钉消息响应是否成功，如果不成功则返回错误
	if res.Code != 0 {
		return errors.New(res.Message)
	}
	return nil
}

// dingSign 用于生成钉钉消息签名
//
// 输入参数：
//   - secret: 钉钉机器人的密钥
//   - timestamp: 时间戳
//
// 输出参数：
//   - string: 生成的签名字符串
//   - error: 生成签名过程中发生的错误，如果生成成功则返回 nil
func dingSign(secret string, timestamp int64) (string, error) {
	// 构建待签名的字符串
	stringToSign := fmt.Sprintf("%d\n%s", timestamp, secret)

	// 创建HMAC对象，并将密钥设置为秘钥
	h := hmac.New(sha256.New, []byte(secret))

	// 写入待签名的字符串
	_, err := h.Write([]byte(stringToSign))
	if err != nil {
		return "", err
	}

	// 计算HMAC的摘要并进行Base64编码
	signature := base64.StdEncoding.EncodeToString(h.Sum(nil))

	// 对签名进行URL编码
	signature = url.QueryEscape(signature)

	return signature, nil
}
