package channel

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"zhongjyuan/gin-message-server/model"
)

type barkMessageRequest struct {
	Title string `json:"title"`
	Body  string `json:"body"`
	URL   string `json:"url"`
}

type barkMessageResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func SendBarkMessage(message *model.MessageEntity, user *model.UserEntity, channel_ *model.ChannelEntity) error {
	url := fmt.Sprintf("%s/%s", channel_.URL, channel_.Secret)
	req := barkMessageRequest{
		Title: message.Title,
		Body:  message.Content,
		URL:   message.URL,
	}
	if message.Content == "" {
		req.Body = message.Description
	}
	reqBody, err := json.Marshal(req)
	if err != nil {
		return err
	}
	resp, err := http.Post(url, "application/json", bytes.NewReader(reqBody))
	if err != nil {
		return err
	}
	var res barkMessageResponse
	err = json.NewDecoder(resp.Body).Decode(&res)
	if err != nil {
		return err
	}
	if res.Code != 200 {
		return errors.New(res.Message)
	}
	return nil
}
