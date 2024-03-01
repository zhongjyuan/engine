package common

import (
	"sync"
	"time"

	"github.com/google/uuid"
)

var Version = "v0.0.0"

// StartTime 存储程序启动时的 Unix 时间戳
var StartTime = time.Now().Unix() // 单位：秒

// SystemName 存储系统的名称
var SystemName = "项目模板"

// ServerAddress 存储服务器地址
var ServerAddress = "http://localhost:3000"

// Logo logo信息
var Logo = ""

// Footer 存储页脚信息
var Footer = ""

// HomePageLink 存储首页链接
var HomePageLink = ""

// Theme 主题信息
var Theme = "default"

// RootUserEmail root用户邮箱信息
var RootUserEmail = "zhongjyuan@outlook.com"

var UploadPath = "upload"

var IsMasterNode = true

// SessionSecret 使用 UUID 生成一个唯一会话密钥
var SessionSecret = uuid.New().String()

var UsingSQLite = false

var UsingPostgreSQL = false

// SQLitePath 存储到 SQLite 数据库的路径
var SQLitePath = "gin-template.db"

var SQLiteBusyTimeout = 3000

// OptionMap 存储选项的映射
var OptionMap map[string]string

// OptionMapRWMutex 用于读写锁定 OptionMap
var OptionMapRWMutex sync.RWMutex

// ItemsPerPage 指定每页的项目数
var ItemsPerPage = 10

// DebugEnabled 表示Debug模式是否启用
var DebugEnabled = false

// RedisEnabled 表示 Redis 是否启用
var RedisEnabled = true

// PasswordLoginEnabled 表示密码登录是否启用
var PasswordLoginEnabled = true

// PasswordRegisterEnabled 表示密码注册是否启用
var PasswordRegisterEnabled = true

// EmailVerificationEnabled 表示电子邮件验证是否启用
var EmailVerificationEnabled = false

// GitHubOAuthEnabled 表示是否启用 GitHub OAuth
var GitHubOAuthEnabled = false

// WeChatAuthEnabled 表示是否启用微信身份验证
var WeChatAuthEnabled = false

// TurnstileCheckEnabled 表示是否启用 Turnstile 检查
var TurnstileCheckEnabled = false

// RegisterEnabled 表示是否启用注册
var RegisterEnabled = true

// SMTPServer 存储 SMTP 服务器地址
var SMTPServer = ""

// SMTPPort 存储 SMTP 服务器端口
var SMTPPort = 587

// SMTPAccount 存储 SMTP 帐户信息
var SMTPAccount = ""

// SMTPToken 存储 SMTP 令牌
var SMTPToken = ""

// GitHubClientId 存储 GitHub 客户端 ID
var GitHubClientId = ""

// GitHubClientSecret 存储 GitHub 客户端密钥
var GitHubClientSecret = ""

// WeChatServerAddress 存储微信服务器地址
var WeChatServerAddress = ""

// WeChatServerToken 存储微信服务器令牌
var WeChatServerToken = ""

// WeChatAccountQRCodeImageURL 存储微信帐户二维码图片的 URL
var WeChatAccountQRCodeImageURL = ""

// TurnstileSiteKey 存储 Turnstile 网站密钥
var TurnstileSiteKey = ""

// TurnstileSecretKey 存储 Turnstile 秘密密钥
var TurnstileSecretKey = ""

// 不同操作的文件权限
var (
	FileUploadPermission    = RoleGuestUser
	FileDownloadPermission  = RoleGuestUser
	ImageUploadPermission   = RoleGuestUser
	ImageDownloadPermission = RoleGuestUser
)

// RateLimitKeyExpirationDuration 指定速率限制键过期的持续时间
var RateLimitKeyExpirationDuration = 20 * time.Minute

// 全局速率限制配置
var (
	GlobalApiRateLimitNum            = 60
	GlobalApiRateLimitDuration int64 = 3 * 60

	GlobalWebRateLimitNum            = 60
	GlobalWebRateLimitDuration int64 = 3 * 60

	UploadRateLimitNum            = 10
	UploadRateLimitDuration int64 = 60

	DownloadRateLimitNum            = 10
	DownloadRateLimitDuration int64 = 60

	CriticalRateLimitNum            = 20
	CriticalRateLimitDuration int64 = 20 * 60
)

// 有效主题
var ValidThemes = map[string]bool{"default": true}
