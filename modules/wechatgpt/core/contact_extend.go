package core

import (
	"fmt"
	"io"
	"math/rand"
	"time"
)

// ================================================= [函数](全局)公开 =================================================

// Search 方法用于在联系人列表中进行搜索。
//
// 输入参数：
//   - contacts Contacts: 联系人列表。
//   - limit int: 搜索结果的最大数量限制，如果为 0 或负数则表示没有限制。
//   - searchHandler func(*Contact) bool: 用于判断是否符合搜索条件的函数。
//
// 输出参数：
//   - results Contacts: 匹配搜索条件的联系人列表。
func Search(contacts Contacts, limit int, searchHandler func(*Contact) bool) (results Contacts) {
	// 如果 limit 小于等于 0，则将 limit 设置为搜索列表的总数
	if limit <= 0 {
		limit = contacts.Count()
	}

	// 遍历搜索列表中的每个成员
	for _, contact := range contacts {
		// 如果结果数量已达到限制，则结束循环
		if results.Count() == limit {
			break
		}

		// 调用 searchHandler 判断当前成员是否符合搜索条件，并将符合条件的成员加入到结果列表中
		if searchHandler(contact) {
			results = append(results, contact)
		}
	}

	return
}

// ================================================= [函数](Friends)公开 =================================================

// Count 方法用于获取好友列表的成员数量。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - int: 好友列表的成员数量。
func (fs Friends) Count() int {
	// 返回好友列表的长度，即成员数量
	return len(fs)
}

// Sort 方法用于对好友列表按照特定规则进行排序。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - Friends: 排序后的好友列表。
func (fs Friends) Sort() Friends {
	// 调用 AsContacts 方法将好友列表转换为通讯录，再调用 Sort 方法对通讯录进行排序，最后调用 Friends 方法将排序后的通讯录转换回好友列表
	return fs.AsContacts().Sort().Friends()
}

// Uniq 方法用于对好友列表进行去重操作。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - Friends: 去重后的好友列表。
func (fs Friends) Uniq() Friends {
	// 调用 AsContacts 方法将好友列表转换为通讯录，再调用 Uniq 方法对通讯录进行去重操作，最后调用 Friends 方法将去重后的通讯录转换回好友列表
	return fs.AsContacts().Uniq().Friends()
}

// First 方法用于获取好友列表中第一个好友的指针。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *Friend: 好友列表中第一个好友的指针，如果好友列表为空，则返回 nil。
func (fs Friends) First() *Friend {
	if fs.Count() > 0 {
		// 如果好友列表不为空，则调用 Sort 方法对好友列表进行排序，并返回排序后的第一个成员
		return fs.Sort()[0]
	}

	// 如果好友列表为空，则返回 nil
	return nil
}

// Last 方法用于获取好友列表中最后一个好友的指针。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *Friend: 好友列表中最后一个好友的指针，如果好友列表为空，则返回 nil。
func (fs Friends) Last() *Friend {
	if fs.Count() > 0 {
		// 如果好友列表不为空，则调用 Sort 方法对好友列表进行排序，并返回排序后的最后一个成员
		return fs.Sort()[fs.Count()-1]
	}

	// 如果好友列表为空，则返回 nil
	return nil
}

// AsContacts 方法用于将好友列表转换为通讯录。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - Contacts: 转换后的通讯录。
func (fs Friends) AsContacts() Contacts {
	// 创建一个空的通讯录 contacts，并遍历好友列表，将每个好友的联系方式添加到 contacts 中
	var contacts = make(Contacts, 0, fs.Count())

	for _, friend := range fs {
		contacts = append(contacts, friend.Contact)
	}

	return contacts
}

// BroadcastTextToFriendsByRandomTime 方法用于随机时间向好友群发文本消息。
//
// 输入参数：
//   - message string: 要发送的文本消息内容。
//
// 输出参数：
//   - error: 发送过程中遇到的错误，如果没有错误则返回 nil。
func (fs Friends) BroadcastTextToFriendsByRandomTime(message string) error {
	for _, friend := range fs {
		time.Sleep(time.Duration(rand.Intn(10)) * time.Second) // 随机休眠0-10秒

		if _, err := friend.SendText(message); err != nil {
			return err
		}
	}

	return nil
}

// Search 方法用于在好友列表中进行搜索。
//
// 输入参数：
//   - limit int: 搜索结果的最大数量。
//   - searchHandlers ...func(friend *Friend) bool: 用于判断好友是否符合搜索条件的函数列表。
//
// 输出参数：
//   - Friends: 符合搜索条件的好友列表。
func (fs Friends) Search(limit int, searchHandlers ...func(friend *Friend) bool) Friends {
	// 将好友列表转换为通讯录，并调用通讯录的 Search 方法进行搜索
	return fs.AsContacts().Search(limit, func(contact *Contact) bool {
		var friend = &Friend{contact}

		for _, searchHandler := range searchHandlers {
			if !searchHandler(friend) {
				return false
			}
		}

		return true
	}).Friends()
}

// SearchById 方法用于根据好友ID搜索好友列表中的好友。
//
// 输入参数：
//   - id string: 要搜索的好友ID。
//
// 输出参数：
//   - Friends: 包含符合条件的好友的好友列表。
func (fs Friends) SearchById(id string) Friends {
	// 调用 Search 方法，以好友ID为搜索条件进行搜索，并返回符合条件的好友列表
	return fs.Search(1, func(friend *Friend) bool { return friend.Contact.Id() == id })
}

// SearchByUserName 方法用于根据好友用户名搜索好友列表中的好友。
//
// 输入参数：
//   - limit int: 搜索结果的最大数量。
//   - username string: 要搜索的好友用户名。
//
// 输出参数：
//   - Friends: 包含符合条件的好友的好友列表。
func (fs Friends) SearchByUserName(limit int, username string) Friends {
	// 调用 Search 方法，以好友用户名为搜索条件进行搜索，并返回符合条件的好友列表
	return fs.Search(limit, func(friend *Friend) bool { return friend.Contact.UserName == username })
}

// SearchByNickName 方法用于根据好友昵称搜索好友列表中的好友。
//
// 输入参数：
//   - limit int: 搜索结果的最大数量。
//   - nickName string: 要搜索的好友昵称。
//
// 输出参数：
//   - Friends: 包含符合条件的好友的好友列表。
func (fs Friends) SearchByNickName(limit int, nickName string) Friends {
	// 调用 Search 方法，以好友昵称为搜索条件进行搜索，并返回符合条件的好友列表
	return fs.Search(limit, func(friend *Friend) bool { return friend.Contact.NickName == nickName })
}

// SearchByRemarkName 方法用于根据好友备注名搜索好友列表中的好友。
//
// 输入参数：
//   - limit int: 搜索结果的最大数量。
//   - remarkName string: 要搜索的好友备注名。
//
// 输出参数：
//   - Friends: 包含符合条件的好友的好友列表。
func (fs Friends) SearchByRemarkName(limit int, remarkName string) Friends {
	// 调用 Search 方法，以好友备注名为搜索条件进行搜索，并返回符合条件的好友列表
	return fs.Search(limit, func(friend *Friend) bool { return friend.Contact.RemarkName == remarkName })
}

// GetByUsername 方法用于根据好友用户名获取对应的好友信息。
//
// 输入参数：
//   - username string: 要获取好友信息的好友用户名。
//
// 输出参数：
//   - *Friend: 对应好友用户名的好友信息，如果找不到则返回 nil。
func (fs Friends) GetByUsername(username string) *Friend {
	// 调用 SearchByUserName 方法，获取符合条件的好友列表中的第一个好友信息
	return fs.SearchByUserName(1, username).First()
}

// GetByNickName 方法用于根据好友昵称获取对应的好友信息。
//
// 输入参数：
//   - nickname string: 要获取好友信息的好友昵称。
//
// 输出参数：
//   - *Friend: 对应好友昵称的好友信息，如果找不到则返回 nil。
func (fs Friends) GetByNickName(nickname string) *Friend {
	// 调用 SearchByNickName 方法，获取符合条件的好友列表中的第一个好友信息
	return fs.SearchByNickName(1, nickname).First()
}

// GetByRemarkName 方法用于根据好友备注名获取对应的好友信息。
//
// 输入参数：
//   - remarkName string: 要获取好友信息的好友备注名。
//
// 输出参数：
//   - *Friend: 对应好友备注名的好友信息，如果找不到则返回 nil。
func (fs Friends) GetByRemarkName(remarkName string) *Friend {
	// 调用 SearchByRemarkName 方法，获取符合条件的好友列表中的第一个好友信息
	return fs.SearchByRemarkName(1, remarkName).First()
}

// SendText 方法用于向好友列表中的所有好友发送文本消息。(群发)
//
// 输入参数：
//   - text string: 要发送的文本消息内容。
//   - delays ...time.Duration: 可选参数，每次发送之间的延迟时间。
//
// 输出参数：
//   - error: 发送消息过程中可能出现的错误。
func (fs Friends) SendText(text string, delays ...time.Duration) error {
	// 如果好友列表中没有好友，则直接返回 nil
	if fs.Count() == 0 {
		return nil
	}

	var delay time.Duration
	if len(delays) > 0 {
		delay = delays[0]
	}

	// 获取第一个好友信息，并调用其 Self 方法获取自己的账号信息
	self := fs.First().Self()

	// 调用 SendTextToFriends 方法，向所有好友发送文本消息
	return self.SendTextToFriends(text, delay, fs...)
}

// SendImage 方法用于向好友列表中的所有好友发送图片消息。(群发)
//
// 输入参数：
//   - file io.Reader: 要发送的图片文件的 io.Reader。
//   - delays ...time.Duration: 可选参数，每次发送之间的延迟时间。
//
// 输出参数：
//   - error: 发送消息过程中可能出现的错误。
func (fs Friends) SendImage(file io.Reader, delays ...time.Duration) error {
	// 如果好友列表中没有好友，则直接返回 nil
	if fs.Count() == 0 {
		return nil
	}

	var delay time.Duration
	if len(delays) > 0 {
		delay = delays[0]
	}

	// 获取第一个好友信息，并调用其 Self 方法获取自己的账号信息
	self := fs.First().Self()

	// 调用 SendImageToFriends 方法，向所有好友发送图片消息
	return self.SendImageToFriends(file, delay, fs...)
}

// SendVideo 方法用于向好友列表中的所有好友发送视频消息。(群发)
//
// 输入参数：
//   - file io.Reader: 要发送的视频文件的 io.Reader。
//   - delays ...time.Duration: 可选参数，每次发送之间的延迟时间。
//
// 输出参数：
//   - error: 发送消息过程中可能出现的错误。
func (fs Friends) SendVideo(file io.Reader, delays ...time.Duration) error {
	// 如果好友列表中没有好友，则直接返回 nil
	if fs.Count() == 0 {
		return nil
	}

	var delay time.Duration
	if len(delays) > 0 {
		delay = delays[0]
	}

	// 获取第一个好友信息，并调用其 Self 方法获取自己的账号信息
	self := fs.First().Self()

	// 调用 SendVideoToFriends 方法，向所有好友发送视频消息
	return self.SendVideoToFriends(file, delay, fs...)
}

// SendFile 方法用于向好友列表中的所有好友发送文件。(群发)
//
// 输入参数：
//   - file io.Reader: 要发送的文件的 io.Reader。
//   - delay ...time.Duration: 可选参数，每次发送之间的延迟时间。
//
// 输出参数：
//   - error: 发送消息过程中可能出现的错误。
func (fs Friends) SendFile(file io.Reader, delay ...time.Duration) error {
	// 如果好友列表中没有好友，则直接返回 nil
	if fs.Count() == 0 {
		return nil
	}

	var d time.Duration
	if len(delay) > 0 {
		d = delay[0]
	}

	// 获取第一个好友信息，并调用其 Self 方法获取自己的账号信息
	self := fs.First().Self()

	// 调用 SendFileToFriends 方法，向所有好友发送文件
	return self.SendFileToFriends(file, d, fs...)
}

// ================================================= [函数](Friend)公开 =================================================

// String 方法为 Friend 类型对象实现了 Stringer 接口，返回 Friend 对象的字符串表示形式。
//
// 返回值：
//   - string: 字符串表示形式，格式为 "<Friend: 昵称（或备注名）>"。
func (f *Friend) String() string {
	display := f.NickName // 获取昵称作为显示名称

	if f.RemarkName != "" { // 如果备注名不为空，则使用备注名作为显示名称
		display = f.RemarkName
	}

	return fmt.Sprintf("<Friend:%s>", display) // 格式化字符串，返回 Friend 对象的字符串表示形式
}

// SetRemarkName 方法为 Friend 类型对象设置备注名。
//
// 入参：
//   - name: 要设置的备注名。
//
// 返回值：
//   - error: 错误对象，表示设置备注名时发生的错误。
func (f *Friend) SetRemarkName(name string) error {
	return f.Self().SetRemarkNameToFriend(f, name)
}

// AddToGroup 方法将好友加入多个群聊。
//
// 入参：
//   - groups: 要加入的群聊对象，类型为 []*Group。
//
// 返回值：
//   - error: 错误对象，表示将好友加入多个群聊时发生的错误。
func (f *Friend) AddToGroup(groups ...*Group) error {
	return f.Self().AddFriendToGroups(f, groups...)
}

// SendText 方法向好友发送文本消息。
//
// 入参：
//   - content: 要发送的文本内容。
//
// 返回值：
//   - *SentMessage: 发送的消息对象。
//   - error: 错误对象，表示发送消息时发生的错误。
func (f *Friend) SendText(content string) (*SentMessage, error) {
	return f.Self().SendTextToFriend(f, content)
}

// SendImage 方法向好友发送图片消息。
//
// 入参：
//   - file: 要发送的图片文件，类型为 io.Reader。
//
// 返回值：
//   - *SentMessage: 发送的消息对象。
//   - error: 错误对象，表示发送消息时发生的错误。
func (f *Friend) SendImage(file io.Reader) (*SentMessage, error) {
	return f.Self().SendImageToFriend(f, file)
}

// SendVideo 方法向好友发送视频消息。
//
// 入参：
//   - file: 要发送的视频文件，类型为 io.Reader。
//
// 返回值：
//   - *SentMessage: 发送的消息对象。
//   - error: 错误对象，表示发送消息时发生的错误。
func (f *Friend) SendVideo(file io.Reader) (*SentMessage, error) {
	return f.Self().SendVideoToFriend(f, file)
}

// SendFile 方法向好友发送文件消息。
//
// 入参：
//   - file: 要发送的文件，类型为 io.Reader。
//
// 返回值：
//   - *SentMessage: 发送的消息对象。
//   - error: 错误对象，表示发送消息时发生的错误。
func (f *Friend) SendFile(file io.Reader) (*SentMessage, error) {
	return f.Self().SendFileToFriend(f, file)
}

// ================================================= [函数](Groups)公开 =================================================
// Count 方法用于获取群组数量。
//
// 返回值：
//   - int：群组数量。
func (gs Groups) Count() int {
	return len(gs)
}

// Sort 方法用于对群组进行排序。
//
// 返回值：
//   - Groups：排序后的群组列表。
func (gs Groups) Sort() Groups {
	return gs.AsContacts().Sort().Groups()
}

// Uniq 方法用于对群组进行去重。
//
// 返回值：
//   - Groups：去重后的群组列表。
func (gs Groups) Uniq() Groups {
	return gs.AsContacts().Uniq().Groups()
}

// First 方法用于获取第一个群组。
//
// 返回值：
//   - *Group：第一个群组的指针，如果群组列表为空则返回 nil。
func (gs Groups) First() *Group {
	if gs.Count() > 0 {
		return gs.Sort()[0]
	}
	return nil
}

// Last 方法用于获取最后一个群组。
//
// 返回值：
//   - *Group：最后一个群组的指针，如果群组列表为空则返回 nil。
func (gs Groups) Last() *Group {
	if gs.Count() > 0 {
		return gs.Sort()[gs.Count()-1]
	}
	return nil
}

// AsContacts 方法将群组列表转换为联系人列表。
//
// 返回值：
//   - Contacts：转换后的联系人列表。
func (gs Groups) AsContacts() Contacts {
	var contacts = make(Contacts, 0, gs.Count())
	for _, group := range gs {
		contacts = append(contacts, group.Contact)
	}
	return contacts
}

// Search 方法根据自定义条件查找群组。
//
// 输入参数：
//   - limit：最大返回结果数量。
//   - searchHandlers：自定义条件判断函数列表。
//
// 返回值：
//   - Groups：符合条件的群组列表。
func (gs Groups) Search(limit int, searchHandlers ...func(group *Group) bool) (results Groups) {
	return gs.AsContacts().Search(limit, func(contact *Contact) bool {
		var group = &Group{contact}

		for _, searchHandler := range searchHandlers {
			if !searchHandler(group) {
				return false
			}
		}

		return true
	}).Groups()
}

// SearchById 方法根据ID查找群组。
//
// 输入参数：
//   - id：群组ID。
//
// 返回值：
//   - Groups：符合条件的群组列表。
func (gs Groups) SearchById(id string) Groups {
	return gs.Search(1, func(group *Group) bool { return group.Id() == id })
}

// SearchByUserName 方法根据联系人名查找群组。
//
// 输入参数：
//   - limit：最大返回结果数量。
//   - username：联系人名。
//
// 返回值：
//   - Groups：符合条件的群组列表。
func (gs Groups) SearchByUserName(limit int, username string) (results Groups) {
	return gs.Search(limit, func(group *Group) bool { return group.UserName == username })
}

// SearchByNickName 方法根据昵称查找群组。
//
// 输入参数：
//   - limit：最大返回结果数量。
//   - nickName：昵称。
//
// 返回值：
//   - Groups：符合条件的群组列表。
func (gs Groups) SearchByNickName(limit int, nickName string) (results Groups) {
	return gs.Search(limit, func(group *Group) bool { return group.NickName == nickName })
}

// GetByUsername 方法根据username查询一个Group。
//
// 输入参数：
//   - username：用户名。
//
// 返回值：
//   - *Group：符合条件的群组指针，如果找不到则返回 nil。
func (gs Groups) GetByUsername(username string) *Group {
	return gs.SearchByUserName(1, username).First()
}

// GetByNickName 方法根据nickname查询一个Group。
//
// 输入参数：
//   - nickname：昵称。
//
// 返回值：
//   - *Group：符合条件的群组指针，如果找不到则返回 nil。
func (gs Groups) GetByNickName(nickname string) *Group {
	return gs.SearchByNickName(1, nickname).First()
}

// SendText 方法向群组依次发送文本消息，支持发送延迟。
//
// 输入参数：
//   - text：文本消息内容。
//   - delay：发送延迟时间（可选）。
//
// 返回值：
//   - error：发送过程中出现的错误，如果没有错误则返回 nil。
func (gs Groups) SendText(text string, delay ...time.Duration) error {
	if gs.Count() == 0 {
		return nil
	}

	var d time.Duration
	if len(delay) > 0 {
		d = delay[0]
	}

	self := gs.First().Self()

	return self.SendTextToGroups(text, d, gs...)
}

// SendImage 方法向群组依次发送图片消息，支持发送延迟。
//
// 输入参数：
//   - file：图片文件的 io.Reader。
//   - delay：发送延迟时间（可选）。
//
// 返回值：
//   - error：发送过程中出现的错误，如果没有错误则返回 nil。
func (gs Groups) SendImage(file io.Reader, delay ...time.Duration) error {
	if gs.Count() == 0 {
		return nil
	}

	var d time.Duration
	if len(delay) > 0 {
		d = delay[0]
	}

	self := gs.First().Self()

	return self.SendImageToGroups(file, d, gs...)
}

// SendVideo 方法向群组依次发送视频消息，支持发送延迟。
//
// 输入参数：
//   - file：视频文件的 io.Reader。
//   - delay：发送延迟时间（可选）。
//
// 返回值：
//   - error：发送过程中出现的错误，如果没有错误则返回 nil。
func (gs Groups) SendVideo(file io.Reader, delay ...time.Duration) error {
	if gs.Count() == 0 {
		return nil
	}

	var d time.Duration
	if len(delay) > 0 {
		d = delay[0]
	}

	self := gs.First().Self()

	return self.SendVideoToGroups(file, d, gs...)
}

// SendFile 方法向群组依次发送文件消息，支持发送延迟。
//
// 输入参数：
//   - file：文件的 io.Reader。
//   - delay：发送延迟时间（可选）。
//
// 返回值：
//   - error：发送过程中出现的错误，如果没有错误则返回 nil。
func (gs Groups) SendFile(file io.Reader, delay ...time.Duration) error {
	if gs.Count() == 0 {
		return nil
	}

	var d time.Duration
	if len(delay) > 0 {
		d = delay[0]
	}

	self := gs.First().Self()

	return self.SendFileToGroups(file, d, gs...)
}

// ================================================= [函数](Group)公开 =================================================
// implement fmt.Stringer
func (g *Group) String() string {
	return fmt.Sprintf("<Group:%s>", g.NickName)
}

// Rename 用于群组重命名，已废弃。
//
// 输入参数：
//   - name string: 新的群组名称。
//
// 输出参数：
//   - error: 如果重命名过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (g *Group) Rename(name string) error {
	return g.Self().RenameGroup(g, name)
}

// Contacts 用于获取所有的群成员。
//
// 输出参数：
//   - Contacts: 群组中的所有成员列表。
//   - error: 如果获取成员列表过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (g *Group) Contacts() (Contacts, error) {
	if err := g.Detail(); err != nil {
		return nil, err
	}
	g.MemberList.Init(g.Self())
	return g.MemberList, nil
}

// AddFriends 用于拉好友入群。
//
// 输入参数：
//   - friends ...*Friend: 要拉入群的好友列表。
//
// 输出参数：
//   - error: 如果拉好友过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (g *Group) AddFriends(friends ...*Friend) error {
	friends = Friends(friends).Uniq()
	return g.self.AddFriendsToGroup(g, friends...)
}

// RemoveContacts 用于从群聊中移除联系人。
//
// 输入参数：
//   - contacts Contacts: 要移除的群成员列表。
//
// 输出参数：
//   - error: 如果移除过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (g *Group) RemoveContacts(contacts Contacts) error {
	return g.Self().RemoveContactsFromGroup(g, contacts)
}

// SearchContactByUsername 用于根据联系人名查找群成员。
//
// 输入参数：
//   - username string: 联系人名。
//
// 输出参数：
//   - *Contact: 符合条件的群成员指针，如果找不到则返回 nil。
//   - error: 如果查找过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (g *Group) SearchContactByUsername(username string) (*Contact, error) {
	if g.MemberList.Count() == 0 {
		if _, err := g.Contacts(); err != nil {
			return nil, err
		}
	}
	contacts := g.MemberList.SearchByUserName(1, username)
	// 如果此时本地查不到, 那么该成员可能是新加入的
	if contacts.Count() == 0 {
		if _, err := g.Contacts(); err != nil {
			return nil, err
		}
	}
	// 再次尝试获取
	contacts = g.MemberList.SearchByUserName(1, username)
	if contacts.Count() == 0 {
		return nil, Error_NoSuchUserFound
	}
	return contacts.First(), nil
}

// SendText 用于在当前的群组发送文本消息。
//
// 输入参数：
//   - content string: 文本消息内容。
//
// 输出参数：
//   - *SentMessage: 发送的文本消息对象指针。
//   - error: 如果发送过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (g *Group) SendText(content string) (*SentMessage, error) {
	return g.Self().SendTextToGroup(g, content)
}

// SendImage 用于在当前的群组发送图片消息。
//
// 输入参数：
//   - file io.Reader: 图片文件的 io.Reader。
//
// 输出参数：
//   - *SentMessage: 发送的图片消息对象指针。
//   - error: 如果发送过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (g *Group) SendImage(file io.Reader) (*SentMessage, error) {
	return g.Self().SendImageToGroup(g, file)
}

// SendVideo 用于在当前的群组发送视频消息。
//
// 输入参数：
//   - file io.Reader: 视频文件的 io.Reader。
//
// 输出参数：
//   - *SentMessage: 发送的视频消息对象指针。
//   - error: 如果发送过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (g *Group) SendVideo(file io.Reader) (*SentMessage, error) {
	return g.Self().SendVideoToGroup(g, file)
}

// SendFile 用于在当前的群组发送文件。
//
// 输入参数：
//   - file io.Reader: 文件的 io.Reader。
//
// 输出参数：
//   - *SentMessage: 发送的文件消息对象指针。
//   - error: 如果发送过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (g *Group) SendFile(file io.Reader) (*SentMessage, error) {
	return g.Self().SendFileToGroup(g, file)
}

// ================================================= [函数](MPs)公开 =================================================
// Count 用于统计公众号列表的数量。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - int: 公众号列表的数量。
func (ms MPs) Count() int {
	return len(ms)
}

// Sort 对公众号列表进行排序。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - MPs: 排序后的公众号列表。
func (ms MPs) Sort() MPs {
	return ms.AsContacts().Sort().MPs()
}

// Uniq 对公众号列表进行去重。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - MPs: 去重后的公众号列表。
func (ms MPs) Uniq() MPs {
	return ms.AsContacts().Uniq().MPs()
}

// First 获取公众号列表中的第一个公众号。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *MP: 第一个公众号对象指针，如果列表为空则返回 nil。
func (ms MPs) First() *MP {
	if ms.Count() > 0 {
		return ms.Sort()[0]
	}
	return nil
}

// Last 获取公众号列表中的最后一个公众号。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *MP: 最后一个公众号对象指针，如果列表为空则返回 nil。
func (ms MPs) Last() *MP {
	if ms.Count() > 0 {
		return ms.Sort()[ms.Count()-1]
	}
	return nil
}

// AsContacts 将公众号列表转换为联系人列表。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - Contacts: 转换后的联系人列表。
func (ms MPs) AsContacts() Contacts {
	var contacts = make(Contacts, 0, ms.Count())

	for _, mp := range ms {
		contacts = append(contacts, mp.Contact)
	}

	return contacts
}

// Search 根据自定义条件在公众号列表中查找符合条件的公众号。
//
// 输入参数：
//   - limit int: 查找结果的限制数量。
//   - searchHandlers ...func(*MP) bool: 自定义条件判断函数列表。
//
// 输出参数：
//   - MPs: 符合条件的公众号列表。
func (ms MPs) Search(limit int, searchHandlers ...func(*MP) bool) (results MPs) {
	return ms.AsContacts().Search(limit, func(contact *Contact) bool {
		var mp = &MP{contact}

		for _, searchHandler := range searchHandlers {
			if !searchHandler(mp) {
				return false
			}
		}

		return true
	}).MPs()
}

// SearchByUserName 根据用户名在公众号列表中查找公众号。
//
// 输入参数：
//   - limit int: 查找结果的限制数量。
//   - userName string: 用户名。
//
// 输出参数：
//   - MPs: 符合条件的公众号列表。
func (ms MPs) SearchByUserName(limit int, userName string) (results MPs) {
	return ms.Search(limit, func(mp *MP) bool { return mp.UserName == userName })
}

// SearchByNickName 根据昵称在公众号列表中查找公众号。
//
// 输入参数：
//   - limit int: 查找结果的限制数量。
//   - nickName string: 昵称。
//
// 输出参数：
//   - MPs: 符合条件的公众号列表。
func (ms MPs) SearchByNickName(limit int, nickName string) (results MPs) {
	return ms.Search(limit, func(mp *MP) bool { return mp.NickName == nickName })
}

// GetByNickName 根据昵称在公众号列表中获取一个公众号。
//
// 输入参数：
//   - nickname string: 昵称。
//
// 输出参数：
//   - *MP: 符合条件的公众号对象指针，如果找不到则返回 nil。
func (ms MPs) GetByNickName(nickname string) *MP {
	return ms.SearchByNickName(1, nickname).First()
}

// GetByUserName 根据用户名在公众号列表中获取一个公众号。
//
// 输入参数：
//   - username string: 用户名。
//
// 输出参数：
//   - *MP: 符合条件的公众号对象指针，如果找不到则返回 nil。
func (ms MPs) GetByUserName(username string) *MP {
	return ms.SearchByUserName(1, username).First()
}

// SendText 向公众号列表依次发送文本消息，支持设置发送延迟。
//
// 输入参数：
//   - text string: 文本消息内容。
//   - delay ...time.Duration: 发送延迟时间，可选参数。
//
// 输出参数：
//   - error: 如果发送过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (ms MPs) SendText(text string, delay ...time.Duration) error {
	if ms.Count() == 0 {
		return nil
	}

	var d time.Duration
	if len(delay) > 0 {
		d = delay[0]
	}

	self := ms.First().Self()

	return self.SendTextToMPs(text, d, ms...)
}

// SendImage 向公众号列表依次发送图片消息，支持设置发送延迟。
//
// 输入参数：
//   - file io.Reader: 图片文件的 io.Reader。
//   - delay ...time.Duration: 发送延迟时间，可选参数。
//
// 输出参数：
//   - error: 如果发送过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (ms MPs) SendImage(file io.Reader, delay ...time.Duration) error {
	if ms.Count() == 0 {
		return nil
	}

	var d time.Duration
	if len(delay) > 0 {
		d = delay[0]
	}

	self := ms.First().Self()

	return self.SendImageToMPs(file, d, ms...)
}

// SendVideo 向公众号列表依次发送视频消息，支持设置发送延迟。
//
// 输入参数：
//   - file io.Reader: 视频文件的 io.Reader。
//   - delay ...time.Duration: 发送延迟时间，可选参数。
//
// 输出参数：
//   - error: 如果发送过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (ms MPs) SendVideo(file io.Reader, delay ...time.Duration) error {
	if ms.Count() == 0 {
		return nil
	}

	var d time.Duration
	if len(delay) > 0 {
		d = delay[0]
	}

	self := ms.First().Self()

	return self.SendVideoToMPs(file, d, ms...)
}

// SendFile 向公众号列表依次发送文件消息，支持设置发送延迟。
//
// 输入参数：
//   - file io.Reader: 文件的 io.Reader。
//   - delay ...time.Duration: 发送延迟时间，可选参数。
//
// 输出参数：
//   - error: 如果发送过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (ms MPs) SendFile(file io.Reader, delay ...time.Duration) error {
	if ms.Count() == 0 {
		return nil
	}

	var d time.Duration
	if len(delay) > 0 {
		d = delay[0]
	}

	self := ms.First().Self()

	return self.SendFileToMPs(file, d, ms...)
}

// ================================================= [函数](MP)公开 =================================================
// String 方法返回公众号对象的字符串表示。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - string: 公众号对象的字符串表示。
func (m *MP) String() string {
	return fmt.Sprintf("MP:%s", m.NickName)
}

// SendText 向公众号发送文本消息。
//
// 输入参数：
//   - content string: 文本消息内容。
//
// 输出参数：
//   - *SentMessage: 发送成功后返回一个 SentMessage 对象，其中包含了发送消息的信息，如果发送失败则返回 nil。
//   - error: 如果发送过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (m *MP) SendText(content string) (*SentMessage, error) {
	return m.Self().SendTextToMP(m, content)
}

// SendImage 向公众号发送图片消息。
//
// 输入参数：
//   - file io.Reader: 图片文件的 io.Reader。
//
// 输出参数：
//   - *SentMessage: 发送成功后返回一个 SentMessage 对象，其中包含了发送消息的信息，如果发送失败则返回 nil。
//   - error: 如果发送过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (m *MP) SendImage(file io.Reader) (*SentMessage, error) {
	return m.Self().SendImageToMP(m, file)
}

// SendVideo 向公众号发送视频消息。
//
// 输入参数：
//   - file io.Reader: 视频文件的 io.Reader。
//
// 输出参数：
//   - *SentMessage: 发送成功后返回一个 SentMessage 对象，其中包含了发送消息的信息，如果发送失败则返回 nil。
//   - error: 如果发送过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (m *MP) SendVideo(file io.Reader) (*SentMessage, error) {
	return m.Self().SendVideoToMP(m, file)
}

// SendFile 向公众号发送文件消息。
//
// 输入参数：
//   - file io.Reader: 文件的 io.Reader。
//
// 输出参数：
//   - *SentMessage: 发送成功后返回一个 SentMessage 对象，其中包含了发送消息的信息，如果发送失败则返回 nil。
//   - error: 如果发送过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (m *MP) SendFile(file io.Reader) (*SentMessage, error) {
	return m.Self().SendFileToMP(m, file)
}
