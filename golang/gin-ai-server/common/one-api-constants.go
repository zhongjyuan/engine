package common

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
	ChannelTypeUnknown        = iota // 未知类型
	ChannelTypeOpenAI                // OpenAI 渠道
	ChannelTypeAPI2D                 // API2D 渠道
	ChannelTypeAzure                 // Azure 渠道
	ChannelTypeCloseAI               // CloseAI 渠道
	ChannelTypeOpenAISB              // OpenAI SB 渠道
	ChannelTypeOpenAIMax             // OpenAI Max 渠道
	ChannelTypeOhMyGPT               // OhMyGPT 渠道
	ChannelTypeCustom                // 自定义渠道
	ChannelTypeAILS                  // AILS 渠道
	ChannelTypeAIProxy               // AIProxy 渠道
	ChannelTypePaLM                  // PaLM 渠道
	ChannelTypeAPI2GPT               // API2GPT 渠道
	ChannelTypeAIGC2D                // AIGC2D 渠道
	ChannelTypeAnthropic             // Anthropic 渠道
	ChannelTypeBaidu                 // 百度渠道
	ChannelTypeZhipu                 // 智谱渠道
	ChannelTypeAli                   // 阿里渠道
	ChannelTypeXunfei                // 讯飞渠道
	ChannelType360                   // 360 渠道
	ChannelTypeOpenRouter            // OpenRouter 渠道
	ChannelTypeAIProxyLibrary        // AIProxyLibrary 渠道
	ChannelTypeFastGPT               // FastGPT 渠道
	ChannelTypeTencent               // 腾讯渠道
	ChannelTypeGemini                // Gemini 渠道
	ChannelTypeMoonshot              // Moonshot 渠道

	ChannelTypeBaichuan
	ChannelTypeMinimax
	ChannelTypeMistral
	ChannelTypeGroq
	ChannelTypeOllama
	ChannelTypeLingYiWanWu

	ChannelTypeDummy
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
