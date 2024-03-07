package relaycontroller

import (
	"context"
	"errors"
	"fmt"
	"math"
	"net/http"
	"zhongjyuan/gin-one-api/common"
	"zhongjyuan/gin-one-api/model"
	relaycommon "zhongjyuan/gin-one-api/relay/common"
	relayhelper "zhongjyuan/gin-one-api/relay/helper"
	relaymodel "zhongjyuan/gin-one-api/relay/model"

	"github.com/gin-gonic/gin"
)

// ValidateAndExtractTextRequest 从请求中获取并验证文本请求。
//
// 输入参数：
//   - c *gin.Context: Gin框架的上下文对象，用于获取请求信息。
//   - relayMode int: 中继模式（Relay Mode）。
// 输出参数：
//   - *relaymodel.AIRequest: 解析和验证后的AI请求对象。
//   - error: 如果提取和验证过程中发生错误，则返回非空的error。

func ValidateAndExtractTextRequest(c *gin.Context, relayMode int) (*relaymodel.AIRequest, error) {
	// 创建一个空的AIRequest对象，用于存储解析后的请求数据
	textRequest := &relaymodel.AIRequest{}

	// 将请求体解析为AIRequest对象
	if err := common.UnmarshalBodyReusable(c, textRequest); err != nil {
		return nil, err
	}

	// 根据中继模式设置默认模型
	if textRequest.Model == "" {
		switch relayMode {
		case relaycommon.RelayModeModerations:
			textRequest.Model = "text-moderation-latest"
		case relaycommon.RelayModeEmbeddings:
			textRequest.Model = c.Param("model")
		}
	}

	// 验证AI请求对象的有效性
	if err := relayhelper.ValidateTextRequest(textRequest, relayMode); err != nil {
		return nil, err
	}

	// 返回解析和验证后的AI请求对象
	return textRequest, nil
}

// CalculateInputTokens 根据中继模式计算输入的令牌数。
//
// 输入参数：
//   - textRequest *relaymodel.AIRequest: AI请求对象。
//   - relayMode int: 中继模式（Relay Mode）。
//
// 输出参数：
//   - int: 输入的令牌数。
func CalculateInputTokens(textRequest *relaymodel.AIRequest, relayMode int) int {
	switch relayMode {
	case relaycommon.RelayModeChatCompletions:
		return relaymodel.CalculateMessageTokens(textRequest.Messages, textRequest.Model) // 计算消息中的令牌数
	case relaycommon.RelayModeCompletions:
		return relaymodel.CalculateInputTokens(textRequest.Prompt, textRequest.Model) // 计算提示中的令牌数
	case relaycommon.RelayModeModerations:
		return relaymodel.CalculateInputTokens(textRequest.Input, textRequest.Model) // 计算输入中的令牌数
	}
	return 0
}

// CalculatePreConsumedQuota 计算预消耗配额。
//
// 输入参数：
//   - textRequest *relaymodel.AIRequest: AI请求对象。
//   - promptTokens int: 输入的令牌数。
//   - ratio float64: 比率。
//
// 输出参数：
//   - int: 预消耗配额。
func CalculatePreConsumedQuota(textRequest *relaymodel.AIRequest, promptTokens int, ratio float64) int {
	// 初始预消耗配额为通用预消耗配额
	preConsumedTokens := common.PreConsumedQuota

	// 如果AI请求指定了最大令牌数，则使用最大令牌数和输入令牌数计算预消耗配额
	if textRequest.MaxTokens != 0 {
		preConsumedTokens = promptTokens + textRequest.MaxTokens
	}

	// 根据比率计算最终预消耗配额
	return int(float64(preConsumedTokens) * ratio)
}

// PreConsumeQuota 预消耗配额处理函数。
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - textRequest *relaymodel.AIRequest: AI请求对象。
//   - promptTokens int: 输入的令牌数。
//   - ratio float64: 比率。
//   - meta *relaymodel.AIRelayMeta: AI中继元数据。
//
// 输出参数：
//   - int: 预消耗配额。
//   - *relaymodel.HTTPError: HTTP错误对象。
func PreConsumeQuota(ctx context.Context, textRequest *relaymodel.AIRequest, promptTokens int, ratio float64, meta *relaymodel.AIRelayMeta) (int, *relaymodel.HTTPError) {
	// 计算预消耗配额
	preConsumedQuota := CalculatePreConsumedQuota(textRequest, promptTokens, ratio)

	// 获取用户配额并进行检查
	userQuota, err := model.GetUserQuotaWithCache(meta.UserId)
	if err != nil {
		return preConsumedQuota, relayhelper.WrapHTTPError(err, "get_user_quota_failed", http.StatusInternalServerError)
	}

	// 如果用户配额不足，则返回相应错误
	if userQuota-preConsumedQuota < 0 {
		return preConsumedQuota, relayhelper.WrapHTTPError(errors.New("user quota is not enough"), "insufficient_user_quota", http.StatusForbidden)
	}

	// 减少用户配额
	if err = model.DecreaseUserQuotaWithCache(meta.UserId, preConsumedQuota); err != nil {
		return preConsumedQuota, relayhelper.WrapHTTPError(err, "decrease_user_quota_failed", http.StatusInternalServerError)
	}

	// 如果用户配额超过预消耗配额的100倍，则不进行预消耗
	if userQuota > 100*preConsumedQuota {
		preConsumedQuota = 0
		common.Info(ctx, fmt.Sprintf("user %d has enough quota %d, trusted and no need to pre-consume", meta.UserId, userQuota))
	}

	// 如果需要预消耗配额，则进行预消耗
	if preConsumedQuota > 0 {
		if err := model.PreConsumeTokenQuota(meta.TokenId, preConsumedQuota); err != nil {
			return preConsumedQuota, relayhelper.WrapHTTPError(err, "pre_consume_token_quota_failed", http.StatusForbidden)
		}
	}

	// 返回预消耗配额和空的错误对象
	return preConsumedQuota, nil
}

// PostConsumeQuota 函数用于计算和更新配额消耗。
//
// 输入参数：
//   - ctx: 上下文对象。
//   - usage: 使用情况。
//   - meta: AI 中继元数据。
//   - textRequest: AI 请求。
//   - ratio: 配额倍率。
//   - preConsumedQuota: 预消耗配额。
//   - modelRatio: 模型倍率。
//   - groupRatio: 分组倍率。
//
// 输出参数：
//   - 无。
func PostConsumeQuota(ctx context.Context, usage *relaymodel.Usage, meta *relaymodel.AIRelayMeta, textRequest *relaymodel.AIRequest, ratio float64, preConsumedQuota int, modelRatio float64, groupRatio float64) {
	if usage == nil {
		common.Error(ctx, "usage is nil, which is unexpected")
		return
	}

	quota := 0                                                           // 初始化配额为 0
	completionRatio := common.RetrieveCompletionRatio(textRequest.Model) // 获取补全比例
	promptTokens := usage.PromptTokens                                   // 获取提示文本标记数
	completionTokens := usage.CompletionTokens                           // 获取补全文本标记数

	// 计算消耗配额
	quota = int(math.Ceil((float64(promptTokens) + float64(completionTokens)*completionRatio) * ratio))
	if ratio != 0 && quota <= 0 {
		quota = 1
	}

	totalTokens := promptTokens + completionTokens
	if totalTokens == 0 {
		// 在这种情况下，可能发生了一些错误
		// 我们不能直接返回，因为我们可能需要返回预消耗的配额
		quota = 0
	}

	// 计算配额变化量
	quotaDelta := quota - preConsumedQuota

	// 后消耗配额
	err := model.PostConsumeTokenQuota(meta.TokenId, quotaDelta)
	if err != nil {
		common.Error(ctx, "error consuming token remain quota: "+err.Error())
	}

	// 更新用户配额缓存
	err = model.UpdateUserQuotaWithCache(meta.UserId)
	if err != nil {
		common.Error(ctx, "error update user quota cache: "+err.Error())
	}

	if quota != 0 {
		// 记录消耗日志
		logContent := fmt.Sprintf("模型倍率 %.2f，分组倍率 %.2f，补全倍率 %.2f", modelRatio, groupRatio, completionRatio)
		model.RecordConsumeLog(ctx, meta.UserId, meta.ChannelId, promptTokens, completionTokens, textRequest.Model, meta.TokenName, quota, logContent)

		// 更新用户已使用配额和请求计数
		model.UpdateUserUsedQuotaAndRequestCountByID(meta.UserId, quota)

		// 更新渠道已使用配额
		model.UpdateChannelUsedQuotaByID(meta.ChannelId, quota)
	}
}
