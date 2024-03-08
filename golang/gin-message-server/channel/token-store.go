package channel

import (
	"sync"
	"time"
	"zhongjyuan/gin-message-server/common"
	"zhongjyuan/gin-message-server/model"
)

type TokenStoreItem interface {
	Key() string
	Token() string
	Refresh()
	IsFilled() bool
	IsShared() bool
}

type tokenStore struct {
	Map               map[string]*TokenStoreItem
	Mutex             sync.RWMutex
	ExpirationSeconds int
}

var s tokenStore

func channel2item(channel_ *model.ChannelEntity) TokenStoreItem {
	switch channel_.Type {
	case common.TypeWeChatTestAccount:
		item := &WeChatTestAccountTokenStoreItem{
			AppID:     channel_.AppId,
			AppSecret: channel_.Secret,
		}
		return item
	case common.TypeWeChatCorpAccount:
		corpId, agentId, err := parseWechatCorpAccountAppId(channel_.AppId)
		if err != nil {
			common.SysError(err.Error())
			return nil
		}
		item := &WeChatCorpAccountTokenStoreItem{
			CorpId:      corpId,
			AgentSecret: channel_.Secret,
			AgentId:     agentId,
		}
		return item
	case common.TypeLarkApp:
		item := &LarkAppTokenStoreItem{
			AppID:     channel_.AppId,
			AppSecret: channel_.Secret,
		}
		return item
	}
	return nil
}

func channels2items(channels []*model.ChannelEntity) []TokenStoreItem {
	var items []TokenStoreItem
	for _, channel_ := range channels {
		item := channel2item(channel_)
		if item != nil {
			items = append(items, item)
		}
	}
	return items
}

func TokenStoreInit() {
	s.Map = make(map[string]*TokenStoreItem)
	// https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html
	// https://developer.work.weixin.qq.com/document/path/91039
	s.ExpirationSeconds = 2 * 55 * 60 // 2 hours - 5 minutes
	go func() {
		channels, err := model.GetTokenStoreChannels()
		if err != nil {
			common.FatalLog(err.Error())
		}
		items := channels2items(channels)
		s.Mutex.RLock()
		for i := range items {
			// s.Map[item.Key()] = &item  // This is wrong, you are getting the address of a local variable!
			s.Map[items[i].Key()] = &items[i]
		}
		s.Mutex.RUnlock()
		for {
			s.Mutex.RLock()
			var tmpMap = make(map[string]*TokenStoreItem)
			for k, v := range s.Map {
				tmpMap[k] = v
			}
			s.Mutex.RUnlock()
			for k := range tmpMap {
				(*tmpMap[k]).Refresh()
			}
			s.Mutex.RLock()
			// we shouldn't directly replace the old map with the new map, cause the old map's keys may already change
			for k := range s.Map {
				v, okay := tmpMap[k]
				if okay {
					s.Map[k] = v
				}
			}
			sleepDuration := common.Max(s.ExpirationSeconds, 60)
			s.Mutex.RUnlock()
			time.Sleep(time.Duration(sleepDuration) * time.Second)
		}
	}()
}

// TokenStoreAddItem It's okay to add an incomplete item.
func TokenStoreAddItem(item TokenStoreItem) {
	if !item.IsFilled() {
		return
	}
	item.Refresh()
	s.Mutex.RLock()
	s.Map[item.Key()] = &item
	s.Mutex.RUnlock()
}

func TokenStoreRemoveItem(item TokenStoreItem) {
	s.Mutex.RLock()
	delete(s.Map, item.Key())
	s.Mutex.RUnlock()
}

func TokenStoreAddUser(user *model.UserEntity) {
	channels, err := model.GetTokenStoreChannelsByUserId(user.Id)
	if err != nil {
		common.SysError(err.Error())
		return
	}
	items := channels2items(channels)
	for i := range items {
		TokenStoreAddItem(items[i])
	}
}

// TokenStoreRemoveUser
// user must be filled.
// It's okay to delete a user that don't have an item here.
func TokenStoreRemoveUser(user *model.UserEntity) {
	channels, err := model.GetTokenStoreChannelsByUserId(user.Id)
	if err != nil {
		common.SysError(err.Error())
		return
	}
	items := channels2items(channels)
	for i := range items {
		if items[i].IsShared() {
			continue
		}
		TokenStoreRemoveItem(items[i])
	}
}

func checkTokenStoreChannelType(channelType string) bool {
	return channelType == common.TypeWeChatTestAccount || channelType == common.TypeWeChatCorpAccount || channelType == common.TypeLarkApp
}

func TokenStoreAddChannel(channel *model.ChannelEntity) {
	if !checkTokenStoreChannelType(channel.Type) {
		return
	}
	item := channel2item(channel)
	if item != nil {
		// Do not check IsShared here, cause its useless
		TokenStoreAddItem(item)
	}
}

func TokenStoreRemoveChannel(channel *model.ChannelEntity) {
	if !checkTokenStoreChannelType(channel.Type) {
		return
	}
	item := channel2item(channel)
	if item != nil && !item.IsShared() {
		TokenStoreRemoveItem(item)
	}
}

func TokenStoreUpdateChannel(newChannel *model.ChannelEntity, oldChannel *model.ChannelEntity) {
	if oldChannel.Type != common.TypeWeChatTestAccount && oldChannel.Type != common.TypeWeChatCorpAccount {
		return
	}
	// Why so complicated? Because the given channel maybe incomplete.
	if oldChannel.Type == common.TypeWeChatTestAccount {
		// Only keep changed parts
		if newChannel.AppId == oldChannel.AppId {
			newChannel.AppId = ""
		}
		if newChannel.Secret == oldChannel.Secret {
			newChannel.Secret = ""
		}
		oldItem := WeChatTestAccountTokenStoreItem{
			AppID:     oldChannel.AppId,
			AppSecret: oldChannel.Secret,
		}
		// Yeah, it's a deep copy.
		newItem := oldItem
		// This means the user updated those fields.
		if newChannel.AppId != "" {
			newItem.AppID = newChannel.AppId
		}
		if newChannel.Secret != "" {
			newItem.AppSecret = newChannel.Secret
		}
		if !oldItem.IsShared() {
			TokenStoreRemoveItem(&oldItem)
		}
		TokenStoreAddItem(&newItem)
		return
	}
	if oldChannel.Type == common.TypeWeChatCorpAccount {
		// Only keep changed parts
		if newChannel.AppId == oldChannel.AppId {
			newChannel.AppId = ""
		}
		if newChannel.Secret == oldChannel.Secret {
			newChannel.Secret = ""
		}
		corpId, agentId, err := parseWechatCorpAccountAppId(oldChannel.AppId)
		if err != nil {
			common.SysError(err.Error())
			return
		}
		oldItem := WeChatCorpAccountTokenStoreItem{
			CorpId:      corpId,
			AgentSecret: oldChannel.Secret,
			AgentId:     agentId,
		}
		// Yeah, it's a deep copy.
		newItem := oldItem
		// This means the user updated those fields.
		if newChannel.AppId != "" {
			corpId, agentId, err := parseWechatCorpAccountAppId(oldChannel.AppId)
			if err != nil {
				common.SysError(err.Error())
				return
			}
			newItem.CorpId = corpId
			newItem.AgentId = agentId
		}
		if newChannel.Secret != "" {
			newItem.AgentSecret = newChannel.Secret
		}
		if !oldItem.IsShared() {
			TokenStoreRemoveItem(&oldItem)
		}
		TokenStoreAddItem(&newItem)
		return
	}
}

func TokenStoreGetToken(key string) string {
	s.Mutex.RLock()
	defer s.Mutex.RUnlock()
	item, ok := s.Map[key]
	if ok {
		return (*item).Token()
	}
	common.SysError("token for " + key + " is blank!")
	return ""
}
