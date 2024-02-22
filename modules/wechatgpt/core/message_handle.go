package core

import (
	"errors"
	"strings"
)

// ================================================= [类型](全局)公开 =================================================

// MessageContext 包含了消息处理的上下文信息。
type MessageContext struct {
	index      int                   // index 表示当前处理的消息处理函数索引
	abortIndex int                   // abortIndex 表示中止处理的消息处理函数索引
	*Message                         // 包含了 Message 结构体的所有字段
	handlers   MessageContextHandles // handlers 存储了消息处理函数的切片
}

// MessageContextHandler 是一个函数类型，用于处理消息上下文的回调函数。
//
// 参数：
//   - ctx：一个指向 MessageContext 结构体的指针，表示要处理的消息上下文。
type MessageContextHandler func(mctx *MessageContext)

// MessageContextHandles 是一个 MessageContextHandler 函数类型的切片，用于存储消息上下文处理函数。
type MessageContextHandles []MessageContextHandler

// MessageDispatcher 是一个接口类型，用于消息的分发。
type MessageDispatcher interface {
	// Dispatch 方法用于分发消息。
	//
	// 参数：
	//   - msg：一个指向 Message 结构体的指针，表示要分发的消息。
	Dispatch(message *Message)
}

// MessageMatch 是一个类型定义，表示用于匹配消息的函数。
//
// 参数：
//   - Message：一个指向 Message 结构体的指针，表示待匹配的消息。
//
// 返回值：
//   - bool：表示是否匹配成功，true 表示匹配成功，false 表示匹配失败。
type MessageMatch func(*Message) bool

// MessageMatchNode 是一个结构体，表示匹配节点。
//
// 字段：
//   - matchFunc：MatchFunc 类型字段，表示匹配函数。
//   - group：MessageContextHandlerGroup 类型字段，表示消息处理函数组。
type MessageMatchNode struct {
	match    MessageMatch
	handlers MessageContextHandles
}

// MessageMatchNodes 是一个类型定义，表示匹配节点列表。
//
// 类型定义：
//   - *matchNode：表示指向 MessageMatchNode 结构体的指针类型。
type MessageMatchNodes []*MessageMatchNode

// MessageMatchDispatcher impl MessageDispatcher interface
//
//	dispatcher := NewMessageMatchDispatcher()
//	dispatcher.OnText(func(message *Message){
//			message.ReplyText("hello")
//	})
//	bot := DefaultBot()
//	bot.MessageHandler = DispatchMessage(dispatcher)
//
// MessageMatchDispatcher 是一个结构体，表示消息匹配调度器。
//
// 字段：
//   - async：bool 类型字段，表示是否异步处理消息。
//   - matchNodes：matchNodes 类型字段，表示匹配节点列表。
type MessageMatchDispatcher struct {
	async      bool
	matchNodes MessageMatchNodes
}

// MessageMatchSender 是一个判断消息发送者是否匹配的函数类型。
//
// 入参：
//   - contact：表示要判断的联系人对象。
//
// 返回值：
//   - bool：表示联系人是否匹配。
type MessageMatchSender func(contact *Contact) bool

// ================================================= [函数](全局)公开 =================================================

// NewMessageMatchDispatcher 是一个函数，用于创建一个新的消息匹配调度器实例。
//
// 返回值：
//   - *MessageMatchDispatcher：表示新创建的消息匹配调度器实例的指针。
func NewMessageMatchDispatcher() *MessageMatchDispatcher {
	return &MessageMatchDispatcher{} // 返回一个新的消息匹配调度器实例指针
}

// Matchs 函数用于将多个匹配函数组合成一个新的匹配函数。
//
// 参数：
//   - matchs：一个可变长度的 MessageMatch 类型参数，表示需要组合的匹配函数列表。
//
// 返回值：
//   - MatchFunc：表示组合后的匹配函数，对输入的消息同时满足所有匹配函数时返回 true，否则返回 false。
func Matchs(matchs ...MessageMatch) MessageMatch {
	return func(message *Message) bool {

		// 遍历所有匹配函数
		for _, match := range matchs {

			// 如果有任一匹配函数返回 false，则整体返回 false
			if !match(message) {
				return false
			}
		}

		// 所有匹配函数均返回 true，则整体返回 true
		return true
	}
}

// MatchSenders 函数用于生成一个判断消息发送者是否匹配的函数。
//
// 入参：
//   - matchSenders：MessageMatchSender 类型的可变参数，表示要使用的判断函数。
//
// 返回值：
//   - MatchFunc：表示生成的消息发送者匹配函数。
func MatchSenders(matchSenders ...MessageMatchSender) MessageMatch {
	return func(message *Message) bool {

		sender, err := message.Sender()
		if err != nil {
			return false
		}

		for _, matchSender := range matchSenders {
			if !matchSender(sender) {
				return false
			}
		}

		return true
	}
}

// MatchSenderFriendRequired 函数返回一个匹配好友的消息发送者匹配函数。
//
// 返回值：
//   - MatchFunc：用于判断消息发送者是否为好友的匹配函数。
func MatchSenderFriendRequired() MessageMatch {
	return MatchSenders(func(contact *Contact) bool { return contact.IsFriend() })
}

// MatchSenderGroupRequired 函数返回一个匹配群组的消息发送者匹配函数。
//
// 返回值：
//   - MatchFunc：用于判断消息发送者是否为群组的匹配函数。
func MatchSenderGroupRequired() MessageMatch {
	return MatchSenders(func(contact *Contact) bool { return contact.IsGroup() })
}

// MatchSenderMPRequired 函数返回一个匹配公众号的消息发送者匹配函数。
//
// 返回值：
//   - MatchFunc：用于判断消息发送者是否为公众号的匹配函数。
func MatchSenderMPRequired() MessageMatch {
	return MatchSenders(func(contact *Contact) bool { return contact.IsMP() })
}

// MatchSenderNickNameEqual 函数返回一个根据联系人昵称是否等于指定字符串的匹配函数。
//
// 入参：
//   - nickname: 指定的联系人昵称字符串。
//
// 返回值：
//   - MatchFunc：用于判断消息发送者的昵称是否与指定字符串相等的匹配函数。
func MatchSenderNickNameEqual(nickname string) MessageMatch {
	return MatchSenders(func(contact *Contact) bool { return contact.NickName == nickname })
}

// MatchSenderRemarkNameEqual 函数返回一个根据联系人备注名称是否等于指定字符串的匹配函数。
//
// 入参：
//   - remarkName: 指定的联系人备注名称字符串。
//
// 返回值：
//   - MatchFunc：用于判断消息发送者的备注名称是否与指定字符串相等的匹配函数。
func MatchSenderRemarkNameEqual(remarkName string) MessageMatch {
	return MatchSenders(func(contact *Contact) bool { return contact.RemarkName == remarkName })
}

// MatchSenderNickNameContains 函数返回一个根据联系人昵称是否包含指定字符串的匹配函数。
//
// 入参：
//   - nickname: 指定的字符串，用于判断是否包含在联系人昵称中。
//
// 返回值：
//   - MatchFunc：用于判断消息发送者的昵称是否包含指定字符串的匹配函数。
func MatchSenderNickNameContains(nickname string) MessageMatch {
	return MatchSenders(func(contact *Contact) bool { return strings.Contains(contact.NickName, nickname) })
}

// MatchSenderRemakeNameContains 函数返回一个根据联系人备注名称是否包含指定字符串的匹配函数。
//
// 入参：
//   - remakeName: 指定的字符串，用于判断是否包含在联系人备注名称中。
//
// 返回值：
//   - MatchFunc：用于判断消息发送者的备注名称是否包含指定字符串的匹配函数。
func MatchSenderRemakeNameContains(remakeName string) MessageMatch {
	return MatchSenders(func(contact *Contact) bool { return strings.Contains(contact.RemarkName, remakeName) })
}

// DefaultMessageErrorHandler 是默认的消息错误处理函数，用于处理消息发送、接收等操作中出现的错误。
//
// 入参：
//   - err: 错误对象，表示发生的错误。
//
// 返回值：
//   - error：处理后的错误对象，如果需要返回特定的错误，将返回对应的错误值；否则返回nil。
func DefaultMessageErrorHandler(err error) error {
	var ret Ret

	if errors.As(err, &ret) {
		switch ret {
		case LoginCheckFailedWarn, CookieInvalidWarn, LoginFailedWarn:
			return ret
		}
	}

	return nil
}

// ================================================= [函数](MessageContext)公开 =================================================

// Next 方法用于执行下一个消息处理函数。
//
// 参数：
//   - mctx：一个指向 MessageContext 结构体的指针，表示当前的消息上下文。
func (mctx *MessageContext) Next() {
	mctx.index++ // 增加索引，准备执行下一个消息处理函数

	for mctx.index <= len(mctx.handlers) {
		if mctx.IsAbort() {
			return // 如果已中止处理，则直接返回
		}

		Handle := mctx.handlers[mctx.index-1] // 获取当前索引对应的消息处理函数

		Handle(mctx) // 执行消息处理函数

		mctx.index++ // 增加索引，准备执行下一个消息处理函数
	}
}

// Abort 方法用于中止消息处理。(不会调用下一个消息处理函数, 但是不会中断当前的处理函数)
//
// 参数：
//   - mctx：一个指向 MessageContext 结构体的指针，表示当前的消息上下文。
func (mctx *MessageContext) Abort() {
	mctx.abortIndex = mctx.index // 将中止索引设置为当前索引，表示中止消息处理
}

// IsAbort 方法用于判断是否中止消息处理。
//
// 参数：
//   - mctx：一个指向 MessageContext 结构体的指针，表示当前的消息上下文。
//
// 返回值：
//   - bool：表示是否中止消息处理，true 表示已中止，false 表示未中止。
func (mctx *MessageContext) IsAbort() bool {
	return mctx.abortIndex > 0 // 如果 abortIndex 大于 0，则表示已中止消息处理
}

// AbortHandler 方法用于获取中止消息处理的处理函数。
//
// 参数：
//   - mctx：一个指向 MessageContext 结构体的指针，表示当前的消息上下文。
//
// 返回值：
//   - MessageContextHandler：表示中止消息处理的处理函数，如果未中止消息处理，则返回 nil。
func (mctx *MessageContext) AbortHandler() MessageContextHandler {
	// 如果中止索引大于 0，则表示已中止消息处理
	if mctx.abortIndex > 0 {
		return mctx.handlers[mctx.abortIndex-1] // 返回中止索引对应的处理函数
	}

	// 返回 nil 表示未中止消息处理
	return nil
}

// ================================================= [函数](MessageMatchDispatcher)公开 =================================================

// Do 是一个方法，用于执行消息上下文中的下一个处理器。
//
// 参数：
//   - ctx：*MessageContext 类型指针，表示消息上下文。
func (mmd *MessageMatchDispatcher) Do(mctx *MessageContext) {
	mctx.Next() // 执行消息上下文中的下一个处理器
}

// SetAsync 是一个方法，用于设置消息匹配调度器的异步处理标志。
//
// 参数：
//   - async：bool 类型，表示是否异步处理消息。
func (mmd *MessageMatchDispatcher) SetAsync(async bool) {
	mmd.async = async // 设置消息匹配调度器的异步处理标志
}

// Dispatch impl MessageDispatcher
// 遍历 MessageMatchDispatcher 所有的消息处理函数
// 获取所有匹配上的函数
// 执行处理的消息处理方法

// Dispatch 是一个方法，用于将消息分发给相应的处理器。
//
// 参数：
//   - msg：*Message 类型指针，表示要分发的消息。
func (mmd *MessageMatchDispatcher) Dispatch(message *Message) {
	var handlers MessageContextHandles // 定义 MessageContextHandles 变量

	for _, matchNode := range mmd.matchNodes { // 遍历匹配节点列表
		if matchNode.match(message) { // 如果消息匹配当前节点
			handlers = append(handlers, matchNode.handlers...) // 将当前节点的处理器分组添加到 handlers 中
		}
	}

	mctx := &MessageContext{Message: message, handlers: handlers} // 创建一个新的消息上下文实例
	if mmd.async {
		go mmd.Do(mctx) // 异步处理消息
	} else {
		mmd.Do(mctx) // 同步处理消息
	}
}

// AsMessageHandler 方法将 MessageMatchDispatcher 转换为 MessageHandler 类型。
// 转换后的 MessageHandler 可以直接作为消息处理函数使用。
//
// 返回值：
//   - MessageHandler：表示转换后的消息处理函数。
func (mmd *MessageMatchDispatcher) AsMessageHandler() MessageHandler {
	return func(message *Message) {
		mmd.Dispatch(message)
	}
}

// RegisterHandler 是一个方法，用于注册消息处理器。
//
// 参数：
//   - matchFunc：MatchFunc 类型，表示消息匹配函数。
//   - handlers：MessageContextHandler 可变参数，表示消息处理器。
func (mmd *MessageMatchDispatcher) RegisterHandler(match MessageMatch, handlers ...MessageContextHandler) {
	if match == nil { // 如果消息匹配函数为空
		panic("MessageMatch can not be nil") // 抛出异常：MatchFunc 不能为空
	}

	node := &MessageMatchNode{match: match, handlers: handlers} // 创建一个匹配节点

	mmd.matchNodes = append(mmd.matchNodes, node) // 将匹配节点添加到匹配节点列表中
}

// OnText 是一个方法，用于注册文本消息处理器。
//
// 参数：
//   - handlers：MessageContextHandler 可变参数，表示文本消息处理器。
func (mmd *MessageMatchDispatcher) OnText(handlers ...MessageContextHandler) {
	mmd.RegisterHandler(func(message *Message) bool { return message.IsText() }, handlers...) // 注册文本消息处理器
}

// OnImage 是一个方法，用于注册图片消息处理器。
//
// 参数：
//   - handlers：MessageContextHandler 可变参数，表示图片消息处理器。
func (mmd *MessageMatchDispatcher) OnImage(handlers ...MessageContextHandler) {
	mmd.RegisterHandler(func(message *Message) bool { return message.IsPicture() }, handlers...) // 注册图片消息处理器
}

// OnEmoticon 是一个方法，用于注册表情消息处理器。
//
// 参数：
//   - handlers：MessageContextHandler 可变参数，表示表情消息处理器。
func (mmd *MessageMatchDispatcher) OnEmoticon(handlers ...MessageContextHandler) {
	mmd.RegisterHandler(func(message *Message) bool { return message.IsEmoticon() }, handlers...) // 注册表情消息处理器
}

// OnVoice 是一个方法，用于注册语音消息处理器。
//
// 参数：
//   - handlers：MessageContextHandler 可变参数，表示语音消息处理器。
func (mmd *MessageMatchDispatcher) OnVoice(handlers ...MessageContextHandler) {
	mmd.RegisterHandler(func(message *Message) bool { return message.IsVoice() }, handlers...) // 注册语音消息处理器
}

// OnFriendAdd 是一个方法，用于注册好友添加消息处理器。
//
// 参数：
//   - handlers：MessageContextHandler 可变参数，表示好友添加消息处理器。
func (mmd *MessageMatchDispatcher) OnFriendAdd(handlers ...MessageContextHandler) {
	mmd.RegisterHandler(func(message *Message) bool { return message.IsFriendAdd() }, handlers...) // 注册好友添加消息处理器
}

// OnCard 是一个方法，用于注册名片消息处理器。
//
// 参数：
//   - handlers：MessageContextHandler 可变参数，表示名片消息处理器。
func (mmd *MessageMatchDispatcher) OnCard(handlers ...MessageContextHandler) {
	mmd.RegisterHandler(func(message *Message) bool { return message.IsCard() }, handlers...) // 注册名片消息处理器
}

// OnMedia 是一个方法，用于注册多媒体消息处理器。
//
// 参数：
//   - handlers：MessageContextHandler 可变参数，表示多媒体消息处理器。
func (mmd *MessageMatchDispatcher) OnMedia(handlers ...MessageContextHandler) {
	mmd.RegisterHandler(func(message *Message) bool { return message.IsMedia() }, handlers...) // 注册多媒体消息处理器
}

// OnTrickled 方法用于注册当接收到戳一戳消息时的消息处理函数。
//
// 入参：
//   - handlers：MessageContextHandler 类型的可变参数，表示要注册的消息处理函数。
func (mmd *MessageMatchDispatcher) OnTrickled(handlers ...MessageContextHandler) {
	// 注册消息处理函数
	mmd.RegisterHandler(func(message *Message) bool { return message.IsTickled() }, handlers...)
}

// OnRecalled 方法用于注册当接收到消息撤回事件时的消息处理函数。
//
// 入参：
//   - handlers：MessageContextHandler 类型的可变参数，表示要注册的消息处理函数。
func (mmd *MessageMatchDispatcher) OnRecalled(handlers ...MessageContextHandler) {
	// 注册消息处理函数
	mmd.RegisterHandler(func(message *Message) bool { return message.IsRecalled() }, handlers...)
}

// OnFriend 方法用于注册当接收到好友消息时的消息处理函数。
//
// 入参：
//   - handlers：MessageContextHandler 类型的可变参数，表示要注册的消息处理函数。
func (mmd *MessageMatchDispatcher) OnFriend(handlers ...MessageContextHandler) {
	mmd.RegisterHandler(func(message *Message) bool { return message.IsSendByFriend() }, handlers...)
}

// OnGroup 方法用于注册当接收到群组消息时的消息处理函数。
//
// 入参：
//   - handlers：MessageContextHandler 类型的可变参数，表示要注册的消息处理函数。
func (mmd *MessageMatchDispatcher) OnGroup(handlers ...MessageContextHandler) {
	mmd.RegisterHandler(func(message *Message) bool { return message.IsSendByGroup() }, handlers...)
}

// OnUser 方法用于注册当接收到联系人消息时的消息处理函数。
//
// 入参：
//   - f：一个判断联系人是否符合条件的函数，入参为 *Contact，返回值为 bool。
//   - handlers：MessageContextHandler 类型的可变参数，表示要注册的消息处理函数。
func (mmd *MessageMatchDispatcher) OnUser(f func(contact *Contact) bool, handlers ...MessageContextHandler) {
	// 定义匹配函数
	match := func(message *Message) bool {
		sender, err := message.Sender()
		if err != nil {
			return false
		}
		return f(sender)
	}

	// 注册消息处理函数
	mmd.RegisterHandler(match, handlers...)
}

// OnFriendByNickName 方法用于注册当好友昵称匹配时的消息处理函数。
//
// 入参：
//   - nickName：string 类型，表示要匹配的好友昵称。
//   - handlers：MessageContextHandler 类型的可变参数，表示要注册的消息处理函数。
func (mmd *MessageMatchDispatcher) OnFriendByNickName(nickName string, handlers ...MessageContextHandler) {
	// 定义匹配函数
	match := func(message *Message) bool {
		if message.IsSendByFriend() {
			sender, err := message.Sender()
			return err == nil && sender.NickName == nickName
		}
		return false
	}

	// 注册消息处理函数
	mmd.RegisterHandler(match, handlers...)
}

// OnFriendByRemarkName 方法用于注册当接收到好友消息且备注名符合指定条件时的消息处理函数。
//
// 入参：
//   - remarkName：标记名，类型为 string，表示要匹配的好友备注名。
//   - handlers：MessageContextHandler 类型的可变参数，表示要注册的消息处理函数。
func (mmd *MessageMatchDispatcher) OnFriendByRemarkName(remarkName string, handlers ...MessageContextHandler) {
	// 定义判断函数
	match := func(contact *Contact) bool {
		return contact.IsFriend() && contact.RemarkName == remarkName
	}

	// 调用 OnUser 方法注册消息处理函数
	mmd.OnUser(match, handlers...)
}

// OnGroupByGroupName 方法用于注册当接收到群组消息且群昵称符合指定条件时的消息处理函数。
//
// 入参：
//   - groupName：群组名称，类型为 string，表示要匹配的群组名称。
//   - handlers：MessageContextHandler 类型的可变参数，表示要注册的消息处理函数。
func (mmd *MessageMatchDispatcher) OnGroupByGroupName(groupName string, handlers ...MessageContextHandler) {
	// 定义判断函数
	match := func(contact *Contact) bool {
		return contact.IsGroup() && contact.NickName == groupName
	}

	// 调用 OnUser 方法注册消息处理函数
	mmd.OnUser(match, handlers...)
}
