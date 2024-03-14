// 声明socket变量，用于处理Socket通信
let socket;
// 输入框元素
let inputElement;
// 对话框元素
let dialogElement;
// 文件输入框元素
let fileInputElement;

// 用户名
let username = "";
// 标识用户是否已注册
let registered = false;
// 房间ID，从当前窗口路径中获取
let roomID = window.location.pathname;

/**
 * 根据文件名获取文件类型
 * @param {string} fileName - 文件名
 * @returns {string} - 返回文件类型，可能为 "IMAGE", "AUDIO", "VIDEO" 或 "FILE"
 */
function filename2type(fileName) {
	// 获取文件名的扩展名并转换为小写
	let extension = fileName.split(".").pop().toLowerCase();

	// 图像格式数组
	let imageFormats = ["png", "jpg", "bmp", "gif", "ico", "jpeg", "apng", "svg", "tiff", "webp"];
	// 音频格式数组
	let audioFormats = ["mp3", "wav", "ogg"];
	// 视频格式数组
	let videoFormats = ["mp4", "webm"];

	// 判断文件类型并返回对应的类型
	if (imageFormats.includes(extension)) {
		return "IMAGE";
	} else if (audioFormats.includes(extension)) {
		return "AUDIO";
	} else if (videoFormats.includes(extension)) {
		return "VIDEO";
	}

	// 默认情况，返回"FILE"
	return "FILE";
}

/**
 * 将字符转换为颜色的函数
 * @param {string} c - 输入的字符
 * @returns {string} - 返回对应的颜色值
 */
function char2color(c) {
	// 获取字符的ASCII码值
	let num = c.charCodeAt(0);
	// 根据ASCII码值计算RGB分量
	let r = Math.floor(num % 255);
	let g = Math.floor((num / 255) % 255);
	let b = Math.floor((r + g) % 255);
	// 对g值进行调整，避免颜色过暗
	if (g < 20) g += 20;
	// 将RGB分量转换为十六进制表示的颜色值
	return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
}

/**
 * 上传文件函数，将文件发送到服务器
 */
function uploadFile() {
	// 获取用户选择的文件
	let file = fileInputElement.files[0];

	// 创建一个新的FormData对象，并将文件添加到其中
	let formData = new FormData();
	formData.append("file", file);

	// 使用fetch API将文件上传到服务器
	fetch("/upload", {
		method: "POST",
		body: formData,
	})
		.then((res) => {
			// 解析响应为JSON格式
			return res.json();
		})
		.then((data) => {
			// 获取上传文件在服务器上的路径
			let filePath = data.path;
			// 发送消息，携带文件路径和文件类型
			sendMessage(filePath, filename2type(file.name));
		});
}

function clearInputBox() {
	inputElement.value = "";
}

function clearMessage() {
	dialogElement.innerHTML = "";
}

/**
 * 注册函数，向服务器发送注册请求
 */
function register() {
	// 如果用户名不为空
	if (username !== "") {
		// 通过socket向服务器发送注册请求，携带用户名和房间ID
		socket.emit("register", username, roomID);
	}
}

/**
 * 更改用户名函数，提示用户输入新的用户名
 */
function changeUsername() {
	// 在对话框中显示提示消息，要求用户输入新的用户名
	printMessage("Please input your new username.");
	// 将注册状态标记为false，表示用户需要重新注册
	registered = false;
}

/**
 * 处理用户输入函数，根据不同的输入做出相应的处理
 * @param {string} input - 用户输入
 */
function processInput(input) {
	// 去除输入中的前后空格
	input = input.trim();

	// 根据不同的输入进行不同的处理
	switch (input) {
		case "":
			// 空输入，不做任何操作
			break;
		case "help":
			// 输入为"help"，显示帮助信息
			printMessage("help: print help information.", "System");
			printMessage("version: print version information.", "System");
			printMessage("copyright: print copyright information.", "System");
			printMessage("repository: print repository information.", "System");
			printMessage("license: print license information.", "System");
			break;
		case "version":
			// 打印版本信息
			printMessage("z-chat-room v1.0.0", "System");
		case "copyright":
			// 打印版权信息
			printMessage(`Copyright © 2023-2043  <a href="http://tab.zhongjyuan.club">君烛科技</a>`, "System");
			printMessage("All Rights Reserved.", "System");
			break;
		case "repository":
			// 打印代码仓库信息
			printMessage(`See <a href="https://gitee.com/zhongjyuan/z-chat-room">z-chat-room</a>`, "System");
			break;
		case "license":
			// 打印许可证信息
			printMessage(`See <a href="https://gitee.com/zhongjyuan/z-chat-room/blob/master/LICENSE">LICENSE</a>`, "System");
			break;
		case "clear":
			// 输入为"clear"，清除聊天记录
			clearMessage();
			break;
		default:
			// 其他情况，将输入发送给服务器
			sendMessage(input);
			break;
	}

	// 清空输入框内容
	clearInputBox();
}

/**
 * 打印消息到聊天界面的函数
 * @param {string} content - 消息内容
 * @param {string} sender - 发送者名称，默认为"system"
 * @param {string} type - 消息类型，包括"TEXT", "IMAGE", "AUDIO", "VIDEO", "FILE"，默认为"TEXT"
 */
function printMessage(content, sender = "system", type = "TEXT") {
	let html;
	let firstChar = sender[0];
	// 根据消息类型生成不同类型的消息HTML
	switch (type) {
		case "IMAGE":
			// 图片消息
			html = `
                <div class="chat-message shown">
                    <div class="avatar" style="background-color:${char2color(firstChar)}">${firstChar.toUpperCase()}</div>
                    <div class="nickname">${sender}</div>
                    <div class="message-box"><img src="${content}" alt="${content}"></div>
                </div>`;
			break;
		case "AUDIO":
			// 音频消息
			html = `
            <div class="chat-message shown">
                <div class="avatar" style="background-color:${char2color(firstChar)}">${firstChar.toUpperCase()}</div>
                <div class="nickname">${sender}</div>
                <div class="message-box"><audio controls src="${content}"></div>
            </div>`;
			break;
		case "VIDEO":
			// 视频消息
			html = `
            <div class="chat-message shown">
                <div class="avatar" style="background-color:${char2color(firstChar)}">${firstChar.toUpperCase()}</div>
                <div class="nickname">${sender}</div>
                <div class="message-box"><video controls><source src="${content}"></video></div>
            </div>`;
			break;
		case "FILE":
			// 文件消息
			let parts = content.split("/");
			let text = parts[parts.length - 1];
			html = `
            <div class="chat-message shown">
                <div class="avatar" style="background-color:${char2color(firstChar)}">${firstChar.toUpperCase()}</div>
                <div class="nickname">${sender}</div>
                <div class="message-box"><a href="${content}" download="${text}">${text}</a></div>
            </div>`;
			break;
		case "TEXT":
		default:
			// 文本消息
			html = `
            <div class="chat-message shown">
                <div class="avatar" style="background-color:${char2color(firstChar)}">${firstChar.toUpperCase()}</div>
                <div class="nickname">${sender}</div>
                <div class="message-box"><p>${content}</p></div>
            </div>`;
			break;
	}
	// 将消息HTML插入到聊天窗口，并滚动到底部
	dialogElement.insertAdjacentHTML("beforeend", html);
	dialogElement.scrollTop = dialogElement.scrollHeight;
}

function sendMessage(content, type = "TEXT") {
	socket.emit("message", { content, type }, roomID);
}

/**
 * 初始化 WebSocket 连接和设置事件监听器
 */
function initSocket() {
	// 创建一个 WebSocket 对象并初始化
	socket = io();

	// 监听 "message" 事件，接收到消息时执行回调函数
	socket.on("message", function (message) {
		// 调用 printMessage 函数打印消息到聊天界面
		printMessage(message.content, message.sender, message.type);
	});

	// 监听 "register success" 事件，注册成功时执行回调函数
	socket.on("register success", function () {
		// 设置 registered 变量为 true
		registered = true;
		// 将用户名存储在本地存储中
		localStorage.setItem("username", username);
		// 清空输入框内容
		clearInputBox();
	});

	// 监听 "conflict username" 事件，用户名冲突时执行回调函数
	socket.on("conflict username", function () {
		// 设置 registered 变量为 false
		registered = false;
		// 清空本地存储中的用户名
		localStorage.setItem("username", "");
		// 在聊天界面打印用户名已被占用的提示信息
		printMessage("The username is already been taken, please input a new username.");
	});
}

/**
 * 发送消息的函数
 */
function send() {
	// 获取输入框中的内容
	let content = inputElement.value;

	// 如果已经注册成功
	if (registered) {
		// 处理用户输入
		processInput(content);
	} else {
		// 如果还未注册成功，则将输入内容作为用户名
		username = content;
		// 进行注册
		register();
	}
}

/**
 * 页面加载完成后的初始化操作
 */
window.onload = function () {
	// 初始化 WebSocket 连接
	initSocket();

	// 获取对话框、输入框和文件输入框的 DOM 元素
	inputElement = document.getElementById("input");
	dialogElement = document.getElementById("dialog");
	fileInputElement = document.getElementById("fileInput");

	// 监听输入框的键盘事件，当按下 Enter 键时触发发送消息操作
	inputElement.addEventListener("keydown", function (e) {
		if (e.key === "Enter") {
			e.preventDefault();
			send();
		}
	});

	// 从本地存储中获取用户名
	username = localStorage.getItem("username");

	// 如果用户名存在
	if (username) {
		// 执行注册操作
		register();
	} else {
		// 如果用户名不存在，则在聊天界面打印提示信息，要求用户输入用户名
		printMessage("Please input your username.");
	}
};
