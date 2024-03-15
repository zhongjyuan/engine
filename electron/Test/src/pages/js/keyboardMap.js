/**
 * 键盘映射对象(与render/utils/keyboardMap功能一样[无node])
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月22日10:57:35
 */
const keyboardMap = {
	/**默认的键盘快捷键映射 */
	default: {
		/**最小化窗口(mod+q) */
		quit: "mod+q",

		/**新建标签页(mod+t) */
		addTab: "mod+t",
		/**新建隐私标签页(shift+mod+p) */
		addPrivateTab: "shift+mod+p",
		/**复制标签页(shift+mod+d) */
		duplicateTab: "shift+mod+d",
		/**恢复关闭的标签页(shift+mod+t) */
		restoreTab: "shift+mod+t",
		/**将当前标签页向左移动(option+mod+shift+left) */
		moveTabLeft: "option+mod+shift+left",
		/**将当前标签页向右移动(option+mod+shift+right) */
		moveTabRight: "option+mod+shift+right",
		/**切换到下一个标签页(["option+mod+right", "ctrl+tab", "shift+mod+pagedown"]) */
		switchToNextTab: ["option+mod+right", "ctrl+tab", "shift+mod+pagedown"],
		/**切换到上一个标签页(["option+mod+left", "shift+ctrl+tab", "shift+mod+pageup"]) */
		switchToPreviousTab: ["option+mod+left", "shift+ctrl+tab", "shift+mod+pageup"],
		/**切换标签页声音(shift+mod+m) */
		toggleTabAudio: "shift+mod+m",
		/**关闭标签页(mod+w) */
		closeTab: "mod+w",
		/**关闭所有标签页(option+mod+shift+n) */
		closeAllTabs: "option+mod+shift+n",

		/**新建任务(mod+n) */
		addTask: "mod+n",
		/**切换任务列表(shift+mod+e) */
		toggleTasks: "shift+mod+e",
		/**切换到下一个任务(mod+]) */
		switchToNextTask: "mod+]",
		/**切换到上一个任务(mod+[) */
		switchToPreviousTask: "mod+[",

		/**新建窗口(shift+mod+n) */
		addWindow: "shift+mod+n",
		/**关闭窗口(shift+mod+w) */
		closeWindow: "shift+mod+w",
		/**刷新页面(["mod+r", "f5"]) */
		reload: ["mod+r", "f5"],
		/**忽略缓存刷新页面(mod+f5) */
		reloadIgnoringCache: "mod+f5",

		/**返回上一页(mod+left) */
		goBack: "mod+left",
		/**前往下一页(mod+right) */
		goForward: "mod+right",
		/**前往第一个标签页(shift+mod+9) */
		gotoFirstTab: "shift+mod+9",
		/**前往最后一个标签页(mod+9) */
		gotoLastTab: "mod+9",

		/**进入编辑模式(["mod+l", "mod+k"]) */
		enterEditMode: ["mod+l", "mod+k"],
		/**切换阅读模式(shift+mod+r) */
		toggleReaderView: "shift+mod+r",

		/**添加到收藏夹(mod+d) */
		addToFavorites: "mod+d",
		/**显示书签(shift+mod+b) */
		showBookmarks: "shift+mod+b",

		/**显示菜单(ctrl+m) */
		showMenu: "ctrl+m",
		/**显示历史记录(shift+mod+h) */
		showHistory: "shift+mod+h",

		/**运行快捷键(mod+e) */
		runShortcut: "mod+e",

		/**完成搜索栏输入(mod+enter) */
		completeSearchbar: "mod+enter",
		/**打开链接(mod+enter) */
		followLink: "mod+enter",

		/**填充密码(mod+\\) */
		fillPassword: "mod+\\",
	},

	/**
	 * 根据用户设置与默认配置构建键盘快捷键映射
	 * @param {*} settings 用户设置
	 * @returns 覆盖后的键盘快捷键映射
	 */
	convert: function (userKeyboardMap) {
		/**创建默认键盘快捷键映射的副本 */
		var newKeyboardMap = Object.assign({}, keyboardMap.default);

		if (userKeyboardMap) {
			// 根据用户设置覆盖默认键盘快捷键映射
			Object.keys(newKeyboardMap).forEach(function (key) {
				if (userKeyboardMap[key]) {
					newKeyboardMap[key] = userKeyboardMap[key];
				}
			});
		}

		return newKeyboardMap;
	},
};
