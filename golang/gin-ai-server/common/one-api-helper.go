package common

import "fmt"

// FormatQuota 格式化额度信息并返回字符串表示。
//
// 输入参数：
//   - quota int: 需要格式化的额度值。
// 输出参数：
//   - string: 返回格式化后的额度信息。
func FormatQuota(quota int) string {
	// 如果启用显示货币格式
	if DisplayInCurrencyEnabled {
		// 返回格式化后的货币额度信息
		return fmt.Sprintf("＄%.6f 额度", float64(quota)/QuotaPerUnit)
	} else {
		// 返回格式化后的点数额度信息
		return fmt.Sprintf("%d 点额度", quota)
	}
}
