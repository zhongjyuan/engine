package channel_zhipu

import (
	"time"
	relaymodel "zhongjyuan/gin-ai-server/relay/model"
)

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type Request struct {
	Prompt      []Message `json:"prompt"`
	Temperature float64   `json:"temperature,omitempty"`
	TopP        float64   `json:"top_p,omitempty"`
	RequestId   string    `json:"request_id,omitempty"`
	Incremental bool      `json:"incremental,omitempty"`
}

type ResponseData struct {
	TaskId           string    `json:"task_id"`
	RequestId        string    `json:"request_id"`
	TaskStatus       string    `json:"task_status"`
	Choices          []Message `json:"choices"`
	relaymodel.Usage `json:"usage"`
}

type Response struct {
	Code    int          `json:"code"`
	Msg     string       `json:"msg"`
	Success bool         `json:"success"`
	Data    ResponseData `json:"data"`
}

type StreamMetaResponse struct {
	RequestId        string `json:"request_id"`
	TaskId           string `json:"task_id"`
	TaskStatus       string `json:"task_status"`
	relaymodel.Usage `json:"usage"`
}

type tokenData struct {
	Token      string
	ExpiryTime time.Time
}
