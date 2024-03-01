package wechatbot

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
	"path/filepath"
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
	*SendMessage // 发送的消息

	self *Self // 自己

	MsgId string // 消息ID
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

// NewTextMessage 函数用于创建一个新的文本消息。
//
// 输入参数：
//   - content string: 消息内容。
//   - fromUserName string: 发送者用户名。
//   - toUserName string: 接收者用户名。
//
// 输出参数：
//   - *SendMessage: 返回一个新的 SendMessage 实例。
func NewTextMessage(content, fromUserName, toUserName string) *SendMessage {
	return NewSendMessage(MessageText, content, fromUserName, toUserName, "")
}

// NewMediaMessage 函数用于创建一个新的多媒体消息。
//
// 输入参数：
//   - msgType MessageType: 消息类型。
//   - fromUserName string: 发送者用户名。
//   - toUserName string: 接收者用户名。
//   - mediaId string: 多媒体 ID。
//
// 输出参数：
//   - *SendMessage: 返回一个新的 SendMessage 实例。
func NewMediaMessage(msgType MessageType, fromUserName, toUserName, mediaId string) *SendMessage {
	return NewSendMessage(msgType, "", fromUserName, toUserName, mediaId)
}

// NewAppMessage 函数用于创建一个新的应用消息。
//
// 输入参数：
//   - stat os.FileInfo: 文件信息对象。
//   - attachId string: 附件 ID。
//
// 输出参数：
//   - *AppMessage: 返回一个新的 AppMessage 实例。
func NewAppMessage(stat os.FileInfo, attachId string) *AppMessage {
	message := &AppMessage{AppId: AppMessageAppId, Title: stat.Name()}

	message.Type = AppMessageMode
	message.Attachment.AttachId = attachId
	message.Attachment.TotalLen = stat.Size()
	message.Attachment.FileExt = FileExtension(stat.Name())

	return message
}

// ================================================= [函数](Message)公开 =================================================

// Set 方法用于向消息对象中设置指定键的值。
//
// 输入参数：
//   - key string: 要设置的键名。
//   - value interface{}: 要设置的值。
func (message *Message) Set(key string, value interface{}) {
	message.mu.Lock() // 加锁

	defer message.mu.Unlock() // 延迟解锁

	if message.item == nil {
		message.item = make(map[string]interface{})
	}

	message.item[key] = value
}

// Get 方法用于从消息对象中获取指定键的值。
//
// 输入参数：
//   - key string: 要获取值的键名。
//
// 输出参数：
//   - value interface{}: 获取到的值。
//   - exist bool: 指定键是否存在，存在则为 true，否则为 false。
func (message *Message) Get(key string) (value interface{}, exist bool) {
	message.mu.RLock() // 加读锁

	defer message.mu.RUnlock() // 延迟释放读锁

	value, exist = message.item[key]

	return
}

// String 方法用于返回消息的字符串表示形式。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - string: 消息的字符串表示形式。
func (message *Message) String() string {
	return fmt.Sprintf("<%s:%s>", message.MsgType, message.MsgId)
}

// SaveFile 方法用于将消息中的文件保存到指定的 Writer 中。
//
// 输入参数：
//   - writer io.Writer: 要保存文件的 Writer。
//
// 输出参数：
//   - error: 如果保存文件出错，则返回相应的错误；否则返回 nil。
func (message *Message) SaveFile(writer io.Writer) error {
	resp, err := message.GetFile()
	if err != nil {
		return err
	}

	defer func() { _ = resp.Body.Close() }()

	_, err = io.Copy(writer, resp.Body)

	return err
}

// SaveFileToLocal 方法用于将消息中的文件保存到本地指定的文件中。
//
// 输入参数：
//   - filename string: 要保存文件的本地文件名。
//
// 输出参数：
//   - error: 如果保存文件到本地出错，则返回相应的错误；否则返回 nil。
func (message *Message) SaveFileToLocal(filename string) error {
	// 创建目录
	err := os.MkdirAll(filepath.Dir(filename), os.ModePerm)
	if err != nil {
		return err
	}

	file, err := os.Create(filename)
	if err != nil {
		return err
	}

	defer func() { _ = file.Close() }()

	return message.SaveFile(file)
}

// Init 方法用于初始化消息对象。
//
// 输入参数：
//   - bot *Bot: 消息所属的机器人。
//
// 输出参数：
//   - 无。
func (message *Message) Init(bot *Bot) {
	// 设置bot属性
	message.bot = bot

	// 将消息序列化并保存到Raw字段中
	raw, _ := json.Marshal(message)

	message.Raw = raw
	message.RawContent = message.Content

	// 如果是群消息
	if message.IsSendByGroup() {
		if !message.IsSystem() {
			// 将Username和正文分开
			if !message.IsSendBySelf() {
				data := strings.Split(message.Content, ":<br/>")

				message.Content = strings.Join(data[1:], "") // 只保留正文内容
				message.senderUserNameInGroup = data[0]      // 保存发送者的Username

				if strings.Contains(message.Content, "@") { // 判断是否为@消息
					sender, err := message.Sender()
					if err == nil {

						// 获取群成员列表，搜索收件人信息
						receiver := sender.MemberList.SearchByUserName(1, message.ToUserName)
						if receiver != nil {
							displayName := receiver.First().DisplayName
							if displayName == "" {
								displayName = receiver.First().NickName
							}

							var atFlag string
							msgContent := FormatEmoji(message.Content) // 处理消息中的emoji表情
							atName := FormatEmoji(displayName)         // 处理@的群成员显示名字

							if strings.Contains(msgContent, "\u2005") {
								atFlag = "@" + atName + "\u2005" // 处理@消息时，要加上空格字符"\u2005"
							} else {
								atFlag = "@" + atName
							}

							message.isAt = strings.Contains(msgContent, atFlag) || strings.HasSuffix(msgContent, atFlag) // 判断是否@了收件人
						}
					}
				}
			} else {
				// 如果是由自己发送的消息，且包含@字符或空格字符"\u2005"，则认为是@消息
				message.isAt = strings.Contains(message.Content, "@") || strings.Contains(message.Content, "\u2005")
			}
		}
	}

	// 处理消息中的换行
	message.Content = strings.Replace(message.Content, `<br/>`, "\n", -1)

	// 处理html转义字符
	message.Content = html.UnescapeString(message.Content)

	// 处理消息中的emoji表情
	message.Content = FormatEmoji(message.Content)
}

// Bot 方法用于获取消息所属的机器人对象。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *Bot: 返回消息所属的机器人对象指针。
func (message *Message) Bot() *Bot {
	return message.bot
}

// Owner 方法用于获取消息所属的机器人的 Self 对象。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *Self: 返回机器人的 Self 对象指针。
func (message *Message) Owner() *Self {
	return message.Bot().self
}

// Context 方法用于获取消息的上下文对象。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - context.Context: 返回消息的上下文对象。
func (message *Message) Context() context.Context {
	if message.context == nil {
		return message.Bot().Context()
	}
	return message.context
}

// WithContext 方法用于设置消息的上下文对象。
//
// 输入参数：
//   - ctx context.Context: 要设置的上下文对象。
//
// 输出参数：
//   - 无。
func (message *Message) WithContext(ctx context.Context) {
	if ctx == nil {
		panic("nil context")
	}
	message.context = ctx
}

// Sender 方法用于获取消息的发送者信息。
//
// 输入参数：
//   - args: 可选参数，用于替换默认的发送者用户名。
//
// 输出参数：
//   - *Contact: 发送者的联系人对象。
//   - error: 发生的错误（如果有）。
func (message *Message) Sender(args ...string) (*Contact, error) {
	// 如果消息是自己发送的，则返回消息所属联系人对象
	if message.IsSendBySelf() && len(args) == 0 {
		return message.Owner().Contact, nil
	}

	userName := message.FromUserName
	if len(args) > 0 && args[0] != "" {
		userName = args[0]
	}

	// 尝试从缓存中查找发送者信息
	contacts, err := message.bot.self.Contacts()
	if err != nil {
		return nil, err
	}

	user, exist := contacts.GetByUserName(userName)
	if !exist {
		// 如果缓存中没有发送者信息，则从服务器获取
		user = NewFriend(userName, message.Owner()).Contact
		err = user.Detail()
	}

	// 如果消息来自群聊，并且发送者信息中的成员列表为空，则再次从服务器获取
	if message.IsSendByGroup() && len(user.MemberList) == 0 {
		err = user.Detail()
	}

	// 返回发送者信息和可能出现的错误
	return user, err
}

// SenderInGroup 方法用于获取群聊消息的发送者信息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *Contact: 返回群聊消息的发送者联系人对象指针。
//   - error: 返回可能出现的错误。
func (message *Message) SenderInGroup() (*Contact, error) {
	// 如果消息不是来自群聊，则返回错误
	if !message.IsFromGroup() {
		return nil, errors.New("message is not from group")
	}

	// 处理拍一拍系列的系统消息
	if message.IsSystem() {
		// 判断是否是自己发送的系统消息
		if message.IsSendBySelf() {
			return message.Owner().Contact, nil
		}
		return nil, errors.New("can not found sender from system message")
	}

	// 获取发送者信息
	user, err := message.Sender()
	if err != nil {
		return nil, err
	}

	// 如果发送者是好友，则直接返回发送者信息
	if user.IsFriend() {
		return user, nil
	}

	// 如果发送者是群聊中的成员，则通过联系人名在群聊中查找对应的成员信息
	group := &Group{user}

	return group.SearchContactByUsername(message.senderUserNameInGroup)
}

// Agree 方法用于同意添加好友请求，并返回新添加的好友信息。
//
// 输入参数：
//   - verifyContents []string: 验证内容列表，可选参数，用于验证添加好友的信息。
//
// 输出参数：
//   - *Friend: 返回新添加的好友对象指针。
//   - error: 返回可能出现的错误。
func (message *Message) Agree(verifyContents ...string) (*Friend, error) {
	if !message.IsFriendAdd() {
		return nil, errors.New("friend add message required")
	}

	option := &CallerVerifyUserRequest{
		BaseRequest:       message.bot.Storage.Request,
		LoginInfoResponse: message.bot.Storage.LoginInfo,
		VerifyContent:     strings.Join(verifyContents, ""),
		RecommendInfo:     message.RecommendInfo,
	}

	err := message.bot.Caller.VerifyUser(message.Context(), option)
	if err != nil {
		return nil, err
	}

	friend := NewFriend(message.RecommendInfo.UserName, message.Owner())
	if err = friend.Detail(); err != nil {
		return nil, err
	}

	return friend, nil
}

// ToRead 方法用于将消息标记为已读状态。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - error: 返回可能出现的错误。
func (message *Message) ToRead() error {
	option := &CallerStatusToReadRequest{
		BaseRequest:       message.bot.Storage.Request,
		LoginInfoResponse: message.bot.Storage.LoginInfo,
		Message:           message,
	}

	return message.bot.Caller.StatusToRead(message.Context(), option)
}

// Receiver 方法用于获取消息的接收者联系人对象。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *Contact：消息的接收者联系人对象指针。
//   - error：可能出现的错误。
func (message *Message) Receiver() (*Contact, error) {
	// 如果消息是系统消息或者发送到自己，则返回自己联系人对象
	if message.IsSystem() || message.ToUserName == message.bot.self.UserName {
		return message.bot.self.Contact, nil
	}

	// 如果消息是发送给文件助手，则返回文件助手联系人对象
	if message.ToUserName == FileHelper {
		return message.Owner().FileHelper().Contact, nil
	}

	// 如果消息是群聊消息
	if message.IsSendByGroup() {
		// 从联系人所在的所有群聊中查找成员信息
		groups, err := message.Owner().Groups()
		if err != nil {
			return nil, err
		}

		// 根据消息的来源或目标联系人名查找对应的群聊成员信息
		username := message.FromUserName
		if message.IsSendBySelf() {
			username = message.ToUserName
		}

		users := groups.SearchByUserName(1, username)
		if users.Count() == 0 {
			// 如果在所有群聊中都没有找到对应的成员信息，则尝试通过联系人名在服务器上查找，如果没有找到则返回错误
			group := NewContact(message.Owner(), username)
			if err := group.Detail(); err == nil {
				return group, nil
			}
			return nil, Error_NoSuchUserFound
		}

		return users.First().Contact, nil
	} else {
		// 如果消息是私聊消息，则从缓存中查找接收者信息，如果没有则返回错误
		contacts, err := message.Owner().Contacts()
		if err != nil {
			return nil, err
		}

		user, exist := contacts.GetByUserName(message.ToUserName)
		if !exist {
			return nil, Error_NoSuchUserFound
		}

		return user, nil
	}
}

// HasFile 方法用于判断消息是否包含文件类型的内容。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool：如果消息包含文件类型的内容，则返回 true；否则返回 false。
func (message *Message) HasFile() bool {
	return message.IsPicture() || message.IsVoice() || message.IsVideo() || message.HasAttachment() || message.IsEmoticon()
}

// HasAttachment 方法用于判断消息是否包含附件类型的内容。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool：如果消息包含附件类型的内容，则返回 true；否则返回 false。
func (message *Message) HasAttachment() bool {
	return message.IsMedia() && message.AppMsgType == AppMessageAttach
}

// GetFile 方法用于根据消息类型获取相应的文件内容。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *http.Response：文件内容对应的 HTTP 响应对象指针。
//   - error：可能出现的错误。
func (message *Message) GetFile() (*http.Response, error) {
	if !message.HasFile() {
		return nil, errors.New("invalid message type")
	}

	switch {
	case message.IsPicture() || message.IsEmoticon():
		return message.bot.Caller.WechatClient.GetImageMessageResponse(message.Context(), message, message.bot.Storage.LoginInfo)
	case message.IsVoice():
		return message.bot.Caller.WechatClient.GetVoiceMessageResponse(message.Context(), message, message.bot.Storage.LoginInfo)
	case message.IsVideo():
		return message.bot.Caller.WechatClient.GetVideoMessageResponse(message.Context(), message, message.bot.Storage.LoginInfo)
	case message.IsMedia() && message.AppMsgType == AppMessageAttach:
		return message.bot.Caller.WechatClient.GetMediaMessageResponse(message.Context(), message, message.bot.Storage.LoginInfo)
	default:
		return nil, errors.New("unsupported type")
	}
}

// GetPicture 方法用于获取图片类型的消息对应的图片内容。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *http.Response：图片内容对应的 HTTP 响应对象指针。
//   - error：可能出现的错误。
func (message *Message) GetPicture() (*http.Response, error) {
	if !(message.IsPicture() || message.IsEmoticon()) {
		return nil, errors.New("picture message required")
	}

	return message.bot.Caller.WechatClient.GetImageMessageResponse(message.Context(), message, message.bot.Storage.LoginInfo)
}

// GetVoice 方法用于获取语音类型的消息对应的语音内容。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *http.Response：语音内容对应的 HTTP 响应对象指针。
//   - error：可能出现的错误。
func (message *Message) GetVoice() (*http.Response, error) {
	if !message.IsVoice() {
		return nil, errors.New("voice message required")
	}

	return message.bot.Caller.WechatClient.GetVoiceMessageResponse(message.Context(), message, message.bot.Storage.LoginInfo)
}

// GetVideo 方法用于获取视频类型的消息对应的视频内容。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *http.Response：视频内容对应的 HTTP 响应对象指针。
//   - error：可能出现的错误。
func (message *Message) GetVideo() (*http.Response, error) {
	if !message.IsVideo() {
		return nil, errors.New("video message required")
	}

	return message.bot.Caller.WechatClient.GetVideoMessageResponse(message.Context(), message, message.bot.Storage.LoginInfo)
}

// GetMedia 方法用于获取媒体类型的消息对应的媒体内容。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *http.Response：媒体内容对应的 HTTP 响应对象指针。
//   - error：可能出现的错误。
func (message *Message) GetMedia() (*http.Response, error) {
	if !message.IsMedia() {
		return nil, errors.New("media message required")
	}

	return message.bot.Caller.WechatClient.GetMediaMessageResponse(message.Context(), message, message.bot.Storage.LoginInfo)
}

// GetCardMessage 方法用于从消息中获取卡片消息类型的内容并将其解析为 CardMessage 结构体。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *CardMessage：解析后的卡片消息结构体指针。
//   - error：可能出现的错误。
func (message *Message) GetCardMessage() (*CardMessage, error) {
	if !message.IsCard() {
		return nil, errors.New("card message required")
	}

	var card CardMessage
	err := xml.Unmarshal(StringToByte(message.Content), &card)

	return &card, err
}

// GetFriendAddMessage 方法用于从消息中获取好友添加类型的内容并将其解析为 FriendAddMessage 结构体。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *FriendAddMessage：解析后的好友添加消息结构体指针。
//   - error：可能出现的错误。
func (message *Message) GetFriendAddMessage() (*FriendAddMessage, error) {
	if !message.IsFriendAdd() {
		return nil, errors.New("friend add message required")
	}

	var f FriendAddMessage
	err := xml.Unmarshal(StringToByte(message.Content), &f)

	return &f, err
}

// GetRevokeMessage 方法用于从消息中获取撤回类型的内容并将其解析为 RevokeMessage 结构体。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *RevokeMessage：解析后的撤回消息结构体指针。
//   - error：可能出现的错误。
func (message *Message) GetRevokeMessage() (*RevokeMessage, error) {
	if !message.IsRecalled() {
		return nil, errors.New("recalled message required")
	}

	var r RevokeMessage
	err := xml.Unmarshal(StringToByte(message.Content), &r)

	return &r, err
}

// GetAppMessageContent 方法用于从媒体消息中获取应用消息类型的内容并将其解析为 AppMessageContent 结构体。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *AppMessageContent：解析后的应用消息内容结构体指针。
//   - error：可能出现的错误。
func (message *Message) GetAppMessageContent() (*AppMessageContent, error) {
	if !message.IsMedia() {
		return nil, errors.New("media message required")
	}

	var data AppMessageContent
	if err := xml.Unmarshal(StringToByte(message.Content), &data); err != nil {
		return nil, err
	}

	return &data, nil
}

// ReplyText 方法用于回复文本消息。
//
// 输入参数：
//   - content：回复的文本内容。
//
// 输出参数：
//   - *SentMessage：发送的消息结构体指针。
//   - error：可能出现的错误。
func (message *Message) ReplyText(content string) (*SentMessage, error) {
	// 判断是否由自己发送
	username := message.FromUserName
	if message.IsSelfSendToGroup() {
		username = message.ToUserName
	}

	return message.Owner().SendTextToContact(username, content)
}

// ReplyImage 方法用于回复图片消息。
//
// 输入参数：
//   - file：包含要发送的图片数据的 io.Reader。
//
// 输出参数：
//   - *SentMessage：发送的消息结构体指针。
//   - error：可能出现的错误。
func (message *Message) ReplyImage(file io.Reader) (*SentMessage, error) {
	// 判断是否由自己发送
	username := message.FromUserName
	if message.IsSelfSendToGroup() {
		username = message.ToUserName
	}

	return message.Owner().SendImageToContact(username, file)
}

// ReplyVideo 方法用于回复视频消息。
//
// 输入参数：
//   - file：包含要发送的视频数据的 io.Reader。
//
// 输出参数：
//   - *SentMessage：发送的消息结构体指针。
//   - error：可能出现的错误。
func (message *Message) ReplyVideo(file io.Reader) (*SentMessage, error) {
	// 判断是否由自己发送
	username := message.FromUserName
	if message.IsSelfSendToGroup() {
		username = message.ToUserName
	}

	return message.Owner().SendVideoToContact(username, file)
}

// ReplyFile 方法用于回复文件消息。
//
// 输入参数：
//   - file：包含要发送的文件数据的 io.Reader。
//
// 输出参数：
//   - *SentMessage：发送的消息结构体指针。
//   - error：可能出现的错误。
func (message *Message) ReplyFile(file io.Reader) (*SentMessage, error) {
	// 判断是否由自己发送
	username := message.FromUserName
	if message.IsSelfSendToGroup() {
		username = message.ToUserName
	}

	return message.Owner().SendFileToContact(username, file)
}

// IsSendBySelf 方法用于判断消息是否由当前用户发送。
//
// 返回值：
//   - bool：如果消息由当前用户发送，则返回 true，否则返回 false。
func (message *Message) IsSendBySelf() bool {
	return message.FromUserName == message.Owner().UserName
}

// IsSendByFriend 方法用于判断消息是否由朋友（非群组）发送。
//
// 返回值：
//   - bool：如果消息由朋友发送，则返回 true，否则返回 false。
func (message *Message) IsSendByFriend() bool {
	return !message.IsSendByGroup() && strings.HasPrefix(message.FromUserName, "@") && !message.IsSendBySelf()
}

// IsSendByGroup 方法用于判断消息是否由群组发送。
//
// 返回值：
//   - bool：如果消息由群组发送，则返回 true，否则返回 false。
func (message *Message) IsSendByGroup() bool {
	return strings.HasPrefix(message.FromUserName, "@@") || (message.IsSendBySelf() && strings.HasPrefix(message.ToUserName, "@@"))
}

// IsSelfSendToGroup 方法用于判断消息是否由自己发送给群组。
//
// 返回值：
//   - bool：如果消息由自己发送给群组，则返回 true，否则返回 false。
func (message *Message) IsSelfSendToGroup() bool {
	return message.IsSendBySelf() && strings.HasPrefix(message.ToUserName, "@@")
}

// IsText 方法用于判断消息是否为文本消息且不包含 URL。
//
// 返回值：
//   - bool：如果消息为文本消息且不包含 URL，则返回 true，否则返回 false。
func (message *Message) IsText() bool {
	return message.MsgType == MessageText && message.Url == ""
}

// IsVoice 方法用于判断消息是否为语音消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为语音消息，则返回 true；否则返回 false。
func (message *Message) IsVoice() bool {
	return message.MsgType == MessageVoice
}

// IsVideo 方法用于判断消息是否为视频消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为视频消息，则返回 true；否则返回 false。
func (message *Message) IsVideo() bool {
	return message.MsgType == MessageVideo || message.MsgType == MessageMicroVideo
}

// IsMedia 方法用于判断消息是否为媒体消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为媒体消息，则返回 true；否则返回 false。
func (message *Message) IsMedia() bool {
	return message.MsgType == MessageApp
}

// IsPicture 方法用于判断消息是否为图片消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为图片消息，则返回 true；否则返回 false。
func (message *Message) IsPicture() bool {
	return message.MsgType == MessageImage
}

// IsLocation 方法用于判断消息是否为位置消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为位置消息，则返回 true；否则返回 false。
func (message *Message) IsLocation() bool {
	return message.MsgType == MessageText && strings.Contains(message.Url, "api.map.qq.com") && strings.Contains(message.Content, "pictype=location")
}

// IsEmoticon 方法用于判断消息是否为表情包消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为表情包消息，则返回 true；否则返回 false。
func (message *Message) IsEmoticon() bool {
	return message.MsgType == MessageEmoticon
}

// IsRealtimeLocation 方法用于判断消息是否为实时位置消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为实时位置消息，则返回 true；否则返回 false。
func (message *Message) IsRealtimeLocation() bool {
	return message.IsRealtimeLocationStart() || message.IsRealtimeLocationStop()
}

// IsRealtimeLocationStart 方法用于判断消息是否为实时位置分享开始消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为实时位置分享开始消息，则返回 true；否则返回 false。
func (message *Message) IsRealtimeLocationStart() bool {
	return message.MsgType == MessageApp && message.AppMsgType == AppMessageLocation
}

// IsRealtimeLocationStop 方法用于判断消息是否为实时位置分享结束消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为实时位置分享结束消息，则返回 true；否则返回 false。
func (message *Message) IsRealtimeLocationStop() bool {
	return message.MsgType == MessageSys && message.Content == "位置共享已经结束"
}

// IsCard 方法用于判断消息是否为名片消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为名片消息，则返回 true；否则返回 false。
func (message *Message) IsCard() bool {
	return message.MsgType == MessageShareCard
}

// IsNotify 方法用于判断消息是否为通知消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为通知消息，则返回 true；否则返回 false。
func (message *Message) IsNotify() bool {
	return message.MsgType == 51 && message.StatusNotifyCode != 0
}

// IsSystem 方法用于判断消息是否为系统消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为系统消息，则返回 true；否则返回 false。
func (message *Message) IsSystem() bool {
	return message.MsgType == MessageSys
}

// IsRecalled 方法用于判断消息是否为撤回消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为撤回消息，则返回 true；否则返回 false。
func (message *Message) IsRecalled() bool {
	return message.MsgType == MessageRecalled
}

// IsArticle 方法用于判断消息是否为文章消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为文章消息，则返回 true；否则返回 false。
func (message *Message) IsArticle() bool {
	return message.AppMsgType == AppMessageUrl
}

// IsFriendAdd 方法用于判断消息是否为好友添加消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为好友添加消息，则返回 true；否则返回 false。
func (message *Message) IsFriendAdd() bool {
	return message.MsgType == MessageVerify && message.FromUserName == "fmessage"
}

// IsTransferAccounts 方法用于判断消息是否为微信转账消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为微信转账消息，则返回 true；否则返回 false。
func (message *Message) IsTransferAccounts() bool {
	return message.IsMedia() && message.FileName == "微信转账"
}

// IsSendRedPacket 方法用于判断消息是否为发出红包通知。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为发出红包通知，则返回 true；否则返回 false。
func (message *Message) IsSendRedPacket() bool {
	return message.IsSystem() && message.Content == "发出红包，请在手机上查看"
}

// IsReceiveRedPacket 方法用于判断消息是否为收到红包通知。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为收到红包通知，则返回 true；否则返回 false。
func (message *Message) IsReceiveRedPacket() bool {
	return message.IsSystem() && message.Content == "收到红包，请在手机上查看"
}

// IsRenameGroup 方法用于判断消息是否为群组重命名消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为群组重命名消息，则返回 true；否则返回 false。
func (message *Message) IsRenameGroup() bool {
	return message.IsSystem() && strings.Contains(message.Content, "修改群名为")
}

// IsSysNotice 方法用于判断消息是否为系统通知消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为系统通知消息，则返回 true；否则返回 false。
func (message *Message) IsSysNotice() bool {
	return message.MsgType == 9999
}

// IsStatusNotify 方法用于判断消息是否为操作通知消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为操作通知消息，则返回 true；否则返回 false。
func (message *Message) IsStatusNotify() bool {
	return message.MsgType == 51
}

// IsFromGroup 方法用于判断消息是否来自群组。
// 可能是自己或者别的群员发送。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息来自群组，则返回 true；否则返回 false。
func (message *Message) IsFromGroup() bool {
	return message.IsSendByGroup() || (strings.HasPrefix(message.ToUserName, "@@") && message.IsSendBySelf())
}

// IsAt 方法用于判断消息是否为@消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为@消息，则返回 true；否则返回 false。
func (message *Message) IsAt() bool {
	return message.isAt
}

// IsJoinGroup 方法用于判断是否有人加入了群聊。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果有人加入群聊，则返回 true；否则返回 false。
func (message *Message) IsJoinGroup() bool {
	return message.IsSystem() && (strings.Contains(message.Content, "加入了群聊") || strings.Contains(message.Content, "分享的二维码加入群聊")) && message.IsSendByGroup()
}

// IsTickled 方法用于判断消息是否为拍一拍消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为拍一拍消息，则返回 true；否则返回 false。
func (message *Message) IsTickled() bool {
	return message.IsSystem() && (strings.Contains(message.Content, "拍了拍") || strings.Contains(message.Content, "拍拍"))
}

// IsTickledMe 方法用于判断消息是否为拍了拍自己的消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为拍了拍自己的消息，则返回 true；否则返回 false。
func (message *Message) IsTickledMe() bool {
	return message.IsSystem() && (strings.Count(message.Content, "拍了拍我") == 1 || strings.Count(message.Content, "拍拍我") == 1)
}

// IsVoipInvite 方法用于判断消息是否为语音或视频通话邀请消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息为语音或视频通话邀请消息，则返回 true；否则返回 false。
func (message *Message) IsVoipInvite() bool {
	return message.MsgType == MessageVoipInvite
}

// ================================================= [函数](SentMessage)公开 =================================================

// Revoke 方法用于撤回已发送消息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - error: 如果操作成功，则返回 nil；否则返回相应的错误信息。
func (s *SentMessage) Revoke() error {
	// 调用外部对象的 RevokeMessage 方法进行消息撤回操作
	return s.self.RevokeMessage(s)
}

// CanRevoke 方法用于判断消息是否可以被撤回。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果消息可以被撤回，则返回 true；否则返回 false。
func (s *SentMessage) CanRevoke() bool {
	// 将 ClientMsgId 转换为 int64 类型
	i, err := strconv.ParseInt(s.ClientMsgId, 10, 64)
	if err != nil {
		return false
	}

	// 将时间戳转换为时间对象
	start := time.Unix(i/10000000, 0)

	// 判断消息发送时间距离当前时间是否小于2分钟
	return time.Since(start) < 2*time.Minute
}

// ForwardToFriends 方法用于将消息转发给指定的好友列表。(该方法会阻塞直到所有好友都接收到消息)
//
// 输入参数：
//   - friends: 好友列表，类型为可变参数，表示可以传入任意数量的 Friend 指针对象。
//
// 输出参数：
//   - error: 如果操作成功，则返回 nil；否则返回相应的错误信息。
func (s *SentMessage) ForwardToFriends(friends ...*Friend) error {
	// 调用带有延迟时间的 ForwardToFriendsWithDelay 方法，默认延迟时间为 0.5 秒
	return s.ForwardToFriendsWithDelay(time.Second/2, friends...)
}

// ForwardToFriendsWithDelay 方法用于将消息延迟一定时间后转发给指定的好友列表。
//
// 输入参数：
//   - delay: 延迟时间，类型为 time.Duration，表示消息转发的延迟时间。
//   - friends: 好友列表，类型为可变参数，表示可以传入任意数量的 Friend 指针对象。
//
// 输出参数：
//   - error: 如果操作成功，则返回 nil；否则返回相应的错误信息。
func (s *SentMessage) ForwardToFriendsWithDelay(delay time.Duration, friends ...*Friend) error {
	// 调用外部对象的 ForwardMessageToFriends 方法进行消息转发操作
	return s.self.ForwardMessageToFriends(s, delay, friends...)
}

// ForwardToGroups 方法用于将消息转发给指定的群组列表。(该方法会阻塞直到所有群组都接收到消息)
//
// 输入参数：
//   - groups: 群组列表，类型为可变参数，表示可以传入任意数量的 Group 指针对象。
//
// 输出参数：
//   - error: 如果操作成功，则返回 nil；否则返回相应的错误信息。
func (s *SentMessage) ForwardToGroups(groups ...*Group) error {
	// 调用带有延迟时间的 ForwardToGroupsWithDelay 方法，默认延迟时间为 0.5 秒
	return s.ForwardToGroupsWithDelay(time.Second/2, groups...)
}

// ForwardToGroupsWithDelay 方法用于将消息延迟一定时间后转发给指定的群组列表。
//
// 输入参数：
//   - delay: 延迟时间，类型为 time.Duration，表示消息转发的延迟时间。
//   - groups: 群组列表，类型为可变参数，表示可以传入任意数量的 Group 指针对象。
//
// 输出参数：
//   - error: 如果操作成功，则返回 nil；否则返回相应的错误信息。
func (s *SentMessage) ForwardToGroupsWithDelay(delay time.Duration, groups ...*Group) error {
	// 调用外部对象的 ForwardMessageToGroups 方法进行消息转发操作
	return s.self.ForwardMessageToGroups(s, delay, groups...)
}

// ================================================= [函数](AppMessage)公开 =================================================

// XmlByte 方法用于将 AppMessage 结构体转换为 XML 格式的字节切片。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - []byte: 表示转换后的 XML 格式的字节切片。
//   - error: 如果操作成功，则返回 nil；否则返回相应的错误信息。
func (f AppMessage) XmlByte() ([]byte, error) {
	// 使用 xml.Marshal 将 appmsg 结构体转换为 XML 格式的字节切片
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
