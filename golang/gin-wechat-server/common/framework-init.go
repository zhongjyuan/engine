package common

import (
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"
)

var (
	ListenPort      = flag.Int("port", 3000, "the listening port")                                    // 监听端口号，默认为 3000
	ShowHelp        = flag.Bool("help", false, "print help and exit")                                 // 是否打印帮助信息并退出
	ShowVersion     = flag.Bool("version", false, "print version and exit")                           // 是否打印版本信息并退出
	LogDirectory    = flag.String("log-dir", "./appData/logs", "specify the log directory")           // 指定日志记录目录
	UploadDirectory = flag.String("upload-dir", "./appData/attachments", "specify the log directory") // 指定文件上传目录
)

// printHelp 函数用于打印帮助信息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func printHelp() {
	fmt.Println("Gin Template " + Version + " - Your next project starts from here.")                        // 打印版本信息
	fmt.Println("Copyright (C) 2023 ZHONGJYUAN. All rights reserved.")                                       // 版权信息
	fmt.Println("Gitee: https://gitee.com/zhongjyuan/gin-wechat-server")                                     // Gitee 地址
	fmt.Println("GitHub: https://github.com/zhongjyuan/gin-wechat-server")                                   // GitHub 地址
	fmt.Println("Usage: gin-wechat-server [--port <port>] [--log-dir <log directory>] [--version] [--help]") // 使用说明
}

// init 用于初始化操作
func init() {
	flag.Parse() // 解析命令行参数

	if *ShowVersion { // 如果需要打印版本信息
		fmt.Println(Version)
		os.Exit(0)
	}

	if *ShowHelp { // 如果需要打印帮助信息
		printHelp()
		os.Exit(0)
	}

	if os.Getenv("SESSION_SECRET") != "" { // 获取环境变量中的 SESSION_SECRET
		if os.Getenv("SESSION_SECRET") == "random_string" {
			SysError("SESSION_SECRET is set to an example value, please change it to a random string.")
		} else {
			SessionSecret = os.Getenv("SESSION_SECRET")
		}
	}

	if os.Getenv("SQLITE_PATH") != "" { // 获取环境变量中的 SQLITE_PATH
		SQLitePath = os.Getenv("SQLITE_PATH")
	}

	if *LogDirectory != "" { // 如果指定了日志目录
		var err error

		*LogDirectory, err = filepath.Abs(*LogDirectory) // 获取绝对路径
		if err != nil {
			log.Fatal(err)
		}

		if _, err := os.Stat(*LogDirectory); os.IsNotExist(err) { // 检查日志目录是否存在
			err = os.MkdirAll(*LogDirectory, 0777) // 创建日志目录
			if err != nil {
				log.Fatal(err)
			}
		}
	}

	if _, err := os.Stat(*UploadDirectory); os.IsNotExist(err) { // 检查上传路径是否存在
		_ = os.MkdirAll(*UploadDirectory, 0777) // 创建上传路径
	}
}
