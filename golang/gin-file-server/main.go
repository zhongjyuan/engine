package main

import (
	"embed"
	"fmt"
	"os"
	"strconv"
	"zhongjyuan/gin-file-server/common"
	"zhongjyuan/gin-file-server/middleware"
	"zhongjyuan/gin-file-server/model"
	"zhongjyuan/gin-file-server/router"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-contrib/sessions/redis"
	"github.com/gin-gonic/gin"
)

//go:embed web/build/**/*
var buildFS embed.FS // buildFS 是一个 embed.FS 类型的变量，用于访问嵌入在二进制文件中的静态资源文件。(go:embed web/build)

// main 函数是程序的入口。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - 无。
func main() {
	// 设置日志
	common.SetupLogger()

	// 记录系统日志
	common.SysLog(fmt.Sprintf("Gin Template %s started", common.Version))

	// 如果环境变量GIN_MODE不是debug，则设置Gin的运行模式为ReleaseMode
	if os.Getenv("GIN_MODE") != "debug" {
		gin.SetMode(gin.ReleaseMode)
	}

	if common.DebugEnabled {
		common.SysLog("running in debug mode")
	}

	// 初始化SQL数据库
	err := model.InitDB()
	if err != nil {
		common.FatalLog("failed to initialize database: " + err.Error())
	}

	defer func() {
		// 关闭数据库连接
		err := model.CloseDB()
		if err != nil {
			common.FatalLog("failed to close database: " + err.Error())
		}
	}()

	// 初始化Redis
	err = common.InitRedisClient()
	if err != nil {
		common.FatalLog("failed to initialize Redis: " + err.Error())
	}

	// 初始化选项
	model.InitOptionMap()
	common.SysLog(fmt.Sprintf("using theme %s", common.Theme))

	// 初始化HTTP服务器
	server := gin.New()

	server.Use(gin.Recovery())

	// server.Use(gzip.Gzip(gzip.DefaultCompression))
	server.Use(middleware.RequestId())

	server.Use(middleware.Cors())

	middleware.SetUpLogger(server)

	// 初始化会话存储
	if common.RedisEnabled {
		opt := common.ParseRedisOption()
		store, _ := redis.NewStore(opt.MinIdleConns, opt.Network, opt.Addr, opt.Password, []byte(common.SessionSecret))
		server.Use(sessions.Sessions("session", store))
	} else {
		store := cookie.NewStore([]byte(common.SessionSecret))
		server.Use(sessions.Sessions("session", store))
	}

	// 设置路由
	router.SetRouter(server, buildFS)

	// 获取端口号
	var port = os.Getenv("PORT")
	if port == "" {
		port = strconv.Itoa(*common.ListenPort)
	}

	// 启动HTTP服务器
	err = server.Run(":" + port)
	if err != nil {
		common.FatalLog("failed to start HTTP server: " + err.Error())
	}

	common.SysLog("start HTTP server: " + port)
}
