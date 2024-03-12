package common

import (
	"embed"
	"html/template"
	"net/http"

	"github.com/gin-gonic/gin"
)

// go:embed web/public/*
var StaticFS embed.FS

// LoadTemplate 函数用于加载模板并返回一个 *template.Template 对象。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *template.Template: 加载的模板对象。
func LoadTemplate() *template.Template {
	// 定义一个 funcMap，包含自定义函数 "unescape"，其中 UnescapeHTML 是自定义函数名。
	var funcMap = template.FuncMap{
		"unescape": UnescapeHTML,
	}

	// 使用 ParseFS 方法从 StaticFS 中解析 "public/*.html" 文件，并将 funcMap 添加到模板中。
	return template.Must(template.New("").Funcs(funcMap).ParseFS(StaticFS, "public/*.html"))
}

// GetStaticFile 用于获取静态文件并返回给客户端。
//
// 输入参数：
//   - c: *gin.Context，HTTP 请求上下文
//
// 输出参数：
//   - 无。
func GetStaticFile(c *gin.Context) {
	path := c.Param("file")                                // 获取请求中的文件路径参数
	c.FileFromFS("public/static/"+path, http.FS(StaticFS)) // 返回静态文件给客户端
}
