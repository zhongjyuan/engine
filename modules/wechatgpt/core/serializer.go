package core

import (
	"encoding/json"
	"io"
)

// ================================================= [类型](全局)公开 =================================================

// Serializer 接口用于对数据进行编码和解码。
type Serializer interface {
	// Encode 方法将数据 v 编码后写入 writer 中。
	// 入参：
	//   - writer: 要写入的 io.Writer 对象。
	//   - v: 要编码的数据对象。
	// 返回值：
	//   - error: 错误对象，表示编码过程中发生的错误。
	Encode(writer io.Writer, v interface{}) error

	// Decode 方法从 reader 中读取数据并进行解码，结果存储到 v 中。
	// 入参：
	//   - reader: 要读取的 io.Reader 对象。
	//   - v: 解码后的数据对象。
	// 返回值：
	//   - error: 错误对象，表示解码过程中发生的错误。
	Decode(reader io.Reader, v interface{}) error
}

// JsonSerializer 是一个用于 JSON 的序列化器。
type JsonSerializer struct{}

// ================================================= [函数](JsonSerializer)公开 =================================================

// Encode 方法将 v 编码后写入 writer 中。
// 入参：
//   - writer: 要写入的 io.Writer 对象。
//   - v: 要编码的数据对象。
//
// 返回值：
//   - error: 错误对象，表示编码过程中发生的错误。
func (j JsonSerializer) Encode(writer io.Writer, v interface{}) error {
	return json.NewEncoder(writer).Encode(v)
}

// Decode 方法从 reader 中读取数据并进行解码，结果存储到 v 中。
// 入参：
//   - reader: 要读取的 io.Reader 对象。
//   - v: 解码后的数据对象。
//
// 返回值：
//   - error: 错误对象，表示解码过程中发生的错误。
func (j JsonSerializer) Decode(reader io.Reader, v interface{}) error {
	return json.NewDecoder(reader).Decode(v)
}
