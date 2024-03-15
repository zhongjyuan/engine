
const settingManagement = require("../settingManagement.js");

const uiManagement = require("../uiManagement.js");
const { webviews } = require("../webviewManagement.js");

const webviewMenuManagement = require("../webviewMenuManagement.js");

/**
 * 过滤/阻止按钮对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月18日18:35:45
 */
const blockingButton = {
	/**
	 * 启用内容阻止
	 * @param {*} url - 网址
	 * @returns {void}
	 */
	enable: function (url) {
		// 如果没有传入 url，则返回
		if (!url) {
			return;
		}

		// 获取网址的域名
		var domain = new URL(url).hostname;

		// 获取过滤设置
		var setting = settingManagement.get("filtering");

		// 如果设置不存在，则创建一个空对象
		if (!setting) {
			setting = {};
		}

		// 如果例外列表不存在，则创建一个空数组
		if (!setting.exceptionDomains) {
			setting.exceptionDomains = [];
		}

		// 将域名添加到例外列表中
		setting.exceptionDomains = setting.exceptionDomains.filter((d) => d.replace(/^www\./g, "") !== domain.replace(/^www\./g, ""));

		// 更新过滤设置
		settingManagement.set("filtering", setting);

		// 刷新当前标签页
		webviews.callAsync(window.tabs.getSelected(), "reload");
	},

	/**
	 * 禁用内容阻止
	 * @param {*} url - 网址
	 * @returns {void}
	 */
	disable: function (url) {
		// 如果没有传入 url，则返回
		if (!url) {
			return;
		}

		// 获取网址的域名
		var domain = new URL(url).hostname;

		// 获取过滤设置
		var setting = settingManagement.get("filtering");

		// 如果设置不存在，则创建一个空对象
		if (!setting) {
			setting = {};
		}

		// 如果例外列表不存在，则创建一个空数组
		if (!setting.exceptionDomains) {
			setting.exceptionDomains = [];
		}

		// 确保域名不是例外
		if (!setting.exceptionDomains.some((d) => d.replace(/^www\./g, "") === domain.replace(/^www\./g, ""))) {
			setting.exceptionDomains.push(domain); // 将域名添加到例外列表中
		}

		// 更新过滤设置
		settingManagement.set("filtering", setting);

		// 刷新当前标签页
		webviews.callAsync(window.tabs.getSelected(), "reload");
	},

	/**
	 * 更新按钮状态
	 * @param {*} tabId - 标签页ID
	 * @param {*} button - 按钮元素
	 * @returns
	 */
	update: function (tabId, button) {
		// 检查网址是否以 "http" 或 "https" 开头
		if (!window.tabs.get(tabId).url.startsWith("http") && !window.tabs.get(tabId).url.startsWith("https")) {
			button.hidden = true;
			return;
		}

		// 获取过滤设置
		var filteringSetting = settingManagement.get("filtering");

		// 如果过滤设置存在且阻止级别为 0，则隐藏按钮
		if (filteringSetting && filteringSetting.blockingLevel === 0) {
			button.hidden = true;
			return;
		}

		button.hidden = false;

		// 检查当前网址是否启用了内容阻止
		if (blockingButton.isEnabled(window.tabs.get(tabId).url)) {
			button.style.opacity = 1; // 设置按钮不透明度为 1
		} else {
			button.style.opacity = 0.4; // 设置按钮不透明度为 0.4
		}
	},

	/**
	 * 检查内容阻止是否启用
	 * @param {*} url - 网址
	 * @returns {boolean}
	 */
	isEnabled: function (url) {
		try {
			// 获取网址的域名
			var domain = new URL(url).hostname;
		} catch (e) {
			return false;
		}

		// 获取过滤设置
		var setting = settingManagement.get("filtering");

		// 检查域名是否在例外列表中
		return !setting || !setting.exceptionDomains || !setting.exceptionDomains.some((d) => d.replace(/^www\./g, "") === domain.replace(/^www\./g, ""));
	},

	/**
	 * 创建内容阻止切换按钮
	 * @returns {HTMLElement}
	 */
	create: function () {
		// 创建按钮元素
		const button = document.createElement("button");

		// 设置按钮类名
		button.className = "tab-editor-button i carbon:manage-protection";

		// 点击按钮时显示菜单
		button.addEventListener("click", function (e) {
			blockingButton.showMenu(button);
		});

		return button;
	},

	/**
	 * 显示菜单
	 * @param {*} button - 按钮元素
	 */
	showMenu: function (button) {
		// 获取当前标签页的网址
		var url = window.tabs.get(window.tabs.getSelected()).url;

		var menu = [
			[
				{
					type: "checkbox",
					label: l("enable"), // 国际化标签
					checked: blockingButton.isEnabled(url), // 检查内容阻止是否启用
					click: function () {
						// 如果内容阻止已启用，则禁用
						if (blockingButton.isEnabled(url)) {
							blockingButton.disable(url);
						}

						// 如果内容阻止未启用，则启用
						else {
							blockingButton.enable(url);
						}

						// 更新按钮状态
						blockingButton.update(window.tabs.getSelected(), button);
					},
				},
			],
			[
				{
					label: l("appMenuReportBug"), // 国际化标签
					click: function () {
						var newTabId = window.tabs.add({
							url: "https://gitee.com/zhongjyuan-team/workbench/issues/new?issue%5Bassignee_id%5D=0&issue%5Bmilestone_id%5D=0" + encodeURIComponent(url),
						});

						uiManagement.addTab(newTabId, { enterEditMode: false });
					},
				},
			],
		];

		// 打开远程菜单
		webviewMenuManagement.open(menu);
	},
};

module.exports = blockingButton;
