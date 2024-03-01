package middleware

import (
	"net/http"
	"zhongjyuan/gin-template/common"
	"zhongjyuan/gin-template/model"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// authHelper 是一个辅助函数，用于进行身份验证和权限检查。
//
// 输入参数：
//   - c (*gin.Context): Gin 上下文对象。
//   - minRole (int): 所需的最低角色权限。
//
// 输出参数：
//   - 无。
func authHelper(c *gin.Context, minRole int) {
	// 获取会话
	session := sessions.Default(c)

	// 获取会话中的用户信息
	username := session.Get("username")
	role := session.Get("role")
	id := session.Get("id")
	status := session.Get("status")
	authByToken := false

	// 如果用户名为空，尝试使用 token 进行验证
	if username == nil {
		// 检查 token
		token := c.Request.Header.Get("Authorization")
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "无权进行此操作，未登录或 token 无效",
			})
			c.Abort()
			return
		}

		// 验证用户 token
		user := model.ValidateUserToken(token)
		if user != nil && user.Username != "" {
			// Token 有效，设置用户信息
			username = user.Username
			role = user.Role
			id = user.Id
			status = user.Status
		} else {
			c.JSON(http.StatusOK, gin.H{
				"success": false,
				"message": "无权进行此操作，token 无效",
			})
			c.Abort()
			return
		}
		authByToken = true
	}

	// 检查用户状态是否被封禁
	if status.(int) == common.UserStatusDisabled {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "用户已被封禁",
		})
		c.Abort()
		return
	}

	// 检查用户角色是否满足最低权限要求
	if role.(int) < minRole {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "无权进行此操作，权限不足",
		})
		c.Abort()
		return
	}

	// 将用户信息设置到 Gin 上下文中，并继续处理请求
	c.Set("username", username)
	c.Set("role", role)
	c.Set("id", id)
	c.Set("authByToken", authByToken)
	c.Next()
}

// UserAuth 返回一个中间件函数，用于检查普通用户权限。
//
// 输入参数：
//   - c (*gin.Context): Gin 上下文对象。
//
// 输出参数：
//   - 无。
func UserAuth() func(c *gin.Context) {
	return func(c *gin.Context) {
		authHelper(c, common.RoleCommonUser)
	}
}

// AdminAuth 返回一个中间件函数，用于检查管理员用户权限。
//
// 输入参数：
//   - c (*gin.Context): Gin 上下文对象。
//
// 输出参数：
//   - 无。
func AdminAuth() func(c *gin.Context) {
	return func(c *gin.Context) {
		authHelper(c, common.RoleAdminUser)
	}
}

// RootAuth 返回一个中间件函数，用于检查根用户权限。
//
// 输入参数：
//   - c (*gin.Context): Gin 上下文对象。
//
// 输出参数：
//   - 无。
func RootAuth() func(c *gin.Context) {
	return func(c *gin.Context) {
		authHelper(c, common.RoleRootUser)
	}
}

// NoTokenAuth 返回一个中间件函数，用于确保接口不支持使用 token 进行验证。
//
// 输入参数：
//   - c (*gin.Context): Gin 上下文对象。
//
// 输出参数：
//   - 无。
func NoTokenAuth() func(c *gin.Context) {
	return func(c *gin.Context) {
		// 从上下文中获取 authByToken 标志
		authByToken := c.GetBool("authByToken")

		// 如果 authByToken 为 true，则返回 JSON 错误消息并中止请求
		if authByToken {
			c.JSON(http.StatusOK, gin.H{
				"success": false,
				"message": "本接口不支持使用 token 进行验证",
			})
			c.Abort()
			return
		}

		// 否则，继续处理请求
		c.Next()
	}
}

// TokenOnlyAuth 返回一个中间件函数，用于确保接口仅支持使用 token 进行验证。
//
// 输入参数：
//   - c (*gin.Context): Gin 上下文对象。
//
// 输出参数：
//   - 无。
func TokenOnlyAuth() func(c *gin.Context) {
	return func(c *gin.Context) {
		// 从上下文中获取 authByToken 标志
		authByToken := c.GetBool("authByToken")

		// 如果 authByToken 为 false，则返回 JSON 错误消息并中止请求
		if !authByToken {
			c.JSON(http.StatusOK, gin.H{
				"success": false,
				"message": "本接口仅支持使用 token 进行验证",
			})
			c.Abort()
			return
		}

		// 否则，继续处理请求
		c.Next()
	}
}
