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

// NewSyncCheckResponse 从字节切片中解析出 SyncCheckResponse 对象。
//
// 输入参数：
//   - b []byte: 包含同步检查响应数据的字节切片。
//
// 输出参数：
//   - *SyncCheckResponse: 成功解析出的 SyncCheckResponse 对象指针。
//   - error: 如果解析过程中出现错误，则返回相应的错误信息；否则返回 nil。
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
// Success 方法用于判断 SyncCheckResponse 是否成功。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果 SyncCheckResponse 成功，则返回 true；否则返回 false。
func (s SyncCheckResponse) Success() bool {
	return s.RetCode == "0"
}

// Error 方法用于获取 SyncCheckResponse 的错误信息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - error: 如果 SyncCheckResponse 成功，则返回 nil；否则返回相应的错误信息。
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

// Normal 方法用于判断 SyncCheckResponse 是否为普通消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果 SyncCheckResponse 是普通消息，则返回 true；否则返回 false。
func (s SyncCheckResponse) Normal() bool {
	return s.Success() && s.Selector == Selector_NORMAL
}

// NewMessage 方法用于判断 SyncCheckResponse 是否为新消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果 SyncCheckResponse 是新消息，则返回 true；否则返回 false。
func (s SyncCheckResponse) NewMessage() bool {
	return s.Success() && s.Selector == Selector_NEW_MSG
}

// ModContact 方法用于判断 SyncCheckResponse 是否为修改联系人事件。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果 SyncCheckResponse 是修改联系人事件，则返回 true；否则返回 false。
func (s SyncCheckResponse) ModContact() bool {
	return s.Success() && s.Selector == Selector_MOD_CONTACT
}

// AddOrDelContact 方法用于判断 SyncCheckResponse 是否为添加或删除联系人事件。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果 SyncCheckResponse 是添加或删除联系人事件，则返回 true；否则返回 false。
func (s SyncCheckResponse) AddOrDelContact() bool {
	return s.Success() && s.Selector == Selector_ADD_OR_DEL_CONTACT
}

// EnterOrLeaveChat 方法用于判断 SyncCheckResponse 是否为进入或离开聊天事件。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果 SyncCheckResponse 是进入或离开聊天事件，则返回 true；否则返回 false。
func (s SyncCheckResponse) EnterOrLeaveChat() bool {
	return s.Success() && s.Selector == Selector_ENTER_OR_LEAVE_CHAT
}
