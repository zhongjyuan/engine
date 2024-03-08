package controller

import (
	"strings"
	"zhongjyuan/gin-ai-server/common"
	"zhongjyuan/gin-ai-server/model"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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
		if err := user.Update(false, true); err != nil {
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

// GenerateAccessToken 函数用于生成用户的访问令牌。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含了请求信息和响应信息。
//
// 输出参数：
//   - 无。
func GenerateAccessToken(c *gin.Context) {
	// 获取当前用户 ID
	id := c.GetInt("id")

	// 获取用户信息
	user, err := model.GetUserByID(id, true)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 生成 UUID 作为访问令牌
	user.Profile.AccessToken = uuid.New().String()
	user.Profile.AccessToken = strings.Replace(user.Profile.AccessToken, "-", "", -1)

	// 检查是否存在重复的令牌
	if !model.IsCanGenerateAccessToken(user.Profile.AccessToken) {
		common.SendFailureJSONResponse(c, "请重试，系统生成的 UUID 竟然重复了！")
		return
	}

	// 更新用户信息
	if err := user.Update(false, true); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 返回生成令牌成功的响应
	common.SendSuccessJSONResponse(c, "生成成功", user.Profile.AccessToken)
}
