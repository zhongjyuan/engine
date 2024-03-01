package wechatbot

import (
	"errors"
	"fmt"
	"io"
	"net/url"
	"os"
	"strconv"
)

// BaseRequest 结构体用于表示基础请求信息。
type BaseRequest struct {
	Uin      int64  // Uin 表示联系人 ID
	Sid      string // Sid 表示会话 ID
	Skey     string // Skey 表示会话密钥
	DeviceID string // DeviceID 表示设备 ID
}

// BaseResponse 表示大部分返回对象携带的基本信息。
type BaseResponse struct {
	Ret    Ret    // Ret 表示返回结果的状态，通常为整数值
	ErrMsg string // ErrMsg 表示返回的错误消息，如果操作成功则为空字符串
}

// Ok 用于判断返回结果是否成功。
// 返回值:
//   - bool: 如果返回结果表示成功，则返回 true；否则返回 false。
func (response BaseResponse) Ok() bool {
	return response.Ret == 0
}

// Error 将返回结果转换为错误类型。
// 返回值:
//   - error: 如果返回结果表示失败，则返回对应的错误；否则返回 nil。
func (response BaseResponse) Error() error {
	if response.Ok() {
		return nil
	}

	return errors.New(response.ErrMsg)
}

// SyncKeyResponse 结构体用于表示同步密钥信息。
type SyncKeyResponse struct {
	Count int                        // Count 表示同步密钥的数量
	List  []struct{ Key, Val int64 } // List 是一个包含 Key 和 Val 的结构体切片，用于存储同步密钥的详细信息
}

// LoginInfoResponse 结构体用于表示登录信息。
type LoginInfoResponse struct {
	Ret         int    `xml:"ret"`         // 返回码
	WxUin       int64  `xml:"wxuin"`       // 微信 Uin
	IsGrayScale int    `xml:"isgrayscale"` // 是否开启灰度模式
	Message     string `xml:"message"`     // 返回信息
	SKey        string `xml:"skey"`        // SKey
	WxSid       string `xml:"wxsid"`       // 微信 Sid
	PassTicket  string `xml:"pass_ticket"` // Pass Ticket
}

// Ok 方法用于判断登录信息是否成功。
//
// 返回值：
//   - bool：如果返回码为 0，即表示登录成功，返回 true；否则返回 false。
func (response LoginInfoResponse) Ok() bool {
	return response.Ret == 0
}

// Error 方法用于获取登录错误信息。
//
// 返回值：
//   - error：如果登录信息返回码为 0，即表示没有错误，返回 nil；
//     否则返回一个包含错误信息的错误对象。
func (response LoginInfoResponse) Error() error {
	if response.Ok() {
		return nil
	}
	return errors.New(response.Message)
}

// InitResponse 结构体用于表示 web 初始化响应信息。
type InitResponse struct {
	Count               int                           // Count 表示某个计数值
	ClientVersion       int                           // ClientVersion 表示客户端版本号
	GrayScale           int                           // GrayScale 表示灰度值
	InviteStartCount    int                           // InviteStartCount 表示邀请开始计数
	MPSubscribeMsgCount int                           // MPSubscribeMsgCount 表示订阅消息计数
	ClickReportInterval int                           // ClickReportInterval 表示点击报告间隔
	SystemTime          int64                         // SystemTime 表示系统时间
	ChatSet             string                        // ChatSet 表示聊天设置
	SKey                string                        // SKey 表示 S 密钥
	BaseResponse        BaseResponse                  // BaseResponse 表示基础响应信息
	SyncKey             *SyncKeyResponse              // SyncKey 表示同步密钥信息指针
	User                *Contact                      // Contact 表示联系人信息指针
	ContactList         Contacts                      // ContactList 表示成员列表
	MPSubscribeMsgList  []*MPSubscribeMessageResponse // MPSubscribeMsgList 表示订阅消息列表指针
}

// MPSubscribeMessageResponse 结构体用于表示订阅号消息信息。
type MPSubscribeMessageResponse struct {
	MPArticleCount int                  // MPArticleCount 表示订阅号文章数量
	Time           int64                // Time 表示时间戳
	UserName       string               // UserName 表示联系人名称
	NickName       string               // NickName 表示联系人昵称
	MPArticleList  []*MPArticleResponse // MPArticleList 表示订阅号文章列表指针
}

// MPArticleResponse 结构体用于表示订阅号文章信息。
type MPArticleResponse struct {
	Title  string // Title 表示文章标题
	Cover  string // Cover 表示文章封面图片链接
	Digest string // Digest 表示文章摘要
	Url    string // Url 表示文章链接
}

// CallerBaseRequest 是调用者的常用选项结构体。
type CallerBaseRequest struct {
	BaseRequest       *BaseRequest       // 基本请求信息
	InitResponse      *InitResponse      // Web 初始化响应
	LoginInfoResponse *LoginInfoResponse // 登录信息
}

// ContactDetailItemResponse 结构体用于表示联系人详细信息条目。
type ContactDetailItemResponse struct {
	UserName        string // UserName 表示联系人名
	EncryChatRoomId string // EncryChatRoomId 表示加密的聊天室ID
}

// SyncResponse 结构体包含了 Web 微信同步响应的数据结构。
type SyncResponse struct {
	AddMsgCount            int              // 新消息数量
	ContinueFlag           int              // 是否继续同步标志，0表示不再同步
	DelContactCount        int              // 删除联系人数量
	ModChatRoomMemberCount int              // 修改群成员数量
	ModContactCount        int              // 修改联系人数量
	Skey                   string           // 登录状态会话密钥
	SyncKey                *SyncKeyResponse // 同步键
	SyncCheckKey           SyncKeyResponse  // 同步检查键
	AddMsgList             []*Message       // 新消息列表
	BaseResponse           BaseResponse     // 基本响应信息
	ModChatRoomMemberList  Contacts         // 修改群成员列表
}

// ContactResponse 结构体包含了 Web 微信联系人响应的数据结构。
type ContactResponse struct {
	MemberCount  int          // 成员数量
	Seq          int64        // 序列号
	BaseResponse BaseResponse // 基本响应信息
	MemberList   []*Contact   // 成员列表
}

// BatchContactResponse 结构体包含了 Web 微信批量联系人响应的数据结构。
type BatchContactResponse struct {
	Count        int          // 联系人数量
	BaseResponse BaseResponse // 基本响应信息
	ContactList  []*Contact   // 联系人列表
}

// CheckLoginResponse 检查登录状态的响应body
type CheckLoginResponse []byte

// Code 方法用于获取登录响应的状态码。
//
// 返回值：
//   - LoginCode：登录状态码；
//   - error：如果提取状态码失败，返回一个错误对象。
func (response CheckLoginResponse) Code() (LoginCode, error) {
	// 使用正则表达式从响应中提取状态码
	results := RegexpStatusCode.FindSubmatch(response)
	if len(results) != 2 {
		return "", errors.New("error status code match")
	}

	// 将字符串形式的状态码转换为 LoginCode 类型
	code := string(results[1])

	return LoginCode(code), nil
}

// Avatar 方法返回检查登录响应的头像 URL。(base64编码)
//
// 返回值：
//   - string：头像 URL；
//   - error：如果提取头像 URL 失败或未扫码登录，则返回一个错误对象。
func (response CheckLoginResponse) Avatar() (string, error) {
	// 获取状态码
	code, err := response.Code()
	if err != nil {
		return "", err
	}

	// 如果状态码不为已扫码状态码，则返回空字符串
	if code != Scanned {
		return "", nil
	}

	// 使用正则表达式从响应中提取头像 URL
	results := RegexpAvatar.FindSubmatch(response)
	if len(results) != 2 {
		return "", errors.New("avatar does not match")
	}

	// 返回字符串形式的头像 URL
	return string(results[1]), nil
}

// RedirectURL 方法返回检查登录响应的重定向 URL。
//
// 返回值：
//   - *url.URL：重定向 URL 对象；
//   - error：如果提取 URL 失败，返回一个错误对象。
func (response CheckLoginResponse) RedirectURL() (*url.URL, error) {
	// 获取状态码
	code, err := response.Code()
	if err != nil {
		return nil, err
	}

	// 检查状态码是否为成功状态码
	if code != Success {
		return nil, fmt.Errorf("expect status code %s, but got %s", Success, code)
	}

	// 使用正则表达式从响应中提取重定向 URL
	results := RegexpRedirectUri.FindSubmatch(response)
	if len(results) != 2 {
		return nil, errors.New("redirect url does not match")
	}

	// 将字符串形式的 URL 转换为 url.URL 类型
	return url.Parse(string(results[1]))
}

// SyncCheckResponse 表示同步检查响应的结构体
type SyncCheckResponse struct {
	RetCode  string   // 返回码
	Selector Selector // 选择器
}

// ================================================= [函数](全局)公开 =================================================

// NewSyncCheckResponse 从字节切片中解析出 SyncCheckResponse 对象。
//
// 输入参数：
//   - b []byte: 包含同步检查响应数据的字节切片。
//
// 输出参数：
//   - *SyncCheckResponse: 成功解析出的 SyncCheckResponse 对象指针。
//   - error: 如果解析过程中出现错误，则返回相应的错误信息；否则返回 nil。
func NewSyncCheckResponse(b []byte) (*SyncCheckResponse, error) {
	// 使用正则表达式解析字节切片
	results := RegexpSyncCheck.FindSubmatch(b)
	if len(results) != 3 {
		return nil, errors.New("parse sync key failed")
	}

	// 将结果解析为字符串和 Selector 枚举类型
	retCode, selector := string(results[1]), Selector(results[2])

	// 创建 SyncCheckResponse 对象
	syncCheckResponse := &SyncCheckResponse{RetCode: retCode, Selector: selector}

	return syncCheckResponse, nil
}

// ================================================= [函数](SyncCheckResponse)公开 =================================================
// Success 方法用于判断 SyncCheckResponse 是否成功。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果 SyncCheckResponse 成功，则返回 true；否则返回 false。
func (response SyncCheckResponse) Success() bool {
	return response.RetCode == "0"
}

// Error 方法用于获取 SyncCheckResponse 的错误信息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - error: 如果 SyncCheckResponse 成功，则返回 nil；否则返回相应的错误信息。
func (response SyncCheckResponse) Error() error {
	if response.Success() {
		return nil
	}

	i, err := strconv.Atoi(response.RetCode)
	if err != nil {
		return errors.New("sync check unknown error")
	}

	return Ret(i)
}

// Normal 方法用于判断 SyncCheckResponse 是否为普通消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果 SyncCheckResponse 是普通消息，则返回 true；否则返回 false。
func (response SyncCheckResponse) Normal() bool {
	return response.Success() && response.Selector == Selector_NORMAL
}

// NewMessage 方法用于判断 SyncCheckResponse 是否为新消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果 SyncCheckResponse 是新消息，则返回 true；否则返回 false。
func (response SyncCheckResponse) NewMessage() bool {
	return response.Success() && response.Selector == Selector_NEW_MSG
}

// ModContact 方法用于判断 SyncCheckResponse 是否为修改联系人事件。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果 SyncCheckResponse 是修改联系人事件，则返回 true；否则返回 false。
func (response SyncCheckResponse) ModContact() bool {
	return response.Success() && response.Selector == Selector_MOD_CONTACT
}

// AddOrDelContact 方法用于判断 SyncCheckResponse 是否为添加或删除联系人事件。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果 SyncCheckResponse 是添加或删除联系人事件，则返回 true；否则返回 false。
func (response SyncCheckResponse) AddOrDelContact() bool {
	return response.Success() && response.Selector == Selector_ADD_OR_DEL_CONTACT
}

// EnterOrLeaveChat 方法用于判断 SyncCheckResponse 是否为进入或离开聊天事件。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果 SyncCheckResponse 是进入或离开聊天事件，则返回 true；否则返回 false。
func (response SyncCheckResponse) EnterOrLeaveChat() bool {
	return response.Success() && response.Selector == Selector_ENTER_OR_LEAVE_CHAT
}

// ClientBaseRequest 结构体用于存储客户端通用的选项信息。
type ClientBaseRequest struct {
	BaseRequest       *BaseRequest       // 基本请求的指针。
	InitResponse      *InitResponse      // 网页初始化响应的指针。
	LoginInfoResponse *LoginInfoResponse // 登录信息的指针。
}

// MessageResponse 表示消息响应的数据结构。
type MessageResponse struct {
	BaseResponse BaseResponse // 基础响应信息
	LocalID      string       // 本地ID
	MsgId        string       // 消息ID
}

// UploadResponse 表示上传响应的数据结构。
type UploadResponse struct {
	BaseResponse BaseResponse // 基础响应信息
	MediaId      string       // 媒体ID
}

// PushLoginResponse 表示推送登录响应的数据结构。
type PushLoginResponse struct {
	Ret  string `json:"ret"`  // 返回码
	Msg  string `json:"msg"`  // 返回信息
	UUID string `json:"uuid"` // UUID
}

// Ok 方法检查推送登录响应是否成功。
//
// 返回值：
//   - bool：如果返回码为 "0"，且 UUID 不为空，则返回 true；否则返回 false。
func (response PushLoginResponse) Ok() bool {
	return response.Ret == "0" && response.UUID != ""
}

// Error 方法返回推送登录响应的错误。
//
// 返回值：
//   - error：如果推送登录响应成功，则返回 nil；否则返回包含错误信息的错误对象。
func (response PushLoginResponse) Error() error {
	if response.Ok() {
		return nil
	}

	return errors.New(response.Msg)
}

// CallerStatusNotifyRequest 是调用者的 StatusNotify 选项结构体。
type CallerStatusNotifyRequest CallerBaseRequest

type ClientStatusNotifyRequest ClientBaseRequest

// CallerStatusToReadRequest 是将消息标记为已读的选项。
type CallerStatusToReadRequest struct {
	Message           *Message           // 消息
	BaseRequest       *BaseRequest       // 基本请求
	LoginInfoResponse *LoginInfoResponse // 登录信息
}

type ClientStatusToReadRequest struct {
	Message           *Message
	BaseRequest       *BaseRequest
	LoginInfoResponse *LoginInfoResponse
}

// CallerSyncCheckRequest 是调用者的 SyncCheck 选项结构体。
type CallerSyncCheckRequest CallerBaseRequest

type ClientSyncCheckRequest ClientBaseRequest

// CallerSyncRequest 类型是 CallerBaseRequest 的别名，用于指定 Web 微信同步的选项。
type CallerSyncRequest CallerBaseRequest

type ClientSyncRequest ClientBaseRequest

// CallerUploadRequest 类型用于指定上传媒体文件的选项。
type CallerUploadRequest struct {
	ToUserName        string             // 接收方联系人名
	FromUserName      string             // 发送方联系人名
	File              *os.File           // 要上传的文件
	BaseRequest       *BaseRequest       // 基本请求信息
	LoginInfoResponse *LoginInfoResponse // 登录信息
}

type ClientUploadChunkRequest struct {
	FromUserName      string
	ToUserName        string
	File              *os.File
	BaseRequest       *BaseRequest
	LoginInfoResponse *LoginInfoResponse
}

type ClientUploadCheckRequest struct {
	Stat         os.FileInfo
	BaseRequest  *BaseRequest
	FileMD5      string
	FromUserName string
	ToUserName   string
}

// CallerOplogRequest 类型用于指定 Web 微信操作日志的选项。
type CallerOplogRequest struct {
	BaseRequest *BaseRequest // 基本请求信息
	RemarkName  string       // 备注名称
	ToUserName  string       // 目标联系人名称
}
type ClientOplogRequest struct {
	UserName    string
	RemarkName  string
	BaseRequest *BaseRequest
}

// CallerRelationRequest 是设置联系人是否置顶的选项。
type CallerRelationRequest struct {
	BaseRequest *BaseRequest // 基本请求
	Contact     *Contact     // 联系人信息
	Op          uint8        // 操作类型
}

type ClientRelationRequest struct {
	BaseRequest *BaseRequest
	Op          uint8
	UserName    string
	RemarkName  string
}

// CallerVerifyUserRequest 是验证联系人的选项。
type CallerVerifyUserRequest struct {
	BaseRequest       *BaseRequest       // 基本请求
	LoginInfoResponse *LoginInfoResponse // 登录信息
	VerifyContent     string             // 验证内容
	RecommendInfo     RecommendInfo      // 推荐信息
}

type ClientVerifyUserRequest struct {
	RecommendInfo     RecommendInfo
	VerifyContent     string
	BaseRequest       *BaseRequest
	LoginInfoResponse *LoginInfoResponse
}

// CallerAddContactToChatRoomRequest 是将好友添加到群聊中的选项。
type CallerAddContactToChatRoomRequest struct {
	BaseRequest       *BaseRequest       // 基本请求
	LoginInfoResponse *LoginInfoResponse // 登录信息
	Group             *Group             // 群聊信息
	Friends           []*Friend          // 要添加的好友列表
	GroupLength       int                // 群聊长度
}

type ClientAddContactToChatRoomRequest struct {
	Group             string
	GroupLength       int
	InviteMemberList  []string
	BaseRequest       *BaseRequest
	LoginInfoResponse *LoginInfoResponse
}

// CallerRemoveContactFromChatRoomRequest 是将好友从群聊中移除的选项。
type CallerRemoveContactFromChatRoomRequest struct {
	Group             *Group             // 群聊信息
	Contacts          []*Contact         // 要移除的成员列表
	BaseRequest       *BaseRequest       // 基本请求
	LoginInfoResponse *LoginInfoResponse // 登录信息
}

type ClientRemoveContactFromChatRoomRequest struct {
	Group             string
	DelMemberList     []string
	BaseRequest       *BaseRequest
	LoginInfoResponse *LoginInfoResponse
}

// CallerCreateChatRoomRequest 是创建群聊的选项。
type CallerCreateChatRoomRequest struct {
	Topic             string             // 群聊主题
	Friends           Friends            // 群聊成员
	BaseRequest       *BaseRequest       // 基本请求
	LoginInfoResponse *LoginInfoResponse // 登录信息
}

type ClientCreateChatRoomRequest struct {
	Topic             string
	Friends           []string
	BaseRequest       *BaseRequest
	LoginInfoResponse *LoginInfoResponse
}

// CalleRenameChatRoomRequest 是群组重命名的选项。
type CalleRenameChatRoomRequest struct {
	NewTopic          string             // 新的群聊主题
	Group             *Group             // 需要重命名的群组
	BaseRequest       *BaseRequest       // 基本请求
	LoginInfoResponse *LoginInfoResponse // 登录信息
}

type ClientRenameChatRoomRequest struct {
	NewTopic          string
	Group             string
	BaseRequest       *BaseRequest
	LoginInfoResponse *LoginInfoResponse
}

// CalleSendMessageRequest 类型是用于指定 Web 微信发送消息的选项。
type CalleSendMessageRequest struct {
	Message           *SendMessage       // 要发送的消息
	BaseRequest       *BaseRequest       // 基本请求信息
	LoginInfoResponse *LoginInfoResponse // 登录信息
}

type ClientSendMessageRequest struct {
	Message           *SendMessage
	BaseRequest       *BaseRequest
	LoginInfoResponse *LoginInfoResponse
}

// CalleMediaMessageBaseRequest 结构体包含了上传媒体文件的通用选项。
type CalleMediaMessageBaseRequest struct {
	Reader            io.Reader          // Reader 是一个 io.Reader 对象，用于读取媒体文件的内容。
	BaseRequest       *BaseRequest       // BaseRequest 是一个 *BaseRequest 对象指针，包含了请求的基本信息。
	LoginInfoResponse *LoginInfoResponse // LoginInfo 是一个 *LoginInfo 对象指针，包含了登录信息。
	ToUserName        string             // ToUserName 是收件人的联系人名。
	FromUserName      string             // FromUserName 是发件人的联系人名。
}

// CalleSendImageMessageRequest 结构体是基于 CalleMediaMessageBaseRequest 的选项，用于发送图片消息
type CalleSendImageMessageRequest CalleMediaMessageBaseRequest

// CalleSendVideoMessageRequest 结构体是基于 CalleMediaMessageBaseRequest 的选项，用于发送视频消息
type CalleSendVideoMessageRequest CalleMediaMessageBaseRequest

// CalleSendFileMessageRequest 结构体是基于 CalleMediaMessageBaseRequest 的选项，用于发送文件消息
type CalleSendFileMessageRequest CalleMediaMessageBaseRequest

// CalleSendAppMessageRequest 结构体是基于 CalleSendMessageRequest 的选项，用于发送应用消息
type CalleSendAppMessageRequest CalleSendMessageRequest

// CalleRevokeMessageRequest 结构体是基于 CalleSendMessageRequest 的选项，用于发送应用消息
type CalleRevokeMessageRequest struct {
	Message           *SentMessage       // 要发送的消息
	BaseRequest       *BaseRequest       // 基本请求信息
	LoginInfoResponse *LoginInfoResponse // 登录信息
}

type ClientRevokeMessageRequest struct {
	Message           *SentMessage       // 要发送的消息
	BaseRequest       *BaseRequest       // 基本请求信息
	LoginInfoResponse *LoginInfoResponse // 登录信息
}
