package config

import (
	"net"
)

// setDefaultIfEmpty 将默认值设置为指定字符串变量的值（如果该变量为空）。
//
// 输入参数：
//   - value: 要检查和设置默认值的字符串指针。
//   - defaultValue: 默认值，如果字符串为空，则将其设置为此默认值。
//
// 输出参数：
//   - 无。
func setDefaultIfEmpty(value *string, defaultValue string) {
	if *value == "" {
		*value = defaultValue
	}
}

// GetIP 获取本机的 IP 地址。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - string: 本机的 IP 地址。如果获取失败，则返回 "0.0.0.0"。
func GetIP() string {
	// 获取本机所有网络接口的 IP 地址
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		return "0.0.0.0"
	}

	// 遍历所有 IP 地址，找到第一个非回环地址的 IPv4 地址
	for _, address := range addrs {
		ipnet, ok := address.(*net.IPNet)
		if ok && !ipnet.IP.IsLoopback() && ipnet.IP.To4() != nil {
			return ipnet.IP.String()
		}
	}

	// 没有找到符合条件的 IP 地址，返回默认值
	return "0.0.0.0"
}
