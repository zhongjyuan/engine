package model

import (
	"os"
	"zhongjyuan/gin-file-server/common"

	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// DB 是一个全局变量，用于存储 *gorm.DB 类型的数据库连接。
var DB *gorm.DB

// createRootAccountIfNeed 用于根据需要创建根账户。
//
// 如果数据库中不存在用户，则创建一个根用户，用户名为 "root"，密码为 "123456"。
// 如果存在用户或创建过程中发生错误，则返回相应的错误信息；否则返回 nil。
//
// 输入参数：无
// 输出参数：
//   - error: 如果创建根账户过程中出现错误，则返回相应的错误信息；否则返回 nil。
func createRootAccountIfNeed() error {
	var user UserEntity // 声明一个 UserEntity 类型的变量 user

	// 检查数据库中是否已存在用户
	if err := DB.First(&user).Error; err != nil { // 查询数据库中的第一个用户
		common.SysLog("no user exists, create a root user for you: username is root, password is 123456") // 记录系统日志，提示创建根用户

		hashedPassword, err := common.Password2Hash("123456") // 将密码 "123456" 进行哈希处理
		if err != nil {
			return err // 如果哈希处理过程中出现错误，则返回该错误
		}

		// 创建根用户对象
		rootUser := UserEntity{
			UserName:    "root",
			Password:    hashedPassword,
			Role:        common.RoleRootUser,
			Status:      common.UserStatusEnabled,
			DisplayName: "Root User",
		}

		// 将根用户对象保存到数据库中
		err = DB.Create(&rootUser).Error
		if err == nil {
			DB.Create(&UserProfileEntity{Id: user.Id})
		}
	}

	return nil // 返回 nil 表示创建根账户成功
}

// CountTable 用于获取指定数据表的记录数。
//
// 输入参数：
//   - tableName: 字符串类型，表示目标数据表的名称。
//
// 输出参数：
//   - num: int64 类型，表示目标数据表的记录数。
func CountTable(tableName string) (num int64) {
	DB.Table(tableName).Count(&num) // 查询指定数据表的记录数，并将结果赋值给 num
	return                          // 返回目标数据表的记录数
}

// InitDB 用于初始化数据库连接并进行必要的数据迁移和根账户创建操作。
//
// 输入参数：
//   - 无
//
// 输出参数：
//   - err: 如果初始化过程中出现错误，则返回相应的错误信息；否则返回 nil。
func InitDB() (err error) {
	var db *gorm.DB

	if os.Getenv("SQL_DSN") != "" {
		// 使用 MySQL 数据库
		db, err = gorm.Open(mysql.Open(os.Getenv("SQL_DSN")), &gorm.Config{
			PrepareStmt: true, // 开启预编译 SQL 语句
		})
		common.SysLog("using MySQL as database")
	} else {
		// 使用 SQLite 数据库
		db, err = gorm.Open(sqlite.Open(common.SQLitePath), &gorm.Config{
			PrepareStmt: true, // 开启预编译 SQL 语句
		})
		common.SysLog("SQL_DSN not set, using SQLite as database") // 记录系统日志，提示使用 SQLite 作为数据库
	}

	if err == nil {
		DB = db // 将数据库连接赋值给全局变量 DB

		// 执行数据表迁移操作
		if err := db.AutoMigrate(&FileEntity{}); err != nil {
			return err
		}

		if err := db.AutoMigrate(&UserEntity{}, &UserProfileEntity{}); err != nil {
			return err
		}

		if err := db.AutoMigrate(&OptionEntity{}); err != nil {
			return err
		}

		// 创建根账户
		return createRootAccountIfNeed()
	} else {
		common.FatalLog(err) // 记录致命错误日志
	}

	return err
}

// CloseDB 用于关闭数据库连接。
//
// 输入参数：
//   - 无
//
// 输出参数：
//   - error: 如果关闭数据库连接过程中出现错误，则返回相应的错误信息；否则返回 nil。
func CloseDB() error {
	sqlDB, err := DB.DB() // 获取数据库连接对象
	if err != nil {
		return err
	}

	return sqlDB.Close() // 关闭数据库连接
}
