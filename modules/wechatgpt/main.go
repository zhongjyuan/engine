package main

import (
	"log"
	"zhongjyuan/wechatgpt/config"
	"zhongjyuan/wechatgpt/core"
	"zhongjyuan/wechatgpt/message"
)

func main() {
	bot := core.DefaultBot(core.Desktop, core.WithDomain(config.LoadConfig().WechatDomain))

	// 注册消息处理函数
	bot.MessageHandler = message.Handler

	// 注册登陆二维码回调
	bot.UUIDCallback = core.PrintlnQRCodeUrl

	// 创建热存储容器对象
	reloadStorage := core.NewFileHotReloadStorage(config.LoadConfig().WechatStorageFileName)

	defer reloadStorage.Close()

	// 执行热登录
	err := bot.HotLogin(reloadStorage)
	if err != nil {
		if err = bot.PushLogin(reloadStorage, core.NewRetryLoginOption()); err != nil {
			log.Printf("login error: %v \n", err)
			return
		}
	}

	// 阻塞主goroutine, 直到发生异常或者联系人主动退出
	bot.Block()
}
