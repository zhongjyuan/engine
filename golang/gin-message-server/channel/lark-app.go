package channel

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"zhongjyuan/gin-message-server/common"
	"zhongjyuan/gin-message-server/model"
)

// larkAppTokenRequest 定义了请求Lark应用令牌的数据结构
type larkAppTokenRequest struct {
	AppID     string `json:"appId"`      // 应用ID
	AppSecret string `json:"app_secret"` // 应用密钥
}

// larkAppTokenResponse 定义了从Lark服务器接收的应用令牌响应数据结构
type larkAppTokenResponse struct {
	Code              int    `json:"code"`                // 响应状态码
	Msg               string `json:"msg"`                 // 响应消息
	TenantAccessToken string `json:"tenant_access_token"` // 租户访问令牌
	Expire            int    `json:"expire"`              // 令牌过期时间
}

// LarkAppTokenStoreItem 用于存储Lark应用令牌的数据结构
type LarkAppTokenStoreItem struct {
	AppID       string // 应用ID
	AppSecret   string // 应用密钥
	AccessToken string // 访问令牌
}

// Key 方法返回LarkAppTokenStoreItem实例的唯一标识键
//
// 输入参数：
//   - 无
//
// 输出参数：
//   - string: LarkAppTokenStoreItem实例的AppID和AppSecret拼接而成的字符串作为键
func (i *LarkAppTokenStoreItem) Key() string {
	return i.AppID + i.AppSecret
}

// IsShared 方法用于判断LarkAppTokenStoreItem实例是否被多个渠道共享
//
// 输入参数：
//   - 无
//
// 输出参数：
//   - bool: 如果LarkAppTokenStoreItem实例被多个渠道共享，则返回 true；否则返回 false
func (i *LarkAppTokenStoreItem) IsShared() bool {
	var count int64 = 0
	model.DB.Model(&model.ChannelEntity{}).Where("secret = ? and app_id = ? and type = ?", i.AppSecret, i.AppID, common.TypeLarkApp).Count(&count)
	return count > 1
}

// IsFilled 方法用于判断LarkAppTokenStoreItem实例的AppID和AppSecret是否已填充
//
// 输入参数：
//   - 无
//
// 输出参数：
//   - bool: 如果AppID和AppSecret已填充，则返回 true；否则返回 false
func (i *LarkAppTokenStoreItem) IsFilled() bool {
	return i.AppID != "" && i.AppSecret != ""
}

// Token 方法返回LarkAppTokenStoreItem实例的访问令牌
//
// 输入参数：
//   - 无
//
// 输出参数：
//   - string: LarkAppTokenStoreItem实例的访问令牌
func (i *LarkAppTokenStoreItem) Token() string {
	return i.AccessToken
}

// Refresh 方法用于刷新LarkAppTokenStoreItem实例的访问令牌
//
// 输入参数：
//   - 无
//
// 输出参数：
//   - 无
func (i *LarkAppTokenStoreItem) Refresh() {
	// 构建刷新令牌请求
	tokenRequest := larkAppTokenRequest{
		AppID:     i.AppID,
		AppSecret: i.AppSecret,
	}

	// 将请求数据转换为JSON格式
	tokenRequestData, err := json.Marshal(tokenRequest)
	if err != nil {
		common.SysError("failed to refresh access token: " + err.Error())
		return
	}

	// 发送POST请求刷新令牌
	responseData, err := http.Post("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", "application/json; charset=utf-8", bytes.NewBuffer(tokenRequestData))
	if err != nil {
		common.SysError("failed to refresh access token: " + err.Error())
		return
	}
	defer responseData.Body.Close()

	// 解析响应数据
	var res larkAppTokenResponse
	if err = json.NewDecoder(responseData.Body).Decode(&res); err != nil {
		common.SysError("failed to decode larkAppTokenResponse: " + err.Error())
		return
	}

	// 检查响应码是否为0
	if res.Code != 0 {
		common.SysError(res.Msg)
		return
	}

	// 更新访问令牌
	i.AccessToken = res.TenantAccessToken
	common.SysLog("access token refreshed")
}

// larkAppMessageRequest 结构定义了发送消息请求的数据结构
type larkAppMessageRequest struct {
	ReceiveId string `json:"receive_id"` // 接收消息的用户或群组ID
	MsgType   string `json:"msg_type"`   // 消息类型
	Content   string `json:"content"`    // 消息内容
}

// larkAppMessageResponse 结构定义了发送消息响应的数据结构
type larkAppMessageResponse struct {
	Code int    `json:"code"` // 响应状态码
	Msg  string `json:"msg"`  // 响应消息
}

// parseLarkAppTarget 函数用于解析飞书应用号消息接收者参数
//
// 输入参数：
//   - target string: 待解析的目标字符串，格式为"appId:receiveId"
//
// 输出参数：
//   - string: 应用号ID
//   - string: 接收者ID
//   - error: 错误信息，如果解析成功则为nil，否则为解析错误的详细信息
func parseLarkAppTarget(target string) (string, string, error) {
	// 使用冒号分割目标字符串
	parts := strings.Split(target, ":")
	if len(parts) != 2 {
		return "", "", errors.New("无效的飞书应用号消息接收者参数")
	}
	return parts[0], parts[1], nil
}

// SendLarkAppMessage 函数用于发送飞书应用号消息
//
// 输入参数：
//   - message *model.MessageEntity: 消息实体对象，包含消息内容和描述等信息
//   - user *model.UserEntity: 用户实体对象，用于获取用户相关信息
//   - channel_ *model.ChannelEntity: 渠道实体对象，包含渠道相关信息
//
// 输出参数：
//   - error: 发送消息过程中遇到的错误，如果成功发送消息则为nil，否则为发送消息失败的详细信息
func SendLarkAppMessage(message *model.MessageEntity, user *model.UserEntity, channel_ *model.ChannelEntity) error {
	// 获取消息的接收者目标字符串
	rawTarget := message.To
	if rawTarget == "" {
		rawTarget = channel_.AccountId
	}

	// 解析目标字符串，获取目标类型和目标ID
	targetType, target, err := parseLarkAppTarget(rawTarget)
	if err != nil {
		return err
	}

	// 构建发送消息的请求结构体
	request := larkAppMessageRequest{
		ReceiveId: target,
	}

	// 获取at前缀
	atPrefix := getLarkAtPrefix(message)

	if message.Description != "" {
		// 构建文本消息内容
		request.MsgType = "text"
		content := larkTextContent{Text: atPrefix + message.Description}
		contentData, err := json.Marshal(content)
		if err != nil {
			return err
		}
		request.Content = string(contentData)
	} else {
		// 构建交互卡片消息内容
		request.MsgType = "interactive"
		content := larkCardContent{}
		content.Config.WideScreenMode = true
		content.Config.EnableForward = true
		content.Elements = append(content.Elements, larkMessageRequestCardElement{
			Tag: "div",
			Text: larkMessageRequestCardElementText{
				Content: atPrefix + message.Content,
				Tag:     "lark_md",
			},
		})
		contentData, err := json.Marshal(content)
		if err != nil {
			return err
		}
		request.Content = string(contentData)
	}

	// 将请求结构体转换为JSON格式
	requestData, err := json.Marshal(request)
	if err != nil {
		return err
	}

	// 获取访问令牌
	key := fmt.Sprintf("%s%s", channel_.AppId, channel_.Secret)
	accessToken := GetTokenFromTokenStore(key)

	// 构建请求URL并发送POST请求
	url := fmt.Sprintf("https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=%s", targetType)
	req, _ := http.NewRequest("POST", url, bytes.NewReader(requestData))
	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("Content-Type", "application/json; charset=utf-8")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}

	// 解析响应数据
	var res larkAppMessageResponse
	if err = json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return err
	}

	// 检查响应状态码，如果不为0则返回错误信息
	if res.Code != 0 {
		return errors.New(res.Msg)
	}

	return nil
}
