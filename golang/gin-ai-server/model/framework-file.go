package model

import (
	"os"
	"path"
	"zhongjyuan/gin-ai-server/common"

	_ "gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// 文件表名称
const FileTableName = "plat_file"

// FileEntity 是文件实体结构体，用于表示文件对象。
type FileEntity struct {
	Id            int    `json:"id" gorm:"column:id;primarykey"`                       // ID
	Name          string `json:"name" gorm:"column:name;size:50;index"`                // 名称
	Size          string `json:"size" gorm:"column:size;size:10"`                      // 大小
	Link          string `json:"link" gorm:"column:link;size:100;unique;index"`        // 链接，并在数据库中创建唯一索引
	Extension     string `json:"extension" gorm:"column:extension;size:10"`            // 拓展名
	DownloadCount int    `json:"downloadCount" gorm:"column:download_count"`           // 下载次数
	Description   string `json:"description" gorm:"column:description;size:200"`       // 描述
	Status        int    `json:"status" gorm:"column:status;type:int;default:1"`       // 状态，默认为1（enabled or disabled）
	CreatorId     int    `json:"creatorId" gorm:"column:creator_id;index"`             // 创建者ID，并在数据库中创建索引
	CreatorName   string `json:"creatorName" gorm:"column:creator_name;size:50;index"` // 创建者ID，并在数据库中创建索引
	CreateTime    string `json:"createTime" gorm:"column:create_time"`                 // 创建时间
	UpdatorId     int    `json:"updatorId" gorm:"column:updator_id;index"`             // 更新者ID，并在数据库中创建索引
	UpdatorName   string `json:"updatorName" gorm:"column:updator_name;size:50;index"` // 更新者ID，并在数据库中创建索引
	UpdateTime    string `json:"updateTime" gorm:"column:update_time"`                 // 更新时间
}

func (FileEntity) TableName() string {
	return FileTableName
}

func (file *FileEntity) Insert() error {
	return DB.Create(file).Error
}

func (file *FileEntity) LogicalDelete() error {
	return DB.Model(&FileEntity{}).Where("id = ?", file.Id).UpdateColumn("status", common.FileStatusDisabled).Error
}

func (file *FileEntity) PhysicalDelete() error {
	err := DB.Delete(file).Error
	if err == nil {
		err = os.Remove(path.Join(*common.UploadDirectory, file.Link))
	}
	return err
}
func (file *FileEntity) Update() error {
	// 使用 GORM 的 Updates 方法，传入 file 结构体变量，GORM 会自动忽略零值字段
	return DB.Model(&FileEntity{}).Where("id = ?", file.Id).Updates(file).Error
}

func (file *FileEntity) UpdateName() error {
	return DB.Model(&FileEntity{}).Where("id = ?", file.Id).UpdateColumn("name", file.Name).Error
}

func (file *FileEntity) UpdateStatus() error {
	return DB.Model(&FileEntity{}).Where("id = ?", file.Id).UpdateColumn("status", file.Status).Error
}

func (file *FileEntity) UpdateDescription() error {
	return DB.Model(&FileEntity{}).Where("id = ?", file.Id).UpdateColumn("description", file.Description).Error
}

func (file *FileEntity) UpdateDownloadCount() error {
	return DB.Model(&FileEntity{}).Where("id = ?", file.Id).UpdateColumn("download_count", gorm.Expr("download_count + 1")).Error
}

func InsertFile(file *FileEntity) error {
	return file.Insert()
}

func LogicalDeleteFile(file *FileEntity) error {
	return file.LogicalDelete()
}

func PhysicalDeleteFile(file *FileEntity) error {
	return file.PhysicalDelete()
}

func UpdateFile(file *FileEntity) error {
	return file.Update()
}

func UpdateFileName(file *FileEntity) error {
	return file.UpdateName()
}

func UpdateFileStatus(file *FileEntity) error {
	return file.UpdateStatus()
}

func UpdateFileDescription(file *FileEntity) error {
	return file.UpdateDescription()
}

func UpdateFileDownloadCount(file *FileEntity) error {
	return file.UpdateDownloadCount()
}

func GetFileByID(fileId int) (*FileEntity, error) {
	fileEntity := &FileEntity{}
	err := DB.Where("id = ?", fileId).First(&fileEntity).Error
	return fileEntity, err
}

func GetAllFiles() ([]*FileEntity, error) {
	var err error
	var files []*FileEntity
	err = DB.Find(&files).Error
	return files, err
}

// GetPageFiles 用于按照指定起始索引和数量获取文件信息。
//
// 输入参数：
//   - startIdx int: 起始索引，表示从数据库中哪个位置开始获取文件信息。
//   - num int: 获取的文件数量。
//
// 输出参数：
//   - []*FileEntity: 文件信息列表。
//   - error: 错误信息，如果有错误发生则返回相应错误，否则为 nil。
func GetPageFiles(startIdx int, num int) ([]*FileEntity, error) {
	// 声明存储文件信息的切片
	var files []*FileEntity

	// 查询数据库，按照 id 降序排列，限制数量为 num，偏移量为 startIdx，将结果存储到 files 中
	err := DB.Order("id desc").Limit(num).Offset(startIdx).Find(&files).Error

	return files, err
}

// SearchFiles 根据关键字搜索文件。
//
// 输入参数：
//   - keyword string: 搜索关键字，可以是文件名、上传者名或上传者ID的一部分。
//
// 输出参数：
//   - []*FileEntity: 包含搜索结果的文件切片。
//   - error: 如果搜索过程中发生错误，则返回非空的错误信息。
func SearchFiles(keyword string) (files []*FileEntity, err error) {
	// 使用数据库查询以获取与关键字匹配的文件信息
	err = DB.Select([]string{
		"id",
		"name",
		"size",
		"link",
		"extension",
		"download_count",
		"description",
		"status",
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
