package channel_openai

import relayModel "zhongjyuan/gin-one-api/relay/model"

// TextContent 结构体用于表示文本内容。
type TextContent struct {
	Type string `json:"type,omitempty"` // 内容类型
	Text string `json:"text,omitempty"` // 文本内容
}

// ImageContent 结构体用于表示图片内容。
type ImageContent struct {
	Type     string               `json:"type,omitempty"`      // 内容类型
	ImageURL *relayModel.ImageURL `json:"image_url,omitempty"` // 图片链接
}

// ChatRequest 结构体用于表示对话请求。
type ChatRequest struct {
	Model     string               `json:"relayModel"` // 模型名称
	Messages  []relayModel.Message `json:"messages"`   // 消息列表
	MaxTokens int                  `json:"max_tokens"` // 最大 token 数
}

// TextRequest 结构体用于表示文本请求。
type TextRequest struct {
	Model     string               `json:"relayModel"` // 模型名称
	Messages  []relayModel.Message `json:"messages"`   // 消息列表
	Prompt    string               `json:"prompt"`     // 提示内容
	MaxTokens int                  `json:"max_tokens"` // 最大 token 数
	// Stream   bool      `json:"stream"` // 是否流式处理
}

// ImageRequest 结构体用于表示图片请求。
// 更多信息请参考：https://platform.openai.com/docs/api-reference/images/create
type ImageRequest struct {
	Model          string `json:"relayModel"`                // 模型名称
	Prompt         string `json:"prompt" binding:"required"` // 提示内容
	N              int    `json:"n,omitempty"`               // 可选参数: n
	Size           string `json:"size,omitempty"`            // 可选参数: size
	Quality        string `json:"quality,omitempty"`         // 可选参数: quality
	ResponseFormat string `json:"response_format,omitempty"` // 可选参数: response_format
	Style          string `json:"style,omitempty"`           // 可选参数: style
	User           string `json:"user,omitempty"`            // 可选参数: user
}

// WhisperJSONResponse 结构体用于表示 Whisper JSON 响应的简要信息。
type WhisperJSONResponse struct {
	Text string `json:"text,omitempty"` // 文本内容
}

// WhisperVerboseJSONResponse 结构体用于表示 Whisper JSON 响应的详细信息。
type WhisperVerboseJSONResponse struct {
	Task     string    `json:"task,omitempty"`     // 任务
	Language string    `json:"language,omitempty"` // 语言
	Duration float64   `json:"duration,omitempty"` // 持续时间
	Text     string    `json:"text,omitempty"`     // 文本内容
	Segments []Segment `json:"segments,omitempty"` // 分段信息列表
}

// Segment 结构体用于表示分段信息。
type Segment struct {
	Id               int     `json:"id"`                // 分段 ID
	Seek             int     `json:"seek"`              // 查找值
	Start            float64 `json:"start"`             // 开始时间
	End              float64 `json:"end"`               // 结束时间
	Text             string  `json:"text"`              // 文本内容
	Tokens           []int   `json:"tokens"`            // Token 列表
	Temperature      float64 `json:"temperature"`       // 温度
	AvgLogprob       float64 `json:"avg_logprob"`       // 平均 log 概率
	CompressionRatio float64 `json:"compression_ratio"` // 压缩比
	NoSpeechProb     float64 `json:"no_speech_prob"`    // 无语音概率
}

// TextToSpeechRequest 结构体用于表示文本转语音请求。
type TextToSpeechRequest struct {
	Model          string  `json:"relayModel" binding:"required"` // 模型名称
	Input          string  `json:"input" binding:"required"`      // 输入文本
	Voice          string  `json:"voice" binding:"required"`      // 语音类型
	Speed          float64 `json:"speed"`                         // 语速
	ResponseFormat string  `json:"response_format"`               // 响应格式
}

// UsageOrResponseText 结构体用于表示使用情况或响应文本。
type UsageOrResponseText struct {
	*relayModel.Usage        // 使用情况
	ResponseText      string // 响应文本
}

// SlimTextResponse 结构体用于表示精简文本响应。
type SlimTextResponse struct {
	Choices          []TextResponseChoice `json:"choices"` // 选择列表
	relayModel.Usage `json:"usage"`       // 使用情况
	Error            relayModel.Error     `json:"error"` // 错误信息
}

// TextResponseChoice 结构体用于表示文本响应的选择。
type TextResponseChoice struct {
	Index              int              `json:"index"` // 索引
	relayModel.Message `json:"message"` // 消息
	FinishReason       string           `json:"finish_reason"` // 完成原因
}

// TextResponse 结构体用于表示文本响应。
type TextResponse struct {
	Id               string               `json:"id"`                   // ID
	Model            string               `json:"relayModel,omitempty"` // 模型名称
	Object           string               `json:"object"`               // 对象
	Created          int64                `json:"created"`              // 创建时间
	Choices          []TextResponseChoice `json:"choices"`              // 选择列表
	relayModel.Usage `json:"usage"`       // 使用情况
}

// EmbeddingResponseItem 结构体用于表示嵌入响应项。
type EmbeddingResponseItem struct {
	Object    string    `json:"object"`    // 对象
	Index     int       `json:"index"`     // 索引
	Embedding []float64 `json:"embedding"` // 嵌入信息
}

// EmbeddingResponse 结构体用于表示嵌入响应。
type EmbeddingResponse struct {
	Object           string                  `json:"object"`     // 对象
	Data             []EmbeddingResponseItem `json:"data"`       // 数据
	Model            string                  `json:"relayModel"` // 模型名称
	relayModel.Usage `json:"usage"`          // 使用情况
}

// ImageResponse 结构体用于表示图片响应。
type ImageResponse struct {
	Created int `json:"created"` // 创建时间
	Data    []struct {
		Url string `json:"url"` // 图片链接
	}
}

// ChatCompletionsStreamResponseChoice 结构体用于表示对话完成流的响应选择。
type ChatCompletionsStreamResponseChoice struct {
	Index int `json:"index"` // 索引
	Delta struct {
		Content string `json:"content"`        // 内容
		Role    string `json:"role,omitempty"` // 角色
	} `json:"delta"` // 变化
	FinishReason *string `json:"finish_reason,omitempty"` // 完成原因
}

// ChatCompletionsStreamResponse 结构体用于表示对话完成流的响应。
type ChatCompletionsStreamResponse struct {
	Id      string                                `json:"id"`         // ID
	Object  string                                `json:"object"`     // 对象
	Created int64                                 `json:"created"`    // 创建时间
	Model   string                                `json:"relayModel"` // 模型名称
	Choices []ChatCompletionsStreamResponseChoice `json:"choices"`    // 选择列表
}

// CompletionsStreamResponse 结构体用于表示完成流的响应。
type CompletionsStreamResponse struct {
	Choices []struct {
		Text         string `json:"text"`          // 文本内容
		FinishReason string `json:"finish_reason"` // 完成原因
	} `json:"choices"`
}
