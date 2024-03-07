package model

import (
	"strings"
	"zhongjyuan/gin-one-api/common"
)

const AbilityTableName = "one_api_ability"

// AbilityEntity 结构体定义了能力实体的数据模型。
type AbilityEntity struct {
	Group     string `json:"group" gorm:"column:group;type:varchar(32);primaryKey;autoIncrement:false"` // 分组，作为主键，不自增
	Model     string `json:"model" gorm:"column:model;primaryKey;autoIncrement:false"`                  // 模型，作为主键，不自增
	ChannelId int    `json:"channelId" gorm:"column:channelId;primaryKey;autoIncrement:false;index"`    // 渠道ID，作为主键，不自增，创建索引
	Priority  *int64 `json:"priority" gorm:"column:priority;bigint;default:0;index"`                    // 优先级，整型，默认值为 0，创建索引
	Enabled   bool   `json:"enabled" gorm:"column:enabled"`                                             // 是否启用
}

func (AbilityEntity) TableName() string {
	return AbilityTableName
}

// BatchInsertAbilitiesForChannel 批量插入渠道的能力信息。
//
// 输入参数：
//   - channel: 渠道信息
//
// 输出参数：
//   - error: 如果出现错误，则返回相应的错误信息；否则返回 nil。
func BatchInsertAbilitiesForChannel(channel *ChannelEntity) error {
	models := strings.Split(channel.Models, ",") // 将模型字符串拆分为模型数组
	groups := strings.Split(channel.Group, ",")  // 将分组字符串拆分为分组数组

	var abilities []AbilityEntity // 创建一个 AbilityEntity 切片

	for _, model := range models {
		for _, group := range groups {
			ability := AbilityEntity{
				Group:     group,
				Model:     model,
				ChannelId: channel.Id,
				Priority:  channel.Priority,
				Enabled:   channel.Status == common.ChannelStatusEnabled,
			}
			abilities = append(abilities, ability) // 将 ability 添加到 abilities 切片中
		}
	}

	return DB.Create(&abilities).Error // 执行批量插入操作并返回错误信息
}

// DeleteAbilitiesByChannelID 根据渠道ID删除能力信息。
//
// 输入参数：
//   - channelID: 渠道ID
//
// 输出参数：
//   - error: 如果出现错误，则返回相应的错误信息；否则返回 nil。
func DeleteAbilityByChannelID(channelID int) error {
	return DB.Where("channelId = ?", channelID).Delete(&AbilityEntity{}).Error
}

// BatchUpdateAbilitiesByChannel 批量更新渠道的能力信息。
//
// 输入参数：
//   - channel: 渠道信息
//
// 输出参数：
//   - error: 如果出现错误，则返回相应的错误信息；否则返回 nil。
func BatchUpdateAbilitiesByChannel(channel *ChannelEntity) error {
	if err := DeleteAbilityByChannelID(channel.Id); err != nil {
		return err
	}

	return BatchInsertAbilitiesForChannel(channel)
}

// UpdateAbilityStatusByChannelID 根据渠道ID更新能力状态。
//
// 输入参数：
//   - channelID: 渠道ID
//   - status: 新的能力状态
//
// 输出参数：
//   - error: 如果出现错误，则返回相应的错误信息；否则返回 nil。
func UpdateAbilityStatusByChannelID(channelID int, status bool) error {
	return DB.Model(&AbilityEntity{}).Where("channelId = ?", channelID).Select("enabled").Update("enabled", status).Error
}

// GetRandomChannel   从数据库中随机获取满足条件的渠道信息。
//
// 输入参数：
//   - group: 分组名称
//   - model: 模型名称
//
// 输出参数：
//   - *ChannelEntity: 返回随机获取的满足条件的渠道信息，如果获取失败则返回 nil。
//   - error: 如果出现错误，则返回相应的错误信息；否则返回 nil。
func GetRandomChannel(group, model string) (*ChannelEntity, error) {
	ability := AbilityEntity{} // 创建一个 AbilityEntity 实例

	trueVal, groupCol := "1", "`group`" // 真值字符串和分组列名，默认为 `group`
	if common.UsingPostgreSQL {
		trueVal, groupCol = "true", `"group"` // 若使用 PostgreSQL 数据库，则修改真值字符串和分组列名
	}

	// 查询满足条件的最大优先级子查询
	maxPrioritySubQuery := DB.Model(&AbilityEntity{}).Select("MAX(priority)").Where(groupCol+" = ? and model = ? and enabled = "+trueVal, group, model)

	// 构建渠道查询条件
	channelQuery := DB.Where(groupCol+" = ? and model = ? and enabled = "+trueVal+" and priority = (?)", group, model, maxPrioritySubQuery)

	// 根据数据库类型选择不同的随机排序方式，并执行查询
	randOrder := "RAND()" // 默认使用 RAND() 函数
	if common.UsingSQLite || common.UsingPostgreSQL {
		randOrder = "RANDOM()" // 若使用 SQLite 或 PostgreSQL 则使用 RANDOM() 函数
	}
	if err := channelQuery.Order(randOrder).First(&ability).Error; err != nil {
		return nil, err
	}

	channel := ChannelEntity{Id: ability.ChannelId}              // 创建一个 ChannelEntity 实例
	err := DB.First(&channel, "id = ?", ability.ChannelId).Error // 查询对应的渠道信息
	return &channel, err
}
