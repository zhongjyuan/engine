package log

import (
	"fmt"
	"path/filepath"
	"runtime"
	"strings"
	"time"
)

// consoleLogger 命令行日志实现
type consoleLogger struct{}

var _ Logger = (*consoleLogger)(nil)

// Sys 输出系统日志。
//
// 输入参数：
//   - v: 需要记录的日志内容。
//
// 输出参数：
//   - 无。
func (consoleLogger) Sys(v ...interface{}) {
	output("Sys", fmt.Sprint(v...))
}

// Trace 日志
func (consoleLogger) Trace(v ...interface{}) {
	output("Trace", fmt.Sprint(v...))
}

// Debug 日志
func (consoleLogger) Debug(v ...interface{}) {
	output("Debug", fmt.Sprint(v...))
}

// Info 日志
func (consoleLogger) Info(v ...interface{}) {
	output("Info", fmt.Sprint(v...))
}

// Warn 日志
func (consoleLogger) Warn(v ...interface{}) {
	output("Warning", fmt.Sprint(v...))
}

// Error
func (consoleLogger) Error(v ...interface{}) {
	output("Error", fmt.Sprint(v...))
}
func (consoleLogger) Sysf(format string, v ...interface{}) {
	output("Sys", fmt.Sprintf(format, v...))
}

// Tracef Trace Format 日志
func (consoleLogger) Tracef(format string, v ...interface{}) {
	output("Trace", fmt.Sprintf(format, v...))
}

// Debugf Debug Format 日志
func (consoleLogger) Debugf(format string, v ...interface{}) {
	output("Debug", fmt.Sprintf(format, v...))
}

// Infof Info Format 日志
func (consoleLogger) Infof(format string, v ...interface{}) {
	output("Info", fmt.Sprintf(format, v...))
}

// Warnf Warning Format 日志
func (consoleLogger) Warnf(format string, v ...interface{}) {
	output("Warning", fmt.Sprintf(format, v...))
}

// Errorf Error Format 日志
func (consoleLogger) Errorf(format string, v ...interface{}) {
	output("Error", fmt.Sprintf(format, v...))
}

// Sync 控制台 logger 不需要 sync
func (consoleLogger) Sync() error {
	return nil
}

func output(level string, v ...interface{}) {
	pc, file, line, _ := runtime.Caller(3)
	file = filepath.Base(file)
	funcName := strings.TrimPrefix(filepath.Ext(runtime.FuncForPC(pc).Name()), ".")

	logFormat := "[%s] %s %s:%d:%s " + fmt.Sprint(v...) + "\n"
	date := time.Now().Format("2006-01-02 15:04:05")
	fmt.Printf(logFormat, level, date, file, line, funcName)
}
