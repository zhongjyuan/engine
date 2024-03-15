package common

import (
	"fmt"
	"html/template"
	"log"
	"math/rand"
	"net"
	"os"
	"os/exec"
	"runtime"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
)

// GetUUID 生成并返回一个不带连字符的 UUID 字符串
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - string: 生成的 UUID 字符串
func GetUUID() string {
	code := uuid.New().String()
	return strings.Replace(code, "-", "", -1)
}

// GetTimestamp 函数用于获取当前时间戳（Unix 时间戳）。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - int64: 当前时间的 Unix 时间戳。
func GetTimestamp() int64 {
	return time.Now().Unix() // 返回当前时间的 Unix 时间戳
}

// GetTimeString 函数用于生成当前时间的字符串表示。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - string: 当前时间的字符串表示，格式为 "yyyyMMddHHmmss<纳秒部分>"。
func GetTimeString() string {
	now := time.Now()                                                            // 获取当前时间
	return fmt.Sprintf("%s%d", now.Format("20060102150405"), now.UnixNano()%1e9) // 格式化时间为指定格式的字符串
}

// OpenBrowser 用于在默认浏览器中打开指定的 URL
//
// 输入参数：
//   - url string: 要打开的 URL 地址。
//
// 输出参数：
//   - 无。
func OpenBrowser(url string) {
	var err error

	// 根据不同操作系统选择对应的命令打开 URL
	switch runtime.GOOS {
	case "linux":
		err = exec.Command("xdg-open", url).Start()
	case "windows":
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		err = exec.Command("open", url).Start()
	}

	// 如果出现错误，则打印错误日志
	if err != nil {
		log.Println(err)
	}
}

// GetIp 用于获取本机的非内网 IP 地址
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - string: 返回本机的非内网 IP 地址，若获取失败则返回空字符串。
func GetIp() (ip string) {
	// 获取本机所有网络接口的地址列表
	ips, err := net.InterfaceAddrs()
	if err != nil {
		log.Println(err)
		return ip
	}

	// 遍历所有地址找到非内网 IP
	for _, a := range ips {
		if ipNet, ok := a.(*net.IPNet); ok && !ipNet.IP.IsLoopback() {
			if ipNet.IP.To4() != nil {
				ip = ipNet.IP.String()
				// 检查是否为内网 IP，是则直接返回空字符串
				if strings.HasPrefix(ip, "10") || strings.HasPrefix(ip, "172") || strings.HasPrefix(ip, "192.168") {
					return ""
				}
			}
		}
	}
	return ip
}

// Bytes2Size 将字节数转换为对应的可读大小表示
//
// 输入参数：
//   - num int64: 字节数
//
// 输出参数：
//   - string: 可读的大小表示字符串，例如 "1.23 GB"。
func Bytes2Size(num int64) string {
	numStr := ""
	unit := "B"

	// 根据字节数选择对应的单位进行转换
	if num/int64(SizeTB) > 1 {
		numStr = fmt.Sprintf("%.2f", float64(num)/float64(SizeTB))
		unit = "TB"
	} else if num/int64(SizeGB) > 1 {
		numStr = fmt.Sprintf("%.2f", float64(num)/float64(SizeGB))
		unit = "GB"
	} else if num/int64(SizeMB) > 1 {
		numStr = fmt.Sprintf("%.2f", float64(num)/float64(SizeMB))
		unit = "MB"
	} else if num/int64(SizeKB) > 1 {
		numStr = fmt.Sprintf("%.2f", float64(num)/float64(SizeKB))
		unit = "KB"
	} else {
		numStr = fmt.Sprintf("%d", num)
	}
	return numStr + " " + unit
}

// Seconds2Time 将秒数转换为对应的时长表示
//
// 输入参数：
//   - num int: 秒数
//
// 输出参数：
//   - string: 可读的时长表示字符串，例如 "1 年 2 个月 3 天 4 小时 5 分钟 6 秒"。
func Seconds2Time(num int) (time string) {
	if num/31104000 > 0 {
		time += strconv.Itoa(num/31104000) + " 年 "
		num %= 31104000
	}
	if num/2592000 > 0 {
		time += strconv.Itoa(num/2592000) + " 个月 "
		num %= 2592000
	}
	if num/86400 > 0 {
		time += strconv.Itoa(num/86400) + " 天 "
		num %= 86400
	}
	if num/3600 > 0 {
		time += strconv.Itoa(num/3600) + " 小时 "
		num %= 3600
	}
	if num/60 > 0 {
		time += strconv.Itoa(num/60) + " 分钟 "
		num %= 60
	}
	time += strconv.Itoa(num) + " 秒"
	return
}

// Interface2String 将接口类型转换为对应的字符串表示
//
// 输入参数：
//   - inter interface{}: 需要转换的接口类型
//
// 输出参数：
//   - string: 转换后的字符串表示
func Interface2String(inter interface{}) string {
	switch inter := inter.(type) {
	case string:
		return inter
	case int:
		return fmt.Sprintf("%d", inter)
	case float64:
		return fmt.Sprintf("%f", inter)
	}
	return "Not Implemented"
}

// UnescapeHTML 将输入字符串 x 转换为 template.HTML 类型的接口
//
// 输入参数：
//   - x string: 需要转换的字符串
//
// 输出参数：
//   - interface{}: 转换后的 template.HTML 类型的接口
func UnescapeHTML(x string) interface{} {
	return template.HTML(x)
}

// IntMax 返回两个整数 a 和 b 中的最大值
//
// 输入参数：
//   - a int: 第一个整数
//   - b int: 第二个整数
//
// 输出参数：
//   - int: 两个整数中的最大值
func IntMax(a int, b int) int {
	if a >= b {
		return a
	} else {
		return b
	}
}

// Max 返回两个整数 a 和 b 中的最大值
//
// 输入参数：
//   - a int: 第一个整数
//   - b int: 第二个整数
//
// 输出参数：
//   - int: 两个整数中的最大值
func Max(a int, b int) int {
	if a >= b {
		return a
	} else {
		return b
	}
}

// GenerateKey 函数用于生成一个48位长度的密钥。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - string: 生成的48位长度的密钥字符串。
func GenerateKey() string {
	randSource := rand.NewSource(time.Now().UnixNano()) // 使用当前时间的纳秒部分作为随机数种子
	r := rand.New(randSource)                           // 创建随机数生成器

	key := make([]byte, 48)   // 创建一个长度为48的字节切片
	for i := 0; i < 16; i++ { // 生成前16位随机字符
		key[i] = KeyChars[r.Intn(len(KeyChars))]
	}

	uuid_ := GetUUID()        // 获取 UUID
	for i := 0; i < 32; i++ { // 将 UUID 的字符加入到密钥中
		c := uuid_[i]
		if i%2 == 0 && c >= 'a' && c <= 'z' { // 如果是偶数位且小写字母，则转换为大写字母
			c = c - 'a' + 'A'
		}
		key[i+16] = c
	}

	return string(key) // 将密钥字节切片转换为字符串并返回
}

// GetRandomString 函数用于生成指定长度的随机字符串。
//
// 输入参数：
//   - length int: 随机字符串的长度。
//
// 输出参数：
//   - string: 生成的随机字符串。
func GetRandomString(length int) string {
	randSource := rand.NewSource(time.Now().UnixNano()) // 使用当前时间的纳秒部分作为随机数种子
	r := rand.New(randSource)                           // 创建随机数生成器

	key := make([]byte, length)   // 创建一个长度为length的字节切片
	for i := 0; i < length; i++ { // 生成随机字符
		key[i] = KeyChars[r.Intn(len(KeyChars))]
	}

	return string(key) // 将字节切片转换为字符串并返回
}

// GetRandomNumberString 函数用于生成指定长度的随机数字字符串。
//
// 输入参数：
//   - length int: 随机数字字符串的长度。
//
// 输出参数：
//   - string: 生成的随机数字字符串。
func GetRandomNumberString(length int) string {
	randSource := rand.NewSource(time.Now().UnixNano()) // 使用当前时间的纳秒部分作为随机数种子
	r := rand.New(randSource)                           // 创建随机数生成器

	key := make([]byte, length)   // 创建一个长度为length的字节切片
	for i := 0; i < length; i++ { // 生成随机数字字符
		key[i] = KeyNumbers[r.Intn(len(KeyNumbers))]
	}

	return string(key) // 将字节切片转换为字符串并返回
}

// GetOrDefaultEnvInt 函数用于从环境变量中获取整数值，如果获取失败或环境变量不存在则返回默认值。
//
// 输入参数：
//   - env string: 环境变量名。
//   - defaultValue int: 默认值，当环境变量不存在或无法转换为整数时返回该默认值。
//
// 输出参数：
//   - int: 获取到的整数值或默认值。
func GetOrDefaultEnvInt(env string, defaultValue int) int {
	if env == "" || os.Getenv(env) == "" { // 如果环境变量名为空或环境变量的值为空，则返回默认值
		return defaultValue
	}

	num, err := strconv.Atoi(os.Getenv(env)) // 尝试将环境变量的值转换为整数
	if err != nil {                          // 转换失败则返回默认值
		return defaultValue
	}

	return num // 返回成功转换的整数值
}

// GetOrDefaultEnvBool 从环境变量中获取指定参数的布尔值，如果不存在则返回默认值。
//
// 输入参数：
//   - env string: 环境变量名。
//   - defaultValue bool: 默认布尔值。
//
// 输出参数：
//   - bool: 返回从环境变量中获取的布尔值或者默认值。
func GetOrDefaultEnvBool(env string, defaultValue bool) bool {
	// 如果环境变量名为空或者对应环境变量值为空，则返回默认值
	if env == "" || os.Getenv(env) == "" {
		return defaultValue
	}

	// 返回从环境变量中获取的布尔值
	return os.Getenv(env) == "true"
}

// GetOrDefaultEnvFloat64 从环境变量中获取指定参数的浮点数值，如果不存在或解析失败则返回默认值。
//
// 输入参数：
//   - env string: 环境变量名。
//   - defaultValue float64: 默认浮点数值。
//
// 输出参数：
//   - float64: 返回从环境变量中获取的浮点数值或者默认值。
func GetOrDefaultEnvFloat64(env string, defaultValue float64) float64 {
	// 如果环境变量名为空或者对应环境变量值为空，则返回默认值
	if env == "" || os.Getenv(env) == "" {
		return defaultValue
	}

	// 尝试将环境变量值解析为浮点数值
	num, err := strconv.ParseFloat(os.Getenv(env), 64)
	if err != nil { // 解析失败，返回默认值
		return defaultValue
	}

	// 返回从环境变量中获取的浮点数值
	return num
}

// GetOrDefaultEnvString 函数用于从环境变量中获取字符串值，如果获取失败或环境变量不存在则返回默认值。
//
// 输入参数：
//   - env string: 环境变量名。
//   - defaultValue string: 默认值，当环境变量不存在时返回该默认值。
//
// 输出参数：
//   - string: 获取到的字符串值或默认值。
func GetOrDefaultEnvString(env string, defaultValue string) string {
	if env == "" || os.Getenv(env) == "" { // 如果环境变量名为空或环境变量的值为空，则返回默认值
		return defaultValue
	}

	return os.Getenv(env) // 返回环境变量的值
}

// AssignOrDefault 函数用于根据条件将值赋给变量，如果值为空则返回默认值。
//
// 输入参数：
//   - value string: 要赋给变量的值。
//   - defaultValue string: 默认值，当值为空时返回该默认值。
//
// 输出参数：
//   - string: 返回赋给变量的值或默认值。
func AssignOrDefault(value string, defaultValue string) string {
	if len(value) != 0 { // 如果值不为空，则返回该值
		return value
	}

	return defaultValue // 值为空时返回默认值
}

// MessageWithRequestId 函数用于在消息末尾添加请求 ID 信息。
//
// 输入参数：
//   - message string: 原始消息内容。
//   - id string: 请求 ID。
//
// 输出参数：
//   - string: 添加了请求 ID 信息的新消息字符串。
func MessageWithRequestId(message string, id string) string {
	return fmt.Sprintf("%s (request id: %s)", message, id)
}

// String2Int 函数用于将字符串转换为整数，如果转换失败则返回 0。
//
// 输入参数：
//   - str string: 要转换的字符串。
//
// 输出参数：
//   - int: 转换后的整数值或 0（转换失败时）。
func String2Int(str string) int {
	num, err := strconv.Atoi(str)
	if err != nil {
		return 0
	}
	return num
}
