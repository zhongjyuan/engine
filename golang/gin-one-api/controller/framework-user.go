package controller

import (
	"encoding/json"
	"strconv"
	"strings"
	"zhongjyuan/gin-one-api/common"
	"zhongjyuan/gin-one-api/model"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// CreateUser 函数处理创建用户操作。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含请求和响应信息。
//
// 输出参数：
//   - 无。
func CreateUser(c *gin.Context) {
	// 定义用户结构体变量
	var user model.UserEntity

	// 解析请求体中的 JSON 数据到用户结构体
	if err := json.NewDecoder(c.Request.Body).Decode(&user); err != nil || user.UserName == "" || user.Password == "" {
		common.SendFailureJSONResponse(c, "无效的参数！")
		return
	}

	// 若显示名为空，则使用用户名作为显示名
	if user.DisplayName == "" {
		user.DisplayName = user.UserName
	}

	// 获取当前用户的角色
	myRole := c.GetInt("role")

	// 检查权限确保当前用户有权创建权限小于自己的用户
	if user.Role >= myRole {
		common.SendFailureJSONResponse(c, "无法创建权限大于等于自己的用户")
		return
	}

	// 清洗用户数据以防止潜在的恶意内容，即使对于管理员用户，我们也不能完全信任他们！
	userEntity := model.UserEntity{
		UserName:    user.UserName,
		Password:    user.Password,
		DisplayName: user.DisplayName,
	}

	// 插入用户到数据库中
	if err := userEntity.Insert(); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 返回成功消息
	common.SendSuccessJSONResponse(c, "创建成功", nil)
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
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 获取原始用户信息
	originUser, err := model.GetUserByID(id, false)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 获取当前用户的角色
	myRole := c.GetInt("role")

	// 检查权限确保当前用户有权删除用户
	if myRole <= originUser.Role {
		common.SendFailureJSONResponse(c, "无权删除同权限等级或更高权限等级的用户")
		return
	}

	// 从数据库中删除用户
	if err := model.DeleteUserByID(id); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 在成功删除时返回成功消息
	common.SendSuccessJSONResponse(c, "删除成功", nil)
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
	if err := model.DeleteUserByID(id); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 返回成功消息
	common.SendSuccessJSONResponse(c, "删除成功", nil)
}

// UpdateUser 函数用于更新用户信息。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含请求信息和响应方法。
//
// 输出参数：
//   - 无。
func UpdateUser(c *gin.Context) {
	var updatedUser model.UserEntity

	// 解码请求体中的 JSON 数据到 updatedUser 变量
	if err := json.NewDecoder(c.Request.Body).Decode(&updatedUser); err != nil || updatedUser.Id == 0 {
		common.SendFailureJSONResponse(c, "无效的参数")
		return
	}

	// 如果密码为空，则将其设为默认值以满足验证器的要求
	if updatedUser.Password == "" {
		updatedUser.Password = "$I_LOVE_U"
	}

	if err := common.Validate.Struct(&updatedUser); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 获取原始用户信息
	originUser, err := model.GetUserByID(updatedUser.Id, false)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 获取当前用户的权限
	myRole := c.GetInt("role")

	// 检查是否有权限更新同权限等级或更高权限等级的用户信息
	if myRole <= originUser.Role {
		common.SendFailureJSONResponse(c, "无权更新同权限等级或更高权限等级的用户信息")
		return
	}

	// 检查是否有权限将其他用户权限等级提升到大于等于自己的权限等级
	if myRole <= updatedUser.Role {
		common.SendFailureJSONResponse(c, "无权将其他用户权限等级提升到大于等于自己的权限等级")
		return
	}

	if updatedUser.Password == "$I_LOVE_U" { // 回滚密码至原始值
		updatedUser.Password = ""
	}

	// 更新用户信息
	if err := updatedUser.Update(updatedUser.Password != ""); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 返回成功响应
	common.SendSuccessJSONResponse(c, "更新成功", nil)
}

// UpdateSelf 函数用于用户自身更新信息。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含请求信息和响应方法。
//
// 输出参数：
//   - 无。
func UpdateSelf(c *gin.Context) {
	var user model.UserEntity

	// 解码请求体中的 JSON 数据到 user 变量
	if err := json.NewDecoder(c.Request.Body).Decode(&user); err != nil {
		common.SendFailureJSONResponse(c, "无效的参数")
		return
	}

	// 如果密码为空，则将其设为默认值以满足验证器的要求
	if user.Password == "" {
		user.Password = "$I_LOVE_U"
	}

	// 验证对象
	if err := common.Validate.Struct(&user); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 创建干净的用户信息对象，只包含允许更新的字段
	userEntity := model.UserEntity{
		Id:          c.GetInt("id"),
		UserName:    user.UserName,
		Password:    user.Password,
		DisplayName: user.DisplayName,
	}

	if user.Password == "$I_LOVE_U" {
		user.Password = "" // 回滚密码至原始值
		userEntity.Password = ""
	}

	// 更新用户信息
	if err := userEntity.Update(user.Password != ""); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 返回成功响应
	common.SendSuccessJSONResponse(c, "更新成功", nil)
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
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 获取用户信息
	user, err := model.GetUserByID(id, false)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 获取当前用户角色
	myRole := c.GetInt("role")

	// 检查权限，确保当前用户有权获取该用户信息
	if myRole <= user.Role {
		common.SendFailureJSONResponse(c, "无权获取同级或更高等级用户的信息")
		return
	}

	// 返回获取用户信息成功的响应
	common.SendSuccessJSONResponse(c, "获取成功", user)
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
	user, err := model.GetUserByID(id, true)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 返回获取当前用户信息成功的响应
	common.SendSuccessJSONResponse(c, "获取成功", user)
}

// GetPageUsers 函数用于获取所有用户信息。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含了请求信息和响应信息。
//
// 输出参数：
//   - 无。
func GetPageUsers(c *gin.Context) {
	// 获取请求中的分页参数，如果无法解析则默认为 0
	p, err := strconv.Atoi(c.DefaultQuery("p", "0"))
	if err != nil || p < 0 {
		p = 0
	}

	// 获取分页范围内的用户信息
	users, err := model.GetPageUsers(p*common.ItemsPerPage, common.ItemsPerPage)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 返回获取用户信息成功的响应
	common.SendSuccessJSONResponse(c, "获取成功", users)
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
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 返回搜索用户信息成功的响应
	common.SendSuccessJSONResponse(c, "检索成功", users)
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
		common.SendFailureJSONResponse(c, "管理员关闭了新用户注册")
		return
	}

	// 检查是否通过密码进行注册
	if !common.PasswordRegisterEnabled {
		common.SendFailureJSONResponse(c, "管理员关闭了通过密码进行注册，请使用第三方账户验证的形式进行注册")
		return
	}

	// 解析注册请求的 JSON 数据到 UserEntity 结构体
	var user model.UserEntity
	if err := json.NewDecoder(c.Request.Body).Decode(&user); err != nil {
		common.SendFailureJSONResponse(c, "无效的参数！")
		return
	}

	// 验证用户信息
	if err := common.Validate.Struct(&user); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 检查是否开启邮箱验证
	if common.EmailVerificationEnabled {
		if user.Email == "" || user.Profile.VerificationCode == "" { // 检查是否提供了邮箱地址和验证码
			common.SendFailureJSONResponse(c, "管理员开启了邮箱验证，请输入邮箱地址和验证码")
			return
		}

		// 检查验证码是否正确
		if !common.VerifyCodeWithKey(user.Email, user.Profile.VerificationCode, common.EmailVerificationPurpose) {
			common.SendFailureJSONResponse(c, "验证码错误或已过期")
			return
		}
	}

	// 清洗用户数据以防止潜在的恶意内容，即使对于管理员用户，我们也不能完全信任他们！
	userEntity := model.UserEntity{
		UserName:    user.UserName,
		Password:    user.Password,
		DisplayName: user.UserName,
		Email:       user.Email,
	}

	// 插入用户信息到数据库
	if err := userEntity.Insert(); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 返回注册成功的响应
	common.SendSuccessJSONResponse(c, "注册成功", nil)
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
	user, err := model.GetUserByID(id, true)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 生成 UUID 作为访问令牌
	user.Token = uuid.New().String()
	user.Token = strings.Replace(user.Token, "-", "", -1)

	// 检查是否存在重复的令牌
	if existingUser, err := model.GetUserByToken(user.Token, false); err != nil || existingUser != nil {
		common.SendFailureJSONResponse(c, "请重试，系统生成的 UUID 竟然重复了！")
		return
	}

	// 更新用户信息
	if err := user.Update(false); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 返回生成令牌成功的响应
	common.SendSuccessJSONResponse(c, "生成成功", user.Token)
}

// LoginRequest 结构体用于表示登录请求，包括用户名和密码。
type LoginRequest struct {
	UserName string `json:"userName"` // 用户名
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
		common.SendFailureJSONResponse(c, "管理员关闭了密码登录")
		return
	}

	// 解析登录请求的 JSON 数据到 LoginRequest 结构体
	var loginRequest LoginRequest
	if err := json.NewDecoder(c.Request.Body).Decode(&loginRequest); err != nil {
		common.SendFailureJSONResponse(c, "无效的参数！")
		return
	}

	// 获取用户名和密码
	userName := loginRequest.UserName
	password := loginRequest.Password

	// 检查用户名和密码是否为空
	if userName == "" || password == "" {
		common.SendFailureJSONResponse(c, "无效的参数！")
		return
	}

	// 创建 UserEntity 结构体
	user := model.UserEntity{
		UserName: userName,
		Password: password,
	}

	// 验证用户信息并填充 UserEntity 结构体
	if err := user.Authenticate(); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 设置登录信息，包括 session 和 cookies
	setupLogin(&user, c)
}

// setupLogin 函数用于设置登录信息，包括 session 和 cookies，并返回用户信息。
//
// 输入参数：
//   - user *model.UserEntity: 用户对象。
//   - c *gin.Context: Gin 上下文对象，包含了请求信息和响应信息。
//
// 输出参数：
//   - 无。
func setupLogin(user *model.UserEntity, c *gin.Context) {
	// 创建默认的 session
	session := sessions.Default(c)

	// 设置 session 中的用户信息
	session.Set("id", user.Id)
	session.Set("userName", user.UserName)
	session.Set("role", user.Role)
	session.Set("status", user.Status)

	// 保存 session
	if err := session.Save(); err != nil {
		common.SendFailureJSONResponse(c, "无法保存会话信息，请重试")
		return
	}

	common.SendSuccessJSONResponse(c, "登录成功", model.UserEntity{
		Id:          user.Id,
		UserName:    user.UserName,
		DisplayName: user.DisplayName,
		Role:        user.Role,
		Status:      user.Status,
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
	if err := session.Save(); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 返回登出成功的响应
	common.SendSuccessJSONResponse(c, "登出成功", nil)
}

// ManageRequest 结构定义了管理请求的结构体。
//
// 输入参数：
//   - Username string: 用户名。
//   - Action string: 操作。
type ManageRequest struct {
	UserName string `json:"userName"`
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
	if err := json.NewDecoder(c.Request.Body).Decode(&req); err != nil {
		common.SendFailureJSONResponse(c, "无效的参数！")
		return
	}

	// 创建用户结构体并根据用户名填充属性
	user := model.UserEntity{
		UserName: req.UserName,
	}

	if err := user.GetByUserName(false); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 检查用户是否存在
	if user.Id == 0 {
		common.SendFailureJSONResponse(c, "用户不存在")
		return
	}

	// 获取当前用户的角色
	myRole := c.GetInt("role")

	// 检查权限确保当前用户有权更新权限小于自己的用户信息
	if myRole <= user.Role && myRole != common.RoleRootUser {
		common.SendFailureJSONResponse(c, "无权更新同权限等级或更高权限等级的用户信息")
		return
	}

	// 根据请求的操作执行相应的动作
	switch req.Action {
	case "disable":
		if user.Role == common.RoleRootUser {
			common.SendFailureJSONResponse(c, "无法禁用超级管理员用户")
			return
		}
		user.Status = common.UserStatusDisabled
	case "enable":
		if user.Role == common.RoleRootUser {
			common.SendFailureJSONResponse(c, "无法启用超级管理员用户")
			return
		}
		user.Status = common.UserStatusEnabled
	case "delete":
		if user.Role == common.RoleRootUser {
			common.SendFailureJSONResponse(c, "无法删除超级管理员用户")
			return
		}

		// 调用模型层删除用户
		if err := user.Delete(); err != nil {
			common.SendFailureJSONResponse(c, err.Error())
			return
		}
	case "promote":
		if myRole != common.RoleRootUser {
			common.SendFailureJSONResponse(c, "普通管理员用户无法提升其他用户为管理员")
			return
		}

		if user.Role >= common.RoleAdminUser {
			common.SendFailureJSONResponse(c, "该用户已经是管理员")
			return
		}
		user.Role = common.RoleAdminUser
	case "demote":
		if user.Role == common.RoleRootUser {
			common.SendFailureJSONResponse(c, "无法降级超级管理员用户")
			return
		}

		if user.Role == common.RoleCommonUser {
			common.SendFailureJSONResponse(c, "该用户已经是普通用户")
			return
		}
		user.Role = common.RoleCommonUser
	}

	// 更新用户信息
	if err := user.Update(false); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 返回成功消息和清理后的用户信息
	common.SendSuccessJSONResponse(c, "操作成功", model.UserEntity{
		Role:   user.Role,
		Status: user.Status,
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
	code := c.Query("code")
	email := c.Query("email")

	// 使用邮箱和验证码验证验证码的有效性
	if !common.VerifyCodeWithKey(email, code, common.EmailVerificationPurpose) {
		common.SendFailureJSONResponse(c, "验证码错误或已过期")
		return
	}

	// 从上下文中获取用户ID
	id := c.GetInt("id")

	// 创建用户结构体并填充ID属性
	user := model.UserEntity{
		Id: id,
	}

	// 根据ID填充用户信息
	if err := user.GetByID(false); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 更新用户邮箱信息
	user.Email = email

	// 更新用户信息
	if err := user.Update(false); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 返回成功消息
	common.SendSuccessJSONResponse(c, "绑定成功", nil)
}
