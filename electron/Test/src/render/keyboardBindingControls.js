const focusMode = require("./focusMode.js");
const modalMode = require("./modalMode.js");

const keyboardBindings = require("./keyboardBinding.js");

const uiManagement = require("./uiManagement.js");
const { webviews } = require("./webviewManagement.js");

const tabEditManagement = require("./navbar/tabEditManagement.js");

/**
 * 键盘绑定控制对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日12:12:21
 */
const keyboardBindingControl = {
	/**
	 * 初始化
	 */
	initialize: function () {
		// 定义一些常见的快捷键

		// 退出最小化
		keyboardBindings.defineShortcut("quit", function () {
			window.ipc.send("quit");
		});

		// 新增标签页
		keyboardBindings.defineShortcut("addTab", function () {
			// 如果处于专注模式，不执行操作
			if (modalMode.enabled()) {
				return;
			}

			// 如果处于焦点模式，发出警告提示
			if (focusMode.enabled()) {
				focusMode.warn();
				return;
			}

			// 执行新增标签页操作
			uiManagement.addTab();
		});

		// 新增隐私标签页
		keyboardBindings.defineShortcut("addPrivateTab", function () {
			// 如果处于专注模式，不执行操作
			if (modalMode.enabled()) {
				return;
			}

			// 如果处于焦点模式，发出警告提示
			if (focusMode.enabled()) {
				focusMode.warn();
				return;
			}

			// 执行新增隐私标签页操作
			uiManagement.addTab(
				window.tabs.add({
					private: true, // 开启隐私浏览
				})
			);
		});

		// 复制标签页
		keyboardBindings.defineShortcut("duplicateTab", function () {
			// 如果处于专注模式，不执行操作
			if (modalMode.enabled()) {
				return;
			}

			// 如果处于焦点模式，发出警告提示
			if (focusMode.enabled()) {
				focusMode.warn();
				return;
			}

			const sourceTab = window.tabs.get(window.tabs.getSelected());

			const newTabId = window.tabs.add({ ...sourceTab, id: undefined });

			uiManagement.addTab(newTabId, { enterEditMode: false });
		});

		// 进入标签页编辑模式
		keyboardBindings.defineShortcut("enterEditMode", function (e) {
			// 显示当前标签页的编辑器
			tabEditManagement.show(window.tabs.getSelected());

			return false;
		});

		// 运行快捷键
		keyboardBindings.defineShortcut("runShortcut", function (e) {
			// 显示带有感叹号的标签页编辑器
			tabEditManagement.show(window.tabs.getSelected(), "!");
		});

		// 关闭标签页
		keyboardBindings.defineShortcut("closeTab", function (e) {
			// 执行关闭当前标签页操作
			uiManagement.closeTab(window.tabs.getSelected());
		});

		// 将标签页向左移动
		keyboardBindings.defineShortcut("moveTabLeft", function (e) {
			// 执行将当前标签页向左移动操作
			uiManagement.moveTabLeft(window.tabs.getSelected());
		});

		// 将标签页向右移动
		keyboardBindings.defineShortcut("moveTabRight", function (e) {
			// 执行将当前标签页向右移动操作
			uiManagement.moveTabRight(window.tabs.getSelected());
		});

		// 恢复标签页
		keyboardBindings.defineShortcut("restoreTab", function (e) {
			// 如果处于焦点模式，发出警告提示
			if (focusMode.enabled()) {
				focusMode.warn();
				return;
			}

			var restoredTab = window.tasks.getSelected().tabHistory.pop();

			// 如果历史记录为空，则不执行操作
			if (!restoredTab) {
				return;
			}

			// 执行恢复标签页操作
			uiManagement.addTab(window.tabs.add(restoredTab), {
				enterEditMode: false,
			});
		});

		// 添加到收藏夹
		keyboardBindings.defineShortcut("addToFavorites", function (e) {
			// 显示标签页编辑器（不带参数）
			tabEditManagement.show(window.tabs.getSelected(), null, false);

			// 点击收藏夹按钮
			tabEditManagement.container.querySelector(".bookmarks-button").click();
		});

		// 显示收藏夹
		keyboardBindings.defineShortcut("showBookmarks", function () {
			// 显示带有书签的标签页编辑器
			tabEditManagement.show(window.tabs.getSelected(), "!bookmarks ");
		});

		// cmd+x should switch to tab x. Cmd+9 should switch to the last tab

		// 循环定义快捷键，数字 1 到 8
		for (var i = 1; i < 9; i++) {
			(function (i) {
				keyboardBindings.defineShortcut({ keys: "mod+" + i }, function (e) {
					var currentIndex = window.tabs.getIndex(window.tabs.getSelected());
					var newTab = window.tabs.getAtIndex(currentIndex + i) || window.tabs.getAtIndex(currentIndex - i);
					// 切换到指定标签页
					if (newTab) {
						uiManagement.switchTab(newTab.id);
					}
				});

				keyboardBindings.defineShortcut({ keys: "shift+mod+" + i }, function (e) {
					var currentIndex = window.tabs.getIndex(window.tabs.getSelected());
					var newTab = window.tabs.getAtIndex(currentIndex - i) || window.tabs.getAtIndex(currentIndex + i);
					// 切换到指定标签页
					if (newTab) {
						uiManagement.switchTab(newTab.id);
					}
				});
			})(i);
		}

		// 切换到最后一个标签页
		keyboardBindings.defineShortcut("gotoLastTab", function (e) {
			// 切换到最后一个标签页
			uiManagement.switchTab(window.tabs.getAtIndex(window.tabs.count() - 1).id);
		});

		// 切换到第一个标签页
		keyboardBindings.defineShortcut("gotoFirstTab", function (e) {
			// 切换到第一个
			uiManagement.switchTab(window.tabs.getAtIndex(0).id);
		});

		keyboardBindings.defineShortcut({ keys: "esc" }, function (e) {
			// 当没有占位请求且当前焦点不在输入框中时，调用当前选中标签页的停止方法
			if (webviews.placeholderRequests.length === 0 && document.activeElement.tagName !== "INPUT") {
				webviews.callAsync(window.tabs.getSelected(), "stop");
			}

			// 隐藏编辑器（可能是一个浏览器扩展中的编辑器）
			tabEditManagement.hide();

			if (modalMode.enabled() && modalMode.onDismiss) {
				modalMode.onDismiss();
				modalMode.onDismiss = null;
			}

			// 退出全屏模式
			webviews.callAsync(window.tabs.getSelected(), "executeJavaScript", "if(document.webkitIsFullScreen){document.webkitExitFullscreen()}");

			// 将焦点设置在当前选中的标签页上
			webviews.callAsync(window.tabs.getSelected(), "focus");
		});

		keyboardBindings.defineShortcut("goBack", function (d) {
			// 调用当前选中标签页的后退方法
			webviews.callAsync(window.tabs.getSelected(), "goBack");
		});

		keyboardBindings.defineShortcut("goForward", function (d) {
			// 调用当前选中标签页的前进方法
			webviews.callAsync(window.tabs.getSelected(), "goForward");
		});

		keyboardBindings.defineShortcut("switchToPreviousTab", function (d) {
			var currentIndex = window.tabs.getIndex(window.tabs.getSelected());
			var previousTab = window.tabs.getAtIndex(currentIndex - 1);

			// 切换到上一个标签页
			if (previousTab) {
				uiManagement.switchTab(previousTab.id);
			}

			// 切换到最后一个标签页
			else {
				uiManagement.switchTab(window.tabs.getAtIndex(window.tabs.count() - 1).id);
			}
		});

		keyboardBindings.defineShortcut("switchToNextTab", function (d) {
			var currentIndex = window.tabs.getIndex(window.tabs.getSelected());
			var nextTab = window.tabs.getAtIndex(currentIndex + 1);

			// 切换到下一个标签页
			if (nextTab) {
				uiManagement.switchTab(nextTab.id);
			}

			// 切换到第一个标签页
			else {
				uiManagement.switchTab(window.tabs.getAtIndex(0).id);
			}
		});

		keyboardBindings.defineShortcut("switchToNextTask", function (d) {
			if (focusMode.enabled()) {
				focusMode.warn();
				return;
			}

			const taskSwitchList = window.tasks.filter((t) => !window.tasks.isCollapsed(t.id));

			const currentTaskIdx = taskSwitchList.findIndex((t) => t.id === window.tasks.getSelected().id);

			const nextTask = taskSwitchList[currentTaskIdx + 1] || taskSwitchList[0];

			// 切换到下一个任务
			uiManagement.switchTask(nextTask.id);
		});

		keyboardBindings.defineShortcut("switchToPreviousTask", function (d) {
			if (focusMode.enabled()) {
				focusMode.warn();
				return;
			}

			const taskSwitchList = window.tasks.filter((t) => !window.tasks.isCollapsed(t.id));

			const currentTaskIdx = taskSwitchList.findIndex((t) => t.id === window.tasks.getSelected().id);

			const previousTask = taskSwitchList[currentTaskIdx - 1] || taskSwitchList[taskSwitchList.length - 1];

			// 切换到上一个任务
			uiManagement.switchTask(previousTask.id);
		});

		// shift+option+cmd+x 应该切换到任务 x

		for (var i = 1; i < 10; i++) {
			(function (i) {
				keyboardBindings.defineShortcut({ keys: "shift+option+mod+" + i }, function (e) {
					if (focusMode.enabled()) {
						focusMode.warn();
						return;
					}

					const taskSwitchList = window.tasks.filter((t) => !window.tasks.isCollapsed(t.id));

					// 切换到指定的任务
					if (taskSwitchList[i - 1]) {
						uiManagement.switchTask(taskSwitchList[i - 1].id);
					}
				});
			})(i);
		}

		keyboardBindings.defineShortcut("closeAllTabs", function (d) {
			// 销毁所有当前的标签页，并创建一个新的空白标签页，类似于创建一个新窗口，旧窗口消失。
			if (focusMode.enabled()) {
				focusMode.warn();
				return;
			}

			var tset = window.tabs.get();
			for (var i = 0; i < tset.length; i++) {
				uiManagement.destroyTab(tset[i].id);
			}

			// 创建一个新的空白标签页
			uiManagement.addTab();
		});

		// 关闭窗口
		keyboardBindings.defineShortcut("closeWindow", function () {
			window.ipc.invoke("close");
		});

		keyboardBindings.defineShortcut("reload", function () {
			// 重新加载原始页面而不是再次显示错误页面
			if (window.tabs.get(window.tabs.getSelected()).url.startsWith(webviews.internalPages.error)) {
				webviews.update(window.tabs.getSelected(), new URL(window.tabs.get(window.tabs.getSelected()).url).searchParams.get("url"));
			}

			// 这不能是一个错误页面，使用正常的重新加载方法
			else {
				webviews.callAsync(window.tabs.getSelected(), "reload");
			}
		});

		keyboardBindings.defineShortcut("reloadIgnoringCache", function () {
			// 忽略缓存重新加载页面
			webviews.callAsync(window.tabs.getSelected(), "reloadIgnoringCache");
		});

		keyboardBindings.defineShortcut("showHistory", function () {
			// 显示历史记录
			tabEditManagement.show(window.tabs.getSelected(), "!history ");
		});
	},
};

module.exports = keyboardBindingControl;
