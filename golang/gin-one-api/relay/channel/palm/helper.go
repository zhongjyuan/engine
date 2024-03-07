package channel_palm

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"zhongjyuan/gin-one-api/common"
	relaycommon "zhongjyuan/gin-one-api/relay/common"
	relayhelper "zhongjyuan/gin-one-api/relay/helper"
	relaymodel "zhongjyuan/gin-one-api/relay/model"

	"github.com/gin-gonic/gin"
)

// https://developers.generativeai.google/api/rest/generativelanguage/models/generateMessage#request-body
// https://developers.generativeai.google/api/rest/generativelanguage/models/generateMessage#response-body

func ConvertRequest(textRequest relaymodel.AIRequest) *AIChatRequest {
	palmRequest := AIChatRequest{
		Prompt: Prompt{
			Messages: make([]ChatMessage, 0, len(textRequest.Messages)),
		},
		Temperature:    textRequest.Temperature,
		CandidateCount: textRequest.N,
		TopP:           textRequest.TopP,
		TopK:           textRequest.MaxTokens,
	}
	for _, message := range textRequest.Messages {
		palmMessage := ChatMessage{
			Content: message.StringContent(),
		}
		if message.Role == "user" {
			palmMessage.Author = "0"
		} else {
			palmMessage.Author = "1"
		}
		palmRequest.Prompt.Messages = append(palmRequest.Prompt.Messages, palmMessage)
	}
	return &palmRequest
}

func responsePaLM2OpenAI(response *ChatResponse) *relaymodel.AITextResponse {
	fullTextResponse := relaymodel.AITextResponse{
		Choices: make([]relaymodel.AITextResponseChoice, 0, len(response.Candidates)),
	}
	for i, candidate := range response.Candidates {
		choice := relaymodel.AITextResponseChoice{
			Index: i,
			AIMessage: relaymodel.AIMessage{
				Role:    "assistant",
				Content: candidate.Content,
			},
			FinishReason: "stop",
		}
		fullTextResponse.Choices = append(fullTextResponse.Choices, choice)
	}
	return &fullTextResponse
}

func streamResponsePaLM2OpenAI(palmResponse *ChatResponse) *relaymodel.AIChatCompletionsStreamResponse {
	var choice relaymodel.AIChatCompletionsStreamResponseChoice
	if len(palmResponse.Candidates) > 0 {
		choice.Delta.Content = palmResponse.Candidates[0].Content
	}
	choice.FinishReason = &relaycommon.StopFinishReason
	var response relaymodel.AIChatCompletionsStreamResponse
	response.Object = "chat.completion.chunk"
	response.Model = "palm2"
	response.Choices = []relaymodel.AIChatCompletionsStreamResponseChoice{choice}
	return &response
}

func StreamHandler(c *gin.Context, resp *http.Response) (*relaymodel.HTTPError, string) {
	responseText := ""
	responseId := fmt.Sprintf("chatcmpl-%s", common.GetUUID())
	createdTime := common.GetTimestamp()
	dataChan := make(chan string)
	stopChan := make(chan bool)
	go func() {
		responseBody, err := io.ReadAll(resp.Body)
		if err != nil {
			common.SysError("error reading stream response: " + err.Error())
			stopChan <- true
			return
		}
		err = resp.Body.Close()
		if err != nil {
			common.SysError("error closing stream response: " + err.Error())
			stopChan <- true
			return
		}
		var palmResponse ChatResponse
		err = json.Unmarshal(responseBody, &palmResponse)
		if err != nil {
			common.SysError("error unmarshalling stream response: " + err.Error())
			stopChan <- true
			return
		}
		fullTextResponse := streamResponsePaLM2OpenAI(&palmResponse)
		fullTextResponse.Id = responseId
		fullTextResponse.Created = createdTime
		if len(palmResponse.Candidates) > 0 {
			responseText = palmResponse.Candidates[0].Content
		}
		jsonResponse, err := json.Marshal(fullTextResponse)
		if err != nil {
			common.SysError("error marshalling stream response: " + err.Error())
			stopChan <- true
			return
		}
		dataChan <- string(jsonResponse)
		stopChan <- true
	}()
	common.SetEventStreamHeaders(c)
	c.Stream(func(w io.Writer) bool {
		select {
		case data := <-dataChan:
			c.Render(-1, common.CustomEvent{Data: "data: " + data})
			return true
		case <-stopChan:
			c.Render(-1, common.CustomEvent{Data: "data: [DONE]"})
			return false
		}
	})
	err := resp.Body.Close()
	if err != nil {
		return relayhelper.WrapHTTPError(err, "close_response_body_failed", http.StatusInternalServerError), ""
	}
	return nil, responseText
}

func Handler(c *gin.Context, resp *http.Response, promptTokens int, modelName string) (*relaymodel.HTTPError, *relaymodel.Usage) {
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "read_response_body_failed", http.StatusInternalServerError), nil
	}
	err = resp.Body.Close()
	if err != nil {
		return relayhelper.WrapHTTPError(err, "close_response_body_failed", http.StatusInternalServerError), nil
	}
	var palmResponse ChatResponse
	err = json.Unmarshal(responseBody, &palmResponse)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "unmarshal_response_body_failed", http.StatusInternalServerError), nil
	}
	if palmResponse.Error.Code != 0 || len(palmResponse.Candidates) == 0 {
		return &relaymodel.HTTPError{
			Error: relaymodel.Error{
				Message: palmResponse.Error.Message,
				Type:    palmResponse.Error.Status,
				Param:   "",
				Code:    palmResponse.Error.Code,
			},
			StatusCode: resp.StatusCode,
		}, nil
	}
	fullTextResponse := responsePaLM2OpenAI(&palmResponse)
	fullTextResponse.Model = modelName
	completionTokens := relaymodel.CalculateTextTokens(palmResponse.Candidates[0].Content, modelName)
	usage := relaymodel.Usage{
		PromptTokens:     promptTokens,
		CompletionTokens: completionTokens,
		TotalTokens:      promptTokens + completionTokens,
	}
	fullTextResponse.Usage = usage
	jsonResponse, err := json.Marshal(fullTextResponse)
	if err != nil {
		return relayhelper.WrapHTTPError(err, "marshal_response_body_failed", http.StatusInternalServerError), nil
	}
	c.Writer.Header().Set("Content-Type", "application/json")
	c.Writer.WriteHeader(resp.StatusCode)
	_, _ = c.Writer.Write(jsonResponse)
	return nil, &usage
}
