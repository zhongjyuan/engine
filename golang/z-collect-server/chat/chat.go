package chat

import (
	"encoding/json"
	"io"
	"net/http"
)

type ChatRequest struct {
	Network bool   `json:"network"`
	From    string `json:"from"`
	UserId  string `json:"userId"`
	Prompt  string `json:"prompt"`
}

func Handle(writer http.ResponseWriter, request *http.Request) {
	// 检查请求方法是否为 POST
	if request.Method != http.MethodPost {
		writer.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	// 读取请求body中的数据
	body, err := io.ReadAll(request.Body)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}

	var req ChatRequest
	// 解析请求数据
	err = json.Unmarshal(body, &req)
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		return
	}

	result := "test data"

	// 将 result 写入响应体
	_, err = writer.Write([]byte(result))
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}

	writer.WriteHeader(http.StatusOK)
}
