/**设置页面标题为设置首选项的标题加上 " | ZHONGJYUAN" */
document.title = l("settingsPreferencesHeading") + " | ZHONGJYUAN";

/**内容类型阻止容器的元素 */
var contentTypeBlockingContainer = document.getElementById("content-type-blocking");

/**需要重启的横幅元素 */
var banner = document.getElementById("restart-required-banner");

/**网站主题复选框的元素 */
var siteThemeCheckbox = document.getElementById("checkbox-site-theme");

/**
 * 显示需要重启的横幅。
 */
function showRestartRequiredBanner() {
	// 设置横幅元素为可见
	banner.hidden = false;

	// 设置设置项 "restartNow" 的值为 true
	settingManagement.set("restartNow", true);
}

// 从设置管理中获取 "restartNow" 的值，并根据其值执行相应的操作
settingManagement.get("restartNow", (value) => {
	// 如果值为 true，则显示需要重启的横幅
	if (value === true) {
		showRestartRequiredBanner();
	}
});

/* 内容阻止设置 */

/**跟踪级别容器的元素 */
var trackingLevelContainer = document.getElementById("tracking-level-container");

/**所有跟踪级别选项的元素并转换为数组 */
var trackingLevelOptions = Array.from(trackingLevelContainer.querySelectorAll("input[name=blockingLevel]"));

/**内容阻止信息容器的元素 */
var blockingExceptionsContainer = document.getElementById("content-blocking-information");

/**内容阻止例外输入框的元素 */
var blockingExceptionsInput = document.getElementById("content-blocking-exceptions");

/**被阻止的请求计数的强调文本元素 */
var blockedRequestCount = document.querySelector("#content-blocking-blocked-requests strong");

// 监听 "filteringBlockedCount" 设置项的变化
settingManagement.listen("filteringBlockedCount", function (value) {
	// 将设置项的值格式化并更新被阻止的请求计数的文本

	var valueStr;

	// 如果值不存在，则将值设置为 0
	var count = value || 0;
	if (count > 50000) {
		// 如果值大于 50000，则使用紧凑表示法
		valueStr = new Intl.NumberFormat(navigator.locale, { notation: "compact", maximumSignificantDigits: 4 }).format(count);
	} else {
		// 否则使用普通表示法
		valueStr = new Intl.NumberFormat().format(count);
	}

	// 更新被阻止的请求计数的文本
	blockedRequestCount.textContent = valueStr;
});

/**
 * 更新跟踪级别 UI
 * @param {number} level - 跟踪级别
 */
function updateBlockingLevelUI(level) {
	// 根据传入的级别获取对应的单选框元素
	var radio = trackingLevelOptions[level];

	// 将对应的单选框设置为选中状态
	radio.checked = true;

	// 如果级别为 0，则隐藏内容阻止例外容器
	if (level === 0) {
		blockingExceptionsContainer.hidden = true;
	}

	// 否则显示内容阻止例外容器，并将其添加到选中的单选框元素的父元素中
	else {
		blockingExceptionsContainer.hidden = false;
		radio.parentNode.appendChild(blockingExceptionsContainer);
	}

	// 更新选中的跟踪级别的样式
	if (document.querySelector("#tracking-level-container .setting-option.selected")) {
		document.querySelector("#tracking-level-container .setting-option.selected").classList.remove("selected");
	}

	radio.parentNode.classList.add("selected");
}

/**
 * 更改内容阻止级别设置
 * @param {number} level - 阻止级别
 */
function changeBlockingLevelSetting(level) {
	// 通过 settingManagement.get 获取过滤设置的值
	settingManagement.get("filtering", function (value) {
		// 如果值不存在，则初始化为空对象
		if (!value) {
			value = {};
		}

		// 更新阻止级别设置
		value.blockingLevel = level;

		// 通过 settingManagement.set 更新过滤设置的值
		settingManagement.set("filtering", value);

		// 更新界面显示
		updateBlockingLevelUI(level);
	});
}

/**
 * 设置例外输入框的大小
 */
function setExceptionInputSize() {
	// 将例外输入框的高度设置为内容的实际高度加上 2px 的额外高度
	blockingExceptionsInput.style.height = blockingExceptionsInput.scrollHeight + 2 + "px";
}

/**
 * 从设置中获取过滤设置，并进行相应的处理
 */
settingManagement.get("filtering", function (value) {
	if (value && typeof value.trackers === "boolean") {
		// 如果原设置中有 trackers 属性，则根据该属性的值设置阻止级别，并删除该属性
		if (value.trackers === true) {
			value.blockingLevel = 2;
		} else if (value.trackers === false) {
			value.blockingLevel = 0;
		}

		delete value.trackers;

		settingManagement.set("filtering", value);
	}

	// 如果有阻止级别设置，则更新界面显示为对应的级别
	if (value && value.blockingLevel !== undefined) {
		updateBlockingLevelUI(value.blockingLevel);
	} else {
		// 否则，默认更新界面显示为级别 1
		updateBlockingLevelUI(1);
	}

	// 如果有例外域名设置且长度大于 0，则更新例外输入框的值和大小
	if (value && value.exceptionDomains && value.exceptionDomains.length > 0) {
		blockingExceptionsInput.value = value.exceptionDomains.join(", ") + ", ";
		setExceptionInputSize();
	}
});

/**
 * 遍历 trackingLevelOptions 数组，为每个选项添加 change 事件监听器
 */
trackingLevelOptions.forEach(function (item, idx) {
	// 当选项的值发生变化时，触发 change 事件，并调用 changeBlockingLevelSetting 函数
	item.addEventListener("change", function () {
		changeBlockingLevelSetting(idx);
	});
});

/**
 * 为 blockingExceptionsInput 添加 input 事件监听器
 */
blockingExceptionsInput.addEventListener("input", function () {
	// 调用 setExceptionInputSize 函数，设置例外输入框的大小
	setExceptionInputSize();

	// 将输入框的值按逗号分隔成数组，并对每个元素进行修整和过滤
	var newValue = this.value
		.split(",")
		.map((i) => i.trim().replace("http://", "").replace("https://", ""))
		.filter((i) => !!i);

	// 从设置中获取 filtering 的值
	settingManagement.get("filtering", function (value) {
		// 如果 value 不存在，则创建一个空对象
		if (!value) {
			value = {};
		}

		// 更新 exceptionDomains 属性为新的值
		value.exceptionDomains = newValue;

		// 将更新后的 value 保存回设置中
		settingManagement.set("filtering", value);
	});
});

/* 内容类型设置 */

/**内容类型 */
var contentTypes = {
	scripts: "script",
	images: "image",
};

/**用于显示本地化字符串的对象 */
var contentTypeSettingNames = {
	scripts: "settingsBlockScriptsToggle",
	images: "settingsBlockImagesToggle",
};

// 遍历内容类型对象
for (var contentType in contentTypes) {
	// 使用立即调用函数表达式(IIFE)创建一个函数作用域，以便在循环中正确捕获每个contentType的值
	(function (contentType) {
		// 从存储中获取过滤设置
		settingManagement.get("filtering", function (value) {
			// 创建用于阻止每种内容类型的设置部分
			var section = document.createElement("div");
			section.classList.add("setting-section");

			// 为这个内容类型生成一个唯一的id，并创建复选框元素
			var id = "checkbox-block-" + contentTypes[contentType];
			var checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.id = id;

			// 如果存储的设置值存在且包含contentTypes属性，则检查当前内容类型是否在其中
			if (value && value.contentTypes) {
				checkbox.checked = value.contentTypes.indexOf(contentTypes[contentType]) != -1;
			}

			// 创建标签元素，并将其关联到复选框
			var label = document.createElement("label");
			label.setAttribute("for", id);
			label.textContent = l(contentTypeSettingNames[contentType]);

			// 将复选框和标签元素添加到设置部分的容器中
			section.appendChild(checkbox);
			section.appendChild(label);

			// 将设置部分的容器添加到显示内容类型设置的容器中
			contentTypeBlockingContainer.appendChild(section);

			// 为复选框添加事件监听器
			checkbox.addEventListener("change", function (e) {
				// 获取存储的过滤设置
				settingManagement.get("filtering", function (value) {
					// 如果不存在存储的设置值，则创建一个空对象
					if (!value) {
						value = {};
					}

					// 如果不存在contentTypes属性，则创建一个空数组
					if (!value.contentTypes) {
						value.contentTypes = [];
					}

					// 根据复选框状态，添加或删除当前内容类型
					if (e.target.checked) {
						value.contentTypes.push(contentTypes[contentType]);
					} else {
						var idx = value.contentTypes.indexOf(contentTypes[contentType]);
						value.contentTypes.splice(idx, 1);
					}

					// 将更新后的设置值保存回存储中
					settingManagement.set("filtering", value);
				});
			});
		});
	})(contentType); // 通过立即调用函数表达式(IIFE)将contentType的值传入到函数作用域中
}

/* 暗黑模式设置 */

/**永不启用暗黑模式选项 */
var darkModeNever = document.getElementById("dark-mode-never");

/**仅在夜间启用暗黑模式选项 */
var darkModeNight = document.getElementById("dark-mode-night");

/**总是启用暗黑模式选项 */
var darkModeAlways = document.getElementById("dark-mode-always");

/**根据系统设置自动启用暗黑模式选项 */
var darkModeSystem = document.getElementById("dark-mode-system");

// 获取暗黑模式设置的值，并根据值设置对应的勾选状态
settingManagement.get("darkMode", function (value) {
	// 如果值为-1，则勾选"永不启用暗黑模式"选项
	darkModeNever.checked = value === -1;

	// 如果值为0，则勾选"仅在夜间启用暗黑模式"选项
	darkModeNight.checked = value === 0;

	// 如果值为1或true，则勾选"总是启用暗黑模式"选项
	darkModeAlways.checked = value === 1 || value === true;

	// 如果值为2、undefined或false，则勾选"根据系统设置自动启用暗黑模式"选项
	darkModeSystem.checked = value === 2 || value === undefined || value === false;
});

// 监听"永不启用暗黑模式"选项的变化
darkModeNever.addEventListener("change", function (e) {
	if (this.checked) {
		// 如果勾选了该选项，则将暗黑模式设置为-1，表示永不启用
		settingManagement.set("darkMode", -1);
	}
});

// 监听"仅在夜间启用暗黑模式"选项的变化
darkModeNight.addEventListener("change", function (e) {
	if (this.checked) {
		// 如果勾选了该选项，则将暗黑模式设置为0，表示仅在夜间启用
		settingManagement.set("darkMode", 0);
	}
});

// 监听"总是启用暗黑模式"选项的变化
darkModeAlways.addEventListener("change", function (e) {
	if (this.checked) {
		// 如果勾选了该选项，则将暗黑模式设置为1，表示总是启用
		settingManagement.set("darkMode", 1);
	}
});

// 监听"根据系统设置自动启用暗黑模式"选项的变化
darkModeSystem.addEventListener("change", function (e) {
	if (this.checked) {
		// 如果勾选了该选项，则将暗黑模式设置为2，表示根据系统设置自动启用
		settingManagement.set("darkMode", 2);
	}
});

/* 站点主题设置 */

// 获取站点主题设置的值，并根据值设置对应的勾选状态
settingManagement.get("siteTheme", function (value) {
	// 如果值为true或undefined，则勾选站点主题选项
	if (value === true || value === undefined) {
		siteThemeCheckbox.checked = true;
	}

	// 否则，取消勾选站点主题选项
	else {
		siteThemeCheckbox.checked = false;
	}
});

// 监听站点主题选项的变化
siteThemeCheckbox.addEventListener("change", function (e) {
	// 根据选项的勾选状态，将站点主题设置为相应的值
	settingManagement.set("siteTheme", this.checked);
});

/* 启动设置 */

/**启动选项输入框元素 */
var startupSettingInput = document.getElementById("startup-options");

// 获取启动选项的值，并将其赋给启动选项输入框的值
settingManagement.get("startupTabOption", function (value = 2) {
	startupSettingInput.value = value;
});

// 监听启动选项输入框的变化
startupSettingInput.addEventListener("change", function () {
	// 将输入框的值转换为整数，并保存到本地缓存中
	settingManagement.set("startupTabOption", parseInt(this.value));
});

/* 新窗口设置 */

/**新窗口选项输入框元素 */
var newWindowSettingInput = document.getElementById("new-window-options");

// 获取新窗口选项的值，并将其赋给新窗口选项输入框的值
settingManagement.get("newWindowOption", function (value = 1) {
	newWindowSettingInput.value = value;
});

// 监听新窗口选项输入框的变化
newWindowSettingInput.addEventListener("change", function () {
	// 将输入框的值转换为整数，并保存到本地缓存中
	settingManagement.set("newWindowOption", parseInt(this.value));
});

/* 用户脚本设置 */

/**用户脚本复选框的元素 */
var userscriptsCheckbox = document.getElementById("checkbox-userscripts");

// 获取用户脚本启用状态的值，并根据值设置对应的勾选状态
settingManagement.get("userscriptsEnabled", function (value) {
	// 如果值为true，则勾选用户脚本复选框
	if (value === true || value === undefined) {
		userscriptsCheckbox.checked = true;
	} else {
		userscriptsCheckbox.checked = false;
	}
});

// 监听用户脚本复选框的变化
userscriptsCheckbox.addEventListener("change", function (e) {
	// 根据复选框的勾选状态，将用户脚本启用状态设置为相应的值
	settingManagement.set("userscriptsEnabled", this.checked);
});

/* 显示选项卡之间的分隔线设置 */

/**显示分隔线复选框的元素 */
var showDividerCheckbox = document.getElementById("checkbox-show-divider");

// 获取显示分隔线选项的值，并根据值设置对应的勾选状态
settingManagement.get("showDividerBetweenTabs", function (value) {
	// 如果值为true，则勾选显示分隔线复选框
	if (value === true) {
		showDividerCheckbox.checked = true;
	}
});

// 监听显示分隔线复选框的变化
showDividerCheckbox.addEventListener("change", function (e) {
	// 根据复选框的勾选状态，将显示分隔线选项设置为相应的值
	settingManagement.set("showDividerBetweenTabs", this.checked);
});

/* 分离标题栏设置 */

/**独立标题栏复选框的元素 */
var separateTitlebarCheckbox = document.getElementById("checkbox-separate-titlebar");

// 获取分离标题栏选项的值，并根据值设置对应的勾选状态
settingManagement.get("useSeparateTitlebar", function (value) {
	// 如果值为true，则勾选分离标题栏复选框
	if (value === true || value === undefined) {
		separateTitlebarCheckbox.checked = true;
	} else {
		separateTitlebarCheckbox.checked = false;
	}
});

// 监听分离标题栏复选框的变化
separateTitlebarCheckbox.addEventListener("change", function (e) {
	// 根据复选框的勾选状态，将分离标题栏选项设置为相应的值
	settingManagement.set("useSeparateTitlebar", this.checked);

	showRestartRequiredBanner();
});

/* 前台打开选项卡设置 */

/**前台打开标签页复选框的元素 */
var openTabsInForegroundCheckbox = document.getElementById("checkbox-open-tabs-in-foreground");

// 获取前台打开选项卡选项的值，并根据值设置对应的勾选状态
settingManagement.get("openTabsInForeground", function (value) {
	// 如果值为true，则勾选前台打开选项卡复选框
	if (value === true || value === undefined) {
		openTabsInForegroundCheckbox.checked = true;
	} else {
		openTabsInForegroundCheckbox.checked = false;
	}
});

// 监听前台打开选项卡复选框的变化
openTabsInForegroundCheckbox.addEventListener("change", function (e) {
	// 根据复选框的勾选状态，将前台打开选项卡选项设置为相应的值
	settingManagement.set("openTabsInForeground", this.checked);
});

/* 媒体自动播放设置 */

/**自动播放复选框的元素 */
var autoPlayCheckbox = document.getElementById("checkbox-enable-autoplay");

// 获取媒体自动播放选项的值，并根据值设置对应的勾选状态
settingManagement.get("enableAutoplay", function (value) {
	// 根据值设置媒体自动播放复选框的勾选状态
	if (value === true || value === undefined) {
		autoPlayCheckbox.checked = true;
	} else {
		autoPlayCheckbox.checked = false;
	}
});

// 监听媒体自动播放复选框的变化
autoPlayCheckbox.addEventListener("change", function (e) {
	// 根据复选框的勾选状态，将媒体自动播放选项设置为相应的值
	settingManagement.set("enableAutoplay", this.checked);
});

/* 用户代理设置 */

/**用户代理复选框的元素 */
var userAgentCheckbox = document.getElementById("checkbox-user-agent");

/**用户代理输入框的元素 */
var userAgentInput = document.getElementById("input-user-agent");

// 获取用户代理选项的值，并根据值设置对应的状态
settingManagement.get("customUserAgent", function (value) {
	if (value === true || value === undefined) {
		// 如果存在用户代理值，则勾选用户代理复选框
		userAgentCheckbox.checked = true;

		// 显示用户代理输入框
		userAgentInput.style.visibility = "visible";

		// 设置用户代理输入框的值
		userAgentInput.value = value;
	}
});

// 监听用户代理复选框的变化
userAgentCheckbox.addEventListener("change", function (e) {
	if (this.checked) {
		// 如果复选框被勾选，则显示用户代理输入框
		userAgentInput.style.visibility = "visible";
	} else {
		// 如果复选框未勾选，则清空用户代理设置
		settingManagement.set("customUserAgent", null);

		// 隐藏用户代理输入框
		userAgentInput.style.visibility = "hidden";

		showRestartRequiredBanner();
	}
});

// 监听用户代理输入框的输入事件
userAgentInput.addEventListener("input", function (e) {
	if (this.value) {
		// 如果有输入值，则设置用户代理
		settingManagement.set("customUserAgent", this.value);
	} else {
		// 如果输入值为空，则清空用户代理设置
		settingManagement.set("customUserAgent", null);
	}

	showRestartRequiredBanner();
});

/* 更新通知设置 */

/**更新通知复选框元素 */
var updateNotificationsCheckbox = document.getElementById("checkbox-update-notifications");

// 获取更新通知选项的值，并根据值设置对应的勾选状态
settingManagement.get("updateNotificationsEnabled", function (value) {
	if (value === true || value === undefined) {
		updateNotificationsCheckbox.checked = true;
	} else {
		updateNotificationsCheckbox.checked = false;
	}
});

// 监听更新通知复选框的变化
updateNotificationsCheckbox.addEventListener("change", function (e) {
	// 根据复选框的勾选状态，将更新通知选项设置为相应的值
	settingManagement.set("updateNotificationsEnabled", this.checked);
});

/* 使用统计设置 */

/**使用统计复选框元素 */
var usageStatisticsCheckbox = document.getElementById("checkbox-usage-statistics");

// 获取使用统计选项的值，并根据值设置对应的勾选状态
settingManagement.get("collectUsageStats", function (value) {
	if (value === true || value === undefined) {
		usageStatisticsCheckbox.checked = true;
	} else {
		usageStatisticsCheckbox.checked = false;
	}
});

// 监听使用统计复选框的变化
usageStatisticsCheckbox.addEventListener("change", function (e) {
	// 根据复选框的勾选状态，将使用统计选项设置为相应的值
	settingManagement.set("collectUsageStats", this.checked);
});

/* 默认搜索引擎设置 */

/**搜索引擎下拉框元素 */
var searchEngineDropdown = document.getElementById("default-search-engine");

/**自定义搜索引擎输入框元素 */
var searchEngineInput = document.getElementById("custom-search-engine");

// 设置自定义搜索引擎输入框的占位符文本
searchEngineInput.setAttribute("placeholder", l("customSearchEngineDescription"));

// 在页面加载完成后执行以下操作
settingManagement.onLoad(function () {
	// 如果当前搜索引擎是自定义的，则显示自定义搜索引擎输入框，并设置其值为当前搜索引擎的搜索URL
	if (currentSearchEngine.custom) {
		searchEngineInput.hidden = false;
		searchEngineInput.value = currentSearchEngine.searchURL;
	}

	// 遍历搜索引擎列表，创建并添加选项元素到默认搜索引擎下拉框中
	for (var se in searchEngine.searchEngines) {
		var item = document.createElement("option");
		item.textContent = searchEngine.searchEngines[se].name;

		// 如果该选项是当前搜索引擎，则设置其为选中状态
		if (searchEngine.searchEngines[se].name == searchEngine.currentSearchEngine.name) {
			item.setAttribute("selected", "true");
		}

		searchEngineDropdown.appendChild(item);
	}

	// 添加自定义选项到默认搜索引擎下拉框中
	item = document.createElement("option");
	item.textContent = "custom";
	if (searchEngine.currentSearchEngine.custom) {
		item.setAttribute("selected", "true");
	}

	searchEngineDropdown.appendChild(item);
});

// 监听默认搜索引擎下拉框的变化
searchEngineDropdown.addEventListener("change", function (e) {
	if (this.value === "custom") {
		searchEngineInput.hidden = false; // 如果选择了自定义选项，则显示自定义搜索引擎输入框
	} else {
		searchEngineInput.hidden = true; // 如果选择了其他选项，则隐藏自定义搜索引擎输入框
		settingManagement.set("searchEngine", { name: this.value }); // 设置搜索引擎选项为当前选择的值
	}
});

// 监听自定义搜索引擎输入框的输入事件
searchEngineInput.addEventListener("input", function (e) {
	settingManagement.set("searchEngine", { url: this.value }); // 设置搜索引擎选项的搜索URL为输入框的值
});

/* 键盘映射设置 */

// 获取键盘映射设置
settingManagement.get("keyMap", function (keyMapSettings) {
	// 生成键盘映射对象
	var keyMap = keyboardMap.convert(keyMapSettings);

	// 获取键盘映射列表容器
	var keyMapList = document.getElementById("key-map-list");

	// 遍历键盘映射对象的属性
	Object.keys(keyMap).forEach(function (action) {
		// 创建一个键盘映射列表项
		var li = createKeyMapListItem(action, keyMap);

		// 将列表项添加到键盘映射列表中
		keyMapList.appendChild(li);
	});
});

/**
 * 格式化驼峰命名格式的字符串，将首字母大写并用空格分隔单词。
 * @param {string} text - 驼峰命名格式的字符串。
 * @returns {string} - 格式化后的字符串。
 */
function formatCamelCase(text) {
	var result = text.replace(/([A-Z])/g, " $1");
	return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * 创建一个键盘映射列表项。
 * @param {string} action - 操作名称。
 * @param {Object} keyMap - 键盘映射对象。
 * @returns {HTMLElement} - 键盘映射列表项元素。
 */
function createKeyMapListItem(action, keyMap) {
	// 创建一个列表项元素和一个标签元素
	var li = document.createElement("li");
	var label = document.createElement("label");

	// 设置标签元素的显示文本和"for"属性
	label.innerText = formatCamelCase(action);
	label.htmlFor = action;

	// 创建一个输入元素
	var input = document.createElement("input");

	// 设置输入元素的类型、id、name和值
	input.type = "text";
	input.id = input.name = action;
	input.value = formatKeyValue(keyMap[action]);

	// 添加一个事件监听器，当用户输入时触发onKeyMapChange函数
	input.addEventListener("input", onKeyMapChange);

	// 将标签元素和输入元素添加到列表项元素中
	li.appendChild(label);
	li.appendChild(input);

	return li;
}

/**
 * 格式化按键组合字符串，用逗号分隔多个按键组合。
 * @param {string | string[]} value - 按键组合字符串或字符串数组。
 * @returns {string} - 格式化后的按键组合字符串。
 */
function formatKeyValue(value) {
	if (value instanceof Array) {
		value = value.join(", ");
	}

	// 根据平台将键名转换为通用名称
	if (navigator.platform === "MacIntel") {
		value = value.replace(/\bmod\b/g, "command");
	} else {
		value = value.replace(/\bmod\b/g, "ctrl");
		value = value.replace(/\boption\b/g, "alt");
	}

	return value;
}

/**
 * 解析用户输入的按键组合字符串。
 * @param {string} input - 用户输入的按键组合字符串。
 * @returns {string | string[]} - 解析后的按键组合。如果只有一个，则返回字符串；否则返回数组。
 */
function parseKeyInput(input) {
	// 按逗号分隔多个按键组合
	var parsed = input.toLowerCase().split(",");

	// 去除空格
	parsed = parsed.map(function (e) {
		return e.trim();
	});

	// 去除空元素
	parsed = parsed.filter(Boolean);

	// 根据平台将键名转换为通用名称
	parsed = parsed.map(function (e) {
		if (navigator.platform === "MacIntel") {
			e = e.replace(/\b(command)|(cmd)\b/g, "mod");
		} else {
			e = e.replace(/\b(control)|(ctrl)\b/g, "mod");
			e = e.replace(/\balt\b/g, "option");
		}
		return e;
	});

	// 返回解析后的按键组合，如果只有一个则返回字符串，否则返回数组
	return parsed.length > 1 ? parsed : parsed[0];
}

/**
 * 当用户修改按键组合时触发的函数。
 * @param {Event} e - 输入事件对象。
 */
function onKeyMapChange(e) {
	var action = this.name;
	var newValue = this.value;

	// 获取键盘映射设置
	settingManagement.get("keyMap", function (keyMapSettings) {
		// 如果键盘映射设置不存在则创建一个新的对象
		if (!keyMapSettings) {
			keyMapSettings = {};
		}

		// 更新键盘映射设置中指定操作的值
		keyMapSettings[action] = parseKeyInput(newValue);

		// 保存更新后的键盘映射设置
		settingManagement.set("keyMap", keyMapSettings);

		// 显示需要重新启动的提示条
		showRestartRequiredBanner();
	});
}

/* 密码填充设置  */

/**密码管理器下拉框元素 */
var passwordManagersDropdown = document.getElementById("selected-password-manager");

// 遍历密码管理器对象，创建选项元素并添加到密码管理器下拉框中
for (var manager in passwordManager.passwordManages) {
	// 创建一个选项元素
	var item = document.createElement("option");

	// 设置选项元素的显示文本为当前密码管理器的名称
	item.textContent = passwordManager.passwordManages[manager].name;

	// 将选项元素添加到密码管理器下拉框中
	passwordManagersDropdown.appendChild(item);
}

// 监听密码管理器设置的更改，并在更改时更新密码管理器下拉框的值
settingManagement.listen("passwordManager", function (value) {
	passwordManagersDropdown.value = window.passwordManager.name;
});

// 添加一个事件监听器，当密码管理器下拉框的值发生变化时触发
passwordManagersDropdown.addEventListener("change", function (e) {
	if (this.value === "none") {
		// 如果用户选择了"none"选项，则将密码管理器设置为无
		settingManagement.set("passwordManager", { name: "none" });
	} else {
		// 否则将密码管理器设置为用户选择的密码管理器
		settingManagement.set("passwordManager", { name: this.value });
	}
});

// 获取查看密码管理器的链接元素
var keychainViewLink = document.getElementById("keychain-view-link");

// 添加一个点击事件监听器，当用户点击查看密码管理器链接时触发
keychainViewLink.addEventListener("click", function () {
	// 发送消息给父窗口显示密码管理器
	postMessage({ message: "showCredentialList" });
});

// 监听密码管理器设置的更改，并根据当前密码管理器的名称隐藏或显示查看密码管理器的链接
settingManagement.listen("passwordManager", function (value) {
	keychainViewLink.hidden = !(window.passwordManager.name === "Built-in password manager");
});

/* 代理设置 */

// 获取代理类型选择框元素
const proxyTypeInput = document.getElementById("selected-proxy-type");

// 获取所有代理设置输入框元素，并将其转换为数组
const proxyInputs = Array.from(document.querySelectorAll("#proxy-settings-container input"));

/**
 * 根据代理类型来隐藏或显示手动代理和 PAC 代理选项
 * @param {number} proxyType - 代理类型，1 表示手动代理，2 表示 PAC 代理
 */
const toggleProxyOptions = (proxyType) => {
	// 获取手动代理选项的 HTML 元素
	const manualProxySection = document.getElementById("manual-proxy-section");

	// 获取 PAC 代理选项的 HTML 元素
	const pacOption = document.getElementById("pac-option");

	// 根据代理类型确定是否隐藏手动代理选项
	manualProxySection.hidden = proxyType !== 1;

	// 根据代理类型确定是否隐藏 PAC 代理选项
	pacOption.hidden = proxyType !== 2;
};

/**
 * 根据键值对设置代理配置，并将其保存到设置中
 * @param {string} key - 代理配置的键
 * @param {*} value - 代理配置的值
 */
const setProxy = (key, value) => {
	// 从设置中获取当前的代理配置
	settingManagement.get("proxy", (proxy = {}) => {
		// 将键值对添加到代理配置中
		proxy[key] = value;

		// 将更新后的代理配置保存到设置中
		settingManagement.set("proxy", proxy);
	});
};

// 获取保存的代理配置，并根据配置更新代理设置界面
settingManagement.get("proxy", (proxy = {}) => {
	toggleProxyOptions(proxy.type);

	// 设置代理类型选择框的选中索引为保存的代理类型值
	proxyTypeInput.options.selectedIndex = proxy.type || 0;

	// 遍历所有代理设置输入框元素，根据保存的代理配置为每个输入框设置值
	proxyInputs.forEach((item) => (item.value = proxy[item.name] || ""));
});

// 监听代理类型选择框的变化，更新代理类型并切换对应的代理设置选项
proxyTypeInput.addEventListener("change", (e) => {
	const proxyType = e.target.options.selectedIndex;

	setProxy("type", proxyType);

	toggleProxyOptions(proxyType);
});

// 监听所有代理设置输入框的变化，更新对应的代理配置并保存到设置中
proxyInputs.forEach((item) => item.addEventListener("change", (e) => setProxy(e.target.name, e.target.value)));

/* 自定义指令设置 */

// 从系统设置中获取自定义搜索引擎列表，并根据其中的值创建相应的搜索引擎项
settingManagement.get("customBangs", (value) => {
	// 获取自定义搜索引擎列表的 HTML 元素
	const bangslist = document.getElementById("custom-bangs");

	if (value) {
		// 遍历自定义搜索引擎列表，为每个条目创建搜索引擎项并添加到列表中
		value.forEach(function (bang) {
			bangslist.appendChild(createBang(bang.phrase, bang.snippet, bang.redirect));
		});
	}
});

// 添加自定义搜索引擎按钮的单击事件监听器
document.getElementById("add-custom-bang").addEventListener("click", function () {
	const bangslist = document.getElementById("custom-bangs");

	// 创建一个新的自定义搜索引擎项并将其添加到列表中
	bangslist.appendChild(createBang());
});

/**
 * 创建自定义搜索引擎项的函数
 * @param {string} bang - 搜索引擎关键词
 * @param {string} snippet - 搜索引擎描述
 * @param {string} redirect - 搜索引擎重定向链接
 * @returns {HTMLElement} - 创建的搜索引擎条目的根元素
 */
function createBang(bang, snippet, redirect) {
	/**新的列表项元素 */
	var li = document.createElement("li");

	/**搜索引擎关键词输入框元素 */
	var bangInput = document.createElement("input");

	/**搜索引擎描述输入框元素 */
	var snippetInput = document.createElement("input");

	/**搜索引擎重定向链接输入框元素 */
	var redirectInput = document.createElement("input");

	/**删除当前搜索引擎条目按钮元素 */
	var xButton = document.createElement("button");

	/**当前搜索引擎条目信息的对象 */
	var current = { phrase: bang ?? "", snippet: snippet ?? "", redirect: redirect ?? "" };

	/**
	 * 更新系统设置中的自定义搜索引擎列表
	 * @param {string} key - 要更新的搜索引擎条目的键
	 * @param {*} input - 包含新数值的输入对象
	 */
	function update(key, input) {
		// 从系统设置中获取当前的自定义搜索引擎列表
		settingManagement.get("customBangs", function (d) {
			// 过滤掉已经存在的相同搜索引擎条目
			const filtered = d ? d.filter((bang) => bang.phrase !== current.phrase && (key !== "phrase" || bang.phrase !== input.value)) : [];

			// 添加新的搜索引擎条目到自定义搜索引擎列表中
			filtered.push({ phrase: bangInput.value, snippet: snippetInput.value, redirect: redirectInput.value });

			// 更新系统设置中的自定义搜索引擎列表
			settingManagement.set("customBangs", filtered);

			// 更新当前搜索引擎条目的值
			current[key] = input.value;
		});
	}

	// 设置输入框的类型和默认值，并添加事件监听器
	bangInput.type = "text";
	snippetInput.type = "text";
	redirectInput.type = "text";
	bangInput.value = bang ?? "";
	snippetInput.value = snippet ?? "";
	redirectInput.value = redirect ?? "";
	xButton.className = "i carbon:close custom-bang-delete-button";

	// 设置输入框的占位符文本
	bangInput.placeholder = l("settingsCustomBangsPhrase");
	snippetInput.placeholder = l("settingsCustomBangsSnippet");
	redirectInput.placeholder = l("settingsCustomBangsRedirect");

	// 为删除按钮添加单击事件监听器
	xButton.addEventListener("click", function () {
		// 从自定义搜索引擎列表中删除当前搜索引擎项
		li.remove();

		settingManagement.get("customBangs", (d) => {
			settingManagement.set(
				"customBangs",
				d.filter((bang) => bang.phrase !== bangInput.value)
			);
		});

		// 显示需要重新启动浏览器的提示横幅
		showRestartRequiredBanner();
	});

	// 为搜索引擎输入框添加事件监听器
	bangInput.addEventListener("change", function () {
		// 如果输入框中的值以感叹号开头，则删除该感叹号
		if (this.value.startsWith("!")) {
			this.value = this.value.slice(1);
		}

		// 更新系统设置中的自定义搜索引擎列表
		update("phrase", bangInput);

		// 显示需要重新启动浏览器的提示横幅
		showRestartRequiredBanner();
	});

	snippetInput.addEventListener("change", function () {
		// 更新系统设置中的自定义搜索引擎列表
		update("snippet", snippetInput);

		// 显示需要重新启动浏览器的提示横幅
		showRestartRequiredBanner();
	});

	redirectInput.addEventListener("change", function () {
		// 更新系统设置中的自定义搜索引擎列表
		update("redirect", redirectInput);

		// 显示需要重新启动浏览器的提示横幅
		showRestartRequiredBanner();
	});

	// 将输入框和删除按钮添加到搜索引擎项中，并返回该项的 HTML 元素
	li.appendChild(bangInput);
	li.appendChild(snippetInput);
	li.appendChild(redirectInput);
	li.appendChild(xButton);

	return li;
}
