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
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 512
)

type webSocketClient struct {
	key       string
	conn      *websocket.Conn
	message   chan *model.MessageEntity
	pong      chan bool
	stop      chan bool
	timestamp int64
}

func (c *webSocketClient) handleDataReading() {
	c.conn.SetReadLimit(maxMessageSize)
	_ = c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error {
		return c.conn.SetReadDeadline(time.Now().Add(pongWait))
	})
	for {
		messageType, _, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseNoStatusReceived, websocket.CloseAbnormalClosure) {
				common.SysError("error read WebSocket client: " + err.Error())
			}
			c.close()
			break
		}
		switch messageType {
		case websocket.PingMessage:
			c.pong <- true
		case websocket.CloseMessage:
			c.close()
			break
		}
	}
}

func (c *webSocketClient) handleDataWriting() {
	pingTicker := time.NewTicker(pingPeriod)
	defer func() {
		pingTicker.Stop()
		clientConnMapMutex.Lock()
		client, ok := clientMap[c.key]
		// otherwise we may delete the new added client!
		if ok && client.timestamp == c.timestamp {
			delete(clientMap, c.key)
		}
		clientConnMapMutex.Unlock()
		err := c.conn.Close()
		if err != nil {
			common.SysError("error close WebSocket client: " + err.Error())
		}
	}()
	for {
		select {
		case message := <-c.message:
			_ = c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			err := c.conn.WriteJSON(message)
			if err != nil {
				common.SysError("error write data to WebSocket client: " + err.Error())
				return
			}
		case <-c.pong:
			err := c.conn.WriteMessage(websocket.PongMessage, nil)
			if err != nil {
				common.SysError("error send pong to WebSocket client: " + err.Error())
				return
			}
		case <-pingTicker.C:
			_ = c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			err := c.conn.WriteMessage(websocket.PingMessage, nil)
			if err != nil {
				common.SysError("error write data to WebSocket client: " + err.Error())
				return
			}
		case <-c.stop:
			err := c.conn.WriteMessage(websocket.CloseMessage, nil)
			if err != nil {
				common.SysError("error write data to WebSocket client: " + err.Error())
			}
			return
		}
	}
}

func (c *webSocketClient) sendMessage(message *model.MessageEntity) {
	c.message <- message
}

func (c *webSocketClient) close() {
	// should only be called once
	c.stop <- true
	// the defer function in handleDataWriting will do the cleanup
}

var clientMap map[string]*webSocketClient
var clientConnMapMutex sync.Mutex

func init() {
	clientConnMapMutex.Lock()
	clientMap = make(map[string]*webSocketClient)
	clientConnMapMutex.Unlock()
}

func RegisterClient(channelName string, userId int, conn *websocket.Conn) {
	key := fmt.Sprintf("%s:%d", channelName, userId)
	clientConnMapMutex.Lock()
	oldClient, existed := clientMap[key]
	clientConnMapMutex.Unlock()
	if existed {
		byeMessage := &model.MessageEntity{
			Title:       common.SystemName,
			Description: "其他客户端已连接服务器，本客户端已被挤下线！",
		}
		oldClient.sendMessage(byeMessage)
		oldClient.close()
	}
	helloMessage := &model.MessageEntity{
		Title:       common.SystemName,
		Description: "客户端连接成功！",
	}
	newClient := &webSocketClient{
		key:       key,
		conn:      conn,
		message:   make(chan *model.MessageEntity),
		pong:      make(chan bool),
		stop:      make(chan bool),
		timestamp: time.Now().UnixMilli(),
	}
	go newClient.handleDataWriting()
	go newClient.handleDataReading()
	defer newClient.sendMessage(helloMessage)
	clientConnMapMutex.Lock()
	clientMap[key] = newClient
	clientConnMapMutex.Unlock()
}

func SendClientMessage(message *model.MessageEntity, user *model.UserEntity, channel_ *model.ChannelEntity) error {
	key := fmt.Sprintf("%s:%d", channel_.Name, user.Id)
	clientConnMapMutex.Lock()
	client, existed := clientMap[key]
	clientConnMapMutex.Unlock()
	if !existed {
		return errors.New("客户端未连接")
	}
	client.sendMessage(message)
	return nil
}
