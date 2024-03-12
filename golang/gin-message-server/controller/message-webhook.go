package controller

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"strings"
	"zhongjyuan/gin-message-server/common"
	"zhongjyuan/gin-message-server/model"

	"github.com/gin-gonic/gin"
	"github.com/tidwall/gjson"
)

// AddWebHook 用于添加 WebHook。
//
// 输入参数：
//   - c: *gin.Context，HTTP 请求上下文
//
// 输出参数：
//   - 无。
func AddWebHook(c *gin.Context) {
	webHookData := model.WebHookEntity{}
	if err := c.ShouldBindJSON(&webHookData); err != nil {
		// 发送包含错误信息的失败 JSON 响应
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	if len(webHookData.Name) == 0 || len(webHookData.Name) > 20 {
		// 发送名称长度错误的失败 JSON 响应
		common.SendFailureJSONResponse(c, "通道名称长度必须在1-20之间")
		return
	}

	webHookEntity := model.WebHookEntity{
		Name:          webHookData.Name,
		Link:          common.GetUUID(),
		Channel:       webHookData.Channel,
		ExtractRule:   webHookData.ExtractRule,
		ConstructRule: webHookData.ConstructRule,
		Status:        common.WebHookStatusEnabled,
		UserId:        c.GetInt("id"),
		CreateTime:    common.GetTimestamp(),
	}

	if err := webHookEntity.Insert(); err != nil {
		// 发送包含错误信息的失败 JSON 响应
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 发送成功 JSON 响应
	common.SendSuccessJSONResponse(c, "添加成功", nil)
}

// DeleteWebhook 用于删除特定用户的特定 WebHook。
//
// 输入参数：
//   - c: *gin.Context，HTTP 请求上下文
//
// 输出参数：
//   - 无。
func DeleteWebhook(c *gin.Context) {
	userId := c.GetInt("id") // 获取请求中的用户ID参数

	id, err := strconv.Atoi(c.Param("id")) // 解析请求中的WebHook ID参数
	if err != nil {
		// 发送包含错误信息的失败 JSON 响应
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	if _, err := model.DeleteWebHookByID(id, userId); err != nil {
		// 发送包含错误信息的失败 JSON 响应
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 发送成功 JSON 响应，表示删除成功
	common.SendSuccessJSONResponse(c, "删除成功", nil)
}

// UpdateWebhook 用于更新特定用户的特定 WebHook。
//
// 输入参数：
//   - c: *gin.Context，HTTP 请求上下文
//
// 输出参数：
//   - 无。
func UpdateWebhook(c *gin.Context) {
	userId := c.GetInt("id")            // 获取请求中的用户ID参数
	withStatus := c.Query("withStatus") // 解析查询参数 withStatus

	webHookData := model.WebHookEntity{}
	if err := c.ShouldBindJSON(&webHookData); err != nil {
		// 发送包含错误信息的失败 JSON 响应
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	originWebHookEntity, err := model.GetWebHookByID(webHookData.Id, userId)
	if err != nil {
		// 发送包含错误信息的失败 JSON 响应
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	webHookEntity := *originWebHookEntity
	if withStatus != "" {
		webHookEntity.Status = webHookData.Status
	} else {
		// 如果您添加了更多字段，请同时更新 webhook_.Update()
		webHookEntity.Name = webHookData.Name
		webHookEntity.ExtractRule = webHookData.ExtractRule
		webHookEntity.ConstructRule = webHookData.ConstructRule
		webHookEntity.Channel = webHookData.Channel
	}

	if err = webHookEntity.Update(); err != nil {
		// 发送包含错误信息的失败 JSON 响应
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 发送成功 JSON 响应，表示更新成功，并携带更新后的 WebHook 数据
	common.SendSuccessJSONResponse(c, "更新成功", webHookEntity)
}

// GetAllWebHooks 用于获取特定用户的所有 WebHooks。
//
// 输入参数：
//   - c: *gin.Context，HTTP 请求上下文
//
// 输出参数：
//   - 无。
func GetAllWebHooks(c *gin.Context) {
	userId := c.GetInt("id") // 获取请求中的用户ID参数

	p, _ := strconv.Atoi(c.Query("p")) // 解析分页参数
	if p < 0 {
		p = 0
	}

	webHooks, err := model.GetUserPageWebHooks(userId, p*common.ItemsPerPage, common.ItemsPerPage)
	if err != nil {
		// 发送包含错误信息的失败 JSON 响应
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 发送成功 JSON 响应，携带获取到的 WebHooks 数据
	common.SendSuccessJSONResponse(c, "获取成功", webHooks)
}

// GetWebhook 用于获取特定用户的特定 WebHook。
//
// 输入参数：
//   - c: *gin.Context，HTTP 请求上下文
//
// 输出参数：
//   - 无。
func GetWebhook(c *gin.Context) {
	userId := c.GetInt("id") // 获取请求中的用户ID参数

	id, err := strconv.Atoi(c.Param("id")) // 解析请求中的WebHook ID参数
	if err != nil {
		// 发送包含错误信息的失败 JSON 响应
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	webHookEntity, err := model.GetWebHookByID(id, userId)
	if err != nil {
		// 发送包含错误信息的失败 JSON 响应
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 发送成功 JSON 响应，携带获取到的 WebHook 数据
	common.SendSuccessJSONResponse(c, "获取成功", webHookEntity)
}

// SearchWebHooks 用于搜索特定用户的 WebHooks。
//
// 输入参数：
//   - c: *gin.Context，HTTP 请求上下文
//
// 输出参数：
//   - 无。
func SearchWebHooks(c *gin.Context) {
	userId := c.GetInt("id") // 获取请求中的用户ID参数

	keyword := c.Query("keyword")
	if strings.HasPrefix(keyword, common.ServerAddress+"/webhook/") {
		keyword = strings.TrimPrefix(keyword, common.ServerAddress+"/webhook/")
	}

	webHooks, err := model.SearchWebHooks(userId, keyword)
	if err != nil {
		// 发送包含错误信息的失败 JSON 响应
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 发送成功 JSON 响应，携带检索到的 WebHooks 数据
	common.SendSuccessJSONResponse(c, "检索成功", webHooks)
}

// TriggerWebhook 用于触发特定 WebHook 的操作。
//
// 输入参数：
//   - c: *gin.Context，HTTP 请求上下文
//
// 输出参数：
//   - 无。
func TriggerWebhook(c *gin.Context) {
	// 读取 HTTP 请求体中的 JSON 数据
	jsonData, err := io.ReadAll(c.Request.Body)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}
	reqText := string(jsonData)

	// 获取 URL 参数中的链接信息
	link := c.Param("link")
	webHook, err := model.GetWebHookByLink(link)
	if err != nil {
		common.SendFailureJSONResponse(c, "WebHook 不存在")
		return
	}

	// 检查 WebHook 是否处于启用状态
	if webHook.Status != common.WebHookStatusEnabled {
		common.SendFailureJSONResponse(c, "WebHook 未启用")
		return
	}

	// 获取 WebHook 所属用户信息
	user, err := model.GetUserByID(webHook.UserId, false)
	if err != nil {
		common.SendFailureJSONResponse(c, "用户不存在")
		return
	}

	// 检查用户是否处于启用状态
	if user.Status != common.UserStatusEnabled {
		common.SendFailureJSONResponse(c, "用户已被封禁")
		return
	}

	// 解析 WebHook 的提取规则并处理请求数据
	extractRule := make(map[string]string)
	if err = json.Unmarshal([]byte(webHook.ExtractRule), &extractRule); err != nil {
		common.SendJSONResponse(c, http.StatusInternalServerError, false, "WebHook 提取规则解析失败")
		return
	}

	for key, value := range extractRule {
		variableValue := gjson.Get(reqText, value).String()
		webHook.ConstructRule = strings.Replace(webHook.ConstructRule, "$"+key, variableValue, -1)
	}

	// 解析 WebHook 的构建规则
	constructRule := model.WebHookConstructRule{}
	if err = json.Unmarshal([]byte(webHook.ConstructRule), &constructRule); err != nil {
		common.SendFailureJSONResponse(c, "WebHook 构建规则解析失败")
		return
	}

	// 创建消息实体并处理消息
	messageEntity := &model.MessageEntity{
		Title:       constructRule.Title,
		Content:     constructRule.Content,
		URL:         constructRule.URL,
		Channel:     webHook.Channel,
		Description: constructRule.Description,
	}

	processMessage(c, messageEntity, user)
}
