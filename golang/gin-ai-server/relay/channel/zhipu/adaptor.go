package channel_zhipu

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	relaychannel "zhongjyuan/gin-ai-server/relay/channel"
	channel_openai "zhongjyuan/gin-ai-server/relay/channel/openai"
	relaymodel "zhongjyuan/gin-ai-server/relay/model"

	"github.com/gin-gonic/gin"
)

type Adaptor struct {
	APIVersion string
}

func (a *Adaptor) Init(meta *relaymodel.AIRelayMeta) {

}

func (a *Adaptor) SetVersionByModeName(modelName string) {
	if strings.HasPrefix(modelName, "glm-") {
		a.APIVersion = "v4"
	} else {
		a.APIVersion = "v3"
	}
}

func (a *Adaptor) GetRequestURL(meta *relaymodel.AIRelayMeta) (string, error) {
	a.SetVersionByModeName(meta.ActualModelName)
	if a.APIVersion == "v4" {
		return fmt.Sprintf("%s/api/paas/v4/chat/completions", meta.BaseURL), nil
	}

	method := "invoke"
	if meta.IsStream {
		method = "sse-invoke"
	}
	return fmt.Sprintf("%s/api/paas/v3/relaymodel-api/%s/%s", meta.BaseURL, meta.ActualModelName, method), nil
}

func (a *Adaptor) SetupRequestHeader(c *gin.Context, req *http.Request, meta *relaymodel.AIRelayMeta) error {
	relaychannel.SetupCommonRequestHeader(c, req, meta)
	token := GetToken(meta.APIKey)
	req.Header.Set("Authorization", token)
	return nil
}

func (a *Adaptor) ConvertRequest(c *gin.Context, relayMode int, request *relaymodel.AIRequest) (any, error) {
	if request == nil {
		return nil, errors.New("request is nil")
	}

	if request.TopP >= 1 {
		request.TopP = 0.99
	}

	a.SetVersionByModeName(request.Model)
	if a.APIVersion == "v4" {
		return request, nil
	}

	return ConvertRequest(*request), nil
}

func (a *Adaptor) DoRequest(c *gin.Context, meta *relaymodel.AIRelayMeta, requestBody io.Reader) (*http.Response, error) {
	return relaychannel.DoRequestHelper(a, c, meta, requestBody)
}

func (a *Adaptor) DoResponse(c *gin.Context, resp *http.Response, meta *relaymodel.AIRelayMeta) (usage *relaymodel.Usage, err *relaymodel.HTTPError) {
	if a.APIVersion == "v4" {
		return a.DoResponseV4(c, resp, meta)
	}

	if meta.IsStream {
		err, usage = StreamHandler(c, resp)
	} else {
		err, usage = Handler(c, resp)
	}
	return
}

func (a *Adaptor) DoResponseV4(c *gin.Context, resp *http.Response, meta *relaymodel.AIRelayMeta) (usage *relaymodel.Usage, err *relaymodel.HTTPError) {
	if meta.IsStream {
		err, _, usage = channel_openai.StreamHandler(c, resp, meta.Mode)
	} else {
		err, usage = channel_openai.Handler(c, resp, meta.PromptTokens, meta.ActualModelName)
	}
	return
}

func (a *Adaptor) GetModelList() []string {
	return ModelList
}

func (a *Adaptor) GetChannelName() string {
	return "zhipu"
}
