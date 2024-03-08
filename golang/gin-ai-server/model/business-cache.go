package model

import (
	"encoding/json"
	"errors"
	"fmt"
	"math/rand"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"
	"zhongjyuan/gin-ai-server/common"
)

var (
	UserTokenCacheDuration      = common.SyncFrequency // 用户 Token 缓存时长
	UserIdToGroupCacheDuration  = common.SyncFrequency // 用户ID到用户组映射缓存时长
	UserIdToQuotaCacheDuration  = common.SyncFrequency // 用户ID到配额映射缓存时长
	UserIdToStatusCacheDuration = common.SyncFrequency // 用户ID到状态映射缓存时长
)

// GetTokenByKeyWithCache 根据键获取令牌信息，先从缓存中查找，如果未命中则从数据库中获取并缓存。
//
// 输入参数：
//   - key: 用于查找令牌的键
//
// 输出参数：
//   - *TokenEntity: 获取到的令牌实体指针
//   - error: 如果成功获取到令牌，则返回nil；否则返回相应的错误信息。
func GetTokenByKeyWithCache(key string) (token *TokenEntity, err error) {
	keyCol := "`key`"
	if common.UsingPostgreSQL {
		keyCol = `"key"`
	}

	// 如果缓存未启用，直接从数据库中获取
	if !common.RedisEnabled {
		err = DB.Where(keyCol+" = ?", key).First(&token).Error
		return token, err
	}

	// 尝试从缓存中获取令牌信息
	tokenObjectString, err := common.RedisGet(fmt.Sprintf("token:%s", key))
	if err != nil {
		// 缓存未命中，从数据库中获取
		if err = DB.Where(keyCol+" = ?", key).First(&token).Error; err != nil {
			return nil, err
		}

		// 将令牌信息序列化为JSON字符串，并存入缓存
		jsonBytes, err := json.Marshal(token)
		if err != nil {
			return nil, err
		}

		if err := common.RedisSet(fmt.Sprintf("token:%s", key), string(jsonBytes), time.Duration(UserTokenCacheDuration)*time.Second); err != nil {
			common.SysError("Redis set token error: " + err.Error())
		}

		return token, nil
	}

	// 从缓存中获取到了令牌信息，进行反序列化
	err = json.Unmarshal([]byte(tokenObjectString), &token)

	return token, err
}

// GetUserGroupWithCache 根据用户ID获取用户所属组信息，先从缓存中查找，如果未命中则从数据库中获取并缓存。
//
// 输入参数：
//   - id: 用户ID
//
// 输出参数：
//   - group: 用户所属组信息
//   - err: 如果成功获取到用户所属组信息，则返回nil；否则返回相应的错误信息。
func GetUserGroupWithCache(id int) (group string, err error) {
	// 如果缓存未启用，直接从数据库中获取
	if !common.RedisEnabled {
		return GetUserGroupByID(id)
	}

	// 尝试从缓存中获取用户组信息
	if group, err = common.RedisGet(fmt.Sprintf("user_group:%d", id)); err != nil {
		// 缓存未命中，从数据库中获取
		if group, err = GetUserGroupByID(id); err != nil {
			return "", err
		}

		// 将用户组信息存入缓存
		if err = common.RedisSet(fmt.Sprintf("user_group:%d", id), group, time.Duration(UserIdToGroupCacheDuration)*time.Second); err != nil {
			common.SysError("Redis set user group error: " + err.Error())
		}
	}

	return group, err
}

// UpdateUserQuotaWithCache 更新用户配额信息，并存入缓存。
//
// 输入参数：
//   - id: 用户ID
//
// 输出参数：
//   - error: 如果成功更新用户配额并存入缓存，则返回nil；否则返回相应的错误信息。
func UpdateUserQuotaWithCache(id int) error {
	// 如果缓存未启用，直接返回
	if !common.RedisEnabled {
		return nil
	}

	// 获取用户配额信息
	quota, err := GetUserQuotaWithCache(id)
	if err != nil {
		return err
	}

	// 将用户配额信息存入缓存
	return common.RedisSet(fmt.Sprintf("user_quota:%d", id), fmt.Sprintf("%d", quota), time.Duration(UserIdToQuotaCacheDuration)*time.Second)
}

// GetUserQuotaWithCache 根据用户ID获取用户配额信息，先从缓存中查找，如果未命中则从数据库中获取并缓存。
//
// 输入参数：
//   - id: 用户ID
//
// 输出参数：
//   - quota: 用户配额信息
//   - err: 如果成功获取到用户配额信息，则返回nil；否则返回相应的错误信息。
func GetUserQuotaWithCache(id int) (quota int, err error) {
	// 如果缓存未启用，直接从数据库中获取
	if !common.RedisEnabled {
		return GetUserQuotaByID(id)
	}

	// 尝试从缓存中获取用户配额信息
	quotaString, err := common.RedisGet(fmt.Sprintf("user_quota:%d", id))
	if err != nil {
		// 缓存未命中，从数据库中获取
		if quota, err = GetUserQuotaByID(id); err != nil {
			return 0, err
		}

		// 将用户配额信息存入缓存
		if err = common.RedisSet(fmt.Sprintf("user_quota:%d", id), fmt.Sprintf("%d", quota), time.Duration(UserIdToQuotaCacheDuration)*time.Second); err != nil {
			common.SysError("Redis set user quota error: " + err.Error())
		}

		return quota, err
	}

	// 将缓存中的配额信息转换为整数类型
	return strconv.Atoi(quotaString)
}

// DecreaseUserQuotaWithCache 减少用户配额信息，并更新缓存中的配额值。
//
// 输入参数：
//   - id: 用户ID
//   - quota: 要减少的配额值
//
// 输出参数：
//   - error: 如果成功减少用户配额并更新缓存，则返回nil；否则返回相应的错误信息。
func DecreaseUserQuotaWithCache(id int, quota int) error {
	// 如果缓存未启用，直接返回
	if !common.RedisEnabled {
		return nil
	}

	// 从缓存中减少用户配额信息
	return common.RedisDecrease(fmt.Sprintf("user_quota:%d", id), int64(quota))
}

// CheckUserEnabledWithCache 根据用户ID判断用户是否启用，先从缓存中查找，如果未命中则从数据库中获取并缓存。
//
// 输入参数：
//   - userId: 用户ID
//
// 输出参数：
//   - bool: 如果用户启用，则返回 true；否则返回 false。
//   - error: 如果成功获取用户启用状态，则返回nil；否则返回相应的错误信息。
func CheckUserEnabledWithCache(userId int) (bool, error) {
	// 如果缓存未启用，直接从数据库中获取用户启用状态
	if !common.RedisEnabled {
		return IsEnabledUser(userId)
	}

	// 尝试从缓存中获取用户启用状态
	enabled, err := common.RedisGet(fmt.Sprintf("user_enabled:%d", userId))
	if err == nil {
		return enabled == "1", nil
	}

	// 从数据库中获取用户启用状态
	userEnabled, err := IsEnabledUser(userId)
	if err != nil {
		return false, err
	}

	// 更新缓存中的用户启用状态
	enabled = "0"
	if userEnabled {
		enabled = "1"
	}

	if err = common.RedisSet(fmt.Sprintf("user_enabled:%d", userId), enabled, time.Duration(UserIdToStatusCacheDuration)*time.Second); err != nil {
		common.SysError("Redis set user enabled error: " + err.Error())
	}

	return userEnabled, err
}

var channelSyncLock sync.RWMutex
var GroupToModelToChannels map[string]map[string][]*ChannelEntity

// SyncAndSortChannels 从数据库同步通道信息，并按优先级排序。
func SyncAndSortChannels() {
	// channelIDToChannel 是一个映射，将通道ID映射到通道实体。
	channelIDToChannel := make(map[int]*ChannelEntity)

	// enabledChannels 用于存储从数据库中获取的所有启用状态的通道实体。
	var enabledChannels []*ChannelEntity
	DB.Where("status = ?", common.ChannelStatusEnabled).Find(&enabledChannels)
	for _, channel := range enabledChannels {
		channelIDToChannel[channel.Id] = channel
	}

	// groupSet 是一个集合，用于记录能力实体中出现的所有用户组名称。
	groupSet := make(map[string]bool)

	// allAbilities 用于存储从数据库中获取的所有能力实体。
	var allAbilities []*AbilityEntity
	DB.Find(&allAbilities)
	for _, ability := range allAbilities {
		groupSet[ability.Group] = true
	}

	// groupToModelToChannels 是一个嵌套映射，将用户组名称映射到模型名称，然后将模型名称映射到通道实体的切片。
	groupToModelToChannels := make(map[string]map[string][]*ChannelEntity)
	for group := range groupSet {
		groupToModelToChannels[group] = make(map[string][]*ChannelEntity)
	}

	// 将通道实体按照用户组和模型进行分类，并添加到 groupToModelToChannels 中。
	for _, channel := range enabledChannels {
		groups := strings.Split(channel.Group, ",")
		for _, group := range groups {
			models := strings.Split(channel.Models, ",")
			for _, model := range models {
				if _, ok := groupToModelToChannels[group][model]; !ok {
					groupToModelToChannels[group][model] = make([]*ChannelEntity, 0)
				}
				groupToModelToChannels[group][model] = append(groupToModelToChannels[group][model], channel)
			}
		}
	}

	// 按照优先级对通道实体进行排序。
	for group, modelToChannels := range groupToModelToChannels {
		for model, channels := range modelToChannels {
			sort.Slice(channels, func(i, j int) bool {
				return channels[i].GetPriority() > channels[j].GetPriority()
			})
			groupToModelToChannels[group][model] = channels
		}
	}

	// 更新全局变量 GroupToModelToChannels，并使用读写锁保护并发访问。
	channelSyncLock.Lock()
	GroupToModelToChannels = groupToModelToChannels
	channelSyncLock.Unlock()

	common.SysLog("channels synced from database")
}

// PeriodicallySyncChannels 定期同步并排序通道信息。
//
// frequency: 同步频率（单位：秒）。
func PeriodicallySyncChannels(frequency int) {
	for range time.Tick(time.Duration(frequency) * time.Second) {
		common.SysLog("syncing channels from database")
		SyncAndSortChannels()
	}
}

// GetRandomChannelWithCache 方法用于从缓存中获取满足条件的随机通道。
//
// 输入参数：
//   - group string: 通道分组标识。
//   - model string: 通道模型标识。
//
// 输出参数：
//   - *ChannelEntity: 满足条件的随机通道实体指针。
//   - error: 如果无法获取通道或发生错误，则返回错误信息。
func GetRandomChannelWithCache(group, model string) (*ChannelEntity, error) {
	if !common.MemoryCacheEnabled {
		// 如果内存缓存未启用，则直接从数据源获取随机满足条件的通道
		return GetRandomChannel(group, model)
	}

	// 加锁以保证线程安全
	channelSyncLock.RLock()
	// 函数结束时解锁
	defer channelSyncLock.RUnlock()

	// 从缓存中根据分组和模型获取通道列表
	cachedChannels := GroupToModelToChannels[group][model]
	if len(cachedChannels) == 0 {
		return nil, errors.New("channel not found")
	}

	// 初始化用于筛选的通道切片
	var eligibleChannels []*ChannelEntity

	// 获取第一个通道的优先级作为筛选标准
	priority := cachedChannels[0].GetPriority()

	for _, channel := range cachedChannels {
		// 只选择与第一个通道相同优先级的通道
		if channel.GetPriority() == priority {
			eligibleChannels = append(eligibleChannels, channel)
		} else {
			// 一旦遇到不同优先级的通道，停止筛选
			break
		}
	}

	if len(eligibleChannels) == 0 {
		// 如果没有找到匹配优先级的通道，则返回错误
		return nil, errors.New("no channel with matching priority")
	}

	// 从筛选后的通道中随机选择一个
	randomIndex := rand.Intn(len(eligibleChannels))

	// 返回随机选中的通道
	return eligibleChannels[randomIndex], nil
}
