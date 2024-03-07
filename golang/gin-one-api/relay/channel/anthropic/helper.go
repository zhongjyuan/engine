package channel_anthropic

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"zhongjyuan/gin-one-api/common"
	relayhelper "zhongjyuan/gin-one-api/relay/helper"
	relaymodel "zhongjyuan/gin-one-api/relay/model"

	"github.com/gin-gonic/gin"
)

// stopReasonClaude2OpenAI 函数用于将停止原因从Claude格式转换为OpenAI格式。
//
// 输入参数：
//   - reason string: 停止原因字符串，可能的取值为 "stop_sequence" 或 "max_tokens"。
//
// 输出参数：
//   - string: 转换后的停止原因字符串。
func stopReasonClaude2OpenAI(reason string) string {
	switch reason {
	case "stop_sequence":
		return "stop"
	case "max_tokens":
		return "length"
	default:
		return reason
	}
}

// buildPrompt 函数根据消息构建提示字符串。
//
// 输入参数：
//   - messages: 消息列表。
//
// 输出参数：
//   - 构建好的提示字符串。
func buildPrompt(messages []relaymodel.AIMessage) string {
	prompt := ""
	for _, message := range messages {
		switch message.Role {
		case "user":
			prompt += fmt.Sprintf("\n\nHuman: %s", message.Content)
		case "assistant":
			prompt += fmt.Sprintf("\n\nAssistant: %s", message.Content)
		case "system":
			if prompt == "" {
				prompt = message.StringContent()
			}
		}
	}
	prompt += "\n\nAssistant:"
	return prompt
}

// ConvertRequest 函数将GeneralOpenAIRequest转换为Request对象。
//
// 输入参数：
//   - textRequest: 要转换的GeneralOpenAIRequest对象。
//
// 输出参数：
//   - 转换后的Request对象指针。
func ConvertRequest(textRequest relaymodel.AIRequest) *Request {
	claudeRequest := Request{
		Model:             textRequest.Model,
		Prompt:            "",
		MaxTokensToSample: textRequest.MaxTokens,
		StopSequences:     nil,
		Temperature:       textRequest.Temperature,
		TopP:              textRequest.TopP,
		Stream:            textRequest.Stream,
	}

	if claudeRequest.MaxTokensToSample == 0 {
		claudeRequest.MaxTokensToSample = 1000000
	}

	prompt := buildPrompt(textRequest.Messages)
	claudeRequest.Prompt = prompt

	return &claudeRequest
}

// streamResponseClaude2OpenAI 函数将Claude的Response转换为OpenAI的ChatCompletionsStreamResponse对象。
//
// 输入参数：
//   - claudeResponse: 要转换的Claude的Response指针。
//
// 输出参数：
//   - 转换后的OpenAI的ChatCompletionsStreamResponse对象指针。
func streamResponseClaude2OpenAI(claudeResponse *Response) *relaymodel.AIChatCompletionsStreamResponse {
	// 创建一个新的ChatCompletionsStreamResponseChoice对象
	var choice relaymodel.AIChatCompletionsStreamResponseChoice
	// 将Claude的Completion赋值给Delta的Content字段
	choice.Delta.Content = claudeResponse.Completion

	// 转换Claude的StopReason为OpenAI的终止原因字符串
	finishReason := stopReasonClaude2OpenAI(claudeResponse.StopReason)
	// 如果转换后的终止原因不为"null"，则将其赋值给Choice的FinishReason字段
	if finishReason != "null" {
		choice.FinishReason = &finishReason
	}

	// 创建一个新的ChatCompletionsStreamResponse对象
	var response relaymodel.AIChatCompletionsStreamResponse
	response.Object = "chat.completion.chunk"
	response.Model = claudeResponse.Model
	response.Choices = []relaymodel.AIChatCompletionsStreamResponseChoice{choice}

	return &response
}

// responseClaude2OpenAI 函数将Claude的Response转换为OpenAI的TextResponse对象。
//
// 输入参数：
//   - claudeResponse: 要转换的Claude的Response指针。
//
// 输出参数：
//   - 转换后的OpenAI的TextResponse对象指针。
func responseClaude2OpenAI(claudeResponse *Response) *relaymodel.AITextResponse {
	// 创建一个新的TextResponseChoice对象
	choice := relaymodel.AITextResponseChoice{
		Index: 0,
		AIMessage: relaymodel.AIMessage{
			Role:    "assistant",
			Content: strings.TrimPrefix(claudeResponse.Completion, " "),
			Name:    nil,
		},
		FinishReason: stopReasonClaude2OpenAI(claudeResponse.StopReason),
	}

	// 创建一个新的TextResponse对象
	fullTextResponse := relaymodel.AITextResponse{
		Id:      fmt.Sprintf("chatcmpl-%s", common.GetUUID()),
		Object:  "chat.completion",
		Created: common.GetTimestamp(),
		Choices: []relaymodel.AITextResponseChoice{choice},
	}

	return &fullTextResponse
}

// handleStreamData 函数处理单个数据流条目
func handleStreamData(data string, responseText *string, responseId string, createdTime int64, c *gin.Context) bool {
	data = strings.TrimSuffix(data, "\r")
	var claudeResponse Response
	err := json.Unmarshal([]byte(data), &claudeResponse) // 解析JSON数据至claudeResponse对象
	if err != nil {
		common.SysError("error unmarshalling stream response: " + err.Error()) // 记录错误日志
		return true
	}
	*responseText += claudeResponse.Completion
	response := streamResponseClaude2OpenAI(&claudeResponse)
	response.Id = responseId
	response.Created = createdTime
	jsonStr, err := json.Marshal(response)
	if err != nil {
		common.SysError("error marshalling stream response: " + err.Error()) // 记录错误日志
		return true
	}
	c.Render(-1, common.CustomEvent{Data: "data: " + string(jsonStr)})
	return true
}

// scanStreamData 函数用于Split扫描器，用于切分数据流。
func scanStreamData(data []byte, atEOF bool) (advance int, token []byte, err error) {
	if atEOF && len(data) == 0 {
		return 0, nil, nil
	}
	if i := strings.Index(string(data), "\r\n\r\n"); i >= 0 {
		return i + 4, data[0:i], nil
	}
	if atEOF {
		return len(data), data, nil
	}
	return 0, nil, nil
}

// readStreamData 函数从Scanner中读取数据并发送到通道中
func readStreamData(scanner *bufio.Scanner, dataChan chan<- string, stopChan chan<- bool) {
	for scanner.Scan() {
		data := scanner.Text()
		if !strings.HasPrefix(data, "event: completion") {
			continue
		}
		data = strings.TrimPrefix(data, "event: completion\r\ndata: ")
		dataChan <- data
	}
	stopChan <- true
}

// StreamHandler 函数处理流式响应，并转换为OpenAI的TextResponse对象。
//
// 输入参数：
//   - c: HTTP请求上下文。
//   - resp: HTTP响应对象指针。
//
// 输出参数：
//   - *relaymodel.HTTPError: 错误对象和HTTP状态码。
//   - string: 响应文本字符串。
func StreamHandler(c *gin.Context, resp *http.Response) (*relaymodel.HTTPError, string) {
	responseText := ""
	responseId := fmt.Sprintf("chatcmpl-%s", common.GetUUID()) // 生成响应ID
	createdTime := common.GetTimestamp()                       // 获取当前时间戳

	scanner := bufio.NewScanner(resp.Body) // 创建用于扫描数据流的Scanner对象
	scanner.Split(scanStreamData)

	dataChan := make(chan string) // 创建用于接收数据的通道
	stopChan := make(chan bool)   // 创建用于停止的通道

	go readStreamData(scanner, dataChan, stopChan) // 启动协程读取数据流

	common.SetEventStreamHeaders(c) // 设置事件流的HTTP响应头

	c.Stream(func(w io.Writer) bool {
		select {
		case data := <-dataChan:
			return handleStreamData(data, &responseText, responseId, createdTime, c)
		case <-stopChan:
			c.Render(-1, common.CustomEvent{Data: "data: [DONE]"})
			return false
		}
	})

	err := resp.Body.Close() // 关闭响应体
	if err != nil {
		return relayhelper.WrapHTTPError(err, "close_response_body_failed", http.StatusInternalServerError), "" // 返回错误信息
	}

	return nil, responseText // 返回响应文本字符串
}

// Handler 函数用于处理HTTP响应并生成OpenAI的TextResponse对象。
//
// 输入参数：
//   - c: HTTP请求上下文。
//   - resp: HTTP响应对象指针。
//   - promptTokens: 提示文本的标记数量。
//   - modelName: 模型名称。
//
// 输出参数：
//   - *relaymodel.HTTPError: 错误对象和HTTP状态码。
//   - *relaymodel.Usage: 使用情况对象。
func Handler(c *gin.Context, resp *http.Response, promptTokens int, modelName string) (*relaymodel.HTTPError, *relaymodel.Usage) {
	// 读取响应体数据
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "read_response_body_failed", http.StatusInternalServerError), nil
	}
	defer resp.Body.Close()

	// 解析响应体JSON数据
	var claudeResponse Response
	err = json.Unmarshal(responseBody, &claudeResponse)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "unmarshal_response_body_failed", http.StatusInternalServerError), nil
	}

	// 检查是否有错误信息并返回相应的错误对象
	if claudeResponse.Error.Type != "" {
		errResponse := &relaymodel.HTTPError{
			Error: relaymodel.Error{
				Message: claudeResponse.Error.Message,
				Type:    claudeResponse.Error.Type,
				Param:   "",
				Code:    claudeResponse.Error.Type,
			},
			StatusCode: resp.StatusCode,
		}
		return errResponse, nil
	}

	// 转换Claude响应为OpenAI的TextResponse对象
	fullTextResponse := responseClaude2OpenAI(&claudeResponse)
	fullTextResponse.Model = modelName

	// 计算完成文本的标记数量
	completionTokens := relaymodel.CalculateTextTokens(claudeResponse.Completion, modelName)

	// 构建使用情况对象
	usage := &relaymodel.Usage{
		PromptTokens:     promptTokens,
		CompletionTokens: completionTokens,
		TotalTokens:      promptTokens + completionTokens,
	}
	fullTextResponse.Usage = *usage

	// 将TextResponse对象转换为JSON字符串
	jsonResponse, err := json.Marshal(fullTextResponse)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "marshal_response_body_failed", http.StatusInternalServerError), nil
	}

	// 设置HTTP响应头并写入响应数据
	c.Writer.Header().Set("Content-Type", "application/json")
	c.Writer.WriteHeader(resp.StatusCode)
	_, err = c.Writer.Write(jsonResponse)

	return nil, usage
}
