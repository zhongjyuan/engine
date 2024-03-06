package channel_tencent

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	relayChannel "zhongjyuan/gin-one-api/relay/channel"
	channel_openai "zhongjyuan/gin-one-api/relay/channel/openai"
	relayHelper "zhongjyuan/gin-one-api/relay/helper"
	relayModel "zhongjyuan/gin-one-api/relay/model"

	"github.com/gin-gonic/gin"
)

// https://cloud.tencent.com/document/api/1729/101837

type Adaptor struct {
	Sign string
}

func (a *Adaptor) Init(meta *relayHelper.RelayMeta) {

}

func (a *Adaptor) GetRequestURL(meta *relayHelper.RelayMeta) (string, error) {
	return fmt.Sprintf("%s/hyllm/v1/chat/completions", meta.BaseURL), nil
}

func (a *Adaptor) SetupRequestHeader(c *gin.Context, req *http.Request, meta *relayHelper.RelayMeta) error {
	relayChannel.SetupCommonRequestHeader(c, req, meta)
	req.Header.Set("Authorization", a.Sign)
	req.Header.Set("X-TC-Action", meta.ActualModelName)
	return nil
}

func (a *Adaptor) ConvertRequest(c *gin.Context, relayMode int, request *relayModel.GeneralOpenAIRequest) (any, error) {
	if request == nil {
		return nil, errors.New("request is nil")
	}
	apiKey := c.Request.Header.Get("Authorization")
	apiKey = strings.TrimPrefix(apiKey, "Bearer ")
	appId, secretId, secretKey, err := ParseConfig(apiKey)
	if err != nil {
		return nil, err
	}
	tencentRequest := ConvertRequest(*request)
	tencentRequest.AppId = appId
	tencentRequest.SecretId = secretId
	// we have to calculate the sign here
	a.Sign = GetSign(*tencentRequest, secretKey)
	return tencentRequest, nil
}

func (a *Adaptor) DoRequest(c *gin.Context, meta *relayHelper.RelayMeta, requestBody io.Reader) (*http.Response, error) {
	return relayChannel.DoRequestHelper(a, c, meta, requestBody)
}

func (a *Adaptor) DoResponse(c *gin.Context, resp *http.Response, meta *relayHelper.RelayMeta) (usage *relayModel.Usage, err *relayModel.ErrorWithStatusCode) {
	if meta.IsStream {
		var responseText string
		err, responseText = StreamHandler(c, resp)
		usage = channel_openai.ResponseText2Usage(responseText, meta.ActualModelName, meta.PromptTokens)
	} else {
		err, usage = Handler(c, resp)
	}
	return
}

func (a *Adaptor) GetModelList() []string {
	return ModelList
}

func (a *Adaptor) GetChannelName() string {
	return "tencent"
}
