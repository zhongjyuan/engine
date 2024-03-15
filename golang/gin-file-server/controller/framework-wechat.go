package controller

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"
	"zhongjyuan/gin-file-server/common"
	"zhongjyuan/gin-file-server/model"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// WeChatBind 函数处理微信绑定操作。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含请求和响应信息。
//
// 输出参数：
//   - 无。
func WeChatBind(c *gin.Context) {
	// 检查管理员是否开启了通过微信登录以及注册功能
	if !common.WeChatAuthEnabled {
		common.SendFailureJSONResponse(c, "管理员未开启通过微信登录以及注册")
		return
	}

	// 从查询参数中获取微信授权码
	code := c.Query("code")

	// 使用授权码获取微信用户ID
	wechatId, err := getWeChatIdByCode(code)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 检查微信ID是否已被绑定
	if model.IsWeChatIdAlreadyTaken(wechatId) {
		common.SendFailureJSONResponse(c, "该微信账号已被绑定")
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

	// 更新用户微信ID信息
	user.Profile.WeChatId = wechatId

	// 更新用户信息
	if err := user.Update(false); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 返回成功消息
	common.SendSuccessJSONResponse(c, "绑定成功", nil)
}

// WeChatOAuth 函数处理微信认证操作。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含请求和响应信息。
//
// 输出参数：
//   - 无。
func WeChatOAuth(c *gin.Context) {
	// 从会话中获取用户名
	session := sessions.Default(c)
	userName := session.Get("userName")

	// 如果用户名不为空，则执行 WeChat 绑定流程
	if userName != nil {
		WeChatBind(c)
		return
	}

	// 检查管理员是否开启了通过微信登录以及注册功能
	if !common.WeChatAuthEnabled {
		common.SendFailureJSONResponse(c, "管理员未开启通过微信登录以及注册")
		return
	}

	// 从查询参数中获取微信授权码
	code := c.Query("code")

	// 通过微信授权码获取微信用户唯一标识
	wechatId, err := getWeChatIdByCode(code)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 创建用户结构体并填充微信用户唯一标识
	user := &model.UserEntity{
		Profile: model.UserProfileEntity{
			WeChatId: wechatId,
		},
	}

	// 检查微信用户唯一标识是否已被使用
	if model.IsWeChatIdAlreadyTaken(wechatId) {
		// 若已被使用，则根据微信用户唯一标识填充用户信息
		if _, err := user.Profile.GetUserByWeChatID(false); err != nil {
			common.SendFailureJSONResponse(c, err.Error())
			return
		}
	} else {
		if common.RegisterEnabled { // 若未被使用且管理员允许注册新用户，则创建新用户
			user.UserName = "wechat_" + strconv.Itoa(model.GetMaxUserId()+1)
			user.DisplayName = "WeChat UserEntity"
			user.Role = common.RoleCommonUser
			user.Status = common.UserStatusEnabled

			// 插入用户到数据库中
			if err := user.Insert(); err != nil {
				common.SendFailureJSONResponse(c, err.Error())
				return
			}
		} else { // 若管理员关闭了新用户注册，则返回错误消息
			common.SendFailureJSONResponse(c, "管理员关闭了新用户注册")
			return
		}
	}

	// 检查用户状态，若已被封禁则返回错误消息
	if user.Status != common.UserStatusEnabled {
		common.SendFailureJSONResponse(c, "用户已被封禁")
		return
	}

	// 执行登录设置
	setupLogin(user, c)
}

// WechatOAuthResponse 结构定义了微信登录响应的结构体。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - bool: 请求是否成功。
//   - string: 返回的消息。
//   - string: 返回的数据。
type WechatOAuthResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    string `json:"data"`
}

// getWeChatIdByCode 函数通过微信授权码获取用户ID。
//
// 输入参数：
//   - code string: 微信授权码。
//
// 输出参数：
//   - string: 用户ID。
//   - error: 如果发生错误，返回错误信息；否则返回nil。
func getWeChatIdByCode(code string) (string, error) {
	// 检查授权码是否为空
	if code == "" {
		return "", errors.New("无效的参数")
	}

	// 构建HTTP请求
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/api/wechat/user?code=%s", common.WeChatServerAddress, code), nil)
	if err != nil {
		common.SysLog(err.Error())
		return "", err
	}

	// 设置请求头中的Authorization字段
	req.Header.Set("Authorization", common.WeChatServerToken)

	// 创建HTTP客户端并发送请求
	client := http.Client{
		Timeout: 5 * time.Second,
	}

	httpResponse, err := client.Do(req)
	if err != nil {
		common.SysLog(err.Error())
		return "", err
	}
	defer httpResponse.Body.Close()

	// 解析响应体中的JSON数据
	var res WechatOAuthResponse
	if err := json.NewDecoder(httpResponse.Body).Decode(&res); err != nil {
		common.SysLog(err.Error())
		return "", err
	}

	// 检查响应是否成功
	if !res.Success {
		common.SysLog(res.Message)
		return "", errors.New(res.Message)
	}

	// 检查返回的数据是否为空
	if res.Data == "" {
		return "", errors.New("验证码错误或已过期")
	}

	// 返回用户ID
	return res.Data, nil
}
