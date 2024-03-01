package common

import (
	"fmt"
	"io"
	"net/http"
	"strings"
)

// noCache 用于指定不使用缓存的响应头信息。
var noCache = []string{"no-cache"}

// contentType 用于指定文档类型的响应头信息。
var contentType = []string{"text/event-stream"}

// fieldReplacer 用于替换字符串中的特殊字符，如换行符和回车符。
// var fieldReplacer = strings.NewReplacer("\n", "\\n", "\r", "\\r")

// dataReplacer 用于替换数据字符串中的特殊字符，并在每个数据字段前添加"data:"。
var dataReplacer = strings.NewReplacer("\n", "\ndata:", "\r", "\\r")

// stringWriter 是一个扩展了 io.Writer 接口的自定义接口，包含了 writeString 方法。
type stringWriter interface {
	io.Writer
	writeString(string) (int, error)
}

// stringWrapper 是一个实现了 io.Writer 接口的包装器。
type stringWrapper struct {
	io.Writer
}

// writeString 方法用于将字符串写入底层的 io.Writer。
//
// 输入参数：
//   - str string: 待写入的字符串。
//
// 输出参数：
//   - int: 返回写入的字节数。
//   - error: 如果在写入过程中发生错误，则返回相应的错误信息；否则返回 nil。
func (w stringWrapper) writeString(str string) (int, error) {
	return w.Writer.Write([]byte(str))
}

// checkWriter 用于检查并返回包含 writeString 方法的 stringWriter 接口。
//
// 输入参数：
//   - writer io.Writer: 实现了 io.Writer 接口的写入器。
//
// 输出参数：
//   - stringWriter: 如果 writer 实现了 stringWriter 接口，则返回该接口；否则返回一个包装 writer 的 stringWrapper。
func checkWriter(writer io.Writer) stringWriter {
	if w, ok := writer.(stringWriter); ok {
		return w
	} else {
		return stringWrapper{writer}
	}
}

// writeData 用于向 stringWriter 写入格式化后的数据，并添加必要的换行符。
//
// 输入参数：
//   - w stringWriter: 实现了 writeString 方法的接口，用于写入数据。
//   - data interface{}: 待写入的数据。
//
// 输出参数：
//   - error: 如果写入数据过程中发生错误，则返回相应的错误信息；否则返回 nil。
func writeData(w stringWriter, data interface{}) error {
	// 替换数据中的特殊字符
	dataReplacer.WriteString(w, fmt.Sprint(data))
	// 如果数据以"data"开头，则添加额外的换行符
	if strings.HasPrefix(data.(string), "data") {
		w.writeString("\n\n")
	}
	return nil
}

// CustomEvent 定义了一个自定义事件结构体，用于表示特定类型的事件。
type CustomEvent struct {
	Id    string      // 事件的标识符
	Retry uint        // 重试次数（无符号整数）
	Event string      // 事件类型
	Data  interface{} // 事件数据，可以是任意类型
}

// encode 函数用于将 CustomEvent 编码并写入到 io.Writer 中。
//
// 输入参数：
//   - writer io.Writer: 实现了 io.Writer 接口的写入器。
//   - event CustomEvent: 要编码并写入的自定义事件。
//
// 输出参数：
//   - error: 如果在编码和写入过程中发生错误，则返回相应的错误信息；否则返回 nil。
func encode(writer io.Writer, event CustomEvent) error {
	w := checkWriter(writer)        // 检查并获取包含 writeString 方法的写入器
	return writeData(w, event.Data) // 将事件数据写入到写入器中
}

// WriteContentType 方法用于向 http.ResponseWriter 写入内容类型和缓存控制相关的头部信息。
//
// 输入参数：
//   - r CustomEvent: 自定义事件实例。
//   - w http.ResponseWriter: HTTP 响应写入器。
//
// 输出参数：
//   - 无。
func (r CustomEvent) WriteContentType(w http.ResponseWriter) {
	header := w.Header()                 // 获取响应头部
	header["Content-Type"] = contentType // 设置内容类型

	if _, exist := header["Cache-Control"]; !exist { // 如果缓存控制头部不存在
		header["Cache-Control"] = noCache // 设置缓存控制头部为 noCache
	}
}

// Render 方法用于将 CustomEvent 渲染并写入到 http.ResponseWriter 中。
//
// 输入参数：
//   - r CustomEvent: 要渲染的自定义事件。
//   - w http.ResponseWriter: HTTP 响应写入器。
//
// 输出参数：
//   - error: 如果在渲染和写入过程中发生错误，则返回相应的错误信息；否则返回 nil。
func (r CustomEvent) Render(w http.ResponseWriter) error {
	r.WriteContentType(w) // 写入内容类型到响应头部
	return encode(w, r)   // 将事件编码并写入到响应中
}
