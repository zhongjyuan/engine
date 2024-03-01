package common

import (
	"bytes"
	"encoding/json"
	"io"
	"strings"

	"github.com/gin-gonic/gin"
)

// SetEventStreamHeaders 用于设置事件流响应的头部信息。
//
// 输入参数：
//   - c *gin.Context: Gin 框架上下文对象。
//
// 输出参数：
//   - 无。
func SetEventStreamHeaders(c *gin.Context) {
	c.Writer.Header().Set("X-Accel-Buffering", "no")           // 禁止加速缓冲
	c.Writer.Header().Set("Connection", "keep-alive")          // 设置连接保持活跃
	c.Writer.Header().Set("Cache-Control", "no-cache")         // 设置缓存控制为不缓存
	c.Writer.Header().Set("Transfer-Encoding", "chunked")      // 设置传输编码为分块传输
	c.Writer.Header().Set("Content-Type", "text/event-stream") // 设置内容类型为事件流
}

// GetRequestBody 用于获取请求的请求体内容，并缓存到上下文中。
//
// 输入参数：
//   - c *gin.Context: Gin 框架上下文对象。
//
// 输出参数：
//   - []byte: 请求体内容的字节切片。
//   - error: 获取请求体内容过程中可能出现的错误。
func GetRequestBody(c *gin.Context) ([]byte, error) {
	requestBody, _ := c.Get(RequestBodyKey) // 从上下文中获取已缓存的请求体
	if requestBody != nil {                 // 如果已有缓存的请求体
		return requestBody.([]byte), nil // 直接返回缓存的请求体内容
	}

	requestBody, err := io.ReadAll(c.Request.Body) // 读取请求体内容
	if err != nil {
		return nil, err // 如果读取失败，则返回错误
	}

	_ = c.Request.Body.Close() // 关闭请求体流

	c.Set(RequestBodyKey, requestBody) // 将请求体内容缓存到上下文中

	return requestBody.([]byte), nil // 返回请求体内容和无错误
}

// UnmarshalBodyReusable 用于解析请求体内容并将结果存储在提供的变量中，同时重置请求体以便后续读取。
//
// 输入参数：
//   - c *gin.Context: Gin 框架上下文对象。
//   - v any: 用于存储解析结果的变量。
//
// 输出参数：
//   - error: 解析过程中可能出现的错误。
func UnmarshalBodyReusable(c *gin.Context, v any) error {
	requestBody, err := GetRequestBody(c) // 获取请求体内容
	if err != nil {
		return err // 如果获取请求体内容出错，则直接返回错误
	}

	contentType := c.Request.Header.Get("Content-Type")     // 获取请求头中的 Content-Type
	if strings.HasPrefix(contentType, "application/json") { // 如果是 JSON 格式的请求
		err = json.Unmarshal(requestBody, &v) // 解析 JSON 请求体内容到提供的变量中
	}
	// else {
	// 	// skip for now
	// 	// TODO: someday non json request have variant model, we will need to implementation this
	// }

	if err != nil {
		return err // 如果解析出错，则返回错误
	}

	// Reset request body
	c.Request.Body = io.NopCloser(bytes.NewBuffer(requestBody)) // 重置请求体，使其可被后续读取

	return nil // 返回无错误
}
