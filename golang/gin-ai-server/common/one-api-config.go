package common

import (
	"os"
	"strconv"
	"time"
)

// ChatLink 是用于聊天的链接。
var ChatLink = ""

// TopUpLink 是充值链接。
var TopUpLink = ""

// ApproximateTokenEnabled 表示是否启用近似令牌功能。
var ApproximateTokenEnabled = false

// AutomaticDisableChannelEnabled 表示是否启用自动禁用渠道功能。
var AutomaticDisableChannelEnabled = false

// AutomaticEnableChannelEnabled 表示是否启用自动启用渠道功能。
var AutomaticEnableChannelEnabled = false

// LogConsumeEnabled 表示是否记录消耗情况。
var LogConsumeEnabled = true

// DisplayInCurrencyEnabled 表示是否显示货币信息。
var DisplayInCurrencyEnabled = true

// DisplayTokenStatEnabled 表示是否显示令牌统计信息。
var DisplayTokenStatEnabled = true

// MemoryCacheEnabled 表示是否启用内存缓存。
var MemoryCacheEnabled = os.Getenv("MEMORY_CACHE_ENABLED") == "true"

// BatchUpdateEnabled 表示是否启用批量更新功能。
var BatchUpdateEnabled = false

// BatchUpdateInterval 表示批量更新的时间间隔，单位为分钟。
var BatchUpdateInterval = GetOrDefaultEnvInt("BATCH_UPDATE_INTERVAL", 5)

// ChannelDisableThreshold 表示渠道禁用阈值。
var ChannelDisableThreshold = 5.0

// QuotaPerUnit 表示每单元的配额，单位为千令牌。
var QuotaPerUnit = 500 * 1000.0 // $0.002 / 1K tokens

// QuotaRemindThreshold 表示配额提醒阈值。
var QuotaRemindThreshold int64 = 1000

// PreConsumedQuota 表示预消耗配额。
var PreConsumedQuota int64 = 500

// RetryTimes 表示重试次数。
var RetryTimes = 0

// RelayTimeout 表示转发超时时间，单位为秒。
var RelayTimeout = GetOrDefaultEnvInt("RELAY_TIMEOUT", 0)

// SyncFrequency 表示同步频率，单位为秒。
var SyncFrequency = GetOrDefaultEnvInt("SYNC_FREQUENCY", 10*60)

// RequestInterval 表示请求间隔时间。
var requestInterval, _ = strconv.Atoi(os.Getenv("POLLING_INTERVAL"))
var RequestInterval = time.Duration(requestInterval) * time.Second

// GeminiSafetySetting 表示 Gemini 安全设置。
var GeminiSafetySetting = GetOrDefaultEnvString("GEMINI_SAFETY_SETTING", "BLOCK_NONE")

var (
	QuotaForNewUser int64 = 0 // 新用户的配额
	QuotaForInviter int64 = 0 // 邀请者的配额
	QuotaForInvitee int64 = 0 // 被邀请者的配额
)

var MessagePusherAddress = ""
var MessagePusherToken = ""

var EnableMetric = GetOrDefaultEnvBool("ENABLE_METRIC", false)                                // EnableMetric 用于确定是否启用指标。
var MetricQueueSize = GetOrDefaultEnvInt("METRIC_QUEUE_SIZE", 10)                             // MetricQueueSize 表示指标队列的大小。
var MetricSuccessRateThreshold = GetOrDefaultEnvFloat64("METRIC_SUCCESS_RATE_THRESHOLD", 0.8) // MetricSuccessRateThreshold 表示指标成功率的阈值。
var MetricSuccessChanSize = GetOrDefaultEnvInt("METRIC_SUCCESS_CHAN_SIZE", 1024)              // MetricSuccessChanSize 表示指标成功通道的大小。
var MetricFailChanSize = GetOrDefaultEnvInt("METRIC_FAIL_CHAN_SIZE", 128)                     // MetricFailChanSize 表示指标失败通道的大小。

var EmailDomainRestrictionEnabled = false
var EmailDomainWhitelist = []string{
	"gmail.com",
	"163.com",
	"126.com",
	"qq.com",
	"outlook.com",
	"hotmail.com",
	"icloud.com",
	"yahoo.com",
	"foxmail.com",
}

// GroupRatio 是不同用户组的配额比例映射。
var GroupRatio = map[string]float64{
	"default": 1, // 默认用户组配额比例为1
	"vip":     1, // VIP 用户组配额比例为1
	"svip":    1, // 超级VIP 用户组配额比例为1
}

// DalleSizeRatios 存储不同 DALL-E 模型及其尺寸比率的映射关系。
var DalleSizeRatios = map[string]map[string]float64{
	"dall-e-2": {
		"256x256":   1,
		"512x512":   1.125,
		"1024x1024": 1.25,
	},
	"dall-e-3": {
		"1024x1024": 1,
		"1024x1792": 2,
		"1792x1024": 2,
	},
}

// DalleGenerationImageAmounts 存储不同 DALL-E 模型生成图像数量的范围。
var DalleGenerationImageAmounts = map[string][2]int{
	"dall-e-2": {1, 10},
	"dall-e-3": {1, 1}, // OpenAI 目前允许 n=1。
}

// DalleImagePromptLengthLimitations 存储不同 DALL-E 模型图像提示长度的限制。
var DalleImagePromptLengthLimitations = map[string]int{
	"dall-e-2": 1000,
	"dall-e-3": 4000,
}

// ChannelBaseURLs 包含不同渠道的基础 URL 列表。
var ChannelBaseURLs = []string{
	"",                              // 0
	"https://api.openai.com",        // 1 - OpenAI
	"https://oa.api2d.net",          // 2 - API2D
	"",                              // 3
	"https://api.closeai-proxy.xyz", // 4 - CloseAI Proxy
	"https://api.openai-sb.com",     // 5 - OpenAI SB
	"https://api.openaimax.com",     // 6 - OpenAI Max
	"https://api.ohmygpt.com",       // 7 - OhMyGPT
	"",                              // 8
	"https://api.caipacity.com",     // 9 - Caipacity
	"https://api.aiproxy.io",        // 10 - Aiproxy
	"https://generativelanguage.googleapis.com", // 11 - Google Generative Language
	"https://api.api2gpt.com",                   // 12 - API2GPT
	"https://api.aigc2d.com",                    // 13 - AIGC2D
	"https://api.anthropic.com",                 // 14 - Anthropic
	"https://aip.baidubce.com",                  // 15 - Baidu
	"https://open.bigmodel.cn",                  // 16 - BigModel
	"https://dashscope.aliyuncs.com",            // 17 - Aliyun
	"",                                          // 18
	"https://ai.360.cn",                         // 19 - AI.360
	"https://openrouter.ai/api",                 // 20 - OpenRouter
	"https://api.aiproxy.io",                    // 21 - Aiproxy
	"https://fastgpt.run/api/openapi",           // 22 - FastGPT
	"https://hunyuan.cloud.tencent.com",         // 23 - Tencent Cloud
	"https://generativelanguage.googleapis.com", // 24 - Google Generative Language
	"https://api.moonshot.cn",                   // 25 - Moonshot

	"https://api.baichuan-ai.com", // 26
	"https://api.minimax.chat",    // 27
	"https://api.mistral.ai",      // 28
	"https://api.groq.com/openai", // 29
	"http://localhost:11434",      // 30
	"https://api.lingyiwanwu.com", // 31
}

// ModelRatio
// https://platform.openai.com/docs/models/model-endpoint-compatibility
// https://cloud.baidu.com/doc/WENXINWORKSHOP/s/Blfmc9dlf
// https://openai.com/pricing
// TODO: when a new api is enabled, check the pricing here
// 1 === $0.002 / 1K tokens
// 1 === ￥0.014 / 1k tokens

// ModelRatio 用于存储不同模型的价格比例
var ModelRatio = map[string]float64{
	// https://openai.com/pricing OpenAI 模型价格
	"gpt-4":                   15,   // $0.03 / 1K tokens
	"gpt-4-0314":              15,   // $0.03 / 1K tokens
	"gpt-4-0613":              15,   // $0.03 / 1K tokens
	"gpt-4-32k":               30,   // $0.06 / 1K tokens
	"gpt-4-32k-0314":          30,   // $0.06 / 1K tokens
	"gpt-4-32k-0613":          30,   // $0.06 / 1K tokens
	"gpt-4-1106-preview":      5,    // $0.01 / 1K tokens
	"gpt-4-0125-preview":      5,    // $0.01 / 1K tokens
	"gpt-4-turbo-preview":     5,    // $0.01 / 1K tokens
	"gpt-4-vision-preview":    5,    // $0.01 / 1K tokens
	"gpt-3.5-turbo":           0.75, // $0.0015 / 1K tokens
	"gpt-3.5-turbo-0301":      0.75, // $0.0015 / 1K tokens
	"gpt-3.5-turbo-0613":      0.75, // $0.0015 / 1K tokens
	"gpt-3.5-turbo-16k":       1.5,  // $0.003 / 1K tokens
	"gpt-3.5-turbo-16k-0613":  1.5,  // $0.003 / 1K tokens
	"gpt-3.5-turbo-instruct":  0.75, // $0.0015 / 1K tokens
	"gpt-3.5-turbo-1106":      0.5,  // $0.001 / 1K tokens
	"gpt-3.5-turbo-0125":      0.25, // $0.0005 / 1K tokens
	"davinci-002":             1,    // $0.002 / 1K tokens
	"babbage-002":             0.2,  // $0.0004 / 1K tokens
	"text-ada-001":            0.2,
	"text-babbage-001":        0.25,
	"text-curie-001":          1,
	"text-davinci-002":        10,
	"text-davinci-003":        10,
	"text-davinci-edit-001":   10,
	"code-davinci-edit-001":   10,
	"whisper-1":               15,  // $0.006 / minute -> $0.006 / 150 words -> $0.006 / 200 tokens -> $0.03 / 1k tokens
	"tts-1":                   7.5, // $0.015 / 1K characters
	"tts-1-1106":              7.5,
	"tts-1-hd":                15, // $0.030 / 1K characters
	"tts-1-hd-1106":           15,
	"davinci":                 10,
	"curie":                   10,
	"babbage":                 10,
	"ada":                     10,
	"text-embedding-ada-002":  0.05,
	"text-embedding-3-small":  0.01,
	"text-embedding-3-large":  0.065,
	"text-search-ada-doc-001": 10,
	"text-moderation-stable":  0.1,
	"text-moderation-latest":  0.1,
	"dall-e-2":                8,  // $0.016 - $0.020 / image
	"dall-e-3":                20, // $0.040 - $0.120 / image

	// https://www.anthropic.com/api#pricing
	"claude-instant-1.2":       0.8 / 1000 * USD,
	"claude-2.0":               8.0 / 1000 * USD,
	"claude-2.1":               8.0 / 1000 * USD,
	"claude-3-haiku-20240307":  0.25 / 1000 * USD,
	"claude-3-sonnet-20240229": 3.0 / 1000 * USD,
	"claude-3-opus-20240229":   15.0 / 1000 * USD,

	// https://cloud.baidu.com/doc/WENXINWORKSHOP/s/hlrk4akp7
	"ERNIE-Bot":       0.8572,     // ￥0.012 / 1k tokens
	"ERNIE-Bot-turbo": 0.5715,     // ￥0.008 / 1k tokens
	"ERNIE-Bot-4":     0.12 * RMB, // ￥0.12 / 1k tokens
	"ERNIE-Bot-8k":    0.024 * RMB,
	"Embedding-V1":    0.1429, // ￥0.002 / 1k tokens

	"bge-large-zh":      0.002 * RMB,
	"bge-large-en":      0.002 * RMB,
	"bge-large-8k":      0.002 * RMB,
	"PaLM-2":            1,
	"gemini-pro":        1, // $0.00025 / 1k characters -> $0.001 / 1k tokens
	"gemini-pro-vision": 1, // $0.00025 / 1k characters -> $0.001 / 1k tokens

	// https://open.bigmodel.cn/pricing
	"glm-4":       0.1 * RMB,
	"glm-4v":      0.1 * RMB,
	"glm-3-turbo": 0.005 * RMB,

	"chatglm_turbo":             0.3572, // ￥0.005 / 1k tokens
	"chatglm_pro":               0.7143, // ￥0.01 / 1k tokens
	"chatglm_std":               0.3572, // ￥0.005 / 1k tokens
	"chatglm_lite":              0.1429, // ￥0.002 / 1k tokens
	"qwen-turbo":                0.5715, // ￥0.008 / 1k tokens  // https://help.aliyun.com/zh/dashscope/developer-reference/tongyi-thousand-questions-metering-and-billing
	"qwen-plus":                 1.4286, // ￥0.02 / 1k tokens
	"qwen-max":                  1.4286, // ￥0.02 / 1k tokens
	"qwen-max-longcontext":      1.4286, // ￥0.02 / 1k tokens
	"text-embedding-v1":         0.05,   // ￥0.0007 / 1k tokens
	"SparkDesk":                 1.2858, // ￥0.018 / 1k tokens
	"SparkDesk-v1.1":            1.2858, // ￥0.018 / 1k tokens
	"SparkDesk-v2.1":            1.2858, // ￥0.018 / 1k tokens
	"SparkDesk-v3.1":            1.2858, // ￥0.018 / 1k tokens
	"SparkDesk-v3.5":            1.2858, // ￥0.018 / 1k tokens
	"360GPT_S2_V9":              0.8572, // ¥0.012 / 1k tokens
	"embedding-bert-512-v1":     0.0715, // ¥0.001 / 1k tokens
	"embedding_s1_v1":           0.0715, // ¥0.001 / 1k tokens
	"semantic_similarity_s1_v1": 0.0715, // ¥0.001 / 1k tokens
	"hunyuan":                   7.143,  // ¥0.1 / 1k tokens  // https://cloud.tencent.com/document/product/1729/97731#e0e6be58-60c8-469f-bdeb-6c264ce3b4d0
	"ChatStd":                   0.01 * RMB,
	"ChatPro":                   0.1 * RMB,

	// https://platform.moonshot.cn/pricing Moonshot 模型价格
	"moonshot-v1-8k":   0.012 * RMB,
	"moonshot-v1-32k":  0.024 * RMB,
	"moonshot-v1-128k": 0.06 * RMB,

	// https://platform.baichuan-ai.com/price
	"Baichuan2-Turbo":      0.008 * RMB,
	"Baichuan2-Turbo-192k": 0.016 * RMB,
	"Baichuan2-53B":        0.02 * RMB,

	// https://api.minimax.chat/document/price
	"abab6-chat":    0.1 * RMB,
	"abab5.5-chat":  0.015 * RMB,
	"abab5.5s-chat": 0.005 * RMB,

	// https://docs.mistral.ai/platform/pricing/
	"open-mistral-7b":       0.25 / 1000 * USD,
	"open-mixtral-8x7b":     0.7 / 1000 * USD,
	"mistral-small-latest":  2.0 / 1000 * USD,
	"mistral-medium-latest": 2.7 / 1000 * USD,
	"mistral-large-latest":  8.0 / 1000 * USD,
	"mistral-embed":         0.1 / 1000 * USD,

	// https://wow.groq.com/
	"llama2-70b-4096":    0.7 / 1000 * USD,
	"llama2-7b-2048":     0.1 / 1000 * USD,
	"mixtral-8x7b-32768": 0.27 / 1000 * USD,
	"gemma-7b-it":        0.1 / 1000 * USD,

	// https://platform.lingyiwanwu.com/docs#-计费单元
	"yi-34b-chat-0205": 2.5 / 1000000 * RMB,
	"yi-34b-chat-200k": 12.0 / 1000000 * RMB,
	"yi-vl-plus":       6.0 / 1000000 * RMB,
}

var CompletionRatio = map[string]float64{}
