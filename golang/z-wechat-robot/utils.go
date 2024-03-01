package wechatbot

import (
	"bytes"
	"encoding/json"
	"io"
	"math/rand"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"time"
	"unsafe"
)

// Open 用于在默认的 Web 浏览器中打开指定的 URL。
//
// 入参：
//   - url：要打开的 URL 地址。
//
// 返回值：
//   - error：如果打开 URL 出现错误，则返回相应的错误信息；否则返回 nil。
func Open(url string) error {
	var (
		cmd  string   // 执行的命令
		args []string // 命令的参数
	)

	switch runtime.GOOS {
	case "windows":
		cmd, args = "cmd", []string{"/c", "start"} // Windows 使用 cmd 命令和 /c start 参数
	case "darwin":
		cmd = "open" // macOS 使用 open 命令
	default:
		// "linux", "freebsd", "openbsd", "netbsd"
		cmd = "xdg-open" // 其他类 Unix-like 操作系统使用 xdg-open 命令
	}

	args = append(args, url) // 将 URL 添加到命令的参数列表中

	return exec.Command(cmd, args...).Start() // 执行打开操作，并返回结果
}

// JsonEncode 函数用于将一个对象编码为 JSON 数据。
//
// 参数：
//   - v：待编码的对象。
//
// 返回值：
//   - io.Reader：包含编码后的 JSON 数据的 Reader 对象。
//   - error：编码过程中的错误（如果有）。
func JsonEncode(v interface{}) (io.Reader, error) {
	// 创建一个空的字节数组缓冲区
	var buffer = bytes.NewBuffer(nil)

	// 创建一个 JSON 编码器，并将其与缓冲区关联
	encoder := json.NewEncoder(buffer)

	// 禁用 JSON 编码器对 HTML 进行转义（防止特殊字符被转义）
	encoder.SetEscapeHTML(false)

	// 使用编码器将对象编码为 JSON 并写入缓冲区
	if err := encoder.Encode(v); err != nil {
		return nil, err
	}

	// 返回包含编码后的 JSON 数据的 Reader 对象和 nil 错误
	return buffer, nil
}

// RandomDeviceID 函数用于生成一个随机的设备ID。
//
// 返回值：
//   - string：生成的随机设备ID。
func RandomDeviceID() string {
	// 创建一个伪随机数生成器，种子为当前时间的 Unix 时间戳
	rng := rand.New(rand.NewSource(time.Now().Unix()))

	// 创建一个字符串构建器，并设置初始容量为16
	var builder strings.Builder
	builder.Grow(16)

	// 在构建器中添加固定的字符 'e'
	builder.WriteString("e")

	// 生成15位的随机数字，并添加到构建器中
	for i := 0; i < 15; i++ {
		// 生成一个0到8之间的随机整数
		r := rng.Intn(9)

		// 将随机整数转换为字符串，并添加到构建器中
		builder.WriteString(strconv.Itoa(r))
	}

	// 返回构建器中的字符串作为随机设备ID
	return builder.String()
}

// FileContentType 函数用于获取一个文件的 MIME 类型。
//
// 参数：
//   - file：文件的 io.Reader 对象。
//
// 返回值：
//   - string：文件的 MIME 类型。
//   - error：解析过程中的错误（如果有）。
func FileContentType(file io.Reader) (string, error) {
	// 创建一个 512 字节大小的字节数组
	data := make([]byte, 512)

	// 从文件读取数据到字节数组中
	if _, err := file.Read(data); err != nil {
		return "", err
	}

	// 使用 http 包中的 DetectContentType 函数来检测字节数组中数据的 MIME 类型
	return http.DetectContentType(data), nil
}

// FileExtension 函数用于获取文件名的扩展名。
//
// 参数：
//   - name：文件名。
//
// 返回值：
//   - string：文件的扩展名。
func FileExtension(name string) string {
	// 使用 filepath 包的 Ext 函数获取文件名的扩展名
	ext := filepath.Ext(name)

	// 如果扩展名为空，则设置为 "undefined"
	if len(ext) == 0 {
		ext = "undefined"
	}

	// 去除扩展名中的点号，并返回结果
	return strings.TrimPrefix(ext, ".")
}

// FileType 函数用于根据文件名判断文件类型。
//
// 参数：
//   - filename：文件名。
//
// 返回值：
//   - string：文件类型（pic、video 或 doc）。
func FileType(filename string) string {
	// 调用 FileExtension 函数获取文件的扩展名
	ext := FileExtension(filename)

	// 判断扩展名是否在 ImageTypeMap 映射中，如果是则返回 "PictureType"
	if _, ok := ImageTypeMap[ext]; ok {
		return PictureType
	}

	// 判断扩展名是否等于 videoType，如果是则返回 "video"
	if ext == VideoExtension {
		return VideoType
	}

	// 默认情况下返回 "DocumentType"
	return DocumentType
}

// StringToByte 函数用于将字符串转换为字节切片。
//
// 参数：
//   - s：待转换的字符串。
//
// 返回值：
//   - []byte：字符串的字节切片表示。
func StringToByte(s string) []byte {
	// 使用 unsafe 包中的 Pointer 类型进行指针转换
	// 将字符串的指针转换为 *string 类型的指针，然后再取其值赋给 data
	data := *(*string)(unsafe.Pointer(&s))

	// 将 data 的指针转换为 *[]byte 类型的指针，然后再取其值赋给 byteSlice
	byteSlice := *(*[]byte)(unsafe.Pointer(&data))

	// 返回字节切片表示的字符串
	return byteSlice
}

// ReadToFile 将读取器中的内容保存到文件中。
//
// 参数：
//   - reader：需要保存为文件的读取器。
//
// 返回值：
//   - file：保存内容的文件指针。
//   - callback：关闭和删除临时文件的回调函数。
//   - error：保存过程中的错误（如果有）。
func ReadToFile(reader io.Reader) (file *os.File, callback func(), err error) {
	var ok bool

	// 检查 reader 是否为 *os.File 类型，如果是则直接返回该文件指针
	if file, ok = reader.(*os.File); ok {
		return file, func() {}, nil
	}

	// 创建一个临时文件
	file, err = os.CreateTemp("", "*")
	if err != nil {
		return nil, nil, err
	}

	// 定义回调函数，用于关闭文件和删除临时文件
	callback = func() {
		_ = file.Close()
		_ = os.Remove(file.Name())
	}

	// 将读取器中的内容拷贝到文件中
	_, err = io.Copy(file, reader)
	if err != nil {
		callback()
		return nil, nil, err
	}

	// 将文件指针位置移动到文件开头
	_, err = file.Seek(0, io.SeekStart)
	if err != nil {
		callback()
		return nil, nil, err
	}

	return file, callback, nil
}
