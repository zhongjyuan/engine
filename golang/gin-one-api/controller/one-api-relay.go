package controller

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
	"zhongjyuan/gin-one-api/common"
	"zhongjyuan/gin-one-api/middleware"
	"zhongjyuan/gin-one-api/model"
	relaycommon "zhongjyuan/gin-one-api/relay/common"
	relaycontroller "zhongjyuan/gin-one-api/relay/controller"
	relayhelper "zhongjyuan/gin-one-api/relay/helper"
	relaymodel "zhongjyuan/gin-one-api/relay/model"

	"github.com/gin-gonic/gin"
)

// shouldRetry 用于确定是否应该重试请求。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象。
//   - statusCode int: HTTP 状态码。
// 输出参数：
//   - bool: 如果应该重试请求，则返回 true；否则返回 false。

func shouldRetry(c *gin.Context, statusCode int) bool {
	// 检查特定渠道 ID，若存在则不重试
	if _, ok := c.Get("specific_channel_id"); ok {
		return false
	}

	// 根据不同条件判断是否应该重试请求
	switch statusCode {
	case http.StatusTooManyRequests, http.StatusInternalServerError:
		return true
	case http.StatusBadRequest, http.StatusOK:
		return false
	default:
		return true
	}
}

// processChannelRelayError 用于处理渠道转发错误。
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - channelId int: 渠道 ID。
//   - channelName string: 渠道名称。
//   - err *relaymodel.HTTPError: 转发模型返回的 HTTP 错误。
//
// 输出参数：
//   - 无。
func processChannelRelayError(ctx context.Context, channelId int, channelName string, err *relaymodel.HTTPError) {
	// 记录错误日志
	common.Errorf(ctx, "relay error (channel #%d): %s", channelId, err.Message)

	// 根据转发模型的错误码和状态码判断是否需要禁用渠道
	if relayhelper.ShouldDisableChannel(&err.Error, err.StatusCode) {
		disableChannel(channelId, channelName, err.Message)
	}
}

// relayRequest 用于进行转发请求，并返回可能出现的 HTTP 错误。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象。
//   - relayMode int: 转发模式。
//
// 输出参数：
//   - *relaymodel.HTTPError: 转发过程中可能出现的 HTTP 错误，为 nil 表示无错误。
func relayRequest(c *gin.Context, relayMode int) *relaymodel.HTTPError {
	var err *relaymodel.HTTPError

	// 根据不同的转发模式调用对应的转发方法
	switch relayMode {
	case relaycommon.RelayModeImagesGenerations:
		err = relaycontroller.RelayImage(c, relayMode) // 调用图像转发方法
	case relaycommon.RelayModeAudioSpeech:
		fallthrough
	case relaycommon.RelayModeAudioTranslation:
		fallthrough
	case relaycommon.RelayModeAudioTranscription:
		err = relaycontroller.RelayAudio(c, relayMode) // 调用音频转发方法
	default:
		err = relaycontroller.RelayText(c) // 默认调用文本转发方法
	}

	return err
}

// Relay 方法用于处理转发请求，并根据情况进行重试。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象。
//
// 输出参数：
//   - 无。
func Relay(c *gin.Context) {
	ctx := c.Request.Context()

	relayMode := relaycommon.GetRelayModeByPath(c.Request.URL.Path)
	bizErr := relayRequest(c, relayMode)
	if bizErr == nil {
		return
	}

	group := c.GetString("group")                 // 获取分组信息
	channelId := c.GetInt("channelId")            // 获取渠道 ID
	channelName := c.GetString("channelName")     // 获取渠道名称
	originalModel := c.GetString("originalModel") // 获取原始模型信息
	lastFailedChannelId := channelId              // 记录最后失败的渠道 ID

	go processChannelRelayError(ctx, channelId, channelName, bizErr) // 异步处理渠道转发错误

	requestId := c.GetString(common.RequestIdKey) // 获取请求 ID
	retryTimes := common.RetryTimes               // 设置重试次数
	if !shouldRetry(c, bizErr.StatusCode) {       // 判断是否需要重试
		common.Errorf(ctx, "relay error happen, status code is %d, won't retry in this case", bizErr.StatusCode)
		retryTimes = 0
	}

	for i := retryTimes; i > 0; i-- {
		channel, err := model.GetRandomChannelWithCache(group, originalModel) // 从缓存中获取随机可用渠道
		if err != nil {
			common.Errorf(ctx, "CacheGetRandomSatisfiedChannel failed: %v", err)
			break
		}

		common.Infof(ctx, "using channel #%d to retry (remain times %d)", channel.Id, i) // 记录重试信息
		if channel.Id == lastFailedChannelId {                                           // 如果重试的渠道和上次失败的渠道相同，继续下一次重试
			continue
		}

		middleware.SetChannelContext(c, channel, originalModel) // 设置渠道上下文信息

		requestBody, err := common.GetRequestBody(c) // 获取请求体
		if err != nil {
			continue
		}

		c.Request.Body = io.NopCloser(bytes.NewBuffer(requestBody)) // 设置请求体内容

		bizErr = relayRequest(c, relayMode) // 发起重试转发请求
		if bizErr == nil {
			return
		}

		channelId := c.GetInt("channelId") // 获取渠道 ID
		lastFailedChannelId = channelId    // 记录最后失败的渠道 ID

		channelName := c.GetString("channelName") // 获取渠道名称

		go processChannelRelayError(ctx, channelId, channelName, bizErr) // 异步处理渠道转发错误
	}

	if bizErr != nil {
		if bizErr.StatusCode == http.StatusTooManyRequests {
			bizErr.Error.Message = "当前分组上游负载已饱和，请稍后再试"
		}

		bizErr.Error.Message = common.MessageWithRequestId(bizErr.Error.Message, requestId) // 组装带请求 ID 的错误信息

		common.SendJSONResponse(c, bizErr.StatusCode, false, "invalid request error", bizErr.Error) // 返回错误信息的 JSON 响应
	}
}

func RelayNotImplemented(c *gin.Context) {
	common.SendJSONResponse(c, http.StatusNotImplemented, false, "Not Implemented", relaymodel.Error{
		Message: "API not implemented",
		Type:    "one_api_error",
		Param:   "",
		Code:    "api_not_implemented",
	})
}

func RelayNotFound(c *gin.Context) {
	common.SendJSONResponse(c, http.StatusNotFound, false, "Not Found", relaymodel.Error{
		Message: fmt.Sprintf("Invalid URL (%s %s)", c.Request.Method, c.Request.URL.Path),
		Type:    "invalid_request_error",
		Param:   "",
		Code:    "",
	})
}
