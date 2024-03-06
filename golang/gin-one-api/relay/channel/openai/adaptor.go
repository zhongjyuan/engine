package channel_openai

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"zhongjyuan/gin-one-api/common"
	relayChannel "zhongjyuan/gin-one-api/relay/channel"
	channel_360 "zhongjyuan/gin-one-api/relay/channel/360"
	channel_moonshot "zhongjyuan/gin-one-api/relay/channel/moonshot"
	relayHelper "zhongjyuan/gin-one-api/relay/helper"
	relayModel "zhongjyuan/gin-one-api/relay/model"

	"github.com/gin-gonic/gin"
)

type Adaptor struct {
	ChannelType int
}

// Init 用于初始化适配器信息。
//
// 输入参数：
//   - meta *relayHelper.RelayMeta: 包含通道类型等元信息的指针。
//
// 输出参数：
//   - 无。
func (a *Adaptor) Init(meta *relayHelper.RelayMeta) {
	a.ChannelType = meta.ChannelType
}

// GetRequestURL 根据元信息获取请求的完整 URL。
//
// 输入参数：
//   - meta *relayHelper.RelayMeta: 包含通道类型、请求路径、API 版本、模型名称等元信息的指针。
//
// 输出参数：
//   - string: 返回完整的请求 URL 字符串。
//   - error: 如果在处理过程中发生错误，则返回相应的错误信息。
func (a *Adaptor) GetRequestURL(meta *relayHelper.RelayMeta) (string, error) {
	if meta.ChannelType != common.ChannelTypeAzure {
		return relayHelper.GetFullRequestURL(meta.BaseURL, meta.RequestURLPath, meta.ChannelType), nil
	}

	baseURL := meta.BaseURL
	requestURL := meta.RequestURLPath

	// 获取请求 URL，并添加 API 版本信息
	parts := strings.Split(requestURL, "?")
	requestURL = parts[0] + fmt.Sprintf("?api-version=%s", meta.APIVersion)

	// 剥离请求 URL 中的版本信息，处理模型名称格式
	task := strings.TrimPrefix(requestURL, "/v1/")
	model := strings.Replace(meta.ActualModelName, ".", "", -1)
	model = strings.TrimSuffix(strings.TrimSuffix(strings.TrimSuffix(model, "-0301"), "-0314"), "-0613")

	// 构建最终请求 URL 并返回
	requestURL = fmt.Sprintf("/openai/deployments/%s/%s", model, task)
	return relayHelper.GetFullRequestURL(baseURL, requestURL, meta.ChannelType), nil
}

// SetupRequestHeader 设置请求的头部信息。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象。
//   - req *http.Request: HTTP 请求对象。
//   - meta *relayHelper.RelayMeta: 包含通道类型、API Key 等元信息的指针。
//
// 输出参数：
//   - error: 如果在设置过程中发生错误，则返回相应的错误信息；否则返回 nil。
func (a *Adaptor) SetupRequestHeader(c *gin.Context, req *http.Request, meta *relayHelper.RelayMeta) error {
	// 设置公共请求头部信息
	relayChannel.SetupCommonRequestHeader(c, req, meta)

	switch meta.ChannelType {
	case common.ChannelTypeAzure:
		// 对于 Azure 通道类型，设置 api-key 头部信息
		req.Header.Set("api-key", meta.APIKey)
	case common.ChannelTypeOpenRouter:
		// 对于 OpenRouter 通道类型，设置额外的头部信息
		req.Header.Set("Authorization", "Bearer "+meta.APIKey)
		req.Header.Set("X-Title", "One API")
		req.Header.Set("HTTP-Referer", "https://api.zhongjyuan.club")
	default:
		// 对于其他通道类型，设置 Authorization 头部信息
		req.Header.Set("Authorization", "Bearer "+meta.APIKey)
	}
	return nil
}

// ConvertRequest 转换请求。
//
// 输入参数：
//   - a *Adaptor: 适配器对象。
//   - c *gin.Context: Gin 上下文对象。
//   - relayMode int: 中继模式。
//   - request *relayModel.GeneralOpenAIRequest: 通用的 OpenAI 请求对象。
//
// 输出参数：
//   - any: 返回转换后的请求对象，类型为任意类型。
//   - error: 如果在转换过程中发生错误，则返回相应的错误信息；否则返回 nil。
func (a *Adaptor) ConvertRequest(c *gin.Context, relayMode int, request *relayModel.GeneralOpenAIRequest) (any, error) {
	// 检查请求是否为空
	if request == nil {
		return nil, errors.New("request is nil")
	}
	// 返回转换后的请求对象
	return request, nil
}

// DoRequest 执行请求。
//
// 输入参数：
//   - a *Adaptor: 适配器对象。
//   - c *gin.Context: Gin 上下文对象。
//   - meta *relayHelper.RelayMeta: 包含通道类型、API Key 等元信息的指针。
//   - requestBody io.Reader: 请求体的 io.Reader。
//
// 输出参数：
//   - *http.Response: 返回一个 HTTP 响应对象指针。
//   - error: 如果在执行请求过程中发生错误，则返回相应的错误信息；否则返回 nil。
func (a *Adaptor) DoRequest(c *gin.Context, meta *relayHelper.RelayMeta, requestBody io.Reader) (*http.Response, error) {
	// 调用 DoRequestHelper 辅助函数执行请求
	return relayChannel.DoRequestHelper(a, c, meta, requestBody)
}

// DoResponse 处理响应。
//
// 输入参数：
//   - a *Adaptor: 适配器对象。
//   - c *gin.Context: Gin 上下文对象。
//   - resp *http.Response: HTTP 响应对象指针。
//   - meta *relayHelper.RelayMeta: 包含通道类型、API Key 等元信息的指针。
//
// 输出参数：
//   - usage *relayModel.Usage: 返回处理后的用法对象指针。
//   - err *relayModel.ErrorWithStatusCode: 返回带有状态码的错误对象指针。
func (a *Adaptor) DoResponse(c *gin.Context, resp *http.Response, meta *relayHelper.RelayMeta) (usage *relayModel.Usage, err *relayModel.ErrorWithStatusCode) {
	if meta.IsStream {
		var responseText string
		err, responseText = StreamHandler(c, resp, meta.Mode)
		usage = ResponseText2Usage(responseText, meta.ActualModelName, meta.PromptTokens)
	} else {
		err, usage = Handler(c, resp, meta.PromptTokens, meta.ActualModelName)
	}
	return
}

// GetModelList 获取模型列表。
//
// 输入参数：
//   - a *Adaptor: 适配器对象。
//
// 输出参数：
//   - []string: 返回模型名称列表的切片。
func (a *Adaptor) GetModelList() []string {
	switch a.ChannelType {
	case common.ChannelType360:
		return channel_360.ModelList
	case common.ChannelTypeMoonshot:
		return channel_moonshot.ModelList
	default:
		return ModelList
	}
}

// GetChannelName 获取通道名称。
//
// 输入参数：
//   - a *Adaptor: 适配器对象。
//
// 输出参数：
//   - string: 返回通道名称字符串。
func (a *Adaptor) GetChannelName() string {
	switch a.ChannelType {
	case common.ChannelTypeAzure:
		return "azure"
	case common.ChannelType360:
		return "360"
	case common.ChannelTypeMoonshot:
		return "moonshot"
	default:
		return "openai"
	}
}
