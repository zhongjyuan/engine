const fs = require("fs");
const path = require("path");

const settingManagement = require("../settings/renderSettingManagement.js");

const urlManagement = require("./utils/urlManagement.js");

const places = require("./places/places.js");

/**
 * 书签管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日12:17:36
 */
const bookmarkManagement = {
	/**
	 * 导入
	 * @param {*} data - 导入的 HTML 数据
	 */
	import: function (data) {
		// 使用 DOMParser 解析 HTML 数据
		var tree = new DOMParser().parseFromString(data, "text/html");

		// 获取所有 <a> 标签的链接元素
		var bookmarks = Array.from(tree.getElementsByTagName("a"));

		// 循环书签数据
		bookmarks.forEach(function (bookmark) {
			// 获取链接地址
			var url = bookmark.getAttribute("href");

			// 如果链接不是以 http:、https: 或 file: 开头则忽略
			if (!url || (!url.startsWith("http:") && !url.startsWith("https:") && !url.startsWith("file:"))) {
				return;
			}

			var data = {
				title: bookmark.textContent, // 链接标题
				isBookmarked: true, // 是否为书签
				tags: [], // 标签列表
				lastVisit: Date.now(), // 最后访问时间，默认为当前时间
			};

			try {
				// 获取添加日期并转换为毫秒级时间戳
				const last = parseInt(bookmark.getAttribute("add_date")) * 1000;
				if (!isNaN(last)) {
					data.lastVisit = last;
				}
			} catch (e) {}

			var parent = bookmark.parentElement;
			while (parent != null) {
				// 获取父元素中的 H3 标签作为标签
				if (parent.children[0] && parent.children[0].tagName === "H3") {
					data.tags.push(parent.children[0].textContent.replace(/\s/g, "-"));
					break;
				}
				parent = parent.parentElement;
			}

			// 获取通过属性 tags 指定的标签，并与之前的标签合并
			if (bookmark.getAttribute("tags")) {
				data.tags = data.tags.concat(bookmark.getAttribute("tags").split(","));
			}

			// 更新书签库中的书签信息
			places.updateItem(url, data, () => {});
		});
	},

	/**
	 * 导出
	 * @returns {Promise} - 返回导出的 HTML 数据的 Promise 对象
	 */
	export: function () {
		return new Promise(function (resolve, reject) {
			// 构建树结构

			// 创建根节点
			var root = document.createElement("body");
			// 创建标题节点
			var heading = document.createElement("h1");
			// 设置标题文本
			heading.textContent = "Bookmarks";

			// 将标题节点添加到根节点
			root.appendChild(heading);
			// 创建内部根节点
			var innerRoot = document.createElement("dl");
			// 将内部根节点添加到根节点
			root.appendChild(innerRoot);

			// 创建文件夹根节点
			var folderRoot = document.createElement("dt");
			// 将文件夹根节点添加到内部根节点
			innerRoot.appendChild(folderRoot);
			// 创建文件夹内的书签列表节点
			var folderBookmarksList = document.createElement("dl");
			// 将书签列表节点添加到文件夹根节点
			folderRoot.appendChild(folderBookmarksList);

			places.getAllItems(function (items) {
				items.forEach(function (item) {
					if (item.isBookmarked) {
						var itemRoot = document.createElement("dt"); // 创建书签根节点
						var a = document.createElement("a"); // 创建链接节点
						itemRoot.appendChild(a); // 将链接节点添加到书签根节点
						folderBookmarksList.appendChild(itemRoot); // 将书签根节点添加到书签列表节点

						a.href = urlManagement.getSourceURL(item.url); // 设置链接地址
						a.setAttribute("add_date", Math.round(item.lastVisit / 1000)); // 设置添加日期属性
						if (item.tags.length > 0) {
							a.setAttribute("tags", item.tags.join(",")); // 设置标签属性
						}
						a.textContent = item.title; // 设置链接文本
						// Chrome 只会解析包含换行符的文件
						var textSpan = document.createTextNode("\n"); // 创建换行文本节点
						folderBookmarksList.appendChild(textSpan); // 将换行文本节点添加到书签列表节点
					}
				});

				resolve(root.outerHTML); // 将根节点的 HTML 字符串传递给 Promise 对象
			});
		});
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		// 备份频率（3天）
		const interval = 3 * 24 * 60 * 60 * 1000;

		// 备份的最小文件大小（512字节）
		// 这是必要的，因为在数据库被销毁后，浏览器将以没有书签的状态启动，
		// 在这种情况下，书签备份文件不应被覆盖
		const minSize = 512;

		const checkAndExport = function () {
			if (!settingManagement.get("lastBookmarksBackup") || Date.now() - settingManagement.get("lastBookmarksBackup") > interval) {
				bookmarkManagement
					.export()
					.then(function (res) {
						if (res.length > minSize) {
							fs.writeFile(
								path.join(window.globalArgs["user-data-path"], "bookmarksBackup.html"), // 拼接备份文件路径
								res,
								{ encoding: "utf-8" },
								function (err) {
									if (err) {
										console.warn(err);
									}
								}
							);

							// 更新备份时间
							settingManagement.set("lastBookmarksBackup", Date.now());
						}
					})
					.catch((e) => console.warn("error generating bookmarks backup", e));
			}
		};

		// 延迟10秒后执行备份
		setTimeout(checkAndExport, 10000);

		// 每个周期的三分之一执行备份
		setInterval(checkAndExport, interval / 3);
	},
};

module.exports = bookmarkManagement;
