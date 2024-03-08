package relaycontroller

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"zhongjyuan/gin-ai-server/common"
	"zhongjyuan/gin-ai-server/model"
	relaycommon "zhongjyuan/gin-ai-server/relay/common"
	relayhelper "zhongjyuan/gin-ai-server/relay/helper"
	relaymodel "zhongjyuan/gin-ai-server/relay/model"

	"github.com/gin-gonic/gin"
)

// RelayAudio 用于处理音频转发的辅助函数。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象。
//   - relayMode int: 转发模式，可能的取值为 relaycommon.RelayModeAudioSpeech 和其他模式。
//
// 输出参数：
//   - *relaymodel.HTTPError: 返回 HTTP 错误对象，如果为 nil 则表示操作成功。
func RelayAudio(c *gin.Context, relayMode int) *relaymodel.HTTPError {
	modelName := "whisper-1"

	userId := c.GetInt("id")              // 获取用户 ID
	group := c.GetString("group")         // 获取用户所属群组
	tokenId := c.GetInt("tokenId")        // 获取令牌 ID
	tokenName := c.GetString("tokenName") // 获取令牌名称

	channelId := c.GetInt("channelId") // 获取渠道 ID
	channelType := c.GetInt("channel") // 获取渠道类型

	// 定义 AI 文本到语音请求结构体
	var ttsRequest relaymodel.AITextToSpeechRequest

	// 语音转换中继模式。
	if relayMode == relaycommon.RelayModeAudioSpeech {
		if err := common.UnmarshalBodyReusable(c, &ttsRequest); err != nil { // 读取 JSON
			return relayhelper.WrapHTTPError(err, "invalid_json", http.StatusBadRequest)
		}

		// 更新模型名称为请求中的模型名称
		modelName = ttsRequest.Model

		// 检查文本是否过长（超过 4096 字符）
		if len(ttsRequest.Input) > 4096 {
			return relayhelper.WrapHTTPError(errors.New("input is too long (over 4096 characters)"), "text_too_long", http.StatusBadRequest)
		}
	}

	groupRatio := common.RetrieveGroupRatio(group)     // 获取群组配额比例
	modelRatio := common.RetrieveModelRatio(modelName) // 获取模型配额比例
	ratio := modelRatio * groupRatio                   // 计算综合配额比例

	var quota int            // 定义配额
	var preConsumedQuota int // 定义预消耗配额
	switch relayMode {
	case relaycommon.RelayModeAudioSpeech:
		preConsumedQuota = int(float64(len(ttsRequest.Input)) * ratio) // 根据输入文本长度计算预消耗配额
		quota = preConsumedQuota                                       // 预消耗配额即为总配额
	default:
		preConsumedQuota = int(float64(common.PreConsumedQuota) * ratio) // 使用预设的配额值计算预消耗配额
	}

	// 获取用户配额
	userQuota, err := model.GetUserQuotaWithCache(userId)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "get_user_quota_failed", http.StatusInternalServerError)
	}

	// 检查用户配额是否足够
	if userQuota-preConsumedQuota < 0 {
		return relayhelper.WrapHTTPError(errors.New("user quota is not enough"), "insufficient_user_quota", http.StatusForbidden)
	}

	// 减少用户配额
	if err = model.DecreaseUserQuotaWithCache(userId, preConsumedQuota); err != nil {
		return relayhelper.WrapHTTPError(err, "decrease_user_quota_failed", http.StatusInternalServerError)
	}

	// 如果用户有足够的配额，则不进行预消耗
	if userQuota > 100*preConsumedQuota {
		preConsumedQuota = 0
	}

	// 预先消耗用户配额
	if preConsumedQuota > 0 {
		if err := model.PreConsumeTokenQuota(tokenId, preConsumedQuota); err != nil {
			return relayhelper.WrapHTTPError(err, "pre_consume_token_quota_failed", http.StatusForbidden)
		}
	}

	// 获取模型映射配置
	modelMapping := c.GetString("modelMapping")
	if modelMapping != "" {
		modelMap := make(map[string]string)
		if err := json.Unmarshal([]byte(modelMapping), &modelMap); err != nil {
			return relayhelper.WrapHTTPError(err, "unmarshal_model_mapping_failed", http.StatusInternalServerError)
		}

		if modelMap[modelName] != "" {
			modelName = modelMap[modelName]
		}
	}

	// 获取渠道基础 URL
	baseURL := common.ChannelBaseURLs[channelType]

	// 获取请求 URL
	requestURL := c.Request.URL.String()
	if c.GetString("baseUrl") != "" {
		baseURL = c.GetString("baseUrl")
	}

	// 构建完整的请求 URL
	fullRequestURL := relayhelper.GetFullRequestURL(baseURL, requestURL, channelType)

	// Azure 语音转录特殊处理
	if relayMode == relaycommon.RelayModeAudioTranscription && channelType == common.ChannelTypeAzure {
		apiVersion := relayhelper.GetAzureAPIVersion(c) // 获取 Azure API 版本
		fullRequestURL = fmt.Sprintf("%s/openai/deployments/%s/audio/transcriptions?api-version=%s", baseURL, modelName, apiVersion)
	}

	requestBody := &bytes.Buffer{}
	if _, err = io.Copy(requestBody, c.Request.Body); err != nil {
		return relayhelper.WrapHTTPError(err, "new_request_body_failed", http.StatusInternalServerError)
	}
	c.Request.Body = io.NopCloser(bytes.NewBuffer(requestBody.Bytes()))

	// 获取响应格式，默认为 JSON
	responseFormat := c.DefaultPostForm("responseFormat", "json")

	// 创建新的 HTTP 请求
	req, err := http.NewRequest(c.Request.Method, fullRequestURL, requestBody)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "new_request_failed", http.StatusInternalServerError)
	}

	// Azure 语音转录特殊处理
	if relayMode == relaycommon.RelayModeAudioTranscription && channelType == common.ChannelTypeAzure {
		apiKey := c.Request.Header.Get("Authorization")
		apiKey = strings.TrimPrefix(apiKey, "Bearer ")
		req.Header.Set("api-key", apiKey)
		req.ContentLength = c.Request.ContentLength
	} else {
		req.Header.Set("Authorization", c.Request.Header.Get("Authorization"))
	}
	req.Header.Set("Content-Type", c.Request.Header.Get("Content-Type"))
	req.Header.Set("Accept", c.Request.Header.Get("Accept"))

	// 发送 HTTP 请求
	resp, err := relayhelper.HTTPClient.Do(req)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "do_request_failed", http.StatusInternalServerError)
	}

	// 关闭请求 Body
	if err = req.Body.Close(); err != nil {
		return relayhelper.WrapHTTPError(err, "close_request_body_failed", http.StatusInternalServerError)
	}

	if err = c.Request.Body.Close(); err != nil {
		return relayhelper.WrapHTTPError(err, "close_request_body_failed", http.StatusInternalServerError)
	}

	// 处理非语音合成的响应
	if relayMode != relaycommon.RelayModeAudioSpeech {
		responseBody, err := io.ReadAll(resp.Body)
		if err != nil {
			return relayhelper.WrapHTTPError(err, "read_response_body_failed", http.StatusInternalServerError)
		}

		if err = resp.Body.Close(); err != nil {
			return relayhelper.WrapHTTPError(err, "close_response_body_failed", http.StatusInternalServerError)
		}

		var openAIErr relaymodel.AISlimTextResponse
		if err = json.Unmarshal(responseBody, &openAIErr); err == nil {
			if openAIErr.Error.Message != "" {
				return relayhelper.WrapHTTPError(fmt.Errorf("type %s, code %v, message %s", openAIErr.Error.Type, openAIErr.Error.Code, openAIErr.Error.Message), "request_error", http.StatusInternalServerError)
			}
		}

		var text string
		switch responseFormat {
		case "json":
			text, err = extractTextFromJSON(responseBody) // 从 JSON 中提取文本
		case "text":
			text, err = extractTextFromText(responseBody) // 从纯文本中提取文本
		case "srt":
			text, err = extractTextFromSRT(responseBody) // 从 SRT 格式中提取文本
		case "verbose_json":
			text, err = extractTextFromVerboseJSON(responseBody) // 从详细 JSON 中提取文本
		case "vtt":
			text, err = extractTextFromVTT(responseBody) // 从 VTT 格式中提取文本
		default:
			return relayhelper.WrapHTTPError(errors.New("unexpected_response_format"), "unexpected_response_format", http.StatusInternalServerError)
		}

		if err != nil {
			return relayhelper.WrapHTTPError(err, "get_text_from_body_err", http.StatusInternalServerError)
		}

		// 根据文本内容和模型名称计算配额
		quota = relaymodel.CalculateTextTokens(text, modelName)
		resp.Body = io.NopCloser(bytes.NewBuffer(responseBody))
	}

	if resp.StatusCode != http.StatusOK {
		// 需要回滚预消耗的配额
		if preConsumedQuota > 0 {
			defer func(ctx context.Context) {
				go func() {
					// 负数表示为令牌和用户增加配额
					if err := model.PostConsumeTokenQuota(tokenId, -preConsumedQuota); err != nil {
						common.Error(ctx, fmt.Sprintf("error rollback pre-consumed quota: %s", err.Error()))
					}
				}()
			}(c.Request.Context())
		}
		return relayhelper.NewHTTPError(resp)
	}

	// 计算配额变化
	quotaDelta := quota - preConsumedQuota
	defer func(ctx context.Context) {
		go relayhelper.PostConsumeQuota(ctx, tokenId, quotaDelta, quota, userId, channelId, modelRatio, groupRatio, modelName, tokenName)
	}(c.Request.Context())

	for k, v := range resp.Header {
		c.Writer.Header().Set(k, v[0])
	}
	c.Writer.WriteHeader(resp.StatusCode)

	if _, err = io.Copy(c.Writer, resp.Body); err != nil {
		return relayhelper.WrapHTTPError(err, "copy_response_body_failed", http.StatusInternalServerError)
	}

	if err = resp.Body.Close(); err != nil {
		return relayhelper.WrapHTTPError(err, "close_response_body_failed", http.StatusInternalServerError)
	}

	return nil
}

// extractTextFromJSON 从JSON响应中提取文本。
//
// 输入参数：
//   - body []byte: 包含JSON响应的字节切片。
// 输出参数：
//   - string: 提取的文本内容。
//   - error: 如果提取过程中发生错误，则返回非空的error。

func extractTextFromJSON(body []byte) (string, error) {
	// 将 JSON 响应解析到 AIWhisperResponse 结构体
	var whisperResponse relaymodel.AIWhisperResponse
	if err := json.Unmarshal(body, &whisperResponse); err != nil {
		return "", fmt.Errorf("unmarshal_response_body_failed err :%w", err)
	}

	// 返回提取的文本内容
	return whisperResponse.Text, nil
}

// extractTextFromVerboseJSON 从详细的JSON响应中提取文本。
//
// 输入参数：
//   - body []byte: 包含详细JSON响应的字节切片。
//
// 输出参数：
//   - string: 提取的文本内容。
//   - error: 如果提取过程中发生错误，则返回非空的error。
func extractTextFromVerboseJSON(body []byte) (string, error) {
	// 解析 JSON 响应到 AIWhisperVerboseResponse 结构体
	var whisperResponse relaymodel.AIWhisperVerboseResponse
	if err := json.Unmarshal(body, &whisperResponse); err != nil {
		return "", fmt.Errorf("unmarshal_response_body_failed err: %w", err)
	}

	// 返回提取的文本内容
	return whisperResponse.Text, nil
}

// extractTextFromSRT 从SRT格式的字幕文件中提取文本内容。
//
// 输入参数：
//   - body []byte: 包含SRT格式字幕的字节切片。
// 输出参数：
//   - string: 提取的文本内容。
//   - error: 如果提取过程中发生错误，则返回非空的error。

func extractTextFromSRT(body []byte) (string, error) {
	// 创建一个Scanner来逐行扫描输入的字节切片
	scanner := bufio.NewScanner(strings.NewReader(string(body)))

	// 用于构建最终的文本内容
	var builder strings.Builder

	// 标记是否当前行包含文本内容
	var textLine bool

	// 遍历每一行
	for scanner.Scan() {
		line := scanner.Text()
		if textLine {
			// 如果上一行是时间轴，当前行为文本内容，将文本内容添加到builder中
			builder.WriteString(line)
			textLine = false
			continue
		} else if strings.Contains(line, "-->") {
			// 如果当前行包含时间轴信息，表示下一行为文本内容
			textLine = true
			continue
		}
	}

	// 检查scanner是否出现错误
	if err := scanner.Err(); err != nil {
		return "", err
	}

	// 返回提取的文本内容
	return builder.String(), nil
}

// extractTextFromVTT 从VTT格式的字幕文件中提取文本内容。
//
// 输入参数：
//   - body []byte: 包含VTT格式字幕的字节切片。
//
// 输出参数：
//   - string: 提取的文本内容。
//   - error: 如果提取过程中发生错误，则返回非空的error。
func extractTextFromVTT(body []byte) (string, error) {
	return extractTextFromSRT(body)
}

// extractTextFromText 从文本数据中提取内容。
//
// 输入参数：
//   - body []byte: 包含文本数据的字节切片。
// 输出参数：
//   - string: 提取的文本内容。
//   - error: 如果提取过程中发生错误，则返回非空的error。

func extractTextFromText(body []byte) (string, error) {
	// 将字节切片转换为字符串，并去除末尾的换行符
	return strings.TrimSuffix(string(body), "\n"), nil
}
