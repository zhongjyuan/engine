package channel_ali

// Message 结构体定义了聊天消息的结构。
type Message struct {
	Content string `json:"content"` // 消息内容
	Role    string `json:"role"`    // 消息角色
}

// Input 结构体定义了聊天请求的输入参数。
type Input struct {
	Messages []Message `json:"messages"` // 聊天消息列表
}

// Parameters 结构体定义了聊天请求的可选参数。
type Parameters struct {
	TopP              float64 `json:"top_p,omitempty"`              // 生成文本的概率阈值
	TopK              int     `json:"top_k,omitempty"`              // 生成文本的候选词数量
	Seed              uint64  `json:"seed,omitempty"`               // 随机数种子
	EnableSearch      bool    `json:"enable_search,omitempty"`      // 是否启用搜索模式
	IncrementalOutput bool    `json:"incremental_output,omitempty"` // 是否增量输出
}

// AIChatRequest 结构体定义了聊天请求的数据结构。
type AIChatRequest struct {
	Model      string     `json:"relaymodel"`           // 请求的模型名称
	Input      Input      `json:"input"`                // 聊天请求的输入参数
	Parameters Parameters `json:"parameters,omitempty"` // 聊天请求的可选参数
}

// EmbeddingRequest 结构体定义了嵌入向量请求的数据结构。
type EmbeddingRequest struct {
	Model string `json:"relaymodel"` // 请求的模型名称
	Input struct {
		Texts []string `json:"texts"` // 文本列表
	} `json:"input"` // 嵌入向量请求的输入参数
	Parameters *struct {
		TextType string `json:"text_type,omitempty"` // 文本类型
	} `json:"parameters,omitempty"` // 嵌入向量请求的可选参数
}

// Embedding 结构体定义了嵌入向量的数据结构。
type Embedding struct {
	Embedding []float64 `json:"embedding"`  // 嵌入向量
	TextIndex int       `json:"text_index"` // 文本索引
}

// AIEmbeddingResponse 结构体定义了嵌入向量响应的数据结构。
type AIEmbeddingResponse struct {
	Output struct {
		Embeddings []Embedding `json:"embeddings"` // 嵌入向量列表
	} `json:"output"` // 嵌入向量响应的输出参数
	Usage Usage `json:"usage"` // 嵌入向量响应的用量信息
	Error       // 嵌入向量响应的错误信息
}

// Error 结构体定义了错误的数据结构。
type Error struct {
	Code      string `json:"code"`       // 错误码
	Message   string `json:"message"`    // 错误消息
	RequestId string `json:"request_id"` // 请求ID
}

// Usage 结构体定义了用量信息的数据结构。
type Usage struct {
	InputTokens  int `json:"input_tokens"`  // 输入令牌数量
	OutputTokens int `json:"output_tokens"` // 输出令牌数量
	TotalTokens  int `json:"total_tokens"`  // 总令牌数量
}

// Output 结构体定义了聊天响应的输出参数。
type Output struct {
	Text         string `json:"text"`          // 生成的文本
	FinishReason string `json:"finish_reason"` // 完成原因
}

// ChatResponse 结构体定义了聊天响应的数据结构。
type ChatResponse struct {
	Output Output `json:"output"` // 聊天响应的输出参数
	Usage  Usage  `json:"usage"`  // 聊天响应的用量信息
	Error         // 聊天响应的错误信息
}
