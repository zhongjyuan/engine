package config

import (
	"encoding/json"
	"log"
	"os"
	"sync"
)

// Configuration 项目配置
type Configuration struct {
	AutoPass                         bool     `json:"auto_pass"`                            // 自动通过好友
	WechatDomain                     string   `json:"wechat_host"`                          // 微信主机
	WechatStorageFileName            string   `json:"wechat_storage_filename"`              // 微信主机
	ChatGPTServer                    string   `json:"chatgpt_server"`                       // ChatGPT服务
	ChatGPTProcess                   string   `json:"chatgpt_process_path"`                 // ChatGPT进程路径
	ChatGPTNewChatKeywords           []string `json:"chatgpt_new_chat_keywords"`            // ChatGPT进程路径
	ChatGPTNewChatTips               string   `json:"chatgpt_new_chat_tips"`                // ChatGPT进程路径
	ChatGPTChatStorageFileName       string   `json:"chatgpt_chat_storage_filename"`        // ChatGPT进程路径
	ChatGPTMessageStorageFileName    string   `json:"chatgpt_message_storage_filename"`     // ChatGPT进程路径
	ChatGPTMessageStorageFileMaxSize int64    `json:"chatgpt_message_storage_file_maxsize"` // ChatGPT进程路径
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
