package wechatbot

import (
	"errors"
)

// ================================================= [类型](全局)公开 =================================================

var (
	Error_Forbidden               = errors.New("login forbidden")             // Error_Forbidden 定义了禁止当前账号登录的错误。
	Error_InvalidStorage          = errors.New("invalid storage")             // Error_InvalidStorage 定义了无效存储错误。
	Error_Network                 = errors.New("wechat network error")        // Error_Network 定义了微信网络错误。
	Error_NoSuchUserFound         = errors.New("no such user found")          // Error_NoSuchUserFound 定义了未找到联系人的错误。
	Error_LoginTimeout            = errors.New("login timeout")               // Error_LoginTimeout 定义了登录超时错误。
	Error_WebWxDataTicketNotFound = errors.New("webwx_data_ticket not found") // Error_WebWxDataTicketNotFound 定义了找不到 webwx_data_ticket 错误。
	Error_Logout                  = errors.New("user logout")                 // Error_Logout 定义了联系人注销错误。
)

// ================================================= [函数](全局)公开 =================================================

// IsNetworkError 函数检查错误是否为网络错误。
//
// 参数：
//   - err error：要检查的错误对象。
//
// 返回值：
//   - bool：如果错误是网络错误 ErrNetwork，则返回 true；否则返回 false。
func IsNetworkError(err error) bool {
	return errors.Is(err, Error_Network)
}

// IgnoreNetworkError 函数返回一个处理器，用于忽略网络错误并调用指定的错误处理函数。
//
// 参数：
//   - errHandler func(err error)：错误处理函数，用于处理非网络错误。
//
// 返回值：
//   - func(error)：用于处理错误的函数。
func IgnoreNetworkError(errHandler func(err error)) func(error) {
	return func(err error) {
		if !IsNetworkError(err) { // 如果错误不是网络错误
			errHandler(err) // 调用指定的错误处理函数处理该错误
		}
	}
}

// ================================================= [函数](Ret)公开 =================================================

// Error 方法返回 Ret 类型的字符串表示，用作错误信息。
//
// 返回值：
//   - string：Ret 类型的字符串表示。
func (result Ret) Error() string {
	return result.String()
}
