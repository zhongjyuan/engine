package global

import (
	"context"
	"encoding/json"
	"fmt"
	"zhongjyuan/log"

	"github.com/tencent-connect/botgo/dto"
	"github.com/tencent-connect/botgo/dto/message"
	"github.com/tencent-connect/botgo/openapi"
)

type Processor struct {
	Log log.Logger
	Api openapi.OpenAPI
}

func (processor Processor) setEmoji(ctx context.Context, channelID string, messageID string) {
	// https://bot.q.qq.com/wiki/develop/api/openapi/emoji/model.html
	if err := processor.Api.CreateMessageReaction(ctx, channelID, messageID, dto.Emoji{ID: "307", Type: 1}); err != nil {
		processor.Log.Trace(err)
	}
}

func (processor Processor) setPins(ctx context.Context, channelID, msgID string) {
	if _, err := processor.Api.AddPins(ctx, channelID, msgID); err != nil {
		processor.Log.Trace(err)
	}
}

func (processor Processor) setAnnounces(ctx context.Context, data *dto.WSATMessageData) {
	if _, err := processor.Api.CreateChannelAnnounces(ctx, data.ChannelID, &dto.ChannelAnnouncesToCreate{MessageID: data.ID}); err != nil {
		processor.Log.Trace(err)
	}
}

func (processor Processor) sendReply(ctx context.Context, channelID string, toCreate *dto.MessageToCreate) {
	if _, err := processor.Api.PostMessage(ctx, channelID, toCreate); err != nil {
		processor.Log.Trace(err)
	}
}

func (processor Processor) dmHandler(data *dto.WSATMessageData) {
	dm, err := processor.Api.CreateDirectMessage(
		context.Background(), &dto.DirectMessageToCreate{
			SourceGuildID: data.GuildID,
			RecipientID:   data.Author.ID,
		},
	)
	if err != nil {
		processor.Log.Trace(err)
		return
	}

	toCreate := &dto.MessageToCreate{
		Content: "默认私信回复",
	}
	_, err = processor.Api.PostDirectMessage(
		context.Background(), dm, toCreate,
	)
	if err != nil {
		processor.Log.Trace(err)
		return
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
	ctx := context.Background()

	cmd := message.ParseCommand(input)

	toCreate := &dto.MessageToCreate{
		Content: "默认回复" + message.Emoji(307),
		MessageReference: &dto.MessageReference{
			MessageID:             data.ID, // 引用这条消息
			IgnoreGetMessageError: true,
		},
	}

	// 进入到私信逻辑
	if cmd.Cmd == "dm" {
		processor.dmHandler(data)
		return nil
	}

	switch cmd.Cmd {
	case "hi":
		processor.sendReply(ctx, data.ChannelID, toCreate)
	case "time":
		toCreate.Content = genReplyContent(data)
		processor.sendReply(ctx, data.ChannelID, toCreate)
	case "ark":
		toCreate.Ark = genReplyArk(data)
		processor.sendReply(ctx, data.ChannelID, toCreate)
	case "公告":
		processor.setAnnounces(ctx, data)
	case "pin":
		if data.MessageReference != nil {
			processor.setPins(ctx, data.ChannelID, data.MessageReference.MessageID)
		}
	case "emoji":
		if data.MessageReference != nil {
			processor.setEmoji(ctx, data.ChannelID, data.MessageReference.MessageID)
		}
	default:
	}

	return nil
}
