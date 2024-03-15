const quickScore = require("quick-score").quickScore;

var urlParser = require("../../utils/urlManagement.js");

var uiManagement = require("../../uiManagement.js");

var searchbarPluginManagement = require("../searchbarPluginManagement.js");

/**
 * 搜索打开标签页插件对象(在打开的标签页中搜索匹配的选项卡)
 */
const searchOpenTabPlugin = {
	/**
	 * 在打开的标签页中搜索匹配的选项卡
	 * @param {*} text - 用户输入的文本
	 * @param {*} input - 搜索栏输入框
	 * @param {*} event - 事件对象
	 * @returns - 匹配的结果
	 */
	search: function (text, input, event) {
		searchbarPluginManagement.reset("openTabs"); // 重置搜索栏插件

		var matches = []; // 存储匹配结果的数组
		var searchText = text.toLowerCase(); // 将用户输入的文本转换为小写

		// 获取当前任务和选定的标签页
		var currentTask = tasks.getSelected();
		var currentTab = currentTask.tabs.getSelected();

		// 遍历所有任务和标签页，进行匹配
		window.tasks.forEach(function (task) {
			task.tabs.forEach(function (tab) {
				if (tab.id === currentTab || !tab.title || !tab.url) {
					return; // 跳过选定的标签页以及没有标题或URL的标签页
				}

				var tabUrl = urlParser.basicURL(tab.url); // 不搜索协议

				var exactMatch = tab.title.toLowerCase().indexOf(searchText) !== -1 || tabUrl.toLowerCase().indexOf(searchText) !== -1;
				var fuzzyTitleScore = quickScore(tab.title.substring(0, 50), text);
				var fuzzyUrlScore = quickScore(tabUrl, text);

				// 如果是精确匹配或者模糊匹配得分大于0.35，则将匹配结果添加到数组中
				if (exactMatch || fuzzyTitleScore > 0.35 || fuzzyUrlScore > 0.35) {
					matches.push({
						task: task,
						tab: tab,
						score: fuzzyTitleScore + fuzzyUrlScore,
					});
				}
			});
		});

		// 如果没有匹配结果，则返回
		if (matches.length === 0) {
			return;
		}

		// 评分匹配结果，并按得分从高到低排序，只选择前两个最匹配的结果
		function scoreMatch(match) {
			let score = 0;
			if (match.task.id === currentTask.id) {
				score += 0.2; // 如果任务ID与当前任务ID相同，则得分+0.2
			}
			const age = Date.now() - (match.tab.lastActivity || 0);

			score += 0.3 / (1 + Math.exp(age / (30 * 24 * 60 * 60 * 1000))); // 根据标签页最近活动时间计算得分
			return score;
		}

		var finalMatches = matches
			.map(function (match) {
				match.score += scoreMatch(match);
				return match;
			})
			.sort(function (a, b) {
				return b.score - a.score;
			})
			.slice(0, 2); // 只选择前两个最匹配的结果

		// 将最匹配的结果添加到搜索栏插件的结果列表中
		finalMatches.forEach(function (match) {
			var data = {
				icon: "carbon:arrow-up-right",
				title: match.tab.title,
				secondaryText: urlParser.basicURL(match.tab.url),
			};

			if (match.task.id !== currentTask.id) {
				var taskName = match.task.name || l("taskN").replace("%n", window.tasks.getIndex(match.task.id) + 1);
				data.metadata = [taskName];
			}

			data.click = function () {
				var currentTabUrl = window.tabs.get(window.tabs.getSelected()).url;
				if (!currentTabUrl) {
					uiManagement.closeTab(window.tabs.getSelected());
				}

				if (match.task.id !== currentTask.id) {
					uiManagement.switchTask(match.task.id);
				}

				uiManagement.switchTab(match.tab.id);
			};

			searchbarPluginManagement.addResult("openTabs", data); // 将结果添加到搜索栏插件
		});
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		searchbarPluginManagement.register("openTabs", {
			index: 3,
			trigger: function (text) {
				return text.length > 2; // 当文本长度大于2时触发搜索
			},
			showResults: searchOpenTabPlugin.search, // 显示匹配结果的回调函数
		});
	},
};

module.exports = searchOpenTabPlugin;
