package storage

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"
	"zhongjyuan/wechatgpt/config"
)

type MessageStorageItem struct {
	Prompt string
	Reply  string
}

func loadMessageStorage() map[string][]MessageStorageItem {
	cfg := config.LoadConfig()
	messageStorage := make(map[string][]MessageStorageItem)

	// 打开 messageStorage.json 文件
	file, err := os.Open(cfg.ChatGPTMessageStorageFileName)
	if err != nil {
		fmt.Println("打开文件失败：", err)
		return messageStorage
	}
	defer file.Close()

	// 将文件内容解析为 JSON 格式，并反序列化为 messageStorage 对象
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&messageStorage)
	if err != nil {
		fmt.Println("解析 JSON 失败：", err)
		return messageStorage
	}

	return messageStorage
}

func SetMessageStorage(userId string, prompt string, reply string) {
	messageStorage := loadMessageStorage()

	items, exists := messageStorage[userId]
	if !exists {
		items = []MessageStorageItem{}
	}

	newItem := MessageStorageItem{Prompt: prompt, Reply: reply}

	items = append(items, newItem)

	messageStorage[userId] = items

	saveMessageStorage(messageStorage)
}

func GetMessageStorage(userId string) []MessageStorageItem {
	messageStorage := loadMessageStorage()

	items, exists := messageStorage[userId]
	if !exists {
		items = []MessageStorageItem{}

		messageStorage[userId] = items

		saveMessageStorage(messageStorage)
	}

	return items
}

func saveMessageStorage(messageStorage map[string][]MessageStorageItem) {
	cfg := config.LoadConfig()

	// 检查文件是否存在，如果不存在则创建一个新的空白文件
	if _, err := os.Stat(cfg.ChatGPTMessageStorageFileName); os.IsNotExist(err) {
		if _, err = os.Create(cfg.ChatGPTMessageStorageFileName); err != nil {
			fmt.Println("创建新文件失败：", err)
			return
		}
	}

	// 检查文件大小是否超过阈值（50MB = 50 * 1024 * 1024 字节）
	fileInfo, err := os.Stat(cfg.ChatGPTMessageStorageFileName)
	if err != nil {
		fmt.Println("获取文件信息失败：", err)
		return
	}

	if fileInfo.Size() >= cfg.ChatGPTMessageStorageFileMaxSize {
		// 进行文件切割操作
		err = splitMessageStorageFile()
		if err != nil {
			fmt.Println("文件切割失败：", err)
			return
		}
	}

	// 将 messageStorage 序列化为 JSON 格式
	data, err := json.Marshal(messageStorage)
	if err != nil {
		fmt.Println("序列化失败：", err)
		return
	}

	// 创建或截断文件
	file, err := os.OpenFile(cfg.ChatGPTMessageStorageFileName, os.O_WRONLY|os.O_TRUNC|os.O_CREATE, 0644)
	if err != nil {
		fmt.Println("打开文件失败：", err)
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

func splitMessageStorageFile() error {
	cfg := config.LoadConfig()
	currentTime := time.Now().Unix()

	messageStorageOldFile := fmt.Sprintf("%s_%s.json", strings.Split(cfg.ChatGPTMessageStorageFileName, ".")[0], strconv.FormatInt(currentTime, 10))

	// 关闭原文件
	err := os.Rename(cfg.ChatGPTMessageStorageFileName, messageStorageOldFile)
	if err != nil {
		return err
	}

	// 创建新文件
	file, err := os.Create(cfg.ChatGPTMessageStorageFileName)
	if err != nil {
		return err
	}

	defer file.Close()

	// TODO: 根据需求进行文件切割逻辑

	return nil
}
