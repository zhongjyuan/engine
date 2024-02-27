package main

import (
	"context"
	"time"
	"zhongjyuan/qqbot/config"
	"zhongjyuan/qqbot/handle"
	"zhongjyuan/qqbot/task"

	"github.com/tencent-connect/botgo"
	"github.com/tencent-connect/botgo/dto"
	"github.com/tencent-connect/botgo/token"
	"github.com/tencent-connect/botgo/websocket"
)

func main() {
	ctx := context.Background()

	cfg := config.GetConfig()

	// 把新的 logger 设置到 sdk 上，替换掉老的控制台 logger
	botgo.SetLogger(cfg.Logger)

	// 加载 appid 和 token
	botToken := token.BotToken(uint64(cfg.AppID), cfg.Token)
	api := botgo.NewSandboxOpenAPI(botToken).WithTimeout(3 * time.Second) // 使用NewSandboxOpenAPI创建沙箱环境的实例

	// 获取 websocket 信息
	wsInfo, err := api.WS(ctx, nil, "")
	if err != nil {
		cfg.Logger.Errorf("%+v, err:%v", wsInfo, err)
	}

	processor := handle.Processor{Log: cfg.Logger, Api: api, WSInfo: wsInfo, Context: ctx}
	handle.SetProcessor(&processor)

	// 根据不同的回调，生成 intents
	intent := websocket.RegisterHandlers(
		handle.ReadyHandler(processor),
		handle.ErrorNotifyHandler(processor),
		handle.PlainEventHandler(processor),
		handle.GuildEventHandler(processor),
		handle.GuildMemberEventHandler(processor),
		handle.ChannelEventHandler(processor),
		// handle.MessageEventHandler(processor),
		// handle.MessageDeleteEventHandler(processor),
		// handle.PublicMessageDeleteEventHandler(processor),
		// handle.DirectMessageDeleteEventHandler(processor),
		handle.MessageReactionEventHandler(processor),
		handle.ATMessageEventHandler(processor),
		// handle.DirectMessageEventHandler(processor),
		handle.AudioEventHandler(processor),
		handle.MessageAuditEventHandler(processor),
		// handle.ThreadEventHandler(processor),
		// handle.PostEventHandler(processor),
		// handle.ReplyEventHandler(processor),
		// handle.ForumAuditEventHandler(processor),
		handle.InteractionEventHandler(processor),
	)

	task.WeatherTask()

	me, err := api.Me(ctx)
	cfg.Logger.Infof("%+v err: %v", me, err)

	guilds, err := api.MeGuilds(ctx, &dto.GuildPager{})
	cfg.Logger.Infof("%+v err: %v", guilds, err)

	// 启动 session manager 进行 ws 连接的管理，如果接口返回需要启动多个 shard 的连接，这里也会自动启动多个
	if err = botgo.NewSessionManager().Start(wsInfo, botToken, &intent); err != nil {
		cfg.Logger.Error(err)
	}
}
