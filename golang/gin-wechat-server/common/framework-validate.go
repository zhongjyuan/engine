package common

import "github.com/go-playground/validator/v10"

// Validate 是用于数据验证的全局变量
var Validate *validator.Validate

// init 函数用于初始化全局的 Validate 变量
func init() {
	Validate = validator.New()
}
