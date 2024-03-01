package task

import (
	"zhongjyuan/qq-robot-service/handle"
	"zhongjyuan/qq-robot-service/model"
	"zhongjyuan/qq-robot-service/service"

	"github.com/robfig/cron"
	"github.com/tencent-connect/botgo/dto"
)

func WeatherTask() {

	// 开启每日9点定时
	timer := cron.New()

	// cron表达式由6部分组成，从左到右分别表示 秒 分 时 日 月 星期
	// *表示任意值  ？表示不确定值，只能用于星期和日
	// timer.AddFunc("0 0 9 * * ?", weatherTimerHandler)

	timer.AddFunc("0 0 * * *", weatherTimerHandler) // 每一小时执行一次

	timer.Start()
}

func weatherTimerHandler() {
	processor := handle.GetProcessor()
	if processor.GuildID != "" {
		channels, err := processor.Api.Channels(processor.Context, processor.GuildID)
		if err != nil {
			processor.Log.Errorf("获取频道的信息出错，err = ", err)
			return
		}

		if processor.ChannelID == "" {
			for _, channel := range channels {
				if channel.Name == "闲聊大厅" {
					processor.ChannelID = channel.ID
					break
				}
			}
		}

		if processor.ChannelID == "" {
			processor.Log.Errorf("未找到名称为 '闲聊大厅' 的频道")
			return
		}

		var webData *model.WeatherResp = service.GetNowWeatherByCity("深圳")

		//发送主动消息
		processor.Api.PostMessage(processor.Context, processor.ChannelID, &dto.MessageToCreate{MsgID: "", Ark: model.CreateArkForNowWeather(webData)})
	}
}
