package model

import (
	"os"
	"path"
	"zhongjyuan/gin-template/common"

	_ "gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type File struct {
	Id            int    `json:"id" gorm:"primarykey"`              // 文件ID
	Name          string `json:"name" gorm:"size:50;index"`         // 文件名，并在数据库中创建索引
	Size          string `json:"size" gorm:"size:10"`               // 文件大小
	Link          string `json:"link" gorm:"size:100;unique;index"` // 文件链接，并在数据库中创建唯一索引
	Extension     string `json:"extension" gorm:"size:10"`          // 文件拓展名
	DownloadCount int    `json:"download_count"`                    // 下载计数器
	Description   string `json:"description" gorm:"size:200"`       // 文件描述
	IsEnabled     bool   `json:"is_enabled" gorm:"index"`           // 是否有效
	IsDeleted     bool   `json:"is_deleted" gorm:"index"`           // 是否删除
	CreatorId     int    `json:"creator_id" gorm:"index"`           // 创建者ID，并在数据库中创建索引
	CreatorName   string `json:"creator_name" gorm:"size:50;index"` // 创建者ID，并在数据库中创建索引
	CreateTime    string `json:"create_time"`                       // 创建时间
	UpdatorId     int    `json:"updator_id" gorm:"index"`           // 更新者ID，并在数据库中创建索引
	UpdatorName   string `json:"updator_name" gorm:"size:50;index"` // 更新者ID，并在数据库中创建索引
	UpdateTime    string `json:"update_time"`                       // 更新时间
}

// TableName 方法返回表名 "plat_file"。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - string: 返回表名字符串。
func (File) TableName() string {
	return "plat_file"
}

// Insert 方法用于将文件对象插入数据库。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - error: 如果插入操作成功，则返回 nil；否则返回相应的错误信息。
func (file *File) Insert() error {
	return DB.Create(file).Error // 将文件对象插入数据库
}

// Delete 方法用于从数据库和文件系统中删除文件。
//
// 输入参数：
//   - logical bool: 指定是否进行逻辑删除，true 表示逻辑删除，false 表示物理删除。默认值为 true。
//
// 输出参数：
//   - error: 如果删除过程中发生错误，则返回相应的错误信息；否则返回 nil。
func (file *File) Delete(logical ...bool) error {
	var isLogicalDelete bool
	if len(logical) > 0 {
		isLogicalDelete = logical[0]
	} else {
		isLogicalDelete = true // 默认为逻辑删除
	}

	var err error // 定义一个错误变量，用于存储过程中可能发生的错误。

	if isLogicalDelete {
		// 逻辑删除：将 is_deleted 标记设置为 1。
		err = DB.Model(&File{}).Where("id = ?", file.Id).UpdateColumn("is_deleted", 1).Error
	} else {
		// 物理删除：从数据库中删除指定的文件记录。
		err = DB.Delete(file).Error // 如果数据库删除操作发生错误，将错误信息赋值给 err 变量。
		if err == nil {
			// 数据库删除成功后，从文件系统中删除文件。
			err = os.Remove(path.Join(*common.UploadDirectory, file.Link))
		}
	}

	return err // 返回从文件系统删除文件过程中可能发生的错误，如果没有错误发生，则返回 nil。
}

// Update 用于根据 file 中有值的字段更新数据库记录。
//
// 输入参数：
//   - file: 包含更新字段信息的 File 结构体。
//
// 输出参数：
//   - error: 如果更新过程中发生错误，则返回相应的错误信息；否则返回 nil。
func (file *File) Update() error {
	// 准备更新字段的映射
	updateFields := map[string]interface{}{
		"name":           file.Name,          // 文件名称
		"size":           file.Size,          // 文件大小
		"link":           file.Link,          // 文件链接
		"description":    file.Description,   // 文件描述
		"download_count": file.DownloadCount, // 下载次数
		"is_enabled":     file.IsEnabled,     // 是否启用
		"is_deleted":     file.IsDeleted,     // 是否已删除
		"updator_id":     file.UpdatorId,     // 更新者ID
		"updator_name":   file.UpdatorName,   // 更新者名称
		"update_time":    file.UpdateTime,    // 更新时间
	}

	// 使用 GORM 的 Updates 方法，传入 file 结构体变量，GORM 会自动忽略零值字段
	return DB.Model(&File{}).Where("id = ?", file.Id).Updates(updateFields).Error
}

func (file *File) UpdateName() error {
	return DB.Model(&File{}).Where("id = ?", file.Id).UpdateColumn("name", file.Name).Error
}

func (file *File) UpdateEnabled() error {
	return DB.Model(&File{}).Where("id = ?", file.Id).UpdateColumn("is_enabled", file.IsEnabled).Error
}

func (file *File) UpdateDeleted() error {
	return DB.Model(&File{}).Where("id = ?", file.Id).UpdateColumn("is_deleted", file.IsDeleted).Error
}

func (file *File) UpdateDescription() error {
	return DB.Model(&File{}).Where("id = ?", file.Id).UpdateColumn("description", file.Description).Error
}

func (file *File) UpdateDownloadCount() error {
	return DB.Model(&File{}).Where("id = ?", file.Id).UpdateColumn("download_count", gorm.Expr("download_count + 1")).Error
}

func InsertFile(file *File) error {
	return file.Insert()
}

func DeleteFile(file *File) error {
	return file.Delete()
}

func UpdateFile(file *File) error {
	return file.Update()
}

func UpdateFileName(file *File) error {
	return file.UpdateName()
}

func UpdateFileEnabled(file *File) error {
	return file.UpdateEnabled()
}

func UpdateFileDeleted(file *File) error {
	return file.UpdateDeleted()
}

func UpdateFileDescription(file *File) error {
	return file.UpdateDescription()
}

// UpdateDownloadCount 用于更新指定文件的下载计数器。
//
// 输入参数：
//   - fileId int: 文件ID，指定要更新下载计数的文件。
//
// 输出参数：
//   - 无。
func UpdateFileDownloadCount(file *File) error {
	return file.UpdateDownloadCount()
}

// GetFileById 用于根据文件 ID 查询文件对象。
//
// 输入参数：
//   - fileId int: 文件 ID，用于指定要查询的文件。
//
// 输出参数：
//   - *File: 查询到的文件对象指针。
//   - error: 错误信息，如果有错误发生则返回相应错误，否则为 nil。
func GetFileById(fileId int) (*File, error) {
	// 创建一个文件实体对象
	fileEntity := &File{}

	// 查询数据库，根据文件 ID 查询文件对象并返回结果
	err := DB.Where("id = ? and is_deleted = ?", fileId, 0).First(&fileEntity).Error

	return fileEntity, err
}

func GetAllFiles() ([]*File, error) {
	// 声明一个错误变量
	var err error

	// 声明一个文件切片
	var files []*File

	// 从数据库中查找所有文件，并将结果存储到 files 中
	err = DB.Find(&files).Error

	// 返回文件切片和错误信息
	return files, err
}

// GetPageFiles 用于按照指定起始索引和数量获取文件信息。
//
// 输入参数：
//   - startIdx int: 起始索引，表示从数据库中哪个位置开始获取文件信息。
//   - num int: 获取的文件数量。
//
// 输出参数：
//   - []*File: 文件信息列表。
//   - error: 错误信息，如果有错误发生则返回相应错误，否则为 nil。
func GetPageFiles(startIdx int, num int) ([]*File, error) {
	// 声明存储文件信息的切片
	var files []*File

	// 查询数据库，按照 id 降序排列，限制数量为 num，偏移量为 startIdx，将结果存储到 files 中
	err := DB.Where("is_deleted = ?", 0).Order("id desc").Limit(num).Offset(startIdx).Find(&files).Error

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
	err = DB.Select([]string{
		"id",
		"name",
		"size",
		"link",
		"extension",
		"download_count",
		"description",
		"is_enabled",
		"creator_id",
		"creator_name",
		"create_time",
	}).Where(
		"name LIKE ? or description LIKE ? or creator_id LIKE ? or creator_name = ?",
		keyword+"%",
		keyword+"%",
		keyword+"%",
		keyword,
	).Find(&files).Error

	return files, err
}
