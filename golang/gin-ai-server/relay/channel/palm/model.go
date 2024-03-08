package channel_palm

import relaymodel "zhongjyuan/gin-ai-server/relay/model"

type ChatMessage struct {
	Author  string `json:"author"`
	Content string `json:"content"`
}

type Filter struct {
	Reason  string `json:"reason"`
	Message string `json:"message"`
}

type Prompt struct {
	Messages []ChatMessage `json:"messages"`
}

type AIChatRequest struct {
	Prompt         Prompt  `json:"prompt"`
	Temperature    float64 `json:"temperature,omitempty"`
	CandidateCount int     `json:"candidateCount,omitempty"`
	TopP           float64 `json:"topP,omitempty"`
	TopK           int     `json:"topK,omitempty"`
}

type Error struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Status  string `json:"status"`
}

type ChatResponse struct {
	Candidates []ChatMessage          `json:"candidates"`
	Messages   []relaymodel.AIMessage `json:"messages"`
	Filters    []Filter               `json:"filters"`
	Error      Error                  `json:"error"`
}
