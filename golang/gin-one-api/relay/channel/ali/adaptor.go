package channel_ali

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"zhongjyuan/gin-one-api/common"
	relayChannel "zhongjyuan/gin-one-api/relay/channel"
	relayCommon "zhongjyuan/gin-one-api/relay/common"
	relayHelper "zhongjyuan/gin-one-api/relay/helper"
	relayModel "zhongjyuan/gin-one-api/relay/model"

	"github.com/gin-gonic/gin"
)

// https://help.aliyun.com/zh/dashscope/developer-reference/api-details

type Adaptor struct {
}

func (a *Adaptor) Init(meta *relayHelper.RelayMeta) {

}

// GetRequestURL 用于获取请求的完整URL。
//
// 输入参数：
//   - meta *relayHelper.RelayMeta: 包含请求元数据的结构体。
//
// 输出参数：
//   - string: 完整的请求URL。
//   - error: 如果在构造请求URL时发生错误，则返回相应的错误信息。
func (a *Adaptor) GetRequestURL(meta *relayHelper.RelayMeta) (string, error) {
	// 根据不同的模式构造完整的请求URL
	var endpoint string
	if meta.Mode == relayCommon.RelayModeEmbeddings {
		endpoint = "api/v1/services/embeddings/text-embedding/text-embedding"
	} else {
		endpoint = "api/v1/services/aigc/text-generation/generation"
	}
	return fmt.Sprintf("%s/%s", meta.BaseURL, endpoint), nil
}

// SetupRequestHeader 用于设置请求的头部信息。
//
// 输入参数：
//   - c *gin.Context: Gin上下文对象，用于获取请求相关信息。
//   - req *http.Request: HTTP请求对象，用于设置请求头部信息。
//   - meta *relayHelper.RelayMeta: 包含请求元数据的结构体。
//
// 输出参数：
//   - error: 如果在设置请求头部信息时发生错误，则返回相应的错误信息。
func (a *Adaptor) SetupRequestHeader(c *gin.Context, req *http.Request, meta *relayHelper.RelayMeta) error {
	// 设置通用的请求头部信息
	relayChannel.SetupCommonRequestHeader(c, req, meta)

	// 设置 Authorization 头部信息
	req.Header.Set("Authorization", "Bearer "+meta.APIKey)

	// 根据是否为流式请求设置 X-DashScope-SSE 头部信息
	if meta.IsStream {
		req.Header.Set("X-DashScope-SSE", "enable")
	}

	// 如果配置中有插件信息，则设置 X-DashScope-Plugin 头部信息
	plugin := c.GetString(common.ConfigKeyPlugin)
	if plugin != "" {
		req.Header.Set("X-DashScope-Plugin", plugin)
	}

	return nil
}

// ConvertRequest 用于转换通用OpenAI请求为百度OpenAI请求。
//
// 输入参数：
//   - c *gin.Context: Gin上下文对象，用于获取请求相关信息。
//   - relayMode int: 转换模式，指定要转换的类型。
//   - request *relayModel.GeneralOpenAIRequest: 通用OpenAI请求对象。
//
// 输出参数：
//   - any: 转换后的百度OpenAI请求对象。
//   - error: 如果在转换过程中发生错误，则返回相应的错误信息。
func (a *Adaptor) ConvertRequest(c *gin.Context, relayMode int, request *relayModel.GeneralOpenAIRequest) (any, error) {
	if request == nil {
		return nil, errors.New("request is nil")
	}

	switch relayMode {
	case relayCommon.RelayModeEmbeddings: // 将通用OpenAI请求转换为百度Embedding请求
		return ConvertEmbeddingRequest(*request), nil
	default: // 将通用OpenAI请求转换为百度Embedding请求
		return ConvertRequest(*request), nil
	}
}

func (a *Adaptor) DoRequest(c *gin.Context, meta *relayHelper.RelayMeta, requestBody io.Reader) (*http.Response, error) {
	return relayChannel.DoRequestHelper(a, c, meta, requestBody)
}

// DoResponse 用于处理响应并返回相应的错误和使用情况。
//
// 输入参数：
//   - c *gin.Context: Gin上下文对象，用于获取请求相关信息。
//   - resp *http.Response: HTTP响应对象。
//   - meta *relayHelper.RelayMeta: 包含请求元数据的结构体。
//
// 输出参数：
//   - usage *relayModel.Usage: 使用情况结构体指针，包含响应的使用情况信息。
//   - err *relayModel.ErrorWithStatusCode: 带有状态码的错误结构体指针，包含处理响应时可能出现的错误信息。
func (a *Adaptor) DoResponse(c *gin.Context, resp *http.Response, meta *relayHelper.RelayMeta) (usage *relayModel.Usage, err *relayModel.ErrorWithStatusCode) {
	// 如果是流式请求，调用流式处理函数
	if meta.IsStream {
		err, usage = StreamHandler(c, resp)
	}

	switch meta.Mode {
	case relayCommon.RelayModeEmbeddings:
		// 调用嵌入处理函数
		err, usage = EmbeddingHandler(c, resp)
	default:
		// 默认调用处理函数
		err, usage = Handler(c, resp)
	}
	return
}

func (a *Adaptor) GetModelList() []string {
	return ModelList
}

func (a *Adaptor) GetChannelName() string {
	return "ali"
}
