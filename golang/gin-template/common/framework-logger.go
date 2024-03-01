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

var logCount int
var setupLogWorking bool
var setupLogLock sync.Mutex

// SetupLogger 用于设置框架的日志输出
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func SetupLogger() {
	if *LogDir != "" {
		ok := setupLogLock.TryLock()
		if !ok {
			log.Println("setup log is already working")
			return
		}

		defer func() {
			setupLogLock.Unlock()
			setupLogWorking = false
		}()

		logPath := filepath.Join(*LogDir, fmt.Sprintf("oneapi-%s.log", time.Now().Format("20060102")))
		fd, err := os.OpenFile(logPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
		if err != nil {
			log.Fatal("failed to open log file")
		}

		gin.DefaultWriter = io.MultiWriter(os.Stdout, fd)
		gin.DefaultErrorWriter = io.MultiWriter(os.Stderr, fd)
	}
}

func logHelper(ctx context.Context, level string, msg string) {
	writer := gin.DefaultErrorWriter
	if level == loggerINFO {
		writer = gin.DefaultWriter
	}

	id := ctx.Value(RequestIdKey)
	now := time.Now()
	_, _ = fmt.Fprintf(writer, "[%s] %v | %s | %s \n", level, now.Format("2006/01/02 - 15:04:05"), id, msg)

	logCount++ // we don't need accurate count, so no lock here
	if logCount > maxLogCount && !setupLogWorking {
		logCount = 0
		setupLogWorking = true
		go func() {
			SetupLogger()
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

func Info(ctx context.Context, msg string) {
	logHelper(ctx, loggerINFO, msg)
}

func Warn(ctx context.Context, msg string) {
	logHelper(ctx, loggerWarn, msg)
}

func Error(ctx context.Context, msg string) {
	logHelper(ctx, loggerError, msg)
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
