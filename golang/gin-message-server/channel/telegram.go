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

var TelegramMaxMessageLength = 4096

type telegramMessageRequest struct {
	ChatId    string `json:"chat_id"`
	Text      string `json:"text"`
	ParseMode string `json:"parse_mode"`
}

type telegramMessageResponse struct {
	Ok          bool   `json:"ok"`
	Description string `json:"description"`
}

func SendTelegramMessage(message *model.MessageEntity, user *model.UserEntity, channel_ *model.ChannelEntity) error {
	// https://core.telegram.org/bots/api#sendmessage
	messageRequest := telegramMessageRequest{
		ChatId: channel_.AccountId,
	}
	if message.To != "" {
		messageRequest.ChatId = message.To
	}
	if message.Content == "" {
		messageRequest.Text = message.Description
	} else {
		messageRequest.Text = message.Content
		messageRequest.ParseMode = "markdown"
	}
	text := messageRequest.Text
	idx := 0
	for idx < len(text) {
		nextIdx := idx + TelegramMaxMessageLength
		if nextIdx > len(text) {
			// we have reach the end, must be valid
			nextIdx = len(text)
		} else {
			nextIdx = getNearestValidSplit(text, nextIdx, messageRequest.ParseMode)
		}
		messageRequest.Text = text[idx:nextIdx]
		idx = nextIdx
		jsonData, err := json.Marshal(messageRequest)
		if err != nil {
			return err
		}
		resp, err := http.Post(fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", channel_.Secret), "application/json",
			bytes.NewBuffer(jsonData))
		if err != nil {
			return err
		}
		var res telegramMessageResponse
		err = json.NewDecoder(resp.Body).Decode(&res)
		if err != nil {
			return err
		}
		if !res.Ok {
			return errors.New(res.Description)
		}
	}
	return nil
}

func getNearestValidSplit(s string, idx int, mode string) int {
	if mode == "markdown" {
		return getMarkdownNearestValidSplit(s, idx)
	} else {
		return getPlainTextNearestValidSplit(s, idx)
	}
}

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
	// unable to find a '\n'
	return idx
}
