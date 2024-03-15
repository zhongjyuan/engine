/* Back button */

/**返回按钮元素 */
var backbutton = document.getElementById("backtoarticle-link");

// 从当前窗口的URL中获取查询参数中名为"url"的数值，作为文章的URL
/**文章URL */
var articleURL = new URLSearchParams(window.location.search).get("url");

// 使用获取到的文章URL创建一个新的URL对象
/**文章URL对象 */
var articleLocation = new URL(articleURL);

backbutton.addEventListener("click", function (e) {
	// 在这个页面上可能存在阅读模式的问题，因此不要在将来自动重定向到阅读模式
	readerDecision.setURLStatus(articleURL, false);

	/*
	 * setURLStatus最终会异步调用settingManagement.set，而在设置数据完成更新之前，可能会开始导航回原始URL，
	 * 从而使原始URL重定向回阅读模式。在加载原始URL之前添加一个小延迟可以避免这种情况。
	 */
	setTimeout(function () {
		window.location = articleURL;
	}, 50);
});

/* 自动重定向横幅 */

/** 自动重定向横幅元素 */
var autoRedirectBanner = document.getElementById("auto-redirect-banner");

/** 自动重定向横幅中的"Yes"选项元素 */
var autoRedirectYes = document.getElementById("auto-redirect-yes");

/** 自动重定向横幅中的"No"选项元素 */
var autoRedirectNo = document.getElementById("auto-redirect-no");

// 监听"readerData"事件，当读者数据更新时执行回调函数
settingManagement.listen("readerData", function () {
	// 如果对于当前文章URL的域名状态未定义
	if (readerDecision.getDomainStatus(articleURL) === undefined) {
		// 显示自动重定向横幅
		autoRedirectBanner.hidden = false;
	}
});

// 为"Yes"选项添加点击事件监听器
autoRedirectYes.addEventListener("click", function () {
	// 将当前文章URL的域名状态设置为true（允许自动重定向）
	readerDecision.setDomainStatus(articleURL, true);
	// 隐藏自动重定向横幅
	autoRedirectBanner.hidden = true;
	// 将自动阅读模式复选框勾选上
	autoReaderCheckbox.checked = true;
});

// 为"No"选项添加点击事件监听器
autoRedirectNo.addEventListener("click", function () {
	// 将当前文章URL的域名状态设置为false（禁止自动重定向）
	readerDecision.setDomainStatus(articleURL, false);
	// 显示自动重定向横幅
	autoRedirectBanner.hidden = false;
});

/* Settings */

/**设置按钮元素 */
var settingsButton = document.getElementById("settings-button");

/**设置下拉菜单元素 */
var settingsDropdown = document.getElementById("settings-dropdown");

// 为设置按钮添加点击事件监听器
settingsButton.addEventListener("click", function () {
	// 切换设置下拉菜单的隐藏状态
	settingsDropdown.hidden = !settingsDropdown.hidden;
});

// 监听窗口失焦事件
window.addEventListener("blur", function () {
	// 如果当前焦点在iframe（阅读器框架）上
	if (document.activeElement.tagName === "IFRAME") {
		// 点击了阅读器框架，隐藏设置下拉菜单
		settingsDropdown.hidden = true;
	}
});

// 监听点击事件
document.addEventListener("click", function (e) {
	// 如果点击的目标不在设置下拉菜单内且不是设置按钮本身
	if (!settingsDropdown.contains(e.target) && e.target !== settingsButton) {
		// 隐藏设置下拉菜单
		settingsDropdown.hidden = true;
	}
});

/**自动阅读模式复选框元素 */
var autoReaderCheckbox = document.getElementById("auto-reader-checkbox");

// 为自动阅读模式复选框添加change事件监听器
autoReaderCheckbox.addEventListener("change", function () {
	// 将当前文章URL的域名状态设置为复选框的选中状态
	readerDecision.setDomainStatus(articleURL, this.checked);
	// 隐藏自动重定向横幅
	autoRedirectBanner.hidden = true;
});

// 监听"readerData"事件，当读者数据更新时执行回调函数
settingManagement.listen("readerData", function () {
	// 将自动阅读模式复选框的选中状态设置为当前文章URL的域名状态
	autoReaderCheckbox.checked = readerDecision.getDomainStatus(articleURL) === true;
});

/**站点导航链接容器元素 */
var navLinksContainer = document.getElementById("site-nav-links");

/**
 * 从给定的文档中提取并显示导航链接
 * @param {Document} document - 要提取导航链接的文档对象
 */
function extractAndShowNavigation(document) {
	// 显示站点图标

	// 创建站点图标链接元素
	var siteIconLink = document.createElement("a");
	siteIconLink.className = "site-icon-link";
	siteIconLink.href = articleLocation.protocol + "//" + articleLocation.host;

	// 创建站点图标元素
	var siteIcon = document.createElement("img");
	siteIcon.className = "site-icon";
	siteIcon.src = articleLocation.protocol + "//" + articleLocation.host + "/favicon.ico";

	siteIconLink.appendChild(siteIcon);
	navLinksContainer.appendChild(siteIconLink);

	// 设置站点图标透明度
	siteIcon.style.opacity = 0;
	siteIcon.addEventListener("load", function () {
		siteIcon.style.opacity = 1;
	});

	try {
		// URL解析可能失败，但这不应阻止文章的显示

		// 获取当前目录路径
		const currentDir = articleLocation.pathname.split("/").slice(0, -1).join("/");

		// 选择包含特定类名的链接元素，并过滤掉不符合条件的元素
		var items = Array.from(document.querySelectorAll('[class*="menu"] a, [class*="navigation"] a, header li a, [role=tabpanel] a, nav a'))
			.filter((el) => {
				let n = el;

				while (n) {
					if (n.className.includes("social")) {
						return false;
					}
					n = n.parentElement;
				}

				return true;
			})
			.filter((el) => el.getAttribute("href") && !el.getAttribute("href").startsWith("#") && !el.getAttribute("href").startsWith("javascript:"))
			.filter((el) => {
				const url = new URL(el.href);
				const dir = url.pathname.split("/").slice(0, -1).join("/");

				// 排除链接到与当前文章相同目录的链接
				if (dir === currentDir) {
					return false;
				}

				// 排除链接到不同域名的链接
				if (url.hostname.replace("www.", "") !== articleLocation.hostname.replace("www.", "")) {
					return false;
				}

				return true;
			})
			.filter((el) => el.textContent.trim() && el.textContent.trim().replace(/\s+/g, " ").length < 65);

		// 去除重复的链接
		var itemURLSet = items.map((item) => new URL(item.href).toString());
		items = items.filter((item, idx) => itemURLSet.indexOf(new URL(item.href).toString()) === idx);

		// 显示链接，直到字符数达到限制（大部分链接可在一行中显示）
		var accumulatedLength = 0;

		items.forEach(function (item) {
			accumulatedLength += item.textContent.length + 2;
			if (accumulatedLength > 125) {
				return;
			}

			// 使用articleURL作为基础URL以正确解析相对链接
			var realURL = new URL(item.getAttribute("href"), articleURL);

			var el = document.createElement("a");
			el.textContent = item.textContent;
			el.title = item.textContent;
			el.href = realURL.toString();

			// 如果链接指向当前文章所在的父目录，将其标记为选中状态
			if (realURL.pathname !== "/" && articleURL.startsWith(realURL.toString())) {
				el.classList.add("selected");
			}

			navLinksContainer.appendChild(el);
		});
	} catch (e) {
		console.warn("error extracting navigation links", e);
	}
}

/**
 * 从给定的文档中提取日期并返回格式化后的日期字符串
 * @param {Document} document - 要提取日期的文档对象
 * @returns {string} - 格式化后的日期字符串
 */
function extractDate(document) {
	var date;

	// 查找包含日期信息的元素
	var dateItem = document.querySelector('[itemprop*="dateCreated"], [itemprop*="datePublished"], [property="article:published_time"]');

	if (dateItem) {
		try {
			// 尝试解析日期字符串
			var d = Date.parse(dateItem.getAttribute("content"));

			if (Number.isNaN(d)) {
				// 处理 <time> 元素情况
				d = Date.parse(dateItem.getAttribute("datetime"));
			}

			if (Number.isNaN(d)) {
				// 处理华盛顿邮报（Washington Post）情况
				d = Date.parse(dateItem.textContent);
			}

			// 格式化日期字符串
			date = new Intl.DateTimeFormat(navigator.language, { year: "numeric", month: "long", day: "numeric" }).format(new Date(d));
		} catch (e) {
			console.warn(e);
		}
	} else {
		try {
			// 查找URL中的日期信息（格式为yyyy/mm/dd）
			var urlmatch = articleURL.match(/\/([0-9]{4})\/([0-9]{1,2})\/([0-9]{1,2})/);
			if (urlmatch) {
				var d2 = new Date();
				d2.setYear(parseInt(urlmatch[1]));
				d2.setMonth(parseInt(urlmatch[2]) - 1);
				d2.setDate(parseInt(urlmatch[3]));

				// 格式化日期字符串
				date = new Intl.DateTimeFormat(navigator.language, { year: "numeric", month: "long", day: "numeric" }).format(d2);
			}
		} catch (e) {
			console.warn(e);
		}
	}

	return date;
}

/**
 * 设置阅读器框架的大小
 */
function setReaderFrameSize() {
	// 可能会出现循环问题，调整大小会创建一个额外的滚动条，使高度增加，
	// 然后在下一次调整大小时，框架变得更高，滚动条消失，高度减小...
	// 添加额外的1%空间可以解决这个问题
	rframe.height = rframe.contentDocument.body.querySelector(".reader-main").scrollHeight * 1.01 + "px";
}

/**
 * 启动阅读器视图
 * @param {Object} article - 文章对象
 * @param {string} date - 文章日期
 */
function startReaderView(article, date) {
	// 创建一个包含样式表链接的字符串
	var readerContent = "<link rel='stylesheet' href='readerContent.css'>";

	if (!article) {
		// 如果无法解析文章，添加提示信息
		readerContent += "<div class='reader-main'><em>No article found.</em></div>";
	} else {
		if (article.title) {
			// 设置页面标题为文章标题
			document.title = article.title;
		} else {
			document.title = "Reader View | " + articleURL;
		}

		var readerDomain = articleLocation.hostname;

		// 添加文章标题、作者和内容
		readerContent += "<div class='reader-main' domain='" + readerDomain + "'>" + "<h1 class='article-title'>" + (article.title || "") + "</h1>";

		if (article.byline || date) {
			readerContent += "<h2 class='article-authors'>" + (article.byline ? article.byline : "") + (date ? " (" + date + ")" : "") + "</h2>";
		}

		readerContent += article.content + "</div>";
	}

	// 创建一个新的 iframe 元素
	window.rframe = document.createElement("iframe");

	// 添加类名
	rframe.classList.add("reader-frame");
	// 提供安全的沙盒环境
	rframe.sandbox = "allow-same-origin allow-top-navigation allow-modals";
	// 将内容作为 iframe 的源文件
	rframe.srcdoc = readerContent;

	// 设置初始高度为窗口可用空间的高度减去 68 像素
	rframe.height = window.innerHeight - 68;

	// 当页面加载完成后调整框架大小
	rframe.onload = function () {
		/* 处理链接的特殊情况 */
		var links = rframe.contentDocument.querySelectorAll("a");

		if (links) {
			for (var i = 0; i < links.length; i++) {
				// 如果链接指向同一页，需要特殊处理
				try {
					const href = new URL(links[i].href);
					if (href.hostname === articleLocation.hostname && href.pathname === articleLocation.pathname && href.search === articleLocation.search) {
						links[i].addEventListener("click", function (e) {
							e.preventDefault();
							rframe.contentWindow.location.hash = href.hash;
						});
					}
				} catch (e) {}
			}
		}

		// 设置阅读器主题样式
		setReaderTheme();

		requestAnimationFrame(function () {
			// 设置阅读器框架大小
			setReaderFrameSize();

			requestAnimationFrame(function () {
				// 允许空格键和箭头键正确工作
				rframe.focus();
			});
		});

		// 监听窗口大小改变事件
		window.addEventListener("resize", setReaderFrameSize);
	};

	// 将 iframe 添加到页面中
	document.body.appendChild(rframe);
}

/**
 * 处理文章数据并启动阅读器视图
 * @param {string} data - 文章数据字符串
 */
function processArticle(data) {
	// 创建一个包含样式表链接的临时 iframe 元素
	var parserframe = document.createElement("iframe");
	parserframe.className = "temporary-frame";
	parserframe.sandbox = "allow-same-origin";

	document.body.appendChild(parserframe);

	// 将文章数据作为源文件加载到临时 iframe 中
	parserframe.srcdoc = data;

	parserframe.onload = function () {
		// 设置基础 URL，以便让 readability 正确解析相对链接
		var b = document.createElement("base");
		b.href = articleURL;

		parserframe.contentDocument.head.appendChild(b);

		var doc = parserframe.contentDocument;

		// 使所有链接在新标签页中打开，以确保链接功能正常
		var links = doc.querySelectorAll("a");
		if (links) {
			for (var i = 0; i < links.length; i++) {
				links[i].target = "_top";
			}
		}

		/* 站点特定的问题处理 */

		// 对于 wikipedia.org 需要特殊处理
		if (articleLocation.hostname.includes("wikipedia.org")) {
			var images = Array.from(doc.getElementsByTagName("img"));

			// 清除图片的 srcset，避免显示问题
			images.forEach(function (image) {
				if (image.src && image.srcset) {
					image.srcset = "";
				}
			});

			// 将通常折叠渲染的列表转换为 <details> 元素
			var collapsedLists = Array.from(doc.querySelectorAll(".NavFrame.collapsed"));
			collapsedLists.forEach(function (list) {
				var innerEl = list.querySelector(".NavContent");
				if (innerEl) {
					var det = doc.createElement("details");

					var heading = list.querySelector(".NavHead");
					if (heading) {
						var sum = doc.createElement("summary");
						sum.childNodes = heading.childNodes;
						heading.remove();
						sum.appendChild(heading);
						det.appendChild(sum);
					}

					var root = innerEl.parentNode;
					innerEl.remove();
					det.appendChild(innerEl);
					root.appendChild(det);
				}
			});
		}

		// 对于 medium.com，显示高分辨率图片
		if (articleLocation.hostname === "medium.com") {
			var mediumImageRegex = /(?<=https?:\/\/miro.medium.com\/max\/)([0-9]+)(?=\/)/;
			images.forEach(function (image) {
				if (image.src) {
					image.src = image.src.replace("/freeze/", "/");
					if (mediumImageRegex.test(image.src)) {
						image.src = image.src.replace(mediumImageRegex, "2000");
					}
				} else {
					// 移除空图片以避免影响段落间距
					image.remove();
				}
			});
		}

		// 提取并显示导航信息
		extractAndShowNavigation(doc);

		// 从文档中提取日期信息
		var date = extractDate(doc);

		// 使用 Readability 解析文章内容
		var article = new Readability(doc).parse();

		// 启动阅读器视图
		startReaderView(article, date);

		if (article) {
			// 如果成功解析出文章内容，则标记该页面为可阅读状态，以便将来更快地自动重定向
			readerDecision.setURLStatus(articleURL, true);
		}

		// 移除临时 iframe
		document.body.removeChild(parserframe);
	};
}

/**
 * 通过 fetch 请求获取文章内容，并处理文章数据启动阅读器视图
 * @param {string} articleURL - 文章的 URL
 */
fetch(articleURL, {
	credentials: "include",
	cache: "force-cache",
})
	.then(async function (response) {
		var charset = "utf-8";
		for (var header of response.headers.entries()) {
			if (header[0].toLowerCase() === "content-type") {
				var charsetMatch = header[1].match(/charset=([a-zA-Z0-9-]+)/);
				if (charsetMatch) {
					charset = charsetMatch[1];
				}
			}
		}

		const buffer = await response.arrayBuffer();
		const decoder = new TextDecoder(charset);
		const text = decoder.decode(buffer);
		return text;
	})
	.then(processArticle) // 处理文章数据并启动阅读器视图
	.catch(function (data) {
		console.warn("request failed with error", data);

		startReaderView({
			content: "<em>Failed to load article.</em>",
		});
	});

/**
 * 打印当前文章内容
 */
function printArticle() {
	rframe.contentWindow.print();
}

/* 这些函数从父进程调用 */

/**父进程动作对象 */
var parentProcessActions = {
	printArticle: printArticle,
};
