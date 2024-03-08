package controller

import (
	"net/http"
	"zhongjyuan/gin-message-server/channel"
	"zhongjyuan/gin-message-server/model"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func RegisterClient(c *gin.Context) {
	secret := c.Query("secret")
	if secret == "" {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "secret 为空",
		})
		return
	}
	user := model.UserEntity{UserName: c.Param("username")}
	err := user.GetByUserName(false)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "无效的用户名",
		})
		return
	}
	channelName := c.Query("channel")
	if channelName == "" {
		channelName = "client"
	}
	channel_, err := model.GetChannelByName(channelName, user.Id, false)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "无效的通道名称",
		})
		return
	}
	if secret != channel_.Secret {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "通道名称与密钥不匹配",
		})
		return
	}
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}
	channel.RegisterClient(channelName, user.Id, conn)
	return
}
