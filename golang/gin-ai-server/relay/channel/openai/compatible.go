package channel_openai

import (
	"zhongjyuan/gin-ai-server/common"
	channel_360 "zhongjyuan/gin-ai-server/relay/channel/360"
	channel_baichuan "zhongjyuan/gin-ai-server/relay/channel/baichuan"
	channel_groq "zhongjyuan/gin-ai-server/relay/channel/groq"
	channel_lingyiwanwu "zhongjyuan/gin-ai-server/relay/channel/lingyiwanwu"
	channel_minimax "zhongjyuan/gin-ai-server/relay/channel/minimax"
	channel_mistral "zhongjyuan/gin-ai-server/relay/channel/mistral"
	channel_moonshot "zhongjyuan/gin-ai-server/relay/channel/moonshot"
)

var CompatibleChannels = []int{
	common.ChannelTypeAzure,
	common.ChannelType360,
	common.ChannelTypeMoonshot,
	common.ChannelTypeBaichuan,
	common.ChannelTypeMinimax,
	common.ChannelTypeMistral,
	common.ChannelTypeGroq,
	common.ChannelTypeLingYiWanWu,
}

func GetCompatibleChannelMeta(channelType int) (string, []string) {
	switch channelType {
	case common.ChannelTypeAzure:
		return "azure", ModelList
	case common.ChannelType360:
		return "360", channel_360.ModelList
	case common.ChannelTypeMoonshot:
		return "moonshot", channel_moonshot.ModelList
	case common.ChannelTypeBaichuan:
		return "baichuan", channel_baichuan.ModelList
	case common.ChannelTypeMinimax:
		return "minimax", channel_minimax.ModelList
	case common.ChannelTypeMistral:
		return "mistralai", channel_mistral.ModelList
	case common.ChannelTypeGroq:
		return "groq", channel_groq.ModelList
	case common.ChannelTypeLingYiWanWu:
		return "lingyiwanwu", channel_lingyiwanwu.ModelList
	default:
		return "openai", ModelList
	}
}
