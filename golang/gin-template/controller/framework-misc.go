package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"zhongjyuan/gin-template/common"
	"zhongjyuan/gin-template/model"

	"github.com/gin-gonic/gin"
)

// GetStatus 函数用于获取系统状态信息并返回 JSON 响应。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，用于处理 HTTP 请求和响应。
//
// 输出参数：
//   - 无。
func GetStatus(c *gin.Context) {
	// 构建系统状态信息的 JSON 响应
	statusData := gin.H{
		"success": true,
		"message": "",
		"data": gin.H{
			"version":            common.Version,
			"start_time":         common.StartTime,
			"email_verification": common.EmailVerificationEnabled,
			"github_oauth":       common.GitHubOAuthEnabled,
			"github_client_id":   common.GitHubClientId,
			"system_name":        common.SystemName,
			"home_page_link":     common.HomePageLink,
			"footer_html":        common.Footer,
			"wechat_qrcode":      common.WeChatAccountQRCodeImageURL,
			"wechat_login":       common.WeChatAuthEnabled,
			"server_address":     common.ServerAddress,
			"turnstile_check":    common.TurnstileCheckEnabled,
			"turnstile_site_key": common.TurnstileSiteKey,
		},
	}

	// 返回 JSON 响应
	c.JSON(http.StatusOK, statusData)
}

// GetNotice 函数用于获取通知信息。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，用于处理 HTTP 请求和响应。
//
// 输出参数：
//   - 无。
func GetNotice(c *gin.Context) {
	// 加读锁以保证并发安全
	common.OptionMapRWMutex.RLock()
	defer common.OptionMapRWMutex.RUnlock()

	// 返回通知信息
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data":    common.OptionMap["Notice"],
	})
}

// GetAbout 函数用于获取关于信息。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，用于处理 HTTP 请求和响应。
//
// 输出参数：
//   - 无。
func GetAbout(c *gin.Context) {
	// 加读锁以保证并发安全
	common.OptionMapRWMutex.RLock()
	defer common.OptionMapRWMutex.RUnlock()

	// 返回关于信息
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data":    common.OptionMap["About"],
	})
}

// SendEmailVerification 函数用于发送电子邮件验证。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，用于处理 HTTP 请求和响应。
//
// 输出参数：
//   - 无。
func SendEmailVerification(c *gin.Context) {
	// 获取电子邮件地址
	email := c.Query("email")

	// 验证电子邮件地址是否有效
	if err := common.Validate.Var(email, "required,email"); err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "无效的参数",
		})
		return
	}

	// 检查电子邮件地址是否已被占用
	if model.IsEmailAlreadyTaken(email) {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "邮箱地址已被占用",
		})
		return
	}

	// 生成验证码
	code := common.GenerateVerificationCode(6)

	// 注册验证码
	common.RegisterVerificationCodeWithKey(email, code, common.EmailVerificationPurpose)

	// 构建邮件主题和内容
	subject := fmt.Sprintf("%s邮箱验证邮件", common.SystemName)
	content := fmt.Sprintf("<p>您好，你正在进行%s邮箱验证。</p>"+
		"<p>您的验证码为: <strong>%s</strong></p>"+
		"<p>验证码 %d 分钟内有效，如果不是本人操作，请忽略。</p>", common.SystemName, code, common.VerificationValidMinutes)

	// 发送邮件
	err := common.SendEmail(subject, email, content)
	if err != nil {
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

// SendPasswordResetEmail 函数用于发送密码重置邮件。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，用于处理 HTTP 请求和响应。
//
// 输出参数：
//   - 无。
func SendPasswordResetEmail(c *gin.Context) {
	// 获取电子邮箱地址
	email := c.Query("email")

	// 验证邮箱地址是否有效
	if err := common.Validate.Var(email, "required,email"); err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "无效的参数",
		})
		return
	}

	// 检查邮箱地址是否已注册
	if !model.IsEmailAlreadyTaken(email) {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "该邮箱地址未注册",
		})
		return
	}

	// 生成验证码并注册到验证列表中
	code := common.GenerateVerificationCode(0)
	common.RegisterVerificationCodeWithKey(email, code, common.PasswordResetPurpose)

	// 构建重置链接
	link := fmt.Sprintf("%s/user/reset?email=%s&token=%s", common.ServerAddress, email, code)

	// 构建邮件主题和内容
	subject := fmt.Sprintf("%s密码重置", common.SystemName)
	content := fmt.Sprintf("<p>您好，你正在进行%s密码重置。</p>"+
		"<p>点击<a href='%s'>此处</a>进行密码重置。</p>"+
		"<p>重置链接 %d 分钟内有效，如果不是本人操作，请忽略。</p>", common.SystemName, link, common.VerificationValidMinutes)

	// 发送邮件
	err := common.SendEmail(subject, email, content)
	if err != nil {
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

// PasswordResetRequest 结构体用于表示密码重置请求，包括电子邮箱和令牌。
type PasswordResetRequest struct {
	Email string `json:"email"` // 用户电子邮箱
	Token string `json:"token"` // 重置令牌
}

// ResetPassword 函数用于重置用户密码。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，用于处理 HTTP 请求和响应。
//
// 输出参数：
//   - 无。
func ResetPassword(c *gin.Context) {
	// 解析 JSON 请求体
	var req PasswordResetRequest
	err := json.NewDecoder(c.Request.Body).Decode(&req)
	if err != nil {
		return
	}

	// 检查参数是否有效
	if req.Email == "" || req.Token == "" {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "无效的参数",
		})
		return
	}

	// 验证重置链接
	if !common.VerifyCodeWithKey(req.Email, req.Token, common.PasswordResetPurpose) {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "重置链接非法或已过期",
		})
		return
	}

	// 生成新密码
	password := common.GenerateVerificationCode(12)

	// 重置用户密码
	err = model.ResetUserPasswordByEmail(req.Email, password)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	// 删除验证码
	common.DeleteKey(req.Email, common.PasswordResetPurpose)

	// 返回成功响应
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data":    password,
	})
}
