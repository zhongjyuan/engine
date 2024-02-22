package main

import (
	"log"
	"net/http"
	"zhongjyuan/collect/wechat"
)

func main() {

	// 注册 "/collect/gpt/chat/" 路由，并指定处理函数为 wechat.CollectGPTChatData
	http.HandleFunc("/collect/gpt/chat/", wechat.CollectGPTChatData)

	// 注册 "/collect/gpt/message/" 路由，并指定处理函数为 wechat.CollectGPTMessageData
	http.HandleFunc("/collect/gpt/message/", wechat.CollectGPTMessageData)

	// 注册 "/collect/wechat/storage/" 路由，并指定处理函数为 wechat.CollectWechatStorageData
	http.HandleFunc("/collect/wechat/storage/", wechat.CollectWechatStorageData)

	// 注册 "/collect/wechat/message/" 路由，并指定处理函数为 wechat.CollectWechatMessageData
	http.HandleFunc("/collect/wechat/message/", wechat.CollectWechatMessageData)

	// 注册 "/collect/wechat/contact/" 路由，并指定处理函数为 wechat.CollectWechatContactData
	http.HandleFunc("/collect/wechat/contact/", wechat.CollectWechatContactData)

	// 注册 "/collect/wechat/media/" 路由，并指定处理函数为 wechat.CollectWechatMediaData
	http.HandleFunc("/collect/wechat/media/", wechat.CollectWechatMediaData)

	// 注册 "/collect/wechat/avatar/" 路由，并指定处理函数为 wechat.CollectWechatMediaData
	http.HandleFunc("/collect/wechat/avatar/", wechat.CollectWechatAvatarData)

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
