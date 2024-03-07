package model

import (
	"errors"
	"strings"
	"zhongjyuan/gin-one-api/common"

	"gorm.io/gorm"
)

const UserProFileTableName = "plat_user_profile"

// UserProfileEntity 结构体定义了用户的数据模型。
type UserProfileEntity struct {
	Id       int    `json:"id" gorm:"column:id;primaryKey;unique"`  // 用户ID，唯一主键，自增
	GitHubId string `json:"githubId" gorm:"column:github_id;index"` // GitHub ID，索引
	WeChatId string `json:"wechatId" gorm:"column:wechat_id;index"` // 微信 ID，索引

	AffCode      string `json:"affCode" gorm:"column:aff_code;type:varchar(32);uniqueIndex"`      // 推广码，唯一索引
	AccessToken  string `json:"accessToken" gorm:"column:access_token;type:char(32);uniqueIndex"` // 访问令牌，用于系统管理，唯一索引
	Group        string `json:"group" gorm:"column:group;type:varchar(32);default:'default'"`     // 请求组，默认值为 'default'
	Quota        int    `json:"quota" gorm:"column:quota;type:int;default:0"`                     // 配额，默认值为 0
	UsedQuota    int    `json:"usedQuota" gorm:"column:used_quota;type:int;default:0;"`           // 已使用配额
	RequestCount int    `json:"requestCount" gorm:"column:request_count;type:int;default:0;"`     // 请求次数
	InviterId    int    `json:"inviterId" gorm:"column:inviter_id;type:int;index"`                // 邀请者ID

	VerificationCode string `json:"verificationCode" gorm:"-:all"` // 验证码，仅用于邮箱验证，不保存到数据库
}

func (UserProfileEntity) TableName() string {
	return UserProFileTableName
}

func (userProfile *UserProfileEntity) UpdateGitHubId() error {
	return DB.Model(&UserEntity{}).Where("id = ?", userProfile.Id).UpdateColumn("github_id", userProfile.GitHubId).Error
}

func (userProfile *UserProfileEntity) UpdateWeChatId() error {
	return DB.Model(&UserEntity{}).Where("id = ?", userProfile.Id).UpdateColumn("wechat_id", userProfile.WeChatId).Error
}

func (userProfile *UserProfileEntity) GetUserByGitHubID(selectAll bool) (*UserEntity, error) {
	// 如果GitHub ID为空，则返回错误信息
	if userProfile.GitHubId == "" {
		return nil, errors.New("github id 为空！")
	}

	if err := DB.First(&userProfile, "github_id = ?", userProfile.GitHubId).Error; err != nil {
		return nil, err
	}

	user, err := GetUserByID(userProfile.Id, selectAll)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (userProfile *UserProfileEntity) GetUserByWeChatID(selectAll bool) (*UserEntity, error) {
	// 如果WeChat ID为空，则返回错误信息
	if userProfile.WeChatId == "" {
		return nil, errors.New("wechat id 为空！")
	}

	if err := DB.First(&userProfile, "wechat_id = ?", userProfile.WeChatId).Error; err != nil {
		return nil, err
	}

	user, err := GetUserByID(userProfile.Id, selectAll)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (userProfile *UserProfileEntity) GetUserByAffCode(selectAll bool) (*UserEntity, error) {
	// 如果GitHub ID为空，则返回错误信息
	if userProfile.GitHubId == "" {
		return nil, errors.New("aff code 为空！")
	}

	if err := DB.First(&userProfile, "aff_code = ?", userProfile.AffCode).Error; err != nil {
		return nil, err
	}

	user, err := GetUserByID(userProfile.Id, selectAll)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (userProfile *UserProfileEntity) GetUserByAccessToken(selectAll bool) (*UserEntity, error) {
	// 如果GitHub ID为空，则返回错误信息
	if userProfile.AccessToken == "" {
		return nil, errors.New("access token 为空！")
	}

	if err := DB.First(&userProfile, "access_token = ?", userProfile.AccessToken).Error; err != nil {
		return nil, err
	}

	user, err := GetUserByID(userProfile.Id, selectAll)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func GetUserByGitHubID(gitHubId string, selectAll bool) (*UserEntity, error) {
	// 如果GitHub ID为空，则返回错误信息
	if gitHubId == "" {
		return nil, errors.New("github id 为空！")
	}

	// 创建一个 UserProfileEntity 实例，用于存储查询结果
	userProfile := UserProfileEntity{GitHubId: gitHubId}

	return userProfile.GetUserByGitHubID(selectAll)
}

func GetUserByWeChatID(weChatId string, selectAll bool) (*UserEntity, error) {
	// 如果WeChat ID为空，则返回错误信息
	if weChatId == "" {
		return nil, errors.New("wechat id 为空！")
	}

	// 创建一个 UserEntity 实例，用于存储查询结果
	userProfile := UserProfileEntity{WeChatId: weChatId}

	return userProfile.GetUserByWeChatID(selectAll)
}

func GetUserByAffCode(affCode string, selectAll bool) (*UserEntity, error) {
	// 如果Aff Code为空，则返回错误信息
	if affCode == "" {
		return nil, errors.New("aff code 为空！")
	}

	// 创建一个 UserEntity 实例，用于存储查询结果
	userProfile := UserProfileEntity{AffCode: affCode}

	return userProfile.GetUserByAffCode(selectAll)
}

func GetUserByAccessToken(accessToken string, selectAll bool) (*UserEntity, error) {
	// 如果access token为空，则返回错误信息
	if accessToken == "" {
		return nil, errors.New("access token 为空！")
	}

	accessToken = strings.Replace(accessToken, "Bearer ", "", 1)

	// 创建一个 UserEntity 实例，用于存储查询结果
	userProfile := UserProfileEntity{AccessToken: accessToken}

	return userProfile.GetUserByAccessToken(selectAll)
}

func GetUserGroupByID(userId int) (group string, err error) {
	groupCol := "`group`"
	if common.UsingPostgreSQL {
		groupCol = `"group"`
	}

	err = DB.Model(&UserProfileEntity{}).Where("id = ?", userId).Select(groupCol).Find(&group).Error
	return group, err
}

func GetUserQuotaByID(userId int) (quota int, err error) {
	err = DB.Model(&UserProfileEntity{}).Where("id = ?", userId).Select("quota").Find(&quota).Error
	return quota, err
}

func GetUserUsedQuotaByID(userId int) (usedQuota int, err error) {
	err = DB.Model(&UserProfileEntity{}).Where("id = ?", userId).Select("used_quota").Find(&usedQuota).Error
	return usedQuota, err
}

func IsCanGenerateAccessToken(accessToken string) bool {
	// 如果access token为空，则返回错误信息
	if accessToken == "" {
		return false
	}

	accessToken = strings.Replace(accessToken, "Bearer ", "", 1)

	return DB.Where(UserProfileEntity{AccessToken: accessToken}).RowsAffected == 0
}

// IsWeChatIdAlreadyTaken 方法用于检查WeChat ID是否已被注册。
//
// 输入参数：
//   - wechatId string: 要检查的WeChat ID。
//
// 输出参数：
//   - bool: 如果WeChat ID已被注册，则返回 true；否则为 false。
func IsWeChatIdAlreadyTaken(wechatId string) bool {
	// 使用 GORM 根据WeChat ID查询用户信息，并检查是否存在记录
	return DB.Where("wechat_id = ?", wechatId).Find(&UserProfileEntity{}).RowsAffected == 1
}

// IsGitHubIdAlreadyTaken 方法用于检查GitHub ID是否已被注册。
//
// 输入参数：
//   - githubId string: 要检查的GitHub ID。
//
// 输出参数：
//   - bool: 如果GitHub ID已被注册，则返回 true；否则为 false。
func IsGitHubIdAlreadyTaken(githubId string) bool {
	// 使用 GORM 根据GitHub ID查询用户信息，并检查是否存在记录
	return DB.Where("github_id = ?", githubId).Find(&UserProfileEntity{}).RowsAffected == 1
}

// IncreaseUserQuotaByID 根据用户ID增加配额。
//
// 输入参数：
//   - userId int: 用户ID。
//   - quota int: 要增加的配额值。
//
// 输出参数：
//   - error: 如果操作成功，则返回 nil；否则返回相应错误信息。
func IncreaseUserQuotaByID(userId int, quota int) (err error) {
	if quota < 0 {
		return errors.New("quota 不能为负数！")
	}

	// 如果批量更新功能启用，则记录更新记录并返回
	if common.BatchUpdateEnabled {
		updateRecord(common.BatchUpdateTypeUserQuota, userId, quota)
		return nil
	}

	return increaseUserQuotaByID(userId, quota)
}

func increaseUserQuotaByID(userId int, quota int) (err error) {
	return DB.Model(&UserProfileEntity{}).Where("id = ?", userId).Update("quota", gorm.Expr("quota + ?", quota)).Error
}

// DecreaseUserQuotaByID 减少指定用户的配额。
//
// 输入参数：
//   - userId int: 用户ID。
//   - quota int: 要减少的配额值。
//
// 输出参数：
//   - err error: 函数执行过程中的错误，如果没有错误则为 nil。
func DecreaseUserQuotaByID(userId int, quota int) (err error) {
	if quota < 0 {
		return errors.New("quota 不能为负数！")
	}

	// 如果开启了批量更新，则记录更新操作并返回
	if common.BatchUpdateEnabled {
		updateRecord(common.BatchUpdateTypeUserQuota, userId, -quota)
		return nil
	}

	return decreaseUserQuotaByID(userId, quota)
}

func decreaseUserQuotaByID(userId int, quota int) (err error) {
	return DB.Model(&UserProfileEntity{}).Where("id = ?", userId).Update("quota", gorm.Expr("quota - ?", quota)).Error
}

// updateUserUsedQuotaByID 根据用户ID更新已使用配额。
//
// 输入参数：
//   - userId int: 用户ID。
//   - quota int: 要更新的配额值。
//
// 输出参数：
//   - 无。
func updateUserUsedQuotaByID(userId int, quota int) {
	if err := DB.Model(&UserProfileEntity{}).Where("id = ?", userId).Updates(
		map[string]interface{}{
			"used_quota": gorm.Expr("used_quota + ?", quota),
		},
	).Error; err != nil {
		common.SysError("failed to update user used quota: " + err.Error())
	}
}

// updateUserRequestCountByID 根据用户ID更新请求次数。
//
// 输入参数：
//   - userId int: 用户ID。
//   - count int: 要更新的请求次数。
//
// 输出参数：
//   - 无。
func updateUserRequestCountByID(userId int, count int) {
	if err := DB.Model(&UserProfileEntity{}).Where("id = ?", userId).Updates(
		map[string]interface{}{
			"request_count": gorm.Expr("request_count + ?", count),
		},
	).Error; err != nil {
		common.SysError("failed to update user request count: " + err.Error())
	}
}

// UpdateUserUsedQuotaAndRequestCountByID 根据用户ID更新已使用配额和请求次数。
//
// 输入参数：
//   - userId int: 用户ID。
//   - quota int: 要更新的配额值。
//
// 输出参数：
//   - 无。
func UpdateUserUsedQuotaAndRequestCountByID(userId int, quota int) {

	// 如果批量更新功能启用，则调用批量更新记录的函数
	if common.BatchUpdateEnabled {
		updateRecord(common.BatchUpdateTypeUsedQuota, userId, quota)
		updateRecord(common.BatchUpdateTypeRequestCount, userId, 1)
		return
	}

	updateUserUsedQuotaAndRequestCountByID(userId, quota, 1)
}

func updateUserUsedQuotaAndRequestCountByID(userId int, quota int, count int) {
	if err := DB.Model(&UserProfileEntity{}).Where("id = ?", userId).Updates(
		map[string]interface{}{
			"used_quota":    gorm.Expr("used_quota + ?", quota),
			"request_count": gorm.Expr("request_count + ?", count),
		},
	).Error; err != nil {
		common.SysError("failed to update user used quota and request count: " + err.Error())
	}
}
