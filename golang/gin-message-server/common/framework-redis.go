package common

import (
	"context"
	"os"
	"time"

	"github.com/go-redis/redis/v8"
)

// RDB 是 Redis 客户端实例
var RDB *redis.Client

// InitRedisClient This function is called after init()

// InitRedisClient 用于初始化 Redis 客户端连接
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - error: 如果初始化过程中出现错误，则返回对应错误信息；否则返回 nil。
func InitRedisClient() (err error) {
	// 检查是否设置了 Redis 连接字符串
	if os.Getenv("REDIS_CONN_STRING") == "" {
		RedisEnabled = false
		SysLog("REDIS_CONN_STRING not set, Redis is disabled")
		return nil
	}
	SysLog("Redis is enabled")

	// 解析 Redis 连接字符串为连接选项
	opt, err := redis.ParseURL(os.Getenv("REDIS_CONN_STRING"))
	if err != nil {
		FatalLog("failed to parse Redis connection string: " + err.Error())
	}

	// 创建 Redis 客户端实例
	RDB = redis.NewClient(opt)

	// 创建上下文和超时时间
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// 发送 Ping 命令检查连接
	_, err = RDB.Ping(ctx).Result()
	if err != nil {
		FatalLog("Redis ping test failed: " + err.Error())
	}

	return err
}

// ParseRedisOption 用于解析 Redis 连接选项
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *redis.Options: 返回解析后的 Redis 连接选项，若解析失败则会触发 panic。
func ParseRedisOption() *redis.Options {
	// 解析 Redis 连接字符串为连接选项
	opt, err := redis.ParseURL(os.Getenv("REDIS_CONN_STRING"))
	if err != nil {
		FatalLog("failed to parse Redis connection string: " + err.Error())
	}
	return opt
}

func RedisSet(key string, value string, expiration time.Duration) error {
	ctx := context.Background()
	return RDB.Set(ctx, key, value, expiration).Err()
}

func RedisGet(key string) (string, error) {
	ctx := context.Background()
	return RDB.Get(ctx, key).Result()
}

func RedisDel(key string) error {
	ctx := context.Background()
	return RDB.Del(ctx, key).Err()
}

func RedisDecrease(key string, value int64) error {
	ctx := context.Background()
	return RDB.DecrBy(ctx, key, value).Err()
}
