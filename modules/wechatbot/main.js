"use strict";
require("@babel/register")({
	presets: ["@babel/preset-env"],
	plugins: ["@babel/plugin-transform-runtime"],
});

const _debug = require("debug");
const debug = _debug("bot");

const qrcode = require("qrcode-terminal");
const WeChatBot = require("./core/bot").default;

let bot;
try {
	bot = new WeChatBot(require("./sync-data.json"));
} catch (e) {
	bot = new WeChatBot();
}

bot.on("error", (err) => {
    debug(err);
});

bot.on("uuid", (uuid) => {
    qrcode.generate(`https://login.weixin.qq.com/l/${uuid}`, { small: true });
    console.log("二维码链接：", "https://login.weixin.qq.com/qrcode/" + uuid);
});

bot.on("user-avatar", (avatar) => {
    console.log("当前用户头像：", avatar);
});

bot.on("contact", (contacts) => {
    console.log(contacts);
    console.log("联系人数量：", Object.keys(bot._contacts).length);
});

bot.on("message", (message) => {
    console.log(`----------${message.getDisplayTime()}----------`);
    console.log(bot._contacts[message.FromUserName].getDisplayName());
    switch (message.MsgType) {
        case bot._config.MSGTYPE_TEXT: // 文本消息
            console.log(message.Content);
            break;
        case bot._config.MSGTYPE_IMAGE: // 图片消息
            console.log("图片消息，保存到本地");
            bot.getMessageImg(message.MsgId).then((res) => {
                bot.saveFile("image", `${message.MsgId}.jpg`, res.data);
            });
            break;
        case bot._config.MSGTYPE_VOICE: // 语音消息
            console.log("语音消息，保存到本地");
            bot.getVoice(message.MsgId).then((res) => {
                bot.saveFile("voice", `${message.MsgId}.mp3`, res.data);
            });
            break;
        case bot._config.MSGTYPE_EMOTICON: // 表情消息
            console.log("表情消息，保存到本地");
            bot.getMsgImg(message.MsgId).then((res) => {
                bot.saveFile("emoticon", `${message.MsgId}.gif`, res.data);
            });
            break;
        case bot._config.MSGTYPE_VIDEO:
        case bot._config.MSGTYPE_MICROVIDEO: // 视频消息
            console.log("视频消息，保存到本地");
            bot.getVideo(message.MsgId).then((res) => {
                bot.saveFile("video", `${message.MsgId}.mp4`, res.data);
            });
            break;
        case bot._config.MSGTYPE_APP: // 文件消息
            if (message.AppMsgType == 6) {
                console.log("文件消息，保存到本地");
                bot.getDoc(message.FromUserName, message.MediaId, message.FileName).then((res) => {
                    bot.saveFile("file", `${message.FileName}`, res.data);
                    console.log(res.type);
                });
            }
            break;
        default:
            break;
    }
});

bot.on("login", () => {
    console.log("登录成功");
    bot.saveFile("storage", "storage.json", JSON.stringify(bot.Data)); // 保存数据，将数据序列化之后保存到任意位置
});

bot.on("logout", () => {
    console.log("登出成功");
    bot.delFile("storage", "storage.json");
});

bot.on("synccheck_selector", (selector) => {
    console.log(`synccheck_selector: ${selector}`);
});

/**登录事件 */
bot.on("login", () => {
	// 演示发送消息给文件传输助手

	/**文件传输助手 */
	let ToUserName = "filehelper";

	/**发送文本消息 */
	bot.sendMessage("发送文本消息，可以包含emoji(😒)和QQ表情([坏笑])", ToUserName);

	/**通过表情MD5发送表情 */
	bot.sendMessage({ emoticonMd5: "00c801cdf69127550d93ca52c3f853ff" }, ToUserName);

	/**通过上传文件发送图片，视频，附件等(file为多种类型，filename必填，主要为了判断文件类型) */
	// bot.sendMessage({ file: Stream || Buffer || ArrayBuffer || File || Blob, filename: "bot-qrcode.jpg" }, ToUserName);

	/**发送图片 */
	// bot.sendMessage({ file: request("https://github.com/zhongjyuan/wechatgpt/master/qrcode.jpg"), filename: "bot-qrcode.jpg" }, ToUserName);

	/**发送表情 */
	// bot.sendMessage({ file: fs.createReadStream("./media/test.gif"), filename: "test.gif" }, ToUserName);

	/**发送视频 */
	// bot.sendMessage({ file: fs.createReadStream("./media/test.mp4"), filename: "test.mp4" }, ToUserName);

	/**发送文件 */
	// bot.sendMessage({ file: fs.createReadStream("./media/test.txt"), filename: "test.txt" }, ToUserName);

	/**撤回消息 */
	bot.sendMessage("测试撤回", ToUserName).then((res) => {
		return bot.revokeMessage(res.MsgID, ToUserName); // 需要取得待撤回消息的MsgID
	});
});

/**获取消息发送联系人头像 */
bot.on("message", (message) => {
	bot.getHeadImg(bot._contacts[message.FromUserName].HeadImgUrl).then((res) => {
		bot.saveFile("head", `${message.FromUserName}.jpg`, res.data);
	});
});

/**红包消息 */
bot.on("message", (message) => {
	if (message.MsgType == bot._config.MSGTYPE_SYS && /红包/.test(message.Content)) {
		// 若系统消息中带有‘红包’，则认为是红包消息
	}
});

/**转账消息 */
bot.on("message", (message) => {
	if (message.MsgType == bot._config.MSGTYPE_APP && message.AppMsgType == bot._config.APPMSGTYPE_TRANSFERS) {
		// 转账
	}
});

/**撤回消息 */
bot.on("message", (message) => {
	if (message.MsgType == bot._config.MSGTYPE_RECALLED) {
		// message.Content是一个xml，关键信息是MsgId
		let MsgId = message.Content.match(/<msgid>(.*?)<\/msgid>.*?<replacemsg><!\[CDATA\[(.*?)\]\]><\/replacemsg>/)[0];
		// 得到MsgId后，根据MsgId，从收到过的消息中查找被撤回的消息
	}
});

/**好友请求消息 */
bot.on("message", (message) => {
	if (message.MsgType == bot._config.MSGTYPE_VERIFYMSG) {
		bot.verifyUser(message.RecommendInfo.UserName, message.RecommendInfo.Ticket).then((res) => {
			console.log(`通过了 ${bot._contact.getDisplayName(message.RecommendInfo)} 好友请求`);
		});
	}
});

/**消息转发 */
bot.on("message", (message) => {
	bot.forwardMessage(message, "filehelper"); // 不是所有消息都可以直接转发
});

/**机器人启动 */
if (bot._prop.uin) {
	bot.restart(); // 存在登录数据时，可以随时调用restart进行重启
} else {
	bot.start();
}
