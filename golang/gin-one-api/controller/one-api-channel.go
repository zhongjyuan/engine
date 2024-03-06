package controller

import (
	"strconv"
	"strings"
	"zhongjyuan/gin-one-api/common"
	"zhongjyuan/gin-one-api/model"

	"github.com/gin-gonic/gin"
)

func AddChannel(c *gin.Context) {
	channel := model.ChannelEntity{}
	err := c.ShouldBindJSON(&channel)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	channel.CreateTime = common.GetTimestamp()
	keys := strings.Split(channel.Key, "\n")
	channels := make([]model.ChannelEntity, 0, len(keys))
	for _, key := range keys {
		if key == "" {
			continue
		}
		localChannel := channel
		localChannel.Key = key
		channels = append(channels, localChannel)
	}

	err = model.BatchInsertChannels(channels)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "新增成功", nil)
}

func DeleteChannel(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	channel := model.ChannelEntity{Id: id}
	err := channel.Delete()
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "删除成功", nil)
}

func DeleteDisabledChannel(c *gin.Context) {
	rows, err := model.DeleteDisabledChannel()
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "删除成功", rows)
}

func UpdateChannel(c *gin.Context) {
	channel := model.ChannelEntity{}
	err := c.ShouldBindJSON(&channel)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	err = channel.Update()
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "更新成功", channel)
}

func GetChannel(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	channel, err := model.GetChannelByID(id, false)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "获取成功", channel)
}

func GetPageChannels(c *gin.Context) {
	p, _ := strconv.Atoi(c.Query("p"))
	if p < 0 {
		p = 0
	}

	channels, err := model.GetPageChannels(p*common.ItemsPerPage, common.ItemsPerPage, false)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "查询成功", channels)
}

func SearchChannels(c *gin.Context) {
	keyword := c.Query("keyword")

	channels, err := model.SearchChannels(keyword)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "查询成功", channels)
}
