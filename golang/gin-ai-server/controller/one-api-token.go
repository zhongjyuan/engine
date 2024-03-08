package controller

import (
	"strconv"
	"zhongjyuan/gin-ai-server/common"
	"zhongjyuan/gin-ai-server/model"

	"github.com/gin-gonic/gin"
)

func AddToken(c *gin.Context) {
	token := model.TokenEntity{}
	err := c.ShouldBindJSON(&token)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	if len(token.Name) > 30 {
		common.SendFailureJSONResponse(c, "令牌名称过长")
		return
	}

	cleanToken := model.TokenEntity{
		UserId:         c.GetInt("id"),
		Name:           token.Name,
		Key:            common.GenerateKey(),
		CreateTime:     common.GetTimestamp(),
		AccesseTime:    common.GetTimestamp(),
		ExpireTime:     token.ExpireTime,
		RemainQuota:    token.RemainQuota,
		UnlimitedQuota: token.UnlimitedQuota,
	}

	err = cleanToken.Insert()
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "增加成功", nil)
}

func DeleteToken(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	userId := c.GetInt("id")

	err := model.DeleteTokenByIdAnUserID(id, userId)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "删除成功", nil)
}

func UpdateToken(c *gin.Context) {
	userId := c.GetInt("id")
	withStatus := c.Query("withStatus")

	token := model.TokenEntity{}
	err := c.ShouldBindJSON(&token)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	if len(token.Name) > 30 {
		common.SendFailureJSONResponse(c, "令牌名称过长")
		return
	}

	cleanToken, err := model.GetTokenByIdAnUserID(token.Id, userId)
	if err != nil {
		common.SendFailureJSONResponse(c, "令牌名称过长")
		return
	}

	if token.Status == common.TokenStatusEnabled {
		if cleanToken.Status == common.TokenStatusExpired && cleanToken.ExpireTime <= common.GetTimestamp() && cleanToken.ExpireTime != -1 {
			common.SendFailureJSONResponse(c, "令牌已过期，无法启用，请先修改令牌过期时间，或者设置为永不过期")
			return
		}

		if cleanToken.Status == common.TokenStatusExhausted && cleanToken.RemainQuota <= 0 && !cleanToken.UnlimitedQuota {
			common.SendFailureJSONResponse(c, "令牌可用额度已用尽，无法启用，请先修改令牌剩余额度，或者设置为无限额度")
			return
		}
	}

	if withStatus != "" {
		cleanToken.Status = token.Status
	} else {
		// If you add more fields, please also update token.Update()
		cleanToken.Name = token.Name
		cleanToken.ExpireTime = token.ExpireTime
		cleanToken.RemainQuota = token.RemainQuota
		cleanToken.UnlimitedQuota = token.UnlimitedQuota
	}

	err = cleanToken.Update()
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "更新成功", cleanToken)
}

func GetToken(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	userId := c.GetInt("id")
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	token, err := model.GetTokenByIdAnUserID(id, userId)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "查询成功", token)
}

func GetTokenStatus(c *gin.Context) {
	tokenId := c.GetInt("tokenId")
	userId := c.GetInt("id")
	token, err := model.GetTokenByIdAnUserID(tokenId, userId)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	expiredAt := token.ExpireTime
	if expiredAt == -1 {
		expiredAt = 0
	}

	common.SendSuccessJSONResponse(c, "查询成功", gin.H{
		"object":          "credit_summary",
		"total_granted":   token.RemainQuota,
		"total_used":      0, // not supported currently
		"total_available": token.RemainQuota,
		"expires_at":      expiredAt * 1000,
	})
}

func GetAllTokens(c *gin.Context) {
	userId := c.GetInt("id")
	p, _ := strconv.Atoi(c.Query("p"))
	if p < 0 {
		p = 0
	}

	tokens, err := model.GetPageUserTokens(userId, p*common.ItemsPerPage, common.ItemsPerPage)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "查询成功", tokens)
}

func SearchTokens(c *gin.Context) {
	userId := c.GetInt("id")
	keyword := c.Query("keyword")

	tokens, err := model.SearchUserTokens(userId, keyword)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "查询成功", tokens)
}
