package common

import (
	"bytes"
	"fmt"

	"github.com/yuin/goldmark"
)

// ConvertMarkdownToHTML 函数用于将 Markdown 格式的文本转换为 HTML 格式。
//
// 输入参数：
//   - markdown string: 要转换的 Markdown 文本。
//
// 输出参数：
//   - HTML string: 转换后的 HTML 文本。
//   - err error: 转换过程中可能出现的错误。
func ConvertMarkdownToHTML(markdown string) (HTML string, err error) {
	// 如果输入的 markdown 参数为空字符串，则直接返回空字符串。
	if markdown == "" {
		return "", nil
	}

	var buf bytes.Buffer
	// 使用 goldmark 包进行 Markdown 渲染，将 Markdown 文本转换为 HTML 格式。
	if err = goldmark.Convert([]byte(markdown), &buf); err != nil {
		// 如果在渲染过程中出现错误，则返回包含错误信息的字符串，并将错误对象作为第二个返回值。
		return fmt.Sprintf("Markdown 渲染出错：%s", err.Error()), err
	}
	HTML = buf.String()

	return
}
