/**网页翻译 */

/** 定义最大要翻译的字符数 */
const maxCharsToTranslate = 15000;

/**
 * 获取页面中的文本节点
 * @param {Document} document 文档对象
 * @param {Window} window 窗口对象
 * @returns {Array} 文本节点数组
 */
function getTextNodes(document, window) {
	/**文档中所有子节点 */
	var maybeNodes = [].slice.call(document.body.childNodes);

	/**文本节点的列表 */
	var textNodes = [];

	/**忽略的元素选择器 */
	var ignore =
		'link, style, script, noscript, .hidden, [class*="-hidden"], .visually-hidden, .visuallyhidden, [role=presentation], [hidden], [style*="display:none"], [style*="display: none"], .ad, .dialog, .modal, select, svg, details:not([open])';

	// 添加 pre 和 code 元素选择器，以防止代码段被误识别为文本内容
	ignore += ", pre, code";

	// 遍历节点列表
	while (maybeNodes.length) {
		/**文档节点 */
		var node = maybeNodes.shift();

		// 如果节点应该被忽略，则跳过该节点和其子节点
		if (node.matches && node.matches(ignore)) {
			continue;
		}

		// 如果节点是文本节点，则将其加入文本节点数组
		if (node.nodeType === 3) {
			textNodes.push(node);
			continue;
		}

		// 如果节点不可见，则跳过该节点
		if (!isVisible(node)) {
			continue;
		}

		// 否则，将节点的文本节点添加到文本节点数组中，并将其他子节点添加到待检查的节点数组中

		/**当前文档节点的子节点列表 */
		var childNodes = node.childNodes;

		/**当前文档节点的子节点长度 */
		var childNodeLength = childNodes.length;

		// 循环当前文档节点的子节点并添加到待检查的节点数组中
		for (var i = childNodeLength - 1; i >= 0; i--) {
			maybeNodes.unshift(childNodes[i]);
		}
	}

	return textNodes;
}

/**
 * 翻译页面文本
 * @param {string} destLang 目标语言
 */
async function translate(destLang) {
	/**页面中的所有文本节点 */
	var textNodes = getTextNodes(document, window);

	/**页面标题元素 */
	var titleElement = document.querySelector("title");
	// 将标题文本节点添加到节点列表的开头
	if (titleElement && titleElement.childNodes && titleElement.childNodes[0]) {
		textNodes.unshift(titleElement.childNodes[0]);
	}

	// 尝试提取同源 iframe（如阅读模式的框架）中的文本
	/**同源 iframe 数组 */
	var frames = document.querySelectorAll("iframe");
	for (var x = 0; x < frames.length; x++) {
		try {
			// 获取 iframe 内部的文本节点并添加到节点列表中
			textNodes = textNodes.concat(getTextNodes(frames[x].contentDocument, frames[x].contentWindow));
		} catch (e) {}
	}

	// 将过滤后的文本节点存储在集合中，每个节点包含原始文本、是否已翻译和原始文本长度等信息
	/**过滤后的文本节点集合 */
	var textNodeSet = textNodes
		.filter((n) => n.textContent.replace(/[\s0-9]+/g, "").length > 2)
		.map((n) => ({
			/**节点元素 */
			node: n,
			/**是否已翻译 */
			translated: false,
			/**文本内容长度 */
			originalLength: n.textContent.length,
		}));

	/**
	 * 处理一批文本节点的翻译
	 */
	function handleChunk() {
		// 重新评分节点

		/**当前选择文本的父节点 */
		var selectionParent;
		try {
			selectionParent = window.getSelection().getRangeAt(0).commonAncestorContainer;
		} catch (e) {}

		// 对文本节点集合进行评分和排序

		/**排序后节点数组 */
		var sortedNodes = textNodeSet
			.map((item) => {
				// 为节点进行评分，考虑节点是否在选择范围内和是否在可见区域内
				item.score = 0;

				// 在选择范围内得分+2
				if (selectionParent && selectionParent.contains(item.node)) {
					item.score += 2;
				}

				try {
					// 在可见区域内得分+1
					var rect = item.node.parentNode.getBoundingClientRect();
					if (rect.bottom > 0 && rect.top < window.innerHeight) {
						item.score += 1;
					}
				} catch (e) {}

				return item;
			})
			.sort((a, b) => b.score - a.score); // 根据得分降序排序

		// 从未翻译集合中选择最多 500 个字符进行翻译

		/**待翻译的节点数组 */
		var selectedNodes = [];
		/**已选中的字符数 */
		var selectedCharsCount = 0;

		// 遍历排序后的节点数组
		sortedNodes.forEach(function (item) {
			// 如果未超过500个字符且当前节点未被翻译过
			if (selectedCharsCount < 500 && !item.translated) {
				// 将当前节点加入待翻译的节点数组
				selectedNodes.push(item.node);

				// 更新已选中的字符数
				selectedCharsCount += item.node.textContent.length;
			}
		});

		/**请求ID */
		var requestId = Math.random();
		/**待翻译文本数组 */
		var translationTexts = selectedNodes.map((node) => node.textContent);

		// 发送翻译请求到后台进程
		ipcRenderer.send("translation-request", {
			translationTexts,
			lang: destLang,
			requestId,
		});

		// 监听翻译结果的响应
		ipcRenderer.once("translation-response-" + requestId, function (e, data) {
			// 遍历翻译结果数组，并更新对应文本节点的文本内容
			data.response.translatedText.forEach(function (text, i) {
				/**文本节点索引 */
				var nodeIndex = textNodeSet.findIndex((item) => item.node === selectedNodes[i]);

				// 对翻译结果进行处理，包括添加空格和首字母大写等操作
				if (translationTexts[i].startsWith(" ")) {
					text = " " + text;
				}

				if (translationTexts[i].endsWith(" ")) {
					text += " ";
				}

				/*
				 * 当 Libretranslate 模型遇到未知词汇（或语言自动检测错误）时，
				 * 它有时会产生非常长且没有意义的输出。尝试检测并跳过该翻译。
				 */
				if (translationTexts[i].length > 2 && text.length / translationTexts[i].length > 20) {
					console.warn("skipping possibly invalid translation: ", translationTexts[i], " -> ", text);
					return; // 跳过可能无效的翻译
				}

				/*
				 * 英语模型经常以小写形式输出翻译。
				 * 为了解决这个问题，如果原始文本的首字母是大写，则将翻译结果的首字母大写。
				 */
				if (destLang === "en") {
					var originalFirstChar = translationTexts[i][0];
					if (originalFirstChar && originalFirstChar.toUpperCase() === originalFirstChar) {
						text = text[0].toUpperCase() + text.substring(1);
					}
				}

				// 更新节点的文本内容为翻译结果，并标记已翻译状态
				textNodeSet[nodeIndex].node.textContent = text;
				textNodeSet[nodeIndex].translated = true;
			});

			// 输出已翻译字符总数，用于调试和监控翻译进度
			console.log(
				"translated ",
				textNodeSet
					.filter((item) => item.translated)
					.map((item) => item.originalLength)
					.reduce((a, b) => a + b),
				"chars"
			);

			// 如果未翻译字符数量仍未达到限制且存在未翻译节点，则继续处理下一批文本节点
			if (
				textNodeSet
					.filter((item) => item.translated)
					.map((item) => item.originalLength)
					.reduce((a, b) => a + b) < maxCharsToTranslate &&
				textNodeSet.some((item) => !item.translated)
			) {
				// 继续处理下一批文本节点
				handleChunk();
			}
		});
	}

	handleChunk();
}

// 监听来自主进程的翻译请求
ipcRenderer.on("translate-page", function (e, lang) {
	translate(lang);
});
