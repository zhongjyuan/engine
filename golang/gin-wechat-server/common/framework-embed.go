package common

import (
	"embed"
	"io/fs"
	"net/http"

	"github.com/gin-contrib/static"
)

// embedFileSystem 实现了 static.ServeFileSystem 接口
type embedFileSystem struct {
	http.FileSystem
}

// Exists 检查文件或目录是否存在于 embed 文件系统中。
//
// 输入参数：
//   - prefix string: 路径前缀。
//   - path string: 要检查的文件或目录路径。
//
// 输出参数：
//   - bool: 如果文件或目录存在，则返回 true；否则返回 false。
func (e embedFileSystem) Exists(prefix string, path string) bool {
	_, err := e.Open(path)
	return err == nil
}

// EmbedFolder 从 embed.FS 中提取指定路径的文件系统
//
// 输入参数：
//   - fsEmbed embed.FS: 嵌入的文件系统
//   - targetPath string: 目标路径
//
// 输出参数：
//   - static.ServeFileSystem: 返回可用于静态文件服务的文件系统
func EmbedFolder(fsEmbed embed.FS, targetPath string) static.ServeFileSystem {
	efs, err := fs.Sub(fsEmbed, targetPath)
	if err != nil {
		panic(err)
	}

	return embedFileSystem{
		FileSystem: http.FS(efs),
	}
}
