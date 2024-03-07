package relaycontroller

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"zhongjyuan/gin-one-api/common"
	"zhongjyuan/gin-one-api/model"
	relayhelper "zhongjyuan/gin-one-api/relay/helper"
	relaymodel "zhongjyuan/gin-one-api/relay/model"

	"github.com/gin-gonic/gin"
)

// isWithinRange 函数用于检查给定值是否在指定范围内。
//
// 输入参数：
//   - element: 元素名称。
//   - value: 待检查的值。
//
// 输出参数：
//   - bool: 如果值在指定范围内，则返回 true；否则返回 false。
func isWithinRange(element string, value int) bool {
	if _, ok := common.DalleGenerationImageAmounts[element]; !ok {
		return false
	}
	min := common.DalleGenerationImageAmounts[element][0] // 获取最小值
	max := common.DalleGenerationImageAmounts[element][1] // 获取最大值

	return value >= min && value <= max // 检查值是否在范围内
}

// RelayImage 用于处理图像中继请求的帮助函数。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，包含请求信息和响应信息。
//   - relayMode int: 中继模式，用于指定中继方式。
//
// 输出参数：
//   - *relaymodel.HTTPError: 如果出现错误，返回 HTTP 错误信息；否则返回 nil。
func RelayImage(c *gin.Context, relayMode int) *relaymodel.HTTPError {
	// 从上下文中获取必要的参数

	imageModel := "dall-e-2" // 设置默认图片模型为 "dall-e-2"
	imageSize := "1024x1024" // 设置默认图片尺寸为 "1024x1024"

	userId := c.GetInt("id")       // 获取 userId 参数
	group := c.GetString("group")  // 获取 group 参数
	tokenId := c.GetInt("tokenId") // 获取 tokenId 参数

	channelId := c.GetInt("channelId") // 获取 channelId 参数
	channelType := c.GetInt("channel") // 获取 channelType 参数

	// 定义 AI 图像请求结构体变量
	var imageRequest relaymodel.AIImageRequest

	// 解析请求体到 imageRequest 变量
	if err := common.UnmarshalBodyReusable(c, &imageRequest); err != nil {
		return relayhelper.WrapHTTPError(err, "bind_request_body_failed", http.StatusBadRequest)
	}

	// 如果 N 为 0，则设置为默认值 1
	if imageRequest.N == 0 {
		imageRequest.N = 1
	}

	// 验证图像大小
	if imageRequest.Size != "" { // 如果请求中包含 Size 参数
		imageSize = imageRequest.Size
	}

	// 验证图像模型
	if imageRequest.Model != "" { // 如果请求中包含 Model 参数
		imageModel = imageRequest.Model
	}

	// 根据图片模型和尺寸获取成本比率和是否有效尺寸信息
	imageCostRatio, hasValidSize := common.DalleSizeRatios[imageModel][imageSize]

	// 检查模型是否支持
	if hasValidSize {
		if imageRequest.Quality == "hd" && imageModel == "dall-e-3" { // 如果请求中包含 Quality 参数且为 "hd"，且图片模型为 "dall-e-3"
			if imageSize == "1024x1024" { // 如果图片尺寸为 "1024x1024"
				imageCostRatio *= 2 // 成本比率乘以 2
			} else {
				imageCostRatio *= 1.5 // 否则成本比率乘以 1.5
			}
		}
	} else {
		return relayhelper.WrapHTTPError(errors.New("size not supported for this image model"), "size_not_supported", http.StatusBadRequest) // 返回尺寸不支持的 HTTP 错误
	}

	// 验证提示信息是否存在
	if imageRequest.Prompt == "" {
		return relayhelper.WrapHTTPError(errors.New("prompt is required"), "prompt_missing", http.StatusBadRequest)
	}

	// 检查提示信息长度
	if len(imageRequest.Prompt) > common.DalleImagePromptLengthLimitations[imageModel] {
		return relayhelper.WrapHTTPError(errors.New("prompt is too long"), "prompt_too_long", http.StatusBadRequest)
	}

	// 验证生成图像数量
	if !isWithinRange(imageModel, imageRequest.N) {
		// 若通道不是 Azure
		if channelType != common.ChannelTypeAzure {
			return relayhelper.WrapHTTPError(errors.New("invalid value of n"), "n_not_within_range", http.StatusBadRequest)
		}
	}

	isModelMapped := false                      // 设定模型是否被映射的标志
	modelMapping := c.GetString("modelMapping") // 获取模型映射信息

	if modelMapping != "" { // 如果有模型映射信息
		modelMap := make(map[string]string) // 创建模型映射的映射表

		// 解析模型映射信息到映射表
		if err := json.Unmarshal([]byte(modelMapping), &modelMap); err != nil {
			return relayhelper.WrapHTTPError(err, "unmarshal_model_mapping_failed", http.StatusInternalServerError)
		}
		if modelMap[imageModel] != "" { // 如果模型映射表中存在当前的图片模型
			isModelMapped = true              // 设置模型已映射标志为真
			imageModel = modelMap[imageModel] // 更新图片模型为映射后的模型
		}
	}

	// 获取渠道基础 URL
	baseURL := common.ChannelBaseURLs[channelType]

	// 获取请求的 URL 地址
	requestURL := c.Request.URL.String()
	if c.GetString("baseUrl") != "" { // 如果存在自定义的基础 URL
		baseURL = c.GetString("baseUrl") // 更新基础 URL 为自定义的 URL
	}

	// 获取完整的请求 URL
	fullRequestURL := relayhelper.GetFullRequestURL(baseURL, requestURL, channelType)
	if channelType == common.ChannelTypeAzure { // 如果渠道类型为 Azure
		apiVersion := relayhelper.GetAzureAPIVersion(c) // 获取 Azure API 版本
		fullRequestURL = fmt.Sprintf("%s/openai/deployments/%s/images/generations?api-version=%s", baseURL, imageModel, apiVersion)
	}

	// 定义请求体 Reader 接口
	var requestBody io.Reader

	// 如果模型已映射或者渠道类型为 Azure
	if isModelMapped || channelType == common.ChannelTypeAzure {
		// 将图片请求结构体转换为 JSON 格式
		jsonStr, err := json.Marshal(imageRequest)
		if err != nil {
			return relayhelper.WrapHTTPError(err, "marshal_text_request_failed", http.StatusInternalServerError)
		}

		// 使用 JSON 字符串作为请求体
		requestBody = bytes.NewBuffer(jsonStr)
	} else {
		requestBody = c.Request.Body
	}

	modelRatio := common.RetrieveModelRatio(imageModel) // 获取模型比率
	groupRatio := common.RetrieveGroupRatio(group)      // 获取分组比率
	ratio := modelRatio * groupRatio                    // 计算总比率

	// 获取用户配额信息
	userQuota, err := model.GetUserQuotaWithCache(userId)
	if err != nil {
		return relayhelper.WrapHTTPError(errors.New("user quota is not enough"), "insufficient_user_quota", http.StatusForbidden)
	}

	quota := int(ratio*imageCostRatio*1000) * imageRequest.N // 计算所需配额

	// 如果用户剩余配额小于所需配额
	if userQuota-quota < 0 {
		return relayhelper.WrapHTTPError(errors.New("user quota is not enough"), "insufficient_user_quota", http.StatusForbidden)
	}

	// 创建 HTTP 请求
	req, err := http.NewRequest(c.Request.Method, fullRequestURL, requestBody)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "new_request_failed", http.StatusInternalServerError)
	}

	token := c.Request.Header.Get("Authorization") // 获取 Authorization 头部信息

	// 如果渠道类型为 Azure
	if channelType == common.ChannelTypeAzure {
		token = strings.TrimPrefix(token, "Bearer ") // 去除 Bearer 字符串
		req.Header.Set("api-key", token)             // 设置 API Key 头部信息
	} else {
		req.Header.Set("Authorization", token) // 设置 Authorization 头部信息
	}
	req.Header.Set("Content-Type", c.Request.Header.Get("Content-Type")) // 设置 Content-Type 头部信息
	req.Header.Set("Accept", c.Request.Header.Get("Accept"))             // 设置 Accept 头部信息

	// 发送 HTTP 请求
	resp, err := relayhelper.HTTPClient.Do(req)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "do_request_failed", http.StatusInternalServerError)
	}

	// 关闭请求体
	if err = req.Body.Close(); err != nil {
		return relayhelper.WrapHTTPError(err, "close_request_body_failed", http.StatusInternalServerError)
	}

	// 关闭请求体
	if err = c.Request.Body.Close(); err != nil {
		return relayhelper.WrapHTTPError(err, "close_request_body_failed", http.StatusInternalServerError)
	}

	// 定义 AI 图像响应结构体变量
	var imageResponse relaymodel.AIImageResponse

	// 延迟执行函数
	defer func(ctx context.Context) {
		// 如果响应状态码不是 OK
		if resp.StatusCode != http.StatusOK {
			return
		}

		// 更新令牌配额使用记录
		if err := model.PostConsumeTokenQuota(tokenId, quota); err != nil {
			common.SysError("error consuming token remain quota: " + err.Error())
		}

		// 更新用户配额缓存
		if err = model.UpdateUserQuotaWithCache(userId); err != nil {
			common.SysError("error update user quota cache: " + err.Error())
		}

		// 如果配额不为 0
		if quota != 0 {
			tokenName := c.GetString("tokenName")                                                          // 获取令牌名称
			logContent := fmt.Sprintf("模型倍率 %.2f，分组倍率 %.2f", modelRatio, groupRatio)                       // 构建日志内容
			model.RecordConsumeLog(ctx, userId, channelId, 0, 0, imageModel, tokenName, quota, logContent) // 记录配额消耗日志

			model.UpdateUserUsedQuotaAndRequestCountByID(userId, quota) // 更新用户已使用配额和请求次数

			channelId := c.GetInt("channelId")                 // 获取渠道 ID
			model.UpdateChannelUsedQuotaByID(channelId, quota) // 更新渠道已使用配额
		}
	}(c.Request.Context())

	// 读取响应体内容
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "read_response_body_failed", http.StatusInternalServerError)
	}

	// 关闭响应体
	if err = resp.Body.Close(); err != nil {
		return relayhelper.WrapHTTPError(err, "close_response_body_failed", http.StatusInternalServerError)
	}

	// 解析响应体到文本响应结构体变量
	if err = json.Unmarshal(responseBody, &imageResponse); err != nil {
		return relayhelper.WrapHTTPError(err, "unmarshal_response_body_failed", http.StatusInternalServerError)
	}

	// 将响应体重新设置为读取过的响应体内容
	resp.Body = io.NopCloser(bytes.NewBuffer(responseBody))

	// 遍历响应头部信息
	for k, v := range resp.Header {
		c.Writer.Header().Set(k, v[0]) // 设置响应头部信息
	}
	c.Writer.WriteHeader(resp.StatusCode) // 设置响应状态码

	// 将响应体内容拷贝到响应 Writer 中
	if _, err = io.Copy(c.Writer, resp.Body); err != nil {
		return relayhelper.WrapHTTPError(err, "copy_response_body_failed", http.StatusInternalServerError)
	}

	// 关闭响应体
	if err = resp.Body.Close(); err != nil {
		return relayhelper.WrapHTTPError(err, "close_response_body_failed", http.StatusInternalServerError)
	}

	return nil
}
