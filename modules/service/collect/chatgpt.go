package collect

import (
	"net/http"
	"path/filepath"
)

// ChatGPTChat 函数用于收集 GPT 聊天数据。
//
// 输入参数：
//   - writer: HTTP 响应写入器。
//   - request: HTTP 请求。
//
// 输出参数：
//   - 无。
func ChatGPTChat(writer http.ResponseWriter, request *http.Request) {
	Write(writer, request, filepath.Join("storage", "gptChatStorage.json"))
}

// ChatGPTMessage 函数用于收集 GPT 消息数据。
//
// 输入参数：
//   - writer: HTTP 响应写入器。
//   - request: HTTP 请求。
//
// 输出参数：
//   - 无。
func ChatGPTMessage(writer http.ResponseWriter, request *http.Request) {
	Write(writer, request, filepath.Join("storage", "gptMessageStorage.json"))
}
