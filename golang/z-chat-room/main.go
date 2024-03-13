package main

import (
	"embed"
	"flag"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"strconv"
	"zhongjyuan/chat-room/helper"
	"zhongjyuan/chat-room/socket"

	"github.com/gin-gonic/gin"
)

var (
	port = flag.Int("port", 3000, "specify the server listening port.")          // 监听端口号。
	Host = flag.String("host", "localhost", "the server's ip address or domain") // 服务器的 IP 地址或域名。
)

//go:embed web
var FS embed.FS // 嵌入的静态文件系统。

// loadTemplate 加载模板文件并返回模板对象。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *template.Template: 加载的模板对象。
func loadTemplate() *template.Template {
	t := template.Must(template.New("").ParseFS(FS, "web/*.html"))
	return t
}

// staticFile 处理静态文件请求，并从嵌入的静态文件系统中返回相应的文件。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象。
//
// 输出参数：
//   - 无。
func staticFile(c *gin.Context) {
	path := c.Param("file")
	c.FileFromFS("web/static/"+path, http.FS(FS))
}

// index 处理首页请求，并返回渲染后的 HTML 页面。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象。
//
// 输出参数：
//   - 无。
func index(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", nil)
}

// setRouter 设置路由规则。
//
// 输入参数：
//   - router *gin.Engine: Gin 引擎对象。
//
// 输出参数：
//   - 无。
func setRouter(router *gin.Engine) {
	router.GET("/static/:file", staticFile) // 静态文件路由。
	router.GET("/", index)                  // 首页路由。
}

func main() {
	// 设置 Gin 的运行模式为 ReleaseMode
	if os.Getenv("GIN_MODE") != "debug" {
		gin.SetMode(gin.ReleaseMode)
	}

	flag.Parse() // 解析命令行参数

	// 获取真实的端口号
	realPort := os.Getenv("PORT")
	if realPort == "" {
		realPort = strconv.Itoa(*port) // 如果环境变量中未设置端口号，则使用命令行参数中指定的端口号
	}

	// 获取本机 IP 地址
	if *Host == "localhost" {
		ip := helper.GetIp()
		if ip != "" {
			*Host = ip // 如果成功获取到 IP 地址，则将主机名设置为该 IP 地址
		}
	}

	// 创建默认的 Gin 服务器实例，并设置 HTML 渲染模板
	server := gin.Default()
	server.SetHTMLTemplate(loadTemplate())

	// 设置路由规则
	setRouter(server)

	// 创建 WebSocket 聊天室中央处理器，并启动处理器
	hub := socket.NewHub()
	go hub.Run()

	// 处理 WebSocket 连接
	server.GET("/ws", func(c *gin.Context) {
		socket.HandleWebSocketConnection(hub, c.Writer, c.Request)
	})

	// 打开浏览器并访问网页
	helper.OpenBrowser(fmt.Sprintf("http://%s:%s/", *Host, realPort))

	// 启动服务器并监听指定端口，如果出现错误则打印错误日志
	if err := server.Run(":" + realPort); err != nil {
		log.Println(err)
	}
}
