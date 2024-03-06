package model

import (
	"encoding/json"
	"fmt"
	"zhongjyuan/gin-one-api/common"

	"gorm.io/gorm"
)

const ChannelTableName = "one_api_channel"

// ChannelEntity 结构体定义了渠道的数据模型。
type ChannelEntity struct {
	Id                int     `json:"id" gorm:"column:id"`                                                    // 渠道ID
	Key               string  `json:"key" gorm:"column:key;not null;index"`                                   // 渠道关键字，非空，索引
	Name              string  `json:"name" gorm:"column:name;index"`                                          // 渠道名称，索引
	Type              int     `json:"type" gorm:"column:type;default:0"`                                      // 渠道类型，默认值为 0
	Group             string  `json:"group" gorm:"column:group;type:varchar(32);default:'default'"`           // 渠道分组，默认值为 "default"
	Weight            *uint   `json:"weight" gorm:"column:weight;default:0"`                                  // 权重，默认值为 0
	Models            string  `json:"models" gorm:"column:models"`                                            // 模型列表
	ModelMapping      *string `json:"modelMapping" gorm:"column:model_mapping;type:varchar(1024);default:''"` // 模型映射
	BaseURL           *string `json:"baseUrl" gorm:"column:base_url;default:''"`                              // 基础URL，默认为空字符串
	Balance           float64 `json:"balance" gorm:"column:balance"`                                          // 余额，以美元计算
	BalanceUpdateTime int64   `json:"balanceUpdateTime" gorm:"column:balance_update_time;bigint"`             // 余额更新时间，整型
	UsedQuota         int64   `json:"usedQuota" gorm:"column:used_quota;bigint;default:0"`                    // 已使用配额，默认值为 0
	Status            int     `json:"status" gorm:"column:status;default:1"`                                  // 渠道状态，默认值为 1
	Config            string  `json:"config" gorm:"column:config"`                                            // 配置信息
	Priority          *int64  `json:"priority" gorm:"column:priority;bigint;default:0"`                       // 优先级，默认值为 0
	TestTime          int64   `json:"testTime" gorm:"column:test_time;bigint"`                                // 测试时间，整型
	CreateTime        int64   `json:"createTime" gorm:"column:create_time;bigint"`                            // 创建时间，整型
	ResponseTime      int     `json:"responseTime" gorm:"column:response_time"`                               // 响应时间，毫秒
}

func (ChannelEntity) TableName() string {
	return ChannelTableName
}

// Insert 将渠道信息插入数据库，并批量插入该渠道的能力信息。
//
// 输入参数：
//   - channel: 要插入的渠道信息
//
// 输出参数：
//   - error: 如果出现错误，则返回相应的错误信息；否则返回 nil。
func (channel *ChannelEntity) Insert() error {
	// 插入渠道信息
	if err := DB.Create(channel).Error; err != nil {
		return err
	}

	// 批量插入该渠道的能力信息
	if err := BatchInsertAbilitiesForChannel(channel); err != nil {
		return err
	}

	return nil
}

func (channel *ChannelEntity) Delete() error {
	if err := DB.Delete(channel).Error; err != nil {
		return err
	}

	return DeleteAbilityByChannelID(channel.Id)
}

func (channel *ChannelEntity) Update() error {
	if err := DB.Model(channel).Updates(channel).Error; err != nil {
		return err
	}

	if err := DB.Model(channel).First(channel, "id = ?", channel.Id).Error; err != nil {
		return err
	}

	return BatchUpdateAbilitiesByChannel(channel)
}

func (channel *ChannelEntity) UpdateBalance(balance float64) {
	if err := DB.Model(channel).Select("balance", "balance_update_time").Updates(ChannelEntity{
		Balance:           balance,
		BalanceUpdateTime: common.GetTimestamp(),
	}).Error; err != nil {
		common.SysError("failed to update balance: " + err.Error())
	}
}

func (channel *ChannelEntity) UpdateResponseTime(responseTime int64) {
	if err := DB.Model(channel).Select("test_time", "response_time").Updates(ChannelEntity{
		TestTime:     common.GetTimestamp(),
		ResponseTime: int(responseTime),
	}).Error; err != nil {
		common.SysError("failed to update response time: " + err.Error())
	}
}

func (channel *ChannelEntity) GetPriority() int64 {
	if channel.Priority == nil {
		return 0
	}
	return *channel.Priority
}

func (channel *ChannelEntity) GetBaseURL() string {
	if channel.BaseURL == nil {
		return ""
	}
	return *channel.BaseURL
}

func (channel *ChannelEntity) GetModelMapping() map[string]string {
	if channel.ModelMapping == nil || *channel.ModelMapping == "" || *channel.ModelMapping == "{}" {
		return nil
	}

	modelMapping := make(map[string]string)
	if err := json.Unmarshal([]byte(*channel.ModelMapping), &modelMapping); err != nil {
		common.SysError(fmt.Sprintf("failed to unmarshal model mapping for channel %d, error: %s", channel.Id, err.Error()))
		return nil
	}

	return modelMapping
}

func (channel *ChannelEntity) GetConfig() (map[string]string, error) {
	if channel.Config == "" {
		return nil, nil
	}

	cfg := make(map[string]string)
	if err := json.Unmarshal([]byte(channel.Config), &cfg); err != nil {
		return nil, err
	}

	return cfg, nil
}

func BatchInsertChannels(channels []ChannelEntity) error {
	var err error

	if err = DB.Create(&channels).Error; err != nil {
		return err
	}

	for _, channel := range channels {
		if err = BatchInsertAbilitiesForChannel(&channel); err != nil {
			return err
		}
	}

	return nil
}

func DeleteDisabledChannel() (int64, error) {
	result := DB.Where("status = ? or status = ?", common.ChannelStatusAutoDisabled, common.ChannelStatusManuallyDisabled).Delete(&ChannelEntity{})
	return result.RowsAffected, result.Error
}

func DeleteChannelByStatus(status int64) (int64, error) {
	result := DB.Where("status = ?", status).Delete(&ChannelEntity{})
	return result.RowsAffected, result.Error
}

func UpdateChannelUsedQuotaByID(id int, quota int) {
	if common.BatchUpdateEnabled {
		updateRecord(common.BatchUpdateTypeChannelUsedQuota, id, quota)
		return
	}
	updateChannelUsedQuotaByID(id, quota)
}

func updateChannelUsedQuotaByID(id int, quota int) {
	if err := DB.Model(&ChannelEntity{}).Where("id = ?", id).Update("used_quota", gorm.Expr("used_quota + ?", quota)).Error; err != nil {
		common.SysError("failed to update channel used quota: " + err.Error())
	}
}

func UpdateChannelStatusByID(id int, status int) {
	if err := UpdateAbilityStatusByChannelID(id, status == common.ChannelStatusEnabled); err != nil {
		common.SysError("failed to update ability status: " + err.Error())
	}

	if err := DB.Model(&ChannelEntity{}).Where("id = ?", id).Update("status", status).Error; err != nil {
		common.SysError("failed to update channel status: " + err.Error())
	}
}

func GetChannelByID(id int, selectAll bool) (*ChannelEntity, error) {
	var err error = nil

	channel := ChannelEntity{Id: id}

	if selectAll {
		err = DB.First(&channel, "id = ?", id).Error
	} else {
		err = DB.Omit("key").First(&channel, "id = ?", id).Error
	}

	return &channel, err
}

func GetPageChannels(startIdx int, num int, selectAll bool) (channels []*ChannelEntity, err error) {
	if selectAll {
		err = DB.Order("id desc").Find(&channels).Error
	} else {
		err = DB.Order("id desc").Limit(num).Offset(startIdx).Omit("key").Find(&channels).Error
	}

	return channels, err
}

func SearchChannels(keyword string) (channels []*ChannelEntity, err error) {
	keyCol := "`key`"
	if common.UsingPostgreSQL {
		keyCol = `"key"`
	}

	err = DB.Omit("key").Where("id = ? or name LIKE ? or "+keyCol+" = ?", common.String2Int(keyword), keyword+"%", keyword).Find(&channels).Error

	return channels, err
}
