package common

const (
	QuotaForNewUser = 0 // 新用户的配额
	QuotaForInviter = 0 // 邀请者的配额
	QuotaForInvitee = 0 // 被邀请者的配额
)

const (
	BatchUpdateTypeUserQuota        = iota // 批量更新用户配额类型
	BatchUpdateTypeTokenQuota              // 批量更新令牌配额类型
	BatchUpdateTypeUsedQuota               // 批量更新已使用配额类型
	BatchUpdateTypeChannelUsedQuota        // 批量更新渠道已使用配额类型
	BatchUpdateTypeRequestCount            // 批量更新请求计数类型

	BatchUpdateTypeCount // 如果添加新类型，需要添加新的映射和新的锁
)

const (
	LogTypeUnknown = iota // 未知日志类型
	LogTypeTopup          // 充值日志类型
	LogTypeConsume        // 消费日志类型
	LogTypeManage         // 管理日志类型
	LogTypeSystem         // 系统日志类型
)

const (
	RedemptionCodeStatusUnknown  = iota // 未知状态：0
	RedemptionCodeStatusEnabled         // 启用状态：1
	RedemptionCodeStatusDisabled        // 禁用状态：2，不要使用 0
	RedemptionCodeStatusUsed            // 已使用状态：3，不要使用 0
)
const (
	ChannelStatusUnknown          = iota // 未知状态
	ChannelStatusEnabled                 // 启用状态：1，不要使用 0，0 是默认值！
	ChannelStatusManuallyDisabled        // 手动禁用状态：2，也不要使用 0
	ChannelStatusAutoDisabled            // 自动禁用状态：3
)

const (
	ChannelTypeUnknown        = 0  // 未知类型
	ChannelTypeOpenAI         = 1  // OpenAI 渠道
	ChannelTypeAPI2D          = 2  // API2D 渠道
	ChannelTypeAzure          = 3  // Azure 渠道
	ChannelTypeCloseAI        = 4  // CloseAI 渠道
	ChannelTypeOpenAISB       = 5  // OpenAI SB 渠道
	ChannelTypeOpenAIMax      = 6  // OpenAI Max 渠道
	ChannelTypeOhMyGPT        = 7  // OhMyGPT 渠道
	ChannelTypeCustom         = 8  // 自定义渠道
	ChannelTypeAILS           = 9  // AILS 渠道
	ChannelTypeAIProxy        = 10 // AIProxy 渠道
	ChannelTypePaLM           = 11 // PaLM 渠道
	ChannelTypeAPI2GPT        = 12 // API2GPT 渠道
	ChannelTypeAIGC2D         = 13 // AIGC2D 渠道
	ChannelTypeAnthropic      = 14 // Anthropic 渠道
	ChannelTypeBaidu          = 15 // 百度渠道
	ChannelTypeZhipu          = 16 // 智谱渠道
	ChannelTypeAli            = 17 // 阿里渠道
	ChannelTypeXunfei         = 18 // 讯飞渠道
	ChannelType360            = 19 // 360 渠道
	ChannelTypeOpenRouter     = 20 // OpenRouter 渠道
	ChannelTypeAIProxyLibrary = 21 // AIProxyLibrary 渠道
	ChannelTypeFastGPT        = 22 // FastGPT 渠道
	ChannelTypeTencent        = 23 // 腾讯渠道
	ChannelTypeGemini         = 24 // Gemini 渠道
	ChannelTypeMoonshot       = 25 // Moonshot 渠道
)

const (
	ConfigKeyPrefix     = "cfg_"                          // 配置键前缀
	ConfigKeyPlugin     = ConfigKeyPrefix + "plugin"      // 插件配置键
	ConfigKeyLibraryID  = ConfigKeyPrefix + "library_id"  // 库 ID 配置键
	ConfigKeyAPIVersion = ConfigKeyPrefix + "api_version" // API 版本配置键
)

const (
	USD2RMB = 7             // USD2RMB 表示美元兑人民币的汇率
	USD     = 500           // USD 表示美元金额，按照 $0.002 = 1 的比例 // $0.002 = 1 -> $1 = 500
	RMB     = USD / USD2RMB // RMB 表示人民币金额，根据美元金额和汇率计算得出
)
