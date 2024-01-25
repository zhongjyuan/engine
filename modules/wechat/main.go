package main

import (
	"log"
	"wechat/handle"

	"github.com/eatmoreapple/openwechat"
)

func main() {
	bot := openwechat.DefaultBot(openwechat.Desktop)

	// 注册消息处理函数
	bot.MessageHandler = handle.Handler

	// 注册登陆二维码回调
	bot.UUIDCallback = openwechat.PrintlnQrcodeUrl

	// 创建热存储容器对象
	reloadStorage := openwechat.NewJsonFileHotReloadStorage("storage.json")

	// 执行热登录
	err := bot.HotLogin(reloadStorage)
	if err != nil {
		if err = bot.Login(); err != nil {
			log.Printf("login error: %v \n", err)
			return
		}
	}

	// 阻塞主goroutine, 直到发生异常或者用户主动退出
	bot.Block()
}
