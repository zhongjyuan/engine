package controller

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"
	"zhongjyuan/gin-template/common"
	"zhongjyuan/gin-template/model"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// GitHubBind 函数用于处理 GitHub 绑定请求。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，用于处理 HTTP 请求和响应。
//
// 输出参数：
//   - 无。
func GitHubBind(c *gin.Context) {
	// 检查是否启用 GitHub OAuth
	if !common.GitHubOAuthEnabled {
		common.SendFailureJSONResponse(c, "管理员未开启通过 GitHub 登录以及注册")
		return
	}

	// 获取 GitHub 授权码
	code := c.Query("code")

	// 获取 GitHub 用户信息
	githubUser, err := getGitHubUserInfoByCode(code)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 创建用户对象
	user := model.User{
		GitHubId: githubUser.Login,
	}

	// 检查是否 GitHub ID 已被绑定
	if model.IsGitHubIdAlreadyTaken(user.GitHubId) {
		common.SendFailureJSONResponse(c, "该 GitHub 账户已被绑定")
		return
	}

	// 从 Session 中获取用户 ID
	session := sessions.Default(c)
	id := session.Get("id")
	user.Id = id.(int)

	// 通过用户 ID 填充用户信息
	if err := user.GetById(); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 更新用户的 GitHub ID
	user.GitHubId = githubUser.Login
	if err := user.Update(false); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 返回成功响应
	common.SendSuccessJSONResponse(c, "绑定成功", nil)
}

// GitHubOAuth 函数用于处理 GitHub OAuth 认证流程。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，用于处理 HTTP 请求和响应。
//
// 输出参数：
//   - 无。
func GitHubOAuth(c *gin.Context) {
	// 从会话中获取用户名
	session := sessions.Default(c)
	userName := session.Get("userName")

	// 如果用户名不为空，则执行 GitHub 绑定流程
	if userName != nil {
		GitHubBind(c)
		return
	}

	// 如果管理员未开启 GitHub OAuth 登录功能，则返回相应提示信息
	if !common.GitHubOAuthEnabled {
		common.SendFailureJSONResponse(c, "管理员未开启通过 GitHub 登录以及注册")
		return
	}

	// 从 URL 查询参数中获取授权码
	code := c.Query("code")

	// 使用授权码获取 GitHub 用户信息
	githubUser, err := getGitHubUserInfoByCode(code)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 创建 User 对象并填充 GitHub 用户信息
	user := model.User{
		GitHubId: githubUser.Login,
	}

	// 如果 GitHub ID 已被注册，则填充用户信息
	if model.IsGitHubIdAlreadyTaken(user.GitHubId) {
		if err := user.GetByGitHubId(); err != nil {
			common.SendFailureJSONResponse(c, err.Error())
			return
		}
	} else { // 如果 GitHub ID 未被注册，则进行用户注册流程
		// 检查管理员是否开启了新用户注册功能
		if common.RegisterEnabled {
			// 设置用户信息
			user.UserName = "github_" + strconv.Itoa(model.GetMaxUserId()+1)
			if githubUser.Name != "" {
				user.DisplayName = githubUser.Name
			} else {
				user.DisplayName = "GitHub User"
			}
			user.Email = githubUser.Email
			user.Role = common.RoleCommonUser
			user.Status = common.UserStatusEnabled

			// 插入用户到数据库
			if err := user.Insert(); err != nil {
				common.SendFailureJSONResponse(c, err.Error())
				return
			}
		} else { // 如果管理员关闭了新用户注册功能，则返回相应提示信息
			common.SendFailureJSONResponse(c, "管理员关闭了新用户注册")
			return
		}
	}

	// 如果用户被封禁，则返回相应提示信息
	if user.Status != common.UserStatusEnabled {
		common.SendFailureJSONResponse(c, "用户已被封禁")
		return
	}

	// 执行登录设置并返回相应成功信息
	setupLogin(&user, c)
}

// GitHubOAuthResponse 结构体用于表示 GitHub OAuth 响应的结构。
//
// 输入参数：
//   - AccessToken string: 授权和认证请求的访问令牌。
//   - Scope string: 令牌的范围。
//   - TokenType string: 令牌类型。
type GitHubOAuthResponse struct {
	Scope       string `json:"scope"`
	TokenType   string `json:"token_type"`
	AccessToken string `json:"access_token"`
}

// GitHubUser 结构体用于表示 GitHub 用户对象，包括登录名、姓名和电子邮箱。
type GitHubUser struct {
	Name  string `json:"name"`  // 用户姓名
	Login string `json:"login"` // 用户登录名
	Email string `json:"email"` // 用户电子邮箱
}

// getGitHubUserInfoByCode 函数用于通过 GitHub OAuth 授权码获取用户信息。
//
// 输入参数：
//   - code string: GitHub OAuth 授权码。
//
// 输出参数：
//   - *GitHubUser: GitHub 用户信息结构体指针。
//   - error: 如果发生错误，则返回错误信息；否则返回 nil。
func getGitHubUserInfoByCode(code string) (*GitHubUser, error) {
	// 检查授权码是否为空
	if code == "" {
		return nil, errors.New("无效的参数")
	}

	// 构建授权请求的参数
	values := map[string]string{"client_id": common.GitHubClientId, "client_secret": common.GitHubClientSecret, "code": code}
	jsonData, err := json.Marshal(values)
	if err != nil {
		common.SysLog(err.Error())
		return nil, err
	}

	// 创建 HTTP 请求对象
	req, err := http.NewRequest("POST", "https://github.com/login/oauth/access_token", bytes.NewBuffer(jsonData))
	if err != nil {
		common.SysLog(err.Error())
		return nil, err
	}

	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/json")

	// 创建 HTTP 客户端并发送请求
	client := http.Client{
		Timeout: 5 * time.Second,
	}

	res, err := client.Do(req)
	if err != nil {
		common.SysLog(err.Error())
		return nil, errors.New("无法连接至 GitHub 服务器，请稍后重试！")
	}
	defer res.Body.Close()

	// 解析 GitHub OAuth 响应
	var oAuthResponse GitHubOAuthResponse
	if err := json.NewDecoder(res.Body).Decode(&oAuthResponse); err != nil {
		common.SysLog(err.Error())
		return nil, err
	}

	// 创建获取用户信息的 HTTP 请求
	req, err = http.NewRequest("GET", "https://api.github.com/user", nil)
	if err != nil {
		common.SysLog(err.Error())
		return nil, err
	}
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", oAuthResponse.AccessToken))

	// 发送请求并获取响应
	res2, err := client.Do(req)
	if err != nil {
		common.SysLog(err.Error())
		return nil, errors.New("无法连接至 GitHub 服务器，请稍后重试！")
	}
	defer res2.Body.Close()

	// 解析 GitHub 用户信息响应
	var githubUser GitHubUser
	err = json.NewDecoder(res2.Body).Decode(&githubUser)
	if err != nil {
		common.SysLog(err.Error())
		return nil, err
	}

	// 检查是否获取到有效的用户信息
	if githubUser.Login == "" {
		return nil, errors.New("返回值非法，用户字段为空，请稍后重试！")
	}

	// 返回获取到的 GitHub 用户信息
	return &githubUser, nil
}
