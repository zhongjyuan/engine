package channel

import (
	"crypto/hmac"
	"crypto/sha1"
	"encoding/base64"
	"encoding/json"
	"errors"
	"math/rand"
	"net/http"
	"net/url"
	"sort"
	"strconv"
	"strings"
	"time"
	"zhongjyuan/gin-message-server/model"
)

// TencentAlarmResponse 代表腾讯告警响应结构体。
type TencentAlarmResponse struct {
	Code     int    `json:"code"`     // 响应状态码
	Message  string `json:"message"`  // 响应消息
	CodeDesc string `json:"codeDesc"` // 状态码描述
}

// SendTencentAlarmMessage 用于发送腾讯告警消息。
//
// 输入参数：
//   - message *model.MessageEntity: 消息实体
//   - user *model.UserEntity: 用户实体
//   - channel_ *model.ChannelEntity: 渠道实体
//
// 输出参数：
//   - error: 发送过程中的错误，如果成功发送则返回 nil。
func SendTencentAlarmMessage(message *model.MessageEntity, user *model.UserEntity, channel_ *model.ChannelEntity) error {
	// 获取所需参数
	secretId := channel_.AppId     // 应用ID
	secretKey := channel_.Secret   // 密钥
	policyId := channel_.AccountId // 账号ID
	region := channel_.Other       // 区域

	// 如果消息描述为空，则使用消息内容作为描述
	if message.Description == "" {
		message.Description = message.Content
	}

	// 构建请求参数
	params := map[string]string{
		"Action":    "SendCustomAlarmMsg",                     // 操作
		"Region":    region,                                   // 区域
		"Timestamp": strconv.FormatInt(time.Now().Unix(), 10), // 时间戳
		"Nonce":     strconv.Itoa(rand.Intn(65535)),           // 随机数
		"SecretId":  secretId,                                 // 应用ID
		"policyId":  policyId,                                 // 账号ID
		"msg":       message.Description,                      // 消息描述
	}

	// 对参数按键名进行排序
	keys := make([]string, 0, len(params))
	for key := range params {
		keys = append(keys, key)
	}
	sort.Strings(keys)

	srcStr := "GETmonitor.api.qcloud.com/v2/index.php?"
	for _, key := range keys {
		srcStr += key + "=" + params[key] + "&"
	}
	srcStr = srcStr[:len(srcStr)-1]

	// 计算签名并添加到参数中
	h := hmac.New(sha1.New, []byte(secretKey))
	h.Write([]byte(srcStr))
	signature := base64.StdEncoding.EncodeToString(h.Sum(nil))
	params["Signature"] = signature

	// 构建请求URL
	urlStr := "https://monitor.api.qcloud.com/v2/index.php?" + urlEncode(params)

	// 发起HTTP请求
	client := &http.Client{}
	req, err := http.NewRequest("GET", urlStr, nil)
	if err != nil {
		return err
	}

	resp, err := client.Do(req)
	if err != nil {
		return err
	}

	// 解析响应
	var response TencentAlarmResponse
	if err = json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return err
	}

	// 检查响应状态
	if response.Code != 0 {
		return errors.New(response.Message)
	}
	return nil
}

// urlEncode 用于对参数进行URL编码。
//
// 输入参数：
//   - params map[string]string: 待编码的参数
//
// 输出参数：
//   - string: URL编码后的字符串
func urlEncode(params map[string]string) string {
	var encodedParams []string
	for key, value := range params {
		encodedParams = append(encodedParams, url.QueryEscape(key)+"="+url.QueryEscape(value))
	}
	return strings.Join(encodedParams, "&")
}
