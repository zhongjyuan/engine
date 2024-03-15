const Dexie = require("dexie");

/**
 * 数据库管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月19日18:48:13
 */
const databaseManagement = {
	/**数据库消息 */
	message: "Internal error opening backing store for indexedDB.open",

	/**数据库消息是否已显示 */
	showAlter: false,

	/**数据库对象 */
	databases: {
		render: new Dexie("z_browser"),
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		// 定义数据库的版本和数据结构
		databaseManagement.databases.render.version(1).stores({
			/*
			 * color - 页面图标的主色调
			 * pageHTML - 页面在最近访问时保存的 HTML，自 1.6.0 版本起已删除，因此此字段为空字符串。
			 * extractedText - 从 pageHTML 中提取的页面文本内容。
			 * searchIndex - 页面上的单词数组（从 extractedText 创建），用于全文搜索。
			 * isBookmarked - 页面是否已收藏
			 * extraData - 页面的其他元数据
			 */
			places: "++id, &url, title, color, visitCount, lastVisit, pageHTML, extractedText, *searchIndex, isBookmarked, *tags, metadata",
			readingList: "url, time, visitCount, pageHTML, article, extraData", // TODO remove this (reading list is no longer used)
		});

		// 打开数据库
		databaseManagement.databases.render
			.open()
			.then(function () {
				// 控制台输出日志，表示数据库已被成功打开
				console.log("database opened ", performance.now());
			})
			.catch(function (error) {
				// 如果错误信息中包含 dbErrorMessage，且 showAlter 为 false，则在页面上显示警告框
				if (error.message.indexOf(databaseManagement.message) !== -1 && !databaseManagement.showAlter) {
					window && window.alert && window.alert(l("multipleInstancesErrorMessage"));

					window.ipc.send("quit");

					databaseManagement.showAlter = true;
				}
			});
	},
};

databaseManagement.initialize();

module.exports = databaseManagement;
