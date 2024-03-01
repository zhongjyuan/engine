package chatgpt

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/url"
	"strings"
	"zhongjyuan/wechat-robot-service/config"
	"zhongjyuan/wechat-robot-service/storage"
)

// ResponseBody 请求体
type ResponseBody struct {
	Prompt  string `json:"prompt"`
	UserId  string `json:"userId"`
	Network bool   `json:"network"`
}

// Completions 函数用于向 ChatGPT 服务器发送生成完成请求，并返回生成的回复。
//
// 输入参数：
//   - userId string: 用户 ID。
//   - prompt string: 用户输入的提示信息。
//
// 输出参数：
//   - string: 生成的回复内容。
//   - error: 返回生成回复过程中遇到的错误，如果没有错误则返回 nil。
func Completions(userId string, prompt string) (string, error) {
	cfg := config.LoadConfig()

	if !cfg.ChatGPT {
		return "", nil
	}

	// 解析同步检查链接地址
	path, err := url.Parse(cfg.ChatGPTServer + cfg.ChatGPTProcess)
	if err != nil {
		return "", err
	}

	// 检查用户输入的提示是否匹配新会话关键词列表中的任何一个关键词
	isMatch := strings.Contains(strings.Join(cfg.ChatGPTNewChatKeywords, ","), prompt)
	if isMatch {
		// 如果匹配，则设置聊天存储相关的数据，并返回新会话提示信息
		storage.SetGPTChatStorage(userId)
		return cfg.ChatGPTNewChatTips, nil
	}

	// 获取用户的聊天存储数据
	chatStorageItem := storage.GetGPTChatStorage(userId)

	// 构造请求体
	requestBody := ResponseBody{
		Prompt:  prompt,
		Network: chatStorageItem.Network,
		UserId:  "#/chat/" + chatStorageItem.ChatKey,
	}

	// 将请求体序列化为 JSON 数据
	requestData, err := json.Marshal(requestBody)
	if err != nil {
		return "", err
	}
	config.Logger().Debug("request gtp json string : %v", string(requestData))

	// 创建 HTTP 请求
	req, err := http.NewRequest(http.MethodPost, path.String(), bytes.NewBuffer(requestData))
	if err != nil {
		return "", err
	}

	// 设置请求头
	req.Header.Add("Accept", "*/*")
	req.Header.Add("Connection", "keep-alive")
	req.Header.Add("Host", "47.116.100.195:188")
	req.Header.Add("Content-Type", "application/json")

	// 发送 HTTP 请求
	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		return "", err
	}

	defer func() { _ = response.Body.Close() }()

	// 读取响应体数据
	body, err := io.ReadAll(response.Body)
	if err != nil {
		config.Logger().Error("gtp response read body error: %v", err)
		return "", err
	}

	// 将响应体数据转换为字符串
	var reply = string(body)

	// 替换特定内容，如用户名、电话号码和链接地址
	reply = strings.Replace(reply, "binjie", "zhongjyuan", -1)
	reply = strings.Replace(reply, "Binjie", "zhongjyuan", -1)
	reply = strings.Replace(reply, "18616222919", "17370115370", -1)
	reply = strings.Replace(reply, "https://chat18.aichatos.xyz", "http://zhongjyuan.club", -1)

	config.Logger().Trace("gpt response text: %s \n", reply)

	// 存储用户消息和生成的回复
	storage.SetGPTMessageStorage(userId, prompt, reply)

	return reply, nil
}
