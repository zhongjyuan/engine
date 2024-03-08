package relayhelper

import (
	"fmt"
	"net/http"
	"strings"
	"zhongjyuan/gin-ai-server/common"
	relaymodel "zhongjyuan/gin-ai-server/relay/model"

	"github.com/gin-gonic/gin"
)

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

// ShouldDisableChannel 用于判断是否应禁用渠道。
//
// 输入参数：
//   - err *relaymodel.Error: 错误对象。
//   - statusCode int: HTTP状态码。
//
// 输出参数：
//   - bool: 如果应该禁用渠道，则返回 true；否则返回 false。
func ShouldDisableChannel(err *relaymodel.Error, statusCode int) bool {
	// 检查自动禁用渠道是否已启用
	if !common.AutomaticDisableChannelEnabled {
		return false
	}

	// 如果错误为nil，则不禁用渠道
	if err == nil {
		return false
	}

	// 对于未经授权的状态码或特定的错误类型或代码，禁用渠道
	if statusCode == http.StatusUnauthorized ||
		err.Type == "insufficient_quota" ||
		err.Code == "invalid_api_key" ||
		err.Code == "account_deactivated" {
		return true
	}

	// 默认情况下不禁用渠道
	return false
}

// ShouldEnableChannel 用于判断是否应启用渠道。
//
// 输入参数：
//   - err error: 一般错误对象。
//   - openAIErr *relaymodel.Error: 开放API错误对象。
//
// 输出参数：
//   - bool: 如果应该启用渠道，则返回 true；否则返回 false。
func ShouldEnableChannel(err error, openAIErr *relaymodel.Error) bool {
	// 检查自动启用渠道是否已启用
	if !common.AutomaticEnableChannelEnabled {
		return false
	}

	// 如果一般错误不为nil，则不启用渠道
	if err != nil {
		return false
	}

	// 如果开放API错误不为nil，则不启用渠道
	if openAIErr != nil {
		return false
	}

	// 默认情况下启用渠道
	return true
}

// GetFullRequestURL 用于构建完整的请求URL。
//
// 输入参数：
//   - baseURL: 基础URL。
//   - requestURL: 请求URL。
//   - channelType: 渠道类型，取值为 common.ChannelTypeOpenAI 或 common.ChannelTypeAzure。
//
// 输出参数：
//   - string: 完整的请求URL。
func GetFullRequestURL(baseURL, requestURL string, channelType int) string {
	// 默认完整请求URL为基础URL和请求URL的拼接
	fullURL := fmt.Sprintf("%s%s", baseURL, requestURL)

	// 根据特定条件调整完整请求URL
	if strings.HasPrefix(baseURL, "https://gateway.ai.cloudflare.com") {
		switch channelType {
		case common.ChannelTypeOpenAI:
			fullURL = fmt.Sprintf("%s%s", baseURL, strings.TrimPrefix(requestURL, "/v1"))
		case common.ChannelTypeAzure:
			fullURL = fmt.Sprintf("%s%s", baseURL, strings.TrimPrefix(requestURL, "/openai/deployments"))
		}
	}

	return fullURL
}

// GetAzureAPIVersion 用于从请求中获取Azure API版本号。
//
// 输入参数：
//   - c *gin.Context: Gin上下文对象，用于获取请求相关信息。
//
// 输出参数：
//   - string: Azure API版本号。
func GetAzureAPIVersion(c *gin.Context) string {
	// 获取查询参数
	query := c.Request.URL.Query()

	// 获取api-version参数值
	apiVersion := query.Get("api-version")

	// 如果api-version为空，则从配置中获取
	if apiVersion == "" {
		apiVersion = c.GetString(common.ConfigKeyAPIVersion)
	}

	return apiVersion
}
