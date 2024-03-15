package model

import (
	"fmt"
	"os"
	"strings"
	"time"
	"zhongjyuan/gin-ai-server/common"

	"gorm.io/driver/mysql"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// DB 是一个全局变量，用于存储 *gorm.DB 类型的数据库连接。
var DB *gorm.DB
var LOG_DB *gorm.DB

// CreateRootAccountIfNeed 用于根据需要创建根账户。
//
// 如果数据库中不存在用户，则创建一个根用户，用户名为 "root"，密码为 "123456"。
// 如果存在用户或创建过程中发生错误，则返回相应的错误信息；否则返回 nil。
//
// 输入参数：无
// 输出参数：
//   - error: 如果创建根账户过程中出现错误，则返回相应的错误信息；否则返回 nil。
func CreateRootAccountIfNeed() error {
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

func chooseDB(envName string) (*gorm.DB, error) {
	if os.Getenv(envName) != "" {
		dsn := os.Getenv(envName)
		if strings.HasPrefix(dsn, "postgres://") {
			common.UsingPostgreSQL = true
			common.SysLog("using PostgreSQL as database")
			return gorm.Open(postgres.New(postgres.Config{
				DSN:                  dsn,
				PreferSimpleProtocol: true, // disables implicit prepared statement usage
			}), &gorm.Config{
				PrepareStmt: true, // precompile SQL
			})
		}

		// Use MySQL
		common.UsingMySQL = true
		common.SysLog("using MySQL as database")
		return gorm.Open(mysql.Open(dsn), &gorm.Config{
			PrepareStmt: true, // precompile SQL
		})
	}

	// Use SQLite
	common.SysLog("SQL_DSN not set, using SQLite as database")
	common.UsingSQLite = true
	config := fmt.Sprintf("?_busy_timeout=%d", common.SQLiteBusyTimeout)
	return gorm.Open(sqlite.Open(common.SQLitePath+config), &gorm.Config{
		PrepareStmt: true, // precompile SQL
	})
}

func migration(db *gorm.DB) error {
	common.SysLog("database migration started")

	if err := db.AutoMigrate(&FileEntity{}); err != nil {
		return err
	}
	if err := db.AutoMigrate(&UserEntity{}, &UserProfileEntity{}); err != nil {
		return err
	}
	if err := db.AutoMigrate(&OptionEntity{}); err != nil {
		return err
	}

	if err := db.AutoMigrate(&LogEntity{}); err != nil {
		return err
	}
	if err := db.AutoMigrate(&TokenEntity{}); err != nil {
		return err
	}
	if err := db.AutoMigrate(&RedemptionEntity{}); err != nil {
		return err
	}
	if err := db.AutoMigrate(&ChannelEntity{}); err != nil {
		return err
	}
	if err := db.AutoMigrate(&AbilityEntity{}); err != nil {
		return err
	}

	common.SysLog("database migration finish")

	return nil
}

// InitDB 用于初始化数据库连接并进行必要的数据迁移和根账户创建操作。
//
// 输入参数：
//   - 无
//
// 输出参数：
//   - err: 如果初始化过程中出现错误，则返回相应的错误信息；否则返回 nil。
func InitDB(envName string) (db *gorm.DB, err error) {
	db, err = chooseDB(envName)
	if err == nil {
		if common.DebugSQLEnabled {
			db = db.Debug()
		}

		sqlDB, err := DB.DB()
		if err != nil {
			return nil, err
		}
		sqlDB.SetMaxIdleConns(common.GetOrDefaultEnvInt("SQL_MAX_IDLE_CONNS", 100))
		sqlDB.SetMaxOpenConns(common.GetOrDefaultEnvInt("SQL_MAX_OPEN_CONNS", 1000))
		sqlDB.SetConnMaxLifetime(time.Second * time.Duration(common.GetOrDefaultEnvInt("SQL_MAX_LIFETIME", 60)))

		if !common.IsMasterNode {
			return db, err
		}

		if common.UsingMySQL {
			_, _ = sqlDB.Exec("DROP INDEX idx_channels_key ON channels;")
		}

		if err := migration(db); err != nil {
			return nil, err
		}

		return db, err
	} else {
		common.FatalLog(err) // 记录致命错误日志
	}

	return db, err
}

// CloseDB 用于关闭数据库连接。
//
// 输入参数：
//   - 无
//
// 输出参数：
//   - error: 如果关闭数据库连接过程中出现错误，则返回相应的错误信息；否则返回 nil。
func closeDB(db *gorm.DB) error {
	sqlDB, err := db.DB() // 获取数据库连接对象
	if err != nil {
		return err
	}

	return sqlDB.Close() // 关闭数据库连接
}

func CloseDB() error {
	if LOG_DB != DB {
		err := closeDB(LOG_DB)
		if err != nil {
			return err
		}
	}
	return closeDB(DB)
}
