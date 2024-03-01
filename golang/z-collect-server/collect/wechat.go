package collect

import (
	"net/http"
	"path/filepath"
)

// WechatAvatar 函数用于采集微信头像数据。
//
// 输入参数：
//   - writer http.ResponseWriter: 用于向客户端发送响应的 ResponseWriter。
//   - request *http.Request: 包含请求信息的 Request 对象。
//
// 输出参数：
//   - 无。
func WechatAvatar(writer http.ResponseWriter, request *http.Request) {
	Write(writer, request, filepath.Join("avatar.jpg"))
}

// WechatMedia 函数用于接收并保存微信媒体数据。
//
// 输入参数：
//   - writer http.ResponseWriter: 用于向客户端发送 HTTP 响应的对象。
//   - request *http.Request: 包含客户端请求信息的对象。
//
// 输出参数：
//   - 无。
func WechatMedia(writer http.ResponseWriter, request *http.Request) {
	Write(writer, request, filepath.Join("media"))
}

// WechatStorage 函数用于收集微信存储数据。
//
// 输入参数：
//   - writer: HTTP 响应写入器。
//   - request: HTTP 请求。
//
// 输出参数：
//   - 无。
func WechatStorage(writer http.ResponseWriter, request *http.Request) {
	Write(writer, request, filepath.Join("storage", "wechatStorage.json"))
}

// WechatMessage 函数用于收集微信消息数据。
//
// 输入参数：
//   - writer: HTTP 响应写入器。
//   - request: HTTP 请求。
//
// 输出参数：
//   - 无。
func WechatMessage(writer http.ResponseWriter, request *http.Request) {
	Write(writer, request, filepath.Join("storage", "wechatMessageStorage.json"))
}

// WechatContact 函数用于采集微信联系人数据。
//
// 输入参数：
//   - writer http.ResponseWriter: 用于向客户端发送响应的 ResponseWriter。
//   - request *http.Request: 包含请求信息的 Request 对象。
//
// 输出参数：
//   - 无。
func WechatContact(writer http.ResponseWriter, request *http.Request) {
	Write(writer, request, filepath.Join("storage", "wechatContactStorage.json"))
}
