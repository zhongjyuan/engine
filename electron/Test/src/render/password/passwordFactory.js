const settingManagement = require("../../settings/renderSettingManagement.js");

const { webviews } = require("../webviewManagement.js");

const statisticalManagement = require("../statisticalManagement.js");

const keyboardBindings = require("../keyboardBinding.js");

const KeychainManagement = require("./KeychainManagement.js"); // 密码管理器之一 KeychainManagement 的实现
const BitwardenManagement = require("./BitwardenManagement.js"); // 密码管理器之一 BitwardenManagement 的实现
const OnePasswordManagement = require("./OnePasswordManagement.js"); // 密码管理器之一 OnePasswordManagement 的实现

/**
 * 密码管理工厂对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日09:39:21
 */
const passwordFactory = {
	// 支持的密码管理器列表，每个密码管理器都应该有一个 getSuggestions(domain) 方法，
	// 该方法返回一个 Promise，其中包含与给定域名匹配的凭据建议。

	/**密码管理器列表 */
	managers: [new BitwardenManagement(), new OnePasswordManagement(), new KeychainManagement()],

	/**
	 * 返回活动密码管理器
	 * @returns
	 */
	getActivePasswordManager: function () {
		if (passwordFactory.managers.length === 0) {
			return null;
		}

		// 获取当前选定的密码管理器设置
		const managerSetting = settingManagement.get("passwordManager");

		// 如果没有选定的密码管理器，则使用内置的密码管理器
		if (managerSetting == null) {
			return passwordFactory.managers.find((mgr) => mgr.name === "Built-in password manager");
		}

		// 查找选定的密码管理器
		return passwordFactory.managers.find((mgr) => mgr.name === managerSetting.name);
	},

	/**
	 * 返回已配置的密码管理器
	 * @returns
	 */
	getConfiguredPasswordManager: async function () {
		const manager = passwordFactory.getActivePasswordManager();
		if (!manager) {
			return null;
		}

		// 检查是否已配置密码管理器
		const configured = await manager.checkIfConfigured();
		if (!configured) {
			return null;
		}

		return manager;
	},

	/**
	 * 显示密码存储的主密码提示对话框。
	 * @param {*} manager
	 * @returns
	 */
	promptForMasterPassword: async function (manager) {
		return new Promise((resolve, reject) => {
			// 显示密码提示对话框，以获取主密码
			const { password } = window.ipc.sendSync("prompt", {
				text: l("passwordManagerUnlock").replace("%p", manager.name), // 对话框的文本
				values: [{ placeholder: l("password"), id: "password", type: "password" }], // 输入框设置
				ok: l("dialogConfirmButton"), // 确认按钮文本
				cancel: l("dialogSkipButton"), // 取消按钮文本
				height: 175, // 对话框高度
			});

			if (password === null || password === "") {
				reject(new Error("No password provided"));
			} else {
				resolve(password);
			}
		});
	},

	/**
	 * 解锁密码管理器。
	 * @param {*} manager 密码管理器对象
	 * @returns 解锁成功则返回 true，否则返回 false。
	 */
	unlock: async function (manager) {
		let success = false;

		while (!success) {
			let password;

			try {
				// 获取主密码
				password = await passwordFactory.promptForMasterPassword(manager);
			} catch (e) {
				// 如果对话框被取消，则跳出循环
				break;
			}

			try {
				// 尝试解锁密码管理器
				success = await manager.unlockStore(password);
			} catch (e) {
				// 如果密码不正确，则继续循环
			}
		}

		// 返回解锁是否成功的标志
		return success;
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		// 当页面预加载脚本检测到带有用户名和密码的表单时调用。
		webviews.bindIPC("password-autofill", function (tab, args, frameId, frameURL) {
			// 这里使用 frameURL 而不是 tab URL 是很重要的，因为请求的 iframe 的域名可能与顶级页面的域名不匹配

			// 获取当前页面的主机名
			const hostname = new URL(frameURL).hostname;

			passwordFactory.getConfiguredPasswordManager().then(async (manager) => {
				if (!manager) {
					return;
				}

				if (!manager.isUnlocked()) {
					await passwordFactory.unlock(manager);
				}

				var formattedHostname = hostname;
				if (formattedHostname.startsWith("www.")) {
					formattedHostname = formattedHostname.slice(4);
				}

				manager
					.getSuggestions(formattedHostname)
					.then((credentials) => {
						if (credentials != null) {
							// 如果有建议凭据，则发送到页面
							webviews.callAsync(tab, "sendToFrame", [
								frameId,
								"password-autofill-match",
								{
									credentials,
									hostname,
								},
							]);
						}
					})
					.catch((e) => {
						console.error("Failed to get password suggestions: " + e.message);
					});
			});
		});

		webviews.bindIPC("password-autofill-check", function (tab, args, frameId) {
			if (passwordFactory.getActivePasswordManager()) {
				webviews.callAsync(tab, "sendToFrame", [frameId, "password-autofill-enabled"]);
			}
		});

		keyboardBindings.defineShortcut("fillPassword", function () {
			webviews.callAsync(window.tabs.getSelected(), "send", ["password-autofill-shortcut"]);
		});

		statisticalManagement.registerGetter("passwordManager", function () {
			return passwordFactory.getActivePasswordManager().name;
		});
	},
};

module.exports = passwordFactory;
