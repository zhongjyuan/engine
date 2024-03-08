package relay

import (
	relaychannel "zhongjyuan/gin-ai-server/relay/channel"
	channel_ali "zhongjyuan/gin-ai-server/relay/channel/ali"
	channel_anthropic "zhongjyuan/gin-ai-server/relay/channel/anthropic"
	channel_baidu "zhongjyuan/gin-ai-server/relay/channel/baidu"
	channel_gemini "zhongjyuan/gin-ai-server/relay/channel/gemini"
	channel_openai "zhongjyuan/gin-ai-server/relay/channel/openai"
	channel_palm "zhongjyuan/gin-ai-server/relay/channel/palm"
	channel_proxy "zhongjyuan/gin-ai-server/relay/channel/proxy"
	channel_tencent "zhongjyuan/gin-ai-server/relay/channel/tencent"
	channel_xunfei "zhongjyuan/gin-ai-server/relay/channel/xunfei"
	channel_zhipu "zhongjyuan/gin-ai-server/relay/channel/zhipu"
	relaycommon "zhongjyuan/gin-ai-server/relay/common"
)

// GetAdaptor 根据给定的 API 类型返回对应的适配器实例。
//
// 输入参数：
//   - apiType int: API 类型，表示要获取的适配器类型。
//
// 输出参数：
//   - Adaptor: 返回对应的适配器实例，如果未找到对应类型的适配器，则返回 nil。
func GetAdaptor(apiType int) relaychannel.Adaptor {
	var adaptor relaychannel.Adaptor

	switch apiType {
	case relaycommon.APITypeAIProxyLibrary:
		adaptor = &channel_proxy.Adaptor{}
	case relaycommon.APITypeAli:
		adaptor = &channel_ali.Adaptor{}
	case relaycommon.APITypeAnthropic:
		adaptor = &channel_anthropic.Adaptor{}
	case relaycommon.APITypeBaidu:
		adaptor = &channel_baidu.Adaptor{}
	case relaycommon.APITypeGemini:
		adaptor = &channel_gemini.Adaptor{}
	case relaycommon.APITypeOpenAI:
		adaptor = &channel_openai.Adaptor{}
	case relaycommon.APITypePaLM:
		adaptor = &channel_palm.Adaptor{}
	case relaycommon.APITypeTencent:
		adaptor = &channel_tencent.Adaptor{}
	case relaycommon.APITypeXunfei:
		adaptor = &channel_xunfei.Adaptor{}
	case relaycommon.APITypeZhipu:
		adaptor = &channel_zhipu.Adaptor{}
	}

	return adaptor
}
