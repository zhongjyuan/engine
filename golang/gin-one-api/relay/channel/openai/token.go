package channel_openai

import (
	"errors"
	"fmt"
	"math"
	"strings"
	"zhongjyuan/gin-one-api/common"
	relayModel "zhongjyuan/gin-one-api/relay/model"

	"github.com/pkoukk/tiktoken-go"
)

// defaultTokenEncoder 表示默认的 token 编码器，初始化后不会增长。
var defaultTokenEncoder *tiktoken.Tiktoken

// tokenEncoderMap 是一个映射，用于存储不同名称的 token 编码器实例。
var tokenEncoderMap = map[string]*tiktoken.Tiktoken{}

// InitTokenEncoders 用于初始化 token 编码器。
func InitTokenEncoders() {
	// 记录日志，表示正在初始化 token 编码器
	common.SysLog("initializing token encoders")

	// 初始化默认的 token 编码器为 gpt-3.5-turbo 模型
	defaultTokenEncoder = initTokenEncoderForModel("gpt-3.5-turbo")

	// 获取并设置 gpt-4 模型的 token 编码器
	gpt4TokenEncoder := initTokenEncoderForModel("gpt-4")

	// 遍历常用模型比例中的模型名称，为每个模型设置相应的 token 编码器
	for relayModel := range common.ModelRatio {
		if strings.HasPrefix(relayModel, "gpt-3.5") {
			tokenEncoderMap[relayModel] = defaultTokenEncoder
		} else if strings.HasPrefix(relayModel, "gpt-4") {
			tokenEncoderMap[relayModel] = gpt4TokenEncoder
		} else {
			tokenEncoderMap[relayModel] = nil
		}
	}

	// 记录日志，表示 token 编码器已初始化完成
	common.SysLog("token encoders initialized")
}

// initTokenEncoderForModel 用于初始化指定模型的 token 编码器并返回。
//
// 输入参数：
//   - modelName string: 模型名称。
//
// 输出参数：
//   - *tiktoken.Tiktoken: 返回指定模型的 token 编码器。
func initTokenEncoderForModel(modelName string) *tiktoken.Tiktoken {
	tokenEncoder, err := tiktoken.EncodingForModel(modelName)
	if err != nil {
		common.FatalLog(fmt.Sprintf("failed to get %s token encoder: %s", modelName, err.Error()))
	}
	return tokenEncoder
}

// getTokenEncoderForModel 用于获取指定模型的 token 编码器，如果不存在则返回默认的编码器。
//
// 输入参数：
//   - modelName string: 模型名称。
//
// 输出参数：
//   - *tiktoken.Tiktoken: 返回指定模型的 token 编码器。
func getTokenEncoderForModel(modelName string) *tiktoken.Tiktoken {
	if tokenEncoder, ok := tokenEncoderMap[modelName]; ok && tokenEncoder != nil {
		return tokenEncoder
	}

	// 获取指定模型的 token 编码器，如果获取失败，则使用 gpt-3.5-turbo 模型的编码器
	tokenEncoder, err := tiktoken.EncodingForModel(modelName)
	if err != nil {
		common.SysError(fmt.Sprintf("failed to get token encoder for relayModel %s: %s, using encoder for gpt-3.5-turbo", modelName, err.Error()))
		tokenEncoder = defaultTokenEncoder
	}
	tokenEncoderMap[modelName] = tokenEncoder

	return tokenEncoder
}

// getTokenCount 用于计算给定文本在指定 token 编码器下的 token 数量。
//
// 输入参数：
//   - tokenEncoder *tiktoken.Tiktoken: token 编码器。
//   - text string: 待编码的文本。
//
// 输出参数：
//   - int: 返回文本在指定 token 编码器下的 token 数量。
func getTokenCount(tokenEncoder *tiktoken.Tiktoken, text string) int {
	if common.ApproximateTokenEnabled {
		// 使用近似计算方式，将文本长度乘以 0.38 作为 token 数量
		return int(float64(len(text)) * 0.38)
	}

	// 使用 token 编码器对文本进行编码，并返回 token 数量
	return len(tokenEncoder.Encode(text, nil, nil))
}

// CalculateMessageTokens 用于计算消息列表中各消息的 token 数量总和。
//
// 输入参数：
//   - messages []relayModel.Message: 消息列表。
//   - modelName string: 模型名称。
//
// 输出参数：
//   - int: 返回消息列表中各消息的 token 数量总和。
func CalculateMessageTokens(messages []relayModel.Message, modelName string) int {
	tokenEncoder := getTokenEncoderForModel(modelName)

	// 每条消息格式为 <|im_start|>{role/name}\n{content}<|end|>\n
	var tokensPerMessage, tokensPerName int
	switch modelName {
	case "gpt-3.5-turbo-0301":
		tokensPerMessage, tokensPerName = 4, -1 // 如果有姓名，则角色被省略
	default:
		tokensPerMessage, tokensPerName = 3, 1
	}

	tokenNum := 0
	for _, message := range messages {
		tokenNum += tokensPerMessage

		switch v := message.Content.(type) {
		case string:
			tokenNum += getTokenCount(tokenEncoder, v) // 计算文本内容的 token 数量
		case []any:
			for _, it := range v {
				m := it.(map[string]any)
				switch m["type"] {
				case "text":
					tokenNum += getTokenCount(tokenEncoder, m["text"].(string)) // 计算文本类型内容的 token 数量
				case "image_url":
					if imageUrl, ok := m["image_url"].(map[string]any); ok {
						url := imageUrl["url"].(string)
						detail := imageUrl["detail"].(string)
						imageTokens, err := CalculateImageTokens(url, detail) // 计算图片的 token 数量
						if err != nil {
							common.SysError("error counting image tokens: " + err.Error())
						} else {
							tokenNum += imageTokens
						}
					}
				}
			}
		}

		tokenNum += getTokenCount(tokenEncoder, message.Role) // 计算角色的 token 数量

		if message.Name != nil {
			tokenNum += tokensPerName
			tokenNum += getTokenCount(tokenEncoder, *message.Name) // 计算姓名的 token 数量
		}
	}

	tokenNum += 3 // 每个回复都以 <|im_start|>assistant<|im_sep|> 开始
	return tokenNum
}

const (
	lowDetailCost         = 85
	highDetailCostPerTile = 170
	additionalCost        = 85
)

// CalculateImageTokens 用于计算图像的 token 数量。
//
// 输入参数：
//   - url string: 图像 URL。
//   - detail string: 图像细节等级，可选值为 "low"、"high" 或 "auto"。
//
// 输出参数：
//   - int: 返回图像的 token 数量。
//   - error: 如果计算过程中出现错误，则返回相应的错误信息。
func CalculateImageTokens(url string, detail string) (_ int, err error) {
	var fetchSize = true
	var width, height int

	// 如果 detail 为 "" 或 "auto"，根据图像大小自动选择细节等级
	if detail == "" || detail == "auto" {
		// 在测试中似乎总是被视为 "high"
		detail = "high"
	}

	switch detail {
	case "low":
		return lowDetailCost, nil
	case "high":
		if fetchSize {
			width, height, err = common.GetImageSize(url)
			if err != nil {
				return 0, err
			}
		}

		// 调整图像大小以符合要求
		if width > 2048 || height > 2048 { // max(width, height) > 2048
			ratio := float64(2048) / math.Max(float64(width), float64(height))
			width = int(float64(width) * ratio)
			height = int(float64(height) * ratio)
		}

		if width > 768 && height > 768 { // min(width, height) > 768
			ratio := float64(768) / math.Min(float64(width), float64(height))
			width = int(float64(width) * ratio)
			height = int(float64(height) * ratio)
		}

		// 计算高细节模式下的 token 数量
		numSquares := int(math.Ceil(float64(width)/512) * math.Ceil(float64(height)/512))
		result := numSquares*highDetailCostPerTile + additionalCost
		return result, nil
	default:
		return 0, errors.New("invalid detail option")
	}
}

// CalculateInputTokens 用于计算输入数据的 token 数量。
//
// 输入参数：
//   - input any: 输入数据，可以是 string 类型或 []string 类型。
//   - relayModel string: 中继模型名称。
//
// 输出参数：
//   - int: 返回输入数据的 token 数量。
func CalculateInputTokens(input any, relayModel string) int {
	switch v := input.(type) {
	case string:
		// 如果输入数据为字符串类型，则调用 CalculateTextTokens 函数计算 token 数量
		return CalculateTextTokens(v, relayModel)
	case []string:
		// 如果输入数据为字符串数组类型，则将数组中的所有字符串连接起来后再计算 token 数量
		text := ""
		for _, s := range v {
			text += s
		}
		return CalculateTextTokens(text, relayModel)
	}
	return 0
}

// CalculateTextTokens 用于计算文本的 token 数量。
//
// 输入参数：
//   - text string: 要计算的文本内容。
//   - relayModel string: 中继模型名称。
//
// 输出参数：
//   - int: 返回文本的 token 数量。
func CalculateTextTokens(text string, relayModel string) int {
	// 获取与中继模型对应的 token 编码器
	tokenEncoder := getTokenEncoderForModel(relayModel)

	// 调用 getTokenCount 函数计算文本的 token 数量
	return getTokenCount(tokenEncoder, text)
}
