package wechat

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

// CollectRequest 结构体用于表示收集数据的请求。
//
// 字段说明：
//   - Owner: 拥有者。
//   - Data: 数据。
type CollectRequest struct {
	Owner    string // 拥有者
	FileName string // 文件名称
	Data     []byte // 数据
}

// CollectGPTChatData 函数用于收集 GPT 聊天数据。
//
// 输入参数：
//   - writer: HTTP 响应写入器。
//   - request: HTTP 请求。
//
// 输出参数：
//   - 无。
func CollectGPTChatData(writer http.ResponseWriter, request *http.Request) {
	if request.Method != http.MethodPost {
		writer.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(request.Body)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}

	var req CollectRequest
	err = json.Unmarshal(body, &req)
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		return
	}

	fileName := filepath.Join(req.Owner, "storage", "gptChatStorage.json")

	// 创建目录
	if err := os.MkdirAll(filepath.Dir(fileName), os.ModePerm); err != nil {
		return
	}

	// 创建文件
	file, err := os.Create(fileName)
	if err != nil {
		log.Println("创建GPT会话缓存文件失败：", err)
		return
	}

	defer file.Close()

	// 将 JSON 数据写入文件
	_, err = file.Write(req.Data)
	if err != nil {
		log.Println("写入GPT会话缓存文件失败：", err)
		return
	}

	writer.WriteHeader(http.StatusOK)
}

// CollectGPTMessageData 函数用于收集 GPT 消息数据。
//
// 输入参数：
//   - writer: HTTP 响应写入器。
//   - request: HTTP 请求。
//
// 输出参数：
//   - 无。
func CollectGPTMessageData(writer http.ResponseWriter, request *http.Request) {
	if request.Method != http.MethodPost {
		writer.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(request.Body)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}

	var req CollectRequest
	err = json.Unmarshal(body, &req)
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		return
	}

	fileName := filepath.Join(req.Owner, "storage", "gptMessageStorage.json")

	// 创建目录
	if err := os.MkdirAll(filepath.Dir(fileName), os.ModePerm); err != nil {
		return
	}

	// 创建文件
	file, err := os.Create(fileName)
	if err != nil {
		log.Println("创建GPT会话缓存文件失败：", err)
		return
	}

	defer file.Close()

	// 将 JSON 数据写入文件
	_, err = file.Write(req.Data)
	if err != nil {
		log.Println("写入GPT会话缓存文件失败：", err)
		return
	}

	writer.WriteHeader(http.StatusOK)
}

// CollectWechatStorageData 函数用于收集微信存储数据。
//
// 输入参数：
//   - writer: HTTP 响应写入器。
//   - request: HTTP 请求。
//
// 输出参数：
//   - 无。
func CollectWechatStorageData(writer http.ResponseWriter, request *http.Request) {
	if request.Method != http.MethodPost {
		writer.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(request.Body)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}

	var req CollectRequest
	err = json.Unmarshal(body, &req)
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		return
	}

	fileName := filepath.Join(req.Owner, "storage", "wechatStorage.json")

	// 创建目录
	if err := os.MkdirAll(filepath.Dir(fileName), os.ModePerm); err != nil {
		return
	}

	// 创建文件
	file, err := os.Create(fileName)
	if err != nil {
		log.Println("创建GPT会话缓存文件失败：", err)
		return
	}

	defer file.Close()

	// 将 JSON 数据写入文件
	_, err = file.Write(req.Data)
	if err != nil {
		log.Println("写入GPT会话缓存文件失败：", err)
		return
	}

	writer.WriteHeader(http.StatusOK)
}

// CollectWechatMessageData 函数用于收集微信消息数据。
//
// 输入参数：
//   - writer: HTTP 响应写入器。
//   - request: HTTP 请求。
//
// 输出参数：
//   - 无。
func CollectWechatMessageData(writer http.ResponseWriter, request *http.Request) {
	if request.Method != http.MethodPost {
		writer.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(request.Body)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}

	var req CollectRequest
	err = json.Unmarshal(body, &req)
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		return
	}

	fileName := filepath.Join(req.Owner, "storage", "wechatMessageStorage.json")

	// 创建目录
	if err := os.MkdirAll(filepath.Dir(fileName), os.ModePerm); err != nil {
		return
	}

	// 创建文件
	file, err := os.Create(fileName)
	if err != nil {
		log.Println("创建GPT会话缓存文件失败：", err)
		return
	}

	defer file.Close()

	// 将 JSON 数据写入文件
	_, err = file.Write(req.Data)
	if err != nil {
		log.Println("写入GPT会话缓存文件失败：", err)
		return
	}

	writer.WriteHeader(http.StatusOK)
}

// CollectWechatMediaData 用于接收并保存微信媒体数据。
//
// 输入参数：
//   - writer http.ResponseWriter: 用于向客户端发送 HTTP 响应的对象。
//   - request *http.Request: 包含客户端请求信息的对象。
//
// 输出参数：
//   - 无。
func CollectWechatMediaData(writer http.ResponseWriter, request *http.Request) {
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

	// 解析请求数据
	var req CollectRequest
	err = json.Unmarshal(body, &req)
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		return
	}

	// 设置文件名
	fileName := filepath.Join(req.Owner, "media", req.FileName)

	// 创建目录
	if err := os.MkdirAll(filepath.Dir(fileName), os.ModePerm); err != nil {
		return
	}

	// 创建文件
	file, err := os.Create(fileName)
	if err != nil {
		log.Println("创建GPT会话缓存文件失败：", err)
		return
	}

	defer file.Close()

	// 将数据写入文件
	_, err = file.Write(req.Data)
	if err != nil {
		log.Println("写入GPT会话缓存文件失败：", err)
		return
	}

	// 返回成功状态码
	writer.WriteHeader(http.StatusOK)
}
