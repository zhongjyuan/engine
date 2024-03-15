package monitor

import (
	"fmt"
	"zhongjyuan/gin-ai-server/common"
	"zhongjyuan/gin-ai-server/model"
)

// DisableChannel disable & notify
func DisableChannel(channelId int, channelName string, reason string) {
	model.UpdateChannelStatusByID(channelId, common.ChannelStatusAutoDisabled)
	common.SysLog(fmt.Sprintf("channel #%d has been disabled: %s", channelId, reason))
	subject := fmt.Sprintf("通道「%s」（#%d）已被禁用", channelName, channelId)
	content := fmt.Sprintf("通道「%s」（#%d）已被禁用，原因：%s", channelName, channelId, reason)
	common.Notify(common.ByAll, subject, content, content)
}

func MetricDisableChannel(channelId int, successRate float64) {
	model.UpdateChannelStatusByID(channelId, common.ChannelStatusAutoDisabled)
	common.SysLog(fmt.Sprintf("channel #%d has been disabled due to low success rate: %.2f", channelId, successRate*100))
	subject := fmt.Sprintf("通道 #%d 已被禁用", channelId)
	content := fmt.Sprintf("该渠道在最近 %d 次调用中成功率为 %.2f%%，低于阈值 %.2f%%，因此被系统自动禁用。",
		common.MetricQueueSize, successRate*100, common.MetricSuccessRateThreshold*100)
	common.Notify(common.ByAll, subject, content, content)
}

// EnableChannel enable & notify
func EnableChannel(channelId int, channelName string) {
	model.UpdateChannelStatusByID(channelId, common.ChannelStatusEnabled)
	common.SysLog(fmt.Sprintf("channel #%d has been enabled", channelId))
	subject := fmt.Sprintf("通道「%s」（#%d）已被启用", channelName, channelId)
	content := fmt.Sprintf("通道「%s」（#%d）已被启用", channelName, channelId)
	common.Notify(common.ByAll, subject, content, content)
}
