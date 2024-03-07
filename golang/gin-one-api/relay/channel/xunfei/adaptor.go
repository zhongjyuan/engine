package channel_xunfei

import (
	"errors"
	"io"
	"net/http"
	"strings"
	relaychannel "zhongjyuan/gin-one-api/relay/channel"
	relayhelper "zhongjyuan/gin-one-api/relay/helper"
	relaymodel "zhongjyuan/gin-one-api/relay/model"

	"github.com/gin-gonic/gin"
)

type Adaptor struct {
	request *relaymodel.AIRequest
}

func (a *Adaptor) Init(meta *relaymodel.AIRelayMeta) {

}

func (a *Adaptor) GetRequestURL(meta *relaymodel.AIRelayMeta) (string, error) {
	return "", nil
}

func (a *Adaptor) SetupRequestHeader(c *gin.Context, req *http.Request, meta *relaymodel.AIRelayMeta) error {
	relaychannel.SetupCommonRequestHeader(c, req, meta)
	// check DoResponse for auth part
	return nil
}

func (a *Adaptor) ConvertRequest(c *gin.Context, relayMode int, request *relaymodel.AIRequest) (any, error) {
	if request == nil {
		return nil, errors.New("request is nil")
	}
	a.request = request
	return nil, nil
}

func (a *Adaptor) DoRequest(c *gin.Context, meta *relaymodel.AIRelayMeta, requestBody io.Reader) (*http.Response, error) {
	// xunfei's request is not http request, so we don't need to do anything here
	dummyResp := &http.Response{}
	dummyResp.StatusCode = http.StatusOK
	return dummyResp, nil
}

func (a *Adaptor) DoResponse(c *gin.Context, resp *http.Response, meta *relaymodel.AIRelayMeta) (usage *relaymodel.Usage, err *relaymodel.HTTPError) {
	splits := strings.Split(meta.APIKey, "|")
	if len(splits) != 3 {
		return nil, relayhelper.WrapHTTPError(errors.New("invalid auth"), "invalid_auth", http.StatusBadRequest)
	}
	if a.request == nil {
		return nil, relayhelper.WrapHTTPError(errors.New("request is nil"), "request_is_nil", http.StatusBadRequest)
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
