package relayhelper

import (
	"strings"
	"zhongjyuan/gin-ai-server/common"
	relaycommon "zhongjyuan/gin-ai-server/relay/common"
	relaymodel "zhongjyuan/gin-ai-server/relay/model"

	"github.com/gin-gonic/gin"
)

// NewAIRelayMeta 从 Gin 上下文创建并返回一个新的 AIRelayMeta 对象。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象。
//
// 输出参数：
//   - *relaymodel.AIRelayMeta: 包含中继元数据的对象。
func NewAIRelayMeta(c *gin.Context) *relaymodel.AIRelayMeta {
	// 从 Gin 上下文获取各项值
	mode := relaycommon.GetRelayModeByPath(c.Request.URL.Path)                     // 获取中继模式
	channelType := c.GetInt("channel")                                             // 获取渠道类型
	channelID := c.GetInt("channelId")                                             // 获取渠道ID
	tokenID := c.GetInt("tokenId")                                                 // 获取令牌ID
	tokenName := c.GetString("tokenName")                                          // 获取令牌名称
	userID := c.GetInt("id")                                                       // 获取用户ID
	group := c.GetString("group")                                                  // 获取分组名称
	modelMapping := c.GetStringMapString("modelMapping")                           // 获取模型名称的映射表
	baseURL := c.GetString("baseUrl")                                              // 获取基础URL
	apiVersion := c.GetString(common.ConfigKeyAPIVersion)                          // 获取API版本
	apiKey := strings.TrimPrefix(c.Request.Header.Get("Authorization"), "Bearer ") // 获取API密钥
	requestURLPath := c.Request.URL.String()                                       // 获取请求的URL路径

	// 根据渠道类型设置 API 版本和基础 URL
	if channelType == common.ChannelTypeAzure { // 如果渠道类型为 Azure
		apiVersion = GetAzureAPIVersion(c) // 获取 Azure API 版本
	}

	// 如果基础URL为空
	if baseURL == "" {
		baseURL = common.ChannelBaseURLs[channelType] // 使用默认的渠道基础URL
	}

	// 转换渠道类型为 API 类型
	apiType := relaycommon.GetApiTypeByChannelType(channelType)

	// 创建新的中继元数据对象并返回
	return &relaymodel.AIRelayMeta{
		Mode:           mode,
		ChannelType:    channelType,
		ChannelId:      channelID,
		TokenId:        tokenID,
		TokenName:      tokenName,
		UserId:         userID,
		Group:          group,
		ModelMapping:   modelMapping,
		BaseURL:        baseURL,
		APIVersion:     apiVersion,
		APIKey:         apiKey,
		Config:         nil,
		RequestURLPath: requestURLPath,
		APIType:        apiType,
	}
}
