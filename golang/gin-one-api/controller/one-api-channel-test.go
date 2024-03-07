package controller

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strconv"
	"sync"
	"time"
	"zhongjyuan/gin-one-api/common"
	"zhongjyuan/gin-one-api/model"
	"zhongjyuan/gin-one-api/relay"
	relaycommon "zhongjyuan/gin-one-api/relay/common"
	relayhelper "zhongjyuan/gin-one-api/relay/helper"
	relaymodel "zhongjyuan/gin-one-api/relay/model"

	"github.com/gin-gonic/gin"
)

// NewTestRequest 构建一个测试请求对象，并返回该对象。
func NewTestRequest() *relaymodel.AIRequest {
	// 创建测试请求对象
	return &relaymodel.AIRequest{
		MaxTokens: 1,
		Stream:    false,
		Model:     "gpt-3.5-turbo",
		Messages: []relaymodel.AIMessage{
			{
				Role:    "user",
				Content: "hi",
			},
		},
	}
}

// testChannel 用于测试通道。
//
// 输入参数：
//   - channel (*model.ChannelEntity): 要测试的通道实体。
//
// 输出参数：
//   - *relaymodel.Error: OpenAI 返回的错误信息。
//   - error: 函数执行过程中遇到的错误。
func testChannel(channel *model.ChannelEntity) (*relaymodel.Error, error) {
	// 创建 HTTP 测试记录器
	recorder := httptest.NewRecorder()
	context, _ := gin.CreateTestContext(recorder)
	context.Request = &http.Request{
		Method: "POST",
		URL:    &url.URL{Path: "/v1/chat/completions"},
		Body:   nil,
		Header: make(http.Header),
	}
	context.Request.Header.Set("Authorization", "Bearer "+channel.Key)
	context.Request.Header.Set("Content-Type", "application/json")
	context.Set("channel", channel.Type)
	context.Set("baseUrl", channel.GetBaseURL())

	// 创建 AIRelayMeta 对象
	meta := relayhelper.NewAIRelayMeta(context)

	// 获取适配器并初始化
	apiType := relaycommon.GetApiTypeByChannelType(channel.Type)
	adaptor := relay.GetAdaptor(apiType)
	if adaptor == nil {
		return nil, fmt.Errorf("invalid api type: %d, adaptor is nil", apiType)
	}
	adaptor.Init(meta)

	// 获取模型名称并构建请求
	modelName := adaptor.GetModelList()[0]
	testRequest := NewTestRequest()
	testRequest.Model = modelName
	meta.OriginModelName, meta.ActualModelName = modelName, modelName
	convertedRequest, err := adaptor.ConvertRequest(context, relaycommon.RelayModeChatCompletions, testRequest)
	if err != nil {
		return nil, err
	}

	// 发送请求并处理响应
	requestData, err := json.Marshal(convertedRequest)
	if err != nil {
		return nil, err
	}
	requestBody := bytes.NewBuffer(requestData)
	context.Request.Body = io.NopCloser(requestBody)
	response, err := adaptor.DoRequest(context, meta, requestBody)
	if err != nil {
		return nil, err
	}

	// 检查响应状态码
	if response.StatusCode != http.StatusOK {
		err := relayhelper.NewHTTPError(response)
		return &err.Error, fmt.Errorf("status code %d: %s", response.StatusCode, err.Error.Message)
	}

	// 处理响应数据
	usage, responseError := adaptor.DoResponse(context, response, meta)
	if responseError != nil {
		return &responseError.Error, fmt.Errorf("%s", responseError.Error.Message)
	}
	if usage == nil {
		return nil, errors.New("usage is nil")
	}

	// 输出测试结果
	result := recorder.Result()
	responseBody, err := io.ReadAll(result.Body)
	if err != nil {
		return nil, err
	}
	common.SysLog(fmt.Sprintf("testing channel #%d, response: \n%s", channel.Id, string(responseBody)))

	return nil, nil
}

// TestChannel 用于测试通道。
//
// 输入参数：
//   - c (*gin.Context): Gin 上下文对象。
//
// 输出参数：
//   - 无。
func TestChannel(c *gin.Context) {
	// 解析通道ID
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 获取通道信息
	channel, err := model.GetChannelByID(id, true)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 测试通道并更新响应时间
	tik := time.Now()
	resultErr, testErr := testChannel(channel)
	tok := time.Now()
	milliseconds := tok.Sub(tik).Milliseconds()
	go channel.UpdateResponseTime(milliseconds)
	consumedTime := float64(milliseconds) / 1000.0

	// 处理测试结果并返回相应
	if testErr != nil {
		common.SendJSONResponse(c, http.StatusOK, false, testErr.Error(), consumedTime)
		return
	}

	common.SendSuccessJSONResponse(c, resultErr.Message, consumedTime)
}

// testAllChannelsLock 用于保护测试所有通道的锁。
var testAllChannelsLock sync.Mutex

// testAllChannelsRunning 表示是否正在测试所有通道。
var testAllChannelsRunning bool = false

// notifyRootUser 用于通知根用户。
//
// 输入参数：
//   - subject (string): 邮件主题。
//   - content (string): 邮件内容。
//
// 输出参数：
//   - 无。
func notifyRootUser(subject string, content string) {
	// 如果根用户电子邮件为空，则获取管理员用户电子邮件
	if common.RootUserEmail == "" {
		common.RootUserEmail, _ = model.GetAdminUserEmail()
	}

	// 发送邮件通知根用户
	if err := common.SendEmail(subject, common.RootUserEmail, content); err != nil {
		common.SysError(fmt.Sprintf("failed to send email: %s", err.Error()))
	}
}

// disableChannel 用于禁用通道。并通知根用户
//
// 输入参数：
//   - channelId (int): 要禁用的通道ID。
//   - channelName (string): 通道名称。
//   - reason (string): 禁用原因。
//
// 输出参数：
//   - 无。
func disableChannel(channelId int, channelName string, reason string) {
	// 更新通道状态为自动禁用
	model.UpdateChannelStatusByID(channelId, common.ChannelStatusAutoDisabled)

	// 构建邮件主题和内容
	subject := fmt.Sprintf("通道「%s」（#%d）已被禁用", channelName, channelId)
	content := fmt.Sprintf("通道「%s」（#%d）已被禁用，原因：%s", channelName, channelId, reason)

	// 通知根用户
	notifyRootUser(subject, content)
}

// enableChannel 用于启用通道。并通知根用户
//
// 输入参数：
//   - channelId (int): 要启用的通道ID。
//   - channelName (string): 通道名称。
//
// 输出参数：
//   - 无。
func enableChannel(channelId int, channelName string) {
	// 更新通道状态为已启用
	model.UpdateChannelStatusByID(channelId, common.ChannelStatusEnabled)

	// 构建邮件主题和内容
	subject := fmt.Sprintf("通道「%s」（#%d）已被启用", channelName, channelId)
	content := fmt.Sprintf("通道「%s」（#%d）已被启用", channelName, channelId)

	// 通知根用户
	notifyRootUser(subject, content)
}

// testAllChannels 用于测试所有通道。
//
// 输入参数：
//   - notify (bool): 是否发送通知。
//
// 输出参数：
//   - error: 如果发生错误，则返回错误信息；否则返回 nil。
func testAllChannels(notify bool) error {
	// 获取根用户邮箱
	if common.RootUserEmail == "" {
		common.RootUserEmail, _ = model.GetAdminUserEmail()
	}

	// 加锁以检查测试是否正在运行
	testAllChannelsLock.Lock()
	if testAllChannelsRunning {
		testAllChannelsLock.Unlock()
		return errors.New("测试已在运行中")
	}
	testAllChannelsRunning = true
	testAllChannelsLock.Unlock()

	// 获取所有通道
	channels, err := model.GetPageChannels(0, 0, true)
	if err != nil {
		return err
	}

	// 设置禁用阈值
	var disableThreshold = int64(common.ChannelDisableThreshold * 1000)
	if disableThreshold == 0 {
		disableThreshold = 10000000 // 一个不可能的值
	}

	// 启动协程进行通道测试
	go func() {
		for _, channel := range channels {
			isChannelEnabled := channel.Status == common.ChannelStatusEnabled

			tik := time.Now()
			openaiErr, err := testChannel(channel)
			tok := time.Now()
			milliseconds := tok.Sub(tik).Milliseconds()

			// 超过响应时间阈值，禁用通道
			if isChannelEnabled && milliseconds > disableThreshold {
				err = fmt.Errorf("响应时间 %.2fs 超过阈值 %.2fs", float64(milliseconds)/1000.0, float64(disableThreshold)/1000.0)
				disableChannel(channel.Id, channel.Name, err.Error())
			}

			// 根据错误情况禁用或启用通道
			if isChannelEnabled && relayhelper.ShouldDisableChannel(openaiErr, -1) {
				disableChannel(channel.Id, channel.Name, err.Error())
			}

			if !isChannelEnabled && relayhelper.ShouldEnableChannel(err, openaiErr) {
				enableChannel(channel.Id, channel.Name)
			}

			// 更新通道响应时间并等待一段时间后继续测试下一个通道
			channel.UpdateResponseTime(milliseconds)
			time.Sleep(common.RequestInterval)
		}

		// 测试完成，解锁测试状态，并发送完成通知邮件（如果需要）
		testAllChannelsLock.Lock()
		testAllChannelsRunning = false
		testAllChannelsLock.Unlock()

		if notify {
			if err := common.SendEmail("通道测试完成", common.RootUserEmail, "通道测试完成，如果没有收到禁用通知，说明所有通道都正常"); err != nil {
				common.SysError(fmt.Sprintf("failed to send email: %s", err.Error()))
			}
		}
	}()

	return nil
}

// TestAllChannels 用于在 Gin 上下文中测试所有通道。
//
// 输入参数：
//   - c (*gin.Context): Gin 上下文对象。
//
// 输出参数：
//   - 无。
func TestAllChannels(c *gin.Context) {
	// 调用 testAllChannels 进行通道测试，并处理可能的错误
	if err := testAllChannels(true); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 发送成功响应
	common.SendSuccessJSONResponse(c, "测试完成", nil)
}

// AutomaticallyTestChannels 用于定时自动测试通道。
//
// 输入参数：
//   - frequency (int): 测试频率，以分钟为单位。
//
// 输出参数：
//   - 无。
func AutomaticallyTestChannels(frequency int) {
	for {
		time.Sleep(time.Duration(frequency) * time.Minute) // 等待指定的时间间隔
		common.SysLog("testing all channels")              // 记录日志，开始测试所有通道
		_ = testAllChannels(false)                         // 执行通道测试，忽略可能的错误
		common.SysLog("channel test finished")             // 记录日志，通道测试完成
	}
}
