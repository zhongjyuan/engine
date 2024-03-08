package middleware

import (
	"github.com/gin-gonic/gin"
)

// Cache 返回一个中间件函数，用于设置缓存控制头，使响应在客户端缓存一周。
//
// 输入参数：
//   - c (*gin.Context): Gin 上下文对象。
//
// 输出参数：
//   - 无。
func Cache() func(c *gin.Context) {
	return func(c *gin.Context) {
		if c.Request.RequestURI == "/" {
			c.Header("Cache-Control", "no-cache")
		} else {
			c.Header("Cache-Control", "max-age=604800") // one week
		}
		c.Next()
	}
}
