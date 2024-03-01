// Code generated by "stringer -type=MessageType,Ret,AppMessageType -linecomment=true -output=stringer.go"; DO NOT EDIT.

package wechatbot

import (
	"strconv"
)

func _() {
	// 创建一个长度为 1 的匿名结构体数组。
	var x [1]struct{}

	// 使用枚举类型中的常量值进行索引操作，以检查常量值是否发生了变化。
	_ = x[MessageText-1]            // 文本消息类型
	_ = x[MessageImage-3]           // 图片消息类型
	_ = x[MessageVoice-34]          // 语音消息类型
	_ = x[MessageVerify-37]         // 验证消息类型
	_ = x[MessagePossibleFriend-40] // 可能是好友消息类型
	_ = x[MessageShareCard-42]      // 名片消息类型
	_ = x[MessageVideo-43]          // 视频消息类型
	_ = x[MessageEmoticon-47]       // 表情消息类型
	_ = x[MessageLocation-48]       // 位置消息类型
	_ = x[MessageApp-49]            // 应用消息类型
	_ = x[MessageVoip-50]           // VoIP 消息类型
	_ = x[MessageVoipNotify-52]     // VoIP 通知消息类型
	_ = x[MessageVoipInvite-53]     // VoIP 邀请消息类型
	_ = x[MessageMicroVideo-62]     // 小视频消息类型
	_ = x[MessageSys-10000]         // 系统消息类型
	_ = x[MessageRecalled-10002]    // 被撤回消息类型
}

// _MessageType_name 包含了所有消息类型的字符串，每个字符串表示一个消息类型。
const _MessageType_name = "文本消息图片消息语音消息认证消息好友推荐消息名片消息视频消息表情消息地理位置消息APP消息VOIP消息VOIP结束消息VOIP邀请小视频消息系统消息消息撤回"

// _MessageType_map 是一个映射表，用于将常量值与对应的消息类型字符串进行映射。
var _MessageType_map = map[MessageType]string{
	1:     _MessageType_name[0:12],    // 将常量值 1 映射为索引 0 到 12 的子串，即"文本消息"
	3:     _MessageType_name[12:24],   // 将常量值 3 映射为索引 12 到 24 的子串，即"图片消息"
	34:    _MessageType_name[24:36],   // 将常量值 34 映射为索引 24 到 36 的子串，即"语音消息"
	37:    _MessageType_name[36:48],   // 将常量值 37 映射为索引 36 到 48 的子串，即"认证消息"
	40:    _MessageType_name[48:66],   // 将常量值 40 映射为索引 48 到 66 的子串，即"好友推荐消息"
	42:    _MessageType_name[66:78],   // 将常量值 42 映射为索引 66 到 78 的子串，即"名片消息"
	43:    _MessageType_name[78:90],   // 将常量值 43 映射为索引 78 到 90 的子串，即"视频消息"
	47:    _MessageType_name[90:102],  // 将常量值 47 映射为索引 90 到 102 的子串，即"表情消息"
	48:    _MessageType_name[102:120], // 将常量值 48 映射为索引 102 到 120 的子串，即"地理位置消息"
	49:    _MessageType_name[120:129], // 将常量值 49 映射为索引 120 到 129 的子串，即"APP消息"
	50:    _MessageType_name[129:139], // 将常量值 50 映射为索引 129 到 139 的子串，即"VOIP消息"
	52:    _MessageType_name[139:155], // 将常量值 52 映射为索引 139 到 155 的子串，即"VOIP结束消息"
	53:    _MessageType_name[155:165], // 将常量值 53 映射为索引 155 到 165 的子串，即"VOIP邀请消息"
	62:    _MessageType_name[165:180], // 将常量值 62 映射为索引 165 到 180 的子串，即"小视频消息"
	10000: _MessageType_name[180:192], // 将常量值 10000 映射为索引 180 到 192 的子串，即"系统消息"
	10002: _MessageType_name[192:204], // 将常量值 10002 映射为索引 192 到 204 的子串，即"消息撤回"
}

func (i MessageType) String() string {
	if str, ok := _MessageType_map[i]; ok {
		return str
	}
	return "MessageType(" + strconv.FormatInt(int64(i), 10) + ")"
}

func _() {
	// An "invalid array index" compiler error signifies that the constant values have changed.
	// Re-run the stringer command to generate them again.
	var x [1]struct{}
	_ = x[TicketError - -14]
	_ = x[LogicError - -2]
	_ = x[SysError - -1]
	_ = x[ParamError-1]
	_ = x[LoginFailedWarn-1100]
	_ = x[LoginCheckFailedWarn-1101]
	_ = x[CookieInvalidWarn-1102]
	_ = x[LoginEnvAbnormalityWarn-1203]
	_ = x[OptTooOftenWarn-1205]
}

const (
	_Ret_name_0 = "ticket error"
	_Ret_name_1 = "logic errorsys error"
	_Ret_name_2 = "param error"
	_Ret_name_3 = "failed login warnfailed login checkcookie invalid"
	_Ret_name_4 = "login environmental abnormality"
	_Ret_name_5 = "operate too often"
)

var (
	_Ret_index_1 = [...]uint8{0, 11, 20}
	_Ret_index_3 = [...]uint8{0, 17, 35, 49}
)

func (i Ret) String() string {
	switch {
	case i == -14:
		return _Ret_name_0
	case -2 <= i && i <= -1:
		i -= -2
		return _Ret_name_1[_Ret_index_1[i]:_Ret_index_1[i+1]]
	case i == 1:
		return _Ret_name_2
	case 1100 <= i && i <= 1102:
		i -= 1100
		return _Ret_name_3[_Ret_index_3[i]:_Ret_index_3[i+1]]
	case i == 1203:
		return _Ret_name_4
	case i == 1205:
		return _Ret_name_5
	default:
		return "Ret(" + strconv.FormatInt(int64(i), 10) + ")"
	}
}

func _() {
	// An "invalid array index" compiler error signifies that the constant values have changed.
	// Re-run the stringer command to generate them again.
	var x [1]struct{}
	_ = x[AppMessageText-1]
	_ = x[AppMessageImage-2]
	_ = x[AppMessageVoice-3]
	_ = x[AppMessageVideo-4]
	_ = x[AppMessageUrl-5]
	_ = x[AppMessageAttach-6]
	_ = x[AppMessageOpen-7]
	_ = x[AppMessageEmoji-8]
	_ = x[AppMessageVoiceRemind-9]
	_ = x[AppMessageScanGood-10]
	_ = x[AppMessageGood-13]
	_ = x[AppMessageEmotion-15]
	_ = x[AppMessageCardTicket-16]
	_ = x[AppMessageLocation-17]
	_ = x[AppMessageTransfers-2000]
	_ = x[AppMessageRedEnvelopes-2001]
	_ = x[AppMessageReaderType-100001]
}

const (
	_AppMessageType_name_0 = "文本消息图片消息语音消息视频消息文章消息附件消息Open表情消息VoiceRemindScanGood"
	_AppMessageType_name_1 = "Good"
	_AppMessageType_name_2 = "Emotion名片消息地理位置消息"
	_AppMessageType_name_3 = "转账消息红包消息"
	_AppMessageType_name_4 = "自定义的消息"
)

var (
	_AppMessageType_index_0 = [...]uint8{0, 12, 24, 36, 48, 60, 72, 76, 88, 99, 107}
	_AppMessageType_index_2 = [...]uint8{0, 7, 19, 37}
	_AppMessageType_index_3 = [...]uint8{0, 12, 24}
)

func (i AppMessageType) String() string {
	switch {
	case 1 <= i && i <= 10:
		i -= 1
		return _AppMessageType_name_0[_AppMessageType_index_0[i]:_AppMessageType_index_0[i+1]]
	case i == 13:
		return _AppMessageType_name_1
	case 15 <= i && i <= 17:
		i -= 15
		return _AppMessageType_name_2[_AppMessageType_index_2[i]:_AppMessageType_index_2[i+1]]
	case 2000 <= i && i <= 2001:
		i -= 2000
		return _AppMessageType_name_3[_AppMessageType_index_3[i]:_AppMessageType_index_3[i+1]]
	case i == 100001:
		return _AppMessageType_name_4
	default:
		return "AppMessageType(" + strconv.FormatInt(int64(i), 10) + ")"
	}
}
