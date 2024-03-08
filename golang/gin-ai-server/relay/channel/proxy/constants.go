package channel_proxy

import channel_openai "zhongjyuan/gin-ai-server/relay/channel/openai"

var ModelList = []string{""}

func init() {
	ModelList = channel_openai.ModelList
}
