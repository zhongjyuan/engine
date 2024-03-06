package relayHelper

import (
	"strings"
	"zhongjyuan/gin-one-api/common"
	relayCommon "zhongjyuan/gin-one-api/relay/common"

	"github.com/gin-gonic/gin"
)

// RelayMeta 用于存储中继的元数据信息。
type RelayMeta struct {
	Mode            int               // 中继模式
	ChannelType     int               // 渠道类型
	ChannelId       int               // 渠道ID
	TokenId         int               // 令牌ID
	TokenName       string            // 令牌名称
	UserId          int               // 用户ID
	Group           string            // 分组名称
	ModelMapping    map[string]string // 模型名称的映射表
	BaseURL         string            // 基础URL
	APIVersion      string            // API版本
	APIKey          string            // API密钥
	APIType         int               // API类型
	Config          map[string]string // 配置信息
	IsStream        bool              // 是否为流式传输
	OriginModelName string            // 原始模型名称
	ActualModelName string            // 实际模型名称
	RequestURLPath  string            // 请求的URL路径
	PromptTokens    int               // 仅用于DoResponse的提示令牌数量
}

// NewRelayMeta 从 Gin 上下文中创建一个新的中继元数据。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象。
//
// 输出参数：
//   - *RelayMeta: 返回一个包含中继元数据信息的指针。
func NewRelayMeta(c *gin.Context) *RelayMeta {
	// 从 Gin 上下文获取各项值
	mode := relayCommon.Path2RelayMode(c.Request.URL.Path)                         // 获取中继模式
	channelType := c.GetInt("channel")                                             // 获取渠道类型
	channelID := c.GetInt("channel_id")                                            // 获取渠道ID
	tokenID := c.GetInt("token_id")                                                // 获取令牌ID
	tokenName := c.GetString("token_name")                                         // 获取令牌名称
	userID := c.GetInt("id")                                                       // 获取用户ID
	group := c.GetString("group")                                                  // 获取分组名称
	modelMapping := c.GetStringMapString("model_mapping")                          // 获取模型名称的映射表
	baseURL := c.GetString("base_url")                                             // 获取基础URL
	apiVersion := c.GetString(common.ConfigKeyAPIVersion)                          // 获取API版本
	apiKey := strings.TrimPrefix(c.Request.Header.Get("Authorization"), "Bearer ") // 获取API密钥
	requestURLPath := c.Request.URL.String()                                       // 获取请求的URL路径

	// 根据渠道类型设置 API 版本和基础 URL
	if channelType == common.ChannelTypeAzure { // 如果渠道类型为 Azure
		apiVersion = GetAzureAPIVersion(c) // 获取 Azure API 版本
	}
	if baseURL == "" { // 如果基础URL为空
		baseURL = common.ChannelBaseURLs[channelType] // 使用默认的渠道基础URL
	}

	// 转换渠道类型为 API 类型
	apiType := relayCommon.ChannelType2APIType(channelType)

	// 创建新的中继元数据对象并返回
	return &RelayMeta{
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
