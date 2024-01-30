package core

import (
	"errors"
	"strconv"
)

// ================================================= [类型](全局)公开 =================================================

type Selector string

const (
	Normal          Selector = "0" // 正常
	NewMessage      Selector = "2" // 有新消息
	ExchangeContact Selector = "4" // 联系人信息变更
	ModContact      Selector = "6" // 添加或删除联系人
	ModChatRoom     Selector = "7" // 进入或退出聊天室
)

// SyncCheckResponse 表示同步检查响应的结构体
type SyncCheckResponse struct {
	RetCode  string   // 返回码
	Selector Selector // 选择器
}

// ================================================= [函数](全局)公开 =================================================

// NewSyncCheckResponse 根据字节切片创建 SyncCheckResponse 对象
func NewSyncCheckResponse(b []byte) (*SyncCheckResponse, error) {
	// 使用正则表达式解析字节切片
	results := regexpSyncCheck.FindSubmatch(b)
	if len(results) != 3 {
		return nil, errors.New("parse sync key failed")
	}

	// 将结果解析为字符串和 Selector 枚举类型
	retCode, selector := string(results[1]), Selector(results[2])

	// 创建 SyncCheckResponse 对象
	syncCheckResponse := &SyncCheckResponse{RetCode: retCode, Selector: selector}

	return syncCheckResponse, nil
}

// ================================================= [函数](SyncCheckResponse)公开 =================================================

func (s SyncCheckResponse) Error() error {
	if s.Success() {
		return nil
	}

	i, err := strconv.Atoi(s.RetCode)
	if err != nil {
		return errors.New("sync check unknown error")
	}

	return Ret(i)
}

func (s SyncCheckResponse) Success() bool {
	return s.RetCode == "0"
}

func (s SyncCheckResponse) Normal() bool {
	return s.Success() && s.Selector == Normal
}

func (s SyncCheckResponse) NewMessage() bool {
	return s.Success() && s.Selector == NewMessage
}

func (s SyncCheckResponse) ContactExchange() bool {
	return s.Success() && s.Selector == ExchangeContact
}

func (s SyncCheckResponse) ContactMod() bool {
	return s.Success() && s.Selector == ModContact
}

func (s SyncCheckResponse) ChatRoomMod() bool {
	return s.Success() && s.Selector == ModChatRoom
}
