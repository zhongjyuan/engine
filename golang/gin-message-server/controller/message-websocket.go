package controller

import (
	"net/http"
	"zhongjyuan/gin-message-server/channel"
	"zhongjyuan/gin-message-server/common"
	"zhongjyuan/gin-message-server/model"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

// upgrader 是一个 WebSocket 升级器，用于配置 WebSocket 连接的参数。
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024, // 读取缓冲区大小为 1024 字节
	WriteBufferSize: 1024, // 写入缓冲区大小为 1024 字节
	CheckOrigin: func(r *http.Request) bool {
		return true
	}, // 自定义 CheckOrigin 函数始终返回 true，允许所有来源连接
}

// RegisterClient 函数用于处理客户端注册连接请求。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含了 HTTP 请求的信息和操作方法。
// 输出参数：
//   - 无。

func RegisterClient(c *gin.Context) {
	// 从请求参数中获取 secret 字段
	secret := c.Query("secret")
	// 如果 secret 为空，则返回错误响应并结束函数
	if secret == "" {
		common.SendFailureJSONResponse(c, "secret 为空")
		return
	}

	// 根据 URL 中的 username 参数创建一个 UserEntity 对象
	user := model.UserEntity{UserName: c.Param("username")}
	// 根据用户名查询用户信息，如果出错则返回错误响应并结束函数
	if err := user.GetByUserName(false); err != nil {
		common.SendFailureJSONResponse(c, "无效的用户名")
		return
	}

	// 从请求参数中获取 channel 字段，如果为空则默认为 "client"
	channelName := c.Query("channel")
	if channelName == "" {
		channelName = "client"
	}

	// 根据 channelName 和 user.Id 获取对应的 ChannelEntity 对象
	channelEntity, err := model.GetChannelByName(channelName, user.Id, false)
	// 如果查询出错则返回错误响应并结束函数
	if err != nil {
		common.SendFailureJSONResponse(c, "无效的通道名称")
		return
	}

	// 检查请求中的 secret 是否与通道密钥匹配，如果不匹配则返回错误响应并结束函数
	if secret != channelEntity.Secret {
		common.SendFailureJSONResponse(c, "通道名称与密钥不匹配")
		return
	}

	// 使用 upgrader 对象升级 HTTP 连接为 WebSocket 连接
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	// 如果升级过程出错则返回错误响应并结束函数
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 将客户端注册到指定的通道中
	channel.RegisterClient(channelName, user.Id, conn)
}
