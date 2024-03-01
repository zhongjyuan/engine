package model

import (
	"strconv"
	"strings"
	"zhongjyuan/gin-template/common"
)

// Option 结构体用于表示选项，包含键值对。
type Option struct {
	Key   string `json:"key" gorm:"primaryKey"` // Key 字段表示选项的键。
	Value string `json:"value"`                 // Value 字段表示选项的值。
}

// AllOption 函数用于获取所有选项。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - []*Option: 返回所有选项的切片。
//   - error: 如果出现错误，返回相应的错误信息；否则为 nil。
func AllOption() ([]*Option, error) {
	// 声明一个错误变量
	var err error

	// 声明一个选项切片
	var options []*Option

	// 从数据库中查找所有选项，并将结果存储到 options 中
	err = DB.Find(&options).Error

	// 返回选项切片和错误信息
	return options, err
}

// InitOptionMap 初始化选项映射。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func InitOptionMap() {
	// 锁定 OptionMap 以防止并发修改。
	common.OptionMapRWMutex.Lock()

	// 初始化 OptionMap，并设置各项配置参数。
	common.OptionMap = make(map[string]string)
	common.OptionMap["FileUploadPermission"] = strconv.Itoa(common.FileUploadPermission)
	common.OptionMap["FileDownloadPermission"] = strconv.Itoa(common.FileDownloadPermission)
	common.OptionMap["ImageUploadPermission"] = strconv.Itoa(common.ImageUploadPermission)
	common.OptionMap["ImageDownloadPermission"] = strconv.Itoa(common.ImageDownloadPermission)
	common.OptionMap["PasswordLoginEnabled"] = strconv.FormatBool(common.PasswordLoginEnabled)
	common.OptionMap["PasswordRegisterEnabled"] = strconv.FormatBool(common.PasswordRegisterEnabled)
	common.OptionMap["EmailVerificationEnabled"] = strconv.FormatBool(common.EmailVerificationEnabled)
	common.OptionMap["GitHubOAuthEnabled"] = strconv.FormatBool(common.GitHubOAuthEnabled)
	common.OptionMap["WeChatAuthEnabled"] = strconv.FormatBool(common.WeChatAuthEnabled)
	common.OptionMap["TurnstileCheckEnabled"] = strconv.FormatBool(common.TurnstileCheckEnabled)
	common.OptionMap["RegisterEnabled"] = strconv.FormatBool(common.RegisterEnabled)
	common.OptionMap["SMTPServer"] = ""
	common.OptionMap["SMTPPort"] = strconv.Itoa(common.SMTPPort)
	common.OptionMap["SMTPAccount"] = ""
	common.OptionMap["SMTPToken"] = ""
	common.OptionMap["Notice"] = ""
	common.OptionMap["About"] = ""
	common.OptionMap["Footer"] = common.Footer
	common.OptionMap["HomePageLink"] = common.HomePageLink
	common.OptionMap["SystemName"] = common.SystemName
	common.OptionMap["ServerAddress"] = ""
	common.OptionMap["GitHubClientId"] = ""
	common.OptionMap["GitHubClientSecret"] = ""
	common.OptionMap["WeChatServerAddress"] = ""
	common.OptionMap["WeChatServerToken"] = ""
	common.OptionMap["WeChatAccountQRCodeImageURL"] = ""
	common.OptionMap["TurnstileSiteKey"] = ""
	common.OptionMap["TurnstileSecretKey"] = ""

	// 解锁 OptionMap。
	common.OptionMapRWMutex.Unlock()

	// 获取所有选项并更新 OptionMap。
	options, _ := AllOption()
	for _, option := range options {
		updateOptionMap(option.Key, option.Value)
	}
}

// UpdateOption 函数用于更新选项的键值对。
//
// 输入参数：
//   - key string: 要更新的选项的键。
//   - value string: 要更新的选项的值。
//
// 输出参数：
//   - error: 如果在更新过程中发生错误，则返回非空的 error；否则返回 nil。
func UpdateOption(key string, value string) error {
	// 首先保存到数据库
	option := Option{
		Key: key,
	}

	// https://gorm.io/docs/update.html#Save-All-Fields
	// 先尝试从数据库中查找记录，如果不存在则创建新记录
	DB.FirstOrCreate(&option, Option{Key: key})

	option.Value = value

	// Save 是一个组合函数。
	// 如果保存的值不包含主键，则执行 Create 操作，
	// 否则执行 Update 操作（更新所有字段）。
	DB.Save(&option)

	// 更新 OptionMap
	updateOptionMap(key, value)

	return nil
}

// updateOptionMap 函数用于更新选项映射。
//
// 输入参数：
//   - key string: 要更新的选项键名。
//   - value string: 要更新的选项值。
//
// 输出参数：
//   - 无。
func updateOptionMap(key string, value string) {
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
		}
	}

	// 根据选项键名更新相应的选项值
	switch key {
	case "SMTPServer":
		common.SMTPServer = value
	case "SMTPPort":
		// 将字符串值转换为整数
		intValue, _ := strconv.Atoi(value)
		common.SMTPPort = intValue
	case "SMTPAccount":
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
	case "HomePageLink":
		common.HomePageLink = value
	case "SystemName":
		common.SystemName = value
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
	case "Theme":
		common.Theme = value
	}
}
