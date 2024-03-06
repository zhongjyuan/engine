package relayHelper

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"zhongjyuan/gin-one-api/common"
	relayModel "zhongjyuan/gin-one-api/relay/model"

	"github.com/gin-gonic/gin"
)

// ShouldDisableChannel 用于判断是否应禁用渠道。
//
// 输入参数：
//   - err *relayModel.Error: 错误对象。
//   - statusCode int: HTTP状态码。
//
// 输出参数：
//   - bool: 如果应该禁用渠道，则返回 true；否则返回 false。
func ShouldDisableChannel(err *relayModel.Error, statusCode int) bool {
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
//   - openAIErr *relayModel.Error: 开放API错误对象。
//
// 输出参数：
//   - bool: 如果应该启用渠道，则返回 true；否则返回 false。
func ShouldEnableChannel(err error, openAIErr *relayModel.Error) bool {
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

// RelayErrorHandler 用于处理Relay请求的错误响应。
//
// 输入参数：
//   - resp *http.Response: HTTP响应对象。
//
// 输出参数：
//   - errorWithStatusCode *relayModel.ErrorWithStatusCode: 包含错误状态码的Relay错误对象。
func RelayErrorHandler(resp *http.Response) (errorWithStatusCode *relayModel.ErrorWithStatusCode) {
	// 初始化errorWithStatusCode对象
	errorWithStatusCode = &relayModel.ErrorWithStatusCode{
		StatusCode: resp.StatusCode,
		Error: relayModel.Error{
			Message: "",
			Type:    "upstream_error",
			Code:    "bad_response_status_code",
			Param:   strconv.Itoa(resp.StatusCode),
		},
	}

	// 确保在函数返回前关闭resp.Body
	defer func() {
		_ = resp.Body.Close()
	}()

	// 读取响应体
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return
	}

	// 解析错误响应
	var errResponse relayModel.GeneralErrorResponse
	if err := json.Unmarshal(responseBody, &errResponse); err != nil {
		return
	}

	// 检查是否为OpenAI格式的错误响应，如果是，则覆盖默认的错误对象
	if errResponse.Error.Message != "" {
		errorWithStatusCode.Error = errResponse.Error
	} else {
		errorWithStatusCode.Error.Message = errResponse.ToMessage()
	}

	// 如果错误消息为空，则设置默认错误消息
	if errorWithStatusCode.Error.Message == "" {
		errorWithStatusCode.Error.Message = fmt.Sprintf("bad response status code %d", resp.StatusCode)
	}

	return
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
