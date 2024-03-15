/**获取 URL 参数 */
var searchParams = new URLSearchParams(window.location.search.replace("?", ""));

// 获取页面中的元素节点

/**错误名称元素 */
var errorName = document.getElementById("error-name");
/**错误描述元素 */
var errorDesc = document.getElementById("error-desc");
/**主要按钮元素 */
var primaryButton = document.getElementById("primary-button");
/**次要按钮元素 */
var secondaryButton = document.getElementById("secondary-button");

// 获取 URL 中的参数值
var ec = searchParams.get("ec"); // 获取错误代码
var url = searchParams.get("url"); // 获取相关 URL

/**
 * 重试函数，点击主要按钮时调用
 */
function retry() {
	// 清空页面内容，白色背景
	document.body.innerHTML = "";
	document.body.style.backgroundColor = "#fff";

	// 重定向到指定的 URL，以便重新加载页面
	window.location = url;
}

/**网站未找到错误状态对象 */
var websiteNotFound = {
	/**错误名称 */
	name: l("serverNotFoundTitle"),
	/**错误描述 */
	message: l("serverNotFoundSubtitle"),
	/**次要动作 */
	secondaryAction: {
		/**标题 */
		title: l("archiveSearchAction"),
		/**接到 Internet Archive 的 URL，以便查找存档版本 */
		url: "https://web.archive.org/web/*/" + url,
	},
	/**当重新连接时是否重试，设为 true */
	retryOnReconnect: true,
};

/**SSL 错误状态对象 */
var sslError = {
	/**错误名称 */
	name: l("sslErrorTitle"),
	/**错误描述 */
	message: l("sslErrorMessage"),
};

/**DNS 错误状态对象 */
var dnsError = {
	/**错误名称 */
	name: l("dnsErrorTitle"),
	/**错误描述 */
	messge: l("dnsErrorMessage"),
};

/**离线错误状态对象 */
var offlineError = {
	/**错误名称 */
	name: l("offlineErrorTitle"),
	/**错误描述 */
	message: l("offlineErrorMessage"),
	/**当重新连接时是否重试，设为 true */
	retryOnReconnect: true,
};

// from https://source.chromium.org/chromium/chromium/src/+/master:net/base/net_error_list.h
/**错误码和对应错误描述的对象 */
const errorCodes = {
	"-1": "IO_PENDING", // 异步操作仍在进行中
	"-2": "FAILED", // 操作失败
	"-3": "ABORTED", // 操作被取消
	"-4": "INVALID_ARGUMENT", // 参数无效
	"-5": "INVALID_HANDLE", // 句柄无效
	"-6": "FILE_NOT_FOUND", // 文件不存在
	"-7": "TIMED_OUT", // 操作超时
	"-8": "FILE_TOO_BIG", // 文件过大
	"-9": "UNEXPECTED", // 操作出现未知错误
	"-10": "ACCESS_DENIED", // 拒绝访问
	"-11": "NOT_IMPLEMENTED", // 操作未实现
	"-12": "INSUFFICIENT_RESOURCES", // 资源不足
	"-13": "OUT_OF_MEMORY", // 内存不足
	"-14": "UPLOAD_FILE_CHANGED", // 文件已被修改
	"-15": "SOCKET_NOT_CONNECTED", // 套接字未连接
	"-16": "FILE_EXISTS", // 文件已存在
	"-17": "FILE_PATH_TOO_LONG", // 文件路径过长
	"-18": "FILE_NO_SPACE", // 磁盘空间不足
	"-19": "FILE_VIRUS_INFECTED", // 文件受到病毒感染
	"-20": "BLOCKED_BY_CLIENT", // 客户端阻止了操作
	"-21": "NETWORK_CHANGED", // 网络发生变化
	"-22": "BLOCKED_BY_ADMINISTRATOR", // 管理员阻止了操作
	"-23": "SOCKET_IS_CONNECTED", // 套接字已连接
	"-24": "BLOCKED_ENROLLMENT_CHECK_PENDING", // 阻止注册检查正在进行中
	"-25": "UPLOAD_STREAM_REWIND_NOT_SUPPORTED", // 不支持重新开始上传流
	"-26": "CONTEXT_SHUT_DOWN", // 上下文已关闭
	"-27": "BLOCKED_BY_RESPONSE", // 响应阻止了操作
	"-29": "CLEARTEXT_NOT_PERMITTED", // 不允许明文访问
	"-30": "BLOCKED_BY_CSP", // CSP 阻止了操作
	"-100": "CONNECTION_CLOSED", // 连接关闭
	"-101": "CONNECTION_RESET", // 连接重置
	"-102": "CONNECTION_REFUSED", // 连接被拒绝
	"-103": "CONNECTION_ABORTED", // 连接中止
	"-104": "CONNECTION_FAILED", // 连接失败
	"-105": "NAME_NOT_RESOLVED", // 域名无法解析
	"-106": "INTERNET_DISCONNECTED", // 网络断开连接
	"-107": "SSL_PROTOCOL_ERROR", // SSL 协议错误
	"-108": "ADDRESS_INVALID", // 地址无效
	"-109": "ADDRESS_UNREACHABLE", // 地址不可达
	"-110": "SSL_CLIENT_AUTH_CERT_NEEDED", // 需要 SSL 客户端认证证书
	"-111": "TUNNEL_CONNECTION_FAILED", // 隧道连接失败
	"-112": "NO_SSL_VERSIONS_ENABLED", // 没有启用 SSL 版本
	"-113": "SSL_VERSION_OR_CIPHER_MISMATCH", // SSL 版本或密码不匹配
	"-114": "SSL_RENEGOTIATION_REQUESTED", // 请求重新协商 SSL 握手
	"-115": "PROXY_AUTH_UNSUPPORTED", // 不支持代理身份验证
	"-116": "CERT_ERROR_IN_SSL_RENEGOTIATION", // SSL 重新协商中发生证书错误
	"-117": "BAD_SSL_CLIENT_AUTH_CERT", // SSL 客户端认证证书无效
	"-118": "CONNECTION_TIMED_OUT", // 连接超时
	"-119": "HOST_RESOLVER_QUEUE_TOO_LARGE", // 主机解析器队列过大
	"-120": "SOCKS_CONNECTION_FAILED", // SOCKS 连接失败
	"-121": "SOCKS_CONNECTION_HOST_UNREACHABLE", // SOCKS 连接主机不可达
	"-122": "ALPN_NEGOTIATION_FAILED", // ALPN 协商失败
	"-123": "SSL_NO_RENEGOTIATION", // SSL 握手不能再次协商
	"-124": "WINSOCK_UNEXPECTED_WRITTEN_BYTES", // Winsock 写入了意外的字节数
	"-125": "SSL_DECOMPRESSION_FAILURE_ALERT", // SSL 解压缩失败警告
	"-126": "SSL_BAD_RECORD_MAC_ALERT", // SSL 记录 MAC 错误警告
	"-127": "PROXY_AUTH_REQUESTED", // 代理身份验证请求
	"-130": "PROXY_CONNECTION_FAILED", // 代理连接失败
	"-131": "MANDATORY_PROXY_CONFIGURATION_FAILED", // 必要的代理配置失败
	"-133": "PRECONNECT_MAX_SOCKET_LIMIT", // 预连接套接字数达到上限
	"-134": "SSL_CLIENT_AUTH_PRIVATE_KEY_ACCESS_DENIED", // SSL 客户端认证私钥访问被拒绝
	"-135": "SSL_CLIENT_AUTH_CERT_NO_PRIVATE_KEY", // SSL 客户端认证证书没有私钥
	"-136": "PROXY_CERTIFICATE_INVALID", // 代理证书无效
	"-137": "NAME_RESOLUTION_FAILED", // 名称解析失败
	"-138": "NETWORK_ACCESS_DENIED", // 网络访问被拒绝
	"-139": "TEMPORARILY_THROTTLED", // 暂时被限速
	"-140": "HTTPS_PROXY_TUNNEL_RESPONSE_REDIRECT", // HTTPS 代理隧道响应重定向
	"-141": "SSL_CLIENT_AUTH_SIGNATURE_FAILED", // SSL 客户端认证签名验证失败
	"-142": "MSG_TOO_BIG", // 消息过大
	"-145": "WS_PROTOCOL_ERROR", // WebSocket 协议错误
	"-147": "ADDRESS_IN_USE", // 地址已在使用
	"-148": "SSL_HANDSHAKE_NOT_COMPLETED", // SSL 握手未完成
	"-149": "SSL_BAD_PEER_PUBLIC_KEY", // SSL 对等公钥无效
	"-150": "SSL_PINNED_KEY_NOT_IN_CERT_CHAIN", // SSL 固定密钥不在证书链中
	"-151": "CLIENT_AUTH_CERT_TYPE_UNSUPPORTED", // 不支持的 SSL 客户端认证证书类型
	"-153": "SSL_DECRYPT_ERROR_ALERT", // SSL 解密错误警告
	"-154": "WS_THROTTLE_QUEUE_TOO_LARGE", // WebSocket 限速队列过大
	"-156": "SSL_SERVER_CERT_CHANGED", // SSL 服务器证书已更改
	"-159": "SSL_UNRECOGNIZED_NAME_ALERT", // SSL 未识别名称警告
	"-160": "SOCKET_SET_RECEIVE_BUFFER_SIZE_ERROR", //设置接收缓冲区大小时发生错误。
	"-161": "SOCKET_SET_SEND_BUFFER_SIZE_ERROR", //设置发送缓冲区大小时发生错误。
	"-162": "SOCKET_RECEIVE_BUFFER_SIZE_UNCHANGEABLE", //接收缓冲区大小无法更改。
	"-163": "SOCKET_SEND_BUFFER_SIZE_UNCHANGEABLE", //发送缓冲区大小无法更改。
	"-164": "SSL_CLIENT_AUTH_CERT_BAD_FORMAT", //SSL客户端身份验证证书格式错误。
	"-166": "ICANN_NAME_COLLISION", //ICANN名称冲突。
	"-167": "SSL_SERVER_CERT_BAD_FORMAT", //SSL服务器证书格式错误。
	"-168": "CT_STH_PARSING_FAILED", //解析CT（Certificate Transparency） STH（Signed Tree Head）失败。
	"-169": "CT_STH_INCOMPLETE", //CT STH不完整。
	"-170": "UNABLE_TO_REUSE_CONNECTION_FOR_PROXY_AUTH", //无法重用连接进行代理身份验证。
	"-171": "CT_CONSISTENCY_PROOF_PARSING_FAILED", //解析CT一致性证明失败。
	"-172": "SSL_OBSOLETE_CIPHER", //过时的SSL密码套件。
	"-173": "WS_UPGRADE", //Web套接字升级错误。
	"-174": "READ_IF_READY_NOT_IMPLEMENTED", //未实现的就绪读取操作。
	"-176": "NO_BUFFER_SPACE", //没有足够的缓冲区空间。
	"-177": "SSL_CLIENT_AUTH_NO_COMMON_ALGORITHMS", //SSL客户端身份验证没有公共算法。
	"-178": "EARLY_DATA_REJECTED", //早期数据被拒绝。
	"-179": "WRONG_VERSION_ON_EARLY_DATA", //早期数据的版本不正确。
	"-181": "SSL_KEY_USAGE_INCOMPATIBLE", //SSL密钥用途不兼容。
	"-200": "CERT_COMMON_NAME_INVALID", //证书通用名称无效。
	"-201": "CERT_DATE_INVALID", //证书日期无效。
	"-202": "CERT_AUTHORITY_INVALID", //证书颁发机构无效。
	"-203": "CERT_CONTAINS_ERRORS", //证书包含错误。
	"-204": "CERT_NO_REVOCATION_MECHANISM", //证书没有吊销机制。
	"-205": "CERT_UNABLE_TO_CHECK_REVOCATION", //无法检查证书吊销状态。
	"-206": "CERT_REVOKED", //证书已吊销。
	"-207": "CERT_INVALID", //证书无效。
	"-208": "CERT_WEAK_SIGNATURE_ALGORITHM", //弱签名算法的证书。
	"-210": "CERT_NON_UNIQUE_NAME", //证书名称不唯一。
	"-211": "CERT_WEAK_KEY", //弱密钥的证书。
	"-212": "CERT_NAME_CONSTRAINT_VIOLATION", //证书名称约束违规。
	"-213": "CERT_VALIDITY_TOO_LONG", //证书有效期过长。
	"-214": "CERTIFICATE_TRANSPARENCY_REQUIRED", //需要证书透明度。
	"-215": "CERT_SYMANTEC_LEGACY", //Symantec遗留证书。
	"-217": "CERT_KNOWN_INTERCEPTION_BLOCKED", //已知拦截的证书被阻止。
	"-218": "SSL_OBSOLETE_VERSION", //过时的SSL版本。
	"-219": "CERT_END", //证书结束。
	"-300": "INVALID_URL", // 无效的URL。
	"-301": "DISALLOWED_URL_SCHEME", // 不允许的URL协议。
	"-302": "UNKNOWN_URL_SCHEME", // 未知的URL协议。
	"-303": "INVALID_REDIRECT", // 无效的重定向。
	"-310": "TOO_MANY_REDIRECTS", // 重定向次数过多。
	"-311": "UNSAFE_REDIRECT", // 不安全的重定向。
	"-312": "UNSAFE_PORT", // 不安全的端口。
	"-320": "INVALID_RESPONSE", // 无效的响应。
	"-321": "INVALID_CHUNKED_ENCODING", // 无效的分块编码。
	"-322": "METHOD_NOT_SUPPORTED", // 不支持的请求方法。
	"-323": "UNEXPECTED_PROXY_AUTH", // 代理身份验证失败。
	"-324": "EMPTY_RESPONSE", // 空响应。
	"-325": "RESPONSE_HEADERS_TOO_BIG", // 响应头过大。
	"-327": "PAC_SCRIPT_FAILED", // PAC脚本执行失败。
	"-328": "REQUEST_RANGE_NOT_SATISFIABLE", // 请求范围无法满足。
	"-329": "MALFORMED_IDENTITY", // 身份验证信息格式错误。
	"-330": "CONTENT_DECODING_FAILED", // 内容解码失败。
	"-331": "NETWORK_IO_SUSPENDED", // 网络IO暂停。
	"-332": "SYN_REPLY_NOT_RECEIVED", // 未接收到SYN回复。
	"-333": "ENCODING_CONVERSION_FAILED", // 编码转换失败。
	"-334": "UNRECOGNIZED_FTP_DIRECTORY_LISTING_FORMAT", // 无法识别的FTP目录列表格式。
	"-335": "INVALID_SPDY_STREAM", // 无效的SPDY流。
	"-336": "NO_SUPPORTED_PROXIES", // 没有支持的代理。
	"-338": "INVALID_AUTH_CREDENTIALS", // 无效的身份验证凭据。
	"-339": "UNSUPPORTED_AUTH_SCHEME", // 不支持的身份验证方案。
	"-340": "ENCODING_DETECTION_FAILED", // 编码检测失败。
	"-341": "MISSING_AUTH_CREDENTIALS", // 缺少身份验证凭据。
	"-342": "UNEXPECTED_SECURITY_LIBRARY_STATUS", // 不符合预期的安全库状态。
	"-343": "MISCONFIGURED_AUTH_ENVIRONMENT", // 配置错误的身份验证环境。
	"-344": "UNDOCUMENTED_SECURITY_LIBRARY_STATUS", // 未记录的安全库状态。
	"-345": "RESPONSE_BODY_TOO_BIG_TO_DRAIN", // 响应体过大，无法处理。
	"-346": "RESPONSE_HEADERS_MULTIPLE_CONTENT_LENGTH", // 响应头包含多个内容长度字段。
	"-348": "PAC_NOT_IN_DHCP", // PAC脚本不在DHCP中。
	"-349": "RESPONSE_HEADERS_MULTIPLE_CONTENT_DISPOSITION", // 响应头包含多个内容描述字段。
	"-350": "RESPONSE_HEADERS_MULTIPLE_LOCATION", // 响应头包含多个位置字段。
	"-353": "PIPELINE_EVICTION", // 管道驱逐。
	"-354": "CONTENT_LENGTH_MISMATCH", // 内容长度不匹配。
	"-355": "INCOMPLETE_CHUNKED_ENCODING", // 不完整的分块编码。
	"-356": "QUIC_PROTOCOL_ERROR", // QUIC协议错误。
	"-357": "RESPONSE_HEADERS_TRUNCATED", // 响应头被截断。
	"-358": "QUIC_HANDSHAKE_FAILED", // QUIC握手失败。
	"-359": "REQUEST_FOR_SECURE_RESOURCE_OVER_INSECURE_QUIC", // 请求安全资源，但使用不安全的QUIC协议。
	"-364": "PROXY_AUTH_REQUESTED_WITH_NO_CONNECTION", // 代理请求身份验证，但没有建立连接。
	"-367": "PAC_SCRIPT_TERMINATED", // PAC脚本终止。
	"-369": "TEMPORARY_BACKOFF", // 暂时退避。
	"-370": "INVALID_HTTP_RESPONSE", // 无效的HTTP响应。
	"-371": "CONTENT_DECODING_INIT_FAILED", // 内容解码初始化失败。
	"-375": "TOO_MANY_RETRIES", // 重试次数过多。
	"-379": "HTTP_RESPONSE_CODE_FAILURE", // HTTP响应码错误。
	"-380": "QUIC_CERT_ROOT_NOT_KNOWN", // QUIC证书根未知。
	"-381": "QUIC_GOAWAY_REQUEST_CAN_BE_RETRIED", // 可以重试的GOAWAY请求。
	"-400": "CACHE_MISS", // 缓存未命中。
	"-401": "CACHE_READ_FAILURE", // 缓存读取失败。
	"-402": "CACHE_WRITE_FAILURE", // 缓存写入失败。
	"-403": "CACHE_OPERATION_NOT_SUPPORTED", // 不支持的缓存操作。
	"-404": "CACHE_OPEN_FAILURE", // 缓存打开失败。
	"-405": "CACHE_CREATE_FAILURE", // 缓存创建失败。
	"-406": "CACHE_RACE", // 缓存竞争条件。
	"-407": "CACHE_CHECKSUM_READ_FAILURE", // 缓存校验和读取失败。
	"-408": "CACHE_CHECKSUM_MISMATCH", // 缓存校验和不匹配。
	"-409": "CACHE_LOCK_TIMEOUT", // 缓存锁超时。
	"-410": "CACHE_AUTH_FAILURE_AFTER_READ", // 缓存读取后身份验证失败。
	"-411": "CACHE_ENTRY_NOT_SUITABLE", // 缓存条目不合适。
	"-412": "CACHE_DOOM_FAILURE", // 缓存DOOM失败。
	"-413": "CACHE_OPEN_OR_CREATE_FAILURE", // 缓存打开或创建失败。
	"-501": "INSECURE_RESPONSE", // 不安全的响应。
	"-502": "NO_PRIVATE_KEY_FOR_CERT", // 证书没有私钥。
	"-503": "ADD_USER_CERT_FAILED", // 添加用户证书失败。
	"-504": "INVALID_SIGNED_EXCHANGE", // 无效的签名交换。
	"-505": "INVALID_WEB_BUNDLE", // 无效的Web捆绑包。
	"-506": "TRUST_TOKEN_OPERATION_FAILED", // 信任令牌操作失败。
	"-507": "TRUST_TOKEN_OPERATION_SUCCESS_WITHOUT_SENDING_REQUEST", // 信任令牌操作成功，但未发送请求。
	"-601": "FTP_FAILED", // FTP失败。
	"-602": "FTP_SERVICE_UNAVAILABLE", // FTP服务不可用。
	"-603": "FTP_TRANSFER_ABORTED", // FTP传输中止。
	"-604": "FTP_FILE_BUSY", // FTP文件忙。
	"-605": "FTP_SYNTAX_ERROR", // FTP语法错误。
	"-606": "FTP_COMMAND_NOT_SUPPORTED", // FTP命令不支持。
	"-607": "FTP_BAD_COMMAND_SEQUENCE", // FTP命令序列错误。
	"-703": "IMPORT_CA_CERT_NOT_CA", // 导入的CA证书不是CA。
	"-704": "IMPORT_CERT_ALREADY_EXISTS", // 导入的证书已存在。
	"-705": "IMPORT_CA_CERT_FAILED", // 导入CA证书失败。
	"-706": "IMPORT_SERVER_CERT_FAILED", // 导入服务器证书失败。
	"-710": "KEY_GENERATION_FAILED", // 密钥生成失败。
	"-712": "PRIVATE_KEY_EXPORT_FAILED", // 导出私钥失败。
	"-713": "SELF_SIGNED_CERT_GENERATION_FAILED", // 自签名证书生成失败。
	"-714": "CERT_DATABASE_CHANGED", // 证书数据库已更改。
	"-800": "DNS_MALFORMED_RESPONSE", // DNS响应格式错误。
	"-801": "DNS_SERVER_REQUIRES_TCP", // DNS服务器要求使用TCP。
	"-802": "DNS_SERVER_FAILED", // DNS服务器失败。
	"-803": "DNS_TIMED_OUT", // DNS超时。
	"-804": "DNS_CACHE_MISS", // DNS缓存未命中。
	"-805": "DNS_SEARCH_EMPTY", // DNS搜索结果为空。
	"-806": "DNS_SORT_ERROR", // DNS排序错误。
	"-808": "DNS_SECURE_RESOLVER_HOSTNAME_RESOLUTION_FAILED", // 安全解析器主机名解析失败。
};

// list: https://source.chromium.org/chromium/chromium/src/+/master:net/base/net_error_list.h
/**异常定义对象 */
const erorDescriptions = {
	crash: {
		name: l("crashErrorTitle"), // 错误标题：崩溃错误
		message: l("crashErrorSubtitle"), // 错误消息：发生了一个崩溃错误
	},
	"-21": offlineError, // 离线错误：网络发生变化
	"-104": {
		message: l("genericConnectionFail"), // 连接失败：通用连接失败
	},
	"-105": websiteNotFound, // 网站未找到错误
	"-106": offlineError, // 离线错误
	"-107": sslError, // SSL错误
	"-109": websiteNotFound, // 网站未找到错误
	"-110": sslError, // 实际上是指服务器请求客户端证书的错误，但我们暂不支持
	"-112": sslError, // SSL错误
	"-113": sslError, // SSL错误
	"-116": sslError, // SSL错误
	"-117": sslError, // SSL错误
	"-200": sslError, // SSL错误
	"-201": {
		name: l("sslErrorTitle"), // SSL错误标题
		message: l("sslTimeErrorMessage"), // SSL错误消息：SSL握手超时
	},
	"-202": sslError, // SSL错误
	"-203": sslError, // SSL错误
	"-204": sslError, // SSL错误
	"-205": sslError, // SSL错误
	"-206": sslError, // SSL错误
	"-207": sslError, // SSL错误
	"-208": sslError, // SSL错误
	"-210": sslError, // SSL错误
	"-211": sslError, // SSL错误
	"-212": sslError, // SSL错误
	"-213": sslError, // SSL错误
	"-300": {
		name: l("addressInvalidTitle"), // 无效地址错误标题
	},
	"-501": sslError, // SSL错误
	"-800": dnsError, // DNS错误
	"-801": dnsError, // DNS错误
	"-802": dnsError, // DNS错误
	"-803": dnsError, // DNS错误
	"-804": dnsError, // DNS错误
	"-805": dnsError, // DNS错误
	"-806": dnsError, // DNS错误
};

/**异常描述对象 */
var errDesc = erorDescriptions[ec];

// 如果错误描述对象存在且具有重连时重试的属性，则在网络重新连接时执行重试操作
if (errDesc && errDesc.retryOnReconnect) {
	window.addEventListener("online", function () {
		retry();
	});
}

/**错误标题 */
var title,
	/**错误副标题 */
	subtitle;

// 根据错误描述对象的内容或默认值设置标题和副标题
if (errDesc) {
	title = errDesc.name || "";
	subtitle = errDesc.message || "";
} else {
	// 默认通用错误标题
	title = l("genericError");
	// 使用错误码作为副标题
	subtitle = (errorCodes[ec] || "") + " (" + ec + ")";
}

/**文档标题 */
document.title = title;

/**显示错误标题 */
errorName.textContent = title;

/**显示错误副标题 */
errorDesc.textContent = subtitle;

// 如果错误描述对象存在且具有次要操作属性，则显示次要操作按钮并设置对应的事件处理函数
if (errDesc && errDesc.secondaryAction) {
	secondaryButton.hidden = false;

	// 设置按钮文本
	secondaryButton.textContent = errDesc.secondaryAction.title;

	// 点击按钮时进行相应的页面跳转
	secondaryButton.addEventListener("click", function () {
		window.location = errDesc.secondaryAction.url;
	});
}

// 如果出现 SSL 错误，"重试" 操作应该尝试使用 http:// 协议的版本
if (erorDescriptions[ec] === sslError) {
	// 将 URL 中的 https:// 替换为 http://
	url = url.replace("https://", "http://");
}

// 如果存在 URL，则为主操作按钮添加点击事件处理函数，用于执行重试操作
if (url) {
	primaryButton.addEventListener("click", function () {
		retry();
	});
}

// 设置主操作按钮获得焦点
primaryButton.focus();
