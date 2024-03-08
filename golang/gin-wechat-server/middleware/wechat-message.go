package middleware

import (
	"encoding/xml"
	"zhongjyuan/gin-wechat-server/common"
)

// WeChatMessageRequest 结构体用于表示微信消息的请求结构。
type WeChatMessageRequest struct {
	XMLName      xml.Name `xml:"xml"`          // XML 标签名
	ToUserName   string   `xml:"ToUserName"`   // 接收消息的用户
	FromUserName string   `xml:"FromUserName"` // 发送消息的用户
	CreateTime   int64    `xml:"CreateTime"`   // 消息创建时间
	MsgType      string   `xml:"MsgType"`      // 消息类型
	Content      string   `xml:"Content"`      // 消息内容
	MsgId        int64    `xml:"MsgId"`        // 消息ID
	MsgDataId    int64    `xml:"MsgDataId"`    // 消息数据ID
	Idx          int64    `xml:"Idx"`          // 消息索引
}

// WeChatMessageResponse 结构体用于表示微信消息的响应结构。
type WeChatMessageResponse struct {
	XMLName      xml.Name `xml:"xml"`          // XML 标签名
	ToUserName   string   `xml:"ToUserName"`   // 接收消息的用户
	FromUserName string   `xml:"FromUserName"` // 发送消息的用户
	CreateTime   int64    `xml:"CreateTime"`   // 消息创建时间
	MsgType      string   `xml:"MsgType"`      // 消息类型
	Content      string   `xml:"Content"`      // 响应消息内容
}

// WeChatMessageProcess 函数用于处理微信消息。
//
// 输入参数：
//   - req: 微信消息请求结构体指针。
//   - res: 微信消息响应结构体指针。
//
// 输出参数：
//   - 无。
func WeChatMessageProcess(req *WeChatMessageRequest, res *WeChatMessageResponse) {
	// 根据消息内容进行处理
	switch req.Content {
	case "验证码":

		// 生成验证码
		key := common.GenerateAllNumberVerificationCode(6, common.WeChatVerificationPurpose)

		// 注册验证码
		common.RegisterVerificationCodeWithKey(key, req.FromUserName, common.WeChatVerificationPurpose)

		// 设置响应消息内容为验证码
		res.Content = key
	}
}
