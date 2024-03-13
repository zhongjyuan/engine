package channel

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"zhongjyuan/gin-message-server/model"
)

// oneBotMessageRequest 用于表示 OneBot 发送消息的请求结构。
type oneBotMessageRequest struct {
	MessageType string `json:"message_type"` // 消息类型
	UserId      int64  `json:"userId"`       // 用户 ID
	GroupId     int64  `json:"group_id"`     // 群组 ID
	Message     string `json:"message"`      // 消息内容
	AutoEscape  bool   `json:"auto_escape"`  // 是否自动转义
}

// oneBotMessageResponse 用于表示 OneBot 发送消息的响应结构。
type oneBotMessageResponse struct {
	Message string `json:"message"` // 回复消息内容
	Status  string `json:"status"`  // 响应状态
	RetCode int    `json:"retcode"` // 返回码
}

// SendOneBotMessage 用于发送消息至 OneBot 平台。
//
// 输入参数：
//   - message *model.MessageEntity: 消息实体
//   - user *model.UserEntity: 用户实体
//   - channel_ *model.ChannelEntity: 渠道实体
//
// 输出参数：
//   - error: 如果发送消息过程中出现错误，则返回相应的错误信息；否则返回 nil。
func SendOneBotMessage(message *model.MessageEntity, user *model.UserEntity, channel_ *model.ChannelEntity) error {
	url := fmt.Sprintf("%s/send_msg", channel_.URL) // 构造发送消息的 URL
	req := oneBotMessageRequest{                    // 初始化 OneBot 消息请求结构
		Message: message.Content, // 设置消息内容
	}

	if message.Content == "" { // 如果消息内容为空，使用消息描述作为内容
		req.Message = message.Description
	}

	target := channel_.AccountId // 设置消息发送目标，默认为渠道账号
	if message.To != "" {        // 如果消息指定了发送目标，更新发送目标
		target = message.To
	}

	var idStr string // 目标 ID 字符串
	var type_ string // 目标类型

	parts := strings.Split(target, "_") // 根据下划线分割目标字符串
	if len(parts) == 1 {                // 若只有一个部分，表示为用户类型
		type_ = "user"
		idStr = parts[0]
	} else if len(parts) == 2 { // 若有两个部分，表示包含类型和 ID
		type_ = parts[0]
		idStr = parts[1]
	} else {
		return errors.New("无效的 OneBot 配置") // 目标配置无效，返回错误信息
	}

	id, _ := strconv.ParseInt(idStr, 10, 64) // 将 ID 字符串转换为整型
	if type_ == "user" {                     // 如果目标类型为用户
		req.UserId = id
		req.MessageType = "private"
	} else if type_ == "group" { // 如果目标类型为群组
		req.GroupId = id
		req.MessageType = "group"
	} else {
		return errors.New("无效的 OneBot 配置") // 目标配置无效，返回错误信息
	}

	reqBody, err := json.Marshal(req) // 将消息请求结构体转换为 JSON 格式
	if err != nil {
		return err
	}

	request, _ := http.NewRequest("POST", url, bytes.NewReader(reqBody)) // 创建 HTTP POST 请求
	request.Header.Set("Authorization", "Bearer "+channel_.Secret)       // 设置 Authorization 头部
	request.Header.Set("Content-Type", "application/json")               // 设置 Content-Type 头部

	resp, err := http.DefaultClient.Do(request) // 发起 HTTP 请求
	if err != nil {
		return err
	}

	if resp.StatusCode != 200 { // 检查响应状态码
		return errors.New(resp.Status)
	}

	var res oneBotMessageResponse                                  // 定义 OneBot 消息响应结构体
	if err = json.NewDecoder(resp.Body).Decode(&res); err != nil { // 解析响应体
		return err
	}

	if res.RetCode != 0 { // 检查响应返回码
		return errors.New(res.Message)
	}

	return nil
}
