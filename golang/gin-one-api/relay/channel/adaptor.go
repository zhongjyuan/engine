package relaychannel

import (
	"io"
	"net/http"
	relaymodel "zhongjyuan/gin-one-api/relay/model"

	"github.com/gin-gonic/gin"
)

// Adaptor 定义了与 OpenAI 中继适配器相关的接口。
type Adaptor interface {
	// Init 用于初始化适配器。
	//
	// 输入参数：
	//   - meta *relaymodel.AIRelayMeta: 中继元数据。
	// 输出参数：
	//   - 无。
	Init(meta *relaymodel.AIRelayMeta)

	// GetRequestURL 返回请求的URL地址。
	//
	// 输入参数：
	//   - meta *relaymodel.AIRelayMeta: 中继元数据。
	// 输出参数：
	//   - string: 请求的URL地址。
	//   - error: 如果有错误发生，则返回相应的错误。
	GetRequestURL(meta *relaymodel.AIRelayMeta) (string, error)

	// SetupRequestHeader 设置请求的头部信息。
	//
	// 输入参数：
	//   - c *gin.Context: Gin上下文对象。
	//   - req *http.Request: HTTP请求对象。
	//   - meta *relaymodel.AIRelayMeta: 中继元数据。
	// 输出参数：
	//   - error: 如果设置过程中出现错误，则返回相应的错误。
	SetupRequestHeader(c *gin.Context, req *http.Request, meta *relaymodel.AIRelayMeta) error

	// ConvertRequest 转换请求数据。
	//
	// 输入参数：
	//   - c *gin.Context: Gin上下文对象。
	//   - relayMode int: 中继模式。
	//   - request *relaymodel.AIRequest: OpenAI请求对象。
	// 输出参数：
	//   - any: 转换后的请求数据。
	//   - error: 如果转换过程中出现错误，则返回相应的错误。
	ConvertRequest(c *gin.Context, relayMode int, request *relaymodel.AIRequest) (any, error)

	// DoRequest 执行请求发送并获取响应。
	//
	// 输入参数：
	//   - c *gin.Context: Gin上下文对象。
	//   - meta *relaymodel.AIRelayMeta: 中继元数据。
	//   - requestBody io.Reader: 请求体数据。
	// 输出参数：
	//   - *http.Response: HTTP响应对象。
	//   - error: 如果执行过程中出现错误，则返回相应的错误。
	DoRequest(c *gin.Context, meta *relaymodel.AIRelayMeta, requestBody io.Reader) (*http.Response, error)

	// DoResponse 处理响应数据。
	//
	// 输入参数：
	//   - c *gin.Context: Gin上下文对象。
	//   - resp *http.Response: HTTP响应对象。
	//   - meta *relaymodel.AIRelayMeta: 中继元数据。
	// 输出参数：
	//   - usage *relaymodel.Usage: 使用情况数据。
	//   - err *relaymodel.HTTPError: 带状态码的错误对象。
	DoResponse(c *gin.Context, resp *http.Response, meta *relaymodel.AIRelayMeta) (usage *relaymodel.Usage, err *relaymodel.HTTPError)

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
