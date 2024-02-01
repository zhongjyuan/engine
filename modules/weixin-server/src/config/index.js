import baseConfig from "./base";

/**
 * 获取配置信息
 * @param {string} host - 主机地址
 * @returns {object} - 配置信息对象
 */
export function getConfig(host) {
	host = host || "wx.qq.com"; // 如果 host 未定义，则默认设置为 "wx.qq.com"

	let baseHost = `https://${host}`; // 构建 baseHost 变量，以 https:// 开头，后跟 host 变量的值
	let loginHost = "login.weixin.qq.com"; // 设置默认的登录 URL
	let fileHost = "file.wx.qq.com"; // 设置默认的文件 URL
	let pushHost = "webpush.weixin.qq.com"; // 设置默认的推送 URL

	if (host.indexOf("wx2.qq.com") > -1) {
		loginHost = "login.wx2.qq.com";
		fileHost = "file.wx2.qq.com";
		pushHost = "webpush.wx2.qq.com";
	} else if (host.indexOf("wx8.qq.com") > -1) {
		loginHost = "login.wx8.qq.com";
		fileHost = "file.wx8.qq.com";
		pushHost = "webpush.wx8.qq.com";
	} else if (host.indexOf("web2.wechat.com") > -1) {
		loginHost = "login.web2.wechat.com";
		fileHost = "file.web2.wechat.com";
		pushHost = "webpush.web2.wechat.com";
	} else if (host.indexOf("qq.com") > -1) {
		loginHost = "login.wx.qq.com";
		fileHost = "file.wx.qq.com";
		pushHost = "webpush.wx.qq.com";
	} else if (host.indexOf("wechat.com") > -1) {
		loginHost = "login.web.wechat.com";
		fileHost = "file.web.wechat.com";
		pushHost = "webpush.web.wechat.com";
	}

	var lang = "zh_CN";
	var isClientVersion = true;
	var appId = "wx782c26e4c19acffb";

	var jslogin = "/jslogin",
		webwxnewloginpage = "/cgi-bin/mmwebwx-bin/webwxnewloginpage",
		login = "/cgi-bin/mmwebwx-bin/login",
		synccheck = "/cgi-bin/mmwebwx-bin/synccheck",
		webwxgetmedia = "/cgi-bin/mmwebwx-bin/webwxgetmedia",
		webwxuploadmedia = "/cgi-bin/mmwebwx-bin/webwxuploadmedia",
		webwxpreview = "/cgi-bin/mmwebwx-bin/webwxpreview",
		webwxinit = "/cgi-bin/mmwebwx-bin/webwxinit",
		webwxgetcontact = "/cgi-bin/mmwebwx-bin/webwxgetcontact",
		webwxsync = "/cgi-bin/mmwebwx-bin/webwxsync",
		webwxbatchgetcontact = "/cgi-bin/mmwebwx-bin/webwxbatchgetcontact",
		webwxgeticon = "/cgi-bin/mmwebwx-bin/webwxgeticon",
		webwxsendmsg = "/cgi-bin/mmwebwx-bin/webwxsendmsg",
		webwxsendmsgimg = "/cgi-bin/mmwebwx-bin/webwxsendmsgimg",
		webwxsendvideomsg = "/cgi-bin/mmwebwx-bin/webwxsendvideomsg",
		webwxsendemoticon = "/cgi-bin/mmwebwx-bin/webwxsendemoticon",
		webwxsendappmsg = "/cgi-bin/mmwebwx-bin/webwxsendappmsg",
		webwxgetheadimg = "/cgi-bin/mmwebwx-bin/webwxgetheadimg",
		webwxgetmsgimg = "/cgi-bin/mmwebwx-bin/webwxgetmsgimg",
		webwxgetmedia = "/cgi-bin/mmwebwx-bin/webwxgetmedia",
		webwxgetvideo = "/cgi-bin/mmwebwx-bin/webwxgetvideo",
		webwxlogout = "/cgi-bin/mmwebwx-bin/webwxlogout",
		webwxgetvoice = "/cgi-bin/mmwebwx-bin/webwxgetvoice",
		webwxupdatechatroom = "/cgi-bin/mmwebwx-bin/webwxupdatechatroom",
		webwxcreatechatroom = "/cgi-bin/mmwebwx-bin/webwxcreatechatroom",
		webwxstatusnotify = "/cgi-bin/mmwebwx-bin/webwxstatusnotify",
		webwxcheckurl = "/cgi-bin/mmwebwx-bin/webwxcheckurl",
		webwxverifyuser = "/cgi-bin/mmwebwx-bin/webwxverifyuser",
		webwxsendfeedback = "/cgi-bin/mmwebwx-bin/webwxsendfeedback",
		webwxstatreport = "/cgi-bin/mmwebwx-bin/webwxstatreport",
		webwxsearchcontact = "/cgi-bin/mmwebwx-bin/webwxsearchcontact",
		webwxoplog = "/cgi-bin/mmwebwx-bin/webwxoplog",
		webwxcheckupload = "/cgi-bin/mmwebwx-bin/webwxcheckupload",
		webwxrevokemsg = "/cgi-bin/mmwebwx-bin/webwxrevokemsg",
		webwxpushloginurl = "/cgi-bin/mmwebwx-bin/webwxpushloginurl",
		redirectUri = encodeURIComponent(`https://${host}${webwxnewloginpage}${isClientVersion ? "?mod=desktop" : ""}`);

	let config = {
		UOSClientVersion: "2.0.0",
		UOSExtspam:
			"Go8FCIkFEokFCggwMDAwMDAwMRAGGvAESySibk50w5Wb3uTl2c2h64jVVrV7gNs06GFlWplHQbY/5FfiO++1yH4ykC" +
			"yNPWKXmco+wfQzK5R98D3so7rJ5LmGFvBLjGceleySrc3SOf2Pc1gVehzJgODeS0lDL3/I/0S2SSE98YgKleq6Uqx6ndTy9yaL9qFxJL7eiA/R" +
			"3SEfTaW1SBoSITIu+EEkXff+Pv8NHOk7N57rcGk1w0ZzRrQDkXTOXFN2iHYIzAAZPIOY45Lsh+A4slpgnDiaOvRtlQYCt97nmPLuTipOJ8Qc5p" +
			"M7ZsOsAPPrCQL7nK0I7aPrFDF0q4ziUUKettzW8MrAaiVfmbD1/VkmLNVqqZVvBCtRblXb5FHmtS8FxnqCzYP4WFvz3T0TcrOqwLX1M/DQvcHa" +
			"GGw0B0y4bZMs7lVScGBFxMj3vbFi2SRKbKhaitxHfYHAOAa0X7/MSS0RNAjdwoyGHeOepXOKY+h3iHeqCvgOH6LOifdHf/1aaZNwSkGotYnYSc" +
			"W8Yx63LnSwba7+hESrtPa/huRmB9KWvMCKbDThL/nne14hnL277EDCSocPu3rOSYjuB9gKSOdVmWsj9Dxb/iZIe+S6AiG29Esm+/eUacSba0k8" +
			"wn5HhHg9d4tIcixrxveflc8vi2/wNQGVFNsGO6tB5WF0xf/plngOvQ1/ivGV/C1Qpdhzznh0ExAVJ6dwzNg7qIEBaw+BzTJTUuRcPk92Sn6QDn" +
			"2Pu3mpONaEumacjW4w6ipPnPw+g2TfywJjeEcpSZaP4Q3YV5HG8D6UjWA4GSkBKculWpdCMadx0usMomsSS/74QgpYqcPkmamB4nVv1JxczYIT" +
			"IqItIKjD35IGKAUwAA==", // UOS Patch 扩展垃圾邮件
	}; // 创建一个空对象，用于存储配置信息

	config.baseHost = baseHost; // 将 baseHost 的值赋给 config 对象的 baseHost 属性
	config.baseUri = `${baseHost}/cgi-bin/mmwebwx-bin`; // 构建 baseUri，将 baseHost 和 "/cgi-bin/mmwebwx-bin" 拼接起来，赋给 config 对象的 baseUri 属性

	// 根据不同的 URL 构建 config 对象的各个属性
	config.API_jsLogin = `https://${loginHost}${jslogin}?appid=${appId}&redirect_uri=${redirectUri}&fun=new&lang=${lang}`; // 获取登录二维码的URL

	config.API_login = `https://${loginHost}${login}`; // 登录的URL

	config.API_synccheck = `https://${pushHost}${synccheck}`; // 同步检查的URL

	config.API_webwxdownloadmedia = `https://${fileHost}${webwxgetmedia}`; // 下载媒体文件的URL

	config.API_webwxuploadmedia = `https://${fileHost}${webwxuploadmedia}`; // 上传媒体文件的URL

	config.API_webwxpreview = `${baseHost}${webwxpreview}`; // 预览图片消息的URL

	config.API_webwxinit = `${baseHost}${webwxinit}`; // 初始化微信接口的URL

	config.API_webwxgetcontact = `${baseHost}${webwxgetcontact}`; // 获取联系人列表的URL

	config.API_webwxsync = `${baseHost}${webwxsync}`; // 同步微信消息的URL

	config.API_webwxbatchgetcontact = `${baseHost}${webwxbatchgetcontact}`; // 批量获取联系人信息的URL

	config.API_webwxgeticon = `${baseHost}${webwxgeticon}`; // 获取头像的URL

	config.API_webwxsendmsg = `${baseHost}${webwxsendmsg}`; // 发送文本消息的URL

	config.API_webwxsendmsgimg = `${baseHost}${webwxsendmsgimg}`; // 发送图片消息的URL

	config.API_webwxsendmsgvedio = `${baseHost}${webwxsendvideomsg}`; // 发送视频消息的URL

	config.API_webwxsendemoticon = `${baseHost}${webwxsendemoticon}`; // 发送表情消息的URL

	config.API_webwxsendappmsg = `${baseHost}${webwxsendappmsg}`; // 发送应用消息的URL

	config.API_webwxgetheadimg = `${baseHost}${webwxgetheadimg}`; // 获取群头像的URL

	config.API_webwxgetmsgimg = `${baseHost}${webwxgetmsgimg}`; // 获取消息图片的URL

	config.API_webwxgetmedia = `${baseHost}${webwxgetmedia}`; // 获取媒体文件的URL

	config.API_webwxgetvideo = `${baseHost}${webwxgetvideo}`; // 获取视频消息的URL

	config.API_webwxlogout = `${baseHost}${webwxlogout}`; // 退出登录的URL

	config.API_webwxgetvoice = `${baseHost}${webwxgetvoice}`; // 获取语音消息的URL

	config.API_webwxupdatechatroom = `${baseHost}${webwxupdatechatroom}`; // 更新群组信息的URL

	config.API_webwxcreatechatroom = `${baseHost}${webwxcreatechatroom}`; // 创建群聊的URL

	config.API_webwxstatusnotify = `${baseHost}${webwxstatusnotify}`; // 微信状态通知的URL

	config.API_webwxcheckurl = `${baseHost}${webwxcheckurl}`; // 检查链接是否安全的URL

	config.API_webwxverifyuser = `${baseHost}${webwxverifyuser}`; // 验证用户信息的URL

	config.API_webwxfeedback = `${baseHost}${webwxsendfeedback}`; // 发送反馈信息的URL

	config.API_webwxreport = `${baseHost}${webwxstatreport}`; // 上报统计数据的URL

	config.API_webwxsearch = `${baseHost}${webwxsearchcontact}`; // 搜索联系人的URL

	config.API_webwxoplog = `${baseHost}${webwxoplog}`; // 操作日志的URL

	config.API_checkupload = `${baseHost}${webwxcheckupload}`; // 检查上传媒体文件的URL

	config.API_webwxrevokemsg = `${baseHost}${webwxrevokemsg}`; // 撤回消息的URL

	config.API_webwxpushloginurl = `${baseHost}${webwxpushloginurl}`;

	return Object.assign(config, baseConfig); // 将 defaultConfig 对象的属性合并到 config 对象中，并返回合并后的结果
}
