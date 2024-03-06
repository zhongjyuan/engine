package relayModel

import relayCommon "zhongjyuan/gin-one-api/relay/common"

// Message 结构体表示消息对象。
type Message struct {
	Role    string  `json:"role"`           // 角色
	Content any     `json:"content"`        // 内容
	Name    *string `json:"name,omitempty"` // 名称，omitempty 表示如果为空则不输出该字段
}

type ImageURL struct {
	Url    string `json:"url,omitempty"`
	Detail string `json:"detail,omitempty"`
}

type MessageContent struct {
	Type     string    `json:"type,omitempty"`
	Text     string    `json:"text"`
	ImageURL *ImageURL `json:"image_url,omitempty"`
}

// IsStringContent 方法用于判断消息内容是否为字符串类型。
//
// 输入参数：
//   - m Message: 消息对象。
// 输出参数：
//   - bool: 如果消息内容为字符串类型，则返回 true；否则返回 false。
func (m Message) IsStringContent() bool {
	_, ok := m.Content.(string) // 尝试将内容转换为字符串类型
	return ok
}

// StringContent 方法用于获取消息内容的字符串表示形式。
//
// 输入参数：
//   - m Message: 消息对象。
// 输出参数：
//   - string: 返回消息内容的字符串表示形式。
func (m Message) StringContent() string {
	content, ok := m.Content.(string)
	if ok {
		return content // 如果内容本身就是字符串类型，则直接返回
	}

	contentList, ok := m.Content.([]any)
	if ok {
		var contentStr string
		for _, contentItem := range contentList {
			contentMap, ok := contentItem.(map[string]any)
			if !ok {
				continue
			}
			if contentMap["type"] == relayCommon.ContentTypeText {
				if subStr, ok := contentMap["text"].(string); ok {
					contentStr += subStr // 将文本类型的内容拼接起来
				}
			}
		}
		return contentStr
	}

	return "" // 如果内容既不是字符串类型，也不是包含文本类型的列表，则返回空字符串
}

// ParseContent 方法用于解析消息内容并返回消息内容列表。
//
// 输入参数：
//   - m Message: 消息对象。
// 输出参数：
//   - []MessageContent: 返回解析后的消息内容列表。
func (m Message) ParseContent() []MessageContent {
	var contentList []MessageContent // 定义一个消息内容列表

	switch content := m.Content.(type) {
	case string:
		// 如果内容本身是字符串类型，将其添加到消息内容列表中并返回
		return []MessageContent{{Type: relayCommon.ContentTypeText, Text: content}}
	case []any:
		// 遍历内容列表，根据内容类型进行解析并添加到消息内容列表中
		for _, contentItem := range content {
			contentMap, ok := contentItem.(map[string]any)
			if !ok {
				continue
			}
			switch contentType := contentMap["type"].(string); contentType {
			case relayCommon.ContentTypeText:
				if subStr, ok := contentMap["text"].(string); ok {
					contentList = append(contentList, MessageContent{Type: contentType, Text: subStr})
				}
			case relayCommon.ContentTypeImageURL:
				if subObj, ok := contentMap["image_url"].(map[string]any); ok {
					url, urlOk := subObj["url"].(string)
					if urlOk {
						contentList = append(contentList, MessageContent{Type: contentType, ImageURL: &ImageURL{Url: url}})
					}
				}
			}
		}
		return contentList
	}

	return nil // 如果内容既不是字符串类型，也不是包含特定内容类型的列表，则返回空
}
