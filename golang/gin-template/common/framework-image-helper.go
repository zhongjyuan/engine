package common

import (
	"bytes"
	"encoding/base64"
	"image"
	"net/http"
	"regexp"
	"strings"
	"sync"
)

var (
	imageDataURIPrefixRegex  = regexp.MustCompile(`data:image/([^;]+);base64,`)              // 用于匹配数据 URL 的正则表达式
	imageDataURLPatternRegex = regexp.MustCompile(`data:image/([^;]+);base64,(.*)`)          // 用于解析数据 URL 的正则表达式
	readerPool               = sync.Pool{New: func() interface{} { return &bytes.Reader{} }} // 用于存储 bytes.Reader 对象的同步池
)

// IsImageUrl 用于判断给定 URL 是否指向图片资源。
//
// 输入参数：
//   - url string: 要检查的 URL 地址。
//
// 输出参数：
//   - bool: 如果 URL 指向图片资源则返回 true，否则返回 false。
//   - error: 在发生错误时返回相应的错误信息，无错误时为 nil。
func IsImageUrl(url string) (bool, error) {
	resp, err := http.Head(url) // 发送 HTTP HEAD 请求获取响应信息
	if err != nil {
		return false, err // 若请求发生错误，则返回 false 和相应的错误信息
	}

	if !strings.HasPrefix(resp.Header.Get("Content-Type"), "image/") {
		return false, nil // 如果响应内容类型不是图片，则返回 false 和 nil
	}

	return true, nil // 如果响应内容类型是图片，则返回 true 和 nil
}

// GetImageSizeFromUrl 从给定的 URL 获取图片尺寸信息。
//
// 输入参数：
//   - url string: 要获取图片尺寸信息的 URL 地址。
//
// 输出参数：
//   - width int: 图片宽度。
//   - height int: 图片高度。
//   - err error: 在发生错误时返回相应的错误信息，无错误时为 nil。
func GetImageSizeFromUrl(url string) (width int, height int, err error) {
	isImage, err := IsImageUrl(url) // 判断给定 URL 是否为图片资源
	if !isImage {
		return // 如果不是图片资源，则直接返回
	}

	resp, err := http.Get(url) // 发送 HTTP GET 请求获取图片内容
	if err != nil {
		return // 如果请求发生错误，则直接返回
	}

	defer resp.Body.Close()                      // 延迟关闭响应体
	img, _, err := image.DecodeConfig(resp.Body) // 解码图片配置信息
	if err != nil {
		return // 如果解码出错，则直接返回
	}

	return img.Width, img.Height, nil // 返回图片宽度、高度和 nil 错误
}

// GetImageSizeFromBase64 从 base64 编码的图片数据中获取图片尺寸信息。
//
// 输入参数：
//   - encoded string: base64 编码的图片数据字符串。
//
// 输出参数：
//   - width int: 图片宽度。
//   - height int: 图片高度。
//   - err error: 在发生错误时返回相应的错误信息，无错误时为 nil。
func GetImageSizeFromBase64(encoded string) (width int, height int, err error) {
	decoded, err := base64.StdEncoding.DecodeString(imageDataURIPrefixRegex.ReplaceAllString(encoded, "")) // 解码 base64 编码的图片数据
	if err != nil {
		return 0, 0, err // 如果解码出错，则直接返回错误
	}

	reader := readerPool.Get().(*bytes.Reader) // 从池中获取 bytes.Reader 实例
	defer readerPool.Put(reader)               // 在函数返回前将 reader 放回池中
	reader.Reset(decoded)                      // 重置 reader 并设置解码后的数据作为内容

	img, _, err := image.DecodeConfig(reader) // 解码图片配置信息
	if err != nil {
		return 0, 0, err // 如果解码出错，则直接返回错误
	}

	return img.Width, img.Height, nil // 返回图片宽度、高度和 nil 错误
}

// GetImageSize 根据图片地址或 base64 编码的图片数据获取图片尺寸信息。
//
// 输入参数：
//   - image string: 图片地址或 base64 编码的图片数据字符串。
//
// 输出参数：
//   - width int: 图片宽度。
//   - height int: 图片高度。
//   - err error: 在发生错误时返回相应的错误信息，无错误时为 nil。
func GetImageSize(image string) (width int, height int, err error) {
	if strings.HasPrefix(image, "data:image/") { // 如果是以 data:image/ 开头，则说明是 base64 编码的图片数据
		return GetImageSizeFromBase64(image) // 调用 GetImageSizeFromBase64 函数获取图片尺寸
	}
	return GetImageSizeFromUrl(image) // 否则认为是图片地址，调用 GetImageSizeFromUrl 函数获取图片尺寸
}

// GetImageFromUrl 从给定的 URL 获取图片数据和 MIME 类型。
//
// 输入参数：
//   - url string: 要获取图片数据和 MIME 类型的 URL 地址。
//
// 输出参数：
//   - mimeType string: 图片的 MIME 类型。
//   - data string: base64 编码的图片数据字符串。
//   - err error: 在发生错误时返回相应的错误信息，无错误时为 nil。
func GetImageFromUrl(url string) (mimeType string, data string, err error) {
	// 检查 URL 是否为 data URL
	matches := imageDataURLPatternRegex.FindStringSubmatch(url)
	if len(matches) == 3 {
		// URL 是 data URL
		mimeType = "image/" + matches[1] // 设置 MIME 类型
		data = matches[2]                // 设置图片数据
		return
	}

	isImage, err := IsImageUrl(url) // 判断 URL 是否为图片地址
	if !isImage {
		return
	}

	resp, err := http.Get(url) // 发起 HTTP GET 请求获取图片数据
	if err != nil {
		return
	}

	defer resp.Body.Close() // 确保在函数返回前关闭响应体
	buffer := bytes.NewBuffer(nil)
	_, err = buffer.ReadFrom(resp.Body) // 读取响应数据到缓冲区
	if err != nil {
		return
	}

	mimeType = resp.Header.Get("Content-Type")               // 获取响应的 MIME 类型
	data = base64.StdEncoding.EncodeToString(buffer.Bytes()) // 将图片数据进行 base64 编码

	return
}
