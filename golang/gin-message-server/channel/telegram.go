package channel

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"unicode/utf8"
	"zhongjyuan/gin-message-server/model"
)

// TelegramMaxMessageLength 定义 Telegram 消息的最大长度为 4096 字符。
var TelegramMaxMessageLength = 4096

// telegramMessageRequest 结构体表示向 Telegram 发送消息的请求格式。
type telegramMessageRequest struct {
	ChatId    string `json:"chat_id"`    // 聊天 ID
	Text      string `json:"text"`       // 消息文本内容
	ParseMode string `json:"parse_mode"` // 解析模式
}

// telegramMessageResponse 结构体表示 Telegram 发送消息的响应格式。
type telegramMessageResponse struct {
	Ok          bool   `json:"ok"`          // 响应状态，true 表示成功
	Description string `json:"description"` // 描述信息
}

// SendTelegramMessage 用于向 Telegram 发送消息。
//
// 输入参数：
//   - message *model.MessageEntity: 消息实体
//   - user *model.UserEntity: 用户实体
//   - channel_ *model.ChannelEntity: 渠道实体
//
// 输出参数：
//   - error: 如果发送消息过程中出现错误，则返回相应的错误信息；否则返回 nil。
func SendTelegramMessage(message *model.MessageEntity, user *model.UserEntity, channel_ *model.ChannelEntity) error {
	// 创建 Telegram 消息请求体
	messageRequest := telegramMessageRequest{
		ChatId: channel_.AccountId,
	}

	// 如果指定了接收消息的用户，则将消息发送给该用户
	if message.To != "" {
		messageRequest.ChatId = message.To
	}

	// 根据消息内容和描述设置消息文本和解析模式
	if message.Content == "" {
		messageRequest.Text = message.Description
	} else {
		messageRequest.Text = message.Content
		messageRequest.ParseMode = "markdown"
	}
	text := messageRequest.Text

	// 分割较长的消息为多条消息发送
	idx := 0
	for idx < len(text) {
		nextIdx := idx + TelegramMaxMessageLength
		if nextIdx > len(text) {
			// 已达到文本末尾，必须是有效的分割点
			nextIdx = len(text)
		} else {
			nextIdx = getNearestValidSplit(text, nextIdx, messageRequest.ParseMode)
		}

		// 设置当前分割点的文本并更新索引
		messageRequest.Text = text[idx:nextIdx]
		idx = nextIdx

		// 将消息请求体转为 JSON 数据
		jsonData, err := json.Marshal(messageRequest)
		if err != nil {
			return err
		}

		// 向 Telegram 发送 POST 请求发送消息
		resp, err := http.Post(fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", channel_.Secret), "application/json", bytes.NewBuffer(jsonData))
		if err != nil {
			return err
		}

		// 解析响应数据
		var res telegramMessageResponse
		if err = json.NewDecoder(resp.Body).Decode(&res); err != nil {
			return err
		}

		// 检查响应是否成功，如果失败则返回错误信息
		if !res.Ok {
			return errors.New(res.Description)
		}
	}

	return nil
}

// getNearestValidSplit 用于获取最近的有效分割点。
//
// 输入参数：
//   - s string: 需要分割的字符串
//   - idx int: 当前索引位置
//   - mode string: 解析模式（"markdown" 或 "plain"）
//
// 输出参数：
//   - int: 最近的有效分割点的索引位置
func getNearestValidSplit(s string, idx int, mode string) int {
	if mode == "markdown" {
		return getMarkdownNearestValidSplit(s, idx)
	} else {
		return getPlainTextNearestValidSplit(s, idx)
	}
}

// getPlainTextNearestValidSplit 用于获取纯文本模式下最近的有效分割点索引。
//
// 输入参数：
//   - s string: 需要分割的字符串
//   - idx int: 当前索引位置
//
// 输出参数：
//   - int: 最近的有效分割点的索引位置
func getPlainTextNearestValidSplit(s string, idx int) int {
	if idx >= len(s) {
		return idx
	}

	if idx == 0 {
		return 0
	}

	isStartByte := utf8.RuneStart(s[idx])
	if isStartByte {
		return idx
	} else {
		return getPlainTextNearestValidSplit(s, idx-1)
	}
}

// getMarkdownNearestValidSplit 用于获取 Markdown 模式下最近的有效分割点索引。
//
// 输入参数：
//   - s string: 需要分割的字符串
//   - idx int: 当前索引位置
//
// 输出参数：
//   - int: 最近的有效分割点的索引位置
func getMarkdownNearestValidSplit(s string, idx int) int {
	if idx >= len(s) {
		return idx
	}

	if idx == 0 {
		return 0
	}

	for i := idx; i >= 0; i-- {
		if s[i] == '\n' {
			return i + 1
		}
	}

	// 未找到 '\n'
	return idx
}
