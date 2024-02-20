package storage

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"zhongjyuan/wechatgpt/config"
	"zhongjyuan/wechatgpt/core"
)

// CollectGPTChatData 用于收集 GPT 聊天数据。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func CollectGPTChatData() {
	url := config.LoadConfig().CollectServer + "/collect/gpt/chat/"

	// 获取当前登录的微信用户
	currentUser, err := config.GetBot().CurrentUser()
	if err != nil {
		return
	}

	// 将 GPT 聊天数据转为 JSON 格式
	data, err := json.Marshal(gptChatStorage)
	if err != nil {
		config.Logger().Error("collect gpt storage chat error：", err)
		return
	}

	// 构造请求数据
	jsonData, err := json.Marshal(struct {
		Owner string
		Data  []byte
	}{
		Owner: currentUser.NickName,
		Data:  data,
	})
	if err != nil {
		config.Logger().Error("collect gpt chat marshal error：", err)
		return
	}

	// 发送 POST 请求
	response, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		config.Logger().Error("collect gpt chat request error：", err)
		return
	}
	defer response.Body.Close()

	config.Logger().Trace("collect gpt chat status", response.Status)
}

// CollectGPTMessageData 用于收集 GPT 消息数据。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func CollectGPTMessageData() {
	url := config.LoadConfig().CollectServer + "/collect/gpt/message/"

	// 获取当前登录的微信用户
	currentUser, err := config.GetBot().CurrentUser()
	if err != nil {
		return
	}

	// 将 GPT 消息数据转为 JSON 格式
	data, err := json.Marshal(loadGPTMessageStorage())
	if err != nil {
		config.Logger().Error("collect gpt message chat error：", err)
		return
	}

	// 构造请求数据
	jsonData, err := json.Marshal(struct {
		Owner string
		Data  []byte
	}{
		Owner: currentUser.NickName,
		Data:  data,
	})
	if err != nil {
		config.Logger().Error("collect gpt message marshal error：", err)
		return
	}

	// 发送 POST 请求
	response, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		config.Logger().Error("collect gpt message request error：", err)
		return
	}
	defer response.Body.Close()

	config.Logger().Trace("collect gpt message status", response.Status)
}

// CollectWechatStorageData 用于收集微信存储数据。
//
// 输入参数：
//   - item core.HotReloadStorageItem: 要收集的微信存储数据。
//
// 输出参数：
//   - 无。
func CollectWechatStorageData(item core.HotReloadStorageItem) {
	url := config.LoadConfig().CollectServer + "/collect/wechat/storage/"

	// 获取当前登录的微信用户
	currentUser, err := config.GetBot().CurrentUser()
	if err != nil {
		return
	}

	// 将微信存储数据转为 JSON 格式
	data, err := json.Marshal(item)
	if err != nil {
		config.Logger().Error("collect wechat storage marshal error：", err)
		return
	}

	// 构造请求数据
	jsonData, err := json.Marshal(struct {
		Owner string
		Data  []byte
	}{
		Owner: currentUser.NickName,
		Data:  data,
	})
	if err != nil {
		config.Logger().Error("collect wechat storage marshal error：", err)
		return
	}

	// 发送 POST 请求
	response, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		config.Logger().Error("collect wechat storage request error：", err)
		return
	}
	defer response.Body.Close()

	config.Logger().Trace("collect wechat storage status", response.Status)
}

// CollectWechatMessageData 用于收集微信消息数据。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func CollectWechatMessageData() {
	url := config.LoadConfig().CollectServer + "/collect/wechat/message/"

	// 获取当前登录的微信用户
	currentUser, err := config.GetBot().CurrentUser()
	if err != nil {
		return
	}

	// 将微信消息数据转为 JSON 格式
	data, err := json.Marshal(loadWechatMessageStorage())
	if err != nil {
		config.Logger().Error("collect wechat message chat error：", err)
		return
	}

	// 构造请求数据
	jsonData, err := json.Marshal(struct {
		Owner string
		Data  []byte
	}{
		Owner: currentUser.NickName,
		Data:  data,
	})
	if err != nil {
		config.Logger().Error("collect wechat message marshal error：", err)
		return
	}

	// 发送 POST 请求
	response, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		config.Logger().Error("collect wechat message request error：", err)
		return
	}
	defer response.Body.Close()

	config.Logger().Trace("collect wechat message status", response.Status)
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
	url := config.LoadConfig().CollectServer + "/collect/wechat/media/"

	// 获取当前登录的微信用户
	currentUser, err := config.GetBot().CurrentUser()
	if err != nil {
		return
	}

	// 读取响应body中的数据
	data, err := io.ReadAll(res.Body)
	if err != nil {
		config.Logger().Error("collect wechat media read error：", err)
		return
	}

	// 构造请求数据
	jsonData, err := json.Marshal(struct {
		Owner    string
		FileName string
		Data     []byte
	}{
		Owner:    currentUser.NickName,
		FileName: fileName,
		Data:     data,
	})
	if err != nil {
		config.Logger().Error("collect wechat media marshal error：", err)
		return
	}

	// 发送 POST 请求
	response, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		config.Logger().Error("collect wechat media request error：", err)
		return
	}
	defer response.Body.Close()

	config.Logger().Trace("collect wechat media status", response.Status)
}
