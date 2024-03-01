/**
 * 请求方式
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年7月14日17:44:07
 */
export const httpMethod = {
	/**"GET"表示发送 GET 请求 */
	GET: "GET",
	/**"POST"表示发送 POST 请求 */
	POST: "POST",
	/**"PUT"表示发送 PUT 请求 */
	PUT: "PUT",
	/**"DELETE"表示发送 DELETE 请求 */
	DELETE: "DELETE",
	/**"PATCH"表示发送 PATCH 请求 */
	PATCH: "PATCH",
	/**"HEAD"表示发送 HEAD 请求 */
	HEAD: "HEAD",
	/**"OPTIONS"表示发送 OPTIONS 请求 */
	OPTIONS: "OPTIONS",
};

/**
 * 请求参数
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年8月7日15:35:19
 */
export const httpParam = {
	/**"URL"表示URL参数 */
	URL: "URL",
	/**"body"表示请求体中的参数 */
	BODY: "body",
	/**"path"表示路由路径中的参数 */
	PATH: "path",
	/**"query"表示查询字符串中的参数 */
	QUERY: "query",
	/**"json"表示JSON格式的参数 */
	JSON: "json",
	/**"header"表示请求头中的参数 */
	HEADER: "header",
	/**"cookies"表示请求中的cookie参数 */
	COOKIES: "cookies",
	/**"form"表示表单提交的参数 */
	FORM: "form",
	/**"file"表示文件上传的参数 */
	FILE: "file",
	/**"multipart"表示多部分(form-data)提交的参数 */
	MULTIPART: "multipart",
};

/**
 * 请求状态
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年8月7日15:36:46
 */
export const httpStatus = {
	/**客户端应继续其请求 */
	CONTINUE: 100,
	/**请求成功 */
	OK: 200,
	/**创建成功 */
	CREATED: 201,
	/**请求成功，但响应中没有内容返回 */
	NO_CONTENT: 204,
	/**资源永久移动到新位置 */
	MOVED_PERMANENTLY: 301,
	/**资源临时移动到新位置 */
	FOUND: 302,
	/**错误的请求 */
	BAD_REQUEST: 400,
	/**未授权 */
	UNAUTHORIZED: 401,
	/**被禁止访问 */
	FORBIDDEN: 403,
	/**页面未找到 */
	NOT_FOUND: 404,
	/**服务器内部错误 */
	INTERNAL_SERVER_ERROR: 500,
	/**无效的响应从上游服务器返回 */
	BAD_GATEWAY: 502,
	/**服务器暂时无法处理请求 */
	SERVICE_UNAVAILABLE: 503,
};

/**
 * ContentType
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年8月7日15:34:13
 */
export const contentType = {
	/**"image/jpeg"表示 JPEG 图片 */
	IMAGE_JPEG: "image/jpeg",
	/**"image/png"表示 PNG 图片 */
	IMAGE_PNG: "image/png",
	/**"image/gif"表示 GIF 图片 */
	IMAGE_GIF: "image/gif",
	/**"image/bmp"表示 BMP 图片 */
	IMAGE_BMP: "image/bmp",
	/**"image/tiff"表示 TIFF 图片 */
	IMAGE_TIFF: "image/tiff",
	/**"image/svg+xml"表示 SVG 图片 */
	IMAGE_SVG_XML: "image/svg+xml",

	/**"audio/mpeg"表示 MP3 音频文件 */
	AUDIO_MPEG: "audio/mpeg",
	/**"audio/wav"表示 WAV 音频文件 */
	AUDIO_WAV: "audio/wav",
	/**"audio/ogg"表示 OGG 音频文件 */
	AUDIO_OGG: "audio/ogg",
	/**"audio/flac"表示 FLAC 音频文件 */
	AUDIO_FLAC: "audio/flac",
	/**"audio/midi"表示 MIDI 音频文件 */
	AUDIO_MIDI: "audio/midi",
	/**"audio/x-ms-wma"表示 WMA 音频文件 */
	AUDIO_WMA: "audio/x-ms-wma",

	/**"video/mp4"表示 MP4 视频文件 */
	VIDEO_MP4: "video/mp4",
	/**"video/mpeg"表示 MPEG 视频文件 */
	VIDEO_MPEG: "video/mpeg",
	/**"video/webm"表示 WebM 视频文件 */
	VIDEO_WEBM: "video/webm",
	/**"video/x-msvideo"表示 AVI 视频文件 */
	VIDEO_AVI: "video/x-msvideo",
	/**"video/x-matroska"表示 Matroska 视频文件 */
	VIDEO_MATROSKA: "video/x-matroska",
	/**"video/quicktime"表示 QuickTime 视频文件 */
	VIDEO_QUICKTIME: "video/quicktime",

	/**"text/csv"表示 CSV 文件 */
	TEXT_CSV: "text/csv",
	/**"text/css"表示 CSS 样式表 */
	TEXT_CSS: "text/css",
	/**"text/plain"表示纯文本数据 */
	TEXT_PLAIN: "text/plain",
	/**"text/html"表示 HTML 数据 */
	TEXT_HTML: "text/html",
	/**"text/html;charset=utf-8"表示带有 UTF-8 编码的 HTML 数据 */
	TEXT_HTML_CHARSET_UTF8: "text/html;charset=utf-8",

	/**"multipart/form-data"表示多部分(form-data)数据 */
	MULTIPART_FORM_DATA: "multipart/form-data",

	/**"application/json"表示 JSON 数据 */
	APPLICATION_JSON: "application/json",
	/**"application/xml"表示 XML 数据 */
	APPLICATION_XML: "application/xml",
	/**"application/pdf"表示 PDF 文件 */
	APPLICATION_PDF: "application/pdf",
	/**"application/sql"表示 SQL 脚本文件 */
	APPLICATION_SQL: "application/sql",
	/**"application/rtf"表示 RTF 文件 */
	APPLICATION_RTF: "application/rtf",
	/**"application/ogg"表示 OGG 文件 */
	APPLICATION_OGG: "application/ogg",
	/**"application/x-png"表示 PNG 图片 */
	APPLICATION_PNG: "application/x-png",
	/**"application/msword"表示 Microsoft Word 文档 */
	APPLICATION_MSWORD: "application/msword",
	/**"application/javascript"表示 JavaScript 文件 */
	APPLICATION_JAVASCRIPT: "application/javascript",
	/**"application/octet-stream"表示二进制文件流 */
	APPLICATION_OCTET_STREAM: "application/octet-stream",
	/**"application/x-www-form-urlencoded"表示表单数据 */
	APPLICATION_FORM_URLENCODED: "application/x-www-form-urlencoded",
	/**"application/rss+xml"表示 RSS XML 数据 */
	APPLICATION_RSS_XML: "application/rss+xml",
	/**"application/soap+xml"表示 SOAP XML 数据 */
	APPLICATION_SOAP_XML: "application/soap+xml",
	/**"application/atom+xml"表示 Atom XML 数据 */
	APPLICATION_ATOM_XML: "application/atom+xml",
	/**"application/xhtml+xml"表示 XHTML 数据 */
	APPLICATION_XHTML_XML: "application/xhtml+xml",
	/**"application/xhtml+xml;charset=utf-8"表示带有 UTF-8 编码的 XHTML 数据 */
	APPLICATION_XHTML_XML_CHARSET_UTF8: "application/xhtml+xml;charset=utf-8",
	/**"application/vnd.mozilla.xul+xml"表示 Mozilla XUL 数据 */
	APPLICATION_VND_MOZILLA_XUL_XML: "application/vnd.mozilla.xul+xml",
	/**"application/rdf+xml"表示 RDF XML 数据 */
	APPLICATION_RDF_XML: "application/rdf+xml",
	/**"application/zip"表示 ZIP 压缩文件 */
	APPLICATION_ZIP: "application/zip",
	/**"application/gzip"表示 GZIP 压缩文件 */
	APPLICATION_GZIP: "application/gzip",
	/***"application/x-tar"表示 TAR 压缩文件 */
	APPLICATION_X_TAR: "application/x-tar",
	/**"application/epub+zip"表示 EPUB 压缩文件 */
	APPLICATION_EPUB_ZIP: "application/epub+zip",
	/**"application/EDI-X12"表示 EDI X12 数据 */
	APPLICATION_EDIX12: "application/EDI-X12",
	/**"application/font-woff"表示 WOFF 字体文件 */
	APPLICATION_FONT_WOFF: "application/font-woff",
	/**"application/vnd.ms-excel"表示 Microsoft Excel 文件 */
	APPLICATION_VND_MS_EXCEL: "application/vnd.ms-excel",
	/**"application/vnd.google-earth.kml+xml"表示 Google Earth KML 数据 */
	APPLICATION_VND_GOOGLE_EARTH_KML_XML: "application/vnd.google-earth.kml+xml",
	/**"application/vnd.mozilla.pkix-cert"表示 Mozilla PKIX 证书 */
	APPLICATION_VND_MOZILLA_PKIX_CERT: "application/vnd.mozilla.pkix-cert",
	/**"application/vnd.ms-powerpoint"表示 Microsoft PowerPoint 文件 */
	APPLICATION_VND_MS_POWERPOINT: "application/vnd.ms-powerpoint",
	/**"application/vnd.oasis.opendocument.text"表示 ODT (OpenDocument Text) 文档 */
	APPLICATION_VND_OASIS_OPENDOCUMENT_TEXT: "application/vnd.oasis.opendocument.text",
	/**"application/vnd.oasis.opendocument.spreadsheet"表示 ODS (OpenDocument Spreadsheet) 电子表格 */
	APPLICATION_VND_OASIS_OPENDOCUMENT_SPREADSHEET: "application/vnd.oasis.opendocument.spreadsheet",
	/**"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"表示 Microsoft Excel OpenXML 文件 */
	APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_SPREADSHEETML_SHEET: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	/**"application/vnd.openxmlformats-officedocument.presentationml.presentation"表示 Microsoft PowerPoint OpenXML 文件 */
	APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_PRESENTATIONML_PRESENTATION:
		"application/vnd.openxmlformats-officedocument.presentationml.presentation",
	/**"application/vnd.openxmlformats-officedocument.wordprocessingml.document"表示 Microsoft Word OpenXML 文件 */
	APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_WORDPROCESSINGML_DOCUMENT: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/**HTTP 常量 */
export default {
	method: httpMethod,
	param: httpParam,
	status: httpStatus,
	contentType: contentType,
};
