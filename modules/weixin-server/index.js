"use strict";
require("@babel/register")({
	presets: ["@babel/preset-env"],
	plugins: ["@babel/plugin-transform-runtime"],
});

const qrcode = require("qrcode-terminal");

const Weixin = require("./src/weixin").default;

let bot;
try {
	bot = new Weixin(require("./sync-data.json"));
} catch (e) {
	bot = new Weixin();
}

/**
 * uuid事件，参数为uuid，根据uuid生成二维码
 */
bot.on("uuid", (uuid) => {
	qrcode.generate(`https://login.weixin.qq.com/l/${uuid}`, { small: true });
	console.log("二维码链接：", "https://login.weixin.qq.com/qrcode/" + uuid);
});

/**
 * 登录用户头像事件，手机扫描后可以得到登录用户头像的Data URL
 */
bot.on("user-avatar", (avatar) => {
	console.log("登录用户头像Data URL：", avatar);
});

/**
 * 登录成功事件
 */
bot.on("login", () => {
	console.log("登录成功");
	bot.saveFile("storage", "storage.json", JSON.stringify(bot.Data)); // 保存数据，将数据序列化之后保存到任意位置
});

/**
 * 登出成功事件
 */
bot.on("logout", () => {
	console.log("登出成功");
	bot.delFile("storage", "storage.json");
});

/**
 * 联系人更新事件，参数为被更新的联系人列表
 */
bot.on("contacts-updated", (contacts) => {
	console.log(contacts);
	console.log("联系人数量：", Object.keys(bot._contacts).length);
});

/**
 * 错误事件，参数一般为Error对象
 */
bot.on("error", (err) => {
	console.error("错误：", err.tips);
});

/**
 * 如何发送消息
 */
bot.on("login", () => {
	/**
	 * 演示发送消息到文件传输助手
	 * 通常回复消息时可以用 message.FromUserName
	 */
	let ToUserName = "filehelper";

	/**
	 * 发送文本消息，可以包含emoji(😒)和QQ表情([坏笑])
	 */
	bot.sendMessage("发送文本消息，可以包含emoji(😒)和QQ表情([坏笑])", ToUserName).catch((err) => {
		bot.emit("error", err);
	});

	/**
	 * 通过表情MD5发送表情
	 */
	bot.sendMessage({ emoticonMd5: "00c801cdf69127550d93ca52c3f853ff" }, ToUserName).catch((err) => {
		bot.emit("error", err);
	});

	/**
	 * 以下通过上传文件发送图片，视频，附件等
	 * 通用方法为入下
	 * file为多种类型
	 * filename必填，主要为了判断文件类型
	 */
	// bot.sendMessage({ file: Stream || Buffer || ArrayBuffer || File || Blob, filename: "bot-qrcode.jpg" }, ToUserName).catch((err) => {
	// 	bot.emit("error", err);
	// });

	/**
	 * 发送图片
	 */
	// bot
	// 	.sendMessage(
	// 		{ file: request("https://github.com/zhongjyuan/wechatgpt/master/qrcode.jpg"), filename: "bot-qrcode.jpg" },
	// 		ToUserName
	// 	)
	// 	.catch((err) => {
	// 		bot.emit("error", err);
	// 	});

	/**
	 * 发送表情
	 */
	// bot.sendMessage({ file: fs.createReadStream("./media/test.gif"), filename: "test.gif" }, ToUserName).catch((err) => {
	// 	bot.emit("error", err);
	// });

	/**
	 * 发送视频
	 */
	// bot.sendMessage({ file: fs.createReadStream("./media/test.mp4"), filename: "test.mp4" }, ToUserName).catch((err) => {
	// 	bot.emit("error", err);
	// });

	/**
	 * 发送文件
	 */
	// bot.sendMessage({ file: fs.createReadStream("./media/test.txt"), filename: "test.txt" }, ToUserName).catch((err) => {
	// 	bot.emit("error", err);
	// });

	/**
	 * 发送撤回消息请求
	 */
	bot
		.sendMessage("测试撤回", ToUserName)
		.then((res) => {
			// 需要取得待撤回消息的MsgID
			return bot.revokeMessage(res.MsgID, ToUserName);
		})
		.catch((err) => {
			console.log(err);
		});
});

/**
 * 如何处理会话消息
 */
bot.on("message", (message) => {
	/**
	 * 获取消息时间
	 */
	console.log(`----------${message.getDisplayTime()}----------`);
	/**
	 * 获取消息发送者的显示名
	 */
	console.log(bot._contacts[message.FromUserName].getDisplayName());

	/**
	 * 判断消息类型
	 */
	switch (message.MsgType) {
		case bot._config.MSGTYPE_TEXT: // 文本消息
			console.log(message.Content);
			break;
		case bot._config.MSGTYPE_IMAGE: // 图片消息
			console.log("图片消息，保存到本地");
			bot
				.getMessageImg(message.MsgId)
				.then((res) => {
					bot.saveFile("image", `${message.MsgId}.jpg`, res.data);
				})
				.catch((err) => {
					bot.emit("error", err);
				});
			break;
		case bot._config.MSGTYPE_VOICE: // 语音消息
			console.log("语音消息，保存到本地");
			bot
				.getVoice(message.MsgId)
				.then((res) => {
					bot.saveFile("voice", `${message.MsgId}.mp3`, res.data);
				})
				.catch((err) => {
					bot.emit("error", err);
				});
			break;
		case bot._config.MSGTYPE_EMOTICON: // 表情消息
			console.log("表情消息，保存到本地");
			bot
				.getMsgImg(message.MsgId)
				.then((res) => {
					bot.saveFile("emoticon", `${message.MsgId}.gif`, res.data);
				})
				.catch((err) => {
					bot.emit("error", err);
				});
			break;
		case bot._config.MSGTYPE_VIDEO:
		case bot._config.MSGTYPE_MICROVIDEO: // 视频消息
			console.log("视频消息，保存到本地");
			bot
				.getVideo(message.MsgId)
				.then((res) => {
					bot.saveFile("video", `${message.MsgId}.mp4`, res.data);
				})
				.catch((err) => {
					bot.emit("error", err);
				});
			break;
		case bot._config.MSGTYPE_APP: // 文件消息
			if (message.AppMsgType == 6) {
				console.log("文件消息，保存到本地");
				bot
					.getDoc(message.FromUserName, message.MediaId, message.FileName)
					.then((res) => {
						bot.saveFile("file", `${message.FileName}`, res.data);
						console.log(res.type);
					})
					.catch((err) => {
						bot.emit("error", err);
					});
			}
			break;
		default:
			break;
	}
});

/**
 * 如何处理红包消息
 */
bot.on("message", (message) => {
	if (message.MsgType == bot._config.MSGTYPE_SYS && /红包/.test(message.Content)) {
		// 若系统消息中带有‘红包’，则认为是红包消息
		// wechat4u并不能自动收红包
	}
});

/**
 * 如何处理转账消息
 */
bot.on("message", (message) => {
	if (message.MsgType == bot._config.MSGTYPE_APP && message.AppMsgType == bot._config.APPMSGTYPE_TRANSFERS) {
		// 转账
	}
});

/**
 * 如何处理撤回消息
 */
bot.on("message", (message) => {
	if (message.MsgType == bot._config.MSGTYPE_RECALLED) {
		// message.Content是一个xml，关键信息是MsgId
		let MsgId = message.Content.match(/<msgid>(.*?)<\/msgid>.*?<replacemsg><!\[CDATA\[(.*?)\]\]><\/replacemsg>/)[0];
		// 得到MsgId后，根据MsgId，从收到过的消息中查找被撤回的消息
	}
});

/**
 * 如何处理好友请求消息
 */
bot.on("message", (message) => {
	if (message.MsgType == bot._config.MSGTYPE_VERIFYMSG) {
		bot
			.verifyUser(message.RecommendInfo.UserName, message.RecommendInfo.Ticket)
			.then((res) => {
				console.log(`通过了 ${bot._contact.getDisplayName(message.RecommendInfo)} 好友请求`);
			})
			.catch((err) => {
				bot.emit("error", err);
			});
	}
});

/**
 * 如何直接转发消息
 */
bot.on("message", (message) => {
	// 不是所有消息都可以直接转发
	bot.forwardMessage(message, "filehelper").catch((err) => {
		bot.emit("error", err);
	});
});

/**
 * 如何获取联系人头像
 */
bot.on("message", (message) => {
	bot
		.getHeadImg(bot._contacts[message.FromUserName].HeadImgUrl)
		.then((res) => {
			bot.saveFile("head", `${message.FromUserName}.jpg`, res.data);
		})
		.catch((err) => {
			bot.emit("error", err);
		});
});

/**
 * 启动机器人
 */
if (bot._prop.uin) {
	// 存在登录数据时，可以随时调用restart进行重启
	bot.restart();
} else {
	bot.start();
}
