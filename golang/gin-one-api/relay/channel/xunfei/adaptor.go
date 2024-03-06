package channel_xunfei

import (
	"errors"
	"io"
	"net/http"
	"strings"
	relayChannel "zhongjyuan/gin-one-api/relay/channel"
	channel_openai "zhongjyuan/gin-one-api/relay/channel/openai"
	relayHelper "zhongjyuan/gin-one-api/relay/helper"
	relayModel "zhongjyuan/gin-one-api/relay/model"

	"github.com/gin-gonic/gin"
)

type Adaptor struct {
	request *relayModel.GeneralOpenAIRequest
}

func (a *Adaptor) Init(meta *relayHelper.RelayMeta) {

}

func (a *Adaptor) GetRequestURL(meta *relayHelper.RelayMeta) (string, error) {
	return "", nil
}

func (a *Adaptor) SetupRequestHeader(c *gin.Context, req *http.Request, meta *relayHelper.RelayMeta) error {
	relayChannel.SetupCommonRequestHeader(c, req, meta)
	// check DoResponse for auth part
	return nil
}

func (a *Adaptor) ConvertRequest(c *gin.Context, relayMode int, request *relayModel.GeneralOpenAIRequest) (any, error) {
	if request == nil {
		return nil, errors.New("request is nil")
	}
	a.request = request
	return nil, nil
}

func (a *Adaptor) DoRequest(c *gin.Context, meta *relayHelper.RelayMeta, requestBody io.Reader) (*http.Response, error) {
	// xunfei's request is not http request, so we don't need to do anything here
	dummyResp := &http.Response{}
	dummyResp.StatusCode = http.StatusOK
	return dummyResp, nil
}

func (a *Adaptor) DoResponse(c *gin.Context, resp *http.Response, meta *relayHelper.RelayMeta) (usage *relayModel.Usage, err *relayModel.ErrorWithStatusCode) {
	splits := strings.Split(meta.APIKey, "|")
	if len(splits) != 3 {
		return nil, channel_openai.ErrorWrapper(errors.New("invalid auth"), "invalid_auth", http.StatusBadRequest)
	}
	if a.request == nil {
		return nil, channel_openai.ErrorWrapper(errors.New("request is nil"), "request_is_nil", http.StatusBadRequest)
	}
	if meta.IsStream {
		err, usage = StreamHandler(c, *a.request, splits[0], splits[1], splits[2])
	} else {
		err, usage = Handler(c, *a.request, splits[0], splits[1], splits[2])
	}
	return
}

func (a *Adaptor) GetModelList() []string {
	return ModelList
}

func (a *Adaptor) GetChannelName() string {
	return "xunfei"
}
