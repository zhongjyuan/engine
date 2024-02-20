package core

import (
	"context"
)

// ================================================= [类型](全局)公开 =================================================

// LoginCode 定义登录状态码
type LoginCode string

const (
	Success LoginCode = "200" // Success 登录成功
	Scanned LoginCode = "201" // Scanned 已扫码
	Timeout LoginCode = "400" // Timeout 登录超时
	Wait    LoginCode = "408" // Wait 等待扫码
)

var (
	Web     = WithMode(web)     // Web 网页版微信模式
	Desktop = WithMode(desktop) // Desktop 桌面微信模式
)

// BotPreparer 是一个接口，用于准备机器人的方法。
type BotPreparer interface {
	// Prepare 方法用于准备机器人。
	//
	// 入参：
	//   - b：指向 Bot 对象的指针。
	Prepare(b *Bot)
}

// BotPreparerHandler 类型是一个函数类型，用于准备 Bot 对象。
//
// 函数签名：func(*Bot)
// 参数：
//   - *Bot：指向 Bot 对象的指针。
type BotPreparerHandler func(*Bot)

// BotLoginOption 是一个接口，用于设置机器人登录的选项。
type BotLoginOption interface {
	// BotPreparer 是 BotLoginOption 接口继承的 BotPreparer 接口。
	BotPreparer

	// OnError 方法处理机器人登录出错的情况。
	//
	// 入参：
	//   - b：指向 Bot 对象的指针。
	//   - err：表示登录出错的错误对象。
	//
	// 返回值：
	//   - error：返回一个错误对象，用于表示处理过程中可能发生的错误。
	OnError(b *Bot, err error) error

	// OnSuccess 方法处理机器人登录成功的情况。
	//
	// 入参：
	//   - b：指向 Bot 对象的指针。
	//
	// 返回值：
	//   - error：返回一个错误对象，用于表示处理过程中可能发生的错误。
	OnSuccess(b *Bot) error
}

// BotLoginOptions 是一个类型别名，表示一组机器人登录选项。
type BotLoginOptions []BotLoginOption

// BaseLoginOption 是一个基础的机器人登录选项。
type BaseLoginOption struct{}

// NothingLoginOption 是一个空的 BotLoginOption，表示不做任何操作
var NothingLoginOption = &BaseLoginOption{}

// RetryLoginOption 在登录失败后进行扫码登录
type RetryLoginOption struct {
	BaseLoginOption // 嵌入基本的BotLoginOption结构体

	MaxRetryCount    int // 最大重试次数
	currentRetryTime int // 当前重试次数
}

// BotLogin 接口定义了登录的方法。
type BotLogin interface {
	// Login 方法用于登录机器人。
	//
	// 入参：
	//   - bot：*Bot 类型，表示要登录的机器人。
	//
	// 返回值：
	//   - error：返回一个 error 类型的值，表示登录过程中可能发生的错误。
	Login(bot *Bot) error
}

// ScanLogin 结构体用于扫码登录机器人。
type ScanLogin struct {
	UUID string // UUID 字段表示扫码登录的唯一标识符。
}

// HotLogin 结构表示热登录功能，包含一个 HotReloadStorage 类型的存储实例。
type HotLogin struct {
	storage HotReloadStorage // 存储实例
}

// PushLogin 结构表示推送登录功能，包含一个 HotReloadStorage 类型的存储实例。
type PushLogin struct {
	storage HotReloadStorage // 存储实例
}

// LoginChecker 结构体用于检查登录状态。
type LoginChecker struct {
	Bot *Bot   // 指向机器人实例的指针
	Tip string // 登录提示信息

	UUIDCallback  func(bot *Bot, uuid string)   // UUID 回调函数
	LoginCallBack func(body CheckLoginResponse) // 登录回调函数
	ScanCallBack  func(body CheckLoginResponse) // 扫码回调函数
}

// ================================================= [函数](全局)公开 =================================================

// NewRetryLoginOption 函数用于创建一个新的 RetryLoginOption 对象。
//
// 返回值：
//   - BotLoginOption：返回一个实现了 BotLoginOption 接口的对象。
func NewRetryLoginOption() BotLoginOption {
	return &RetryLoginOption{MaxRetryCount: 1}
}

// WithMode 函数用于创建一个 BotPreparer 对象，设置 Bot 的模式。
//
// 入参：
//   - mode：Mode 类型，表示要设置的 Bot 模式。
//
// 返回值：
//   - BotPreparer：返回一个实现了 BotPreparer 接口的对象，用于准备 Bot 对象。
func WithMode(mode Mode) BotPreparer {
	return BotPreparerHandler(func(b *Bot) { b.Caller.WechatClient.SetMode(mode) })
}

// WithDomain 函数用于创建一个 BotPreparer 对象，设置 Bot 的域名。
//
// 入参：
//   - domain string：表示要设置的 Bot 域名。
//
// 返回值：
//   - BotPreparer：返回一个实现了 BotPreparer 接口的对象，用于准备 Bot 对象。
func WithDomain(domain string) BotPreparer {
	return BotPreparerHandler(func(b *Bot) { b.Caller.WechatClient.SetDomain(domain) })
}

// WithLogger 函数用于设置日志记录器到 Bot 结构体中。
//
// 输入参数：
//   - l *Logger: 日志记录器指针。
//
// 输出参数：
//   - BotPreparer: 返回一个 BotPreparer 类型，用于设置日志记录器。
func WithLogger(l *Logger) BotPreparer {
	return BotPreparerHandler(func(b *Bot) { b.logger = l })
}

// WithContextOption 函数用于创建一个 BotPreparer 对象，设置 Bot 的上下文。
//
// 入参：
//   - ctx：context.Context 类型，表示要设置的上下文。
//
// 返回值：
//   - BotPreparer：返回一个实现了 BotPreparer 接口的对象，用于准备 Bot 对象。
//
// 注意：
//   - 如果 context 为 nil，会抛出 panic 异常。
func WithContextOption(ctx context.Context) BotPreparer {
	if ctx == nil {
		panic("context is nil")
	}

	return BotPreparerHandler(func(b *Bot) { b.context, b.cancel = context.WithCancel(ctx) })
}

// WithUUIDOption 函数用于创建一个 BotPreparer 对象，设置 Bot 的 UUID。
//
// 入参：
//   - uuid：string 类型，表示要设置的 UUID。
//
// 返回值：
//   - BotPreparer：返回一个实现了 BotPreparer 接口的对象，用于准备 Bot 对象。
func WithUUIDOption(uuid string) BotPreparer {
	return BotPreparerHandler(func(b *Bot) { b.loginUUID = uuid })
}

// WithDeviceID 函数用于创建一个 BotPreparer 对象，设置 Bot 的设备 ID。
//
// 入参：
//   - deviceId：string 类型，表示要设置的设备 ID。
//
// 返回值：
//   - BotPreparer：返回一个实现了 BotPreparer 接口的对象，用于准备 Bot 对象。
func WithDeviceID(deviceId string) BotPreparer {
	return BotPreparerHandler(func(b *Bot) { b.deviceId = deviceId })
}

// Reload 方法用于重新加载机器人实例。
//
// 该方法将传入的 HotReloadStorage 类型实例赋值给机器人实例的 hotReloadStorage 字段，并调用机器人实例的 Reload 方法进行重新加载。
//
// 入参：
//   - bot：*Bot 类型，表示要重新加载的机器人实例。
//   - storage：HotReloadStorage 类型，表示重新加载时使用的存储实例。
//
// 返回值：
//   - error：返回一个 error 类型的值，表示重新加载过程中可能发生的错误。
func Reload(bot *Bot, storage HotReloadStorage) error {
	// 将 HotReloadStorage 实例赋值给机器人实例的 hotReloadStorage 字段
	bot.hotReloadStorage = storage

	// 调用机器人实例的 Reload 方法进行重新加载
	return bot.Reload()
}

// ================================================= [函数](LoginCode)公开 =================================================

// String 方法将登录状态码枚举值转换为对应的字符串。
//
// 入参：
//   - l：登录状态码，类型为 LoginCode。
//
// 返回值：
//   - string：表示登录状态码的字符串。

func (l LoginCode) String() string {
	switch l {
	case Success:
		return "登录成功"
	case Scanned:
		return "已扫码"
	case Timeout:
		return "登录超时"
	case Wait:
		return "等待扫码"
	default:
		return "未知状态"
	}
}

// ================================================= [函数](BotLoginOptions)公开 =================================================

// Prepare 方法用于对机器人进行准备操作。(实现了 BotLoginOption 接口)
//
// 入参：
//   - g：BotOptionGroup 类型，表示一组机器人选项。
//   - bot：*Bot 类型，指向机器人对象的指针。
//
// 无返回值。
func (g BotLoginOptions) Prepare(bot *Bot) {
	for _, option := range g {
		option.Prepare(bot)
	}
}

// OnError 方法用于处理机器人登录过程中出现错误的情况。(实现了 BotLoginOption 接口)
//
// 入参：
//   - g：BotOptionGroup 类型，表示一组机器人选项。
//   - b：*Bot 类型，指向机器人对象的指针。
//   - err：error 类型，表示当前的错误对象。
//
// 返回值：
//   - error：返回一个错误对象，用于表示处理过程中可能发生的错误。
func (g BotLoginOptions) OnError(b *Bot, err error) error {
	// 当有一个 BotLoginOption 的 OnError 返回的 error 等于 nil 时，就会停止执行后续的 BotLoginOption
	for _, option := range g {
		currentErr := option.OnError(b, err)
		if currentErr == nil {
			return nil
		}

		if currentErr != err {
			return currentErr
		}
	}

	return err
}

// OnSuccess 方法用于处理机器人登录过程中成功的情况。(实现了 BotLoginOption 接口)
//
// 入参：
//   - g：BotOptionGroup 类型，表示一组机器人选项。
//   - b：*Bot 类型，指向机器人对象的指针。
//
// 返回值：
//   - error：返回一个错误对象，用于表示处理过程中可能发生的错误。
func (g BotLoginOptions) OnSuccess(b *Bot) error {
	for _, option := range g {
		if err := option.OnSuccess(b); err != nil {
			return err
		}
	}

	return nil
}

// ================================================= [函数](BaseLoginOption)公开 =================================================

// Prepare 方法在机器人登录之前执行准备工作。
//
// 入参：
//   - b：*Bot 类型，指向机器人对象的指针。
func (BaseLoginOption) Prepare(_ *Bot) {}

// OnError 方法用于处理机器人登录过程中出现错误的情况。
//
// 入参：
//   - _：*Bot 类型，指向机器人对象的指针。
//   - err：error 类型，表示当前的错误对象。
//
// 返回值：
//   - error：返回一个错误对象，用于表示处理过程中可能发生的错误。
func (BaseLoginOption) OnError(_ *Bot, err error) error { return err }

// OnSuccess 方法用于处理机器人登录过程中成功的情况。
//
// 入参：
//   - _：*Bot 类型，指向机器人对象的指针。
//
// 返回值：
//   - error：返回一个错误对象，用于表示处理过程中可能发生的错误。
func (BaseLoginOption) OnSuccess(_ *Bot) error { return nil }

// ================================================= [函数](RetryLoginOption)公开 =================================================

// OnError 方法用于处理机器人登录过程中出错的情况。(当登录失败后，会调用此方法进行扫码登录)
//
// 入参：
//   - bot：*Bot 类型，指向机器人对象的指针。
//   - err：error 类型，表示登录过程中可能发生的错误。
//
// 返回值：
//   - error：返回一个错误对象，用于表示处理过程中可能发生的错误。
func (r *RetryLoginOption) OnError(bot *Bot, err error) error {
	// 如果当前重试次数超过最大重试次数
	if r.currentRetryTime >= r.MaxRetryCount {
		return err // 返回错误对象
	}

	// 当前重试次数加1
	r.currentRetryTime++

	// 调用bot的Login方法
	return bot.ScanLogin()
}

// ================================================= [函数](BotPreparerHandler)公开 =================================================

// Prepare 方法用于调用 BotPreparerHandler 函数类型的方法，准备 Bot 对象。
//
// 入参：
//   - b：*Bot 类型，指向要准备的 Bot 对象的指针。
func (handler BotPreparerHandler) Prepare(b *Bot) {
	handler(b)
}

// ================================================= [函数](ScanLogin)公开 =================================================

// Login 方法用于执行扫码登录操作。
//
// 该方法首先检查是否已经设置了 UUID，如果未设置则调用 bot.Caller.GetLoginUUID 方法获取 UUID，并进行登录检查。
//
// 入参：
//   - bot：*Bot 类型，表示要登录的机器人。
//
// 返回值：
//   - error：返回一个 error 类型的值，表示登录过程中可能发生的错误。
func (s *ScanLogin) Login(bot *Bot) error {
	var uuid = s.UUID // 获取结构体中的 UUID 字段

	if uuid == "" { // 如果 UUID 为空
		var err error

		uuid, err = bot.Caller.GetLoginUUID(bot.Context()) // 调用 bot.Caller.GetLoginUUID 方法获取 UUID
		if err != nil {
			return err // 如果获取 UUID 出错则返回该错误
		}
	}

	return s.CheckLogin(bot, uuid) // 调用 checkLogin 方法进行登录检查
}

// CheckLogin 方法用于执行登录检查操作。(方法会一直阻塞，直到联系人扫码登录，或者二维码过期)
//
// 该方法创建一个 LoginChecker 实例，将 bot、uuid 以及登录回调函数等信息传递给实例，并调用其 CheckLogin 方法进行登录检查。
//
// 入参：
//   - bot：*Bot 类型，表示要登录的机器人。
//   - uuid：string 类型，表示扫码登录的唯一标识符。
//
// 返回值：
//   - error：返回一个 error 类型的值，表示登录过程中可能发生的错误。
func (s *ScanLogin) CheckLogin(bot *Bot, uuid string) error {
	// 设置机器人的 UUID 字段
	bot.uuid = uuid

	// 创建 LoginChecker 实例并设置相关信息
	loginChecker := &LoginChecker{
		Bot: bot,
		Tip: "0",

		UUIDCallback:  bot.UUIDCallback,
		LoginCallBack: bot.LoginCallBack,
		ScanCallBack:  bot.ScanCallBack,
	}

	// 调用 CheckLogin 方法进行登录检查
	return loginChecker.CheckLogin()
}

// ================================================= [函数](HotLogin)公开 =================================================

// Login 方法用于执行热登录操作。
//
// 该方法会调用 Reload 方法重新加载机器人实例，然后调用机器人实例的 Init 方法进行初始化。
//
// 入参：
//   - h：*HotLogin 类型，表示要执行登录操作的 HotLogin 实例。
//   - bot：*Bot 类型，表示要执行登录操作的机器人实例。
//
// 返回值：
//   - error：返回一个 error 类型的值，表示登录过程中可能发生的错误。
func (h *HotLogin) Login(bot *Bot) error {
	// 调用 Reload 方法重新加载机器人实例
	if err := Reload(bot, h.storage); err != nil {
		return err
	}

	// 调用机器人实例的 Init 方法进行初始化
	return bot.Init()
}

// ================================================= [函数](PushLogin)公开 =================================================

// Login 方法用于执行推送登录操作。
//
// 该方法会调用 Reload 方法重新加载机器人实例，然后调用机器人实例的 PushLogin 方法进行推送登录，最后调用 checkLogin 方法检查登录状态。
//
// 入参：
//   - p：*PushLogin 类型，表示要执行登录操作的 PushLogin 实例。
//   - bot：*Bot 类型，表示要执行登录操作的机器人实例。
//
// 返回值：
//   - error：返回一个 error 类型的值，表示登录过程中可能发生的错误。
func (p *PushLogin) Login(bot *Bot) error {
	// 调用 Reload 方法重新加载机器人实例
	if err := Reload(bot, p.storage); err != nil {
		return err
	}

	// 调用机器人实例的 PushLogin 方法进行推送登录
	resp, err := bot.Caller.PushLogin(bot.Context(), bot.Storage.LoginInfo.WxUin)
	if err != nil {
		return err
	}

	// 检查返回结果中是否有错误
	if err = resp.Error(); err != nil {
		return err
	}

	// 调用 CheckLogin 方法检查登录状态
	return p.CheckLogin(bot, resp.UUID)
}

// CheckLogin 方法用于检查登录状态。
//
// 该方法会将给定的 UUID 设置为机器人实例的 uuid 字段，并创建一个 LoginChecker 实例进行登录状态检查。
//
// 入参：
//   - p：*PushLogin 类型，表示要执行登录操作的 PushLogin 实例。
//   - bot：*Bot 类型，表示要执行登录操作的机器人实例。
//   - uuid：string 类型，表示登录使用的 UUID。
//
// 返回值：
//   - error：返回一个 error 类型的值，表示登录过程中可能发生的错误。
func (p *PushLogin) CheckLogin(bot *Bot, uuid string) error {
	// 将给定的 UUID 设置为机器人实例的 uuid 字段
	bot.uuid = uuid

	// 创建一个 LoginChecker 实例进行登录状态检查
	loginChecker := &LoginChecker{
		Bot: bot,
		Tip: "1",

		LoginCallBack: bot.LoginCallBack,
	}

	return loginChecker.CheckLogin()
}

// ================================================= [函数](LoginChecker)公开 =================================================

// CheckLogin 方法用于检查登录状态。
//
// 该方法会通过调用机器人实例的 Caller.CheckLogin() 方法，不断发送长轮询请求来检查是否扫码登录。
// 根据返回的登录状态码进行相应的处理，并执行对应的回调函数。
//
// 返回值：
//   - error：返回一个 error 类型的值，表示登录过程中可能发生的错误。
func (checker *LoginChecker) CheckLogin() error {
	// 获取机器人实例的 UUID
	uuid := checker.Bot.UUID()

	// 如果存在 UUID 回调函数，则执行回调函数
	if cb := checker.UUIDCallback; cb != nil {
		cb(checker.Bot, uuid)
	}

	// 初始化登录提示信息
	var tip = checker.Tip
	for {
		// 发送长轮询请求，检查是否扫码登录
		resp, err := checker.Bot.Caller.CheckLogin(checker.Bot.Context(), uuid, tip)
		if err != nil {
			return err
		}

		// 获取登录状态码
		code, err := resp.Code()
		if err != nil {
			return err
		}

		// 根据状态码进行相应的处理
		if tip == "1" {
			tip = "0"
		}

		switch code {
		case Success:
			// 登录成功，执行登录回调函数
			redirectURL, err := resp.RedirectURL()
			if err != nil {
				return err
			}

			checker.Bot.logger.Debug("LoginChecker(CheckLogin) => redirectURL: %v \n", redirectURL)
			if err = checker.Bot.LoginFromURL(redirectURL); err != nil {
				return err
			}

			if cb := checker.LoginCallBack; cb != nil {
				cb(resp)
			}

			return nil
		case Scanned:
			// 扫码成功，执行扫码回调函数
			if cb := checker.ScanCallBack; cb != nil {
				cb(resp)
			}

		case Timeout:
			return Error_LoginTimeout
		case Wait:
			continue
		}
	}
}
