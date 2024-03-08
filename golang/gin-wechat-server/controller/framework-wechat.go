package controller

import (
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"encoding/xml"
	"errors"
	"fmt"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"
	"zhongjyuan/gin-wechat-server/common"
	"zhongjyuan/gin-wechat-server/middleware"
	"zhongjyuan/gin-wechat-server/model"

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

// WeChatVerification 用于验证微信接入。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含请求信息和响应方法。
//
// 输出参数：
//   - 无。
func WeChatVerification(c *gin.Context) {
	// https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Access_Overview.html

	// 获取请求中的参数
	nonce := c.Query("nonce")         // 微信请求中的随机数参数
	echoStr := c.Query("echostr")     // 微信请求中的回显字符串参数
	signature := c.Query("signature") // 微信请求中的签名参数
	timestamp := c.Query("timestamp") // 微信请求中的时间戳参数

	// 将 token、timestamp、nonce 进行排序并拼接成字符串
	arr := []string{common.WeChatToken, timestamp, nonce}
	sort.Strings(arr)
	str := strings.Join(arr, "")

	// 对拼接后的字符串进行 SHA1 哈希计算
	hash := sha1.Sum([]byte(str))
	hexStr := hex.EncodeToString(hash[:])

	// 校验签名是否匹配
	if signature == hexStr {
		c.String(http.StatusOK, echoStr) // 返回回显字符串
	} else {
		c.Status(http.StatusForbidden) // 签名不匹配，返回 Forbidden 状态码
	}
}

// WeChatMessageProcess 用于处理微信消息。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含请求信息和响应方法。
//
// 输出参数：
//   - 无。
func WeChatMessageProcess(c *gin.Context) {

	var req middleware.WeChatMessageRequest // 定义微信消息请求对象

	// 解析请求体中的 XML 数据到 req 对象
	if err := xml.NewDecoder(c.Request.Body).Decode(&req); err != nil {
		common.SysError(err.Error()) // 记录错误日志
		c.Abort()                    // 终止请求处理
		return
	}

	// 构造微信消息响应对象
	res := middleware.WeChatMessageResponse{
		ToUserName:   req.FromUserName,  // 响应消息的目标用户为请求消息的发送者
		FromUserName: req.ToUserName,    // 响应消息的发送者为请求消息的目标用户
		CreateTime:   time.Now().Unix(), // 响应消息的创建时间为当前时间戳
		MsgType:      "text",            // 响应消息的类型为文本消息
		Content:      "",                // 初始化响应消息的内容为空
	}

	// 调用中间件处理微信消息
	middleware.WeChatMessageProcess(&req, &res)

	// 如果响应消息的内容为空，则返回空字符串
	if res.Content == "" {
		c.String(http.StatusOK, "")
		return
	}

	c.XML(http.StatusOK, &res) // 返回响应消息的 XML 数据
}

// GetUserIDByCode 用于根据授权码获取用户ID。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含请求信息和响应方法。
//
// 输出参数：
//   - 无。
func GetUserIDByCode(c *gin.Context) {

	code := c.Query("code") // 获取请求中的授权码参数
	if code == "" {
		common.SendFailureJSONResponse(c, "无效的参数！")
		return
	}

	// 调用中间件根据授权码获取用户ID
	id := common.GetCodeByKey(code, common.WeChatVerificationPurpose)

	common.SendSuccessJSONResponse(c, "获取成功", id)
}

// GetWeChatAccessToken 用于获取访问令牌。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含请求信息和响应方法。
//
// 输出参数：
//   - 无。
func GetWeChatAccessToken(c *gin.Context) {
	// 调用中间件获取访问令牌和过期时间
	accessToken, expiration := middleware.GetWeChatAccessTokenAndExpiration()
	c.JSON(http.StatusOK, gin.H{
		"success":     true,
		"message":     "",
		"accessToken": accessToken,
		"expiration":  expiration,
	})
}
