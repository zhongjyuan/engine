package controller

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"
	"zhongjyuan/gin-ai-server/common"
	"zhongjyuan/gin-ai-server/model"
	"zhongjyuan/gin-ai-server/monitor"
	relayhelper "zhongjyuan/gin-ai-server/relay/helper"
	relaymodel "zhongjyuan/gin-ai-server/relay/model"

	"github.com/gin-gonic/gin"
)

// NewAuthHeader 用于生成包含身份验证头部的 HTTP 头部。
//
// 输入参数：
//   - token string: 身份验证令牌。
//
// 输出参数：
//   - http.Header: 包含身份验证头部的 HTTP 头部对象。
func NewAuthHeader(token string) http.Header {
	// 创建一个空的 http.Header 对象
	h := http.Header{}
	// 添加 Authorization 头部，格式为 Bearer 加上传入的 token
	h.Add("Authorization", fmt.Sprintf("Bearer %s", token))
	return h
}

// FetchHTTPResponse 执行 HTTP 请求并返回响应体。
//
// 输入参数：
//   - method: HTTP 请求方法，如 GET、POST 等。
//   - url: 请求的 URL 地址。
//   - channel: Channel 实体对象。
//   - headers: 包含请求头部信息的 HTTP 头部对象。
//
// 输出参数：
//   - []byte: 请求响应体的字节数据。
//   - error: 执行过程中遇到的任何错误。
func FetchHTTPResponse(method, url string, channel *model.ChannelEntity, headers http.Header) ([]byte, error) {
	// 创建 HTTP 请求
	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		return nil, err
	}

	// 将传入的头部信息添加到请求中
	for key := range headers {
		req.Header.Add(key, headers.Get(key))
	}

	// 发起 HTTP 请求并获取响应
	res, err := relayhelper.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	// 检查响应状态码
	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d", res.StatusCode)
	}

	// 读取响应体内容
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	return body, nil
}

// updateChannelCloseAIBalance 用于更新 CloseAI 渠道的余额信息并返回更新后的余额数。
//
// 输入参数：
//   - channel *model.ChannelEntity: 要更新的渠道实体对象。
//
// 输出参数：
//   - float64: 更新后的总可用余额。
//   - error: 执行过程中遇到的任何错误。
func updateChannelCloseAIBalance(channel *model.ChannelEntity) (float64, error) {
	// 构建请求 URL
	url := fmt.Sprintf("%s/dashboard/billing/credit_grants", channel.GetBaseURL())

	// 发起 HTTP GET 请求获取响应体
	body, err := FetchHTTPResponse("GET", url, channel, NewAuthHeader(channel.Key))
	if err != nil {
		return 0, err
	}

	// 解析 JSON 响应体到结构体
	response := relaymodel.AICreditGrants{}
	if err = json.Unmarshal(body, &response); err != nil {
		return 0, err
	}

	// 更新渠道余额，并返回更新后的余额数
	channel.UpdateBalance(response.TotalAvailable)
	return response.TotalAvailable, nil
}

// updateChannelOpenAISBBalance 用于更新 OpenAI-SB 渠道的余额信息并返回更新后的余额数。
//
// 输入参数：
//   - channel *model.ChannelEntity: 要更新的渠道实体对象。
//
// 输出参数：
//   - float64: 更新后的总可用余额。
//   - error: 执行过程中遇到的任何错误。
func updateChannelOpenAISBBalance(channel *model.ChannelEntity) (float64, error) {
	// 构建请求 URL
	url := fmt.Sprintf("https://api.openai-sb.com/sb-api/user/status?api_key=%s", channel.Key)

	// 发起 HTTP GET 请求获取响应体
	body, err := FetchHTTPResponse("GET", url, channel, NewAuthHeader(channel.Key))
	if err != nil {
		return 0, err
	}

	// 解析 JSON 响应体到结构体
	response := relaymodel.AISBUsageResponse{}
	if err = json.Unmarshal(body, &response); err != nil {
		return 0, err
	}

	// 检查响应数据是否为空
	if response.Data == nil {
		return 0, errors.New(response.Msg)
	}

	// 解析余额信息并更新渠道余额
	balance, err := strconv.ParseFloat(response.Data.Credit, 64)
	if err != nil {
		return 0, err
	}

	channel.UpdateBalance(balance)
	return balance, nil
}

// updateChannelAIProxyBalance 用于更新 AIProxy 渠道的余额信息并返回更新后的余额数。
//
// 输入参数：
//   - channel *model.ChannelEntity: 要更新的渠道实体对象。
//
// 输出参数：
//   - float64: 更新后的总可用余额。
//   - error: 执行过程中遇到的任何错误。
func updateChannelAIProxyBalance(channel *model.ChannelEntity) (float64, error) {
	// 设置请求 URL 和头部信息
	url := "https://aiproxy.io/api/report/getUserOverview"
	headers := http.Header{}
	headers.Add("Api-Key", channel.Key)

	// 发起 HTTP GET 请求获取响应体
	body, err := FetchHTTPResponse("GET", url, channel, headers)
	if err != nil {
		return 0, err
	}

	// 解析 JSON 响应体到结构体
	response := relaymodel.AIProxyUserOverviewResponse{}
	if err = json.Unmarshal(body, &response); err != nil {
		return 0, err
	}

	// 检查响应数据是否成功，如果不成功则返回错误信息
	if !response.Success {
		return 0, fmt.Errorf("code: %d, message: %s", response.ErrorCode, response.Message)
	}

	// 更新渠道余额，并返回更新后的余额数
	channel.UpdateBalance(response.Data.TotalPoints)
	return response.Data.TotalPoints, nil
}

// updateChannelAPI2GPTBalance 用于更新 API2GPT 渠道的余额信息并返回更新后的余额数。
//
// 输入参数：
//   - channel *model.ChannelEntity: 要更新的渠道实体对象。
//
// 输出参数：
//   - float64: 更新后的总可用余额。
//   - error: 执行过程中遇到的任何错误。
func updateChannelAPI2GPTBalance(channel *model.ChannelEntity) (float64, error) {
	// 设置请求 URL
	url := "https://api.api2gpt.com/dashboard/billing/credit_grants"

	// 发起 HTTP GET 请求获取响应体
	body, err := FetchHTTPResponse("GET", url, channel, NewAuthHeader(channel.Key))
	if err != nil {
		return 0, err
	}

	// 解析 JSON 响应体到结构体
	response := relaymodel.AIGPTAPIUsageResponse{}
	if err = json.Unmarshal(body, &response); err != nil {
		return 0, err
	}

	// 更新渠道余额，并返回更新后的余额数
	channel.UpdateBalance(response.TotalRemaining)
	return response.TotalRemaining, nil
}

// updateChannelAIGC2DBalance 用于更新 AIGC2D 渠道的余额信息并返回更新后的余额数。
//
// 输入参数：
//   - channel *model.ChannelEntity: 要更新的渠道实体对象。
//
// 输出参数：
//   - float64: 更新后的总可用余额。
//   - error: 执行过程中遇到的任何错误。
func updateChannelAIGC2DBalance(channel *model.ChannelEntity) (float64, error) {
	// 设置请求 URL
	url := "https://api.aigc2d.com/dashboard/billing/credit_grants"

	// 发起 HTTP GET 请求获取响应体
	body, err := FetchHTTPResponse("GET", url, channel, NewAuthHeader(channel.Key))
	if err != nil {
		return 0, err
	}

	// 解析 JSON 响应体到结构体
	response := relaymodel.AIGPTAPGCUsageResponse{}
	if err = json.Unmarshal(body, &response); err != nil {
		return 0, err
	}

	// 更新渠道余额，并返回更新后的余额数
	channel.UpdateBalance(response.TotalAvailable)
	return response.TotalAvailable, nil
}

// updateChannelBalance 用于更新渠道的余额信息并返回更新后的余额数。
//
// 输入参数：
//   - channel *model.ChannelEntity: 要更新的渠道实体对象。
//
// 输出参数：
//   - float64: 更新后的总可用余额。
//   - error: 执行过程中遇到的任何错误。
func updateChannelBalance(channel *model.ChannelEntity) (float64, error) {
	// 获取渠道类型对应的基本URL
	baseURL := common.ChannelBaseURLs[channel.Type]

	// 如果渠道没有设置基本URL，则使用默认的基本URL
	if channel.GetBaseURL() == "" {
		channel.BaseURL = &baseURL
	}

	// 根据渠道类型处理不同的逻辑
	switch channel.Type {
	case common.ChannelTypeOpenAI:
		// 如果渠道已经设置了基本URL，则使用渠道自定义的基本URL
		if channel.GetBaseURL() != "" {
			baseURL = channel.GetBaseURL()
		}
	case common.ChannelTypeAzure:
		return 0, errors.New("尚未实现")
	case common.ChannelTypeCustom:
		// 使用渠道自定义的基本URL
		baseURL = channel.GetBaseURL()
	case common.ChannelTypeCloseAI:
		return updateChannelCloseAIBalance(channel)
	case common.ChannelTypeOpenAISB:
		return updateChannelOpenAISBBalance(channel)
	case common.ChannelTypeAIProxy:
		return updateChannelAIProxyBalance(channel)
	case common.ChannelTypeAPI2GPT:
		return updateChannelAPI2GPTBalance(channel)
	case common.ChannelTypeAIGC2D:
		return updateChannelAIGC2DBalance(channel)
	default:
		return 0, errors.New("尚未实现")
	}

	// 构建请求URL
	url := fmt.Sprintf("%s/v1/dashboard/billing/subscription", baseURL)

	// 发起 HTTP GET 请求获取响应体
	body, err := FetchHTTPResponse("GET", url, channel, NewAuthHeader(channel.Key))
	if err != nil {
		return 0, err
	}

	// 解析 JSON 响应体到结构体
	subscription := relaymodel.AISubscribeResponse{}
	if err = json.Unmarshal(body, &subscription); err != nil {
		return 0, err
	}

	// 获取当前时间
	now := time.Now()

	// 设置开始日期和结束日期
	startDate := fmt.Sprintf("%s-01", now.Format("2006-01"))
	endDate := now.Format("2006-01-02")

	// 如果订阅没有支付方式，则将开始日期设置为100天前
	if !subscription.HasPaymentMethod {
		startDate = now.AddDate(0, 0, -100).Format("2006-01-02")
	}

	// 构建请求URL
	url = fmt.Sprintf("%s/v1/dashboard/billing/usage?start_date=%s&end_date=%s", baseURL, startDate, endDate)

	// 发起 HTTP GET 请求获取响应体
	body, err = FetchHTTPResponse("GET", url, channel, NewAuthHeader(channel.Key))
	if err != nil {
		return 0, err
	}

	// 解析 JSON 响应体到结构体
	usage := relaymodel.AIUsageResponse{}
	if err = json.Unmarshal(body, &usage); err != nil {
		return 0, err
	}

	// 计算余额
	balance := subscription.HardLimitUSD - usage.TotalUsage/100

	// 更新渠道余额，并返回更新后的余额数
	channel.UpdateBalance(balance)
	return balance, nil
}

// UpdateChannelBalance 用于更新渠道余额信息并返回更新后的余额数。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象。
//
// 输出参数：
//   - 无。
func UpdateChannelBalance(c *gin.Context) {
	// 从 URL 参数中获取渠道 ID
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 根据渠道 ID 获取渠道实体对象
	channel, err := model.GetChannelByID(id, true)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 调用更新渠道余额函数
	balance, err := updateChannelBalance(channel)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 返回成功响应
	common.SendSuccessJSONResponse(c, "更新完成", balance)
}

// updateAllChannelsBalance 用于更新所有渠道的余额信息。
//
// 输出参数：
//   - error: 执行过程中遇到的任何错误。
func updateAllChannelsBalance() error {
	// 获取所有渠道信息
	channels, err := model.GetPageChannels(0, 0, "all")
	if err != nil {
		return err
	}

	// 遍历所有渠道并更新余额信息
	for _, channel := range channels {
		// 如果渠道状态不是已启用，则跳过
		if channel.Status != common.ChannelStatusEnabled {
			continue
		}

		// TODO: 添加对 Azure 的支持
		if channel.Type != common.ChannelTypeOpenAI && channel.Type != common.ChannelTypeCustom {
			continue
		}

		// 更新渠道余额
		balance, err := updateChannelBalance(channel)
		if err != nil {
			continue
		} else {
			// 如果没有错误且余额小于等于 0，表示配额已用完，禁用该渠道
			if balance <= 0 {
				monitor.DisableChannel(channel.Id, channel.Name, "余额不足")
			}
		}
		time.Sleep(common.RequestInterval)
	}
	return nil
}

// UpdateAllChannelsBalance 用于更新所有渠道的余额信息并返回更新结果。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象。
//
// 输出参数：
//   - 无。
func UpdateAllChannelsBalance(c *gin.Context) {
	// 调用更新所有渠道余额函数
	if err := updateAllChannelsBalance(); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 返回成功响应
	common.SendSuccessJSONResponse(c, "更新完成", nil)
}

// AutomaticallyUpdateChannels 用于定时自动更新所有渠道的余额信息。
//
// 输入参数：
//   - frequency int: 更新频率，以分钟为单位。
//
// 输出参数：
//   - 无。
func AutomaticallyUpdateChannels(frequency int) {
	for {
		time.Sleep(time.Duration(frequency) * time.Minute)
		common.SysLog("updating all channels")
		_ = updateAllChannelsBalance()
		common.SysLog("channels update done")
	}
}
