package relaymodel

// AISubscribeResponse 用于表示 OpenAI 的订阅信息响应结构体。
type AISubscribeResponse struct {
	Object             string  `json:"object"`                // 对象类型
	HasPaymentMethod   bool    `json:"has_payment_method"`    // 是否有支付方式
	SoftLimitUSD       float64 `json:"soft_limit_usd"`        // 软限额（美元）
	HardLimitUSD       float64 `json:"hard_limit_usd"`        // 硬限额（美元）
	SystemHardLimitUSD float64 `json:"system_hard_limit_usd"` // 系统硬限额（美元）
	AccessUntil        int64   `json:"access_until"`          // 访问截止时间
}

// AIDailyCostItem 表示每日消费明细结构体。
type AIDailyCostItem struct {
	Name string  `json:"name"` // 明细名称
	Cost float64 `json:"cost"` // 消费金额
}

// AIDailyCostUsage 用于表示 OpenAI 的每日使用成本结构体。
type AIDailyCostUsage struct {
	Timestamp float64           `json:"timestamp"` // 时间戳
	LineItems []AIDailyCostItem // 每日消费明细列表
}

// AICreditGrants 用于表示 OpenAI 的信用额度授予结构体。
type AICreditGrants struct {
	Object         string  `json:"object"`          // 对象类型
	TotalGranted   float64 `json:"total_granted"`   // 总共授予的额度
	TotalUsed      float64 `json:"total_used"`      // 已使用的额度
	TotalAvailable float64 `json:"total_available"` // 可用的额度
}

// AIUsageResponse 用于表示 OpenAI 的使用情况响应结构体。
type AIUsageResponse struct {
	Object     string  `json:"object"`      // 对象类型
	TotalUsage float64 `json:"total_usage"` // 总使用量（单位：0.01 美元）
}

// AISBUsageData 用于表示 OpenAI 的信用额度使用情况数据结构体。
type AISBUsageData struct {
	Credit string `json:"credit"` // 信用额度余额
}

// AISBUsageResponse 用于表示 OpenAI 的信用额度使用情况响应结构体。
type AISBUsageResponse struct {
	Msg  string         `json:"msg"`  // 消息
	Data *AISBUsageData `json:"data"` // 数据
}

// AIGPTAPIUsageResponse 用于表示 API 使用情况响应结构体。
type AIGPTAPIUsageResponse struct {
	Object         string  `json:"object"`          // 对象类型
	TotalGranted   float64 `json:"total_granted"`   // 总授予量
	TotalUsed      float64 `json:"total_used"`      // 总使用量
	TotalRemaining float64 `json:"total_remaining"` // 剩余量
}

// AIGPTAPGCUsageResponse 用于表示 APGC 使用情况响应结构体。
type AIGPTAPGCUsageResponse struct {
	Object         string  `json:"object"`          // 对象类型
	TotalAvailable float64 `json:"total_available"` // 总可用量
	TotalGranted   float64 `json:"total_granted"`   // 总授予量
	TotalUsed      float64 `json:"total_used"`      // 总使用量
}

// AIProxyUserOverviewResponse 用于表示 AI 代理用户概览响应结构体。
type AIProxyUserOverviewResponse struct {
	Success   bool   `json:"success"`    // 是否成功
	Message   string `json:"message"`    // 消息
	ErrorCode int    `json:"error_code"` // 错误码
	Data      struct {
		TotalPoints float64 `json:"totalPoints"` // 总积分
	} `json:"data"` // 数据
}
