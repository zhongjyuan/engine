package common

import (
	"os"
	"strconv"
	"time"
)

var ChatLink = ""

var TopUpLink = ""

var BatchUpdateEnabled = false
var BatchUpdateInterval = GetOrDefaultEnvInt("BATCH_UPDATE_INTERVAL", 5)

var MemoryCacheEnabled = os.Getenv("MEMORY_CACHE_ENABLED") == "true"

var ChannelDisableThreshold = 5.0
var AutomaticDisableChannelEnabled = false
var AutomaticEnableChannelEnabled = false
var QuotaRemindThreshold = 1000
var PreConsumedQuota = 500
var ApproximateTokenEnabled = false
var RetryTimes = 0
var RelayTimeout = GetOrDefaultEnvInt("RELAY_TIMEOUT", 0) // unit is second

var SyncFrequency = GetOrDefaultEnvInt("SYNC_FREQUENCY", 10*60)

var LogConsumeEnabled = true

var QuotaPerUnit = 500 * 1000.0 // $0.002 / 1K tokens

var DisplayInCurrencyEnabled = true
var DisplayTokenStatEnabled = true

var GeminiSafetySetting = GetOrDefaultEnvString("GEMINI_SAFETY_SETTING", "BLOCK_NONE")

var requestInterval, _ = strconv.Atoi(os.Getenv("POLLING_INTERVAL"))
var RequestInterval = time.Duration(requestInterval) * time.Second

var GroupRatio = map[string]float64{
	"default": 1,
	"vip":     1,
	"svip":    1,
}

var ChannelBaseURLs = []string{
	"",                              // 0
	"https://api.openai.com",        // 1
	"https://oa.api2d.net",          // 2
	"",                              // 3
	"https://api.closeai-proxy.xyz", // 4
	"https://api.openai-sb.com",     // 5
	"https://api.openaimax.com",     // 6
	"https://api.ohmygpt.com",       // 7
	"",                              // 8
	"https://api.caipacity.com",     // 9
	"https://api.aiproxy.io",        // 10
	"https://generativelanguage.googleapis.com", // 11
	"https://api.api2gpt.com",                   // 12
	"https://api.aigc2d.com",                    // 13
	"https://api.anthropic.com",                 // 14
	"https://aip.baidubce.com",                  // 15
	"https://open.bigmodel.cn",                  // 16
	"https://dashscope.aliyuncs.com",            // 17
	"",                                          // 18
	"https://ai.360.cn",                         // 19
	"https://openrouter.ai/api",                 // 20
	"https://api.aiproxy.io",                    // 21
	"https://fastgpt.run/api/openapi",           // 22
	"https://hunyuan.cloud.tencent.com",         // 23
	"https://generativelanguage.googleapis.com", // 24
	"https://api.moonshot.cn",                   // 25
}
