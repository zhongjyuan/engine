import baseConfig from "./base";

/**
 * 获取配置信息
 * @param {string} host - 主机地址
 * @returns {object} - 配置信息对象
 */
export function getConfig(host) {
	host = host || "wx.qq.com"; // 如果 host 未定义，则默认设置为 "wx.qq.com"

	let origin = `https://${host}`; // 构建 origin 变量，以 https:// 开头，后跟 host 变量的值
	let loginUrl = "login.weixin.qq.com"; // 设置默认的登录 URL
	let fileUrl = "file.wx.qq.com"; // 设置默认的文件 URL
	let pushUrl = "webpush.weixin.qq.com"; // 设置默认的推送 URL

	// 使用正则表达式匹配 host 中的特定部分
	let matchResult = host.match(/(\w+)(.qq.com|.wechat.com)/);
	if (matchResult && matchResult[1] && matchResult[2]) {
		let prefix = matchResult[1]; // 匹配结果的第一个组成部分
		let suffix = matchResult[2]; // 匹配结果的第二个组成部分

		// 如果匹配到的后缀是 ".qq.com"
		if (suffix === ".qq.com") {
			prefix = ~["wx", "wx2", "wx8"].indexOf(prefix) ? prefix : "wx"; // 如果 prefix 在 ["wx", "wx2", "wx8"] 数组中，则保持原值，否则设置为 "wx"
		}

		// 如果匹配到的后缀是 ".wechat.com"
		else {
			prefix = ~["web", "web2"].indexOf(prefix) ? prefix : "web"; // 如果 prefix 在 ["web", "web2"] 数组中，则保持原值，否则设置为 "web"
		}

		loginUrl = `login.${prefix}${suffix}`; // 根据 prefix 和 suffix 构建登录 URL
		fileUrl = `file.${prefix}${suffix}`; // 根据 prefix 和 suffix 构建文件 URL
		pushUrl = `webpush.${prefix}${suffix}`; // 根据 prefix 和 suffix 构建推送 URL

		let config = {}; // 创建一个空对象，用于存储配置信息

		config.origin = origin; // 将 origin 的值赋给 config 对象的 origin 属性
		config.baseUri = origin + "/cgi-bin/mmwebwx-bin"; // 构建 baseUri，将 origin 和 "/cgi-bin/mmwebwx-bin" 拼接起来，赋给 config 对象的 baseUri 属性

		// 根据不同的 URL 构建 config 对象的各个属性
		config.API_jsLogin = "https://" + loginUrl + "/jslogin?appid=wx782c26e4c19acffb&fun=new&lang=zh-CN"; // 获取登录二维码的URL

		config.API_login = "https://" + loginUrl + "/cgi-bin/mmwebwx-bin/login"; // 登录的URL

		config.API_synccheck = "https://" + pushUrl + "/cgi-bin/mmwebwx-bin/synccheck"; // 同步检查的URL

		config.API_webwxdownloadmedia = "https://" + fileUrl + "/cgi-bin/mmwebwx-bin/webwxgetmedia"; // 下载媒体文件的URL

		config.API_webwxuploadmedia = "https://" + fileUrl + "/cgi-bin/mmwebwx-bin/webwxuploadmedia"; // 上传媒体文件的URL

		config.API_webwxpreview = origin + "/cgi-bin/mmwebwx-bin/webwxpreview"; // 预览图片消息的URL

		config.API_webwxinit = origin + "/cgi-bin/mmwebwx-bin/webwxinit"; // 初始化微信接口的URL

		config.API_webwxgetcontact = origin + "/cgi-bin/mmwebwx-bin/webwxgetcontact"; // 获取联系人列表的URL

		config.API_webwxsync = origin + "/cgi-bin/mmwebwx-bin/webwxsync"; // 同步微信消息的URL

		config.API_webwxbatchgetcontact = origin + "/cgi-bin/mmwebwx-bin/webwxbatchgetcontact"; // 批量获取联系人信息的URL

		config.API_webwxgeticon = origin + "/cgi-bin/mmwebwx-bin/webwxgeticon"; // 获取头像的URL

		config.API_webwxsendmsg = origin + "/cgi-bin/mmwebwx-bin/webwxsendmsg"; // 发送文本消息的URL

		config.API_webwxsendmsgimg = origin + "/cgi-bin/mmwebwx-bin/webwxsendmsgimg"; // 发送图片消息的URL

		config.API_webwxsendmsgvedio = origin + "/cgi-bin/mmwebwx-bin/webwxsendvideomsg"; // 发送视频消息的URL

		config.API_webwxsendemoticon = origin + "/cgi-bin/mmwebwx-bin/webwxsendemoticon"; // 发送表情消息的URL

		config.API_webwxsendappmsg = origin + "/cgi-bin/mmwebwx-bin/webwxsendappmsg"; // 发送应用消息的URL

		config.API_webwxgetheadimg = origin + "/cgi-bin/mmwebwx-bin/webwxgetheadimg"; // 获取群头像的URL

		config.API_webwxgetmsgimg = origin + "/cgi-bin/mmwebwx-bin/webwxgetmsgimg"; // 获取消息图片的URL

		config.API_webwxgetmedia = origin + "/cgi-bin/mmwebwx-bin/webwxgetmedia"; // 获取媒体文件的URL

		config.API_webwxgetvideo = origin + "/cgi-bin/mmwebwx-bin/webwxgetvideo"; // 获取视频消息的URL

		config.API_webwxlogout = origin + "/cgi-bin/mmwebwx-bin/webwxlogout"; // 退出登录的URL

		config.API_webwxgetvoice = origin + "/cgi-bin/mmwebwx-bin/webwxgetvoice"; // 获取语音消息的URL

		config.API_webwxupdatechatroom = origin + "/cgi-bin/mmwebwx-bin/webwxupdatechatroom"; // 更新群组信息的URL

		config.API_webwxcreatechatroom = origin + "/cgi-bin/mmwebwx-bin/webwxcreatechatroom"; // 创建群聊的URL

		config.API_webwxstatusnotify = origin + "/cgi-bin/mmwebwx-bin/webwxstatusnotify"; // 微信状态通知的URL

		config.API_webwxcheckurl = origin + "/cgi-bin/mmwebwx-bin/webwxcheckurl"; // 检查链接是否安全的URL

		config.API_webwxverifyuser = origin + "/cgi-bin/mmwebwx-bin/webwxverifyuser"; // 验证用户信息的URL

		config.API_webwxfeedback = origin + "/cgi-bin/mmwebwx-bin/webwxsendfeedback"; // 发送反馈信息的URL

		config.API_webwxreport = origin + "/cgi-bin/mmwebwx-bin/webwxstatreport"; // 上报统计数据的URL

		config.API_webwxsearch = origin + "/cgi-bin/mmwebwx-bin/webwxsearchcontact"; // 搜索联系人的URL

		config.API_webwxoplog = origin + "/cgi-bin/mmwebwx-bin/webwxoplog"; // 操作日志的URL

		config.API_checkupload = origin + "/cgi-bin/mmwebwx-bin/webwxcheckupload"; // 检查上传媒体文件的URL

		config.API_webwxrevokemsg = origin + "/cgi-bin/mmwebwx-bin/webwxrevokemsg"; // 撤回消息的URL

		return Object.assign(config, baseConfig); // 将 defaultConfig 对象的属性合并到 config 对象中，并返回合并后的结果
	}
}
