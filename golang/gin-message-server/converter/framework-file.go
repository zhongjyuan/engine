package converter

import (
	"mime/multipart"
	"path/filepath"
	"time"
	"zhongjyuan/gin-message-server/common"
	"zhongjyuan/gin-message-server/model"

	"github.com/gin-gonic/gin"
)

// Upload2FileEntity 将上传的文件信息转换为文件实体对象并保存到服务器。
//
// 输入参数：
//   - c *gin.Context: Gin 上下文对象，用于获取请求相关信息。
//   - file *multipart.FileHeader: 上传的文件对象。
//   - saveFile func(savePath string): 保存文件的函数。
//
// 输出参数：
//   - *model.FileEntity: 返回生成的文件实体对象。
func Upload2FileEntity(c *gin.Context, file *multipart.FileHeader, saveFile func(savePath string)) *model.FileEntity {
	// 获取上传者信息
	uploader := "访客用户" // 默认为访客用户
	if val, exists := c.Get("userName"); exists {
		uploader = val.(string) // 如果存在用户名信息，则使用实际用户名
	}

	uploaderId := 0 // 默认为0
	if val, exists := c.Get("id"); exists {
		uploaderId = val.(int) // 如果存在用户ID信息，则使用实际用户ID
	}

	// 获取描述信息
	description := c.PostForm("description")
	if description == "" {
		description = "暂无描述信息"
	}

	// 构建文件实体对象
	fileEntity := &model.FileEntity{
		Name:          filepath.Base(file.Filename),
		Size:          common.Bytes2Size(file.Size),
		Extension:     filepath.Ext(file.Filename),
		Link:          common.GetUUID() + filepath.Ext(file.Filename),
		DownloadCount: 0,
		Description:   description,
		Status:        1,
		CreatorId:     uploaderId,
		CreatorName:   uploader,
		CreateTime:    time.Now().Format("2006-01-02 15:04:05"),
	}

	// 保存文件到服务器
	savePath := filepath.Join(*common.UploadDirectory, fileEntity.Link)
	saveFile(savePath)

	return fileEntity
}
