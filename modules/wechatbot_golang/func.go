package wechatbot

// UUIDHandler 是一个函数类型，用于处理获取 UUID 的回调函数。
//
// 输入参数：
//   - bot: 一个指向 Bot 结构体的指针，表示要处理的机器人实例。
//   - uuid：表示获取到的 UUID。
type UUIDHandler func(bot *Bot, uuid string)

type AvatarHandler func(bot *Bot, avatar string)

// ScanHandler 是一个函数类型，用于处理扫码登录的回调函数。
//
// 输入参数：
//   - bot: 一个指向 Bot 结构体的指针，表示要处理的机器人实例。
//   - resp：表示 CheckLogin 返回的结果。
type ScanHandler func(bot *Bot, resp CheckLoginResponse)

// LoginHandler 是一个函数类型，用于处理登录成功的回调函数。
//
// 输入参数：
//   - bot: 一个指向 Bot 结构体的指针，表示要处理的机器人实例。
//   - resp：表示 CheckLogin 返回的结果。
type LoginHandler func(bot *Bot, resp CheckLoginResponse)

// SyncCheckHandler 是一个函数类型，用于处理同步检查的回调函数。
//
// 输入参数：
//   - bot: 一个指向 Bot 结构体的指针，表示要处理的机器人实例。
//   - resp：表示 SyncCheck 返回的结果。
type SyncCheckHandler func(bot *Bot, resp SyncCheckResponse)

// HotReloadStorageHandler 是一个函数类型，用于处理热重载存储的回调函数。
//
// 输入参数：
//   - bot: 一个指向 Bot 结构体的指针，表示要处理的机器人实例。
//   - item：表示 HotReloadStorageItem 结构体。
type HotReloadStorageHandler func(bot *Bot, item HotReloadStorageItem)

// UpdateContactHandler 是一个函数类型，用于处理联系人更新的回调函数。
//
// 输入参数：
//   - bot: 一个指向 Bot 结构体的指针，表示要处理的机器人实例。
//   - contacts：表示 Contacts 结构体。
type UpdateContactHandler func(bot *Bot, contacts Contacts)

type UpdateContactDetailHandler func(bot *Bot, contacts Contacts)

// MessageHandler 是一个函数类型，用于处理消息的回调函数。
//
// 输入参数：
//   - message：一个指向 Message 结构体的指针，表示要处理的消息。
type MessageHandler func(message *Message)

// MessageErrorHandler 是处理消息发送、接收等操作中出现的错误的函数类型，该函数接受一个 error 类型的参数，并返回一个 error 类型的值。
//
// 输入参数：
//   - err: 表示发生的错误。
//
// 输出参数：
//   - error: 如果处理错误成功，则返回 nil；否则返回 error 类型的错误信息。
type MessageErrorHandler func(err error) error

// LogoutHandler 是一个函数类型，用于处理登出的回调函数。
//
// 输入参数：
//   - bot：一个指向 Bot 结构体的指针，表示要处理的机器人实例。
type LogoutHandler func(bot *Bot)

// SendMessageHandler 是一个函数类型，定义了发送消息的方法。
type SendMessageHandler func() (*SentMessage, error)
