package relayModel

// Usage 结构体用于表示 API 使用情况。
//
// 输入参数：
//   - 无。
type Usage struct {
	PromptTokens     int `json:"prompt_tokens"`     // 表示提示令牌数
	CompletionTokens int `json:"completion_tokens"` // 表示完成令牌数
	TotalTokens      int `json:"total_tokens"`      // 表示总令牌数
}

// Error 结构体用于表示 API 错误信息。
//
// 输入参数：
//   - 无。
type Error struct {
	Message string `json:"message"` // 错误消息
	Type    string `json:"type"`    // 错误类型
	Param   string `json:"param"`   // 参数名
	Code    any    `json:"code"`    // 错误代码
}

// ErrorWithStatusCode 结构体继承自 Error 结构体，用于表示带有状态码的 API 错误信息。
//
// 输入参数：
//   - 无。
type ErrorWithStatusCode struct {
	Error          // 继承自 Error 结构体
	StatusCode int `json:"status_code"` // 状态码
}
