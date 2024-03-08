package common

// Any options with "Secret", "Token", "Key" in its key won't be return by GetOptions

var WeChatToken = ""
var WeChatAppID = ""
var WeChatAppSecret = ""
var WeChatEncodingAESKey = ""
var WeChatOwnerID = ""
var WeChatMenu = `{
  "button": [
    {
      "type": "click",
      "name": "登录验证",
      "key": "USER_VERIFICATION"
    }
  ]
}`
