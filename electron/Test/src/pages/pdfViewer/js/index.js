// 设置 PDF.js 使用的 worker 文件路径
pdfjsLib.GlobalWorkerOptions.workerSrc = "../../../node_modules/pdfjs-dist/build/pdf.worker.js";

/**从 URL 查询参数中获取 "url" 参数 */
const url = new URLSearchParams(window.location.search.replace("?", "")).get("url");

/**事件总线实例 */
const eventBus = new pdfjsViewer.EventBus();

/**
 * 防抖函数
 * @param {Function} fn - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} - 经过防抖处理后的函数
 */
function debounce(fn, delay) {
	var timer = null;
	return function () {
		var context = this;
		var args = arguments;
		clearTimeout(timer);
		timer = setTimeout(function () {
			fn.apply(context, args);
		}, delay);
	};
}

/**
 * 节流函数
 * @param {Function} fn - 要执行的函数
 * @param {number} threshhold - 间隔时间（毫秒）
 * @param {Object} scope - 函数执行的作用域
 * @returns {Function} - 经过节流处理后的函数
 */
function throttle(fn, threshhold, scope) {
	threshhold || (threshhold = 250);
	var last, deferTimer;
	return function () {
		var context = scope || this;

		var now = +new Date();
		var args = arguments;
		if (last && now < last + threshhold) {
			// 如果在指定的间隔时间内再次触发函数，则清除之前的延迟执行，并重新设置新的延迟执行
			clearTimeout(deferTimer);
			deferTimer = setTimeout(function () {
				last = now;
				fn.apply(context, args);
			}, threshhold);
		} else {
			last = now;
			fn.apply(context, args);
		}
	};
}

/**
 * 页面计数器 UI
 */
const pageCounter = {
	/**
	 * 初始化页面计数器
	 */
	init: function () {
		// 页面计数器容器
		pageCounter.container = document.getElementById("page-counter");

		// 当前页码输入框
		pageCounter.input = pageCounter.container.getElementsByTagName("input")[0];

		// 总共页码显示
		pageCounter.totalEl = pageCounter.container.querySelector("#total");

		// 点击页面计数器容器时，聚焦到当前页码输入框并选中其中的文本
		pageCounter.container.addEventListener("click", function () {
			pageCounter.input.focus();
			pageCounter.input.select();
		});

		// 当前页码输入框内容改变时，跳转到对应页面并更新可见页码
		pageCounter.input.addEventListener("change", function (e) {
			var pageIndex = parseInt(this.value) - 1;

			// 滚动到对应页面
			if (pageViews[pageIndex] && pageViews[pageIndex].div) {
				pageViews[pageIndex].div.scrollIntoView();
			}

			// 更新可见页码
			updateVisiblePages();

			// 更新页面计数器UI
			pageCounter.update();

			// 取消当前页码输入框的聚焦状态
			pageCounter.input.blur();
		});
	},

	/**
	 * 更新页面计数器UI
	 */
	update: function () {
		// 更新当前页码
		pageCounter.input.value = currentPage + 1;

		// 更新总页码数显示
		pageCounter.totalEl.textContent = pageCount;
	},
};

pageCounter.init();

/**
 * 进度条 UI
 */
const progressBar = {
	/**进度条元素 */
	element: document.getElementById("progress-bar"),

	/**进度条是否启用 */
	enabled: false,

	/**当前进度 */
	progress: 0,

	/**
	 * 增加进度条的进度
	 * @param {number} progress - 增加的进度值 (范围: 0-1, 1 = 100%)
	 */
	incrementProgress: function (progress) {
		progressBar.progress += progress;

		// 如果进度条未启用，则直接返回
		if (!progressBar.enabled) {
			return;
		}

		// 如果进度达到 100%，则隐藏进度条
		if (progressBar.progress >= 1) {
			progressBar.enabled = false;
			progressBar.element.style.transform = "translateX(0%)";
			setTimeout(function () {
				progressBar.element.hidden = true;
			}, 200);
			return;
		}

		// 显示进度条，并更新进度条的宽度
		progressBar.element.hidden = false;
		var width = progressBar.progress * 90;
		progressBar.element.style.transform = "translateX(-" + (100 - width) + "%)";
	},

	/**
	 * 初始化进度条
	 */
	init: function () {
		setTimeout(function () {
			// 如果 PDF 尚未加载完成，则显示进度条
			if (!pdf) {
				progressBar.enabled = true;
				progressBar.incrementProgress(0.05);

				// 模拟 PDF 下载的进度
				var loadingFakeInterval = setInterval(function () {
					if (progressBar.progress < 0.125) {
						progressBar.incrementProgress(0.002);
					} else {
						clearInterval(loadingFakeInterval);
					}
				}, 250);
			}
		}, 3000); // 3 秒后开始显示进度条
	},
};

progressBar.init();

/**下载按钮元素对象 */
const downloadButton = document.getElementById("download-button");

// 监听下载按钮的点击事件
downloadButton.addEventListener("click", function () {
	downloadPDF();
});

// 获取所有具有类名 "side-gutter" 的元素，并对每个元素进行处理
document.querySelectorAll(".side-gutter").forEach(function (el) {
	// 监听鼠标进入元素的事件
	el.addEventListener("mouseenter", function () {
		showViewerUI();
	});

	// 监听鼠标离开元素的事件
	el.addEventListener("mouseleave", function () {
		hideViewerUI();
	});
});

/**
 * 显示查看器界面
 */
function showViewerUI() {
	// 获取所有具有类名 "viewer-ui" 的元素，并移除 "hidden" 类，显示界面
	document.querySelectorAll(".viewer-ui").forEach((el) => el.classList.remove("hidden"));

	// 更新页面计数器
	pageCounter.update();
}

/**
 * 隐藏查看器界面（带防抖）
 */
const hideViewerUI = debounce(function () {
	// 如果没有当前鼠标悬停在 ".side-gutter" 元素上，则隐藏界面
	if (!document.querySelector(".side-gutter:hover")) {
		document.querySelectorAll(".viewer-ui").forEach((el) => el.classList.add("hidden"));
	}
}, 600);

/**
 * 更新侧边栏宽度
 */
function updateGutterWidths() {
	/**页面侧边栏的宽度 */
	var gutterWidth;

	// 检查是否存在页面视图
	if (!pageViews[0]) {
		// PDF 尚未加载完成时，默认宽度为 64
		gutterWidth = 64;
	} else {
		// 根据窗口宽度和页面视口宽度计算侧边栏宽度
		gutterWidth = Math.round(Math.max(64, (window.innerWidth - pageViews[0].viewport.width) / 2)) - 2;
	}

	// 设置所有具有类名 "side-gutter" 的元素宽度
	document.querySelectorAll(".side-gutter").forEach(function (el) {
		el.style.width = gutterWidth + "px";
	});
}

/**
 * 创建容器元素
 * @returns {HTMLElement} - 创建的容器元素
 */
function createContainer() {
	// 创建一个新的 div 元素
	var el = document.createElement("div");

	// 为新元素添加类名 "page-container"
	el.classList.add("page-container");

	// 将新元素添加到文档的 body 中
	document.body.appendChild(el);

	// 返回新创建的容器元素
	return el;
}

/**
 * 设置页面 DOM 结构，但不实际将页面绘制到画布上
 * @param {Object} pageView - 页面视图对象
 */
function setupPageDom(pageView) {
	// 获取页面的容器元素
	var div = pageView.div;

	// 获取页面的容器元素
	var pdfPage = pageView.pdfPage;

	// 创建一个容器元素用于包裹画布
	var canvasWrapper = document.createElement("div");
	canvasWrapper.style.width = div.style.width;
	canvasWrapper.style.height = div.style.height;
	canvasWrapper.classList.add("canvasWrapper");

	// 添加注释图层到页面容器元素
	if (pageView.annotationLayer && pageView.annotationLayer.div && !pageView.annotationLayer.div.parentNode) {
		div.appendChild(pageView.annotationLayer.div);
	}

	// 将画布容器插入到注释图层之前或添加到页面容器元素中
	if (pageView.annotationLayer && pageView.annotationLayer.div) {
		div.insertBefore(canvasWrapper, pageView.annotationLayer.div);
	} else {
		div.appendChild(canvasWrapper);
	}

	var textLayer = null;

	// 创建文本图层并添加到页面容器元素
	if (pageView.textLayerFactory) {
		var textLayerDiv = document.createElement("div");
		textLayerDiv.className = "textLayer";
		textLayerDiv.style.width = canvasWrapper.style.width;
		textLayerDiv.style.height = canvasWrapper.style.height;

		if (pageView.annotationLayer && pageView.annotationLayer.div) {
			div.insertBefore(textLayerDiv, pageView.annotationLayer.div);
		} else {
			div.appendChild(textLayerDiv);
		}

		textLayer = pageView.textLayerFactory.createTextLayerBuilder(textLayerDiv, pageView.id - 1, pageView.viewport, pageView.enhanceTextSelection);
	}

	// 创建注释图层并保存到页面视图对象中
	if (pageView.annotationLayerFactory) {
		var annotationLayer = pageView.annotationLayerFactory.createAnnotationLayerBuilder(
			div,
			pdfPage,
			null,
			null,
			false,
			pageView.l10n,
			null,
			null,
			null,
			null,
			null
		);
	}

	// 设置页面视图对象的文本图层和注释图层
	pageView.textLayer = textLayer;
	pageView.annotationLayer = annotationLayer;

	// 设置页面的注释图层
	setUpPageAnnotationLayer(pageView);
}

/**
 * 默认的文本层工厂
 * @constructor
 */
function DefaultTextLayerFactory() {}
DefaultTextLayerFactory.prototype = {
	/**
	 * 创建文本层构建器
	 * @param {HTMLElement} textLayerDiv - 文本层容器元素
	 * @param {number} pageIndex - 页面索引
	 * @param {PDFJS.PageViewport} viewport - 页面视口
	 * @param {boolean} enhanceTextSelection - 是否增强文本选择
	 * @returns {pdfjsViewer.TextLayerBuilder} - 创建的文本层构建器
	 */
	createTextLayerBuilder: function (textLayerDiv, pageIndex, viewport, enhanceTextSelection) {
		return new pdfjsViewer.TextLayerBuilder({
			textLayerDiv: textLayerDiv,
			pageIndex: pageIndex,
			viewport: viewport,
			enhanceTextSelection: true,
			eventBus: eventBus,
		});
	},
};

/**PDF 文档对象 */
var pdf = null;
/**PDF 页面视图对象的数组 */
var pageViews = [];
/**页面缓存大小 */
var pageBuffer = 15;

/**
 * 更新缓存的 PDF 页面视图对象，使用了函数节流保证性能
 */
const updateCachedPages = throttle(function () {
	// 如果当前页码为空，则直接返回，不进行操作
	if (currentPage == null) {
		return;
	}

	// 如果当前页的 canvas 对象不存在，则重新绘制该页的 canvas
	if (!pageViews[currentPage].canvas) {
		redrawPageCanvas(currentPage);
	}

	// 遍历所有的 PDF 页面视图对象
	for (var i = 0; i < pageViews.length; i++) {
		(function (i) {
			// 如果当前遍历到的页面索引与当前页相同，则跳过不进行操作
			if (i === currentPage) {
				// already checked above
				return;
			}
			// 如果当前遍历到的页面与当前页的距离超过了缓存大小，并且该页面的 canvas 对象存在，则删除该 canvas 对象，并将其置为 null
			if (Math.abs(i - currentPage) > pageBuffer && pageViews[i].canvas) {
				pageViews[i].canvas.remove();
				pageViews[i].canvas = null;
			}

			// 如果当前遍历到的页面与当前页的距离小于等于缓存大小，并且该页面的 canvas 对象不存在，则重新绘制该页面的 canvas
			if (Math.abs(i - currentPage) < pageBuffer && !pageViews[i].canvas) {
				redrawPageCanvas(i);
			}
		})(i);
	}
}, 500);

/**
 * 设置页面的注解层
 * @param {Object} pageView - 页面视图对象
 */
function setUpPageAnnotationLayer(pageView) {
	// 设置页面视图对象的注解层
	pageView.annotationLayer.linkService.goToDestination = async function (dest) {
		let explicitDest;

		// 判断 dest 的类型，如果是字符串，则通过 pdf.getDestination() 获取显式目标
		if (typeof dest === "string") {
			explicitDest = await pdf.getDestination(dest);
		} else {
			explicitDest = await dest;
		}

		let pageNumber;
		// 获取显式目标的引用
		const destRef = explicitDest[0];

		// 判断显式目标引用的类型，并获取页码
		if (typeof destRef === "object" && destRef !== null) {
			pageNumber = await pdf.getPageIndex(destRef);
		} else if (Number.isInteger(destRef)) {
			pageNumber = destRef + 1;
		}

		// 将指定页的 div 元素滚动到可见区域
		pageViews[pageNumber].div.scrollIntoView();
	};
}

/**页面总数 */
var pageCount;

// 通过给定的 URL 加载 PDF 文档
pdfjsLib
	.getDocument({ url: url, withCredentials: true })
	.promise.then(async function (pdf) {
		window.pdf = pdf;

		// 获取页面总数
		pageCount = pdf.numPages;

		// 根据页面总数设置页面缓冲区大小
		if (pageCount < 25) {
			pageBuffer = 25;
		} else {
			pageBuffer = 4;
		}

		// 获取 PDF 文档的元数据并设置标题
		pdf.getMetadata().then(function (metadata) {
			document.title = metadata.Title || url.split("/").slice(-1);
		});

		// 遍历每一页，创建页面视图对象并进行相应的设置
		for (var i = 1; i <= pageCount; i++) {
			var pageNumber = i;

			await pdf.getPage(pageNumber).then(function (page) {
				progressBar.incrementProgress(1 / pageCount);

				var defaultScale = 1.15;
				var minimumPageWidth = 625; // px

				var scale = defaultScale;

				var viewport = page.getViewport({ scale: scale });

				// 根据页面宽度调整缩放比例
				if (viewport.width * 1.5 > window.innerWidth) {
					scale = (window.innerWidth / viewport.width) * 0.75;

					viewport = page.getViewport({ scale: scale });
				}

				// 根据最小页面宽度调整缩放比例
				if (viewport.width * 1.33 < minimumPageWidth) {
					scale = (minimumPageWidth / viewport.width) * scale * 0.75;
					viewport = page.getViewport({ scale: scale });
				}

				// 当页面总数大于 200 时，进一步调整缩放比例
				if (pageCount > 200) {
					scale = Math.min(scale, 1.1);
					viewport = page.getViewport({ scale: scale });
				}

				// 创建页面容器
				var pageContainer = createContainer();

				// 创建 PDF 页面视图对象
				var pdfPageView = new pdfjsViewer.PDFPageView({
					container: pageContainer,
					id: pageNumber,
					scale: scale,
					defaultViewport: viewport,
					eventBus: eventBus,
					textLayerFactory: new DefaultTextLayerFactory(),
					annotationLayerFactory: new pdfjsViewer.DefaultAnnotationLayerFactory(),
				});

				// 设置页面对象
				pdfPageView.setPdfPage(page);

				// 将页面视图对象添加到数组中
				pageViews.push(pdfPageView);

				if (pageNumber === 1) {
					updateGutterWidths();
				}

				// 延时加载页面内容
				(function (pageNumber, pdfPageView) {
					setTimeout(function () {
						if (pageNumber < pageBuffer || (currentPage && Math.abs(currentPage - pageNumber) < pageBuffer)) {
							pageContainer.classList.add("loading");
							pdfPageView
								.draw()
								.then(function () {
									setUpPageAnnotationLayer(pdfPageView);
								})
								.then(function () {
									pageContainer.classList.remove("loading");
									if (pageNumber === 1) {
										showViewerUI();
										setTimeout(function () {
											hideViewerUI();
										}, 4000);
									}
								});
							setTimeout(function () {
								pageContainer.classList.remove("loading");
							}, 2000);
						} else {
							setupPageDom(pdfPageView);
							requestIdleCallback(
								function () {
									pdfPageView.pdfPage.getTextContent({ normalizeWhitespace: true }).then(function (text) {
										pdfPageView.textLayer.setTextContent(text);
										pdfPageView.textLayer.render(0);
										pdfPageView.annotationLayer.render(pdfPageView.viewport, "display");
									});
								},
								{ timeout: 10000 }
							);
						}
					}, 100 * (pageNumber - 1));
				})(pageNumber, pdfPageView);
			});
		}
	})
	.catch(function (e) {
		console.warn("error while loading PDF", e);
		// 如果无法显示预览，提供下载选项
		downloadPDF();
	});

/**当前可见页码 */
var currentPage = null;

/**标识是否正在查找页面中的内容 */
var isFindInPage = false;

/**
 * 更新可见页面列表
 * @returns
 */
function updateVisiblePages() {
	// 如果正在打印则不更新
	if (isPrinting) {
		return;
	}

	// 存储每一页的矩形信息
	var pageRects = new Array(pageViews.length);
	for (var i = 0; i < pageViews.length; i++) {
		pageRects[i] = pageViews[i].div.getBoundingClientRect();
	}

	// 定义窗口的高度和额外部分的高度
	var ih = window.innerHeight + 80;
	var innerHeight = window.innerHeight;

	// 存储可见页面的索引
	var visiblePages = [];

	// 遍历每一页，确定其是否可见并设置相应的样式
	for (var i = 0; i < pageViews.length; i++) {
		var rect = pageRects[i];
		var textLayer = pageViews[i].textLayer;

		// 如果未处于查找页面中的内容状态并且该页不可见，则隐藏该页
		if (!isFindInPage && (rect.bottom < -80 || rect.top > ih)) {
			pageViews[i].div.style.visibility = "hidden";
			if (textLayer) {
				textLayer.textLayerDiv.style.display = "none";
			}
		} else {
			pageViews[i].div.style.visibility = "visible";
			if (textLayer) {
				textLayer.textLayerDiv.style.display = "block";
			}

			// 如果该页的顶部在窗口的一半以上、底部在窗口内或顶部在窗口外且底部超出窗口，则认为该页是可见的
			if (
				(rect.top >= 0 && innerHeight - rect.top > innerHeight / 2) ||
				(rect.bottom <= innerHeight && rect.bottom > innerHeight / 2) ||
				(rect.top <= 0 && rect.bottom >= innerHeight)
			) {
				currentPage = i;
			}
		}
	}

	// 如果当前可见页码已确定，则更新缓存的页面
	if (currentPage !== undefined) {
		updateCachedPages(currentPage);
	}
}

// 监听滚动事件，使用节流函数限制执行频率为每50毫秒一次
window.addEventListener(
	"scroll",
	throttle(function () {
		// 更新页码计数器
		pageCounter.update();

		// 更新可见页面
		updateVisiblePages();
	}, 50)
);

// 监听窗口大小改变事件
window.addEventListener("resize", function () {
	// 这段代码在Chromium和Safari中有效，但在Firefox中无效，并且将来可能会失效。
	// 使用窗口的外部宽度除以窗口的内部宽度来计算缩放级别
	window.zoomLevel = window.outerWidth / window.innerWidth;

	// 让UI元素在任何缩放级别下保持固定大小
	document.querySelectorAll(".viewer-ui").forEach(function (el) {
		el.style.zoom = 1 / zoomLevel;
	});

	// 更新边距宽度
	updateGutterWidths();
});

/**
 * 重新绘制页面画布
 * @param {number} i - 页面索引
 * @param {function} callback - 回调函数
 */
function redrawPageCanvas(i, callback) {
	// 获取页面的canvasWrapper节点
	var canvasWrapperNode = pageViews[i].div.getElementsByClassName("canvasWrapper")[0];

	// 如果不存在canvasWrapper节点，则直接返回
	if (!canvasWrapperNode) {
		return;
	}

	// 保存旧的canvas节点
	var oldCanvas = pageViews[i].canvas;

	// 在canvasWrapper节点上绘制页面内容，并返回一个promise
	pageViews[i].paintOnCanvas(canvasWrapperNode).promise.then(function () {
		if (oldCanvas) {
			// 移除旧的canvas节点
			oldCanvas.remove();
		}

		// 执行回调函数
		if (callback) {
			callback();
		}
	});
}

/**标记正在进行重新绘制 */
var isRedrawing = false;

/**
 * 重新绘制所有页面画布
 */
function redrawAllPages() {
	// 如果正在重新绘制，则不进行操作
	if (isRedrawing) {
		console.log("ignoring redraw");
		return;
	}

	// 标记正在进行重新绘制
	isRedrawing = true;

	var completedPages = 0;

	/**
	 *
	 */
	function pageCompleteCallback() {
		// 完成的页面数量加1
		completedPages++;

		// 如果已经处理完了所有可见页面和预先加载的页面
		if (completedPages === Math.min(pageCount, pageBuffer)) {
			// 标记重新绘制已完成
			isRedrawing = false;
		}
	}

	var visiblePageList = [];
	var invisiblePageList = [];

	// 先重新绘制当前可见页面
	for (var i = 0; i < pageViews.length; i++) {
		// 如果页面没有canvas节点，则直接跳过
		if (!pageViews[i].canvas) {
			continue;
		}

		// 如果页面是可见的，则将其添加到重新绘制列表的开头
		var rect = pageViews[i].div.getBoundingClientRect();
		if (rect.top < window.innerHeight && rect.bottom > 0) {
			visiblePageList.push(pageViews[i]);
		} else {
			invisiblePageList.push(pageViews[i]);
		}
	}

	// 对于需要重新绘制的页面，使用requestIdleCallback函数调用redrawPageCanvas函数进行重新绘制
	var redrawList = visiblePageList.concat(invisiblePageList);
	for (var i = 0; i < redrawList.length; i++) {
		(function (i) {
			requestIdleCallback(function () {
				redrawPageCanvas(redrawList[i].id - 1, pageCompleteCallback);
			});
		})(i);
	}
}

/**页面最后缩放比例 */
var lastPixelRatio = window.devicePixelRatio;

// 监听窗口大小变化事件，并使用防抖函数进行处理
window.addEventListener(
	"resize",
	debounce(function () {
		// 更新可见页面，以防页面尺寸发生变化
		updateVisiblePages();

		// 如果页面缩放比例发生变化
		if (window.devicePixelRatio !== lastPixelRatio) {
			// 更新页面缩放比例
			lastPixelRatio = window.devicePixelRatio;

			// 重新绘制所有页面画布
			redrawAllPages();

			// 输出日志：重新绘制被触发
			console.log("redraw triggered");
		}
	}, 750) // 设置防抖时间为750毫秒
);

/**
 * 下载PDF文件
 */
function downloadPDF() {
	/**
	 * 开始下载函数
	 * @param {string} title - 下载文件的标题
	 */
	function startDownload(title) {
		var a = document.createElement("a");

		a.download = title || "";
		a.href = url;

		a.click();
	}

	if (pdf) {
		pdf.getMetadata().then(function (data) {
			// 获取PDF元数据成功后，调用startDownload函数开始下载文件，并传递标题作为参数
			startDownload(data.info.Title);
		});
	} else {
		// 如果没有可用的PDF数据
		// 这可能是因为下载的文件不是PDF，无法显示预览
		// 或者文件尚未加载完成
		// 调用startDownload函数开始下载文件，并传递空的标题
		startDownload("");
	}
}

/* 打印 */

/**是否打印中 */
var isPrinting = false;

var printPreviousScaleList = [];

/**
 * 在打印完成后的回调函数中，将之前缩放比例列表中保存的缩放比例恢复，并更新可见页面。
 */
function afterPrintComplete() {
	// 遍历每个页面视图对象
	for (var i = 0; i < pageViews.length; i++) {
		// 根据之前保存的缩放比例恢复视图对象的视口
		pageViews[i].viewport = pageViews[i].viewport.clone({ scale: printPreviousScaleList[i] * (4 / 3) });

		// 更新视图对象的 CSS 变换
		pageViews[i].cssTransform({ target: pageViews[i].canvas });
	}

	// 清空缩放比例列表
	printPreviousScaleList = [];

	// 设置打印标志为 false
	isPrinting = false;

	// 更新可见页面
	updateVisiblePages();
}

/**
 * 打印PDF文件
 */
function printPDF() {
	var begunCount = 0;
	var doneCount = 0;

	isPrinting = true;

	/**
	 * 当所有页面渲染完成后的回调函数，用于触发打印操作。
	 */
	function onAllRenderingDone() {
		// 等待一段时间后执行打印操作
		setTimeout(function () {
			window.print();
		}, 100);
	}

	/**
	 * 当页面渲染完成后的回调函数，用于判断是否所有页面都已经渲染完成。
	 */
	function onPageRenderComplete() {
		doneCount++;
		if (doneCount === begunCount) {
			onAllRenderingDone();
		}
	}

	// 如果文档页数超过100页，则由于内存使用限制无法直接打印，提供文件下载选项
	if (pageCount > 100) {
		isPrinting = false;
		downloadPDF();
	} else {
		var minimumAcceptableScale = 3.125 / devicePixelRatio;
		// 使用足够高的缩放比例重新绘制每一页，用于打印
		for (var i = 0; i < pageViews.length; i++) {
			(function (i) {
				printPreviousScaleList.push(pageViews[i].scale);
				var needsScaleChange = pageViews[i].scale < minimumAcceptableScale;

				if (needsScaleChange) {
					pageViews[i].viewport = pageViews[i].viewport.clone({ scale: minimumAcceptableScale * (4 / 3) });
				}

				if (needsScaleChange || !pageViews[i].canvas) {
					begunCount++;
					redrawPageCanvas(i, function () {
						if (needsScaleChange) {
							pageViews[i].cssTransform({ target: pageViews[i].canvas });
						}
						onPageRenderComplete();
					});
				}
			})(i);
		}

		// 没有需要重新绘制的页面
		if (begunCount === 0) {
			onAllRenderingDone();
		}
	}
}

/**使用 matchMedia 监听打印事件的变化 */
var mediaQueryList = window.matchMedia("print");
mediaQueryList.onchange = function (mql) {
	// 如果不处于打印状态
	if (!mql.matches) {
		// 延迟一秒后执行 afterPrintComplete 函数
		setTimeout(function () {
			afterPrintComplete();
		}, 1000);
	}
};

/* find in page mode - make all pages visible so that Chromium's search can search the whole PDF */

/**
 * 开始查找页面内的内容
 */
function startFindInPage() {
	// 设置查找标志为true，表示正在进行页面内查找
	isFindInPage = true;

	// 显示所有页面的div元素和文本图层
	for (var i = 0; i < pageViews.length; i++) {
		pageViews[i].div.style.visibility = "visible";
		if (pageViews[i].textLayer) {
			pageViews[i].textLayer.textLayerDiv.style.display = "block";
		}
	}
}

/**
 * 结束页面内查找
 */
function endFindInPage() {
	// 设置查找标志为false，表示结束页面内查找
	isFindInPage = false;

	// 更新可见页面
	updateVisiblePages();
}

/* 这些函数从父进程调用 */

// 定义从父进程调用的操作对象
var parentProcessActions = {
	downloadPDF: downloadPDF, // 下载PDF文件
	printPDF: printPDF, // 打印PDF文件
	startFindInPage: startFindInPage, // 开始页面内查找
	endFindInPage: endFindInPage, // 结束页面内查找
};
