var { autocomplete } = require("../../utils/autoManagement.js");

var searchEngine = require("../../utils/searchEngine.js");

var settingManagement = require("../../settingManagement.js");

var searchbarPluginManagement = require("../searchbarPluginManagement.js");
var searchbar = require("../searchbar.js");

var tabEditManagement = require("../../navbar/tabEditManagement.js");

/**
 * 感叹号插件对象(自定义命令)
 */
const bangsPlugin = {
	/**自定义感叹号指令数组 */
	customBangs: [],

	/**感叹号指令使用次数，格式为 {bang: count} */
	bangUseCounts: JSON.parse(localStorage.getItem("bangUseCounts") || "{}"),

	/**
	 * 注册自定义感叹号指令
	 * @param {*} data - 自定义感叹号指令的属性信息
	 * @param {string} data.phrase - 感叹号指令的短语
	 * @param {string} data.snippet - 感叹号指令的代码片段或操作
	 * @param {number} [data.score=256000] - 感叹号指令的得分，用于排序搜索结果
	 * @param {string} [data.icon="carbon:terminal"] - 感叹号指令的图标
	 * @param {boolean} [data.showSuggestions=false] - 是否显示感叹号指令的建议
	 * @param {Function} data.fn - 感叹号指令的回调函数，执行指令的具体操作
	 * @param {boolean} [data.isCustom=true] - 是否为自定义感叹号指令
	 * @param {boolean} [data.isAction=false] - 感叹号指令是否为一个操作
	 */
	registerCustomBang: function (data) {
		// 将自定义感叹号指令添加到 customBangs 数组中
		bangsPlugin.customBangs.push({
			// 感叹号指令的短语
			phrase: data.phrase,
			// 感叹号指令的代码片段或操作
			snippet: data.snippet,
			// 感叹号指令的得分，用于排序搜索结果
			score: data.score || 256000,
			// 感叹号指令的图标
			icon: data.icon || "carbon:terminal",
			// 是否显示感叹号指令的建议
			showSuggestions: data.showSuggestions || false,
			// 感叹号指令的回调函数，执行指令的具体操作
			fn: data.fn,
			// 是否为自定义感叹号指令
			isCustom: typeof data.isCustom !== "undefined" ? data.isCustom : true,
			// 感叹号指令是否为一个操作
			isAction: data.isAction || false,
		});
	},
	/**
	 * 搜索自定义感叹号指令
	 * @param {*} text - 感叹号指令的短语关键词
	 * @returns {Array} - 包含匹配到的所有自定义感叹号指令的数组
	 */
	searchCustomBangs: function (text) {
		// 使用 Array.prototype.filter() 方法遍历 customBangs 数组，返回符合条件的元素组成的新数组
		return bangsPlugin.customBangs.filter(function (item) {
			// 返回 item.phrase 以 text 开头的元素，即感叹号指令的短语与搜索关键词相匹配
			return item.phrase.indexOf(text) === 0;
		});
	},
	/**
	 * 获取自定义感叹号指令
	 * @param {*} text - 感叹号指令的文本
	 * @returns {*} - 返回匹配的自定义感叹号指令，若没有匹配项则返回 undefined
	 */
	getCustomBang: function (text) {
		// 从感叹号指令文本中提取出指令短语
		var bang = text.split(" ")[0];

		// 使用 Array.prototype.filter() 方法遍历 customBangs 数组，返回符合条件的第一个元素
		return bangsPlugin.customBangs.filter(function (item) {
			// 返回 item.phrase 与指令短语完全匹配的元素，即查找指令短语对应的自定义感叹号指令
			return item.phrase === bang;
		})[0]; // 返回第一个符合条件的元素
	},

	/**
	 * 将感叹号指令使用次数保存到本地存储
	 */
	saveBangUseCounts: function () {
		window.debounce(function () {
			// 使用 localStorage.setItem() 方法将 bangUseCounts 对象转换为字符串并保存在 "bangUseCounts" 键下
			localStorage.setItem("bangUseCounts", JSON.stringify(bangsPlugin.bangUseCounts));
		}, 10000);
	},

	/**
	 * 增加感叹号指令使用次数
	 * @param {*} bang - 感叹号指令短语
	 */
	incrementBangCount: function (bang) {
		// 增加对应指令的使用次数
		if (bangsPlugin.bangUseCounts[bang]) {
			bangsPlugin.bangUseCounts[bang]++; // 如果该指令已经被记录，则增加该指令的使用次数
		} else {
			bangsPlugin.bangUseCounts[bang] = 1; // 否则，将该指令的使用次数设置为 1
		}

		// 防止数据过大
		if (bangsPlugin.bangUseCounts[bang] > 100) {
			// 如果某个指令的使用次数超过 100 次，则对所有指令的使用次数进行清理
			for (var key in bangsPlugin.bangUseCounts) {
				// 将所有指令的使用次数乘以 0.8，相当于将所有指令的使用次数降低 20%
				bangsPlugin.bangUseCounts[key] = Math.floor(bangsPlugin.bangUseCounts[key] * 0.8);

				// 如果某个指令的使用次数小于 2 次，则将其从记录中删除
				if (bangsPlugin.bangUseCounts[key] < 2) {
					delete bangsPlugin.bangUseCounts[key];
				}
			}
		}

		// 保存更新后的感叹号指令使用次数信息到本地存储
		bangsPlugin.saveBangUseCounts();
	},

	/**
	 * 展示感叹号搜索结果
	 *
	 * @param {*} text - 搜索文本
	 * @param {*} results - 搜索结果数组
	 * @param {*} input - 搜索输入框的 DOM 元素
	 * @param {*} event - 触发搜索的事件
	 * @param {*} limit - 展示结果的限制数量，默认为 5
	 */
	showBangSearchResults: function (text, results, input, event, limit = 5) {
		// 重置“bangs”搜索栏插件
		searchbarPluginManagement.reset("bangs");

		// 根据得分对搜索结果进行排序
		results.sort(function (a, b) {
			var aScore = a.score || 1; // 如果a没有得分，则默认为1
			var bScore = b.score || 1; // 如果b没有得分，则默认为1
			if (bangsPlugin.bangUseCounts[a.phrase]) {
				aScore *= bangsPlugin.bangUseCounts[a.phrase]; // 如果a的短语在bangUseCounts中有记录，则将得分乘以对应的使用次数
			}
			if (bangsPlugin.bangUseCounts[b.phrase]) {
				bScore *= bangsPlugin.bangUseCounts[b.phrase]; // 如果b的短语在bangUseCounts中有记录，则将得分乘以对应的使用次数
			}

			return bScore - aScore; // 根据得分降序排序
		});

		// 遍历排序后的结果数组，最多展示指定数量的结果
		results.slice(0, limit).forEach(function (result, idx) {
			// 自动完成感叹号搜索（bang），但允许用户继续键入

			// 创建包含图标、标题等信息的数据对象
			var data = {
				icon: result.icon, // 图标
				iconImage: result.image, // 图像
				title: result.snippet, // 标题
				secondaryText: result.phrase, // 副标题
				fakeFocus: text !== "!" && idx === 0, // 虚拟焦点，如果文本不是感叹号并且是第一个结果，则为true
			};

			// 定义点击结果的行为
			data.click = function (e) {
				// 如果结果是一个动作且具有fn属性，则直接触发该动作而不需要额外的文本提示
				if (result.isAction && result.fn) {
					searchbar.openURL(result.phrase, e); // 打开相应的URL
					return;
				}

				setTimeout(function () {
					bangsPlugin.incrementBangCount(result.phrase); // 增加对应指令的使用次数

					input.value = result.phrase + " "; // 将结果短语加上空格赋值给搜索输入框
					input.focus(); // 将焦点设置到搜索输入框上

					// 为自定义bangs显示搜索建议
					if (result.showSuggestions) {
						result.showSuggestions("", input, event);
					}
				}, 66);
			};

			searchbarPluginManagement.addResult("bangs", data); // 将结果添加到搜索插件的结果列表中
		});
	},

	/**
	 * 获取并展示感叹号搜索结果
	 *
	 * @param {*} text - 搜索文本
	 * @param {*} input - 搜索输入框的 DOM 元素
	 * @param {*} event - 触发搜索的事件
	 */
	getBangSearchResults: function (text, input, event) {
		// 如果文本中包含空格，则显示自定义 bang 的搜索建议（仅对自定义 bang 生效）
		if (text.indexOf(" ") !== -1) {
			var bang = bangsPlugin.getCustomBang(text);

			if (bang && bang.showSuggestions) {
				bang.showSuggestions(text.replace(bang.phrase, "").trimLeft(), input, event);
				return;
			} else if (text.trim().indexOf(" ") !== -1) {
				searchbarPluginManagement.reset("bangs");
				return;
			}
		}

		// 否则搜索感叹号指令

		var resultsPromise;

		// 如果当前搜索引擎是 DuckDuckGo 并且当前标签页不是隐私标签页，则从 DuckDuckGo 获取自动完成的搜索建议
		if (searchEngine.getCurrent().name === "DuckDuckGo" && !window.tabs.get(window.tabs.getSelected()).private) {
			resultsPromise = fetch("https://ac.duckduckgo.com/ac/?t=min&q=" + encodeURIComponent(text), {
				cache: "force-cache",
			}).then(function (response) {
				return response.json();
			});
		} else {
			// 否则返回一个空数组
			resultsPromise = new Promise(function (resolve, reject) {
				// 自动完成在按键被按下的同时进行会导致无法正常工作，因此添加一个小的延迟（待修复）
				setTimeout(function () {
					resolve([]);
				}, 0);
			});
		}

		resultsPromise.then(function (results) {
			if (text === "!") {
				// 如果正在列出所有指令，则限制网站结果的数量以便有足够的空间显示更多的浏览器指令
				// 但如果有搜索文本，则在其他地方对结果数量进行限制，并且这里需要包含低排名的结果
				// 以防它们根据使用情况被排序到顶部
				results = results.slice(0, 8);
			}

			results = results.concat(bangsPlugin.searchCustomBangs(text));
			if (text === "!") {
				bangsPlugin.showBangSearchResults(text, results, input, event);
				searchbarPluginManagement.addResult("bangs", {
					title: l("showMoreBangs"),
					icon: "carbon:chevron-down",
					click: function () {
						bangsPlugin.showBangSearchResults(text, results, input, event, Infinity);
					},
				});
			} else {
				bangsPlugin.showBangSearchResults(text, results, input, event);

				if (results[0] && event.keyCode !== 8) {
					autocomplete(input, [results[0].phrase]);
				}
			}
		});
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		searchbarPluginManagement.register("bangs", {
			index: 1,
			trigger: function (text) {
				return !!text && text.indexOf("!") === 0;
			},
			showResults: bangsPlugin.getBangSearchResults,
		});

		searchbarPluginManagement.registerURLHandler(function (url) {
			if (url.indexOf("!") === 0) {
				bangsPlugin.incrementBangCount(url.split(" ")[0]);

				var bang = bangsPlugin.getCustomBang(url);

				if ((!bang || !bang.isAction) && url.split(" ").length === 1 && !url.endsWith(" ")) {
					// the bang is non-custom or a custom bang that requires search text, so add a space after it
					tabEditManagement.show(window.tabs.getSelected(), url + " ");
					return true;
				} else if (bang) {
					// there is a custom bang that is an action or has search text, so it can be run
					tabEditManagement.hide();
					bang.fn(url.replace(bang.phrase, "").trimLeft());
					return true; // override the default action
				}
			}
		});

		const savedBangs = settingManagement.get("customBangs");
		if (savedBangs) {
			savedBangs.forEach((bang) => {
				if (!bang.phrase || !bang.redirect) return;
				bangsPlugin.registerCustomBang({
					phrase: `!${bang.phrase}`,
					snippet: `${bang.snippet}` ?? "",
					// isAction: true - skip search text entry if the bang does not include a search parameter
					isAction: !bang.redirect.includes("%s"),
					fn: function (text) {
						searchbar.openURL(bang.redirect.replace("%s", encodeURIComponent(text)));
					},
				});
			});
		}
	},
};

module.exports = bangsPlugin;
