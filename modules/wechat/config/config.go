package config

import (
	"encoding/json"
	"log"
	"os"
	"sync"
)

// Configuration 项目配置
type Configuration struct {
	// 自动通过好友
	AutoPass bool `json:"auto_pass"`
}

var once sync.Once
var config *Configuration

// LoadConfig 加载配置
func LoadConfig() *Configuration {
	once.Do(func() {
		// 从文件中读取
		config = &Configuration{}

		f, err := os.Open("config.json")
		if err != nil {
			log.Fatalf("open config err: %v", err)
			return
		}
		defer f.Close()

		encoder := json.NewDecoder(f)
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
