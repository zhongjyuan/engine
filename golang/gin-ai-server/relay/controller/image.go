package relaycontroller

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"zhongjyuan/gin-ai-server/common"
	"zhongjyuan/gin-ai-server/model"
	relayhelper "zhongjyuan/gin-ai-server/relay/helper"
	relaymodel "zhongjyuan/gin-ai-server/relay/model"

	"github.com/gin-gonic/gin"
)

// isWithinRange 函数用于检查给定值是否在指定范围内。
//
// 输入参数：
//   - element: 元素名称。
//   - value: 待检查的值。
//
// 输出参数：
//   - bool: 如果值在指定范围内，则返回 true；否则返回 false。
func isWithinRange(element string, value int) bool {
	if _, ok := common.DalleGenerationImageAmounts[element]; !ok {
		return false
	}
	min := common.DalleGenerationImageAmounts[element][0] // 获取最小值
	max := common.DalleGenerationImageAmounts[element][1] // 获取最大值

	return value >= min && value <= max // 检查值是否在范围内
}

// RelayImage 用于处理图像中继请求的帮助函数。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含请求信息和响应信息。
//   - relayMode int: 中继模式，用于指定中继方式。
//
// 输出参数：
//   - *relaymodel.HTTPError: 如果出现错误，返回 HTTP 错误信息；否则返回 nil。
func RelayImage(c *gin.Context, relayMode int) *relaymodel.HTTPError {
	ctx := c.Request.Context()
	meta := relayhelper.NewAIRelayMeta(c)

	imageRequest, err := getImageRequest(c, meta.Mode)
	if err != nil {
		common.Errorf(ctx, "getImageRequest failed: %s", err.Error())
		return relayhelper.WrapHTTPError(err, "invalid_image_request", http.StatusBadRequest)
	}

	// map model name
	var isModelMapped bool
	meta.OriginModelName = imageRequest.Model
	imageRequest.Model, isModelMapped = relayhelper.MapModelName(imageRequest.Model, meta.ModelMapping)
	meta.ActualModelName = imageRequest.Model

	// model validation
	bizErr := validateImageRequest(imageRequest, meta)
	if bizErr != nil {
		return bizErr
	}

	imageCostRatio, err := getImageCostRatio(imageRequest)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "get_image_cost_ratio_failed", http.StatusInternalServerError)
	}

	requestURL := c.Request.URL.String()
	fullRequestURL := relayhelper.GetFullRequestURL(meta.BaseURL, requestURL, meta.ChannelType)
	if meta.ChannelType == common.ChannelTypeAzure {
		// https://learn.microsoft.com/en-us/azure/ai-services/openai/dall-e-quickstart?tabs=dalle3%2Ccommand-line&pivots=rest-api
		apiVersion := relayhelper.GetAzureAPIVersion(c)
		// https://{resource_name}.openai.azure.com/openai/deployments/dall-e-3/images/generations?api-version=2023-06-01-preview
		fullRequestURL = fmt.Sprintf("%s/openai/deployments/%s/images/generations?api-version=%s", meta.BaseURL, imageRequest.Model, apiVersion)
	}

	var requestBody io.Reader
	if isModelMapped || meta.ChannelType == common.ChannelTypeAzure { // make Azure channel request body
		jsonStr, err := json.Marshal(imageRequest)
		if err != nil {
			return relayhelper.WrapHTTPError(err, "marshal_image_request_failed", http.StatusInternalServerError)
		}
		requestBody = bytes.NewBuffer(jsonStr)
	} else {
		requestBody = c.Request.Body
	}

	modelRatio := common.RetrieveModelRatio(imageRequest.Model)
	groupRatio := common.RetrieveGroupRatio(meta.Group)
	ratio := modelRatio * groupRatio
	userQuota, err := model.GetUserQuotaWithCache(ctx, meta.UserId)

	quota := int64(ratio*imageCostRatio*1000) * int64(imageRequest.N)

	if userQuota-quota < 0 {
		return relayhelper.WrapHTTPError(errors.New("user quota is not enough"), "insufficient_user_quota", http.StatusForbidden)
	}

	req, err := http.NewRequest(c.Request.Method, fullRequestURL, requestBody)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "new_request_failed", http.StatusInternalServerError)
	}

	token := c.Request.Header.Get("Authorization")
	if meta.ChannelType == common.ChannelTypeAzure { // Azure authentication
		token = strings.TrimPrefix(token, "Bearer ")
		req.Header.Set("api-key", token)
	} else {
		req.Header.Set("Authorization", token)
	}

	req.Header.Set("Content-Type", c.Request.Header.Get("Content-Type"))
	req.Header.Set("Accept", c.Request.Header.Get("Accept"))

	resp, err := relayhelper.HTTPClient.Do(req)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "do_request_failed", http.StatusInternalServerError)
	}

	err = req.Body.Close()
	if err != nil {
		return relayhelper.WrapHTTPError(err, "close_request_body_failed", http.StatusInternalServerError)
	}

	err = c.Request.Body.Close()
	if err != nil {
		return relayhelper.WrapHTTPError(err, "close_request_body_failed", http.StatusInternalServerError)
	}

	var imageResponse relaymodel.AIImageResponse

	defer func(ctx context.Context) {
		if resp.StatusCode != http.StatusOK {
			return
		}

		err := model.PostConsumeTokenQuota(meta.TokenId, quota)
		if err != nil {
			common.SysError("error consuming token remain quota: " + err.Error())
		}

		err = model.UpdateUserQuotaWithCache(ctx, meta.UserId)
		if err != nil {
			common.SysError("error update user quota cache: " + err.Error())
		}

		if quota != 0 {
			tokenName := c.GetString("token_name")
			logContent := fmt.Sprintf("模型倍率 %.2f，分组倍率 %.2f", modelRatio, groupRatio)
			model.RecordConsumeLog(ctx, meta.UserId, meta.ChannelId, 0, 0, imageRequest.Model, tokenName, quota, logContent)
			model.UpdateUserUsedQuotaAndRequestCountByID(meta.UserId, quota)
			channelId := c.GetInt("channel_id")
			model.UpdateChannelUsedQuotaByID(channelId, quota)
		}
	}(c.Request.Context())

	responseBody, err := io.ReadAll(resp.Body)

	if err != nil {
		return relayhelper.WrapHTTPError(err, "read_response_body_failed", http.StatusInternalServerError)
	}

	err = resp.Body.Close()
	if err != nil {
		return relayhelper.WrapHTTPError(err, "close_response_body_failed", http.StatusInternalServerError)
	}

	err = json.Unmarshal(responseBody, &imageResponse)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "unmarshal_response_body_failed", http.StatusInternalServerError)
	}

	resp.Body = io.NopCloser(bytes.NewBuffer(responseBody))

	for k, v := range resp.Header {
		c.Writer.Header().Set(k, v[0])
	}
	c.Writer.WriteHeader(resp.StatusCode)

	_, err = io.Copy(c.Writer, resp.Body)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "copy_response_body_failed", http.StatusInternalServerError)
	}
	err = resp.Body.Close()
	if err != nil {
		return relayhelper.WrapHTTPError(err, "close_response_body_failed", http.StatusInternalServerError)
	}
	return nil
}
