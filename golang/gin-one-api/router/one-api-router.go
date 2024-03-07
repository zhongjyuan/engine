package router

import (
	"zhongjyuan/gin-one-api/controller"
	"zhongjyuan/gin-one-api/middleware"

	"github.com/gin-gonic/contrib/gzip"
	"github.com/gin-gonic/gin"
)

func setOneApiRouter(router *gin.Engine) {
	apiRouter := router.Group("/api")
	apiRouter.Use(gzip.Gzip(gzip.DefaultCompression))
	apiRouter.Use(middleware.GlobalAPIRateLimit())
	{
		apiRouter.GET("/home_page_content", controller.GetHomePageContent)

		// 用户相关路由组
		userRoute := apiRouter.Group("/user")
		{
			// 用户自身信息路由组
			selfRoute := userRoute.Group("/")
			selfRoute.Use(middleware.UserAuth(), middleware.NoTokenAuth())
			{
				selfRoute.GET("/dashboard", controller.GetUserDashboard)
				selfRoute.GET("/aff", controller.GetAffCode)
				selfRoute.POST("/topup", controller.TopUp)
			}
		}

		channelRoute := apiRouter.Group("/channel")
		channelRoute.Use(middleware.AdminAuth())
		{
			channelRoute.GET("/", controller.GetPageChannels)
			channelRoute.GET("/search", controller.SearchChannels)
			channelRoute.GET("/models", controller.ListModels)
			channelRoute.GET("/:id", controller.GetChannel)
			channelRoute.GET("/test", controller.TestAllChannels)
			channelRoute.GET("/test/:id", controller.TestChannel)
			channelRoute.GET("/update_balance", controller.UpdateAllChannelsBalance)
			channelRoute.GET("/update_balance/:id", controller.UpdateChannelBalance)
			channelRoute.POST("/", controller.AddChannel)
			channelRoute.PUT("/", controller.UpdateChannel)
			channelRoute.DELETE("/disabled", controller.DeleteDisabledChannel)
			channelRoute.DELETE("/:id", controller.DeleteChannel)
		}

		tokenRoute := apiRouter.Group("/token")
		tokenRoute.Use(middleware.UserAuth())
		{
			tokenRoute.GET("/", controller.GetAllTokens)
			tokenRoute.GET("/search", controller.SearchTokens)
			tokenRoute.GET("/:id", controller.GetToken)
			tokenRoute.POST("/", controller.AddToken)
			tokenRoute.PUT("/", controller.UpdateToken)
			tokenRoute.DELETE("/:id", controller.DeleteToken)
		}

		redemptionRoute := apiRouter.Group("/redemption")
		redemptionRoute.Use(middleware.AdminAuth())
		{
			redemptionRoute.GET("/", controller.GetAllRedemptions)
			redemptionRoute.GET("/search", controller.SearchRedemptions)
			redemptionRoute.GET("/:id", controller.GetRedemption)
			redemptionRoute.POST("/", controller.AddRedemption)
			redemptionRoute.PUT("/", controller.UpdateRedemption)
			redemptionRoute.DELETE("/:id", controller.DeleteRedemption)
		}

		logRoute := apiRouter.Group("/log")
		{
			logRoute.GET("/", middleware.AdminAuth(), controller.GetPageLogs)
			logRoute.DELETE("/", middleware.AdminAuth(), controller.DeleteHistoryLogs)
			logRoute.GET("/stat", middleware.AdminAuth(), controller.GetLogsStat)
			logRoute.GET("/self/stat", middleware.UserAuth(), controller.GetLogsSelfStat)
			logRoute.GET("/search", middleware.AdminAuth(), controller.SearchLogs)
			logRoute.GET("/self", middleware.UserAuth(), controller.GetPageUserLogs)
			logRoute.GET("/self/search", middleware.UserAuth(), controller.SearchUserLogs)
		}

		groupRoute := apiRouter.Group("/group")
		groupRoute.Use(middleware.AdminAuth())
		{
			groupRoute.GET("/", controller.GetAllGroups)
		}
	}
}

func setRelayRouter(router *gin.Engine) {
	router.Use(middleware.Cors())

	modelsRouter := router.Group("/v1/models")
	modelsRouter.Use(middleware.OnlyTokenAuth())
	{
		modelsRouter.GET("", controller.ListModels)
		modelsRouter.GET("/:model", controller.RetrieveModel)
	}

	relayV1Router := router.Group("/v1")
	relayV1Router.Use(middleware.RelayPanicRecover(), middleware.OnlyTokenAuth(), middleware.Distribute())
	{
		relayV1Router.POST("/completions", controller.Relay)
		relayV1Router.POST("/chat/completions", controller.Relay)
		relayV1Router.POST("/edits", controller.Relay)
		relayV1Router.POST("/images/generations", controller.Relay)
		relayV1Router.POST("/images/edits", controller.RelayNotImplemented)
		relayV1Router.POST("/images/variations", controller.RelayNotImplemented)
		relayV1Router.POST("/embeddings", controller.Relay)
		relayV1Router.POST("/engines/:model/embeddings", controller.Relay)
		relayV1Router.POST("/audio/transcriptions", controller.Relay)
		relayV1Router.POST("/audio/translations", controller.Relay)
		relayV1Router.POST("/audio/speech", controller.Relay)
		relayV1Router.GET("/files", controller.RelayNotImplemented)
		relayV1Router.POST("/files", controller.RelayNotImplemented)
		relayV1Router.DELETE("/files/:id", controller.RelayNotImplemented)
		relayV1Router.GET("/files/:id", controller.RelayNotImplemented)
		relayV1Router.GET("/files/:id/content", controller.RelayNotImplemented)
		relayV1Router.POST("/fine_tuning/jobs", controller.RelayNotImplemented)
		relayV1Router.GET("/fine_tuning/jobs", controller.RelayNotImplemented)
		relayV1Router.GET("/fine_tuning/jobs/:id", controller.RelayNotImplemented)
		relayV1Router.POST("/fine_tuning/jobs/:id/cancel", controller.RelayNotImplemented)
		relayV1Router.GET("/fine_tuning/jobs/:id/events", controller.RelayNotImplemented)
		relayV1Router.DELETE("/models/:model", controller.RelayNotImplemented)
		relayV1Router.POST("/moderations", controller.Relay)
		relayV1Router.POST("/assistants", controller.RelayNotImplemented)
		relayV1Router.GET("/assistants/:id", controller.RelayNotImplemented)
		relayV1Router.POST("/assistants/:id", controller.RelayNotImplemented)
		relayV1Router.DELETE("/assistants/:id", controller.RelayNotImplemented)
		relayV1Router.GET("/assistants", controller.RelayNotImplemented)
		relayV1Router.POST("/assistants/:id/files", controller.RelayNotImplemented)
		relayV1Router.GET("/assistants/:id/files/:fileId", controller.RelayNotImplemented)
		relayV1Router.DELETE("/assistants/:id/files/:fileId", controller.RelayNotImplemented)
		relayV1Router.GET("/assistants/:id/files", controller.RelayNotImplemented)
		relayV1Router.POST("/threads", controller.RelayNotImplemented)
		relayV1Router.GET("/threads/:id", controller.RelayNotImplemented)
		relayV1Router.POST("/threads/:id", controller.RelayNotImplemented)
		relayV1Router.DELETE("/threads/:id", controller.RelayNotImplemented)
		relayV1Router.POST("/threads/:id/messages", controller.RelayNotImplemented)
		relayV1Router.GET("/threads/:id/messages/:messageId", controller.RelayNotImplemented)
		relayV1Router.POST("/threads/:id/messages/:messageId", controller.RelayNotImplemented)
		relayV1Router.GET("/threads/:id/messages/:messageId/files/:filesId", controller.RelayNotImplemented)
		relayV1Router.GET("/threads/:id/messages/:messageId/files", controller.RelayNotImplemented)
		relayV1Router.POST("/threads/:id/runs", controller.RelayNotImplemented)
		relayV1Router.GET("/threads/:id/runs/:runsId", controller.RelayNotImplemented)
		relayV1Router.POST("/threads/:id/runs/:runsId", controller.RelayNotImplemented)
		relayV1Router.GET("/threads/:id/runs", controller.RelayNotImplemented)
		relayV1Router.POST("/threads/:id/runs/:runsId/submit_tool_outputs", controller.RelayNotImplemented)
		relayV1Router.POST("/threads/:id/runs/:runsId/cancel", controller.RelayNotImplemented)
		relayV1Router.GET("/threads/:id/runs/:runsId/steps/:stepId", controller.RelayNotImplemented)
		relayV1Router.GET("/threads/:id/runs/:runsId/steps", controller.RelayNotImplemented)
	}
}

func setDashboardRouter(router *gin.Engine) {
	apiRouter := router.Group("/")
	apiRouter.Use(gzip.Gzip(gzip.DefaultCompression))
	apiRouter.Use(middleware.GlobalAPIRateLimit())
	apiRouter.Use(middleware.OnlyTokenAuth())
	{
		apiRouter.GET("/dashboard/billing/subscription", controller.GetSubscriptionInfo)
		apiRouter.GET("/v1/dashboard/billing/subscription", controller.GetSubscriptionInfo)
		apiRouter.GET("/dashboard/billing/usage", controller.GetUsageInfo)
		apiRouter.GET("/v1/dashboard/billing/usage", controller.GetUsageInfo)
	}
}
