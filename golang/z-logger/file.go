package log

import (
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"time"
)

// Logger 结构体定义了日志记录器。
type FileLogger struct {
	logLevel    LogLevel
	sysLogger   *log.Logger
	traceLogger *log.Logger
	debugLogger *log.Logger
	infoLogger  *log.Logger
	warnLogger  *log.Logger
	errorLogger *log.Logger
}

// MkDir 方法用于在指定目录下创建子目录。
//
// 输入参数：
//   - dirName string: 要创建的子目录名。
//
// 输出参数：
//   - error: 如果创建过程中出现错误，则返回该错误；否则返回 nil。
func mkdir(dirName string) error {
	currentDir, err := os.Getwd() // 获取当前项目路径
	if err != nil {
		return err
	}

	// 拼接完整的文件路径
	filePath := filepath.Join(currentDir, dirName, "zhongjyuan.js")

	// 创建目录
	if err := os.MkdirAll(filepath.Dir(filePath), os.ModePerm); err != nil {
		return err
	}

	return nil
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
	mkdir(logDir)
	today := time.Now().Format("2006-01-02")
	file, err := os.OpenFile(filepath.Join(logDir, today+"-"+filename), os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatal(err)
	}

	multiWriter := io.MultiWriter(os.Stdout, file)

	return log.New(multiWriter, "", log.Ldate|log.Ltime)
}

// NewLogger 函数用于创建新的日志记录器。
//
// 输入参数：
//   - logDir string: 日志文件的目录。
//   - logLevel LogLevel: 日志级别。
//
// 输出参数：
//   - *Logger: 返回新创建的日志记录器。
func NewFileLogger(logDir string, logLevel LogLevel) *FileLogger {
	logger := &FileLogger{
		logLevel:    logLevel,
		sysLogger:   createLogger(logDir, "system.log"),
		traceLogger: createLogger(logDir, "trace.log"),
		debugLogger: createLogger(logDir, "debug.log"),
		infoLogger:  createLogger(logDir, "info.log"),
		warnLogger:  createLogger(logDir, "warn.log"),
		errorLogger: createLogger(logDir, "error.log"),
	}

	// 每小时检查一次时间
	ticker := time.NewTicker(time.Hour)
	go func() {
		for range ticker.C {
			now := time.Now()
			if now.Hour() == 0 && now.Minute() == 0 && now.Second() == 0 {
				logger.sysLogger = createLogger(logDir, "system.log")
				logger.traceLogger = createLogger(logDir, "trace.log")
				logger.debugLogger = createLogger(logDir, "debug.log")
				logger.infoLogger = createLogger(logDir, "info.log")
				logger.warnLogger = createLogger(logDir, "warn.log")
				logger.errorLogger = createLogger(logDir, "error.log")
			}
		}
	}()

	return logger
}

func DefaultFileLogger() *FileLogger {
	return NewFileLogger("./logs", InfoLevel)
}

func (logger FileLogger) Sys(v ...interface{}) {
	if logger.logLevel <= SysLevel {
		logger.sysLogger.Printf(printf(v...))
	}
}

func (logger FileLogger) Trace(v ...interface{}) {
	if logger.logLevel <= TraceLevel {
		logger.traceLogger.Printf(printf(v...))
	}
}

// Debug logs a message at DebugLevel. The message includes any fields passed
func (logger FileLogger) Debug(v ...interface{}) {
	if logger.logLevel <= DebugLevel {
		logger.debugLogger.Printf(printf(v...))
	}
}

// Info logs a message at InfoLevel. The message includes any fields passed
func (logger FileLogger) Info(v ...interface{}) {
	if logger.logLevel <= InfoLevel {
		logger.infoLogger.Printf(printf(v...))
	}
}

// Warn logs a message at WarnLevel. The message includes any fields passed
func (logger FileLogger) Warn(v ...interface{}) {
	if logger.logLevel <= WarnLevel {
		logger.warnLogger.Printf(printf(v...))
	}
}

// Error logs a message at ErrorLevel. The message includes any fields passed
func (logger FileLogger) Error(v ...interface{}) {
	if logger.logLevel <= ErrorLevel {
		logger.errorLogger.Printf(printf(v...))
	}
}

func (logger FileLogger) Sysf(format string, v ...interface{}) {
	if logger.logLevel <= SysLevel {
		logger.sysLogger.Printf(printf(fmt.Sprintf(format, v...)))
	}
}

func (logger FileLogger) Tracef(format string, v ...interface{}) {
	if logger.logLevel <= TraceLevel {
		logger.traceLogger.Printf(printf(fmt.Sprintf(format, v...)))
	}
}

// Debugf logs a message at DebugLevel. The message includes any fields passed
func (logger FileLogger) Debugf(format string, v ...interface{}) {
	if logger.logLevel <= DebugLevel {
		logger.debugLogger.Printf(printf(fmt.Sprintf(format, v...)))
	}
}

// Infof logs a message at InfoLevel. The message includes any fields passed
func (logger FileLogger) Infof(format string, v ...interface{}) {
	if logger.logLevel <= InfoLevel {
		logger.infoLogger.Printf(printf(fmt.Sprintf(format, v...)))
	}
}

// Warnf logs a message at WarnLevel. The message includes any fields passed
func (logger FileLogger) Warnf(format string, v ...interface{}) {
	if logger.logLevel <= WarnLevel {
		logger.warnLogger.Printf(printf(fmt.Sprintf(format, v...)))
	}
}

// Errorf logs a message at ErrorLevel. The message includes any fields passed
func (logger FileLogger) Errorf(format string, v ...interface{}) {
	if logger.logLevel <= ErrorLevel {
		logger.errorLogger.Printf(printf(fmt.Sprintf(format, v...)))
	}
}

// Sync flushes any buffered log entries.
func (logger FileLogger) Sync() error {
	return nil
}

func printf(v ...interface{}) string {
	pc, file, line, _ := runtime.Caller(3)
	file = filepath.Base(file)
	funcName := strings.TrimPrefix(filepath.Ext(runtime.FuncForPC(pc).Name()), ".")

	logFormat := "%s %s:%d:%s " + fmt.Sprint(v...) + "\n"
	date := time.Now().Format("2006-01-02 15:04:05")
	return fmt.Sprintf(logFormat, date, file, line, funcName)
}
