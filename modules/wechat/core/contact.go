package core

import (
	"errors"
	"fmt"
	"html"
	"io"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"
)

// ================================================= [类型](全局)公开 =================================================

// Contact 联系人结构: 好友 群组 公众号
type Contact struct {
	Alias             string   // 别名
	AppAccountFlag    int      // 应用账号标志
	AttrStatus        int64    // 属性状态
	ChatRoomId        int      // 聊天室 ID
	City              string   // 城市
	ContactFlag       int      // 联系人标志
	DisplayName       string   // 显示名称
	EncryChatRoomId   string   // 加密聊天室 ID
	HeadImgFlag       int      // 头像标志
	HeadImgUrl        string   // 头像 URL
	HideInputBarFlag  int      // 隐藏输入栏标志
	IsOwner           int      // 是否是群主
	KeyWord           string   // 关键字
	MemberCount       int      // 成员数量
	NickName          string   // 昵称
	OwnerUin          int      // 群主 Uin
	Province          string   // 省份
	PYInitial         string   // 拼音首字母
	PYQuanPin         string   // 拼音全拼
	RemarkName        string   // 备注名
	RemarkPYInitial   string   // 备注名拼音首字母
	RemarkPYQuanPin   string   // 备注名拼音全拼
	Sex               int      // 性别
	SnsFlag           int      // SNS 标志
	StarFriend        int      // 星标好友标志
	Statues           int      // 状态
	UniFriend         int      // UniFriend
	UserName          string   // 用户名
	Uin               int64    // 用户唯一标识
	VerifyFlag        int      // 验证标志
	WebWxPluginSwitch int      // WebWx 插件开关
	MemberList        Contacts // 成员列表
	self              *Self    // Self 类型
}

// Contacts 联系人结构数组: 好友 群组 公众号
type Contacts []*Contact

// Friend 联系人结构: 好友
type Friend struct {
	*Contact
}

// Friends 联系人结构数组: 好友
type Friends []*Friend

// Group 联系人结构: 群组
type Group struct {
	*Contact
}

// Groups 联系人结构数组: 群组
type Groups []*Group

// MP 联系人结构: 公众号
type MP struct {
	*Contact
}

// MPs 联系人结构数组: 公众号
type MPs []*MP

// ContactUpdater 结构表示联系人更新器，用于管理联系人的更新操作。
type ContactUpdater struct {
	max        int      // max 表示最大数量
	index      int      // index 表示索引
	updateTime int      // updateTime 表示更新时间
	contacts   Contacts // contacts 表示联系人列表
	current    Contacts // current 表示当前联系人列表
	self       *Self    // self 表示自己的信息
}

// Self 类型表示登录账号的信息，包括联系人信息、机器人信息、文件助手、群聊、公众号等。
type Self struct {
	*Contact            // 联系人信息
	fileHelper *Friend  // 文件助手好友
	contacts   Contacts // 群聊成员列表
	friends    Friends  // 好友列表
	groups     Groups   // 群聊列表
	mps        MPs      // 公众号列表
	bot        *Bot     // 机器人信息
}

// SendMessageFunc 是一个函数类型，定义了发送消息的方法。
type SendMessageFunc func() (*SentMessage, error)

// ================================================= [函数](全局)公开 =================================================

// NewContact 是一个用于创建新联系人的函数。
//
// 输入参数：
//   - self: 自身信息，类型为 *Self。
//   - username: 用户名，类型为 string。
//
// 输出参数：
//   - *Contact: 返回创建的联系人。
func NewContact(self *Self, username string) *Contact {
	return &Contact{
		UserName: username,
		self:     self,
	}
}

// NewFriend 函数用于创建一个新的好友对象。
//
// 输入参数：
//   - username: 好友的用户名。
//   - self: 自己的信息。
//
// 输出参数：
//   - *Friend: 返回好友对象的指针。
func NewFriend(username string, self *Self) *Friend {
	return &Friend{Contact: NewContact(self, username)}
}

// 文件传输助手的微信身份标识符永远是filehelper
// NewFileHelper 函数用于创建一个新的文件传输助手对象。(文件传输助手的微信身份标识符永远是filehelper)
//
// 输入参数：
//   - self: 自己的信息。
//
// 输出参数：
//   - *Friend: 返回文件传输助手对象的指针。
func NewFileHelper(self *Self) *Friend {
	return NewFriend(FileHelper, self)
}

// NewMembersUpdater 函数用于创建联系人更新器。
// 输入参数：
//   - contacts: 需要更新的联系人列表。
//
// 输出参数：
//   - *ContactUpdater: 返回联系人更新器的指针。
func NewMembersUpdater(contacts Contacts) *ContactUpdater {
	return &ContactUpdater{
		max:      50,
		contacts: contacts,
	}
}

// ================================================= [函数](Contacts)公开 =================================================

// Uniq 方法用于去重联系人列表中的元素，返回一个新的去重后的联系人列表。
//
// 输入参数：
//   - cs: 要去重的联系人列表。
//
// 输出参数：
//   - Contacts: 去重后的联系人列表。
func (cs Contacts) Uniq() Contacts {
	var uniqContacts = make(map[string]*Contact)
	for _, contact := range cs {
		uniqContacts[contact.UserName] = contact // 将联系人列表中的元素添加到 map 中，使用 UserName 作为 key 进行去重
	}

	var contacts = make(Contacts, 0, len(uniqContacts))
	for _, contact := range uniqContacts {
		contacts = append(contacts, contact) // 将去重后的元素添加到新的联系人列表中
	}

	return contacts
}

// Sort 方法用于对联系人列表进行排序，返回一个新的排序后的联系人列表。
//
// 输入参数：
//   - cs: 要排序的联系人列表。
//
// 输出参数：
//   - Contacts: 排序后的联系人列表。
func (cs Contacts) Sort() Contacts {
	// 使用 OrderSymbol 方法作为比较函数进行排序
	sort.Slice(cs, func(i, j int) bool { return cs[i].OrderSymbol() < cs[j].OrderSymbol() })

	return cs
}

// Count 方法用于计算联系人列表的长度。
//
// 输入参数：
//   - cs: 要计算长度的联系人列表。
//
// 输出参数：
//   - int: 联系人列表的长度。
func (cs Contacts) Count() int {
	return len(cs)
}

// First 方法用于获取联系人列表中的第一个元素。
//
// 输入参数：
//   - cs: 要获取第一个元素的联系人列表。
//
// 输出参数：
//   - *Contact: 联系人列表中的第一个元素，如果列表为空，则返回 nil。
func (cs Contacts) First() *Contact {
	if len(cs) > 0 { // 直接判断长度，无需调用 Count 方法
		return cs[0]
	}

	return nil
}

// Last 方法用于获取联系人列表中的最后一个元素。
//
// 输入参数：
//   - cs: 要获取最后一个元素的联系人列表。
//
// 输出参数：
//   - *Contact: 联系人列表中的最后一个元素，如果列表为空，则返回 nil。
func (cs Contacts) Last() *Contact {
	length := len(cs) // 获取长度，无需调用 Count 方法
	if length > 0 {
		return cs[length-1]
	}

	return nil
}

// _append 方法用于向联系人列表中添加一个新的联系人，并返回更新后的联系人列表。
//
// 输入参数：
//   - cs: 要添加联系人的联系人列表。
//   - contact: 要添加的联系人。
//
// 输出参数：
//   - Contacts: 更新后的联系人列表，包含新添加的联系人。
func (cs Contacts) _append(contact *Contact) Contacts {
	return append(cs, contact) // 直接返回添加新联系人后的列表
}

// Init 方法用于初始化联系人列表。
//
// 输入参数：
//   - self: 自己的信息。
//
// 输出参数：
//   - 无。
func (cs Contacts) Init(self *Self) {
	for _, contact := range cs {
		contact.self = self
		contact.FormatEmoji()
	}
}

// Detail 方法用于获取联系人的详细信息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - error: 如果获取详细信息过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (cs Contacts) Detail() error {
	// 判断联系人数量是否为0
	if cs.Count() == 0 {
		return nil
	}

	updater := NewMembersUpdater(cs)

	updater.Init()

	// 遍历需要更新的联系人
	for updater.Next() {
		// 更新联系人详细信息
		if err := updater.Update(); err != nil {
			return err
		}
	}

	return nil
}

// Friends 方法用于从联系人列表中获取好友列表。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - Friends: 好友列表。
func (cs Contacts) Friends() Friends {
	friends := make(Friends, 0)
	for _, contact := range cs {
		friend, ok := contact.AsFriend()
		if ok {
			friends = append(friends, friend)
		}
	}
	return friends
}

// Groups 方法用于从联系人列表中获取群组列表。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - Groups: 群组列表。
func (cs Contacts) Groups() Groups {
	groups := make(Groups, 0)
	for _, contact := range cs {
		group, ok := contact.AsGroup()
		if ok {
			groups = append(groups, group)
		}
	}
	return groups
}

// MPs 方法用于从联系人列表中获取公众号列表。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - MPs: 公众号列表。
func (cs Contacts) MPs() MPs {
	mps := make(MPs, 0)
	for _, contact := range cs {
		mp, ok := contact.AsMP()
		if ok {
			mps = append(mps, mp)
		}
	}
	return mps
}

// Search 方法用于在联系人列表中根据指定的搜索条件进行搜索，并返回满足条件的联系人列表。
//
// 输入参数：
//   - cs: 要搜索的联系人列表。
//   - limit: 搜索结果的最大数量限制。
//   - searchFuncs: 一个或多个用于定义搜索条件的函数。
//
// 输出参数：
//   - Contacts: 满足搜索条件的联系人列表。
func (cs Contacts) Search(limit int, searchFuncs ...func(contact *Contact) bool) (results Contacts) {
	return Search(cs, limit, func(contact *Contact) bool {
		for _, searchFunc := range searchFuncs {
			if !searchFunc(contact) {
				return false
			}
		}
		return true
	})
}

// SearchByUserName 方法用于根据用户名在联系人列表中进行搜索，返回满足条件的联系人列表。
//
// 输入参数：
//   - cs: 要搜索的联系人列表。
//   - limit: 搜索结果的最大数量限制。
//   - username: 要搜索的用户名。
//
// 输出参数：
//   - Contacts: 满足搜索条件的联系人列表。
func (cs Contacts) SearchByUserName(limit int, username string) Contacts {
	return cs.Search(limit, func(contact *Contact) bool { return contact.UserName == username })
}

// SearchByNickName 方法用于根据昵称在联系人列表中进行搜索，返回满足条件的联系人列表。
//
// 输入参数：
//   - limit: 搜索结果的最大数量限制。
//   - nickName: 要搜索的昵称。
//
// 输出参数：
//   - Contacts: 满足搜索条件的联系人列表。
func (cs Contacts) SearchByNickName(limit int, nickName string) Contacts {
	return cs.Search(limit, func(contact *Contact) bool { return contact.NickName == nickName })
}

// SearchByRemarkName 方法用于根据备注名在联系人列表中进行搜索，返回满足条件的联系人列表。
//
// 输入参数：
//   - limit: 搜索结果的最大数量限制。
//   - remarkName: 要搜索的备注名。
//
// 输出参数：
//   - Contacts: 满足搜索条件的联系人列表。
func (cs Contacts) SearchByRemarkName(limit int, remarkName string) Contacts {
	return cs.Search(limit, func(contact *Contact) bool { return contact.RemarkName == remarkName })
}

// GetByUserName 方法用于根据用户名获取联系人信息。
//
// 输入参数：
//   - username: 要搜索的用户名。
//
// 输出参数：
//   - *Contact: 获取到的联系人信息。
//   - bool: 表示是否成功获取到联系人信息，如果成功返回 true，否则返回 false。
func (cs Contacts) GetByUserName(username string) (*Contact, bool) {
	contacts := cs.SearchByUserName(1, username)
	contact := contacts.First()
	return contact, contact != nil
}

// GetByRemarkName 方法用于根据备注名获取联系人信息。
//
// 输入参数：
//   - remarkName: 要搜索的备注名。
//
// 输出参数：
//   - *Contact: 获取到的联系人信息。
//   - bool: 表示是否成功获取到联系人信息，如果成功返回 true，否则返回 false。
func (cs Contacts) GetByRemarkName(remarkName string) (*Contact, bool) {
	contacts := cs.SearchByRemarkName(1, remarkName)
	contact := contacts.First()
	return contact, contact != nil
}

// GetByNickName 方法用于根据昵称获取联系人信息。
//
// 输入参数：
//   - nickname: 要搜索的昵称。
//
// 输出参数：
//   - *Contact: 获取到的联系人信息。
//   - bool: 表示是否成功获取到联系人信息，如果成功返回 true，否则返回 false。
func (cs Contacts) GetByNickName(nickname string) (*Contact, bool) {
	contacts := cs.SearchByNickName(1, nickname)
	contact := contacts.First()
	return contact, contact != nil
}

// ================================================= [函数](Contact)公开 =================================================

// implement fmt.Stringer
// String 方法根据用户类型返回表示联系人的字符串。
//
// 返回值：
//   - string: 表示该联系人的信息的字符串。
func (c *Contact) String() string {
	format := "User" // 默认格式为"User"

	// 根据联系人类型设置格式
	if c.IsSelf() { // 如果是自己
		format = "Self" // 格式为"Self"
	} else if c.IsFriend() { // 如果是好友
		format = "Friend" // 格式为"Friend"
	} else if c.IsGroup() { // 如果是群组
		format = "Group" // 格式为"Group"
	} else if c.IsMP() { // 如果是公众号
		format = "MP" // 格式为"MP"
	}

	// 返回格式化后的字符串，格式为"<format:昵称>"
	return fmt.Sprintf("<%s:%s>", format, c.NickName)
}

// Self 方法用于获取联系人对应的自身信息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *Self: 返回联系人对应的自身信息。
func (c *Contact) Self() *Self {
	return c.self
}

// Equal 方法用于判断两个联系人对象是否相等。
//
// 输入参数：
//   - contact: 要进行比较的联系人对象。
//
// 输出参数：
//   - bool: 如果两个联系人对象相等，则返回 true；否则返回 false。
func (c *Contact) Equal(contact *Contact) bool {
	// invalid c is not equal to any c
	if c == nil || contact == nil {
		return false
	}

	// not came from same bot
	if c.Self() != contact.Self() {
		return false
	}

	return c.UserName == contact.UserName
}

// Detail 方法用于获取联系人的详细信息。
//
// 返回值：
//   - error: 获取过程中可能出现的错误。
func (c *Contact) Detail() error {
	// 如果联系人的用户名等于自身用户名(返回空，无需进行详细信息获取)
	if c.UserName == c.self.UserName {
		return nil
	}

	// 创建一个包含当前联系人的 Contacts 实例
	contacts := Contacts{c}

	// 调用 Contacts 实例的 Detail 方法获取详细信息
	if err := contacts.Detail(); err != nil {
		return err
	}

	// 将当前 联系人 更新为 Contacts 中的第一个成员
	*c = *contacts.First()

	// 初始化 联系人 的 MemberList
	c.MemberList.Init(c.self)

	// 返回空，表示获取详情信息成功
	return nil
}

// Id 方法用于获取联系人的 ID。(这个值会随着用户更换头像而变化)
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - string: 返回联系人的 ID。
func (c *Contact) Id() string {
	// 首先尝试获取uid
	if c.Uin != 0 {
		return strconv.FormatInt(c.Uin, 10)
	}

	// 如果uid不存在，尝试从头像url中获取
	if c.HeadImgUrl != "" {
		index := strings.Index(c.HeadImgUrl, "?") + 1
		if len(c.HeadImgUrl) > index {
			query := c.HeadImgUrl[index:]
			params, err := url.ParseQuery(query)
			if err != nil {
				return ""
			}
			return params.Get("seq")
		}
	}
	return ""
}

// OrderSymbol 方法用于获取联系人的排序符号。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - string: 返回联系人的排序符号。
func (c *Contact) OrderSymbol() string {
	var symbol string

	// 首先尝试使用备注全拼作为排序符号
	if c.RemarkPYQuanPin != "" {
		symbol = c.RemarkPYQuanPin
	} else if c.PYQuanPin != "" {
		// 如果备注全拼为空，则尝试使用全拼作为排序符号
		symbol = c.PYQuanPin
	} else {
		// 如果全拼也为空，则使用昵称作为排序符号
		symbol = c.NickName
	}

	// 对排序符号进行处理
	symbol = html.UnescapeString(symbol) // 解码 HTML 实体字符

	symbol = strings.ToUpper(symbol) // 转换为大写

	symbol = regexp.MustCompile(`\W`).ReplaceAllString(symbol, "") // 移除非字母数字字符

	// 如果排序符号不为空且首字符不是字母，则返回 "~" 符号，表示放在最后
	if len(symbol) > 0 && symbol[0] < 'A' {
		return "~"
	}

	return symbol
}

// FormatEmoji 方法用于格式化联系人的 Emoji 表情。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func (c *Contact) FormatEmoji() {
	// 格式化联系人的昵称中的 Emoji 表情
	c.NickName = FormatEmoji(c.NickName)

	// 格式化联系人的备注名中的 Emoji 表情
	c.RemarkName = FormatEmoji(c.RemarkName)

	// 格式化联系人的显示名中的 Emoji 表情
	c.DisplayName = FormatEmoji(c.DisplayName)
}

// IsSelf 方法用于判断联系人是否是当前登录账号本人。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果联系人是当前登录账号本人，则返回 true；否则返回 false。
func (c *Contact) IsSelf() bool {
	return c.UserName == c.Self().UserName
}

// IsFriend 方法用于判断联系人是否是好友。
//
// 返回值：
//   - bool: 如果联系人是好友，则返回 true；否则返回 false。
func (c *Contact) IsFriend() bool {
	// 判断条件：
	//   1. 用户不是群组（IsGroup() 方法返回 false）
	//   2. 用户名以 "@" 开头（strings.HasPrefix(c.UserName, "@") 返回 true）
	//   3. 用户的验证标志为 0（user.VerifyFlag == 0）
	return !c.IsGroup() && strings.HasPrefix(c.UserName, "@") && c.VerifyFlag == 0
}

// AsFriend 方法用于将联系人转换为好友对象。
//
// 返回值：
//   - *Friend: 如果联系人是好友，则返回对应的 Friend 对象；否则返回 nil。
//   - bool: 如果联系人是好友，则返回 true；否则返回 false。
func (c *Contact) AsFriend() (*Friend, bool) {
	// 调用 IsFriend 方法判断联系人是否是好友
	if c.IsFriend() {
		// 返回联系人对应的 Friend 对象和 true
		return &Friend{Contact: c}, true
	}

	// 返回 nil 和 false，表示联系人不是好友
	return nil, false
}

// IsGroup 方法用于判断联系人是否为群聊。
//
// 返回值：
//   - bool：如果联系人是群聊，则返回 true；否则返回 false。
func (c *Contact) IsGroup() bool {
	// 判断用户名是否以 "@@" 开头，并且 VerifyFlag 是否为 0
	return strings.HasPrefix(c.UserName, "@@") && c.VerifyFlag == 0
}

// AsGroup 方法用于将联系人转换为群聊对象。
//
// 返回值：
//   - *Group: 如果联系人是群聊，则返回对应的 Group 对象；否则返回 nil。
//   - bool: 如果联系人是群聊，则返回 true；否则返回 false。
func (c *Contact) AsGroup() (*Group, bool) {
	// 调用 IsGroup 方法判断联系人是否是群聊
	if c.IsGroup() {
		// 返回联系人对应的 Group 对象和 true
		return &Group{Contact: c}, true
	}

	// 返回 nil 和 false，表示联系人不是群聊
	return nil, false
}

// IsMP 方法用于判断联系人是否为公众号。
//
// 返回值：
//   - bool：如果联系人是公众号，则返回 true；否则返回 false。
func (c *Contact) IsMP() bool {
	// 判断 VerifyFlag 是否为 8、24 或 136
	return c.VerifyFlag == 8 || c.VerifyFlag == 24 || c.VerifyFlag == 136
}

// AsMP 方法用于将联系人转换为公众号对象。
//
// 返回值：
//   - *MP: 如果联系人是公众号，则返回对应的 MP 对象；否则返回 nil。
//   - bool: 如果联系人是公众号，则返回 true；否则返回 false。
func (c *Contact) AsMP() (*MP, bool) {
	// 调用 IsMP 方法判断联系人是否是公众号
	if c.IsMP() {
		// 返回联系人对应的 MP 对象和 true
		return &MP{Contact: c}, true
	}

	// 返回 nil 和 false，表示联系人不是公众号
	return nil, false
}

// IsPin 判断当前联系人(好友、群组、公众号)是否为置顶状态
// IsPin 方法用于判断用户是否被置顶。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果用户被置顶，则返回 true；否则返回 false。
func (c *Contact) IsPin() bool {
	// 判断 ContactFlag 字段是否等于 2051
	return c.ContactFlag == 2051
}

// Pin 方法用于将联系人(好友、群组、公众号)置顶。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - error: 如果操作成功，则返回 nil；否则返回错误信息。
func (c *Contact) Pin() error {
	// 构造 WechatCallerRelationOplogOption 对象
	option := &WechatCallerRelationOplogOption{
		BaseRequest: c.self.bot.Storage.Request, // 设置 BaseRequest 字段为当前 bot 的 Request
		Contact:     c,                          // 设置 Contact 字段为当前用户
		Op:          1,                          // 设置 Op 字段为 1，表示将用户置顶
	}

	// 调用 Pin 方法进行置顶操作
	return c.self.bot.Caller.Pin(c.Self().Bot().Context(), option)
}

// UnPin 方法用于将联系人(好友、群组、公众号)取消置顶。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - error: 如果操作成功，则返回 nil；否则返回错误信息。
func (c *Contact) UnPin() error {
	// 构造 WechatCallerRelationOplogOption 对象
	option := &WechatCallerRelationOplogOption{
		BaseRequest: c.self.bot.Storage.Request, // 设置 BaseRequest 字段为当前 bot 的 Request
		Contact:     c,                          // 设置 Contact 字段为当前用户
		Op:          0,                          // 设置 Op 字段为 0，表示将用户取消置顶
	}

	// 调用 Pin 方法进行取消置顶操作
	return c.self.bot.Caller.Pin(c.Self().Bot().Context(), option)
}

// GetAvatar 方法用于获取联系人头像的 http.Response。
//
// 返回值：
//   - resp: 获取到的 http.Response 对象。
//   - err: 获取过程中可能出现的错误。
func (c *Contact) GetAvatar() (resp *http.Response, err error) {
	// 进行三次尝试
	for i := 0; i < 3; i++ {
		// 调用 GetHeadImage 方法获取用户头像
		resp, err = c.self.bot.Caller.WechatClient.GetHeadImage(c.Self().Bot().Context(), c)
		if err != nil { // 如果出现了错误
			return nil, err // 直接返回 nil 和错误信息
		}

		// 这里存在 ContentLength 为0的情况，需要重试
		if resp.ContentLength > 0 { // 如果获取到的内容长度大于0
			break // 则退出循环
		}
	}

	// 返回获取到的 Response 对象和错误信息
	return resp, err
}

// SaveAvatar 方法用于将联系人头像保存到指定的文件中。
//
// 返回值：
//   - error: 保存过程中可能出现的错误。
func (c *Contact) SaveAvatar(filename string) error {
	// 创建文件
	file, err := os.Create(filename)
	if err != nil { // 如果创建文件过程中出现错误
		return err // 返回错误信息
	}

	// 在函数返回前关闭文件
	defer func() { _ = file.Close() }()

	// 调用 SaveAvatarWithWriter 方法将头像保存到文件中
	return c.SaveAvatarWithWriter(file)
}

// SaveAvatarWithWriter 方法用于将联系人头像保存到指定的 io.Writer 中。
//
// 返回值：
//   - error: 保存过程中可能出现的错误。
func (c *Contact) SaveAvatarWithWriter(writer io.Writer) error {
	// 调用 GetAvatar 方法获取用户头像
	resp, err := c.GetAvatar()
	if err != nil { // 如果获取过程中出现错误
		return err // 返回错误信息
	}

	// 写文件前判断下 content length 是否是 0，不然保存的头像会出现
	// image not loaded  try to open it externally to fix format problem 问题
	if resp.ContentLength == 0 { // 如果获取到的内容长度为 0
		return errors.New("get avatar response content length is 0") // 返回错误信息：获取到的头像内容长度为 0
	}

	// 在函数返回前关闭 Response 的 Body
	defer func() { _ = resp.Body.Close() }()

	// 将 Response 的 Body 写入到指定的 Writer 中
	_, err = io.Copy(writer, resp.Body)

	// 返回可能出现的错误信息
	return err
}

// ================================================= [函数](ContactUpdater)公开 =================================================

// Init 方法用于初始化联系人更新器。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func (cu *ContactUpdater) Init() {
	// 判断联系人数量是否大于0
	if cu.contacts.Count() > 0 {
		// 获取第一个联系人的自身信息
		cu.self = cu.contacts.First().Self()
	}

	// 判断联系人数量是否小于等于最大数量
	if cu.contacts.Count() <= cu.max {
		// 设置更新时间为1
		cu.updateTime = 1
	} else {
		// 计算更新时间
		cu.updateTime = cu.contacts.Count() / cu.max

		// 若联系人数量不能整除最大数量
		if cu.contacts.Count()%cu.max != 0 {
			// 更新时间加1
			cu.updateTime++
		}
	}
}

// Next 方法用于获取下一个更新的联系人。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果有下一个联系人需要更新，则返回 true；否则返回 false。
func (cu *ContactUpdater) Next() bool {
	// 判断是否已经到达更新时间
	if cu.index >= cu.updateTime {
		return false
	}

	// 更新索引
	cu.index++

	return true
}

// Update 方法用于更新联系人。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - error: 如果更新过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (cu *ContactUpdater) Update() error {
	start := cu.max * (cu.index - 1) // 计算起始位置

	end := cu.max * cu.index // 计算结束位置

	if cu.index == cu.updateTime { // 若已经到达最后一次更新
		end = cu.contacts.Count() // 结束位置为联系人列表的长度
	}

	// 获取需要更新的联系人
	cu.current = cu.contacts[start:end]
	ctx := cu.self.Bot().Context()
	req := cu.self.Bot().Storage.Request
	contacts, err := cu.self.Bot().Caller.BatchGetContact(ctx, cu.current, req)
	if err != nil {
		return err
	}

	// 更新联系人
	for i, member := range contacts {
		member.self = cu.self
		member.FormatEmoji()
		cu.contacts[start+i] = member
	}

	return nil
}

// ================================================= [函数](Self)公开 =================================================

// StorageContacts 方法用于获取联系人列表。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - Contacts: 返回联系人列表。
func (s *Self) StorageContacts() Contacts {
	return s.Bot().Storage.Response.ContactList // 返回机器人存储的联系人列表
}

// StorageMPSubscribeMessages 方法用于获取订阅号消息列表。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - []*MPSubscribeMessageResponse: 返回订阅号消息列表。
func (s *Self) StorageMPSubscribeMessages() []*MPSubscribeMessageResponse {
	return s.Bot().Storage.Response.MPSubscribeMsgList // 返回机器人存储的订阅号消息列表
}

// Id 方法用于获取 Self 对象的标识符。
//
// 输出参数：
//   - int64: 返回 Self 对象的标识符。
func (s *Self) Id() int64 {
	return s.Uin
}

// Bot 返回 Self 对象所属的 Bot 对象。
//
// 入参：
//
//	无。
//
// 返回值：
//   - *Bot：Self 对象所属的 Bot 对象。
func (s *Self) Bot() *Bot {
	return s.bot
}

// IsFriendsGroupsMpsNil 方法用于判断联系人、群组和公众号列表是否都为空。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 如果联系人、群组和公众号列表都为空，则返回 true；否则返回 false。
func (s *Self) IsFriendsGroupsMpsNil() bool {
	return s.friends == nil && s.groups == nil && s.mps == nil
}

// UpdateContacts 方法用于更新用户的联系人列表。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - error: 如果更新过程中出现错误，则返回对应的错误信息；否则返回 nil。
func (s *Self) UpdateContacts() error {
	// 从机器人的存储中获取登录信息
	info := s.bot.Storage.LoginInfo

	// 调用机器人的 GetContact 方法获取联系人列表
	contacts, err := s.bot.Caller.GetContact(s.Bot().Context(), info)
	if err != nil {
		return err
	}

	// 初始化联系人列表，并将其赋值给缓存中的联系人列表
	contacts.Init(s)

	s.contacts = contacts

	return nil
}

// UpdateContactsDetail 方法用于更新联系人详情信息。
//
// 输出参数：
//   - error: 如果更新过程中出现错误，则返回对应的错误信息；否则返回 nil。
func (s *Self) UpdateContactsDetail() error {
	// 先获取所有的联系人
	contacts, err := s.Contacts()
	if err != nil {
		return err
	}

	return contacts.Detail()
}

// Contacts 方法用于获取用户的联系人列表，并可以选择是否强制更新缓存。
//
// 输入参数：
//   - update: 可选参数，类型为 bool。表示是否强制更新缓存，不传则默认为 false。
//
// 输出参数：
//   - Contacts: 返回用户的联系人列表。
//   - error: 如果获取过程中出现错误，则返回对应的错误信息；否则返回 nil。
func (s *Self) Contacts(update ...bool) (Contacts, error) {
	// 首先判断缓存里有没有,如果没有则去更新缓存
	// 判断是否需要更新,如果传入的参数不为nil,则取第一个
	if s.contacts == nil || (len(update) > 0 && update[0]) {
		if err := s.UpdateContacts(); err != nil {
			return nil, err
		}
	}

	s.contacts.Sort()

	return s.contacts, nil
}

// FileHelper 方法用于获取文件传输助手对象的单例实例，如果不存在则创建。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *Friend: 返回文件传输助手对象的指针。

// fh := self.FileHelper() // or fh := core.NewFileHelper(self)
func (s *Self) FileHelper() *Friend {
	// 如果文件传输助手对象为空，则创建新的对象
	if s.fileHelper == nil {
		s.fileHelper = NewFileHelper(s)
	}

	return s.fileHelper
}

// Friends 方法用于获取用户的好友列表。
//
// 输入参数：
//   - update: 可选参数，表示是否强制更新好友列表。如果为 true，则强制更新；否则根据当前缓存情况判断是否需要更新。
//
// 输出参数：
//   - Friends: 返回用户的好友列表。
//   - error: 如果更新过程中出现错误，则返回对应的错误信息；否则返回 nil。
func (s *Self) Friends(update ...bool) (Friends, error) {
	// 如果指定了强制更新参数，或者联系人、群组和公众号列表为空，则先更新联系人列表
	if (len(update) > 0 && update[0]) || s.IsFriendsGroupsMpsNil() {
		if _, err := s.Contacts(true); err != nil {
			return nil, err
		}
	}

	// 如果好友列表为空，或者指定了强制更新参数，则从联系人列表中获取好友列表
	if s.friends == nil || (len(update) > 0 && update[0]) {
		s.friends = s.contacts.Friends()
	}

	return s.friends, nil
}

// Groups 方法用于获取用户所在的群组列表。
//
// 输入参数：
//   - update: 可选参数，表示是否强制更新群组列表。如果为 true，则强制更新；否则根据当前缓存情况判断是否需要更新。
//
// 输出参数：
//   - Groups: 返回用户所在的群组列表。
//   - error: 如果更新过程中出现错误，则返回对应的错误信息；否则返回 nil。
func (s *Self) Groups(update ...bool) (Groups, error) {
	// 如果指定了强制更新参数，或者联系人、群组和公众号列表为空，则先更新联系人列表
	if (len(update) > 0 && update[0]) || s.IsFriendsGroupsMpsNil() {
		if _, err := s.Contacts(true); err != nil {
			return nil, err
		}
	}

	// 如果群组列表为空，或者指定了强制更新参数，则从联系人列表中获取群组列表
	if s.groups == nil || (len(update) > 0 && update[0]) {
		s.groups = s.contacts.Groups()
	}

	return s.groups, nil
}

// MPs 方法用于获取用户关注的公众号列表。
//
// 输入参数：
//   - update: 可选参数，表示是否强制更新公众号列表。如果为 true，则强制更新；否则根据当前缓存情况判断是否需要更新。
//
// 输出参数：
//   - MPs: 返回用户关注的公众号列表。
//   - error: 如果更新过程中出现错误，则返回对应的错误信息；否则返回 nil。
func (s *Self) MPs(update ...bool) (MPs, error) {
	// 如果指定了强制更新参数，或者联系人、群组和公众号列表为空，则先更新联系人列表
	if (len(update) > 0 && update[0]) || s.IsFriendsGroupsMpsNil() {
		if _, err := s.Contacts(true); err != nil {
			return nil, err
		}
	}

	// 如果公众号列表为空，或者指定了强制更新参数，则从联系人列表中获取公众号列表
	if s.mps == nil || (len(update) > 0 && update[0]) {
		s.mps = s.contacts.MPs()
	}

	return s.mps, nil
}

// SendMessageWrapper 方法用于封装发送消息的结果。
//
// 输入参数：
//   - message: 发送消息的消息对象指针。
//   - err: 发送消息过程中可能出现的错误。
//
// 输出参数：
//   - *SentMessage: 返回发送成功的消息对象指针。
//   - error: 如果发送过程出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) SendMessageWrapper(message *SentMessage, err error) (*SentMessage, error) {
	if err != nil {
		return nil, err
	}

	message.self = s

	return message, nil
}

// RevokeMessage 方法用于撤回已发送的消息。
//
// 输入参数：
//   - message: 要撤回的消息对象。
//
// 输出参数：
//   - error: 如果撤回过程中出现错误，则返回对应的错误信息；否则返回 nil。
func (s *Self) RevokeMessage(message *SentMessage) error {
	return s.bot.Caller.RevokeMessage(s.Bot().Context(), message, s.bot.Storage.Request)
}

// ForwardMessageToContacts 方法用于转发消息给指定的联系人。(群发)
//
// 输入参数：
//   - message: 要转发的消息对象。
//   - delay: 转发消息之间的延迟时间。
//   - contacts: 要转发到的联系人列表。
//
// 输出参数：
//   - error: 如果转发过程中出现错误，则返回对应的错误信息；否则返回 nil。
func (s *Self) ForwardMessageToContacts(message *SentMessage, delay time.Duration, contacts ...*Contact) error {
	info := s.bot.Storage.LoginInfo // 获取机器人的登录信息
	req := s.bot.Storage.Request    // 获取机器人的请求存储对象

	ctx := s.Bot().Context() // 获取机器人的上下文

	var forwardFunc func() error

	switch message.Type { // 根据消息类型选择相应的转发方法
	case MessageText:
		forwardFunc = func() error {

			// 构建调用 SendTextMessage 的参数对象
			option := &WechatCallerSendMessageOption{
				BaseRequest:       req,
				LoginInfoResponse: info,
				Message:           message.SendMessage,
			}

			// 调用 SendTextMessage 方法进行消息转发
			_, err := s.bot.Caller.SendTextMessage(ctx, option)

			return err
		}
	case MessageImage:
		forwardFunc = func() error {

			// 构建调用 SendImageMessage 的参数对象
			option := &WechatClientSendMessageOption{
				BaseRequest:       req,
				LoginInfoResponse: info,
				Message:           message.SendMessage,
			}

			// 调用 SendImageMessage 方法进行图片消息转发
			_, err := s.bot.Caller.WechatClient.SendImageMessage(ctx, option)

			return err
		}
	case AppMessageMode:
		forwardFunc = func() error {

			// 调用 SendAppMessage 方法进行应用消息转发
			_, err := s.bot.Caller.WechatClient.SendAppMessage(ctx, message.SendMessage, req)

			return err
		}
	default:
		// 不支持的消息类型，返回错误
		return fmt.Errorf("unsupported message type: %s", message.Type)
	}

	var errGroup []error

	for _, contact := range contacts { // 遍历联系人列表
		message.FromUserName = s.UserName     // 设置消息的发送者
		message.ToUserName = contact.UserName // 设置消息的接收者

		if err := forwardFunc(); err != nil { // 调用相应的转发方法进行消息转发
			errGroup = append(errGroup, err) // 发生错误时将错误添加到错误组中
		}

		time.Sleep(delay) // 根据延迟时间等待
	}

	// 如果错误组中有错误存在
	if len(errGroup) > 0 {
		return errors.Join(errGroup...) // 返回合并后的错误信息
	}
	// 返回 nil 表示没有错误发生
	return nil
}

// ForwardMessageToFriends 方法用于将消息转发给多个好友。
//
// 输入参数：
//   - msg: 要转发的消息对象。
//   - delay: 延迟转发消息的时间间隔。
//   - friends: 要转发消息给的好友列表。
//
// 输出参数：
//   - error: 如果转发过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) ForwardMessageToFriends(msg *SentMessage, delay time.Duration, friends ...*Friend) error {
	contacts := Friends(friends).AsContacts()                  // 将好友列表转换为联系人列表
	return s.ForwardMessageToContacts(msg, delay, contacts...) // 调用 ForwardMessageToContacts 方法将消息转发给联系人列表
}

// ForwardMessageToGroups 方法用于将消息转发给多个群聊。
//
// 输入参数：
//   - msg: 要转发的消息对象。
//   - delay: 延迟转发消息的时间间隔。
//   - groups: 要转发消息给的群聊列表。
//
// 输出参数：
//   - error: 如果转发过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) ForwardMessageToGroups(msg *SentMessage, delay time.Duration, groups ...*Group) error {
	contacts := Groups(groups).AsContacts()                    // 将群聊列表转换为联系人列表
	return s.ForwardMessageToContacts(msg, delay, contacts...) // 调用 ForwardMessageToContacts 方法将消息转发给联系人列表
}

// ForwardMessageToMPs 方法用于将消息转发给多个公众号。
//
// 输入参数：
//   - msg: 要转发的消息对象。
//   - delay: 延迟转发消息的时间间隔。
//   - mps: 要转发消息给的公众号列表。
//
// 输出参数：
//   - error: 如果转发过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) ForwardMessageToMPs(msg *SentMessage, delay time.Duration, mps ...*MP) error {
	contacts := MPs(mps).AsContacts()                          // 将公众号列表转换为联系人列表
	return s.ForwardMessageToContacts(msg, delay, contacts...) // 调用 ForwardMessageToContacts 方法将消息转发给联系人列表
}

// SendMessageToContacts 方法用于向指定联系人发送消息，并延迟一段时间后转发消息给联系人。(群发)
//
// 输入参数：
//   - sendMessageFunc: 发送消息的函数。
//   - delay: 延迟时间。
//   - contacts: 要发送消息的联系人列表。
//
// 输出参数：
//   - error: 如果发送消息或转发消息过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) SendMessageToContacts(sendMessageFunc SendMessageFunc, delay time.Duration, contacts ...*Contact) error {
	if len(contacts) == 0 {
		return nil
	}

	// 调用发送消息的函数
	message, err := sendMessageFunc()
	if err != nil {
		return err
	}

	// 调用 forwardMessage 方法进行消息转发
	return s.ForwardMessageToContacts(message, delay, contacts...)
}

// SendTextToContact 方法用于向指定联系人发送文本消息。
//
// 输入参数：
//   - username: 目标联系人的用户名。
//   - text: 要发送的文本消息内容。
//
// 输出参数：
//   - *SentMessage: 发送成功后返回的消息对象。
//   - error: 如果发送过程中出现错误，则返回对应的错误信息；否则返回 nil。
func (s *Self) SendTextToContact(username, text string) (*SentMessage, error) {
	// 创建文本消息
	message := NewTextMessage(text, s.UserName, username)

	// 构造发送消息的选项
	option := &WechatCallerSendMessageOption{
		BaseRequest:       s.bot.Storage.Request,
		LoginInfoResponse: s.bot.Storage.LoginInfo,
		Message:           message,
	}

	// 调用 SendTextMessage 方法发送消息
	sentMessage, err := s.bot.Caller.SendTextMessage(s.Bot().Context(), option)

	// 调用 sendMessageWrapper 方法处理发送结果
	return s.SendMessageWrapper(sentMessage, err)
}

// SendTextToContacts 方法用于向指定联系人列表发送文本消息，并延迟一段时间后转发消息给剩余联系人。
//
// 输入参数：
//   - text: 要发送的文本消息内容。
//   - delay: 延迟时间。
//   - contacts: 要发送消息的联系人列表。
//
// 输出参数：
//   - error: 如果发送消息或转发消息过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) SendTextToContacts(text string, delay time.Duration, contacts ...*Contact) error {
	if len(contacts) == 0 {
		return nil
	}

	var sendMessageFunc SendMessageFunc = func() (*SentMessage, error) {
		user := contacts[0]                             // 获取第一个联系人
		return s.SendTextToContact(user.UserName, text) // 调用 SendTextToContact 方法发送消息
	}

	return s.SendMessageToContacts(sendMessageFunc, delay, contacts[1:]...) // 调用 SendMessageToContacts 方法进行消息转发
}

// SendImageToContact 方法用于向指定联系人发送图片消息。
//
// 输入参数：
//   - username: 目标联系人的用户名。
//   - file: 要发送的图片文件对象。
//
// 输出参数：
//   - *SentMessage: 发送成功后返回的消息对象。
//   - error: 如果发送过程中出现错误，则返回对应的错误信息；否则返回 nil。
func (s *Self) SendImageToContact(username string, file io.Reader) (*SentMessage, error) {
	// 构造发送图片消息的选项
	option := &WechatCallerSendImageMessageOption{
		Reader:            file,
		BaseRequest:       s.bot.Storage.Request,
		LoginInfoResponse: s.bot.Storage.LoginInfo,
		FromUserName:      s.UserName,
		ToUserName:        username,
	}

	// 调用 SendImageMessage 方法发送图片消息
	sentMessage, err := s.bot.Caller.SendImageMessage(s.Bot().Context(), option)

	// 调用 sendMessageWrapper 方法处理发送结果
	return s.SendMessageWrapper(sentMessage, err)
}

// SendImageToContacts 方法用于向指定联系人列表发送图片消息，并延迟一段时间后转发消息给剩余联系人。
//
// 输入参数：
//   - img: 要发送的图片消息，类型为 io.Reader。
//   - delay: 延迟时间。
//   - contacts: 要发送消息的联系人列表。
//
// 输出参数：
//   - error: 如果发送消息或转发消息过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) SendImageToContacts(img io.Reader, delay time.Duration, contacts ...*Contact) error {
	if len(contacts) == 0 {
		return nil
	}

	var sendMessageFunc SendMessageFunc = func() (*SentMessage, error) {
		user := contacts[0]                             // 获取第一个联系人
		return s.SendImageToContact(user.UserName, img) // 调用 SendImageToContact 方法发送消息
	}

	// 调用 SendMessageToContacts 方法进行消息转发
	return s.SendMessageToContacts(sendMessageFunc, delay, contacts[1:]...)
}

// SendVideoToContact 方法用于向指定联系人发送视频消息。
//
// 输入参数：
//   - username: 目标联系人的用户名。
//   - file: 要发送的视频文件对象。
//
// 输出参数：
//   - *SentMessage: 发送成功后返回的消息对象。
//   - error: 如果发送过程中出现错误，则返回对应的错误信息；否则返回 nil。
func (s *Self) SendVideoToContact(username string, file io.Reader) (*SentMessage, error) {
	// 构造发送视频消息的选项
	option := &WechatCallerSendVideoMessageOption{
		Reader:            file,
		BaseRequest:       s.bot.Storage.Request,
		LoginInfoResponse: s.bot.Storage.LoginInfo,
		FromUserName:      s.UserName,
		ToUserName:        username,
	}

	// 调用 SendVideoMessage 方法发送视频消息
	sentMessage, err := s.bot.Caller.SendVideoMessage(s.Bot().Context(), option)

	// 调用 sendMessageWrapper 方法处理发送结果
	return s.SendMessageWrapper(sentMessage, err)
}

// SendVideoToContacts 方法用于向指定联系人列表发送视频消息，并延迟一段时间后转发消息给剩余联系人。
//
// 输入参数：
//   - video: 要发送的视频消息，类型为 io.Reader。
//   - delay: 延迟时间。
//   - contacts: 要发送消息的联系人列表。
//
// 输出参数：
//   - error: 如果发送消息或转发消息过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) SendVideoToContacts(video io.Reader, delay time.Duration, contacts ...*Contact) error {
	if len(contacts) == 0 {
		return nil
	}

	var sendMessageFunc SendMessageFunc = func() (*SentMessage, error) {
		user := contacts[0]                               // 获取第一个联系人
		return s.SendVideoToContact(user.UserName, video) // 调用 SendVideoToContact 方法发送消息
	}

	return s.SendMessageToContacts(sendMessageFunc, delay, contacts[1:]...) // 调用 SendMessageToContacts 方法进行消息转发
}

// SendFileToContact 方法用于向指定联系人发送文件消息。
//
// 输入参数：
//   - username: 目标联系人的用户名。
//   - file: 要发送的文件对象。
//
// 输出参数：
//   - *SentMessage: 发送成功后返回的消息对象。
//   - error: 如果发送过程中出现错误，则返回对应的错误信息；否则返回 nil。
func (s *Self) SendFileToContact(username string, file io.Reader) (*SentMessage, error) {
	// 构造发送文件消息的选项
	option := &WechatCallerSendFileMessageOption{
		Reader:            file,
		BaseRequest:       s.bot.Storage.Request,
		LoginInfoResponse: s.bot.Storage.LoginInfo,
		FromUserName:      s.UserName,
		ToUserName:        username,
	}

	// 调用 SendFileMessage 方法发送文件消息
	sentMessage, err := s.bot.Caller.SendFileMessage(s.Bot().Context(), option)

	// 调用 sendMessageWrapper 方法处理发送结果
	return s.SendMessageWrapper(sentMessage, err)
}

// SendFileToContacts 方法用于向指定联系人列表发送文件消息，并延迟一段时间后转发消息给剩余联系人。
//
// 输入参数：
//   - file: 要发送的文件消息，类型为 io.Reader。
//   - delay: 延迟时间。
//   - contacts: 要发送消息的联系人列表。
//
// 输出参数：
//   - error: 如果发送消息或转发消息过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) SendFileToContacts(file io.Reader, delay time.Duration, contacts ...*Contact) error {
	if len(contacts) == 0 {
		return nil
	}

	var sendMessageFunc SendMessageFunc = func() (*SentMessage, error) {
		user := contacts[0]                             // 获取第一个联系人
		return s.SendFileToContact(user.UserName, file) // 调用 SendFileToContact 方法发送消息
	}

	return s.SendMessageToContacts(sendMessageFunc, delay, contacts[1:]...) // 调用 SendMessageToContacts 方法进行消息转发
}

// SendTextToFriend 方法用于向好友发送文本消息。
//
// 输入参数：
//   - friend: 好友对象。
//   - text: 要发送的文本内容。
//
// 输出参数：
//   - *SentMessage: 发送成功后返回的消息对象。
//   - error: 如果发送过程中出现错误，则返回对应的错误信息；否则返回 nil。
func (s *Self) SendTextToFriend(friend *Friend, text string) (*SentMessage, error) {
	// 调用 SendTextToContact 方法发送文本消息，并将好友的用户名作为目标用户的用户名
	return s.SendTextToContact(friend.Contact.UserName, text)
}

// SendTextToFriends 方法用于向好友发送文本消息。
//
// 输入参数：
//   - text: 要发送的文本消息内容。
//   - delay: 延迟发送文本消息的时间间隔。
//   - friends: 要发送文本消息的好友列表。
//
// 输出参数：
//   - error: 如果发送过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) SendTextToFriends(text string, delay time.Duration, friends ...*Friend) error {
	contacts := Friends(friends).AsContacts()             // 将好友列表转换为联系人列表
	return s.SendTextToContacts(text, delay, contacts...) // 调用 SendTextToContacts 方法发送文本消息给联系人列表
}

// SendImageToFriend 方法用于向好友发送图片消息。
//
// 输入参数：
//   - friend: 好友对象。
//   - file: 要发送的图片文件对象。
//
// 输出参数：
//   - *SentMessage: 发送成功后返回的消息对象。
//   - error: 如果发送过程中出现错误，则返回对应的错误信息；否则返回 nil。
func (s *Self) SendImageToFriend(friend *Friend, file io.Reader) (*SentMessage, error) {
	// 调用 SendImageToContact 方法发送图片消息，并将好友的用户名作为目标联系人的用户名
	return s.SendImageToContact(friend.Contact.UserName, file)
}

// SendImageToFriends 方法用于向好友发送图片。
//
// 输入参数：
//   - img: 图片的 io.Reader 对象。
//   - delay: 延迟发送图片的时间间隔。
//   - friends: 要发送图片的好友列表。
//
// 输出参数：
//   - error: 如果发送图片过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) SendImageToFriends(img io.Reader, delay time.Duration, friends ...*Friend) error {
	contacts := Friends(friends).AsContacts()             // 将好友列表转换为联系人列表
	return s.SendImageToContacts(img, delay, contacts...) // 调用 SendImageToContacts 方法发送图片给联系人列表
}

// SendVideoToFriend 方法用于向好友发送视频消息。
//
// 输入参数：
//   - friend: 好友对象。
//   - file: 要发送的视频文件对象。
//
// 输出参数：
//   - *SentMessage: 发送成功后返回的消息对象。
//   - error: 如果发送过程中出现错误，则返回对应的错误信息；否则返回 nil。
func (s *Self) SendVideoToFriend(friend *Friend, file io.Reader) (*SentMessage, error) {
	// 调用 SendVideoToContact 方法发送视频消息，并将好友的用户名作为目标联系人的用户名
	return s.SendVideoToContact(friend.Contact.UserName, file)
}

// SendVideoToFriends 方法用于向好友发送视频。
//
// 输入参数：
//   - video: 视频的 io.Reader 对象。
//   - delay: 延迟发送视频的时间间隔。
//   - friends: 要发送视频的好友列表。
//
// 输出参数：
//   - error: 如果发送视频过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) SendVideoToFriends(video io.Reader, delay time.Duration, friends ...*Friend) error {
	contacts := Friends(friends).AsContacts()               // 将好友列表转换为联系人列表
	return s.SendVideoToContacts(video, delay, contacts...) // 调用 SendVideoToContacts 方法发送视频给联系人列表
}

// SendFileToFriend 方法用于向好友发送文件消息。
//
// 输入参数：
//   - friend: 好友对象。
//   - file: 要发送的文件对象。
//
// 输出参数：
//   - *SentMessage: 发送成功后返回的消息对象。
//   - error: 如果发送过程中出现错误，则返回对应的错误信息；否则返回 nil。
func (s *Self) SendFileToFriend(friend *Friend, file io.Reader) (*SentMessage, error) {
	// 调用 SendFileToContact 方法发送文件消息，并将好友的用户名作为目标联系人的用户名
	return s.SendFileToContact(friend.Contact.UserName, file)
}

// SendFileToFriends 方法用于向好友发送文件。
//
// 输入参数：
//   - file: 文件的 io.Reader 对象。
//   - delay: 延迟发送文件的时间间隔。
//   - friends: 要发送文件的好友列表。
//
// 输出参数：
//   - error: 如果发送文件过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) SendFileToFriends(file io.Reader, delay time.Duration, friends ...*Friend) error {
	contacts := Friends(friends).AsContacts()             // 将好友列表转换为联系人列表
	return s.SendFileToContacts(file, delay, contacts...) // 调用 SendFileToContacts 方法发送文件给联系人列表
}

// SendTextToGroup 方法用于向群聊发送文本消息。
//
// 输入参数：
//   - group: 群聊对象。
//   - text: 要发送的文本消息内容。
//
// 输出参数：
//   - *SentMessage: 如果发送成功，则返回发送的消息对象；否则返回 nil。
//   - error: 如果发送过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) SendTextToGroup(group *Group, text string) (*SentMessage, error) {
	return s.SendTextToContact(group.Contact.UserName, text) // 调用 SendTextToContact 方法向指定联系人发送文本消息
}

// SendTextToGroups 方法用于向多个群聊发送文本消息。
//
// 输入参数：
//   - text: 要发送的文本消息内容。
//   - delay: 延迟发送文本消息的时间间隔。
//   - groups: 要发送文本消息的群聊列表。
//
// 输出参数：
//   - error: 如果发送过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) SendTextToGroups(text string, delay time.Duration, groups ...*Group) error {
	contacts := Groups(groups).AsContacts()               // 将群聊列表转换为联系人列表
	return s.SendTextToContacts(text, delay, contacts...) // 调用 SendTextToContacts 方法发送文本消息给联系人列表
}

// SendImageToGroup 方法用于向群聊发送图片消息。
//
// 输入参数：
//   - group: 群聊对象。
//   - file: 图片文件的 io.Reader 对象。
//
// 输出参数：
//   - *SentMessage: 如果发送成功，则返回发送的消息对象；否则返回 nil。
//   - error: 如果发送过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) SendImageToGroup(group *Group, file io.Reader) (*SentMessage, error) {
	return s.SendImageToContact(group.Contact.UserName, file) // 调用 SendImageToContact 方法向指定联系人发送图片消息
}

// SendImageToGroups 方法用于向多个群聊发送图片消息。
//
// 输入参数：
//   - img: 要发送的图片文件的 io.Reader 对象。
//   - delay: 延迟发送图片消息的时间间隔。
//   - groups: 要发送图片消息的群聊列表。
//
// 输出参数：
//   - error: 如果发送过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) SendImageToGroups(img io.Reader, delay time.Duration, groups ...*Group) error {
	contacts := Groups(groups).AsContacts()               // 将群聊列表转换为联系人列表
	return s.SendImageToContacts(img, delay, contacts...) // 调用 SendImageToContacts 方法发送图片消息给联系人列表
}

// SendVideoToGroup 方法用于向群聊发送视频消息。
//
// 输入参数：
//   - group: 群聊对象。
//   - file: 视频文件的 io.Reader 对象。
//
// 输出参数：
//   - *SentMessage: 如果发送成功，则返回发送的消息对象；否则返回 nil。
//   - error: 如果发送过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) SendVideoToGroup(group *Group, file io.Reader) (*SentMessage, error) {
	return s.SendVideoToContact(group.Contact.UserName, file) // 调用 SendVideoToContact 方法向指定联系人发送视频消息
}

// SendVideoToGroups 方法用于向多个群聊发送视频消息。
//
// 输入参数：
//   - video: 要发送的视频文件的 io.Reader 对象。
//   - delay: 延迟发送视频消息的时间间隔。
//   - groups: 要发送视频消息的群聊列表。
//
// 输出参数：
//   - error: 如果发送过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) SendVideoToGroups(video io.Reader, delay time.Duration, groups ...*Group) error {
	contacts := Groups(groups).AsContacts()                 // 将群聊列表转换为联系人列表
	return s.SendVideoToContacts(video, delay, contacts...) // 调用 SendVideoToContacts 方法发送视频消息给联系人列表
}

// SendFileToGroup 方法用于向群聊发送文件消息。
//
// 输入参数：
//   - group: 群聊对象。
//   - file: 文件的 io.Reader 对象。
//
// 输出参数：
//   - *SentMessage: 如果发送成功，则返回发送的消息对象；否则返回 nil。
//   - error: 如果发送过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) SendFileToGroup(group *Group, file io.Reader) (*SentMessage, error) {
	return s.SendFileToContact(group.Contact.UserName, file) // 调用 SendFileToContact 方法向指定联系人发送文件消息
}

// SendFileToGroups 方法用于向多个群聊发送文件消息。
//
// 输入参数：
//   - file: 要发送的文件的 io.Reader 对象。
//   - delay: 延迟发送文件消息的时间间隔。
//   - groups: 要发送文件消息的群聊列表。
//
// 输出参数：
//   - error: 如果发送过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) SendFileToGroups(file io.Reader, delay time.Duration, groups ...*Group) error {
	contacts := Groups(groups).AsContacts()               // 将群聊列表转换为联系人列表
	return s.SendFileToContacts(file, delay, contacts...) // 调用 SendFileToContacts 方法发送文件消息给联系人列表
}

// SendTextToMP 方法用于向公众号发送文本消息。
//
// 输入参数：
//   - mp: 公众号对象。
//   - text: 需要发送的文本消息内容。
//
// 输出参数：
//   - *SentMessage: 返回发送成功的消息对象指针。
//   - error: 如果发送过程出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) SendTextToMP(mp *MP, text string) (*SentMessage, error) {
	return s.SendTextToContact(mp.Contact.UserName, text)
}

func (s *Self) SendTextToMPs(text string, delay time.Duration, mps ...*MP) error {
	contacts := MPs(mps).AsContacts()                     // 将公众号列表转换为联系人列表
	return s.SendTextToContacts(text, delay, contacts...) // 调用 SendTextToContacts 方法发送文本消息给联系人列表
}

// SendImageToMP 方法用于向公众号发送图片消息。
//
// 输入参数：
//   - mp: 公众号对象。
//   - file: 图片文件对象。
//
// 输出参数：
//   - *SentMessage: 返回发送成功的消息对象指针。
//   - error: 如果发送过程出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) SendImageToMP(mp *MP, file io.Reader) (*SentMessage, error) {
	return s.SendImageToContact(mp.Contact.UserName, file)
}

func (s *Self) SendImageToMPs(file io.Reader, delay time.Duration, mps ...*MP) error {
	contacts := MPs(mps).AsContacts()                      // 将公众号列表转换为联系人列表
	return s.SendImageToContacts(file, delay, contacts...) // 调用 SendImageToContacts 方法发送图片消息给联系人列表
}

// SendVideoToMP 方法用于向公众号发送视频消息。
//
// 输入参数：
//   - mp: 公众号对象。
//   - file: 视频文件对象。
//
// 输出参数：
//   - *SentMessage: 返回发送成功的消息对象指针。
//   - error: 如果发送过程出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) SendVideoToMP(mp *MP, file io.Reader) (*SentMessage, error) {
	return s.SendVideoToContact(mp.Contact.UserName, file)
}

func (s *Self) SendVideoToMPs(file io.Reader, delay time.Duration, mps ...*MP) error {
	contacts := MPs(mps).AsContacts()                      // 将公众号列表转换为联系人列表
	return s.SendVideoToContacts(file, delay, contacts...) // 调用 SendVideoToContacts 方法发送视频消息给联系人列表
}

// SendFileToMP 方法用于向公众号发送文件消息。
//
// 输入参数：
//   - mp: 公众号对象。
//   - file: 文件对象。
//
// 输出参数：
//   - *SentMessage: 返回发送成功的消息对象指针。
//   - error: 如果发送过程出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) SendFileToMP(mp *MP, file io.Reader) (*SentMessage, error) {
	return s.SendFileToContact(mp.Contact.UserName, file)
}

func (s *Self) SendFileToMPs(file io.Reader, delay time.Duration, mps ...*MP) error {
	contacts := MPs(mps).AsContacts()                     // 将公众号列表转换为联系人列表
	return s.SendFileToContacts(file, delay, contacts...) // 调用 SendFileToContacts 方法发送文件消息给联系人列表
}

// SetRemarkNameToFriend 方法用于向指定好友设置备注名。
//
// 输入参数：
//   - friend: 要设置备注名的好友对象。
//   - remarkName: 备注名。
//
// 输出参数：
//   - error: 如果设置备注名过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) SetRemarkNameToFriend(friend *Friend, remarkName string) error {
	option := &WechatCallerOplogOption{
		BaseRequest: s.bot.Storage.Request,
		ToUserName:  friend.UserName,
		RemarkName:  remarkName,
	}

	// 调用 Oplog 方法设置备注名
	err := s.bot.Caller.Oplog(s.Bot().Context(), option)
	if err == nil {
		friend.RemarkName = remarkName // 如果设置成功，则更新好友对象的备注名
	}

	return err
}

// CreateGroup 方法用于创建一个群组。
//
// 输入参数：
//   - topic: 群组的主题。(群昵称)
//   - friends: 参与群组的好友列表。
//
// 输出参数：
//   - *Group: 如果群组创建成功，则返回创建的群组对象；否则返回 nil。
//   - error: 如果创建群组过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) CreateGroup(topic string, friends ...*Friend) (*Group, error) {
	friends = Friends(friends).Uniq() // 去重好友列表

	// 如果好友数量不足2人，则返回错误信息
	if len(friends) < 2 {
		return nil, errors.New("a group must be at least 2 contacts")
	}

	option := &WechatCallerCreateChatRoomOption{
		BaseRequest:       s.bot.Storage.Request,
		LoginInfoResponse: s.bot.Storage.LoginInfo,
		Topic:             topic,
		Friends:           friends,
	}

	// 调用 CreateChatRoom 方法创建群组
	group, err := s.bot.Caller.CreateChatRoom(s.Bot().Context(), option)
	if err != nil {
		return nil, err
	}

	group.self = s

	if err = group.Detail(); err != nil {
		return nil, err
	}

	// 添加到群组列表
	s.groups = append(s.groups, group)

	return group, nil
}

// RenameGroup 方法用于修改群组的名称。
//
// 输入参数：
//   - group: 要修改名称的群组对象。
//   - newName: 新的群组名称。
//
// 输出参数：
//   - error: 如果修改群组名称过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) RenameGroup(group *Group, newName string) error {
	webWxRenameChatRoomOptions := &WechatCallerRenameChatRoomOption{
		BaseRequest:       s.bot.Storage.Request,
		LoginInfoResponse: s.bot.Storage.LoginInfo,
		Group:             group,
		NewTopic:          newName,
	}

	err := s.bot.Caller.RenameChatRoom(s.Bot().Context(), webWxRenameChatRoomOptions) // 调用 RenameChatRoom 方法修改群组名称
	if err == nil {
		group.NickName = newName // 如果修改群组名称成功，则更新群组对象的名称
	}

	return err // 返回修改群组名称的结果
}

// AddFriendsToGroup 方法用于将指定好友添加到指定群组中。(最好自己是群主,成功率高一点,因为有的群允许非群组拉人,而有的群不允许)
//
// 输入参数：
//   - group: 要添加好友的群组对象。
//   - friends: 要添加到群组中的好友列表。
//
// 输出参数：
//   - error: 如果添加好友到群组过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) AddFriendsToGroup(group *Group, friends ...*Friend) error {
	// 如果好友列表为空，则直接返回 nil
	if len(friends) == 0 {
		return nil
	}

	// 去重好友列表
	friends = Friends(friends).Uniq()

	// 获取群的所有的群员
	groupMembers, err := group.Contacts()
	if err != nil {
		return err
	}

	// 判断当前的成员在不在群里面
	for _, friend := range friends {
		for _, member := range groupMembers {
			if member.UserName == friend.UserName {
				return fmt.Errorf("user %s has alreay in this group", friend.String()) // 如果好友已经在群里面，则返回错误信息
			}
		}
	}

	option := &WechatCallerAddContactToChatRoomOption{
		BaseRequest:       s.bot.Storage.Request,
		LoginInfoResponse: s.bot.Storage.LoginInfo,
		Group:             group,
		GroupLength:       groupMembers.Count(),
		Friends:           friends,
	}

	// 调用 AddContactToChatRoom 方法将好友添加到群组中
	return s.bot.Caller.AddContactToChatRoom(s.Bot().Context(), option)
}

// AddFriendToGroups 方法用于将指定好友添加到指定群组列表中。
//
// 输入参数：
//   - friend: 要添加到群组中的好友对象。
//   - groups: 要添加好友的群组列表。
//
// 输出参数：
//   - error: 如果添加好友到群组过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) AddFriendToGroups(friend *Friend, groups ...*Group) error {
	// 去重群组列表
	groups = Groups(groups).Uniq()

	for _, group := range groups {
		// 调用 AddFriendsToGroup 方法将好友添加到群组中
		if err := s.AddFriendsToGroup(group, friend); err != nil {
			return err // 如果添加好友到群组过程中出现错误，则直接返回相应的错误信息
		}
	}

	// 添加好友到群组成功，返回 nil
	return nil
}

// RemoveContactsFromGroup 方法用于从指定群组中移除指定的成员。
//
// 输入参数：
//   - group: 要移除成员的群组对象。
//   - contacts: 要移除的成员列表。
//
// 输出参数：
//   - error: 如果移除成员过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (s *Self) RemoveContactsFromGroup(group *Group, contacts Contacts) error {
	// 如果成员列表为空，则直接返回 nil
	if len(contacts) == 0 {
		return nil
	}

	// 如果群组不是当前用户所有，则返回错误信息
	if group.IsOwner == 0 {
		return errors.New("group owner required")
	}

	groupMembers, err := group.Contacts()
	if err != nil {
		return err
	}

	// 判断用户是否在群聊中
	var count int
	for _, member := range contacts {
		for _, gm := range groupMembers {
			if gm.UserName == member.UserName {
				count++
			}
		}
	}

	// 如果有成员不在群聊中，则返回错误信息
	if count != len(contacts) {
		return errors.New("invalid contacts")
	}

	option := &WechatCallerRemoveContactFromChatRoomOption{
		BaseRequest:       s.bot.Storage.Request,
		LoginInfoResponse: s.bot.Storage.LoginInfo,
		Group:             group,
		Contacts:          contacts,
	}

	// 调用 RemoveContactToChatRoom 方法将成员从群组中移除
	return s.bot.Caller.RemoveContactToChatRoom(s.Bot().Context(), option)
}
