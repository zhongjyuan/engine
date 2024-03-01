package common

import (
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
)

// verificationValue 结构体用于存储验证码和时间信息
type verificationValue struct {
	code string    // 验证码字符串
	time time.Time // 记录生成时间的 Time 对象
}

const (
	EmailVerificationPurpose = "v" // EmailVerificationPurpose 表示邮箱验证目的
	PasswordResetPurpose     = "r" // PasswordResetPurpose 表示密码重置目的
)

var (
	verificationMutex        sync.Mutex                   // verificationMutex 是用于控制验证码操作并发访问的互斥锁。
	verificationMap          map[string]verificationValue // verificationMap 是存储验证码键值对的映射，键为验证码目的和键名的组合，值为 verificationValue 结构体。
	verificationMapMaxSize   = 10                         // verificationMapMaxSize 是 verificationMap 映射的最大大小限制。
	VerificationValidMinutes = 10                         // VerificationValidMinutes 是验证码的有效时间，单位为分钟。
)

// GenerateVerificationCode 生成指定长度的验证码字符串。
//
// 输入参数：
//   - length int: 要生成的验证码长度，为0则使用默认长度。
//
// 输出参数：
//   - string: 返回生成的验证码字符串。
func GenerateVerificationCode(length int) string {
	// 生成一个 UUID 字符串作为初始验证码
	code := uuid.New().String()
	// 去除 UUID 字符串中的连字符，以便得到纯数字和字母组合的验证码
	code = strings.Replace(code, "-", "", -1)

	// 如果指定了验证码长度，则截取对应长度的验证码返回
	if length == 0 {
		return code
	}

	return code[:length]
}

// RegisterVerificationCodeWithKey 使用给定的键、验证码和目的注册验证码信息。
//
// 输入参数：
//   - key string: 验证码键值对应的键。
//   - code string: 要注册的验证码字符串。
//   - purpose string: 验证码的目的（EmailVerificationPurpose 或 PasswordResetPurpose）。
func RegisterVerificationCodeWithKey(key string, code string, purpose string) {
	// 互斥锁加锁，确保并发安全地操作验证码映射
	verificationMutex.Lock()
	defer verificationMutex.Unlock()

	// 将验证码信息存储到验证码映射中，键为目的和键名的组合，值为包含验证码和生成时间的结构体
	verificationMap[purpose+key] = verificationValue{
		code: code,
		time: time.Now(),
	}

	// 如果验证码映射大小超过限制，则删除过期的键值对
	if len(verificationMap) > verificationMapMaxSize {
		removeExpiredPairs()
	}
}

// VerifyCodeWithKey 验证给定键的验证码是否匹配并且未过期。
//
// 输入参数：
//   - key string: 要验证的验证码键。
//   - code string: 用户输入的验证码字符串。
//   - purpose string: 验证码的目的（EmailVerificationPurpose 或 PasswordResetPurpose）。
//
// 输出参数：
//   - bool: 如果验证码匹配且未过期，则返回 true；否则返回 false。
func VerifyCodeWithKey(key string, code string, purpose string) bool {
	// 互斥锁加锁，确保并发安全地访问验证码映射
	verificationMutex.Lock()
	defer verificationMutex.Unlock()

	// 获取指定键对应的验证码值和生成时间
	value, okay := verificationMap[purpose+key]
	now := time.Now()

	// 如果该键对应的值不存在或已过期，则返回 false
	if !okay || int(now.Sub(value.time).Seconds()) >= VerificationValidMinutes*60 {
		return false
	}

	// 验证用户输入的验证码与存储的验证码是否匹配
	return code == value.code
}

// DeleteKey 从验证码映射中删除指定目的和键对应的验证码信息。
//
// 输入参数：
//   - key string: 要删除的验证码键。
//   - purpose string: 验证码的目的（EmailVerificationPurpose 或 PasswordResetPurpose）。
func DeleteKey(key string, purpose string) {
	// 互斥锁加锁，确保并发安全地访问和修改验证码映射
	verificationMutex.Lock()
	defer verificationMutex.Unlock()

	// 从验证码映射中删除指定的键值对
	delete(verificationMap, purpose+key)
}

// removeExpiredPairs 从验证码映射中删除所有过期的键值对。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func removeExpiredPairs() {
	now := time.Now() // 获取当前时间

	// 遍历验证码映射，删除所有过期的键值对
	for key := range verificationMap {
		if int(now.Sub(verificationMap[key].time).Seconds()) >= VerificationValidMinutes*60 { // 计算键值对的存储时间是否已超过有效期
			delete(verificationMap, key) // 如果已过期，则从验证码映射中删除该键值对
		}
	}
}

// init 初始化验证码映射，将其设置为空映射。
//
// 该函数在包被导入时自动执行。它使用互斥锁确保安全地初始化验证码映射，并将其设置为空映射。
func init() {
	verificationMutex.Lock()                             // 加锁
	defer verificationMutex.Unlock()                     // 确保在函数结束时解锁
	verificationMap = make(map[string]verificationValue) // 创建一个空的验证码映射
}
