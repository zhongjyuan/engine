package model

import (
	"errors"
	"time"
	"zhongjyuan/gin-message-server/common"
)

const MessageTableName = "message_message"

// MessageEntity 是消息实体结构。
type MessageEntity struct {
	Id          int    `json:"id" gorm:"column:id"`                           // 消息ID
	Title       string `json:"title" gorm:"column:title"`                     // 标题
	Content     string `json:"content" gorm:"column:content"`                 // 内容
	To          string `json:"to" gorm:"column:to"`                           // 如果指定，将发送给这些用户
	URL         string `json:"url" gorm:"column:url"`                         // URL
	Link        string `json:"link" gorm:"column:link;unique;index"`          // 链接
	Channel     string `json:"channel" gorm:"column:channel"`                 // 频道
	UserId      int    `json:"userId" gorm:"column:user_id;index"`            // 用户ID
	Status      int    `json:"status" gorm:"column:status;default:0;index"`   // 状态（待发送、已发送、发送失败）
	Description string `json:"description" gorm:"column:description"`         // 描述
	Timestamp   int64  `json:"timestamp" gorm:"column:timestamp;type:bigint"` // 时间戳
	Token       string `json:"token" gorm:"-:all"`                            // 令牌
	Desp        string `json:"desp" gorm:"-:all"`                             // 内容的别名
	Short       string `json:"short" gorm:"-:all"`                            // 描述的别名
	Async       bool   `json:"async" gorm:"-"`                                // 如果为 true，则异步发送消息
	OpenId      string `json:"openid" gorm:"-:all"`                           // to 的别名
	HTMLContent string `json:"htmlContent"  gorm:"-:all"`                     // HTML内容
}

func (MessageEntity) TableName() string {
	return MessageTableName
}

func (message *MessageEntity) Delete() error {
	return DB.Delete(message).Error
}

func (message *MessageEntity) UpdateAndInsert(userId int) error {
	message.Timestamp = time.Now().Unix()
	message.UserId = userId
	message.Status = common.MessageSendStatusPending

	return DB.Create(message).Error
}

func (message *MessageEntity) UpdateStatus(status int) error {
	return DB.Model(message).Update("status", status).Error
}

func DeleteAllMessages() error {
	return DB.Exec("DELETE FROM messages").Error
}

func DeleteMessageByIDAnUserID(id int, userId int) (err error) {
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

func GetMessageByID(id int) (*MessageEntity, error) {
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

func GetMessageByIDAnUserID(id int, userId int) (*MessageEntity, error) {
	if id == 0 || userId == 0 {
		return nil, errors.New("id 或 userId 为空！")
	}

	message := MessageEntity{Id: id, UserId: userId}

	err := DB.Where(message).First(&message).Error

	return &message, err
}

func GetUserPageMessages(userId int, startIdx int, num int) (messages []*MessageEntity, err error) {
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
