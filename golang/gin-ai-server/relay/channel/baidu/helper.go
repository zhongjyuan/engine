package channel_baidu

import (
	"bufio"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"sync"
	"time"
	"zhongjyuan/gin-ai-server/common"
	relaycommon "zhongjyuan/gin-ai-server/relay/common"
	relayhelper "zhongjyuan/gin-ai-server/relay/helper"
	relaymodel "zhongjyuan/gin-ai-server/relay/model"

	"github.com/gin-gonic/gin"
)

// https://cloud.baidu.com/doc/WENXINWORKSHOP/s/flfmc9do2

var baiduTokenStore sync.Map

// ConvertRequest 将通用的 OpenAI 请求转换为 AIChatRequest 对象。
//
// 输入参数：
//   - request: 通用的 OpenAI 请求对象。
//
// 输出参数：
//   - *AIChatRequest: 转换后的 AIChatRequest 对象。
func ConvertRequest(request relaymodel.AIRequest) *ChatRequest {

	baiduRequest := ChatRequest{
		Messages:        make([]Message, 0, len(request.Messages)),
		Temperature:     request.Temperature,
		TopP:            request.TopP,
		PenaltyScore:    request.FrequencyPenalty,
		Stream:          request.Stream,
		DisableSearch:   false,
		EnableCitation:  false,
		MaxOutputTokens: request.MaxTokens,
		UserId:          request.User,
	}

	for _, message := range request.Messages {
		if message.Role == "system" {
			baiduRequest.System = message.StringContent()
		} else {
			baiduRequest.Messages = append(baiduRequest.Messages, Message{
				Role:    message.Role,
				Content: message.StringContent(),
			})
		}
	}

	return &baiduRequest
}

// responseBaidu2OpenAI 将 ChatResponse 转换为 relaymodel.AITextResponse 对象。
//
// 输入参数：
//   - response: 要转换的 ChatResponse 对象。
//
// 输出参数：
//   - *relaymodel.AITextResponse: 转换后的 relaymodel.AITextResponse 对象。
func responseBaidu2OpenAI(response *ChatResponse) *relaymodel.AITextResponse {
	// 创建 AITextResponseChoice 对象
	choice := relaymodel.AITextResponseChoice{
		Index: 0,
		AIMessage: relaymodel.AIMessage{
			Role:    "assistant",
			Content: response.Result,
		},
		FinishReason: "stop", // 设置完成原因为停止
	}

	// 创建完整的 AITextResponse 对象
	fullTextResponse := relaymodel.AITextResponse{
		Id:      response.Id,
		Object:  "chat.completion",
		Created: response.Created,
		Choices: []relaymodel.AITextResponseChoice{choice},
		Usage:   response.Usage,
	}

	return &fullTextResponse
}

// streamResponseBaidu2OpenAI 将 ChatStreamResponse 转换为 relaymodel.AIChatCompletionsStreamResponse 对象。
//
// 输入参数：
//   - baiduResponse: 要转换的 ChatStreamResponse 对象。
//
// 输出参数：
//   - *relaymodel.AIChatCompletionsStreamResponse: 转换后的 relaymodel.AIChatCompletionsStreamResponse 对象。
func streamResponseBaidu2OpenAI(baiduResponse *ChatStreamResponse) *relaymodel.AIChatCompletionsStreamResponse {
	// 创建 AIChatCompletionsStreamResponseChoice 对象
	var choice relaymodel.AIChatCompletionsStreamResponseChoice
	choice.Delta.Content = baiduResponse.Result

	// 判断是否结束并设置完成原因
	if baiduResponse.IsEnd {
		choice.FinishReason = &relaycommon.StopFinishReason
	}

	// 创建完整的 AIChatCompletionsStreamResponse 对象
	response := relaymodel.AIChatCompletionsStreamResponse{
		Id:      baiduResponse.Id,
		Object:  "chat.completion.chunk",
		Created: baiduResponse.Created,
		Model:   "ernie-bot",
		Choices: []relaymodel.AIChatCompletionsStreamResponseChoice{choice},
	}

	return &response
}

// ConvertEmbeddingRequest 将通用的 OpenAI 请求转换为 EmbeddingRequest 对象。
//
// 输入参数：
//   - request: 通用的 OpenAI 请求对象。
//
// 输出参数：
//   - *EmbeddingRequest: 转换后的 EmbeddingRequest 对象。
func ConvertEmbeddingRequest(request relaymodel.AIRequest) *EmbeddingRequest {
	// 解析输入内容并构建 EmbeddingRequest 对象
	return &EmbeddingRequest{
		Input: request.ParseInputToStrings(),
	}
}

// embeddingResponseBaidu2OpenAI 将 AIEmbeddingResponse 转换为 relaymodel.AIEmbeddingResponse 对象。
//
// 输入参数：
//   - response: 要转换的 AIEmbeddingResponse 对象。
//
// 输出参数：
//   - *relaymodel.AIEmbeddingResponse: 转换后的 relaymodel.AIEmbeddingResponse 对象。
func embeddingResponseBaidu2OpenAI(response *AIEmbeddingResponse) *relaymodel.AIEmbeddingResponse {
	// 创建 OpenAI AIEmbeddingResponse 对象
	openAIEmbeddingResponse := relaymodel.AIEmbeddingResponse{
		Object: "list",
		Data:   make([]relaymodel.AIEmbeddingResponseItem, 0, len(response.Data)),
		Model:  "baidu-embedding",
		Usage:  response.Usage,
	}

	// 遍历 response 中的每个项并添加到 OpenAI AIEmbeddingResponse 中
	for _, item := range response.Data {
		openAIEmbeddingResponse.Data = append(openAIEmbeddingResponse.Data, relaymodel.AIEmbeddingResponseItem{
			Object:    item.Object,
			Index:     item.Index,
			Embedding: item.Embedding,
		})
	}

	return &openAIEmbeddingResponse
}

// StreamHandler 处理流式数据的函数。
//
// 输入参数：
//   - c: gin 上下文对象。
//   - resp: HTTP 响应对象。
//
// 输出参数：
//   - *relaymodel.HTTPError: 错误及状态码信息。
//   - *relaymodel.Usage: 使用情况信息。
func StreamHandler(c *gin.Context, resp *http.Response) (*relaymodel.HTTPError, *relaymodel.Usage) {
	var usage relaymodel.Usage
	scanner := bufio.NewScanner(resp.Body)
	// 自定义分隔符函数，用于按行读取数据
	scanner.Split(func(data []byte, atEOF bool) (advance int, token []byte, err error) {
		if atEOF && len(data) == 0 {
			return 0, nil, nil
		}
		if i := strings.Index(string(data), "\n"); i >= 0 {
			return i + 1, data[0:i], nil
		}
		if atEOF {
			return len(data), data, nil
		}
		return 0, nil, nil
	})
	dataChan := make(chan string)
	stopChan := make(chan bool)

	// 启动 goroutine 读取数据并发送到 dataChan
	go func() {
		for scanner.Scan() {
			data := scanner.Text()
			if len(data) < 6 { // 忽略空行或错误格式的数据
				continue
			}
			data = data[6:]
			dataChan <- data
		}
		stopChan <- true
	}()

	// 设置事件流的头部信息
	common.SetEventStreamHeaders(c)

	// 使用 c.Stream 处理流式数据
	c.Stream(func(w io.Writer) bool {
		select {
		case data := <-dataChan:
			var baiduResponse ChatStreamResponse
			err := json.Unmarshal([]byte(data), &baiduResponse)
			if err != nil {
				common.SysError("error unmarshalling stream response: " + err.Error())
				return true
			}

			// 更新使用情况信息
			if baiduResponse.Usage.TotalTokens != 0 {
				usage.TotalTokens = baiduResponse.Usage.TotalTokens
				usage.PromptTokens = baiduResponse.Usage.PromptTokens
				usage.CompletionTokens = baiduResponse.Usage.TotalTokens - baiduResponse.Usage.PromptTokens
			}

			// 将百度的响应转换为 OpenAI 的响应
			response := streamResponseBaidu2OpenAI(&baiduResponse)
			jsonResponse, err := json.Marshal(response)
			if err != nil {
				common.SysError("error marshalling stream response: " + err.Error())
				return true
			}

			// 发送处理后的响应数据到事件流
			c.Render(-1, common.CustomEvent{Data: "data: " + string(jsonResponse)})
			return true
		case <-stopChan:
			// 发送结束标记到事件流
			c.Render(-1, common.CustomEvent{Data: "data: [DONE]"})
			return false
		}
	})

	// 关闭响应体
	err := resp.Body.Close()
	if err != nil {
		return relayhelper.WrapHTTPError(err, "close_response_body_failed", http.StatusInternalServerError), nil
	}

	return nil, &usage
}

func Handler(c *gin.Context, resp *http.Response) (*relaymodel.HTTPError, *relaymodel.Usage) {
	var baiduResponse ChatResponse
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "read_response_body_failed", http.StatusInternalServerError), nil
	}
	err = resp.Body.Close()
	if err != nil {
		return relayhelper.WrapHTTPError(err, "close_response_body_failed", http.StatusInternalServerError), nil
	}
	err = json.Unmarshal(responseBody, &baiduResponse)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "unmarshal_response_body_failed", http.StatusInternalServerError), nil
	}
	if baiduResponse.ErrorMsg != "" {
		return &relaymodel.HTTPError{
			Error: relaymodel.Error{
				Message: baiduResponse.ErrorMsg,
				Type:    "baidu_error",
				Param:   "",
				Code:    baiduResponse.ErrorCode,
			},
			StatusCode: resp.StatusCode,
		}, nil
	}
	fullTextResponse := responseBaidu2OpenAI(&baiduResponse)
	fullTextResponse.Model = "ernie-bot"
	jsonResponse, err := json.Marshal(fullTextResponse)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "marshal_response_body_failed", http.StatusInternalServerError), nil
	}
	c.Writer.Header().Set("Content-Type", "application/json")
	c.Writer.WriteHeader(resp.StatusCode)
	_, err = c.Writer.Write(jsonResponse)
	return nil, &fullTextResponse.Usage
}

func EmbeddingHandler(c *gin.Context, resp *http.Response) (*relaymodel.HTTPError, *relaymodel.Usage) {
	var baiduResponse AIEmbeddingResponse
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "read_response_body_failed", http.StatusInternalServerError), nil
	}
	err = resp.Body.Close()
	if err != nil {
		return relayhelper.WrapHTTPError(err, "close_response_body_failed", http.StatusInternalServerError), nil
	}
	err = json.Unmarshal(responseBody, &baiduResponse)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "unmarshal_response_body_failed", http.StatusInternalServerError), nil
	}
	if baiduResponse.ErrorMsg != "" {
		return &relaymodel.HTTPError{
			Error: relaymodel.Error{
				Message: baiduResponse.ErrorMsg,
				Type:    "baidu_error",
				Param:   "",
				Code:    baiduResponse.ErrorCode,
			},
			StatusCode: resp.StatusCode,
		}, nil
	}
	fullTextResponse := embeddingResponseBaidu2OpenAI(&baiduResponse)
	jsonResponse, err := json.Marshal(fullTextResponse)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "marshal_response_body_failed", http.StatusInternalServerError), nil
	}
	c.Writer.Header().Set("Content-Type", "application/json")
	c.Writer.WriteHeader(resp.StatusCode)
	_, err = c.Writer.Write(jsonResponse)
	return nil, &fullTextResponse.Usage
}

func GetAccessToken(apiKey string) (string, error) {
	if val, ok := baiduTokenStore.Load(apiKey); ok {
		var accessToken AccessToken
		if accessToken, ok = val.(AccessToken); ok {
			// soon this will expire
			if time.Now().Add(time.Hour).After(accessToken.ExpiresAt) {
				go func() {
					_, _ = getBaiduAccessTokenHelper(apiKey)
				}()
			}
			return accessToken.AccessToken, nil
		}
	}
	accessToken, err := getBaiduAccessTokenHelper(apiKey)
	if err != nil {
		return "", err
	}
	if accessToken == nil {
		return "", errors.New("GetAccessToken return a nil token")
	}
	return (*accessToken).AccessToken, nil
}

func getBaiduAccessTokenHelper(apiKey string) (*AccessToken, error) {
	parts := strings.Split(apiKey, "|")
	if len(parts) != 2 {
		return nil, errors.New("invalid baidu apikey")
	}
	req, err := http.NewRequest("POST", fmt.Sprintf("https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=%s&client_secret=%s",
		parts[0], parts[1]), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Accept", "application/json")
	res, err := relayhelper.ImpatientHTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	var accessToken AccessToken
	err = json.NewDecoder(res.Body).Decode(&accessToken)
	if err != nil {
		return nil, err
	}
	if accessToken.Error != "" {
		return nil, errors.New(accessToken.Error + ": " + accessToken.ErrorDescription)
	}
	if accessToken.AccessToken == "" {
		return nil, errors.New("getBaiduAccessTokenHelper get empty access token")
	}
	accessToken.ExpiresAt = time.Now().Add(time.Duration(accessToken.ExpiresIn) * time.Second)
	baiduTokenStore.Store(apiKey, accessToken)
	return &accessToken, nil
}
