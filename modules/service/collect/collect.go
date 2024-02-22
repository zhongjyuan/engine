package collect

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

// CollectRequest 结构体用于表示收集数据的请求。
//
// 字段说明：
//   - Owner: 拥有者。
//   - Data: 数据。
type CollectRequest struct {
	Data     []byte // 数据
	Owner    string // 拥有者
	FileName string // 文件名称
}

// CollectData 函数用于处理采集数据的请求并写入文件。
//
// 输入参数：
//   - writer http.ResponseWriter: 用于向客户端发送响应的 ResponseWriter。
//   - request *http.Request: 包含请求信息的 Request 对象。
//   - fileName string: 要保存数据的文件名。
//
// 输出参数：
//   - 无。
func Write(writer http.ResponseWriter, request *http.Request, fileName string) {
	// 检查请求方法是否为 POST
	if request.Method != http.MethodPost {
		writer.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	log.Printf("采集[%v]", fileName)

	// 读取请求body中的数据
	body, err := io.ReadAll(request.Body)
	if err != nil {
		log.Printf("采集[%v]<read body>异常：%v \n", fileName, err)
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}

	go func(writer http.ResponseWriter, body []byte, fileName string) {

		var req CollectRequest
		// 解析请求数据
		err = json.Unmarshal(body, &req)
		if err != nil {
			log.Printf("采集[%v]<un marshal>异常：%v \n", fileName, err)
			writer.WriteHeader(http.StatusBadRequest)
			return
		}

		fileName = filepath.Join(req.Owner, fileName)
		if req.FileName != "" {
			fileName = filepath.Join(fileName, req.FileName)
		}

		// 创建目录
		if err := os.MkdirAll(filepath.Dir(fileName), os.ModePerm); err != nil {
			log.Printf("采集[%v]<mk dir all>异常：%v \n", fileName, err)
			writer.WriteHeader(http.StatusBadRequest)
			return
		}

		// 创建文件
		file, err := os.Create(fileName)
		if err != nil {
			log.Printf("采集[%v]<create file>异常：%v \n", fileName, err)
			writer.WriteHeader(http.StatusBadRequest)
			return
		}

		defer file.Close()

		// 将 JSON 数据写入文件
		_, err = file.Write(req.Data)
		if err != nil {
			log.Printf("采集[%v]<write file>异常：%v \n", fileName, err)
			writer.WriteHeader(http.StatusBadRequest)
			return
		}

		log.Printf("采集[%v]<write file>成功! \n", fileName)
	}(writer, body, fileName)

	writer.WriteHeader(http.StatusOK)
}
