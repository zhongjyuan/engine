package middleware

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"
	"zhongjyuan/gin-wechat-server/common"
)

// WeChatAccessTokenStore 是用于存储访问令牌信息的结构体。
type WeChatAccessTokenStore struct {
	Mutex              sync.RWMutex // Mutex 用于同步访问令牌的读写操作
	AccessToken        string       // AccessToken 用于存储访问令牌的字符串
	ExpirationDuration int          // ExpirationDuration 用于存储访问令牌的过期时间（单位：秒）
}

// WeChatAccessTokenResponse 是用于表示响应结构体的类型。
type WeChatAccessTokenResponse struct {
	AccessToken        string `json:"access_token"` // AccessToken 表示访问令牌
	ExpirationDuration int    `json:"expires_in"`   // ExpirationDuration 表示访问令牌的过期时间（单位：秒）
}

// 存储访问令牌信息的全局变量
var store WeChatAccessTokenStore

// InitWeChatAccessTokenStore 用于初始化访问令牌存储，并定时刷新访问令牌。
func InitWeChatAccessTokenStore() {
	go func() {
		for {
			RefreshWeChatAccessToken()                                   // 刷新访问令牌
			store.Mutex.RLock()                                          // 加读锁保护并发访问
			sleepDuration := common.IntMax(store.ExpirationDuration, 60) // 获取休眠时间，确保不会出现负值
			store.Mutex.RUnlock()                                        // 解读锁
			time.Sleep(time.Duration(sleepDuration) * time.Second)       // 休眠指定时长
		}
	}()
}

// RefreshWeChatAccessToken 用于刷新访问令牌。
func RefreshWeChatAccessToken() {
	// https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html

	// 创建 HTTP 客户端
	client := http.Client{
		Timeout: 5 * time.Second,
	}

	// 构建 HTTP 请求
	req, err := http.NewRequest("GET",
		fmt.Sprintf("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s",
			common.WeChatAppID,
			common.WeChatAppSecret,
		),
		nil,
	)
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
	var response WeChatAccessTokenResponse
	if err = json.NewDecoder(responseData.Body).Decode(&response); err != nil {
		common.SysError("failed to decode response: " + err.Error())
		return
	}

	// 更新访问令牌信息
	store.Mutex.Lock()
	store.AccessToken = response.AccessToken
	store.ExpirationDuration = response.ExpirationDuration
	store.Mutex.Unlock()

	common.SysLog("access token refreshed")
}

// GetWeChatAccessToken 用于获取当前的访问令牌。
//
// 输入参数：无。
// 输出参数：
//   - string: 当前的访问令牌。
func GetWeChatAccessToken() string {
	store.Mutex.RLock()
	defer store.Mutex.RUnlock()
	return store.AccessToken
}

// GetWeChatAccessTokenAndExpiration 返回访问令牌及其有效期时长。
//
// 输入参数：无。
// 输出参数：
//   - string: 访问令牌。
//   - int: 有效期时长（秒）。
func GetWeChatAccessTokenAndExpiration() (string, int) {
	store.Mutex.RLock()
	defer store.Mutex.RUnlock()
	return store.AccessToken, store.ExpirationDuration
}
