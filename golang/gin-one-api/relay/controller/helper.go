package controller

import (
	"context"
	"errors"
	"fmt"
	"math"
	"net/http"
	"zhongjyuan/gin-one-api/common"
	"zhongjyuan/gin-one-api/model"
	channel_openai "zhongjyuan/gin-one-api/relay/channel/openai"
	relayCommon "zhongjyuan/gin-one-api/relay/common"
	relayHelper "zhongjyuan/gin-one-api/relay/helper"
	relayModel "zhongjyuan/gin-one-api/relay/model"

	"github.com/gin-gonic/gin"
)

func getAndValidateTextRequest(c *gin.Context, relayMode int) (*relayModel.GeneralOpenAIRequest, error) {
	textRequest := &relayModel.GeneralOpenAIRequest{}
	err := common.UnmarshalBodyReusable(c, textRequest)
	if err != nil {
		return nil, err
	}
	if relayMode == relayCommon.RelayModeModerations && textRequest.Model == "" {
		textRequest.Model = "text-moderation-latest"
	}
	if relayMode == relayCommon.RelayModeEmbeddings && textRequest.Model == "" {
		textRequest.Model = c.Param("model")
	}
	err = relayHelper.ValidateTextRequest(textRequest, relayMode)
	if err != nil {
		return nil, err
	}
	return textRequest, nil
}

func getPromptTokens(textRequest *relayModel.GeneralOpenAIRequest, relayMode int) int {
	switch relayMode {
	case relayCommon.RelayModeChatCompletions:
		return channel_openai.CalculateMessageTokens(textRequest.Messages, textRequest.Model)
	case relayCommon.RelayModeCompletions:
		return channel_openai.CalculateInputTokens(textRequest.Prompt, textRequest.Model)
	case relayCommon.RelayModeModerations:
		return channel_openai.CalculateInputTokens(textRequest.Input, textRequest.Model)
	}
	return 0
}

func getPreConsumedQuota(textRequest *relayModel.GeneralOpenAIRequest, promptTokens int, ratio float64) int {
	preConsumedTokens := common.PreConsumedQuota
	if textRequest.MaxTokens != 0 {
		preConsumedTokens = promptTokens + textRequest.MaxTokens
	}
	return int(float64(preConsumedTokens) * ratio)
}

func preConsumeQuota(ctx context.Context, textRequest *relayModel.GeneralOpenAIRequest, promptTokens int, ratio float64, meta *relayHelper.RelayMeta) (int, *relayModel.ErrorWithStatusCode) {
	preConsumedQuota := getPreConsumedQuota(textRequest, promptTokens, ratio)

	userQuota, err := model.GetUserQuotaWithCache(meta.UserId)
	if err != nil {
		return preConsumedQuota, channel_openai.ErrorWrapper(err, "get_user_quota_failed", http.StatusInternalServerError)
	}
	if userQuota-preConsumedQuota < 0 {
		return preConsumedQuota, channel_openai.ErrorWrapper(errors.New("user quota is not enough"), "insufficient_user_quota", http.StatusForbidden)
	}
	err = model.DecreaseUserQuotaWithCache(meta.UserId, preConsumedQuota)
	if err != nil {
		return preConsumedQuota, channel_openai.ErrorWrapper(err, "decrease_user_quota_failed", http.StatusInternalServerError)
	}
	if userQuota > 100*preConsumedQuota {
		// in this case, we do not pre-consume quota
		// because the user has enough quota
		preConsumedQuota = 0
		common.Info(ctx, fmt.Sprintf("user %d has enough quota %d, trusted and no need to pre-consume", meta.UserId, userQuota))
	}
	if preConsumedQuota > 0 {
		err := model.PreConsumeTokenQuota(meta.TokenId, preConsumedQuota)
		if err != nil {
			return preConsumedQuota, channel_openai.ErrorWrapper(err, "pre_consume_token_quota_failed", http.StatusForbidden)
		}
	}
	return preConsumedQuota, nil
}

func postConsumeQuota(ctx context.Context, usage *relayModel.Usage, meta *relayHelper.RelayMeta, textRequest *relayModel.GeneralOpenAIRequest, ratio float64, preConsumedQuota int, modelRatio float64, groupRatio float64) {
	if usage == nil {
		common.Error(ctx, "usage is nil, which is unexpected")
		return
	}
	quota := 0
	completionRatio := common.GetCompletionRatio(textRequest.Model)
	promptTokens := usage.PromptTokens
	completionTokens := usage.CompletionTokens
	quota = int(math.Ceil((float64(promptTokens) + float64(completionTokens)*completionRatio) * ratio))
	if ratio != 0 && quota <= 0 {
		quota = 1
	}
	totalTokens := promptTokens + completionTokens
	if totalTokens == 0 {
		// in this case, must be some error happened
		// we cannot just return, because we may have to return the pre-consumed quota
		quota = 0
	}
	quotaDelta := quota - preConsumedQuota
	err := model.PostConsumeTokenQuota(meta.TokenId, quotaDelta)
	if err != nil {
		common.Error(ctx, "error consuming token remain quota: "+err.Error())
	}
	err = model.UpdateUserQuotaWithCache(meta.UserId)
	if err != nil {
		common.Error(ctx, "error update user quota cache: "+err.Error())
	}
	if quota != 0 {
		logContent := fmt.Sprintf("模型倍率 %.2f，分组倍率 %.2f，补全倍率 %.2f", modelRatio, groupRatio, completionRatio)
		model.RecordConsumeLog(ctx, meta.UserId, meta.ChannelId, promptTokens, completionTokens, textRequest.Model, meta.TokenName, quota, logContent)
		model.UpdateUserUsedQuotaAndRequestCountByID(meta.UserId, quota)
		model.UpdateChannelUsedQuotaByID(meta.ChannelId, quota)
	}
}
