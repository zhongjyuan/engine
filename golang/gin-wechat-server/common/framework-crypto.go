package common

import "golang.org/x/crypto/bcrypt"

// Password2Hash 将密码转换为哈希值。
//
// 输入参数：
//   - password string: 要哈希的密码。
// 输出参数：
//   - string: 哈希后的密码字符串。
//   - error: 如果有错误发生，则返回错误信息；否则为 nil。
func Password2Hash(password string) (string, error) {
	passwordBytes := []byte(password)
	hashedPassword, err := bcrypt.GenerateFromPassword(passwordBytes, bcrypt.DefaultCost)
	return string(hashedPassword), err
}

// ValidatePasswordAndHash 验证密码和哈希是否匹配。
//
// 输入参数：
//   - password string: 用户输入的密码。
//   - hash string: 存储的密码哈希。
// 输出参数：
//   - bool: 如果密码和哈希匹配，则返回 true；否则返回 false。
func ValidatePasswordAndHash(password string, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
