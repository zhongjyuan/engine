const settingManagement = require("../settings/renderSettingManagement.js");

const searchEngine = require("./utils/searchEngine.js");

const uiManagement = require("./uiManagement.js");
const { webviews } = require("./webviewManagement.js");

const scriptManagement = require("./scriptManagement.js");

const pageTranslations = require("./pageTranslations.js");

/**
 * webview 菜单管理对象(用于管理浏览器上下文菜单功能)
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日11:16:07
 */
const webviewMenuManagement = {
	/** 菜单数据 */
	menuData: null,

	/** 下一个菜单 ID */
	nextMenuId: 0,

	/** 菜单回调函数集合 */
	menuCallbacks: {},

	/**
	 * 显示菜单
	 * @param {*} data 菜单数据
	 * @param {*} extraData 额外数据
	 */
	show: function (data, extraData) {
		var menuSections = [];

		var currentTab = window.tabs.get(window.tabs.getSelected());

		const openInBackground = !settingManagement.get("openTabsInForeground");

		/* Picture in Picture */

		if (extraData.hasVideo) {
			menuSections.push([
				{
					label: l("pictureInPicture"),
					click: function () {
						webviews.callAsync(window.tabs.getSelected(), "send", ["enterPictureInPicture", { x: data.x, y: data.y }]);
					},
				},
			]);
		}

		/* Spellcheck */

		if (data.misspelledWord) {
			var suggestionEntries = data.dictionarySuggestions.slice(0, 3).map(function (suggestion) {
				return {
					label: suggestion,
					click: function () {
						webviews.callAsync(window.tabs.getSelected(), "replaceMisspelling", suggestion);
					},
				};
			});

			if (!currentTab.private) {
				suggestionEntries.push({
					label: l("addToDictionary"),
					click: function () {
						window.ipc.invoke("addWordToSpellCheckerDictionary", data.misspelledWord);
					},
				});
			}

			if (suggestionEntries.length > 0) {
				menuSections.push(suggestionEntries);
			}
		}

		var link = data.linkURL;

		// show link items for embedded frames, but not the top-level page (which will also be listed as a frameURL)
		if (!link && data.frameURL && data.frameURL !== currentTab.url) {
			link = data.frameURL;
		}

		/* srcdoc is used in reader view, but it can't actually be opened anywhere outside of the reader page */
		if (link === "about:srcdoc") {
			link = null;
		}

		var mediaURL = data.srcURL;

		if (link) {
			var linkActions = [
				{
					label: link.length > 60 ? link.substring(0, 60) + "..." : link,
					enabled: false,
				},
			];

			if (!currentTab.private) {
				linkActions.push({
					label: l("openInNewTab"),
					click: function () {
						uiManagement.addTab(window.tabs.add({ url: link }), { enterEditMode: false, openInBackground: openInBackground });
					},
				});
			}

			linkActions.push({
				label: l("openInNewPrivateTab"),
				click: function () {
					uiManagement.addTab(window.tabs.add({ url: link, private: true }), { enterEditMode: false, openInBackground: openInBackground });
				},
			});

			linkActions.push({
				label: l("saveLinkAs"),
				click: function () {
					webviews.callAsync(window.tabs.getSelected(), "downloadURL", [link]);
				},
			});

			menuSections.push(linkActions);
		} else if (mediaURL && data.mediaType === "image") {
			/* images */
			/* we don't show the image actions if there are already link actions, because it makes the menu too long and because the image actions typically aren't very useful if the image is a link */

			var imageActions = [
				{
					label: mediaURL.length > 60 ? mediaURL.substring(0, 60) + "..." : mediaURL,
					enabled: false,
				},
			];

			imageActions.push({
				label: l("viewImage"),
				click: function () {
					webviews.update(window.tabs.getSelected(), mediaURL);
				},
			});

			if (!currentTab.private) {
				imageActions.push({
					label: l("openImageInNewTab"),
					click: function () {
						uiManagement.addTab(window.tabs.add({ url: mediaURL }), { enterEditMode: false, openInBackground: openInBackground });
					},
				});
			}

			imageActions.push({
				label: l("openImageInNewPrivateTab"),
				click: function () {
					uiManagement.addTab(window.tabs.add({ url: mediaURL, private: true }), { enterEditMode: false, openInBackground: openInBackground });
				},
			});

			menuSections.push(imageActions);

			menuSections.push([
				{
					label: l("saveImageAs"),
					click: function () {
						webviews.callAsync(window.tabs.getSelected(), "downloadURL", [mediaURL]);
					},
				},
			]);
		}

		/* selected text */

		var selection = data.selectionText;

		if (selection) {
			var textActions = [
				{
					label: l("searchWith").replace("%s", searchEngine.getCurrent().name),
					click: function () {
						var newTabId = window.tabs.add({
							url: searchEngine.getCurrent().searchURL.replace("%s", window.encodeURIComponent(selection)),
							private: currentTab.private,
						});

						uiManagement.addTab(newTabId, {
							enterEditMode: false,
							openInBackground: false,
						});
					},
				},
			];
			menuSections.push(textActions);
		}

		var clipboardActions = [];

		if (mediaURL && data.mediaType === "image") {
			clipboardActions.push({
				label: l("copy"),
				click: function () {
					webviews.callAsync(window.tabs.getSelected(), "copyImageAt", [data.x, data.y]);
				},
			});
		} else if (selection) {
			clipboardActions.push({
				label: l("copy"),
				click: function () {
					webviews.callAsync(window.tabs.getSelected(), "copy");
				},
			});
		}

		if (data.editFlags && data.editFlags.canPaste) {
			clipboardActions.push({
				label: l("paste"),
				click: function () {
					webviews.callAsync(window.tabs.getSelected(), "paste");
				},
			});
		}

		if (link || (mediaURL && !mediaURL.startsWith("blob:"))) {
			if (link && link.startsWith("mailto:")) {
				var ematch = link.match(/(?<=mailto:)[^\?]+/);
				if (ematch) {
					clipboardActions.push({
						label: l("copyEmailAddress"),
						click: function () {
							window.clipboard.writeText(ematch[0]);
						},
					});
				}
			} else {
				clipboardActions.push({
					label: l("copyLink"),
					click: function () {
						window.clipboard.writeText(link || mediaURL);
					},
				});
			}
		}

		if (clipboardActions.length !== 0) {
			menuSections.push(clipboardActions);
		}

		var navigationActions = [
			{
				label: l("goBack"),
				click: function () {
					try {
						webviews.goBackIgnoringRedirects(window.tabs.getSelected());
					} catch (e) {}
				},
			},
			{
				label: l("goForward"),
				click: function () {
					try {
						webviews.callAsync(window.tabs.getSelected(), "goForward");
					} catch (e) {}
				},
			},
		];

		menuSections.push(navigationActions);

		/* inspect element */
		menuSections.push([
			{
				label: l("inspectElement"),
				click: function () {
					webviews.callAsync(window.tabs.getSelected(), "inspectElement", [data.x || 0, data.y || 0]);
				},
			},
		]);

		/* Userscripts */

		var contextMenuScripts = scriptManagement.getMatchingScripts(window.tabs.get(window.tabs.getSelected()).url).filter(function (script) {
			if (script.options["run-at"] && script.options["run-at"].includes("context-menu")) {
				return true;
			}
		});

		if (contextMenuScripts.length > 0) {
			var scriptActions = [
				{
					label: l("runUserscript"),
					enabled: false,
				},
			];

			contextMenuScripts.forEach(function (script) {
				scriptActions.push({
					label: script.name,
					click: function () {
						scriptManagement.runScript(window.tabs.getSelected(), script);
					},
				});
			});

			menuSections.push(scriptActions);
		}

		var translateMenu = {
			label: "Translate Page (Beta)",
			submenu: [],
		};

		const translateLangList = pageTranslations.getLanguageList();

		translateLangList[0].forEach(function (language) {
			translateMenu.submenu.push({
				label: language.name,
				click: function () {
					pageTranslations.translateInto(window.tabs.getSelected(), language.code);
				},
			});
		});

		if (translateLangList[1].length > 0) {
			translateMenu.submenu.push({
				type: "separator",
			});

			translateLangList[1].forEach(function (language) {
				translateMenu.submenu.push({
					label: language.name,
					click: function () {
						pageTranslations.translateInto(window.tabs.getSelected(), language.code);
					},
				});
			});
		}

		translateMenu.submenu.push({
			type: "separator",
		});

		translateMenu.submenu.push({
			label: "Send Feedback",
			click: function () {
				uiManagement.addTab(
					window.tabs.add({
						url:
							"https://gitee.com/zhongjyuan-team/workbench/issues/new?issue%5Bassignee_id%5D=0&issue%5Bmilestone_id%5D=0" +
							window.encodeURIComponent(window.tabs.get(window.tabs.getSelected()).url),
					}),
					{ enterEditMode: false, openInBackground: false }
				);
			},
		});

		menuSections.push([translateMenu]);

		var offset = webviews.getViewBounds();

		webviewMenuManagement.open(menuSections, data.x + offset.x, data.y + offset.y);
	},

	/**
	 * 打开菜单
	 * @param {*} menuTemplate 菜单模板
	 * @param {*} x X 坐标
	 * @param {*} y Y 坐标
	 */
	open: function (menuTemplate, x, y) {
		webviewMenuManagement.nextMenuId++;
		webviewMenuManagement.menuCallbacks[nextMenuId] = {};

		var nextItemId = 0;

		/**
		 * 准备发送菜单数据
		 * @param {*} menuPart 菜单部分
		 * @returns
		 */
		function prepareToSend(menuPart) {
			// 如果菜单部分是数组，则递归处理每个元素
			if (menuPart instanceof Array) {
				return menuPart.map((item) => prepareToSend(item));
			} else {
				// 如果有子菜单，则递归处理子菜单
				if (menuPart.submenu) {
					menuPart.submenu = prepareToSend(menuPart.submenu);
				}

				// 如果菜单项有点击事件处理函数
				if (typeof menuPart.click === "function") {
					// 将点击事件处理函数保存到回调函数集合中
					menuCallbacks[nextMenuId][nextItemId] = menuPart.click;

					// 将菜单项的点击事件设置为对应的回调函数 ID
					menuPart.click = nextItemId;

					nextItemId++;
				}

				return menuPart;
			}
		}

		// 准备发送的菜单数据，将菜单项的点击事件处理函数替换为回调函数 ID
		window.ipc.send("open-context-menu", {
			id: webviewMenuManagement.nextMenuId,
			template: prepareToSend(menuTemplate),
			x,
			y,
		});
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		webviews.bindEvent("context-menu", function (tabId, data) {
			webviewMenuManagement.menuData = data;
			webviews.callAsync(window.tabs.getSelected(), "send", ["getContextMenuData", { x: data.x, y: data.y }]);
		});

		webviews.bindIPC("contextMenuData", function (tabId, args) {
			webviewMenuManagement.show(webviewMenuManagement.menuData, args[0]);
			webviewMenuManagement.menuData = null;
		});

		/** 监听上下文菜单项被选择的事件 */
		window.ipc.on("context-menu-item-selected", function (e, data) {
			// 调用对应的回调函数
			webviewMenuManagement.menuCallbacks[data.menuId][data.itemId]();
		});

		/** 监听上下文菜单将关闭的事件 */
		window.ipc.on("context-menu-will-close", function (e, data) {
			// 延迟关闭事件，直到收到选中事件
			setTimeout(function () {
				// 从回调函数集合中删除对应的菜单 ID
				delete menuCallbacks[data.menuId];
			}, 16);
		});
	},
};

module.exports = webviewMenuManagement;
