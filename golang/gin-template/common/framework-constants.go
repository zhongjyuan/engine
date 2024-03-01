package common

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
	TokenStatusEnabled   = 1 // don't use 0, 0 is the default value!
	TokenStatusDisabled  = 2 // also don't use 0
	TokenStatusExpired   = 3
	TokenStatusExhausted = 4
)

const (
	RequestIdKey   = "X-Oneapi-Request-Id"
	RequestBodyKey = "request_body_key"
)

const (
	sizeKB = 1024          // sizeKB 表示 1KB 的大小
	sizeMB = sizeKB * 1024 // sizeMB 表示 1MB 的大小，等于 sizeKB 的 1024 倍
	sizeGB = sizeMB * 1024 // sizeGB 表示 1GB 的大小，等于 sizeMB 的 1024 倍
)

const (
	keyChars   = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	keyNumbers = "0123456789"
)

const (
	loggerINFO  = "INFO"
	loggerWarn  = "WARN"
	loggerError = "ERR"

	maxLogCount = 1000000
)
