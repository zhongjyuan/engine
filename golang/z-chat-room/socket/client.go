package socket

import (
	"bytes"
	"log"
	"time"

	"github.com/gorilla/websocket"
)

// Hub 结构体维护活跃客户端集合并向客户端广播消息。
type Hub struct {
	clients    map[*Client]bool // 注册的客户端集合。
	broadcast  chan []byte      // 来自客户端的传入消息。
	register   chan *Client     // 客户端注册请求。
	unregister chan *Client     // 客户端注销请求。
}

// NewHub 函数创建一个新的 Hub 实例。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *Hub: 返回一个指向新创建的 Hub 实例的指针。
func NewHub() *Hub {
	return &Hub{
		broadcast:  make(chan []byte),      // 创建传入消息通道。
		register:   make(chan *Client),     // 创建客户端注册通道。
		unregister: make(chan *Client),     // 创建客户端注销通道。
		clients:    make(map[*Client]bool), // 创建客户端集合。
	}
}

// Run 方法启动 Hub 实例的运行循环，用于处理注册、注销以及广播消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register: // 处理客户端注册请求。
			h.clients[client] = true // 将客户端添加到注册集合中。
		case client := <-h.unregister: // 处理客户端注销请求。
			if _, ok := h.clients[client]; ok { // 检查客户端是否存在于注册集合中。
				delete(h.clients, client) // 从注册集合中删除客户端。
				close(client.send)        // 关闭客户端发送消息的通道。
			}
		case message := <-h.broadcast: // 处理广播消息。
			for client := range h.clients { // 遍历所有注册的客户端。
				select {
				case client.send <- message: // 将消息发送给客户端的发送通道。
				default:
					close(client.send)        // 关闭客户端发送消息的通道。
					delete(h.clients, client) // 从注册集合中删除客户端。
				}
			}
		}
	}
}

// Client 结构体代表 WebSocket 连接与 Hub 之间的中间人。
type Client struct {
	conn *websocket.Conn // WebSocket 连接实例。
	hub  *Hub            // 指向 Hub 实例的指针。
	send chan []byte     // 用于传输消息的缓冲通道。
}

// readPump 方法从websocket连接中读取消息并发送到hub。
//
// 应用程序在每个连接上的goroutine中运行readPump。应用程序通过执行所有读取操作保证一个连接只有一个读取器。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func (c *Client) readPump() {
	defer func() {
		c.hub.unregister <- c // 在函数结束时将客户端注销。
		c.conn.Close()        // 关闭连接。
	}()

	c.conn.SetReadLimit(maxMessageSize)              // 设置读取消息大小限制。
	c.conn.SetReadDeadline(time.Now().Add(pongWait)) // 设置读取截止时间。

	c.conn.SetPongHandler(func(string) error { // 设置Pong处理函数。
		c.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, message, err := c.conn.ReadMessage() // 读取消息。
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err) // 打印错误日志。
			}
			break
		}
		message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1)) // 处理消息格式。

		c.hub.broadcast <- message // 将消息发送到hub的广播通道。
	}
}

// writePump 方法从hub将消息发送到websocket连接。
//
// 为每个连接启动一个运行writePump的goroutine。应用程序通过执行所有写操作来确保一个连接最多只有一个写入器。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod) // 创建定时器用于发送ping消息。

	defer func() {
		ticker.Stop()  // 停止定时器。
		c.conn.Close() // 关闭连接。
	}()

	for {
		select {
		case message, ok := <-c.send: // 从客户端发送通道接收消息。
			c.conn.SetWriteDeadline(time.Now().Add(writeWait)) // 设置写入截止时间。
			if !ok {                                           // Hub关闭了通道。
				c.conn.WriteMessage(websocket.CloseMessage, []byte{}) // 发送关闭消息。
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage) // 获取下一个写入器。
			if err != nil {
				return
			}
			w.Write(message) // 写入消息。

			// 将排队的聊天消息添加到当前websocket消息中。
			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write(newline)  // 写入换行符。
				w.Write(<-c.send) // 写入下一条消息。
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait)) // 设置写入截止时间。
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
