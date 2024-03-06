package controller

import (
	"net/http"
	"path/filepath"
	"strconv"
	"zhongjyuan/gin-one-api/common"
	"zhongjyuan/gin-one-api/converter"
	"zhongjyuan/gin-one-api/model"

	"github.com/gin-gonic/gin"
)

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
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 获取上传的文件列表
	files := form.File["file"]
	for _, file := range files {
		fileEntity := converter.Upload2FileEntity(c, file, func(savePath string) {
			if err := c.SaveUploadedFile(file, savePath); err != nil {
				common.SendFailureJSONResponse(c, err.Error())
				return
			}
		})

		if err = fileEntity.Insert(); err != nil {
			common.SendFailureJSONResponse(c, err.Error())
			return
		}
	}

	common.SendSuccessJSONResponse(c, "文件上传成功.", nil)
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
	if err != nil || fileId == 0 {
		common.SendJSONResponse(c, http.StatusBadRequest, false, "文件删除失败,无效的参数！", nil)
		return
	}

	// 获取文件对象
	fileEntity, err := model.GetFileByID(fileId)
	if err != nil {
		common.SendFailureJSONResponse(c, "文件删除失败,获取文件失败！")
		return
	}

	// 如果文件不存在，返回错误响应
	if fileEntity.Link == "" {
		common.SendFailureJSONResponse(c, "文件删除失败,文件不存在！")
		return
	}

	// 删除文件
	if err := fileEntity.LogicalDelete(); err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	common.SendSuccessJSONResponse(c, "文件删除成功", fileId)
}

// DownloadFile 用于处理文件下载请求，并向客户端返回相应的文件。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，用于获取请求相关信息。
//
// 输出参数：
//   - 无。
func DownloadFile(c *gin.Context) {
	// 从 URL 参数中获取文件 ID
	fileIdStr := c.Param("id")

	// 将文件 ID 转换为整数
	fileId, err := strconv.Atoi(fileIdStr)
	if err != nil || fileId == 0 {
		common.SendJSONResponse(c, http.StatusBadRequest, false, "文件下载失败,无效的参数！", nil)
		return
	}

	// 获取文件对象
	fileEntity, err := model.GetFileByID(fileId)
	if err != nil { // 处理解析错误并返回相应的错误信息
		common.SendFailureJSONResponse(c, "文件下载失败,获取文件失败！")
		return
	}

	// 根据文件对象状态进行处理
	switch {
	case fileEntity.Link == "":
		common.SendFailureJSONResponse(c, "文件下载失败,文件不存在！")
		return
	case fileEntity.Status == common.FileStatusDisabled:
		common.SendFailureJSONResponse(c, "文件下载失败,无效文件！")
		return
	}

	// 构建完整的文件路径
	fullPath := filepath.Join(*common.UploadDirectory, fileEntity.Link)

	// 向客户端返回文件
	c.File(fullPath)

	// 更新下载计数器，使用 goroutine 进行异步处理
	go func() {
		fileEntity.UpdateDownloadCount()
	}()
}

// GetPageFiles 用于获取分页的文件信息。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，用于获取请求相关信息。
//
// 输出参数：
//   - 无。
func GetPageFiles(c *gin.Context) {
	// 从请求参数中获取页码，并转换为整型
	p, _ := strconv.Atoi(c.Query("p"))

	// 如果页码小于 0，则设置为 0
	if p < 0 {
		p = 0
	}

	// 调用模型层函数获取文件信息
	files, err := model.GetPageFiles(p*common.ItemsPerPage, common.ItemsPerPage)
	if err != nil {
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 返回成功响应，包含文件信息
	common.SendSuccessJSONResponse(c, "获取成功", files)
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
		common.SendFailureJSONResponse(c, err.Error())
		return
	}

	// 返回成功响应，包含搜索结果
	common.SendSuccessJSONResponse(c, "检索成功", files)
}
