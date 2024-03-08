package middleware

import (
	"net/http"
	"zhongjyuan/gin-template/common"
	"zhongjyuan/gin-template/model"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// auth 是一个辅助函数，用于进行身份验证和权限检查。
//
// 输入参数：
//   - c (*gin.Context): Gin 上下文对象。
//   - minRole (int): 所需的最低角色权限。
//
// 输出参数：
//   - 无。
func auth(c *gin.Context, minRole int) {
	// 获取会话
	session := sessions.Default(c)

	authByToken := false

	// 获取会话中的用户信息
	id := session.Get("id")
	role := session.Get("role")
	status := session.Get("status")
	userName := session.Get("userName")

	// 如果用户名为空，尝试使用 token 进行验证
	if userName == nil {
		// 检查 token
		token := c.Request.Header.Get("Authorization")
		if token == "" {
			common.SendJSONResponse(c, http.StatusUnauthorized, false, "无权进行此操作，未登录或 token 无效")
			c.Abort()
			return
		}

		// 验证用户 token
		user, _ := model.GetUserByToken(token, true)
		if user != nil && user.UserName != "" { // Token 有效，设置用户信息
			id = user.Id
			role = user.Role
			status = user.Status
			userName = user.UserName
		} else {
			common.SendJSONResponse(c, http.StatusUnauthorized, false, "无权进行此操作，token 无效")
			c.Abort()
			return
		}

		authByToken = true
	}

	// 检查用户状态是否被封禁
	if status.(int) == common.UserStatusDisabled {
		common.SendFailureJSONResponse(c, "用户已被封禁")
		c.Abort()
		return
	}

	// 检查用户角色是否满足最低权限要求
	if role.(int) < minRole {
		common.SendFailureJSONResponse(c, "无权进行此操作，权限不足")
		c.Abort()
		return
	}

	// 将用户信息设置到 Gin 上下文中，并继续处理请求
	c.Set("id", id)
	c.Set("role", role)
	c.Set("userName", userName)
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
		auth(c, common.RoleCommonUser)
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
		auth(c, common.RoleAdminUser)
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
		auth(c, common.RoleRootUser)
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
			common.SendFailureJSONResponse(c, "本接口不支持使用 token 进行验证")
			c.Abort()
			return
		}

		// 否则，继续处理请求
		c.Next()
	}
}

// OnlyTokenAuth 返回一个中间件函数，用于确保接口仅支持使用 token 进行验证。
//
// 输入参数：
//   - c (*gin.Context): Gin 上下文对象。
//
// 输出参数：
//   - 无。
func OnlyTokenAuth() func(c *gin.Context) {
	return func(c *gin.Context) {
		// 从上下文中获取 authByToken 标志
		authByToken := c.GetBool("authByToken")

		// 如果 authByToken 为 false，则返回 JSON 错误消息并中止请求
		if !authByToken {
			common.SendFailureJSONResponse(c, "本接口仅支持使用 token 进行验证")
			c.Abort()
			return
		}

		// 否则，继续处理请求
		c.Next()
	}
}
