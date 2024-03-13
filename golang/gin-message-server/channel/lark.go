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
	"strconv"
	"strings"
	"time"
	"zhongjyuan/gin-message-server/model"
)

// larkMessageRequestCardElementText 结构体定义了卡片元素文本的结构
type larkMessageRequestCardElementText struct {
	Content string `json:"content"` // 文本内容
	Tag     string `json:"tag"`     // 文本标签
}

// larkMessageRequestCardElement 结构体定义了卡片元素的结构
type larkMessageRequestCardElement struct {
	Tag  string                            `json:"tag"`  // 元素标签
	Text larkMessageRequestCardElementText `json:"text"` // 文本元素
}

// larkTextContent 结构体定义了文本内容的结构
type larkTextContent struct {
	Text string `json:"text"` // 文本内容
}

// larkCardContent 结构体定义了卡片内容的结构
type larkCardContent struct {
	Config struct {
		WideScreenMode bool `json:"wide_screen_mode"` // 是否启用宽屏模式
		EnableForward  bool `json:"enable_forward"`   // 是否启用转发功能
	}
	Elements []larkMessageRequestCardElement `json:"elements"` // 卡片元素列表
}

// larkMessageRequest 结构体定义了飞书消息发送请求的结构
type larkMessageRequest struct {
	MessageType string          `json:"msg_type"`  // 消息类型
	Timestamp   string          `json:"timestamp"` // 时间戳
	Sign        string          `json:"sign"`      // 签名
	Content     larkTextContent `json:"content"`   // 文本内容
	Card        larkCardContent `json:"card"`      // 卡片内容
}

// larkMessageResponse 结构体定义了飞书消息发送响应的结构
type larkMessageResponse struct {
	Code    int    `json:"code"` // 响应状态码
	Message string `json:"msg"`  // 响应消息
}

// getLarkAtPrefix 函数用于生成飞书消息中at某些用户的前缀字符串
//
// 输入参数：
//   - message *model.MessageEntity: 消息实体对象，包含消息内容和描述等信息
//
// 输出参数：
//   - string: 包含at用户前缀字符串的结果
func getLarkAtPrefix(message *model.MessageEntity) string {
	atPrefix := ""
	if message.To != "" {
		if message.To == "@all" {
			atPrefix = "<at userId=\"all\">所有人</at>"
		} else {
			ids := strings.Split(message.To, "|")
			for _, id := range ids {
				atPrefix += fmt.Sprintf("<at userId=\"%s\"> </at>", id)
			}
		}
	}
	return atPrefix
}

// SendLarkMessage 函数用于发送飞书消息
//
// 输入参数：
//   - message *model.MessageEntity: 消息实体对象，包含消息内容和描述等信息
//   - user *model.UserEntity: 用户实体对象，用于获取用户相关信息
//   - channel_ *model.ChannelEntity: 渠道实体对象，包含渠道相关信息
//
// 输出参数：
//   - error: 发送消息过程中遇到的错误，如果成功发送消息则为nil，否则为发送消息失败的详细信息
func SendLarkMessage(message *model.MessageEntity, user *model.UserEntity, channel_ *model.ChannelEntity) error {
	// 构建飞书消息请求结构体
	messageRequest := larkMessageRequest{
		MessageType: "text",
	}

	// 生成at前缀字符串
	atPrefix := getLarkAtPrefix(message)

	if message.Content == "" {
		// 构建文本消息
		messageRequest.MessageType = "text"
		messageRequest.Content.Text = atPrefix + message.Description
	} else {
		// 构建交互卡片消息
		messageRequest.MessageType = "interactive"
		messageRequest.Card.Config.WideScreenMode = true
		messageRequest.Card.Config.EnableForward = true
		messageRequest.Card.Elements = append(messageRequest.Card.Elements, larkMessageRequestCardElement{
			Tag: "div",
			Text: larkMessageRequestCardElementText{
				Content: atPrefix + message.Content,
				Tag:     "lark_md",
			},
		})
	}

	// 获取当前时间戳和签名
	now := time.Now()
	timestamp := now.Unix()
	sign, err := larkSign(channel_.Secret, timestamp)
	if err != nil {
		return err
	}

	messageRequest.Sign = sign
	messageRequest.Timestamp = strconv.FormatInt(timestamp, 10)
	jsonData, err := json.Marshal(messageRequest)
	if err != nil {
		return err
	}

	// 发送POST请求
	resp, err := http.Post(channel_.URL, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}

	// 解析响应数据
	var res larkMessageResponse
	if err = json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return err
	}

	// 检查响应状态码
	if res.Code != 0 {
		return errors.New(res.Message)
	}
	return nil
}

// larkSign 函数用于生成飞书消息签名
//
// 输入参数：
//   - secret string: 用于生成签名的密钥
//   - timestamp int64: 时间戳，用于生成签名
//
// 输出参数：
//   - string: 生成的签名字符串
//   - error: 生成签名过程中遇到的错误，如果成功生成签名则为nil，否则为生成签名失败的详细信息
func larkSign(secret string, timestamp int64) (string, error) {
	// https://open.feishu.cn/document/ukTMukTMukTM/ucTM5YjL3ETO24yNxkjN?lang=zh-CN

	// 拼接待签名字符串
	stringToSign := fmt.Sprintf("%v", timestamp) + "\n" + secret

	var data []byte                                 // 待签名数据为空
	h := hmac.New(sha256.New, []byte(stringToSign)) // 使用SHA256算法创建HMAC对象
	if _, err := h.Write(data); err != nil {
		return "", err
	}

	signature := base64.StdEncoding.EncodeToString(h.Sum(nil)) // 对签名结果进行Base64编码
	return signature, nil
}
