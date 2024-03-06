package controller

import (
	"strconv"
	"zhongjyuan/gin-one-api/common"
	"zhongjyuan/gin-one-api/model"

	"github.com/gin-gonic/gin"
)

func AddRedemption(c *gin.Context) {
	redemption := model.RedemptionEntity{}
	err := c.ShouldBindJSON(&redemption)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	if len(redemption.Name) == 0 || len(redemption.Name) > 20 {
		common.SendFailureJSONResponse(c, "兑换码名称长度必须在1-20之间")
		return
	}

	if redemption.Count <= 0 {
		common.SendFailureJSONResponse(c, "兑换码个数必须大于0")
		return
	}

	if redemption.Count > 100 {
		common.SendFailureJSONResponse(c, "一次兑换码批量生成的个数不能大于 100")
		return
	}

	var keys []string
	for i := 0; i < redemption.Count; i++ {
		key := common.GetUUID()
		cleanRedemption := model.RedemptionEntity{
			UserId:     c.GetInt("id"),
			Key:        key,
			Name:       redemption.Name,
			Quota:      redemption.Quota,
			CreateTime: common.GetTimestamp(),
		}

		err = cleanRedemption.Insert()
		if err != nil {
			common.SendFailureJSONResponse(c, err.Error())
			return
		}
		keys = append(keys, key)
	}

	common.SendSuccessJSONResponse(c, "新增成功", keys)
}

func DeleteRedemption(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	err := model.DeleteRedemptionByID(id)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "删除成功", nil)
}

func UpdateRedemption(c *gin.Context) {
	withStatus := c.Query("withStatus")

	redemption := model.RedemptionEntity{}
	err := c.ShouldBindJSON(&redemption)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}
	cleanRedemption, err := model.GetRedemptionByID(redemption.Id)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	if withStatus != "" {
		cleanRedemption.Status = redemption.Status
	} else {
		// If you add more fields, please also update redemption.Update()
		cleanRedemption.Name = redemption.Name
		cleanRedemption.Quota = redemption.Quota
	}

	err = cleanRedemption.Update()
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "更新成功", cleanRedemption)
}

func GetRedemption(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	redemption, err := model.GetRedemptionByID(id)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "获取成功", redemption)
}

func GetAllRedemptions(c *gin.Context) {
	p, _ := strconv.Atoi(c.Query("p"))
	if p < 0 {
		p = 0
	}

	redemptions, err := model.GetPageRedemptions(p*common.ItemsPerPage, common.ItemsPerPage)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "获取成功", redemptions)
}

func SearchRedemptions(c *gin.Context) {
	keyword := c.Query("keyword")

	redemptions, err := model.SearchRedemptions(keyword)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "获取成功", redemptions)
}
