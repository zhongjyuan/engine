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

// 微信消息存储项对象结构
type WechatMessageStorageItem struct {
	Content       string    // 内容
	ContentTime   time.Time // 内容时间
	ContentSender string    // 内容发送者
}

func loadWechatMessageStorage() map[string][]WechatMessageStorageItem {
	// 加载配置文件
	cfg := config.LoadConfig()

	// 创建消息存储映射
	messageStorage := make(map[string][]WechatMessageStorageItem)

	// 校验缓存是否开启
	if !cfg.WechatMessageStorage {
		return messageStorage
	}

	// 校验文件是否存在
	if _, err := os.Stat(cfg.WechatMessageStorageFileName); os.IsNotExist(err) {
		return messageStorage
	}

	// 打开 messageStorage.json 文件
	file, err := os.Open(cfg.WechatMessageStorageFileName)
	if err != nil {
		fmt.Println("打开Wechat消息缓存文件失败：", err)
		return messageStorage
	}

	defer file.Close()

	// 将文件内容解析为 JSON 格式，并反序列化为 messageStorage 对象
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&messageStorage)
	if err != nil {
		fmt.Println("解析Wechat消息缓存JSON失败：", err)
		return messageStorage
	}

	return messageStorage
}

func SetWechatMessageStorage(key string, content string, sender string) {
	// 加载消息存储数据
	messageStorage := loadWechatMessageStorage()

	// 检查是否存在该用户的消息存储项，如果不存在则创建一个空的列表
	items, exists := messageStorage[key]
	if !exists {
		items = []WechatMessageStorageItem{}
	}

	// 创建一条消息存储项并添加到列表中
	newItem := WechatMessageStorageItem{Content: content, ContentTime: time.Now(), ContentSender: sender}
	items = append(items, newItem)

	// 更新该用户的消息存储项
	messageStorage[key] = items

	// 保存消息存储
	saveWechatMessageStorage(messageStorage)
}

func GetWechatMessageStorage(key string) []WechatMessageStorageItem {
	// 加载消息存储数据
	messageStorage := loadWechatMessageStorage()

	// 检查是否存在该用户的消息存储项，如果不存在则创建一个空的列表并保存
	items, exists := messageStorage[key]
	if !exists {
		items = []WechatMessageStorageItem{}
		messageStorage[key] = items
		saveWechatMessageStorage(messageStorage)
	}

	return items
}
func saveWechatMessageStorage(messageStorage map[string][]WechatMessageStorageItem) {
	// 加载配置信息
	cfg := config.LoadConfig()

	if !cfg.WechatMessageStorage {
		return
	}

	// 检查文件是否存在，如果不存在则创建一个新的空白文件
	if _, err := os.Stat(cfg.WechatMessageStorageFileName); os.IsNotExist(err) {
		if _, err = os.Create(cfg.WechatMessageStorageFileName); err != nil {
			fmt.Println("创建Wechat消息缓存文件失败：", err)
			return
		}
	}

	// 检查文件大小是否超过阈值（50MB = 50 * 1024 * 1024 字节）
	fileInfo, err := os.Stat(cfg.WechatMessageStorageFileName)
	if err != nil {
		fmt.Println("获取Wechat消息缓存文件信息失败：", err)
		return
	}

	if fileInfo.Size() >= cfg.WechatMessageStorageFileMaxSize {
		// 进行文件切割操作
		err = splitWechatMessageStorageFile()
		if err != nil {
			fmt.Println("Wechat消息缓存文件切割失败：", err)
			return
		}
	}

	// 将 messageStorage 序列化为 JSON 格式
	data, err := json.Marshal(messageStorage)
	if err != nil {
		fmt.Println("Wechat消息缓存序列化失败：", err)
		return
	}

	// 创建或截断文件
	file, err := os.OpenFile(cfg.WechatMessageStorageFileName, os.O_WRONLY|os.O_TRUNC|os.O_CREATE, 0644)
	if err != nil {
		fmt.Println("打开Wechat消息缓存文件失败：", err)
		return
	}

	defer file.Close()

	// 将 JSON 数据写入文件
	_, err = file.Write(data)
	if err != nil {
		fmt.Println("写入Wechat消息缓存文件失败：", err)
		return
	}
}

func splitWechatMessageStorageFile() error {
	// 加载配置信息
	cfg := config.LoadConfig()

	// 获取当前时间戳
	currentTime := time.Now().Unix()

	// 构造旧文件名
	messageStorageOldFile := fmt.Sprintf("%s_%s.json", strings.Split(cfg.WechatMessageStorageFileName, ".")[0], strconv.FormatInt(currentTime, 10))

	// 关闭原文件
	err := os.Rename(cfg.WechatMessageStorageFileName, messageStorageOldFile)
	if err != nil {
		return err
	}

	// 创建新文件
	file, err := os.Create(cfg.WechatMessageStorageFileName)
	if err != nil {
		return err
	}

	defer file.Close()

	// TODO: 根据需求进行文件切割逻辑

	return nil
}
