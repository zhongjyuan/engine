package router

import (
	"embed"
	"fmt"
	"net/http"
	"os"
	"strings"
	"zhongjyuan/gin-template/common"

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
	SetApiRouter(router)

	frontendBaseUrl := os.Getenv("FRONTEND_BASE_URL")
	if common.IsMasterNode && frontendBaseUrl != "" {
		frontendBaseUrl = ""
		common.SysLog("FRONTEND_BASE_URL is ignored on master node")
	}

	if frontendBaseUrl == "" {
		setWebRouter(router, buildFS)
	} else {
		frontendBaseUrl = strings.TrimSuffix(frontendBaseUrl, "/")
		router.NoRoute(func(c *gin.Context) {
			c.Redirect(http.StatusMovedPermanently, fmt.Sprintf("%s%s", frontendBaseUrl, c.Request.RequestURI))
		})
	}
}
