package common

import (
	"encoding/json"
)

// ConvertGroupRatioToJSONString 将 GroupRatio 转换为 JSON 字符串表示。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - string: 返回转换后的 JSON 字符串。
func ConvertGroupRatioToJSONString() string {
	// 将 GroupRatio 转换为 JSON 字节流
	jsonBytes, err := json.Marshal(GroupRatio)
	if err != nil {
		// 如果转换过程中发生错误，则输出错误信息
		SysError("error marshalling model ratio: " + err.Error())
	}
	// 返回 JSON 字符串表示
	return string(jsonBytes)
}

// UpdateGroupRatioFromJSONString 从 JSON 字符串更新 GroupRatio 映射。
//
// 输入参数：
//   - jsonStr string: 包含要更新的 GroupRatio 映射信息的 JSON 字符串。
//
// 输出参数：
//   - error: 如果在解析 JSON 字符串时发生错误，则返回相应的错误；否则返回 nil。
func UpdateGroupRatioFromJSONString(jsonStr string) error {
	// 创建一个临时 map 用于解析 JSON 字符串
	tempMap := make(map[string]float64)

	// 解析 JSON 字符串到临时 map 中
	err := json.Unmarshal([]byte(jsonStr), &tempMap)
	if err != nil {
		// 如果解析出错，返回相应的错误信息
		return err
	}

	// 更新 GroupRatio
	GroupRatio = tempMap

	return nil
}

// RetrieveGroupRatio 从 GroupRatio 映射中检索指定名称的比率值。
//
// 输入参数：
//   - name string: 要检索比率值的名称。
//
// 输出参数：
//   - float64: 返回指定名称的比率值，如果未找到则返回默认值 1。
func RetrieveGroupRatio(name string) float64 {
	// 尝试从 GroupRatio 映射中检索指定名称的比率值
	ratio, ok := GroupRatio[name]
	if !ok {
		// 如果未找到对应的比率值，则输出错误信息并返回默认值 1
		SysError("group ratio not found: " + name)
		return 1
	}
	// 返回获取到的比率值
	return ratio
}
