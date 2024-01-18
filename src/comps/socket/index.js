import logger from "@common/logManagement";

import { comp_socket_client as htmlTemplate } from "./html";

/**
 * Socket - Client - 组件 - ZHONGJYUAN
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2024年1月18日11:53:09
 */
export default (() => {
	/**
	 * 返回当前时间的格式化字符串
	 * @returns {string} 格式化后的时间字符串
	 */
	function _currentTime() {
		return new Date().format("yyyy年MM月dd日 hh时mm分ss秒S毫秒 ap");
	}

	/**
	 * 清除指定类型的气泡
	 * @param {number} type 指定要清除的气泡类型，0 表示 serverEvent_container，1 表示 clentEvent_container
	 */
	function _cleanBubble(type) {
		// 获取运行时设置中的 socket 配置
		var { comp_socket: setting } = window.zhongjyuan.runtime.setting;

		// 根据类型选择要清除的气泡容器
		var container = type === 0 ? setting.serverEvent_container : setting.clentEvent_container;

		// 清空容器内容
		container.innerHTML = "";
	}

	/**
	 * 移除指定类型和内容的气泡圆
	 * @param {number} type 指定要移除的气泡类型，0 表示 serverEvent_container，1 表示 clentEvent_container
	 * @param {string} content 要移除的气泡圆的内容
	 */
	function _removeBubble(type, content) {
		// 获取运行时设置中的 socket 配置
		var { comp_socket: setting } = window.zhongjyuan.runtime.setting;

		// 根据类型选择要移除气泡的容器
		var container = type === 0 ? setting.serverEvent_container : setting.clentEvent_container;

		// 查找要移除的气泡圆
		var bubble = container.querySelector(`#${content}`);

		// 移除气泡圆
		container.removeChild(bubble);
	}

	/**
	 * 创建气泡圆
	 * @param {number} type 指定要创建的气泡类型，0 表示 serverEvent_container，1 表示 clentEvent_container
	 * @param {string} content 气泡圆的内容
	 */
	function _createBubble(type, content) {
		// 获取运行时设置中的 socket 配置
		var { comp_socket: setting } = window.zhongjyuan.runtime.setting;

		// 根据类型选择要创建气泡的容器
		var container = type === 0 ? setting.serverEvent_container : setting.clentEvent_container;

		// 获取已存在的气泡圆
		var bubbles = container.getElementsByClassName("bubble");

		// 创建气泡圆元素
		var bubble = document.createElement("div");
		bubble.id = content;
		bubble.className = "bubble";

		var collision = true; // 碰撞标志位
		var maxAttempts = 20; // 最大尝试次数
		var attempts = 0; // 当前尝试次数

		// 在不发生碰撞的情况下随机设置气泡圆的位置
		while (collision && attempts < maxAttempts) {
			bubble.style.top = Math.random() * (container.offsetHeight - 100) + "px";
			bubble.style.left = Math.random() * (container.offsetWidth - 100) + "px";

			collision = _checkCollision(bubble, bubbles); // 检查碰撞
			attempts++;
		}

		if (attempts >= maxAttempts) {
			console.log("无法找到合适的位置");
			return;
		}

		// 创建气泡圆内部的文本元素
		var bubbleText = document.createElement("div");
		bubbleText.className = "bubble-text";
		bubbleText.innerText = content;

		// 创建关闭按钮元素
		var closeButton = document.createElement("div");
		closeButton.className = "close-button";
		closeButton.innerText = "X";
		closeButton.addEventListener("click", function () {
			if (type === 0) {
				_removeServerEvent(content);
			} else {
				_unSubscribeClientEvent(content);
			}
		});

		// 将文本元素和关闭按钮元素添加到气泡圆中
		bubble.appendChild(bubbleText);
		bubble.appendChild(closeButton);

		// 将气泡圆添加到容器中
		container.appendChild(bubble);

		// 设置延迟后显示气泡圆
		setTimeout(function () {
			bubble.style.opacity = 1;
		}, 10);

		// 鼠标悬停事件，放大气泡圆
		bubble.addEventListener("mouseover", function (event) {
			_scaleUpBubble(event.target);
		});

		// 鼠标移出事件，恢复气泡圆大小
		bubble.addEventListener("mouseout", function (event) {
			_resetBubbleSize(event.target);
		});

		// 点击事件，根据类型设置输入框的值
		bubble.addEventListener("click", function () {
			if (type === 0) {
				setting.serverEventInput.value = content;
			} else {
				setting.clientEventInput.value = content;
			}
		});
	}

	/**
	 * 检查气泡圆是否发生位置碰撞
	 * @param {HTMLElement} element 要检查的气泡圆元素
	 * @param {HTMLCollection} bubbles 已存在的气泡圆元素集合
	 * @returns {boolean} 是否发生碰撞，true 表示发生碰撞，false 表示没有碰撞
	 */
	function _checkCollision(element, bubbles) {
		for (var i = 0; i < bubbles.length; i++) {
			var bubble = bubbles[i];

			var left1 = parseInt(element.style.left);
			var top1 = parseInt(element.style.top);
			var diameter1 = element.offsetWidth;

			var left2 = parseInt(bubble.style.left);
			var top2 = parseInt(bubble.style.top);
			var diameter2 = bubble.offsetWidth;

			var distance = Math.sqrt(Math.pow(left2 - left1, 2) + Math.pow(top2 - top1, 2));
			var minDistance = (diameter1 + diameter2) / 2 + 10;

			if (distance < minDistance) {
				return true; // 碰撞发生
			}
		}

		return false; // 没有碰撞
	}

	/**
	 * 放大气泡圆
	 * @param {HTMLElement} bubble 要放大的气泡圆元素
	 */
	function _scaleUpBubble(bubble) {
		bubble.style.transform = "scale(1.2)";
	}

	/**
	 * 恢复气泡圆原始大小
	 * @param {HTMLElement} bubble 要恢复大小的气泡圆元素
	 */
	function _resetBubbleSize(bubble) {
		bubble.style.transform = "";
	}

	/**
	 * 在客户端输出消息
	 * @param {string} message 要输出的消息内容
	 */
	function _clientOutput(message) {
		var { comp_socket: setting } = window.zhongjyuan.runtime.setting;

		var receive_console = setting.componentElement.querySelector("#receive");
		var firstChild = receive_console.firstElementChild;
		if (firstChild) {
			firstChild.insertAdjacentHTML("afterend", message);
		} else {
			receive_console.insertAdjacentHTML("beforeend", message);
		}
	}

	/**
	 * 客户端输出消息清除
	 */
	function _clientOutputClear() {
		var { comp_socket: setting } = window.zhongjyuan.runtime.setting;
		var receive_console = setting.componentElement.querySelector("#receive");
		receive_console.innerHTML = "";
	}

	/**
	 * 在服务端输出消息
	 * @param {string} message 要输出的消息内容
	 */
	function _serverOutput(message) {
		var { comp_socket: setting } = window.zhongjyuan.runtime.setting;

		var issue_console = setting.componentElement.querySelector("#issue");
		var firstChild = issue_console.firstElementChild;
		if (firstChild) {
			firstChild.insertAdjacentHTML("afterend", message);
		} else {
			issue_console.insertAdjacentHTML("beforeend", message);
		}
	}

	/**
	 * 服务端输出消息清除
	 */
	function _serverOutputClear() {
		var { comp_socket: setting } = window.zhongjyuan.runtime.setting;
		var issue_console = setting.componentElement.querySelector("#issue");
		issue_console.innerHTML = "";
	}

	/**
	 * 默认订阅
	 */
	function _defaultSubscribes() {
		_subscribeClientEvent("response");
	}

	/**
	 * 连接 Socket
	 * @param {string} url Socket 服务器的 URL 地址，可以是 IP 或域名，默认值为 http://127.0.0.1:7077
	 * @param {string} path Socket 服务器的路径，默认值为空字符串
	 * @param {string} clientId 客户端 ID，默认值为 940870777
	 */
	function _connect(url, path, clientId) {
		var { comp_socket: setting } = window.zhongjyuan.runtime.setting;

		// 如果 url 为空，则使用默认值 http://127.0.0.1:7077
		if (url == "" || url == null || url == undefined) {
			url = "http://127.0.0.1:7077";
		}

		// 如果 clientId 为空，则使用默认值 940870777
		if (clientId == "" || clientId == null || clientId == undefined) {
			clientId = 940870777;
		}

		// 根据参数设置 options 对象
		var options = {
			query: "key=" + clientId,
		};
		if (path != "" && path != null && path != undefined) {
			options.path = path;
		}

		// 连接 Socket
		setting.socket = window.io.connect(url, options);

		// 监听 connect 事件
		setting.socket.on("connect", function () {
			setting.isConnected = setting.socket.connected;
			_serverOutput(`<span class="info">${_currentTime()}: 连接成功</span>`);
			setting.errorCount = 0;
			_defaultSubscribes();
		});

		// 监听 disconnect 事件
		setting.socket.on("disconnect", function (reason) {
			setting.isConnected = setting.socket.connected;
			_cleanServerEvent()
			_cleanClientEvent()
			_clientOutputClear();
			_serverOutputClear();
			_serverOutput(`<span class="debug">${_currentTime()}: 断开连接</span>`);
		});

		// 监听 error 事件
		setting.socket.on("error", function (data) {
			_serverOutput(`<span class="error">${_currentTime()}: 系统错误 - ${data}</span>`);
			setting.errorCount++;
			if (setting.errorCount >= setting.maxError) {
				setting.socket.disconnect();
			}
		});

		// 监听 connect_error 事件
		setting.socket.on("connect_error", function (data) {
			_serverOutput(`<span class="error">${_currentTime()}: 连接错误 - ${data}</span>`);
			setting.errorCount++;
			if (setting.errorCount >= setting.maxError) {
				setting.socket.disconnect();
			}
		});

		// 监听 connect_timeout 事件
		setting.socket.on("connect_timeout", function (data) {
			_serverOutput(`<span class="warn">${_currentTime()}: 连接超时 - ${data}</span>`);
			setting.errorCount++;
			if (setting.errorCount >= setting.maxError) {
				setting.socket.disconnect();
			}
		});
	}

	/**
	 * 清除服务事件
	 */
	function _cleanServerEvent() {
		var { comp_socket: setting } = window.zhongjyuan.runtime.setting;

		// 清除服务事件气泡
		_cleanBubble(0);

		// 清空服务事件数组
		setting.serverEvents = [];

		setting.componentElement.querySelector("#serverEvent_container").innerHTML = "";
	}

	/**
	 * 创建服务事件
	 * @param {string} serverEvent 服务事件内容
	 */
	function _createServerEvent(serverEvent) {
		var { comp_socket: setting } = window.zhongjyuan.runtime.setting;

		// 如果服务事件数组中不包含该事件，则创建气泡并添加到数组中
		if (!setting.serverEvents.includes(serverEvent)) {
			_createBubble(0, serverEvent);
			setting.serverEvents.push(serverEvent);
		}
	}

	/**
	 * 移除服务事件
	 * @param {string} serverEvent 服务事件内容
	 */
	function _removeServerEvent(serverEvent) {
		var { comp_socket: setting } = window.zhongjyuan.runtime.setting;

		// 如果服务事件数组中包含该事件，则移除气泡并从数组中删除该事件
		if (setting.serverEvents.includes(serverEvent)) {
			_removeBubble(0, serverEvent);

			setting.serverEvents = setting.serverEvents.filter(function (event) {
				return event !== serverEvent;
			});
		}
	}

	/**
	 * 清除客户事件
	 */
	function _cleanClientEvent() {
		var { comp_socket: setting } = window.zhongjyuan.runtime.setting;

		// 清除客户事件气泡
		_cleanBubble(1);

		// 清空客户事件数组
		setting.clientEvents = [];
		
		setting.componentElement.querySelector("#clentEvent_container").innerHTML = "";
	}

	/**
	 * 创建客户事件
	 * @param {string} clientEvent 客户事件内容
	 */
	function _createClientEvent(clientEvent) {
		var { comp_socket: setting } = window.zhongjyuan.runtime.setting;

		// 如果客户事件数组中不包含该事件，则创建气泡并添加到数组中
		if (!setting.clientEvents.includes(clientEvent)) {
			_createBubble(1, clientEvent);

			setting.clientEvents.push(clientEvent);
		}
	}

	/**
	 * 移除客户事件
	 * @param {string} clientEvent 客户事件内容
	 */
	function _removeClientEvent(clientEvent) {
		var { comp_socket: setting } = window.zhongjyuan.runtime.setting;

		// 如果客户事件数组中包含该事件，则移除气泡并从数组中删除该事件
		if (setting.clientEvents.includes(clientEvent)) {
			_removeBubble(1, clientEvent);

			setting.clientEvents = setting.clientEvents.filter(function (event) {
				return event !== clientEvent;
			});
		}
	}

	/**
	 * 订阅事件
	 * @param {string} clientEvent 客户事件内容
	 */
	function _subscribeClientEvent(clientEvent) {
		var { comp_socket: setting } = window.zhongjyuan.runtime.setting;

		// 如果已连接并且客户事件数组中不包含该事件，则创建客户事件、添加订阅和输出订阅成功信息
		if (setting.isConnected && !setting.clientEvents.includes(clientEvent)) {
			_createClientEvent(clientEvent);

			setting.socket.on(clientEvent, function (data) {
				_clientOutput(`<span class="trace">${_currentTime()}: ${clientEvent}消息 - ${data}</span>`);
			});

			_clientOutput(`<span class="warn">${_currentTime()}: ${clientEvent}订阅成功!</span>`);
		}
	}

	/**
	 * 取消订阅事件
	 * @param {string} clientEvent 客户事件内容
	 */
	function _unSubscribeClientEvent(clientEvent) {
		var { comp_socket: setting } = window.zhongjyuan.runtime.setting;

		// 如果已连接并且客户事件数组中包含该事件，则取消订阅、移除事件和输出解约成功信息
		if (setting.isConnected && setting.clientEvents.includes(clientEvent)) {
			setting.socket.off(clientEvent);

			_removeClientEvent(clientEvent);

			_clientOutput(`<span class="warn">${_currentTime()}: ${clientEvent}解约成功!</span>`);
		}
	}

	/**
	 * 隐藏组件
	 */
	function hide() {
		var { comp_socket: setting } = window.zhongjyuan.runtime.setting;

		// 如果设置对象中存在组件元素，则移除该元素
		if (setting.componentElement) {
			setting.componentElement.remove();
		}
	}

	/**
	 * 显示组件
	 */
	function show() {
		hide(); // 隐藏组件

		// 动态导入组件的 CSS 样式文件和 socket.io 库
		import(/* webpackChunkName: "comp_socket_client" */ "./index.css");
		import(/* webpackChunkName: "socket.io" */ "@extends/socket/socket.io.4.7.2.min.js").then((module) => {
			window.io = module.default; // 将 io 绑定到全局变量中
		});

		var { custom, comp_socket: setting } = window.zhongjyuan.runtime.setting; // 从全局设置对象中获取自定义和组件相关的设置变量

		// 创建组件元素并设置属性和内容
		var componentElement = document.createElement("div");
		componentElement.setAttribute("id", setting.domId);
		componentElement.setAttribute("class", setting.domId);
		componentElement.innerHTML = htmlTemplate;

		var parentElement = document.getElementById(custom.rootElement) || document.body;
		parentElement.appendChild(componentElement); // 将组件添加到指定的父元素中

		setting.componentElement = componentElement; // 将组件元素保存到设置对象中

		// 初始化设置对象的其他属性
		setting.socket;
		setting.maxError = 5;
		setting.errorCount = 0;
		setting.isConnected = false;
		setting.clientEvents = [];
		setting.serverEvents = [];

		setting.clentEvent_container = componentElement.querySelector("#clentEvent_container");
		setting.serverEvent_container = componentElement.querySelector("#serverEvent_container");

		setting.socketUrlInput = componentElement.querySelector("#input_socketUrl");
		setting.socketPathInput = componentElement.querySelector("#input_socketPath");
		setting.clientIdInput = componentElement.querySelector("#input_clientId");
		setting.serverEventInput = componentElement.querySelector("#input_serverEvent");
		setting.contentInput = componentElement.querySelector("#input_content");
		setting.clientEventInput = componentElement.querySelector("#input_clentEvent");

		setting.connectButton = componentElement.querySelector("#button_connect");
		setting.disconnectButton = componentElement.querySelector("#button_disconnect");
		setting.sendButton = componentElement.querySelector("#button_send");
		setting.subscribeButton = componentElement.querySelector("#button_subscribe");
		setting.dissubscribeButton = componentElement.querySelector("#button_dissubscribe");

		// 连接 Socket
		setting.connectButton.addEventListener("click", function (event) {
			if (!setting.isConnected) _connect(setting.socketUrlInput.value, setting.socketPathInput.value, setting.clientIdInput.value);
		});

		// 断开连接
		setting.disconnectButton.addEventListener("click", function (event) {
			if (setting.isConnected) setting.socket.disconnect();
		});

		// 发送消息
		setting.sendButton.addEventListener("click", function (event) {
			if (setting.isConnected) {
				var content = setting.contentInput.value;
				var serverEvent = setting.serverEventInput.value;

				_createServerEvent(serverEvent);

				setting.socket.emit(serverEvent, content);

				_serverOutput(`<span class="trace">${_currentTime()}: ${serverEvent}消息 - ${content}</span>`);
			} else {
				_serverOutput(`<span class="warn">${_currentTime()}: 发送失败 - 未连接!</span>`);
			}
		});

		// 订阅
		setting.subscribeButton.addEventListener("click", function (event) {
			if (setting.isConnected) {
				var clientEvent = setting.clientEventInput.value;
				_subscribeClientEvent(clientEvent);
			} else {
				_serverOutput(`<span class="warn">${_currentTime()}: ${clientEvent}订阅失败 - 未连接!</span>`);
			}
		});

		// 取消订阅
		setting.dissubscribeButton.addEventListener("click", function (event) {
			if (setting.isConnected) {
				var clientEvent = setting.clientEventInput.value;
				_unSubscribeClientEvent(clientEvent);
			} else {
				_serverOutput(`<span class="warn">${_currentTime()}: ${clientEvent}解约失败 - 未连接!</span>`);
			}
		});
	}

	return {
		show: logger.decorator(show, "socket-client-show"),
		hide: logger.decorator(hide, "socket-client-hide"),
	};
})();
