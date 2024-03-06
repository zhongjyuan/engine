package relayHelper

import (
	"net/http"
	"time"
	"zhongjyuan/gin-one-api/common"
)

var HTTPClient *http.Client          // HTTP客户端
var ImpatientHTTPClient *http.Client // 超时时间为5秒的HTTP客户端

// init 函数在包初始化时被调用，用于初始化HTTP客户端。
func init() {
	// 如果RelayTimeout为0，则使用默认超时时间的HTTP客户端
	if common.RelayTimeout == 0 {
		HTTPClient = &http.Client{}
	} else {
		// 使用自定义超时时间的HTTP客户端
		HTTPClient = &http.Client{
			Timeout: time.Duration(common.RelayTimeout) * time.Second,
		}
	}

	// 创建超时时间为5秒的HTTP客户端
	ImpatientHTTPClient = &http.Client{
		Timeout: 5 * time.Second,
	}
}
