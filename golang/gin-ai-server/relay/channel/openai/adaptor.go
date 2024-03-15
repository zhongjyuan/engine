package channel_openai

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"zhongjyuan/gin-ai-server/common"
	relaychannel "zhongjyuan/gin-ai-server/relay/channel"
	relayhelper "zhongjyuan/gin-ai-server/relay/helper"
	relaymodel "zhongjyuan/gin-ai-server/relay/model"

	"github.com/gin-gonic/gin"
)

type Adaptor struct {
	ChannelType int
}

// Init 用于初始化适配器信息。
//
// 输入参数：
//   - meta *relaymodel.AIRelayMeta: 包含通道类型等元信息的指针。
//
// 输出参数：
//   - 无。
func (a *Adaptor) Init(meta *relaymodel.AIRelayMeta) {
	a.ChannelType = meta.ChannelType
}

// GetRequestURL 根据元信息获取请求的完整 URL。
//
// 输入参数：
//   - meta *relaymodel.AIRelayMeta: 包含通道类型、请求路径、API 版本、模型名称等元信息的指针。
//
// 输出参数：
//   - string: 返回完整的请求 URL 字符串。
//   - error: 如果在处理过程中发生错误，则返回相应的错误信息。
func (a *Adaptor) GetRequestURL(meta *relaymodel.AIRelayMeta) (string, error) {
	switch meta.ChannelType {
	case common.ChannelTypeAzure:
		// https://learn.microsoft.com/en-us/azure/cognitive-services/openai/chatgpt-quickstart?pivots=rest-api&tabs=command-line#rest-api

		requestURL := strings.Split(meta.RequestURLPath, "?")[0]

		requestURL = fmt.Sprintf("%s?api-version=%s", requestURL, meta.APIVersion)

		task := strings.TrimPrefix(requestURL, "/v1/")

		model_ := meta.ActualModelName
		model_ = strings.Replace(model_, ".", "", -1)

		// https://github.com/songquanpeng/one-api/issues/67
		model_ = strings.TrimSuffix(model_, "-0301")
		model_ = strings.TrimSuffix(model_, "-0314")
		model_ = strings.TrimSuffix(model_, "-0613")

		requestURL = fmt.Sprintf("/openai/deployments/%s/%s", model_, task)
		return relayhelper.GetFullRequestURL(meta.BaseURL, requestURL, meta.ChannelType), nil
	case common.ChannelTypeMinimax:
		return relayhelper.GetRequestURL(meta)
	default:
		return relayhelper.GetFullRequestURL(meta.BaseURL, meta.RequestURLPath, meta.ChannelType), nil
	}
}

// SetupRequestHeader 设置请求的头部信息。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象。
//   - req *http.Request: HTTP 请求对象。
//   - meta *relaymodel.AIRelayMeta: 包含通道类型、API Key 等元信息的指针。
//
// 输出参数：
//   - error: 如果在设置过程中发生错误，则返回相应的错误信息；否则返回 nil。
func (a *Adaptor) SetupRequestHeader(c *gin.Context, req *http.Request, meta *relaymodel.AIRelayMeta) error {
	// 设置公共请求头部信息
	relaychannel.SetupCommonRequestHeader(c, req, meta)

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
//   - request *relaymodel.AIRequest: 通用的 OpenAI 请求对象。
//
// 输出参数：
//   - any: 返回转换后的请求对象，类型为任意类型。
//   - error: 如果在转换过程中发生错误，则返回相应的错误信息；否则返回 nil。
func (a *Adaptor) ConvertRequest(c *gin.Context, relayMode int, request *relaymodel.AIRequest) (any, error) {
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
//   - meta *relaymodel.AIRelayMeta: 包含通道类型、API Key 等元信息的指针。
//   - requestBody io.Reader: 请求体的 io.Reader。
//
// 输出参数：
//   - *http.Response: 返回一个 HTTP 响应对象指针。
//   - error: 如果在执行请求过程中发生错误，则返回相应的错误信息；否则返回 nil。
func (a *Adaptor) DoRequest(c *gin.Context, meta *relaymodel.AIRelayMeta, requestBody io.Reader) (*http.Response, error) {
	// 调用 DoRequestHelper 辅助函数执行请求
	return relaychannel.DoRequestHelper(a, c, meta, requestBody)
}

// DoResponse 处理响应。
//
// 输入参数：
//   - a *Adaptor: 适配器对象。
//   - c *gin.Context: Gin 上下文对象。
//   - resp *http.Response: HTTP 响应对象指针。
//   - meta *relaymodel.AIRelayMeta: 包含通道类型、API Key 等元信息的指针。
//
// 输出参数：
//   - usage *relaymodel.Usage: 返回处理后的用法对象指针。
//   - err *relaymodel.HTTPError: 返回带有状态码的错误对象指针。
func (a *Adaptor) DoResponse(c *gin.Context, resp *http.Response, meta *relaymodel.AIRelayMeta) (usage *relaymodel.Usage, err *relaymodel.HTTPError) {
	if meta.IsStream {
		var responseText string
		err, responseText, _ = StreamHandler(c, resp, meta.Mode)
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
	_, modelList := GetCompatibleChannelMeta(a.ChannelType)
	return modelList
}

// GetChannelName 获取通道名称。
//
// 输入参数：
//   - a *Adaptor: 适配器对象。
//
// 输出参数：
//   - string: 返回通道名称字符串。
func (a *Adaptor) GetChannelName() string {
	channelName, _ := GetCompatibleChannelMeta(a.ChannelType)
	return channelName
}
