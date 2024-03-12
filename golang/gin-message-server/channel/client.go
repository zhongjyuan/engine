package channel

import (
	"errors"
	"fmt"
	"sync"
	"time"
	"zhongjyuan/gin-message-server/common"
	"zhongjyuan/gin-message-server/model"

	"github.com/gorilla/websocket"
)

const (
	maxMessageSize = 512                 // maxMessageSize 定义了消息的最大大小为 512 字节。
	pongWait       = 60 * time.Second    // pongWait 定义了接收 Pong 消息的最长等待时间为 60 秒。
	writeWait      = 10 * time.Second    // writeWait 定义了写操作的最长等待时间为 10 秒。
	pingPeriod     = (pongWait * 9) / 10 // pingPeriod 定义了发送 Ping 消息的间隔时间为（pongWait 的 9/10）。
)

// webSocketClient 结构体定义了 WebSocket 客户端的属性。
type webSocketClient struct {
	conn      *websocket.Conn           // conn 用于存储 WebSocket 连接对象
	key       string                    // key 用于存储客户端的密钥
	pong      chan bool                 // pong 是一个用于接收 Pong 消息的通道
	stop      chan bool                 // stop 是一个用于停止操作的通道
	message   chan *model.MessageEntity // message 是一个用于存储消息实体的通道
	timestamp int64                     // timestamp 用于存储时间戳
}

// handleDataReading 方法用于处理从 WebSocket 客户端读取数据的操作。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func (c *webSocketClient) handleDataReading() {
	c.conn.SetReadLimit(maxMessageSize) // 设置读取数据的最大限制为 maxMessageSize

	_ = c.conn.SetReadDeadline(time.Now().Add(pongWait)) // 设置读取超时时间为 pongWait

	c.conn.SetPongHandler(func(string) error { // 设置 Pong 处理函数
		return c.conn.SetReadDeadline(time.Now().Add(pongWait)) // 更新读取超时时间为 pongWait
	})

	for {
		messageType, _, err := c.conn.ReadMessage() // 从连接中读取消息类型、数据和错误
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseNoStatusReceived, websocket.CloseAbnormalClosure) {
				common.SysError("error read WebSocket client: " + err.Error()) // 记录错误日志
			}
			c.close() // 关闭客户端连接
			break
		}

		switch messageType {
		case websocket.PingMessage:
			c.pong <- true // 发送 Pong 消息到 pong 通道
		case websocket.CloseMessage:
			c.close() // 关闭客户端连接
		}
	}
}

// handleDataWriting 方法用于处理向 WebSocket 客户端写入数据的操作。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func (c *webSocketClient) handleDataWriting() {
	pingTicker := time.NewTicker(pingPeriod) // 创建定时器 pingTicker，每隔 pingPeriod 触发一次

	defer func() {
		pingTicker.Stop() // 停止定时器 pingTicker

		clientConnMapMutex.Lock()
		client, ok := clientMap[c.key]             // 获取客户端连接信息
		if ok && client.timestamp == c.timestamp { // 否则可能会删除新添加的客户端！
			delete(clientMap, c.key) // 从 clientMap 中删除客户端连接信息
		}
		clientConnMapMutex.Unlock()

		// 关闭客户端连接
		if err := c.conn.Close(); err != nil {
			common.SysError("error close WebSocket client: " + err.Error()) // 记录错误日志
		}
	}()

	for {
		select {
		case message := <-c.message:
			_ = c.conn.SetWriteDeadline(time.Now().Add(writeWait)) // 设置写入超时时间为 writeWait
			if err := c.conn.WriteJSON(message); err != nil {      // 向连接中写入 JSON 格式的消息
				common.SysError("error write data to WebSocket client: " + err.Error()) // 记录错误日志
				return
			}
		case <-c.pong:
			if err := c.conn.WriteMessage(websocket.PongMessage, nil); err != nil { // 向连接发送 Pong 消息
				common.SysError("error send pong to WebSocket client: " + err.Error()) // 记录错误日志
				return
			}
		case <-pingTicker.C:
			_ = c.conn.SetWriteDeadline(time.Now().Add(writeWait))                  // 设置写入超时时间为 writeWait
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil { // 向连接发送 Ping 消息
				common.SysError("error write data to WebSocket client: " + err.Error()) // 记录错误日志
				return
			}
		case <-c.stop:
			if err := c.conn.WriteMessage(websocket.CloseMessage, nil); err != nil { // 向连接发送 Close 消息
				common.SysError("error write data to WebSocket client: " + err.Error()) // 记录错误日志
			}
			return
		}
	}
}

// sendMessage 方法用于向 WebSocket 客户端发送消息。
//
// 输入参数：
//   - message: 要发送的消息实体。
//
// 输出参数：
//   - 无。
func (c *webSocketClient) sendMessage(message *model.MessageEntity) {
	c.message <- message // 将消息实体放入 c.message 通道中
}

// close 方法用于关闭 WebSocket 客户端连接。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func (c *webSocketClient) close() {
	// 应仅调用一次
	c.stop <- true // 发送停止信号到 c.stop 通道
	// 在 handleDataWriting 中的延迟函数将进行清理操作
}

var clientConnMapMutex sync.Mutex         // clientConnMapMutex 用于控制对客户端连接映射的并发访问
var clientMap map[string]*webSocketClient // clientMap 用于存储 WebSocket 客户端信息，键为字符串，值为对应的 webSocketClient 实例

func init() {
	clientConnMapMutex.Lock()                     // 对 clientMap 进行加锁
	clientMap = make(map[string]*webSocketClient) // 初始化 clientMap
	clientConnMapMutex.Unlock()                   // 解除对 clientMap 的锁定
}

// RegisterClient 函数用于注册 WebSocket 客户端并处理重复连接情况。
//
// 输入参数：
//   - channelName: 频道名。
//   - userId: 用户ID。
//   - conn: WebSocket 连接。
//
// 输出参数：
//   - 无。
func RegisterClient(channelName string, userId int, conn *websocket.Conn) {
	// 生成客户端标识键值
	key := fmt.Sprintf("%s:%d", channelName, userId)

	// 加锁操作，防止并发访问 clientMap
	clientConnMapMutex.Lock()
	oldClient, existed := clientMap[key]
	clientConnMapMutex.Unlock()

	// 如果已存在相同的客户端连接信息
	if existed {
		// 创建下线消息
		byeMessage := &model.MessageEntity{
			Title:       common.SystemName,
			Description: "其他客户端已连接服务器，本客户端已被挤下线！",
		}
		// 发送下线消息给旧客户端
		oldClient.sendMessage(byeMessage)
		// 关闭旧客户端连接
		oldClient.close()
	}

	// 创建连接成功消息
	helloMessage := &model.MessageEntity{
		Title:       common.SystemName,
		Description: "客户端连接成功！",
	}

	// 创建新的 WebSocket 客户端
	newClient := &webSocketClient{
		key:       key,
		conn:      conn,
		message:   make(chan *model.MessageEntity),
		pong:      make(chan bool),
		stop:      make(chan bool),
		timestamp: time.Now().UnixMilli(),
	}

	// 启动写入数据协程
	go newClient.handleDataWriting()
	// 启动读取数据协程
	go newClient.handleDataReading()

	// 在函数退出前发送连接成功消息给新客户端
	defer newClient.sendMessage(helloMessage)

	// 加锁操作，防止并发访问 clientMap
	clientConnMapMutex.Lock()
	// 将新客户端信息存入 clientMap
	clientMap[key] = newClient
	clientConnMapMutex.Unlock()
}

// SendClientMessage 函数用于向特定客户端发送消息。
//
// 输入参数：
//   - message: 要发送的消息实体。
//   - user: 用户实体信息。
//   - channel_: 频道实体信息。
//
// 输出参数：
//   - error: 如果客户端未连接，则返回错误信息；否则返回 nil。
func SendClientMessage(message *model.MessageEntity, user *model.UserEntity, channel_ *model.ChannelEntity) error {
	// 生成客户端标识键值
	key := fmt.Sprintf("%s:%d", channel_.Name, user.Id)

	// 加锁操作，防止并发访问 clientMap
	clientConnMapMutex.Lock()
	client, existed := clientMap[key]
	clientConnMapMutex.Unlock()

	// 如果客户端未连接，则返回错误信息
	if !existed {
		return errors.New("客户端未连接")
	}

	// 向客户端发送消息
	client.sendMessage(message)

	return nil
}
