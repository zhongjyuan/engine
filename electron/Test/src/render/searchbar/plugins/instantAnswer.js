var urlParser = require("../../utils/urlManagement.js");
var searchEngine = require("../../utils/searchEngine.js");
var { autocompleteURL } = require("../../utils/autoManagement.js");

var searchbar = require("../searchbar.js");
var searchbarPluginManagement = require("../searchbarPluginManagement.js");

/**
 * 存储处理不同类型即时回答的函数
 */
var instantAnswers = {
	/**
	 * 处理颜色代码类型的即时回答
	 * @param {*} searchText - 搜索文本
	 * @param {*} answer - 回答内容
	 * @returns 处理后的数据
	 */
	color_code: function (searchText, answer) {
		var data = {
			title: searchText, // 使用搜索文本作为标题
			descriptionBlock: answer.replace(/\n/g, " · ").replace(/\s~\s/g, " · "), // 格式化并替换描述文字
			attribution: instantAnswerPlugin.ddgAttribution, // 使用 ddgAttribution 进行归属设置
		};

		// 从回答中提取 RGB 值
		var rgb = answer.split(" ~ ").filter(function (format) {
			return format.startsWith("RGBA");
		});

		if (rgb[0]) {
			data.colorCircle = rgb[0]; // 将第一个 RGB 值作为颜色圆圈
		}

		return data; // 返回处理后的数据
	},

	/**
	 * 处理货币信息类型的即时回答
	 * @param {*} searchText - 搜索文本
	 * @param {*} answer - 回答内容
	 * @returns 处理后的数据
	 */
	currency_in: function (searchText, answer) {
		var title = "";
		if (typeof answer === "string") {
			// 如果只有一种货币
			title = answer;
		} else {
			// 如果有多种货币
			var currencyArr = [];
			for (var countryCode in answer) {
				currencyArr.push(answer[countryCode] + " (" + countryCode + ")");
			}

			title = currencyArr.join(", "); // 将多种货币的标题以逗号分隔拼接起来
		}

		var descriptionBlock;
		if (answer.data) {
			descriptionBlock = answer.data.title; // 如果有数据，则使用数据的标题作为描述
		} else {
			descriptionBlock = l("DDGAnswerSubtitle"); // 否则使用默认的描述
		}

		return {
			title: title, // 设置标题
			descriptionBlock: descriptionBlock, // 设置描述
			attribution: instantAnswerPlugin.ddgAttribution, // 使用 ddgAttribution 进行归属设置
		};
	},
};

/**
 * 即时答案插件对象
 */
const instantAnswerPlugin = {
	/**使用国际化函数获取“来自 DuckDuckGo 的结果”文本 */
	ddgAttribution: l("resultsFromDDG"),

	/**
	 * 从文本中移除 HTML 标记
	 * @param {string} text - 要处理的文本
	 * @returns {string} - 移除标记后的文本
	 */
	removeTags: function (text) {
		return text.replace(/<.*?>/g, ""); // 使用正则表达式替换所有 HTML 标记为空字符串
	},

	/**
	 * 在搜索栏中显示即时答案
	 *
	 * @param {string} text - 输入的文本
	 * @param {HTMLElement} input - 关联的输入框元素
	 * @param {Event} event - 触发的事件
	 * @returns {void}
	 */
	showSearchbarInstantAnswers: function (text, input, event) {
		// 仅当搜索引擎设置为 DuckDuckGo 时才向 DDG API 发送请求
		if (searchEngine.getCurrent().name !== "DuckDuckGo") {
			return;
		}

		// 如果搜索栏已经关闭，则不发送请求
		if (!searchbar.associatedInput) {
			return;
		}

		fetch("https://api.duckduckgo.com/?t=min&skip_disambig=1&no_redirect=1&format=json&q=" + encodeURIComponent(text))
			.then(function (data) {
				return data.json();
			})
			.then(function (res) {
				searchbarPluginManagement.reset("instantAnswers");

				var data;

				const hasAnswer = instantAnswers[res.AnswerType] || (res.Answer && typeof res.Answer === "string");

				// 如果有自定义格式的答案，则使用自定义格式
				if (instantAnswers[res.AnswerType]) {
					data = instantAnswers[res.AnswerType](text, res.Answer);

					// 使用默认格式
				} else if (res.Abstract || (res.Answer && typeof res.Answer === "string")) {
					data = {
						title: (typeof res.Answer === "string" && removeTags(res.Answer)) || removeTags(res.Heading),
						descriptionBlock: res.Abstract || l("DDGAnswerSubtitle"),
						attribution: instantAnswerPlugin.ddgAttribution,
						url: res.AbstractURL || text,
					};

					if (res.Image && !res.ImageIsLogo) {
						data.image = res.Image;
						if (data.image.startsWith("/")) {
							// 从 2020 年 11 月开始，DDG API 返回的是相对路径而不是绝对路径
							data.image = "https://duckduckgo.com" + data.image;
						}
					}

					// 显示引用链接
				} else if (res.RelatedTopics) {
					res.RelatedTopics.slice(0, 3).forEach(function (item) {
						// DDG API 返回的实体名称在 <a> 标签内
						var entityName = item.Result.replace(/.*>(.+?)<.*/g, "$1");

						// 文本以实体名称开头，删除它
						var desc = item.Text.replace(entityName, "");

						// 尝试将给定的 URL 转换为维基百科链接
						var entityNameRegex = /https:\/\/duckduckgo.com\/(.*?)\/?$/;

						var url;
						if (entityNameRegex.test(item.FirstURL)) {
							url = "https://wikipedia.org/wiki/" + entityNameRegex.exec(item.FirstURL)[1];
						} else {
							url = item.FirstURL;
						}

						searchbarPluginManagement.addResult(
							"instantAnswers",
							{
								title: entityName,
								descriptionBlock: desc,
								url: url,
							},
							{ allowDuplicates: true }
						);
					});
				}

				if (data) {
					// 答案更相关，应显示在顶部
					if (hasAnswer) {
						searchbarPluginManagement.setTopAnswer("instantAnswers", data);
					} else {
						searchbarPluginManagement.addResult("instantAnswers", data, { allowDuplicates: true });
					}
				}

				// 建议的站点链接
				if (searchbarPluginManagement.getResultCount("places") < 4 && res.Results && res.Results[0] && res.Results[0].FirstURL) {
					var url = res.Results[0].FirstURL;

					const suggestedSiteData = {
						icon: "carbon:earth-filled",
						title: urlParser.basicURL(url),
						url: url,
						classList: ["ddg-answer"],
					};

					if (searchbarPluginManagement.getTopAnswer()) {
						searchbarPluginManagement.addResult("instantAnswers", suggestedSiteData);
					} else {
						if (event && event.keyCode !== 8) {
							// 按下删除键时不自动完成
							const autocompletionType = autocompleteURL(input, url);

							if (autocompletionType !== -1) {
								suggestedSiteData.fakeFocus = true;
							}
						}
						searchbarPluginManagement.setTopAnswer("instantAnswers", suggestedSiteData);
					}
				}

				// 如果显示位置信息，则显示“在 OpenStreetMap 上搜索”链接
				var entitiesWithLocations = ["location", "country", "u.s. state", "protected area"];

				if (entitiesWithLocations.indexOf(res.Entity) !== -1) {
					searchbarPluginManagement.addResult("instantAnswers", {
						icon: "carbon:search",
						title: res.Heading,
						secondaryText: l("searchWith").replace("%s", "OpenStreetMap"),
						classList: ["ddg-answer"],
						url: "https://www.openstreetmap.org/search?query=" + encodeURIComponent(res.Heading),
					});
				}
			})
			.catch(function (e) {
				console.error(e);
			});
	},

	/**
	 * 初始化搜索栏插件
	 */
	initialize: function () {
		searchbarPluginManagement.register("instantAnswers", {
			index: 4, // 插件显示的顺序
			trigger: function (text) {
				// 触发条件：文本长度大于 3，不是可能的 URL，当前标签页不是隐私模式
				return text.length > 3 && !urlParser.isPossibleURL(text) && !window.tabs.get(window.tabs.getSelected()).private;
			},
			showResults: debounce(instantAnswerPlugin.showSearchbarInstantAnswers, 150), // 显示即时答案的回调函数，并进行防抖处理
		});
	},
};

module.exports = instantAnswerPlugin;
