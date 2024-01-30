package core

import (
	"context"
	"errors"
	"io"
	"log"
	"net/url"
	"os/exec"
	"runtime"
)

// ================================================= [类型](全局)公开 =================================================

// Bot 是一个聊天机器人的结构体，用于管理聊天机器人的各种功能和回调函数。
type Bot struct {
	err        error           // 错误信息。
	self       *Self           // 自身信息，包含了聊天机器人的基本信息。
	Caller     *Caller         // 调用器，用于发送网络请求。
	cancel     func()          // 取消函数，用于取消协程的执行。
	Storage    *Session        // 会话存储，用于保存登录状态和其他会话相关信息。
	context    context.Context // 上下文，用于控制协程的生命周期。
	Serializer Serializer      // 序列化器，用于对数据进行序列化，默认为json。
	uuid       string          // UUID，用于登录和获取二维码。
	deviceId   string          // 设备ID，用于标识设备。
	loginUUID  string          // 登录UUID，用于登录验证。

	UUIDCallback      func(bot *Bot, uuid string)   // 获取UUID的回调函数，用于处理获取到UUID后的操作。
	ScanCallBack      func(body CheckLoginResponse) // 扫码回调函数，用于获取扫码联系人的头像。
	LoginCallBack     func(body CheckLoginResponse) // 登录回调函数，用于处理登录成功后的操作。
	LogoutCallBack    func(bot *Bot)                // 退出回调函数，用于处理退出登录的操作。
	SyncCheckCallback func(resp SyncCheckResponse)  // 心跳回调函数，用于处理心跳响应后的操作。

	loginOptions     BotLoginOptions  // 登录选项组，包含了登录相关的配置选项。
	hotReloadStorage HotReloadStorage // 热加载存储，用于保存热加载相关信息。

	MessageHandler      MessageHandler      // 获取消息成功的处理函数，用于处理接收到的消息。
	MessageErrorHandler MessageErrorHandler // 获取消息发生错误的处理函数，返回err == nil则尝试继续监听。
}

// ================================================= [函数](全局)私有 =================================================

// _open 在浏览器中打开指定的 URL
func _open(url string) error {
	var (
		cmd  string   // 执行的命令
		args []string // 命令的参数
	)

	switch runtime.GOOS {
	case "windows":
		cmd, args = "cmd", []string{"/c", "start"} // Windows 使用 cmd 命令和 /c start 参数
	case "darwin":
		cmd = "open" // macOS 使用 open 命令
	default:
		// "linux", "freebsd", "openbsd", "netbsd"
		cmd = "xdg-open" // 其他类 Unix-like 操作系统使用 xdg-open 命令
	}

	args = append(args, url) // 将 URL 添加到命令的参数列表中

	return exec.Command(cmd, args...).Start() // 执行打开操作，并返回结果
}

// ================================================= [函数](全局)公开 =================================================

// NewBot 创建一个新的机器人实例(接收外部的 context.Context，用于控制Bot的存活)
func NewBot(c context.Context) *Bot {
	// 创建默认的 Caller 实例
	caller := DefaultCaller()

	// 将 Caller 的模式设置为 web，即网页版微信模式
	caller.WechatClient.SetMode(web)

	caller.WechatClient.SetDomain(Host)

	// 创建一个新的上下文和取消函数
	ctx, cancel := context.WithCancel(c)

	// 返回一个新的 Bot 实例，其中 Caller 为默认的 Caller，Storage 为一个新的 Session 实例，Serializer 为默认的 JsonSerializer，context 和 cancel 分别为新创建的上下文和取消函数
	return &Bot{
		Caller:     caller,
		Storage:    &Session{},
		Serializer: &JsonSerializer{},
		context:    ctx,
		cancel:     cancel,
	}
}

// DefaultBot 默认的Bot的构造方法,
// mode不传入默认为 core.Normal,详情见mode
//
//	bot := core.DefaultBot(core.Desktop)
//
// DefaultBot 创建一个默认的机器人实例
func DefaultBot(prepares ...BotPreparer) *Bot {
	// 创建一个新的机器人实例
	bot := NewBot(context.Background())

	// 设置二维码回调函数为 PrintlnQrcodeUrl，用于打印二维码链接
	bot.UUIDCallback = PrintlnQRCodeUrl

	// 设置扫码回调函数
	bot.ScanCallBack = func(_ CheckLoginResponse) {
		log.Println("扫码成功，请在手机上确认登录")
	}

	// 设置登录回调函数
	bot.LoginCallBack = func(_ CheckLoginResponse) {
		log.Println("登录成功")
	}

	// 设置心跳回调函数，默认行为为打印 SyncCheckResponse 的 RetCode 和 Selector
	bot.SyncCheckCallback = func(resp SyncCheckResponse) {
		log.Printf("RetCode:%s  Selector:%s", resp.RetCode, resp.Selector)
	}

	// 调用传入的 BotPreparer 函数进行额外的准备工作
	for _, prepare := range prepares {
		prepare.Prepare(bot)
	}

	return bot
}

// DefaultBot 创建一个默认的机器人实例
func Default(prepares ...BotPreparer) *Bot {
	return DefaultBot(prepares...)
}

// QRCodeUrl 根据给定的UUID生成二维码链接
func QRCodeUrl(bot *Bot, uuid string) string {
	return bot.Caller.WechatClient.Domain.LoginHost() + qrcodePath + uuid
}

// PrintlnQRCodeUrl 打印二维码链接并在浏览器中打开登录页面
func PrintlnQRCodeUrl(bot *Bot, uuid string) {
	println("访问下面网址扫描二维码登录")

	qrcodeUrl := QRCodeUrl(bot, uuid)

	println(qrcodeUrl)

	// 使用 _open 函数在浏览器中打开登录链接
	_ = _open(qrcodeUrl)
}

// ================================================= [函数](Bot)私有 =================================================

// _dumpTo 将当前机器人的状态信息保存到指定的 Writer 中(注: 写之前最好先清空之前的数据)
func (b *Bot) _dumpTo(writer io.Writer) error {
	jar := b.Caller.WechatClient.GetCookieJar() // 获取机器人所使用的 CookieJar

	item := HotReloadStorageItem{ // 创建一个 HotReloadStorageItem 结构体，用于存储机器人状态信息
		BaseRequest: b.Storage.Request,            // 存储机器人的基本请求信息
		Jar:         FromCookieJar(jar),           // 从 CookieJar 获取所有的 Cookie，并存储到 HotReloadStorageItem 中
		LoginInfo:   b.Storage.LoginInfo,          // 存储机器人登录信息
		Domain:      b.Caller.WechatClient.Domain, // 存储机器人所连接的微信服务器域名
		SyncKey:     b.Storage.Response.SyncKey,   // 存储机器人的 SyncKey
		UUID:        b.uuid,                       // 存储机器人的 UUID
	}

	return b.Serializer.Encode(writer, item) // 将 HotReloadStorageItem 序列化到指定的 Writer 中
}

// _login 通过指定的登录方式进行机器人登录。
func (b *Bot) _login(login BotLogin) (err error) {
	// 获取登录选项组
	options := b.loginOptions

	// 执行准备操作，如设置一些登录前的配置
	options.Prepare(b)

	// 调用登录方式的Login方法进行登录，返回错误信息
	if err = login.Login(b); err != nil {
		// 如果登录失败，调用登录选项组的OnError方法处理错误
		err = options.OnError(b, err)
	}

	// 如果错误不为空，直接返回
	if err != nil {
		return err
	}

	// 调用登录选项组的OnSuccess方法处理登录成功后的操作
	return options.OnSuccess(b)
}

// Init 根据有效凭证获取和初始化联系人信息
func (b *Bot) Init() error {
	req := b.Storage.Request    // 获取存储中的BaseRequest对象
	info := b.Storage.LoginInfo // 获取存储中的LoginInfo对象

	// 调用Caller的WebInit方法进行Web初始化，获取联系人信息和必要参数
	resp, err := b.Caller.Init(b.Context(), req)
	if err != nil {
		return err
	}

	// 设置当前联系人为机器人自己，并格式化表情符号
	b.self = &Self{bot: b, Contact: resp.User}
	b.self.FormatEmoji()
	b.self.self = b.self

	// 初始化联系人列表并加载SyncKey
	resp.ContactList.Init(b.self)
	if b.Storage.Response != nil {
		resp.SyncKey = b.Storage.Response.SyncKey
	}
	b.Storage.Response = resp

	// 如果存在热重载存储，则将当前状态保存至热重载存储
	if b.hotReloadStorage != nil {
		if err = b.DumpHotReloadStorage(); err != nil {
			return err
		}
	}

	// 构建通知手机客户端已登录的参数
	notifyOption := &WechatCallerStatusNotifyOption{
		BaseRequest:       req,
		WebInitResponse:   resp,
		LoginInfoResponse: info,
	}

	// 通知手机客户端已登录
	if err = b.Caller.StatusNotify(b.Context(), notifyOption); err != nil {
		return err
	}

	// 开启协程，轮询检查是否有新消息返回
	go func() {
		if b.MessageErrorHandler == nil {
			b.MessageErrorHandler = DefaultMessageErrorHandler
		}
		for {
			if err = b.SyncCheck(); err != nil {
				// 判断是否继续，如果不继续则退出
				if err = b.MessageErrorHandler(err); err != nil {
					b.ExitWith(err)
					return
				}
			}
		}
	}()

	return nil
}

// SyncCheck[轮询请求] 同步检查是否有消息返回(根据状态码判断是否有新的请求)
func (b *Bot) SyncCheck() error {
	var (
		err  error
		resp *SyncCheckResponse
	)

	syncCheckOption := &WechatCallerSyncCheckOption{}

	// 判断是否存活
	for b.Alive() {
		// 重置相关参数，因为它们可能是动态的
		syncCheckOption.BaseRequest = b.Storage.Request
		syncCheckOption.WebInitResponse = b.Storage.Response
		syncCheckOption.LoginInfoResponse = b.Storage.LoginInfo

		// 长轮询检查是否有消息返回
		resp, err = b.Caller.SyncCheck(b.Context(), syncCheckOption)
		if err != nil {
			return err
		}

		// 执行心跳回调
		if b.SyncCheckCallback != nil {
			b.SyncCheckCallback(*resp)
		}

		// 如果不是正常的状态码返回，发生了错误，直接退出
		if !resp.Success() {
			return resp.Error()
		}

		// TODO 添加更多的状态码处理
		switch resp.Selector {
		case Normal:
			continue
		default:
			messages, err := b._syncMessage()
			if err != nil {
				return err
			}

			// todo 将这个错误处理交给联系人
			_ = b.DumpHotReloadStorage()

			if b.MessageHandler == nil {
				continue
			}

			// 遍历所有消息
			for _, message := range messages {
				message.Init(b)
				// 默认同步调用
				// 如果异步调用则需自行处理
				// 如配合 core.MessageMatchDispatcher 使用
				// NOTE: 请确保 MessageHandler 不会阻塞，否则会导致收不到后续的消息
				b._syncGroups(message)    // 更新群组信息
				b.MessageHandler(message) // 处理消息
			}
		}
	}

	return err
}

// _syncMessage 同步消息
func (b *Bot) _syncMessage() ([]*Message, error) {
	option := WechatCallerSyncOption{
		BaseRequest:       b.Storage.Request,   // 设置基本请求参数
		WebInitResponse:   b.Storage.Response,  // 设置Web初始化响应参数
		LoginInfoResponse: b.Storage.LoginInfo, // 设置登录信息
	}

	// 调用WebWxSync方法获取消息
	resp, err := b.Caller.Sync(b.Context(), &option)
	if err != nil {
		return nil, err
	}

	// 更新SyncKey并且重新存入storage 如获取到的SyncKey为空则不更新
	if resp.SyncKey.Count > 0 {
		b.Storage.Response.SyncKey = resp.SyncKey
	}

	// 返回收到的消息列表
	return resp.AddMsgList, nil
}

// _syncGroups 更新群组信息
func (b *Bot) _syncGroups(message *Message) {
	// 判断是否为群组消息
	if message.IsSendByGroup() {
		// 判断是否为自己发送的消息
		if message.FromUserName == message.bot.self.Contact.UserName {
			return
		}

		// 首先尝试从缓存中查找成员信息，如果不存在则从服务器获取
		contacts, err := message.bot.self.Contacts()
		if err != nil {
			return
		}

		_, exist := contacts.GetByUserName(message.FromUserName)
		if !exist { // 如果成员信息不存在，则从服务器获取
			user := NewContact(message.Owner(), message.FromUserName)
			_ = user.Detail() // 获取成员详细信息

			b.self.contacts = b.self.contacts._append(user) // 将成员添加到成员列表中

			b.self.groups = b.self.contacts.Groups() // 更新群组列表
		}
	}
}

// ================================================= [函数](Bot)公开 =================================================

// Reload 重新加载机器人的状态信息，用于在热重载时恢复机器人的状态
func (b *Bot) Reload() error {
	// 如果热重载存储为空则返回错误
	if b.hotReloadStorage == nil {
		return errors.New("hotReloadStorage is nil")
	}

	var item HotReloadStorageItem // 创建一个 HotReloadStorageItem 结构体，用于存储从热重载存储中读取的机器人状态信息

	if err := b.Serializer.Decode(b.hotReloadStorage, &item); err != nil { // 从热重载存储中读取机器人状态信息，并将其反序列化到 HotReloadStorageItem 结构体中
		return err
	}

	b.uuid = item.UUID // 将反序列化得到的 UUID 设置到机器人中

	b.Caller.WechatClient.Domain = item.Domain   // 将反序列化得到的微信服务器域名设置到机器人所使用的 WechatClient 中
	b.Caller.WechatClient.SetCookieJar(item.Jar) // 将反序列化得到的 CookieJar 设置到机器人所使用的 WechatClient 中

	b.Storage.Request = item.BaseRequest // 将反序列化得到的基本请求信息设置到机器人的 Storage 中
	b.Storage.LoginInfo = item.LoginInfo // 将反序列化得到的登录信息设置到机器人的 Storage 中

	if item.SyncKey != nil { // 如果反序列化得到的 SyncKey 不为空
		if b.Storage.Response == nil { // 并且机器人 Storage 中的 Response 为空
			b.Storage.Response = &WebInitResponse{} // 则创建一个空的 WebInitResponse，用于存储 SyncKey
		}

		b.Storage.Response.SyncKey = item.SyncKey // 将反序列化得到的 SyncKey 设置到机器人 Storage 中的 Response 中
	}

	return nil
}

// Block 阻塞机器人运行直到机器人退出(当消息同步发生了错误或者联系人主动在手机上退出，该方法会立即返回，否则会一直阻塞)
func (b *Bot) Block() error {
	// 如果机器人未登录，则返回错误
	if b.self == nil {
		return errors.New("`Block` must be called after user login")
	}

	<-b.Context().Done() // 等待上下文结束

	return b.CrashReason() // 返回机器人退出原因
}

// Exit 主动退出，让 Block 不在阻塞
func (b *Bot) Exit() {
	b.self = nil // 清空机器人信息

	b.cancel() // 取消上下文

	if b.LogoutCallBack != nil { // 如果设置了退出回调函数，则执行回调
		b.LogoutCallBack(b)
	}
}

// ExitWith 主动退出并且设置退出原因, 可以通过 `CrashReason` 获取退出原因
func (b *Bot) ExitWith(err error) {
	b.err = err // 设置错误信息

	b.Exit() // 退出机器人
}

// CrashReason 获取当前Bot崩溃的原因
func (b *Bot) CrashReason() error {
	return b.err // 返回机器人退出的错误信息
}

// DumpHotReloadStorage 将当前机器人的状态信息保存到热重载存储中
func (b *Bot) DumpHotReloadStorage() error {
	if b.hotReloadStorage == nil { // 检查热重载存储是否为空
		return errors.New("HotReloadStorage can not be nil")
	}

	return b._dumpTo(b.hotReloadStorage) // 将当前机器人状态信息保存到热重载存储中
}

// UUID 返回机器人的 UUID
func (b *Bot) UUID() string {
	return b.uuid // 直接返回机器人的 UUID
}

// Context 返回机器人的上下文对象
func (b *Bot) Context() context.Context {
	return b.context // 直接返回机器人的上下文对象
}

// Alive 判断当前联系人是否正常在线
func (b *Bot) Alive() bool {
	// 检查协程的上下文是否已取消，如果取消则表示机器人已停止运行，返回false
	select {
	case <-b.context.Done():
		return false
	default:
		// 如果上下文未取消，通过判断self字段是否为nil来确定机器人是否登录，返回结果
		return b.self != nil
	}
}

// IsHot 返回机器人是否处于热重载状态
func (b *Bot) IsHot() bool {
	return b.hotReloadStorage != nil // 判断热重载存储是否为空，如果不为空则表示机器人处于热重载状态，返回 true；否则返回 false
}

// CurrentUser 当前登录联系人的信息。
func (b *Bot) CurrentUser() (*Self, error) {
	// 如果机器人未登录，返回错误信息
	if b.self == nil {
		return nil, errors.New("user not login")
	}

	// 如果机器人已登录，返回当前登录联系人的信息
	return b.self, nil
}

// ScanLogin 使用扫码登录方式进行机器人登录。
func (b *Bot) ScanLogin() error {
	// 创建一个ScanLogin类型的实例，包含机器人登录所需的UUID信息
	scanLogin := &ScanLogin{UUID: b.loginUUID}

	// 调用_login方法进行机器人登录，并传入ScanLogin实例作为参数
	return b._login(scanLogin)
}

// HotLogin 使用热登录方式进行机器人登录，可以在单位时间内免重复扫码登录(热登录需要先扫码登录一次才可以进行热登录。)
func (b *Bot) HotLogin(storage HotReloadStorage, opts ...BotLoginOption) error {
	// 创建一个HotLogin类型的实例，包含热登录所需的存储信息
	hotLogin := &HotLogin{storage: storage}

	// 设置登录选项组，如果需要修改默认行为，在opts参数中追加相应的选项
	b.loginOptions = opts

	// 调用_login方法进行机器人登录，并传入HotLogin实例作为参数
	return b._login(hotLogin)
}

// PushLogin 使用免扫码登录方式进行机器人登录(免扫码登录需要先扫码登录一次才可以进行免扫码登录。)
func (b *Bot) PushLogin(storage HotReloadStorage, opts ...BotLoginOption) error {
	// 创建一个PushLogin类型的实例，包含免扫码登录所需的存储信息
	pushLogin := &PushLogin{storage: storage}

	// 设置登录选项组，如果需要修改默认行为，在opts参数中追加相应的选项
	b.loginOptions = opts

	// 调用_login方法进行机器人登录，并传入PushLogin实例作为参数
	return b._login(pushLogin)
}

// LoginFromURL 从URL登录机器人
func (b *Bot) LoginFromURL(path *url.URL) error {
	// 获取登录的基本信息
	info, err := b.Caller.GetLoginInfo(b.Context(), path)
	if err != nil {
		return err
	}

	// 将获取到的LoginInfo存储到storage中
	b.Storage.LoginInfo = info

	// 处理设备ID，如果当前设备ID为空，则生成一个随机的设备ID
	if b.deviceId == "" {
		b.deviceId = RandomDeviceID()
	}

	// 构建BaseRequest对象
	request := &BaseRequest{
		Uin:      info.WxUin, // 设置Uin
		Sid:      info.WxSid, // 设置Sid
		Skey:     info.SKey,  // 设置Skey
		DeviceID: b.deviceId, // 设置设备ID
	}

	// 将构建的BaseRequest存储到storage中以便后续调用
	b.Storage.Request = request

	// 执行webInit方法进行初始化，并返回执行结果
	return b.Init()
}

// Logout 联系人退出
func (b *Bot) Logout() error {
	// 检查机器人是否已登录
	if b.Alive() {
		info := b.Storage.LoginInfo

		// 调用Caller的Logout方法进行联系人退出，并传入登录信息
		if err := b.Caller.Logout(b.Context(), info); err != nil {
			return err
		}

		// 调用ExitWith方法退出机器人，并传入ErrUserLogout错误作为退出原因
		b.ExitWith(Error_Logout)

		return nil
	}

	return errors.New("user not login")
}
