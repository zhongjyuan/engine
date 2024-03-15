var keyboardBinding = require("../keyboardBinding.js");

var { webviews } = require("../webviewManagement.js");

/**
 * 标签页音频管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日12:38:02
 */
const tabAudioManagement = {
	/**静音图标 */
	muteIcon: "carbon:volume-mute",

	/**音量图标 */
	volumeIcon: "carbon:volume-up",

	/**
	 * 获取音频控制按钮
	 * @param {*} tabId - 选项卡ID
	 * @returns {HTMLElement} - 音频控制按钮元素
	 */
	getButton: function (tabId) {
		var button = document.createElement("button");
		button.className = "tab-icon tab-audio-button i";

		button.setAttribute("data-tab", tabId);
		button.setAttribute("role", "button");

		button.addEventListener("click", function (e) {
			e.stopPropagation();
			tabAudioManagement.toggleAudio(tabId);
		});

		tabAudioManagement.updateButton(tabId, button);

		return button;
	},

	/**
	 * 更新音频控制按钮的状态
	 * @param {*} tabId - 选项卡ID
	 * @param {HTMLElement} [button] - 音频控制按钮元素
	 */
	updateButton: function (tabId, button) {
		var tab = window.tabs.get(tabId);
		var button = button || document.querySelector('.tab-audio-button[data-tab="{id}"]'.replace("{id}", tabId));

		var muteIcon = tabAudioManagement.muteIcon;
		var volumeIcon = tabAudioManagement.volumeIcon;

		if (tab.muted) {
			button.hidden = false;
			button.classList.remove(volumeIcon);
			button.classList.add(muteIcon);
		} else if (tab.hasAudio) {
			button.hidden = false;
			button.classList.add(volumeIcon);
			button.classList.remove(muteIcon);
		} else {
			button.hidden = true;
		}
	},

	/**
	 * 切换选项卡的音频状态
	 * @param {*} tabId - 选项卡ID
	 */
	toggleAudio: function (tabId) {
		var tab = window.tabs.get(tabId);
		// can be muted if has audio, can be unmuted if muted
		if (tab.hasAudio || tab.muted) {
			webviews.callAsync(tabId, "setAudioMuted", !tab.muted);
			window.tabs.update(tabId, { muted: !tab.muted });
		}
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		keyboardBinding.defineShortcut("toggleTabAudio", function () {
			tabAudioManagement.toggleAudio(window.tabs.getSelected());
		});

		webviews.bindEvent("media-started-playing", function (tabId) {
			window.tabs.update(tabId, { hasAudio: true });
		});

		webviews.bindEvent("media-paused", function (tabId) {
			window.tabs.update(tabId, { hasAudio: false });
		});
	},
};

tabAudioManagement.initialize();

module.exports = tabAudioManagement;
