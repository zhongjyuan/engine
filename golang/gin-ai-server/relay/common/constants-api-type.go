package relaycommon

import "zhongjyuan/gin-ai-server/common"

const (
	APITypeOpenAI         = iota // APITypeOpenAI 表示 API 类型为 OpenAI。
	APITypeAnthropic             // APITypeAnthropic 表示 API 类型为 Anthropic。
	APITypePaLM                  // APITypePaLM 表示 API 类型为 PaLM。
	APITypeBaidu                 // APITypeBaidu 表示 API 类型为 Baidu。
	APITypeZhipu                 // APITypeZhipu 表示 API 类型为 Zhipu。
	APITypeAli                   // APITypeAli 表示 API 类型为 Ali。
	APITypeXunfei                // APITypeXunfei 表示 API 类型为 Xunfei。
	APITypeAIProxyLibrary        // APITypeAIProxyLibrary 表示 API 类型为 AIProxyLibrary。
	APITypeTencent               // APITypeTencent 表示 API 类型为 Tencent。
	APITypeGemini                // APITypeGemini 表示 API 类型为 Gemini。

	APITypeDummy // APITypeDummy 仅用于计数，不要在此之后添加任何通道。
)

// GetApiTypeByChannelType 根据渠道类型获取对应的 API 类型。
//
// 输入参数：
//   - channelType int: 渠道类型。
// 输出参数：
//   - int: 对应的 API 类型。
func GetApiTypeByChannelType(channelType int) int {
	switch channelType {
	case common.ChannelTypeAnthropic:
		return APITypeAnthropic // 返回 Anthropic API 类型
	case common.ChannelTypeBaidu:
		return APITypeBaidu // 返回 Baidu API 类型
	case common.ChannelTypePaLM:
		return APITypePaLM // 返回 PaLM API 类型
	case common.ChannelTypeZhipu:
		return APITypeZhipu // 返回 Zhipu API 类型
	case common.ChannelTypeAli:
		return APITypeAli // 返回 Ali API 类型
	case common.ChannelTypeXunfei:
		return APITypeXunfei // 返回 Xunfei API 类型
	case common.ChannelTypeAIProxyLibrary:
		return APITypeAIProxyLibrary // 返回 AIProxyLibrary API 类型
	case common.ChannelTypeTencent:
		return APITypeTencent // 返回 Tencent API 类型
	case common.ChannelTypeGemini:
		return APITypeGemini // 返回 Gemini API 类型
	default:
		return APITypeOpenAI // 默认返回 OpenAI API 类型
	}
}
