package main

import (
	"zhongjyuan/wechatgpt/config"
	"zhongjyuan/wechatgpt/core"
	"zhongjyuan/wechatgpt/message"
	"zhongjyuan/wechatgpt/storage"
)

func main() {
	bot := core.DefaultBot(core.Desktop, core.WithDomain(config.LoadConfig().WechatDomain), core.WithLogger(config.Logger()), core.BotPreparerHandler(func(b *core.Bot) {
		config.SetBot(b)
		b.Logger().Debug("Bot 对象实例化完成。")
	}))

	// 注册消息处理函数
	bot.MessageHandler = message.Handler

	// 注册缓存处理函数
	bot.StorageCallback = storage.CollectWechatStorageData

	// 创建热存储容器对象
	reloadStorage := core.NewFileHotReloadStorage(config.LoadConfig().WechatStorageFileName)

	defer reloadStorage.Close()

	// 执行热登录
	err := bot.HotLogin(reloadStorage)
	if err != nil {
		if err = bot.PushLogin(reloadStorage, core.NewRetryLoginOption()); err != nil {
			config.Logger().Error("login error: %v \n", err)
			return
		}
	}

	// 阻塞主goroutine, 直到发生异常或者联系人主动退出
	bot.Block()
}
