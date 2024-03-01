package controller

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"zhongjyuan/gin-template/common"
	"zhongjyuan/gin-template/model"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// LoginRequest 结构体用于表示登录请求，包括用户名和密码。
type LoginRequest struct {
	Username string `json:"username"` // 用户名
	Password string `json:"password"` // 密码
}

// Login 函数用于处理用户登录请求。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含了请求信息和响应信息。
//
// 输出参数：
//   - 无。
func Login(c *gin.Context) {
	// 检查是否启用密码登录
	if !common.PasswordLoginEnabled {
		c.JSON(http.StatusOK, gin.H{
			"message": "管理员关闭了密码登录",
			"success": false,
		})
		return
	}

	// 解析登录请求的 JSON 数据到 LoginRequest 结构体
	var loginRequest LoginRequest
	err := json.NewDecoder(c.Request.Body).Decode(&loginRequest)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "无效的参数",
			"success": false,
		})
		return
	}

	// 获取用户名和密码
	username := loginRequest.Username
	password := loginRequest.Password

	// 检查用户名和密码是否为空
	if username == "" || password == "" {
		c.JSON(http.StatusOK, gin.H{
			"message": "无效的参数",
			"success": false,
		})
		return
	}

	// 创建 User 结构体
	user := model.User{
		Username: username,
		Password: password,
	}

	// 验证用户信息并填充 User 结构体
	err = user.ValidateAndFill()
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"message": err.Error(),
			"success": false,
		})
		return
	}

	// 设置登录信息，包括 session 和 cookies
	setupLogin(&user, c)
}

// setupLogin 函数用于设置登录信息，包括 session 和 cookies，并返回用户信息。
//
// 输入参数：
//   - user *model.User: 用户对象。
//   - c *gin.Context: Gin 上下文对象，包含了请求信息和响应信息。
//
// 输出参数：
//   - 无。
func setupLogin(user *model.User, c *gin.Context) {
	// 创建默认的 session
	session := sessions.Default(c)
	// 设置 session 中的用户信息
	session.Set("id", user.Id)
	session.Set("username", user.Username)
	session.Set("role", user.Role)
	session.Set("status", user.Status)

	// 保存 session
	err := session.Save()
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "无法保存会话信息，请重试",
			"success": false,
		})
		return
	}

	// 创建 cleanUser 结构体，包含部分用户信息
	cleanUser := model.User{
		Id:          user.Id,
		Username:    user.Username,
		DisplayName: user.DisplayName,
		Role:        user.Role,
		Status:      user.Status,
	}

	// 返回登录成功的响应
	c.JSON(http.StatusOK, gin.H{
		"message": "",
		"success": true,
		"data":    cleanUser,
	})
}

// Logout 函数用于处理用户登出请求。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含了请求信息和响应信息。
//
// 输出参数：
//   - 无。
func Logout(c *gin.Context) {
	// 获取当前 session
	session := sessions.Default(c)
	// 清空 session
	session.Clear()
	// 保存 session
	err := session.Save()
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"message": err.Error(),
			"success": false,
		})
		return
	}

	// 返回登出成功的响应
	c.JSON(http.StatusOK, gin.H{
		"message": "",
		"success": true,
	})
}

// Register 函数用于处理用户注册请求。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含了请求信息和响应信息。
//
// 输出参数：
//   - 无。
func Register(c *gin.Context) {
	// 检查是否关闭了新用户注册
	if !common.RegisterEnabled {
		c.JSON(http.StatusOK, gin.H{
			"message": "管理员关闭了新用户注册",
			"success": false,
		})
		return
	}

	// 检查是否通过密码进行注册
	if !common.PasswordRegisterEnabled {
		c.JSON(http.StatusOK, gin.H{
			"message": "管理员关闭了通过密码进行注册，请使用第三方账户验证的形式进行注册",
			"success": false,
		})
		return
	}

	// 解析注册请求的 JSON 数据到 User 结构体
	var user model.User
	err := json.NewDecoder(c.Request.Body).Decode(&user)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "无效的参数",
			"success": false,
		})
		return
	}

	// 验证用户信息
	if err := common.Validate.Struct(&user); err != nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "输入不合法 " + err.Error(),
			"success": false,
		})
		return
	}

	// 检查是否开启邮箱验证
	if common.EmailVerificationEnabled {
		// 检查是否提供了邮箱地址和验证码
		if user.Email == "" || user.VerificationCode == "" {
			c.JSON(http.StatusOK, gin.H{
				"message": "管理员开启了邮箱验证，请输入邮箱地址和验证码",
				"success": false,
			})
			return
		}

		// 检查验证码是否正确
		if !common.VerifyCodeWithKey(user.Email, user.VerificationCode, common.EmailVerificationPurpose) {
			c.JSON(http.StatusOK, gin.H{
				"message": "验证码错误或已过期",
				"success": false,
			})
			return
		}
	}

	// 创建 cleanUser 结构体，包含部分用户信息
	cleanUser := model.User{
		Username:    user.Username,
		Password:    user.Password,
		DisplayName: user.Username,
	}

	// 如果开启了邮箱验证，则设置 cleanUser 的邮箱信息
	if common.EmailVerificationEnabled {
		cleanUser.Email = user.Email
	}

	// 插入用户信息到数据库
	if err := cleanUser.Insert(); err != nil {
		c.JSON(http.StatusOK, gin.H{
			"message": err.Error(),
			"success": false,
		})
		return
	}

	// 返回注册成功的响应
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
	})
}

// GetAllUsers 函数用于获取所有用户信息。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含了请求信息和响应信息。
//
// 输出参数：
//   - 无。
func GetAllUsers(c *gin.Context) {
	// 获取请求中的分页参数
	p, _ := strconv.Atoi(c.Query("p"))
	// 如果分页参数小于 0，则设置为 0
	if p < 0 {
		p = 0
	}

	// 获取分页范围内的用户信息
	users, err := model.GetAllUsers(p*common.ItemsPerPage, common.ItemsPerPage)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	// 返回获取用户信息成功的响应
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data":    users,
	})
}

// SearchUsers 函数用于根据关键词搜索用户信息。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含了请求信息和响应信息。
//
// 输出参数：
//   - 无。
func SearchUsers(c *gin.Context) {
	// 获取请求中的搜索关键词
	keyword := c.Query("keyword")

	// 根据关键词搜索用户信息
	users, err := model.SearchUsers(keyword)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	// 返回搜索用户信息成功的响应
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data":    users,
	})
}

// GetUser 函数用于获取特定用户的信息。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含了请求信息和响应信息。
//
// 输出参数：
//   - 无。
func GetUser(c *gin.Context) {
	// 获取请求中的用户 ID 参数
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	// 获取用户信息
	user, err := model.GetUserById(id, false)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	// 获取当前用户角色
	myRole := c.GetInt("role")

	// 检查权限，确保当前用户有权获取该用户信息
	if myRole <= user.Role {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "无权获取同级或更高等级用户的信息",
		})
		return
	}

	// 返回获取用户信息成功的响应
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data":    user,
	})
}

// GenerateToken 函数用于生成用户的访问令牌。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含了请求信息和响应信息。
//
// 输出参数：
//   - 无。
func GenerateToken(c *gin.Context) {
	// 获取当前用户 ID
	id := c.GetInt("id")

	// 获取用户信息
	user, err := model.GetUserById(id, true)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	// 生成 UUID 作为访问令牌
	user.Token = uuid.New().String()
	user.Token = strings.Replace(user.Token, "-", "", -1)

	// 检查是否存在重复的令牌
	if model.DB.Where("token = ?", user.Token).First(user).RowsAffected != 0 {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "请重试，系统生成的 UUID 竟然重复了！",
		})
		return
	}

	// 更新用户信息
	if err := user.Update(false); err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	// 返回生成令牌成功的响应
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data":    user.Token,
	})
}

// GetSelf 函数用于获取当前用户的信息。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含了请求信息和响应信息。
//
// 输出参数：
//   - 无。
func GetSelf(c *gin.Context) {
	// 获取当前用户 ID
	id := c.GetInt("id")

	// 获取当前用户信息
	user, err := model.GetUserById(id, false)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	// 返回获取当前用户信息成功的响应
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data":    user,
	})
}

// UpdateUser 函数用于更新用户信息。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含请求信息和响应方法。
//
// 输出参数：
//   - 无。
func UpdateUser(c *gin.Context) {
	var updatedUser model.User
	// 解码请求体中的 JSON 数据到 updatedUser 变量
	err := json.NewDecoder(c.Request.Body).Decode(&updatedUser)
	if err != nil || updatedUser.Id == 0 {
		// 如果解码出错或者用户 ID 为 0，则返回无效参数错误
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "无效的参数",
		})
		return
	}
	if updatedUser.Password == "" {
		// 如果密码为空，则将其设为默认值以满足验证器的要求
		updatedUser.Password = "$I_LOVE_U"
	}
	if err := common.Validate.Struct(&updatedUser); err != nil {
		// 如果用户信息验证失败，则返回错误信息
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "输入不合法 " + err.Error(),
		})
		return
	}
	// 获取原始用户信息
	originUser, err := model.GetUserById(updatedUser.Id, false)
	if err != nil {
		// 如果获取用户信息出错，则返回错误信息
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}
	// 获取当前用户的权限
	myRole := c.GetInt("role")
	// 检查是否有权限更新同权限等级或更高权限等级的用户信息
	if myRole <= originUser.Role {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "无权更新同权限等级或更高权限等级的用户信息",
		})
		return
	}
	// 检查是否有权限将其他用户权限等级提升到大于等于自己的权限等级
	if myRole <= updatedUser.Role {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "无权将其他用户权限等级提升到大于等于自己的权限等级",
		})
		return
	}
	if updatedUser.Password == "$I_LOVE_U" {
		updatedUser.Password = "" // 回滚密码至原始值
	}
	// 判断是否需要更新密码
	updatePassword := updatedUser.Password != ""
	// 更新用户信息
	if err := updatedUser.Update(updatePassword); err != nil {
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

// UpdateSelf 函数用于用户自身更新信息。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含请求信息和响应方法。
//
// 输出参数：
//   - 无。
func UpdateSelf(c *gin.Context) {
	var user model.User
	// 解码请求体中的 JSON 数据到 user 变量
	err := json.NewDecoder(c.Request.Body).Decode(&user)
	if err != nil {
		// 如果解码出错，则返回无效参数错误
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "无效的参数",
		})
		return
	}
	if user.Password == "" {
		// 如果密码为空，则将其设为默认值以满足验证器的要求
		user.Password = "$I_LOVE_U"
	}
	if err := common.Validate.Struct(&user); err != nil {
		// 如果用户信息验证失败，则返回错误信息
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "输入不合法 " + err.Error(),
		})
		return
	}
	// 创建干净的用户信息对象，只包含允许更新的字段
	cleanUser := model.User{
		Id:          c.GetInt("id"),
		Username:    user.Username,
		Password:    user.Password,
		DisplayName: user.DisplayName,
	}
	if user.Password == "$I_LOVE_U" {
		user.Password = "" // 回滚密码至原始值
		cleanUser.Password = ""
	}
	// 判断是否需要更新密码
	updatePassword := user.Password != ""
	// 更新用户信息
	if err := cleanUser.Update(updatePassword); err != nil {
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

// DeleteUser 函数处理用户删除操作。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含请求和响应信息。
//
// 输出参数：
//   - 无。
func DeleteUser(c *gin.Context) {
	// 将参数 "id" 转换为整数
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	// 获取原始用户信息
	originUser, err := model.GetUserById(id, false)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	// 获取当前用户的角色
	myRole := c.GetInt("role")

	// 检查权限确保当前用户有权删除用户
	if myRole <= originUser.Role {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "无权删除同权限等级或更高权限等级的用户",
		})
		return
	}

	// 从数据库中删除用户
	err = model.DeleteUserById(id)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	// 在成功删除时返回成功消息
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
	})
}

// DeleteSelf 函数处理用户自身删除操作。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含请求和响应信息。
//
// 输出参数：
//   - 无。
func DeleteSelf(c *gin.Context) {
	// 从上下文中获取用户ID
	id := c.GetInt("id")

	// 调用模型层删除用户
	err := model.DeleteUserById(id)
	if err != nil {
		// 若删除操作出现错误，则返回错误信息
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	// 返回成功消息
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
	})
}

// CreateUser 函数处理创建用户操作。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含请求和响应信息。
//
// 输出参数：
//   - 无。
func CreateUser(c *gin.Context) {
	// 定义用户结构体变量
	var user model.User

	// 解析请求体中的 JSON 数据到用户结构体
	err := json.NewDecoder(c.Request.Body).Decode(&user)
	if err != nil || user.Username == "" || user.Password == "" {
		// 若解析失败或用户名、密码为空，则返回无效参数的错误消息
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "无效的参数",
		})
		return
	}

	// 若显示名为空，则使用用户名作为显示名
	if user.DisplayName == "" {
		user.DisplayName = user.Username
	}

	// 获取当前用户的角色
	myRole := c.GetInt("role")

	// 检查权限确保当前用户有权创建权限小于自己的用户
	if user.Role >= myRole {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "无法创建权限大于等于自己的用户",
		})
		return
	}

	// 清洗用户数据以防止潜在的恶意内容，即使对于管理员用户，我们也不能完全信任他们！
	cleanUser := model.User{
		Username:    user.Username,
		Password:    user.Password,
		DisplayName: user.DisplayName,
	}

	// 插入用户到数据库中
	if err := cleanUser.Insert(); err != nil {
		// 若插入操作出现错误，则返回错误消息
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	// 返回成功消息
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
	})
}

// ManageRequest 结构定义了管理请求的结构体。
//
// 输入参数：
//   - Username string: 用户名。
//   - Action string: 操作。
type ManageRequest struct {
	Username string `json:"username"`
	Action   string `json:"action"`
}

// ManageUser 函数处理管理用户操作。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含请求和响应信息。
//
// 输出参数：
//   - 无。
func ManageUser(c *gin.Context) {
	// 定义管理请求结构体变量
	var req ManageRequest

	// 解析请求体中的 JSON 数据到管理请求结构体
	err := json.NewDecoder(c.Request.Body).Decode(&req)
	if err != nil {
		// 若解析失败，则返回无效参数的错误消息
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "无效的参数",
		})
		return
	}

	// 创建用户结构体并根据用户名填充属性
	user := model.User{
		Username: req.Username,
	}
	model.DB.Where(&user).First(&user)

	// 检查用户是否存在
	if user.Id == 0 {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "用户不存在",
		})
		return
	}

	// 获取当前用户的角色
	myRole := c.GetInt("role")

	// 检查权限确保当前用户有权更新权限小于自己的用户信息
	if myRole <= user.Role && myRole != common.RoleRootUser {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "无权更新同权限等级或更高权限等级的用户信息",
		})
		return
	}

	// 根据请求的操作执行相应的动作
	switch req.Action {
	case "disable":
		user.Status = common.UserStatusDisabled
		if user.Role == common.RoleRootUser {
			c.JSON(http.StatusOK, gin.H{
				"success": false,
				"message": "无法禁用超级管理员用户",
			})
			return
		}
	case "enable":
		user.Status = common.UserStatusEnabled
	case "delete":
		if user.Role == common.RoleRootUser {
			c.JSON(http.StatusOK, gin.H{
				"success": false,
				"message": "无法删除超级管理员用户",
			})
			return
		}
		// 调用模型层删除用户
		if err := user.Delete(); err != nil {
			c.JSON(http.StatusOK, gin.H{
				"success": false,
				"message": err.Error(),
			})
			return
		}
	case "promote":
		if myRole != common.RoleRootUser {
			c.JSON(http.StatusOK, gin.H{
				"success": false,
				"message": "普通管理员用户无法提升其他用户为管理员",
			})
			return
		}
		if user.Role >= common.RoleAdminUser {
			c.JSON(http.StatusOK, gin.H{
				"success": false,
				"message": "该用户已经是管理员",
			})
			return
		}
		user.Role = common.RoleAdminUser
	case "demote":
		if user.Role == common.RoleRootUser {
			c.JSON(http.StatusOK, gin.H{
				"success": false,
				"message": "无法降级超级管理员用户",
			})
			return
		}
		if user.Role == common.RoleCommonUser {
			c.JSON(http.StatusOK, gin.H{
				"success": false,
				"message": "该用户已经是普通用户",
			})
			return
		}
		user.Role = common.RoleCommonUser
	}

	// 更新用户信息
	if err := user.Update(false); err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	// 创建用于返回的清理后的用户结构体
	clearUser := model.User{
		Role:   user.Role,
		Status: user.Status,
	}

	// 返回成功消息和清理后的用户信息
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data":    clearUser,
	})
}

// EmailBind 函数处理邮箱绑定操作。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含请求和响应信息。
//
// 输出参数：
//   - 无。
func EmailBind(c *gin.Context) {
	// 从查询参数中获取邮箱和验证码
	email := c.Query("email")
	code := c.Query("code")

	// 使用邮箱和验证码验证验证码的有效性
	if !common.VerifyCodeWithKey(email, code, common.EmailVerificationPurpose) {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "验证码错误或已过期",
		})
		return
	}

	// 从上下文中获取用户ID
	id := c.GetInt("id")

	// 创建用户结构体并填充ID属性
	user := model.User{
		Id: id,
	}

	// 根据ID填充用户信息
	err := user.FillUserById()
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	// 更新用户邮箱信息
	user.Email = email
	// 由于已使用验证码检查邮箱的唯一性，因此无需再次检查

	// 更新用户信息
	err = user.Update(false)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	// 返回成功消息
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
	})
}
