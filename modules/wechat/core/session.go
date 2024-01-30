package core

// ================================================= [类型](全局)公开 =================================================

// Session 结构体表示一个会话对象，保存了登录信息、请求和响应数据。
type Session struct {
	Request   *BaseRequest       // Request 表示请求数据。
	Response  *WebInitResponse   // Response 表示响应数据。
	LoginInfo *LoginInfoResponse // LoginInfo 表示登录信息。
}
