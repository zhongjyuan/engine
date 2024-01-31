package core

import (
	"regexp"
)

const (
	AppId           = "wx782c26e4c19acffb" // 微信 App ID
	AppMessageMode  = 6                    // 微信应用消息类型
	AppMessageAppId = "wxeb7ec651dd0aefa9" // 微信应用消息 App ID

	FileHelper = "filehelper" //  文件传输助手

	ContentTypeJson  = "application/json; charset=utf-8" // JSON 内容类型
	UOSClientVersion = "2.0.0"                           // UOS Patch 客户端版本
	UOSExtspam       = "Go8FCIkFEokFCggwMDAwMDAwMRAGGvAESySibk50w5Wb3uTl2c2h64jVVrV7gNs06GFlWplHQbY/5FfiO++1yH4ykC" +
		"yNPWKXmco+wfQzK5R98D3so7rJ5LmGFvBLjGceleySrc3SOf2Pc1gVehzJgODeS0lDL3/I/0S2SSE98YgKleq6Uqx6ndTy9yaL9qFxJL7eiA/R" +
		"3SEfTaW1SBoSITIu+EEkXff+Pv8NHOk7N57rcGk1w0ZzRrQDkXTOXFN2iHYIzAAZPIOY45Lsh+A4slpgnDiaOvRtlQYCt97nmPLuTipOJ8Qc5p" +
		"M7ZsOsAPPrCQL7nK0I7aPrFDF0q4ziUUKettzW8MrAaiVfmbD1/VkmLNVqqZVvBCtRblXb5FHmtS8FxnqCzYP4WFvz3T0TcrOqwLX1M/DQvcHa" +
		"GGw0B0y4bZMs7lVScGBFxMj3vbFi2SRKbKhaitxHfYHAOAa0X7/MSS0RNAjdwoyGHeOepXOKY+h3iHeqCvgOH6LOifdHf/1aaZNwSkGotYnYSc" +
		"W8Yx63LnSwba7+hESrtPa/huRmB9KWvMCKbDThL/nne14hnL277EDCSocPu3rOSYjuB9gKSOdVmWsj9Dxb/iZIe+S6AiG29Esm+/eUacSba0k8" +
		"wn5HhHg9d4tIcixrxveflc8vi2/wNQGVFNsGO6tB5WF0xf/plngOvQ1/ivGV/C1Qpdhzznh0ExAVJ6dwzNg7qIEBaw+BzTJTUuRcPk92Sn6QDn" +
		"2Pu3mpONaEumacjW4w6ipPnPw+g2TfywJjeEcpSZaP4Q3YV5HG8D6UjWA4GSkBKculWpdCMadx0usMomsSS/74QgpYqcPkmamB4nVv1JxczYIT" +
		"IqItIKjD35IGKAUwAA==" // UOS Patch 扩展垃圾邮件

	UOSUserAgent = "Mozilla/5.0 (Linux; U; UOS x86_64; zh-cn) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 UOSBrowser/6.0.1.1001"
	TimeFormat   = "Mon Jan 02 2006 15:04:05 GMT+0800 (中国标准时间)"
	Host         = "wx.qq.com"
)

// Regexp
var (
	regexpUUID        = regexp.MustCompile(`uuid = "(.*?)";`)                                       // 用于匹配 uuid 的正则表达式
	regexpAvatar      = regexp.MustCompile(`window.userAvatar = '(.*)';`)                           // 用于匹配联系人头像的正则表达式
	regexpStatusCode  = regexp.MustCompile(`window.code=(\d+);`)                                    // 用于匹配状态码的正则表达式
	regexpSyncCheck   = regexp.MustCompile(`window.synccheck=\{retcode:"(\d+)",selector:"(\d+)"\}`) // 用于匹配 syncCheckPath 返回结果的正则表达式
	regexpRedirectUri = regexp.MustCompile(`window.redirect_uri="(.*?)"`)                           // 用于匹配重定向 URI 的正则表达式
	regexpEmoji       = regexp.MustCompile(`<span class="emoji emoji(.*?)"></span>`)                // 用于匹配表情符号的正则表达式
)

// MessageType 以Go惯用形式定义了PC微信所有的官方消息类型。
type MessageType int

// https://res.wx.qq.com/a/wx_fed/webwx/res/static/js/index_c7d281c.js
// MessageType
const (
	MessageText           MessageType = 1     // 文本消息
	MessageHtml           MessageType = 2     // 富文本消息
	MessageImage          MessageType = 3     // 图片消息
	MessagePrivateText    MessageType = 11    // 私人文本消息
	MessagePrivateHtml    MessageType = 12    // 私人富文本消息
	MessagePrivateImage   MessageType = 13    // 私人图片消息
	MessageVoice          MessageType = 34    // 语音消息
	MessageEmail          MessageType = 35    // 邮件消息
	MessageQQ             MessageType = 36    // QQ消息
	MessageVerify         MessageType = 37    // 认证消息
	MessageSystem         MessageType = 38    // 系统消息
	MessageQQImage        MessageType = 39    // AA图片消息
	MessagePossibleFriend MessageType = 40    // 好友推荐消息
	MessageShareCard      MessageType = 42    // 名片消息
	MessageVideo          MessageType = 43    // 视频消息
	MessageVideoExport    MessageType = 44    // 视频导出消息
	MessageEmoticon       MessageType = 47    // 表情消息
	MessageLocation       MessageType = 48    // 地理位置消息
	MessageApp            MessageType = 49    // APP消息
	MessageVoip           MessageType = 50    // VOIP消息
	MessageStatusNotify   MessageType = 51    // 状态通知消息
	MessageVoipNotify     MessageType = 52    // VOIP通知消息
	MessageVoipInvite     MessageType = 53    // VOIP邀请
	MessageMicroVideo     MessageType = 62    // 小视频消息
	MessageSys            MessageType = 10000 // 系统消息
	MessageRecalled       MessageType = 10002 // 消息撤回
)

// AppMessageType 以Go惯用形式定义了PC微信所有的官方App消息类型。
type AppMessageType int

// AppMessageType
const (
	AppMessageText         AppMessageType = 1      // 文本消息
	AppMessageImage        AppMessageType = 2      // 图片消息
	AppMessageVoice        AppMessageType = 3      // 语音消息
	AppMessageVideo        AppMessageType = 4      // 视频消息
	AppMessageUrl          AppMessageType = 5      // 文章消息
	AppMessageAttach       AppMessageType = 6      // 附件消息
	AppMessageOpen         AppMessageType = 7      // Open
	AppMessageEmoji        AppMessageType = 8      // 表情消息
	AppMessageVoiceRemind  AppMessageType = 9      // VoiceRemind
	AppMessageScanGood     AppMessageType = 10     // ScanGood
	AppMessageGood         AppMessageType = 13     // Good
	AppMessageEmotion      AppMessageType = 15     // Emotion
	AppMessageCardTicket   AppMessageType = 16     // 名片消息
	AppMessageLocation     AppMessageType = 17     // 地理位置消息
	AppMessageTransfers    AppMessageType = 2000   // 转账消息
	AppMessageRedEnvelopes AppMessageType = 2001   // 红包消息
	AppMessageReaderType   AppMessageType = 100001 //自定义的消息
)

// Search
const (
	// SearchAll 跟search函数搭配
	//
	//	friends.Search(core.SearchAll, )
	SearchAll = 0
)

// Sex
const (
	SexMALE   = 1 // SexMALE 表示男性。
	SexFEMALE = 2 // SexFEMALE 表示女性。
)

// Upload
const (
	UploadChunkSize          int64 = (1 << 20) / 2 // 表示分块上传时每次上传的文件的大小，单位为字节。(0.5m)
	UploadNeedCheckSize      int64 = 25 << 20      // 表示需要检测的文件大小，单位为字节。(20m)
	UploadMaxFileUploadSize  int64 = 50 << 20      // 表示最大文件上传大小，单位为字节。(50m)
	UploadMaxImageUploadSize int64 = 20 << 20      // 表示最大图片上传大小，单位为字节。(20m)
)

// 定义了一个字符串集合，用于表示支持的图片类型。
var ImageTypeMap = map[string]struct{}{
	"bmp":  {},
	"png":  {},
	"jpeg": {},
	"jpg":  {},
}

// 定义三个常量，分别表示不同类型的文件。
const (
	PictureType  = "pic"   // 图片文件类型
	DocumentType = "doc"   // 文档文件类型
	VideoType    = "video" // 视频文件类型

	VideoExtension = "mp4" // 视频文件拓展名
)

// Ret 表示返回结果的类型
type Ret int

// 定义常量
const (
	LogicError              Ret = -2   // 逻辑错误
	SysError                Ret = -1   // 系统错误
	TicketError             Ret = -14  // 票据错误
	ParamError              Ret = 1    // 参数错误
	LoginFailedWarn         Ret = 1100 // 登录失败警告
	LoginCheckFailedWarn    Ret = 1101 // 登录失败检查
	CookieInvalidWarn       Ret = 1102 // Cookie 无效
	LoginEnvAbnormalityWarn Ret = 1203 // 登录环境异常
	OptTooOftenWarn         Ret = 1205 // 操作太频繁
)
