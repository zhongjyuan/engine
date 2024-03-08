/**
 * 数据类型
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年7月14日17:44:07
 */
export const dataType = {
	/**"Object"代表一个对象类型，可以包含键值对的集合。 */
	OBJECT: "Object",
	/**"Array"代表一个数组类型，可以存储多个值的有序集合。 */
	ARRAY: "Array",
	/**"Boolean"代表一个布尔类型，只能是 true 或 false。 */
	BOOLEAN: "Boolean",
	/**"Function"代表一个函数类型，封装了可执行的代码块。 */
	FUNCTION: "Function",
	/**"String"代表一个字符串类型，由字符组成的序列。 */
	STRING: "String",
	/**"Number"代表一个数字类型，包括整数和浮点数。 */
	NUMBER: "Number",
	/**"Date"代表一个日期类型，包含年、月、日等信息。 */
	DATE: "Date",
	/**"Null"代表一个空值类型，表示变量没有值。 */
	NULL: "Null",
	/**"Undefined"代表一个未定义类型，表示变量没有被赋值。 */
	UNDEFINED: "Undefined",
	/**"RegExp"代表一个正则表达式类型，用于匹配字符串模式。 */
	REGEXP: "RegExp",
	/**"Symbol"代表一个符号类型，表示唯一的标识符。 */
	SYMBOL: "Symbol",
	/**"Promise"代表一个异步操作的结果，可以处理成功或失败的状态。 */
	PROMISE: "Promise",
	/**"Map"代表一个映射类型，存储键值对的集合。 */
	MAP: "Map",
	/**"Set"代表一个集合类型，存储唯一值的无序集合。 */
	SET: "Set",
	/**"Buffer"代表一个二进制缓冲区，用于处理二进制数据。 */
	BUFFER: "Buffer",
	/**"Error"代表一个错误类型，用于表示异常情况。 */
	ERROR: "Error",
	/**"File"代表一个文件类型，通常用于文件操作。 */
	FILE: "File",
	/**"Stream"代表一个流类型，用于处理连续的数据输入或输出。 */
	STREAM: "Stream",
	/**"Int8Array"代表一个8位有符号整数数组。 */
	INT8ARRAY: "Int8Array",
	/**"Uint8Array"代表一个8位无符号整数数组。 */
	UINT8ARRAY: "Uint8Array",
	/**"Int16Array"代表一个16位有符号整数数组。 */
	INT16ARRAY: "Int16Array",
	/**"Uint16Array"代表一个16位无符号整数数组。 */
	UINT16ARRAY: "Uint16Array",
	/**"Int32Array"代表一个32位有符号整数数组。 */
	INT32ARRAY: "Int32Array",
	/**"Uint32Array"代表一个32位无符号整数数组。 */
	UINT32ARRAY: "Uint32Array",
	/**"Float32Array"代表一个32位浮点数数组。 */
	FLOAT32ARRAY: "Float32Array",
	/**"Float64Array"代表一个64位浮点数数组。 */
	FLOAT64ARRAY: "Float64Array",
	/**"Int64"代表一个64位有符号整数。 */
	INT64: "Int64",
	/**"UInt64"代表一个64位无符号整数。 */
	UINT64: "UInt64",
	/**"BigInt"代表一个任意精度的整数类型。 */
	BIGINT: "BigInt",
	/**"Decimal"代表一个十进制数类型，用于高精度计算。 */
	DECIMAL: "Decimal",
	/**"Uint8ClampedArray"代表一个8位无符号整数固定范围数组。 */
	UINT8CLAMPEDARRAY: "Uint8ClampedArray",
	/**"Blob"代表一个二进制大对象类型，通常用于存储大量二进制数据。 */
	BLOB: "Blob",
	/**"XML"代表一个 XML 类型，用于处理和操作 XML 数据。 */
	XML: "XML",
	/**"URL"代表一个 URL 类型，表示一个统一资源定位器。 */
	URL: "URL",
	/**"WeakMap"代表一个弱映射类型，存储键值对的弱引用。 */
	WEAKMAP: "WeakMap",
	/**"WeakSet"代表一个弱集合类型，存储弱引用的唯一值集合。 */
	WEAKSET: "WeakSet",
	/**"Intl.Collator"代表一个国际化字符串排序类型，用于字符串比较和排序。 */
	INTL_COLLATOR: "Intl.Collator",
	/**"Intl.DateTimeFormat"代表一个国际化日期格式化类型，用于日期的本地化显示。 */
	INTL_DATE: "Intl.DateTimeFormat",
	/**"Intl.NumberFormat"代表一个国际化数字格式化类型，用于数字的本地化显示。 */
	INTL_NUMBER: "Intl.NumberFormat",
};

/**
 * 文件类型
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年8月7日15:32:49
 */
export const fileType = {
	/**文本文件 */
	TXT: ".txt",
	/**Microsoft Word 文档 */
	DOC: ".doc",
	/**Microsoft Word 文档 */
	DOCX: ".docx",
	/**Adobe PDF 文件 */
	PDF: ".pdf",
	/** Microsoft Excel 表格 */
	XLS: ".xls",
	/**Microsoft Excel 表格 */
	XLSX: ".xlsx",
	/**Microsoft PowerPoint 演示文稿 */
	PPT: ".ppt",
	/**Microsoft PowerPoint 演示文稿 */
	PPTX: ".pptx",
	/**JPEG 图像 */
	JPG: ".jpg",
	/**JPEG 图像 */
	JPEG: ".jpeg",
	/**PNG 图像 */
	PNG: ".png",
	/**GIF 图像 */
	GIF: ".gif",
	/**BMP 图像 */
	BMP: ".bmp",
	/**MP3 音频文件 */
	MP3: ".mp3",
	/**MP4 视频文件 */
	MP4: ".mp4",
	/**AVI 视频文件 */
	AVI: ".avi",
	/**压缩文件 */
	ZIP: ".zip",
	/**RAR 压缩文件 */
	RAR: ".rar",
	/**可执行文件 */
	EXE: ".exe",
	/**HTML 文件 */
	HTML: ".html",
	/**HTML 文件 */
	HTM: ".htm",
	/**CSS 样式表文件 */
	CSS: ".css",
	/**JavaScript 文件 */
	JS: ".js",
	/**ActionScript 文件 */
	TS: ".ts",
	/**XML 文件 */
	XML: ".xml",
	/**JSON 数据文件 */
	JSON: ".json",
	/**CSV 文件 */
	CSV: ".csv",
	/**SQL 数据库脚本文件 */
	SQL: ".sql",
	/**Java 源代码文件 */
	JAVA: ".java",
	/**Java YML配置文件 */
	YML: ".yml",
	/**Python 源代码文件 */
	PY: ".py",
	/**C 源代码文件 */
	C: ".c",
	/**C++ 源代码文件 */
	CPP: ".cpp",
	/**C# 源代码文件 */
	CS: ".cs",
	/**ASP.NET Web Forms 页面文件 */
	ASPX: ".aspx",
	/**ASP.NET Web 用户控件文件 */
	ASCX: ".ascx",
	/**ASP.NET Web Services 文件 */
	ASMX: ".asmx",
	/**ASP.NET 扩展处理程序文件 */
	AXD: ".axd",
	/**ASP.NET 配置文件 */
	CONFIG: ".config",
	/**ASP.NET 主页模板文件 */
	MASTER: ".master",
	/**PHP 源代码文件 */
	PHP: ".php",
	/**Ruby 源代码文件 */
	RB: ".rb",
	/**Go 源代码文件 */
	GO: ".go",
	/**Swift 源代码文件 */
	SWIFT: ".swift",
	/**Visual Basic 源代码文件 */
	VB: ".vb",
	/**汇编源代码文件 */
	ASM: ".asm",
	/**Android 安装包文件 */
	APK: ".apk",
	/**iOS 应用文件 */
	IPA: ".ipa",
	/**macOS 安装文件 */
	DMG: ".dmg",
	/**光盘镜像文件 */
	ISO: ".iso",
	/**可缩放矢量图形文件 */
	SVG: ".svg",
	/**Adobe Illustrator 矢量图形文件 */
	AI: ".ai",
	/**Adobe Photoshop 文档 */
	PSD: ".psd",
	/**Encapsulated PostScript 文件 */
	EPS: ".eps",
	/**字幕文件 */
	SRT: ".srt",
	/**WPS文字文档 */
	WPS: ".wps",
	/**WPS表格文档 */
	ET: ".et",
	/**WPS演示文稿 */
	DPS: ".dps",
	/**WPS表格模板 */
	ETX: ".etx",
	/**WPS演示模板 */
	POT: ".pot",
	/**WPS文字模板 */
	DOT: ".dot",
};

/**类型常量 */
export default {
	data: dataType,
	file: fileType,
};
