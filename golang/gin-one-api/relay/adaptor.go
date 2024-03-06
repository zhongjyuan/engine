package relay

import (
	relayChannel "zhongjyuan/gin-one-api/relay/channel"
	channel_ali "zhongjyuan/gin-one-api/relay/channel/ali"
	channel_anthropic "zhongjyuan/gin-one-api/relay/channel/anthropic"
	channel_baidu "zhongjyuan/gin-one-api/relay/channel/baidu"
	channel_gemini "zhongjyuan/gin-one-api/relay/channel/gemini"
	channel_openai "zhongjyuan/gin-one-api/relay/channel/openai"
	channel_palm "zhongjyuan/gin-one-api/relay/channel/palm"
	channel_proxy "zhongjyuan/gin-one-api/relay/channel/proxy"
	channel_tencent "zhongjyuan/gin-one-api/relay/channel/tencent"
	channel_xunfei "zhongjyuan/gin-one-api/relay/channel/xunfei"
	channel_zhipu "zhongjyuan/gin-one-api/relay/channel/zhipu"
	relayCommon "zhongjyuan/gin-one-api/relay/common"
)

// GetAdaptor 根据给定的 API 类型返回对应的适配器实例。
//
// 输入参数：
//   - apiType int: API 类型，表示要获取的适配器类型。
//
// 输出参数：
//   - Adaptor: 返回对应的适配器实例，如果未找到对应类型的适配器，则返回 nil。
func GetAdaptor(apiType int) relayChannel.Adaptor {
	var adaptor relayChannel.Adaptor

	switch apiType {
	case relayCommon.APITypeAIProxyLibrary:
		adaptor = &channel_proxy.Adaptor{}
	case relayCommon.APITypeAli:
		adaptor = &channel_ali.Adaptor{}
	case relayCommon.APITypeAnthropic:
		adaptor = &channel_anthropic.Adaptor{}
	case relayCommon.APITypeBaidu:
		adaptor = &channel_baidu.Adaptor{}
	case relayCommon.APITypeGemini:
		adaptor = &channel_gemini.Adaptor{}
	case relayCommon.APITypeOpenAI:
		adaptor = &channel_openai.Adaptor{}
	case relayCommon.APITypePaLM:
		adaptor = &channel_palm.Adaptor{}
	case relayCommon.APITypeTencent:
		adaptor = &channel_tencent.Adaptor{}
	case relayCommon.APITypeXunfei:
		adaptor = &channel_xunfei.Adaptor{}
	case relayCommon.APITypeZhipu:
		adaptor = &channel_zhipu.Adaptor{}
	}

	return adaptor
}
