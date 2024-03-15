package common

import (
	"encoding/json"
	"strings"
	"time"
)

var DefaultCompletionRatio map[string]float64

func init() {
	DefaultCompletionRatio = make(map[string]float64)
	for k, v := range CompletionRatio {
		DefaultCompletionRatio[k] = v
	}
}

// ConvertCompletionRatioToJSONString 将 CompletionRatio 转换为 JSON 字符串。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - string: 包含 CompletionRatio 的 JSON 字符串。
func ConvertCompletionRatioToJSONString() string {
	// 将 CompletionRatio 转换为 JSON 格式的字节序列
	jsonBytes, err := json.Marshal(CompletionRatio)
	if err != nil {
		// 如果发生错误，记录系统错误信息并返回空字符串
		SysError("error marshalling completion ratio: " + err.Error())
		return ""
	}

	return string(jsonBytes)
}

// UpdateCompletionRatioFromJSONString 通过 JSON 字符串更新 CompletionRatio。
//
// 输入参数：
//   - jsonStr string: 包含更新信息的 JSON 字符串。
//
// 输出参数：
//   - error: 如果解析或更新过程中发生错误，则返回相应的错误信息。
func UpdateCompletionRatioFromJSONString(jsonStr string) error {
	// 创建一个临时 map 用于解析 JSON 字符串
	tempMap := make(map[string]float64)

	// 解析 JSON 字符串到临时 map 中
	err := json.Unmarshal([]byte(jsonStr), &tempMap)
	if err != nil {
		// 如果解析出错，返回相应的错误信息
		return err
	}

	// 更新 CompletionRatio
	CompletionRatio = tempMap

	return nil
}

// RetrieveCompletionRatio 用于获取指定模型名称的完成比例。
//
// 输入参数：
//   - name string: 模型名称。
// 输出参数：
//   - float64: 对应模型名称的完成比例。

func RetrieveCompletionRatio(name string) float64 {
	// 检查 CompletionRatio 中是否包含指定模型名称
	if ratio, ok := CompletionRatio[name]; ok {
		return ratio
	}

	// 根据不同模型名称返回对应的完成比例
	switch {
	case strings.HasPrefix(name, "gpt-3.5"):
		switch {
		case strings.HasSuffix(name, "0125"):
			return 3
		case strings.HasSuffix(name, "1106"):
			return 2
		case name == "gpt-3.5-turbo" || name == "gpt-3.5-turbo-16k":
			if time.Now().After(time.Date(2023, 12, 11, 0, 0, 0, 0, time.UTC)) {
				return 2
			}
			return 1.333333
		default:
			return 1.333333
		}
	case strings.HasPrefix(name, "gpt-4"):
		if strings.HasSuffix(name, "preview") {
			return 3
		}
		return 2
	case strings.HasPrefix(name, "claude-instant-1"):
		return 3.38
	case strings.HasPrefix(name, "claude-2"):
		return 2.965517
	default:
		return 1
	}
}
