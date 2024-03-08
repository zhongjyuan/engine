package model

import (
	"errors"
	"zhongjyuan/gin-message-server/common"
)

const ChannelTableName = "message_channel"

type ChannelEntity struct {
	Id          int    `json:"id" gorm:"column:id"`
	Type        string `json:"type" gorm:"column:type;type:varchar(32)"`
	Name        string `json:"name" gorm:"column:name;type:varchar(32);uniqueIndex:name_user_id"`
	UserId      int    `json:"user_id" gorm:"column:user_id;index;uniqueIndex:name_user_id"`
	Description string `json:"description" gorm:"column:description"`
	Status      int    `json:"status" gorm:"column:status;default:1"` // enabled, disabled
	AppId       string `json:"app_id" gorm:"column:app_id"`
	Secret      string `json:"secret" gorm:"column:secret;index"`
	AccountId   string `json:"account_id" gorm:"column:account_id"`
	URL         string `json:"url" gorm:"column:url"`
	Other       string `json:"other" gorm:"column:other"`
	CreatedTime int64  `json:"created_time" gorm:"column:created_time;bigint"`
}

func (ChannelEntity) TableName() string {
	return ChannelTableName
}

type ChannelBrief struct {
	Id          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
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

func DeleteChannelById(id int, userId int) (c *ChannelEntity, err error) {
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

func GetChannelById(id int, userId int, selectAll bool) (*ChannelEntity, error) {
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

func GetChannelsByUserId(userId int, startIdx int, num int) (channels []*ChannelEntity, err error) {
	err = DB.Omit("secret").Where("user_id = ?", userId).Order("id desc").Limit(num).Offset(startIdx).Find(&channels).Error
	return channels, err
}

func GetBriefChannelsByUserId(userId int) (channels []*ChannelBrief, err error) {
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

func GetTokenStoreChannelsByUserId(userId int) (channels []*ChannelEntity, err error) {
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
