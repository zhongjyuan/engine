/**获取当前页面的文本内容，并将其发送给后台进行处理 */
/**发送书签数据 */

/**
 * 检查元素是否可见
 * @param {HTMLElement} el - 元素节点
 * @returns {boolean} - 元素是否可见
 */
function isVisible(el) {
	// 检查元素的宽度、高度以及是否存在客户端矩形
	return el.offsetWidth || el.offsetHeight || (el.getClientRects && el.getClientRects().length);
}

/**
 * 提取页面文本内容
 * @param {Document} document - 文档对象
 * @param {Window} window - 窗口对象
 * @returns {string} - 页面文本内容
 */
function extractPageText(document, window) {
	// 可能包含文本的节点列表
	var maybeNodes = [].slice.call(document.body.childNodes);

	// 存储文本节点的列表
	var textNodes = [];

	// 忽略的元素选择器
	var ignore =
		'link, style, script, noscript, .hidden, .visually-hidden, .visuallyhidden, [role=presentation], [hidden], [style*="display:none"], [style*="display: none"], .ad, .dialog, .modal, select, svg, details:not([open]), header, nav, footer';

	// 遍历节点列表
	while (maybeNodes.length) {
		var node = maybeNodes.shift();

		// 如果该节点需要被忽略，则跳过该节点及其子节点
		if (node.matches && node.matches(ignore)) {
			continue;
		}

		// 如果该节点是文本节点，则添加到文本节点列表中
		if (node.nodeType === 3) {
			textNodes.push(node);
			continue;
		}

		// 如果该节点不可见，则跳过该节点
		if (!isVisible(node)) {
			continue;
		}

		// 否则，将该节点的文本节点添加到文本节点列表中，将其他子节点添加到待检查节点列表中
		var childNodes = node.childNodes;
		var childNodeLength = childNodes.length;

		for (var i = childNodeLength - 1; i >= 0; i--) {
			maybeNodes.unshift(childNodes[i]);
		}
	}

	// 合并所有文本节点的文本内容为一个字符串
	var text = "";
	var textNodeLength = textNodes.length;
	for (var i = 0; i < textNodeLength; i++) {
		text += textNodes[i].textContent + " ";
	}

	// 提取特殊的 meta 标签内容
	var metaElement = document.head.querySelector("meta[name=description]");
	if (metaElement) {
		text += " " + metaElement.content;
	}

	// 清洗文本内容，删除无用的换行符和制表符，合并多个空格为一个
	text = text.trim();

	// 删除无用的换行符和制表符
	text = text.replace(/[\n\t]/g, " ");

	// 合并多个空格为一个
	text = text.replace(/\s{2,}/g, " ");

	return text;
}

/**
 * 获取页面数据并发送给后台处理
 * @param {Function} callback - 回调函数，用于处理返回的页面数据
 */
function getPageData(callback) {
	// 使用 requestAnimationFrame 在下一次绘制前执行函数
	requestAnimationFrame(function () {
		// 调用 extractPageText 函数提取页面文本内容
		var text = extractPageText(document, window);

		// 尝试获取同源 iframe 的文本内容（例如阅读模式框架）
		var frames = document.querySelectorAll("iframe");

		// 提取 iframe 中的文本内容，并添加到主文本内容中
		for (var x = 0; x < frames.length; x++) {
			try {
				text += ". " + extractPageText(frames[x].contentDocument, frames[x].contentWindow);
			} catch (e) {}
		}

		// 限制获取的文本内容长度，最多为 300000 个字符
		text = text.substring(0, 300000);

		// 将提取的文本内容作为参数传递给回调函数
		callback({
			extractedText: text,
		});
	});
}

// 当主窗口加载完成后发送页面数据
// 主进程逻辑
if (process.isMainFrame) {
	// 监听 window 的 load 事件，确保页面已经完全加载完成
	window.addEventListener("load", function (e) {
		// 延迟 500 毫秒执行 getPageData 函数，确保页面已经渲染完毕
		setTimeout(function () {
			getPageData(function (data) {
				// 将提取的页面文本数据通过 ipcRenderer 发送给后台处理
				ipcRenderer.send("pageData", data);
			});
		}, 500);
	});

	// 在 Electron 中监听浏览器历史记录变化
	setTimeout(function () {
		// 使用 webFrame.executeJavaScript 注入代码，拦截浏览器历史记录的 pushState 和 replaceState 方法
		webFrame.executeJavaScript(`
			history.pushState = ( f => function pushState(){
				var ret = f.apply(this, arguments);
				window.postMessage('_minInternalLocationChange', '*')
				return ret;
			})(history.pushState);
			
			history.replaceState = ( f => function replaceState(){
				var ret = f.apply(this, arguments);
				window.postMessage('_minInternalLocationReplacement', '*')
				return ret;
			})(history.replaceState);
		`);
	}, 0);

	// 监听内部位置变化事件，当浏览器历史记录发生变化时触发
	window.addEventListener("message", function (e) {
		if (e.data === "_minInternalLocationChange") {
			// 延迟 500 毫秒执行 getPageData 函数，确保页面已经渲染完毕
			setTimeout(function () {
				getPageData(function (data) {
					// 将提取的页面文本数据通过 ipcRenderer 发送给后台处理
					ipcRenderer.send("pageData", data);
				});
			}, 500);
		}
	});
}
