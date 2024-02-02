package storage

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"time"
	"zhongjyuan/wechatgpt/config"
)

type ChatStorageItem struct {
	Network bool
	ChatKey string
	Count   int64
}

var chatStorage map[string]ChatStorageItem

func init() {
	cfg := config.LoadConfig()
	chatStorage = make(map[string]ChatStorageItem)

	// 读取 chatStorage.json 文件
	file, err := os.Open(cfg.ChatGPTChatStorageFileName)
	if err != nil {
		fmt.Println("打开文件失败：", err)
		return
	}
	defer file.Close()

	// 将文件内容解析为 JSON 格式，并反序列化为 chatStorage 对象
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&chatStorage)
	if err != nil {
		fmt.Println("解析 JSON 失败：", err)
		return
	}
}

func SetChatStorage(userId string, network ...bool) {
	currentTime := time.Now().Unix()
	chatKeyWithTimestamp := userId + "_" + strconv.FormatInt(currentTime, 10)

	item, exists := chatStorage[userId]
	if !exists {
		if len(network) > 0 {
			item = ChatStorageItem{Network: network[0], ChatKey: chatKeyWithTimestamp, Count: 1}
		} else {
			item = ChatStorageItem{Network: true, ChatKey: chatKeyWithTimestamp, Count: 1}
		}
	} else {
		item.Count = item.Count + 1
		item.ChatKey = chatKeyWithTimestamp
		if len(network) > 0 {
			item.Network = network[0]
		}
	}
	chatStorage[userId] = item

	SaveChatStorage()
}

func GetChatStorage(userId string) ChatStorageItem {
	item, exists := chatStorage[userId]
	if !exists {
		currentTime := time.Now().Unix()
		chatKeyWithTimestamp := userId + "_" + strconv.FormatInt(currentTime, 10)
		item = ChatStorageItem{Network: true, ChatKey: chatKeyWithTimestamp, Count: 1}
	} else {
		item.Count = item.Count + 1
	}

	chatStorage[userId] = item

	SaveChatStorage()

	return item
}

func SaveChatStorage() {
	cfg := config.LoadConfig()

	// 将 chatStorage 序列化为 JSON 格式
	data, err := json.Marshal(chatStorage)
	if err != nil {
		fmt.Println("序列化失败：", err)
		return
	}

	// 创建文件
	file, err := os.Create(cfg.ChatGPTChatStorageFileName)
	if err != nil {
		fmt.Println("创建文件失败：", err)
		return
	}

	defer file.Close()

	// 将 JSON 数据写入文件
	_, err = file.Write(data)
	if err != nil {
		fmt.Println("写入文件失败：", err)
		return
	}
}
