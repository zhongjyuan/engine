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

func GetTimestamp() int64 {
	return time.Now().Unix()
}

func GetTimeString() string {
	now := time.Now()
	return fmt.Sprintf("%s%d", now.Format("20060102150405"), now.UnixNano()%1e9)
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
	if num/int64(sizeGB) > 1 {
		numStr = fmt.Sprintf("%.2f", float64(num)/float64(sizeGB))
		unit = "GB"
	} else if num/int64(sizeMB) > 1 {
		numStr = fmt.Sprintf("%d", int(float64(num)/float64(sizeMB)))
		unit = "MB"
	} else if num/int64(sizeKB) > 1 {
		numStr = fmt.Sprintf("%d", int(float64(num)/float64(sizeKB)))
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

func GenerateKey() string {
	randSource := rand.NewSource(time.Now().UnixNano())
	r := rand.New(randSource)

	key := make([]byte, 48)
	for i := 0; i < 16; i++ {
		key[i] = keyChars[r.Intn(len(keyChars))]
	}

	uuid_ := GetUUID()
	for i := 0; i < 32; i++ {
		c := uuid_[i]
		if i%2 == 0 && c >= 'a' && c <= 'z' {
			c = c - 'a' + 'A'
		}
		key[i+16] = c
	}

	return string(key)
}

func GetRandomString(length int) string {
	randSource := rand.NewSource(time.Now().UnixNano())
	r := rand.New(randSource)

	key := make([]byte, length)
	for i := 0; i < length; i++ {
		key[i] = keyChars[r.Intn(len(keyChars))]
	}

	return string(key)
}

func GetRandomNumberString(length int) string {
	randSource := rand.NewSource(time.Now().UnixNano())
	r := rand.New(randSource)

	key := make([]byte, length)
	for i := 0; i < length; i++ {
		key[i] = keyNumbers[r.Intn(len(keyNumbers))]
	}

	return string(key)
}

func GetOrDefaultEnvInt(env string, defaultValue int) int {
	if env == "" || os.Getenv(env) == "" {
		return defaultValue
	}

	num, err := strconv.Atoi(os.Getenv(env))
	if err != nil {
		return defaultValue
	}

	return num
}

func GetOrDefaultEnvString(env string, defaultValue string) string {
	if env == "" || os.Getenv(env) == "" {
		return defaultValue
	}

	return os.Getenv(env)
}

func AssignOrDefault(value string, defaultValue string) string {
	if len(value) != 0 {
		return value
	}

	return defaultValue
}

func MessageWithRequestId(message string, id string) string {
	return fmt.Sprintf("%s (request id: %s)", message, id)
}

func String2Int(str string) int {
	num, err := strconv.Atoi(str)
	if err != nil {
		return 0
	}
	return num
}
