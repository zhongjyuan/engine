package relayModel

// ResponseFormat 结构体用于定义响应格式。
type ResponseFormat struct {
	Type string `json:"type,omitempty"` // 响应类型
}

// GeneralOpenAIRequest 结构体用于定义通用的 OpenAI 请求。
type GeneralOpenAIRequest struct {
	Model            string          `json:"model,omitempty"`             // 模型名称
	Messages         []Message       `json:"messages,omitempty"`          // 消息列表
	Prompt           any             `json:"prompt,omitempty"`            // 提示信息
	Stream           bool            `json:"stream,omitempty"`            // 是否流式传输
	MaxTokens        int             `json:"max_tokens,omitempty"`        // 最大 token 数量
	Temperature      float64         `json:"temperature,omitempty"`       // 温度参数
	TopP             float64         `json:"top_p,omitempty"`             // Top-P 参数
	N                int             `json:"n,omitempty"`                 // 生成数量
	Input            any             `json:"input,omitempty"`             // 输入内容
	Instruction      string          `json:"instruction,omitempty"`       // 指令信息
	Size             string          `json:"size,omitempty"`              // 模型大小
	Functions        any             `json:"functions,omitempty"`         // 自定义函数
	FrequencyPenalty float64         `json:"frequency_penalty,omitempty"` // 频率惩罚参数
	PresencePenalty  float64         `json:"presence_penalty,omitempty"`  // 存在惩罚参数
	ResponseFormat   *ResponseFormat `json:"response_format,omitempty"`   // 响应格式
	Seed             float64         `json:"seed,omitempty"`              // 随机种子
	Tools            any             `json:"tools,omitempty"`             // 工具
	ToolChoice       any             `json:"tool_choice,omitempty"`       // 工具选择
	User             string          `json:"user,omitempty"`              // 用户信息
}

// ParseInput 方法用于解析输入参数，将其转换为字符串数组。
//
// 输入参数：
//   - 无。
// 输出参数：
//   - []string: 解析后的输入参数字符串数组。
func (r GeneralOpenAIRequest) ParseInput() []string {
	if r.Input == nil {
		return nil
	}

	switch input := r.Input.(type) {
	case string:
		return []string{input} // 如果输入参数是字符串，则将其转换为包含该字符串的数组
	case []interface{}:
		var result []string
		for _, item := range input {
			if str, ok := item.(string); ok { // 如果数组元素是字符串，则将其添加到结果数组中
				result = append(result, str)
			}
		}
		return result
	default:
		return nil // 其他情况下返回空数组
	}
}

type GeneralErrorResponse struct {
	Error    Error  `json:"error"`
	Message  string `json:"message"`
	Msg      string `json:"msg"`
	Err      string `json:"err"`
	ErrorMsg string `json:"error_msg"`
	Header   struct {
		Message string `json:"message"`
	} `json:"header"`
	Response struct {
		Error struct {
			Message string `json:"message"`
		} `json:"error"`
	} `json:"response"`
}

func (e GeneralErrorResponse) ToMessage() string {
	if e.Error.Message != "" {
		return e.Error.Message
	}
	if e.Message != "" {
		return e.Message
	}
	if e.Msg != "" {
		return e.Msg
	}
	if e.Err != "" {
		return e.Err
	}
	if e.ErrorMsg != "" {
		return e.ErrorMsg
	}
	if e.Header.Message != "" {
		return e.Header.Message
	}
	if e.Response.Error.Message != "" {
		return e.Response.Error.Message
	}
	return ""
}
