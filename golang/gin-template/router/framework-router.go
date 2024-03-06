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

func setFrameworkApiRouter(apiRouter *gin.RouterGroup) {
	// 声明各种API路由和对应的控制器方法
	apiRouter.GET("/status", controller.GetStatus)
	apiRouter.GET("/notice", controller.GetNotice)
	apiRouter.GET("/about", controller.GetAbout)
	apiRouter.GET("/verification", middleware.CriticalRateLimit(), middleware.TurnstileCheck(), controller.SendEmailVerification)
	apiRouter.GET("/reset_password", middleware.CriticalRateLimit(), middleware.TurnstileCheck(), controller.SendEmailResetPassword)
	apiRouter.POST("/user/reset", middleware.CriticalRateLimit(), controller.ResetPassword)
	apiRouter.GET("/oauth/github", middleware.CriticalRateLimit(), controller.GitHubOAuth)
	apiRouter.GET("/oauth/wechat", middleware.CriticalRateLimit(), controller.WeChatOAuth)
	apiRouter.GET("/oauth/wechat/bind", middleware.CriticalRateLimit(), middleware.UserAuth(), controller.WeChatBind)
	apiRouter.GET("/oauth/email/bind", middleware.CriticalRateLimit(), middleware.UserAuth(), controller.EmailBind)

	// 用户相关路由组
	userRoute := apiRouter.Group("/user")
	{
		// 用户注册、登录、登出等操作
		userRoute.POST("/register", middleware.CriticalRateLimit(), middleware.TurnstileCheck(), controller.Register)
		userRoute.POST("/login", middleware.CriticalRateLimit(), controller.Login)
		userRoute.GET("/logout", controller.Logout)

		// 用户自身信息路由组
		selfRoute := userRoute.Group("/")
		selfRoute.Use(middleware.UserAuth(), middleware.NoTokenAuth())
		{
			selfRoute.GET("/self", controller.GetSelf)
			selfRoute.PUT("/self", controller.UpdateSelf)
			selfRoute.DELETE("/self", controller.DeleteSelf)
			selfRoute.GET("/token", controller.GenerateToken)
		}

		// 管理员操作用户路由组
		adminRoute := userRoute.Group("/")
		adminRoute.Use(middleware.AdminAuth(), middleware.NoTokenAuth())
		{
			adminRoute.GET("/", controller.GetPageUsers)
			adminRoute.GET("/search", controller.SearchUsers)
			adminRoute.GET("/:id", controller.GetUser)
			adminRoute.POST("/", controller.CreateUser)
			adminRoute.POST("/manage", controller.ManageUser)
			adminRoute.PUT("/", controller.UpdateUser)
			adminRoute.DELETE("/:id", controller.DeleteUser)
		}
	}

	// 选项相关路由组
	optionRoute := apiRouter.Group("/option")
	optionRoute.Use(middleware.RootAuth(), middleware.NoTokenAuth())
	{
		optionRoute.GET("/", controller.GetAllOptions)
		optionRoute.PUT("/", controller.UpdateOption)
	}

	// 文件相关路由组
	fileRoute := apiRouter.Group("/file")
	fileRoute.Use(middleware.AdminAuth()) // 文件相关路由需要管理员权限
	{
		fileRoute.GET("/", controller.GetPageFiles)
		fileRoute.GET("/search", controller.SearchFiles)
		fileRoute.POST("/", middleware.UploadRateLimit(), controller.UploadFile)
		fileRoute.DELETE("/:id", controller.DeleteFile)
	}
}

// setWebRouter 函数设置Web路由Router。
//
// 输入参数：
//   - router *gin.Engine: Gin框架的路由器对象。
//   - buildFS embed.FS: embed.FS对象，用于嵌入文件系统获取HTML文件的内容。
//   - indexPage []byte: 首页HTML文件的内容。
//
// 输出参数：
//   - 无。
func setFrameworkWebRouter(router *gin.Engine, buildFS embed.FS) {
	indexPage, _ := buildFS.ReadFile(fmt.Sprintf("web/build/%s/index.html", common.Theme))

	router.Use(gzip.Gzip(gzip.DefaultCompression))

	// 使用全局Web速率限制中间件
	router.Use(middleware.GlobalWebRateLimit())

	// 使用缓存中间件
	router.Use(middleware.Cache())

	// 创建文件下载路由组
	fileDownloadRoute := router.Group("/")
	fileDownloadRoute.GET("/download/:id", middleware.DownloadRateLimit(), controller.DownloadFile)

	// 静态文件服务
	router.Use(static.Serve("/", common.EmbedFolder(buildFS, fmt.Sprintf("web/build/%s", common.Theme))))

	// 未匹配路由处理，返回首页HTML内容
	router.NoRoute(func(c *gin.Context) {
		c.Header("Cache-Control", "no-cache")
		c.Data(http.StatusOK, "text/html; charset=utf-8", indexPage)
	})
}
