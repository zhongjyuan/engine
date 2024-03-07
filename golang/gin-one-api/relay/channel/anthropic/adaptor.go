package channel_anthropic

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	relaychannel "zhongjyuan/gin-one-api/relay/channel"
	channel_openai "zhongjyuan/gin-one-api/relay/channel/openai"
	relaymodel "zhongjyuan/gin-one-api/relay/model"

	"github.com/gin-gonic/gin"
)

type Adaptor struct {
}

func (a *Adaptor) Init(meta *relaymodel.AIRelayMeta) {

}

// GetRequestURL 方法用于获取请求的URL地址。
//
// 输入参数：
//   - meta *relaymodel.AIRelayMeta: 包含中继元数据的指针。
//
// 输出参数：
//   - string: 请求的URL地址。
//   - error: 错误信息（如果有）。
func (a *Adaptor) GetRequestURL(meta *relaymodel.AIRelayMeta) (string, error) {
	return fmt.Sprintf("%s/v1/complete", meta.BaseURL), nil
}

// SetupRequestHeader 方法用于设置请求的头部信息。
//
// 输入参数：
//   - c *gin.Context: Gin框架的上下文对象。
//   - req *http.Request: HTTP请求对象。
//   - meta *relaymodel.AIRelayMeta: 包含中继元数据的指针。
//
// 输出参数：
//   - error: 错误信息（如果有）。
func (a *Adaptor) SetupRequestHeader(c *gin.Context, req *http.Request, meta *relaymodel.AIRelayMeta) error {
	// 设置通用请求头部信息
	relaychannel.SetupCommonRequestHeader(c, req, meta)

	// 设置 x-api-key 头部信息
	req.Header.Set("x-api-key", meta.APIKey)

	// 获取 anthropic-version 头部信息，如果不存在则设置为默认值 "2023-06-01"
	anthropicVersion := c.Request.Header.Get("anthropic-version")
	if anthropicVersion == "" {
		anthropicVersion = "2023-06-01"
	}
	req.Header.Set("anthropic-version", anthropicVersion)

	return nil
}

// ConvertRequest 方法用于转换请求。
//
// 输入参数：
//   - c *gin.Context: Gin框架的上下文对象。
//   - relayMode int: 中继模式。
//   - request *relaymodel.AIRequest: 包含通用OpenAI请求信息的指针。
//
// 输出参数：
//   - any: 任意类型的数据。
//   - error: 错误信息（如果有）。
func (a *Adaptor) ConvertRequest(c *gin.Context, relayMode int, request *relaymodel.AIRequest) (any, error) {
	// 检查请求是否为空
	if request == nil {
		return nil, errors.New("request is nil")
	}

	// 转换请求并返回
	return ConvertRequest(*request), nil
}

func (a *Adaptor) DoRequest(c *gin.Context, meta *relaymodel.AIRelayMeta, requestBody io.Reader) (*http.Response, error) {
	return relaychannel.DoRequestHelper(a, c, meta, requestBody)
}

// DoResponse 方法用于处理响应。
//
// 输入参数：
//   - c *gin.Context: Gin框架的上下文对象。
//   - resp *http.Response: HTTP响应对象。
//   - meta *relaymodel.AIRelayMeta: 包含中继元数据的指针。
//
// 输出参数：
//   - usage *relaymodel.Usage: 使用情况信息。
//   - err *relaymodel.HTTPError: 带有状态码的错误信息。
func (a *Adaptor) DoResponse(c *gin.Context, resp *http.Response, meta *relaymodel.AIRelayMeta) (usage *relaymodel.Usage, err *relaymodel.HTTPError) {
	if meta.IsStream {
		var responseText string
		err, responseText = StreamHandler(c, resp)
		usage = channel_openai.ResponseText2Usage(responseText, meta.ActualModelName, meta.PromptTokens)
	} else {
		err, usage = Handler(c, resp, meta.PromptTokens, meta.ActualModelName)
	}
	return
}

func (a *Adaptor) GetModelList() []string {
	return ModelList
}

func (a *Adaptor) GetChannelName() string {
	return "authropic"
}
