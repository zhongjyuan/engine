package channel_anthropic

// Metadata 结构体用于存储用户ID信息。
type Metadata struct {
	UserId string `json:"user_id"` // 用户ID
}

// Request 结构体用于表示请求数据结构。
type Request struct {
	Model             string   `json:"relaymodel"`               // 模型名称
	Prompt            string   `json:"prompt"`                   // 输入提示文本
	MaxTokensToSample int      `json:"max_tokens_to_sample"`     // 最大标记数样本
	StopSequences     []string `json:"stop_sequences,omitempty"` // 停止序列
	Temperature       float64  `json:"temperature,omitempty"`    // 温度
	TopP              float64  `json:"top_p,omitempty"`          // TopP值
	TopK              int      `json:"top_k,omitempty"`          // TopK值
	Stream            bool     `json:"stream,omitempty"`         // 是否流式处理
}

// Error 结构体用于表示错误信息。
type Error struct {
	Type    string `json:"type"`    // 错误类型
	Message string `json:"message"` // 错误消息
}

// Response 结构体用于表示响应数据结构。
type Response struct {
	Completion string `json:"completion"`  // 完成的文本
	StopReason string `json:"stop_reason"` // 停止原因
	Model      string `json:"relaymodel"`  // 模型名称
	Error      Error  `json:"error"`       // 错误信息
}
