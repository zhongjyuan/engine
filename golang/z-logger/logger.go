package log

// LogLevel 定义日志级别类型。
type LogLevel int8

const (
	SysLevel LogLevel = iota - 2
	TraceLevel
	DebugLevel
	InfoLevel
	WarnLevel
	ErrorLevel
)

// Logger 日志需要实现的接口定义
type Logger interface {
	Sys(v ...interface{})
	Trace(v ...interface{})
	Debug(v ...interface{})
	Info(v ...interface{})
	Warn(v ...interface{})
	Error(v ...interface{})

	Sysf(format string, v ...interface{})
	Tracef(format string, v ...interface{})
	Debugf(format string, v ...interface{})
	Infof(format string, v ...interface{})
	Warnf(format string, v ...interface{})
	Errorf(format string, v ...interface{})

	// Sync logger Sync calls to flush buffer
	Sync() error
}
