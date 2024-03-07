package relaycommon

import "strings"

const (
	RelayModeUnknown            = iota // RelayModeUnknown 表示未知中继模式。
	RelayModeChatCompletions           // RelayModeChatCompletions 表示聊天完成中继模式。
	RelayModeCompletions               // RelayModeCompletions 表示完成中继模式。
	RelayModeEmbeddings                // RelayModeEmbeddings 表示嵌入中继模式。
	RelayModeModerations               // RelayModeModerations 表示调节中继模式。
	RelayModeImagesGenerations         // RelayModeImagesGenerations 表示图像生成中继模式。
	RelayModeEdits                     // RelayModeEdits 表示编辑中继模式。
	RelayModeAudioSpeech               // RelayModeAudioSpeech 表示语音转换中继模式。
	RelayModeAudioTranscription        // RelayModeAudioTranscription 表示音频转录中继模式。
	RelayModeAudioTranslation          // RelayModeAudioTranslation 表示音频翻译中继模式。
)

// GetRelayModeByPath 根据路径返回对应的中继模式。
//
// 输入参数：
//   - path: 请求的路径。
// 输出参数：
//   - int: 对应的中继模式值。
func GetRelayModeByPath(path string) int {
	// 根据路径判断中继模式
	switch {
	case strings.HasPrefix(path, "/v1/chat/completions"):
		return RelayModeChatCompletions // 聊天完成中继模式
	case strings.HasPrefix(path, "/v1/completions"):
		return RelayModeCompletions // 完成中继模式
	case strings.HasPrefix(path, "/v1/embeddings"), strings.HasSuffix(path, "embeddings"):
		return RelayModeEmbeddings // 嵌入中继模式
	case strings.HasPrefix(path, "/v1/moderations"):
		return RelayModeModerations // 审核中继模式
	case strings.HasPrefix(path, "/v1/images/generations"):
		return RelayModeImagesGenerations // 图像生成中继模式
	case strings.HasPrefix(path, "/v1/edits"):
		return RelayModeEdits // 编辑中继模式
	case strings.HasPrefix(path, "/v1/audio/speech"):
		return RelayModeAudioSpeech // 音频语音中继模式
	case strings.HasPrefix(path, "/v1/audio/transcriptions"):
		return RelayModeAudioTranscription // 音频转录中继模式
	case strings.HasPrefix(path, "/v1/audio/translations"):
		return RelayModeAudioTranslation // 音频翻译中继模式
	default:
		return RelayModeUnknown // 未知中继模式
	}
}
