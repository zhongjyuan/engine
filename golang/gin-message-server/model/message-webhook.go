package model

import "errors"

const WebHookTableName = "message_webhook"

// WebHookEntity 结构体用于表示 WebHook 实体信息。
type WebHookEntity struct {
	Id            int    `json:"id" gorm:"column:id"`                                      // WebHook 实体的唯一标识符
	Name          string `json:"name" gorm:"column:name;type:varchar(32);index"`           // WebHook 的名称
	Link          string `json:"link" gorm:"column:link;type:char(32);uniqueIndex"`        // WebHook 的链接
	Channel       string `json:"channel" gorm:"column:channel;type:varchar(32); not null"` // 发送消息的频道
	ExtractRule   string `json:"extractRule" gorm:"column:extract_rule;not null"`          // 提取规则
	ConstructRule string `json:"construct_rule" gorm:"column:construct_rule;not null"`     // 构建消息的规则
	Status        int    `json:"status" gorm:"column:status;default:1"`                    // 状态，启用为1，禁用为0
	UserId        int    `json:"userId" gorm:"column:user_id;index"`                       // 用户ID
	CreateTime    int64  `json:"createTime" gorm:"column:created_time;bigint"`             // 创建时间
}

// WebHookConstructRule 结构体用于表示 WebHook 构建规则，与消息保持兼容。
type WebHookConstructRule struct {
	URL         string `json:"url"`         // URL 字段用于构建消息中的链接
	Title       string `json:"title"`       // Title 字段用于构建消息的标题
	Content     string `json:"content"`     // Content 字段用于构建消息的内容
	Description string `json:"description"` // Description 字段用于构建消息的描述
}

func (WebHookEntity) TableName() string {
	return WebHookTableName
}

func (webHook *WebHookEntity) Insert() error {
	return DB.Create(webHook).Error
}

func (webHook *WebHookEntity) Delete() error {
	return DB.Delete(webHook).Error
}

// Update Make sure your token's fields is completed, because this will update zero values
func (webHook *WebHookEntity) Update() error {
	return DB.Model(webHook).Select("status", "name", "extract_rule", "construct_rule", "channel").Updates(webHook).Error
}

func (webHook *WebHookEntity) UpdateStatus(status int) error {
	return DB.Model(webHook).Update("status", status).Error
}

func DeleteWebHookByID(id int, userId int) (c *WebHookEntity, err error) {
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

func GetWebHookByID(id int, userId int) (*WebHookEntity, error) {
	if id == 0 || userId == 0 {
		return nil, errors.New("id 或 userId 为空！")
	}

	c := WebHookEntity{Id: id, UserId: userId}

	err := DB.Where(c).First(&c).Error

	return &c, err
}

func GetWebHookByLink(link string) (*WebHookEntity, error) {
	if link == "" {
		return nil, errors.New("link 为空！")
	}

	c := WebHookEntity{Link: link}

	err := DB.Where(c).First(&c).Error

	return &c, err
}

func GetUserPageWebHooks(userId int, startIdx int, num int) (webhooks []*WebHookEntity, err error) {
	err = DB.Where("user_id = ?", userId).Order("id desc").Limit(num).Offset(startIdx).Find(&webhooks).Error
	return webhooks, err
}

func SearchWebHooks(userId int, keyword string) (webhooks []*WebHookEntity, err error) {
	err = DB.Where("user_id = ?", userId).Where("id = ? or link = ? or name LIKE ?", keyword, keyword, keyword+"%").Find(&webhooks).Error
	return webhooks, err
}
