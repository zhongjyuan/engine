package channel_openai

import relaymodel "zhongjyuan/gin-ai-server/relay/model"

// TextContent 结构体用于表示文本内容。
type TextContent struct {
	Type string `json:"type,omitempty"` // 内容类型
	Text string `json:"text,omitempty"` // 文本内容
}

// ImageContent 结构体用于表示图片内容。
type ImageContent struct {
	Type     string               `json:"type,omitempty"`      // 内容类型
	ImageURL *relaymodel.ImageURL `json:"image_url,omitempty"` // 图片链接
}

// UsageAndResponseText 结构体用于表示使用情况或响应文本。
type UsageAndResponseText struct {
	*relaymodel.Usage        // 使用情况
	ResponseText      string // 响应文本
}
