const Mousetrap = require("mousetrap");

const settingManagement = require("../settings/renderSettingManagement.js");

const keyboardMap = require("./utils/keyboardMap.js");

const modalMode = require("./modalMode.js");

const { webviews } = require("./webviewManagement.js");

/**
 * 键盘绑定对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日12:07:57
 */
const keyboardBinding = {
	/**用于存储所有已注册的快捷键 */
	shortcutsList: [],

	/**用于跟踪已注册的 Mousetrap 绑定 */
	registeredMousetrapBindings: {},

	/**从设置中获取用户的键盘映射 */
	userKeyboardMap: keyboardMap.convert(settingManagement.get("keyMap")),

	/**
	 * 检查是否可以运行快捷键
	 * @param {string} combo - 快捷键组合
	 * @param {function} callback - 回调函数，用于返回是否可以运行快捷键的结果
	 */
	checkShortcutCanRun: function (combo, callback) {
		// 检查浏览器 UI 是否获得焦点

		// 如果浏览器 UI 中有输入元素获得焦点，则无法运行快捷键
		if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
			callback(false);
		}

		// 检查 webview 中是否有输入元素获得焦点
		else {
			webviews.callAsync(
				window.tabs.getSelected(),
				"executeJavaScript",
				`
					document.activeElement.tagName === "INPUT"
					|| document.activeElement.tagName === "TEXTAREA"
					|| document.activeElement.tagName === "IFRAME"
					|| (function () {
						var n = document.activeElement;
						while (n) {
							if (n.getAttribute && n.getAttribute("contenteditable")) {
								return true;
							}
							n = n.parentElement;
						}
						return false;
					})()
				`,
				function (err, isInputFocused) {
					if (err) {
						console.warn(err);
						return;
					}
					callback(isInputFocused === false);
				}
			);
		}
	},

	/**
	 * 定义快捷键
	 * @param {string | {keys: string[]}} keysOrKeyMapName - 快捷键组合或键盘映射名称
	 * @param {function} callback - 快捷键触发时的回调函数
	 * @param {object} options - 可选参数对象
	 */
	defineShortcut: function (keysOrKeyMapName, callback, options = {}) {
		// 从键盘映射中获取绑定
		var binding = keysOrKeyMapName.keys ? keysOrKeyMapName.keys : keyboardBinding.userKeyboardMap[keysOrKeyMapName];

		if (typeof binding === "string") {
			binding = [binding];
		}

		/**快捷键回调函数 */
		var shortcutCallback = function (e, combo) {
			// 除非是用于关闭模态对话框的组合键，否则在模态模式下禁用快捷键
			if (modalMode.enabled() && combo !== "esc") {
				return;
			}

			keyboardBinding.checkShortcutCanRun(combo, function (canRun) {
				if (canRun) {
					callback(e, combo); // 如果快捷键可运行，则执行回调函数
				}
			});
		};

		binding.forEach(function (keys) {
			keyboardBinding.shortcutsList.push({
				combo: keys,
				keys: keys.split("+"),
				callback: shortcutCallback,
				keyUp: options.keyUp || false,
			});

			// 使用 Mousetrap 注册快捷键
			if (!keyboardBinding.registeredMousetrapBindings[keys + (options.keyUp ? "-keyup" : "")]) {
				Mousetrap.bind(
					keys,
					function (e, combo) {
						keyboardBinding.shortcutsList.forEach(function (shortcut) {
							if (shortcut.combo === combo && (e.type === "keyup") === shortcut.keyUp) {
								shortcut.callback(e, combo); // 执行快捷键的回调函数
							}
						});
					},
					options.keyUp ? "keyup" : null
				);
				keyboardBinding.registeredMousetrapBindings[keys + (options.keyUp ? "-keyup" : "")] = true;
			}
		});
	},

	initialize: function () {
		let keyboardMap;

		// 获取键盘布局映射
		navigator.keyboard.getLayoutMap().then((map) => {
			keyboardMap = map;
		});

		// 绑定 webview 的 before-input-event 事件，用于处理快捷键
		webviews.bindEvent("before-input-event", function (tabId, input) {
			var expectedKeys = 1;

			// 考虑到输入.key 属性中没有的其他按键
			if (input.alt && input.key !== "Alt") {
				expectedKeys++;
			}

			if (input.shift && input.key !== "Shift") {
				expectedKeys++;
			}

			if (input.control && input.key !== "Control") {
				expectedKeys++;
			}

			if (input.meta && input.key !== "Meta") {
				expectedKeys++;
			}

			// 遍历所有快捷键，检查是否匹配当前输入的按键
			keyboardBinding.shortcutsList.forEach(function (shortcut) {
				// 根据快捷键类型（按下或释放）判断是否满足触发条件
				if ((shortcut.keyUp && input.type !== "keyUp") || (!shortcut.keyUp && input.type !== "keyDown")) {
					return;
				}

				var matches = true;
				var matchedKeys = 0;

				// 检查每个按键是否匹配快捷键的要求
				shortcut.keys.forEach(function (key) {
					// 检查输入键是否与快捷键的键匹配
					if (
						!(
							key === input.key.toLowerCase() ||
							(keyboardMap && key === keyboardMap.get(input.code)) ||
							(key === "esc" && input.key === "Escape") ||
							(key === "left" && input.key === "ArrowLeft") ||
							(key === "right" && input.key === "ArrowRight") ||
							(key === "up" && input.key === "ArrowUp") ||
							(key === "down" && input.key === "ArrowDown") ||
							(key === "alt" && (input.alt || input.key === "Alt")) ||
							(key === "option" && (input.alt || input.key === "Alt")) ||
							(key === "shift" && (input.shift || input.key === "Shift")) ||
							(key === "ctrl" && (input.control || input.key === "Control")) ||
							(key === "mod" && window.platformType === "mac" && (input.meta || input.key === "Meta")) ||
							(key === "mod" && window.platformType !== "mac" && (input.control || input.key === "Control"))
						)
					) {
						matches = false;
					} else {
						matchedKeys++;
					}
				});

				// 如果快捷键匹配且按键数量符合预期，则执行回调函数
				if (matches && matchedKeys === expectedKeys) {
					// 执行快捷键的回调函数
					shortcut.callback(null, shortcut.combo);
				}
			});
		});
	},
};

keyboardBinding.initialize();

module.exports = keyboardBinding;
