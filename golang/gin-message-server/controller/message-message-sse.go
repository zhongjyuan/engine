package controller

import (
	"io"
	"sync"
	"zhongjyuan/gin-message-server/model"

	"github.com/gin-gonic/gin"
)

// messageChanBufferSize 用于指定消息通道的缓冲区大小。
var messageChanBufferSize = 10

// messageChanStore 用于存储消息通道的映射关系，包括消息通道的映射和互斥锁。
var messageChanStore struct {
	Mutex sync.RWMutex                       // Mutex 用于保护消息通道映射的读写操作
	Map   map[int]*chan *model.MessageEntity // Map 存储消息通道的映射关系，键为整数，值为指向消息实体通道的指针
}

// init 函数用于初始化消息通道存储，创建一个空的消息通道映射。
//
// 输入参数：
//   - 无
//
// 输出参数：
//   - 无
func init() {
	messageChanStore.Map = make(map[int]*chan *model.MessageEntity) // 创建一个空的消息通道映射
}

// messageChanStoreAdd 用于向消息通道存储中添加消息通道，并关联到指定的用户 ID。
//
// 输入参数：
//   - messageChan: 指向消息实体通道的指针，用于存储用户的消息通道
//   - userId: 用户 ID，用于关联消息通道
//
// 输出参数：
//   - 无
func messageChanStoreAdd(messageChan *chan *model.MessageEntity, userId int) {
	messageChanStore.Mutex.Lock()              // 获取互斥锁，保护消息通道映射的并发访问
	defer messageChanStore.Mutex.Unlock()      // 在函数返回时释放互斥锁
	messageChanStore.Map[userId] = messageChan // 将消息通道与用户 ID 关联存储到消息通道映射中
}

// messageChanStoreRemove 用于从消息通道存储中移除指定用户 ID 对应的消息通道。
//
// 输入参数：
//   - userId: 要移除消息通道的用户 ID
//
// 输出参数：
//   - 无
func messageChanStoreRemove(userId int) {
	messageChanStore.Mutex.Lock()         // 获取互斥锁，保护消息通道映射的并发访问
	defer messageChanStore.Mutex.Unlock() // 在函数返回时释放互斥锁
	delete(messageChanStore.Map, userId)  // 从消息通道映射中删除指定用户 ID 对应的消息通道
}

// sendSyncMessageToUser 用于将消息同步发送给指定用户的消息通道。
//
// 输入参数：
//   - message: 要发送的消息实体指针
//   - userId: 接收消息的用户 ID
//
// 输出参数：
//   - 无
func sendSyncMessageToUser(message *model.MessageEntity, userId int) {
	messageChanStore.Mutex.RLock()         // 获取读取互斥锁，保护消息通道映射的并发读取
	defer messageChanStore.Mutex.RUnlock() // 在函数返回时释放读取互斥锁

	messageChan, ok := messageChanStore.Map[userId] // 根据用户 ID 获取对应的消息通道
	if !ok {
		return // 如果未找到用户对应的消息通道，则直接返回
	}
	*messageChan <- message // 将消息写入用户对应的消息通道中
}

// MessagesStream 用于处理获取新消息并通过 Server-Sent Events (SSE) 推送给客户端的逻辑。
//
// 输入参数：
//   - c: Gin 上下文对象，用于处理 HTTP 请求和响应
//
// 输出参数：
//   - 无
func MessagesStream(c *gin.Context) {
	userId := c.GetInt("id")                                              // 获取用户 ID
	messageChan := make(chan *model.MessageEntity, messageChanBufferSize) // 创建消息通道
	messageChanStoreAdd(&messageChan, userId)                             // 将消息通道与用户 ID 关联存储

	c.Stream(func(w io.Writer) bool {
		if msg, ok := <-messageChan; ok { // 从消息通道中读取消息
			c.SSEvent("message", *msg) // 使用 Server-Sent Events 推送消息给客户端
			return true
		}
		return false
	})

	messageChanStoreRemove(userId) // 移除用户关联的消息通道
	close(messageChan)             // 关闭消息通道
}
