/**
 * 获取页面中的元素，并注册相应的事件监听器。
 */

// 获取设置按钮和设置下拉菜单元素
var settingsButton = document.getElementById("settings-button");
var settingsDropdown = document.getElementById("settings-dropdown");

// 获取反转PDF部分的元素
var invertSection = document.getElementById("invert-pdf-section");
var invertCheckbox = document.getElementById("invert-pdf-checkbox");

// 设置按钮点击事件监听器
settingsButton.addEventListener("click", function () {
	// 切换设置下拉菜单的显示状态
	settingsDropdown.hidden = !settingsDropdown.hidden;

	// 根据下拉菜单的显示状态添加或移除强制可见样式
	if (settingsDropdown.hidden) {
		settingsButton.classList.remove("force-visible");
	} else {
		settingsButton.classList.add("force-visible");
	}
});

// 点击页面其他位置时隐藏设置下拉菜单
document.addEventListener("click", function (e) {
	if (!settingsDropdown.contains(e.target) && e.target !== settingsButton) {
		settingsDropdown.hidden = true;
		settingsButton.classList.remove("force-visible");
	}
});

// 获取主题相关的元素
var metaThemeElement = document.getElementById("meta-theme");
var themeSelectors = document.querySelectorAll(".theme-circle");

/**定义主题对应的颜色值 */
var metaThemeValues = {
	light: "#fff",
	dark: "rgb(36, 41, 47)",
	sepia: "rgb(247, 231, 199)",
};

/**
 * 判断是否为夜间模式
 * @returns
 */
function isNight() {
	var hours = new Date().getHours();
	return hours > 21 || hours < 6;
}

// 为每个主题选择器添加点击事件监听器
themeSelectors.forEach(function (el) {
	el.addEventListener("click", function () {
		var theme = this.getAttribute("data-theme");

		// 根据当前时间和选择的主题设置全局或PDF的主题
		if (isNight()) {
			settingManagement.set("pdfNightTheme", theme);
		} else {
			settingManagement.set("pdfDayTheme", theme);
		}

		setViewerTheme(theme);
	});
});

/**
 * 设置当前主题的样式
 * @param {*} theme
 */
function setViewerTheme(theme) {
	themeSelectors.forEach(function (el) {
		if (el.getAttribute("data-theme") === theme) {
			el.classList.add("selected");
		} else {
			el.classList.remove("selected");
		}
	});

	metaThemeElement.content = metaThemeValues[theme];

	document.body.setAttribute("theme", theme);

	invertSection.hidden = !(theme === "dark");

	setTimeout(function () {
		document.body.classList.add("theme-loaded");
	}, 16);
}

/**
 * 初始化主题设置
 */
function initializeViewerTheme() {
	settingManagement.get("darkMode", function (globalDarkModeEnabled) {
		settingManagement.get("pdfDayTheme", function (pdfDayTheme) {
			settingManagement.get("pdfNightTheme", function (pdfNightTheme) {
				if (isNight() && pdfNightTheme) {
					setViewerTheme(pdfNightTheme);
				} else if (!isNight() && pdfDayTheme) {
					setViewerTheme(pdfDayTheme);
				} else if (globalDarkModeEnabled === 1 || globalDarkModeEnabled === true || isNight()) {
					setViewerTheme("dark");
				} else {
					setViewerTheme("light");
				}
			});
		});
	});
}

// 初始化主题设置
initializeViewerTheme();

// 获取反转颜色复选框元素并设置初始状态
settingManagement.get("PDFInvertColors", function (value) {
	invertCheckbox.checked = value === true;
	document.body.setAttribute("data-invert", value || false);
});

// 反转颜色复选框点击事件监听器
invertCheckbox.addEventListener("click", function (e) {
	settingManagement.set("PDFInvertColors", this.checked);
	document.body.setAttribute("data-invert", this.checked);
});

/**
 * 在上述代码中，对每个变量和函数都进行了注释，以说明其作用和用途。
 * 这样的注释能够更好地帮助其他开发人员理解和使用该段代码。
 */
