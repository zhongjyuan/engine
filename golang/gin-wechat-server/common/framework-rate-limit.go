package common

import (
	"sync"
	"time"
)

// InMemoryRateLimiter 结构体定义了基于内存的速率限制器
type InMemoryRateLimiter struct {
	store              map[string]*[]int64 // 存储每个键对应的时间戳队列
	mutex              sync.Mutex          // 互斥锁，保护并发访问
	expirationDuration time.Duration       // 数据过期时长
}

// Init 方法用于初始化速率限制器，如果未初始化则进行初始化操作
//
// 输入参数：
//   - expirationDuration time.Duration: 过期时间间隔
//
// 输出参数：
//   - 无。
func (l *InMemoryRateLimiter) Init(expirationDuration time.Duration) {
	// 检查是否已经初始化
	if l.store == nil {
		l.mutex.Lock()

		// 再次检查是否已经初始化，防止多个goroutine同时进行初始化
		if l.store == nil {
			l.store = make(map[string]*[]int64) // 初始化存储数据的map

			l.expirationDuration = expirationDuration // 设置过期时间间隔

			// 如果过期时间大于0，则启动清除过期数据项的goroutine
			if expirationDuration > 0 {
				go l.clearExpiredItems()
			}
		}

		l.mutex.Unlock()
	}
}

// clearExpiredItems 方法用于定期清除过期的数据项
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func (l *InMemoryRateLimiter) clearExpiredItems() {
	for {
		time.Sleep(l.expirationDuration) // 等待过期时间间隔

		l.mutex.Lock() // 加锁，保护并发访问

		now := time.Now().Unix()   // 获取当前时间戳
		for key := range l.store { // 遍历存储数据的map

			queue := l.store[key] // 获取键对应的时间戳队列
			size := len(*queue)   // 获取队列长度

			// 如果队列为空或者最后一个时间戳已经超过过期时间间隔，则删除该键
			if size == 0 || now-(*queue)[size-1] > int64(l.expirationDuration.Seconds()) {
				delete(l.store, key)
			}
		}

		l.mutex.Unlock() // 解锁
	}
}

// Request 方法用于处理请求并进行速率限制检查
//
// 输入参数：
//   - key string: 请求的键值
//   - maxRequestNum int: 最大请求数
//   - duration int64: 时间段长度
//
// 输出参数：
//   - bool: 如果请求通过速率限制，则返回 true；否则返回 false。
func (l *InMemoryRateLimiter) Request(key string, maxRequestNum int, duration int64) bool {
	l.mutex.Lock() // 加锁，保护并发访问

	defer l.mutex.Unlock() // 延迟解锁

	queue, ok := l.store[key] // 获取指定键对应的时间戳队列

	now := time.Now().Unix() // 获取当前时间戳
	if ok {                  // 如果键存在

		if len(*queue) < maxRequestNum { // 如果队列长度小于最大请求数

			*queue = append(*queue, now) // 将当前时间戳加入队列

			return true // 请求通过限制
		} else {

			if now-(*queue)[0] >= duration { // 如果时间段已经过去

				*queue = (*queue)[1:] // 移除最早的时间戳

				*queue = append(*queue, now) // 将当前时间戳加入队列

				return true // 请求通过限制
			} else {
				return false // 请求未通过限制
			}
		}
	} else { // 如果键不存在

		s := make([]int64, 0, maxRequestNum) // 创建新的时间戳队列

		l.store[key] = &s // 存储新队列到map中

		*(l.store[key]) = append(*(l.store[key]), now) // 将当前时间戳加入队列
	}

	return true
}
