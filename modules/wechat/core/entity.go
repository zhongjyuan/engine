package core

import (
	"errors"
	"fmt"
	"net/url"
)

/*
一些网络返回信息的封装
*/

// ================================================= [函数](BaseRequest)公开 =================================================

// BaseRequest 结构体用于表示基础请求信息。
type BaseRequest struct {
	Uin      int64  // Uin 表示联系人 ID
	Sid      string // Sid 表示会话 ID
	Skey     string // Skey 表示会话密钥
	DeviceID string // DeviceID 表示设备 ID
}

// ================================================= [函数](BaseResponse)公开 =================================================

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

// ================================================= [函数](SyncKeyResponse)公开 =================================================

// SyncKeyResponse 结构体用于表示同步密钥信息。
type SyncKeyResponse struct {
	Count int                        // Count 表示同步密钥的数量
	List  []struct{ Key, Val int64 } // List 是一个包含 Key 和 Val 的结构体切片，用于存储同步密钥的详细信息
}

// ================================================= [函数](LoginInfoResponse)公开 =================================================

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
func (l LoginInfoResponse) Ok() bool {
	return l.Ret == 0
}

// Error 方法用于获取登录错误信息。
//
// 返回值：
//   - error：如果登录信息返回码为 0，即表示没有错误，返回 nil；
//     否则返回一个包含错误信息的错误对象。
func (l LoginInfoResponse) Error() error {
	if l.Ok() {
		return nil
	}
	return errors.New(l.Message)
}

// ================================================= [函数](WebInitResponse)公开 =================================================

// WebInitResponse 结构体用于表示 web 初始化响应信息。
type WebInitResponse struct {
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

// UserDetailItemResponse 结构体用于表示联系人详细信息条目。
type UserDetailItemResponse struct {
	UserName        string // UserName 表示联系人名
	EncryChatRoomId string // EncryChatRoomId 表示加密的聊天室ID
}

// UserDetailItemList 是 UserDetailItemResponse 结构体的切片，用于表示联系人详细信息条目列表。
type UserDetailItemList []UserDetailItemResponse

// NewUserDetailItemList 用于根据成员列表创建联系人详细信息条目列表。
//
// 参数：
//   - contacts：成员列表。
//
// 返回值：
//   - UserDetailItemList：表示联系人详细信息条目列表。
func NewUserDetailItemList(contacts Contacts) UserDetailItemList {
	var list = make(UserDetailItemList, len(contacts)) // 创建与成员列表长度相同的联系人详细信息条目列表

	for index, member := range contacts {
		item := UserDetailItemResponse{UserName: member.UserName, EncryChatRoomId: member.EncryChatRoomId} // 创建联系人详细信息条目

		list[index] = item // 将联系人详细信息条目添加到列表中
	}

	return list // 返回联系人详细信息条目列表
}

// ================================================= [函数](SyncResponse)公开 =================================================

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

// ================================================= [函数](ContactResponse)公开 =================================================

// ContactResponse 结构体包含了 Web 微信联系人响应的数据结构。
type ContactResponse struct {
	MemberCount  int          // 成员数量
	Seq          int64        // 序列号
	BaseResponse BaseResponse // 基本响应信息
	MemberList   []*Contact   // 成员列表
}

// ================================================= [函数](BatchContactResponse)公开 =================================================

// BatchContactResponse 结构体包含了 Web 微信批量联系人响应的数据结构。
type BatchContactResponse struct {
	Count        int          // 联系人数量
	BaseResponse BaseResponse // 基本响应信息
	ContactList  []*Contact   // 联系人列表
}

// ================================================= [函数](CheckLoginResponse)公开 =================================================

// CheckLoginResponse 检查登录状态的响应body
type CheckLoginResponse []byte

// Code 方法用于获取登录响应的状态码。
//
// 返回值：
//   - LoginCode：登录状态码；
//   - error：如果提取状态码失败，返回一个错误对象。
func (c CheckLoginResponse) Code() (LoginCode, error) {
	// 使用正则表达式从响应中提取状态码
	results := regexpStatusCode.FindSubmatch(c)
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
func (c CheckLoginResponse) Avatar() (string, error) {
	// 获取状态码
	code, err := c.Code()
	if err != nil {
		return "", err
	}

	// 如果状态码不为已扫码状态码，则返回空字符串
	if code != Scanned {
		return "", nil
	}

	// 使用正则表达式从响应中提取头像 URL
	results := regexpAvatar.FindSubmatch(c)
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
func (c CheckLoginResponse) RedirectURL() (*url.URL, error) {
	// 获取状态码
	code, err := c.Code()
	if err != nil {
		return nil, err
	}

	// 检查状态码是否为成功状态码
	if code != Success {
		return nil, fmt.Errorf("expect status code %s, but got %s", Success, code)
	}

	// 使用正则表达式从响应中提取重定向 URL
	results := regexpRedirectUri.FindSubmatch(c)
	if len(results) != 2 {
		return nil, errors.New("redirect url does not match")
	}

	// 将字符串形式的 URL 转换为 url.URL 类型
	return url.Parse(string(results[1]))
}

// ================================================= [函数](MessageResponse)公开 =================================================

// MessageResponse 表示消息响应的数据结构。
type MessageResponse struct {
	BaseResponse BaseResponse // 基础响应信息
	LocalID      string       // 本地ID
	MsgId        string       // 消息ID
}

// ================================================= [函数](UploadResponse)公开 =================================================

// UploadResponse 表示上传响应的数据结构。
type UploadResponse struct {
	BaseResponse BaseResponse // 基础响应信息
	MediaId      string       // 媒体ID
}

// ================================================= [函数](PushLoginResponse)公开 =================================================

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
func (p PushLoginResponse) Ok() bool {
	return p.Ret == "0" && p.UUID != ""
}

// Error 方法返回推送登录响应的错误。
//
// 返回值：
//   - error：如果推送登录响应成功，则返回 nil；否则返回包含错误信息的错误对象。
func (p PushLoginResponse) Error() error {
	if p.Ok() {
		return nil
	}

	return errors.New(p.Msg)
}
