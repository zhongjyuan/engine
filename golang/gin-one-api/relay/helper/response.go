package relayhelper

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	relaymodel "zhongjyuan/gin-one-api/relay/model"
)

// NewHTTPError 根据传入的 http.Response 创建并返回一个新的 HTTPError 对象。
//
// 输入参数：
//   - resp *http.Response: HTTP 响应对象。
//
// 输出参数：
//   - httpError *relaymodel.HTTPError: 包含 HTTP 错误信息的对象。
func NewHTTPError(resp *http.Response) (httpError *relaymodel.HTTPError) {
	// 初始化 HTTPError 对象
	httpError = &relaymodel.HTTPError{
		StatusCode: resp.StatusCode,
		Error: relaymodel.Error{
			Message: "",
			Type:    "upstream_error",
			Code:    "bad_response_status_code",
			Param:   strconv.Itoa(resp.StatusCode),
		},
	}

	// 确保在函数返回前关闭resp.Body
	defer func() {
		_ = resp.Body.Close()
	}()

	// 读取响应体
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return
	}

	// 解析错误响应
	var errResponse relaymodel.AIErrorResponse
	if err := json.Unmarshal(responseBody, &errResponse); err != nil {
		return
	}

	// 检查是否为OpenAI格式的错误响应，如果是，则覆盖默认的错误对象
	if errResponse.Error.Message != "" {
		httpError.Error = errResponse.Error
	} else {
		httpError.Error.Message = errResponse.GetMessage()
	}

	// 如果错误消息为空，则设置默认错误消息
	if httpError.Error.Message == "" {
		httpError.Error.Message = fmt.Sprintf("bad response status code %d", resp.StatusCode)
	}

	return
}

// WrapHTTPError 用于将错误信息包装成 HTTPError 对象并返回。
//
// 输入参数：
//   - err error: 错误对象。
//   - code string: 错误代码。
//   - statusCode int: HTTP 状态码。
//
// 输出参数：
//   - *relaymodel.HTTPError: 包含包装后的错误信息的 HTTPError 对象。
func WrapHTTPError(err error, code string, statusCode int) *relaymodel.HTTPError {
	// 创建包装后的错误对象
	Error := relaymodel.Error{
		Message: err.Error(),
		Type:    "one_api_error",
		Code:    code,
	}

	// 创建并返回 HTTPError 对象
	return &relaymodel.HTTPError{
		Error:      Error,
		StatusCode: statusCode,
	}
}
