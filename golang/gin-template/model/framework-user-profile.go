package model

import "errors"

const UserProFileTableName = "plat_user_profile"

// UserProfileEntity 结构体定义了用户的数据模型。
type UserProfileEntity struct {
	Id               int    `json:"id" gorm:"column:id;primaryKey;unique"`  // 用户ID，唯一主键，自增
	GitHubId         string `json:"githubId" gorm:"column:github_id;index"` // GitHub ID，索引
	WeChatId         string `json:"wechatId" gorm:"column:wechat_id;index"` // 微信 ID，索引
	VerificationCode string `json:"verificationCode" gorm:"-:all"`          // 验证码，仅用于邮箱验证，不保存到数据库
}

func (UserProfileEntity) TableName() string {
	return UserProFileTableName
}

func (userProfile *UserProfileEntity) UpdateGitHubID() error {
	return DB.Model(&UserEntity{}).Where("id = ?", userProfile.Id).UpdateColumn("github_id", userProfile.GitHubId).Error
}

func (userProfile *UserProfileEntity) UpdateWeChatID() error {
	return DB.Model(&UserEntity{}).Where("id = ?", userProfile.Id).UpdateColumn("wechat_id", userProfile.WeChatId).Error
}

func (userProfile *UserProfileEntity) GetUserByGitHubID(selectAll bool) (*UserEntity, error) {
	// 如果GitHub ID为空，则返回错误信息
	if userProfile.GitHubId == "" {
		return nil, errors.New("GitHub id 为空！")
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
		return nil, errors.New("WeChat id 为空！")
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

func GetUserByGitHubID(gitHubId string, selectAll bool) (*UserEntity, error) {
	// 如果GitHub ID为空，则返回错误信息
	if gitHubId == "" {
		return nil, errors.New("GitHub id 为空！")
	}

	// 创建一个 UserProfileEntity 实例，用于存储查询结果
	userProfile := UserProfileEntity{GitHubId: gitHubId}
	if err := DB.First(&userProfile, "github_id = ?", userProfile.GitHubId).Error; err != nil {
		return nil, err
	}

	return userProfile.GetUserByGitHubID(selectAll)
}

func GetUserByWeChatID(weChatId string, selectAll bool) (*UserEntity, error) {
	// 如果WeChat ID为空，则返回错误信息
	if weChatId == "" {
		return nil, errors.New("WeChat id 为空！")
	}

	// 创建一个 UserEntity 实例，用于存储查询结果
	userProfile := UserProfileEntity{WeChatId: weChatId}
	if err := DB.First(&userProfile, "wechat_id = ?", userProfile.GitHubId).Error; err != nil {
		return nil, err
	}

	return userProfile.GetUserByWeChatID(selectAll)
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
