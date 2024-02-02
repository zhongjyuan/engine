package core

import (
	"context"
	"net/http"
	"net/url"
	"strconv"
	"time"
)

// ================================================= [类型](全局)公开 =================================================

// Mode 接口定义了三个方法，用于实现不同登录模式的功能。
type Mode interface {
	// GetLoginUUID 获取登录 UUID。
	// 入参：
	//   - ctx: 上下文对象，用于控制请求的生命周期。
	//   - client: 客户端对象，用于发送请求。
	// 返回值：
	//   - *http.Response: HTTP 响应对象，包含登录 UUID 的信息。
	//   - error: 错误对象，表示发生的错误。
	GetLoginUUID(ctx context.Context, client *WechatClient) (*http.Response, error)

	// GetLoginInfo 获取登录信息。
	// 入参：
	//   - ctx: 上下文对象，用于控制请求的生命周期。
	//   - client: 客户端对象，用于发送请求。
	//   - path: 请求路径，用于获取登录信息。
	// 返回值：
	//   - *http.Response: HTTP 响应对象，包含登录信息的详情。
	//   - error: 错误对象，表示发生的错误。
	GetLoginInfo(ctx context.Context, client *WechatClient, path string) (*http.Response, error)

	// PushLogin 提交登录。
	// 入参：
	//   - ctx: 上下文对象，用于控制请求的生命周期。
	//   - client: 客户端对象，用于发送请求。
	//   - uin: 联系人标识，用于提交登录。
	// 返回值：
	//   - *http.Response: HTTP 响应对象，包含登录结果。
	//   - error: 错误对象，表示发生的错误。
	PushLogin(ctx context.Context, client *WechatClient, uin int64) (*http.Response, error)
}

var (
	web     Mode = webMode{}     // web 网页版模式
	desktop Mode = desktopMode{} // desktop 桌面模式，uos electron套壳
)

// webMode 结构体表示网页版模式。
type webMode struct{}

// desktopMode 结构体表示桌面模式。
type desktopMode struct{}

// ================================================= [函数](webMode)公开 =================================================

// PushLogin 方法实现了 webMode 接口中的 PushLogin 方法。
// 入参：
//   - ctx: 上下文对象，用于控制请求的生命周期。
//   - client: 客户端对象，用于发送请求。
//   - uin: 联系人标识，用于提交登录。
//
// 返回值：
//   - *http.Response: HTTP 响应对象，包含登录结果。
//   - error: 错误对象，表示发生的错误。
func (n webMode) PushLogin(ctx context.Context, client *WechatClient, uin int64) (*http.Response, error) {
	// 构造请求路径
	path, err := url.Parse(client.Domain.BaseHost() + pushLoginUrlPath)
	if err != nil {
		return nil, err
	}

	// 构造请求参数
	params := url.Values{}
	params.Add("uin", strconv.FormatInt(uin, 10))
	path.RawQuery = params.Encode()

	// 构造 HTTP 请求对象
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, path.String(), nil)
	if err != nil {
		return nil, err
	}

	// 发送 HTTP 请求并返回响应
	return client.Do(req)
}

// GetLoginUUID 方法实现了 webMode 接口中的 GetLoginUUID 方法。
// 入参：
//   - ctx: 上下文对象，用于控制请求的生命周期。
//   - client: 客户端对象，用于发送请求。
//
// 返回值：
//   - *http.Response: HTTP 响应对象，包含获取登录 UUID 的结果。
//   - error: 错误对象，表示发生的错误。
func (n webMode) GetLoginUUID(ctx context.Context, client *WechatClient) (*http.Response, error) {
	path, err := url.Parse(client.Domain.LoginHost() + jsLoginPath)
	if err != nil {
		return nil, err
	}

	redirectUrl, err := url.Parse(client.Domain.BaseHost() + newLoginPagePath)
	if err != nil {
		return nil, err
	}

	params := url.Values{}
	params.Add("redirect_uri", redirectUrl.String())
	params.Add("appid", AppId)
	params.Add("fun", "new")
	params.Add("lang", "zh_CN")
	params.Add("_", strconv.FormatInt(time.Now().UnixNano()/1e6, 10))
	path.RawQuery = params.Encode()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, path.String(), nil)
	if err != nil {
		return nil, err
	}

	return client.Do(req)
}

// GetLoginInfo 方法实现了 webMode 接口中的 GetLoginInfo 方法。
// 入参：
//   - ctx: 上下文对象，用于控制请求的生命周期。
//   - client: 客户端对象，用于发送请求。
//   - path: 请求路径，用于获取登录信息。
//
// 返回值：
//   - *http.Response: HTTP 响应对象，包含获取登录信息的结果。
//   - error: 错误对象，表示发生的错误。
func (n webMode) GetLoginInfo(ctx context.Context, client *WechatClient, path string) (*http.Response, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, path, nil)
	if err != nil {
		return nil, err
	}
	return client.Do(req)
}

// ================================================= [函数](desktopMode)公开 =================================================

// GetLoginUUID 方法实现了 desktopMode 接口中的 GetLoginUUID 方法。
// 入参：
//   - ctx: 上下文对象，用于控制请求的生命周期。
//   - client: 客户端对象，用于发送请求。
//
// 返回值：
//   - *http.Response: HTTP 响应对象，包含获取登录 UUID 的结果。
//   - error: 错误对象，表示发生的错误。
func (n desktopMode) GetLoginUUID(ctx context.Context, client *WechatClient) (*http.Response, error) {
	path, err := url.Parse(client.Domain.LoginHost() + jsLoginPath)
	if err != nil {
		return nil, err
	}

	// 解析并构建重定向 URL
	redirectUrl, err := url.Parse(client.Domain.BaseHost() + newLoginPagePath)
	if err != nil {
		return nil, err
	}
	p := url.Values{"mod": {"desktop"}}
	redirectUrl.RawQuery = p.Encode()

	// 构建请求的参数
	params := url.Values{}

	// 添加参数到 URL
	params.Add("redirect_uri", redirectUrl.String())
	params.Add("appid", AppId)
	params.Add("fun", "new")
	params.Add("lang", "zh_CN")
	params.Add("_", strconv.FormatInt(time.Now().UnixNano()/1e6, 10))
	path.RawQuery = params.Encode()

	// 创建 HTTP 请求
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, path.String(), nil)
	if err != nil {
		return nil, err
	}
	return client.Do(req)
}

// GetLoginInfo 方法实现了 desktopMode 接口中的 GetLoginInfo 方法。
// 入参：
//   - ctx: 上下文对象，用于控制请求的生命周期。
//   - client: 客户端对象，用于发送请求。
//   - path: 请求路径。
//
// 返回值：
//   - *http.Response: HTTP 响应对象，包含获取登录信息的结果。
//   - error: 错误对象，表示发生的错误。
func (n desktopMode) GetLoginInfo(ctx context.Context, client *WechatClient, path string) (*http.Response, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, path, nil)
	if err != nil {
		return nil, err
	}

	// 设置请求头
	req.Header.Add("client-version", UOSClientVersion)
	req.Header.Add("extspam", UOSExtspam)

	return client.Do(req)
}

// PushLogin 方法实现了 desktopMode 接口中的 PushLogin 方法。
// 入参：
//   - ctx: 上下文对象，用于控制请求的生命周期。
//   - client: 客户端对象，用于发送请求。
//   - uin: 联系人ID。
//
// 返回值：
//   - *http.Response: HTTP 响应对象，包含推送登录信息的结果。
//   - error: 错误对象，表示发生的错误。
func (n desktopMode) PushLogin(ctx context.Context, client *WechatClient, uin int64) (*http.Response, error) {
	path, err := url.Parse(client.Domain.BaseHost() + pushLoginUrlPath)
	if err != nil {
		return nil, err
	}
	params := url.Values{}
	params.Add("uin", strconv.FormatInt(uin, 10))
	params.Add("mod", "desktop")
	path.RawQuery = params.Encode()
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, path.String(), nil)
	if err != nil {
		return nil, err
	}
	return client.Do(req)
}
