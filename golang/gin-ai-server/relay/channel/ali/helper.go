package channel_ali

import (
	"bufio"
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"strings"
	"zhongjyuan/gin-ai-server/common"
	relayhelper "zhongjyuan/gin-ai-server/relay/helper"
	relaymodel "zhongjyuan/gin-ai-server/relay/model"

	"github.com/gin-gonic/gin"
)

// https://help.aliyun.com/document_detail/613695.html?spm=a2c4g.2399480.0.0.1adb778fAdzP9w#341800c0f8w0r

// ConvertRequest 将GeneralOpenAIRequest转换为ChatRequest对象。
//
// 输入参数：
//   - request relaymodel.AIRequest: 要转换的通用OpenAI请求对象。
//
// 输出参数：
//   - *AIChatRequest: 转换后的ChatRequest对象指针。
func ConvertRequest(request relaymodel.AIRequest) *AIChatRequest {
	// 初始化消息数组
	messages := make([]Message, len(request.Messages))
	// 遍历原始消息并转换为新格式的消息
	for i, message := range request.Messages {
		messages[i] = Message{
			Content: message.StringContent(),       // 获取消息内容
			Role:    strings.ToLower(message.Role), // 将角色名称转换为小写
		}
	}

	// 检查模型是否启用搜索
	enableSearch := strings.HasSuffix(request.Model, EnableSearchModelSuffix)
	// 如果启用了搜索，去除模型名称中的搜索后缀
	aliModel := strings.TrimSuffix(request.Model, EnableSearchModelSuffix)

	if request.TopP >= 1 {
		request.TopP = 0.9999
	}

	return &AIChatRequest{
		Model: aliModel, // 设置模型名称
		Input: Input{
			Messages: messages, // 设置消息数组
		},
		Parameters: Parameters{
			EnableSearch:      enableSearch,         // 设置是否启用搜索
			IncrementalOutput: request.Stream,       // 设置增量输出
			Seed:              uint64(request.Seed), // 设置随机种子
			MaxTokens:         request.MaxTokens,
			Temperature:       request.Temperature,
			TopP:              request.TopP,
		},
	}
}

// ConvertEmbeddingRequest 将GeneralOpenAIRequest转换为EmbeddingRequest对象。
//
// 输入参数：
//   - request relaymodel.AIRequest: 要转换的通用OpenAI请求对象。
//
// 输出参数：
//   - *EmbeddingRequest: 转换后的EmbeddingRequest对象指针。
func ConvertEmbeddingRequest(request relaymodel.AIRequest) *EmbeddingRequest {
	// 创建并返回EmbeddingRequest对象
	return &EmbeddingRequest{
		Model: "text-embedding-v1", // 设置模型名称为文本嵌入模型
		Input: struct {
			Texts []string `json:"texts"` // 定义结构体字段Texts，用于存放文本数据
		}{
			Texts: request.ParseInputToStrings(), // 将输入解析为文本数据并赋值给Texts字段
		},
	}
}

// EmbeddingHandler 是处理嵌入请求的处理程序。
//
// 输入参数：
//   - c *gin.Context: Gin框架的上下文对象，用于处理HTTP请求和响应。
//   - resp *http.Response: HTTP响应对象，包含来自模型的响应。
//
// 输出参数：
//   - *relaymodel.HTTPError: 如果在处理过程中发生错误，则返回包含错误信息和HTTP状态码的对象。
//   - *relaymodel.Usage: 返回模型使用情况的对象指针。
func EmbeddingHandler(c *gin.Context, resp *http.Response) (*relaymodel.HTTPError, *relaymodel.Usage) {
	var aliResponse AIEmbeddingResponse // 初始化EmbeddingResponse变量
	defer resp.Body.Close()             // 延迟关闭响应体，确保在函数返回时关闭

	// 解析模型响应并存储到aliResponse变量中
	if err := json.NewDecoder(resp.Body).Decode(&aliResponse); err != nil {
		return relayhelper.WrapHTTPError(err, "unmarshal_response_body_failed", http.StatusInternalServerError), nil
	}

	if aliResponse.Code != "" {
		// 如果模型响应中存在错误代码，则构造ErrorWithStatusCode对象返回错误信息和HTTP状态码
		return &relaymodel.HTTPError{
			Error: relaymodel.Error{
				Message: aliResponse.Message,
				Type:    aliResponse.Code,
				Param:   aliResponse.RequestId,
				Code:    aliResponse.Code,
			},
			StatusCode: resp.StatusCode,
		}, nil
	}

	// 将阿里响应转换为OpenAI响应格式
	fullTextResponse := embeddingResponseAli2OpenAI(&aliResponse)

	// 将OpenAI响应对象转换为JSON字符串
	jsonResponse, err := json.Marshal(fullTextResponse)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "marshal_response_body_failed", http.StatusInternalServerError), nil
	}

	c.Header("Content-Type", "application/json") // 设置HTTP响应头的Content-Type为application/json
	c.Status(resp.StatusCode)                    // 设置HTTP响应状态码

	// 将JSON响应写入HTTP响应体
	if _, err = c.Writer.Write(jsonResponse); err != nil {
		return relayhelper.WrapHTTPError(err, "write_response_failed", http.StatusInternalServerError), nil
	}

	return nil, &fullTextResponse.Usage // 返回nil和模型使用情况对象指针
}

// embeddingResponseAli2OpenAI 将阿里响应转换为OpenAI响应格式。
//
// 输入参数：
//   - response *AIEmbeddingResponse: 阿里响应对象指针。
//
// 输出参数：
//   - *relaymodel.AIEmbeddingResponse: 返回转换后的OpenAI响应对象指针。
func embeddingResponseAli2OpenAI(response *AIEmbeddingResponse) *relaymodel.AIEmbeddingResponse {
	// 初始化OpenAI响应对象
	openAIEmbeddingResponse := relaymodel.AIEmbeddingResponse{
		Object: "list",
		Data:   make([]relaymodel.AIEmbeddingResponseItem, 0, len(response.Output.Embeddings)),
		Model:  "text-embedding-v1",
		Usage:  relaymodel.Usage{TotalTokens: response.Usage.TotalTokens},
	}

	// 遍历阿里响应中的嵌入项，转换为OpenAI格式并添加到Data字段中
	for _, item := range response.Output.Embeddings {
		openAIEmbeddingResponse.Data = append(openAIEmbeddingResponse.Data, relaymodel.AIEmbeddingResponseItem{
			Object:    `embedding`,
			Index:     item.TextIndex,
			Embedding: item.Embedding,
		})
	}
	return &openAIEmbeddingResponse // 返回转换后的OpenAI响应对象指针
}

// responseAli2OpenAI 将阿里响应转换为OpenAI AITextResponse 格式。
//
// 输入参数：
//   - response *ChatResponse: 阿里响应对象指针。
//
// 输出参数：
//   - *relaymodel.AITextResponse: 返回转换后的OpenAI AITextResponse 对象指针。
func responseAli2OpenAI(response *ChatResponse) *relaymodel.AITextResponse {
	// 创建TextResponseChoice对象
	choice := relaymodel.AITextResponseChoice{
		Index: 0,
		AIMessage: relaymodel.AIMessage{
			Role:    "assistant",
			Content: response.Output.Text,
		},
		FinishReason: response.Output.FinishReason,
	}

	// 创建TextResponse对象
	fullTextResponse := &relaymodel.AITextResponse{
		Id:      response.RequestId,
		Object:  "chat.completion",
		Created: common.GetTimestamp(),
		Choices: []relaymodel.AITextResponseChoice{choice},
		Usage: relaymodel.Usage{
			PromptTokens:     response.Usage.InputTokens,
			CompletionTokens: response.Usage.OutputTokens,
			TotalTokens:      response.Usage.InputTokens + response.Usage.OutputTokens,
		},
	}

	return fullTextResponse // 返回转换后的OpenAI AITextResponse 对象指针
}

// streamResponseAli2OpenAI 将阿里响应转换为OpenAI AIChatCompletionsStreamResponse 格式。
//
// 输入参数：
//   - aliResponse *ChatResponse: 阿里响应对象指针。
//
// 输出参数：
//   - *relaymodel.AIChatCompletionsStreamResponse: 返回转换后的OpenAI AIChatCompletionsStreamResponse 对象指针。
func streamResponseAli2OpenAI(aliResponse *ChatResponse) *relaymodel.AIChatCompletionsStreamResponse {
	// 创建ChatCompletionsStreamResponseChoice对象
	var choice relaymodel.AIChatCompletionsStreamResponseChoice
	choice.Delta.Content = aliResponse.Output.Text
	if aliResponse.Output.FinishReason != "null" {
		finishReason := aliResponse.Output.FinishReason
		choice.FinishReason = &finishReason
	}

	// 创建ChatCompletionsStreamResponse对象
	response := &relaymodel.AIChatCompletionsStreamResponse{
		Id:      aliResponse.RequestId,
		Object:  "chat.completion.chunk",
		Created: common.GetTimestamp(),
		Model:   "qwen",
		Choices: []relaymodel.AIChatCompletionsStreamResponseChoice{choice},
	}

	return response // 返回转换后的OpenAI AIChatCompletionsStreamResponse 对象指针
}

// splitFunc 用于自定义Scanner的分割函数
func splitFunc(data []byte, atEOF bool) (advance int, token []byte, err error) {
	if atEOF && len(data) == 0 {
		return 0, nil, nil
	}
	if i := bytes.Index(data, []byte("\n")); i >= 0 {
		return i + 1, data[0:i], nil
	}
	if atEOF {
		return len(data), data, nil
	}
	return 0, nil, nil
}

// readResponseData 用于读取响应体数据并发送到数据通道
func readResponseData(scanner *bufio.Scanner, dataChan chan string, stopChan chan bool) {
	for scanner.Scan() {
		data := scanner.Text()
		if len(data) < 5 { // 忽略空白行或错误格式
			continue
		}
		if data[:5] != "data:" {
			continue
		}
		data = data[5:]
		dataChan <- data
	}
	stopChan <- true
}

// processDataStream 用于处理数据流
func processDataStream(c *gin.Context, dataChan chan string, stopChan chan bool, usage *relaymodel.Usage) {
	c.Stream(func(w io.Writer) bool {
		select {
		case data := <-dataChan:
			var aliResponse ChatResponse
			err := json.Unmarshal([]byte(data), &aliResponse)
			if err != nil {
				common.SysError("error unmarshalling stream response: " + err.Error())
				return true
			}
			if aliResponse.Usage.OutputTokens != 0 {
				usage.PromptTokens = aliResponse.Usage.InputTokens
				usage.CompletionTokens = aliResponse.Usage.OutputTokens
				usage.TotalTokens = aliResponse.Usage.InputTokens + aliResponse.Usage.OutputTokens
			}
			response := streamResponseAli2OpenAI(&aliResponse)
			jsonResponse, err := json.Marshal(response)
			if err != nil {
				common.SysError("error marshalling stream response: " + err.Error())
				return true
			}
			c.Render(-1, common.CustomEvent{Data: "data: " + string(jsonResponse)})
			return true
		case <-stopChan:
			c.Render(-1, common.CustomEvent{Data: "data: [DONE]"})
			return false
		}
	})
}

// StreamHandler 是处理流式请求的处理函数。
//
// 输入参数：
//   - c *gin.Context: Gin上下文对象。
//   - resp *http.Response: HTTP响应对象指针。
//
// 输出参数：
//   - *relaymodel.HTTPError: 返回带有错误状态码的错误对象指针。
//   - *relaymodel.Usage: 返回用量信息对象指针。
func StreamHandler(c *gin.Context, resp *http.Response) (*relaymodel.HTTPError, *relaymodel.Usage) {
	var usage relaymodel.Usage

	// 创建Scanner对象，用于读取响应体数据
	scanner := bufio.NewScanner(resp.Body)
	scanner.Split(splitFunc)

	// 创建数据通道和停止通道
	dataChan := make(chan string)
	stopChan := make(chan bool)

	// 启动goroutine读取响应体数据，并将数据发送到数据通道
	go readResponseData(scanner, dataChan, stopChan)

	// 设置事件流响应头
	common.SetEventStreamHeaders(c)

	// 处理数据流
	processDataStream(c, dataChan, stopChan, &usage)

	// 关闭响应体
	err := resp.Body.Close()
	if err != nil {
		return relayhelper.WrapHTTPError(err, "close_response_body_failed", http.StatusInternalServerError), nil
	}

	return nil, &usage
}

// Handler 是处理普通请求的处理函数。
//
// 输入参数：
//   - c *gin.Context: Gin上下文对象。
//   - resp *http.Response: HTTP响应对象指针。
//
// 输出参数：
//   - *relaymodel.HTTPError: 返回带有错误状态码的错误对象指针。
//   - *relaymodel.Usage: 返回用量信息对象指针。
func Handler(c *gin.Context, resp *http.Response) (*relaymodel.HTTPError, *relaymodel.Usage) {
	var aliResponse ChatResponse

	// 读取响应体数据
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "read_response_body_failed", http.StatusInternalServerError), nil
	}

	// 关闭响应体
	if err := resp.Body.Close(); err != nil {
		return relayhelper.WrapHTTPError(err, "close_response_body_failed", http.StatusInternalServerError), nil
	}

	// 反序列化响应体数据
	if err := json.Unmarshal(responseBody, &aliResponse); err != nil {
		return relayhelper.WrapHTTPError(err, "unmarshal_response_body_failed", http.StatusInternalServerError), nil
	}

	// 检查是否返回错误信息
	if aliResponse.Code != "" {
		return &relaymodel.HTTPError{
			Error: relaymodel.Error{
				Message: aliResponse.Message,
				Type:    aliResponse.Code,
				Param:   aliResponse.RequestId,
				Code:    aliResponse.Code,
			},
			StatusCode: resp.StatusCode,
		}, nil
	}

	// 转换响应数据格式
	fullTextResponse := responseAli2OpenAI(&aliResponse)
	fullTextResponse.Model = "qwen"
	jsonResponse, err := json.Marshal(fullTextResponse)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "marshal_response_body_failed", http.StatusInternalServerError), nil
	}

	// 设置响应头并写入响应数据
	c.Writer.Header().Set("Content-Type", "application/json")
	c.Writer.WriteHeader(resp.StatusCode)
	if _, err := c.Writer.Write(jsonResponse); err != nil {
		return relayhelper.WrapHTTPError(err, "write_response_failed", http.StatusInternalServerError), nil
	}

	return nil, &fullTextResponse.Usage
}
