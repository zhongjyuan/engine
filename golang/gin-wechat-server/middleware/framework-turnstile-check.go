package middleware

import (
	"encoding/json"
	"net/http"
	"net/url"
	"zhongjyuan/gin-wechat-server/common"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// turnstileCheckResponse 结构体用于表示闸机检查的响应。
//
// 输出参数：
//   - Success bool: 表示检查是否成功的布尔值。
type turnstileCheckResponse struct {
	Success bool `json:"success"`
}

// TurnstileCheck 返回一个 Gin 中间件函数，用于进行闸机检查。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func TurnstileCheck() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 检查是否启用闸机检查
		if common.TurnstileCheckEnabled {
			// 从会话中获取闸机检查标志
			session := sessions.Default(c)
			turnstileChecked := session.Get("turnstile")

			// 如果已经进行过闸机检查，继续下一个中间件
			if turnstileChecked != nil {
				c.Next()
				return
			}

			// 从请求参数中获取闸机响应
			response := c.Query("turnstile")

			// 如果响应为空，返回错误响应
			if response == "" {
				c.JSON(http.StatusOK, gin.H{
					"success": false,
					"message": "Turnstile token 为空",
				})
				c.Abort()
				return
			}

			// 发起 HTTP POST 请求进行闸机检查
			rawRes, err := http.PostForm("https://challenges.cloudflare.com/turnstile/v0/siteverify", url.Values{
				"secret":   {common.TurnstileSecretKey},
				"response": {response},
				"remoteip": {c.ClientIP()},
			})

			// 处理请求错误
			if err != nil {
				common.SysError(err.Error())
				c.JSON(http.StatusOK, gin.H{
					"success": false,
					"message": err.Error(),
				})
				c.Abort()
				return
			}

			defer rawRes.Body.Close()

			// 解析闸机检查响应
			var res turnstileCheckResponse
			err = json.NewDecoder(rawRes.Body).Decode(&res)

			// 处理解析错误
			if err != nil {
				common.SysError(err.Error())
				c.JSON(http.StatusOK, gin.H{
					"success": false,
					"message": err.Error(),
				})
				c.Abort()
				return
			}

			// 如果检查不成功，返回错误响应
			if !res.Success {
				c.JSON(http.StatusOK, gin.H{
					"success": false,
					"message": "Turnstile 校验失败，请刷新重试！",
				})
				c.Abort()
				return
			}

			// 设置会话中的闸机检查标志为 true，表示已经进行过检查
			session.Set("turnstile", true)
			err = session.Save()

			// 处理会话保存错误
			if err != nil {
				c.JSON(http.StatusOK, gin.H{
					"message": "无法保存会话信息，请重试",
					"success": false,
				})
				return
			}
		}

		// 继续下一个中间件
		c.Next()
	}
}
