package controller

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"
	"zhongjyuan/gin-message-server/channel"
	"zhongjyuan/gin-message-server/common"
	"zhongjyuan/gin-message-server/model"

	"github.com/gin-gonic/gin"
)

// keepCompatible 用于保持与 ServerChan（https://sct.ftqq.com/sendkey）的兼容性。
//
// 输入参数：
//   - message: 要处理的消息实体指针
//
// 输出参数：
//   - 无
func keepCompatible(message *model.MessageEntity) {
	// Keep compatible with ServerChan: https://sct.ftqq.com/sendkey
	if message.Description == "" {
		message.Description = message.Short
	}

	if message.Content == "" {
		message.Content = message.Desp
	}

	if message.To == "" {
		message.To = message.OpenId
	}
}

// pushMessage 用于辅助处理推送消息，检查用户状态及验证令牌，并调用消息处理函数。
//
// 输入参数：
//   - c: gin 上下文对象，包含 HTTP 请求信息
//   - message: 待推送的消息实体指针
//
// 输出参数：
//   - 无
func pushMessage(c *gin.Context, message *model.MessageEntity) {
	user := model.UserEntity{UserName: c.Param("username")} // 创建用户实体对象，根据请求中的用户名设置
	if err := user.GetByUserName(false); err != nil {       // 根据用户名获取用户信息
		common.SendFailureJSONResponse(c, err.Error()) // 若获取失败，返回错误响应
		return
	}

	// 检查用户状态
	switch user.Status {
	case common.UserStatusUnknown:
		common.SendFailureJSONResponse(c, "用户不存在") // 若用户不存在，返回用户不存在错误响应
		return
	case common.UserStatusDisabled:
		common.SendFailureJSONResponse(c, "用户已被封禁") // 若用户已被封禁，返回用户已封禁错误响应
		return
	}

	// 检查用户令牌
	if user.Token != "" && user.Token != " " {
		if message.Token == "" { // 若消息中无令牌，则尝试从 Authorization 头部获取
			message.Token = c.Request.Header.Get("Authorization")
			if message.Token == "" {
				common.SendFailureJSONResponse(c, "令牌不存在") // 若令牌不存在，返回令牌不存在错误响应
				return
			}
		}
		if user.Token != message.Token { // 检查用户令牌与消息令牌是否匹配
			common.SendFailureJSONResponse(c, "无效的令牌") // 若令牌不匹配，返回无效令牌错误响应
			return
		}
	}

	processMessage(c, message, &user) // 调用消息处理函数处理消息
}

// processMessage 用于处理消息，包括设置标题、渠道等信息，并保存并发送消息给用户。
//
// 输入参数：
//   - c: gin 上下文对象，包含 HTTP 请求信息
//   - message: 待处理的消息实体指针
//   - user: 用户实体指针，表示消息所属的用户
//
// 输出参数：
//   - 无
func processMessage(c *gin.Context, message *model.MessageEntity, user *model.UserEntity) {
	if message.Title == "" {
		message.Title = common.SystemName // 若消息标题为空，则设置为系统名称
	}

	if message.Channel == "" {
		message.Channel = user.Profile.Channel // 若消息渠道为空，则使用用户配置的渠道
		if message.Channel == "" {
			message.Channel = common.TypeEmail // 若用户未配置渠道，则默认为邮件渠道
		}
	}

	// 获取消息对应的渠道实体
	channelEntity, err := model.GetChannelByName(message.Channel, user.Id, false)
	if err != nil {
		common.SendFailureJSONResponse(c, "无效的渠道名称："+message.Channel) // 若获取渠道实体失败，返回错误响应
		return
	}

	// 保存并发送消息给用户
	if err := saveAndSendMessage(user, message, channelEntity); err != nil {
		common.SendFailureJSONResponse(c, err.Error()) // 若保存并发送消息失败，返回错误响应
		return
	}

	common.SendSuccessJSONResponse(c, "处理成功", message.Link) // 处理成功，返回成功响应
}

// saveAndSendMessage 用于保存并发送消息给用户，包括更新消息状态、生成消息链接等操作。
//
// 输入参数：
//   - user: 用户实体指针，表示接收消息的用户
//   - message: 待发送的消息实体指针
//   - channelEntity: 渠道实体指针，表示消息发送的渠道
//
// 输出参数：
//   - error: 如果保存并发送消息过程中出现错误，则返回相应错误信息；否则返回 nil。
func saveAndSendMessage(user *model.UserEntity, message *model.MessageEntity, channelEntity *model.ChannelEntity) error {
	if channelEntity.Status != common.ChannelStatusEnabled {
		return errors.New("该渠道已被禁用") // 若渠道已被禁用，返回错误
	}

	common.MessageCount += 1        // 增加消息计数（非关键值，无需使用原子操作）
	message.Link = common.GetUUID() // 生成消息链接唯一标识
	if message.URL == "" {
		message.URL = fmt.Sprintf("%s/message/%s", common.ServerAddress, message.Link) // 若消息 URL 为空，生成默认 URL
	}

	success := false
	if common.MessagePersistenceEnabled || user.Profile.SaveMessageToDatabase == common.SaveMessageToDatabaseAllowed {
		defer func() {
			// 更新消息状态
			status := common.MessageSendStatusFailed
			if message.Async {
				status = common.MessageSendStatusAsyncPending
			} else {
				if success {
					status = common.MessageSendStatusSent
				}
			}

			// 更新消息状态到数据库
			if err := message.UpdateStatus(status); err != nil {
				common.SysError("failed to update the status of the message: " + err.Error())
			}

			// 若消息为异步发送，则加入异步消息队列
			if message.Async {
				channel.AsyncMessageQueue <- message.Id
			}
		}()

		// 更新并插入消息到数据库
		if err := message.UpdateAndInsert(user.Id); err != nil {
			return err
		}

		// 异步发送消息给用户
		go sendSyncMessageToUser(message, user.Id)
	} else {
		if message.Async {
			return errors.New("异步发送消息需要用户具备消息持久化的权限") // 若用户无权限进行异步发送消息，返回错误
		}
		message.Link = "unsaved" // 用于标识未保存的消息
		go sendSyncMessageToUser(message, user.Id)
	}

	if !message.Async {
		if err := channel.SendMessage(message, user, channelEntity); err != nil {
			return err
		}
	}
	success = true
	return nil // 执行到此行后，消息状态将会被更新
}

// PostPushMessage 用于处理推送消息的 POST 请求，支持 JSON 或表单提交方式。
//
// 输入参数：
//   - c: gin 上下文对象，包含 HTTP 请求信息
//
// 输出参数：
//   - 无
func PostPushMessage(c *gin.Context) {
	var messageData model.MessageEntity

	// 检查请求头 Content-Type 是否为 application/json，决定使用 JSON 还是表单提交方式
	if c.Request.Header.Get("Content-Type") == "application/json" { // 用户使用 JSON 格式
		messageData = model.MessageEntity{}
		if err := json.NewDecoder(c.Request.Body).Decode(&messageData); err != nil {
			common.SendFailureJSONResponse(c, "无法解析请求体，请检查其是否为合法 JSON")
			return
		}
	} else { // 用户使用表单提交方式
		messageData = model.MessageEntity{
			Title:       c.PostForm("title"),           // 消息标题
			Content:     c.PostForm("content"),         // 消息内容
			To:          c.PostForm("to"),              // 接收者
			URL:         c.PostForm("url"),             // 消息链接
			Channel:     c.PostForm("channel"),         // 消息通道
			Description: c.PostForm("description"),     // 消息描述
			Token:       c.PostForm("token"),           // 访问令牌
			Desp:        c.PostForm("desp"),            // 详细描述
			Short:       c.PostForm("short"),           // 简短描述
			Async:       c.PostForm("async") == "true", // 是否异步推送
			OpenId:      c.PostForm("openid"),          // 用户 OpenID
		}
	}

	// 检查请求体是否为空
	if messageData == (model.MessageEntity{}) {
		common.SendFailureJSONResponse(c, "请求体为空，如果使用 JSON 请设置 Content-Type 为 application/json，否则请使用表单提交")
		return
	}

	// 如果访问令牌为空，则尝试从 URL 查询参数中获取
	if messageData.Token == "" {
		messageData.Token = c.Query("token")
	}

	keepCompatible(&messageData) // 保持与 ServerChan 的兼容性

	pushMessage(c, &messageData) // 调用推送消息助手函数实现消息推送
}

// DeleteAllMessages 用于删除所有消息。
//
// 输入参数：
//   - c: *gin.Context，HTTP 请求上下文
//
// 输出参数：
//   - 无。
func DeleteAllMessages(c *gin.Context) {
	if err := model.DeleteAllMessages(); err != nil {
		// 发送包含错误信息的失败 JSON 响应
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 发送成功 JSON 响应
	common.SendSuccessJSONResponse(c, "删除成功", nil)
}

// DeleteMessage 用于删除特定用户的特定消息。
//
// 输入参数：
//   - c: *gin.Context，HTTP 请求上下文
//
// 输出参数：
//   - 无。
func DeleteMessage(c *gin.Context) {
	userId := c.GetInt("id")                    // 获取请求中的用户ID参数
	messageId, _ := strconv.Atoi(c.Param("id")) // 解析请求中的消息ID参数

	if err := model.DeleteMessageByIDAnUserID(messageId, userId); err != nil {
		// 发送包含错误信息的失败 JSON 响应
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 发送成功 JSON 响应
	common.SendSuccessJSONResponse(c, "删除成功", nil)
}

// GetPushMessage 用于从 Gin 上下文中获取推送消息，并处理兼容性后推送消息。
//
// 输入参数：
//   - c: gin 上下文对象，包含 HTTP 请求信息
//
// 输出参数：
//   - 无
func GetPushMessage(c *gin.Context) {
	// 从 URL 查询参数中解析消息内容
	message := model.MessageEntity{
		Title:       c.Query("title"),           // 消息标题
		Content:     c.Query("content"),         // 消息内容
		To:          c.Query("to"),              // 接收者
		URL:         c.Query("url"),             // 消息链接
		Channel:     c.Query("channel"),         // 消息通道
		Description: c.Query("description"),     // 消息描述
		Token:       c.Query("token"),           // 访问令牌
		Desp:        c.Query("desp"),            // 详细描述
		Short:       c.Query("short"),           // 简短描述
		Async:       c.Query("async") == "true", // 是否异步推送
		OpenId:      c.Query("openid"),          // 用户 OpenID
	}

	keepCompatible(&message) // 保持与 ServerChan 的兼容性
	pushMessage(c, &message) // 调用推送消息助手函数实现消息推送
}

// GetMessage 用于获取特定用户的特定消息并返回给客户端。
//
// 输入参数：
//   - c: *gin.Context，HTTP 请求上下文
//
// 输出参数：
//   - 无。
func GetMessage(c *gin.Context) {
	userId := c.GetInt("id")                    // 获取请求中的用户ID参数
	messageId, _ := strconv.Atoi(c.Param("id")) // 解析请求中的消息ID参数

	// 调用模型方法获取特定用户的特定消息
	message, err := model.GetMessageByIDAnUserID(messageId, userId)
	if err != nil {
		// 发送包含错误信息的失败 JSON 响应
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 发送成功 JSON 响应，包含获取成功的消息
	common.SendSuccessJSONResponse(c, "获取成功", message)
}

// GetMessageStatus 用于获取消息状态并返回给客户端。
//
// 输入参数：
//   - c: *gin.Context，HTTP 请求上下文
//
// 输出参数：
//   - 无。
func GetMessageStatus(c *gin.Context) {
	link := c.Param("link")                           // 获取请求中的消息链接参数
	status, err := model.GetMessageStatusByLink(link) // 获取消息状态

	if err != nil {
		// 发送包含错误信息的失败 JSON 响应
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 发送成功 JSON 响应，包含获取成功的消息状态
	common.SendSuccessJSONResponse(c, "获取成功", status)
}

// GetUserMessages 用于获取用户的消息列表并返回给客户端。
//
// 输入参数：
//   - c: *gin.Context，HTTP 请求上下文
//
// 输出参数：
//   - 无。
func GetUserMessages(c *gin.Context) {
	userId := c.GetInt("id")           // 获取请求中的用户ID参数
	p, _ := strconv.Atoi(c.Query("p")) // 解析请求中的分页参数

	if p < 0 {
		p = 0 // 如果分页参数小于0，则将其设为0
	}

	// 调用模型方法获取用户指定页数的消息
	messages, err := model.GetUserPageMessages(userId, p*common.ItemsPerPage, common.ItemsPerPage)
	if err != nil {
		// 发送包含错误信息的失败 JSON 响应
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 发送成功 JSON 响应，包含获取成功的消息列表
	common.SendSuccessJSONResponse(c, "获取成功", messages)
}

// SearchMessages 用于根据关键词检索消息并返回给客户端。
//
// 输入参数：
//   - c: *gin.Context，HTTP 请求上下文
//
// 输出参数：
//   - 无。
func SearchMessages(c *gin.Context) {
	keyword := c.Query("keyword")                  // 获取请求中的关键词参数
	messages, err := model.SearchMessages(keyword) // 检索消息

	if err != nil {
		// 发送包含错误信息的失败 JSON 响应
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 发送成功 JSON 响应，包含检索成功的消息列表
	common.SendSuccessJSONResponse(c, "检索成功", messages)
}

// RenderMessage 用于渲染消息页面并返回给客户端。
//
// 输入参数：
//   - c: *gin.Context，HTTP 请求上下文
//
// 输出参数：
//   - 无。
func RenderMessage(c *gin.Context) {
	if !common.MessageRenderEnabled {
		// 如果消息渲染功能被禁用，则返回相应提示信息
		c.HTML(http.StatusOK, "message.html", gin.H{
			"title":       "无法渲染",
			"content":     "很抱歉，您所使用的消息推送服务的管理员禁用了消息渲染功能，因此您的消息无法渲染。",
			"description": "超级管理员禁用了消息渲染",
			"time":        time.Now().Format("2006-01-02 15:04:05"),
		})
		return
	}

	link := c.Param("link") // 获取请求中的消息链接参数
	if link == "unsaved" {
		// 如果消息链接为"unsaved"，表示未保存的消息，返回相应提示信息
		c.HTML(http.StatusOK, "message.html", gin.H{
			"title":       "无法渲染",
			"content":     "很抱歉，您所使用的消息推送服务的管理员禁用了消息持久化功能，您的消息并没有存储到数据库中，因此无法渲染。",
			"description": "超级管理员禁用了消息持久化",
			"time":        time.Now().Format("2006-01-02 15:04:05"),
		})
		return
	}

	message, err := model.GetMessageByLink(link) // 根据消息链接获取消息实体
	if err != nil {
		c.Status(http.StatusNotFound) // 若未找到对应消息，返回 404 状态码
		return
	}

	if message.Description != "" {
		// 将消息描述内容转换为 HTML 格式
		if message.Description, err = common.ConvertMarkdownToHTML(message.Description); err != nil {
			common.SysLog(err.Error())
		}
	}

	if message.Content != "" {
		// 将消息内容转换为 HTML 格式
		if message.HTMLContent, err = common.ConvertMarkdownToHTML(message.Content); err != nil {
			common.SysLog(err.Error())
		}
	}

	c.HTML(http.StatusOK, "message.html", gin.H{
		"title":       message.Title,                                                 // 设置消息标题
		"content":     message.HTMLContent,                                           // 设置消息内容（HTML 格式）
		"description": message.Description,                                           // 设置消息描述
		"time":        time.Unix(message.Timestamp, 0).Format("2006-01-02 15:04:05"), // 格式化消息时间
	})
}

// ResendMessage 用于重新发送消息给用户。
//
// 输入参数：
//   - c: *gin.Context，HTTP 请求上下文
//
// 输出参数：
//   - 无。
func ResendMessage(c *gin.Context) {
	userId := c.GetInt("id")                    // 获取请求中的用户ID参数
	messageId, _ := strconv.Atoi(c.Param("id")) // 解析请求中的消息ID参数

	helper := func() error {
		message, err := model.GetMessageByIDAnUserID(messageId, userId)
		if err != nil {
			return err
		}
		message.Id = 0

		user, err := model.GetUserByID(userId, true)
		if err != nil {
			return err
		}

		channelEntity, err := model.GetChannelByName(message.Channel, user.Id, false)
		if err != nil {
			return err
		}

		if err = saveAndSendMessage(user, message, channelEntity); err != nil {
			return err
		}

		return nil
	}

	if err := helper(); err != nil {
		// 发送包含错误信息的失败 JSON 响应
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 发送成功 JSON 响应
	common.SendSuccessJSONResponse(c, "重新发送成功", nil)
}
