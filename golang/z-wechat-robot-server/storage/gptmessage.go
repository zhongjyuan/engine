package storage

import (
	"encoding/json"
	"os"
	"time"
	"zhongjyuan/wechat-robot-service/config"
)

// GPT消息存储项对象结构
type GPTMessageStorageItem struct {
	Prompt string // 问题
	Reply  string // 回复
}

// GPTMessageStorageDateMap 是一个映射，将日期映射到GPT消息存储项列表
type GPTMessageStorageDateMap map[string][]GPTMessageStorageItem

// saveGPTMessageStorage 函数用于保存GPT消息存储数据到文件中。
//
// 输入参数：
//   - messageStorage: 包含GPT消息存储数据的映射。
//
// 输出参数：
//   - 无。
func saveGPTMessageStorage(messageStorage map[string]GPTMessageStorageDateMap) {
	// 加载配置信息
	cfg := config.LoadConfig()

	CollectGPTMessageData()

	// 缓存记录是否开启
	if !cfg.ChatGPTMessageStorage {
		return
	}

	// 检查文件是否存在，如果不存在则创建一个新的空白文件
	if _, err := os.Stat(cfg.ChatGPTMessageStorageFileName); os.IsNotExist(err) {
		if _, err = os.Create(cfg.ChatGPTMessageStorageFileName); err != nil {
			config.Logger().Warn("创建GPT消息缓存文件失败：", err)
			return
		}
	}

	// 检查文件大小是否超过阈值（50MB = 50 * 1024 * 1024 字节）
	fileInfo, err := os.Stat(cfg.ChatGPTMessageStorageFileName)
	if err != nil {
		config.Logger().Warn("获取GPT消息缓存文件信息失败：", err)
		return
	}

	if fileInfo.Size() >= cfg.ChatGPTMessageStorageFileMaxSize {
		// 进行文件切割操作
		err = FileSplit(cfg.ChatGPTMessageStorageFileName)
		if err != nil {
			config.Logger().Warn("GPT消息缓存文件切割失败：", err)
			return
		}
	}

	// 将 messageStorage 序列化为 JSON 格式
	data, err := json.Marshal(messageStorage)
	if err != nil {
		config.Logger().Warn("GPT消息缓存序列化失败：", err)
		return
	}

	// 创建或截断文件
	file, err := os.OpenFile(cfg.ChatGPTMessageStorageFileName, os.O_WRONLY|os.O_TRUNC|os.O_CREATE, 0644)
	if err != nil {
		config.Logger().Warn("打开GPT消息缓存文件失败：", err)
		return
	}

	defer file.Close()

	// 将 JSON 数据写入文件
	_, err = file.Write(data)
	if err != nil {
		config.Logger().Warn("写入GPT消息缓存文件失败：", err)
		return
	}
}

// loadGPTMessageStorage 函数用于加载GPT消息存储数据。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - map[string][]GPTMessageStorageDateMap: 返回消息存储的映射数据。
func loadGPTMessageStorage() map[string]GPTMessageStorageDateMap {
	// 加载配置文件
	cfg := config.LoadConfig()

	// 创建消息存储映射
	messageStorage := make(map[string]GPTMessageStorageDateMap)

	// 校验缓存是否开启
	if !cfg.ChatGPTMessageStorage {
		return messageStorage
	}

	// 校验文件是否存在
	if _, err := os.Stat(cfg.ChatGPTMessageStorageFileName); os.IsNotExist(err) {
		return messageStorage
	}

	// 打开 messageStorage.json 文件
	file, err := os.Open(cfg.ChatGPTMessageStorageFileName)
	if err != nil {
		config.Logger().Warn("打开GPT消息缓存文件失败：", err)
		return messageStorage
	}
	defer file.Close()

	// 将文件内容解析为 JSON 格式，并反序列化为 messageStorage 对象
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&messageStorage)
	if err != nil {
		config.Logger().Warn("解析GPT消息缓存JSON失败：", err)
		return messageStorage
	}

	return messageStorage
}

// SetGPTMessageStorage 函数用于设置GPT消息存储数据。
//
// 输入参数：
//   - userId string: 用户ID。
//   - prompt string: 发送的提示信息。
//   - reply string: 返回的回复信息。
//
// 输出参数：
//   - 无。
func SetGPTMessageStorage(userId string, prompt string, reply string) {
	// 加载消息存储数据
	messageStorage := loadGPTMessageStorage()

	// 检查是否存在该用户的消息存储项，如果不存在则创建一个空的列表
	items, exists := messageStorage[userId]
	if !exists {
		items = make(map[string][]GPTMessageStorageItem)
	}

	// 创建一条消息存储项并添加到列表中
	newItem := GPTMessageStorageItem{Prompt: prompt, Reply: reply}

	date := time.Now().Format("2006-01-02")
	items[date] = append(items[date], newItem)

	// 更新该用户的消息存储项
	messageStorage[userId] = items

	// 保存消息存储
	saveGPTMessageStorage(messageStorage)
}

// GetGPTMessageStorage 函数用于获取指定用户的GPT消息存储数据。
//
// 输入参数：
//   - userId string: 用户ID。
//
// 输出参数：
//   - []GPTMessageStorageItem: 返回指定用户的消息存储项列表。
func GetGPTMessageStorage(userId string) GPTMessageStorageDateMap {
	// 加载消息存储数据
	messageStorage := loadGPTMessageStorage()

	// 检查是否存在该用户的消息存储项，如果不存在则创建一个空的列表并保存
	items, exists := messageStorage[userId]
	if !exists {
		items = make(map[string][]GPTMessageStorageItem)
		messageStorage[userId] = items
		saveGPTMessageStorage(messageStorage)
	}

	return items
}

// GetGPTMessageDateStorage 用于获取指定用户在指定日期的 GPT 消息存储数据。
//
// 输入参数：
//   - userId: 用户标识。
//   - date: 指定日期，格式为 "2006-01-02"。
//
// 输出参数：
//   - 返回指定用户在指定日期的 GPT 消息存储数据。
func GetGPTMessageDateStorage(userId string, date string) []GPTMessageStorageItem {
	// 加载消息存储数据
	messageStorage := loadGPTMessageStorage()

	// 检查是否存在该用户的消息存储项，如果不存在则创建一个空的列表并保存
	items, exists := messageStorage[userId]
	if !exists {
		items = make(map[string][]GPTMessageStorageItem)
		messageStorage[userId] = items
		saveGPTMessageStorage(messageStorage)
	}

	return items[date]
}
