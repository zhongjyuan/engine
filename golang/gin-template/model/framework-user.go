package model

import (
	"errors"
	"strings"
	"zhongjyuan/gin-template/common"
)

// User 结构体定义了用户的数据模型。
type User struct {
	Id               int    `json:"id" gorm:"unique;primaryKey;autoIncrement"`         // 用户ID，唯一主键，自增
	Username         string `json:"username" gorm:"unique;index" validate:"max=12"`    // 用户名，唯一索引，最大长度为12
	Password         string `json:"password" gorm:"not null;" validate:"min=8,max=20"` // 密码，非空，长度限制为8到20之间
	DisplayName      string `json:"display_name" gorm:"index" validate:"max=20"`       // 显示名，索引，最大长度为20
	Role             int    `json:"role" gorm:"type:int;default:1"`                    // 角色，默认为1（admin or common）
	Status           int    `json:"status" gorm:"type:int;default:1"`                  // 状态，默认为1（enabled or disabled）
	Token            string `json:"token" gorm:"index"`                                // Token，索引
	Email            string `json:"email" gorm:"index" validate:"max=50"`              // 邮箱，索引，最大长度为50
	GitHubId         string `json:"github_id" gorm:"column:github_id;index"`           // GitHub ID，索引
	WeChatId         string `json:"wechat_id" gorm:"column:wechat_id;index"`           // 微信 ID，索引
	VerificationCode string `json:"verification_code" gorm:"-:all"`                    // 验证码，仅用于邮箱验证，不保存到数据库
}

// GetMaxUserId 函数用于获取数据库中最大的用户ID。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - int: 返回数据库中最大的用户ID。
func GetMaxUserId() int {
	// 创建一个 User 实例用于存储查询结果
	var user User

	// 使用 GORM 的 Last 方法查询数据库中最后一条记录，并将结果存储到 user 变量中
	DB.Last(&user)

	// 返回查询到的用户ID
	return user.Id
}

// GetAllUsers 函数用于从数据库中获取指定范围内的所有用户信息。
//
// 输入参数：
//   - startIdx int: 查询起始索引。
//   - num int: 查询数量。
//
// 输出参数：
//   - []*User: 返回指定范围内的用户信息切片。
//   - error: 如果查询过程中出现错误，则返回错误信息；否则为 nil。
func GetAllUsers(startIdx int, num int) (users []*User, err error) {
	// 使用 GORM 进行查询，按照 ID 降序排序，限制返回数量，并指定偏移量
	err = DB.Order("id desc").Limit(num).Offset(startIdx).Select([]string{"id", "username", "display_name", "role", "status", "email"}).Find(&users).Error
	return users, err
}

// SearchUsers 函数用于根据关键字搜索用户信息。
//
// 输入参数：
//   - keyword string: 搜索关键字，用于匹配用户ID、用户名、邮箱或显示名。
//
// 输出参数：
//   - []*User: 返回匹配搜索条件的用户信息切片。
//   - error: 如果查询过程中出现错误，则返回错误信息；否则为 nil。
func SearchUsers(keyword string) (users []*User, err error) {
	// 使用 GORM 进行查询，根据关键字匹配用户ID、用户名、邮箱或显示名
	err = DB.Select([]string{"id", "username", "display_name", "role", "status", "email"}).
		Where("id = ? or username LIKE ? or email LIKE ? or display_name LIKE ?", keyword, keyword+"%", keyword+"%", keyword+"%").
		Find(&users).Error
	return users, err
}

// GetUserById 函数用于从数据库中根据用户ID获取用户信息。
//
// 输入参数：
//   - id int: 用户ID。
//   - selectAll bool: 是否选择所有字段。
//
// 输出参数：
//   - *User: 返回查询到的用户信息指针。
//   - error: 如果查询过程中出现错误，则返回错误信息；否则为 nil。
func GetUserById(id int, selectAll bool) (*User, error) {
	// 如果传入的用户ID为0，则返回错误信息
	if id == 0 {
		return nil, errors.New("id 为空！")
	}

	// 创建一个 User 实例，用于存储查询结果
	user := User{Id: id}

	var err error = nil
	// 根据 selectAll 参数决定是否选择所有字段
	if selectAll {
		// 如果 selectAll 为 true，则查询所有字段
		err = DB.First(&user, "id = ?", id).Error
	} else {
		// 如果 selectAll 为 false，则仅查询部分字段
		err = DB.Select([]string{"id", "username", "display_name", "role", "status", "email", "wechat_id", "github_id"}).
			First(&user, "id = ?", id).Error
	}

	return &user, err
}

// DeleteUserById 函数用于从数据库中根据用户ID删除用户信息。
//
// 输入参数：
//   - id int: 用户ID。
//
// 输出参数：
//   - error: 如果删除过程中出现错误，则返回错误信息；否则为 nil。
func DeleteUserById(id int) (err error) {
	// 如果传入的用户ID为0，则返回错误信息
	if id == 0 {
		return errors.New("id 为空！")
	}
	// 创建一个 User 实例，并设置其ID属性为传入的用户ID
	user := User{Id: id}
	// 调用 User 实例的 Delete 方法删除用户信息，并返回可能出现的错误
	return user.Delete()
}

// Insert 方法用于向数据库中插入用户信息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - error: 如果插入过程中出现错误，则返回错误信息；否则为 nil。
func (user *User) Insert() error {
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
	return err
}

// Update 方法用于更新用户信息。
//
// 输入参数：
//   - updatePassword bool: 是否更新密码。
//
// 输出参数：
//   - error: 如果更新过程中出现错误，则返回错误信息；否则为 nil。
func (user *User) Update(updatePassword bool) error {
	var err error
	// 如果需要更新密码，则对密码进行哈希处理
	if updatePassword {
		user.Password, err = common.Password2Hash(user.Password)
		if err != nil {
			return err
		}
	}
	// 调用 GORM 的 Model 方法更新用户信息，并返回可能出现的错误
	err = DB.Model(user).Updates(user).Error
	return err
}

// Delete 方法用于删除用户信息。
//
// 输出参数：
//   - error: 如果删除过程中出现错误，则返回错误信息；否则为 nil。
func (user *User) Delete() error {
	// 如果用户ID为空，则返回错误信息
	if user.Id == 0 {
		return errors.New("id 为空！")
	}
	// 调用 GORM 的 Delete 方法删除用户信息，并返回可能出现的错误
	err := DB.Delete(user).Error
	return err
}

// ValidateAndFill 方法用于验证用户信息并填充字段。
//
// 输出参数：
//   - error: 如果验证过程中出现错误，则返回错误信息；否则为 nil。
func (user *User) ValidateAndFill() (err error) {
	// 获取用户密码
	password := user.Password
	// 如果用户名或密码为空，返回错误信息
	if user.Username == "" || password == "" {
		return errors.New("用户名或密码为空")
	}

	// 使用 GORM 查询用户信息
	DB.Where(User{Username: user.Username}).First(user)

	// 验证密码和哈希是否匹配，以及用户状态是否启用
	okay := common.ValidatePasswordAndHash(password, user.Password)
	if !okay || user.Status != common.UserStatusEnabled {
		return errors.New("用户名或密码错误，或用户已被封禁")
	}

	return nil
}

// FillUserById 方法用于通过用户ID填充用户信息。
//
// 输出参数：
//   - error: 如果填充过程中出现错误，则返回错误信息；否则为 nil。
func (user *User) FillUserById() error {
	// 如果用户ID为空，则返回错误信息
	if user.Id == 0 {
		return errors.New("id 为空！")
	}
	// 使用 GORM 根据用户ID查询用户信息并填充字段
	DB.Where(User{Id: user.Id}).First(user)
	return nil
}

// FillUserByEmail 方法用于通过用户邮箱填充用户信息。
//
// 输出参数：
//   - error: 如果填充过程中出现错误，则返回错误信息；否则为 nil。
func (user *User) FillUserByEmail() error {
	// 如果用户邮箱为空，则返回错误信息
	if user.Email == "" {
		return errors.New("email 为空！")
	}
	// 使用 GORM 根据用户邮箱查询用户信息并填充字段
	DB.Where(User{Email: user.Email}).First(user)
	return nil
}

// FillUserByGitHubId 方法用于通过GitHub ID填充用户信息。
//
// 输出参数：
//   - error: 如果填充过程中出现错误，则返回错误信息；否则为 nil。
func (user *User) FillUserByGitHubId() error {
	// 如果GitHub ID为空，则返回错误信息
	if user.GitHubId == "" {
		return errors.New("GitHub id 为空！")
	}
	// 使用 GORM 根据GitHub ID查询用户信息并填充字段
	DB.Where(User{GitHubId: user.GitHubId}).First(user)
	return nil
}

// FillUserByWeChatId 方法用于通过WeChat ID填充用户信息。
//
// 输出参数：
//   - error: 如果填充过程中出现错误，则返回错误信息；否则为 nil。
func (user *User) FillUserByWeChatId() error {
	// 如果WeChat ID为空，则返回错误信息
	if user.WeChatId == "" {
		return errors.New("WeChat id 为空！")
	}
	// 使用 GORM 根据WeChat ID查询用户信息并填充字段
	DB.Where(User{WeChatId: user.WeChatId}).First(user)
	return nil
}

// FillUserByUsername 方法用于通过用户名填充用户信息。
//
// 输出参数：
//   - error: 如果填充过程中出现错误，则返回错误信息；否则为 nil。
func (user *User) FillUserByUsername() error {
	// 如果用户名为空，则返回错误信息
	if user.Username == "" {
		return errors.New("username 为空！")
	}
	// 使用 GORM 根据用户名查询用户信息并填充字段
	DB.Where(User{Username: user.Username}).First(user)
	return nil
}

// ValidateUserToken 方法用于验证用户令牌并返回用户信息。
//
// 输入参数：
//   - token string: 用户令牌。
//
// 输出参数：
//   - *User: 如果验证成功，则返回包含用户信息的结构体；否则为 nil。
func ValidateUserToken(token string) (user *User) {
	// 如果令牌为空，则返回 nil
	if token == "" {
		return nil
	}

	// 剥离令牌前缀
	token = strings.Replace(token, "Bearer ", "", 1)

	// 创建 User 实例
	user = &User{}

	// 使用 GORM 根据令牌查询用户信息
	if DB.Where("token = ?", token).First(user).RowsAffected == 1 {
		return user
	}

	return nil
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
	return DB.Where("email = ?", email).Find(&User{}).RowsAffected == 1
}

// IsWeChatIdAlreadyTaken 方法用于检查WeChat ID是否已被注册。
//
// 输入参数：
//   - wechatId string: 要检查的WeChat ID。
//
// 输出参数：
//   - bool: 如果WeChat ID已被注册，则返回 true；否则为 false。
func IsWeChatIdAlreadyTaken(wechatId string) bool {
	// 使用 GORM 根据WeChat ID查询用户信息，并检查是否存在记录
	return DB.Where("wechat_id = ?", wechatId).Find(&User{}).RowsAffected == 1
}

// IsGitHubIdAlreadyTaken 方法用于检查GitHub ID是否已被注册。
//
// 输入参数：
//   - githubId string: 要检查的GitHub ID。
//
// 输出参数：
//   - bool: 如果GitHub ID已被注册，则返回 true；否则为 false。
func IsGitHubIdAlreadyTaken(githubId string) bool {
	// 使用 GORM 根据GitHub ID查询用户信息，并检查是否存在记录
	return DB.Where("github_id = ?", githubId).Find(&User{}).RowsAffected == 1
}

// IsUsernameAlreadyTaken 方法用于检查用户名是否已被注册。
//
// 输入参数：
//   - username string: 要检查的用户名。
//
// 输出参数：
//   - bool: 如果用户名已被注册，则返回 true；否则为 false。
func IsUsernameAlreadyTaken(username string) bool {
	// 使用 GORM 根据用户名查询用户信息，并检查是否存在记录
	return DB.Where("username = ?", username).Find(&User{}).RowsAffected == 1
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
	err = DB.Model(&User{}).Where("email = ?", email).Update("password", hashedPassword).Error
	return err
}
