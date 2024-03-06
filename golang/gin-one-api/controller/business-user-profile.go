package controller

import (
	"zhongjyuan/gin-one-api/common"
	"zhongjyuan/gin-one-api/model"

	"github.com/gin-gonic/gin"
)

// GetAffCode 通过用户ID获取推广码。
//
// 输入参数：
//   - c: gin 上下文对象。
//
// 输出参数：
//   - 无。
func GetAffCode(c *gin.Context) {
	// 获取用户ID
	id := c.GetInt("id")

	// 根据用户ID查询用户信息
	user, err := model.GetUserByID(id, true)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 如果用户的推广码为空，则生成一个随机码并更新用户信息
	if user.Profile.AffCode == "" {
		user.Profile.AffCode = common.GetRandomString(4)
		if err := user.Update(false); err != nil {
			common.SendFailureJSONResponse(c, err.Error())
			return
		}
	}

	// 返回成功响应，包含用户的推广码
	common.SendSuccessJSONResponse(c, "获取成功.", user.Profile.AffCode)
}

// topUpRequest 结构定义了充值请求的 JSON 结构。
type topUpRequest struct {
	Key string `json:"key"` // 兑换码
}

// TopUp 处理用户充值请求。
//
// 输入参数：
//   - c: gin 上下文对象。
//
// 输出参数：
//   - 无。
func TopUp(c *gin.Context) {
	// 初始化请求结构体
	req := topUpRequest{}

	// 解析 JSON 请求数据到结构体
	if err := c.ShouldBindJSON(&req); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 获取用户ID
	id := c.GetInt("id")

	// 兑换充值码并返回充值额度
	quota, err := model.RedeemQuota(req.Key, id)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 返回成功响应，包含充值额度信息
	common.SendSuccessJSONResponse(c, "获取成功.", quota)
}
