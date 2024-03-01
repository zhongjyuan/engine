package message

import (
	wechatbot "zhongjyuan/wechat-robot"
	"zhongjyuan/wechat-robot-service/storage"
)

// HandleType 是一个自定义类型，用于表示处理类型。
type HandleType string

// 定义不同的处理类型常量
const (
	FileHandler      HandleType = "file"      // FileHandler 表示文件处理类型
	UserHandler      HandleType = "user"      // UserHandler 表示用户处理类型
	GroupHandler     HandleType = "group"     // GroupHandler 表示群组处理类型
	FriendAddHandler HandleType = "friendAdd" // FriendAddHandler 表示添加好友处理类型
)

// IMessageHandler 是一个接口，定义了消息处理器的方法。
type IMessageHandler interface {
	// Handle 方法用于处理消息。
	//
	// 输入参数：
	//   - *wechatbot.Message: 要处理的消息对象。
	// 输出参数：
	//   - error: 如果处理过程中发生错误，则返回相应的错误；否则返回 nil。
	Handle(*wechatbot.Message) error
}

// handlers 是一个映射，用于存储不同处理类型对应的消息处理器。
var handlers map[HandleType]IMessageHandler

// init 函数用于初始化消息处理器映射。
func init() {
	// 初始化 handlers 变量为一个空的映射
	handlers = make(map[HandleType]IMessageHandler)

	// 初始化文件消息处理器并添加到 handlers 中
	handlers[FileHandler] = FileMessageHandler()

	// 初始化用户消息处理器并添加到 handlers 中
	handlers[UserHandler] = UserMessageHandler()

	// 初始化群组消息处理器并添加到 handlers 中
	handlers[GroupHandler] = GroupMessageHandler()

	// 初始化添加好友消息处理器并添加到 handlers 中
	handlers[FriendAddHandler] = FriendAddMessageHandler()
}

// Handler 函数用于处理消息。
//
// 输入参数：
//   - message: 要处理的消息对象。
//
// 输出参数：
//   - 无。
func Handler(message *wechatbot.Message) {
	dispatcher := wechatbot.NewMessageMatchDispatcher()
	// 文本消息处理
	dispatcher.OnText(func(ctx *wechatbot.MessageContext) {
		// 获取消息对象
		message := ctx.Message

		// 获取消息发送者信息
		sender, err := message.Sender()
		if err != nil {
			message.Bot().Logger().Error("message sender unknown error: %v \n", err)
			return
		}

		// 初始化发送者名称为发送者昵称
		var senderName = sender.NickName

		// 判断是否是自己发送的消息
		if message.IsSendBySelf() {
			sender, err = message.Sender(message.ToUserName)
			if err != nil {
				message.Bot().Logger().Error("message sender unknown error: %v \n", err)
				return
			}
		}

		// 如果消息来自群聊
		if message.IsFromGroup() {
			// 获取群聊发送者信息
			groupSender, err := message.SenderInGroup()
			if err != nil {
				message.Bot().Logger().Error("group message sender unknown error: %v \n", err)
				return
			}

			// 更新发送者名称为发送者昵称 + 群聊发送者昵称
			senderName = sender.NickName + " - " + groupSender.NickName
		}

		// 记录接收到的文本消息及发送者信息
		message.Bot().Logger().Trace("Received %v Text Message : %v", senderName, message.Content)

		// 消息缓存
		storage.SetWechatMessageStorage(sender.NickName, message.Content, senderName)
	})

	// 群消息处理[chatgpt]
	dispatcher.OnGroup(func(ctx *wechatbot.MessageContext) { handlers[GroupHandler].Handle(ctx.Message) })

	// 添加好友消息处理
	dispatcher.OnFriendAdd(func(ctx *wechatbot.MessageContext) { handlers[FriendAddHandler].Handle(ctx.Message) })

	// 文件消息处理
	dispatcher.RegisterHandler(func(message *wechatbot.Message) bool { return message.HasFile() }, func(ctx *wechatbot.MessageContext) { handlers[FileHandler].Handle(ctx.Message) })

	// 私聊消息处理
	dispatcher.RegisterHandler(func(message *wechatbot.Message) bool { return !message.IsSendByGroup() }, func(ctx *wechatbot.MessageContext) { handlers[UserHandler].Handle(ctx.Message) })

	dispatcher.RegisterHandler(func(message *wechatbot.Message) bool { return true }, func(ctx *wechatbot.MessageContext) {
		message.Bot().Logger().Trace("Received Message : %v", ctx.Message)
	})

	dispatcher.Dispatch(message)
}
