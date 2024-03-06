package relayHelper

// MapModelName 根据映射表将模型名称映射为新的名称。
//
// 输入参数：
//   - originalName string: 原始模型名称。
//   - mapping map[string]string: 模型名称的映射表。
//
// 输出参数：
//   - string: 映射后的模型名称。
//   - bool: 表示是否成功找到映射后的模型名称。
func MapModelName(originalName string, mapping map[string]string) (string, bool) {
	// 如果映射表为空或原始名称不存在于映射表中，则直接返回原始名称和false
	if mapping == nil {
		return originalName, false
	}

	// 在映射表中查找是否有对应的映射名称
	mappedName, found := mapping[originalName]

	// 如果找到了映射后的名称，则返回该名称和true；否则返回原始名称和false
	if found {
		return mappedName, true
	}
	return originalName, false
}
