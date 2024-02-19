package storage

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"time"
	"zhongjyuan/wechatgpt/config"
)

// GPT会话存储项对象结构
type GPTChatStorageItem struct {
	Network bool   // 是否联网
	ChatKey string // 会话键
	Count   int64  // 对话次数
}

// 会话存储
var gptChatStorage map[string]GPTChatStorageItem

// init 函数用于初始化聊天存储。
//
// 输入参数：
//   - 无。
func init() {
	// 加载配置文件
	cfg := config.LoadConfig()

	// 创建空的聊天存储 map
	gptChatStorage = make(map[string]GPTChatStorageItem)

	// 校验缓存是否开启
	if !cfg.ChatGPTChatStorage {
		return
	}

	// 校验文件是否存在
	if _, err := os.Stat(cfg.ChatGPTChatStorageFileName); os.IsNotExist(err) {
		return
	}

	// 打开 gptChatStorage.json 文件
	file, err := os.Open(cfg.ChatGPTChatStorageFileName)
	if err != nil {
		fmt.Println("打开GPT会话缓存文件失败：", err)
		return
	}

	defer file.Close()

	// 将文件内容解析为 JSON 格式，并反序列化为 gptChatStorage 对象
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&gptChatStorage)
	if err != nil {
		fmt.Println("解析GPT会话缓存JSON失败：", err)
		return
	}
}

// SetGPTChatStorage 函数用于设置用户的GPT会话存储。
//
// 输入参数：
//   - userId string: 用户ID。
//   - network ...bool: 可选参数，表示是否使用网络。
func SetGPTChatStorage(userId string, network ...bool) {
	// 获取当前时间戳
	currentTime := time.Now().Unix()

	// 生成带时间戳的聊天键
	chatKeyWithTimestamp := userId + "_" + strconv.FormatInt(currentTime, 10)

	// 检查是否存在该用户的聊天存储项
	item, exists := gptChatStorage[userId]
	if !exists {
		// 如果不存在，根据是否传入网络参数来创建新的聊天存储项
		if len(network) > 0 {
			item = GPTChatStorageItem{Network: network[0], ChatKey: chatKeyWithTimestamp, Count: 1}
		} else {
			item = GPTChatStorageItem{Network: true, ChatKey: chatKeyWithTimestamp, Count: 1}
		}
	} else {
		// 如果已存在，更新聊天存储项的计数和键值
		item.Count = item.Count + 1
		item.ChatKey = chatKeyWithTimestamp
		// 如果传入了网络参数，更新网络状态
		if len(network) > 0 {
			item.Network = network[0]
		}
	}
	// 更新用户的聊天存储项
	gptChatStorage[userId] = item

	// 保存聊天存储
	SaveGPTChatStorage()
}

// GetGPTChatStorage 函数用于获取用户的GPT会话存储项。
//
// 输入参数：
//   - userId string: 用户ID。
//
// 输出参数：
//   - GPTChatStorageItem: 返回用户的GPT会话存储项。
func GetGPTChatStorage(userId string) GPTChatStorageItem {
	// 检查是否存在该用户的聊天存储项
	item, exists := gptChatStorage[userId]
	if !exists {
		// 如果不存在，生成新的聊天存储项
		currentTime := time.Now().Unix()
		chatKeyWithTimestamp := userId + "_" + strconv.FormatInt(currentTime, 10)
		item = GPTChatStorageItem{Network: true, ChatKey: chatKeyWithTimestamp, Count: 1}
	} else {
		// 如果已存在，更新聊天存储项的计数
		item.Count = item.Count + 1
	}

	// 更新用户的聊天存储项
	gptChatStorage[userId] = item

	// 保存聊天存储
	SaveGPTChatStorage()

	return item
}

// SaveGPTChatStorage 函数用于保存用户的GPT会话存储项到文件中。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func SaveGPTChatStorage() {
	// 加载配置文件
	cfg := config.LoadConfig()

	if !cfg.ChatGPTChatStorage {
		return
	}

	// 将 gptChatStorage 序列化为 JSON 格式
	data, err := json.Marshal(gptChatStorage)
	if err != nil {
		fmt.Println("GPT会话缓存序列化失败：", err)
		return
	}

	// 创建文件
	file, err := os.Create(cfg.ChatGPTChatStorageFileName)
	if err != nil {
		fmt.Println("创建GPT会话缓存文件失败：", err)
		return
	}

	defer file.Close()

	// 将 JSON 数据写入文件
	_, err = file.Write(data)
	if err != nil {
		fmt.Println("写入GPT会话缓存文件失败：", err)
		return
	}

}
