package socket

import (
	"time"

	"github.com/gorilla/websocket"
)

const (
	writeWait      = 10 * time.Second    // writeWait 定义了将消息写入对等端的允许时间。
	pongWait       = 60 * time.Second    // pongWait 定义了从对等端读取下一个 pong 消息的允许时间。
	pingPeriod     = (pongWait * 9) / 10 // pingPeriod 设置了向对等端发送 ping 消息的频率。必须小于 pongWait。
	maxMessageSize = 512                 // maxMessageSize 是允许从对等端接收的最大消息大小。
)

var (
	space   = []byte{' '}  // space 表示空格字符 ' ' 的字节数组。
	newline = []byte{'\n'} // newline 表示换行符 '\n' 的字节数组。
)

// upgrader 是用于升级 HTTP 连接为 WebSocket 连接的 Upgrader 结构体。
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024, // ReadBufferSize 定义了读取缓冲区的大小为 1024 字节。
	WriteBufferSize: 1024, // WriteBufferSize 定义了写入缓冲区的大小为 1024 字节。
}
