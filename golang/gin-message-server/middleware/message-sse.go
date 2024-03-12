package middleware

import "github.com/gin-gonic/gin"

// SetSSEHeaders 函数返回一个中间件函数，用于设置 Server-Sent Events (SSE) 所需的响应头信息。
//
// 输入参数：
//   - c: gin 上下文对象，用于处理 HTTP 请求和响应
// 输出参数：
//   - func(*gin.Context): 返回一个处理 SSE 头部信息的中间件函数
func SetSSEHeaders() func(c *gin.Context) {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Content-Type", "text/event-stream") // 设置响应内容类型为 text/event-stream
		c.Writer.Header().Set("Cache-Control", "no-cache")         // 设置禁用缓存
		c.Writer.Header().Set("Connection", "keep-alive")          // 保持长连接
		c.Writer.Header().Set("Transfer-Encoding", "chunked")      // 使用分块传输编码
		c.Writer.Header().Set("X-Accel-Buffering", "no")           // 禁用 Nginx 的缓冲
		c.Next()                                                   // 继续执行后续处理程序
	}
}
