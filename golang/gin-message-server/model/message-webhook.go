package model

import "errors"

const WebHookTableName = "message_webhook"

type WebHookEntity struct {
	Id            int    `json:"id" gorm:"column:id"`
	Name          string `json:"name" gorm:"column:name;type:varchar(32);index"`
	Link          string `json:"link" gorm:"column:link;type:char(32);uniqueIndex"`
	Channel       string `json:"channel" gorm:"column:channel;type:varchar(32); not null"` // which channel to send our message
	ExtractRule   string `json:"extract_rule" gorm:"column:extract_rule;not null"`
	ConstructRule string `json:"construct_rule" gorm:"column:construct_rule;not null"` // how we construct message with the extracted info
	Status        int    `json:"status" gorm:"column:status;default:1"`                // enabled, disabled
	UserId        int    `json:"user_id" gorm:"column:user_id;index"`
	CreatedTime   int64  `json:"created_time" gorm:"column:created_time;bigint"` // how we extract key info from the request
}

// WebhookConstructRule Keep compatible with Message
type WebHookConstructRule struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Content     string `json:"content"`
	URL         string `json:"url"`
}

func (WebHookEntity) TableName() string {
	return WebHookTableName
}

func (webhook *WebHookEntity) Insert() error {
	return DB.Create(webhook).Error
}

func (webhook *WebHookEntity) Delete() error {
	return DB.Delete(webhook).Error
}

// Update Make sure your token's fields is completed, because this will update zero values
func (webhook *WebHookEntity) Update() error {
	return DB.Model(webhook).Select("status", "name", "extract_rule", "construct_rule", "channel").Updates(webhook).Error
}

func (webhook *WebHookEntity) UpdateStatus(status int) error {
	return DB.Model(webhook).Update("status", status).Error
}

func DeleteWebhookById(id int, userId int) (c *WebHookEntity, err error) {
	// Why we need userId here? In case user want to delete other's c.
	if id == 0 || userId == 0 {
		return nil, errors.New("id 或 userId 为空！")
	}

	c = &WebHookEntity{Id: id, UserId: userId}

	if err = DB.Where(c).First(&c).Error; err != nil {
		return nil, err
	}

	return c, c.Delete()
}

func GetWebhookById(id int, userId int) (*WebHookEntity, error) {
	if id == 0 || userId == 0 {
		return nil, errors.New("id 或 userId 为空！")
	}

	c := WebHookEntity{Id: id, UserId: userId}

	err := DB.Where(c).First(&c).Error

	return &c, err
}

func GetWebhookByLink(link string) (*WebHookEntity, error) {
	if link == "" {
		return nil, errors.New("link 为空！")
	}

	c := WebHookEntity{Link: link}

	err := DB.Where(c).First(&c).Error

	return &c, err
}

func GetWebhooksByUserId(userId int, startIdx int, num int) (webhooks []*WebHookEntity, err error) {
	err = DB.Where("user_id = ?", userId).Order("id desc").Limit(num).Offset(startIdx).Find(&webhooks).Error
	return webhooks, err
}

func SearchWebhooks(userId int, keyword string) (webhooks []*WebHookEntity, err error) {
	err = DB.Where("user_id = ?", userId).Where("id = ? or link = ? or name LIKE ?", keyword, keyword, keyword+"%").Find(&webhooks).Error
	return webhooks, err
}
