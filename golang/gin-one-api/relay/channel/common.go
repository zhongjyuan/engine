package relayChannel

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	relayHelper "zhongjyuan/gin-one-api/relay/helper"

	"github.com/gin-gonic/gin"
)

// SetupCommonRequestHeader 用于设置常见的请求头信息。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象。
//   - req *http.Request: HTTP 请求对象。
//   - meta *relayHelper.RelayMeta: 中继元数据对象。
//
// 输出参数：
//   - 无。
func SetupCommonRequestHeader(c *gin.Context, req *http.Request, meta *relayHelper.RelayMeta) {
	req.Header.Set("Content-Type", c.Request.Header.Get("Content-Type"))
	req.Header.Set("Accept", c.Request.Header.Get("Accept"))

	// 如果是流式传输且 Accept 头为空，则设置默认的 text/event-stream。
	if meta.IsStream && c.Request.Header.Get("Accept") == "" {
		req.Header.Set("Accept", "text/event-stream")
	}
}

// DoRequestHelper 用于执行 HTTP 请求的辅助函数。
//
// 输入参数：
//   - a Adaptor: 适配器接口对象。
//   - c *gin.Context: Gin 上下文对象。
//   - meta *relayHelper.RelayMeta: 中继元数据对象。
//   - requestBody io.Reader: 请求体的 io.Reader 对象。
//
// 输出参数：
//   - *http.Response: HTTP 响应对象指针。
//   - error: 错误信息，如果执行过程中发生错误则返回错误信息，否则返回 nil。
func DoRequestHelper(a Adaptor, c *gin.Context, meta *relayHelper.RelayMeta, requestBody io.Reader) (*http.Response, error) {
	// 获取完整的请求 URL。
	fullRequestURL, err := a.GetRequestURL(meta)
	if err != nil {
		return nil, fmt.Errorf("get request url failed: %w", err)
	}

	// 创建新的 HTTP 请求对象。
	req, err := http.NewRequest(c.Request.Method, fullRequestURL, requestBody)
	if err != nil {
		return nil, fmt.Errorf("new request failed: %w", err)
	}

	// 设置请求头信息。
	err = a.SetupRequestHeader(c, req, meta)
	if err != nil {
		return nil, fmt.Errorf("setup request header failed: %w", err)
	}

	// 执行 HTTP 请求并获取响应。
	resp, err := DoRequest(c, req)
	if err != nil {
		return nil, fmt.Errorf("do request failed: %w", err)
	}

	return resp, nil
}

// DoRequest 用于执行 HTTP 请求并返回响应。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象。
//   - req *http.Request: HTTP 请求对象。
//
// 输出参数：
//   - *http.Response: HTTP 响应对象指针。
//   - error: 错误信息，如果执行过程中发生错误则返回错误信息，否则返回 nil。
func DoRequest(c *gin.Context, req *http.Request) (*http.Response, error) {
	// 使用全局的 HTTP 客户端执行请求。
	resp, err := relayHelper.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	if resp == nil {
		return nil, errors.New("resp is nil")
	}

	// 关闭请求体和上下文中的请求体。
	_ = req.Body.Close()
	_ = c.Request.Body.Close()

	return resp, nil
}
