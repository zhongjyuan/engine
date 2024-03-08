package common

import (
	"bytes"
	"fmt"

	"github.com/yuin/goldmark"
)

func Markdown2HTML(markdown string) (HTML string, err error) {
	if markdown == "" {
		return "", nil
	}
	var buf bytes.Buffer
	err = goldmark.Convert([]byte(markdown), &buf)
	if err != nil {
		return fmt.Sprintf("Markdown 渲染出错：%s", err.Error()), err
	}
	HTML = buf.String()
	return
}
