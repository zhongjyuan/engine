const { webviews } = require("./webviewManagement.js");

const webviewMenuManagement = require("./webviewMenuManagement.js");

/**
 * 下载管理器对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日12:20:29
 */
const downloadManagement = {
	/**下载管理器是否可见 */
	isShown: false,

	/**下载进度条元素 */
	bar: document.getElementById("download-bar"),

	/**下载项容器元素 */
	container: document.getElementById("download-container"),

	/**关闭按钮元素 */
	closeButton: document.getElementById("download-close-button"),

	/**下载管理器高度 */
	height: 40,

	/**最近完成下载的时间戳 */
	lastDownloadCompleted: null,

	/**存储下载项的对象 */
	downloadItems: {},

	/**存储下载项界面元素的对象 */
	downloadBarElements: {},

	/**
	 * 将文件大小转换为字符串表示
	 * @param {*} bytes - 文件大小（字节数）
	 * @returns {string} - 可读的文件大小字符串
	 */
	getFileSizeString: function (bytes) {
		const prefixes = ["B", "KB", "MB", "GB", "TB", "PB"];

		let size = bytes;
		let prefixIndex = 0;

		// 优先显示 "0.9 KB" 而不是 "949 字节"
		while (size > 900) {
			size /= 1024;
			prefixIndex++;
		}

		return Math.round(size * 10) / 10 + " " + prefixes[prefixIndex];
	},

	/**
	 * 显示下载管理器
	 */
	show: function () {
		// 检查下载管理器是否已经显示
		if (!downloadManagement.isShown) {
			// 设置下载管理器的显示状态为 true
			downloadManagement.isShown = true;

			// 隐藏下载进度条元素
			downloadManagement.bar.hidden = false;

			// 调整 webviews 的外边距，使下载管理器不遮挡页面内容
			webviews.adjustMargin([0, 0, downloadManagement.height, 0]);
		}
	},

	/**
	 * 隐藏下载管理器并清除已完成或失败的下载项
	 */
	hide: function () {
		// 检查下载管理器是否已经显示
		if (downloadManagement.isShown) {
			// 将下载管理器的显示状态设置为 false
			downloadManagement.isShown = false;

			// 隐藏下载进度条元素
			downloadManagement.bar.hidden = true;

			// 调整 webviews 的外边距，将下载管理器移回原来的位置
			webviews.adjustMargin([0, 0, downloadManagement.height * -1, 0]);

			// 遍历所有下载项，移除已完成或失败的下载项
			for (const item in downloadManagement.downloadItems) {
				if (downloadManagement.downloadItems[item].status !== "progressing") {
					downloadManagement.removeItem(item);
				}
			}
		}
	},

	/**
	 * 移除下载项
	 * @param {string} path - 下载项的路径
	 */
	removeItem: function (path) {
		// 检查下载进度条元素是否存在
		if (downloadManagement.downloadBarElements[path]) {
			// 从DOM中移除下载进度条元素
			downloadManagement.downloadBarElements[path].container.remove();
		}

		// 删除下载进度条元素和下载项
		delete downloadManagement.downloadBarElements[path];
		delete downloadManagement.downloadItems[path];

		// 检查是否所有下载项都已被移除
		if (Object.keys(downloadManagement.downloadItems).length === 0) {
			// 隐藏下载管理器
			downloadManagement.hide();
		}
	},

	/**
	 * 打开文件夹
	 * @param {string} path - 文件夹路径
	 */
	openFolder: function (path) {
		window.ipc.invoke("showItemInFolder", path);
	},

	/**
	 * 当下载项被点击时触发的事件处理函数
	 * @param {string} path - 下载项的路径
	 */
	onItemClicked: function (path) {
		// 检查下载项状态是否为 "completed"
		if (downloadManagement.downloadItems[path].status === "completed") {
			// 使用 electron.shell.openPath 打开文件
			window.electron.shell.openPath(path);

			// 等待一段时间后移除该下载项
			setTimeout(function () {
				downloadManagement.removeItem(path);
			}, 100);
		}
	},

	/**
	 * 当下载项被拖拽时触发的事件处理函数
	 * @param {string} path - 下载项的路径
	 */
	onItemDragged: function (path) {
		window.ipc.invoke("startFileDrag", path);
	},

	/**
	 * 当下载完成时触发的事件处理函数
	 */
	onDownloadCompleted: function () {
		// 更新最后一次下载完成时间
		downloadManagement.lastDownloadCompleted = Date.now();

		// 延迟 2 分钟后检查是否还有正在下载的项，如果没有，则隐藏下载管理器
		setTimeout(function () {
			if (
				Date.now() - downloadManagement.lastDownloadCompleted >= 120000 &&
				Object.values(downloadManagement.downloadItems).filter((i) => i.status === "progressing").length === 0
			) {
				downloadManagement.hide();
			}
		}, 120 * 1000);
	},

	/**
	 * 创建下载项
	 * @param {*} downloadItem 下载项信息
	 */
	createItem: function (downloadItem) {
		// 创建一个 div 元素作为下载项的容器
		const container = document.createElement("div");
		container.className = "download-item";
		container.setAttribute("role", "listitem");
		container.setAttribute("draggable", "true");

		// 创建用于显示标题的 div 元素，并设置其文本内容为 downloadItem.name
		const title = document.createElement("div");
		title.className = "download-title";
		title.textContent = downloadItem.name;
		container.appendChild(title);

		// 创建用于显示信息的 div 元素
		const infoBox = document.createElement("div");
		infoBox.className = "download-info";
		container.appendChild(infoBox);

		// 创建用于显示详细信息的 div 元素
		const detailedInfoBox = document.createElement("div");
		detailedInfoBox.className = "download-info detailed";
		container.appendChild(detailedInfoBox);

		// 创建用于显示下载进度的 div 元素
		const progress = document.createElement("div");
		progress.className = "download-progress";
		container.appendChild(progress);

		// 创建一个下拉按钮
		const dropdown = document.createElement("button");
		dropdown.className = "download-action-button i carbon:chevron-down";
		container.appendChild(dropdown);

		// 创建一个打开文件夹的按钮，并隐藏起来
		const openFolder = document.createElement("button");
		openFolder.className = "download-action-button i carbon:folder";
		openFolder.hidden = true;
		container.appendChild(openFolder);

		// 添加点击事件监听器，点击时触发下载管理器的 onItemClicked 方法
		container.addEventListener("click", function () {
			downloadManagement.onItemClicked(downloadItem.path);
		});

		// 添加拖拽事件监听器，拖拽开始时触发下载管理器的 onItemDragged 方法
		container.addEventListener("dragstart", function (e) {
			e.preventDefault();
			downloadManagement.onItemDragged(downloadItem.path);
		});

		// 添加下拉按钮的点击事件监听器
		dropdown.addEventListener("click", function (e) {
			e.stopPropagation();
			// 创建一个下拉菜单模板，并根据按钮位置显示菜单
			var template = [
				[
					{
						label: l("downloadCancel"),
						click: function () {
							ipc.send("cancelDownload", downloadItem.path);
							downloadManagement.removeItem(downloadItem.path);
						},
					},
				],
			];

			webviewMenuManagement.open(template, Math.round(dropdown.getBoundingClientRect().left), Math.round(dropdown.getBoundingClientRect().top - 15));
		});

		// 添加打开文件夹按钮的点击事件监听器
		openFolder.addEventListener("click", function (e) {
			e.stopPropagation();

			// 打开下载项所在文件夹并在下载管理器中移除该项
			downloadManagement.openFolder(downloadItem.path);
			downloadManagement.removeItem(downloadItem.path);
		});

		// 将下载项容器添加到下载管理器的容器中
		downloadManagement.container.appendChild(container);

		// 将下载项的各个元素存储到 downloadBarElements 中
		downloadManagement.downloadBarElements[downloadItem.path] = { container, title, infoBox, detailedInfoBox, progress, dropdown, openFolder };
	},

	/**
	 * 更新下载项的状态和样式
	 * @param {object} downloadItem - 下载项信息
	 */
	updateItem: function (downloadItem) {
		const elements = downloadManagement.downloadBarElements[downloadItem.path];

		// 如果下载完成，更新样式和文本内容
		if (downloadItem.status === "completed") {
			elements.container.classList.remove("loading");
			elements.container.classList.add("completed");
			elements.progress.hidden = true;
			elements.dropdown.hidden = true;
			elements.openFolder.hidden = false;
			elements.infoBox.textContent = l("downloadStateCompleted"); // 设置信息框文本内容为“Download State: Completed”
			elements.detailedInfoBox.textContent = l("downloadStateCompleted"); // 设置详细信息框文本内容为“Download State: Completed”
		}

		// 如果下载中断，更新样式和文本内容
		else if (downloadItem.status === "interrupted") {
			elements.container.classList.remove("loading");
			elements.container.classList.remove("completed");
			elements.progress.hidden = true;
			elements.dropdown.hidden = true;
			elements.openFolder.hidden = true;
			elements.infoBox.textContent = l("downloadStateFailed"); // 设置信息框文本内容为“Download State: Failed”
			elements.detailedInfoBox.textContent = l("downloadStateFailed"); // 设置详细信息框文本内容为“Download State: Failed”
		}

		// 如果下载进行中，更新样式和文本内容
		else {
			elements.container.classList.add("loading");
			elements.container.classList.remove("completed");
			elements.progress.hidden = false;
			elements.dropdown.hidden = false;
			elements.openFolder.hidden = true;
			elements.infoBox.textContent = getFileSizeString(downloadItem.size.total); // 设置信息框文本内容为总大小
			elements.detailedInfoBox.textContent = getFileSizeString(downloadItem.size.received) + " / " + getFileSizeString(downloadItem.size.total); // 设置详细信息框文本内容为已接收大小 / 总大小

			// 进度条的长度根据下载进度进行调整
			const adjustedProgress = 0.025 + (downloadItem.size.received / downloadItem.size.total) * 0.975;
			elements.progress.style.transform = "scaleX(" + adjustedProgress + ")";
		}
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		// 绑定关闭按钮的点击事件，点击时隐藏下载管理器
		downloadManagement.closeButton.addEventListener("click", function () {
			downloadManagement.hide();
		});

		// 监听从主进程发送过来的下载信息
		window.ipc.on("download-info", function (e, info) {
			// 如果下载保存路径尚未选择，则返回
			if (!info.path) {
				return;
			}

			// 如果下载被取消，移除下载项
			if (info.status === "cancelled") {
				downloadManagement.removeItem(info.path);
				return;
			}

			// 如果下载完成，执行下载完成的操作
			if (info.status === "completed") {
				downloadManagement.onDownloadCompleted();
			}

			// 如果下载项不存在，显示下载管理器并创建下载项
			if (!downloadManagement.downloadItems[info.path]) {
				downloadManagement.show();
				downloadManagement.createItem(info);
			}
			
			downloadManagement.updateItem(info);

			// 将下载项信息存储到下载项列表中
			downloadManagement.downloadItems[info.path] = info;
		});
	},
};

module.exports = downloadManagement;
