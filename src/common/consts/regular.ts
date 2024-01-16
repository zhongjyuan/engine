/**
 * 手机号码规则
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @dateTime 2023年8月14日16:24:56
 */
export const PHONE = {
	/**是否十一位长度 */
	length: /^(\d{11})$/,
	/**是否合法手机号 */
	format_china: /^(1[3456789]\d{9})$|^\+(\d{1,3})?\d{11}$/,
	/**是否移动运营商 */
	format_yidong: /^(134|135|136|137|138|139|144|147|148|150|151|152|157|158|159|165|172|178|182|183|184|187|188|195|198)/,
	/**是否联通运营商 */
	format_liantong: /^(130|131|132|145|146|155|156|166|171|175|176|185|186|196)/,
	/**是否电信运营商 */
	format_dianxin: /^(133|149|153|173|174|177|180|181|189|199)/,
	/**是否虚拟运营商 */
	format_xuni: /^(170)/,
};

/**
 * 电话号码规则
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @dateTime 2023年8月14日16:37:45
 */
export const TELEPHONE = {
	/**中国座机号码 */
	format_china: /^0\d{2,3}-\d{7,8}$/,
	/**中国座机号码长度范围：9-13（包括"-"或空格）|中国座机号码长度范围：11-12（不包括"-"或空格） */
	length_china: /^([\d -]{9,13}|\d{11,12})$/,
	/**美国座机号码 */
	format_us: /^\d{3}-\d{3}-\d{4}$/,
	/**美国座机号码长度范围：10（包括"-"或空格）|美国座机号码长度范围：10（不包括"-"或空格） */
	length_us: /^([\d -]{10}|\d{10})$/,
	/**英国座机号码 */
	format_uk: /^0\d{1,4}\s?\d{3,4}\s?\d{4}$/,
	/**英国座机号码长度范围：10-12（包括"-"或空格）|英国座机号码长度范围：10-11（不包括"-"或空格） */
	length_uk: /^([\d -]{10,12}|\d{10,11})$/,
	/**日本座机号码 */
	format_japan: /^\d{1,4}-\d{1,4}-\d{4}$/,
	/**日本座机号码长度范围：11（包括"-"或空格）|日本座机号码长度范围：10（不包括"-"或空格） */
	length_japan: /^([\d -]{11}|\d{10})$/,
};

/**
 * 邮箱地址规则
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @dateTime 2023年8月14日17:36:20
 */
export const MAIL = {
	format: /^[\w\.-]+@[a-zA-Z\d\-]+(\.[a-zA-Z\d\-]+)*\.[a-zA-Z\d]{2,}$/,
};

/**
 * QQ号码规则
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @dateTime 2023年8月14日16:41:12
 */
export const QQ = {
	/**五到十位数字 */
	format_1: /^\d{5,10}$/,
	/**十位及以上的纯数字 */
	format_2: /^\d{10,}$/,
	/**可以包含连字符或空格的五到十位数字 */
	format_3: /^\d[-\s]?\d{3}[-\s]?\d{3,6}$/,
	/**前面可能有一个 "o" 字母的五到十位数字 */
	format_4: /^o?\d{5,10}$/,
};

/**
 * 账号规则
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @dateTime 2023年8月14日16:59:08
 */
export const ACCOUNT = {
	/**由字母、数字和下划线组成，长度为 3-16 */
	format_1: /^[a-zA-Z0-9_]{3,16}$/,
	/**由字母开头，后跟字母、数字和下划线，长度为 4-20 */
	format_2: /^[a-zA-Z][a-zA-Z0-9_]{3,19}$/,
	/**由字母开头，仅包含字母和数字，长度为 6-12 */
	format_3: /^[a-zA-Z][a-zA-Z0-9]{5,11}$/,
	/**仅包含小写字母，长度为 4-8 */
	format_4: /^[a-z]{4,8}$/,
	/**包含至少一个特殊字符（!@#$%^&*()_+-=[]{}|\;:'",.<>/?）的字符串，长度至少为8 */
	format_5: /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{}|\\;:'",.<>/?]{8,}$/,
};

/**
 * 密码规则
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @dateTime 2023年8月14日17:02:37
 */
export const PASSWORD = {
	/**至少8个字符 */
	format_1: /^.{8,}$/,
	/**至少8个字符，包含至少一个大写字母和一个小写字母 */
	format_2: /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
	/**至少8个字符，包含至少一个字母和一个数字 */
	format_3: /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/,
	/**至少8个字符，包含至少一个字母、一个数字和一个特殊字符 */
	format_4: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{},.<>/?]).{8,}$/,
	/**至少8个字符，包含至少一个大写字母、一个小写字母和一个数字 */
	format_5: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
	/**至少8个字符，包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符 */
	format_6: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{},.<>/?]).{8,}$/,
	/**至少8个字符，不允许有连续三个相同字符 */
	format_7: /^(?!.*(\w)\1{2})\w{8,}$/,
	/**至少8个字符，不允许有连续三个相同字符和连续三个字母或数字的顺序 */
	format_8: /^(?!.*(\w)\1{2})(?!.*\d{3})(?!.*[a-zA-Z]{3})[\da-zA-Z]{8,}$/,
	/**至少8个字符，不允许使用常见的密码（例如123456、password等） */
	format_9: /^(?!.*(123456|password)).{8,}$/,
	/**由大写字母、小写字母、数字和特殊字符组成，长度为8到20个字符 */
	format_10: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{},.<>/?]).{8,20}$/,
};

/**
 * 身份证规则
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @dateTime 2023年8月14日17:08:02
 */
export const IDCARD = {
	/**简单验证是否为合法的身份证号码（不区分15位或18位） */
	format_1: /^\d{15}(\d{2}[0-9Xx])?$/,
	/**18位身份证号码（精简校验，不包括日期和校验位的详细验证） */
	format_2: /^[1-9]\d{16}(\d|X|x)$/,
	/**15位身份证号码（精简校验，不包括日期的详细验证） */
	format_3: /^[1-9]\d{14}$/,
	/**18位身份证号码（全面校验） */
	format_4: /^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
	/**15位身份证号码（全面校验） */
	format_5: /^[1-9]\d{7}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{2}$/,
};

/**
 * IP规则
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @dateTime 2023年8月14日17:15:00
 */
export const IP = {
	/**匹配IPv4地址（简化版） */
	format_1: /^\d{1,3}(\.\d{1,3}){3}$/,
	/**匹配IPv4地址 */
	format_2: /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|[1-9])\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|[1-9])$/,
	/**匹配IPv6地址 */
	format_3: /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$/i,
	/**匹配IP地址段（如：192.168.0.0/24） */
	format_4: /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d?|[1-9])\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d?|[1-9])(\/([1-2]?[0-9]|3[0-2]))?$/,
	/**匹配IP地址范围（支持IPv4和IPv6） */
	format_5:
		/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|[1-9])\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|[1-9])-(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|[1-9])\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|[1-9])$|^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}-(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$/i,
	/**匹配私有IPv4地址（192.168.0.0 - 192.168.255.255） */
	format_6: /^192\.168\.(?:([0-9]|1\d{2}|2[0-4]\d|25[0-5])\.){1,3}(?:(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|[1-9]))$/,
	/**匹配保留IPv4地址（如：127.0.0.1） */
	format_7: /^127\.0\.0\.(?:([0-9]|[0-9]{2}|1\d{2}|2[0-4]\d|25[0-5]))$/,
};

/**
 * 链接规则
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @dateTime 2023年8月14日17:20:46
 */
export const LINK = {
	/**匹配FTP链接地址 */
	format_ftp: /^ftp:\/\/[^\s]+$/,
	/**匹配HTTP链接地址 */
	format_http: /^http:\/\/[^\s]+$/,
	/**匹配HTTPS链接地址 */
	format_https: /^https:\/\/[^\s]+$/,
	/**匹配FTP链接地址（可选端口号） */
	format_ftpAndPort: /^ftp:\/\/[^\s:\/]+(:\d+)?(\/[^\s]*)?$/,
	/**匹配HTTP链接地址（可选端口号） */
	format_httpAndPort: /^http:\/\/[^\s:\/]+(:\d+)?(\/[^\s]*)?$/,
	/**匹配HTTPS链接地址（可选端口号） */
	format_httpsAndPort: /^https:\/\/[^\s:\/]+(:\d+)?(\/[^\s]*)?$/,
};

/**
 * 移动端规则
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @dateTime 2023年8月14日17:29:15
 */
export const MOBILE = {
	/** /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Windows Mobile|SymbianOS/i */
	format: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Windows Mobile|SymbianOS/i,
};

/**
 * 输入规则
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @dateTime 2023年8月14日17:40:31
 */
export const INPUT = {
	/**匹配整数 */
	int: /^(\-)?\d+$/,
	/**匹配数字(包括整数和小数) */
	number: /^(\-)?\d+(\.\d+)?$/,
	/**匹配汉字 */
	chinese: /^[\u4e00-\u9fa5]+$/gi,
	/**匹配时间（YYYY-MM-DD） */
	datetime: /^\d{4}-\d{2}-\d{2}$/,
	/**匹配空格 */
	blankspace: /\s+/g,
};

/**
 * 文件规则
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @dateTime 2023年8月14日17:41:09
 */
export const FILE = {
	/** /^.+\.(jpg|jpeg|png|gif|bmp)$/i */
	image: /^.+\.(jpg|jpeg|png|gif|bmp)$/i,
	/** /^.+\.(txt|csv|doc|docx|pdf)$/i */
	txt: /^.+\.(txt|csv|doc|docx|pdf)$/i,
	/** /^.+\.(zip|rar|7z|tar|gz|xz)$/i */
	compress: /^.+\.(zip|rar|7z|tar|gz|xz)$/i,
	/** /^.+\.(mp4|mov|avi|wmv|flv|mkv)$/i */
	video: /^.+\.(mp4|mov|avi|wmv|flv|mkv)$/i,
	/** /^.+\.(mp3|wav|flac|m4a)$/i */
	audio: /^.+\.(mp3|wav|flac|m4a)$/i,
	/** /^.+\.(xls|xlsx|xlsm)$/i */
	excel: /^.+\.(xls|xlsx|xlsm)$/i,
	/** /^.+\.(ppt|pptx|pptm)$/i */
	ppt: /^.+\.(ppt|pptx|pptm)$/i,
	/** /^.+\.(doc|docx|docm)$/i */
	word: /^.+\.(doc|docx|docm)$/i,
	/** /^.+\.(html|htm)$/i */
	html: /^.+\.(html|htm)$/i,
	/** /^.+\.css$/i */
	css: /^.+\.css$/i,
	/** /^.+\.js$/i */
	js: /^.+\.js$/i,
	/** /^.+\.(xml)$/i */
	xml: /^.+\.(xml)$/i,
	/** /^.+\.(json)$/i */
	json: /^.+\.(json)$/i,
	/** /^.+\.(sql)$/i */
	sql: /^.+\.(sql)$/i,
	/** /^.+\.(java)$/i */
	java: /^.+\.(java)$/i,
	/** /^.+\.(py)$/i */
	python: /^.+\.(py)$/i,
	/** /^.+\.(php)$/i */
	php: /^.+\.(php)$/i,
	/** /^.+\.(cpp|cxx)$/i */
	cpp: /^.+\.(cpp|cxx)$/i,
	/** /^.+\.(c)$/i */
	c: /^.+\.(c)$/i,
	/** /^.+\.(h)$/i */
	h: /^.+\.(h)$/i,
	/**  /^.+\.(svg)$/i */
	svg: /^.+\.(svg)$/i,
	/** /^.+\.(gifv)$/i */
	gifv: /^.+\.(gifv)$/i,
	/** /^.+\.(tiff)$/i */
	tiff: /^.+\.(tiff)$/i,
	/** /^.+\.(bmp)$/i */
	bmp: /^.+\.(bmp)$/i,
	/** /^.+\.(ico)$/i */
	ico: /^.+\.(ico)$/i,
	/** /^.+\.(eps)$/i */
	eps: /^.+\.(eps)$/i,
	/** /^.+\.(ai)$/i */
	ai: /^.+\.(ai)$/i,
	/** /^.+\.(psd)$/i */
	psd: /^.+\.(psd)$/i,
	/** /^.+\.(sketch)$/i */
	sketch: /^.+\.(sketch)$/i,
	/** /^.+\.(md|markdown)$/i */
	markdown: /^.+\.(md|markdown)$/i,
	/** /^.+\.(log)$/i */
	log: /^.+\.(log)$/i,
	/** /^.+\.(yaml|yml)$/i */
	yaml: /^.+\.(yaml|yml)$/i,
	/** /^.+\.(bat)$/i */
	bat: /^.+\.(bat)$/i,
	/** /^.+\.(jar)$/i */
	jar: /^.+\.(jar)$/i,
	/** /^.+\.(dll)$/i */
	dll: /^.+\.(dll)$/i,
	/**  /^.+\.(iso)$/i */
	iso: /^.+\.(iso)$/i,
	/** /^.+\.(exe)$/i */
	exe: /^.+\.(exe)$/i,
	/** /^.+\.(dmg)$/i */
	dmg: /^.+\.(dmg)$/i,
	/** /^.+\.(deb)$/i */
	deb: /^.+\.(deb)$/i,
	/** /^.+\.(apk)$/i */
	apk: /^.+\.(apk)$/i,
	/** /^.+\.(img)$/i */
	img: /^.+\.(img)$/i,
	/** /^.+\.(rpm)$/i */
	rpm: /^.+\.(rpm)$/i,
	/** /^.+\.(woff)$/i */
	woff: /^.+\.(woff)$/i,
	/** /^.+\.(otf)$/i */
	otf: /^.+\.(otf)$/i,
	/** /^.+\.(csv)$/i */
	csv: /^.+\.(csv)$/i,
	/** /^.+\.(ps1)$/i */
	powershell: /^.+\.(ps1)$/i,
	/** /^.+\.(dockerfile)$/i */
	dockerfile: /^.+\.(dockerfile)$/i,
	/** /^.+\.(sh|bash)$/i */
	shell: /^.+\.(sh|bash)$/i,
	/** /^.+\.(bat)$/i */
	batch: /^.+\.(bat)$/i,
	/** /^.+\.(pl)$/i */
	perl: /^.+\.(pl)$/i,
	/** /^.+\.(ini)$/i */
	ini: /^.+\.(ini)$/i,
	/** /^.+\.(lisp)$/i */
	lisp: /^.+\.(lisp)$/i,
	/** /^.+\.(groovy)$/i */
	groovy: /^.+\.(groovy)$/i,
	/** /^.+\.(m)$/i */
	objectivec: /^.+\.(m)$/i,
	/** /^.+\.(vue)$/i */
	vue: /^.+\.(vue)$/i,
	/** /^.+\.(r)$/i */
	r: /^.+\.(r)$/i,
	/** /^.+\.(coffee)$/i */
	coffeescript: /^.+\.(coffee)$/i,
	/** /^.+\.(dart)$/i */
	dart: /^.+\.(dart)$/i,
	/** /^.+\.(jsx)$/i */
	jsx: /^.+\.(jsx)$/i,
	/** /^.+\.(hbs)$/i */
	handlebars: /^.+\.(hbs)$/i,
	/** /^.+\.(haml)$/i */
	haml: /^.+\.(haml)$/i,
};

/**
 * 浏览器规则
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @dateTime 2023年8月25日11:32:06
 */
export const BROWSER = {
	/** /opera/i */
	opera: /opera/i,
	/**Opera */
	operaName: "Opera",
	/** /opr\/([\d\.]+)/ */
	operaVersion: /opr\/([\d\.]+)/,
	/** /firefox/i */
	firefox: /firefox/i,
	/**Firefox */
	firefoxName: "Firefox",
	/** /firefox\/([\d\.]+)/ */
	firefoxVersion: /firefox\/([\d\.]+)/,
	/** /chrome/i */
	chrome: /chrome/i,
	/**Chrome */
	chromeName: "Chrome",
	/** /chrome\/([\d\.]+)/ */
	chromeVersion: /chrome\/([\d\.]+)/,
	/** /safari/i */
	safari: /safari/i,
	/**Safari */
	safariName: "Safari",
	/** /version\/([\d\.]+)/ */
	safariVersion: /version\/([\d\.]+)/,
	/** /msie|trident/i */
	ie: /msie|trident/i,
	/**IE */
	ieName: "IE",
	/** /(msie|rv:?)\s?([\d\.]+)/ */
	ieVersion: /(msie|rv:?)\s?([\d\.]+)/,
	/** /edg/ */
	edge: /edg/,
	/**Microsoft Edge */
	edgeName: "Microsoft Edge",
	/** /edg\/([\d\.]+)/ */
	edgeVersion: /edg\/([\d\.]+)/,
};

/**
 * Html规则
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @dateTime 2023年8月25日11:32:06
 */
export const HTML = {
	char: /[&<>"']/g,
	specialchar: /&(amp|lt|gt|quot|#039);/g,
};

/**规则常量 */
export default {
	phone: PHONE,
	telephone: TELEPHONE,
	mail: MAIL,
	qq: QQ,
	account: ACCOUNT,
	password: PASSWORD,
	idCard: IDCARD,
	ip: IP,
	link: LINK,
	mobile: MOBILE,
	input: INPUT,
	file: FILE,
	browser: BROWSER,
	html: HTML,
};
