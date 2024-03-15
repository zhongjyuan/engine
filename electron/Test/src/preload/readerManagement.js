/*
 * 检测页面是否适合作为阅读器，如果是，则向主进程发送消息
 */

/**
 * 判断页面是否适合作为阅读器
 * @returns {boolean} - 返回布尔值，表示页面是否适合作为阅读器
 */
function pageIsReaderable() {
	// 初始化总长度为 0
	var totalLength = 0;

	// 使用 Map 存储每个父元素的段落长度之和
	var paragraphMap = new Map();

	// 获取页面中所有段落元素
	var paragraphs = document.querySelectorAll("p");

	// 如果没有找到段落元素，返回 false
	if (!paragraphs) {
		return false;
	}

	// 计算段落长度并进行条件判断
	for (var i = 0; i < paragraphs.length; i++) {
		// 计算当前段落的长度，取值范围在-30到(文本长度-100)之间
		var pLength = Math.max(paragraphs[i].textContent.replace(/\s+/g, " ").length - 100, -30);
		totalLength += pLength;

		// 将当前段落长度累加到相应父元素上
		var prev = paragraphMap.get(paragraphs[i].parentNode) || 0;
		paragraphMap.set(paragraphs[i].parentNode, prev + pLength);
	}

	// 找到最长的段落长度
	var largestValue = 0;
	paragraphMap.forEach(function (value, key) {
		if (value > largestValue) {
			largestValue = value;
		}
	});

	// 根据条件判断页面是否适合作为阅读器
	if (
		// 条件1：最长段落长度大于 600 且最长段落长度占总长度的比例大于 0.33
		(largestValue > 600 && largestValue / totalLength > 0.33) ||
		// 条件2：最长段落长度大于 400 且页面包含 article 元素或者 meta 标签中指定为 article 类型
		(largestValue > 400 && document.querySelector('article, meta[property="og:type"][content="article"]'))
	) {
		return true;
	} else {
		return false;
	}
}

/**
 * 检查页面是否适合作为阅读器，并向主进程发送消息
 */
function checkReaderStatus() {
	// 调用 pageIsReaderable 函数判断页面是否适合作为阅读器
	if (pageIsReaderable()) {
		// 如果适合，则向主进程发送消息
		ipcRenderer.send("canReader");
	}
}

// 当主窗口加载完成后检查页面是否适合作为阅读器
// 主进程逻辑
if (process.isMainFrame) {
	// 在 DOMContentLoaded 之前使用 readystatechange，因为后者在 <script defer> 之前触发
	document.addEventListener("readystatechange", function () {
		// 当文档准备就绪状态为 "interactive" 时，调用 checkReaderStatus 函数检查页面是否适合作为阅读器
		if (document.readyState === "interactive") {
			checkReaderStatus();
		}
	});

	// 页面加载完成后检查页面是否适合作为阅读器
	window.addEventListener("load", checkReaderStatus);
}
