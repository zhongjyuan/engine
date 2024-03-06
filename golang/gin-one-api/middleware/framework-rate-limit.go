package middleware

import (
	"context"
	"fmt"
	"net/http"
	"time"
	"zhongjyuan/gin-one-api/common"

	"github.com/gin-gonic/gin"
)

var timeFormat = "2006-01-02T15:04:05.000Z"        // timeFormat 用于定义时间格式字符串为 "2006-01-02T15:04:05.000Z"
var inMemoryRateLimiter common.InMemoryRateLimiter // inMemoryRateLimiter 是 common 包中的 InMemoryRateLimiter 结构体实例，用于内存限流器

// redisRateLimiter 是一个基于 Redis 的速率限制器函数，用于限制客户端请求的频率。
//
// 输入参数：
//   - c (*gin.Context): Gin 上下文对象。
//   - maxRequestNum int: 允许的最大请求数。
//   - duration int64: 时间段，单位为秒，内允许的最大请求数。
//   - mark string: 标记用于构建 Redis 键名的字符串。
//
// 输出参数：
//   - 无。
func redisRateLimiter(c *gin.Context, maxRequestNum int, duration int64, mark string) {
	// 创建一个后台上下文对象
	ctx := context.Background()

	// 从通用模块获取 Redis 客户端
	rdb := common.RDB

	// 构建 Redis 键名，包含 mark 和客户端 IP 地址
	key := "rateLimit:" + mark + c.ClientIP()

	// 查询 Redis 中该键的列表长度
	listLength, err := rdb.LLen(ctx, key).Result()

	// 如果出现错误，则打印错误信息，并返回状态码 500
	if err != nil {
		fmt.Println(err.Error())
		c.Status(http.StatusInternalServerError)
		c.Abort()
		return
	}

	// 如果列表长度小于最大请求数，说明可以继续请求
	if listLength < int64(maxRequestNum) {
		// 将当前时间加入 Redis 列表
		rdb.LPush(ctx, key, time.Now().Format(timeFormat))

		// 设置该键的过期时间
		rdb.Expire(ctx, key, common.RateLimitKeyExpirationDuration)
	} else {
		// 否则，获取列表中最后一个请求的时间
		oldTimeStr, _ := rdb.LIndex(ctx, key, -1).Result()
		oldTime, err := time.Parse(timeFormat, oldTimeStr)

		// 如果解析时间出错，则返回状态码 500
		if err != nil {
			fmt.Println(err)
			c.Status(http.StatusInternalServerError)
			c.Abort()
			return
		}

		// 获取当前时间
		nowTimeStr := time.Now().Format(timeFormat)
		nowTime, err := time.Parse(timeFormat, nowTimeStr)

		// 如果解析时间出错，则返回状态码 500
		if err != nil {
			fmt.Println(err)
			c.Status(http.StatusInternalServerError)
			c.Abort()
			return
		}

		// 计算两次请求的时间间隔，单位为秒
		interval := int64(nowTime.Sub(oldTime).Seconds())

		// 如果时间间隔小于设定的时间段，说明请求过于频繁，返回状态码 429
		if interval < duration {
			rdb.Expire(ctx, key, common.RateLimitKeyExpirationDuration)
			c.Status(http.StatusTooManyRequests)
			c.Abort()
			return
		} else {
			// 否则，将当前时间加入 Redis 列表，并删除多余的请求记录
			rdb.LPush(ctx, key, time.Now().Format(timeFormat))
			rdb.LTrim(ctx, key, 0, int64(maxRequestNum-1))
			rdb.Expire(ctx, key, common.RateLimitKeyExpirationDuration)
		}
	}
}

// memoryRateLimiter 是一个基于内存的速率限制器函数，用于限制客户端请求的频率。
//
// 输入参数：
//   - c (*gin.Context): Gin 上下文对象。
//   - maxRequestNum int: 允许的最大请求数。
//   - duration int64: 时间段，单位为秒，内允许的最大请求数。
//   - mark string: 标记用于构建键名的字符串。
//
// 输出参数：
//   - 无。
func memoryRateLimiter(c *gin.Context, maxRequestNum int, duration int64, mark string) {
	// 构建键名
	key := "rateLimit:" + mark + c.ClientIP()

	// 调用内存速率限制器的请求函数
	if !inMemoryRateLimiter.Request(key, maxRequestNum, duration) {
		// 如果请求不通过，返回状态码 429
		c.Status(http.StatusTooManyRequests)
		c.Abort()
		return
	}
}

// rateLimitFactory 是一个速率限制器工厂函数，根据配置选择使用基于 Redis 或基于内存的速率限制器。
//
// 输入参数：
//   - maxRequestNum int: 允许的最大请求数。
//   - duration int64: 时间段，单位为秒，在这段时间内允许的最大请求数。
//   - mark string: 用于构建键名的标记字符串。
//
// 输出参数：
//   - func(*gin.Context): 返回一个函数，该函数接受一个 Gin 上下文对象，用于处理 HTTP 请求和响应。
func rateLimitFactory(maxRequestNum int, duration int64, mark string) func(c *gin.Context) {
	// 如果 Redis 可用，则返回基于 Redis 的速率限制器函数
	if common.RedisEnabled {
		return func(c *gin.Context) {
			redisRateLimiter(c, maxRequestNum, duration, mark)
		}
	} else {
		// 如果 Redis 不可用，则使用基于内存的速率限制器函数
		// 安全调用多次初始化函数
		inMemoryRateLimiter.Init(common.RateLimitKeyExpirationDuration)
		return func(c *gin.Context) {
			memoryRateLimiter(c, maxRequestNum, duration, mark)
		}
	}
}

// GlobalWebRateLimit 返回一个全局 Web 请求速率限制器函数。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - func(*gin.Context): 返回一个函数，该函数接受一个 Gin 上下文对象，用于处理 HTTP 请求和响应。
func GlobalWebRateLimit() func(c *gin.Context) {
	// 调用速率限制器工厂函数，设置全局 Web 请求速率限制器
	return rateLimitFactory(common.GlobalWebRateLimitNum, common.GlobalWebRateLimitDuration, "GW")
}

// GlobalAPIRateLimit 返回一个全局 API 请求速率限制器函数。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - func(*gin.Context): 返回一个函数，该函数接受一个 Gin 上下文对象，用于处理 HTTP 请求和响应。
func GlobalAPIRateLimit() func(c *gin.Context) {
	// 调用速率限制器工厂函数，设置全局 API 请求速率限制器
	return rateLimitFactory(common.GlobalApiRateLimitNum, common.GlobalApiRateLimitDuration, "GA")
}

// CriticalRateLimit 返回一个关键请求速率限制器函数。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - func(*gin.Context): 返回一个函数，该函数接受一个 Gin 上下文对象，用于处理 HTTP 请求和响应。
func CriticalRateLimit() func(c *gin.Context) {
	// 调用速率限制器工厂函数，设置关键请求速率限制器
	return rateLimitFactory(common.CriticalRateLimitNum, common.CriticalRateLimitDuration, "CT")
}

// DownloadRateLimit 返回一个下载请求速率限制器函数。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - func(*gin.Context): 返回一个函数，该函数接受一个 Gin 上下文对象，用于处理 HTTP 请求和响应。
func DownloadRateLimit() func(c *gin.Context) {
	// 调用速率限制器工厂函数，设置下载请求速率限制器
	return rateLimitFactory(common.DownloadRateLimitNum, common.DownloadRateLimitDuration, "DW")
}

// UploadRateLimit 返回一个上传请求速率限制器函数。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - func(*gin.Context): 返回一个函数，该函数接受一个 Gin 上下文对象，用于处理 HTTP 请求和响应。
func UploadRateLimit() func(c *gin.Context) {
	// 调用速率限制器工厂函数，设置上传请求速率限制器
	return rateLimitFactory(common.UploadRateLimitNum, common.UploadRateLimitDuration, "UP")
}
