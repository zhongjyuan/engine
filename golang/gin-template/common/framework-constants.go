package common

// 有效主题
var ValidThemes = map[string]bool{"default": true}

// 不同用户角色的常量
const (
	RoleGuestUser  = 0
	RoleCommonUser = 1
	RoleAdminUser  = 10
	RoleRootUser   = 100
)

// 用户状态常量
const (
	UserStatusEnabled  = 1 // 不要使用 0，0 是默认值！
	UserStatusDisabled = 2 // 同样不要使用 0
)

const (
	TokenStatusEnabled   = 1 // TokenStatusEnabled 表示令牌状态为启用状态，值为1。
	TokenStatusDisabled  = 2 // TokenStatusDisabled 表示令牌状态为禁用状态，值为2。
	TokenStatusExpired   = 3 // TokenStatusExpired 表示令牌状态为过期状态，值为3。
	TokenStatusExhausted = 4 // TokenStatusExhausted 表示令牌状态为耗尽状态，值为4。
)

const (
	PasswordResetPurpose     = "r" // PasswordResetPurpose 表示密码重置目的
	EmailVerificationPurpose = "v" // EmailVerificationPurpose 表示邮箱验证目的
)

const (
	RequestIdKey   = "x-zhongjyuan-request-id"   // RequestIdKey 表示请求标识键，在 HTTP 头部中使用 x-zhongjyuan-request-id。
	RequestBodyKey = "x-zhongjyuan-request-body" // RequestBodyKey 表示请求体键，用于某些情况下指定请求体的键名。
)

const (
	SizeKB = 1024          // SizeKB 表示 1KB 的大小
	SizeMB = SizeKB * 1024 // SizeMB 表示 1MB 的大小，等于 SizeKB 的 1024 倍
	SizeGB = SizeMB * 1024 // SizeGB 表示 1GB 的大小，等于 SizeMB 的 1024 倍
	SizeTB = SizeGB * 1024 // SizeTB 表示 1TB 的大小，等于 SizeGB 的 1024 倍
)

const (
	KeyChars   = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" // KeyChars 包含用于生成键的字符集合，包括数字 0-9、小写字母和大写字母。
	KeyNumbers = "0123456789"                                                     // KeyNumbers 包含用于生成数字键的字符集合，仅包括数字 0-9。
)

const (
	LogSysLevel int8 = iota - 2
	LogTraceLevel
	LogDebugLevel
	LogInfoLevel
	LogWarnLevel
	LogErrorLevel

	LogMaxCount = 1000000 // LogMaxCount 表示最大日志条目数量。
)
