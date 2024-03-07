package controller

import (
	"net/http"
	"zhongjyuan/gin-one-api/common"
	"zhongjyuan/gin-one-api/model"
	relaymodel "zhongjyuan/gin-one-api/relay/model"

	"github.com/gin-gonic/gin"
)

// GetSubscriptionInfo 用于获取订阅信息。
//
// 输入参数：
//   - c (*gin.Context): Gin 上下文对象。
//
// 输出参数：
//   - 无。
func GetSubscriptionInfo(c *gin.Context) {
	var (
		err         error              // 错误对象
		token       *model.TokenEntity // 令牌实体
		expireTime  int64              // 过期时间
		usedQuota   int                // 已使用配额
		remainQuota int                // 剩余配额
	)

	// 根据配置获取订阅信息
	if common.DisplayTokenStatEnabled {
		tokenId := c.GetInt("tokenId")           // 获取token_id参数
		token, err = model.GetTokenByID(tokenId) // 根据token_id获取token信息
		if err != nil {
			common.SendFailureJSONResponse(c, err.Error())
			return
		}
		expireTime = token.ExpireTime   // 获取token的过期时间
		usedQuota = token.UsedQuota     // 获取token已使用配额
		remainQuota = token.RemainQuota // 获取token剩余配额
	} else {
		userId := c.GetInt("id")                                           // 获取id参数
		if remainQuota, err = model.GetUserQuotaByID(userId); err != nil { // 根据用户ID获取剩余配额，若出错则进入下一步获取已使用配额
			usedQuota, err = model.GetUserUsedQuotaByID(userId) // 根据用户ID获取已使用配额
		}
	}

	// 处理过期时间为0的情况
	if expireTime <= 0 {
		expireTime = 0
	}

	// 处理可能的错误
	if err != nil {
		common.SendJSONResponse(c, http.StatusOK, false, "upstream_error", relaymodel.Error{Message: err.Error(), Type: "upstream_error"}) // 发送错误响应
		return
	}

	// 计算总配额
	quota := remainQuota + usedQuota
	amount := float64(quota)

	// 根据配置处理货币显示方式
	if common.DisplayInCurrencyEnabled {
		amount /= common.QuotaPerUnit
	}

	// 处理无限配额的情况
	if token != nil && token.UnlimitedQuota {
		amount = 100000000
	}

	// 构造订阅信息响应对象
	subscription := relaymodel.AISubscribeResponse{
		Object:             "billing_subscription",
		HasPaymentMethod:   true,
		SoftLimitUSD:       amount,
		HardLimitUSD:       amount,
		SystemHardLimitUSD: amount,
		AccessUntil:        expireTime,
	}

	// 发送成功响应
	common.SendSuccessJSONResponse(c, "", subscription)
}

// GetUsageInfo 用于获取用户使用配额信息。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含请求信息和响应信息。
//
// 输出参数：
//   - 无。
func GetUsageInfo(c *gin.Context) {
	var quota int // 已使用配额
	var err error // 错误对象
	var token *model.TokenEntity

	// 根据配置获取配额信息
	if common.DisplayTokenStatEnabled {
		tokenId := c.GetInt("tokenId")           // 获取token_id参数
		token, err = model.GetTokenByID(tokenId) // 根据token_id获取token信息
		quota = token.UsedQuota                  // 获取已使用配额
	} else {
		userId := c.GetInt("id")                        // 获取id参数
		quota, err = model.GetUserUsedQuotaByID(userId) // 根据用户ID获取已使用配额
	}

	// 处理可能的错误
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error()) // 发送错误响应
		return
	}

	amount := float64(quota)

	// 根据配置处理货币显示方式
	if common.DisplayInCurrencyEnabled {
		amount /= common.QuotaPerUnit
	}

	// 构造使用情况响应对象
	usage := relaymodel.AIUsageResponse{
		Object:     "list",
		TotalUsage: amount * 100,
	}

	// 发送成功响应
	common.SendSuccessJSONResponse(c, "", usage)
}
