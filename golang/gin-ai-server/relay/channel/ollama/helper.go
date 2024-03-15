package channel_ollama

import (
	"bufio"
	"context"
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

func ConvertRequest(request relaymodel.AIRequest) *ChatRequest {
	ollamaRequest := ChatRequest{
		Model: request.Model,
		Options: &Options{
			Seed:             int(request.Seed),
			Temperature:      request.Temperature,
			TopP:             request.TopP,
			FrequencyPenalty: request.FrequencyPenalty,
			PresencePenalty:  request.PresencePenalty,
		},
		Stream: request.Stream,
	}
	for _, message := range request.Messages {
		ollamaRequest.Messages = append(ollamaRequest.Messages, Message{
			Role:    message.Role,
			Content: message.StringContent(),
		})
	}
	return &ollamaRequest
}

func responseOllama2OpenAI(response *ChatResponse) *relaymodel.AITextResponse {
	choice := relaymodel.AITextResponseChoice{
		Index: 0,
		AIMessage: relaymodel.AIMessage{
			Role:    response.Message.Role,
			Content: response.Message.Content,
		},
	}
	if response.Done {
		choice.FinishReason = "stop"
	}
	fullTextResponse := relaymodel.AITextResponse{
		Id:      fmt.Sprintf("chatcmpl-%s", common.GetUUID()),
		Object:  "chat.completion",
		Created: common.GetTimestamp(),
		Choices: []relaymodel.AITextResponseChoice{choice},
		Usage: relaymodel.Usage{
			PromptTokens:     response.PromptEvalCount,
			CompletionTokens: response.EvalCount,
			TotalTokens:      response.PromptEvalCount + response.EvalCount,
		},
	}
	return &fullTextResponse
}

func streamResponseOllama2OpenAI(ollamaResponse *ChatResponse) *relaymodel.AIChatCompletionsStreamResponse {
	var choice relaymodel.AIChatCompletionsStreamResponseChoice
	choice.Delta.Role = ollamaResponse.Message.Role
	choice.Delta.Content = ollamaResponse.Message.Content
	if ollamaResponse.Done {
		choice.FinishReason = &relaycommon.StopFinishReason
	}
	response := relaymodel.AIChatCompletionsStreamResponse{
		Id:      fmt.Sprintf("chatcmpl-%s", common.GetUUID()),
		Object:  "chat.completion.chunk",
		Created: common.GetTimestamp(),
		Model:   ollamaResponse.Model,
		Choices: []relaymodel.AIChatCompletionsStreamResponseChoice{choice},
	}
	return &response
}

func StreamHandler(c *gin.Context, resp *http.Response) (*relaymodel.HTTPError, *relaymodel.Usage) {
	var usage relaymodel.Usage
	scanner := bufio.NewScanner(resp.Body)
	scanner.Split(func(data []byte, atEOF bool) (advance int, token []byte, err error) {
		if atEOF && len(data) == 0 {
			return 0, nil, nil
		}
		if i := strings.Index(string(data), "}\n"); i >= 0 {
			return i + 2, data[0:i], nil
		}
		if atEOF {
			return len(data), data, nil
		}
		return 0, nil, nil
	})
	dataChan := make(chan string)
	stopChan := make(chan bool)
	go func() {
		for scanner.Scan() {
			data := strings.TrimPrefix(scanner.Text(), "}")
			dataChan <- data + "}"
		}
		stopChan <- true
	}()
	common.SetEventStreamHeaders(c)
	c.Stream(func(w io.Writer) bool {
		select {
		case data := <-dataChan:
			var ollamaResponse ChatResponse
			err := json.Unmarshal([]byte(data), &ollamaResponse)
			if err != nil {
				common.SysError("error unmarshalling stream response: " + err.Error())
				return true
			}
			if ollamaResponse.EvalCount != 0 {
				usage.PromptTokens = ollamaResponse.PromptEvalCount
				usage.CompletionTokens = ollamaResponse.EvalCount
				usage.TotalTokens = ollamaResponse.PromptEvalCount + ollamaResponse.EvalCount
			}
			response := streamResponseOllama2OpenAI(&ollamaResponse)
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
	err := resp.Body.Close()
	if err != nil {
		return relayhelper.WrapHTTPError(err, "close_response_body_failed", http.StatusInternalServerError), nil
	}
	return nil, &usage
}

func Handler(c *gin.Context, resp *http.Response) (*relaymodel.HTTPError, *relaymodel.Usage) {
	ctx := context.TODO()
	var ollamaResponse ChatResponse
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "read_response_body_failed", http.StatusInternalServerError), nil
	}
	common.Debugf(ctx, "ollama response: %s", string(responseBody))
	err = resp.Body.Close()
	if err != nil {
		return relayhelper.WrapHTTPError(err, "close_response_body_failed", http.StatusInternalServerError), nil
	}
	err = json.Unmarshal(responseBody, &ollamaResponse)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "unmarshal_response_body_failed", http.StatusInternalServerError), nil
	}
	if ollamaResponse.Error != "" {
		return &relaymodel.HTTPError{
			Error: relaymodel.Error{
				Message: ollamaResponse.Error,
				Type:    "ollama_error",
				Param:   "",
				Code:    "ollama_error",
			},
			StatusCode: resp.StatusCode,
		}, nil
	}
	fullTextResponse := responseOllama2OpenAI(&ollamaResponse)
	jsonResponse, err := json.Marshal(fullTextResponse)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "marshal_response_body_failed", http.StatusInternalServerError), nil
	}
	c.Writer.Header().Set("Content-Type", "application/json")
	c.Writer.WriteHeader(resp.StatusCode)
	_, err = c.Writer.Write(jsonResponse)
	return nil, &fullTextResponse.Usage
}
