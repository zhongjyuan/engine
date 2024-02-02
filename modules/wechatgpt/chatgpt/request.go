package chatgpt

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"
	"zhongjyuan/wechatgpt/config"
	"zhongjyuan/wechatgpt/storage"
)

// ResponseBody 请求体
type ResponseBody struct {
	Prompt  string `json:"prompt"`
	UserId  string `json:"userId"`
	Network bool   `json:"network"`
}

func Completions(userId string, prompt string) (string, error) {
	cfg := config.LoadConfig()

	path, err := url.Parse(cfg.ChatGPTServer + cfg.ChatGPTProcess) // 解析同步检查链接地址
	if err != nil {
		return "", err
	}

	isMatch := strings.Contains(strings.Join(cfg.ChatGPTNewChatKeywords, ","), prompt)
	if isMatch {
		storage.SetChatStorage(userId)
		return cfg.ChatGPTNewChatTips, nil
	}

	chatStorageItem := storage.GetChatStorage(userId)
	requestBody := ResponseBody{
		Prompt:  prompt,
		Network: chatStorageItem.Network,
		UserId:  "#/chat/" + chatStorageItem.ChatKey,
	}

	requestData, err := json.Marshal(requestBody)
	if err != nil {
		return "", err
	}
	log.Printf("request gtp json string : %v", string(requestData))

	req, err := http.NewRequest(http.MethodPost, path.String(), bytes.NewBuffer(requestData))
	if err != nil {
		return "", err
	}

	req.Header.Add("Accept", "*/*")
	req.Header.Add("Connection", "keep-alive")
	req.Header.Add("Host", "47.116.100.195:188")
	req.Header.Add("Content-Type", "application/json")

	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		return "", err
	}

	defer func() { _ = response.Body.Close() }()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	var reply = string(body)
	reply = strings.Replace(reply, "binjie", "zhongjyuan", -1)
	reply = strings.Replace(reply, "Binjie", "zhongjyuan", -1)
	reply = strings.Replace(reply, "18616222919", "17370115370", -1)
	reply = strings.Replace(reply, "https://chat18.aichatos.xyz", "http://zhongjyuan.club", -1)
	log.Printf("gpt response text: %s \n", reply)

	storage.SetMessageStorage(userId, prompt, reply)

	return reply, nil
}
