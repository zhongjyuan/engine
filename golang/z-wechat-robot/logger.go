package wechatbot

import (
	"io"
	"log"
	"os"
	"path/filepath"
	"time"
)

// LogLevel 定义日志级别类型。
type LogLevel int

const (
	CollectLevel LogLevel = -1
	DebugLevel   LogLevel = 0
	TraceLevel   LogLevel = 1
	InfoLevel    LogLevel = 2
	WarnLevel    LogLevel = 3
	ErrorLevel   LogLevel = 4
)

// Logger 结构体定义了日志记录器。
type Logger struct {
	collectLogger *log.Logger
	debugLogger   *log.Logger
	traceLogger   *log.Logger
	infoLogger    *log.Logger
	warnLogger    *log.Logger
	errorLogger   *log.Logger
	logLevel      LogLevel
}

// NewLogger 函数用于创建新的日志记录器。
//
// 输入参数：
//   - logDir string: 日志文件的目录。
//   - logLevel LogLevel: 日志级别。
//
// 输出参数：
//   - *Logger: 返回新创建的日志记录器。
func NewLogger(logDir string, logLevel LogLevel) *Logger {
	logger := &Logger{
		collectLogger: createLogger(logDir, "collect.log"),
		debugLogger:   createLogger(logDir, "debug.log"),
		traceLogger:   createLogger(logDir, "trace.log"),
		infoLogger:    createLogger(logDir, "info.log"),
		warnLogger:    createLogger(logDir, "warn.log"),
		errorLogger:   createLogger(logDir, "error.log"),
		logLevel:      logLevel,
	}

	// 每小时检查一次时间
	ticker := time.NewTicker(time.Hour)
	go func() {
		for range ticker.C {
			now := time.Now()
			if now.Hour() == 0 && now.Minute() == 0 && now.Second() == 0 {
				logger.collectLogger = createLogger(logDir, "collect.log")
				logger.debugLogger = createLogger(logDir, "debug.log")
				logger.traceLogger = createLogger(logDir, "trace.log")
				logger.infoLogger = createLogger(logDir, "info.log")
				logger.warnLogger = createLogger(logDir, "warn.log")
				logger.errorLogger = createLogger(logDir, "error.log")
			}
		}
	}()

	return logger
}

// createLogger 函数用于创建一个日志记录器。
//
// 输入参数：
//   - logDir string: 日志文件的目录。
//   - filename string: 日志文件名。
//
// 输出参数：
//   - *log.Logger: 返回创建的日志记录器。
func createLogger(logDir string, filename string) *log.Logger {
	file, err := os.OpenFile(getLogFilePath(logDir, filename), os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatal(err)
	}

	multiWriter := io.MultiWriter(os.Stdout, file)

	return log.New(multiWriter, "", log.Ldate|log.Ltime)
}

// getLogFilePath 函数用于获取日志文件的路径。
//
// 输入参数：
//   - logDir string: 日志文件的目录。
//   - filename string: 日志文件名。
//
// 输出参数：
//   - string: 返回日志文件的完整路径。
func getLogFilePath(logDir string, filename string) string {
	today := time.Now().Format("2006-01-02")
	return filepath.Join(logDir, today+"-"+filename)
}

func (logger *Logger) Collect(format string, v ...interface{}) {
	if logger.logLevel <= CollectLevel {
		logger.debugLogger.Printf("[Collect] "+format, v...)
	}
}

// Debug 方法用于记录调试级别的日志信息。
//
// 输入参数：
//   - format string: 日志格式字符串。
//   - v ...interface{}: 可变参数，用于填充日志格式字符串中的占位符。
func (logger *Logger) Debug(format string, v ...interface{}) {
	if logger.logLevel <= DebugLevel {
		logger.debugLogger.Printf("[DEBUG] "+format, v...)
	}
}

// Trace 方法用于记录跟踪级别的日志信息。
//
// 输入参数：
//   - format string: 日志格式字符串。
//   - v ...interface{}: 可变参数，用于填充日志格式字符串中的占位符。
func (logger *Logger) Trace(format string, v ...interface{}) {
	if logger.logLevel <= TraceLevel {
		logger.traceLogger.Printf("[TRACE] "+format, v...)
	}
}

// Info 方法用于记录信息级别的日志信息。
//
// 输入参数：
//   - format string: 日志格式字符串。
//   - v ...interface{}: 可变参数，用于填充日志格式字符串中的占位符。
func (logger *Logger) Info(format string, v ...interface{}) {
	if logger.logLevel <= InfoLevel {
		logger.infoLogger.Printf("[INFO] "+format, v...)
	}
}

// Warn 方法用于记录警告级别的日志信息。
//
// 输入参数：
//   - format string: 日志格式字符串。
//   - v ...interface{}: 可变参数，用于填充日志格式字符串中的占位符。
func (logger *Logger) Warn(format string, v ...interface{}) {
	if logger.logLevel <= WarnLevel {
		logger.warnLogger.Printf("[WARN] "+format, v...)
	}
}

// Error 方法用于记录错误级别的日志信息。
//
// 输入参数：
//   - format string: 日志格式字符串。
//   - v ...interface{}: 可变参数，用于填充日志格式字符串中的占位符。
func (logger *Logger) Error(format string, v ...interface{}) {
	if logger.logLevel <= ErrorLevel {
		logger.errorLogger.Printf("[ERROR] "+format, v...)
	}
}
