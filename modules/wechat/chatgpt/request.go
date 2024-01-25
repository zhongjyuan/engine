package chatgpt

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

const BASEURL = "http://47.116.100.195:188/api"

// ResponseBody 请求体
type ResponseBody struct {
	Prompt  string `json:"prompt"`
	UserId  string `json:"userId"`
	Network bool   `json:"network"`
}

func Completions(prompt string) (string, error) {
	requestBody := ResponseBody{
		Prompt:  prompt,
		UserId:  "#/chat/1705669354364",
		Network: true,
	}

	requestData, err := json.Marshal(requestBody)
	if err != nil {
		return "", err
	}
	log.Printf("request gtp json string : %v", string(requestData))

	req, err := http.NewRequest("POST", BASEURL+"/generateStream", bytes.NewBuffer(requestData))
	if err != nil {
		return "", err
	}

	req.Header.Add("Accept", "*/*")
	req.Header.Add("Connection", "keep-alive")
	req.Header.Add("Host", "47.116.100.195:188")
	req.Header.Add("Content-Type", "application/json")

	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	var reply = string(body)
	log.Printf("gpt response text: %s \n", reply)

	return reply, nil
}
