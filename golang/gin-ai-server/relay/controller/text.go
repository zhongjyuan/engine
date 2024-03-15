package relaycontroller

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"zhongjyuan/gin-ai-server/common"
	"zhongjyuan/gin-ai-server/relay"
	relaycommon "zhongjyuan/gin-ai-server/relay/common"
	relayhelper "zhongjyuan/gin-ai-server/relay/helper"
	relaymodel "zhongjyuan/gin-ai-server/relay/model"

	"github.com/gin-gonic/gin"
)

// RelayText 是处理文本转发请求的函数。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象。
//
// 输出参数：
//   - *relaymodel.HTTPError: 如果出现错误，返回 HTTP 错误信息；否则返回 nil。
func RelayText(c *gin.Context) *relaymodel.HTTPError {
	// 获取上下文对象
	ctx := c.Request.Context()
	// 创建 AI 转发元数据
	meta := relayhelper.NewAIRelayMeta(c)

	// 获取并验证文本请求
	textRequest, err := ValidateAndExtractTextRequest(c, meta.Mode)
	if err != nil {
		common.Errorf(ctx, "ValidateAndExtractTextRequest failed: %s", err.Error())
		return relayhelper.WrapHTTPError(err, "invalid_text_request", http.StatusBadRequest)
	}
	meta.IsStream = textRequest.Stream

	// 映射模型名称
	var isModelMapped bool
	meta.OriginModelName = textRequest.Model
	textRequest.Model, isModelMapped = relayhelper.MapModelName(textRequest.Model, meta.ModelMapping)
	meta.ActualModelName = textRequest.Model

	// 获取模型比例和组比例
	modelRatio := common.RetrieveModelRatio(textRequest.Model)
	groupRatio := common.RetrieveGroupRatio(meta.Group)
	ratio := modelRatio * groupRatio

	// 预消耗配额
	promptTokens := CalculateInputTokens(textRequest, meta.Mode)
	meta.PromptTokens = promptTokens
	preConsumedQuota, bizErr := PreConsumeQuota(ctx, textRequest, promptTokens, ratio, meta)
	if bizErr != nil {
		common.Warnf(ctx, "PreConsumeQuota failed: %+v", *bizErr)
		return bizErr
	}

	// 获取适配器
	adaptor := relay.GetAdaptor(meta.APIType)
	if adaptor == nil {
		return relayhelper.WrapHTTPError(fmt.Errorf("invalid api type: %d", meta.APIType), "invalid_api_type", http.StatusBadRequest)
	}

	// 获取请求体
	var requestBody io.Reader
	if meta.APIType == relaycommon.APITypeOpenAI {
		// 对于 OpenAI 不需要转换请求
		shouldResetRequestBody := isModelMapped || meta.ChannelType == common.ChannelTypeBaichuan // frequency_penalty 0 is not acceptable for baichuan
		if shouldResetRequestBody {
			jsonStr, err := json.Marshal(textRequest)
			if err != nil {
				return relayhelper.WrapHTTPError(err, "json_marshal_failed", http.StatusInternalServerError)
			}
			requestBody = bytes.NewBuffer(jsonStr)
		} else {
			requestBody = c.Request.Body
		}
	} else {
		convertedRequest, err := adaptor.ConvertRequest(c, meta.Mode, textRequest)
		if err != nil {
			return relayhelper.WrapHTTPError(err, "convert_request_failed", http.StatusInternalServerError)
		}
		jsonData, err := json.Marshal(convertedRequest)
		if err != nil {
			return relayhelper.WrapHTTPError(err, "json_marshal_failed", http.StatusInternalServerError)
		}
		common.Debugf(ctx, "converted request: \n%s", string(jsonData))
		requestBody = bytes.NewBuffer(jsonData)
	}

	// 发起请求
	resp, err := adaptor.DoRequest(c, meta, requestBody)
	if err != nil {
		common.Errorf(ctx, "DoRequest failed: %s", err.Error())
		return relayhelper.WrapHTTPError(err, "do_request_failed", http.StatusInternalServerError)
	}

	errorHappened := (resp.StatusCode != http.StatusOK) || (meta.IsStream && resp.Header.Get("Content-Type") == "application/json")
	if errorHappened {
		relayhelper.ReturnPreConsumedQuota(ctx, preConsumedQuota, meta.TokenId)
		return relayhelper.NewHTTPError(resp)
	}
	meta.IsStream = meta.IsStream || strings.HasPrefix(resp.Header.Get("Content-Type"), "text/event-stream")

	// 处理响应
	usage, respErr := adaptor.DoResponse(c, resp, meta)
	if respErr != nil {
		common.Errorf(ctx, "respErr is not nil: %+v", respErr)
		relayhelper.ReturnPreConsumedQuota(ctx, preConsumedQuota, meta.TokenId)
		return respErr
	}

	// 后消耗配额
	go PostConsumeQuota(ctx, usage, meta, textRequest, ratio, preConsumedQuota, modelRatio, groupRatio)

	return nil
}
