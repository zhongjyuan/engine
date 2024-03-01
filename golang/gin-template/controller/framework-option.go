package controller

import (
	"encoding/json"
	"net/http"
	"strings"
	"zhongjyuan/gin-template/common"
	"zhongjyuan/gin-template/model"

	"github.com/gin-gonic/gin"
)

// GetOptions 函数用于获取选项信息。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，用于处理 HTTP 请求和响应。
//
// 输出参数：
//   - 无。
func GetOptions(c *gin.Context) {
	var options []*model.Option    // 创建选项列表
	common.OptionMapRWMutex.Lock() // 加写锁以保证并发安全
	for k, v := range common.OptionMap {
		// 检查键名是否包含敏感信息，如 Token 或 Secret
		if strings.Contains(k, "Token") || strings.Contains(k, "Secret") {
			continue // 跳过敏感信息
		}
		// 添加非敏感选项到选项列表中
		options = append(options, &model.Option{
			Key:   k,
			Value: common.Interface2String(v),
		})
	}
	common.OptionMapRWMutex.Unlock() // 解锁

	// 返回选项列表作为 JSON 格式的响应
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data":    options,
	})
}

// UpdateOption 函数用于更新选项信息。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，用于处理 HTTP 请求和响应。
//
// 输出参数：
//   - 无。
func UpdateOption(c *gin.Context) {
	var option model.Option // 创建选项对象
	// 解析请求体中的 JSON 数据到选项对象
	err := json.NewDecoder(c.Request.Body).Decode(&option)
	if err != nil {
		// 返回无效参数的错误响应
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "无效的参数",
		})
		return
	}

	// 根据选项键名执行相应的操作
	switch option.Key {
	case "GitHubOAuthEnabled":
		if option.Value == "true" && common.GitHubClientId == "" {
			// 如果启用 GitHub OAuth 但未设置相关信息，则返回错误响应
			c.JSON(http.StatusOK, gin.H{
				"success": false,
				"message": "无法启用 GitHub OAuth，请先填入 GitHub Client ID 以及 GitHub Client Secret！",
			})
			return
		}
	case "WeChatAuthEnabled":
		if option.Value == "true" && common.WeChatServerAddress == "" {
			// 如果启用微信登录但未设置相关信息，则返回错误响应
			c.JSON(http.StatusOK, gin.H{
				"success": false,
				"message": "无法启用微信登录，请先填入微信登录相关配置信息！",
			})
			return
		}
	case "TurnstileCheckEnabled":
		if option.Value == "true" && common.TurnstileSiteKey == "" {
			// 如果启用 Turnstile 校验但未设置相关信息，则返回错误响应
			c.JSON(http.StatusOK, gin.H{
				"success": false,
				"message": "无法启用 Turnstile 校验，请先填入 Turnstile 校验相关配置信息！",
			})
			return
		}
	}

	// 更新选项信息并处理可能的错误
	err = model.UpdateOption(option.Key, option.Value)
	if err != nil {
		// 返回更新失败的错误响应
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	// 返回成功响应
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
	})
}
