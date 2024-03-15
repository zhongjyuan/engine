package channel_anthropic

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"zhongjyuan/gin-ai-server/common"
	relaycommon "zhongjyuan/gin-ai-server/relay/common"
	relayhelper "zhongjyuan/gin-ai-server/relay/helper"
	relaymodel "zhongjyuan/gin-ai-server/relay/model"

	"github.com/gin-gonic/gin"
)

// stopReasonClaude2OpenAI 函数用于将停止原因从Claude格式转换为OpenAI格式。
//
// 输入参数：
//   - reason string: 停止原因字符串，可能的取值为 "stop_sequence" 或 "max_tokens"。
//
// 输出参数：
//   - string: 转换后的停止原因字符串。
func stopReasonClaude2OpenAI(reason *string) string {
	if reason == nil {
		return ""
	}

	switch *reason {
	case "end_turn":
		return "stop"
	case "stop_sequence":
		return "stop"
	case "max_tokens":
		return "length"
	default:
		return *reason
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
		Model:       textRequest.Model,
		MaxTokens:   textRequest.MaxTokens,
		Temperature: textRequest.Temperature,
		TopP:        textRequest.TopP,
		Stream:      textRequest.Stream,
	}

	if claudeRequest.MaxTokens == 0 {
		claudeRequest.MaxTokens = 4096
	}

	// legacy model name mapping
	if claudeRequest.Model == "claude-instant-1" {
		claudeRequest.Model = "claude-instant-1.1"
	} else if claudeRequest.Model == "claude-2" {
		claudeRequest.Model = "claude-2.1"
	}

	for _, message := range textRequest.Messages {
		if message.Role == "system" && claudeRequest.System == "" {
			claudeRequest.System = message.StringContent()
			continue
		}

		claudeMessage := Message{
			Role: message.Role,
		}

		var content Content
		if message.IsStringContent() {
			content.Type = "text"
			content.Text = message.StringContent()
			claudeMessage.Content = append(claudeMessage.Content, content)
			claudeRequest.Messages = append(claudeRequest.Messages, claudeMessage)
			continue
		}

		var contents []Content
		openaiContent := message.ParseContent()
		for _, part := range openaiContent {
			var content Content
			if part.Type == relaycommon.ContentTypeText {
				content.Type = "text"
				content.Text = part.Text
			} else if part.Type == relaycommon.ContentTypeImageURL {
				content.Type = "image"
				content.Source = &ImageSource{
					Type: "base64",
				}
				mimeType, data, _ := common.GetImageFromUrl(part.ImageURL.Url)
				content.Source.MediaType = mimeType
				content.Source.Data = data
			}
			contents = append(contents, content)
		}
		claudeMessage.Content = contents
		claudeRequest.Messages = append(claudeRequest.Messages, claudeMessage)
	}

	return &claudeRequest
}

// streamResponseClaude2OpenAI 函数将Claude的Response转换为OpenAI的ChatCompletionsStreamResponse对象。
//
// 输入参数：
//   - claudeResponse: 要转换的Claude的Response指针。
//
// 输出参数：
//   - 转换后的OpenAI的ChatCompletionsStreamResponse对象指针。
func streamResponseClaude2OpenAI(claudeResponse *StreamResponse) (*relaymodel.AIChatCompletionsStreamResponse, *Response) {
	var response *Response
	var responseText string
	var stopReason string
	switch claudeResponse.Type {
	case "message_start":
		return nil, claudeResponse.Message
	case "content_block_start":
		if claudeResponse.ContentBlock != nil {
			responseText = claudeResponse.ContentBlock.Text
		}
	case "content_block_delta":
		if claudeResponse.Delta != nil {
			responseText = claudeResponse.Delta.Text
		}
	case "message_delta":
		if claudeResponse.Usage != nil {
			response = &Response{
				Usage: *claudeResponse.Usage,
			}
		}
		if claudeResponse.Delta != nil && claudeResponse.Delta.StopReason != nil {
			stopReason = *claudeResponse.Delta.StopReason
		}
	}
	var choice relaymodel.AIChatCompletionsStreamResponseChoice
	choice.Delta.Content = responseText
	choice.Delta.Role = "assistant"
	finishReason := stopReasonClaude2OpenAI(&stopReason)
	if finishReason != "null" {
		choice.FinishReason = &finishReason
	}
	var openaiResponse relaymodel.AIChatCompletionsStreamResponse
	openaiResponse.Object = "chat.completion.chunk"
	openaiResponse.Choices = []relaymodel.AIChatCompletionsStreamResponseChoice{choice}
	return &openaiResponse, response
}

// responseClaude2OpenAI 函数将Claude的Response转换为OpenAI的TextResponse对象。
//
// 输入参数：
//   - claudeResponse: 要转换的Claude的Response指针。
//
// 输出参数：
//   - 转换后的OpenAI的TextResponse对象指针。
func responseClaude2OpenAI(claudeResponse *Response) *relaymodel.AITextResponse {
	var responseText string
	if len(claudeResponse.Content) > 0 {
		responseText = claudeResponse.Content[0].Text
	}

	// 创建一个新的TextResponseChoice对象
	choice := relaymodel.AITextResponseChoice{
		Index: 0,
		AIMessage: relaymodel.AIMessage{
			Role:    "assistant",
			Content: responseText,
			Name:    nil,
		},
		FinishReason: stopReasonClaude2OpenAI(claudeResponse.StopReason),
	}

	// 创建一个新的TextResponse对象
	fullTextResponse := relaymodel.AITextResponse{
		Id:      fmt.Sprintf("chatcmpl-%s", claudeResponse.Id),
		Model:   claudeResponse.Model,
		Object:  "chat.completion",
		Created: common.GetTimestamp(),
		Choices: []relaymodel.AITextResponseChoice{choice},
	}

	return &fullTextResponse
}

// handleStreamData 函数处理单个数据流条目
func handleStreamData(data string, createdTime int64, c *gin.Context, usage *relaymodel.Usage) bool {
	data = strings.TrimSuffix(data, "\r")

	var id string
	var modelName string
	var claudeResponse StreamResponse
	if err := json.Unmarshal([]byte(data), &claudeResponse); err != nil { // 解析JSON数据至claudeResponse对象
		common.SysError("error unmarshalling stream response: " + err.Error()) // 记录错误日志
		return true
	}

	response, meta := streamResponseClaude2OpenAI(&claudeResponse)
	if meta != nil {
		usage.PromptTokens += meta.Usage.InputTokens
		usage.CompletionTokens += meta.Usage.OutputTokens
		modelName = meta.Model
		id = fmt.Sprintf("chatcmpl-%s", meta.Id)
		return true
	}

	if response == nil {
		return true
	}

	response.Id = id
	response.Model = modelName
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

	if i := strings.Index(string(data), "\n"); i >= 0 {
		return i + 1, data[0:i], nil
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
		if len(data) < 6 {
			continue
		}

		if !strings.HasPrefix(data, "data: ") {
			continue
		}

		data = strings.TrimPrefix(data, "data: ")

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
func StreamHandler(c *gin.Context, resp *http.Response) (*relaymodel.HTTPError, *relaymodel.Usage) {
	createdTime := common.GetTimestamp() // 获取当前时间戳

	scanner := bufio.NewScanner(resp.Body) // 创建用于扫描数据流的Scanner对象
	scanner.Split(scanStreamData)

	dataChan := make(chan string) // 创建用于接收数据的通道
	stopChan := make(chan bool)   // 创建用于停止的通道

	go readStreamData(scanner, dataChan, stopChan) // 启动协程读取数据流

	common.SetEventStreamHeaders(c) // 设置事件流的HTTP响应头

	var usage relaymodel.Usage
	c.Stream(func(w io.Writer) bool {
		select {
		case data := <-dataChan:
			return handleStreamData(data, createdTime, c, &usage)
		case <-stopChan:
			c.Render(-1, common.CustomEvent{Data: "data: [DONE]"})
			return false
		}
	})

	err := resp.Body.Close() // 关闭响应体
	if err != nil {
		return relayhelper.WrapHTTPError(err, "close_response_body_failed", http.StatusInternalServerError), &usage // 返回错误信息
	}

	return nil, &usage // 返回响应文本字符串
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

	// 构建使用情况对象
	usage := &relaymodel.Usage{
		PromptTokens:     claudeResponse.Usage.InputTokens,
		CompletionTokens: claudeResponse.Usage.OutputTokens,
		TotalTokens:      claudeResponse.Usage.InputTokens + claudeResponse.Usage.OutputTokens,
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
