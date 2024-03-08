package controller

import (
	"strconv"
	"time"
	"zhongjyuan/gin-ai-server/common"
	"zhongjyuan/gin-ai-server/model"

	"github.com/gin-gonic/gin"
)

func GetPageLogs(c *gin.Context) {
	p, _ := strconv.Atoi(c.Query("p"))
	if p < 0 {
		p = 0
	}

	logType, _ := strconv.Atoi(c.Query("type"))
	startTimestamp, _ := strconv.ParseInt(c.Query("startTimestamp"), 10, 64)
	endTimestamp, _ := strconv.ParseInt(c.Query("endTimestamp"), 10, 64)
	userName := c.Query("userName")
	tokenName := c.Query("tokenName")
	modelName := c.Query("modelName")
	channelId, _ := strconv.Atoi(c.Query("channelId"))
	logs, err := model.GetPageLogs(logType, startTimestamp, endTimestamp, modelName, userName, tokenName, p*common.ItemsPerPage, common.ItemsPerPage, channelId)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "查询成功", logs)
}

func GetPageUserLogs(c *gin.Context) {
	p, _ := strconv.Atoi(c.Query("p"))
	if p < 0 {
		p = 0
	}

	userId := c.GetInt("id")
	logType, _ := strconv.Atoi(c.Query("type"))
	startTimestamp, _ := strconv.ParseInt(c.Query("startTimestamp"), 10, 64)
	endTimestamp, _ := strconv.ParseInt(c.Query("endTimestamp"), 10, 64)
	tokenName := c.Query("tokenName")
	modelName := c.Query("modelName")
	logs, err := model.GetPageUserLogs(userId, logType, startTimestamp, endTimestamp, modelName, tokenName, p*common.ItemsPerPage, common.ItemsPerPage)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "查询成功", logs)
}

func SearchLogs(c *gin.Context) {
	keyword := c.Query("keyword")
	logs, err := model.SearchLogs(keyword)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "检索成功", logs)
}

func SearchUserLogs(c *gin.Context) {
	keyword := c.Query("keyword")
	userId := c.GetInt("id")

	logs, err := model.SearchUserLogs(userId, keyword)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "检索成功", logs)
}

func GetLogsStat(c *gin.Context) {
	logType, _ := strconv.Atoi(c.Query("type"))
	startTimestamp, _ := strconv.ParseInt(c.Query("startTimestamp"), 10, 64)
	endTimestamp, _ := strconv.ParseInt(c.Query("endTimestamp"), 10, 64)
	tokenName := c.Query("tokenName")
	userName := c.Query("userName")
	modelName := c.Query("modelName")
	channelId, _ := strconv.Atoi(c.Query("channelId"))

	quotaNum := model.SumUsedQuota(logType, startTimestamp, endTimestamp, modelName, userName, tokenName, channelId)

	common.SendSuccessJSONResponse(c, "统计成功", gin.H{"quota": quotaNum})
}

func GetLogsSelfStat(c *gin.Context) {
	userName := c.GetString("userName")
	logType, _ := strconv.Atoi(c.Query("type"))
	startTimestamp, _ := strconv.ParseInt(c.Query("startTimestamp"), 10, 64)
	endTimestamp, _ := strconv.ParseInt(c.Query("endTimestamp"), 10, 64)
	tokenName := c.Query("tokenName")
	modelName := c.Query("modelName")
	channelId, _ := strconv.Atoi(c.Query("channelId"))

	quotaNum := model.SumUsedQuota(logType, startTimestamp, endTimestamp, modelName, userName, tokenName, channelId)

	common.SendSuccessJSONResponse(c, "统计成功", gin.H{"quota": quotaNum})
}

func DeleteHistoryLogs(c *gin.Context) {
	targetTimestamp, _ := strconv.ParseInt(c.Query("targetTimestamp"), 10, 64)
	if targetTimestamp == 0 {
		common.SendFailureJSONResponse(c, "target timestamp is required")
		return
	}

	count, err := model.DeleteHistoryLog(targetTimestamp)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "删除成功", count)
}

func GetUserDashboard(c *gin.Context) {
	id := c.GetInt("id")
	now := time.Now()
	startOfDay := now.Truncate(24*time.Hour).AddDate(0, 0, -6).Unix()
	endOfDay := now.Truncate(24 * time.Hour).Add(24*time.Hour - time.Second).Unix()

	dashboards, err := model.SearchLogsByDayAndModel(id, int(startOfDay), int(endOfDay))
	if err != nil {
		common.SendFailureJSONResponse(c, "无法获取统计信息")
		return
	}

	common.SendSuccessJSONResponse(c, "获取成功.", dashboards)
}
