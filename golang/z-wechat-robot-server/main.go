package main

import (
	wechatbot "zhongjyuan/wechat-robot"
	"zhongjyuan/wechat-robot-service/config"
	"zhongjyuan/wechat-robot-service/message"
	"zhongjyuan/wechat-robot-service/storage"
)

func main() {
	bot := wechatbot.DefaultBot(wechatbot.Desktop, wechatbot.WithDomain(config.LoadConfig().WechatDomain), wechatbot.WithLogger(config.Logger()), wechatbot.BotPreparerHandler(func(b *wechatbot.Bot) {
		config.SetBot(b)
		b.Logger().Debug("Bot 对象实例化完成。")
	}))

	// 注册消息处理函数
	bot.MessageHandler = message.Handler

	bot.AvatarHandler = storage.CollectWechatAvatarData

	bot.UpdateContactHandler = storage.CollectWechatContactData

	// 注册缓存处理函数
	bot.HotReloadStorageHandler = storage.CollectWechatStorageData

	// 创建热存储容器对象
	reloadStorage := wechatbot.NewFileHotReloadStorage(config.LoadConfig().WechatStorageFileName)

	defer reloadStorage.Close()

	// 执行热登录
	err := bot.HotLogin(reloadStorage)
	if err != nil {
		if err = bot.PushLogin(reloadStorage, wechatbot.NewRetryLoginOption()); err != nil {
			config.Logger().Error("login error: %v \n", err)
			return
		}
	}

	// 阻塞主goroutine, 直到发生异常或者联系人主动退出
	bot.Block()
}
