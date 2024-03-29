package wechatbot

import (
	"bytes"
	"context"
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"net/url"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

// ================================================= [类型](全局)公开 =================================================

// IHttpHook 接口定义了 HTTP 请求的钩子方法。
type IHttpHook interface {
	BeforeRequest(request *http.Request)             // BeforeRequest 将在请求之前调用
	AfterRequest(response *http.Response, err error) // AfterRequest 将在请求之后调用，无论请求成功与否
}

// HttpHooks 是 IHttpHook 接口的切片类型。
type HttpHooks []IHttpHook

// UserAgentHook 是一个自定义的钩子函数类型，用于设置 HTTP 请求的 User-Agent 头部。
type UserAgentHook struct {
	UserAgent string // UserAgent 是要设置的 User-Agent 字符串。
}

// defaultUserAgentHook 默认的User-Agent钩子
var defaultUserAgentHook = UserAgentHook{UOSUserAgent}

// WechatClient http请求客户端(注:客户端需要维持Session会话)
type WechatClient struct {
	mode          Mode         // 设置一些client的请求行为(see webMode desktopMode)
	client        *http.Client // client http客户端
	Domain        Domain       // 主机
	HttpHooks     HttpHooks    // HttpHooks 请求上下文钩子
	MaxRetryTimes int          // MaxRetryTimes 最大重试次数
}

// ContactDetailItemList 是 ContactDetailItemResponse 结构体的切片，用于表示联系人详细信息条目列表。
type ContactDetailItemList []ContactDetailItemResponse

// NewContactDetailItemList 用于根据成员列表创建联系人详细信息条目列表。
//
// 参数：
//   - contacts：成员列表。
//
// 返回值：
//   - UserDetailItemList：表示联系人详细信息条目列表。
func NewContactDetailItemList(contacts Contacts) ContactDetailItemList {
	var list = make(ContactDetailItemList, len(contacts)) // 创建与成员列表长度相同的联系人详细信息条目列表

	for index, member := range contacts {
		item := ContactDetailItemResponse{UserName: member.UserName, EncryChatRoomId: member.EncryChatRoomId} // 创建联系人详细信息条目

		list[index] = item // 将联系人详细信息条目添加到列表中
	}

	return list // 返回联系人详细信息条目列表
}

// ================================================= [函数](全局)公开 =================================================

// NewWechatClient 创建一个新的微信客户端。
//
// 输入参数：
//   - httpClient: 自定义的 HTTP 客户端，可以为 nil。
//
// 返回值：
//   - *WechatClient: 返回创建的微信客户端对象指针。
func NewWechatClient(httpClient *http.Client) *WechatClient {
	if httpClient == nil {
		panic("http client is nil")
	}

	client := &WechatClient{client: httpClient}

	client.MaxRetryTimes = 1

	client.SetCookieJar(NewJar())

	return client
}

// DefaultWechatClient 创建一个默认的微信客户端。
//
// 返回值：
//   - *WechatClient: 返回创建的微信客户端对象指针。
func DefaultWechatClient() *WechatClient {
	httpClient := &http.Client{
		// 设置客户端不自动跳转
		CheckRedirect: func(request *http.Request, via []*http.Request) error {
			return http.ErrUseLastResponse
		},

		// 设置30秒超时
		// 因为微信同步消息时是一个时间长达25秒的长轮询
		Timeout: 30 * time.Second,
	}

	client := NewWechatClient(httpClient)

	client.AddHttpHook(defaultUserAgentHook)

	client.MaxRetryTimes = 5

	return client
}

// ================================================= [函数](HttpHooks)公开 =================================================

// BeforeRequest 在发送 HTTP 请求之前执行钩子函数。
//
// 入参：
//   - req：要发送的 HTTP 请求。
//
// 返回值：
//
//	无。
func (hook HttpHooks) BeforeRequest(request *http.Request) {
	// 如果没有注册任何钩子函数，则直接返回
	if len(hook) == 0 {
		return
	}

	// 遍历所有注册的钩子函数，并依次执行钩子函数的 BeforeRequest 方法
	for _, hook := range hook {
		hook.BeforeRequest(request)
	}
}

// AfterRequest 在收到 HTTP 响应之后执行钩子函数。
//
// 入参：
//   - res：HTTP 响应。
//   - err：发送 HTTP 请求时发生的错误。如果请求成功，err 为 nil。
//
// 返回值：
//
//	无。
func (hook HttpHooks) AfterRequest(response *http.Response, err error) {
	// 如果没有注册任何钩子函数，则直接返回
	if len(hook) == 0 {
		return
	}

	// 遍历所有注册的钩子函数，并依次执行钩子函数的 AfterRequest 方法
	for _, hook := range hook {
		hook.AfterRequest(response, err)
	}
}

// ================================================= [函数](UserAgentHook)公开 =================================================

// BeforeRequest 用于在发送 HTTP 请求之前设置请求头中的 User-Agent 信息。
//
// 输入参数：
//   - request: HTTP 请求对象。
func (userAgentHook UserAgentHook) BeforeRequest(request *http.Request) {
	request.Header.Set("Contact-Agent", userAgentHook.UserAgent)
}

// AfterRequest 用于在收到 HTTP 响应之后执行操作。
//
// 输入参数：
//   - response: HTTP 响应对象。
//   - err: 操作过程中遇到的错误。
func (userAgentHook UserAgentHook) AfterRequest(response *http.Response, err error) {}

// ================================================= [函数](WechatClient)公开 =================================================

// GetCookieJar 用于获取 WechatClient 的 CookieJar 对象。
//
// 返回值：
//   - http.CookieJar: WechatClient 的 CookieJar 对象。
func (client *WechatClient) GetCookieJar() http.CookieJar {
	return client.client.Jar // 返回 WechatClient 的 CookieJar 对象
}

// SetCookieJar 设置 WechatClient 的 CookieJar。
//
// 输入参数：
//   - jar: 要设置的 CookieJar 对象。
func (client *WechatClient) SetCookieJar(jar *Jar) {
	client.client.Jar = jar.AsCookieJar() // 将传入的 Jar 对象转换为 CookieJar 并设置给 WechatClient
}

// GetHttpClient 返回 WechatClient 的 HTTP 客户端。
//
// 返回值：
//   - *http.Client: 返回 WechatClient 的 HTTP 客户端对象指针。
func (client *WechatClient) GetHttpClient() *http.Client {
	return client.client // 返回 WechatClient 的 HTTP 客户端对象指针
}

// SetMode 用于设置 WechatClient 的模式。
//
// 输入参数：
//   - mode: 模式。
func (client *WechatClient) SetMode(mode Mode) {
	client.mode = mode // 将 WechatClient 的模式设置为传入的模式
}

// SetDomain 用于设置 WechatClient 的域名信息。
//
// 输入参数：
//   - host: 域名信息。
func (client *WechatClient) SetDomain(host string) {
	client.Domain = Domain(host)
}

// AddHttpHook 向微信客户端添加 HTTP 钩子函数。
//
// 输入参数：
//   - hooks: 可变参数，表示要添加的 HTTP 钩子函数。
func (client *WechatClient) AddHttpHook(hooks ...IHttpHook) {
	client.HttpHooks = append(client.HttpHooks, hooks...)
}

// Do 执行 HTTP 请求并返回响应结果。
//
// 输入参数：
//   - request: 要执行的 HTTP 请求对象。
//
// 返回值：
//   - *http.Response: 返回 HTTP 响应对象指针。
//   - error: 返回执行请求过程中可能产生的错误。
func (client *WechatClient) Do(request *http.Request) (*http.Response, error) {
	// 确保请求能够被执行

	// 如果最大重试次数小于等于 0
	if client.MaxRetryTimes <= 0 {
		client.MaxRetryTimes = 1 // 将最大重试次数设置为 1
	}

	var (
		err               error          // 保存可能产生的错误
		response          *http.Response // 保存返回的响应结果
		clientRequestBody *bytes.Reader  // 请求体字节读取器，用于重新读取请求体内容
	)

	// 执行请求前的钩子函数
	client.HttpHooks.BeforeRequest(request)

	// 在函数返回前执行请求后的钩子函数
	defer func() { client.HttpHooks.AfterRequest(response, err) }()

	// 如果请求体不为空
	if request.Body != nil {
		rawBody, err := io.ReadAll(request.Body) // 读取请求体的原始内容
		if err != nil {
			return nil, fmt.Errorf("io.ReadAll: %w", err) // 返回请求体读取错误
		}

		clientRequestBody = bytes.NewReader(rawBody) // 创建请求体字节读取器
	}

	// 最多重试 MaxRetryTimes 次
	for i := 0; i < client.MaxRetryTimes; i++ {
		// 如果请求体字节读取器不为空
		if clientRequestBody != nil {
			// 将字节读取器的读取位置重置到起始位置
			_, err := clientRequestBody.Seek(0, io.SeekStart)
			if err != nil {
				return nil, fmt.Errorf("requestBody.Seek: %w", err) // 返回请求体重置读取位置错误
			}

			// 重新设置请求体
			request.Body = io.NopCloser(clientRequestBody)
		}

		// 执行 HTTP 请求
		response, err = client.client.Do(request)
		if err == nil { // 如果执行成功，则跳出循环
			break
		}
	}

	// 如果有错误发生
	if err != nil {
		err = errors.Join(Error_Network, err) // 将网络错误与其他错误进行组合
	}

	// 返回响应结果和可能产生的错误
	return response, err
}

// ================================================= [函数](WechatClient)Api - Mode - GetLoginUUID =================================================

// GetLoginUUID 获取登录 UUID。
//
// 输入参数：
//   - ctx: 上下文对象。
//
// 返回值：
//   - *http.Response: 返回 HTTP 响应对象指针。
//   - error: 返回执行请求过程中可能产生的错误。
func (client *WechatClient) GetLoginUUID(ctx context.Context) (*http.Response, error) {
	return client.mode.GetLoginUUID(ctx, client) // 调用当前模式的 GetLoginUUID 方法，并将上下文和 WechatClient 对象传递给它
}

// ================================================= [函数](WechatClient)Api - Mode - PushLogin =================================================

// PushLogin 方法用于推送登录信息。(免扫码登陆)
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - uin int64: 用户Uin。
//
// 输出参数：
//   - *http.Response: HTTP响应对象。
//   - error: 错误对象，如果操作成功则为 nil，否则为具体的错误信息。
func (client *WechatClient) PushLogin(ctx context.Context, uin int64) (*http.Response, error) {
	// 调用 mode 的 PushLogin 方法推送登录信息
	return client.mode.PushLogin(ctx, client, uin)
}

// ================================================= [函数](WechatClient)Api - Mode - GetLoginInfo =================================================

// GetLoginInfo 获取登录信息。
//
// 输入参数：
//   - ctx: 上下文对象。
//   - path: 登录信息的链接地址。
//
// 返回值：
//   - *http.Response: 返回 HTTP 响应对象指针。
//   - error: 返回执行请求过程中可能产生的错误。
func (client *WechatClient) GetLoginInfo(ctx context.Context, path *url.URL) (*http.Response, error) {
	return client.mode.GetLoginInfo(ctx, client, path.String()) // 调用当前模式的 GetLoginInfo 方法，并将上下文、WechatClient 对象和链接地址传递给它
}

// ================================================= [函数](WechatClient)Api - LoginQRCode =================================================

// LoginQRCode 登录二维码。
//
// 输入参数：
//   - ctx: 上下文对象。
//   - uuid: 登录 UUID。
//
// 返回值：
//   - *http.Response: 返回 HTTP 响应对象指针。
//   - error: 返回执行请求过程中可能产生的错误。
func (client *WechatClient) LoginQRCode(ctx context.Context, uuid string) (*http.Response, error) {
	// 拼接二维码链接地址
	path, err := url.Parse(client.Domain.LoginHost() + qrcodePath + uuid)
	if err != nil {
		return nil, err
	}

	// 创建 HTTP 请求对象
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, path.String(), nil)
	if err != nil {
		return nil, err
	}

	// 执行 HTTP 请求
	return client.client.Do(request)
}

// ================================================= [函数](WechatClient)Api - CheckLogin =================================================

// CheckLogin 检查登录状态。
//
// 输入参数：
//   - ctx: 上下文对象。
//   - uuid: 登录 UUID。
//   - tip: 登录提示信息。
//
// 返回值：
//   - *http.Response: 返回 HTTP 响应对象指针。
//   - error: 返回执行请求过程中可能产生的错误。
func (client *WechatClient) CheckLogin(ctx context.Context, uuid, tip string) (*http.Response, error) {
	// 解析登录链接地址
	path, err := url.Parse(client.Domain.LoginHost() + loginPath)
	if err != nil {
		return nil, err
	}

	// 获取当前时间戳
	now := time.Now().Unix()

	// 设置请求参数
	params := url.Values{}
	params.Add("_", strconv.FormatInt(now, 10))
	params.Add("r", strconv.FormatInt(now/1579, 10))
	params.Add("tip", tip)
	params.Add("uuid", uuid)
	params.Add("loginicon", "true")
	path.RawQuery = params.Encode()

	// 创建 HTTP 请求对象
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, path.String(), nil)
	if err != nil {
		return nil, err
	}

	// 执行请求
	return client.Do(request)
}

// ================================================= [函数](WechatClient)Api - Init =================================================

// Init 进行初始化操作。
//
// 输入参数：
//   - ctx: 上下文对象。
//   - request: 基本请求对象。
//
// 返回值：
//   - *http.Response: 返回 HTTP 响应对象指针。
//   - error: 返回执行请求过程中可能产生的错误。
func (client *WechatClient) Init(ctx context.Context, clientRequest *BaseRequest) (*http.Response, error) {
	// 解析初始化链接地址
	path, err := url.Parse(client.Domain.BaseHost() + initPath)
	if err != nil {
		return nil, err
	}

	// 设置请求参数
	params := url.Values{}
	params.Add("_", fmt.Sprintf("%d", time.Now().Unix()))
	path.RawQuery = params.Encode()

	// 创建请求体
	requestData := struct{ BaseRequest *BaseRequest }{BaseRequest: clientRequest}
	body, err := JsonEncode(requestData)
	if err != nil {
		return nil, err
	}

	// 创建 HTTP 请求对象
	request, err := http.NewRequestWithContext(ctx, http.MethodPost, path.String(), body)
	if err != nil {
		return nil, err
	}

	// 设置请求头
	request.Header.Add("Content-Type", ContentTypeJson)

	// 执行请求
	return client.Do(request)
}

// ================================================= [函数](WechatClient)Api - webwxlogout =================================================

// Logout 方法用于退出登录。
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - info *LoginInfoResponse: 登录信息。
//
// 输出参数：
//   - *http.Response: HTTP响应对象。
//   - error: 错误对象，如果操作成功则为 nil，否则为具体的错误信息。
func (client *WechatClient) Logout(ctx context.Context, info *LoginInfoResponse) (*http.Response, error) {
	// 构造退出登录的 URL
	path, err := url.Parse(client.Domain.BaseHost() + logoutPath)
	if err != nil {
		return nil, err
	}

	// 构造 URL 的参数
	params := url.Values{}
	params.Add("skey", info.SKey)
	params.Add("type", "1")
	params.Add("redirect", "1")
	path.RawQuery = params.Encode()

	// 构造 HTTP 请求对象
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, path.String(), nil)
	if err != nil {
		return nil, err
	}

	// 调用 Do 方法发送 HTTP 请求
	return client.Do(request)
}

// ================================================= [函数](WechatClient)Api - webwxstatusnotify =================================================

// StatusNotify 方法用于发送状态通知。
//
// 输入参数：
//   - ctx: 上下文对象。
//   - clientRequest: 客户端状态通知选项。
//
// 返回值：
//   - *http.Response: 返回 HTTP 响应对象指针。
//   - error: 返回执行请求过程中可能产生的错误。
func (client *WechatClient) StatusNotify(ctx context.Context, clientRequest *ClientStatusNotifyRequest) (*http.Response, error) {
	// 解析状态通知链接地址
	path, err := url.Parse(client.Domain.BaseHost() + statusNotifyPath)
	if err != nil {
		return nil, err
	}

	// 设置请求参数
	params := url.Values{}
	params.Add("lang", "zh_CN")
	params.Add("pass_ticket", clientRequest.LoginInfoResponse.PassTicket)
	path.RawQuery = params.Encode()

	// 获取用户名
	username := clientRequest.InitResponse.User.UserName

	// 创建状态通知内容
	requestData := map[string]interface{}{
		"Code":         3,
		"BaseRequest":  clientRequest.BaseRequest,
		"ClientMsgId":  time.Now().Unix(),
		"ToUserName":   username,
		"FromUserName": username,
	}

	// 编码状态通知内容
	buffer, err := JsonEncode(requestData)
	if err != nil {
		return nil, err
	}

	// 创建 HTTP 请求对象
	request, err := http.NewRequestWithContext(ctx, http.MethodPost, path.String(), buffer)
	if err != nil {
		return nil, err
	}

	// 设置请求头
	request.Header.Add("Content-Type", ContentTypeJson)

	// 执行请求
	return client.Do(request)
}

// StatusToRead 方法用于设置消息已读状态。
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - clientRequest *ClientStatusToReadRequest: 设置消息已读状态的选项。
//
// 输出参数：
//   - *http.Response: HTTP响应对象。
//   - error: 错误对象，如果操作成功则为 nil，否则为具体的错误信息。
func (client *WechatClient) StatusToRead(ctx context.Context, clientRequest *ClientStatusToReadRequest) (*http.Response, error) {
	// 构造 URL 对象
	path, err := url.Parse(client.Domain.BaseHost() + statusNotifyPath)
	if err != nil {
		return nil, err
	}

	// 构造消息已读状态内容
	requestData := map[string]interface{}{
		"Code":         1,
		"ClientMsgId":  time.Now().Unix(),
		"BaseRequest":  clientRequest.BaseRequest,
		"Sid":          clientRequest.BaseRequest.Sid,
		"Skey":         clientRequest.BaseRequest.Skey,
		"DeviceID":     clientRequest.BaseRequest.DeviceID,
		"Uin":          clientRequest.LoginInfoResponse.WxUin,
		"ToUserName":   clientRequest.Message.FromUserName,
		"FromUserName": clientRequest.Message.ToUserName,
	}

	// 编码消息内容为 JSON 格式
	body, err := JsonEncode(requestData)
	if err != nil {
		return nil, err
	}

	// 构造 HTTP 请求对象
	request, err := http.NewRequestWithContext(ctx, http.MethodPost, path.String(), body)
	if err != nil {
		return nil, err
	}

	// 设置请求头的 Content-Type
	request.Header.Add("Content-Type", ContentTypeJson)

	// 调用 Do 方法发送 HTTP 请求
	return client.Do(request)
}

// ================================================= [函数](WechatClient)Api - synccheck =================================================

// SyncCheck 方法用于执行同步检查操作。
//
// 输入参数：
//   - ctx: 上下文对象，用于控制请求的上下文信息。
//   - clientRequest: 客户端同步检查选项，包括登录信息和初始化响应等。
//
// 输出参数：
//   - *http.Response: HTTP 响应对象，表示请求的返回结果。
//   - error: 如果执行过程中出现错误，则返回对应的错误信息。
func (client *WechatClient) SyncCheck(ctx context.Context, clientRequest *ClientSyncCheckRequest) (*http.Response, error) {
	path, err := url.Parse(client.Domain.SyncHost() + syncCheckPath) // 解析同步检查链接地址
	if err != nil {
		return nil, err
	}

	params := url.Values{}                                                          // 创建 URL 参数对象
	params.Add("_", strconv.FormatInt(time.Now().UnixNano()/1e6, 10))               // 添加下划线参数
	params.Add("r", strconv.FormatInt(time.Now().UnixNano()/1e6, 10))               // 添加时间戳参数
	params.Add("uin", strconv.FormatInt(clientRequest.LoginInfoResponse.WxUin, 10)) // 添加 WxUin 参数
	params.Add("sid", clientRequest.LoginInfoResponse.WxSid)                        // 添加 WxSid 参数
	params.Add("skey", clientRequest.LoginInfoResponse.SKey)                        // 添加 SKey 参数
	params.Add("deviceid", clientRequest.BaseRequest.DeviceID)                      // 添加设备 ID 参数

	var syncKeyStringSlice = make([]string, clientRequest.InitResponse.SyncKey.Count) // 创建同步键字符串切片

	// 将 SyncKey 里面的元素按照特定的格式拼接起来
	for index, item := range clientRequest.InitResponse.SyncKey.List {
		i := fmt.Sprintf("%d_%d", item.Key, item.Val)
		syncKeyStringSlice[index] = i
	}
	syncKey := strings.Join(syncKeyStringSlice, "|") // 使用 | 符号将同步键字符串切片连接为字符串

	params.Add("synckey", syncKey)                                                      // 添加同步键参数
	path.RawQuery = params.Encode()                                                     // 将参数编码后添加到路径的查询字符串中
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, path.String(), nil) // 创建 GET 请求对象
	if err != nil {
		return nil, err
	}

	return client.Do(request) // 执行请求并返回结果
}

// ================================================= [函数](WechatClient)Api - webwxgetcontact =================================================

// GetContact 方法用于获取联系人信息。
//
// 输入参数：
//   - ctx: 上下文对象，用于控制请求的上下文信息。
//   - sKey: SKey 参数，用于认证身份。
//   - reqs: 请求序列号，用于标识请求的顺序。
//
// 输出参数：
//   - *http.Response: HTTP 响应对象，表示请求的返回结果。
//   - error: 如果执行过程中出现错误，则返回对应的错误信息。
func (client *WechatClient) GetContact(ctx context.Context, sKey string, reqs int64) (*http.Response, error) {
	path, err := url.Parse(client.Domain.BaseHost() + getContactPath) // 解析获取联系人信息的链接地址
	if err != nil {
		return nil, err
	}

	params := url.Values{}                                            // 创建 URL 参数对象
	params.Add("r", strconv.FormatInt(time.Now().UnixNano()/1e6, 10)) // 添加时间戳参数
	params.Add("seq", strconv.FormatInt(reqs, 10))                    // 添加请求序列号参数
	params.Add("skey", sKey)                                          // 添加 SKey 参数
	path.RawQuery = params.Encode()                                   // 将参数编码后添加到路径的查询字符串中

	request, err := http.NewRequestWithContext(ctx, http.MethodGet, path.String(), nil) // 创建 GET 请求对象
	if err != nil {
		return nil, err
	}

	return client.Do(request) // 执行请求并返回结果
}

// ================================================= [函数](WechatClient)Api - webwxbatchgetcontact =================================================

// BatchGetContact 方法用于批量获取联系人信息。
//
// 输入参数：
//   - ctx: 上下文对象，用于控制请求的上下文信息。
//   - contacts: 联系人列表。
//   - request: 基础请求对象，包括登录信息和初始化响应等。
//
// 输出参数：
//   - *http.Response: HTTP 响应对象，表示请求的返回结果。
//   - error: 如果执行过程中出现错误，则返回对应的错误信息。
func (client *WechatClient) BatchGetContact(ctx context.Context, contacts Contacts, clientRequest *BaseRequest) (*http.Response, error) {
	path, err := url.Parse(client.Domain.BaseHost() + batchGetContactPath) // 解析批量获取联系人信息的链接地址
	if err != nil {
		return nil, err
	}

	params := url.Values{}                                            // 创建 URL 参数对象
	params.Add("r", strconv.FormatInt(time.Now().UnixNano()/1e6, 10)) // 添加时间戳参数
	params.Add("type", "ex")                                          // 添加类型参数
	path.RawQuery = params.Encode()                                   // 将参数编码后添加到路径的查询字符串中

	list := NewContactDetailItemList(contacts) // 根据联系人列表创建用户详情列表

	requestData := map[string]interface{}{ // 创建请求内容
		"BaseRequest": clientRequest,    // 基础请求对象
		"List":        list,             // 联系人详情列表
		"Count":       contacts.Count(), // 联系人数量
	}

	body, err := JsonEncode(requestData) // 将请求内容编码为 JSON 格式
	if err != nil {
		return nil, err
	}

	request, err := http.NewRequestWithContext(ctx, http.MethodPost, path.String(), body) // 创建 POST 请求对象
	if err != nil {
		return nil, err
	}

	request.Header.Add("Content-Type", ContentTypeJson) // 添加 Content-Type 头部信息

	return client.Do(request) // 执行请求并返回结果
}

// ================================================= [函数](WechatClient)Api - webwxsync =================================================

// Sync 方法用于同步客户端数据。
//
// 输入参数：
//   - ctx: 上下文对象，用于控制请求的上下文信息。
//   - clientRequest: 客户端同步选项，包括登录信息、初始化响应等。
//
// 输出参数：
//   - *http.Response: HTTP 响应对象，表示请求的返回结果。
//   - error: 如果执行过程中出现错误，则返回对应的错误信息。
func (client *WechatClient) Sync(ctx context.Context, clientRequest *ClientSyncRequest) (*http.Response, error) {
	path, err := url.Parse(client.Domain.BaseHost() + syncPath) // 解析同步客户端数据的链接地址
	if err != nil {
		return nil, err
	}

	params := url.Values{}                                                // 创建 URL 参数对象
	params.Add("sid", clientRequest.LoginInfoResponse.WxSid)              // 添加 sid 参数
	params.Add("skey", clientRequest.LoginInfoResponse.SKey)              // 添加 skey 参数
	params.Add("pass_ticket", clientRequest.LoginInfoResponse.PassTicket) // 添加 pass_ticket 参数
	path.RawQuery = params.Encode()                                       // 将参数编码后添加到路径的查询字符串中

	requestData := map[string]interface{}{ // 创建请求内容
		"BaseRequest": clientRequest.BaseRequest,                // 基础请求对象
		"SyncKey":     clientRequest.InitResponse.SyncKey,       // 同步 Key
		"rr":          strconv.FormatInt(time.Now().Unix(), 10), // 随机数
	}

	reader, err := JsonEncode(requestData) // 将请求内容编码为 JSON 格式
	if err != nil {
		return nil, err
	}

	request, err := http.NewRequestWithContext(ctx, http.MethodPost, path.String(), reader) // 创建 POST 请求对象
	if err != nil {
		return nil, err
	}

	request.Header.Add("Content-Type", ContentTypeJson) // 添加 Content-Type 头部信息

	return client.Do(request) // 执行请求并返回结果
}

// ================================================= [函数](WechatClient)Api - headimage =================================================

// GetHeadImage 方法用于获取联系人头像。
//
// 输入参数：
//   - ctx: 上下文对象，用于控制请求的上下文信息。
//   - contact: 要获取头像的联系人对象。
//
// 输出参数：
//   - *http.Response: HTTP 响应对象，表示请求的返回结果。
//   - error: 如果执行过程中出现错误，则返回对应的错误信息。
func (client *WechatClient) GetHeadImage(ctx context.Context, contact *Contact) (*http.Response, error) {
	var path string
	if contact.HeadImgUrl != "" { // 如果用户头像 URL 不为空，则直接使用该 URL 获取用户头像
		path = client.Domain.BaseHost() + contact.HeadImgUrl
	} else { // 否则需要通过请求获取用户头像

		params := url.Values{}                                    // 创建 URL 参数对象
		params.Add("seq", "0")                                    // 添加 seq 参数，表示头像序列号，这里默认为 0
		params.Add("skey", contact.self.bot.Storage.Request.Skey) // 添加 skey 参数
		params.Add("type", "big")                                 // 添加 type 参数，表示获取大型头像
		params.Add("username", contact.UserName)                  // 添加 username 参数
		params.Add("chatroomid", contact.EncryChatRoomId)         // 如果是群聊成员，则添加 chatroomid 参数

		URL, err := url.Parse(client.Domain.BaseHost() + getIconPath) // 解析获取头像的链接地址
		if err != nil {
			return nil, err
		}

		URL.RawQuery = params.Encode() // 将参数编码后添加到路径的查询字符串中

		path = URL.String()
	}

	request, err := http.NewRequestWithContext(ctx, http.MethodGet, path, nil) // 创建 GET 请求对象
	if err != nil {
		return nil, err
	}

	return client.Do(request) // 执行请求并返回结果
}

// ================================================= [函数](WechatClient)Api - webwxuploadmedia|webwxcheckupload =================================================

// UploadChunk 是 WechatClient 结构体的私有方法，用于上传文件的分块处理。
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - clientRequest *ClientUploadChunkRequest: 客户端上传文件的选项参数。
//
// 输出参数：
//   - *http.Response: HTTP响应对象。
//   - error: 错误对象，如果操作成功则为 nil，否则为具体的错误信息。
func (client *WechatClient) UploadChunk(ctx context.Context, clientRequest *ClientUploadChunkRequest) (*http.Response, error) {
	// 获取文件上传的类型
	contentType, err := FileContentType(clientRequest.File)
	if err != nil {
		return nil, err
	}

	// 将文件指针移动到起始位置
	if _, err = clientRequest.File.Seek(io.SeekStart, 0); err != nil {
		return nil, err
	}

	// 获取文件的md5值
	h := md5.New()
	if _, err = io.Copy(h, clientRequest.File); err != nil {
		return nil, err
	}
	fileMd5 := hex.EncodeToString(h.Sum(nil))

	// 获取文件名
	sate, err := clientRequest.File.Stat()
	if err != nil {
		return nil, err
	}
	filename := sate.Name()

	// 如果文件没有扩展名，则补上文件类型作为扩展名
	if ext := filepath.Ext(filename); ext == "" {
		names := strings.Split(contentType, "/")
		filename = filename + "." + names[len(names)-1]
	}

	// 获取文件的类型
	mediaType := FileType(filename)

	// 构造上传文件的URL
	path, err := url.Parse(client.Domain.FileHost() + uploadMediaPath)
	if err != nil {
		return nil, err
	}

	// 构造上传文件的参数
	params := url.Values{}
	params.Add("f", "json")
	path.RawQuery = params.Encode()

	// 获取上传文件需要的Cookie
	cookies := client.GetCookieJar().Cookies(path)

	webWxDataTicket, err := GetWebWxDataTicket(cookies)
	if err != nil {
		return nil, err
	}

	// 构造上传文件的请求体
	uploadMediaRequest := map[string]interface{}{
		"UploadType":    2,
		"BaseRequest":   clientRequest.BaseRequest,
		"ClientMediaId": time.Now().Unix() * 1e4,
		"TotalLen":      sate.Size(),
		"StartPos":      0,
		"DataLen":       sate.Size(),
		"MediaType":     4,
		"FromUserName":  clientRequest.FromUserName,
		"ToUserName":    clientRequest.ToUserName,
		"FileMd5":       fileMd5,
	}

	// 将请求体转换为JSON格式
	uploadMediaRequestByte, err := json.Marshal(uploadMediaRequest)
	if err != nil {
		return nil, err
	}

	// 计算上传文件的分块数
	chunks := (sate.Size() + UploadChunkSize - 1) / UploadChunkSize

	var resp *http.Response

	// 构造上传文件的表单数据
	requestData := map[string]string{
		"id":                "WU_FILE_0",
		"name":              filename,
		"type":              contentType,
		"lastModifiedDate":  sate.ModTime().Format(TimeFormat),
		"size":              strconv.FormatInt(sate.Size(), 10),
		"mediatype":         mediaType,
		"webwx_data_ticket": webWxDataTicket,
		"pass_ticket":       clientRequest.LoginInfoResponse.PassTicket,
	}

	// 如果文件需要分块上传，则添加 chunks 参数
	if chunks > 1 {
		requestData["chunks"] = strconv.FormatInt(chunks, 10)
	}

	// 将文件指针移动到起始位置
	if _, err = clientRequest.File.Seek(0, 0); err != nil {
		return nil, err
	}

	var chunkBuff = make([]byte, UploadChunkSize)

	// 构造表单数据的缓冲区
	var formBuffer = bytes.NewBuffer(nil)

	// 分块上传文件
	for chunk := 0; int64(chunk) < chunks; chunk++ {
		if chunks > 1 {
			requestData["chunk"] = strconv.Itoa(chunk)
		}

		// 清空表单数据缓冲区
		formBuffer.Reset()

		// 构造 multipart.Writer 对象
		writer := multipart.NewWriter(formBuffer)

		// 添加请求体参数
		if err = writer.WriteField("uploadmediarequest", string(uploadMediaRequestByte)); err != nil {
			return nil, err
		}

		// 添加表单数据参数
		for k, v := range requestData {
			if err := writer.WriteField(k, v); err != nil {
				return nil, err
			}
		}

		// 添加文件数据
		w, err := writer.CreateFormFile("filename", clientRequest.File.Name())
		if err != nil {
			return nil, err
		}

		n, err := clientRequest.File.Read(chunkBuff)

		if err != nil && err != io.EOF {
			return nil, err
		}

		// 将文件数据写入表单
		if _, err = w.Write(chunkBuff[:n]); err != nil {
			return nil, err
		}

		// 获取表单的 Content-Type
		ct := writer.FormDataContentType()

		// 关闭 multipart.Writer 对象
		if err = writer.Close(); err != nil {
			return nil, err
		}

		// 构造上传文件的 HTTP 请求
		request, err := http.NewRequestWithContext(ctx, http.MethodPost, path.String(), formBuffer)
		if err != nil {
			return nil, err
		}
		request.Header.Set("Content-Type", ct)

		// 发送 HTTP 请求
		resp, err = client.Do(request)
		if err != nil {
			return nil, err
		}

		isLastTime := int64(chunk)+1 == chunks

		// 如果不是最后一次上传，则检查响应是否有错误
		if !isLastTime {
			parser := ResponseParser{Reader: resp.Body}
			if err = parser.Error(); err != nil {
				_ = resp.Body.Close()
				return nil, err
			}
			if err = resp.Body.Close(); err != nil {
				return nil, err
			}
		}
	}

	// 将最后一次携带文件信息的 HTTP 响应返回
	return resp, err
}

// UploadCheck 方法用于上传文件前检查。
//
// 输入参数：
//   - stat os.FileInfo: 文件信息对象。
//   - request *BaseRequest: 基本请求信息。
//   - fileMd5 string: 文件的 MD5 值。
//   - fromUserName string: 发送方用户名。
//   - toUserName string: 接收方用户名。
//
// 输出参数：
//   - *http.Response: HTTP响应对象。
//   - error: 错误对象，如果操作成功则为 nil，否则为具体的错误信息。
func (client *WechatClient) UploadCheck(ctx context.Context, clientRequest *ClientUploadCheckRequest) (*http.Response, error) {
	// 构造 URL 对象
	path, err := url.Parse(client.Domain.BaseHost() + checkUploadPath)
	if err != nil {
		return nil, err
	}

	// 构造请求内容
	requestData := map[string]interface{}{
		"BaseRequest":  clientRequest.BaseRequest,
		"FileMd5":      clientRequest.FileMD5,
		"FileName":     clientRequest.Stat.Name(),
		"FileSize":     clientRequest.Stat.Size(),
		"FileType":     7,
		"FromUserName": clientRequest.FromUserName,
		"ToUserName":   clientRequest.ToUserName,
	}

	body, err := JsonEncode(requestData)
	if err != nil {
		return nil, err
	}

	// 创建 HTTP 请求
	request, err := http.NewRequestWithContext(ctx, http.MethodPost, path.String(), body)
	if err != nil {
		return nil, err
	}

	request.Header.Add("Content-Type", ContentTypeJson)

	// 发送 HTTP 请求并返回结果
	return client.Do(request)
}

// ================================================= [函数](WechatClient)Api - webwxoplog =================================================

// Oplog 方法用于执行操作日志。
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - clientRequest *ClientOplogRequest: 操作日志选项参数。
//
// 输出参数：
//   - *http.Response: HTTP响应对象。
//   - error: 错误对象，如果操作成功则为 nil，否则为具体的错误信息。
func (client *WechatClient) Oplog(ctx context.Context, clientRequest *ClientOplogRequest) (*http.Response, error) {
	// 构造操作日志的URL
	path, err := url.Parse(client.Domain.BaseHost() + oplogPath)
	if err != nil {
		return nil, err
	}

	// 构造URL的参数
	params := url.Values{}
	params.Add("lang", "zh_CN")
	path.RawQuery = params.Encode()

	// 构造请求体内容
	requestData := map[string]interface{}{
		"BaseRequest": clientRequest.BaseRequest,
		"CmdId":       2,
		"RemarkName":  clientRequest.RemarkName,
		"UserName":    clientRequest.UserName,
	}

	// 将请求体内容编码为JSON格式
	body, err := JsonEncode(requestData)
	if err != nil {
		return nil, err
	}

	// 构造HTTP请求对象
	request, err := http.NewRequestWithContext(ctx, http.MethodPost, path.String(), body)
	if err != nil {
		return nil, err
	}

	// 设置请求头的Content-Type为JSON
	request.Header.Add("Content-Type", ContentTypeJson)

	// 调用 Do 方法发送HTTP请求
	return client.Do(request)
}

// Pin 方法用于将用户置顶。
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - clientRequest *ClientRelationRequest: 用户关系选项。
//
// 输出参数：
//   - *http.Response: HTTP响应对象。
//   - error: 错误对象，如果操作成功则为 nil，否则为具体的错误信息。
func (client *WechatClient) Pin(ctx context.Context, clientRequest *ClientRelationRequest) (*http.Response, error) {
	// 构造 URL 对象
	path, err := url.Parse(client.Domain.BaseHost() + oplogPath)
	if err != nil {
		return nil, err
	}

	// 构造置顶操作内容
	requestData := map[string]interface{}{
		"BaseRequest": clientRequest.BaseRequest,
		"OP":          clientRequest.Op,
		"CmdId":       3,
		"RemarkName":  clientRequest.RemarkName,
		"UserName":    clientRequest.UserName,
	}

	// 编码操作内容为 JSON 格式
	body, err := JsonEncode(requestData)
	if err != nil {
		return nil, err
	}

	// 构造 HTTP 请求对象
	request, err := http.NewRequestWithContext(ctx, http.MethodPost, path.String(), body)
	if err != nil {
		return nil, err
	}

	// 设置请求头的 Content-Type
	request.Header.Add("Content-Type", ContentTypeJson)

	// 调用 Do 方法发送 HTTP 请求
	return client.Do(request)
}

// ================================================= [函数](WechatClient)Api - webwxverifyuser =================================================

// VerifyUser 方法用于验证用户。
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - clientRequest *ClientVerifyUserRequest: 验证用户选项参数。
//
// 输出参数：
//   - *http.Response: HTTP响应对象。
//   - error: 错误对象，如果操作成功则为 nil，否则为具体的错误信息。
func (client *WechatClient) VerifyUser(ctx context.Context, clientRequest *ClientVerifyUserRequest) (*http.Response, error) {
	// 构造验证用户的URL
	path, err := url.Parse(client.Domain.BaseHost() + verifyUserPath)
	if err != nil {
		return nil, err
	}

	// 构造URL的参数
	params := url.Values{}
	params.Add("r", strconv.FormatInt(time.Now().UnixNano()/1e6, 10))
	params.Add("lang", "zh_CN")
	params.Add("pass_ticket", clientRequest.LoginInfoResponse.PassTicket)
	path.RawQuery = params.Encode()

	// 构造请求体内容
	requestData := map[string]interface{}{
		"BaseRequest":    clientRequest.BaseRequest,
		"Opcode":         3,
		"SceneList":      [1]int{33},
		"SceneListCount": 1,
		"VerifyContent":  clientRequest.VerifyContent,
		"VerifyUserList": []interface{}{map[string]string{
			"Value":            clientRequest.RecommendInfo.UserName,
			"VerifyUserTicket": clientRequest.RecommendInfo.Ticket,
		}},
		"VerifyUserListSize": 1,
		"skey":               clientRequest.BaseRequest.Skey,
	}

	// 将请求体内容编码为JSON格式
	body, err := JsonEncode(requestData)
	if err != nil {
		return nil, err
	}

	// 构造HTTP请求对象
	request, err := http.NewRequestWithContext(ctx, http.MethodPost, path.String(), body)
	if err != nil {
		return nil, err
	}

	// 设置请求头的Content-Type为JSON
	request.Header.Add("Content-Type", ContentTypeJson)

	// 调用 Do 方法发送HTTP请求
	return client.Do(request)
}

// ================================================= [函数](WechatClient)Api - webwxupdatechatroom|webwxupdatechatroom =================================================

// AddContactToChatRoom 方法用于将联系人添加到群聊。
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - clientRequest *ClientAddContactToChatRoomRequest: 添加联系人到群聊的选项。
//
// 输出参数：
//   - *http.Response: HTTP响应对象。
//   - error: 错误对象，如果操作成功则为 nil，否则为具体的错误信息。
func (client *WechatClient) AddContactToChatRoom(ctx context.Context, clientRequest *ClientAddContactToChatRoomRequest) (*http.Response, error) {
	// 如果群聊成员数量大于等于40人，则调用 InviteContactToChatRoom 方法
	if clientRequest.GroupLength >= 40 {
		return client.InviteContactToChatRoom(ctx, clientRequest)
	}

	// 构造更新群聊信息的 URL
	path, err := url.Parse(client.Domain.BaseHost() + updateChatRoomPath)
	if err != nil {
		return nil, err
	}

	// 构造 URL 的参数
	params := url.Values{}
	params.Add("fun", "addmember")
	params.Add("lang", "zh_CN")
	params.Add("pass_ticket", clientRequest.LoginInfoResponse.PassTicket)
	path.RawQuery = params.Encode()

	// 构造请求体内容
	requestData := map[string]interface{}{
		"ChatRoomName":  clientRequest.Group,
		"BaseRequest":   clientRequest.BaseRequest,
		"AddMemberList": strings.Join(clientRequest.InviteMemberList, ","),
	}

	// 编码请求体内容为 JSON 格式
	buffer, err := JsonEncode(requestData)
	if err != nil {
		return nil, err
	}

	// 构造 HTTP 请求对象
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, path.String(), buffer)
	if err != nil {
		return nil, err
	}

	// 设置请求头的 Content-Type
	httpReq.Header.Set("Content-Type", ContentTypeJson)

	// 调用 Do 方法发送 HTTP 请求
	return client.Do(httpReq)
}

// InviteContactToChatRoom 方法用于邀请联系人加入群聊。
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - clientRequest *ClientAddContactToChatRoomRequest: 添加联系人到群聊的选项。
//
// 输出参数：
//   - *http.Response: HTTP响应对象。
//   - error: 错误对象，如果操作成功则为 nil，否则为具体的错误信息。
func (client *WechatClient) InviteContactToChatRoom(ctx context.Context, clientRequest *ClientAddContactToChatRoomRequest) (*http.Response, error) {
	// 构造更新群聊信息的 URL
	path, err := url.Parse(client.Domain.BaseHost() + updateChatRoomPath)
	if err != nil {
		return nil, err
	}

	// 构造 URL 的参数
	params := url.Values{}
	params.Add("fun", "invitemember")
	params.Add("lang", "zh_CN")
	params.Add("pass_ticket", clientRequest.LoginInfoResponse.PassTicket)
	path.RawQuery = params.Encode()

	// 构造请求体内容
	requestData := map[string]interface{}{
		"ChatRoomName":     clientRequest.Group,
		"BaseRequest":      clientRequest.BaseRequest,
		"InviteMemberList": strings.Join(clientRequest.InviteMemberList, ","),
	}

	// 编码请求体内容为 JSON 格式
	buffer, err := JsonEncode(requestData)
	if err != nil {
		return nil, err
	}

	// 构造 HTTP 请求对象
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, path.String(), buffer)
	if err != nil {
		return nil, err
	}

	// 设置请求头的 Content-Type
	httpReq.Header.Set("Content-Type", ContentTypeJson)

	// 调用 Do 方法发送 HTTP 请求
	return client.Do(httpReq)
}

// ================================================= [函数](WechatClient)Api - webwxupdatechatroom =================================================

// RemoveContactToChatRoom 方法用于将联系人从群聊中移除。
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - clientRequest *ClientRemoveContactFromChatRoomRequest: 将联系人从群聊中移除的选项。
//
// 输出参数：
//   - *http.Response: HTTP响应对象。
//   - error: 错误对象，如果操作成功则为 nil，否则为具体的错误信息。
func (client *WechatClient) RemoveContactToChatRoom(ctx context.Context, clientRequest *ClientRemoveContactFromChatRoomRequest) (*http.Response, error) {
	// 构造更新群聊信息的 URL
	path, err := url.Parse(client.Domain.BaseHost() + updateChatRoomPath)
	if err != nil {
		return nil, err
	}

	// 构造 URL 的参数
	params := url.Values{}
	params.Add("fun", "delmember")
	params.Add("lang", "zh_CN")
	params.Add("pass_ticket", clientRequest.LoginInfoResponse.PassTicket)
	path.RawQuery = params.Encode()

	// 构造请求体内容
	requestData := map[string]interface{}{
		"ChatRoomName":  clientRequest.Group,
		"BaseRequest":   clientRequest.BaseRequest,
		"DelMemberList": strings.Join(clientRequest.DelMemberList, ","),
	}

	// 编码请求体内容为 JSON 格式
	buffer, err := JsonEncode(requestData)
	if err != nil {
		return nil, err
	}

	// 构造 HTTP 请求对象
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, path.String(), buffer)
	if err != nil {
		return nil, err
	}

	// 设置请求头的 Content-Type
	httpReq.Header.Set("Content-Type", ContentTypeJson)

	// 调用 Do 方法发送 HTTP 请求
	return client.Do(httpReq)
}

// ================================================= [函数](WechatClient)Api - webwxcreatechatroom =================================================

// CreateChatRoom 方法用于创建群聊。
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - clientRequest *ClientCreateChatRoomRequest: 创建群聊的选项。
//
// 输出参数：
//   - *http.Response: HTTP响应对象。
//   - error: 错误对象，如果操作成功则为 nil，否则为具体的错误信息。
func (client *WechatClient) CreateChatRoom(ctx context.Context, clientRequest *ClientCreateChatRoomRequest) (*http.Response, error) {
	path, err := url.Parse(client.Domain.BaseHost() + createChatRoomPath)
	if err != nil {
		return nil, err
	}

	params := url.Values{}
	params.Add("pass_ticket", clientRequest.LoginInfoResponse.PassTicket)
	params.Add("r", fmt.Sprintf("%d", time.Now().Unix()))
	path.RawQuery = params.Encode()

	count := len(clientRequest.Friends)
	memberList := make([]struct{ UserName string }, count)
	for index, member := range clientRequest.Friends {
		memberList[index] = struct{ UserName string }{member}
	}

	requestData := map[string]interface{}{
		"BaseRequest": clientRequest.BaseRequest,
		"MemberCount": count,
		"MemberList":  memberList,
		"Topic":       clientRequest.Topic,
	}

	body, err := JsonEncode(requestData)
	if err != nil {
		return nil, err
	}

	request, err := http.NewRequestWithContext(ctx, http.MethodPost, path.String(), body)
	if err != nil {
		return nil, err
	}

	request.Header.Add("Content-Type", ContentTypeJson)

	return client.Do(request)
}

// ================================================= [函数](WechatClient)Api - webwxupdatechatroom =================================================

// RenameChatRoom 方法用于重命名群聊。
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - clientRequest *ClientRenameChatRoomRequest: 重命名群聊选项。
//
// 输出参数：
//   - *http.Response: HTTP响应对象。
//   - error: 错误对象，如果操作成功则为 nil，否则为具体的错误信息。
func (client *WechatClient) RenameChatRoom(ctx context.Context, clientRequest *ClientRenameChatRoomRequest) (*http.Response, error) {
	// 构造 URL 对象
	path, err := url.Parse(client.Domain.BaseHost() + updateChatRoomPath)
	if err != nil {
		return nil, err
	}

	// 设置 URL 参数
	params := url.Values{}
	params.Add("fun", "modtopic")
	params.Add("pass_ticket", clientRequest.LoginInfoResponse.PassTicket)
	path.RawQuery = params.Encode()

	// 构造请求内容
	requestData := map[string]interface{}{
		"BaseRequest":  clientRequest.BaseRequest,
		"ChatRoomName": clientRequest.Group,
		"NewTopic":     clientRequest.NewTopic,
	}

	body, err := JsonEncode(requestData)
	if err != nil {
		return nil, err
	}

	// 创建 HTTP 请求
	request, err := http.NewRequestWithContext(ctx, http.MethodPost, path.String(), body)
	if err != nil {
		return nil, err
	}

	request.Header.Add("Content-Type", ContentTypeJson)

	// 发送 HTTP 请求并返回结果
	return client.Do(request)
}

// ================================================= [函数](WechatClient)Api - webwxgetmsgimg|webwxgetvoice|webwxgetvideo|webwxgetmedia =================================================

// GetImageMessageResponse 方法用于获取图片消息的响应。
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - message *Message: 消息对象。
//   - info *LoginInfoResponse: 登录信息。
//
// 输出参数：
//   - *http.Response: HTTP响应对象。
//   - error: 错误对象，如果操作成功则为 nil，否则为具体的错误信息。
func (client *WechatClient) GetImageMessageResponse(ctx context.Context, message *Message, info *LoginInfoResponse) (*http.Response, error) {
	// 构造获取图片消息响应的URL
	path, err := url.Parse(client.Domain.BaseHost() + getImgMsgPath)
	if err != nil {
		return nil, err
	}

	// 构造URL的参数
	params := url.Values{}
	params.Add("_msgId", message.MsgId)
	params.Add("skey", info.SKey)
	// params.Add("type", "slave")
	path.RawQuery = params.Encode()

	// 构造HTTP请求对象
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, path.String(), nil)
	if err != nil {
		return nil, err
	}

	// 调用 Do 方法发送HTTP请求
	return client.Do(request)
}

// GetVoiceMessageResponse 方法用于获取语音消息的响应。
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - message *Message: 消息对象。
//   - info *LoginInfoResponse: 登录信息。
//
// 输出参数：
//   - *http.Response: HTTP响应对象。
//   - error: 错误对象，如果操作成功则为 nil，否则为具体的错误信息。
func (client *WechatClient) GetVoiceMessageResponse(ctx context.Context, message *Message, info *LoginInfoResponse) (*http.Response, error) {
	// 构造获取语音消息响应的URL
	path, err := url.Parse(client.Domain.BaseHost() + getVoiceMsgPath)
	if err != nil {
		return nil, err
	}

	// 构造URL的参数
	params := url.Values{}
	params.Add("msgid", message.MsgId)
	params.Add("skey", info.SKey)
	path.RawQuery = params.Encode()

	// 构造HTTP请求对象
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, path.String(), nil)
	if err != nil {
		return nil, err
	}

	// 设置请求头
	request.Header.Add("Referer", path.String())
	request.Header.Add("Range", "bytes=0-")

	// 调用 Do 方法发送HTTP请求
	return client.Do(request)
}

// GetVideoMessageResponse 方法用于获取视频消息的响应。
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - message *Message: 消息对象。
//   - info *LoginInfoResponse: 登录信息。
//
// 输出参数：
//   - *http.Response: HTTP响应对象。
//   - error: 错误对象，如果操作成功则为 nil，否则为具体的错误信息。
func (client *WechatClient) GetVideoMessageResponse(ctx context.Context, message *Message, info *LoginInfoResponse) (*http.Response, error) {
	// 构造获取视频消息响应的URL
	path, err := url.Parse(client.Domain.BaseHost() + getVideoMsgPath)
	if err != nil {
		return nil, err
	}

	// 构造URL的参数
	params := url.Values{}
	params.Add("msgid", message.MsgId)
	params.Add("skey", info.SKey)
	path.RawQuery = params.Encode()

	// 构造HTTP请求对象
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, path.String(), nil)
	if err != nil {
		return nil, err
	}

	// 设置请求头
	request.Header.Add("Referer", path.String())
	request.Header.Add("Range", "bytes=0-")

	// 调用 Do 方法发送HTTP请求
	return client.Do(request)
}

// GetMediaMessageResponse 方法用于获取媒体消息的响应。
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - message *Message: 消息对象。
//   - info *LoginInfoResponse: 登录信息。
//
// 输出参数：
//   - *http.Response: HTTP响应对象。
//   - error: 错误对象，如果操作成功则为 nil，否则为具体的错误信息。
func (client *WechatClient) GetMediaMessageResponse(ctx context.Context, message *Message, info *LoginInfoResponse) (*http.Response, error) {
	// 构造获取媒体消息响应的URL
	path, err := url.Parse(client.Domain.FileHost() + getMediaPath)
	if err != nil {
		return nil, err
	}

	// 获取 Cookie 值
	cookies := client.GetCookieJar().Cookies(path)

	// 获取 WebWxDataTicket 值
	webWxDataTicket, err := GetWebWxDataTicket(cookies)
	if err != nil {
		return nil, err
	}

	// 构造 URL 的参数
	params := url.Values{}
	params.Add("sender", message.FromUserName)
	params.Add("mediaid", message.MediaId)
	params.Add("encryfilename", message.EncryFileName)
	params.Add("fromuser", strconv.FormatInt(info.WxUin, 10))
	params.Add("pass_ticket", info.PassTicket)
	params.Add("webwx_data_ticket", webWxDataTicket)
	path.RawQuery = params.Encode()

	// 构造 HTTP 请求对象
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, path.String(), nil)
	if err != nil {
		return nil, err
	}

	// 设置请求头
	request.Header.Add("Referer", client.Domain.BaseHost()+"/")

	// 调用 Do 方法发送 HTTP 请求
	return client.Do(request)
}

// ================================================= [函数](WechatClient)Api - webwxsendmsg|webwxsendmsgimg|webwxsendappmsg =================================================

// SendMessage 方法用于发送消息。
//
// 输入参数：
//   - ctx: 上下文对象，用于控制请求的上下文信息。
//   - request: 基础请求对象，包括登录信息和初始化响应等。
//   - url: 发送消息的链接地址。
//   - message: 要发送的消息对象。
//
// 输出参数：
//   - *http.Response: HTTP 响应对象，表示请求的返回结果。
//   - error: 如果执行过程中出现错误，则返回对应的错误信息。
func (client *WechatClient) SendMessage(ctx context.Context, clientRequest *BaseRequest, url string, message *SendMessage) (*http.Response, error) {
	requestData := map[string]interface{}{ // 创建请求内容
		"BaseRequest": clientRequest, // 基础请求对象
		"Msg":         message,       // 要发送的消息对象
		"Scene":       0,             // 场景值，默认为 0
	}

	body, err := JsonEncode(requestData) // 将请求内容编码为 JSON 格式
	if err != nil {
		return nil, err
	}

	request, err := http.NewRequestWithContext(ctx, http.MethodPost, url, body) // 创建 POST 请求对象
	if err != nil {
		return nil, err
	}

	request.Header.Add("Content-Type", ContentTypeJson) // 添加 Content-Type 头部信息

	return client.Do(request) // 执行请求并返回结果
}

// SendTextMessage 方法用于发送文本消息。
//
// 输入参数：
//   - ctx: 上下文对象，用于控制请求的上下文信息。
//   - clientRequest: 客户端发送消息选项，包括登录信息、基础请求对象和要发送的消息等。
//
// 输出参数：
//   - *http.Response: HTTP 响应对象，表示请求的返回结果。
//   - error: 如果执行过程中出现错误，则返回对应的错误信息。
func (client *WechatClient) SendTextMessage(ctx context.Context, clientRequest *ClientSendMessageRequest) (*http.Response, error) {
	clientRequest.Message.Type = MessageText // 设置消息类型为文本消息

	path, err := url.Parse(client.Domain.BaseHost() + sendMsgPath) // 解析发送消息的链接地址
	if err != nil {
		return nil, err
	}

	params := url.Values{}                                                // 创建 URL 参数对象
	params.Add("lang", "zh_CN")                                           // 添加 lang 参数
	params.Add("pass_ticket", clientRequest.LoginInfoResponse.PassTicket) // 添加 pass_ticket 参数
	path.RawQuery = params.Encode()                                       // 将参数编码后添加到路径的查询字符串中

	return client.SendMessage(ctx, clientRequest.BaseRequest, path.String(), clientRequest.Message) // 调用 SendMessage 方法发送消息并返回结果
}

// SendImageMessage 方法用于发送图片消息。
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - clientRequest *ClientSendMessageRequest: 客户端发送消息的选项参数。
//
// 输出参数：
//   - *http.Response: HTTP响应对象。
//   - error: 错误对象，如果操作成功则为 nil，否则为具体的错误信息。
func (client *WechatClient) SendImageMessage(ctx context.Context, clientRequest *ClientSendMessageRequest) (*http.Response, error) {
	// 设置消息类型为图片类型
	clientRequest.Message.Type = MessageImage

	// 构造发送图片消息的URL
	path, err := url.Parse(client.Domain.BaseHost() + sendImgMsgPath)
	if err != nil {
		return nil, err
	}

	// 构造URL的参数
	params := url.Values{}
	params.Add("fun", "async")
	params.Add("f", "json")
	params.Add("lang", "zh_CN")
	params.Add("pass_ticket", clientRequest.LoginInfoResponse.PassTicket)
	path.RawQuery = params.Encode()

	// 调用 SendMessage 方法发送消息
	return client.SendMessage(ctx, clientRequest.BaseRequest, path.String(), clientRequest.Message)
}

// SendVideoMessage 方法用于发送视频消息。
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - clientRequest *ClientSendMessageRequest: 客户端发送消息的选项参数。
//
// 输出参数：
//   - *http.Response: HTTP响应对象。
//   - error: 错误对象，如果操作成功则为 nil，否则为具体的错误信息。
func (client *WechatClient) SendVideoMessage(ctx context.Context, clientRequest *ClientSendMessageRequest) (*http.Response, error) {
	// 设置消息类型为图片类型
	clientRequest.Message.Type = MessageVideo

	// 构造 URL 对象
	path, err := url.Parse(client.Domain.BaseHost() + sendVideoMsgPath)
	if err != nil {
		return nil, err
	}

	// 设置 URL 参数
	params := url.Values{}
	params.Add("fun", "async")
	params.Add("f", "json")
	params.Add("lang", "zh_CN")
	params.Add("pass_ticket", clientRequest.LoginInfoResponse.PassTicket)
	path.RawQuery = params.Encode()

	// 调用 SendMessage 方法发送消息
	return client.SendMessage(ctx, clientRequest.BaseRequest, path.String(), clientRequest.Message)
}

// SendAppMessage 方法用于发送应用消息。
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - clientRequest *ClientSendMessageRequest: 客户端发送消息的选项参数。
//
// 输出参数：
//   - *http.Response: HTTP响应对象。
//   - error: 错误对象，如果操作成功则为 nil，否则为具体的错误信息。
func (client *WechatClient) SendAppMessage(ctx context.Context, clientRequest *ClientSendMessageRequest) (*http.Response, error) {
	// 设置消息类型为应用消息类型
	clientRequest.Message.Type = AppMessageMode

	// 构造发送应用消息的URL
	path, err := url.Parse(client.Domain.BaseHost() + sendAppMsgPath)
	if err != nil {
		return nil, err
	}

	// 构造URL的参数
	params := url.Values{}
	params.Add("fun", "async")
	params.Add("f", "json")
	path.RawQuery = params.Encode()

	// 调用 SendMessage 方法发送消息
	return client.SendMessage(ctx, clientRequest.BaseRequest, path.String(), clientRequest.Message)
}

// ================================================= [函数](WechatClient)Api - webwxrevokemsg =================================================

// RevokeMessage 方法用于撤回已发送的消息。
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - clientRequest *ClientSendMessageRequest: 客户端撤回消息的选项参数。
//
// 输出参数：
//   - *http.Response: HTTP响应对象。
//   - error: 错误对象，如果操作成功则为 nil，否则为具体的错误信息。
func (client *WechatClient) RevokeMessage(ctx context.Context, clientRequest *ClientRevokeMessageRequest) (*http.Response, error) {
	// 构造消息撤回的内容
	requestData := map[string]interface{}{
		"BaseRequest": clientRequest.BaseRequest,
		"ClientMsgId": clientRequest.Message.ClientMsgId,
		"SvrMsgId":    clientRequest.Message.MsgId,
		"ToUserName":  clientRequest.Message.ToUserName,
	}

	// 编码消息内容为 JSON 格式
	buffer, err := JsonEncode(requestData)
	if err != nil {
		return nil, err
	}

	// 构造 HTTP 请求对象
	request, err := http.NewRequestWithContext(ctx, http.MethodPost, client.Domain.BaseHost()+revokeMsgPath, buffer)
	if err != nil {
		return nil, err
	}

	// 设置请求头的 Content-Type
	request.Header.Set("Content-Type", ContentTypeJson)

	// 调用 Do 方法发送 HTTP 请求
	return client.Do(request)
}
