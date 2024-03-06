package model

import (
	"errors"
	"strings"
	"zhongjyuan/gin-one-api/common"
)

const UserTableName = "plat_user"

// UserEntity 结构体定义了用户的数据模型。
type UserEntity struct {
	Id          int               `json:"id" gorm:"column:id;primaryKey;unique;autoIncrement"`                        // 用户ID，唯一主键，自增
	UserName    string            `json:"userName" gorm:"column:user_name;size:10;unique;index" validate:"max=10"`    // 用户名，唯一索引，最大长度为10
	Password    string            `json:"password" gorm:"column:password;size:100;not null;" validate:"min=8,max=20"` // 密码，非空，长度限制为8到20之间
	DisplayName string            `json:"displayName" gorm:"column:display_name;size:50;index" validate:"max=50"`     // 显示名，索引，最大长度为50
	Email       string            `json:"email" gorm:"column:email;size:50;index" validate:"max=50"`                  // 邮箱，索引，最大长度为50
	Mobile      string            `json:"mobile" gorm:"column:mobile;size:20;index" validate:"max=20"`                // 手机号，索引，最大长度为20
	Telephone   string            `json:"telephone" gorm:"column:telephone;size:20;index" validate:"max=20"`          // 座机号，索引，最大长度为20
	Description string            `json:"description" gorm:"column:description;size:200"`                             // 描述
	Role        int               `json:"role" gorm:"column:role;type:int;default:1"`                                 // 角色，默认为1（admin or common）
	Token       string            `json:"token" gorm:"column:token;index"`                                            // Token，索引
	Status      int               `json:"status" gorm:"column:status;type:int;default:1"`                             // 状态，默认为1（enabled or disabled）
	CreatorId   int               `json:"creatorId" gorm:"column:creator_id;index"`                                   // 创建者ID，并在数据库中创建索引
	CreatorName string            `json:"creatorName" gorm:"column:creator_name;size:50;index"`                       // 创建者ID，并在数据库中创建索引
	CreateTime  string            `json:"createTime" gorm:"column:create_time;index"`                                 // 创建时间
	UpdatorId   int               `json:"updatorId" gorm:"column:updator_id;index"`                                   // 更新者ID，并在数据库中创建索引
	UpdatorName string            `json:"updatorName" gorm:"column:updator_name;size:50;index"`                       // 更新者ID，并在数据库中创建索引
	UpdateTime  string            `json:"updateTime" gorm:"column:update_time;index"`                                 // 更新时间
	Profile     UserProfileEntity `json:"profile" gorm:"foreignKey:Id;references:Id"`                                 //
}

func (UserEntity) TableName() string {
	return UserTableName
}

func (user *UserEntity) Insert() error {
	var err error

	// 如果用户密码不为空，则对密码进行哈希处理
	if user.Password != "" {
		user.Password, err = common.Password2Hash(user.Password)
		if err != nil {
			return err
		}
	}

	// 调用 GORM 的 Create 方法向数据库中插入用户信息，并返回可能出现的错误
	err = DB.Create(user).Error
	if err == nil {
		err = DB.Create(UserProfileEntity{Id: user.Id}).Error
	}

	return err
}

func (user *UserEntity) Delete() error {
	// 如果用户ID为空，则返回错误信息
	if user.Id == 0 {
		return errors.New("id 为空！")
	}

	// 调用 GORM 的 Delete 方法删除用户信息，并返回可能出现的错误
	err := DB.Delete(user).Error
	if err == nil {
		err = DB.Delete(UserProfileEntity{Id: user.Id}).Error
	}

	return err
}

func (user *UserEntity) Update(updatePassword ...bool) error {
	var isUpdatePassword bool
	if len(updatePassword) > 0 {
		isUpdatePassword = updatePassword[0]
	} else {
		isUpdatePassword = true // 默认为逻辑删除
	}

	var err error

	// 如果需要更新密码，则对密码进行哈希处理
	if isUpdatePassword {
		user.Password, err = common.Password2Hash(user.Password)
		if err != nil {
			return err
		}
	}

	// 调用 GORM 的 Model 方法更新用户信息，并返回可能出现的错误
	err = DB.Model(user).Updates(user).Error

	return err
}

func (user *UserEntity) UpdatePassword() error {
	var err error

	user.Password, err = common.Password2Hash(user.Password)
	if err != nil {
		return err
	}

	return DB.Model(&UserEntity{}).Where("id = ?", user.Id).UpdateColumn("password", user.Password).Error
}

func (user *UserEntity) GetByID(selectAll bool) error {
	// 如果用户ID为空，则返回错误信息
	if user.Id == 0 {
		return errors.New("id 为空！")
	}

	if selectAll {
		// 使用 GORM 根据用户ID查询用户信息并填充字段，同时预加载 UserProfileEntity 别名为 "Profile"
		return DB.Preload("Profile").Where(UserEntity{Id: user.Id}).First(user).Error
	} else {
		return DB.Where(UserEntity{Id: user.Id}).First(user).Error
	}
}

func (user *UserEntity) GetByUserName(selectAll bool) error {
	// 如果用户名为空，则返回错误信息
	if user.UserName == "" {
		return errors.New("userName 为空！")
	}

	if selectAll {
		// 使用 GORM 根据用户ID查询用户信息并填充字段，同时预加载 UserProfileEntity 别名为 "Profile"
		return DB.Preload("Profile").Where(UserEntity{UserName: user.UserName}).First(user).Error
	} else {
		return DB.Where(UserEntity{Id: user.Id}).First(user).Error
	}
}

func (user *UserEntity) GetByEmail(selectAll bool) error {
	// 如果用户邮箱为空，则返回错误信息
	if user.Email == "" {
		return errors.New("email 为空！")
	}

	if selectAll {
		// 使用 GORM 根据用户ID查询用户信息并填充字段，同时预加载 UserProfileEntity 别名为 "Profile"
		return DB.Preload("Profile").Where(UserEntity{Email: user.Email}).First(user).Error
	} else {
		return DB.Where(UserEntity{Id: user.Id}).First(user).Error
	}
}

func (user *UserEntity) GetByToken(selectAll bool) error {
	// 如果令牌为空，则返回 nil
	if user.Token == "" {
		return errors.New("token 为空！")
	}

	// 剥离令牌前缀
	token := strings.Replace(user.Token, "Bearer ", "", 1)

	if selectAll {
		// 使用 GORM 根据用户ID查询用户信息并填充字段，同时预加载 UserProfileEntity 别名为 "Profile"
		return DB.Preload("Profile").Where("token = ?", token).First(user).Error
	} else {
		return DB.Where(UserEntity{Id: user.Id}).First(user).Error
	}
}

// Authenticate 方法用于验证用户信息并填充用户结构体。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - error: 如果验证过程中出现错误，则返回相应的错误信息；否则返回 nil。
func (user *UserEntity) Authenticate() (err error) {
	// 获取用户密码
	password := user.Password

	// 如果用户名或密码为空，返回错误信息
	if user.UserName == "" || password == "" {
		return errors.New("用户名或密码为空")
	}

	// 使用 GORM 查询用户信息
	if err := DB.Where(UserEntity{UserName: user.UserName}).First(user).Error; err != nil {
		if err := DB.Where(UserEntity{Email: user.UserName}).First(user).Error; err != nil {
			return errors.New("用户名或密码错误，或用户已被封禁")
		}
	}

	// 验证密码和哈希是否匹配，以及用户状态是否启用
	if !common.ValidatePasswordAndHash(password, user.Password) || user.Status != common.UserStatusEnabled {
		return errors.New("用户名或密码错误，或用户已被封禁")
	}

	return nil
}

func InsertUser(user *UserEntity) error {
	return user.Insert()
}

func DeleteUser(user *UserEntity) error {
	return user.Delete()
}

func DeleteUserByID(id int) (err error) {
	// 如果传入的用户ID为0，则返回错误信息
	if id == 0 {
		return errors.New("id 为空！")
	}

	// 创建一个 UserEntity 实例，并设置其ID属性为传入的用户ID
	user := UserEntity{Id: id}

	// 调用 UserEntity 实例的 Delete 方法删除用户信息，并返回可能出现的错误
	return user.Delete()
}

func UpdateUser(user *UserEntity) error {
	return user.Update()
}

func UpdateUserPassword(user *UserEntity) error {
	return user.UpdatePassword()
}

func GetMaxUserId() int {
	// 创建一个 UserEntity 实例用于存储查询结果
	var user UserEntity

	// 使用 GORM 的 Last 方法查询数据库中最后一条记录，并将结果存储到 user 变量中
	DB.Last(&user)

	// 返回查询到的用户ID
	return user.Id
}

func GetAdminUserEmail() (userEmail string, err error) {
	err = DB.Model(&UserEntity{}).Where("role = ?", common.RoleRootUser).Select("email").Find(&userEmail).Error
	return userEmail, err
}

func GetUserNameByID(userId int) (userName string, err error) {
	err = DB.Model(&UserEntity{}).Where("id = ?", userId).Select("user_name").Find(&userName).Error
	return userName, err
}

func GetUserEmailByID(userId int) (userEmail string, err error) {
	err = DB.Model(&UserEntity{}).Where("id = ?", userId).Select("email").Find(&userEmail).Error
	return userEmail, err
}

func GetUserByID(userId int, selectAll bool) (*UserEntity, error) {
	// 如果传入的用户ID为0，则返回错误信息
	if userId == 0 {
		return nil, errors.New("id 为空！")
	}

	// 创建一个 UserEntity 实例，用于存储查询结果
	user := UserEntity{Id: userId}

	if err := user.GetByID(selectAll); err != nil {
		return nil, err
	}

	return &user, nil
}

func GetUserByUserName(userName string, selectAll bool) (*UserEntity, error) {
	// 如果用户名为空，则返回错误信息
	if userName == "" {
		return nil, errors.New("userName 为空！")
	}

	// 创建一个 UserEntity 实例，用于存储查询结果
	user := UserEntity{UserName: userName}

	if err := user.GetByUserName(selectAll); err != nil {
		return nil, err
	}

	return &user, nil
}

func GetUserByEmail(email string, selectAll bool) (*UserEntity, error) {
	// 如果用户邮箱为空，则返回错误信息
	if email == "" {
		return nil, errors.New("email 为空！")
	}

	// 创建一个 UserEntity 实例，用于存储查询结果
	user := UserEntity{Email: email}

	if err := user.GetByEmail(selectAll); err != nil {
		return nil, err
	}

	return &user, nil
}

func GetUserByToken(token string, selectAll bool) (*UserEntity, error) {
	// 如果token为空，则返回错误信息
	if token == "" {
		return nil, errors.New("token 为空！")
	}

	// 剥离令牌前缀
	token = strings.Replace(token, "Bearer ", "", 1)

	// 创建一个 UserEntity 实例，用于存储查询结果
	user := UserEntity{Token: token}

	if err := user.GetByToken(selectAll); err != nil {
		return nil, err
	}

	return &user, nil
}

func GetPageUsers(startIdx int, num int) (users []*UserEntity, err error) {
	// 使用 GORM 进行查询，按照 ID 降序排序，限制返回数量，并指定偏移量
	err = DB.Order("id desc").Limit(num).Offset(startIdx).Select([]string{"id", "user_name", "display_name", "role", "status", "email"}).Find(&users).Error

	return users, err
}

// SearchUsers 函数用于根据关键字搜索用户信息。
//
// 输入参数：
//   - keyword string: 搜索关键字，用于匹配用户ID、用户名、邮箱或显示名。
//
// 输出参数：
//   - []*UserEntity: 返回匹配搜索条件的用户信息切片。
//   - error: 如果查询过程中出现错误，则返回错误信息；否则为 nil。
func SearchUsers(keyword string) (users []*UserEntity, err error) {
	// 使用 GORM 进行查询，根据关键字匹配用户ID、用户名、邮箱或显示名
	err = DB.Select([]string{"id", "user_name", "display_name", "role", "status", "email"}).
		Where("id = ? or user_name LIKE ? or email LIKE ? or display_name LIKE ?", keyword, keyword+"%", keyword+"%", keyword+"%").
		Find(&users).Error
	return users, err
}

func IsAdminUser(userId int) (bool, error) {
	if userId == 0 {
		return false, errors.New("user id is empty")
	}

	var user UserEntity
	if err := DB.Where("id = ?", userId).Select("role").Find(&user).Error; err != nil {
		common.SysError("no such user " + err.Error())
		return false, err
	}

	return user.Role >= common.RoleAdminUser, nil
}

func IsEnabledUser(userId int) (bool, error) {
	if userId == 0 {
		return false, errors.New("user id is empty")
	}

	var user UserEntity
	if err := DB.Where("id = ?", userId).Select("status").Find(&user).Error; err != nil {
		common.SysError("no such user " + err.Error())
		return false, err
	}

	return user.Status == common.UserStatusEnabled, nil
}

// IsUserNameAlreadyTaken 方法用于检查用户名是否已被注册。
//
// 输入参数：
//   - userName string: 要检查的用户名。
//
// 输出参数：
//   - bool: 如果用户名已被注册，则返回 true；否则为 false。
func IsUserNameAlreadyTaken(userName string) bool {
	// 使用 GORM 根据用户名查询用户信息，并检查是否存在记录
	return DB.Where("user_name = ?", userName).Find(&UserEntity{}).RowsAffected == 1
}

// IsEmailAlreadyTaken 方法用于检查邮箱是否已被注册。
//
// 输入参数：
//   - email string: 要检查的邮箱地址。
//
// 输出参数：
//   - bool: 如果邮箱已被注册，则返回 true；否则为 false。
func IsEmailAlreadyTaken(email string) bool {
	// 使用 GORM 根据邮箱查询用户信息，并检查是否存在记录
	return DB.Where("email = ?", email).Find(&UserEntity{}).RowsAffected == 1
}

// ResetUserPasswordByEmail 方法用于通过邮箱重置用户密码。
//
// 输入参数：
//   - email string: 要重置密码的邮箱地址。
//   - password string: 新密码。
//
// 输出参数：
//   - error: 如果重置过程中出现错误，则返回错误信息；否则为 nil。
func ResetUserPasswordByEmail(email string, password string) error {
	// 如果邮箱地址或密码为空，则返回错误信息
	if email == "" || password == "" {
		return errors.New("邮箱地址或密码为空！")
	}

	// 对新密码进行哈希处理
	hashedPassword, err := common.Password2Hash(password)
	if err != nil {
		return err
	}

	// 使用 GORM 根据邮箱更新用户密码
	return DB.Model(&UserEntity{}).Where("email = ?", email).Update("password", hashedPassword).Error
}
