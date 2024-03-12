package controller

import (
	"strconv"
	"zhongjyuan/gin-message-server/channel"
	"zhongjyuan/gin-message-server/common"
	"zhongjyuan/gin-message-server/model"

	"github.com/gin-gonic/gin"
)

func AddChannel(c *gin.Context) {
	channelData := model.ChannelEntity{}
	if err := c.ShouldBindJSON(&channelData); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	if len(channelData.Name) == 0 || len(channelData.Name) > 20 {
		common.SendFailureJSONResponse(c, "通道名称长度必须在1-20之间")
		return
	}

	if channelData.Name == "email" {
		common.SendFailureJSONResponse(c, "不能使用系统保留名称")
		return
	}

	channelEntity := model.ChannelEntity{
		Type:        channelData.Type,
		Name:        channelData.Name,
		AppId:       channelData.AppId,
		Secret:      channelData.Secret,
		AccountId:   channelData.AccountId,
		URL:         channelData.URL,
		Other:       channelData.Other,
		Status:      common.ChannelStatusEnabled,
		UserId:      c.GetInt("id"),
		Description: channelData.Description,
		CreateTime:  common.GetTimestamp(),
	}

	if err := channelEntity.Insert(); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	channel.TokenStoreAddChannel(&channelEntity)

	common.SendSuccessJSONResponse(c, "新增成功", nil)
}

func DeleteChannel(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	userId := c.GetInt("id")
	channelEntity, err := model.DeleteChannelByID(id, userId)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	channel.TokenStoreRemoveChannel(channelEntity)

	common.SendSuccessJSONResponse(c, "删除成功", nil)
}

func UpdateChannel(c *gin.Context) {
	userId := c.GetInt("id")
	withStatus := c.Query("withStatus")

	channelData := model.ChannelEntity{}
	if err := c.ShouldBindJSON(&channelData); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	originChannelEntity, err := model.GetChannelByID(channelData.Id, userId, true)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	channelEntity := *originChannelEntity
	if withStatus != "" {
		channelEntity.Status = channelData.Status
	} else {
		// If you add more fields, please also update channel_.Update()
		channelEntity.Type = channelData.Type
		channelEntity.Name = channelData.Name
		channelEntity.Description = channelData.Description
		if channelData.Secret != "" {
			channelEntity.Secret = channelData.Secret
		}
		channelEntity.AppId = channelData.AppId
		channelEntity.AccountId = channelData.AccountId
		channelEntity.URL = channelData.URL
		channelEntity.Other = channelData.Other
	}

	if err := channelEntity.Update(); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	channel.TokenStoreUpdateChannel(&channelEntity, originChannelEntity)

	common.SendSuccessJSONResponse(c, "更新成功", channelEntity)
}

func GetChannel(c *gin.Context) {
	userId := c.GetInt("id")

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	channelEntity, err := model.GetChannelByID(id, userId, false)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "获取成功", channelEntity)
}

func GetAllChannels(c *gin.Context) {
	if c.Query("brief") != "" {
		GetBriefChannels(c)
		return
	}

	userId := c.GetInt("id")
	p, _ := strconv.Atoi(c.Query("p"))
	if p < 0 {
		p = 0
	}

	channels, err := model.GetUserPageChannels(userId, p*common.ItemsPerPage, common.ItemsPerPage)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "获取成功", channels)
}

func GetBriefChannels(c *gin.Context) {
	userId := c.GetInt("id")

	channels, err := model.GetUserPageBriefChannels(userId)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "获取成功", channels)
}

func SearchChannels(c *gin.Context) {
	userId := c.GetInt("id")
	keyword := c.Query("keyword")

	channels, err := model.SearchChannels(userId, keyword)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "获取成功", channels)
}
