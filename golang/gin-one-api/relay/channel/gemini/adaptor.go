package channel_gemini

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"zhongjyuan/gin-one-api/common"
	relaychannel "zhongjyuan/gin-one-api/relay/channel"
	channel_openai "zhongjyuan/gin-one-api/relay/channel/openai"
	relaymodel "zhongjyuan/gin-one-api/relay/model"

	"github.com/gin-gonic/gin"
)

type Adaptor struct {
}

func (a *Adaptor) Init(meta *relaymodel.AIRelayMeta) {

}

func (a *Adaptor) GetRequestURL(meta *relaymodel.AIRelayMeta) (string, error) {
	version := common.AssignOrDefault(meta.APIVersion, "v1")
	action := "generateContent"
	if meta.IsStream {
		action = "streamGenerateContent"
	}
	return fmt.Sprintf("%s/%s/models/%s:%s", meta.BaseURL, version, meta.ActualModelName, action), nil
}

func (a *Adaptor) SetupRequestHeader(c *gin.Context, req *http.Request, meta *relaymodel.AIRelayMeta) error {
	relaychannel.SetupCommonRequestHeader(c, req, meta)
	req.Header.Set("x-goog-api-key", meta.APIKey)
	return nil
}

func (a *Adaptor) ConvertRequest(c *gin.Context, relayMode int, request *relaymodel.AIRequest) (any, error) {
	if request == nil {
		return nil, errors.New("request is nil")
	}
	return ConvertRequest(*request), nil
}

func (a *Adaptor) DoRequest(c *gin.Context, meta *relaymodel.AIRelayMeta, requestBody io.Reader) (*http.Response, error) {
	return relaychannel.DoRequestHelper(a, c, meta, requestBody)
}

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
	return "google gemini"
}
