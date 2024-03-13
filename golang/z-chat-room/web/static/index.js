/**定义版本号变量 */
let version = "v1.0.0";

/**初始化连接变量 */
let connection = undefined;
/**初始化输入框元素变量 */
let inputElement = undefined;
/**初始化提示元素变量 */
let promptElement = undefined;

/**初始化昵称变量 */
let nickname = "Guest";

function printBanner() {
	print("", `Type "help", "copyright", "repository" or "license" for more information.`);
}

// 添加事件监听器，等待页面加载完成后执行以下操作
window.addEventListener("load", () => {
	// 获取输入框元素和提示元素并赋值给相应变量
	inputElement = document.getElementById("input");
	promptElement = document.getElementById("prompt");

	// 打印横幅信息
	printBanner();

	// 根据协议类型初始化 WebSocket 连接
	let protocol = "ws://";
	if (location.protocol !== "http:") {
		protocol = "wss://";
	}

	// 创建 WebSocket 连接对象
	connection = new WebSocket(protocol + document.location.host + "/ws");

	// 检查连接是否成功创建，若失败则打印错误信息
	if (!connection) {
		print("", "system: failed to initialize connection.");
	}

	// 监听连接打开事件
	connection.onopen = function (e) {
		print("", "system: connected to server.");
	};

	// 监听连接关闭事件
	connection.onclose = function (e) {
		print("", "system: connection closed.");
	};

	// 监听连接错误事件
	connection.onerror = function (e) {
		console.error(e);
		print("", `system: error happened.`);
	};

	// 监听消息事件，根据用户昵称过滤消息并打印到界面
	connection.onmessage = function (e) {
		if (nickname === "" || !e.data.startsWith(nickname)) {
			print("", e.data, false);
		}
	};

	inputElement.focus();
	inputElement.addEventListener("keyup", function (event) {
		if (event.key === "Enter") {
			processInput(input.value);
		}
	});

	document.addEventListener("click", function (event) {
		inputElement.focus();
	});
});

/**
 * 处理用户输入的函数
 *
 * @param {string} input - 用户输入的内容
 * @returns {void}
 */
function processInput(input) {
	// 如果输入为空，则将其替换为一个空格
	if (input === "") input = " ";

	// 在界面上打印用户输入内容
	print(input, "");

	// 提取用户输入的命令
	let cmd = input.split(" ")[0];

	// 根据不同命令执行相应操作
	switch (cmd) {
		case "help":
			// 打印帮助信息
			print("", `help: print help information.`);
			print("", `version: print version information.`);
			print("", `copyright: print copyright information.`);
			print("", `repository: print repository information.`);
			print("", `license: print license information.`);
			print("", `nickname: set nickname.`);
			break;
		case "version":
			// 打印版本信息
			print("", `z-chat-room ${version}`);
			break;
		case "copyright":
			// 打印版权信息
			print("", `Copyright © 2023-2043  <a href="http://tab.zhongjyuan.club">君烛科技</a>`);
			print("", "All Rights Reserved.");
			break;
		case "repository":
			// 打印代码仓库信息
			print("", `See <a href="https://gitee.com/zhongjyuan/z-chat-room">z-chat-room</a>`);
			break;
		case "license":
			// 打印许可证信息
			print("", `See <a href="https://gitee.com/zhongjyuan/z-chat-room/blob/master/LICENSE">LICENSE</a>`);
			break;
		case "nickname":
			// 设置用户昵称
			nickname = input.slice(8).trim();
			print("", `system: nickname set to ${nickname}.`);
			break;
		default:
			// 发送用户输入内容
			send(input);
	}
}

/**
 * 发送消息函数，根据用户是否设置了昵称发送消息
 *
 * @param {string} message - 要发送的消息内容
 * @returns {void}
 */
function send(message) {
	// 如果用户设置了昵称，则发送带昵称的消息
	if (nickname !== "") {
		connection.send(`${nickname}: ${message}`);
	} else {
		// 否则发送不带昵称的消息
		connection.send(`${message}`);
	}
}

/**
 * 打印输入和输出内容的函数
 *
 * @param {string} input - 要打印的输入内容
 * @param {string} output - 要打印的输出内容
 * @param {boolean} [clearInput=true] - 是否清空输入框，默认为 true
 * @returns {void}
 */
function print(input, output, clearInput = true) {
	if (clearInput) {
		inputElement.value = "";
	}

	if (input !== "") {
		let inputElement = `<div class="line"><span class="prompt">&gt;&gt;&gt;</span><span>${input}</span></div>`;
		promptElement.insertAdjacentHTML("beforebegin", inputElement);
	}

	if (output !== "") {
		let outputElement = `<div class="line"><span>${output}</span></div>`;
		promptElement.insertAdjacentHTML("beforebegin", outputElement);
	}

	inputElement.focus();
	inputElement.scrollIntoView();
}
