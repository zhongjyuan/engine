package core

import (
	"bytes"
	"context"
	"encoding/json"
	"encoding/xml"
	"errors"
	"fmt"
	"io"
	"net/url"
	"os"
)

// ================================================= [类型](全局)公开 =================================================

// Caller 是一个调用者结构体(上层模块可以直接获取封装后的请求结果)
type Caller struct {
	WechatClient *WechatClient // 客户端对象
}

// WechatCallerCommonOption 是调用者的常用选项结构体。
type WechatCallerCommonOption struct {
	BaseRequest       *BaseRequest       // 基本请求信息
	WebInitResponse   *WebInitResponse   // Web 初始化响应
	LoginInfoResponse *LoginInfoResponse // 登录信息
}

// ResponseParser 响应解析器。
type ResponseParser struct {
	Reader io.Reader // 用于读取响应的 Reader 接口
}

// ================================================= [函数](全局)公开 =================================================

// NewCaller 创建一个调用者对象。
//
// 参数：
//   - client：客户端对象。
//
// 返回值：
//   - *Caller：调用者对象。
func NewCaller(client *WechatClient) *Caller {
	// 创建一个 Caller 对象，将客户端对象作为其属性
	return &Caller{WechatClient: client}
}

// DefaultCaller 返回一个默认的调用者对象。
//
// 返回值：
//   - *Caller：默认的调用者对象。
func DefaultCaller() *Caller {
	// 使用默认的客户端对象创建一个调用者对象并返回
	return NewCaller(DefaultWechatClient())
}

// ReaderToFile 将读取器中的内容保存到文件中。
//
// 参数：
//   - reader：需要保存为文件的读取器。
//
// 返回值：
//   - file：保存内容的文件指针。
//   - callback：关闭和删除临时文件的回调函数。
//   - error：保存过程中的错误（如果有）。
func ReaderToFile(reader io.Reader) (file *os.File, callback func(), err error) {
	var ok bool

	// 检查 reader 是否为 *os.File 类型，如果是则直接返回该文件指针
	if file, ok = reader.(*os.File); ok {
		return file, func() {}, nil
	}

	// 创建一个临时文件
	file, err = os.CreateTemp("", "*")
	if err != nil {
		return nil, nil, err
	}

	// 定义回调函数，用于关闭文件和删除临时文件
	callback = func() {
		_ = file.Close()
		_ = os.Remove(file.Name())
	}

	// 将读取器中的内容拷贝到文件中
	_, err = io.Copy(file, reader)
	if err != nil {
		callback()
		return nil, nil, err
	}

	// 将文件指针位置移动到文件开头
	_, err = file.Seek(0, io.SeekStart)
	if err != nil {
		callback()
		return nil, nil, err
	}

	return file, callback, nil
}

// ================================================= [函数](ResponseParser)公开 =================================================

// Error 方法用于解析服务器返回的错误响应。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - error: 错误信息，如果操作成功则为 nil，否则为具体的错误信息。
func (mpp *ResponseParser) Error() error {
	// 定义变量 item 并解析响应并将结果存储在 item 中
	var item struct{ BaseResponse BaseResponse }
	if err := json.NewDecoder(mpp.Reader).Decode(&item); err != nil {
		return err
	}

	// 检查 BaseResponse 是否成功，如果不成功则返回错误
	if !item.BaseResponse.Ok() {
		return item.BaseResponse.Error()
	}

	return nil
}

// MsgId 方法用于解析服务器返回的消息ID。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - string: 消息ID。
//   - error: 错误信息，如果操作成功则为 nil，否则为具体的错误信息。
func (mpp *ResponseParser) MsgId() (string, error) {
	// 定义变量 messageResponse 并解析响应并将结果存储在 messageResponse 中
	var messageResponse MessageResponse
	if err := json.NewDecoder(mpp.Reader).Decode(&messageResponse); err != nil {
		return "", err
	}

	// 检查 BaseResponse 是否成功，如果不成功则返回错误
	if !messageResponse.BaseResponse.Ok() {
		return "", messageResponse.BaseResponse.Error()
	}

	return messageResponse.MsgId, nil
}

// SentMessage 返回 SentMessage。
//
// 参数：
//   - message：发送的消息。
//
// 返回值：
//   - *SentMessage：包含消息ID和发送的消息。
//   - error：解析过程中的错误（如果有）。
func (mpp *ResponseParser) SentMessage(message *SendMessage) (*SentMessage, error) {
	msgId, err := mpp.MsgId()
	if err != nil {
		return nil, err
	}

	return &SentMessage{MsgId: msgId, SendMessage: message}, nil
}

// ================================================= [函数](Caller)私有 =================================================

// Init 使用调用者对象向服务器发送请求以进行 Web 初始化。
//
// 参数：
//   - ctx：上下文对象，用于控制请求的超时和取消。
//   - request：包含基本请求信息的 `BaseRequest` 对象。
//
// 返回值：
//   - *WebInitResponse：Web 初始化的响应数据。
//   - error：Web 初始化过程中的错误（如果有）。
func (c *Caller) Init(ctx context.Context, request *BaseRequest) (*WebInitResponse, error) {
	// 向服务器发送 Web 初始化请求，并接收响应
	res, err := c.WechatClient.Init(ctx, request)
	if err != nil {
		return nil, err
	}

	defer func() { _ = res.Body.Close() }()

	// 将响应的 Body 内容解析为 JSON 格式，并保存到 `webInitResponse` 变量中
	var webInitResponse WebInitResponse
	if err = json.NewDecoder(res.Body).Decode(&webInitResponse); err != nil {
		return nil, err
	}

	// 检查是否返回了有效的基本响应信息
	if !webInitResponse.BaseResponse.Ok() {
		return nil, webInitResponse.BaseResponse.Error()
	}

	return &webInitResponse, nil
}

// GetLoginUUID 使用调用者对象向服务器发送请求获取登录 UUID。
// 如果成功获取到 UUID，则返回 UUID 字符串；否则返回错误。
//
// 参数：
//   - ctx：上下文对象，用于控制请求的超时和取消。
//
// 返回值：
//   - string：UUID 字符串。
//   - error：获取 UUID 过程中的错误（如果有）。
func (c *Caller) GetLoginUUID(ctx context.Context) (string, error) {
	// 发送获取 UUID 的请求，并接收响应
	res, err := c.WechatClient.GetLoginUUID(ctx)
	if err != nil {
		return "", err
	}

	defer func() { _ = res.Body.Close() }()

	// 从响应的 Body 中读取数据并保存到 buffer 中
	var buffer bytes.Buffer
	if _, err = buffer.ReadFrom(res.Body); err != nil {
		return "", err
	}

	// 使用正则表达式匹配 UUID 字符串
	results := regexpUUID.FindSubmatch(buffer.Bytes())
	if len(results) != 2 {
		// 如果没有匹配到 UUID 字符串，可能是微信的接口做了修改，或者当前机器的 IP 被加入了黑名单
		return "", errors.New("uuid does not match")
	}

	// 返回匹配到的 UUID 字符串
	return string(results[1]), nil
}

// PushLogin 使用给定的 UIN 进行推送登录。(免扫码登陆接口)
//
// 参数：
//   - ctx：控制请求的上下文。
//   - uin：联系人标识码。
//
// 返回值：
//   - *PushLoginResponse：推送登录响应。
//   - error：错误信息（如果有）。
func (c *Caller) PushLogin(ctx context.Context, uin int64) (*PushLoginResponse, error) {
	// 调用 WechatClient 的 PushLogin 方法进行推送登录
	res, err := c.WechatClient.PushLogin(ctx, uin)
	if err != nil {
		return nil, err
	}

	defer func() { _ = res.Body.Close() }()

	// 解析响应
	var item PushLoginResponse
	if err := json.NewDecoder(res.Body).Decode(&item); err != nil {
		return nil, err
	}

	return &item, nil
}

// GetLoginInfo 使用调用者对象向服务器发送请求以获取登录信息。
//
// 参数：
//   - ctx：上下文对象，用于控制请求的超时和取消。
//   - path：请求的 URL 对象，包含需要跳转的路径信息。
//
// 返回值：
//   - *LoginInfoResponse：获取到的登录信息。
//   - error：获取登录信息过程中的错误（如果有）。
func (c *Caller) GetLoginInfo(ctx context.Context, path *url.URL) (*LoginInfoResponse, error) {
	// 从响应体里面获取需要跳转的 URL
	query := path.Query()
	query.Set("version", "v2")
	path.RawQuery = query.Encode()

	// 向服务器发送获取登录信息的请求，并接收响应
	res, err := c.WechatClient.GetLoginInfo(ctx, path)
	if err != nil {
		return nil, err
	}

	defer func() { _ = res.Body.Close() }()

	// 检查响应是否包含有效的登录信息
	if _, exists := CookieGroup(res.Cookies()).GetByName("wxuin"); !exists {
		err = Error_Forbidden
		if c.WechatClient.mode != desktop {
			err = fmt.Errorf("%w: try to login with desktop mode", err)
		}
		return nil, err
	}

	// 读取响应的 Body 内容并保存到字节切片中
	bs, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	var loginInfoResponse LoginInfoResponse

	// 将字节切片解析为 XML 格式，并保存到 loginInfoResponse 变量中
	if err = xml.NewDecoder(bytes.NewBuffer(bs)).Decode(&loginInfoResponse); err != nil {
		return nil, err
	}

	// 检查登录信息是否有效
	if !loginInfoResponse.Ok() {
		return nil, loginInfoResponse.Error()
	}

	// 设置调用者对象的域名
	c.WechatClient.Domain = Domain(path.Host)

	return &loginInfoResponse, nil
}

// CheckLogin 使用调用者对象向服务器发送请求以检查联系人是否已经扫描了二维码并且手机上已确认登录。
//
// 参数：
//   - ctx：上下文对象，用于控制请求的超时和取消。
//   - uuid：登录时获取到的 UUID 字符串。
//   - tip：等待联系人扫描二维码的超时时间。
//
// 返回值：
//   - CheckLoginResponse：检查登录的响应数据。
//   - error：检查登录过程中的错误（如果有）。
func (c *Caller) CheckLogin(ctx context.Context, uuid, tip string) (CheckLoginResponse, error) {
	// 向服务器发送检查联系人是否已经扫描了二维码并且手机上已确认登录的请求，并接收响应
	res, err := c.WechatClient.CheckLogin(ctx, uuid, tip)
	if err != nil {
		return nil, err
	}

	defer func() { _ = res.Body.Close() }()

	// 从响应的 Body 中读取数据并保存到 buffer 中
	var buffer bytes.Buffer
	if _, err := buffer.ReadFrom(res.Body); err != nil {
		return nil, err
	}

	// 返回响应数据以及可能的错误信息
	return buffer.Bytes(), nil
}

// ================================================= [函数](Caller)method - webwxlogout =================================================

// Logout 使用指定的登录信息进行注销。
//
// 参数：
//   - ctx：控制请求的上下文。
//   - info：要注销的登录信息。
//
// 返回值：
//   - error：错误信息（如果有）。
func (c *Caller) Logout(ctx context.Context, info *LoginInfoResponse) error {
	// 调用 WechatClient 的 Logout 方法进行注销
	res, err := c.WechatClient.Logout(ctx, info)
	if err != nil {
		return err
	}

	defer func() { _ = res.Body.Close() }()

	// 创建 MessageResponseParser，并解析响应
	parser := ResponseParser{res.Body}

	return parser.Error()
}

// ================================================= [函数](Caller)method - webwxstatusnotify =================================================

// WechatCallerStatusNotifyOption 是调用者的 StatusNotify 选项结构体。
type WechatCallerStatusNotifyOption WechatCallerCommonOption

// StatusNotify 函数用于向服务器发送 StatusNotify 请求。(通知手机已登录)
//
// 参数：
//   - ctx：上下文对象，用于控制请求的超时和取消。
//   - opt：包含调用者选项信息的 `WechatCallerStatusNotifyOption` 对象。
//
// 返回值：
//   - error：_statusNotify 过程中的错误（如果有）。
func (c *Caller) StatusNotify(ctx context.Context, option *WechatCallerStatusNotifyOption) error {
	// 创建 `WechatClientStatusNotifyOption` 对象，将 `option` 中的选项转换并存储到 `notifyOpt` 中
	notifyOpt := &WechatClientStatusNotifyOption{
		BaseRequest:       option.BaseRequest,
		WebInitResponse:   option.WebInitResponse,
		LoginInfoResponse: option.LoginInfoResponse,
	}

	// 向服务器发送 StatusNotify 请求，并接收响应
	res, err := c.WechatClient.StatusNotify(ctx, notifyOpt)
	if err != nil {
		return err
	}

	defer func() { _ = res.Body.Close() }()

	// 解析响应内容，并返回可能的错误
	parser := ResponseParser{res.Body}

	return parser.Error()
}

// WechatCallerStatusToReadOption 是将消息标记为已读的选项。
type WechatCallerStatusToReadOption struct {
	Message           *Message           // 消息
	BaseRequest       *BaseRequest       // 基本请求
	LoginInfoResponse *LoginInfoResponse // 登录信息
}

// StatusToRead 将消息标记为已读。
//
// 参数：
//   - ctx：控制请求的上下文。
//   - opt：将消息标记为已读的选项。
//
// 返回值：
//   - error：错误信息（如果有）。
func (c *Caller) StatusToRead(ctx context.Context, option *WechatCallerStatusToReadOption) error {
	// 构建调用 WechatClient 的 StatusToRead 方法所需的参数
	statusAsReadOption := &WechatClientStatusToReadOption{
		Message:           option.Message,           // 消息
		BaseRequest:       option.BaseRequest,       // 基本请求
		LoginInfoResponse: option.LoginInfoResponse, // 登录信息
	}

	// 调用 WechatClient 的 StatusToRead 方法将消息标记为已读
	res, err := c.WechatClient.StatusToRead(ctx, statusAsReadOption)
	if err != nil {
		return err
	}

	defer func() { _ = res.Body.Close() }()

	// 创建 MessageResponseParser，并解析响应
	parser := ResponseParser{res.Body}

	return parser.Error()
}

// ================================================= [函数](Caller)method - synccheck =================================================

// WechatCallerSyncCheckOption 是调用者的 SyncCheck 选项结构体。
type WechatCallerSyncCheckOption WechatCallerCommonOption

// SyncCheck 函数用于进行同步检查（_syncCheck）操作。(异步获取是否有新的消息)
//
// 参数：
//   - ctx：上下文对象，用于控制请求的超时和取消。
//   - opt：包含调用者选项信息的 `WechatCallerSyncCheckOption` 对象。
//
// 返回值：
//   - *SyncCheckResponse：同步检查的响应结果。
//   - error：同步检查过程中的错误（如果有）。
func (c *Caller) SyncCheck(ctx context.Context, option *WechatCallerSyncCheckOption) (*SyncCheckResponse, error) {
	// 创建 `WechatClientSyncCheckOption` 对象，将 `option` 中的选项转换并存储到 `syncCheckOption` 中
	syncCheckOption := &WechatClientSyncCheckOption{
		BaseRequest:       option.BaseRequest,
		WebInitResponse:   option.WebInitResponse,
		LoginInfoResponse: option.LoginInfoResponse,
	}

	// 向服务器发送 SyncCheck 请求，并接收响应
	res, err := c.WechatClient.SyncCheck(ctx, syncCheckOption)
	if err != nil {
		return nil, err
	}

	defer func() { _ = res.Body.Close() }()

	// 读取响应内容并存储到 buffer 中
	var buffer bytes.Buffer
	if _, err = buffer.ReadFrom(res.Body); err != nil {
		return nil, err
	}

	// 使用 buffer 中的字节创建 SyncCheckResponse 对象并返回
	return NewSyncCheckResponse(buffer.Bytes())
}

// ================================================= [函数](Caller)method - webwxgetcontact =================================================

// GetContact 函数用于获取 Web 微信所有联系人信息。
//
// 参数：
//   - ctx：上下文对象，用于控制请求的超时和取消。
//   - info：包含登录信息的 `LoginInfoResponse` 对象。
//
// 返回值：
//   - Members：Web 微信联系人列表。
//   - error：获取联系人信息过程中的错误（如果有）。
func (c *Caller) GetContact(ctx context.Context, info *LoginInfoResponse) (Contacts, error) {
	// 定义 reqs 变量，用于记录请求次数
	var reqs int64

	// 创建一个空的 Contacts 对象
	var contacts Contacts

	// 使用循环来连续发送请求
	for {
		// 向服务器发送 GetContact 请求，并接收响应
		res, err := c.WechatClient.GetContact(ctx, info.SKey, reqs)
		if err != nil {
			return nil, err
		}

		// 创建一个 ContactResponse 对象，用于解码响应的 JSON 数据
		var item ContactResponse
		if err = json.NewDecoder(res.Body).Decode(&item); err != nil {
			_ = res.Body.Close()
			return nil, err
		}

		// 关闭响应的 Body
		if err = res.Body.Close(); err != nil {
			return nil, err
		}

		// 检查响应中的 BaseResponse 是否为成功状态
		if !item.BaseResponse.Ok() {
			return nil, item.BaseResponse.Error()
		}

		// 将获取到的联系人列表添加到 contacts 中
		contacts = append(contacts, item.MemberList...)

		// 检查响应中的 Seq 是否为 0 或与 reqs 相等，如果是，则退出循环
		if item.Seq == 0 || item.Seq == reqs {
			break
		}

		// 更新 reqs 的值为当前响应中的 Seq
		reqs = item.Seq
	}

	// 返回获取到的联系人列表和 nil 错误
	return contacts, nil
}

// ================================================= [函数](Caller)method - webwxbatchgetcontact =================================================

// 注: Members参数的长度不要大于50
// BatchGetContact 函数用于批量获取 Web 微信联系人信息。(注: Members参数的长度不要大于50)
// 接收一个 `context.Context` 对象作为参数，用于控制请求的上下文。
// `contacts` 参数是一个 `Contacts` 对象，包含了需要获取信息的联系人列表。
// `request` 参数是一个 `BaseRequest` 对象，包含了请求的基本信息。
// 函数返回一个 `Contacts` 对象和一个错误。
func (c *Caller) BatchGetContact(ctx context.Context, contacts Contacts, request *BaseRequest) (Contacts, error) {
	// 向服务器发送 BatchGetContact 请求，并接收响应
	res, err := c.WechatClient.BatchGetContact(ctx, contacts, request)
	if err != nil {
		return nil, err
	}

	// 在函数结束时关闭响应的 Body
	defer func() { _ = res.Body.Close() }()

	// 创建一个 BatchContactResponse 对象，用于解码响应的 JSON 数据
	var item BatchContactResponse
	if err = json.NewDecoder(res.Body).Decode(&item); err != nil {
		return nil, err
	}

	// 检查响应中的 BaseResponse 是否为成功状态
	if !item.BaseResponse.Ok() {
		return nil, item.BaseResponse.Error()
	}

	// 返回获取到的联系人列表和 nil 错误
	return item.ContactList, nil
}

// ================================================= [函数](Caller)method - webwxsync =================================================

// WechatCallerSyncOption 类型是 WechatCallerCommonOption 的别名，用于指定 Web 微信同步的选项。
type WechatCallerSyncOption WechatCallerCommonOption

// Sync 函数用于执行 Web 微信消息同步操作。
// 接收一个 `context.Context` 对象作为参数，用于控制请求的上下文。
// `option` 参数是一个 `WechatCallerSyncOption` 对象指针，包含了同步的选项。
// 函数返回一个 `SyncResponse` 对象指针和一个错误。
func (c *Caller) Sync(ctx context.Context, option *WechatCallerSyncOption) (*SyncResponse, error) {
	// 构造 Sync 请求的选项对象
	wxSyncOption := &WechatClientSyncOption{
		BaseRequest:       option.BaseRequest,
		WebInitResponse:   option.WebInitResponse,
		LoginInfoResponse: option.LoginInfoResponse,
	}

	// 向服务器发送 Sync 请求，并接收响应
	res, err := c.WechatClient.Sync(ctx, wxSyncOption)
	if err != nil {
		return nil, err
	}

	// 延迟关闭响应的 Body
	defer func() { _ = res.Body.Close() }()

	// 创建一个 SyncResponse 对象，用于解码响应的 JSON 数据
	var webWxSyncResponse SyncResponse

	// 解码响应的 Body 并将结果存储到 webWxSyncResponse 中
	if err = json.NewDecoder(res.Body).Decode(&webWxSyncResponse); err != nil {
		return nil, err
	}

	// 返回 SyncResponse 对象和 nil 错误
	return &webWxSyncResponse, nil
}

// ================================================= [函数](Caller)method - webwxuploadmedia|webwxcheckupload =================================================

// WechatCallerUploadMediaOption 类型用于指定上传媒体文件的选项。
type WechatCallerUploadMediaOption struct {
	ToUserName        string             // 接收方联系人名
	FromUserName      string             // 发送方联系人名
	File              *os.File           // 要上传的文件
	BaseRequest       *BaseRequest       // 基本请求信息
	LoginInfoResponse *LoginInfoResponse // 登录信息
}

// UploadMedia 函数用于上传媒体文件。
// 接收一个 `context.Context` 对象作为参数，用于控制请求的上下文。
// `option` 参数是一个 `WechatCallerUploadMediaOption` 对象指针，包含了上传媒体文件的选项。
// 函数返回一个 *UploadResponse 和一个错误。
func (c *Caller) UploadMedia(ctx context.Context, option *WechatCallerUploadMediaOption) (*UploadResponse, error) {
	// 构造 UploadChunk 请求的选项对象
	clientWebWxUploadMediaByChunkOpt := &WechatClientUploadChunkOption{
		File:              option.File,
		BaseRequest:       option.BaseRequest,
		LoginInfoResponse: option.LoginInfoResponse,
		FromUserName:      option.FromUserName,
		ToUserName:        option.ToUserName,
	}

	// 向服务器发送 UploadChunk 请求，并接收响应
	res, err := c.WechatClient.UploadChunk(ctx, clientWebWxUploadMediaByChunkOpt)
	if err != nil {
		return nil, err
	}

	// 延迟关闭响应的 Body
	defer func() { _ = res.Body.Close() }()

	// 解析响应的 JSON 数据
	var item UploadResponse
	if err = json.NewDecoder(res.Body).Decode(&item); err != nil {
		return &item, err
	}

	// 检查返回结果是否正常
	if !item.BaseResponse.Ok() {
		return &item, item.BaseResponse.Error()
	}

	// 检查媒体 ID 是否有效
	if len(item.MediaId) == 0 {
		return &item, errors.New("upload failed")
	}

	return &item, nil
}

// ================================================= [函数](Caller)method - webwxoplog =================================================

// WechatCallerOplogOption 类型用于指定 Web 微信操作日志的选项。
type WechatCallerOplogOption struct {
	BaseRequest *BaseRequest // 基本请求信息
	RemarkName  string       // 备注名称
	ToUserName  string       // 目标联系人名称
}

// Oplog 函数用于执行 Web 微信操作日志操作。(修改联系人备注接口)
// 接收一个 `context.Context` 对象作为参数，用于控制请求的上下文。
// `option` 参数是一个 `WechatCallerOplogOption` 对象指针，包含了操作日志的选项。
// 函数返回一个错误。
func (c *Caller) Oplog(ctx context.Context, option *WechatCallerOplogOption) error {
	// 构造 Oplog 请求的选项对象
	wxOpLogOption := &WechatClientOplogOption{
		BaseRequest: option.BaseRequest,
		RemarkName:  option.RemarkName,
		UserName:    option.ToUserName,
	}

	// 向服务器发送 Oplog 请求，并接收响应
	res, err := c.WechatClient.Oplog(ctx, wxOpLogOption)
	if err != nil {
		return err
	}

	// 延迟关闭响应的 Body
	defer func() { _ = res.Body.Close() }()

	// 创建一个 ResponseParser 对象，用于解析响应的消息
	parser := ResponseParser{res.Body}

	// 返回解析后的错误
	return parser.Error()
}

// WechatCallerRelationOplogOption 是设置联系人是否置顶的选项。
type WechatCallerRelationOplogOption struct {
	BaseRequest *BaseRequest // 基本请求
	Contact     *Contact     // 联系人信息
	Op          uint8        // 操作类型
}

// Pin 设置联系人是否置顶。
//
// 参数：
//   - ctx：控制请求的上下文。
//   - opt：设置联系人是否置顶的选项。
//
// 返回值：
//   - error：错误信息（如果有）。
func (c *Caller) Pin(ctx context.Context, option *WechatCallerRelationOplogOption) error {
	// 构建调用 WechatClient 的 Pin 方法所需的参数
	webWxRelationPinOption := &WechatClientRelationOplogOption{
		BaseRequest: option.BaseRequest,        // 基本请求
		Op:          option.Op,                 // 操作类型
		RemarkName:  option.Contact.RemarkName, // 备注名
		UserName:    option.Contact.UserName,   // 联系人名
	}

	// 调用 WechatClient 的 Pin 方法设置联系人是否置顶
	res, err := c.WechatClient.Pin(ctx, webWxRelationPinOption)
	if err != nil {
		return err
	}

	defer func() { _ = res.Body.Close() }()

	// 创建 MessageResponseParser，并解析响应
	parser := ResponseParser{res.Body}

	return parser.Error()
}

// ================================================= [函数](Caller)method - webwxverifyuser =================================================

// WechatCallerVerifyUserOption 是验证联系人的选项。
type WechatCallerVerifyUserOption struct {
	BaseRequest       *BaseRequest       // 基本请求
	LoginInfoResponse *LoginInfoResponse // 登录信息
	VerifyContent     string             // 验证内容
	RecommendInfo     RecommendInfo      // 推荐信息
}

// VerifyUser 同意加好友请求
//
// 参数：
//   - ctx：控制请求的上下文。
//   - opt：验证联系人的选项。
//
// 返回值：
//   - error：错误信息（如果有）。
func (c *Caller) VerifyUser(ctx context.Context, option *WechatCallerVerifyUserOption) error {
	// 构建调用 WechatClient 的 VerifyUser 方法所需的参数
	webWxVerifyUserOption := &WechatClientVerifyUserOption{
		BaseRequest:       option.BaseRequest,       // 基本请求
		LoginInfoResponse: option.LoginInfoResponse, // 登录信息
		VerifyContent:     option.VerifyContent,     // 验证内容
		RecommendInfo:     option.RecommendInfo,     // 推荐信息
	}

	// 调用 WechatClient 的 VerifyUser 方法验证联系人
	res, err := c.WechatClient.VerifyUser(ctx, webWxVerifyUserOption)
	if err != nil {
		return err
	}

	defer func() { _ = res.Body.Close() }()

	// 创建 MessageResponseParser，并解析响应
	parser := ResponseParser{res.Body}

	return parser.Error()
}

// ================================================= [函数](Caller)method - webwxupdatechatroom|webwxupdatechatroom =================================================

// WechatCallerAddContactToChatRoomOption 是将好友添加到群聊中的选项。
type WechatCallerAddContactToChatRoomOption struct {
	BaseRequest       *BaseRequest       // 基本请求
	LoginInfoResponse *LoginInfoResponse // 登录信息
	Group             *Group             // 群聊信息
	Friends           []*Friend          // 要添加的好友列表
	GroupLength       int                // 群聊长度
}

// AddContactToChatRoom 将好友添加到群聊中。
//
// 参数：
//   - ctx：控制请求的上下文。
//   - opt：添加好友到群聊中的选项。
//
// 返回值：
//   - error：错误信息（如果有）。
func (c *Caller) AddContactToChatRoom(ctx context.Context, option *WechatCallerAddContactToChatRoomOption) error {
	// 检查是否有要添加的好友
	if len(option.Friends) == 0 {
		return errors.New("no friends found")
	}

	// 构建添加成员的列表
	inviteMemberList := make([]string, len(option.Friends))
	for i, friend := range option.Friends {
		inviteMemberList[i] = friend.UserName
	}

	// 构建调用 WechatClient 的 AddContactToChatRoom 方法所需的参数
	clientAddMemberIntoChatRoomOption := &WechatClientAddContactToChatRoomOption{
		BaseRequest:       option.BaseRequest,       // 基本请求
		LoginInfoResponse: option.LoginInfoResponse, // 登录信息
		Group:             option.Group.UserName,    // 群聊联系人名
		GroupLength:       option.GroupLength,       // 群聊长度
		InviteMemberList:  inviteMemberList,         // 要邀请的成员列表
	}

	// 调用 WechatClient 的 AddContactToChatRoom 方法添加成员到群聊中
	res, err := c.WechatClient.AddContactToChatRoom(ctx, clientAddMemberIntoChatRoomOption)
	if err != nil {
		return err
	}

	defer func() { _ = res.Body.Close() }()

	// 创建 MessageResponseParser，并解析响应
	parser := ResponseParser{res.Body}

	return parser.Error()
}

// ================================================= [函数](Caller)method - webwxupdatechatroom =================================================

// WechatCallerRemoveContactFromChatRoomOption 是将好友从群聊中移除的选项。
type WechatCallerRemoveContactFromChatRoomOption struct {
	Group             *Group             // 群聊信息
	Contacts          []*Contact         // 要移除的成员列表
	BaseRequest       *BaseRequest       // 基本请求
	LoginInfoResponse *LoginInfoResponse // 登录信息
}

// RemoveContactToChatRoom 从群聊中移除好友。
//
// 参数：
//   - ctx：控制请求的上下文。
//   - opt：移除好友的选项。
//
// 返回值：
//   - error：错误信息（如果有）。
func (c *Caller) RemoveContactToChatRoom(ctx context.Context, option *WechatCallerRemoveContactFromChatRoomOption) error {
	// 检查是否有要移除的成员
	if len(option.Contacts) == 0 {
		return errors.New("no users found")
	}

	// 构建要移除的成员列表
	users := make([]string, len(option.Contacts))
	for i, member := range option.Contacts {
		users[i] = member.UserName
	}

	// 构建调用 WechatClient 的 RemoveContactToChatRoom 方法所需的参数
	req := &WechatClientRemoveContactFromChatRoomOption{
		BaseRequest:       option.BaseRequest,       // 基本请求
		LoginInfoResponse: option.LoginInfoResponse, // 登录信息
		Group:             option.Group.UserName,    // 群聊联系人名
		DelMemberList:     users,                    // 要删除的成员列表
	}

	// 调用 WechatClient 的 RemoveContactToChatRoom 方法移除成员
	res, err := c.WechatClient.RemoveContactToChatRoom(ctx, req)
	if err != nil {
		return err
	}

	defer func() { _ = res.Body.Close() }()

	// 创建 MessageResponseParser，并解析响应
	parser := ResponseParser{res.Body}

	return parser.Error()
}

// ================================================= [函数](Caller)method - webwxcreatechatroom =================================================

// WechatCallerCreateChatRoomOption 是创建群聊的选项。
type WechatCallerCreateChatRoomOption struct {
	Topic             string             // 群聊主题
	Friends           Friends            // 群聊成员
	BaseRequest       *BaseRequest       // 基本请求
	LoginInfoResponse *LoginInfoResponse // 登录信息
}

// CreateChatRoom 创建群聊。
//
// 参数：
//   - ctx：控制请求的上下文。
//   - opt：创建群聊的选项。
//
// 返回值：
//   - *Group：创建成功的群组。
//   - error：错误信息（如果有）。
func (c *Caller) CreateChatRoom(ctx context.Context, option *WechatCallerCreateChatRoomOption) (*Group, error) {
	// 检查是否有好友参与建立群聊
	if len(option.Friends) == 0 {
		return nil, errors.New("create group with no friends")
	}

	// 将好友列表转换为联系人名列表
	friends := make([]string, len(option.Friends))
	for i, friend := range option.Friends {
		friends[i] = friend.UserName
	}

	// 构建调用 WechatClient 的 CreateChatRoom 方法所需的参数
	webWxCreateChatRoomOption := &WechatClientCreateChatRoomOption{
		BaseRequest:       option.BaseRequest,       // 基本请求
		LoginInfoResponse: option.LoginInfoResponse, // 登录信息
		Topic:             option.Topic,             // 群聊主题
		Friends:           friends,                  // 群聊成员
	}

	// 调用 WechatClient 的 CreateChatRoom 方法创建群聊
	res, err := c.WechatClient.CreateChatRoom(ctx, webWxCreateChatRoomOption)
	if err != nil {
		return nil, err
	}

	defer func() { _ = res.Body.Close() }()

	// 解析响应
	var item struct {
		BaseResponse BaseResponse // 基本响应
		ChatRoomName string       // 群聊名称
	}

	if err = json.NewDecoder(res.Body).Decode(&item); err != nil {
		return nil, err
	}

	if !item.BaseResponse.Ok() {
		return nil, item.BaseResponse.Error()
	}

	// 创建群组对象并返回
	group := Group{Contact: &Contact{UserName: item.ChatRoomName}}

	return &group, nil
}

// ================================================= [函数](Caller)method - webwxupdatechatroom =================================================

// WechatCallerRenameChatRoomOption 是群组重命名的选项。
type WechatCallerRenameChatRoomOption struct {
	NewTopic          string             // 新的群聊主题
	Group             *Group             // 需要重命名的群组
	BaseRequest       *BaseRequest       // 基本请求
	LoginInfoResponse *LoginInfoResponse // 登录信息
}

// RenameChatRoom 重命名群组。
//
// 参数：
//   - ctx：控制请求的上下文。
//   - opt：群组重命名的选项。
//
// 返回值：
//   - error：错误信息（如果有）。
func (c *Caller) RenameChatRoom(ctx context.Context, option *WechatCallerRenameChatRoomOption) error {
	// 构建调用 WechatClient 的 RenameChatRoom 方法所需的参数
	webWxRenameChatRoomOption := &WechatClientRenameChatRoomOption{
		BaseRequest:       option.BaseRequest,       // 基本请求
		LoginInfoResponse: option.LoginInfoResponse, // 登录信息
		NewTopic:          option.NewTopic,          // 新的群聊主题
		Group:             option.Group.UserName,    // 需要重命名的群组
	}

	// 调用 WechatClient 的 RenameChatRoom 方法重命名群组
	res, err := c.WechatClient.RenameChatRoom(ctx, webWxRenameChatRoomOption)
	if err != nil {
		return err
	}

	defer func() { _ = res.Body.Close() }()

	// 解析响应并检查是否有错误
	parser := ResponseParser{res.Body}

	return parser.Error()
}

// ================================================= [函数](Caller)method - webwxsendmsg|webwxsendmsgimg|webwxsendappmsg =================================================

// WechatCallerSendMessageOption 类型是用于指定 Web 微信发送消息的选项。
type WechatCallerSendMessageOption struct {
	Message           *SendMessage       // 要发送的消息
	BaseRequest       *BaseRequest       // 基本请求信息
	LoginInfoResponse *LoginInfoResponse // 登录信息
}

// SendTextMessage 函数用于执行 Web 微信发送消息操作。
// 接收一个 `context.Context` 对象作为参数，用于控制请求的上下文。
// `option` 参数是一个 `WechatCallerSendMessageOption` 对象指针，包含了发送消息的选项。
// 函数返回一个 `SentMessage` 对象指针和一个错误。
func (c *Caller) SendTextMessage(ctx context.Context, option *WechatCallerSendMessageOption) (*SentMessage, error) {
	// 构造 SendTextMessage 请求的选项对象
	wxSendMsgOption := &WechatClientSendMessageOption{
		BaseRequest:       option.BaseRequest,
		LoginInfoResponse: option.LoginInfoResponse,
		Message:           option.Message,
	}

	// 向服务器发送 SendTextMessage 请求，并接收响应
	res, err := c.WechatClient.SendTextMessage(ctx, wxSendMsgOption)
	if err != nil {
		return nil, err
	}

	// 延迟关闭响应的 Body
	defer func() { _ = res.Body.Close() }()

	// 创建一个 ResponseParser 对象，用于解析响应的消息
	parser := ResponseParser{res.Body}

	// 解析响应的消息并返回 SentMessage 对象指针
	return parser.SentMessage(option.Message)
}

// ================================================= [函数](Caller)method - webwxsendmsg|webwxsendmsgimg|webwxsendappmsg =================================================

// WechatCallerMediaMessageCommonOption 结构体包含了上传媒体文件的通用选项。
type WechatCallerMediaMessageCommonOption struct {
	Reader            io.Reader          // Reader 是一个 io.Reader 对象，用于读取媒体文件的内容。
	BaseRequest       *BaseRequest       // BaseRequest 是一个 *BaseRequest 对象指针，包含了请求的基本信息。
	LoginInfoResponse *LoginInfoResponse // LoginInfo 是一个 *LoginInfo 对象指针，包含了登录信息。
	ToUserName        string             // ToUserName 是收件人的联系人名。
	FromUserName      string             // FromUserName 是发件人的联系人名。
}

// WechatCallerSendImageMessageOption 结构体是基于 WechatCallerMediaMessageCommonOption 的选项，用于发送图片消息
type WechatCallerSendImageMessageOption WechatCallerMediaMessageCommonOption

// SendImageMessage 是调用者 Caller 的方法，用于发送图片消息。
func (c *Caller) SendImageMessage(ctx context.Context, option *WechatCallerSendImageMessageOption) (*SentMessage, error) {
	// 将 Reader 转换为文件，并返回文件句柄和清理函数
	file, callback, err := ReaderToFile(option.Reader)
	if err != nil {
		return nil, err
	}

	defer callback()

	// 首先尝试上传图片
	var mediaId string
	{
		// 创建上传媒体的选项
		uploadMediaOption := &WechatCallerUploadMediaOption{
			File:              file,
			BaseRequest:       option.BaseRequest,
			LoginInfoResponse: option.LoginInfoResponse,
			FromUserName:      option.FromUserName,
			ToUserName:        option.ToUserName,
		}

		// 调用 UploadMedia 方法进行媒体上传
		res, err := c.UploadMedia(ctx, uploadMediaOption)
		if err != nil {
			return nil, err
		}

		mediaId = res.MediaId
	}

	// 构造新的图片类型的信息
	message := NewMediaMessage(MessageImage, option.FromUserName, option.ToUserName, mediaId)

	// 发送图片信息
	sendImageOption := &WechatClientSendMessageOption{
		BaseRequest:       option.BaseRequest,
		LoginInfoResponse: option.LoginInfoResponse,
		Message:           message,
	}

	res, err := c.WechatClient.SendImageMessage(ctx, sendImageOption)
	if err != nil {
		return nil, err
	}

	defer func() { _ = res.Body.Close() }()

	// 解析响应并返回发送的消息
	parser := ResponseParser{res.Body}

	return parser.SentMessage(message)
}

// WechatCallerSendVideoMessageOption 结构体是基于 WechatCallerMediaMessageCommonOption 的选项，用于发送视频消息
type WechatCallerSendVideoMessageOption WechatCallerMediaMessageCommonOption

// SendVideoMessage 是调用者 Caller 的方法，用于发送视频消息。
func (c *Caller) SendVideoMessage(ctx context.Context, option *WechatCallerSendVideoMessageOption) (*SentMessage, error) {
	// 将读取器转换为文件，并获取关闭文件的函数
	file, callback, err := ReaderToFile(option.Reader)
	if err != nil {
		return nil, err
	}

	defer callback()

	var mediaId string
	{
		// 构造上传媒体的选项
		uploadMediaOption := &WechatCallerUploadMediaOption{
			File:              file,
			BaseRequest:       option.BaseRequest,
			LoginInfoResponse: option.LoginInfoResponse,
			FromUserName:      option.FromUserName,
			ToUserName:        option.ToUserName,
		}

		// 调用 UploadMedia 方法进行媒体上传
		res, err := c.UploadMedia(ctx, uploadMediaOption)
		if err != nil {
			return nil, err
		}

		mediaId = res.MediaId
	}

	// 构造新的视频类型的信息
	message := NewMediaMessage(MessageVideo, option.FromUserName, option.ToUserName, mediaId)

	// 调用 WechatClient 的 SendVideoMessage 方法发送视频消息
	res, err := c.WechatClient.SendVideoMessage(ctx, option.BaseRequest, message)
	if err != nil {
		return nil, err
	}

	defer func() { _ = res.Body.Close() }()

	// 解析响应并返回 SentMessage 结构体
	parser := ResponseParser{res.Body}

	return parser.SentMessage(message)
}

// WechatCallerSendFileMessageOption 结构体是基于 WechatCallerMediaMessageCommonOption 的选项，用于发送文件消息
type WechatCallerSendFileMessageOption WechatCallerMediaMessageCommonOption

// SendAppMessage 是调用者 Caller 的方法，用于发送文件消息。
func (c *Caller) SendFileMessage(ctx context.Context, option *WechatCallerSendFileMessageOption) (*SentMessage, error) {
	// 将读取器转换为文件，并获取关闭文件的函数
	file, callback, err := ReaderToFile(option.Reader)
	if err != nil {
		return nil, err
	}

	defer callback()

	// 构造上传媒体的选项
	uploadMediaOption := &WechatCallerUploadMediaOption{
		File:              file,
		BaseRequest:       option.BaseRequest,
		LoginInfoResponse: option.LoginInfoResponse,
		FromUserName:      option.FromUserName,
		ToUserName:        option.ToUserName,
	}

	// 调用 UploadMedia 方法进行媒体上传
	res, err := c.UploadMedia(ctx, uploadMediaOption)
	if err != nil {
		return nil, err
	}

	// 构造文件类型的 AppMessage 信息
	stat, _ := file.Stat()
	appMessage := NewAppMessage(stat, res.MediaId)

	content, err := appMessage.XmlByte()
	if err != nil {
		return nil, err
	}

	// 构造发送消息的选项
	message := NewSendMessage(AppMessageMode, string(content), option.FromUserName, option.ToUserName, "")

	// 调用 SendAppMessage 方法发送文件消息
	return c.SendAppMessage(ctx, message, option.BaseRequest)
}

// SendVideoMessage 是调用者 Caller 的方法，用于发送应用消息。
//
// 参数：
//   - ctx：控制请求的上下文。
//   - msg：要发送的消息。
//   - req：基本请求。
//
// 返回值：
//   - *SentMessage：已发送的消息。
//   - error：错误信息（如果有）。
func (c *Caller) SendAppMessage(ctx context.Context, msg *SendMessage, req *BaseRequest) (*SentMessage, error) {
	// 调用 WechatClient 的 SendAppMessage 方法发送应用消息
	res, err := c.WechatClient.SendAppMessage(ctx, msg, req)
	if err != nil {
		return nil, err
	}

	defer func() { _ = res.Body.Close() }()

	// 创建 MessageResponseParser，并解析响应
	parser := ResponseParser{res.Body}

	return parser.SentMessage(msg)
}

// ================================================= [函数](Caller)method - webwxrevokemsg =================================================

// RevokeMessage 撤回消息。
//
// 参数：
//   - ctx：控制请求的上下文。
//   - msg：待撤回的消息。
//   - request: 基本请求。
//
// 返回值：
//   - error：错误信息（如果有）。
func (c *Caller) RevokeMessage(ctx context.Context, msg *SentMessage, request *BaseRequest) error {
	// 调用 WechatClient 的 RevokeMessage 方法撤回消息
	res, err := c.WechatClient.RevokeMessage(ctx, msg, request)
	if err != nil {
		return err
	}

	defer func() { _ = res.Body.Close() }()

	// 创建 MessageResponseParser，并解析响应
	parser := ResponseParser{res.Body}

	return parser.Error()
}
