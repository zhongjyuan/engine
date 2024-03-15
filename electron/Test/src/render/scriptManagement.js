const settingManagement = require("../settings/renderSettingManagement.js");

const urlManagement = require("./utils/urlManagement.js");
const { webviews } = require("./webviewManagement.js");

const statisticalManagement = require("./statisticalManagement.js");

const tabEditManagement = require("./navbar/tabEditManagement.js");

const bangPlugin = require("./searchbar/plugins/bangs.js");
const searchbarPlugins = require("./searchbar/searchbarPluginManagement.js");

/**
 * 脚本管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日11:48:46
 */
const scriptManagement = {
	/**存储用户脚本的数组，每个元素包含 options 和 content 字段 */
	scripts: [],

	/**
	 * 检查 URL 是否与通配符模式匹配
	 * @param {*} url 待匹配的 URL
	 * @param {*} pattern 通配符模式
	 * @returns 返回匹配结果，true 表示匹配成功，false 表示匹配失败
	 */
	urlMatchesPattern: function (url, pattern) {
		var idx = -1;
		var parts = pattern.split("*");

		for (var i = 0; i < parts.length; i++) {
			idx = url.indexOf(parts[i], idx);
			if (idx === -1) {
				return false;
			}

			idx += parts[i].length;
		}

		return idx !== -1;
	},

	/**
	 * 解析 Tampermonkey 脚本的特性（metadata）
	 * @param {*} content 脚本内容
	 * @returns 解析后的脚本特性对象
	 */
	parseTampermonkeyFeatures: function (content) {
		var parsedFeatures = {};
		var foundFeatures = false;

		var lines = content.split("\n");

		var isInFeatures = false;
		for (var i = 0; i < lines.length; i++) {
			if (lines[i].trim() === "// ==UserScript==") {
				// 开始标记
				isInFeatures = true;

				continue;
			}

			if (lines[i].trim() === "// ==/UserScript==") {
				// 结束标记
				isInFeatures = false;

				break;
			}

			if (isInFeatures && lines[i].startsWith("//")) {
				foundFeatures = true;

				var feature = lines[i].replace("//", "").trim();
				var featureName = feature.split(" ")[0];
				var featureValue = feature.replace(featureName + " ", "").trim();
				featureName = featureName.replace("@", "");

				// 特殊情况：查找当前语言环境下的本地化名称
				if (featureName.startsWith("name:") && featureName.split(":")[1].substring(0, 2) === navigator.language.substring(0, 2)) {
					featureName = "name:local";
				}

				if (parsedFeatures[featureName]) {
					parsedFeatures[featureName].push(featureValue);
				} else {
					parsedFeatures[featureName] = [featureValue];
				}
			}
		}

		if (foundFeatures) {
			return parsedFeatures;
		} else {
			return null;
		}
	},

	/**
	 * 加载用户脚本
	 */
	loadScripts: function () {
		scriptManagement.scripts = [];

		var path = require("path");
		var scriptDir = path.join(window.globalArgs["user-data-path"], "userscripts");

		fs.readdir(scriptDir, function (err, files) {
			if (err || files.length === 0) {
				return;
			}

			// 存储脚本到内存中
			files.forEach(function (filename) {
				if (filename.endsWith(".js")) {
					fs.readFile(path.join(scriptDir, filename), "utf-8", function (err, file) {
						if (err || !file) {
							return;
						}

						var domain = filename.slice(0, -3);
						if (domain.startsWith("www.")) {
							domain = domain.slice(4);
						}

						if (!domain) {
							return;
						}

						var tampermonkeyFeatures = scriptManagement.parseTampermonkeyFeatures(file);
						if (tampermonkeyFeatures) {
							var scriptName = tampermonkeyFeatures["name:local"] || tampermonkeyFeatures.name;

							if (scriptName) {
								scriptName = scriptName[0];
							} else {
								scriptName = filename;
							}

							scriptManagement.scripts.push({ options: tampermonkeyFeatures, content: file, name: scriptName });
						} else {
							// legacy script
							if (domain === "global") {
								scriptManagement.scripts.push({
									options: {
										match: ["*"],
									},
									content: file,
									name: filename,
								});
							} else {
								scriptManagement.scripts.push({
									options: {
										match: ["*://" + domain],
									},
									content: file,
									name: filename,
								});
							}
						}
					});
				}
			});
		});
	},

	/**
	 * 获取匹配的脚本数组
	 * @param {*} src 当前页面的 URL
	 * @returns 返回匹配到的脚本数组
	 */
	getMatchingScripts: function (src) {
		return scriptManagement.scripts.filter(function (script) {
			if (
				(!script.options.match && !script.options.include) || // 没有匹配条件和包含条件时默认匹配
				(script.options.match && script.options.match.some((pattern) => scriptManagement.urlMatchesPattern(src, pattern))) || // 匹配条件满足
				(script.options.include && script.options.include.some((pattern) => scriptManagement.urlMatchesPattern(src, pattern))) // 包含条件满足
			) {
				// 排除条件不满足
				if (!script.options.exclude || !script.options.exclude.some((pattern) => scriptManagement.urlMatchesPattern(src, pattern))) {
					return true;
				}
			}
		});
	},

	/**
	 * 运行脚本
	 * @param {*} tabId 当前标签页的 ID
	 * @param {*} script 脚本对象
	 * @returns
	 */
	runScript: function (tabId, script) {
		if (urlManagement.isInternalURL(window.tabs.get(tabId).url)) {
			return;
		}

		webviews.callAsync(tabId, "executeJavaScript", [script.content, false, null]);
	},

	/**
	 * 页面加载完成后执行的回调函数
	 * @param {*} tabId 当前标签页的 ID
	 * @returns
	 */
	onPageLoad: function (tabId) {
		if (scriptManagement.scripts.length === 0) {
			return;
		}

		var src = window.tabs.get(tabId).url;

		scriptManagement.getMatchingScripts(src).forEach(function (script) {
			// TODO 根据正确的时间运行不同类型的脚本
			if (
				!script.options["run-at"] ||
				script.options["run-at"].some((i) => ["document-start", "document-body", "document-end", "document-idle"].includes(i))
			) {
				scriptManagement.runScript(tabId, script);
			}
		});
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		statisticalManagement.registerGetter("userscriptCount", function () {
			return scriptManagement.scripts.length;
		});

		settingManagement.listen("userscriptsEnabled", function (value) {
			if (value === true) {
				scriptManagement.loadScripts();
			} else {
				scriptManagement.scripts = [];
			}
		});
		
		webviews.bindEvent("dom-ready", scriptManagement.onPageLoad);

		bangPlugin.registerCustomBang({
			phrase: "!run",
			snippet: l("runUserscript"),
			isAction: false,
			showSuggestions: function (text, input, event) {
				searchbarPlugins.reset("bangs");

				var isFirst = true;
				scriptManagement.scripts.forEach(function (script) {
					if (script.name.toLowerCase().startsWith(text.toLowerCase())) {
						searchbarPlugins.addResult("bangs", {
							title: script.name,
							fakeFocus: isFirst && text,
							click: function () {
								tabEditManagement.hide();
								scriptManagement.runScript(window.tabs.getSelected(), script);
							},
						});
						isFirst = false;
					}
				});
			},
			fn: function (text) {
				if (!text) {
					return;
				}

				var matchingScript = scriptManagement.scripts.find((script) => script.name.toLowerCase().startsWith(text.toLowerCase()));
				if (matchingScript) {
					scriptManagement.runScript(window.tabs.getSelected(), matchingScript);
				}
			},
		});
	},
};

module.exports = scriptManagement;
