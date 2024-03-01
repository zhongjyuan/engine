package wechatbot

// ================================================= [类型](全局)公开 =================================================

const (
	initPath            = "/cgi-bin/mmwebwx-bin/webwxinit"            // Web微信初始化接口
	statusNotifyPath    = "/cgi-bin/mmwebwx-bin/webwxstatusnotify"    // Web微信状态通知接口
	syncPath            = "/cgi-bin/mmwebwx-bin/webwxsync"            // Web微信同步接口
	sendMsgPath         = "/cgi-bin/mmwebwx-bin/webwxsendmsg"         // Web微信发送消息接口
	getContactPath      = "/cgi-bin/mmwebwx-bin/webwxgetcontact"      // Web微信获取联系人接口
	sendImgMsgPath      = "/cgi-bin/mmwebwx-bin/webwxsendmsgimg"      // Web微信发送图片消息接口
	sendAppMsgPath      = "/cgi-bin/mmwebwx-bin/webwxsendappmsg"      // Web微信发送应用消息接口
	sendVideoMsgPath    = "/cgi-bin/mmwebwx-bin/webwxsendvideomsg"    // Web微信发送视频消息接口
	batchGetContactPath = "/cgi-bin/mmwebwx-bin/webwxbatchgetcontact" // Web微信批量获取联系人接口
	oplogPath           = "/cgi-bin/mmwebwx-bin/webwxoplog"           // Web微信操作日志接口
	verifyUserPath      = "/cgi-bin/mmwebwx-bin/webwxverifyuser"      // Web微信验证联系人接口
	uploadMediaPath     = "/cgi-bin/mmwebwx-bin/webwxuploadmedia"     // Web微信上传媒体文件接口
	getImgMsgPath       = "/cgi-bin/mmwebwx-bin/webwxgetmsgimg"       // Web微信获取消息图片接口
	getVoiceMsgPath     = "/cgi-bin/mmwebwx-bin/webwxgetvoice"        // Web微信获取语音消息接口
	getVideoMsgPath     = "/cgi-bin/mmwebwx-bin/webwxgetvideo"        // Web微信获取视频消息接口
	logoutPath          = "/cgi-bin/mmwebwx-bin/webwxlogout"          // Web微信退出登录接口
	getMediaPath        = "/cgi-bin/mmwebwx-bin/webwxgetmedia"        // Web微信获取媒体文件接口
	updateChatRoomPath  = "/cgi-bin/mmwebwx-bin/webwxupdatechatroom"  // Web微信更新群聊接口
	revokeMsgPath       = "/cgi-bin/mmwebwx-bin/webwxrevokemsg"       // Web微信撤回消息接口
	checkUploadPath     = "/cgi-bin/mmwebwx-bin/webwxcheckupload"     // Web微信检查上传接口
	pushLoginUrlPath    = "/cgi-bin/mmwebwx-bin/webwxpushloginurl"    // Web微信推送登录URL接口
	getIconPath         = "/cgi-bin/mmwebwx-bin/webwxgeticon"         // Web微信获取联系人头像接口
	createChatRoomPath  = "/cgi-bin/mmwebwx-bin/webwxcreatechatroom"  // Web微信创建群聊接口
	syncCheckPath       = "/cgi-bin/mmwebwx-bin/synccheck"            // Web微信同步检查接口
	loginPath           = "/cgi-bin/mmwebwx-bin/login"                // Web微信登录接口URL
	qrcodePath          = "/qrcode/"                                  // Web微信登录二维码URL
	jsLoginPath         = "/jslogin"                                  // Web微信登录页面URL
	newLoginPagePath    = "/cgi-bin/mmwebwx-bin/webwxnewloginpage"    // Web微信新登录页面URL
)

// 全局服务器域名的类型。
type Domain string

// ================================================= [函数](Domain)公开 =================================================

// BaseHost 返回全局服务器的基础主机名。
// 入参:
//   - d: 全局服务器域名
//
// 出参:
//   - string: 全局服务器的基础主机名
func (d Domain) BaseHost() string {
	return "https://" + string(d)
}

// LoginHost 返回登录服务器的主机名。
// 入参:
//   - d: 全局服务器域名
//
// 出参:
//   - string: 登录服务器的主机名
func (d Domain) LoginHost() string {
	return "https://login." + string(d)
}

// FileHost 返回文件服务器的主机名。
// 入参:
//   - d: 全局服务器域名
//
// 出参:
//   - string: 文件服务器的主机名
func (d Domain) FileHost() string {
	return "https://file." + string(d)
}

// SyncHost 返回同步服务器的主机名。
// 入参:
//   - d: 全局服务器域名
//
// 出参:
//   - string: 同步服务器的主机名
func (d Domain) SyncHost() string {
	return "https://webpush." + string(d)
}
