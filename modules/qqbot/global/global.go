package global

import (
	"fmt"
	"net"
	"time"

	"github.com/tencent-connect/botgo/dto"
	"github.com/tencent-connect/botgo/dto/message"
)

// getIP 一个简易的获取本机 IP 方法
func getIP() string {
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		return "0.0.0.0"
	}
	for _, address := range addrs {
		// 检查ip地址判断是否回环地址
		if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				return ipnet.IP.String()
			}
		}
	}
	return "0.0.0.1"
}

func genReplyContent(data *dto.WSATMessageData) string {
	var tpl = `你好：%s
在子频道 %s 收到消息。
收到的消息发送时时间为：%s
当前本地时间为：%s

消息来自：%s
`

	msgTime, _ := data.Timestamp.Time()
	return fmt.Sprintf(
		tpl,
		message.MentionUser(data.Author.ID),
		message.MentionChannel(data.ChannelID),
		msgTime, time.Now().Format(time.RFC3339),
		getIP(),
	)
}

func genReplyArk(data *dto.WSATMessageData) *dto.Ark {
	return &dto.Ark{
		TemplateID: 23,
		KV: []*dto.ArkKV{
			{
				Key:   "#DESC#",
				Value: "这是 ark 的描述信息",
			},
			{
				Key:   "#PROMPT#",
				Value: "这是 ark 的摘要信息",
			},
			{
				Key: "#LIST#",
				Obj: []*dto.ArkObj{
					{
						ObjKV: []*dto.ArkObjKV{
							{
								Key:   "desc",
								Value: "这里展示的是 23 号模板",
							},
						},
					},
					{
						ObjKV: []*dto.ArkObjKV{
							{
								Key:   "desc",
								Value: "这是 ark 的列表项名称",
							},
							{
								Key:   "123",
								Value: "456",
							},
						},
					},
				},
			},
		},
	}
}
