package middleware

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
)

// WechatResponse 结构定义了微信接口返回的响应结构体。
type WechatResponse struct {
	ErrCode int    `json:"errcode"` // 错误代码
	ErrMsg  string `json:"errmsg"`  // 错误消息
}

// UpdateWeChatMenu 用于更新微信菜单。
//
// 输入参数：
//   - value: 要更新的菜单的值。
//
// 输出参数：
//   - error: 更新过程中可能发生的错误。
func UpdateWeChatMenu(value string) error {
	// 构建HTTP请求URL
	url := fmt.Sprintf("https://api.weixin.qq.com/cgi-bin/menu/create?access_token=%s", GetWeChatAccessToken())

	// 发起POST请求
	httpResponse, err := http.Post(url, "application/json", bytes.NewBuffer([]byte(value)))
	if err != nil {
		return err
	}
	defer httpResponse.Body.Close()

	// 解析响应数据
	var res WechatResponse
	if err = json.NewDecoder(httpResponse.Body).Decode(&res); err != nil {
		return err
	}

	// 检查错误代码
	if res.ErrCode != 0 {
		return errors.New(res.ErrMsg)
	}

	return nil
}
