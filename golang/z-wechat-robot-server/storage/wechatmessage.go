package storage

import (
	"encoding/json"
	"os"
	"time"
	"zhongjyuan/wechat-robot-service/config"
)

// 微信消息存储项对象结构
type WechatMessageStorageItem struct {
	Content       string    // 内容
	ContentTime   time.Time // 内容时间
	ContentSender string    // 内容发送者
}

// WechatMessageStorageDateMap 是一个映射，将日期映射到微信消息存储项列表
type WechatMessageStorageDateMap map[string][]WechatMessageStorageItem

// saveWechatMessageStorage 用于保存微信消息存储数据。
//
// 输入参数：
//   - messageStorage: 包含微信消息存储数据的映射。
//
// 输出参数：
//   - 无。
func saveWechatMessageStorage(messageStorage map[string]WechatMessageStorageDateMap) {
	// 加载配置信息
	cfg := config.LoadConfig()

	CollectWechatMessageData()

	// 微信消息缓存是否开启
	if !cfg.WechatMessageStorage {
		return
	}

	// 检查文件是否存在，如果不存在则创建一个新的空白文件
	if _, err := os.Stat(cfg.WechatMessageStorageFileName); os.IsNotExist(err) {
		if _, err = os.Create(cfg.WechatMessageStorageFileName); err != nil {
			config.Logger().Warn("创建Wechat消息缓存文件失败：", err)
			return
		}
	}

	// 检查文件大小是否超过阈值（50MB = 50 * 1024 * 1024 字节）
	fileInfo, err := os.Stat(cfg.WechatMessageStorageFileName)
	if err != nil {
		config.Logger().Warn("获取Wechat消息缓存文件信息失败：", err)
		return
	}

	if fileInfo.Size() >= cfg.WechatMessageStorageFileMaxSize {
		// 进行文件切割操作
		err = FileSplit(cfg.WechatMessageStorageFileName)
		if err != nil {
			config.Logger().Warn("Wechat消息缓存文件切割失败：", err)
			return
		}
	}

	// 将 messageStorage 序列化为 JSON 格式
	data, err := json.Marshal(messageStorage)
	if err != nil {
		config.Logger().Warn("Wechat消息缓存序列化失败：", err)
		return
	}

	// 创建或截断文件
	file, err := os.OpenFile(cfg.WechatMessageStorageFileName, os.O_WRONLY|os.O_TRUNC|os.O_CREATE, 0644)
	if err != nil {
		config.Logger().Warn("打开Wechat消息缓存文件失败：", err)
		return
	}

	defer file.Close()

	// 将 JSON 数据写入文件
	_, err = file.Write(data)
	if err != nil {
		config.Logger().Warn("写入Wechat消息缓存文件失败：", err)
		return
	}
}

// loadWechatMessageStorage 用于加载微信消息存储数据。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - map[string]WechatMessageStorageDateMap: 加载并返回的微信消息存储数据映射。
func loadWechatMessageStorage() map[string]WechatMessageStorageDateMap {
	// 加载配置文件
	cfg := config.LoadConfig()

	// 创建消息存储映射
	messageStorage := make(map[string]WechatMessageStorageDateMap)

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
		config.Logger().Warn("打开Wechat消息缓存文件失败：", err)
		return messageStorage
	}

	defer file.Close()

	// 将文件内容解析为 JSON 格式，并反序列化为 messageStorage 对象
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&messageStorage)
	if err != nil {
		config.Logger().Warn("解析Wechat消息缓存JSON失败：", err)
		return messageStorage
	}

	return messageStorage
}

// SetWechatMessageStorage 用于设置微信消息存储数据。
//
// 输入参数：
//   - key: 用户标识键。
//   - content: 消息内容。
//   - sender: 发送者信息。
//
// 输出参数：
//   - 无。
func SetWechatMessageStorage(key string, content string, sender string) {
	// 加载消息存储数据
	messageStorage := loadWechatMessageStorage()

	// 检查是否存在该用户的消息存储项，如果不存在则创建一个空的列表
	items, exists := messageStorage[key]
	if !exists {
		items = make(map[string][]WechatMessageStorageItem)
	}

	// 创建一条消息存储项并添加到列表中
	newItem := WechatMessageStorageItem{Content: content, ContentTime: time.Now(), ContentSender: sender}

	date := time.Now().Format("2006-01-02")
	items[date] = append(items[date], newItem)

	// 更新该用户的消息存储项
	messageStorage[key] = items

	// 保存消息存储
	saveWechatMessageStorage(messageStorage)
}

// GetWechatMessageStorage 用于获取指定用户的微信消息存储数据。
//
// 输入参数：
//   - key: 用户标识键。
//
// 输出参数：
//   - 返回指定用户的微信消息存储数据。
func GetWechatMessageStorage(key string) WechatMessageStorageDateMap {
	// 加载消息存储数据
	messageStorage := loadWechatMessageStorage()

	// 检查是否存在该用户的消息存储项，如果不存在则创建一个空的列表并保存
	items, exists := messageStorage[key]
	if !exists {
		items = make(map[string][]WechatMessageStorageItem)
		messageStorage[key] = items
		saveWechatMessageStorage(messageStorage)
	}

	return items
}

// GetWechatMessageDateStorage 用于获取指定用户在指定日期的微信消息存储数据。
//
// 输入参数：
//   - key: 用户标识键。
//   - date: 指定日期，格式为 "2006-01-02"。
//
// 输出参数：
//   - 返回指定用户在指定日期的微信消息存储数据。
func GetWechatMessageDateStorage(key string, date string) []WechatMessageStorageItem {
	// 加载消息存储数据
	messageStorage := loadWechatMessageStorage()

	// 检查是否存在该用户的消息存储项，如果不存在则创建一个空的列表并保存
	items, exists := messageStorage[key]
	if !exists {
		items = make(map[string][]WechatMessageStorageItem)
		messageStorage[key] = items
		saveWechatMessageStorage(messageStorage)
	}

	return items[date]
}
