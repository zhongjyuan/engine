package channel_baidu

import (
	"time"
	relayModel "zhongjyuan/gin-one-api/relay/model"
)

type TokenResponse struct {
	ExpiresIn   int    `json:"expires_in"`
	AccessToken string `json:"access_token"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ChatRequest struct {
	Messages []Message `json:"messages"`
	Stream   bool      `json:"stream"`
	UserId   string    `json:"user_id,omitempty"`
}

type Error struct {
	ErrorCode int    `json:"error_code"`
	ErrorMsg  string `json:"error_msg"`
}

type ChatResponse struct {
	Id               string           `json:"id"`
	Object           string           `json:"object"`
	Created          int64            `json:"created"`
	Result           string           `json:"result"`
	IsTruncated      bool             `json:"is_truncated"`
	NeedClearHistory bool             `json:"need_clear_history"`
	Usage            relayModel.Usage `json:"usage"`
	Error
}

type ChatStreamResponse struct {
	ChatResponse
	SentenceId int  `json:"sentence_id"`
	IsEnd      bool `json:"is_end"`
}

type EmbeddingRequest struct {
	Input []string `json:"input"`
}

type EmbeddingData struct {
	Object    string    `json:"object"`
	Embedding []float64 `json:"embedding"`
	Index     int       `json:"index"`
}

type EmbeddingResponse struct {
	Id      string           `json:"id"`
	Object  string           `json:"object"`
	Created int64            `json:"created"`
	Data    []EmbeddingData  `json:"data"`
	Usage   relayModel.Usage `json:"usage"`
	Error
}

type AccessToken struct {
	AccessToken      string    `json:"access_token"`
	Error            string    `json:"error,omitempty"`
	ErrorDescription string    `json:"error_description,omitempty"`
	ExpiresIn        int64     `json:"expires_in,omitempty"`
	ExpiresAt        time.Time `json:"-"`
}
