package relayChannel

import (
	"io"
	"net/http"
	relayHelper "zhongjyuan/gin-one-api/relay/helper"
	relayModel "zhongjyuan/gin-one-api/relay/model"

	"github.com/gin-gonic/gin"
)

// Adaptor 定义了与 OpenAI 中继适配器相关的接口。
type Adaptor interface {
	// Init 用于初始化适配器。
	//
	// 输入参数：
	//   - meta *relayHelper.RelayMeta: 中继元数据。
	// 输出参数：
	//   - 无。
	Init(meta *relayHelper.RelayMeta)

	// GetRequestURL 返回请求的URL地址。
	//
	// 输入参数：
	//   - meta *relayHelper.RelayMeta: 中继元数据。
	// 输出参数：
	//   - string: 请求的URL地址。
	//   - error: 如果有错误发生，则返回相应的错误。
	GetRequestURL(meta *relayHelper.RelayMeta) (string, error)

	// SetupRequestHeader 设置请求的头部信息。
	//
	// 输入参数：
	//   - c *gin.Context: Gin上下文对象。
	//   - req *http.Request: HTTP请求对象。
	//   - meta *relayHelper.RelayMeta: 中继元数据。
	// 输出参数：
	//   - error: 如果设置过程中出现错误，则返回相应的错误。
	SetupRequestHeader(c *gin.Context, req *http.Request, meta *relayHelper.RelayMeta) error

	// ConvertRequest 转换请求数据。
	//
	// 输入参数：
	//   - c *gin.Context: Gin上下文对象。
	//   - relayMode int: 中继模式。
	//   - request *relayModel.GeneralOpenAIRequest: OpenAI请求对象。
	// 输出参数：
	//   - any: 转换后的请求数据。
	//   - error: 如果转换过程中出现错误，则返回相应的错误。
	ConvertRequest(c *gin.Context, relayMode int, request *relayModel.GeneralOpenAIRequest) (any, error)

	// DoRequest 执行请求发送并获取响应。
	//
	// 输入参数：
	//   - c *gin.Context: Gin上下文对象。
	//   - meta *relayHelper.RelayMeta: 中继元数据。
	//   - requestBody io.Reader: 请求体数据。
	// 输出参数：
	//   - *http.Response: HTTP响应对象。
	//   - error: 如果执行过程中出现错误，则返回相应的错误。
	DoRequest(c *gin.Context, meta *relayHelper.RelayMeta, requestBody io.Reader) (*http.Response, error)

	// DoResponse 处理响应数据。
	//
	// 输入参数：
	//   - c *gin.Context: Gin上下文对象。
	//   - resp *http.Response: HTTP响应对象。
	//   - meta *relayHelper.RelayMeta: 中继元数据。
	// 输出参数：
	//   - usage *relayModel.Usage: 使用情况数据。
	//   - err *relayModel.ErrorWithStatusCode: 带状态码的错误对象。
	DoResponse(c *gin.Context, resp *http.Response, meta *relayHelper.RelayMeta) (usage *relayModel.Usage, err *relayModel.ErrorWithStatusCode)

	// GetModelList 获取模型列表。
	//
	// 输入参数：
	//   - 无。
	// 输出参数：
	//   - []string: 模型名称列表。
	GetModelList() []string

	// GetChannelName 获取通道名称。
	//
	// 输入参数：
	//   - 无。
	// 输出参数：
	//   - string: 通道名称。
	GetChannelName() string
}
