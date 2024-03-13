package router

import (
	"zhongjyuan/gin-message-server/controller"
	"zhongjyuan/gin-message-server/middleware"

	"github.com/gin-gonic/contrib/gzip"
	"github.com/gin-gonic/gin"
)

func setMessageApiRouter(router *gin.Engine) {
	// 设置API路由
	apiRouter := router.Group("/api")                 // 创建API路由组
	apiRouter.Use(gzip.Gzip(gzip.DefaultCompression)) // 在传输过程中对响应进行压缩，以减小数据传输的大小，提高网络传输效率。
	apiRouter.Use(middleware.GlobalAPIRateLimit())    // 使用全局API速率限制中间件
	{
		messageRoute := apiRouter.Group("/message")
		{
			messageRoute.GET("/", middleware.UserAuth(), controller.GetUserMessages)
			messageRoute.GET("/stream", middleware.UserAuth(), middleware.SetSSEHeaders(), controller.MessagesStream)
			messageRoute.GET("/search", middleware.UserAuth(), controller.SearchMessages)
			messageRoute.GET("/status/:link", controller.GetMessageStatus)
			messageRoute.POST("/resend/:id", middleware.UserAuth(), controller.ResendMessage)
			messageRoute.GET("/:id", middleware.UserAuth(), controller.GetMessage)
			messageRoute.DELETE("/", middleware.RootAuth(), controller.DeleteAllMessages)
			messageRoute.DELETE("/:id", middleware.UserAuth(), controller.DeleteMessage)
		}

		channelRoute := apiRouter.Group("/channel")
		channelRoute.Use(middleware.UserAuth())
		{
			channelRoute.GET("/", controller.GetAllChannels)
			channelRoute.GET("/search", controller.SearchChannels)
			channelRoute.GET("/:id", controller.GetChannel)
			channelRoute.POST("/", controller.AddChannel)
			channelRoute.PUT("/", controller.UpdateChannel)
			channelRoute.DELETE("/:id", controller.DeleteChannel)
		}

		webhookRoute := apiRouter.Group("/webhook")
		webhookRoute.Use(middleware.UserAuth())
		{
			webhookRoute.GET("/", controller.GetAllWebHooks)
			webhookRoute.GET("/search", controller.SearchWebHooks)
			webhookRoute.GET("/:id", controller.GetWebhook)
			webhookRoute.POST("/", controller.AddWebHook)
			webhookRoute.PUT("/", controller.UpdateWebhook)
			webhookRoute.DELETE("/:id", controller.DeleteWebhook)
		}
	}

	socketRouter := router.Group("/socket")
	socketRouter.Use(gzip.Gzip(gzip.DefaultCompression))
	socketRouter.Use(middleware.GlobalAPIRateLimit())
	{
		socketRouter.GET("/:username", middleware.CriticalRateLimit(), controller.RegisterClient)

	}

	pushRouter := router.Group("/push")
	pushRouter.Use(gzip.Gzip(gzip.DefaultCompression))
	pushRouter.Use(middleware.GlobalAPIRateLimit())
	{
		pushRouter.GET("/:username", controller.GetPushMessage)
		pushRouter.POST("/:username", controller.PostPushMessage)
	}

	webhookRouter := router.Group("/webhook")
	webhookRouter.Use(gzip.Gzip(gzip.DefaultCompression))
	webhookRouter.Use(middleware.GlobalAPIRateLimit())
	{
		webhookRouter.POST("/:link", controller.TriggerWebhook)
	}
}
