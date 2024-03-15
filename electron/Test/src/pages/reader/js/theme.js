/**meta-theme 元素 */
var metaThemeElement = document.getElementById("meta-theme");

/**所有主题选择器元素 */
var themeSelectors = document.querySelectorAll(".theme-circle");

/**不同主题对应的 meta theme 值 */
var metaThemeValues = {
	light: "#fff",
	dark: "rgb(36, 41, 47)",
	sepia: "rgb(247, 231, 199)",
};

/**
 * 判断当前是否为夜晚
 * @returns  是否为夜晚
 */
function isNight() {
	var hours = new Date().getHours();
	return hours > 21 || hours < 6;
}

/**
 * 设置网页主题
 * @param {*} theme
 */
function setTheme(theme) {
	// 设置当前页面的主题属性
	document.body.setAttribute("theme", theme);

	if (window.rframe && window.rframe.contentDocument) {
		// 设置 iframe 内容的主题属性
		rframe.contentDocument.body.setAttribute("theme", theme);
	}

	// 设置 meta-theme 的内容属性
	metaThemeElement.content = metaThemeValues[theme];

	themeSelectors.forEach(function (el) {
		// 根据主题选择器设置选中状态
		if (el.getAttribute("data-theme") === theme) {
			el.classList.add("selected");
		} else {
			el.classList.remove("selected");
		}
	});
}

/**
 * 设置阅读器主题
 */
function setReaderTheme() {
	// 获取全局暗黑模式设置
	settingManagement.get("darkMode", function (globalDarkModeEnabled) {
		// 获取阅读器白天主题设置
		settingManagement.get("readerDayTheme", function (readerDayTheme) {
			// 获取阅读器夜晚主题设置
			settingManagement.get("readerNightTheme", function (readerNightTheme) {
				// 如果是夜晚且有夜晚主题设置，则应用夜晚主题
				if (isNight() && readerNightTheme) {
					setTheme(readerNightTheme);
				}

				// 如果是白天且有白天主题设置，则应用白天主题
				else if (!isNight() && readerDayTheme) {
					setTheme(readerDayTheme);
				}

				// 如果全局暗黑模式开启或当前为夜晚，则应用暗黑主题
				else if (globalDarkModeEnabled === 1 || globalDarkModeEnabled === true || isNight()) {
					setTheme("dark");
				}

				// 否则应用默认的亮色主题
				else {
					setTheme("light");
				}
			});
		});
	});
}

// 初始化阅读器主题
setReaderTheme();

// 当主题选择器按钮被点击时设置主题
themeSelectors.forEach(function (el) {
	el.addEventListener("click", function () {
		var theme = this.getAttribute("data-theme");

		// 如果是夜晚，则设置夜晚主题
		if (isNight()) {
			settingManagement.set("readerNightTheme", theme);
		}

		// 否则设置白天主题
		else {
			settingManagement.set("readerDayTheme", theme);
		}

		// 重新设置阅读器主题
		setReaderTheme();
	});
});
