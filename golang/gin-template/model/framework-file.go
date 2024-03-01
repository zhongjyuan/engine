package model

import (
	"os"
	"path"
	"zhongjyuan/gin-template/common"

	_ "gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// File 结构体定义了文件对象的属性。
type File struct {
	Id              int    `json:"id"`                       // 文件ID
	Filename        string `json:"filename" gorm:"index"`    // 文件名，并在数据库中创建索引
	Description     string `json:"description"`              // 文件描述
	Uploader        string `json:"uploader" gorm:"index"`    // 上传者用户名，并在数据库中创建索引
	UploaderId      int    `json:"uploader_id" gorm:"index"` // 上传者ID，并在数据库中创建索引
	Link            string `json:"link" gorm:"unique;index"` // 文件链接，并在数据库中创建唯一索引
	UploadTime      string `json:"upload_time"`              // 上传时间
	DownloadCounter int    `json:"download_counter"`         // 下载计数器
}

// GetAllFiles 用于从数据库中获取指定范围内的文件列表。
//
// 输入参数：
//   - startIdx: 起始索引，表示从第几条记录开始获取
//   - num: 需要获取的记录数量
//
// 输出参数：
//   - []*File: 文件对象数组
//   - error: 如果获取过程中出现错误，则返回相应的错误信息；否则返回 nil。
func GetAllFiles(startIdx int, num int) ([]*File, error) {
	var files []*File
	err := DB.Order("id desc").Limit(num).Offset(startIdx).Find(&files).Error
	return files, err
}

// SearchFiles 根据关键字搜索文件。
//
// 输入参数：
//   - keyword string: 搜索关键字，可以是文件名、上传者名或上传者ID的一部分。
//
// 输出参数：
//   - []*File: 包含搜索结果的文件切片。
//   - error: 如果搜索过程中发生错误，则返回非空的错误信息。
func SearchFiles(keyword string) (files []*File, err error) {
	// 使用数据库查询以获取与关键字匹配的文件信息
	err = DB.Select([]string{"id", "filename", "description", "uploader", "uploader_id", "link", "upload_time", "download_counter"}).Where(
		"filename LIKE ? or uploader LIKE ? or uploader_id = ?", keyword+"%", keyword+"%", keyword).Find(&files).Error
	return files, err
}

// Insert 方法用于将文件对象插入数据库。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - error: 如果插入操作成功，则返回 nil；否则返回相应的错误信息。
func (file *File) Insert() error {
	err := DB.Create(file).Error // 将文件对象插入数据库
	return err
}

// Delete 方法用于从数据库和文件系统中删除指定的文件记录。
//
// 输入参数：
//   - file *File: 指向要删除的文件对象的指针。
//
// 输出参数：
//   - error: 如果删除过程中发生错误，将返回错误对象；否则返回 nil。

func (file *File) Delete() error {
	var err error // 定义一个错误变量，用于存储过程中可能发生的错误。

	// 从数据库中删除指定的文件记录。
	// DB.Delete(file) 调用 gorm 库的 Delete 方法，尝试删除 file 指向的记录。
	// .Error 是获取操作过程中可能发生的错误。
	err = DB.Delete(file).Error
	if err != nil {
		return err // 如果数据库删除操作发生错误，立即返回错误，不继续执行后面的代码。
	}

	// 从文件系统中删除文件。
	// os.Remove 用于删除指定路径的文件。
	// path.Join(common.UploadPath, file.Link) 生成文件在文件系统中的完整路径。
	// common.UploadPath 表示文件存储的根目录，file.Link 是文件相对于根目录的路径。
	err = os.Remove(path.Join(common.UploadPath, file.Link))

	return err // 返回从文件系统删除文件过程中可能发生的错误，如果没有错误发生，则返回 nil。
}

// UpdateDownloadCounter 函数用于更新文件下载计数器。
//
// 输入参数：
//   - link string: 文件链接。
//
// 输出参数：
//   - 无。
func UpdateDownloadCounter(link string) {
	// 使用 GORM 更新数据库中指定链接的文件下载计数器
	DB.Model(&File{}).Where("link = ?", link).UpdateColumn("download_counter", gorm.Expr("download_counter + 1"))
}
