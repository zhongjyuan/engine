package controller

import (
	"fmt"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"
	"time"
	"zhongjyuan/gin-template/common"
	"zhongjyuan/gin-template/model"

	"github.com/gin-gonic/gin"
)

// GetAllFiles 函数用于获取所有文件信息。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，用于处理 HTTP 请求和响应。
//
// 输出参数：
//   - 无。
func GetAllFiles(c *gin.Context) {
	// 从请求参数中获取页码，并转换为整型
	p, _ := strconv.Atoi(c.Query("p"))

	// 如果页码小于 0，则设置为 0
	if p < 0 {
		p = 0
	}

	// 调用模型层函数获取文件信息
	files, err := model.GetAllFiles(p*common.ItemsPerPage, common.ItemsPerPage)

	// 处理获取文件信息错误
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	// 返回成功响应，包含文件信息
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data":    files,
	})
}

// SearchFiles 用于搜索文件。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，用于处理 HTTP 请求和响应。
//
// 输出参数：
//   - 无。
func SearchFiles(c *gin.Context) {
	// 从查询参数中获取关键字
	keyword := c.Query("keyword")

	// 调用 model 包中的 SearchFiles 函数进行文件搜索
	files, err := model.SearchFiles(keyword)

	// 处理搜索错误，返回错误响应
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	// 返回成功响应，包含搜索结果
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data":    files,
	})
}

// UploadFile 函数用于处理文件上传请求。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，用于处理 HTTP 请求和响应。
//
// 输出参数：
//   - 无。
func UploadFile(c *gin.Context) {
	// 解析多部分表单数据
	form, err := c.MultipartForm()
	if err != nil {
		// 处理解析错误并返回相应的错误信息
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	// 获取上传路径
	uploadPath := common.UploadPath

	// 获取描述信息，如果为空则设置默认值
	description := c.PostForm("description")
	if description == "" {
		description = "无描述信息"
	}

	// 获取上传者用户名，如果为空则设置默认值
	uploader := c.GetString("username")
	if uploader == "" {
		uploader = "访客用户"
	}

	// 获取上传者 ID
	uploaderId := c.GetInt("id")

	// 获取当前时间并格式化为字符串
	currentTime := time.Now().Format("2006-01-02 15:04:05")

	// 获取上传的文件列表
	files := form.File["file"]

	// 遍历文件列表
	for _, file := range files {
		// 获取文件名和文件扩展名
		filename := filepath.Base(file.Filename)
		ext := filepath.Ext(filename)

		// 生成文件链接
		link := common.GetUUID() + ext

		// 构建文件保存路径
		savePath := filepath.Join(uploadPath, link)

		// 保存文件到服务器
		if err := c.SaveUploadedFile(file, savePath); err != nil {
			// 处理保存文件错误并返回相应的错误信息
			c.JSON(http.StatusOK, gin.H{
				"success": false,
				"message": err.Error(),
			})
			return
		}

		// 将文件信息保存到数据库
		fileObj := &model.File{
			Description: description,
			Uploader:    uploader,
			UploadTime:  currentTime,
			UploaderId:  uploaderId,
			Link:        link,
			Filename:    filename,
		}
		err = fileObj.Insert()
		if err != nil {
			_ = fmt.Errorf(err.Error())
		}
	}

	// 返回成功响应
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
	})
}

// DeleteFile 用于删除文件。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，用于处理 HTTP 请求和响应。
//
// 输出参数：
//   - 无。
func DeleteFile(c *gin.Context) {
	// 从 URL 参数中获取文件 ID
	fileIdStr := c.Param("id")

	// 将文件 ID 转换为整数
	fileId, err := strconv.Atoi(fileIdStr)

	// 处理无效参数或转换错误
	if err != nil || fileId == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "无效的参数",
		})
		return
	}

	// 创建文件对象
	fileObj := &model.File{
		Id: fileId,
	}

	// 根据文件 ID 查询文件对象
	model.DB.Where("id = ?", fileId).First(&fileObj)

	// 如果文件不存在，返回错误响应
	if fileObj.Link == "" {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "文件不存在！",
		})
		return
	}

	// 删除文件
	err = fileObj.Delete()

	// 处理删除错误，返回相应的响应
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": err.Error(),
		})
		return
	} else {
		// 文件删除成功，返回成功响应
		message := "文件删除成功"
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": message,
		})
	}
}

// DownloadFile 函数用于下载文件。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，用于处理 HTTP 请求和响应。
//
// 输出参数：
//   - 无。
func DownloadFile(c *gin.Context) {
	// 从 URL 参数中获取文件路径
	path := c.Param("file")

	// 构建完整的文件路径
	fullPath := filepath.Join(common.UploadPath, path)

	// 检查完整路径是否以指定的上传路径开头，防止路径遍历攻击
	if !strings.HasPrefix(fullPath, common.UploadPath) {
		// 如果路径不合法，则返回 403 错误
		c.Status(403)
		return
	}

	// 向客户端返回文件
	c.File(fullPath)

	// 更新下载计数器，使用 goroutine 进行异步处理
	go func() {
		model.UpdateDownloadCounter(path)
	}()
}
