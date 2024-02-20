package config

import (
	"encoding/json"
	"log"
	"os"
	"path/filepath"
	"sync"
	"zhongjyuan/wechatgpt/core"
)

// Configuration 项目配置
type Configuration struct {
	LogLevel   int64  `json:"log_level"`   // 日志级别
	AutoPass   bool   `json:"auto_pass"`   // 自动通过好友
	StorageDir string `json:"storage_dir"` // 缓存目录

	CollectServer string `json:"collect_server"` // 采集服务

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

// 使用 sync.Once 来确保函数只被执行一次
var once sync.Once

// 机器人
var bot *core.Bot

// 日志对象
var logger *core.Logger

// 配置对象
var config *Configuration

var (
	LogDir     string = filepath.Join("appData", "log")     // MediaDir 表示媒体目录类型
	MediaDir   string = filepath.Join("appData", "media")   // MediaDir 表示媒体目录类型
	StorageDir string = filepath.Join("appData", "storage") // StorageDir 表示缓存目录类型
)

// LoadConfig 加载配置
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *Configuration: 加载的配置信息。
func LoadConfig() *Configuration {
	once.Do(func() {
		// 从文件中读取
		config = &Configuration{}

		// 打开配置文件
		file, err := os.Open("config.json")
		if err != nil {
			log.Fatalf("open config err: %v", err)
			return
		}

		defer file.Close()

		// 解码 JSON 文件
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

		// 获取存储目录
		currentDir := config.StorageDir
		if currentDir == "" {
			currentDir, err = os.Getwd() // 获取当前项目路径
			if err != nil {
				return
			}
		}
		config.StorageDir = currentDir

		if config.CollectServer == "" {
			config.CollectServer = "http://47.116.100.195:184"
		}

		// 创建目录
		config.MkDir(LogDir)
		config.MkDir(MediaDir)
		config.MkDir(StorageDir)

		// 处理文件名
		config.WechatStorageFileName = config.StorageFileName(config.WechatStorageFileName)
		config.WechatMessageStorageFileName = config.StorageFileName(config.WechatMessageStorageFileName)

		config.ChatGPTChatStorageFileName = config.StorageFileName(config.ChatGPTChatStorageFileName)
		config.ChatGPTMessageStorageFileName = config.StorageFileName(config.ChatGPTMessageStorageFileName)

		// 初始化日志记录对象
		logger = core.NewLogger(LogDir, core.LogLevel(config.LogLevel))
	})

	return config
}

// SetBot 用于设置全局的机器人变量。
//
// 输入参数：
//   - b *core.Bot: 要设置的机器人变量。
//
// 输出参数：
//   - 无。
func SetBot(b *core.Bot) {
	bot = b
}

// GetBot 用于获取全局的机器人变量。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *core.Bot: 返回当前的机器人变量。
func GetBot() *core.Bot {
	return bot
}

// Logger 函数用于获取日志记录器。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *core.Logger: 返回当前的日志记录器。
func Logger() *core.Logger {
	return logger
}

// MkDir 方法用于在指定目录下创建子目录。
//
// 输入参数：
//   - dirName string: 要创建的子目录名。
//
// 输出参数：
//   - error: 如果创建过程中出现错误，则返回该错误；否则返回 nil。
func (config *Configuration) MkDir(dirName string) error {
	// 拼接完整的文件路径
	filePath := filepath.Join(config.StorageDir, dirName, "zhongjyuan.js")

	// 创建目录
	if err := os.MkdirAll(filepath.Dir(filePath), os.ModePerm); err != nil {
		return err
	}

	return nil
}

// MediaFileName 方法用于获取媒体文件的完整文件路径。
//
// 输入参数：
//   - fileName string: 媒体文件名。
//
// 输出参数：
//   - string: 媒体文件的完整路径。
func (config *Configuration) MediaFileName(fileName string) string {
	return filepath.Join(config.StorageDir, MediaDir, fileName)
}

// StorageFileName 方法用于获取存储文件的完整文件路径。
//
// 输入参数：
//   - fileName string: 存储文件名。
//
// 输出参数：
//   - string: 存储文件的完整路径。
func (config *Configuration) StorageFileName(fileName string) string {
	return filepath.Join(config.StorageDir, StorageDir, fileName)
}
