package common

import (
	"encoding/json"
	"strings"
)

var DefaultModelRatio map[string]float64

func init() {
	DefaultModelRatio = make(map[string]float64)
	for k, v := range ModelRatio {
		DefaultModelRatio[k] = v
	}
}

// ConvertModelRatioToJSONString 将 ModelRatio 转换为 JSON 字符串。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - string: 包含 ModelRatio 的 JSON 字符串。
func ConvertModelRatioToJSONString() string {
	// 将 ModelRatio 转换为 JSON 格式的字节序列
	jsonBytes, err := json.Marshal(ModelRatio)
	if err != nil {
		// 如果发生错误，打印错误信息并返回空字符串
		SysError("error marshalling model ratio: " + err.Error())
		return ""
	}

	// 返回 JSON 字符串
	return string(jsonBytes)
}

// UpdateModelRatioFromJSON 通过 JSON 字符串更新 ModelRatio。
//
// 输入参数：
//   - jsonStr string: 包含更新信息的 JSON 字符串。
//
// 输出参数：
//   - error: 如果解析或更新过程中发生错误，则返回相应的错误信息。
func UpdateModelRatioFromJSONString(jsonStr string) error {
	// 创建一个临时 map 用于解析 JSON 字符串
	tempMap := make(map[string]float64)

	// 解析 JSON 字符串到临时 map 中
	if err := json.Unmarshal([]byte(jsonStr), &tempMap); err != nil {
		// 如果解析出错，返回相应的错误信息
		return err
	}

	// 更新 ModelRatio
	ModelRatio = tempMap

	return nil
}

// RetrieveModelRatio 用于获取指定模型名称的价格比例。
//
// 输入参数：
//   - name string: 模型名称。
//
// 输出参数：
//   - float64: 对应模型名称的价格比例。
func RetrieveModelRatio(name string) float64 {
	// 如果模型名称以 "qwen-" 开头并以 "-internet" 结尾，则移除 "-internet"
	if strings.HasPrefix(name, "qwen-") && strings.HasSuffix(name, "-internet") {
		name = strings.TrimSuffix(name, "-internet")
	}

	// 查找模型名称对应的价格比例
	ratio, ok := ModelRatio[name]
	if !ok {
		// 如果找不到对应的价格比例，记录系统错误信息并返回默认值 30
		SysError("model ratio not found: " + name)
		return 30
	}

	return ratio
}

// UpdateMissingRatio 用于将旧比率中缺失的默认模型比率添加到其中。
//
// 输入参数：
//   - oldRatio string: 旧比率的 JSON 字符串。
//
// 输出参数：
//   - string: 更新后的比率的 JSON 字符串。
func UpdateMissingRatio(oldRatio string) string {
	// 创建一个新的映射，用于存储解析后的旧比率
	newRatio := make(map[string]float64)

	// 将旧比率的 JSON 字符串解析为映射
	if err := json.Unmarshal([]byte(oldRatio), &newRatio); err != nil {
		SysError("error unmarshalling old ratio: " + err.Error())
		return oldRatio
	}

	// 遍历默认模型比率，将缺失的比率添加到新比率中
	for k, v := range DefaultModelRatio {
		if _, ok := newRatio[k]; !ok {
			newRatio[k] = v
		}
	}

	// 将更新后的新比率映射转换为 JSON 字符串
	jsonBytes, err := json.Marshal(newRatio)
	if err != nil {
		SysError("error marshalling new ratio: " + err.Error())
		return oldRatio
	}

	return string(jsonBytes)
}
