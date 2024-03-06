package controller

import (
	"zhongjyuan/gin-one-api/common"

	"github.com/gin-gonic/gin"
)

// GetHomePageContent 用于获取首页内容。
//
// 输入参数：
//   - c: gin 上下文对象。
//
// 输出参数：
//   - 无。
func GetHomePageContent(c *gin.Context) {
	// 读取共享资源前加读锁
	common.OptionMapRWMutex.RLock()
	defer common.OptionMapRWMutex.RUnlock()

	// 返回成功响应，包含首页内容
	common.SendSuccessJSONResponse(c, "获取成功", common.OptionMap["HomePageContent"])
}

func GetAllGroups(c *gin.Context) {
	groupNames := make([]string, 0)
	for groupName := range common.GroupRatio {
		groupNames = append(groupNames, groupName)
	}

	common.SendSuccessJSONResponse(c, "获取成功", groupNames)
}
