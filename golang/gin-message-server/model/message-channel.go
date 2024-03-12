package model

import (
	"errors"
	"zhongjyuan/gin-message-server/common"
)

const ChannelTableName = "message_channel"

// ChannelEntity 是频道实体结构。
type ChannelEntity struct {
	Id          int    `json:"id" gorm:"column:id"`                                               // 频道ID
	Type        string `json:"type" gorm:"column:type;type:varchar(32)"`                          // 类型
	Name        string `json:"name" gorm:"column:name;type:varchar(32);uniqueIndex:name_user_id"` // 名称
	AppId       string `json:"appId" gorm:"column:app_id"`                                        // 应用ID
	Secret      string `json:"secret" gorm:"column:secret;index"`                                 // 密钥
	AccountId   string `json:"accountId" gorm:"column:account_id"`                                // 账户ID
	URL         string `json:"url" gorm:"column:url"`                                             // URL
	Other       string `json:"other" gorm:"column:other"`                                         // 其他信息
	Status      int    `json:"status" gorm:"column:status;default:1"`                             // 状态（启用、禁用）
	UserId      int    `json:"userId" gorm:"column:user_id;index;uniqueIndex:name_user_id"`       // 用户ID
	Description string `json:"description" gorm:"column:description"`                             // 描述
	CreateTime  int64  `json:"createTime" gorm:"column:created_time;bigint"`                      // 创建时间
}

func (ChannelEntity) TableName() string {
	return ChannelTableName
}

// ChannelBrief 是频道简要信息结构。
type ChannelBrief struct {
	Id          int    `json:"id"`          // 频道ID
	Name        string `json:"name"`        // 名称
	Description string `json:"description"` // 描述
}

func (channel *ChannelEntity) Insert() error {
	return DB.Create(channel).Error
}

func (channel *ChannelEntity) Delete() error {
	return DB.Delete(channel).Error
}

func (channel *ChannelEntity) Update() error {
	return DB.Model(channel).Select("type", "name", "description", "secret", "app_id", "account_id", "url", "other", "status").Updates(channel).Error
}

func (channel *ChannelEntity) UpdateStatus(status int) error {
	return DB.Model(channel).Update("status", status).Error
}

func DeleteChannelByID(id int, userId int) (c *ChannelEntity, err error) {
	// Why we need userId here? In case user want to delete other's c.
	if id == 0 || userId == 0 {
		return nil, errors.New("id 或 userId 为空！")
	}

	c = &ChannelEntity{Id: id, UserId: userId}
	if err = DB.Where(c).First(&c).Error; err != nil {
		return nil, err
	}

	return c, c.Delete()
}

func GetChannelByID(id int, userId int, selectAll bool) (*ChannelEntity, error) {
	if id == 0 || userId == 0 {
		return nil, errors.New("id 或 userId 为空！")
	}

	var err error

	c := ChannelEntity{Id: id, UserId: userId}
	if selectAll {
		err = DB.Where(c).First(&c).Error
	} else {
		err = DB.Omit("secret").Where(c).First(&c).Error
	}

	return &c, err
}

func GetChannelByName(name string, userId int, selectAll bool) (*ChannelEntity, error) {
	if name == "" || userId == 0 {
		return nil, errors.New("name 或 userId 为空！")
	}

	var err error

	c := ChannelEntity{Name: name, UserId: userId}
	if selectAll {
		err = DB.Where(c).First(&c).Error
	} else {
		err = DB.Omit("secret").Where(c).First(&c).Error
	}

	return &c, err
}

func GetUserPageChannels(userId int, startIdx int, num int) (channels []*ChannelEntity, err error) {
	err = DB.Omit("secret").Where("user_id = ?", userId).Order("id desc").Limit(num).Offset(startIdx).Find(&channels).Error
	return channels, err
}

func GetUserPageBriefChannels(userId int) (channels []*ChannelBrief, err error) {
	err = DB.Model(&ChannelEntity{}).Select("id", "name", "description").Where("user_id = ? and status = ?", userId, common.ChannelStatusEnabled).Find(&channels).Error
	return channels, err
}

func GetTokenStoreChannels() (channels []*ChannelEntity, err error) {
	err = DB.Where("type in ?", []string{
		common.TypeWeChatCorpAccount,
		common.TypeWeChatTestAccount,
		common.TypeLarkApp,
	}).Find(&channels).Error
	return channels, err
}

func GetUserTokenStoreChannels(userId int) (channels []*ChannelEntity, err error) {
	err = DB.Where("type in ?", []string{
		common.TypeWeChatCorpAccount,
		common.TypeWeChatTestAccount,
		common.TypeLarkApp,
	}).Where("user_id = ?", userId).Find(&channels).Error
	return channels, err
}

func SearchChannels(userId int, keyword string) (channels []*ChannelEntity, err error) {
	err = DB.Omit("secret").Where("user_id = ?", userId).Where("id = ? or name LIKE ?", keyword, keyword+"%").Find(&channels).Error
	return channels, err
}
