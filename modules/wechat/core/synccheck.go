package core

import (
	"errors"
	"strconv"
)

// ================================================= [类型](全局)公开 =================================================

type Selector string

const (
	Selector_NORMAL              Selector = "0" // 正常
	Selector_NEW_MSG             Selector = "2" // 有新消息
	Selector_MOD_CONTACT         Selector = "4" // 有人修改了自己的昵称或你修改了别人的备注
	Selector_ADD_OR_DEL_CONTACT  Selector = "6" // 存在删除或者新增的好友信息
	Selector_ENTER_OR_LEAVE_CHAT Selector = "7" // 进入或离开聊天界面
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

func (s SyncCheckResponse) Success() bool {
	return s.RetCode == "0"
}

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

func (s SyncCheckResponse) Normal() bool {
	return s.Success() && s.Selector == Selector_NORMAL
}

func (s SyncCheckResponse) NewMessage() bool {
	return s.Success() && s.Selector == Selector_NEW_MSG
}

func (s SyncCheckResponse) ModContact() bool {
	return s.Success() && s.Selector == Selector_MOD_CONTACT
}

func (s SyncCheckResponse) AddOrDelContact() bool {
	return s.Success() && s.Selector == Selector_ADD_OR_DEL_CONTACT
}

func (s SyncCheckResponse) EnterOrLeaveChat() bool {
	return s.Success() && s.Selector == Selector_ENTER_OR_LEAVE_CHAT
}
