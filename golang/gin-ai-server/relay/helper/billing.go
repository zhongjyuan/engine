package relayhelper

import (
	"context"
	"fmt"
	"zhongjyuan/gin-ai-server/common"
	"zhongjyuan/gin-ai-server/model"
)

// ReturnPreConsumedQuota 用于返回预先消费的配额。
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - preConsumedQuota int: 预先消费的配额值。
//   - tokenId int: 令牌 ID。
//
// 输出参数：
//   - 无。
func ReturnPreConsumedQuota(ctx context.Context, preConsumedQuota int64, tokenId int) {
	// 如果预先消费的配额不为 0，则执行以下逻辑
	if preConsumedQuota != 0 {
		// 在新的 goroutine 中执行后续操作
		go func(ctx context.Context) {
			// 调用 model 包中的 PostConsumeTokenQuota 方法，将预先消费的配额返回
			err := model.PostConsumeTokenQuota(tokenId, -preConsumedQuota)
			// 如果返回错误，记录错误日志
			if err != nil {
				common.Error(ctx, "error return pre-consumed quota: "+err.Error())
			}
		}(ctx) // 调用匿名函数，并传入上下文对象
	}
}

// PostConsumeQuota 用于消耗配额。
//
// 输入参数：
//   - ctx context.Context: 上下文对象。
//   - tokenId int: 令牌ID。
//   - quotaDelta int: 剩余需要消耗的配额。
//   - totalQuota int: 总共消耗的配额。
//   - userId int: 用户ID。
//   - channelId int: 渠道ID。
//   - modelRatio float64: 模型倍率。
//   - groupRatio float64: 分组倍率。
//   - modelName string: 模型名称。
//   - tokenName string: 令牌名称。
//
// 输出参数：
//   - 无。
func PostConsumeQuota(ctx context.Context, tokenId int, quotaDelta int64, totalQuota int64, userId int, channelId int, modelRatio, groupRatio float64, modelName string, tokenName string) {
	// Consume remaining quota
	if err := model.PostConsumeTokenQuota(tokenId, quotaDelta); err != nil {
		common.SysError("error consuming token remain quota: " + err.Error())
	}

	// Update user quota with cache
	if err := model.UpdateUserQuotaWithCache(ctx, userId); err != nil {
		common.SysError("error update user quota cache: " + err.Error())
	}

	// Record consume log and update quotas if totalQuota is not 0
	if totalQuota != 0 {
		logContent := fmt.Sprintf("模型倍率 %.2f，分组倍率 %.2f", modelRatio, groupRatio)
		model.RecordConsumeLog(ctx, userId, channelId, int(totalQuota), 0, modelName, tokenName, totalQuota, logContent)
		model.UpdateUserUsedQuotaAndRequestCountByID(userId, totalQuota)
		model.UpdateChannelUsedQuotaByID(channelId, totalQuota)
	}

	// Check for abnormal totalQuota
	if totalQuota <= 0 {
		common.Error(ctx, fmt.Sprintf("totalQuota consumed is %d, something is wrong", totalQuota))
	}
}
