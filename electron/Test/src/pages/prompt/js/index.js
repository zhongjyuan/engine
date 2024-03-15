const { ipcRenderer } = require("electron");

/**
 * 取消按钮点击事件处理函数
 */
function cancel() {
	// 发送关闭 prompt 的消息给主进程
	ipcRenderer.send("close-prompt", "");

	// 关闭当前窗口
	window.close();
}

/**
 * 确认按钮点击事件处理函数
 */
function response() {
	var values = {};

	const inputs = document.getElementsByTagName("input");
	for (var i = 0; i < inputs.length; i++) {
		const input = inputs[i];
		// 获取输入框的值并存储在 values 对象中
		values[input.id] = input.value;
	}

	// 发送带有输入值的消息给主进程
	ipcRenderer.send("close-prompt", values);

	// 关闭当前窗口
	window.close();
}

// 在 Mac 上调整按钮顺序
document.addEventListener("DOMContentLoaded", function () {
	if (navigator.platform === "MacIntel") {
		document.getElementById("cancel").parentNode.insertBefore(document.getElementById("cancel"), document.getElementById("ok"));
	}
});

// 在窗口加载完成后执行的函数
window.addEventListener("load", function () {
	// 同步发送打开 prompt 的消息给主进程，并获取返回值
	var options = ipcRenderer.sendSync("open-prompt", "");

	// 解析返回值为对象
	var params = JSON.parse(options);

	// 解构赋值获取参数
	const { okLabel = "OK", cancelLabel = "Cancel", darkMode = -1, values = [] } = params;

	// 根据参数在窗口中创建输入框
	if (values && values.length > 0) {
		const inputContainer = document.getElementById("input-container");

		values.forEach((value, index) => {
			var input = document.createElement("input");
			input.type = value.type;
			input.placeholder = value.placeholder;
			input.id = value.id;
			inputContainer.appendChild(input);

			// 设置第一个输入框获得焦点
			if (index === 0) {
				input.focus();
			}

			// 添加键盘事件监听器，处理回车和取消操作
			input.addEventListener("keydown", function (e) {
				// 按下 ESC 键
				if (e.keyCode === 27) {
					cancel();
				}

				if (e.keyCode === 13) {
					// 聚焦到下一个输入框
					if (index < values.length - 1) {
						document.getElementsByTagName("input")[index + 1].focus();
					} else {
						response();
					}
				}
			});
		});
	}

	// 根据 darkMode 参数设置页面主题
	if (darkMode === 1 || darkMode === true) {
		document.body.classList.add("dark-mode");
	}

	// 设置标签内容
	if (params.label) {
		document.getElementById("label").textContent = params.label;
	} else {
		document.getElementById("label").hidden = true;
	}

	// 设置按钮文本
	document.getElementById("ok").value = okLabel;
	document.getElementById("cancel").value = cancelLabel;

	// 绑定按钮点击事件
	document.getElementById("ok").addEventListener("click", response);
	document.getElementById("cancel").addEventListener("click", cancel);
});
