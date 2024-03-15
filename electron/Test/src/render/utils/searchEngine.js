const settingManagement = require("../../settings/renderSettingManagement.js");

/**
 * 搜索引擎对象，包含获取当前搜索引擎和根据URL获取搜索引擎的方法
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月19日19:30:47
 */
var searchEngine = {
	/**支持的搜索引擎列表，包含名称、搜索URL、建议URL等信息 */
	searchEngines: {
		DuckDuckGo: {
			name: "DuckDuckGo", // 搜索引擎名称
			searchURL: "https://duckduckgo.com/?q=%s&t=min", // 搜索URL，"%s"将被替换为实际搜索词
			suggestionsURL: "https://ac.duckduckgo.com/ac/?q=%s&type=list&t=min", // 搜索建议URL
			queryParam: "q", // URL中搜索词的参数名
		},
		Google: {
			name: "Google",
			searchURL: "https://www.google.com/search?q=%s", // 搜索URL
			queryParam: "q",
		},
		Bing: {
			name: "Bing",
			searchURL: "https://www.bing.com/search?q=%s", // 搜索URL
			suggestionsURL: "https://www.bing.com/osjson.aspx?query=%s", // 搜索建议URL
			queryParam: "q",
		},
		Yahoo: {
			name: "Yahoo",
			searchURL: "https://search.yahoo.com/yhs/search?p=%s", // 搜索URL
			suggestionsURL: "https://search.yahoo.com/sugg/os?command=%s&output=fxjson", // 搜索建议URL
			queryParam: "p",
		},
		Baidu: {
			name: "Baidu",
			searchURL: "https://www.baidu.com/s?wd=%s",
			suggestionsURL: "https://www.baidu.com/su?wd=%s&action=opensearch",
			queryParam: "wd",
		},
		StartPage: {
			name: "StartPage",
			searchURL: "https://www.startpage.com/do/search?q=%s",
			suggestionsURL: "https://www.startpage.com/cgi-bin/csuggest?query=%s&format=json",
			queryParam: "q",
		},
		Ecosia: {
			name: "Ecosia",
			searchURL: "https://www.ecosia.org/search?q=%s",
			suggestionsURL: "https://ac.ecosia.org/autocomplete?q=%s&type=list",
			queryParam: "q",
		},
		Qwant: {
			name: "Qwant",
			searchURL: "https://www.qwant.com/?q=%s",
			suggestionsURL: "https://api.qwant.com/api/suggest/?q=%s&client=opensearch",
			queryParam: "q",
		},
		Wikipedia: {
			name: "Wikipedia",
			searchURL: "https://wikipedia.org/w/index.php?search=%s",
			suggestionsURL: "https://wikipedia.org/w/api.php?action=opensearch&search=%s",
			queryParam: "search",
		},
		Yandex: {
			name: "Yandex",
			searchURL: "https://yandex.com/search/?text=%s",
			suggestionsURL: "https://suggest.yandex.com/suggest-ff.cgi?part=%s",
			queryParam: "text",
		},
		none: {
			name: "none",
			searchURL: "http://%s",
		},
	},

	/**默认搜索引擎名称 */
	defaultSearchEngine: "DuckDuckGo",

	/**当前搜索引擎对象，包含搜索引擎的名称和搜索URL */
	currentSearchEngine: {
		/**搜索引擎名称 */
		name: "",
		/**搜索URL，其中"%s"将被替换为实际搜索词 */
		searchURL: "%s",
	},

	/**
	 * 获取当前搜索引擎对象
	 * @returns {Object} 当前搜索引擎对象
	 */
	getCurrent: function () {
		// 返回当前搜索引擎对象
		return searchEngine.currentSearchEngine;
	},

	/**
	 * 根据URL获取搜索引擎和搜索词
	 * @param {string} url - URL字符串
	 * @returns {Object|null} 搜索引擎和搜索词对象，如果无法匹配则返回null
	 */
	getSearch: function (url) {
		/**搜索引擎URL对象 */
		var urlObj;

		try {
			// 将URL字符串转换为URL对象
			urlObj = new URL(url);
		} catch (e) {
			return null;
		}

		for (var e in searchEngine.searchEngines) {
			if (!searchEngine.searchEngines[e].urlObj) {
				continue;
			}

			if (searchEngine.searchEngines[e].urlObj.hostname === urlObj.hostname && searchEngine.searchEngines[e].urlObj.pathname === urlObj.pathname) {
				if (urlObj.searchParams.get(searchEngine.searchEngines[e].queryParam)) {
					return {
						engine: searchEngine.searchEngines[e].name, // 匹配的搜索引擎名称
						search: urlObj.searchParams.get(searchEngine.searchEngines[e].queryParam), // 匹配的搜索词
					};
				}
			}
		}

		return null;
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		// 初始化搜索引擎的URL对象
		for (const e in searchEngine.searchEngines) {
			try {
				// 初始化搜索URL为URL对象
				searchEngine.searchEngines[e].urlObj = new URL(searchEngine.searchEngines[e].searchURL);
			} catch (e) {}
		}

		// 监听设置项"searchEngine"的变化，更新当前搜索引擎
		settingManagement.listen("searchEngine", function (value) {
			if (value && value.name) {
				// 如果设置了搜索引擎名称，则更新当前搜索引擎为指定的搜索引擎
				searchEngine.currentSearchEngine = searchEngine.searchEngines[value.name];
			} else if (value && value.url) {
				var searchDomain;

				try {
					// 提取自定义搜索引擎的域名
					searchDomain = new URL(value.url).hostname.replace("www.", "");
				} catch (e) {}

				searchEngine.currentSearchEngine = {
					name: searchDomain || "custom", // 自定义搜索引擎的名称
					searchURL: value.url, // 自定义搜索引擎的搜索URL
					custom: true, // 标记为自定义搜索引擎
				};
			} else {
				// 使用默认搜索引擎
				searchEngine.currentSearchEngine = searchEngine.searchEngines[searchEngine.defaultSearchEngine];
			}
		});
	},
};

searchEngine.initialize();

// 渲染进程中存在 module
if (typeof module !== "undefined") {
	module.exports = searchEngine;
}
