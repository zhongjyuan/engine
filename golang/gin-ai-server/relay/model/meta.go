package relaymodel

// 用于存储 AI 中继的元数据信息。
type AIRelayMeta struct {
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
