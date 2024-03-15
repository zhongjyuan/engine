package model

import (
	"context"
	"fmt"
	"zhongjyuan/gin-ai-server/common"

	"gorm.io/gorm"
)

const LogTableName = "one_api_log"

// LogEntity 结构体定义了日志的数据模型。
type LogEntity struct {
	Id               int    `json:"id" gorm:"column:id;primaryKey;unique"`                                                          // 日志ID，唯一主键，自增
	Type             int    `json:"type" gorm:"column:type;index:idx_created_at_type"`                                              // 日志类型，索引
	Content          string `json:"content" gorm:"column:content;primaryKey;unique"`                                                // 日志内容，唯一主键
	UserId           int    `json:"userId" gorm:"column:user_id;index"`                                                             // 用户ID，索引
	UserName         string `json:"userName" gorm:"column:user_name;index:index_username_model_name,priority:2;default:''"`         // 用户名，索引
	TokenName        string `json:"tokenName" gorm:"column:tokenName;index;default:''"`                                             // 令牌名称，索引
	ChannelId        int    `json:"channelId" gorm:"column:channelId;index"`                                                        // 渠道ID，索引
	ModelName        string `json:"modelName" gorm:"column:model_name;index;index:index_username_model_name,priority:1;default:''"` // 模型名称，索引
	Quota            int    `json:"quota" gorm:"column:quota;default:0"`                                                            // 配额，默认值为 0
	PromptTokens     int    `json:"promptTokens" gorm:"column:prompt_tokens;default:0"`                                             // 提示令牌数量，默认值为 0
	CompletionTokens int    `json:"completionTokens" gorm:"column:completion_tokens;default:0"`                                     // 完成令牌数量，默认值为 0
	CreateTime       int64  `json:"createTime" gorm:"column:create_time;bigint;index:idx_created_at_type"`                          // 创建时间，整型，索引
}

func (LogEntity) TableName() string {
	return LogTableName
}

func RecordLog(userId int, logType int, content string) {
	if logType == common.LogTypeConsume && !common.LogConsumeEnabled {
		return
	}

	userName, err := GetUserNameByID(userId)
	if err != nil {
		userName = "Guest"
	}

	log := &LogEntity{
		Type:       logType,
		Content:    content,
		UserId:     userId,
		UserName:   userName,
		CreateTime: common.GetTimestamp(),
	}

	if err := LOG_DB.Create(log).Error; err != nil {
		common.SysError("failed to record log: " + err.Error())
	}
}

func RecordConsumeLog(ctx context.Context, userId int, channelId int, promptTokens int, completionTokens int, modelName string, tokenName string, quota int64, content string) {
	common.Info(ctx, fmt.Sprintf("record consume log: userId=%d, channelId=%d, promptTokens=%d, completionTokens=%d, modelName=%s, tokenName=%s, quota=%d, content=%s", userId, channelId, promptTokens, completionTokens, modelName, tokenName, quota, content))
	if !common.LogConsumeEnabled {
		return
	}

	userName, err := GetUserNameByID(userId)
	if err != nil {
		userName = "Guest"
	}

	log := &LogEntity{
		Type:             common.LogTypeConsume,
		Content:          content,
		UserId:           userId,
		UserName:         userName,
		TokenName:        tokenName,
		ChannelId:        channelId,
		ModelName:        modelName,
		Quota:            int(quota),
		PromptTokens:     promptTokens,
		CompletionTokens: completionTokens,
		CreateTime:       common.GetTimestamp(),
	}

	if err := LOG_DB.Create(log).Error; err != nil {
		common.Error(ctx, "failed to record log: "+err.Error())
	}
}

func DeleteHistoryLog(targetTimestamp int64) (int64, error) {
	result := LOG_DB.Where("create_time < ?", targetTimestamp).Delete(&LogEntity{})
	return result.RowsAffected, result.Error
}

func GetPageLogs(logType int, startTimestamp int64, endTimestamp int64, modelName string, userName string, tokenName string, startIdx int, num int, channelId int) (logs []*LogEntity, err error) {
	var tx *gorm.DB

	if logType == common.LogTypeUnknown {
		tx = DB
	} else {
		tx = LOG_DB.Where("type = ?", logType)
	}

	if userName != "" {
		tx = tx.Where("user_name = ?", userName)
	}

	if tokenName != "" {
		tx = tx.Where("tokenName = ?", tokenName)
	}

	if channelId != 0 {
		tx = tx.Where("channelId = ?", channelId)
	}

	if modelName != "" {
		tx = tx.Where("model_name = ?", modelName)
	}

	if startTimestamp != 0 {
		tx = tx.Where("create_time >= ?", startTimestamp)
	}

	if endTimestamp != 0 {
		tx = tx.Where("create_time <= ?", endTimestamp)
	}

	err = tx.Order("id desc").Limit(num).Offset(startIdx).Find(&logs).Error

	return logs, err
}

func GetPageUserLogs(userId int, logType int, startTimestamp int64, endTimestamp int64, modelName string, tokenName string, startIdx int, num int) (logs []*LogEntity, err error) {
	var tx *gorm.DB

	if logType == common.LogTypeUnknown {
		tx = LOG_DB.Where("user_id = ?", userId)
	} else {
		tx = LOG_DB.Where("user_id = ? and type = ?", userId, logType)
	}

	if tokenName != "" {
		tx = tx.Where("tokenName = ?", tokenName)
	}

	if modelName != "" {
		tx = tx.Where("model_name = ?", modelName)
	}

	if startTimestamp != 0 {
		tx = tx.Where("create_time >= ?", startTimestamp)
	}

	if endTimestamp != 0 {
		tx = tx.Where("create_time <= ?", endTimestamp)
	}

	err = tx.Order("id desc").Limit(num).Offset(startIdx).Omit("id").Find(&logs).Error

	return logs, err
}

func SearchLogs(keyword string) (logs []*LogEntity, err error) {
	err = LOG_DB.Where("type = ? or content LIKE ?", keyword, keyword+"%").Order("id desc").Limit(common.MaxRecentItems).Find(&logs).Error
	return logs, err
}

func SearchUserLogs(userId int, keyword string) (logs []*LogEntity, err error) {
	err = LOG_DB.Where("user_id = ? and type = ?", userId, keyword).Order("id desc").Limit(common.MaxRecentItems).Omit("id").Find(&logs).Error
	return logs, err
}

func SumUsedQuota(logType int, startTimestamp int64, endTimestamp int64, modelName string, userName string, tokenName string, channelId int) (quota int) {
	tx := LOG_DB.Table(LogTableName).Select("ifnull(sum(quota),0)")
	if userName != "" {
		tx = tx.Where("user_name = ?", userName)
	}

	if tokenName != "" {
		tx = tx.Where("tokenName = ?", tokenName)
	}

	if startTimestamp != 0 {
		tx = tx.Where("create_time >= ?", startTimestamp)
	}

	if endTimestamp != 0 {
		tx = tx.Where("create_time <= ?", endTimestamp)
	}

	if modelName != "" {
		tx = tx.Where("model_name = ?", modelName)
	}

	if channelId != 0 {
		tx = tx.Where("channelId = ?", channelId)
	}

	tx.Where("type = ?", common.LogTypeConsume).Scan(&quota)

	return quota
}

func SumUsedToken(logType int, startTimestamp int64, endTimestamp int64, modelName string, userName string, tokenName string) (token int) {
	tx := LOG_DB.Table(LogTableName).Select("ifnull(sum(prompt_tokens),0) + ifnull(sum(completion_tokens),0)")
	if userName != "" {
		tx = tx.Where("user_name = ?", userName)
	}
	if tokenName != "" {
		tx = tx.Where("tokenName = ?", tokenName)
	}
	if startTimestamp != 0 {
		tx = tx.Where("create_time >= ?", startTimestamp)
	}
	if endTimestamp != 0 {
		tx = tx.Where("create_time <= ?", endTimestamp)
	}
	if modelName != "" {
		tx = tx.Where("model_name = ?", modelName)
	}
	tx.Where("type = ?", common.LogTypeConsume).Scan(&token)
	return token
}

type LogStatistic struct {
	Day              string `gorm:"column:day"`
	ModelName        string `gorm:"column:model_name"`
	RequestCount     int    `gorm:"column:request_count"`
	Quota            int    `gorm:"column:quota"`
	PromptTokens     int    `gorm:"column:prompt_tokens"`
	CompletionTokens int    `gorm:"column:completion_tokens"`
}

func SearchLogsByDayAndModel(userId, start, end int) (LogStatistics []*LogStatistic, err error) {
	groupSelect := "DATE_FORMAT(FROM_UNIXTIME(create_time), '%Y-%m-%d') as day"

	if common.UsingPostgreSQL {
		groupSelect = "TO_CHAR(date_trunc('day', to_timestamp(create_time)), 'YYYY-MM-DD') as day"
	}

	if common.UsingSQLite {
		groupSelect = "strftime('%Y-%m-%d', datetime(create_time, 'unixepoch')) as day"
	}

	err = LOG_DB.Raw(`
		SELECT ?,
		model_name, count(1) as request_count,
		sum(quota) as quota,
		sum(prompt_tokens) as prompt_tokens,
		sum(completion_tokens) as completion_tokens
		FROM ?
		WHERE type=2
		AND user_id= ?
		AND create_time BETWEEN ? AND ?
		GROUP BY day, model_name
		ORDER BY day, model_name
	`, groupSelect, LogTableName, userId, start, end).Scan(&LogStatistics).Error

	return LogStatistics, err
}
