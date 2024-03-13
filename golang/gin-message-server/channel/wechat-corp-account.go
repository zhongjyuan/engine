package channel

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"
	"zhongjyuan/gin-message-server/common"
	"zhongjyuan/gin-message-server/model"
)

// WeChatCorpAccountResponse 包含从企业微信接口返回的信息。
type WeChatCorpAccountResponse struct {
	ErrorCode    int    `json:"errcode"`      // 错误码
	ErrorMessage string `json:"errmsg"`       // 错误消息
	AccessToken  string `json:"access_token"` // 访问令牌
	ExpiresIn    int    `json:"expires_in"`   // 有效期时长
}

// WeChatCorpAccountTokenStoreItem 表示企业微信账号的令牌存储项。
type WeChatCorpAccountTokenStoreItem struct {
	CorpId      string // 企业ID
	AgentSecret string // 应用密钥
	AgentId     string // 应用ID
	AccessToken string // 访问令牌
}

// Key 返回企业微信账号令牌存储项的唯一键。
//
// 输入参数：
//   - i *WeChatCorpAccountTokenStoreItem: 企业微信账号令牌存储项指针
//
// 输出参数：
//   - string: 生成的唯一键
func (i *WeChatCorpAccountTokenStoreItem) Key() string {
	return i.CorpId + i.AgentId + i.AgentSecret
}

// Token 返回企业微信账号令牌存储项的访问令牌。
//
// 输入参数：
//   - i *WeChatCorpAccountTokenStoreItem: 企业微信账号令牌存储项指针
//
// 输出参数：
//   - string: 访问令牌
func (i *WeChatCorpAccountTokenStoreItem) Token() string {
	return i.AccessToken
}

// IsFilled 用于判断企业微信账号令牌存储项是否已填充完整。
//
// 输入参数：
//   - i *WeChatCorpAccountTokenStoreItem: 企业微信账号令牌存储项指针
//
// 输出参数：
//   - bool: 如果企业微信账号令牌存储项已填充完整，则返回 true；否则返回 false。
func (i *WeChatCorpAccountTokenStoreItem) IsFilled() bool {
	return i.CorpId != "" && i.AgentSecret != "" && i.AgentId != ""
}

// IsShared 用于判断企业微信账号是否被多个渠道共享。
//
// 输入参数：
//   - i *WeChatCorpAccountTokenStoreItem: 企业微信账号令牌存储项指针
//
// 输出参数：
//   - bool: 如果企业微信账号被多个渠道共享，则返回 true；否则返回 false。
func (i *WeChatCorpAccountTokenStoreItem) IsShared() bool {
	appId := fmt.Sprintf("%s|%s", i.CorpId, i.AgentId)
	var count int64 = 0
	model.DB.Model(&model.ChannelEntity{}).Where("secret = ? and app_id = ? and type = ?", i.AgentSecret, appId, common.TypeWeChatCorpAccount).Count(&count)
	return count > 1
}

// Refresh 用于刷新企业微信账号的访问令牌。
//
// 输入参数：
//   - i *WeChatCorpAccountTokenStoreItem: 企业微信账号令牌存储项指针
func (i *WeChatCorpAccountTokenStoreItem) Refresh() {
	// https://work.weixin.qq.com/api/doc/90000/90135/91039

	// 创建 HTTP 客户端
	client := http.Client{
		Timeout: 5 * time.Second,
	}

	// 构建 HTTP 请求
	req, err := http.NewRequest("GET", fmt.Sprintf("https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=%s&corpsecret=%s", i.CorpId, i.AgentSecret), nil)
	if err != nil {
		common.SysError(err.Error())
		return
	}

	// 发起 HTTP 请求
	responseData, err := client.Do(req)
	if err != nil {
		common.SysError("failed to refresh access token: " + err.Error())
		return
	}
	defer responseData.Body.Close()

	// 解析响应数据
	var res WeChatCorpAccountResponse
	if err = json.NewDecoder(responseData.Body).Decode(&res); err != nil {
		common.SysError("failed to decode wechatCorpAccountResponse: " + err.Error())
		return
	}

	// 检查是否有错误
	if res.ErrorCode != 0 {
		common.SysError(res.ErrorMessage)
		return
	}

	// 更新访问令牌
	i.AccessToken = res.AccessToken

	// 记录日志
	common.SysLog("access token refreshed")
}

// wechatCorpMessageRequest 用于企业微信消息发送的请求结构体。
type wechatCorpMessageRequest struct {
	MessageType string `json:"msgtype"` // 消息类型
	ToUser      string `json:"touser"`  // 接收消息的用户
	AgentId     string `json:"agentid"` // 应用 agentid
	TextCard    struct {
		Title       string `json:"title"`       // 文本卡片标题
		Description string `json:"description"` // 文本卡片描述
		URL         string `json:"url"`         // 文本卡片链接
	} `json:"textcard"` // 文本卡片消息
	Text struct {
		Content string `json:"content"` // 文本消息内容
	} `json:"text"` // 文本消息
	Markdown struct {
		Content string `json:"content"` // Markdown 消息内容
	} `json:"markdown"` // Markdown 消息
}

// wechatCorpMessageResponse 用于企业微信消息发送的响应结构体。
type wechatCorpMessageResponse struct {
	ErrorCode    int    `json:"errcode"` // 错误码
	ErrorMessage string `json:"errmsg"`  // 错误信息
}

// parseWechatCorpAccountAppId 用于解析微信企业号的 AppId。
//
// 输入参数：
//   - appId string: 微信企业号配置字符串，格式为 "CorpId|AgentSecret"
//
// 输出参数：
//   - string: 返回解析得到的 CorpId
//   - string: 返回解析得到的 AgentSecret
//   - error: 如果解析出错，返回相应错误信息
func parseWechatCorpAccountAppId(appId string) (string, string, error) {
	// 使用 "|" 分割字符串
	parts := strings.Split(appId, "|")
	if len(parts) != 2 {
		return "", "", errors.New("无效的微信企业号配置")
	}
	return parts[0], parts[1], nil
}

// SendWeChatCorpMessage 用于向企业微信发送消息。
//
// 输入参数：
//   - message *model.MessageEntity: 要发送的消息实体
//   - user *model.UserEntity: 用户实体
//   - channel_ *model.ChannelEntity: 渠道实体
//
// 输出参数：
//   - error: 发送消息过程中遇到的错误，如果成功发送则返回 nil
func SendWeChatCorpMessage(message *model.MessageEntity, user *model.UserEntity, channel_ *model.ChannelEntity) error {
	// https://developer.work.weixin.qq.com/document/path/90236

	// 解析企业微信账号的 CorpId 和 AgentId
	corpId, agentId, err := parseWechatCorpAccountAppId(channel_.AppId)
	if err != nil {
		return err
	}

	// 设置接收消息的用户ID
	userId := channel_.AccountId
	clientType := channel_.Other
	agentSecret := channel_.Secret
	messageRequest := wechatCorpMessageRequest{
		ToUser:  userId,
		AgentId: agentId,
	}

	// 根据消息中指定的接收用户更新 ToUser 字段
	if message.To != "" {
		messageRequest.ToUser = message.To
	}

	// 根据消息内容设置不同类型的消息
	if message.Content == "" {
		if message.Title == "" {
			messageRequest.MessageType = "text"
			messageRequest.Text.Content = message.Description
		} else {
			messageRequest.MessageType = "textcard"
			messageRequest.TextCard.Title = message.Title
			messageRequest.TextCard.Description = message.Description
			messageRequest.TextCard.URL = common.ServerAddress
		}
	} else {
		if clientType == "plugin" {
			messageRequest.MessageType = "textcard"
			messageRequest.TextCard.Title = message.Title
			messageRequest.TextCard.Description = message.Description
			messageRequest.TextCard.URL = message.URL
		} else {
			messageRequest.MessageType = "markdown"
			messageRequest.Markdown.Content = message.Content
		}
	}

	// 将消息结构体转换为 JSON 数据
	jsonData, err := json.Marshal(messageRequest)
	if err != nil {
		return err
	}

	// 构建 key 并从 TokenStore 中获取访问令牌
	key := fmt.Sprintf("%s%s%s", corpId, agentId, agentSecret)
	accessToken := GetTokenFromTokenStore(key)

	// 使用 HTTP POST 请求向企业微信发送消息
	resp, err := http.Post(fmt.Sprintf("https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=%s", accessToken), "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}

	// 解析响应信息
	var res wechatCorpMessageResponse
	if err = json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return err
	}

	// 检查是否发送成功
	if res.ErrorCode != 0 {
		return errors.New(res.ErrorMessage)
	}

	return nil
}
