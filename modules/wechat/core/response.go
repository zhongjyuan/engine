package core

import "errors"

// Ret 表示返回结果的类型
type Ret int

// 定义常量
const (
	ticketError         Ret = -14  // 票据错误
	logicError          Ret = -2   // 逻辑错误
	sysError            Ret = -1   // 系统错误
	paramError          Ret = 1    // 参数错误
	failedLoginWarn     Ret = 1100 // 登录失败警告
	failedLoginCheck    Ret = 1101 // 登录失败检查
	cookieInvalid       Ret = 1102 // Cookie 无效
	loginEnvAbnormality Ret = 1203 // 登录环境异常
	optTooOften         Ret = 1205 // 操作太频繁
)

// BaseResponse 大部分返回对象都携带该信息
type BaseResponse struct {
	Ret    Ret
	ErrMsg string
}

// Ok 判断返回结果是否成功
func (b BaseResponse) Ok() bool {
	return b.Ret == 0
}

// Err 将返回结果转换为错误类型
func (b BaseResponse) Err() error {
	if b.Ok() {
		return nil
	}
	return errors.New(b.ErrMsg)
}
