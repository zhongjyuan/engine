package middleware

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// CORS 返回一个中间件函数，用于处理跨域资源共享（CORS）。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - gin.HandlerFunc: 处理跨域资源共享的中间件函数。
func CORS() gin.HandlerFunc {
	// 创建默认的 CORS 配置
	config := cors.DefaultConfig()

	config.AllowAllOrigins = true
	config.AllowCredentials = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"*"}

	// 返回一个新的 CORS 中间件函数
	return cors.New(config)
}
