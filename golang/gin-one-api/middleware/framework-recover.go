package middleware

import (
	"fmt"
	"net/http"
	"runtime/debug"
	"zhongjyuan/gin-one-api/common"

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
				common.SysError(fmt.Sprintf("panic detected: %v", err))
				common.SysError(fmt.Sprintf("stacktrace from panic: %s", string(debug.Stack())))
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": gin.H{
						"type":    "gin_template_panic",
						"message": fmt.Sprintf("Panic detected, error: %v. Please submit a issue here: https://github.com/zhongjyuan/gin-one-api", err),
					},
				})
				c.Abort()
			}
		}()
		c.Next()
	}
}
