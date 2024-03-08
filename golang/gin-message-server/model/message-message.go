package model

import (
	"errors"
	"time"
	"zhongjyuan/gin-message-server/common"
)

const MessageTableName = "message_message"

type MessageEntity struct {
	Id          int    `json:"id" gorm:"column:id"`
	Title       string `json:"title" gorm:"column:title"`
	Content     string `json:"content" gorm:"column:content"`
	Channel     string `json:"channel" gorm:"column:channel"`
	URL         string `json:"url" gorm:"column:url"`
	Link        string `json:"link" gorm:"column:link;unique;index"`
	To          string `json:"to" gorm:"column:to"`                         // if specified, will send to this user(s)
	Status      int    `json:"status" gorm:"column:status;default:0;index"` // pending, sent, failed
	Description string `json:"description" gorm:"column:description"`
	UserId      int    `json:"user_id" gorm:"column:user_id;index"`
	Timestamp   int64  `json:"timestamp" gorm:"column:timestamp;type:bigint"`
	Token       string `json:"token" gorm:"-:all"`
	Desp        string `json:"desp" gorm:"-:all"`   // alias for content
	Short       string `json:"short" gorm:"-:all"`  // alias for description
	Async       bool   `json:"async" gorm:"-"`      // if true, will send message asynchronously
	OpenId      string `json:"openid" gorm:"-:all"` // alias for to
	HTMLContent string `json:"html_content"  gorm:"-:all"`
}

func (MessageEntity) TableName() string {
	return MessageTableName
}

func (message *MessageEntity) Delete() error {
	return DB.Delete(message).Error
}

func (message *MessageEntity) UpdateStatus(status int) error {
	return DB.Model(message).Update("status", status).Error
}

func (message *MessageEntity) UpdateAndInsert(userId int) error {
	message.Timestamp = time.Now().Unix()
	message.UserId = userId
	message.Status = common.MessageSendStatusPending

	return DB.Create(message).Error
}

func DeleteMessageById(id int, userId int) (err error) {
	// Why we need userId here? In case user want to delete other's message.
	if id == 0 || userId == 0 {
		return errors.New("id 或 userId 为空！")
	}

	message := MessageEntity{Id: id, UserId: userId}

	if err = DB.Where(message).First(&message).Error; err != nil {
		return err
	}

	return message.Delete()
}

func DeleteAllMessages() error {
	return DB.Exec("DELETE FROM messages").Error
}

func GetMessageById(id int) (*MessageEntity, error) {
	if id == 0 {
		return nil, errors.New("id 为空！")
	}

	message := MessageEntity{Id: id}

	err := DB.Where(message).First(&message).Error

	return &message, err
}

func GetMessageByLink(link string) (*MessageEntity, error) {
	if link == "" {
		return nil, errors.New("link 为空！")
	}

	message := MessageEntity{Link: link}

	err := DB.Where(message).First(&message).Error

	return &message, err
}

func GetMessageByIds(id int, userId int) (*MessageEntity, error) {
	if id == 0 || userId == 0 {
		return nil, errors.New("id 或 userId 为空！")
	}

	message := MessageEntity{Id: id, UserId: userId}

	err := DB.Where(message).First(&message).Error

	return &message, err
}

func GetMessagesByUserId(userId int, startIdx int, num int) (messages []*MessageEntity, err error) {
	err = DB.Select([]string{"id", "title", "channel", "timestamp", "status"}).
		Where("user_id = ?", userId).Order("id desc").Limit(num).Offset(startIdx).Find(&messages).Error
	return messages, err
}

func SearchMessages(keyword string) (messages []*MessageEntity, err error) {
	err = DB.Select([]string{"id", "title", "channel", "timestamp", "status"}).
		Where("id = ? or title LIKE ? or description LIKE ? or content LIKE ?", keyword, keyword+"%", keyword+"%", keyword+"%").
		Order("id desc").
		Find(&messages).Error
	return messages, err
}

func GetMessageStatusByLink(link string) (int, error) {
	if link == "" {
		return common.MessageSendStatusUnknown, errors.New("link 为空！")
	}

	message := MessageEntity{}

	err := DB.Where("link = ?", link).Select("status").First(&message).Error

	return message.Status, err
}

func GetAsyncPendingMessageIds() (ids []int, err error) {
	err = DB.Model(&MessageEntity{}).Where("status = ?", common.MessageSendStatusAsyncPending).Pluck("id", &ids).Error
	return ids, err
}
