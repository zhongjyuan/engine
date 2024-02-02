package core

import (
	"io"
	"os"
	"sync"
)

// ================================================= [类型](全局)公开 =================================================

// HotReloadStorageItem 结构体用于存储热重载的相关信息。
type HotReloadStorageItem struct {
	UUID   string // UUID 是字符串类型，可能用于唯一标识这个热重载存储项。
	Domain Domain // Domain 是一个WechatDomain类型，可能用于存储微信域的相关信息。

	Jar         *Jar               // Jar 指向一个Jar类型的指针，可能用于存储或操作JAR文件。
	SyncKey     *SyncKeyResponse   // SyncKey 指向一个SyncKey类型的指针，可能用于同步或解锁操作。
	LoginInfo   *LoginInfoResponse // LoginInfo 指向一个LoginInfo类型的指针，可能用于存储或操作登录信息。
	BaseRequest *BaseRequest       // BaseRequest 指向一个BaseRequest类型的指针，可能用于存储或操作基础请求信息。
}

// HotReloadStorage 用于热重载的存储类型
type HotReloadStorage io.ReadWriter

// FileHotReloadStorage 结构体用于实现文件的热重载功能(实现HotReloadStorage接口)
type FileHotReloadStorage struct {
	filename string // filename 用于存储文件的路径或名称

	file *os.File   // file 是一个指向os.File类型的指针，表示一个已打开的文件(实现HotReloadStorage接口)
	lock sync.Mutex // lock 是一个互斥锁，用于保证对文件的并发访问安全
}

// ================================================= [函数](全局)公开 =================================================

// NewFileHotReloadStorage implements HotReloadStorage
func NewFileHotReloadStorage(filename string) io.ReadWriteCloser {
	return &FileHotReloadStorage{filename: filename}
}

// ================================================= [函数](FileHotReloadStorage)公开 =================================================

// Read 方法从fileHotReloadStorage中读取数据
// 参数:
//   - p: 缓冲区，用于存储从文件中读取的数据
//
// 返回值:
//   - n: 实际读取的字节数
//   - err: 错误信息，如果读取成功则为nil，否则为具体的错误描述
func (j *FileHotReloadStorage) Read(p []byte) (n int, err error) {
	// 使用互斥锁确保对文件的并发访问安全
	j.lock.Lock()

	defer j.lock.Unlock()

	// 如果文件指针为空，表示文件还未打开
	if j.file == nil {

		// 尝试打开文件，模式为读写模式，权限为0600（只有文件所有者有读写权限）
		j.file, err = os.OpenFile(j.filename, os.O_RDWR, 0600)

		// 如果文件不存在，返回一个自定义的错误
		if os.IsNotExist(err) {
			return 0, Error_InvalidStorage
		}

		// 如果打开文件过程中出现其他错误，返回该错误
		if err != nil {
			return 0, err
		}
	}

	// 从文件中读取数据到缓冲区p，并返回读取的字节数和可能的错误
	return j.file.Read(p)
}

// Write 方法将数据写入fileHotReloadStorage中的文件
// 参数:
//   - p: 要写入的数据，类型为字节切片
//
// 返回值:
//   - n: 实际写入的字节数
//   - err: 错误信息，如果写入成功则为nil，否则为具体的错误描述
func (j *FileHotReloadStorage) Write(p []byte) (n int, err error) {
	// 使用互斥锁确保对文件的并发访问安全
	j.lock.Lock()

	defer j.lock.Unlock()

	// 如果文件指针为空，表示文件还未创建
	if j.file == nil {

		// 尝试创建文件，如果文件已存在则会被重写
		j.file, err = os.Create(j.filename)

		// 如果创建文件过程中出现错误，返回该错误
		if err != nil {
			return 0, err
		}
	}

	// 将文件指针重置到文件的开头
	if _, err = j.file.Seek(0, io.SeekStart); err != nil {
		return 0, err
	}

	// 将文件截断为0，即将文件内容清空
	if err = j.file.Truncate(0); err != nil {
		return 0, err
	}

	// 只进行一次json解码并写入文件
	return j.file.Write(p)
}

// Close 方法关闭与fileHotReloadStorage关联的文件并释放资源
// 返回值:
//   - error: 错误信息，如果关闭成功则为nil，否则为具体的错误描述
func (j *FileHotReloadStorage) Close() error {
	// 使用互斥锁确保对文件的并发访问安全
	j.lock.Lock()

	defer j.lock.Unlock()

	// 如果文件指针为空，表示文件还未创建或已关闭，直接返回nil
	if j.file == nil {
		return nil
	}

	// 关闭文件并释放资源
	return j.file.Close()
}
