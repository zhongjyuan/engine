package common

import (
	"context"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

var logLevel int8
var logCount int            // logCount 用于记录日志计数
var setupLogWorking bool    // setupLogWorking 用于标识是否正在设置日志
var setupLogLock sync.Mutex // setupLogLock 是用于同步的互斥锁

// SetupLogger 用于设置框架的日志输出
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func SetupLogger() {
	if *LogDirectory != "" {
		ok := setupLogLock.TryLock()
		if !ok {
			log.Println("setup log is already working")
			return
		}

		defer func() {
			setupLogLock.Unlock()
			setupLogWorking = false
		}()

		logPath := filepath.Join(*LogDirectory, fmt.Sprintf("app-%s.log", time.Now().Format("20060102")))
		fd, err := os.OpenFile(logPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
		if err != nil {
			log.Fatal("failed to open log file")
		}
		gin.DefaultWriter = io.MultiWriter(os.Stdout, fd)

		gin.DefaultErrorWriter = io.MultiWriter(os.Stderr, fd)
	}
}

// logHelper 用于辅助记录日志信息。
//
// 输入参数：
//   - ctx context.Context: 上下文对象，用于获取请求ID。
//   - level string: 日志级别，可以是 LogInfoLevel 或其他自定义级别。
//   - msg string: 日志消息内容。
//
// 输出参数：
//   - 无。
func logHelper(ctx context.Context, level int8, msg string) {
	writer := gin.DefaultWriter // 默认使用信息输出流
	if level >= LogErrorLevel {
		writer = gin.DefaultErrorWriter // 如果是异常级别日志，则使用默认输出流
	}

	levelName := ""
	switch level {
	case LogSysLevel:
		levelName = "SYS"
	case LogTraceLevel:
		levelName = "TRACE"
	case LogDebugLevel:
		levelName = "DEBUG"
	case LogInfoLevel:
		levelName = "INFO"
	case LogWarnLevel:
		levelName = "WARN"
	case LogErrorLevel:
		levelName = "ERROR"
	default:
		levelName = "INFO"
	}

	id := ctx.Value(RequestIdKey) // 获取请求ID
	if id == nil {
		id = GenRequestID()
	}
	now := time.Now()                                                                                           // 获取当前时间
	_, _ = fmt.Fprintf(writer, "[%s] %v | %s | %s \n", levelName, now.Format("2006/01/02 - 15:04:05"), id, msg) // 格式化日志信息并输出

	logCount++                                      // 增加日志计数，这里不需要精确计数，所以无需加锁
	if logCount > LogMaxCount && !setupLogWorking { // 当日志计数超过最大值且没有日志设置工作正在进行时
		logCount = 0
		setupLogWorking = true
		go func() {
			SetupLogger() // 异步启动日志设置
		}()
	}
}

// SysLog 用于记录系统日志信息
//
// 输入参数：
//   - s string: 需要记录的系统日志信息
//
// 输出参数：
//   - 无。
func SysLog(s string) {
	t := time.Now()                                                                                 // 获取当前时间
	_, _ = fmt.Fprintf(gin.DefaultWriter, "[SYS] %v | %s \n", t.Format("2006/01/02 - 15:04:05"), s) // 格式化输出系统日志信息
}

// SysError 用于记录系统错误日志信息
//
// 输入参数：
//   - s string: 需要记录的系统错误日志信息
//
// 输出参数：
//   - 无。
func SysError(s string) {
	t := time.Now()                                                                                      // 获取当前时间
	_, _ = fmt.Fprintf(gin.DefaultErrorWriter, "[SYS] %v | %s \n", t.Format("2006/01/02 - 15:04:05"), s) // 格式化输出系统错误日志信息
}

// FatalLog 用于记录严重错误日志并退出程序
//
// 输入参数：
//   - v ...interface{}: 需要记录的严重错误信息
//
// 输出参数：
//   - 无。
func FatalLog(v ...interface{}) {
	t := time.Now()                                                                                        // 获取当前时间
	_, _ = fmt.Fprintf(gin.DefaultErrorWriter, "[FATAL] %v | %v \n", t.Format("2006/01/02 - 15:04:05"), v) // 格式化输出严重错误日志信息
	os.Exit(1)                                                                                             // 退出程序
}

func Trace(ctx context.Context, msg string) {
	if logLevel >= LogTraceLevel {
		logHelper(ctx, LogTraceLevel, msg)
	}
}

func Debug(ctx context.Context, msg string) {
	if logLevel >= LogDebugLevel {
		logHelper(ctx, LogDebugLevel, msg)
	}
}

func Info(ctx context.Context, msg string) {
	if logLevel >= LogInfoLevel {
		logHelper(ctx, LogInfoLevel, msg)
	}
}

func Warn(ctx context.Context, msg string) {
	if logLevel >= LogWarnLevel {
		logHelper(ctx, LogWarnLevel, msg)
	}
}

func Error(ctx context.Context, msg string) {
	if logLevel >= LogErrorLevel {
		logHelper(ctx, LogErrorLevel, msg)
	}
}

func Tracef(ctx context.Context, format string, a ...any) {
	Trace(ctx, fmt.Sprintf(format, a...))
}

func Debugf(ctx context.Context, format string, a ...any) {
	Debug(ctx, fmt.Sprintf(format, a...))
}

func Infof(ctx context.Context, format string, a ...any) {
	Info(ctx, fmt.Sprintf(format, a...))
}

func Warnf(ctx context.Context, format string, a ...any) {
	Warn(ctx, fmt.Sprintf(format, a...))
}

func Errorf(ctx context.Context, format string, a ...any) {
	Error(ctx, fmt.Sprintf(format, a...))
}
