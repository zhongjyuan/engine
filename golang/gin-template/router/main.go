package router

import (
	"embed"
	"fmt"
	"net/http"
	"os"
	"strings"
	"zhongjyuan/gin-template/common"
	"zhongjyuan/gin-template/middleware"

	"github.com/gin-gonic/contrib/gzip"
	"github.com/gin-gonic/gin"
)

// SetRouter 函数设置Gin路由。
//
// 输入参数：
//   - router *gin.Engine: Gin框架的路由器对象。
//   - buildFS embed.FS: embed.FS对象，用于嵌入文件系统获取HTML文件的内容。
//
// 输出参数：
//   - 无。
func SetRouter(router *gin.Engine, buildFS embed.FS) {
	// 设置API路由
	apiRouter := router.Group("/api")                 // 创建API路由组
	apiRouter.Use(middleware.GlobalAPIRateLimit())    // 使用全局API速率限制中间件
	apiRouter.Use(gzip.Gzip(gzip.DefaultCompression)) // 在传输过程中对响应进行压缩，以减小数据传输的大小，提高网络传输效率。

	setFrameworkApiRouter(apiRouter) // 设置框架API路由

	frontendBaseUrl := os.Getenv("FRONTEND_BASE_URL")
	if common.IsMasterNode && frontendBaseUrl != "" {
		frontendBaseUrl = ""
		common.SysLog("FRONTEND_BASE_URL is ignored on master node")
	}

	if frontendBaseUrl == "" {
		setFrameworkWebRouter(router, buildFS)
	} else {
		frontendBaseUrl = strings.TrimSuffix(frontendBaseUrl, "/")
		router.NoRoute(func(c *gin.Context) {
			c.Redirect(http.StatusMovedPermanently, fmt.Sprintf("%s%s", frontendBaseUrl, c.Request.RequestURI))
		})
	}
}
