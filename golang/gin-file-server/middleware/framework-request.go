package middleware

import (
	"context"
	"fmt"
	"zhongjyuan/gin-file-server/common"

	"github.com/gin-gonic/gin"
)

// RequestId 函数返回一个 Gin 中间件，用于生成请求 ID 并在请求上下文中设置和传递该 ID。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - func(c *gin.Context): Gin 中间件函数。
func RequestId() func(c *gin.Context) {
	type ContextKey string

	const RequestIDKey ContextKey = common.RequestIdKey

	return func(c *gin.Context) {
		// 生成请求 ID
		id := common.GetTimeString() + common.GetRandomNumberString(8)

		// 在 Gin 上下文中设置请求 ID
		c.Set(common.RequestIdKey, id)

		// 在请求上下文中使用带有请求 ID 的新 Context
		ctx := context.WithValue(c.Request.Context(), RequestIDKey, id)
		c.Request = c.Request.WithContext(ctx)

		// 设置响应头中的请求 ID
		c.Header(common.RequestIdKey, id)

		// 执行下一个处理程序
		c.Next()
	}
}

// SetUpLogger 函数用于设置 Gin 框架的日志记录器，包括自定义格式和请求 ID 的记录。
//
// 输入参数：
//   - server *gin.Engine: Gin 引擎实例。
//
// 输出参数：
//   - 无。
func SetUpLogger(server *gin.Engine) {
	server.Use(gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		var requestID string
		if param.Keys != nil {
			requestID = param.Keys[common.RequestIdKey].(string)
		}

		return fmt.Sprintf("[GIN] %s | %s | %3d | %13v | %15s | %7s %s\n",
			param.TimeStamp.Format("2006/01/02 - 15:04:05"),
			requestID,
			param.StatusCode,
			param.Latency,
			param.ClientIP,
			param.Method,
			param.Path,
		)
	}))
}
