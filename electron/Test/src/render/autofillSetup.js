const settingManagement = require("./../settings/renderSettingManagement.js");

const setupDialog = require("./password/setupDialog.js");
const passwordFactory = require("./password/passwordFactory.js");

/**
 * 自动填充设置对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日11:09:22
 */
const autofillSetup = {
	/**
	 * 检查密码管理器是否配置，并显示设置对话框
	 * @returns {void}
	 */
	check: function () {
		// 获取活动密码管理器
		const manager = passwordFactory.getActivePasswordManager();
		if (!manager) {
			return;
		}

		manager
			.checkIfConfigured() // 检查密码管理器是否配置
			.then((configured) => {
				// 如果没有配置，则显示设置对话框
				if (!configured) {
					setupDialog.show(manager);
				}
			})
			.catch((err) => {
				console.error(err);
			});
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		// 监听密码管理器设置变化
		settingManagement.listen("passwordManager", function (manager) {
			// 在浏览器启动时和管理器启用后触发检查
			if (manager) {
				autofillSetup.check();
			}
		});
	},
};

module.exports = autofillSetup;
