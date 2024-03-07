package relayhelper

import (
	"errors"
	"math"
	relaycommon "zhongjyuan/gin-one-api/relay/common"
	relaymodel "zhongjyuan/gin-one-api/relay/model"
)

// ValidateTextRequest 用于验证文本请求的有效性。
//
// 输入参数：
//   - req *relaymodel.AIRequest: 要验证的文本请求对象。
//   - relayMode int: 中继模式。
//
// 输出参数：
//   - error: 如果验证通过，则返回 nil；否则返回相应的错误。
func ValidateTextRequest(req *relaymodel.AIRequest, relayMode int) error {
	switch relayMode {
	case relaycommon.RelayModeCompletions:
		if req.Prompt == "" {
			return errors.New("field prompt is required") // 需要 prompt 字段
		}
	case relaycommon.RelayModeChatCompletions:
		if req.Messages == nil || len(req.Messages) == 0 {
			return errors.New("field messages is required") // 需要 messages 字段
		}
	case relaycommon.RelayModeModerations:
		if req.Input == "" {
			return errors.New("field input is required") // 需要 input 字段
		}
	case relaycommon.RelayModeEdits:
		if req.Instruction == "" {
			return errors.New("field instruction is required") // 需要 instruction 字段
		}
	}

	if req.MaxTokens < 0 || req.MaxTokens > math.MaxInt32/2 {
		return errors.New("max_tokens is invalid") // 最大令牌数无效
	}

	if req.Model == "" {
		return errors.New("model is required") // 模型名称是必需的
	}

	return nil
}
