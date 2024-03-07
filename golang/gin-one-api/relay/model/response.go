package relaymodel

// AIErrorResponse 结构体表示响应中的错误信息。
type AIErrorResponse struct {
	Error    Error    `json:"error"`     // 错误对象
	Message  string   `json:"message"`   // 消息
	Msg      string   `json:"msg"`       // 消息
	Err      string   `json:"err"`       // 错误
	ErrorMsg string   `json:"error_msg"` // 错误消息
	Header   struct { // 响应头部
		Message string `json:"message"` // 消息
	} `json:"header"`
	Response struct { // 响应
		Error struct { // 错误
			Message string `json:"message"` // 消息
		} `json:"error"`
	} `json:"response"`
}

// GetMessage 从 AIErrorResponse 结构体中提取消息并返回。
//
// 输入参数：
//   - 无。
// 输出参数：
//   - string: 返回提取的消息，如果没有提取到则返回空字符串。
func (response AIErrorResponse) GetMessage() string {
	messages := []string{
		response.Msg,                    // 尝试提取 Msg 字段
		response.Err,                    // 尝试提取 Err 字段
		response.Message,                // 尝试提取 Message 字段
		response.ErrorMsg,               // 尝试提取 ErrorMsg 字段
		response.Error.Message,          // 尝试提取 Error 中的 Message 字段
		response.Header.Message,         // 尝试提取 Header 中的 Message 字段
		response.Response.Error.Message, // 尝试提取 Response 中的 Error 中的 Message 字段
	}

	for _, msg := range messages {
		if msg != "" {
			return msg // 如果找到非空消息，则返回该消息
		}
	}

	return "" // 如果所有字段都为空，则返回空字符串
}
