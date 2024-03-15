package channel_baidu

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	relaychannel "zhongjyuan/gin-ai-server/relay/channel"
	relaycommon "zhongjyuan/gin-ai-server/relay/common"
	relaymodel "zhongjyuan/gin-ai-server/relay/model"

	"github.com/gin-gonic/gin"
)

type Adaptor struct {
}

func (a *Adaptor) Init(meta *relaymodel.AIRelayMeta) {

}

// GetRequestURL 方法用于根据 AIRelayMeta 获取请求的完整 URL。
//
// 输入参数：
//   - meta: 包含实际模型名称和 API 密钥的元数据信息。
//
// 输出参数：
//   - string: 完整的请求 URL 字符串。
//   - error: 如果获取 Access Token 出现错误，则返回相应错误信息。
func (a *Adaptor) GetRequestURL(meta *relaymodel.AIRelayMeta) (string, error) {
	// https://cloud.baidu.com/doc/WENXINWORKSHOP/s/clntwmv7t

	suffix := "chat/"
	if strings.HasPrefix(meta.ActualModelName, "Embedding") {
		suffix = "embeddings/"
	}
	if strings.HasPrefix(meta.ActualModelName, "bge-large") {
		suffix = "embeddings/"
	}
	if strings.HasPrefix(meta.ActualModelName, "tao-8k") {
		suffix = "embeddings/"
	}

	switch meta.ActualModelName {
	case "ERNIE-4.0":
		suffix += "completions_pro"
	case "ERNIE-Bot-4":
		suffix += "completions_pro"
	case "ERNIE-3.5-8K":
		suffix += "completions"
	case "ERNIE-Bot-8K":
		suffix += "ernie_bot_8k"
	case "ERNIE-Bot":
		suffix += "completions"
	case "ERNIE-Speed":
		suffix += "ernie_speed"
	case "ERNIE-Bot-turbo":
		suffix += "eb-instant"
	case "BLOOMZ-7B":
		suffix += "bloomz_7b1"
	case "Embedding-V1":
		suffix += "embedding-v1"
	case "bge-large-zh":
		suffix += "bge_large_zh"
	case "bge-large-en":
		suffix += "bge_large_en"
	case "tao-8k":
		suffix += "tao_8k"
	default:
		suffix += meta.ActualModelName
	}
	fullRequestURL := fmt.Sprintf("%s/rpc/2.0/ai_custom/v1/wenxinworkshop/%s", meta.BaseURL, suffix)

	accessToken, err := GetAccessToken(meta.APIKey)
	if err != nil {
		return "", err
	}

	// 拼接完整请求 URL
	fullRequestURL += "?access_token=" + accessToken
	return fullRequestURL, nil
}

// SetupRequestHeader 方法用于设置请求头信息，包括通用请求头和 Authorization 头部。
//
// 输入参数：
//   - c: Gin 上下文对象。
//   - req: HTTP 请求对象。
//   - meta: 包含 API 密钥的元数据信息。
//
// 输出参数：
//   - error: 如果设置请求头信息出现错误，则返回相应错误信息。
func (a *Adaptor) SetupRequestHeader(c *gin.Context, req *http.Request, meta *relaymodel.AIRelayMeta) error {
	// 设置通用请求头
	relaychannel.SetupCommonRequestHeader(c, req, meta)

	// 设置 Authorization 头部
	req.Header.Set("Authorization", "Bearer "+meta.APIKey)

	return nil
}

// ConvertRequest 方法用于将通用的 OpenAI 请求转换为百度特定模型的请求格式。
//
// 输入参数：
//   - c: Gin 上下文对象。
//   - relayMode: Relay 模式。
//   - request: 通用的 OpenAI 请求对象。
//
// 输出参数：
//   - any: 转换后的百度特定模型的请求对象。
//   - error: 如果转换过程中出现错误，则返回相应错误信息。
func (a *Adaptor) ConvertRequest(c *gin.Context, relayMode int, request *relaymodel.AIRequest) (interface{}, error) {
	if request == nil {
		return nil, errors.New("request is nil")
	}

	switch relayMode {
	case relaycommon.RelayModeEmbeddings:
		return ConvertEmbeddingRequest(*request), nil
	default:
		return ConvertRequest(*request), nil
	}
}

func (a *Adaptor) DoRequest(c *gin.Context, meta *relaymodel.AIRelayMeta, requestBody io.Reader) (*http.Response, error) {
	return relaychannel.DoRequestHelper(a, c, meta, requestBody)
}

// DoResponse 方法用于处理 HTTP 响应，并返回相应的使用情况和错误信息。
//
// 输入参数：
//   - c: Gin 上下文对象。
//   - resp: HTTP 响应对象。
//   - meta: 包含元数据信息的 AIRelayMeta 对象。
//
// 输出参数：
//   - usage: 使用情况信息。
//   - err: 带有状态码的错误信息。
func (a *Adaptor) DoResponse(c *gin.Context, resp *http.Response, meta *relaymodel.AIRelayMeta) (usage *relaymodel.Usage, err *relaymodel.HTTPError) {
	if meta.IsStream {
		err, usage = StreamHandler(c, resp)
	}

	switch meta.Mode {
	case relaycommon.RelayModeEmbeddings:
		err, usage = EmbeddingHandler(c, resp)
	default:
		err, usage = Handler(c, resp)
	}
	return
}

func (a *Adaptor) GetModelList() []string {
	return ModelList
}

func (a *Adaptor) GetChannelName() string {
	return "baidu"
}
