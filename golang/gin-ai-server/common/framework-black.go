package common

import (
	"fmt"
	"sync"
)

// blackList 用于存储被拉黑的用户，key 为用户 id。
var blackList sync.Map

// init 用于初始化 blackList。
func init() {
	blackList = sync.Map{}
}

// key 用于生成用户 id 对应的黑名单键值。
//
// 输入参数：
//   - id int: 用户 id。
//
// 输出参数：
//   - string: 生成的黑名单键值。
func key(id int) string {
	return fmt.Sprintf("black_%d", id)
}

// Ban 用于将指定用户 id 加入黑名单。
//
// 输入参数：
//   - id int: 用户 id。
//
// 输出参数：
//   - 无。
func Ban(id int) {
	blackList.Store(key(id), true)
}

// UnBan 用于将指定用户 id 移出黑名单。
//
// 输入参数：
//   - id int: 用户 id。
//
// 输出参数：
//   - 无。
func UnBan(id int) {
	blackList.Delete(key(id))
}

// IsBanned 用于判断指定用户 id 是否在黑名单中。
//
// 输入参数：
//   - id int: 用户 id。
//
// 输出参数：
//   - bool: 如果用户在黑名单中，则返回 true；否则返回 false。
func IsBanned(id int) bool {
	_, ok := blackList.Load(key(id))
	return ok
}
