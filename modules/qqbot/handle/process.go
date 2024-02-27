package handle

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"zhongjyuan/log"
	"zhongjyuan/qqbot/config"
	"zhongjyuan/qqbot/model"
	"zhongjyuan/qqbot/service"

	"github.com/tencent-connect/botgo/dto"
	"github.com/tencent-connect/botgo/dto/message"
	"github.com/tencent-connect/botgo/openapi"
)

type Processor struct {
	Log                log.Logger
	Api                openapi.OpenAPI
	WSInfo             *dto.WebsocketAP
	Context            context.Context
	GuildID            string
	ChannelID          string
	MessageID          string
	RoleID             string
	MemberID           string
	InteractionID      string
	MarkdownTemplateID string
}

var processor *Processor

func SetProcessor(p *Processor) {
	p.GuildID = "12378315953837176454"
	p.ChannelID = "639706800"
	processor = p
}

func GetProcessor() *Processor {
	return processor
}

func (processor Processor) sendReply(ctx context.Context, channelID string, toCreate *dto.MessageToCreate) {
	if _, err := processor.Api.PostMessage(ctx, channelID, toCreate); err != nil {
		processor.Log.Trace(err)
	}
}

func defaultReplyMessage(messageId string) *dto.MessageToCreate {
	return &dto.MessageToCreate{
		Content: "默认回复" + message.Emoji(307),
		MessageReference: &dto.MessageReference{
			MessageID:             messageId,
			IgnoreGetMessageError: true,
		},
	}
}

func defaultTimeReplyMessage(data *dto.WSATMessageData) *dto.MessageToCreate {
	var tpl = `
		你好：%s\n
		在子频道 %s 收到消息。
		收到的消息发送时时间为：%s
		当前本地时间为：%s

		消息来自：%s
	`
	messageTime, _ := data.Timestamp.Time()
	replyContent := fmt.Sprintf(
		tpl,
		message.MentionUser(data.Author.ID),
		message.MentionChannel(data.ChannelID),
		messageTime,
		time.Now().Format(time.RFC3339),
		config.GetIP(),
	)

	return &dto.MessageToCreate{
		Content: replyContent,
		MessageReference: &dto.MessageReference{
			MessageID:             data.ID,
			IgnoreGetMessageError: true,
		},
	}
}

// ProcessInlineSearch is a function to process inline search
func (processor Processor) ProcessInlineSearch(interaction *dto.WSInteractionData) error {
	if interaction.Data.Type != dto.InteractionDataTypeChatSearch {
		return fmt.Errorf("interaction data type not chat search")
	}
	search := &dto.SearchInputResolved{}
	if err := json.Unmarshal(interaction.Data.Resolved, search); err != nil {
		processor.Log.Trace(err)
		return err
	}
	if search.Keyword != "test" {
		return fmt.Errorf("resolved search key not allowed")
	}
	searchRsp := &dto.SearchRsp{
		Layouts: []dto.SearchLayout{
			{
				LayoutType: 0,
				ActionType: 0,
				Title:      "内联搜索",
				Records: []dto.SearchRecord{
					{
						Cover: "https://pub.idqqimg.com/pc/misc/files/20211208/311cfc87ce394c62b7c9f0508658cf25.png",
						Title: "内联搜索标题",
						Tips:  "内联搜索 tips",
						URL:   "https://www.qq.com",
					},
				},
			},
		},
	}
	body, _ := json.Marshal(searchRsp)
	if err := processor.Api.PutInteraction(context.Background(), interaction.ID, string(body)); err != nil {
		processor.Log.Trace("api call putInteractionInlineSearch  error: ", err)
		return err
	}
	return nil
}

func (processor Processor) ProcessMessage(input string, data *dto.WSATMessageData) error {

	cfg := config.GetConfig()
	ctx := context.Background()
	cmd := message.ParseCommand(input)

	switch cmd.Cmd {
	case cfg.HelloCMD:
		processor.sendReply(ctx, data.ChannelID, defaultReplyMessage(data.ID))
	case cfg.TimeCMD:
		processor.sendReply(ctx, data.ChannelID, defaultTimeReplyMessage(data))
	case cfg.PinMessageCMD:
		processor.pinMessageCMDHandle(ctx, cmd, data)
	case cfg.EmojiMessageCMD:
		processor.emojiMessageCMDHandle(ctx, cmd, data)
	case cfg.DirectMessageCMD:
		processor.directMessageCMDHandle(ctx, cmd, data)
	case cfg.AnnounceMessageCMD:
		processor.announceMessageCMDHandle(ctx, cmd, data)
	case cfg.DirectWeatherMessageCMD:
		processor.directWeatherMessageCMDHandle(ctx, cmd, data)
	case cfg.TodayWeatherMessageCMD:
		processor.todayWeatherMessageCMDHandle(ctx, cmd, data)
	case cfg.FutureWeatherMessageCMD:
		processor.futureWeatherMessageCMDHandle(ctx, cmd, data)
	case cfg.DressingIndexMessageCMD:
		processor.dressingIndexMessageCMDHandle(ctx, cmd, data)
	case cfg.AirQualityMessageCMD:
		processor.airQualityMessageCMDHandle(ctx, cmd, data)
	default:
	}

	return nil
}

func (processor Processor) pinMessageCMDHandle(ctx context.Context, cmd *message.CMD, data *dto.WSATMessageData) {
	if data.MessageReference == nil {
		return
	}

	if _, err := processor.Api.AddPins(ctx, data.ChannelID, data.MessageReference.MessageID); err != nil {
		processor.Log.Trace(err)
	}
}

func (processor Processor) emojiMessageCMDHandle(ctx context.Context, cmd *message.CMD, data *dto.WSATMessageData) {
	if data.MessageReference == nil {
		return
	}

	// https://bot.q.qq.com/wiki/develop/api/openapi/emoji/model.html
	if err := processor.Api.CreateMessageReaction(
		ctx, data.ChannelID,
		data.MessageReference.MessageID,
		dto.Emoji{
			ID:   "307",
			Type: 1},
	); err != nil {
		processor.Log.Trace(err)
	}
}

func (processor Processor) directMessageCMDHandle(ctx context.Context, cmd *message.CMD, data *dto.WSATMessageData) {
	dm, err := processor.Api.CreateDirectMessage(
		context.Background(),
		&dto.DirectMessageToCreate{
			SourceGuildID: data.GuildID,
			RecipientID:   data.Author.ID,
		})
	if err != nil {
		processor.Log.Error(err)
		return
	}

	toCreate := &dto.MessageToCreate{
		Content: "默认私信回复",
	}

	if _, err = processor.Api.PostDirectMessage(context.Background(), dm, toCreate); err != nil {
		processor.Log.Error(err)
		return
	}
}

func (processor Processor) announceMessageCMDHandle(ctx context.Context, cmd *message.CMD, data *dto.WSATMessageData) {
	if _, err := processor.Api.CreateChannelAnnounces(
		ctx,
		data.ChannelID,
		&dto.ChannelAnnouncesToCreate{
			MessageID: data.ID,
		}); err != nil {
		processor.Log.Trace(err)
	}
}

func (processor Processor) directWeatherMessageCMDHandle(ctx context.Context, cmd *message.CMD, data *dto.WSATMessageData) {
	var webData *model.WeatherResp = service.GetNowWeatherByCity(cmd.Content)
	if webData != nil {
		directMessage, err := processor.Api.CreateDirectMessage(
			context.Background(),
			&dto.DirectMessageToCreate{
				SourceGuildID: data.GuildID,
				RecipientID:   data.Author.ID,
			})
		if err != nil {
			processor.Log.Error(err)
			return
		}

		if _, err = processor.Api.PostDirectMessage(
			ctx,
			directMessage,
			&dto.MessageToCreate{
				Embed: model.CreateEmbed(webData),
			}); err != nil {
			processor.Log.Error(err)
			return
		}
	}
}

func (processor Processor) todayWeatherMessageCMDHandle(ctx context.Context, cmd *message.CMD, data *dto.WSATMessageData) {
	var webData *model.WeatherResp = service.GetNowWeatherByCity(cmd.Content)
	if webData != nil {
		if _, err := processor.Api.PostMessage(
			ctx,
			data.ChannelID,
			&dto.MessageToCreate{
				MsgID: data.ID,
				Ark:   model.CreateArkForNowWeather(webData),
			}); err != nil {
			processor.Log.Error(err)
			return
		}
	}
}

func (processor Processor) futureWeatherMessageCMDHandle(ctx context.Context, cmd *message.CMD, data *dto.WSATMessageData) {
	var webData *model.FutureWeatherResp = service.GetFutureWeatherByCity(cmd.Content)
	if webData != nil {
		if _, err := processor.Api.PostMessage(
			ctx,
			data.ChannelID,
			&dto.MessageToCreate{
				MsgID: data.ID,
				Ark:   model.CreateArkByFutureWeatherData(webData),
			}); err != nil {
			processor.Log.Error(err)
			return
		}
	}
}

func (processor Processor) dressingIndexMessageCMDHandle(ctx context.Context, cmd *message.CMD, data *dto.WSATMessageData) {
	var webData *model.LifeIndexRsp = service.GetClothIndexByCity(cmd.Content)
	if webData != nil {
		if _, err := processor.Api.PostMessage(
			ctx,
			data.ChannelID,
			&dto.MessageToCreate{
				MsgID: data.ID,
				Ark:   model.CreateArkByLifeIndex(webData),
			}); err != nil {
			processor.Log.Error(err)
			return
		}
	}
}

func (processor Processor) airQualityMessageCMDHandle(ctx context.Context, cmd *message.CMD, data *dto.WSATMessageData) {
	var webData *model.AQIRsp = service.GetAQIByCity(cmd.Content)
	if webData != nil {
		if _, err := processor.Api.PostMessage(
			ctx,
			data.ChannelID,
			&dto.MessageToCreate{
				MsgID: data.ID,
				Ark:   model.CreateArkByAQI(webData),
			}); err != nil {
			processor.Log.Error(err)
			return
		}
	}
}
