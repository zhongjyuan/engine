package main

import (
	"log"
	"net/http"
	"zhongjyuan/collect-service/chat"
	"zhongjyuan/collect-service/collect"
)

func main() {

	// 注册 "/collect/gpt/chat/" 路由，并指定处理函数为 wechat.ChatGPTChat
	http.HandleFunc("/collect/gpt/chat/", collect.ChatGPTChat)
	// 注册 "/collect/gpt/message/" 路由，并指定处理函数为 wechat.ChatGPTMessage
	http.HandleFunc("/collect/gpt/message/", collect.ChatGPTMessage)

	// 注册 "/collect/wechat/avatar/" 路由，并指定处理函数为 wechat.WechatAvatar
	http.HandleFunc("/collect/wechat/avatar/", collect.WechatAvatar)
	// 注册 "/collect/wechat/media/" 路由，并指定处理函数为 wechat.WechatMedia
	http.HandleFunc("/collect/wechat/media/", collect.WechatMedia)
	// 注册 "/collect/wechat/storage/" 路由，并指定处理函数为 wechat.WechatStorage
	http.HandleFunc("/collect/wechat/storage/", collect.WechatStorage)
	// 注册 "/collect/wechat/message/" 路由，并指定处理函数为 wechat.WechatMessage
	http.HandleFunc("/collect/wechat/message/", collect.WechatMessage)
	// 注册 "/collect/wechat/contact/" 路由，并指定处理函数为 wechat.WechatContact
	http.HandleFunc("/collect/wechat/contact/", collect.WechatContact)

	// 注册 "/collect/wechat/contact/" 路由，并指定处理函数为 wechat.WechatContact
	http.HandleFunc("/chat/process", chat.Handle)

	// 启动 HTTP 服务器并指定端口
	go func() {
		if err := http.ListenAndServe(":84", nil); err != nil {
			log.Fatal(err)
		}
	}()

	// 打印启动日志
	log.Println("服务器已成功启动，正在监听端口 84")

	// 阻塞主线程，以便服务器在后台继续运行
	select {}
}
