package channel_openai

import (
	"bufio"
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"strings"
	"zhongjyuan/gin-one-api/common"
	relaycommon "zhongjyuan/gin-one-api/relay/common"
	relayhelper "zhongjyuan/gin-one-api/relay/helper"
	relaymodel "zhongjyuan/gin-one-api/relay/model"

	"github.com/gin-gonic/gin"
)

// ResponseText2Usage 将文本响应转换为使用情况对象。
//
// 输入参数：
//   - responseText string: 文本响应内容。
//   - modeName string: 模型名称。
//   - promptTokens int: 提示词令牌数。
//
// 输出参数：
//   - *relaymodel.Usage: 使用情况对象，包含生成的令牌信息。
func ResponseText2Usage(responseText string, modeName string, promptTokens int) *relaymodel.Usage {
	// 创建使用情况对象并设置提示词令牌数
	return &relaymodel.Usage{
		PromptTokens:     promptTokens,
		CompletionTokens: relaymodel.CalculateTextTokens(responseText, modeName),
		TotalTokens:      promptTokens + relaymodel.CalculateTextTokens(responseText, modeName),
	}
}

// splitFunc 是自定义的 bufio.Scanner 分割函数，用于按行分割数据流。
//
// 输入参数：
//   - data []byte: 要处理的数据。
//   - atEOF bool: 表示是否已经读取到文件末尾。
//
// 输出参数：
//   - advance int: 返回下一个 token 的偏移量。
//   - token []byte: 返回的 token 数据。
//   - err error: 错误信息。
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

// processStreamResponse 用于处理流式响应数据。
//
// 输入参数：
//   - relayMode int: 中继模式。
//   - data string: 要处理的数据。
//   - responseText *string: 生成的响应文本的指针。
//
// 输出参数：
//   - 无。
func processStreamResponse(relayMode int, data string, responseText *string) {
	switch relayMode {
	case relaycommon.RelayModeChatCompletions:
		var streamResponse relaymodel.AIChatCompletionsStreamResponse
		if err := json.Unmarshal([]byte(data), &streamResponse); err != nil {
			common.SysError("error unmarshalling stream response: " + err.Error())
			return // 忽略错误
		}

		for _, choice := range streamResponse.Choices {
			*responseText += choice.Delta.Content
		}
	case relaycommon.RelayModeCompletions:
		var streamResponse relaymodel.AICompletionsStreamResponse
		if err := json.Unmarshal([]byte(data), &streamResponse); err != nil {
			common.SysError("error unmarshalling stream response: " + err.Error())
			return // 忽略错误
		}

		for _, choice := range streamResponse.Choices {
			*responseText += choice.Text
		}
	}
}

// handleData 用于处理数据流中的单条数据。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象。
//   - data string: 要处理的数据。
//
// 输出参数：
//   - 无。
func handleData(c *gin.Context, data string) {
	if strings.HasPrefix(data, "data: [DONE]") {
		data = data[:12]
	}
	// 一些实现可能在数据末尾添加 \r
	data = strings.TrimSuffix(data, "\r")
	c.Render(-1, common.CustomEvent{Data: data})
}

// StreamHandler 用于处理流式数据并生成响应文本。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象。
//   - resp *http.Response: HTTP 响应对象。
//   - relayMode int: 中继模式。
//
// 输出参数：
//   - *relaymodel.HTTPError: 错误对象，如果有错误发生。
//   - string: 生成的响应文本。
func StreamHandler(c *gin.Context, resp *http.Response, relayMode int) (*relaymodel.HTTPError, string) {
	responseText := "" // 初始化响应文本

	// 创建一个 scanner 对象来扫描 HTTP 响应体
	scanner := bufio.NewScanner(resp.Body)
	scanner.Split(splitFunc) // 使用自定义的分割函数

	dataChan := make(chan string) // 创建用于接收数据的通道
	stopChan := make(chan bool)   // 创建用于发送停止信号的通道

	// 开启协程处理数据流
	go func() {
		for scanner.Scan() {
			data := scanner.Text() // 读取一行数据
			if len(data) < 6 {     // 忽略长度小于 6 的行
				continue
			}

			if data[:6] != "data: " && data[:6] != "[DONE]" { // 忽略不符合格式的行
				continue
			}

			dataChan <- data // 将符合条件的数据发送到通道中
			data = data[6:]  // 去除前缀
			if !strings.HasPrefix(data, "[DONE]") {
				processStreamResponse(relayMode, data, &responseText) // 处理数据
			}
		}
		stopChan <- true // 发送停止信号
	}()

	common.SetEventStreamHeaders(c) // 设置事件流的响应头
	c.Stream(func(w io.Writer) bool {
		select {
		case data := <-dataChan:
			handleData(c, data) // 处理接收到的数据
			return true
		case <-stopChan:
			return false
		}
	})

	if err := resp.Body.Close(); err != nil { // 关闭响应体
		return relayhelper.WrapHTTPError(err, "close_response_body_failed", http.StatusInternalServerError), "" // 返回关闭响应体失败的错误
	}

	return nil, responseText // 返回响应文本和空错误
}

// Handler 用于处理 HTTP 响应并生成相应的 Gin 响应。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象。
//   - resp *http.Response: HTTP 响应对象。
//   - promptTokens int: 提示词令牌数。
//   - modelName string: 模型名称。
//
// 输出参数：
//   - *relaymodel.HTTPError: 错误对象，如果有错误发生。
//   - *relaymodel.Usage: 使用情况对象。
func Handler(c *gin.Context, resp *http.Response, promptTokens int, modelName string) (*relaymodel.HTTPError, *relaymodel.Usage) {
	var textResponse relaymodel.AISlimTextResponse // 定义 AISlimTextResponse 结构体变量

	// 读取响应体数据
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "read_response_body_failed", http.StatusInternalServerError), nil // 返回读取响应体失败的错误
	}

	// 关闭响应体
	if err = resp.Body.Close(); err != nil {
		return relayhelper.WrapHTTPError(err, "close_response_body_failed", http.StatusInternalServerError), nil // 返回关闭响应体失败的错误
	}

	// 解析响应体数据为 AISlimTextResponse 结构体
	if err = json.Unmarshal(responseBody, &textResponse); err != nil {
		return relayhelper.WrapHTTPError(err, "unmarshal_response_body_failed", http.StatusInternalServerError), nil // 返回解析响应体失败的错误
	}

	// 如果存在错误类型，则返回错误对象和空的使用情况对象
	if textResponse.Error.Type != "" {
		return &relaymodel.HTTPError{
			Error:      textResponse.Error,
			StatusCode: resp.StatusCode,
		}, nil
	}

	resp.Body = io.NopCloser(bytes.NewBuffer(responseBody)) // 重置响应体

	// 设置响应头
	for k, v := range resp.Header {
		c.Writer.Header().Set(k, v[0])
	}
	c.Writer.WriteHeader(resp.StatusCode)

	// 复制响应体到 Gin 的响应 Writer 中
	if _, err = io.Copy(c.Writer, resp.Body); err != nil {
		return relayhelper.WrapHTTPError(err, "copy_response_body_failed", http.StatusInternalServerError), nil // 返回复制响应体失败的错误
	}

	// 再次关闭响应体
	if err = resp.Body.Close(); err != nil {
		return relayhelper.WrapHTTPError(err, "close_response_body_failed", http.StatusInternalServerError), nil // 返回关闭响应体失败的错误
	}

	// 计算使用情况中的总令牌数
	if textResponse.Usage.TotalTokens == 0 {
		completionTokens := 0
		for _, choice := range textResponse.Choices {
			completionTokens += relaymodel.CalculateTextTokens(choice.AIMessage.StringContent(), modelName) // 计算完成文本的令牌数
		}
		textResponse.Usage = relaymodel.Usage{
			PromptTokens:     promptTokens,
			CompletionTokens: completionTokens,
			TotalTokens:      promptTokens + completionTokens,
		}
	}

	// 返回空的错误对象和使用情况对象
	return nil, &textResponse.Usage
}
