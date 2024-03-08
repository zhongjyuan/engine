package relaymodel

import relaycommon "zhongjyuan/gin-ai-server/relay/common"

// AIMessage 结构体表示消息对象。
type AIMessage struct {
	Role    string  `json:"role"`           // 角色
	Content any     `json:"content"`        // 内容
	Name    *string `json:"name,omitempty"` // 名称，omitempty 表示如果为空则不输出该字段
}

// ImageURL 结构体用于表示包含图片 URL 和详细描述的信息。
type ImageURL struct {
	Url    string `json:"url,omitempty"`    // 图片的 URL 地址，omitempty 表示在 JSON 编码时如果该字段为空则忽略
	Detail string `json:"detail,omitempty"` // 图片的详细描述，omitempty 表示在 JSON 编码时如果该字段为空则忽略
}

// AIMessageContent 结构体用于表示消息内容，包括消息类型、文本内容和图片 URL。
type AIMessageContent struct {
	Type     string    `json:"type,omitempty"`      // 消息类型，omitempty 表示在 JSON 编码时如果该字段为空则忽略
	Text     string    `json:"text"`                // 文本内容，不可为空
	ImageURL *ImageURL `json:"image_url,omitempty"` // 图片 URL 结构体指针，omitempty 表示在 JSON 编码时如果该字段为空则忽略
}

// IsStringContent 方法用于判断消息的内容是否为字符串类型。
//
// 输入参数：
//   - message AIMessage：要判断的消息对象。
// 输出参数：
//   - bool：如果消息的内容为字符串类型，则返回 true；否则返回 false。
func (message AIMessage) IsStringContent() bool {
	_, ok := message.Content.(string) // 尝试将内容转换为字符串类型
	return ok
}

// StringContent 方法用于获取消息的字符串内容。
//
// 输入参数：
//   - message AIMessage：要获取内容的消息对象。
// 输出参数：
//   - string：消息的字符串内容，如果内容为字符串类型或包含文本类型的列表，则返回拼接后的字符串；否则返回空字符串。
func (message AIMessage) StringContent() string {
	content, ok := message.Content.(string)
	if ok {
		return content // 如果内容本身就是字符串类型，则直接返回
	}

	contentList, ok := message.Content.([]interface{})
	if ok {
		var contentStr string
		for _, contentItem := range contentList {
			contentMap, ok := contentItem.(map[string]interface{})
			if !ok {
				continue
			}

			if contentMap["type"] == relaycommon.ContentTypeText {
				if subStr, ok := contentMap["text"].(string); ok {
					contentStr += subStr // 将文本类型的内容拼接起来
				}
			}
		}
		return contentStr
	}

	return "" // 如果内容既不是字符串类型，也不是包含文本类型的列表，则返回空字符串
}

// ParseContent 方法用于解析消息的内容并返回消息内容列表。
//
// 输入参数：
//   - message AIMessage：要解析内容的消息对象。
// 输出参数：
//   - []AIMessageContent：解析后的消息内容列表，包含消息类型和对应的文本内容或图片 URL。
func (message AIMessage) ParseContent() []AIMessageContent {
	var contentList []AIMessageContent // 定义一个消息内容列表

	switch content := message.Content.(type) {
	case string:
		// 如果内容本身是字符串类型，将其添加到消息内容列表中并返回
		return []AIMessageContent{{Type: relaycommon.ContentTypeText, Text: content}}
	case []interface{}:
		// 遍历内容列表，根据内容类型进行解析并添加到消息内容列表中
		for _, contentItem := range content {
			contentMap, ok := contentItem.(map[string]interface{})
			if !ok {
				continue
			}

			switch contentType := contentMap["type"].(string); contentType {
			case relaycommon.ContentTypeText:
				if subStr, ok := contentMap["text"].(string); ok {
					contentList = append(contentList, AIMessageContent{Type: contentType, Text: subStr})
				}
			case relaycommon.ContentTypeImageURL:
				if subObj, ok := contentMap["image_url"].(map[string]interface{}); ok {
					url, urlOk := subObj["url"].(string)
					if urlOk {
						contentList = append(contentList, AIMessageContent{Type: contentType, ImageURL: &ImageURL{Url: url}})
					}
				}
			}
		}
		return contentList
	}

	return nil // 如果内容既不是字符串类型，也不是包含特定内容类型的列表，则返回空
}

// AIChatRequest 结构体用于表示对话请求。
type AIChatRequest struct {
	Model     string      `json:"relaymodel"` // 模型名称
	Messages  []AIMessage `json:"messages"`   // 消息列表
	MaxTokens int         `json:"max_tokens"` // 最大 token 数
}

// AITextRequest 结构体用于表示文本请求。
type AITextRequest struct {
	Model     string      `json:"relaymodel"` // 模型名称
	Messages  []AIMessage `json:"messages"`   // 消息列表
	Prompt    string      `json:"prompt"`     // 提示内容
	MaxTokens int         `json:"max_tokens"` // 最大 token 数
	Stream    bool        `json:"stream"`     // 是否流式处理
}

// AIImageRequest 结构体用于表示图片请求。
// 更多信息请参考：https://platform.openai.com/docs/api-reference/images/create
type AIImageRequest struct {
	Model            string `json:"relaymodel"`                // 模型名称
	Prompt           string `json:"prompt" binding:"required"` // 提示内容
	N                int    `json:"n,omitempty"`               // 可选参数: n
	Size             string `json:"size,omitempty"`            // 可选参数: size
	Quality          string `json:"quality,omitempty"`         // 可选参数: quality
	AIResponseFormat string `json:"responseFormat,omitempty"`  // 可选参数: responseFormat
	Style            string `json:"style,omitempty"`           // 可选参数: style
	User             string `json:"user,omitempty"`            // 可选参数: user
}

// AITextToSpeechRequest 结构体用于表示文本转语音请求。
type AITextToSpeechRequest struct {
	Model            string  `json:"relaymodel" binding:"required"` // 模型名称
	Input            string  `json:"input" binding:"required"`      // 输入文本
	Voice            string  `json:"voice" binding:"required"`      // 语音类型
	Speed            float64 `json:"speed"`                         // 语速
	AIResponseFormat string  `json:"responseFormat"`                // 响应格式
}

// AIWhisperResponse 代表 AI 悄悄话的响应结构体。
type AIWhisperResponse struct {
	Text string `json:"text,omitempty"` // 文本内容
}

// AIWhisperSegment 代表 AI 悄悄话的分段结构体。
type AIWhisperSegment struct {
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

// AIWhisperVerboseResponse 代表 AI 悄悄话详细响应的结构体。
type AIWhisperVerboseResponse struct {
	Task     string             `json:"task,omitempty"`     // 任务
	Language string             `json:"language,omitempty"` // 语言
	Duration float64            `json:"duration,omitempty"` // 持续时间
	Text     string             `json:"text,omitempty"`     // 文本内容
	Segments []AIWhisperSegment `json:"segments,omitempty"` // 分段信息列表
}

// AITextResponseChoice 代表 AI 文本响应的选择结构体。
type AITextResponseChoice struct {
	Index        int              `json:"index"`         // 索引
	FinishReason string           `json:"finish_reason"` // 完成原因
	AIMessage    `json:"message"` // 消息
}

// AISlimTextResponse 代表 AI 简洁文本响应的结构体。
type AISlimTextResponse struct {
	Choices []AITextResponseChoice `json:"choices"` // 选择列表
	Error   Error                  `json:"error"`   // 错误信息
	Usage   `json:"usage"`         // 使用情况
}

// AITextResponse 代表 AI 文本响应的结构体。
type AITextResponse struct {
	Id      string                 `json:"id"`                   // ID
	Model   string                 `json:"relaymodel,omitempty"` // 模型名称
	Object  string                 `json:"object"`               // 对象
	Created int64                  `json:"created"`              // 创建时间
	Choices []AITextResponseChoice `json:"choices"`              // 选择列表
	Usage   `json:"usage"`         // 使用情况
}

// AIEmbeddingResponseItem 代表 AI 嵌入响应的条目结构体。
type AIEmbeddingResponseItem struct {
	Object    string    `json:"object"`    // 嵌入对象
	Index     int       `json:"index"`     // 索引
	Embedding []float64 `json:"embedding"` // 嵌入信息
}

// AIEmbeddingResponse 代表 AI 嵌入响应的结构体。
type AIEmbeddingResponse struct {
	Object string                    `json:"object"`     // 嵌入对象
	Model  string                    `json:"relaymodel"` // 模型名称
	Data   []AIEmbeddingResponseItem `json:"data"`       // 数据
	Usage  `json:"usage"`            // 使用情况
}

// AIImageResponse 代表 AI 图片响应的结构体。
type AIImageResponse struct {
	Created int `json:"created"` // 创建时间
	Data    []struct {
		Url string `json:"url"` // 图片链接
	}
}

// AIDelta 代表聊天完成流响应中的变化结构体。
type AIDelta struct {
	Content string `json:"content"`        // 内容
	Role    string `json:"role,omitempty"` // 角色
}

// AIChatCompletionsStreamResponseChoice 代表 AI聊天完成流响应中的选择结构体。
type AIChatCompletionsStreamResponseChoice struct {
	Index        int     `json:"index"`                   // 索引
	Delta        AIDelta `json:"delta"`                   // 变化
	FinishReason *string `json:"finish_reason,omitempty"` // 完成原因
}

// AIChatCompletionsStreamResponse 代表 AI 聊天完成流响应的结构体。
type AIChatCompletionsStreamResponse struct {
	Id      string                                  `json:"id"`         // ID
	Object  string                                  `json:"object"`     // 对象
	Created int64                                   `json:"created"`    // 创建时间
	Model   string                                  `json:"relaymodel"` // 模型名称
	Choices []AIChatCompletionsStreamResponseChoice `json:"choices"`    // 选择列表
}

// AICompletionChoice 代表完成选择的结构体。
type AICompletionChoice struct {
	Text         string `json:"text"`          // 文本内容
	FinishReason string `json:"finish_reason"` // 完成原因
}

// AICompletionsStreamResponse 代表 AI 完成流响应的结构体。
type AICompletionsStreamResponse struct {
	Choices []AICompletionChoice `json:"choices"` // 选择列表
}
