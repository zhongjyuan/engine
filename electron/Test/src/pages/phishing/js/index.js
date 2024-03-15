/**忽略按钮元素 */
var ignoreButton = document.getElementById("ignore-button");

/**继续按钮元素 */
var continueButton = document.getElementById("continue-button");

// 为忽略按钮添加点击事件处理函数
ignoreButton.addEventListener("click", function () {
	// 获取名为"phishingWhitelist"的设置项，并执行回调函数
	settingManagement.get("phishingWhitelist", function (value) {
		// 如果设置项不存在，则初始化为空数组
		if (!value) {
			value = [];
		}

		// 获取URL参数，并创建URLSearchParams对象
		var searchParams = new URLSearchParams(window.location.search.replace("?", ""));

		// 获取URL参数中的"url"值，并进行解码
		var url = decodeURIComponent(searchParams.get("url"));

		// 如果URL参数中没有"url"值，则抛出错误
		if (!url) {
			throw new Error("URL cannot be undefined");
		}

		// 从URL中获取主机名
		var domain = new URL(url).hostname;

		// 将主机名添加到白名单列表中
		value.push(domain);

		// 将白名单列表存储到设置项中
		settingManagement.set("phishingWhitelist", value);

		// 跳转回原始页面
		window.location = url;
	});
});

// 为继续按钮添加点击事件处理函数
continueButton.addEventListener("click", function () {
	// 跳转到DuckDuckGo搜索引擎页面
	window.location = "https://duckduckgo.com";
});
