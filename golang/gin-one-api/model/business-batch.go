package model

import (
	"sync"
	"time"
	"zhongjyuan/gin-one-api/common"
)

// batchUpdateLocks 用于对 batchUpdateStores 进行并发安全控制的互斥锁数组。
var batchUpdateLocks []sync.Mutex

// batchUpdateStores 用于存储批量更新的数据，每个 map[int]int 对应一次更新操作。
var batchUpdateStores []map[int]int

// init 函数用于初始化批量更新相关的数据结构。
func init() {
	for i := 0; i < common.BatchUpdateTypeCount; i++ {
		// 使用 sync.Mutex 创建互斥锁，并添加到 batchUpdateLocks 数组中
		batchUpdateLocks = append(batchUpdateLocks, sync.Mutex{})

		// 使用 make 创建一个空的 map[int]int，并添加到 batchUpdateStores 数组中
		batchUpdateStores = append(batchUpdateStores, make(map[int]int))
	}
}

// InitBatchUpdater 函数用于初始化批量更新器，并启动一个后台 goroutine 执行批量更新操作。
func InitBatchUpdater() {
	// 启动一个匿名函数的 goroutine，用于定时执行批量更新操作
	go func() {
		for {
			// 暂停指定时间间隔，以达到定时执行的效果
			time.Sleep(time.Duration(common.BatchUpdateInterval) * time.Second)

			// 调用 batchUpdate 函数执行批量更新操作
			batchUpdate()
		}
	}()
}

// updateRecord 函数用于向指定类型的记录中添加新的数值或更新已有记录的值。
//
// 输入参数：
//   - recordType int: 记录类型，用于指定要操作的记录类型。
//   - id int: 记录的唯一标识符。
//   - value int: 要添加或更新的数值。
//
// 输出参数：
//   - 无。
func updateRecord(recordType int, id int, value int) {
	// 加锁，保证并发安全
	batchUpdateLocks[recordType].Lock()
	defer batchUpdateLocks[recordType].Unlock() // 在函数执行完毕后解锁

	// 检查是否存在指定 id 的记录，如果不存在则创建新记录，否则更新已有记录的值
	if _, ok := batchUpdateStores[recordType][id]; !ok {
		batchUpdateStores[recordType][id] = value
	} else {
		batchUpdateStores[recordType][id] += value
	}
}

// batchUpdate 方法用于批量更新不同类型的数据。
func batchUpdate() {
	// 记录批量更新开始的日志
	common.SysLog("batch update started")

	// 遍历不同类型的更新
	for i := 0; i < common.BatchUpdateTypeCount; i++ {
		// 加锁以保证线程安全
		batchUpdateLocks[i].Lock()
		store := batchUpdateStores[i]
		batchUpdateStores[i] = make(map[int]int)
		batchUpdateLocks[i].Unlock()

		// 遍历存储中的数据进行更新
		// TODO: maybe we can combine updates with same key?
		for key, value := range store {
			switch i {
			case common.BatchUpdateTypeUserQuota: // 更新用户配额信息
				if err := increaseUserQuotaByID(key, value); err != nil {
					common.SysError("failed to batch update user quota: " + err.Error())
				}
			case common.BatchUpdateTypeTokenQuota: // 更新令牌配额信息
				if err := increaseTokenQuotaByID(key, value); err != nil {
					common.SysError("failed to batch update token quota: " + err.Error())
				}
			case common.BatchUpdateTypeUsedQuota: // 更新用户使用配额信息
				updateUserUsedQuotaByID(key, value)
			case common.BatchUpdateTypeRequestCount: // 更新用户请求计数信息
				updateUserRequestCountByID(key, value)
			case common.BatchUpdateTypeChannelUsedQuota: // 更新通道使用配额信息
				updateChannelUsedQuotaByID(key, value)
			}
		}
	}

	// 记录批量更新结束的日志
	common.SysLog("batch update finished")
}
