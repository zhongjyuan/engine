/**
 * 主题管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日19:34:42
 */
const themeManagement = {
	/**自动切换主题的定时器 */
	interval: null,

	/**
	 * 检查当前时间是否处于晚上
	 * @returns {boolean} 如果是晚上返回true，否则返回false
	 */
	isNightTime: function () {
		// 获取当前时间的小时数
		var hours = new Date().getHours();

		// 如果小时数大于21或者小于6，则表示处于晚上
		return hours > 21 || hours < 6;
	},

	/**
	 * 处理主题设置的改变
	 * @param {*} value - 新的主题设置值
	 */
	themeSettingsChanged: function (value) {
		/*
		 * value是darkMode设置的值
		 * 0 - 自动暗模式
		 * -1: 从不
		 * 0: 在夜间
		 * 1: 始终
		 * 2: 跟随系统（默认）
		 * true / false: 旧的设置值，转换为始终/系统
		 */

		// 清除现有的主题切换定时器
		clearInterval(themeManagement.interval);

		// 1或true: 始终使用暗黑主题
		if (value === 1 || value === true) {
			// 设置主题为暗黑主题
			nativeTheme.themeSource = "dark";
			return;
		}

		// 2、undefined或false: 根据系统设置自动切换主题
		if (value === undefined || value === 2 || value === false) {
			// 设置主题跟随系统设置
			nativeTheme.themeSource = "system";
		}

		// 0: 在夜间自动切换到暗黑主题
		else if (value === 0) {
			// 如果当前是晚上，设置主题为暗黑主题
			if (themeManagement.isNightTime()) {
				nativeTheme.themeSource = "dark";
			}

			// 如果当前不是晚上，设置主题为亮色主题
			else {
				nativeTheme.themeSource = "light";
			}

			// 每10秒检查一次时间，根据时间自动切换主题
			themeManagement.interval = setInterval(function () {
				// 如果当前是晚上，设置主题为暗黑主题
				if (themeManagement.isNightTime()) {
					nativeTheme.themeSource = "dark";
				}

				// 如果当前不是晚上，设置主题为亮色主题
				else {
					nativeTheme.themeSource = "light";
				}
			}, 10000);
		}

		// -1: 从不使用暗黑主题
		else if (value === -1) {
			// 设置主题为亮色主题
			nativeTheme.themeSource = "light";
		}
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		app.on("ready", function () {
			// 监听darkMode设置的更改，并调用themeSettingsChanged函数处理
			settingManagement.invoke("darkMode", themeManagement.themeSettingsChanged);

			// 当主题更新时，更新darkThemeIsActive设置
			nativeTheme.on("updated", function () {
				settingManagement.set("darkThemeIsActive", nativeTheme.shouldUseDarkColors);
			});
		});
	},
};

themeManagement.initialize();
