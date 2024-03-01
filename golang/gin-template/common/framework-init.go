package common

import (
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"
)

var (
	Port         = flag.Int("port", 3000, "the listening port")
	PrintHelp    = flag.Bool("help", false, "print help and exit")
	PrintVersion = flag.Bool("version", false, "print version and exit")
	LogDir       = flag.String("log-dir", "", "specify the log directory")
)

func printHelp() {
	fmt.Println("Gin Template " + Version + " - Your next project starts from here.")
	fmt.Println("Copyright (C) 2023 ZHONGJYUAN. All rights reserved.")
	fmt.Println("Gitee: https://gitee.com/zhongjyuan/gin-template")
	fmt.Println("GitHub: https://github.com/zhongjyuan/gin-template")
	fmt.Println("Usage: gin-template [--port <port>] [--log-dir <log directory>] [--version] [--help]")
}

// init 用于初始化操作
func init() {
	flag.Parse() // 解析命令行参数

	if *PrintVersion { // 如果需要打印版本信息
		fmt.Println(Version)
		os.Exit(0)
	}

	if *PrintHelp { // 如果需要打印帮助信息
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

	if os.Getenv("UPLOAD_PATH") != "" { // 获取环境变量中的 UPLOAD_PATH
		UploadPath = os.Getenv("UPLOAD_PATH")
	}

	if *LogDir != "" { // 如果指定了日志目录
		var err error
		*LogDir, err = filepath.Abs(*LogDir) // 获取绝对路径
		if err != nil {
			log.Fatal(err)
		}

		if _, err := os.Stat(*LogDir); os.IsNotExist(err) { // 检查日志目录是否存在
			err = os.Mkdir(*LogDir, 0777) // 创建日志目录
			if err != nil {
				log.Fatal(err)
			}
		}
	}

	if _, err := os.Stat(UploadPath); os.IsNotExist(err) { // 检查上传路径是否存在
		_ = os.Mkdir(UploadPath, 0777) // 创建上传路径
	}
}
