package model

import (
	"strconv"
	"strings"
	"zhongjyuan/gin-ai-server/common"
)

const OptionTableName = "plat_option"

// OptionEntity 结构体用于表示选项，包含键值对。
type OptionEntity struct {
	Key         string `json:"key" gorm:"column:key;size:50;primaryKey"`   // Key 字段表示选项的键。
	Value       string `json:"value" gorm:"column:value;size:100"`         // Value 字段表示选项的值。
	Description string `json:"-" gorm:"column:description;size:200"`       // 文件描述
	Status      int    `json:"-" gorm:"column:status;type:int;default:1"`  // 状态，默认为1（enabled or disabled）
	CreatorId   int    `json:"-" gorm:"column:creator_id;index"`           // 创建者ID，并在数据库中创建索引
	CreatorName string `json:"-" gorm:"column:creator_name;size:50;index"` // 创建者ID，并在数据库中创建索引
	CreateTime  string `json:"-" gorm:"column:create_time;index"`          // 创建时间
	UpdatorId   int    `json:"-" gorm:"column:updator_id;index"`           // 更新者ID，并在数据库中创建索引
	UpdatorName string `json:"-" gorm:"column:updator_name;size:50;index"` // 更新者ID，并在数据库中创建索引
	UpdateTime  string `json:"-" gorm:"column:update_time;index"`          // 更新时间
}

func (OptionEntity) TableName() string {
	return OptionTableName
}

func (option *OptionEntity) Insert() error {
	return DB.Create(option).Error
}

func (option *OptionEntity) Delete(logical ...bool) error {
	var isLogicalDelete bool
	if len(logical) > 0 {
		isLogicalDelete = logical[0]
	} else {
		isLogicalDelete = true // 默认为逻辑删除
	}

	var err error // 定义一个错误变量，用于存储过程中可能发生的错误。

	if isLogicalDelete {
		// 逻辑删除：将 is_deleted 标记设置为 1。
		err = DB.Model(&FileEntity{}).Where("key = ?", option.Key).UpdateColumn("is_deleted", 1).Error
	} else {
		// 物理删除：从数据库中删除指定的文件记录。
		err = DB.Delete(option).Error // 如果数据库删除操作发生错误，将错误信息赋值给 err 变量。
	}

	return err // 返回从文件系统删除文件过程中可能发生的错误，如果没有错误发生，则返回 nil。
}

func (option *OptionEntity) Update() error {
	// 使用 GORM 的 Updates 方法，传入 option 结构体变量，GORM 会自动忽略零值字段
	return DB.Model(&OptionEntity{}).Where("key = ?", option.Key).Updates(&option).Error
}

func (option *OptionEntity) UpdateValue() error {
	return DB.Model(&FileEntity{}).Where("key = ?", option.Key).UpdateColumn("value", option.Value).Error
}

func (option *OptionEntity) UpdateStatus() error {
	return DB.Model(&FileEntity{}).Where("key = ?", option.Key).UpdateColumn("status", option.Status).Error
}

func (option *OptionEntity) UpdateDescription() error {
	return DB.Model(&FileEntity{}).Where("key = ?", option.Key).UpdateColumn("description", option.Description).Error
}

func InsertOption(option *OptionEntity) error {
	return option.Insert()
}

func DeleteOption(option *OptionEntity) error {
	return option.Delete()
}

func UpdateOption(option *OptionEntity) error {
	return option.Update()
}

// UpdateOption 函数用于更新选项的键值对。
//
// 输入参数：
//   - key string: 要更新的选项的键。
//   - value string: 要更新的选项的值。
//
// 输出参数：
//   - error: 如果在更新过程中发生错误，则返回非空的 error；否则返回 nil。
func UpdateOptionMap(key string, value string) error {
	// 首先保存到数据库
	option := OptionEntity{
		Key: key,
	}

	// https://gorm.io/docs/update.html#Save-All-Fields
	// 先尝试从数据库中查找记录，如果不存在则创建新记录
	DB.FirstOrCreate(&option, OptionEntity{Key: key})

	option.Value = value

	// Save 是一个组合函数。
	// 如果保存的值不包含主键，则执行 Create 操作，
	// 否则执行 Update 操作（更新所有字段）。
	DB.Save(&option)

	// 更新 OptionMap
	updateOptionConfig(key, value)

	return nil
}

func UpdateOptionValue(option *OptionEntity) error {
	return option.UpdateValue()
}

func UpdateOptionStatus(option *OptionEntity) error {
	return option.UpdateStatus()
}

func UpdateOptionDescription(option *OptionEntity) error {
	return option.UpdateDescription()
}

func GetOptionByKey(key string) (*OptionEntity, error) {
	// 创建一个文件实体对象
	optionEntity := &OptionEntity{}

	// 查询数据库，根据文件 ID 查询文件对象并返回结果
	err := DB.Where("key = ? and is_deleted = ?", key, 0).First(&optionEntity).Error

	return optionEntity, err
}

func GetAllOptions() ([]*OptionEntity, error) {
	// 声明一个错误变量
	var err error

	// 声明一个选项切片
	var options []*OptionEntity

	// 从数据库中查找所有选项，并将结果存储到 options 中
	err = DB.Find(&options).Error

	// 返回选项切片和错误信息
	return options, err
}

func GetPageOptions(startIdx int, num int) ([]*OptionEntity, error) {
	// 声明存储选项信息的切片
	var options []*OptionEntity

	// 查询数据库，按照 id 降序排列，限制数量为 num，偏移量为 startIdx，将结果存储到 options 中
	err := DB.Where("is_deleted = ?", 0).Order("key desc").Limit(num).Offset(startIdx).Find(&options).Error

	return options, err
}

func SearchOptions(keyword string) (options []*OptionEntity, err error) {
	// 使用数据库查询以获取与关键字匹配的文件信息
	err = DB.Select([]string{
		"key",
		"value",
	}).Where(
		"key LIKE ? or value LIKE ?",
		keyword+"%",
		keyword,
	).Find(&options).Error

	return options, err
}

// InitOptionMap 初始化选项映射。
func InitOptionMap() {
	// 锁定 OptionMap 以防止并发修改。
	common.OptionMapRWMutex.Lock()

	// 初始化 OptionMap，并设置各项配置参数。
	common.OptionMap = make(map[string]string)
	common.OptionMap["PasswordLoginEnabled"] = strconv.FormatBool(common.PasswordLoginEnabled)
	common.OptionMap["PasswordRegisterEnabled"] = strconv.FormatBool(common.PasswordRegisterEnabled)
	common.OptionMap["EmailVerificationEnabled"] = strconv.FormatBool(common.EmailVerificationEnabled)
	common.OptionMap["GitHubOAuthEnabled"] = strconv.FormatBool(common.GitHubOAuthEnabled)
	common.OptionMap["WeChatAuthEnabled"] = strconv.FormatBool(common.WeChatAuthEnabled)
	common.OptionMap["TurnstileCheckEnabled"] = strconv.FormatBool(common.TurnstileCheckEnabled)
	common.OptionMap["RegisterEnabled"] = strconv.FormatBool(common.RegisterEnabled)
	common.OptionMap["AutomaticDisableChannelEnabled"] = strconv.FormatBool(common.AutomaticDisableChannelEnabled)
	common.OptionMap["AutomaticEnableChannelEnabled"] = strconv.FormatBool(common.AutomaticEnableChannelEnabled)
	common.OptionMap["ApproximateTokenEnabled"] = strconv.FormatBool(common.ApproximateTokenEnabled)
	common.OptionMap["LogConsumeEnabled"] = strconv.FormatBool(common.LogConsumeEnabled)
	common.OptionMap["DisplayInCurrencyEnabled"] = strconv.FormatBool(common.DisplayInCurrencyEnabled)
	common.OptionMap["DisplayTokenStatEnabled"] = strconv.FormatBool(common.DisplayTokenStatEnabled)
	common.OptionMap["ChannelDisableThreshold"] = strconv.FormatFloat(common.ChannelDisableThreshold, 'f', -1, 64)
	common.OptionMap["EmailDomainRestrictionEnabled"] = strconv.FormatBool(common.EmailDomainRestrictionEnabled)
	common.OptionMap["EmailDomainWhitelist"] = strings.Join(common.EmailDomainWhitelist, ",")
	common.OptionMap["SMTPServer"] = common.SMTPServer
	common.OptionMap["SMTPFrom"] = common.SMTPAccount
	common.OptionMap["SMTPPort"] = strconv.Itoa(common.SMTPPort)
	common.OptionMap["SMTPAccount"] = common.SMTPAccount
	common.OptionMap["SMTPToken"] = common.SMTPToken
	common.OptionMap["Notice"] = ""
	common.OptionMap["About"] = ""
	common.OptionMap["Logo"] = common.Logo
	common.OptionMap["HomePageContent"] = ""
	common.OptionMap["Footer"] = common.Footer
	common.OptionMap["Theme"] = common.Theme
	common.OptionMap["SystemName"] = common.SystemName
	common.OptionMap["ServerAddress"] = common.ServerAddress
	common.OptionMap["GitHubClientId"] = common.GitHubClientId
	common.OptionMap["GitHubClientSecret"] = common.GitHubClientSecret
	common.OptionMap["WeChatServerAddress"] = common.WeChatServerAddress
	common.OptionMap["WeChatServerToken"] = common.WeChatServerToken
	common.OptionMap["WeChatAccountQRCodeImageURL"] = ""
	common.OptionMap["TurnstileSiteKey"] = common.TurnstileSiteKey
	common.OptionMap["TurnstileSecretKey"] = common.TurnstileSecretKey

	common.OptionMap["MessagePusherAddress"] = ""
	common.OptionMap["MessagePusherToken"] = ""
	common.OptionMap["QuotaForNewUser"] = strconv.FormatInt(common.QuotaForNewUser, 10)
	common.OptionMap["QuotaForInviter"] = strconv.FormatInt(common.QuotaForInviter, 10)
	common.OptionMap["QuotaForInvitee"] = strconv.FormatInt(common.QuotaForInvitee, 10)
	common.OptionMap["QuotaRemindThreshold"] = strconv.FormatInt(common.QuotaRemindThreshold, 10)
	common.OptionMap["PreConsumedQuota"] = strconv.FormatInt(common.PreConsumedQuota, 10)
	common.OptionMap["ModelRatio"] = common.ConvertModelRatioToJSONString()
	common.OptionMap["GroupRatio"] = common.ConvertGroupRatioToJSONString()
	common.OptionMap["CompletionRatio"] = common.ConvertCompletionRatioToJSONString()
	common.OptionMap["TopUpLink"] = common.TopUpLink
	common.OptionMap["ChatLink"] = common.ChatLink
	common.OptionMap["QuotaPerUnit"] = strconv.FormatFloat(common.QuotaPerUnit, 'f', -1, 64)
	common.OptionMap["RetryTimes"] = strconv.Itoa(common.RetryTimes)

	// 解锁 OptionMap。
	common.OptionMapRWMutex.Unlock()

	// 获取所有选项并更新 OptionMap。
	options, _ := GetAllOptions()
	for _, option := range options {
		if option.Key == "ModelRatio" {
			option.Value = common.UpdateMissingRatio(option.Value)
		}

		if err := updateOptionConfig(option.Key, option.Value); err != nil {
			common.SysError("failed to update option map: " + err.Error())
		}
	}
}

// updateOptionConfig 函数用于更新选项映射。
//
// 输入参数：
//   - key string: 要更新的选项键名。
//   - value string: 要更新的选项值。
//
// 输出参数：
//   - 无。
func updateOptionConfig(key string, value string) (err error) {
	// 加锁以防止并发访问
	common.OptionMapRWMutex.Lock()
	defer common.OptionMapRWMutex.Unlock()

	// 更新选项映射
	common.OptionMap[key] = value

	// 检查是否为权限选项，如果是则更新相应权限值
	if strings.HasSuffix(key, "Permission") {
		// 将字符串值转换为整数
		intValue, _ := strconv.Atoi(value)
		switch key {
		case "FileUploadPermission":
			common.FileUploadPermission = intValue
		case "FileDownloadPermission":
			common.FileDownloadPermission = intValue
		case "ImageUploadPermission":
			common.ImageUploadPermission = intValue
		case "ImageDownloadPermission":
			common.ImageDownloadPermission = intValue
		}
	}

	// 检查是否为启用选项，如果是则更新相应布尔值
	if strings.HasSuffix(key, "Enabled") {
		// 将字符串值转换为布尔值
		boolValue := value == "true"
		switch key {
		case "PasswordRegisterEnabled":
			common.PasswordRegisterEnabled = boolValue
		case "PasswordLoginEnabled":
			common.PasswordLoginEnabled = boolValue
		case "EmailVerificationEnabled":
			common.EmailVerificationEnabled = boolValue
		case "GitHubOAuthEnabled":
			common.GitHubOAuthEnabled = boolValue
		case "WeChatAuthEnabled":
			common.WeChatAuthEnabled = boolValue
		case "TurnstileCheckEnabled":
			common.TurnstileCheckEnabled = boolValue
		case "RegisterEnabled":
			common.RegisterEnabled = boolValue
		case "EmailDomainRestrictionEnabled":
			common.EmailDomainRestrictionEnabled = boolValue
		case "AutomaticDisableChannelEnabled":
			common.AutomaticDisableChannelEnabled = boolValue
		case "AutomaticEnableChannelEnabled":
			common.AutomaticEnableChannelEnabled = boolValue
		case "ApproximateTokenEnabled":
			common.ApproximateTokenEnabled = boolValue
		case "LogConsumeEnabled":
			common.LogConsumeEnabled = boolValue
		case "DisplayInCurrencyEnabled":
			common.DisplayInCurrencyEnabled = boolValue
		case "DisplayTokenStatEnabled":
			common.DisplayTokenStatEnabled = boolValue
		}
	}

	// 根据选项键名更新相应的选项值
	switch key {
	case "EmailDomainWhitelist":
		common.EmailDomainWhitelist = strings.Split(value, ",")
	case "SMTPServer":
		common.SMTPServer = value
	case "SMTPPort":
		intValue, _ := strconv.Atoi(value)
		common.SMTPPort = intValue
	case "SMTPAccount":
		common.SMTPAccount = value
	case "SMTPFrom":
		common.SMTPAccount = value
	case "SMTPToken":
		common.SMTPToken = value
	case "ServerAddress":
		common.ServerAddress = value
	case "GitHubClientId":
		common.GitHubClientId = value
	case "GitHubClientSecret":
		common.GitHubClientSecret = value
	case "Footer":
		common.Footer = value
	case "SystemName":
		common.SystemName = value
	case "Logo":
		common.Logo = value
	case "WeChatServerAddress":
		common.WeChatServerAddress = value
	case "WeChatServerToken":
		common.WeChatServerToken = value
	case "WeChatAccountQRCodeImageURL":
		common.WeChatAccountQRCodeImageURL = value
	case "TurnstileSiteKey":
		common.TurnstileSiteKey = value
	case "TurnstileSecretKey":
		common.TurnstileSecretKey = value
	case "QuotaForNewUser":
		common.QuotaForNewUser, _ = strconv.ParseInt(value, 10, 64)
	case "QuotaForInviter":
		common.QuotaForInviter, _ = strconv.ParseInt(value, 10, 64)
	case "QuotaForInvitee":
		common.QuotaForInvitee, _ = strconv.ParseInt(value, 10, 64)
	case "QuotaRemindThreshold":
		common.QuotaRemindThreshold, _ = strconv.ParseInt(value, 10, 64)
	case "PreConsumedQuota":
		common.PreConsumedQuota, _ = strconv.ParseInt(value, 10, 64)
	case "RetryTimes":
		common.RetryTimes, _ = strconv.Atoi(value)
	case "ModelRatio":
		err = common.UpdateModelRatioFromJSONString(value)
	case "GroupRatio":
		err = common.UpdateGroupRatioFromJSONString(value)
	case "CompletionRatio":
		err = common.UpdateCompletionRatioFromJSONString(value)
	case "TopUpLink":
		common.TopUpLink = value
	case "ChatLink":
		common.ChatLink = value
	case "ChannelDisableThreshold":
		common.ChannelDisableThreshold, _ = strconv.ParseFloat(value, 64)
	case "QuotaPerUnit":
		common.QuotaPerUnit, _ = strconv.ParseFloat(value, 64)
	case "Theme":
		common.Theme = value
	case "MessagePusherAddress":
		common.MessagePusherAddress = value
	case "MessagePusherToken":
		common.MessagePusherToken = value
	}

	return err
}
