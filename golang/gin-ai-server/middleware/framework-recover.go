package middleware

import (
	"fmt"
	"net/http"
	"runtime/debug"
	"zhongjyuan/gin-ai-server/common"

	"github.com/gin-gonic/gin"
)

// RelayPanicRecover 函数返回一个 Gin 中间件，用于捕获并处理请求处理过程中的 panic。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - gin.HandlerFunc: Gin 中间件函数。
func RelayPanicRecover() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				ctx := c.Request.Context()
				common.SysError(fmt.Sprintf("panic detected: %v", err))
				common.SysError(fmt.Sprintf("stacktrace from panic: %s", string(debug.Stack())))
				common.Errorf(ctx, fmt.Sprintf("request: %s %s", c.Request.Method, c.Request.URL.Path))
				body, _ := common.GetRequestBody(c)
				common.Errorf(ctx, fmt.Sprintf("request body: %s", string(body)))
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": gin.H{
						"type":    "gin_template_panic",
						"message": fmt.Sprintf("Panic detected, error: %v. Please submit an issue with the related log here: https://github.com/zhongjyuan/gin-ai-server", err),
					},
				})
				c.Abort()
			}
		}()
		c.Next()
	}
}
