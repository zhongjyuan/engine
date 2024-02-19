package config

import (
	"encoding/json"
	"log"
	"os"
	"sync"
)

// Configuration 项目配置
type Configuration struct {
	AutoPass                        bool   `json:"auto_pass"`                           // 自动通过好友
	WechatDomain                    string `json:"wechat_host"`                         // 微信主机
	WechatStorage                   bool   `json:"wechat_storage"`                      // 微信缓存是否开启
	WechatMessageStorage            bool   `json:"wechat_message_storage"`              // 微信消息缓存是否开启
	WechatStorageFileName           string `json:"wechat_storage_filename"`             // 微信缓存文件名
	WechatMessageStorageFileName    string `json:"wechat_message_storage_filename"`     // 微信消息缓存文件名
	WechatMessageStorageFileMaxSize int64  `json:"wechat_message_storage_file_maxsize"` // 微信消息缓存文件文件最大阈值

	ChatGPT                          bool     `json:"chatgpt"`                              // ChatGPT是否开启
	ChatGPTServer                    string   `json:"chatgpt_server"`                       // ChatGPT服务
	ChatGPTProcess                   string   `json:"chatgpt_process_path"`                 // ChatGPT服务进度Api路径
	ChatGPTNewChatTips               string   `json:"chatgpt_new_chat_tips"`                // ChatGPT新会话提醒语
	ChatGPTNewChatKeywords           []string `json:"chatgpt_new_chat_keywords"`            // ChatGPT新会话关键字
	ChatGPTChatStorage               bool     `json:"chatgpt_chat_storage"`                 // ChatGPT会话缓存是否开启
	ChatGPTMessageStorage            bool     `json:"chatgpt_message_storage"`              // ChatGPT消息缓存是否开启
	ChatGPTChatStorageFileName       string   `json:"chatgpt_chat_storage_filename"`        // ChatGPT会话缓存文件名
	ChatGPTMessageStorageFileName    string   `json:"chatgpt_message_storage_filename"`     // ChatGPT消息存储文件名
	ChatGPTMessageStorageFileMaxSize int64    `json:"chatgpt_message_storage_file_maxsize"` // ChatGPT消息存储文件最大阈值
}

var once sync.Once
var config *Configuration

// LoadConfig 加载配置
func LoadConfig() *Configuration {
	once.Do(func() {
		// 从文件中读取
		config = &Configuration{}

		file, err := os.Open("config.json")
		if err != nil {
			log.Fatalf("open config err: %v", err)
			return
		}

		defer file.Close()

		encoder := json.NewDecoder(file)

		err = encoder.Decode(config)
		if err != nil {
			log.Fatalf("decode config err: %v", err)
			return
		}

		// 如果环境变量有配置，读取环境变量
		AutoPass := os.Getenv("AutoPass")
		if AutoPass == "true" {
			config.AutoPass = true
		}
	})

	return config
}
