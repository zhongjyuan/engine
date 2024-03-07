package middleware

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"zhongjyuan/gin-one-api/common"
	"zhongjyuan/gin-one-api/model"

	"github.com/gin-gonic/gin"
)

type ModelRequest struct {
	Model string `json:"model"`
}

// respondWithError 给定消息，返回带有错误信息的响应并中止请求处理。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象。
//   - statusCode int: HTTP 状态码。
//   - message string: 错误消息内容。
//
// 输出参数：
//   - 无。
func respondWithError(c *gin.Context, statusCode int, message string) {
	// 返回带有错误消息的 JSON 响应
	c.JSON(statusCode, gin.H{
		"error": gin.H{
			"message": common.MessageWithRequestId(message, c.GetString(common.RequestIdKey)),
			"type":    "one_api_error",
		},
	})
	// 中止请求处理
	c.Abort()
	// 记录错误日志
	common.Error(c.Request.Context(), message)
}

// getModelRequest 用于获取模型请求参数。
func getModelRequest(c *gin.Context) ModelRequest {
	var modelRequest ModelRequest
	if err := common.UnmarshalBodyReusable(c, &modelRequest); err != nil {
		respondWithError(c, http.StatusBadRequest, "无效的请求")
	}
	return modelRequest
}

// setDefaultModel 用于设置默认模型。
func setDefaultModel(c *gin.Context, modelRequest ModelRequest) string {
	if modelRequest.Model == "" {
		switch {
		case strings.HasPrefix(c.Request.URL.Path, "/v1/moderations"):
			modelRequest.Model = "text-moderation-stable"
		case strings.HasSuffix(c.Request.URL.Path, "embeddings"):
			modelRequest.Model = c.Param("model")
		case strings.HasPrefix(c.Request.URL.Path, "/v1/images/generations"):
			modelRequest.Model = "dall-e-2"
		case strings.HasPrefix(c.Request.URL.Path, "/v1/audio/transcriptions"), strings.HasPrefix(c.Request.URL.Path, "/v1/audio/translations"):
			modelRequest.Model = "whisper-1"
		}
	}
	return modelRequest.Model
}

// selectRandomChannel 用于选择随机渠道。
func selectRandomChannel(c *gin.Context, userGroup string, modelName string) *model.ChannelEntity {
	channel, err := model.GetRandomChannelWithCache(userGroup, modelName)
	if err != nil {
		return nil
	}
	return channel
}

// Distribute 用于根据用户信息分发请求到不同的渠道处理。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - func(c *gin.Context): 处理请求的函数。
func Distribute() func(c *gin.Context) {
	return func(c *gin.Context) {
		// 获取用户ID和用户组
		userId := c.GetInt("id")
		userGroup, _ := model.GetUserGroupWithCache(userId)
		c.Set("group", userGroup)

		// 定义变量
		var requestModel string
		var channel *model.ChannelEntity

		// 检查是否有特定渠道ID
		if channelId, ok := c.Get("specific_channel_id"); ok {
			// 处理特定渠道ID
			id, err := strconv.Atoi(channelId.(string))
			if err != nil {
				respondWithError(c, http.StatusBadRequest, "无效的渠道 Id")
				return
			}

			channel, err = model.GetChannelByID(id, true)
			if err != nil {
				respondWithError(c, http.StatusBadRequest, "无效的渠道 Id")
				return
			}

			if channel.Status != common.ChannelStatusEnabled {
				respondWithError(c, http.StatusForbidden, "该渠道已被禁用")
				return
			}
		} else {
			// 处理选择渠道
			modelRequest := getModelRequest(c)
			requestModel = setDefaultModel(c, modelRequest)
			channel = selectRandomChannel(c, userGroup, modelRequest.Model)
			if channel == nil {
				message := fmt.Sprintf("当前分组 %s 下对于模型 %s 无可用渠道", userGroup, modelRequest.Model)
				common.SysError(fmt.Sprintf("渠道不存在：%d", channel.Id))
				respondWithError(c, http.StatusServiceUnavailable, message)
				return
			}
		}

		// 设置选定渠道上下文并继续处理请求
		SetChannelContext(c, channel, requestModel)
		c.Next()
	}
}

// SetChannelContext 为选定的渠道设置上下文信息。
//
// 输入参数：
//   - c: Gin 上下文对象。
//   - channel: 渠道实体对象。
//   - modelName: 模型名称。
//
// 输出参数：无
func SetChannelContext(c *gin.Context, channel *model.ChannelEntity, modelName string) {
	// 设置渠道相关信息到 Gin 上下文
	contextKeys := map[string]interface{}{
		"channel":       channel.Type,
		"channelId":     channel.Id,
		"channelName":   channel.Name,
		"modelMapping":  channel.GetModelMapping(),
		"originalModel": modelName,
		"baseUrl":       channel.GetBaseURL(),
	}

	// 设置 Authorization 头部信息
	c.Request.Header.Set("Authorization", fmt.Sprintf("Bearer %s", channel.Key))

	// 设置特定渠道类型的配置信息
	channelConfig := map[int]string{
		common.ChannelTypeAzure:          common.ConfigKeyAPIVersion,
		common.ChannelTypeXunfei:         common.ConfigKeyAPIVersion,
		common.ChannelTypeGemini:         common.ConfigKeyAPIVersion,
		common.ChannelTypeAIProxyLibrary: common.ConfigKeyLibraryID,
		common.ChannelTypeAli:            common.ConfigKeyPlugin,
	}

	// 设置特定渠道类型的配置信息到 Gin 上下文
	if configKey, ok := channelConfig[channel.Type]; ok {
		c.Set(configKey, channel.Config)
	}

	// 获取渠道配置信息并设置到 Gin 上下文中
	cfg, _ := channel.GetConfig()
	for k, v := range cfg {
		c.Set(common.ConfigKeyPrefix+k, v)
	}

	// 将所有键值对设置到 Gin 上下文中
	for key, value := range contextKeys {
		c.Set(key, value)
	}
}
