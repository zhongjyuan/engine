package channel

import (
	"sync"
	"time"
	"zhongjyuan/gin-message-server/common"
	"zhongjyuan/gin-message-server/model"
)

// TokenStoreItem 定义了一个接口类型，用于表示令牌存储项。
type TokenStoreItem interface {
	// Key 返回存储项的键值。
	Key() string
	// Token 返回存储项的令牌值。
	Token() string
	// Refresh 用于刷新存储项的令牌值。
	Refresh()
	// IsFilled 用于判断存储项是否已填充令牌值。
	IsFilled() bool
	// IsShared 用于判断存储项是否为共享的（多个用户共用一个令牌）。
	IsShared() bool
}

// TokenStore 定义了一个令牌存储结构体。
type TokenStore struct {
	Map               map[string]*TokenStoreItem // 用于存储令牌项的映射
	Mutex             sync.RWMutex               // 用于并发安全的读写锁
	ExpirationSeconds int                        // 令牌过期时间（秒）
}

// 令牌存储对象
var tokenStore TokenStore

// createTokenStoreItemFromChannel 从渠道信息创建对应的令牌存储项。
//
// 输入参数：
//   - channel *model.ChannelEntity: 包含渠道信息的渠道实体对象
//
// 输出参数：
//   - TokenStoreItem: 根据渠道类型创建的令牌存储项，如果创建失败则返回nil
func createTokenStoreItemFromChannel(channel_ *model.ChannelEntity) TokenStoreItem {
	switch channel_.Type {
	case common.TypeWeChatTestAccount:
		// 创建一个 WeChatTestAccountTokenStoreItem 实例，并设置相应的属性
		item := &WeChatTestAccountTokenStoreItem{
			AppID:     channel_.AppId,
			AppSecret: channel_.Secret,
		}
		return item
	case common.TypeWeChatCorpAccount:
		corpId, agentId, err := parseWechatCorpAccountAppId(channel_.AppId)
		if err != nil {
			// 输出错误日志
			common.SysError(err.Error())
			return nil
		}
		// 创建一个 WeChatCorpAccountTokenStoreItem 实例，并设置相应的属性
		item := &WeChatCorpAccountTokenStoreItem{
			CorpId:      corpId,
			AgentSecret: channel_.Secret,
			AgentId:     agentId,
		}
		return item
	case common.TypeLarkApp:
		// 创建一个 LarkAppTokenStoreItem 实例，并设置相应的属性
		item := &LarkAppTokenStoreItem{
			AppID:     channel_.AppId,
			AppSecret: channel_.Secret,
		}
		return item
	}
	return nil
}

// createTokenStoreItemsFromChannels 用于将多个渠道实体转换为对应的令牌存储项列表。
//
// 输入参数：
//   - channels []*model.ChannelEntity: 渠道实体列表
//
// 输出参数：
//   - []TokenStoreItem: 对应的令牌存储项列表
func createTokenStoreItemsFromChannels(channels []*model.ChannelEntity) []TokenStoreItem {
	var items []TokenStoreItem
	for _, channel_ := range channels {
		// 将每个渠道实体转换为对应的令牌存储项
		item := createTokenStoreItemFromChannel(channel_)
		if item != nil {
			// 将转换成功的令牌存储项添加到列表中
			items = append(items, item)
		}
	}
	return items
}

// TokenStoreInit 用于初始化令牌存储。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func TokenStoreInit() {
	tokenStore.Map = make(map[string]*TokenStoreItem)

	// 设置过期时间为 2 小时 - 5 分钟（2 * 55 * 60 秒）
	tokenStore.ExpirationSeconds = 2 * 55 * 60

	go func() {
		// 获取令牌存储渠道列表
		channels, err := model.GetTokenStoreChannels()
		if err != nil {
			// 输出致命日志
			common.FatalLog(err.Error())
		}

		// 将渠道列表转换为令牌存储项列表
		items := createTokenStoreItemsFromChannels(channels)

		tokenStore.Mutex.RLock()
		for i := range items {
			// 将令牌存储项添加到令牌存储映射中
			tokenStore.Map[items[i].Key()] = &items[i]
		}
		tokenStore.Mutex.RUnlock()

		for {
			tokenStore.Mutex.RLock()
			var tmpMap = make(map[string]*TokenStoreItem)
			for k, v := range tokenStore.Map {
				tmpMap[k] = v
			}
			tokenStore.Mutex.RUnlock()

			for k := range tmpMap {
				// 刷新令牌存储项
				(*tmpMap[k]).Refresh()
			}

			tokenStore.Mutex.RLock()
			// 不应直接用新的映射替换旧的映射，因为旧映射中的键可能已经发生变化
			for k := range tokenStore.Map {
				v, okay := tmpMap[k]
				if okay {
					tokenStore.Map[k] = v
				}
			}
			sleepDuration := common.Max(tokenStore.ExpirationSeconds, 60)
			tokenStore.Mutex.RUnlock()

			// 休眠一段时间后再次刷新令牌
			time.Sleep(time.Duration(sleepDuration) * time.Second)
		}
	}()
}

// GetTokenFromTokenStore 用于获取指定键的令牌。
//
// 输入参数：
//   - key string: 指定的键
//
// 输出参数：
//   - string: 对应键的令牌值，如果找不到则返回空字符串。
func GetTokenFromTokenStore(key string) string {
	tokenStore.Mutex.RLock()
	defer tokenStore.Mutex.RUnlock()
	item, ok := tokenStore.Map[key]
	if ok {
		return (*item).Token()
	}
	common.SysError("token for " + key + " is blank!")
	return ""
}

// isValidTokenStore 用于检查令牌存储渠道类型是否有效。
//
// 输入参数：
//   - channelType string: 渠道类型
//
// 输出参数：
//   - bool: 渠道类型是否有效，如果是返回 true，否则返回 false。
func isValidTokenStore(channelType string) bool {
	return channelType == common.TypeWeChatTestAccount || channelType == common.TypeWeChatCorpAccount || channelType == common.TypeLarkApp
}

// AddTokenStoreItem 用于向令牌存储中添加新的令牌项。
//
// 输入参数：
//   - item TokenStoreItem: 要添加的令牌存储项
//
// 输出参数：
//   - 无。
func AddTokenStoreItem(item TokenStoreItem) {
	// 如果令牌存储项未被填充，则直接返回
	if !item.IsFilled() {
		return
	}

	// 刷新令牌存储项
	item.Refresh()

	tokenStore.Mutex.RLock()
	// 将令牌存储项添加到令牌存储映射中
	tokenStore.Map[item.Key()] = &item
	tokenStore.Mutex.RUnlock()
}

// RemoveTokenStoreItem 用于从令牌存储中移除指定的令牌项。
//
// 输入参数：
//   - item TokenStoreItem: 要移除的令牌存储项
//
// 输出参数：
//   - 无。
func RemoveTokenStoreItem(item TokenStoreItem) {
	tokenStore.Mutex.RLock()
	// 从令牌存储映射中删除指定的令牌项
	delete(tokenStore.Map, item.Key())
	tokenStore.Mutex.RUnlock()
}

// AddTokenStoreItemByUser 用于向令牌存储中添加特定用户的令牌信息。
//
// 输入参数：
//   - user *model.UserEntity: 用户实体对象，包含用户信息
//
// 输出参数：
//   - 无。
func AddTokenStoreItemByUser(user *model.UserEntity) {
	// 获取特定用户的令牌存储渠道列表
	channels, err := model.GetUserTokenStoreChannels(user.Id)
	if err != nil {
		// 输出系统错误日志
		common.SysError(err.Error())
		return
	}

	// 将渠道列表转换为令牌存储项列表
	items := createTokenStoreItemsFromChannels(channels)

	for i := range items {
		// 向令牌存储中添加每个令牌存储项
		AddTokenStoreItem(items[i])
	}
}

// RemoveTokenStoreItemByUser 用于从令牌存储中移除特定用户的非共享令牌信息。
//
// 输入参数：
//   - user *model.UserEntity: 用户实体对象，包含用户信息
//
// 输出参数：
//   - 无。
func RemoveTokenStoreItemByUser(user *model.UserEntity) {
	// 获取特定用户的令牌存储渠道列表
	channels, err := model.GetUserTokenStoreChannels(user.Id)
	if err != nil {
		// 输出系统错误日志
		common.SysError(err.Error())
		return
	}

	// 将渠道列表转换为令牌存储项列表
	items := createTokenStoreItemsFromChannels(channels)

	for i := range items {
		// 如果是共享令牌，则跳过
		if items[i].IsShared() {
			continue
		}
		// 从令牌存储中移除非共享令牌存储项
		RemoveTokenStoreItem(items[i])
	}
}

// AddTokenStoreItemByChannel 用于向令牌存储中添加渠道信息。
//
// 输入参数：
//   - channel *model.ChannelEntity: 渠道实体对象，包含渠道信息
//
// 输出参数：
//   - 无。
func AddTokenStoreItemByChannel(channel *model.ChannelEntity) {
	// 检查渠道类型是否有效
	if !isValidTokenStore(channel.Type) {
		return
	}

	// 将渠道转换为令牌存储项
	item := createTokenStoreItemFromChannel(channel)

	// 如果转换结果不为空
	if item != nil {
		// 添加到令牌存储中
		AddTokenStoreItem(item)
	}
}

// RemoveTokenStoreItemByChannel 用于从令牌存储中移除指定渠道信息。
//
// 输入参数：
//   - channel *model.ChannelEntity: 渠道实体对象，包含渠道信息
//
// 输出参数：
//   - 无。
func RemoveTokenStoreItemByChannel(channel *model.ChannelEntity) {
	// 检查渠道类型是否有效
	if !isValidTokenStore(channel.Type) {
		return
	}

	// 将渠道转换为令牌存储项
	item := createTokenStoreItemFromChannel(channel)

	// 如果转换结果不为空且非共享渠道
	if item != nil && !item.IsShared() {
		// 从令牌存储中移除
		RemoveTokenStoreItem(item)
	}
}

// UpdateTokenStoreItemByChannel 用于更新令牌存储中的渠道信息。
//
// 输入参数：
//   - newChannel *model.ChannelEntity: 包含更新后的渠道信息的渠道实体对象
//   - oldChannel *model.ChannelEntity: 包含被更新前的渠道信息的渠道实体对象
//
// 输出参数：
//   - 无。
func UpdateTokenStoreItemByChannel(newChannel *model.ChannelEntity, oldChannel *model.ChannelEntity) {
	// 检查被更新前的渠道类型是否为微信测试账号或企业号
	if oldChannel.Type != common.TypeWeChatTestAccount && oldChannel.Type != common.TypeWeChatCorpAccount {
		return
	}

	// 如果是微信测试账号
	if oldChannel.Type == common.TypeWeChatTestAccount {
		// 只保留发生变化的部分
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

		// 进行深度拷贝
		newItem := oldItem

		// 表示用户已更新这些字段
		if newChannel.AppId != "" {
			newItem.AppID = newChannel.AppId
		}

		if newChannel.Secret != "" {
			newItem.AppSecret = newChannel.Secret
		}

		if !oldItem.IsShared() {
			RemoveTokenStoreItem(&oldItem)
		}

		AddTokenStoreItem(&newItem)

		return
	}

	// 如果是微信企业号
	if oldChannel.Type == common.TypeWeChatCorpAccount {
		// 只保留发生变化的部分
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

		// 进行深度拷贝
		newItem := oldItem

		// 表示用户已更新这些字段
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
			RemoveTokenStoreItem(&oldItem)
		}

		AddTokenStoreItem(&newItem)

		return
	}
}
