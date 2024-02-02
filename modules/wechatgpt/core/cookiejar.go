package core

import (
	"net/http"
	"net/http/cookiejar"
	"sync"
	"time"
	"unsafe"
)

// ================================================= [类型](全局)公开 =================================================

// entry 代表一个 Cookie 条目。
type entry struct {
	Name       string    // Name 是 Cookie 的名称。
	Value      string    // Value 是 Cookie 的值。
	Domain     string    // Domain 是 Cookie 的域。
	Path       string    // Path 是 Cookie 的路径。
	SameSite   string    // SameSite 标志指示浏览器在发送跨站点请求时是否包含 Cookie。
	Secure     bool      // Secure 标志指示 Cookie 是否只能通过加密的 HTTPS 连接传输。
	HttpOnly   bool      // HttpOnly 标志指示浏览器是否应该限制对 Cookie 的访问，仅允许 HTTP(S) 请求访问该 Cookie。
	Persistent bool      // Persistent 标志指示 Cookie 是否是持久的（即存储在客户端并在会话之间保留）。
	HostOnly   bool      // HostOnly 标志指示 Cookie 是否仅适用于 Cookie 的域，而不包括子域。
	Expires    time.Time // Expires 是 Cookie 的过期时间。
	Creation   time.Time // Creation 是 Cookie 的创建时间。
	LastAccess time.Time // LastAccess 是 Cookie 的最后访问时间。
	seqNum     uint64    // SeqNum 是一个序列号，以便 Jar 以确定性顺序返回 Cookie，即使具有相同路径长度和创建时间的 Cookie 也是如此。这简化了测试。
}

// Jar 是一个与 cookiejar.Jar 相同的结构体。
// cookiejar.Jar 的字段是私有的，因此我们无法直接使用它。
// Jar 定义了一个 Cookie 存储结构。
type Jar struct {
	PsList     cookiejar.PublicSuffixList  // PsList 是公共后缀列表，用于处理域名和子域名的关系
	mu         sync.Mutex                  // mu 用于锁定剩余的字段。
	Entries    map[string]map[string]entry // Entries 是一个条目集合，以它们的 eTLD+1 为键，以其名称/域/路径为子键。
	NextSeqNum uint64                      // NextSeqNum 是下一个分配给新创建 SetCookies 的 Cookie 的序列号。
}

// CookieGroup 是 http.Cookie 的切片类型。
type CookieGroup []*http.Cookie

// ================================================= [函数](全局)公开 =================================================

// FromCookieJar 将 http.CookieJar 接口转换为 Jar 结构体。
// 参数:
//   - jar (http.CookieJar): 要转换的 http.CookieJar 接口。
//
// 返回值:
//   - *Jar: 返回转换后的 Jar 结构体指针。
func FromCookieJar(jar http.CookieJar) *Jar {
	return (*Jar)(unsafe.Pointer(jar.(*cookiejar.Jar)))
}

// NewJar 创建一个新的 Jar 结构体实例。
// 返回值:
//   - *Jar: 返回创建的 Jar 结构体指针。
func NewJar() *Jar {
	jar, _ := cookiejar.New(nil)
	return FromCookieJar(jar)
}

// GetWebWxDataTicket 从给定的 Cookie 切片中获取 webwx_data_ticket 的值。
// 参数:
//   - cookies ([]*http.Cookie): 要查找的 Cookie 切片。
//
// 返回值:
//   - string: webwx_data_ticket 的值。
//   - error: 如果未找到 webwx_data_ticket，则返回 Error_WebWxDataTicketNotFound 错误。
func GetWebWxDataTicket(cookies []*http.Cookie) (string, error) {
	// 将 []*http.Cookie 转换为 CookieGroup 类型
	cookieGroup := CookieGroup(cookies)

	// 根据 cookie 名称查找对应的 cookie
	cookie, exist := cookieGroup.GetByName("webwx_data_ticket")

	// 如果未找到对应的 cookie，则返回错误
	if !exist {
		return "", Error_WebWxDataTicketNotFound
	}

	// 返回找到的 webwx_data_ticket 的值
	return cookie.Value, nil
}

// ================================================= [函数](Jar)公开 =================================================

// AsCookieJar 将 Jar 结构体不安全地转换为 http.CookieJar 接口。
// 返回值:
//   - http.CookieJar: 返回转换后的 http.CookieJar 接口。
func (j *Jar) AsCookieJar() http.CookieJar {
	return (*cookiejar.Jar)(unsafe.Pointer(j))
}

// ================================================= [函数](CookieGroup)公开 =================================================

// GetByName 根据 Cookie 的名称从 CookieGroup 中获取对应的 Cookie。
// 参数:
//   - cookieName (string): 要查找的 Cookie 的名称。
//
// 返回值:
//   - cookie (*http.Cookie): 查找到的 Cookie 对象。
//   - exist (bool): 指示是否找到了对应的 Cookie。
func (cookieGroup CookieGroup) GetByName(cookieName string) (cookie *http.Cookie, exist bool) {
	for _, cookie := range cookieGroup {
		if cookie.Name == cookieName {
			return cookie, true
		}
	}

	return nil, false
}
