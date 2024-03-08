package controller

import (
	"io"
	"sync"
	"zhongjyuan/gin-message-server/model"

	"github.com/gin-gonic/gin"
)

var messageChanBufferSize = 10

var messageChanStore struct {
	Map   map[int]*chan *model.MessageEntity
	Mutex sync.RWMutex
}

func messageChanStoreAdd(messageChan *chan *model.MessageEntity, userId int) {
	messageChanStore.Mutex.Lock()
	defer messageChanStore.Mutex.Unlock()
	messageChanStore.Map[userId] = messageChan
}

func messageChanStoreRemove(userId int) {
	messageChanStore.Mutex.Lock()
	defer messageChanStore.Mutex.Unlock()
	delete(messageChanStore.Map, userId)
}

func init() {
	messageChanStore.Map = make(map[int]*chan *model.MessageEntity)
}

func syncMessageToUser(message *model.MessageEntity, userId int) {
	messageChanStore.Mutex.RLock()
	defer messageChanStore.Mutex.RUnlock()
	messageChan, ok := messageChanStore.Map[userId]
	if !ok {
		return
	}
	*messageChan <- message
}

func GetNewMessages(c *gin.Context) {
	userId := c.GetInt("id")
	messageChan := make(chan *model.MessageEntity, messageChanBufferSize)
	messageChanStoreAdd(&messageChan, userId)
	c.Stream(func(w io.Writer) bool {
		if msg, ok := <-messageChan; ok {
			c.SSEvent("message", *msg)
			return true
		}
		return false
	})
	messageChanStoreRemove(userId)
	close(messageChan)
}
