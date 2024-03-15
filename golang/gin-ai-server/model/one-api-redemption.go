package model

import (
	"errors"
	"fmt"
	"zhongjyuan/gin-ai-server/common"

	"gorm.io/gorm"
)

const RedemptionTableName = "one_api_redemption"

// RedemptionEntity 表示一个兑换实体，包含了兑换信息的各个字段。
type RedemptionEntity struct {
	Id           int    `json:"id" gorm:"column:id"`                             // 兑换ID
	Key          string `json:"key" gorm:"column:key;type:char(32);uniqueIndex"` // 兑换Key
	Name         string `json:"name" gorm:"column:name;index"`                   // 兑换名称
	UserId       int    `json:"userId" gorm:"column:user_id"`                    // 用户ID
	UserName     string `json:"userName" gorm:"column:user_name"`                // 用户名
	Status       int    `json:"status" gorm:"column:status;default:1"`           // 兑换状态，默认为1
	Quota        int64  `json:"quota" gorm:"column:quota;default:100"`           // 兑换配额，默认为100
	CreateTime   int64  `json:"createTime" gorm:"column:create_time;bigint"`     // 创建时间
	RedeemedTime int64  `json:"redeemedTime" gorm:"column:redeemed_time;bigint"` // 兑换时间

	Count int `json:"count" gorm:"-:all"` // 仅用于 API 请求计数
}

func (RedemptionEntity) TableName() string {
	return RedemptionTableName
}

func (redemption *RedemptionEntity) Insert() error {
	return DB.Create(redemption).Error
}

func (redemption *RedemptionEntity) Delete() error {
	return DB.Delete(redemption).Error
}

func (redemption *RedemptionEntity) Update() error {
	return DB.Model(redemption).Select("name", "status", "quota", "redeemed_time").Updates(redemption).Error
}

func (redemption *RedemptionEntity) SelectUpdate() error {
	return DB.Model(redemption).Select("status", "redeemed_time").Updates(redemption).Error
}

func DeleteRedemptionByID(id int) (err error) {
	if id == 0 {
		return errors.New("id 为空！")
	}

	redemption := RedemptionEntity{Id: id}
	if err := DB.Where(redemption).First(&redemption).Error; err != nil {
		return err
	}

	return redemption.Delete()
}

func GetRedemptionByID(id int) (*RedemptionEntity, error) {
	if id == 0 {
		return nil, errors.New("id 为空！")
	}

	var err error = nil
	redemption := RedemptionEntity{Id: id}
	err = DB.First(&redemption, "id = ?", id).Error

	return &redemption, err
}

func GetPageRedemptions(startIdx int, num int) (redemptions []*RedemptionEntity, err error) {
	err = DB.Order("id desc").Limit(num).Offset(startIdx).Find(&redemptions).Error
	return redemptions, err
}

func SearchRedemptions(keyword string) (redemptions []*RedemptionEntity, err error) {
	err = DB.Where("id = ? or name LIKE ?", keyword, keyword+"%").Find(&redemptions).Error
	return redemptions, err
}

// RedeemQuota 根据兑换码兑换额度。
//
// 输入参数：
//   - key: 兑换码
//   - userId: 用户ID
//
// 输出参数：
//   - quota: 兑换的额度
//   - err: 如果成功兑换，则返回nil；否则返回相应的错误信息。
func RedeemQuota(key string, userId int) (quota int64, err error) {
	if key == "" {
		return 0, errors.New("未提供兑换码")
	}

	if userId == 0 {
		return 0, errors.New("无效的 user id")
	}

	redemption := &RedemptionEntity{}

	keyCol := "`key`"
	if common.UsingPostgreSQL {
		keyCol = `"key"`
	}

	if err := DB.Transaction(func(tx *gorm.DB) error {
		// 查询兑换码并加锁
		err := tx.Set("gorm:query_option", "FOR UPDATE").Where(keyCol+" = ?", key).First(redemption).Error
		if err != nil {
			return errors.New("无效的兑换码")
		}

		// 检查兑换码状态
		if redemption.Status != common.RedemptionCodeStatusEnabled {
			return errors.New("该兑换码已被使用")
		}

		// 更新用户额度
		if err := tx.Model(&UserEntity{}).Where("id = ?", userId).Update("quota", gorm.Expr("quota + ?", redemption.Quota)).Error; err != nil {
			return err
		}

		// 更新兑换记录状态
		redemption.RedeemedTime = common.GetTimestamp()
		redemption.Status = common.RedemptionCodeStatusUsed
		return tx.Save(redemption).Error
	}); err != nil {
		return 0, errors.New("兑换失败，" + err.Error())
	}

	RecordLog(userId, common.LogTypeTopup, fmt.Sprintf("通过兑换码充值 %s", common.FormatQuota(redemption.Quota)))

	return redemption.Quota, nil
}
