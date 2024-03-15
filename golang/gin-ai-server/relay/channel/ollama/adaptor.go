package channel_ollama

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	relaychannel "zhongjyuan/gin-ai-server/relay/channel"
	relaycommon "zhongjyuan/gin-ai-server/relay/common"
	relaymodel "zhongjyuan/gin-ai-server/relay/model"

	"github.com/gin-gonic/gin"
)

type Adaptor struct {
}

func (a *Adaptor) Init(meta *relaymodel.AIRelayMeta) {

}

func (a *Adaptor) GetRequestURL(meta *relaymodel.AIRelayMeta) (string, error) {
	// https://github.com/ollama/ollama/blob/main/docs/api.md
	fullRequestURL := fmt.Sprintf("%s/api/chat", meta.BaseURL)
	return fullRequestURL, nil
}

func (a *Adaptor) SetupRequestHeader(c *gin.Context, req *http.Request, meta *relaymodel.AIRelayMeta) error {
	relaychannel.SetupCommonRequestHeader(c, req, meta)
	req.Header.Set("Authorization", "Bearer "+meta.APIKey)
	return nil
}

func (a *Adaptor) ConvertRequest(c *gin.Context, relayMode int, request *relaymodel.AIRequest) (any, error) {
	if request == nil {
		return nil, errors.New("request is nil")
	}
	switch relayMode {
	case relaycommon.RelayModeEmbeddings:
		return nil, errors.New("not supported")
	default:
		return ConvertRequest(*request), nil
	}
}

func (a *Adaptor) DoRequest(c *gin.Context, meta *relaymodel.AIRelayMeta, requestBody io.Reader) (*http.Response, error) {
	return relaychannel.DoRequestHelper(a, c, meta, requestBody)
}

func (a *Adaptor) DoResponse(c *gin.Context, resp *http.Response, meta *relaymodel.AIRelayMeta) (usage *relaymodel.Usage, err *relaymodel.HTTPError) {
	if meta.IsStream {
		err, usage = StreamHandler(c, resp)
	} else {
		err, usage = Handler(c, resp)
	}
	return
}

func (a *Adaptor) GetModelList() []string {
	return ModelList
}

func (a *Adaptor) GetChannelName() string {
	return "ollama"
}
