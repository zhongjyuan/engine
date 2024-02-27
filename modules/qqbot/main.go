package main

import (
	"context"
	"time"
	"zhongjyuan/log"
	"zhongjyuan/qqbot/global"
	"zhongjyuan/qqbot/handle"

	"github.com/tencent-connect/botgo"
	"github.com/tencent-connect/botgo/dto"
	"github.com/tencent-connect/botgo/token"
	"github.com/tencent-connect/botgo/websocket"
)

var processor global.Processor

func main() {
	ctx := context.Background()

	processor = global.Processor{Log: log.NewFileLogger("logs", log.SysLevel)}

	// 把新的 logger 设置到 sdk 上，替换掉老的控制台 logger
	botgo.SetLogger(processor.Log)

	// 加载 appid 和 token
	botToken := token.New(token.TypeBot)
	if err := botToken.LoadFromConfig("config.yaml"); err != nil {
		processor.Log.Error(err)
	}

	processor.Api = botgo.NewSandboxOpenAPI(botToken).WithTimeout(3 * time.Second) // 使用NewSandboxOpenAPI创建沙箱环境的实例

	// 获取 websocket 信息
	wsInfo, err := processor.Api.WS(ctx, nil, "")
	if err != nil {
		processor.Log.Errorf("%+v, err:%v", wsInfo, err)
	}

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

	me, err := processor.Api.Me(ctx)
	processor.Log.Infof("%+v err: %v", me, err)

	guilds, err := processor.Api.MeGuilds(ctx, &dto.GuildPager{})
	processor.Log.Infof("%+v err: %v", guilds, err)

	// 启动 session manager 进行 ws 连接的管理，如果接口返回需要启动多个 shard 的连接，这里也会自动启动多个
	if err = botgo.NewSessionManager().Start(wsInfo, botToken, &intent); err != nil {
		processor.Log.Error(err)
	}
}
