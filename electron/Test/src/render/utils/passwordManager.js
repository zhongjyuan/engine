const settingManagement = require("../../settings/renderSettingManagement.js");

/**
 * 密码管理者对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月19日19:45:43
 */
const passwordManager = {
	/**密码管理者集合 */
	passwordManages: {
		none: {
			name: "none",
		},
		Bitwarden: {
			name: "Bitwarden",
		},
		"1Password": {
			name: "1Password",
		},
		"Built-in password manager": {
			name: "Built-in password manager",
		},
	},

	/**当前密码管理者 */
	currentPasswordManager: null,

	/**
	 * 初始化
	 */
	initialize: function () {
		/**
		 * 监听 passwordManager 设置的更改，更新 passwordManage 变量的值。
		 * 如果新值存在且具有 name 属性，则将其赋值给 passwordManage，
		 * 否则将默认选项 "Built-in password manager" 赋给 passwordManage。
		 */
		settingManagement.listen("passwordManager", function (value) {
			if (value && value.name) {
				passwordManager.currentPasswordManager = value;
			} else {
				passwordManager.currentPasswordManager = passwordManager.passwordManages["Built-in password manager"];
			}
		});
	},
};

passwordManager.initialize();

window.passwordManager = passwordManager.currentPasswordManager;
