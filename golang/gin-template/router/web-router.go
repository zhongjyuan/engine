package router

import (
	"embed"
	"fmt"
	"net/http"
	"zhongjyuan/gin-template/common"
	"zhongjyuan/gin-template/controller"
	"zhongjyuan/gin-template/middleware"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/contrib/gzip"
	"github.com/gin-gonic/gin"
)

// setWebRouter 函数设置Web路由Router。
//
// 输入参数：
//   - router *gin.Engine: Gin框架的路由器对象。
//   - buildFS embed.FS: embed.FS对象，用于嵌入文件系统获取HTML文件的内容。
//   - indexPage []byte: 首页HTML文件的内容。
//
// 输出参数：
//   - 无。
func setWebRouter(router *gin.Engine, buildFS embed.FS) {
	indexPage, _ := buildFS.ReadFile(fmt.Sprintf("web/build/%s/index.html", common.Theme))

	router.Use(gzip.Gzip(gzip.DefaultCompression))

	// 使用全局Web速率限制中间件
	router.Use(middleware.GlobalWebRateLimit())

	// 使用缓存中间件
	router.Use(middleware.Cache())

	// 创建文件下载路由组
	fileDownloadRoute := router.Group("/")
	fileDownloadRoute.GET("/upload/:file", middleware.DownloadRateLimit(), controller.DownloadFile)

	// 静态文件服务
	router.Use(static.Serve("/", common.EmbedFolder(buildFS, fmt.Sprintf("web/build/%s", common.Theme))))

	// 未匹配路由处理，返回首页HTML内容
	router.NoRoute(func(c *gin.Context) {
		c.Header("Cache-Control", "no-cache")
		c.Data(http.StatusOK, "text/html; charset=utf-8", indexPage)
	})
}
