package channel

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"
	"zhongjyuan/gin-message-server/common"
	"zhongjyuan/gin-message-server/model"
)

// WechatTestAccountResponse 用于解析测试公众号的接口响应信息。
type WechatTestAccountResponse struct {
	ErrorCode    int    `json:"errcode"`      // 错误码
	ErrorMessage string `json:"errmsg"`       // 错误消息
	AccessToken  string `json:"access_token"` // 访问令牌
	ExpiresIn    int    `json:"expires_in"`   // 过期时间
}

// WeChatTestAccountTokenStoreItem 定义测试公众号的 Token 存储结构体。
type WeChatTestAccountTokenStoreItem struct {
	AppID       string // 应用ID
	AppSecret   string // 应用密钥
	AccessToken string // 访问令牌
}

// Key 方法用于生成 Token 存储结构体的键。
func (i *WeChatTestAccountTokenStoreItem) Key() string {
	return i.AppID + i.AppSecret
}

// Token 方法用于获取 Token 存储结构体中的 AccessToken。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - string: 返回 Token 存储结构体中的 AccessToken。
func (i *WeChatTestAccountTokenStoreItem) Token() string {
	return i.AccessToken
}

// IsFilled 方法用于判断 Token 存储结构体是否填充完整。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果 Token 存储结构体填充完整，则返回 true；否则返回 false。
func (i *WeChatTestAccountTokenStoreItem) IsFilled() bool {
	return i.AppID != "" && i.AppSecret != ""
}

// IsShared 方法用于判断 Token 存储结构体是否是共享的。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果 Token 存储结构体是共享的，则返回 true；否则返回 false。
func (i *WeChatTestAccountTokenStoreItem) IsShared() bool {
	var count int64 = 0
	model.DB.Model(&model.ChannelEntity{}).Where("secret = ? and app_id = ? and type = ?",
		i.AppSecret, i.AppID, common.TypeWeChatTestAccount).Count(&count)
	return count > 1
}

// Refresh 方法用于刷新测试公众号的访问令牌。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func (i *WeChatTestAccountTokenStoreItem) Refresh() {
	// https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html
	client := http.Client{
		Timeout: 5 * time.Second,
	}

	req, err := http.NewRequest("GET", fmt.Sprintf("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s", i.AppID, i.AppSecret), nil)
	if err != nil {
		common.SysError(err.Error())
		return
	}

	responseData, err := client.Do(req)
	if err != nil {
		common.SysError("failed to refresh access token: " + err.Error())
		return
	}
	defer responseData.Body.Close()

	var res WechatTestAccountResponse
	if err = json.NewDecoder(responseData.Body).Decode(&res); err != nil {
		common.SysError("failed to decode wechatTestAccountResponse: " + err.Error())
		return
	}

	if res.ErrorCode != 0 {
		common.SysError(res.ErrorMessage)
		return
	}

	i.AccessToken = res.AccessToken

	common.SysLog("access token refreshed")
}

// wechatTestAccountRequestValue 用于定义测试公众号消息请求中的值。
type wechatTestAccountRequestValue struct {
	Value string `json:"value"`
}

// wechatTestMessageRequest 用于定义测试公众号消息请求结构体。
type wechatTestMessageRequest struct {
	ToUser     string `json:"touser"`      // 用户
	TemplateId string `json:"template_id"` // 模板ID
	URL        string `json:"url"`         // 链接
	Data       struct {
		Text        wechatTestAccountRequestValue `json:"text"`        // 文本
		Title       wechatTestAccountRequestValue `json:"title"`       // 标题
		Description wechatTestAccountRequestValue `json:"description"` // 描述
		Content     wechatTestAccountRequestValue `json:"content"`     // 内容
	} `json:"data"`
}

// wechatTestMessageResponse 用于解析测试公众号发送消息的响应信息。
type wechatTestMessageResponse struct {
	ErrorCode    int    `json:"errcode"` // 错误码
	ErrorMessage string `json:"errmsg"`  // 错误消息
}

// SendWeChatTestMessage 用于向测试公众号发送消息。
//
// 输入参数：
//   - message *model.MessageEntity: 要发送的消息实体
//   - user *model.UserEntity: 用户实体
//   - channel_ *model.ChannelEntity: 渠道实体
//
// 输出参数：
//   - error: 发送消息过程中遇到的错误，如果成功发送则返回 nil
func SendWeChatTestMessage(message *model.MessageEntity, user *model.UserEntity, channel_ *model.ChannelEntity) error {
	// https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Template_Message_Interface.html
	values := wechatTestMessageRequest{
		ToUser:     channel_.AccountId,
		TemplateId: channel_.Other,
		URL:        "",
	}

	if message.To != "" {
		values.ToUser = message.To
	}

	values.Data.Text.Value = message.Description
	values.Data.Title.Value = message.Title
	values.Data.Description.Value = message.Description
	values.Data.Content.Value = message.Content
	values.URL = message.URL

	jsonData, err := json.Marshal(values)
	if err != nil {
		return err
	}

	key := fmt.Sprintf("%s%s", channel_.AppId, channel_.Secret)
	accessToken := GetTokenFromTokenStore(key)
	resp, err := http.Post(fmt.Sprintf("https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=%s", accessToken), "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}

	var res wechatTestMessageResponse
	if err = json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return err
	}

	if res.ErrorCode != 0 {
		return errors.New(res.ErrorMessage)
	}

	return nil
}
