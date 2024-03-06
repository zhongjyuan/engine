package controller

import (
	"encoding/json"
	"net/http"
	"strings"
	"zhongjyuan/gin-template/common"
	"zhongjyuan/gin-template/model"

	"github.com/gin-gonic/gin"
)

// UpdateOption 函数用于更新选项信息。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，用于处理 HTTP 请求和响应。
//
// 输出参数：
//   - 无。
func UpdateOption(c *gin.Context) {
	var option model.OptionEntity // 创建选项对象

	// 解析请求体中的 JSON 数据到选项对象
	if err := json.NewDecoder(c.Request.Body).Decode(&option); err != nil {
		common.SendJSONResponse(c, http.StatusBadRequest, false, "更新失败,无效的参数！")
		return
	}

	// 根据选项键名执行相应的操作
	switch option.Key {
	case "GitHubOAuthEnabled":
		if option.Value == "true" && common.GitHubClientId == "" { // 如果启用 GitHub OAuth 但未设置相关信息，则返回错误响应
			common.SendFailureJSONResponse(c, "无法启用 GitHub OAuth，请先填入 GitHub Client ID 以及 GitHub Client Secret！")
			return
		}
	case "WeChatAuthEnabled":
		if option.Value == "true" && common.WeChatServerAddress == "" { // 如果启用微信登录但未设置相关信息，则返回错误响应
			common.SendFailureJSONResponse(c, "无法启用微信登录，请先填入微信登录相关配置信息！")
			return
		}
	case "TurnstileCheckEnabled":
		if option.Value == "true" && common.TurnstileSiteKey == "" { // 如果启用 Turnstile 校验但未设置相关信息，则返回错误响应
			common.SendFailureJSONResponse(c, "无法启用 Turnstile 校验，请先填入 Turnstile 校验相关配置信息！")
			return
		}
	}

	// 更新选项信息并处理可能的错误
	if err := model.UpdateOptionMap(option.Key, option.Value); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "更新成功", option)
}

// GetAllOptions 函数用于获取选项信息。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，用于处理 HTTP 请求和响应。
//
// 输出参数：
//   - 无。
func GetAllOptions(c *gin.Context) {
	var options []*model.OptionEntity // 创建选项列表

	common.OptionMapRWMutex.Lock() // 加写锁以保证并发安全

	// 遍历选项映射，将非敏感选项添加到选项列表中
	for k, v := range common.OptionMap {
		// 检查键名是否包含敏感信息，如 Token 或 Secret
		if strings.Contains(k, "Token") || strings.Contains(k, "Secret") {
			continue // 跳过敏感信息
		}

		// 添加非敏感选项到选项列表中
		options = append(options, &model.OptionEntity{
			Key:   k,
			Value: common.Interface2String(v),
		})
	}
	common.OptionMapRWMutex.Unlock() // 函数执行完毕后释放读锁

	// 返回成功响应给客户端，携带获取到的选项列表
	common.SendSuccessJSONResponse(c, "获取成功.", options)
}
