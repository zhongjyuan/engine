package socket

import (
	"log"
	"net/http"
)

// HandleWebSocketConnection 处理来自对等方的 WebSocket 请求。
//
// HandleWebSocketConnection 将 HTTP 请求升级为 WebSocket 连接，并创建一个新的客户端
// 绑定到给定的聊天室中央处理器。然后启动两个 goroutines 分别用于处理写操作和读操作。
//
// 输入参数：
//   - hub *Hub: 聊天室的中央处理器。
//   - w http.ResponseWriter: 用于写入响应的接口。
//   - r *http.Request: 包含请求的信息。
//
// 输出参数：
//   - 无。
func HandleWebSocketConnection(hub *Hub, w http.ResponseWriter, r *http.Request) {
	// 升级 HTTP 连接为 WebSocket 连接
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	// 创建新的客户端并注册到 hub 中
	client := &Client{hub: hub, conn: conn, send: make(chan []byte, 256)}
	client.hub.register <- client

	// 启动两个 goroutines 分别用于处理写操作和读操作
	go client.writePump()
	go client.readPump()
}
