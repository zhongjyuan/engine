import logger from "@common/logManagement";
import { isFunction } from "@common/utils/default";
import { setStyle, queryParentElement } from "@common/utils/dom";
import { localStorage } from "@common/utils/storage";

import { comp_search as htmlTemplate } from "./html";

/**
 * 检索 - 组件 - ZHONGJYUAN
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年9月7日14:12:20
 */
export default (() => {
	/**
	 * 添加输出结果
	 * @param {any} result 输出结果
	 */
	function addResult(result) {
		var { comp_search: setting } = window.zhongjyuan.runtime.setting;

		setting.results.unshift(result); // 将新的输出结果添加到数组的开头

		if (setting.results.length > setting.reserve) {
			setting.results.pop(); // 如果数组长度超过3，则移除最后一个输出结果
		}
	}

	/**
	 * 移除输出结果
	 * @param {number} index 输出结果在数组中的索引
	 */
	function removeResult(index) {
		var { comp_search: setting } = window.zhongjyuan.runtime.setting;
		setting.results.splice(index, 1); // 从数组中移除对应位置的输出结果
	}

	/**
	 * 类型动画效果，逐个字符打印
	 * @param {number} index 输出结果在数组中的索引
	 * @param {string} content 输出内容
	 * @param {HTMLElement} element 输出内容所在的HTML元素
	 */
	function typeAnimation(index, content, element) {
		var { comp_search: setting } = window.zhongjyuan.runtime.setting;

		let i = 0;
		var len = content.length;

		function printChar() {
			if (i < len) {
				element.innerHTML += content.charAt(i);
				i++;
				setting.outputTimers[index] = window.setTimeout(printChar, setting.outputDelay);
			}
		}

		printChar();
	}

	/**
	 * 更新输出容器
	 */
	function updateOutputContainer() {
		var { comp_search: setting } = window.zhongjyuan.runtime.setting;
		var componentElement = setting.componentElement;

		var outputContainer = componentElement.querySelector(".output-container");

		if (outputContainer.childElementCount >= setting.reserve) {
			outputContainer.lastChild.remove(); // 移除超出的最后一个输出内容
		}
		var result = setting.results[0]; // 获取最新的输出结果

		var outputDiv = document.createElement("div");
		outputDiv.className = "output-content";

		// 获取当前输出结果在数组中的索引
		var index = setting.results.indexOf(result);

		// 逐个子输出结果
		var outputText = document.createElement("span");
		outputDiv.appendChild(outputText);

		typeAnimation(index, result, outputText); // 调用逐个子输出函数

		// 创建关闭按钮
		var closeButton = document.createElement("div");
		closeButton.className = "close-button fa-regular fa-circle-xmark fa-spin";
		closeButton.addEventListener("click", function () {
			window.clearTimeout(setting.outputTimers[index]);
			removeResult(index); // 移除对应位置的输出结果
			outputDiv.remove(); // 移除对应的输出内容
		});

		outputDiv.appendChild(closeButton); // 将关闭按钮添加到输出内容中

		outputContainer.prepend(outputDiv); // 将新的输出结果插入到输出展示区域的开头
	}

	/**
	 * 执行搜索操作
	 */
	function performSearch() {
		var { comp_search: setting } = window.zhongjyuan.runtime.setting;
		var componentElement = setting.componentElement;

		var searchInput = componentElement.querySelector("#search-input");
		var historyContainer = componentElement.querySelector(".history-container");

		var searchText = searchInput.value;

		// 在这里执行搜索操作
		let searchResult = searchText;
		if (setting.callback && isFunction(setting.callback)) {
			searchResult = setting.callback.apply(this, searchText);
		} else {
			searchResult = evalFunction(searchText);
		}

		if (searchResult) {
			addResult(JSON.stringify(searchResult)); // 添加新的输出结果
			updateOutputContainer(); // 更新输出展示区域
		}

		addSearchHistory(searchText); // 添加搜索历史记录
		searchInput.value = ""; // 清空搜索框
		historyContainer.innerHTML = "";
	}

	/**
	 * 执行函数字符串
	 * @param {string} functionString 函数字符串
	 * @returns {any} 执行结果
	 */
	function evalFunction(functionString) {
		try {
			return eval(functionString);
		} catch (error) {
			return "Error executing:" + error.message;
		}
	}

	/**
	 * 显示搜索组件
	 * @param {Object} options 显示选项
	 */
	function show(options = {}) {
		hide();

		import(/* webpackChunkName: "comp_search" */ "./index.css");

		var { getVariable, runtime } = window.zhongjyuan;
		var { comp_search: setting } = runtime.setting;

		setting.dom = options.dom || "";
		setting.icon = options.icon || getVariable("icon");
		setting.color = options.color || setting.color;
		setting.reserve = options.reserve || setting.reserve;
		setting.callback = options.callback || setting.callback;

		var componentElement = document.createElement("div");
		componentElement.innerHTML = htmlTemplate;
		componentElement.setAttribute("id", setting.domId);
		componentElement.setAttribute("class", setting.domId);

		// 将日历组件添加到指定DOM元素的父元素中
		var parentElement = queryParentElement(setting.dom);
		parentElement.appendChild(componentElement);
		setting.componentElement = componentElement;

		setStyle(componentElement.querySelector(".logo"), "background-image", `url(${setting.icon})`);

		var searchInput = componentElement.querySelector("#search-input");
		var searchButton = componentElement.querySelector("#search-button");

		searchButton.addEventListener("click", performSearch);

		searchInput.addEventListener("keyup", function (event) {
			if (event.key === "Enter") {
				performSearch();
			} else {
				showSearchHistory(event.target.value); // 显示搜索历史记录
			}
		});

		searchInput.addEventListener("focus", function (event) {
			showSearchHistory(event.target.value); // 显示搜索历史记录
		});

		// searchInput.addEventListener("blur", function (event) {
		// 	componentElement.querySelector(".history-container").innerHTML = "";
		// });
	}

	/**
	 * 隐藏搜索组件
	 */
	function hide() {
		var { comp_search: setting } = window.zhongjyuan.runtime.setting;
		if (setting.componentElement) setting.componentElement.remove();
	}

	/**
	 * 获取搜索历史记录
	 * @returns {Array} 搜索历史记录数组
	 */
	function getSearchHistory() {
		var { comp_search: setting } = window.zhongjyuan.runtime.setting;

		var historys = localStorage.get(setting.historyKey, []);
		if (historys.length < 1) historys = setting.historys || [];

		return historys.length > 0 ? JSON.parse(historys) : historys;
	}

	/**
	 * 更新搜索历史记录
	 * @param {Array} searchHistory 搜索历史记录数组
	 */
	function updateSearchHistory(historys) {
		var { comp_search: setting } = window.zhongjyuan.runtime.setting;

		setting.historys = historys;

		localStorage.remove(setting.historyKey);
		localStorage.set(setting.historyKey, historys);
	}

	/**
	 * 添加搜索历史记录
	 * @param {string} searchText 搜索文本
	 */
	function addSearchHistory(searchText) {
		var { comp_search: setting } = window.zhongjyuan.runtime.setting;

		let historys = getSearchHistory();

		// 如果搜索历史已存在该搜索文本，则先移除旧的记录
		var index = historys.indexOf(searchText);
		if (index !== -1) {
			historys.splice(index, 1);
		}

		// 将新的搜索文本添加到搜索历史的开头
		historys.unshift(searchText);

		// 限制搜索历史的数量
		if (historys.length > setting.historyLimit) {
			historys.pop();
		}

		// 更新搜索历史记录
		updateSearchHistory(historys);
	}

	/**
	 * 显示搜索历史记录
	 * @param {string} keyword 搜索关键词
	 */
	function showSearchHistory(keyword) {
		var { comp_search: setting } = window.zhongjyuan.runtime.setting;

		var componentElement = setting.componentElement;
		var historyContainer = componentElement.querySelector(".history-container");
		historyContainer.innerHTML = "";

		var historys = getSearchHistory();

		// 如果没有搜索关键词，则显示全部搜索历史记录
		if (!keyword) {
			// historys.forEach((item) => {
			// 	var historyItem = document.createElement("div");
			// 	historyItem.className = "history-item";
			// 	historyItem.innerText = item;
			// 	// 点击搜索历史记录，将文本显示在搜索框中
			// 	historyItem.addEventListener("click", function () {
			// 		var searchInput = componentElement.querySelector("#search-input");
			// 		searchInput.value = item;
			// 		showSearchHistory(item); // 显示关键词相关的搜索历史记录
			// 	});
			// 	historyContainer.appendChild(historyItem);
			// });
		} else {
			// 显示与关键词匹配的搜索历史记录
			var matchedHistory = historys.filter((item) => item.includes(keyword));
			matchedHistory.forEach((item) => {
				var historyItem = document.createElement("div");
				historyItem.className = "history-item";
				historyItem.innerText = item;

				// 点击搜索历史记录，将文本显示在搜索框中
				historyItem.addEventListener("click", function () {
					var searchInput = componentElement.querySelector("#search-input");
					searchInput.value = item;
					showSearchHistory(item); // 显示关键词相关的搜索历史记录
				});

				historyContainer.appendChild(historyItem);
			});
		}
	}

	return {
		show: logger.decorator(show, "search-show"),
		hide: logger.decorator(hide, "search-hide"),
	};
})();
