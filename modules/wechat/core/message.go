package core

import (
	"context"
	"encoding/json"
	"encoding/xml"
	"errors"
	"fmt"
	"html"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
)

// ================================================= [类型](全局)公开 =================================================

// RecommendInfo是推荐信息结构体
type RecommendInfo struct {
	OpCode     int    // 操作码
	Scene      int    // 场景
	Sex        int    // 性别
	VerifyFlag int    // 验证标志
	AttrStatus int64  // 属性状态
	QQNum      int64  // QQ号码
	Alias      string // 别名
	City       string // 城市
	Content    string // 内容
	NickName   string // 昵称
	Province   string // 省份
	Signature  string // 签名
	Ticket     string // 票据
	UserName   string // 联系人名
}

// Message 结构体定义，包含处理微信消息所需的各种字段
type Message struct {
	isAt    bool // 判断消息是否为@消息
	AppInfo struct {
		Type  int
		AppID string
	} // 应用信息，包含应用类型和AppID
	AppMsgType            AppMessageType         // 应用消息类型
	HasProductId          int                    // 判断消息是否包含产品ID
	ImgHeight             int                    // 图片高度
	ImgWidth              int                    // 图片宽度
	ImgStatus             int                    // 图片状态
	ForwardFlag           int                    // 转发标志
	MsgType               MessageType            // 消息类型
	Status                int                    // 消息状态
	StatusNotifyCode      int                    // 状态通知代码
	SubMsgType            int                    // 子消息类型
	VoiceLength           int                    // 语音长度
	CreateTime            int64                  // 消息创建时间，64位整型
	NewMsgId              int64                  // 新消息ID，64位整型
	PlayLength            int64                  // 播放长度，64位整型
	MediaId               string                 // 媒体ID，字符串类型
	MsgId                 string                 // 消息ID，字符串类型
	EncryFileName         string                 // 加密文件名，字符串类型
	FileName              string                 // 文件名，字符串类型
	FileSize              string                 // 文件大小，字符串类型（可能是为了统一格式）
	Content               string                 // 消息内容，字符串类型
	FromUserName          string                 // 发件人联系人名，字符串类型
	OriContent            string                 // 原始内容，字符串类型
	StatusNotifyUserName  string                 // 状态通知联系人名，字符串类型
	Ticket                string                 // 票据，字符串类型（可能是用于验证或授权）
	ToUserName            string                 // 收件人联系人名，字符串类型
	Url                   string                 // URL，字符串类型（可能是链接或其他资源地址）
	senderUserNameInGroup string                 // 组内发件人联系人名，字符串类型（可能是用于群组消息）
	RecommendInfo         RecommendInfo          // 推荐信息，可能包含其他相关字段或数据结构
	bot                   *Bot                   // 与机器人相关的信息，可能包含其他相关字段或数据结构，使用指针以节省内存空间（如果机器人信息可能为空）
	mu                    sync.RWMutex           // 读写锁，用于并发安全的读写操作（sync.RWMutex）
	context               context.Context        // 跨API和进程的请求生命周期管理（context.Context）
	item                  map[string]interface{} // 其他键值对数据存储（map[string]interface{}）
	Raw                   []byte                 `json:"-"` // 在JSON序列化时忽略的原始字节数据（[]byte）
	RawContent            string                 `json:"-"` // 在JSON序列化时忽略的消息原始内容（string）
	// 消息原始内容字段注释说明：此字段存储消息的原始内容，在JSON序列化时会被忽略。它用于保留消息的原始格式或数据，以便于后续处理或分析。在反序列化时也会被忽略。请注意，此字段的数据类型为字符串，意味着它可以存储任何文本形式的内容。在使用此字段时应注意数据的完整性和安全性。同时，由于此字段在JSON序列化和反序列化时都会被忽略，因此它不会影响JSON数据的结构和传输。这样的设计有助于保持结构体的简洁性和可读性。在实际使用中，可以根据具体需求对`RawContent`字段进行适当的处理和解析。例如，可以将其解析为特定格式的数据结构或对象，以便于进一步的分析和处理。总之，`RawContent`字段提供了一种灵活的方式来存储和传递原始消息内容，使得在处理消息时具有更大的灵活性和可扩展性。同时，通过合理地使用此字段，可以提高应用程序对不同消息格式的兼容性和处理能力。
}

// RevokeMsg表示一条撤回消息的结构体
type RevokeMessage struct {
	SysMsg  xml.Name `xml:"sysmsg"`    // XML标签名
	Type    string   `xml:"type,attr"` // 消息类型
	Content struct { // 撤回消息
		OldMsgId   int64  `xml:"oldmsgid"`   // 被撤回的消息ID
		MsgId      int64  `xml:"msgid"`      // 撤回的消息ID
		Session    string `xml:"session"`    // 会话ID
		ReplaceMsg string `xml:"replacemsg"` // 替代消息
	} `xml:"revokemsg"` // 撤回消息标签
}

// SendMessage是要发送的消息结构体
type SendMessage struct {
	Type         MessageType // 消息类型
	Content      string      // 消息内容
	FromUserName string      // 发送方的联系人名
	ToUserName   string      // 接收方的联系人名
	LocalID      string      // 本地ID
	ClientMsgId  string      // 客户端消息ID
	MediaId      string      `json:"MediaId,omitempty"` // 媒体ID，可选字段
}

// SentMessage表示一条已发送消息的结构体
type SentMessage struct {
	*SendMessage        // 发送的消息
	self         *Self  // 自己
	MsgId        string // 消息ID
}

// Card表示名片信息结构体
type CardMessage struct {
	XMLName                 xml.Name `xml:"msg"`                          // XML名称
	ImageStatus             int      `xml:"imagestatus,attr"`             // 图片状态
	Scene                   int      `xml:"scene,attr"`                   // 场景
	Sex                     int      `xml:"sex,attr"`                     // 性别
	Certflag                int      `xml:"certflag,attr"`                // 认证标志
	BigHeadImgUrl           string   `xml:"bigheadimgurl,attr"`           // 大头像URL
	SmallHeadImgUrl         string   `xml:"smallheadimgurl,attr"`         // 小头像URL
	UserName                string   `xml:"username,attr"`                // 联系人名
	NickName                string   `xml:"nickname,attr"`                // 昵称
	ShortPy                 string   `xml:"shortpy,attr"`                 // 简拼
	Alias                   string   `xml:"alias,attr"`                   // 别名，名片联系人的微信号
	Province                string   `xml:"province,attr"`                // 省份
	City                    string   `xml:"city,attr"`                    // 城市
	Sign                    string   `xml:"sign,attr"`                    // 签名
	Certinfo                string   `xml:"certinfo,attr"`                // 认证信息
	BrandIconUrl            string   `xml:"brandIconUrl,attr"`            // 品牌图标URL
	BrandHomeUr             string   `xml:"brandHomeUr,attr"`             // 品牌主页URL
	BrandSubscriptConfigUrl string   `xml:"brandSubscriptConfigUrl,attr"` // 品牌订阅配置URL
	BrandFlags              string   `xml:"brandFlags,attr"`              // 品牌标志
	RegionCode              string   `xml:"regionCode,attr"`              // 区域代码
}

// FriendAddMessage是好友添加消息结构体
type FriendAddMessage struct {
	XMLName           xml.Name `xml:"msg"`                    // XML标签名
	Shortpy           string   `xml:"shortpy,attr"`           // 简拼
	ImageStatus       int      `xml:"imagestatus,attr"`       // 图片状态
	Scene             int      `xml:"scene,attr"`             // 场景
	PerCard           int      `xml:"percard,attr"`           // 每张卡
	Sex               int      `xml:"sex,attr"`               // 性别
	AlbumFlag         int      `xml:"albumflag,attr"`         // 相册标志
	AlbumStyle        int      `xml:"albumstyle,attr"`        // 相册样式
	SnsFlag           int      `xml:"snsflag,attr"`           // SNS标志
	Opcode            int      `xml:"opcode,attr"`            // 操作码
	FromUserName      string   `xml:"fromusername,attr"`      // 发送者联系人名
	EncryptUserName   string   `xml:"encryptusername,attr"`   // 加密的联系人名
	FromNickName      string   `xml:"fromnickname,attr"`      // 发送者昵称
	Content           string   `xml:"content,attr"`           // 内容
	Country           string   `xml:"country,attr"`           // 国家
	Province          string   `xml:"province,attr"`          // 省份
	City              string   `xml:"city,attr"`              // 城市
	Sign              string   `xml:"sign,attr"`              // 签名
	Alias             string   `xml:"alias,attr"`             // 别名
	WeiBo             string   `xml:"weibo,attr"`             // 微博
	AlbumBgImgId      string   `xml:"albumbgimgid,attr"`      // 相册背景图片ID
	SnsBgImgId        string   `xml:"snsbgimgid,attr"`        // SNS背景图片ID
	SnsBgObjectId     string   `xml:"snsbgobjectid,attr"`     // SNS背景对象ID
	MHash             string   `xml:"mhash,attr"`             // M哈希
	MFullHash         string   `xml:"mfullhash,attr"`         // M全哈希
	BigHeadImgUrl     string   `xml:"bigheadimgurl,attr"`     // 大头像URL
	SmallHeadImgUrl   string   `xml:"smallheadimgurl,attr"`   // 小头像URL
	Ticket            string   `xml:"ticket,attr"`            // 票据
	GoogleContact     string   `xml:"googlecontact,attr"`     // Google联系人
	QrTicket          string   `xml:"qrticket,attr"`          // 二维码票据
	ChatRoomUserName  string   `xml:"chatroomusername,attr"`  // 聊天室联系人名
	SourceUserName    string   `xml:"sourceusername,attr"`    // 源联系人名
	ShareCardUserName string   `xml:"sharecardusername,attr"` // 分享名片的联系人名
	ShareCardNickName string   `xml:"sharecardnickname,attr"` // 分享名片的昵称
	CardVersion       string   `xml:"cardversion,attr"`       // 名片版本
	BrandList         struct {
		Count int   `xml:"count,attr"` // 品牌列表数量
		Ver   int64 `xml:"ver,attr"`   // 品牌列表版本
	} `xml:"brandlist"` // 品牌列表
}

// appmsg表示一条应用消息的结构体
type AppMessage struct {
	Type       int      `xml:"type"`        // 消息类型
	AppId      string   `xml:"appid,attr"`  // 应用ID
	SdkVer     string   `xml:"sdkver,attr"` // SDK版本
	Title      string   `xml:"title"`       // 标题
	Des        string   `xml:"des"`         // 描述
	Action     string   `xml:"action"`      // 动作
	Content    string   `xml:"content"`     // 内容
	Url        string   `xml:"url"`         // URL链接
	LowUrl     string   `xml:"lowurl"`      // 低质量URL链接
	ExtInfo    string   `xml:"extinfo"`     // 扩展信息
	Attachment struct { // 应用附件
		TotalLen int64  `xml:"totallen"` // 附件总长度
		AttachId string `xml:"attachid"` // 附件ID
		FileExt  string `xml:"fileext"`  // 附件扩展名
	} `xml:"appattach"` // 应用附件标签
}

// AppMessageContent 获取APP消息的正文
// See https://github.com/eatmoreapple/core/issues/62
// AppMessageData是表示应用消息的数据结构
type AppMessageContent struct {
	XMLName xml.Name `xml:"msg"` // XML节点名称
	AppMsg  struct {
		Appid             string         `xml:"appid,attr"`        // 应用ID
		SdkVer            string         `xml:"sdkver,attr"`       // SDK版本
		Title             string         `xml:"title"`             // 标题
		Des               string         `xml:"des"`               // 描述
		Action            string         `xml:"action"`            // 动作
		Type              AppMessageType `xml:"type"`              // 消息类型
		ShowType          string         `xml:"showtype"`          // 显示类型
		Content           string         `xml:"content"`           // 内容
		URL               string         `xml:"url"`               // URL链接
		DataUrl           string         `xml:"dataurl"`           // 数据URL链接
		LowUrl            string         `xml:"lowurl"`            // 低质量URL链接
		LowDataUrl        string         `xml:"lowdataurl"`        // 低质量数据URL链接
		RecordItem        string         `xml:"recorditem"`        // 记录项
		ThumbUrl          string         `xml:"thumburl"`          // 缩略图URL链接
		MessageAction     string         `xml:"messageaction"`     // 消息动作
		Md5               string         `xml:"md5"`               // MD5哈希值
		ExtInfo           string         `xml:"extinfo"`           // 扩展信息
		SourceUsername    string         `xml:"sourceusername"`    // 源联系人名
		SourceDisplayName string         `xml:"sourcedisplayname"` // 源显示名
		CommentUrl        string         `xml:"commenturl"`        // 评论URL链接
		Attachment        struct {       // 应用附件
			TotalLen          string `xml:"totallen"`           // 附件总长度
			AttachId          string `xml:"attachid"`           // 附件ID
			EmoticonMd5       string `xml:"emoticonmd5"`        // 表情图标MD5哈希值
			FileExt           string `xml:"fileext"`            // 附件扩展名
			FileUploadToken   string `xml:"fileuploadtoken"`    // 附件上传令牌
			OverwriteNewMsgId string `xml:"overwrite_newmsgid"` // 覆盖新消息ID
			FileKey           string `xml:"filekey"`            // 附件密钥
			CdnAttachUrl      string `xml:"cdnattachurl"`       // CDN附件URL链接
			AesKey            string `xml:"aeskey"`             // AES密钥
			EncryVer          string `xml:"encryver"`           // 加密版本
		} `xml:"appattach"` // 应用附件标签
		WeAppInfo struct { // 微信小程序信息
			PagePath       string `xml:"pagepath"`       // 页面路径
			Username       string `xml:"username"`       // 联系人名
			Appid          string `xml:"appid"`          // 小程序ID
			AppServiceType string `xml:"appservicetype"` // 小程序服务类型
		} `xml:"weappinfo"` // 微信小程序信息标签
		WebSearch string `xml:"websearch"` // 网页搜索
	} `xml:"appmsg"` // 应用消息标签
	FromUsername string   `xml:"fromusername"` // 发送方联系人名
	Scene        string   `xml:"scene"`        // 场景
	AppInfo      struct { // 应用信息
		Version string `xml:"version"` // 版本号
		AppName string `xml:"appname"` // 应用名称
	} `xml:"appinfo"` // 应用信息标签
	CommentUrl string `xml:"commenturl"` // 评论URL链接
}

// ================================================= [函数](全局)公开 =================================================

// NewSendMessage创建一条新的要发送的消息
// 参数：
// - msgType：消息类型，是一个`MessageType`枚举值。
// - content：消息内容，是一个字符串。
// - fromUserName：发送方的联系人名，是一个字符串。
// - toUserName：接收方的联系人名，是一个字符串。
// - mediaId：媒体ID，可选字段，是一个字符串。
// 返回值：
// - *SendMessage：指向创建的新消息的指针
func NewSendMessage(msgType MessageType, content, fromUserName, toUserName, mediaId string) *SendMessage {
	id := strconv.FormatInt(time.Now().UnixNano()/1e2, 10) // 生成本地ID和客户端消息ID
	return &SendMessage{                                   // 返回创建的新消息
		Type:         msgType,      // 消息类型
		Content:      content,      // 消息内容
		FromUserName: fromUserName, // 发送方的联系人名
		ToUserName:   toUserName,   // 接收方的联系人名
		LocalID:      id,           // 本地ID
		ClientMsgId:  id,           // 客户端消息ID
		MediaId:      mediaId,      // 媒体ID，可选字段
	}
}

// NewTextMessage 文本消息的构造方法
func NewTextMessage(content, fromUserName, toUserName string) *SendMessage {
	return NewSendMessage(MessageText, content, fromUserName, toUserName, "")
}

// NewMediaMessage 媒体消息的构造方法
func NewMediaMessage(msgType MessageType, fromUserName, toUserName, mediaId string) *SendMessage {
	return NewSendMessage(msgType, "", fromUserName, toUserName, mediaId)
}

func NewAppMessage(stat os.FileInfo, attachId string) *AppMessage {
	m := &AppMessage{AppId: AppMessageAppId, Title: stat.Name()}
	m.Attachment.AttachId = attachId
	m.Attachment.TotalLen = stat.Size()
	m.Type = 6
	m.Attachment.FileExt = FileExtension(stat.Name())
	return m
}

// ================================================= [函数](Message)公开 =================================================

// Set 设置消息的键值对
// 入参：
// key string: 键名
// value interface{}: 键对应的值
func (m *Message) Set(key string, value interface{}) {
	m.mu.Lock()         // 加锁
	defer m.mu.Unlock() // 延迟解锁
	if m.item == nil {
		m.item = make(map[string]interface{})
	}
	m.item[key] = value
}

// Get 获取消息中指定键的值
// 入参：
// key string: 键名
// 出参：
// value interface{}: 键对应的值
// exist bool: 指定的键是否存在，存在则为true，否则为false
func (m *Message) Get(key string) (value interface{}, exist bool) {
	m.mu.RLock()         // 加读锁
	defer m.mu.RUnlock() // 延迟释放读锁
	value, exist = m.item[key]
	return
}

// SaveFile 保存文件到指定的 io.Writer
func (m *Message) SaveFile(writer io.Writer) error {
	resp, err := m.GetFile()
	if err != nil {
		return err
	}
	defer func() { _ = resp.Body.Close() }()
	_, err = io.Copy(writer, resp.Body)
	return err
}

// SaveFileToLocal 保存文件到本地
func (m *Message) SaveFileToLocal(filename string) error {
	file, err := os.Create(filename)
	if err != nil {
		return err
	}
	defer func() { _ = file.Close() }()
	return m.SaveFile(file)
}

// 消息初始化,根据不同的消息作出不同的处理
func (m *Message) Init(bot *Bot) {
	// 设置bot属性
	m.bot = bot

	// 将消息序列化并保存到Raw字段中
	raw, _ := json.Marshal(m)
	m.Raw = raw
	m.RawContent = m.Content

	// 如果是群消息
	if m.IsSendByGroup() {
		if !m.IsSystem() {
			// 将Username和正文分开
			if !m.IsSendBySelf() {
				data := strings.Split(m.Content, ":<br/>")

				m.Content = strings.Join(data[1:], "") // 只保留正文内容
				m.senderUserNameInGroup = data[0]      // 保存发送者的Username

				if strings.Contains(m.Content, "@") { // 判断是否为@消息
					sender, err := m.Sender()
					if err == nil {

						// 获取群成员列表，搜索收件人信息
						receiver := sender.MemberList.SearchByUserName(1, m.ToUserName)
						if receiver != nil {
							displayName := receiver.First().DisplayName
							if displayName == "" {
								displayName = receiver.First().NickName
							}

							var atFlag string
							msgContent := FormatEmoji(m.Content) // 处理消息中的emoji表情
							atName := FormatEmoji(displayName)   // 处理@的群成员显示名字

							if strings.Contains(msgContent, "\u2005") {
								atFlag = "@" + atName + "\u2005" // 处理@消息时，要加上空格字符"\u2005"
							} else {
								atFlag = "@" + atName
							}

							m.isAt = strings.Contains(msgContent, atFlag) || strings.HasSuffix(msgContent, atFlag) // 判断是否@了收件人
						}
					}
				}
			} else {
				// 如果是由自己发送的消息，且包含@字符或空格字符"\u2005"，则认为是@消息
				m.isAt = strings.Contains(m.Content, "@") || strings.Contains(m.Content, "\u2005")
			}
		}
	}

	// 处理消息中的换行
	m.Content = strings.Replace(m.Content, `<br/>`, "\n", -1)

	// 处理html转义字符
	m.Content = html.UnescapeString(m.Content)

	// 处理消息中的emoji表情
	m.Content = FormatEmoji(m.Content)
}

// Bot 返回当前消息所属的Bot
func (m *Message) Bot() *Bot {
	return m.bot
}

// Owner 返回当前消息的拥有者
func (m *Message) Owner() *Self {
	return m.Bot().self
}

func (m *Message) Context() context.Context {
	if m.context == nil {
		return m.Bot().Context()
	}
	return m.context
}

func (m *Message) WithContext(ctx context.Context) {
	if ctx == nil {
		panic("nil context")
	}
	m.context = ctx
}

// Sender 返回消息的发送者信息
// 入参:
// m *Message: 消息对象，表示需要获取发送者信息的消息。
// 出参:
// *Contact: 发送者信息的联系人对象。
// error: 可能发生的错误。
func (m *Message) Sender() (*Contact, error) {
	// 如果消息是自己发送的，则返回消息所属联系人对象
	if m.IsSendBySelf() {
		return m.Owner().Contact, nil
	}

	// 尝试从缓存中查找发送者信息
	contacts, err := m.bot.self.Contacts()
	if err != nil {
		return nil, err
	}

	user, exist := contacts.GetByUserName(m.FromUserName)
	if !exist {
		// 如果缓存中没有发送者信息，则从服务器获取
		user = NewFriend(m.FromUserName, m.Owner()).Contact
		err = user.Detail()
	}

	// 如果消息来自群聊，并且发送者信息中的成员列表为空，则再次从服务器获取
	if m.IsSendByGroup() && len(user.MemberList) == 0 {
		err = user.Detail()
	}

	// 返回发送者信息和可能出现的错误
	return user, err
}

// SenderInGroup 返回群聊消息的发送者信息
// 入参:
// m *Message: 消息对象，表示需要获取发送者信息的消息。
// 出参:
// *Contact: 发送者信息的联系人对象。
// error: 可能发生的错误。
func (m *Message) SenderInGroup() (*Contact, error) {
	// 如果消息不是来自群聊，则返回错误
	if !m.IsFromGroup() {
		return nil, errors.New("message is not from group")
	}

	// 处理拍一拍系列的系统消息
	if m.IsSystem() {
		// 判断是否是自己发送的系统消息
		if m.IsSendBySelf() {
			return m.Owner().Contact, nil
		}
		return nil, errors.New("can not found sender from system message")
	}

	// 获取发送者信息
	user, err := m.Sender()
	if err != nil {
		return nil, err
	}

	// 如果发送者是好友，则直接返回发送者信息
	if user.IsFriend() {
		return user, nil
	}

	// 如果发送者是群聊中的成员，则通过联系人名在群聊中查找对应的成员信息
	group := &Group{user}

	return group.SearchContactByUsername(m.senderUserNameInGroup)
}

// Agree 同意好友的请求
func (m *Message) Agree(verifyContents ...string) (*Friend, error) {
	if !m.IsFriendAdd() {
		return nil, errors.New("friend add message required")
	}

	option := &WechatCallerVerifyUserOption{
		BaseRequest:       m.bot.Storage.Request,
		LoginInfoResponse: m.bot.Storage.LoginInfo,
		VerifyContent:     strings.Join(verifyContents, ""),
		RecommendInfo:     m.RecommendInfo,
	}

	err := m.bot.Caller.VerifyUser(m.Context(), option)
	if err != nil {
		return nil, err
	}

	friend := NewFriend(m.RecommendInfo.UserName, m.Owner())
	if err = friend.Detail(); err != nil {
		return nil, err
	}

	return friend, nil
}

// ToRead 将消息设置为已读
func (m *Message) ToRead() error {
	option := &WechatCallerStatusToReadOption{
		BaseRequest:       m.bot.Storage.Request,
		LoginInfoResponse: m.bot.Storage.LoginInfo,
		Message:           m,
	}

	return m.bot.Caller.StatusToRead(m.Context(), option)
}

// Receiver 返回消息的接收者信息
// 入参:
// m *Message: 消息对象，表示需要获取接收者信息的消息。
// 出参:
// *Contact: 接收者信息的联系人对象。
// error: 可能发生的错误。
func (m *Message) Receiver() (*Contact, error) {
	// 如果消息是系统消息或者发送到自己，则返回自己联系人对象
	if m.IsSystem() || m.ToUserName == m.bot.self.UserName {
		return m.bot.self.Contact, nil
	}

	// 如果消息是发送给文件助手，则返回文件助手联系人对象
	if m.ToUserName == FileHelper {
		return m.Owner().FileHelper().Contact, nil
	}

	// 如果消息是群聊消息
	if m.IsSendByGroup() {
		// 从联系人所在的所有群聊中查找成员信息
		groups, err := m.Owner().Groups()
		if err != nil {
			return nil, err
		}

		// 根据消息的来源或目标联系人名查找对应的群聊成员信息
		username := m.FromUserName
		if m.IsSendBySelf() {
			username = m.ToUserName
		}

		users := groups.SearchByUserName(1, username)
		if users.Count() == 0 {
			// 如果在所有群聊中都没有找到对应的成员信息，则尝试通过联系人名在服务器上查找，如果没有找到则返回错误
			group := NewContact(m.Owner(), username)
			if err := group.Detail(); err == nil {
				return group, nil
			}
			return nil, Error_NoSuchUserFound
		}

		return users.First().Contact, nil
	} else {
		// 如果消息是私聊消息，则从缓存中查找接收者信息，如果没有则返回错误
		contacts, err := m.Owner().Contacts()
		if err != nil {
			return nil, err
		}

		user, exist := contacts.GetByUserName(m.ToUserName)
		if !exist {
			return nil, Error_NoSuchUserFound
		}

		return user, nil
	}
}

// HasFile 判断消息是否为文件类型的消息
func (m *Message) HasFile() bool {
	return m.IsPicture() || m.IsVoice() || m.IsVideo() || m.HasAttachment() || m.IsEmoticon()
}

// HasAttachment 是否有附件
func (m *Message) HasAttachment() bool {
	return m.IsMedia() && m.AppMsgType == AppMessageAttach
}

// GetFile 获取文件消息的文件
func (m *Message) GetFile() (*http.Response, error) {
	if !m.HasFile() {
		return nil, errors.New("invalid message type")
	}

	switch {
	case m.IsPicture() || m.IsEmoticon():
		return m.bot.Caller.WechatClient.GetImageMessageResponse(m.Context(), m, m.bot.Storage.LoginInfo)
	case m.IsVoice():
		return m.bot.Caller.WechatClient.GetVoiceMessageResponse(m.Context(), m, m.bot.Storage.LoginInfo)
	case m.IsVideo():
		return m.bot.Caller.WechatClient.GetVideoMessageResponse(m.Context(), m, m.bot.Storage.LoginInfo)
	case m.IsMedia() && m.AppMsgType == AppMessageAttach:
		return m.bot.Caller.WechatClient.GetMediaMessageResponse(m.Context(), m, m.bot.Storage.LoginInfo)
	default:
		return nil, errors.New("unsupported type")
	}
}

// GetPicture 获取图片消息的响应
func (m *Message) GetPicture() (*http.Response, error) {
	if !(m.IsPicture() || m.IsEmoticon()) {
		return nil, errors.New("picture message required")
	}

	return m.bot.Caller.WechatClient.GetImageMessageResponse(m.Context(), m, m.bot.Storage.LoginInfo)
}

// GetVoice 获取录音消息的响应
func (m *Message) GetVoice() (*http.Response, error) {
	if !m.IsVoice() {
		return nil, errors.New("voice message required")
	}

	return m.bot.Caller.WechatClient.GetVoiceMessageResponse(m.Context(), m, m.bot.Storage.LoginInfo)
}

// GetVideo 获取视频消息的响应
func (m *Message) GetVideo() (*http.Response, error) {
	if !m.IsVideo() {
		return nil, errors.New("video message required")
	}

	return m.bot.Caller.WechatClient.GetVideoMessageResponse(m.Context(), m, m.bot.Storage.LoginInfo)
}

// GetMedia 获取媒体消息的响应
func (m *Message) GetMedia() (*http.Response, error) {
	if !m.IsMedia() {
		return nil, errors.New("media message required")
	}

	return m.bot.Caller.WechatClient.GetMediaMessageResponse(m.Context(), m, m.bot.Storage.LoginInfo)
}

// GetCardMessage 获取card类型
func (m *Message) GetCardMessage() (*CardMessage, error) {
	if !m.IsCard() {
		return nil, errors.New("card message required")
	}

	var card CardMessage
	err := xml.Unmarshal(StringToByte(m.Content), &card)

	return &card, err
}

// GetFriendAddMessage 获取FriendAddMessageContent内容
func (m *Message) GetFriendAddMessage() (*FriendAddMessage, error) {
	if !m.IsFriendAdd() {
		return nil, errors.New("friend add message required")
	}

	var f FriendAddMessage
	err := xml.Unmarshal(StringToByte(m.Content), &f)

	return &f, err
}

// GetRevokeMessage 获取撤回消息的内容
func (m *Message) GetRevokeMessage() (*RevokeMessage, error) {
	if !m.IsRecalled() {
		return nil, errors.New("recalled message required")
	}

	var r RevokeMessage
	err := xml.Unmarshal(StringToByte(m.Content), &r)

	return &r, err
}

// GetAppMessageContent 获取当前App Message的具体内容
func (m *Message) GetAppMessageContent() (*AppMessageContent, error) {
	if !m.IsMedia() {
		return nil, errors.New("media message required")
	}

	var data AppMessageContent
	if err := xml.Unmarshal(StringToByte(m.Content), &data); err != nil {
		return nil, err
	}

	return &data, nil
}

// ReplyText 回复文本消息
func (m *Message) ReplyText(content string) (*SentMessage, error) {
	// 判断是否由自己发送
	username := m.FromUserName
	if m.IsSelfSendToGroup() {
		username = m.ToUserName
	}

	return m.Owner().SendTextToContact(username, content)
}

// ReplyImage 回复图片消息
func (m *Message) ReplyImage(file io.Reader) (*SentMessage, error) {
	// 判断是否由自己发送
	username := m.FromUserName
	if m.IsSelfSendToGroup() {
		username = m.ToUserName
	}

	return m.Owner().SendImageToContact(username, file)
}

// ReplyVideo 回复视频消息
func (m *Message) ReplyVideo(file io.Reader) (*SentMessage, error) {
	// 判断是否由自己发送
	username := m.FromUserName
	if m.IsSelfSendToGroup() {
		username = m.ToUserName
	}

	return m.Owner().SendVideoToContact(username, file)
}

// ReplyFile 回复文件消息
func (m *Message) ReplyFile(file io.Reader) (*SentMessage, error) {
	// 判断是否由自己发送
	username := m.FromUserName
	if m.IsSelfSendToGroup() {
		username = m.ToUserName
	}

	return m.Owner().SendFileToContact(username, file)
}

// IsSendBySelf 判断消息是否由自己发送
// 入参：无
// 出参：
// bool: 如果消息由自己发送，则返回true；否则返回false。
func (m *Message) IsSendBySelf() bool {
	return m.FromUserName == m.Owner().UserName
}

// IsSendByFriend 判断消息是否由好友发送
// 入参：无
// 出参：
// bool: 如果消息由好友发送，则返回true；否则返回false。
func (m *Message) IsSendByFriend() bool {
	return !m.IsSendByGroup() && strings.HasPrefix(m.FromUserName, "@") && !m.IsSendBySelf()
}

// IsSendByGroup 判断消息是否由群组发送
// 入参：无
// 出参：
// bool: 如果消息由群组发送，则返回true；否则返回false。
func (m *Message) IsSendByGroup() bool {
	return strings.HasPrefix(m.FromUserName, "@@") || (m.IsSendBySelf() && strings.HasPrefix(m.ToUserName, "@@"))
}

// IsSelfSendToGroup 判断消息是否由自己发送到群组
// 入参：无
// 出参：
// bool: 如果消息由自己发送到群组，则返回true；否则返回false。
func (m *Message) IsSelfSendToGroup() bool {
	return m.IsSendBySelf() && strings.HasPrefix(m.ToUserName, "@@")
}

// IsText 判断消息是否为文本消息
// 入参：无
// 出参：
// bool: 如果消息类型为文本消息且Url为空，则返回true；否则返回false。
func (m *Message) IsText() bool {
	return m.MsgType == MessageText && m.Url == ""
}

func (m *Message) IsVoice() bool {
	return m.MsgType == MessageVoice
}

func (m *Message) IsVideo() bool {
	return m.MsgType == MessageVideo || m.MsgType == MessageMicroVideo
}

func (m *Message) IsMedia() bool {
	return m.MsgType == MessageApp
}

func (m *Message) IsPicture() bool {
	return m.MsgType == MessageImage
}

func (m *Message) IsLocation() bool {
	return m.MsgType == MessageText && strings.Contains(m.Url, "api.map.qq.com") && strings.Contains(m.Content, "pictype=location")
}

// IsEmoticon 是否为表情包消息
func (m *Message) IsEmoticon() bool {
	return m.MsgType == MessageEmoticon
}

func (m *Message) IsRealtimeLocation() bool {
	return m.IsRealtimeLocationStart() || m.IsRealtimeLocationStop()
}

func (m *Message) IsRealtimeLocationStart() bool {
	return m.MsgType == MessageApp && m.AppMsgType == AppMessageLocation
}

func (m *Message) IsRealtimeLocationStop() bool {
	return m.MsgType == MessageSys && m.Content == "位置共享已经结束"
}

func (m *Message) IsCard() bool {
	return m.MsgType == MessageShareCard
}

func (m *Message) IsNotify() bool {
	return m.MsgType == 51 && m.StatusNotifyCode != 0
}

func (m *Message) IsSystem() bool {
	return m.MsgType == MessageSys
}

// IsRecalled 判断是否撤回
func (m *Message) IsRecalled() bool {
	return m.MsgType == MessageRecalled
}

// IsArticle 判断当前的消息类型是否为文章
func (m *Message) IsArticle() bool {
	return m.AppMsgType == AppMessageUrl
}

func (m *Message) IsFriendAdd() bool {
	return m.MsgType == MessageVerify && m.FromUserName == "fmessage"
}

// IsTransferAccounts 判断当前的消息是不是微信转账
func (m *Message) IsTransferAccounts() bool {
	return m.IsMedia() && m.FileName == "微信转账"
}

// IsSendRedPacket 否发出红包判断当前是
func (m *Message) IsSendRedPacket() bool {
	return m.IsSystem() && m.Content == "发出红包，请在手机上查看"
}

// IsReceiveRedPacket 判断当前是否收到红包
func (m *Message) IsReceiveRedPacket() bool {
	return m.IsSystem() && m.Content == "收到红包，请在手机上查看"
}

// IsRenameGroup 判断当前是否是群组重命名
func (m *Message) IsRenameGroup() bool {
	return m.IsSystem() && strings.Contains(m.Content, "修改群名为")
}

func (m *Message) IsSysNotice() bool {
	return m.MsgType == 9999
}

// IsStatusNotify 判断是否为操作通知消息
func (m *Message) IsStatusNotify() bool {
	return m.MsgType == 51
}

// IsFromGroup 判断消息是否来自群组
// 可能是自己或者别的群员发送
func (m *Message) IsFromGroup() bool {
	return m.IsSendByGroup() || (strings.HasPrefix(m.ToUserName, "@@") && m.IsSendBySelf())
}

func (m *Message) String() string {
	return fmt.Sprintf("<%s:%s>", m.MsgType, m.MsgId)
}

// IsAt 判断消息是否为@消息
func (m *Message) IsAt() bool {
	return m.isAt
}

// IsJoinGroup 判断是否有人加入了群聊
func (m *Message) IsJoinGroup() bool {
	return m.IsSystem() && (strings.Contains(m.Content, "加入了群聊") || strings.Contains(m.Content, "分享的二维码加入群聊")) && m.IsSendByGroup()
}

// IsTickled 判断消息是否为拍一拍
func (m *Message) IsTickled() bool {
	return m.IsSystem() && (strings.Contains(m.Content, "拍了拍") || strings.Contains(m.Content, "拍拍"))
}

// IsTickledMe 判断消息是否拍了拍自己
func (m *Message) IsTickledMe() bool {
	return m.IsSystem() && (strings.Count(m.Content, "拍了拍我") == 1 || strings.Count(m.Content, "拍拍我") == 1)
}

// IsVoipInvite 判断消息是否为语音或视频通话邀请
func (m *Message) IsVoipInvite() bool {
	return m.MsgType == MessageVoipInvite
}

// ================================================= [函数](SentMessage)公开 =================================================

// Revoke 撤回该消息
func (s *SentMessage) Revoke() error {
	return s.self.RevokeMessage(s)
}

// CanRevoke 是否可以撤回该消息
func (s *SentMessage) CanRevoke() bool {
	i, err := strconv.ParseInt(s.ClientMsgId, 10, 64)
	if err != nil {
		return false
	}

	start := time.Unix(i/10000000, 0)

	return time.Since(start) < 2*time.Minute
}

// ForwardToFriends 转发该消息给好友
// 该方法会阻塞直到所有好友都接收到消息
// 这里为了兼容以前的版本，默认休眠0.5秒，如果需要更快的速度，可以使用 SentMessage.ForwardToFriendsWithDelay
func (s *SentMessage) ForwardToFriends(friends ...*Friend) error {
	return s.ForwardToFriendsWithDelay(time.Second/2, friends...)
}

// ForwardToFriendsWithDelay 转发该消息给好友，延迟指定时间
func (s *SentMessage) ForwardToFriendsWithDelay(delay time.Duration, friends ...*Friend) error {
	return s.self.ForwardMessageToFriends(s, delay, friends...)
}

// ForwardToGroups 转发该消息给群组
// 该方法会阻塞直到所有群组都接收到消息
// 这里为了兼容以前的版本，默认休眠0.5秒，如果需要更快的速度，可以使用 SentMessage.ForwardToGroupsDelay
func (s *SentMessage) ForwardToGroups(groups ...*Group) error {
	return s.ForwardToGroupsWithDelay(time.Second/2, groups...)
}

// ForwardToGroupsWithDelay 转发该消息给群组， 延迟指定时间
func (s *SentMessage) ForwardToGroupsWithDelay(delay time.Duration, groups ...*Group) error {
	return s.self.ForwardMessageToGroups(s, delay, groups...)
}

// ================================================= [函数](AppMessage)公开 =================================================

// XmlByte将appmsg结构体转换为XML字节切片
// 参数：
// - f：appmsg结构体
// 返回值：
// - []byte：XML字节切片
// - error：转换过程中可能出现的错误
func (f AppMessage) XmlByte() ([]byte, error) {
	// 使用xml.Marshal将appmsg结构体转换为XML格式的字节切片
	xmlBytes, err := xml.Marshal(f)
	if err != nil {
		return nil, err
	}

	return xmlBytes, nil
}

// IsFromApplet 判断当前的消息类型是否来自小程序
func (a *AppMessageContent) IsFromApplet() bool {
	return a.AppMsg.Appid != ""
}

// IsArticle 判断当前的消息类型是否为文章
func (a *AppMessageContent) IsArticle() bool {
	return a.AppMsg.Type == AppMessageUrl
}

// IsFile 判断当前的消息类型是否为文件
func (a AppMessageContent) IsFile() bool {
	return a.AppMsg.Type == AppMessageAttach
}
