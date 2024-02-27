package wechatbot

import (
	"bytes"
	"context"
	"encoding/json"
	"encoding/xml"
	"errors"
	"fmt"
	"io"
	"net/url"
)

// ================================================= [类型](全局)公开 =================================================

// Caller 是一个调用者结构体(上层模块可以直接获取封装后的请求结果)
type Caller struct {
	WechatClient *WechatClient // 客户端对象
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

// ================================================= [函数](ResponseParser)公开 =================================================

// Error 方法用于解析服务器返回的错误响应。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - error: 错误信息，如果操作成功则为 nil，否则为具体的错误信息。
func (responseParser *ResponseParser) Error() error {
	// 定义变量 item 并解析响应并将结果存储在 item 中
	var item struct{ BaseResponse BaseResponse }
	if err := json.NewDecoder(responseParser.Reader).Decode(&item); err != nil {
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
func (responseParser *ResponseParser) MsgId() (string, error) {
	// 定义变量 messageResponse 并解析响应并将结果存储在 messageResponse 中
	var messageResponse MessageResponse
	if err := json.NewDecoder(responseParser.Reader).Decode(&messageResponse); err != nil {
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
func (responseParser *ResponseParser) SentMessage(message *SendMessage) (*SentMessage, error) {
	msgId, err := responseParser.MsgId()
	if err != nil {
		return nil, err
	}

	return &SentMessage{MsgId: msgId, SendMessage: message}, nil
}

// ================================================= [函数](Caller)私有 =================================================

// init 使用调用者对象向服务器发送请求以进行 Web 初始化。
//
// 参数：
//   - ctx：上下文对象，用于控制请求的超时和取消。
//   - request：包含基本请求信息的 `BaseRequest` 对象。
//
// 返回值：
//   - *WebInitResponse：Web 初始化的响应数据。
//   - error：Web 初始化过程中的错误（如果有）。
func (caller *Caller) init(ctx context.Context, calleRequest *BaseRequest) (*InitResponse, error) {
	// 向服务器发送 Web 初始化请求，并接收响应
	response, err := caller.WechatClient.Init(ctx, calleRequest)
	if err != nil {
		return nil, err
	}

	defer func() { _ = response.Body.Close() }()

	// 将响应的 Body 内容解析为 JSON 格式，并保存到 `webInitResponse` 变量中
	var clientResponse InitResponse
	if err = json.NewDecoder(response.Body).Decode(&clientResponse); err != nil {
		return nil, err
	}

	// 检查是否返回了有效的基本响应信息
	if !clientResponse.BaseResponse.Ok() {
		return nil, clientResponse.BaseResponse.Error()
	}

	return &clientResponse, nil
}

// ================================================= [函数](Caller)method - jsLoginPath =================================================

// GetLoginUUID 使用调用者对象向服务器发送请求获取登录 UUID。
// 如果成功获取到 UUID，则返回 UUID 字符串；否则返回错误。
//
// 参数：
//   - ctx：上下文对象，用于控制请求的超时和取消。
//
// 返回值：
//   - string：UUID 字符串。
//   - error：获取 UUID 过程中的错误（如果有）。
func (caller *Caller) GetLoginUUID(ctx context.Context) (string, error) {
	// 发送获取 UUID 的请求，并接收响应
	response, err := caller.WechatClient.GetLoginUUID(ctx)
	if err != nil {
		return "", err
	}

	defer func() { _ = response.Body.Close() }()

	// 从响应的 Body 中读取数据并保存到 buffer 中
	var buffer bytes.Buffer
	if _, err = buffer.ReadFrom(response.Body); err != nil {
		return "", err
	}

	// 使用正则表达式匹配 UUID 字符串
	results := RegexpUUID.FindSubmatch(buffer.Bytes())
	if len(results) != 2 {
		// 如果没有匹配到 UUID 字符串，可能是微信的接口做了修改，或者当前机器的 IP 被加入了黑名单
		return "", errors.New("uuid does not match")
	}

	// 返回匹配到的 UUID 字符串
	return string(results[1]), nil
}

// ================================================= [函数](Caller)method - webwxpushloginurl =================================================

// PushLogin 使用给定的 UIN 进行推送登录。(免扫码登陆接口)
//
// 参数：
//   - ctx：控制请求的上下文。
//   - uin：联系人标识码。
//
// 返回值：
//   - *PushLoginResponse：推送登录响应。
//   - error：错误信息（如果有）。
func (caller *Caller) PushLogin(ctx context.Context, uin int64) (*PushLoginResponse, error) {
	// 调用 WechatClient 的 PushLogin 方法进行推送登录
	response, err := caller.WechatClient.PushLogin(ctx, uin)
	if err != nil {
		return nil, err
	}

	defer func() { _ = response.Body.Close() }()

	// 解析响应
	var clientResponse PushLoginResponse
	if err := json.NewDecoder(response.Body).Decode(&clientResponse); err != nil {
		return nil, err
	}

	return &clientResponse, nil
}

// ================================================= [函数](Caller)method - getlogininfo =================================================

// GetLoginInfo 使用调用者对象向服务器发送请求以获取登录信息。
//
// 参数：
//   - ctx：上下文对象，用于控制请求的超时和取消。
//   - path：请求的 URL 对象，包含需要跳转的路径信息。
//
// 返回值：
//   - *LoginInfoResponse：获取到的登录信息。
//   - error：获取登录信息过程中的错误（如果有）。
func (caller *Caller) GetLoginInfo(ctx context.Context, path *url.URL) (*LoginInfoResponse, error) {
	// 从响应体里面获取需要跳转的 URL
	query := path.Query()
	query.Set("version", "v2")
	path.RawQuery = query.Encode()

	// 向服务器发送获取登录信息的请求，并接收响应
	response, err := caller.WechatClient.GetLoginInfo(ctx, path)
	if err != nil {
		return nil, err
	}

	defer func() { _ = response.Body.Close() }()

	// 检查响应是否包含有效的登录信息
	if _, exists := CookieGroup(response.Cookies()).GetByName("wxuin"); !exists {
		err = Error_Forbidden
		if caller.WechatClient.mode != desktop {
			err = fmt.Errorf("%w: try to login with desktop mode", err)
		}
		return nil, err
	}

	// 读取响应的 Body 内容并保存到字节切片中
	bs, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	var clientResponse LoginInfoResponse

	// 将字节切片解析为 XML 格式，并保存到 loginInfoResponse 变量中
	if err = xml.NewDecoder(bytes.NewBuffer(bs)).Decode(&clientResponse); err != nil {
		return nil, err
	}

	// 检查登录信息是否有效
	if !clientResponse.Ok() {
		return nil, clientResponse.Error()
	}

	// 设置调用者对象的域名
	caller.WechatClient.Domain = Domain(path.Host)

	return &clientResponse, nil
}

// ================================================= [函数](Caller)method - login =================================================

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
func (caller *Caller) CheckLogin(ctx context.Context, uuid, tip string) (CheckLoginResponse, error) {
	// 向服务器发送检查联系人是否已经扫描了二维码并且手机上已确认登录的请求，并接收响应
	response, err := caller.WechatClient.CheckLogin(ctx, uuid, tip)
	if err != nil {
		return nil, err
	}

	defer func() { _ = response.Body.Close() }()

	// 从响应的 Body 中读取数据并保存到 buffer 中
	var buffer bytes.Buffer
	if _, err := buffer.ReadFrom(response.Body); err != nil {
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
func (caller *Caller) Logout(ctx context.Context, info *LoginInfoResponse) error {
	// 调用 WechatClient 的 Logout 方法进行注销
	response, err := caller.WechatClient.Logout(ctx, info)
	if err != nil {
		return err
	}

	defer func() { _ = response.Body.Close() }()

	// 创建 MessageResponseParser，并解析响应
	parser := ResponseParser{response.Body}

	return parser.Error()
}

// ================================================= [函数](Caller)method - webwxstatusnotify =================================================

// StatusNotify 函数用于向服务器发送 StatusNotify 请求。(通知手机已登录)
//
// 参数：
//   - ctx：上下文对象，用于控制请求的超时和取消。
//   - opt：包含调用者选项信息的 `CallerStatusNotifyRequest` 对象。
//
// 返回值：
//   - error：_statusNotify 过程中的错误（如果有）。
func (caller *Caller) StatusNotify(ctx context.Context, calleRequest *CallerStatusNotifyRequest) error {
	// 创建 `ClientStatusNotifyRequest` 对象，将 `calleRequest` 中的选项转换并存储到 `notifyOpt` 中
	clientRequest := &ClientStatusNotifyRequest{
		BaseRequest:       calleRequest.BaseRequest,
		InitResponse:      calleRequest.InitResponse,
		LoginInfoResponse: calleRequest.LoginInfoResponse,
	}

	// 向服务器发送 StatusNotify 请求，并接收响应
	response, err := caller.WechatClient.StatusNotify(ctx, clientRequest)
	if err != nil {
		return err
	}

	defer func() { _ = response.Body.Close() }()

	// 解析响应内容，并返回可能的错误
	parser := ResponseParser{response.Body}

	return parser.Error()
}

// StatusToRead 将消息标记为已读。
//
// 参数：
//   - ctx：控制请求的上下文。
//   - opt：将消息标记为已读的选项。
//
// 返回值：
//   - error：错误信息（如果有）。
func (caller *Caller) StatusToRead(ctx context.Context, calleRequest *CallerStatusToReadRequest) error {
	// 构建调用 WechatClient 的 StatusToRead 方法所需的参数
	clientRequest := &ClientStatusToReadRequest{
		Message:           calleRequest.Message,           // 消息
		BaseRequest:       calleRequest.BaseRequest,       // 基本请求
		LoginInfoResponse: calleRequest.LoginInfoResponse, // 登录信息
	}

	// 调用 WechatClient 的 StatusToRead 方法将消息标记为已读
	response, err := caller.WechatClient.StatusToRead(ctx, clientRequest)
	if err != nil {
		return err
	}

	defer func() { _ = response.Body.Close() }()

	// 创建 MessageResponseParser，并解析响应
	parser := ResponseParser{response.Body}

	return parser.Error()
}

// ================================================= [函数](Caller)method - synccheck =================================================

// SyncCheck 函数用于进行同步检查（_syncCheck）操作。(异步获取是否有新的消息)
//
// 参数：
//   - ctx：上下文对象，用于控制请求的超时和取消。
//   - opt：包含调用者选项信息的 `CallerSyncCheckRequest` 对象。
//
// 返回值：
//   - *SyncCheckResponse：同步检查的响应结果。
//   - error：同步检查过程中的错误（如果有）。
func (caller *Caller) SyncCheck(ctx context.Context, calleRequest *CallerSyncCheckRequest) (*SyncCheckResponse, error) {
	// 创建 `ClientSyncCheckRequest` 对象，将 `calleRequest` 中的选项转换并存储到 `syncCheckOption` 中
	clientRequest := &ClientSyncCheckRequest{
		BaseRequest:       calleRequest.BaseRequest,
		InitResponse:      calleRequest.InitResponse,
		LoginInfoResponse: calleRequest.LoginInfoResponse,
	}

	// 向服务器发送 SyncCheck 请求，并接收响应
	response, err := caller.WechatClient.SyncCheck(ctx, clientRequest)
	if err != nil {
		return nil, err
	}

	defer func() { _ = response.Body.Close() }()

	// 读取响应内容并存储到 buffer 中
	var buffer bytes.Buffer
	if _, err = buffer.ReadFrom(response.Body); err != nil {
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
func (caller *Caller) GetContact(ctx context.Context, info *LoginInfoResponse) (Contacts, error) {
	// 定义 reqs 变量，用于记录请求次数
	var reqs int64

	// 创建一个空的 Contacts 对象
	var contacts Contacts

	// 使用循环来连续发送请求
	for {
		// 向服务器发送 GetContact 请求，并接收响应
		response, err := caller.WechatClient.GetContact(ctx, info.SKey, reqs)
		if err != nil {
			return nil, err
		}

		// 创建一个 ContactResponse 对象，用于解码响应的 JSON 数据
		var clientResponse ContactResponse
		if err = json.NewDecoder(response.Body).Decode(&clientResponse); err != nil {
			_ = response.Body.Close()
			return nil, err
		}

		// 关闭响应的 Body
		if err = response.Body.Close(); err != nil {
			return nil, err
		}

		// 检查响应中的 BaseResponse 是否为成功状态
		if !clientResponse.BaseResponse.Ok() {
			return nil, clientResponse.BaseResponse.Error()
		}

		// 将获取到的联系人列表添加到 contacts 中
		contacts = append(contacts, clientResponse.MemberList...)

		// 检查响应中的 Seq 是否为 0 或与 reqs 相等，如果是，则退出循环
		if clientResponse.Seq == 0 || clientResponse.Seq == reqs {
			break
		}

		// 更新 reqs 的值为当前响应中的 Seq
		reqs = clientResponse.Seq
	}

	// 返回获取到的联系人列表和 nil 错误
	return contacts, nil
}

// ================================================= [函数](Caller)method - webwxbatchgetcontact =================================================

// BatchGetContact 用于批量获取联系人信息。
//
// 输入参数：
//   - ctx: 上下文信息。
//   - contacts: 待获取联系人列表。
//   - request: 基本请求信息。
//
// 输出参数：
//   - Contacts: 获取到的联系人列表。
//   - error: 操作过程中遇到的错误。
func (caller *Caller) BatchGetContact(ctx context.Context, contacts Contacts, request *BaseRequest) (Contacts, error) {
	// 向服务器发送 BatchGetContact 请求，并接收响应
	response, err := caller.WechatClient.BatchGetContact(ctx, contacts, request)
	if err != nil {
		return nil, err
	}

	// 在函数结束时关闭响应的 Body
	defer func() { _ = response.Body.Close() }()

	// 创建一个 BatchContactResponse 对象，用于解码响应的 JSON 数据
	var clientResponse BatchContactResponse
	if err = json.NewDecoder(response.Body).Decode(&clientResponse); err != nil {
		return nil, err
	}

	// 检查响应中的 BaseResponse 是否为成功状态
	if !clientResponse.BaseResponse.Ok() {
		return nil, clientResponse.BaseResponse.Error()
	}

	// 返回获取到的联系人列表和 nil 错误
	return clientResponse.ContactList, nil
}

// ================================================= [函数](Caller)method - webwxsync =================================================

// Sync 用于同步微信消息和联系人信息。
//
// 输入参数：
//   - ctx: 上下文信息。
//   - calleRequest: 微信同步选项。
//
// 输出参数：
//   - *SyncResponse: 同步响应对象。
//   - error: 操作过程中遇到的错误。
func (caller *Caller) Sync(ctx context.Context, calleRequest *CallerSyncRequest) (*SyncResponse, error) {
	// 构造 Sync 请求的选项对象
	clientRequest := &ClientSyncRequest{
		BaseRequest:       calleRequest.BaseRequest,
		InitResponse:      calleRequest.InitResponse,
		LoginInfoResponse: calleRequest.LoginInfoResponse,
	}

	// 向服务器发送 Sync 请求，并接收响应
	response, err := caller.WechatClient.Sync(ctx, clientRequest)
	if err != nil {
		return nil, err
	}

	// 延迟关闭响应的 Body
	defer func() { _ = response.Body.Close() }()

	// 创建一个 SyncResponse 对象，用于解码响应的 JSON 数据
	var clientResponse SyncResponse

	// 解码响应的 Body 并将结果存储到 webWxSyncResponse 中
	if err = json.NewDecoder(response.Body).Decode(&clientResponse); err != nil {
		return nil, err
	}

	// 返回 SyncResponse 对象和 nil 错误
	return &clientResponse, nil
}

// ================================================= [函数](Caller)method - webwxuploadmedia|webwxcheckupload =================================================

// Upload 用于上传媒体文件。
//
// 输入参数：
//   - ctx: 上下文信息。
//   - calleRequest: 上传媒体选项。
//
// 输出参数：
//   - *UploadResponse: 上传响应对象。
//   - error: 操作过程中遇到的错误。
func (caller *Caller) Upload(ctx context.Context, calleRequest *CallerUploadRequest) (*UploadResponse, error) {
	// 构造 UploadChunk 请求的选项对象
	clientRequest := &ClientUploadChunkRequest{
		File:              calleRequest.File,
		BaseRequest:       calleRequest.BaseRequest,
		LoginInfoResponse: calleRequest.LoginInfoResponse,
		FromUserName:      calleRequest.FromUserName,
		ToUserName:        calleRequest.ToUserName,
	}

	// 向服务器发送 UploadChunk 请求，并接收响应
	response, err := caller.WechatClient.UploadChunk(ctx, clientRequest)
	if err != nil {
		return nil, err
	}

	// 延迟关闭响应的 Body
	defer func() { _ = response.Body.Close() }()

	// 解析响应的 JSON 数据
	var clientResponse UploadResponse
	if err = json.NewDecoder(response.Body).Decode(&clientResponse); err != nil {
		return &clientResponse, err
	}

	// 检查返回结果是否正常
	if !clientResponse.BaseResponse.Ok() {
		return &clientResponse, clientResponse.BaseResponse.Error()
	}

	// 检查媒体 ID 是否有效
	if len(clientResponse.MediaId) == 0 {
		return &clientResponse, errors.New("upload failed")
	}

	return &clientResponse, nil
}

// ================================================= [函数](Caller)method - webwxoplog =================================================

// Oplog 用于记录操作日志。
//
// 输入参数：
//   - ctx: 上下文信息。
//   - calleRequest: 操作日志选项。
//
// 输出参数：
//   - error: 操作过程中遇到的错误。
func (caller *Caller) Oplog(ctx context.Context, calleRequest *CallerOplogRequest) error {
	// 构造 Oplog 请求的选项对象
	clientRequest := &ClientOplogRequest{
		BaseRequest: calleRequest.BaseRequest,
		RemarkName:  calleRequest.RemarkName,
		UserName:    calleRequest.ToUserName,
	}

	// 向服务器发送 Oplog 请求，并接收响应
	response, err := caller.WechatClient.Oplog(ctx, clientRequest)
	if err != nil {
		return err
	}

	// 延迟关闭响应的 Body
	defer func() { _ = response.Body.Close() }()

	// 创建一个 ResponseParser 对象，用于解析响应的消息
	parser := ResponseParser{response.Body}

	// 返回解析后的错误
	return parser.Error()
}

// Pin 设置联系人是否置顶。
//
// 参数：
//   - ctx：控制请求的上下文。
//   - opt：设置联系人是否置顶的选项。
//
// 返回值：
//   - error：错误信息（如果有）。
func (caller *Caller) Pin(ctx context.Context, calleRequest *CallerRelationRequest) error {
	// 构建调用 WechatClient 的 Pin 方法所需的参数
	clientRequest := &ClientRelationRequest{
		BaseRequest: calleRequest.BaseRequest,        // 基本请求
		Op:          calleRequest.Op,                 // 操作类型
		RemarkName:  calleRequest.Contact.RemarkName, // 备注名
		UserName:    calleRequest.Contact.UserName,   // 联系人名
	}

	// 调用 WechatClient 的 Pin 方法设置联系人是否置顶
	response, err := caller.WechatClient.Pin(ctx, clientRequest)
	if err != nil {
		return err
	}

	defer func() { _ = response.Body.Close() }()

	// 创建 MessageResponseParser，并解析响应
	parser := ResponseParser{response.Body}

	return parser.Error()
}

// ================================================= [函数](Caller)method - webwxverifyuser =================================================

// VerifyUser 同意加好友请求
//
// 参数：
//   - ctx：控制请求的上下文。
//   - opt：验证联系人的选项。
//
// 返回值：
//   - error：错误信息（如果有）。
func (caller *Caller) VerifyUser(ctx context.Context, calleRequest *CallerVerifyUserRequest) error {
	// 构建调用 WechatClient 的 VerifyUser 方法所需的参数
	clientRequest := &ClientVerifyUserRequest{
		BaseRequest:       calleRequest.BaseRequest,       // 基本请求
		LoginInfoResponse: calleRequest.LoginInfoResponse, // 登录信息
		VerifyContent:     calleRequest.VerifyContent,     // 验证内容
		RecommendInfo:     calleRequest.RecommendInfo,     // 推荐信息
	}

	// 调用 WechatClient 的 VerifyUser 方法验证联系人
	response, err := caller.WechatClient.VerifyUser(ctx, clientRequest)
	if err != nil {
		return err
	}

	defer func() { _ = response.Body.Close() }()

	// 创建 MessageResponseParser，并解析响应
	parser := ResponseParser{response.Body}

	return parser.Error()
}

// ================================================= [函数](Caller)method - webwxupdatechatroom|webwxupdatechatroom =================================================

// AddContactToChatRoom 将好友添加到群聊中。
//
// 参数：
//   - ctx：控制请求的上下文。
//   - opt：添加好友到群聊中的选项。
//
// 返回值：
//   - error：错误信息（如果有）。
func (caller *Caller) AddContactToChatRoom(ctx context.Context, calleRequest *CallerAddContactToChatRoomRequest) error {
	// 检查是否有要添加的好友
	if len(calleRequest.Friends) == 0 {
		return errors.New("no friends found")
	}

	// 构建添加成员的列表
	inviteMemberList := make([]string, len(calleRequest.Friends))
	for i, friend := range calleRequest.Friends {
		inviteMemberList[i] = friend.UserName
	}

	// 构建调用 WechatClient 的 AddContactToChatRoom 方法所需的参数
	clientRequest := &ClientAddContactToChatRoomRequest{
		BaseRequest:       calleRequest.BaseRequest,       // 基本请求
		LoginInfoResponse: calleRequest.LoginInfoResponse, // 登录信息
		Group:             calleRequest.Group.UserName,    // 群聊联系人名
		GroupLength:       calleRequest.GroupLength,       // 群聊长度
		InviteMemberList:  inviteMemberList,               // 要邀请的成员列表
	}

	// 调用 WechatClient 的 AddContactToChatRoom 方法添加成员到群聊中
	response, err := caller.WechatClient.AddContactToChatRoom(ctx, clientRequest)
	if err != nil {
		return err
	}

	defer func() { _ = response.Body.Close() }()

	// 创建 MessageResponseParser，并解析响应
	parser := ResponseParser{response.Body}

	return parser.Error()
}

// ================================================= [函数](Caller)method - webwxupdatechatroom =================================================

// RemoveContactToChatRoom 从群聊中移除好友。
//
// 参数：
//   - ctx：控制请求的上下文。
//   - opt：移除好友的选项。
//
// 返回值：
//   - error：错误信息（如果有）。
func (caller *Caller) RemoveContactToChatRoom(ctx context.Context, calleRequest *CallerRemoveContactFromChatRoomRequest) error {
	// 检查是否有要移除的成员
	if len(calleRequest.Contacts) == 0 {
		return errors.New("no users found")
	}

	// 构建要移除的成员列表
	users := make([]string, len(calleRequest.Contacts))
	for i, member := range calleRequest.Contacts {
		users[i] = member.UserName
	}

	// 构建调用 WechatClient 的 RemoveContactToChatRoom 方法所需的参数
	clientRequest := &ClientRemoveContactFromChatRoomRequest{
		BaseRequest:       calleRequest.BaseRequest,       // 基本请求
		LoginInfoResponse: calleRequest.LoginInfoResponse, // 登录信息
		Group:             calleRequest.Group.UserName,    // 群聊联系人名
		DelMemberList:     users,                          // 要删除的成员列表
	}

	// 调用 WechatClient 的 RemoveContactToChatRoom 方法移除成员
	response, err := caller.WechatClient.RemoveContactToChatRoom(ctx, clientRequest)
	if err != nil {
		return err
	}

	defer func() { _ = response.Body.Close() }()

	// 创建 MessageResponseParser，并解析响应
	parser := ResponseParser{response.Body}

	return parser.Error()
}

// ================================================= [函数](Caller)method - webwxcreatechatroom =================================================

// CreateChatRoom 创建群聊。
//
// 参数：
//   - ctx：控制请求的上下文。
//   - opt：创建群聊的选项。
//
// 返回值：
//   - *Group：创建成功的群组。
//   - error：错误信息（如果有）。
func (caller *Caller) CreateChatRoom(ctx context.Context, calleRequest *CallerCreateChatRoomRequest) (*Group, error) {
	// 检查是否有好友参与建立群聊
	if len(calleRequest.Friends) == 0 {
		return nil, errors.New("create group with no friends")
	}

	// 将好友列表转换为联系人名列表
	friends := make([]string, len(calleRequest.Friends))
	for i, friend := range calleRequest.Friends {
		friends[i] = friend.UserName
	}

	// 构建调用 WechatClient 的 CreateChatRoom 方法所需的参数
	clientRequest := &ClientCreateChatRoomRequest{
		BaseRequest:       calleRequest.BaseRequest,       // 基本请求
		LoginInfoResponse: calleRequest.LoginInfoResponse, // 登录信息
		Topic:             calleRequest.Topic,             // 群聊主题
		Friends:           friends,                        // 群聊成员
	}

	// 调用 WechatClient 的 CreateChatRoom 方法创建群聊
	response, err := caller.WechatClient.CreateChatRoom(ctx, clientRequest)
	if err != nil {
		return nil, err
	}

	defer func() { _ = response.Body.Close() }()

	// 解析响应
	var clientResponse struct {
		BaseResponse BaseResponse // 基本响应
		ChatRoomName string       // 群聊名称
	}

	if err = json.NewDecoder(response.Body).Decode(&clientResponse); err != nil {
		return nil, err
	}

	if !clientResponse.BaseResponse.Ok() {
		return nil, clientResponse.BaseResponse.Error()
	}

	// 创建群组对象并返回
	group := Group{Contact: &Contact{UserName: clientResponse.ChatRoomName}}

	return &group, nil
}

// ================================================= [函数](Caller)method - webwxupdatechatroom =================================================

// RenameChatRoom 重命名群组。
//
// 参数：
//   - ctx：控制请求的上下文。
//   - opt：群组重命名的选项。
//
// 返回值：
//   - error：错误信息（如果有）。
func (caller *Caller) RenameChatRoom(ctx context.Context, calleRequest *CalleRenameChatRoomRequest) error {
	// 构建调用 WechatClient 的 RenameChatRoom 方法所需的参数
	clientRequest := &ClientRenameChatRoomRequest{
		BaseRequest:       calleRequest.BaseRequest,       // 基本请求
		LoginInfoResponse: calleRequest.LoginInfoResponse, // 登录信息
		NewTopic:          calleRequest.NewTopic,          // 新的群聊主题
		Group:             calleRequest.Group.UserName,    // 需要重命名的群组
	}

	// 调用 WechatClient 的 RenameChatRoom 方法重命名群组
	response, err := caller.WechatClient.RenameChatRoom(ctx, clientRequest)
	if err != nil {
		return err
	}

	defer func() { _ = response.Body.Close() }()

	// 解析响应并检查是否有错误
	parser := ResponseParser{response.Body}

	return parser.Error()
}

// ================================================= [函数](Caller)method - webwxsendmsg|webwxsendmsgimg|webwxsendappmsg =================================================

// SendTextMessage 用于发送文本消息。
//
// 输入参数：
//   - ctx: 上下文信息。
//   - calleRequest: 发送消息选项。
//
// 输出参数：
//   - *SentMessage: 发送的消息对象。
//   - error: 操作过程中遇到的错误。
func (caller *Caller) SendTextMessage(ctx context.Context, calleRequest *CalleSendMessageRequest) (*SentMessage, error) {
	// 构造 SendTextMessage 请求的选项对象
	clientRequest := &ClientSendMessageRequest{
		BaseRequest:       calleRequest.BaseRequest,
		LoginInfoResponse: calleRequest.LoginInfoResponse,
		Message:           calleRequest.Message,
	}

	// 向服务器发送 SendTextMessage 请求，并接收响应
	response, err := caller.WechatClient.SendTextMessage(ctx, clientRequest)
	if err != nil {
		return nil, err
	}

	// 延迟关闭响应的 Body
	defer func() { _ = response.Body.Close() }()

	// 创建一个 ResponseParser 对象，用于解析响应的消息
	parser := ResponseParser{response.Body}

	// 解析响应的消息并返回 SentMessage 对象指针
	return parser.SentMessage(calleRequest.Message)
}

// ================================================= [函数](Caller)method - webwxsendmsg|webwxsendmsgimg|webwxsendappmsg =================================================

// SendImageMessage 用于发送图片消息。
//
// 输入参数：
//   - ctx: 上下文信息。
//   - calleRequest: 发送图片消息选项。
//
// 输出参数：
//   - *SentMessage: 发送的消息对象。
//   - error: 操作过程中遇到的错误。
func (caller *Caller) SendImageMessage(ctx context.Context, calleRequest *CalleSendImageMessageRequest) (*SentMessage, error) {
	// 将 Reader 转换为文件，并返回文件句柄和清理函数
	file, callback, err := ReadToFile(calleRequest.Reader)
	if err != nil {
		return nil, err
	}

	defer callback()

	// 首先尝试上传图片
	var mediaId string
	{
		// 创建上传媒体的选项
		calleRequest := &CallerUploadRequest{
			File:              file,
			BaseRequest:       calleRequest.BaseRequest,
			LoginInfoResponse: calleRequest.LoginInfoResponse,
			FromUserName:      calleRequest.FromUserName,
			ToUserName:        calleRequest.ToUserName,
		}

		// 调用 Upload 方法进行媒体上传
		response, err := caller.Upload(ctx, calleRequest)
		if err != nil {
			return nil, err
		}

		mediaId = response.MediaId
	}

	// 构造新的图片类型的信息
	message := NewMediaMessage(MessageImage, calleRequest.FromUserName, calleRequest.ToUserName, mediaId)

	// 发送图片信息
	clientRequest := &ClientSendMessageRequest{
		BaseRequest:       calleRequest.BaseRequest,
		LoginInfoResponse: calleRequest.LoginInfoResponse,
		Message:           message,
	}

	response, err := caller.WechatClient.SendImageMessage(ctx, clientRequest)
	if err != nil {
		return nil, err
	}

	defer func() { _ = response.Body.Close() }()

	// 解析响应并返回发送的消息
	parser := ResponseParser{response.Body}

	return parser.SentMessage(message)
}

// SendVideoMessage 用于发送视频消息。
//
// 输入参数：
//   - ctx: 上下文信息。
//   - calleRequest: 发送视频消息选项。
//
// 输出参数：
//   - *SentMessage: 发送的消息对象。
//   - error: 操作过程中遇到的错误。
func (caller *Caller) SendVideoMessage(ctx context.Context, calleRequest *CalleSendVideoMessageRequest) (*SentMessage, error) {
	// 将读取器转换为文件，并获取关闭文件的函数
	file, callback, err := ReadToFile(calleRequest.Reader)
	if err != nil {
		return nil, err
	}

	defer callback()

	var mediaId string
	{
		// 构造上传媒体的选项
		calleUploadRequest := &CallerUploadRequest{
			File:              file,
			BaseRequest:       calleRequest.BaseRequest,
			LoginInfoResponse: calleRequest.LoginInfoResponse,
			FromUserName:      calleRequest.FromUserName,
			ToUserName:        calleRequest.ToUserName,
		}

		// 调用 Upload 方法进行媒体上传
		response, err := caller.Upload(ctx, calleUploadRequest)
		if err != nil {
			return nil, err
		}

		mediaId = response.MediaId
	}

	// 构造新的视频类型的信息
	message := NewMediaMessage(MessageVideo, calleRequest.FromUserName, calleRequest.ToUserName, mediaId)

	// 发送视频信息
	clientRequest := &ClientSendMessageRequest{
		BaseRequest:       calleRequest.BaseRequest,
		LoginInfoResponse: calleRequest.LoginInfoResponse,
		Message:           message,
	}

	// 调用 WechatClient 的 SendVideoMessage 方法发送视频消息
	response, err := caller.WechatClient.SendVideoMessage(ctx, clientRequest)
	if err != nil {
		return nil, err
	}

	defer func() { _ = response.Body.Close() }()

	// 解析响应并返回 SentMessage 结构体
	parser := ResponseParser{response.Body}

	return parser.SentMessage(message)
}

// SendFileMessage 用于发送文件消息。
//
// 输入参数：
//   - ctx: 上下文信息。
//   - calleRequest: 发送文件消息选项。
//
// 输出参数：
//   - *SentMessage: 发送的消息对象。
//   - error: 操作过程中遇到的错误。
func (caller *Caller) SendFileMessage(ctx context.Context, calleRequest *CalleSendFileMessageRequest) (*SentMessage, error) {
	// 将读取器转换为文件，并获取关闭文件的函数
	file, callback, err := ReadToFile(calleRequest.Reader)
	if err != nil {
		return nil, err
	}

	defer callback()

	var mediaId string
	{
		// 构造上传媒体的选项
		calleUploadRequest := &CallerUploadRequest{
			File:              file,
			BaseRequest:       calleRequest.BaseRequest,
			LoginInfoResponse: calleRequest.LoginInfoResponse,
			FromUserName:      calleRequest.FromUserName,
			ToUserName:        calleRequest.ToUserName,
		}

		// 调用 Upload 方法进行媒体上传
		response, err := caller.Upload(ctx, calleUploadRequest)
		if err != nil {
			return nil, err
		}

		mediaId = response.MediaId
	}

	// 构造文件类型的 AppMessage 信息
	stat, _ := file.Stat()
	appMessage := NewAppMessage(stat, mediaId)

	content, err := appMessage.XmlByte()
	if err != nil {
		return nil, err
	}

	// 构造发送消息的选项
	message := NewSendMessage(AppMessageMode, string(content), calleRequest.FromUserName, calleRequest.ToUserName, "")

	// 发送应用信息
	clientRequest := &CalleSendAppMessageRequest{
		BaseRequest:       calleRequest.BaseRequest,
		LoginInfoResponse: calleRequest.LoginInfoResponse,
		Message:           message,
	}

	// 调用 SendAppMessage 方法发送文件消息
	return caller.SendAppMessage(ctx, clientRequest)
}

// SendAppMessage 用于发送应用消息。
//
// 输入参数：
//   - ctx: 上下文信息。
//   - calleRequest: 发送应用消息选项。
//
// 输出参数：
//   - *SentMessage: 发送的消息对象。
//   - error: 操作过程中遇到的错误。
func (caller *Caller) SendAppMessage(ctx context.Context, calleRequest *CalleSendAppMessageRequest) (*SentMessage, error) {

	// 发送应用信息
	clientRequest := &ClientSendMessageRequest{
		BaseRequest:       calleRequest.BaseRequest,
		LoginInfoResponse: calleRequest.LoginInfoResponse,
		Message:           calleRequest.Message,
	}

	// 调用 WechatClient 的 SendAppMessage 方法发送应用消息
	response, err := caller.WechatClient.SendAppMessage(ctx, clientRequest)
	if err != nil {
		return nil, err
	}

	defer func() { _ = response.Body.Close() }()

	// 创建 MessageResponseParser，并解析响应
	parser := ResponseParser{response.Body}

	return parser.SentMessage(calleRequest.Message)
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
func (caller *Caller) RevokeMessage(ctx context.Context, calleRequest *CalleRevokeMessageRequest) error {

	// 撤回信息
	clientRequest := &ClientRevokeMessageRequest{
		BaseRequest:       calleRequest.BaseRequest,
		LoginInfoResponse: calleRequest.LoginInfoResponse,
		Message:           calleRequest.Message,
	}

	// 调用 WechatClient 的 RevokeMessage 方法撤回消息
	response, err := caller.WechatClient.RevokeMessage(ctx, clientRequest)
	if err != nil {
		return err
	}

	defer func() { _ = response.Body.Close() }()

	// 创建 MessageResponseParser，并解析响应
	parser := ResponseParser{response.Body}

	return parser.Error()
}
