package model

import (
	"errors"
	"fmt"
	"zhongjyuan/gin-one-api/common"

	"gorm.io/gorm"
)

const TokenTableName = "one_api_token"

// TokenEntity 结构体定义了令牌的数据模型。
type TokenEntity struct {
	Id             int    `json:"id" gorm:"column:id;primaryKey;unique"`                      // 令牌ID，唯一主键，自增
	Key            string `json:"key" gorm:"column:key;type:char(48);uniqueIndex"`            // 令牌密钥，字符类型，唯一索引
	Name           string `json:"name" gorm:"column:name;index"`                              // 令牌名称，索引
	Status         int    `json:"status" gorm:"column:status;default:1"`                      // 令牌状态，默认值为 1
	UserId         int    `json:"userId" gorm:"column:user_id;index"`                         // 用户ID，索引
	UserName       string `json:"userName" gorm:"column:user_name"`                           // 用户名
	UsedQuota      int    `json:"usedQuota" gorm:"column:used_quota;default:0"`               // 已使用配额
	RemainQuota    int    `json:"remainQuota" gorm:"column:remain_quota;default:0"`           // 剩余配额，默认值为 0
	UnlimitedQuota bool   `json:"unlimitedQuota" gorm:"column:unlimited_quota;default:false"` // 是否无限配额，默认值为 false
	CreateTime     int64  `json:"createTime" gorm:"column:create_time;bigint"`                // 创建时间，整型
	AccesseTime    int64  `json:"accesseTime" gorm:"column:accesse_time;bigint"`              // 访问时间，整型
	ExpireTime     int64  `json:"expireTime" gorm:"column:expire_time;bigint;default:-1"`     // 过期时间，整型，-1 表示永不过期
}

func (TokenEntity) TableName() string {
	return TokenTableName
}

func (token *TokenEntity) Insert() error {
	return DB.Create(token).Error
}

func (token *TokenEntity) Delete() error {
	return DB.Delete(token).Error
}

func (token *TokenEntity) Update() error {
	return DB.Model(token).Select("name", "status", "remain_quota", "unlimited_quota", "expired_time").Updates(token).Error
}

func (token *TokenEntity) SelectUpdate() error {
	// This can update zero values
	return DB.Model(token).Select("status", "accessed_time").Updates(token).Error
}

func DeleteTokenByIdAnUserID(id int, userId int) (err error) {
	// Why we need userId here? In case user want to delete other's token.
	if id == 0 || userId == 0 {
		return errors.New("id 或 userId 为空！")
	}

	token := TokenEntity{Id: id, UserId: userId}
	if err = DB.Where(token).First(&token).Error; err != nil {
		return err
	}

	return token.Delete()
}

func GetTokenByID(id int) (token *TokenEntity, err error) {
	if id == 0 {
		return nil, errors.New("id 为空！")
	}

	token = &TokenEntity{Id: id}

	err = DB.First(&token, "id = ?", id).Error

	return token, err
}

func GetTokenByIdAnUserID(id int, userId int) (token *TokenEntity, err error) {
	if id == 0 || userId == 0 {
		return nil, errors.New("id 或 userId 为空！")
	}

	token = &TokenEntity{Id: id, UserId: userId}

	err = DB.First(&token, "id = ? and user_id = ?", id, userId).Error

	return token, err
}

func GetPageUserTokens(userId int, startIdx int, num int) (tokens []*TokenEntity, err error) {
	err = DB.Where("user_id = ?", userId).Order("id desc").Limit(num).Offset(startIdx).Find(&tokens).Error
	return tokens, err
}

func SearchUserTokens(userId int, keyword string) (tokens []*TokenEntity, err error) {
	err = DB.Where("user_id = ?", userId).Where("name LIKE ?", keyword+"%").Find(&tokens).Error
	return tokens, err
}

// IncreaseTokenQuotaByID 用于增加指定 ID 的令牌配额。
//
// 输入参数：
//   - id int: 令牌 ID。
//   - quota int: 增加的配额值。
//
// 输出参数：
//   - err error: 如果有错误发生，返回错误信息；否则返回 nil。
func IncreaseTokenQuotaByID(id int, quota int) (err error) {
	// 检查配额是否为负数
	if quota < 0 {
		return errors.New("quota 不能为负数！")
	}

	// 如果批量更新功能已启用，则记录更新并返回
	if common.BatchUpdateEnabled {
		updateRecord(common.BatchUpdateTypeTokenQuota, id, quota)
		return nil
	}

	// 执行增加令牌配额的操作
	return increaseTokenQuotaByID(id, quota)
}

// increaseTokenQuotaByID 用于增加指定 ID 的令牌配额。
//
// 输入参数：
//   - id int: 令牌 ID。
//   - quota int: 增加的配额值。
//
// 输出参数：
//   - err error: 如果有错误发生，返回错误信息；否则返回 nil。
func increaseTokenQuotaByID(id int, quota int) (err error) {
	// 使用数据库模型更新指定 ID 的令牌记录
	err = DB.Model(&TokenEntity{}).Where("id = ?", id).Updates(
		map[string]interface{}{
			"used_quota":    gorm.Expr("used_quota - ?", quota),   // 减去增加的配额值
			"remain_quota":  gorm.Expr("remain_quota + ?", quota), // 增加剩余配额值
			"accessed_time": common.GetTimestamp(),                // 更新访问时间
		},
	).Error

	return err
}

// DecreaseTokenQuotaByID 用于减少指定 ID 的令牌配额。
//
// 输入参数：
//   - id int: 令牌 ID。
//   - quota int: 减少的配额值。
//
// 输出参数：
//   - err error: 如果有错误发生，返回错误信息；否则返回 nil。
func DecreaseTokenQuotaByID(id int, quota int) (err error) {
	// 检查配额是否为负数
	if quota < 0 {
		return errors.New("quota 不能为负数！")
	}

	// 如果批量更新功能已启用，则记录更新并返回
	if common.BatchUpdateEnabled {
		updateRecord(common.BatchUpdateTypeTokenQuota, id, -quota)
		return nil
	}

	// 执行减少令牌配额的操作
	return decreaseTokenQuotaByID(id, quota)
}

// decreaseTokenQuotaByID 用于减少指定 ID 的令牌配额。
//
// 输入参数：
//   - id int: 令牌 ID。
//   - quota int: 减少的配额值。
//
// 输出参数：
//   - err error: 如果有错误发生，返回错误信息；否则返回 nil。
func decreaseTokenQuotaByID(id int, quota int) (err error) {
	// 使用数据库模型更新指定 ID 的令牌记录
	err = DB.Model(&TokenEntity{}).Where("id = ?", id).Updates(
		map[string]interface{}{
			"used_quota":    gorm.Expr("used_quota + ?", quota),   // 增加已使用配额值
			"remain_quota":  gorm.Expr("remain_quota - ?", quota), // 减少剩余配额值
			"accessed_time": common.GetTimestamp(),                // 更新访问时间
		},
	).Error

	return err
}

// ValidateUserToken 用于验证用户令牌是否有效。
//
// 输入参数：
//   - key string: 用户提供的令牌密钥。
//
// 输出参数：
//   - token *TokenEntity: 如果令牌有效，则返回 TokenEntity 对象；否则返回 nil。
//   - err error: 如果验证过程中出现错误，返回错误信息；否则返回 nil。
func ValidateUserToken(key string) (token *TokenEntity, err error) {
	// 检查是否提供了令牌密钥
	if key == "" {
		return nil, errors.New("未提供令牌")
	}

	// 从缓存中获取指定密钥对应的令牌信息
	token, err = GetTokenByKeyWithCache(key)
	if err != nil {
		common.SysError("GetTokenByKeyWithCache failed: " + err.Error())
		switch {
		case errors.Is(err, gorm.ErrRecordNotFound):
			return nil, errors.New("无效的令牌")
		default:
			return nil, errors.New("令牌验证失败")
		}
	}

	// 根据令牌状态进行验证
	switch token.Status {
	case common.TokenStatusExhausted:
		return nil, errors.New("该令牌额度已用尽")
	case common.TokenStatusExpired:
		return nil, errors.New("该令牌已过期")
	case common.TokenStatusEnabled:
		// 令牌状态可用，继续验证
	default:
		return nil, errors.New("该令牌状态不可用")
	}

	// 检查令牌是否过期
	if token.ExpireTime != -1 && token.ExpireTime < common.GetTimestamp() {
		if !common.RedisEnabled {
			token.Status = common.TokenStatusExpired
			if err := token.SelectUpdate(); err != nil {
				common.SysError("failed to update token status" + err.Error())
			}
		}
		return nil, errors.New("该令牌已过期")
	}

	// 检查令牌额度是否充足
	if !token.UnlimitedQuota && token.RemainQuota <= 0 {
		if !common.RedisEnabled {
			// 在此情况下，我们可以确保令牌已用尽
			token.Status = common.TokenStatusExhausted
			if err := token.SelectUpdate(); err != nil {
				common.SysError("failed to update token status" + err.Error())
			}
		}
		return nil, errors.New("该令牌额度已用尽")
	}

	return token, nil
}

// PreConsumeTokenQuota 用于预先消费配额。
//
// 输入参数：
//   - tokenId int: 令牌 ID。
//   - quota int: 配额值。
//
// 输出参数：
//   - err error: 如果有错误发生，返回错误信息；否则返回 nil。
func PreConsumeTokenQuota(tokenId int, quota int) (err error) {
	// 检查配额是否为负数
	if quota < 0 {
		return errors.New("quota 不能为负数！")
	}

	// 获取指定 ID 的令牌
	token, err := GetTokenByID(tokenId)
	if err != nil {
		return err
	}

	// 检查令牌额度是否足够
	if !token.UnlimitedQuota && token.RemainQuota < quota {
		return errors.New("令牌额度不足")
	}

	// 获取用户的配额
	userQuota, err := GetUserQuotaByID(token.UserId)
	if err != nil {
		return err
	}

	// 检查用户的配额是否足够，若不足则发送提醒邮件
	quotaTooLow := userQuota >= common.QuotaRemindThreshold && userQuota-quota < common.QuotaRemindThreshold
	noMoreQuota := userQuota-quota <= 0
	if quotaTooLow || noMoreQuota {
		go func() {
			email, err := GetUserEmailByID(token.UserId)
			if err != nil {
				common.SysError("failed to fetch user email: " + err.Error())
			}

			prompt := "您的额度即将用尽"
			if noMoreQuota {
				prompt = "您的额度已用尽"
			}

			if email != "" {
				topUpLink := fmt.Sprintf("%s/topup", common.ServerAddress)
				if err = common.SendEmail(prompt, email,
					fmt.Sprintf("%s，当前剩余额度为 %d，为了不影响您的使用，请及时充值。<br/>充值链接：<a href='%s'>%s</a>", prompt, userQuota, topUpLink, topUpLink),
				); err != nil {
					common.SysError("failed to send email" + err.Error())
				}
			}
		}()
	}

	// 如果令牌额度不是无限的，则减少令牌的配额
	if !token.UnlimitedQuota {
		if err := DecreaseTokenQuotaByID(tokenId, quota); err != nil {
			return err
		}
	}

	// 减少用户的配额
	return DecreaseUserQuotaByID(token.UserId, quota)
}

// PostConsumeTokenQuota 用于后置消费令牌配额。
//
// 输入参数：
//   - tokenId int: 令牌 ID。
//   - quota int: 配额值，正数表示扣除配额，负数表示增加配额。
//
// 输出参数：
//   - err error: 如果有错误发生，返回错误信息；否则返回 nil。
func PostConsumeTokenQuota(tokenId int, quota int) (err error) {
	// 获取指定 ID 的令牌
	token, err := GetTokenByID(tokenId)
	if err != nil {
		return err
	}

	// 根据配额值的正负判断是扣除配额还是增加配额
	if quota > 0 {
		// 扣除用户配额
		err = DecreaseUserQuotaByID(token.UserId, quota)
	} else {
		// 增加用户配额（注意取绝对值）
		err = IncreaseUserQuotaByID(token.UserId, -quota)
	}

	if err != nil {
		return err
	}

	// 如果令牌额度不是无限的，则扣除或增加令牌配额
	if !token.UnlimitedQuota {
		if quota > 0 {
			// 扣除令牌配额
			err = DecreaseTokenQuotaByID(tokenId, quota)
		} else {
			// 增加令牌配额（注意取绝对值）
			err = IncreaseTokenQuotaByID(tokenId, -quota)
		}
		if err != nil {
			return err
		}
	}

	return nil
}
