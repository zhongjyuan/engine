package router

import (
	"zhongjyuan/gin-wechat-server/controller"
	"zhongjyuan/gin-wechat-server/middleware"

	"github.com/gin-gonic/gin"
)

func setWechatApiRouter(router *gin.Engine) {
	apiRouter := router.Group("/api")
	apiRouter.Use(middleware.GlobalAPIRateLimit())
	{
		wechatRoute := apiRouter.Group("/wechat")
		wechatRoute.Use(middleware.AdminAuth(), middleware.OnlyTokenAuth())
		{
			wechatRoute.GET("/user", controller.GetUserIDByCode)
			wechatRoute.GET("/access_token", controller.GetWeChatAccessToken)
		}
	}
}
