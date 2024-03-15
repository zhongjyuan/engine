const dragula = require("dragula");
const EventEmitter = require("events");

const settingManagement = require("../../settings/renderSettingManagement.js");

const urlManagement = require("../utils/urlManagement.js");

const focusMode = require("../focusMode.js");

const uiManagement = require("../uiManagement.js");
const { webviews } = require("../webviewManagement.js");

const tabAudioManagement = require("./tabAudioManagement.js");

const tabEditManagement = require("./tabEditManagement.js");
const permissionHandle = require("./permissionHandle.js");

const readerView = require("../readerView.js");

const progressBar = require("./progressBar.js");

/**
 * 标签栏管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日12:38:40
 */
const tabBarManagement = {
	/** 导航栏元素 */
	navBar: document.getElementById("navbar"),

	/** 标签容器元素 */
	container: document.getElementById("tabs"),

	/** 标签容器内部元素 */
	containerInner: document.getElementById("tabs-inner"),

	/** 事件处理对象 */
	events: new EventEmitter(),

	/** 标签元素映射表，以标签ID作为键，标签元素作为值 */
	tabElementMap: {},

	/** 拖拽实例对象 */
	dragulaInstance: null,

	/**上一次关闭标签页的时间戳 */
	lastTabDeletion: 0,

	/**
	 * 根据 tabId 获取对应的标签元素。
	 * @param {Number} tabId - 标签页的唯一标识符。
	 * @returns {Element} 返回对应的标签元素，如果找不到则返回 undefined。
	 */
	getTab: function (tabId) {
		return tabBarManagement.tabElementMap[tabId];
	},

	/**
	 * 根据 tabId 获取对应标签的输入框元素。
	 * @param {Number} tabId - 标签页的唯一标识符。
	 * @returns {Element} 返回指定标签的输入框元素，如果找不到则返回 undefined。
	 */
	getTabInput: function (tabId) {
		return tabBarManagement.getTab(tabId).querySelector(".tab-input");
	},

	/**
	 * 设置指定 tabId 的标签为活动状态，并滚动到可见区域内。
	 * @param {Number} tabId - 标签页的唯一标识符。
	 */
	setActiveTab: function (tabId) {
		// 移除当前活动标签的样式和属性
		var activeTab = document.querySelector(".tab-item.active");
		if (activeTab) {
			activeTab.classList.remove("active");
			activeTab.removeAttribute("aria-selected");
		}

		// 设定新的活动标签的样式和属性
		var el = tabBarManagement.getTab(tabId);
		el.classList.add("active");
		el.setAttribute("aria-selected", "true");

		// 滚动标签至可见区域
		window.requestAnimationFrame(function () {
			el.scrollIntoView();
		});
	},

	/**
	 * 创建标签页
	 * @param {*} data 标签页的数据
	 * @returns 创建的标签页元素
	 */
	createTab: function (data) {
		// 创建一个 <div> 元素作为标签页
		var tabEl = document.createElement("div");
		tabEl.className = "tab-item";
		tabEl.setAttribute("data-tab", data.id);
		tabEl.setAttribute("role", "tab");

		// 添加按钮和进度条等元素到标签页中
		tabEl.appendChild(readerView.getButton(data.id));
		tabEl.appendChild(tabAudioManagement.getButton(data.id));
		tabEl.appendChild(progressBar.create());

		// 创建图标区域
		var iconArea = document.createElement("span");
		iconArea.className = "tab-icon-area";

		// 判断是否是私密标签页，如果是，则添加私密图标
		if (data.private) {
			var pbIcon = document.createElement("i");
			pbIcon.className = "icon-tab-is-private tab-icon tab-info-icon i carbon:view-off";
			iconArea.appendChild(pbIcon);
		}

		// 创建关闭标签页按钮，并添加到图标区域中
		var closeTabButton = document.createElement("button");
		closeTabButton.className = "tab-icon tab-close-button i carbon:close";

		// 监听关闭按钮的点击事件
		closeTabButton.addEventListener("click", function (e) {
			tabBarManagement.events.emit("tab-closed", data.id);
			// 阻止搜索栏打开
			e.stopPropagation();
		});

		iconArea.appendChild(closeTabButton);

		// 将图标区域添加到标签页中
		tabEl.appendChild(iconArea);

		// 创建标题元素，并添加到标签页中
		var title = document.createElement("span");
		title.className = "title";
		tabEl.appendChild(title);

		// 点击标签页进入编辑模式或切换标签页
		tabEl.addEventListener("click", function (e) {
			// 切换到标签页（如果未被选中）
			if (window.tabs.getSelected() !== data.id) {
				tabBarManagement.events.emit("tab-selected", data.id);
			} else {
				// 标签页已被选中，进入编辑模式
				tabEditManagement.show(data.id);
			}
		});

		// 辅助点击事件，中键点击关闭标签页
		tabEl.addEventListener("auxclick", function (e) {
			if (e.which === 2) {
				// 中键点击关闭标签页
				tabBarManagement.events.emit("tab-closed", data.id);
			}
		});

		// 滚轮事件，滑动以删除标签页
		tabEl.addEventListener("wheel", function (e) {
			// 防止与其他功能冲突
			if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
				return;
			}

			// 向上滑动删除标签页
			if (e.deltaY > 65 && e.deltaX < 10 && Date.now() - lastTabDeletion > 900) {
				lastTabDeletion = Date.now();

				/* 在聚焦模式下禁用删除标签页 */
				if (focusMode.enabled()) {
					focusMode.warn();
					return;
				}

				this.style.transform = "translateY(-100%)";

				// 等待动画完成后再关闭标签页
				setTimeout(function () {
					tabBarManagement.events.emit("tab-closed", data.id);
				}, 150);
			}
		});

		// 更新标签页并返回创建的元素
		tabBarManagement.updateTab(data.id, tabEl);

		return tabEl;
	},

	/**
	 * 更新标签页元素
	 * @param {*} tabId 标签页ID
	 * @param {*} tabEl 标签页元素（可选）
	 */
	updateTab: function (tabId, tabEl = tabBarManagement.getTab(tabId)) {
		// 获取标签页数据
		var tabData = window.tabs.get(tabId);

		// 更新标签页标题
		var tabTitle;

		const isNewTab = tabData.url === "" || tabData.url === urlManagement.parse("z://newtab");

		// 如果是新标签页，则将标题设置为 "newTabLabel"
		if (isNewTab) {
			tabTitle = l("newTabLabel");
		}

		// 如果标签页有标题，则使用该标题
		else if (tabData.title) {
			tabTitle = tabData.title;
		}

		// 如果标签页已加载但没有标题，则将标题设置为URL
		else if (tabData.loaded) {
			tabTitle = tabData.url;
		}

		// 将标题截断为最多500个字符
		tabTitle = (tabTitle || l("newTabLabel")).substring(0, 500);

		// 更新标签页标题元素和 title 属性
		var titleEl = tabEl.querySelector(".title");
		titleEl.textContent = tabTitle;
		tabEl.title = tabTitle;

		// 如果标签页是私密标签页，则在 title 后面添加 "私密标签" 的提示
		if (tabData.private) {
			tabEl.title += " (" + l("privateTab") + ")";
		}

		// 更新标签页中的音频图标
		var audioButton = tabEl.querySelector(".tab-audio-button");
		tabAudioManagement.updateButton(tabId, audioButton);

		// 删除当前标签页的权限请求图标
		tabEl.querySelectorAll(".permission-request-icon").forEach((el) => el.remove());

		// 获取标签页中的权限请求图标并逆序添加到标签页头部
		permissionHandle
			.getButtons(tabId)
			.reverse()
			.forEach(function (button) {
				tabEl.insertBefore(button, tabEl.children[0]);
			});

		// 更新标签页安全性状态的图标
		var iconArea = tabEl.getElementsByClassName("tab-icon-area")[0];
		var insecureIcon = tabEl.getElementsByClassName("icon-tab-not-secure")[0];

		// 如果标签页是安全的，则移除不安全图标
		if (tabData.secure === true && insecureIcon) {
			insecureIcon.remove();
		}

		// 如果标签页不安全且没有不安全图标，则添加不安全图标
		else if (tabData.secure === false && !insecureIcon) {
			var insecureIcon = document.createElement("i");
			insecureIcon.className = "icon-tab-not-secure tab-icon tab-info-icon i carbon:unlocked";
			insecureIcon.title = l("connectionNotSecure");
			iconArea.appendChild(insecureIcon);
		}
	},

	/**
	 * 更新所有标签页
	 */
	updateAll: function () {
		// 清空标签页栏容器
		empty(tabBarManagement.containerInner);

		tabBarManagement.tabElementMap = {};

		// 遍历所有标签页数据，创建新的标签页元素，并添加到容器中
		window.tabs.get().forEach(function (tab) {
			var el = tabBarManagement.createTab(tab);
			tabBarManagement.containerInner.appendChild(el);
			tabBarManagement.tabElementMap[tab.id] = el;
		});

		// 设置选中的标签页为活动状态
		if (window.tabs.getSelected()) {
			tabBarManagement.setActiveTab(window.tabs.getSelected());
		}
	},

	/**
	 * 添加一个标签页
	 * @param {*} tabId
	 */
	addTab: function (tabId) {
		var tab = window.tabs.get(tabId);
		var index = window.tabs.getIndex(tabId);

		var tabEl = tabBarManagement.createTab(tab);
		tabBarManagement.containerInner.insertBefore(tabEl, tabBarManagement.containerInner.childNodes[index]);
		tabBarManagement.tabElementMap[tabId] = tabEl;
	},

	/**
	 * 移除一个标签页
	 * @param {*} tabId
	 */
	removeTab: function (tabId) {
		var tabEl = tabBarManagement.getTab(tabId);

		// 从容器中移除标签页元素，并删除映射关系
		if (tabEl) {
			tabBarManagement.containerInner.removeChild(tabEl);
			delete tabBarManagement.tabElementMap[tabId];
		}
	},

	/**
	 * 处理分隔线显示的偏好设置
	 * @param {*} dividerPreference
	 */
	handleDividerPreference: function (dividerPreference) {
		// 添加导航栏的分隔线样式
		if (dividerPreference === true) {
			tabBarManagement.navBar.classList.add("show-dividers");
		}

		// 移除导航栏的分隔线样式
		else {
			tabBarManagement.navBar.classList.remove("show-dividers");
		}
	},

	/**
	 * 初始化标签页的拖动功能
	 */
	initializeTabDragging: function () {
		tabBarManagement.dragulaInstance = dragula([document.getElementById("tabs-inner")], {
			direction: "horizontal",
			slideFactorX: 25,
		});

		tabBarManagement.dragulaInstance.on("drop", function (el, target, source, sibling) {
			// 获取拖动的标签页ID
			var tabId = el.getAttribute("data-tab");

			// 获取相邻标签页ID
			if (sibling) {
				var adjacentTabId = sibling.getAttribute("data-tab");
			}

			// 将原来位置的标签页从列表中移除
			var oldTab = window.tabs.splice(window.tabs.getIndex(tabId), 1)[0];

			var newIdx;

			// 在相邻标签页之前插入拖动的标签页
			if (adjacentTabId) {
				newIdx = window.tabs.getIndex(adjacentTabId);
			}

			// 将标签页插入到末尾位置
			else {
				newIdx = window.tabs.count();
			}

			// 将标签页插入到新的位置
			window.tabs.splice(newIdx, 0, oldTab);
		});
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		/**监听是否显示标签页之间的分隔线，并处理偏好设置 */
		settingManagement.listen("showDividerBetweenTabs", function (dividerPreference) {
			tabBarManagement.handleDividerPreference(dividerPreference);
		});

		/**在Webview开始加载时更新进度条状态和标签页数据 */
		webviews.bindEvent("did-start-loading", function (tabId) {
			progressBar.update(tabBarManagement.getTab(tabId).querySelector(".progress-bar"), "start");
			window.tabs.update(tabId, { loaded: false });
		});

		/**在Webview停止加载时更新进度条状态和标签页数据 */
		webviews.bindEvent("did-stop-loading", function (tabId) {
			progressBar.update(tabBarManagement.getTab(tabId).querySelector(".progress-bar"), "finish");
			window.tabs.update(tabId, { loaded: true });
			tabBarManagement.updateTab(tabId);
		});

		/**处理标签页更新事件 */
		window.tasks.on("tab-updated", function (id, key) {
			var updateKeys = ["title", "secure", "url", "muted", "hasAudio"];
			if (updateKeys.includes(key)) {
				tabBarManagement.updateTab(id);
			}
		});

		/**处理权限变更事件 */
		permissionHandle.onChange(function (tabId) {
			if (window.tabs.get(tabId)) {
				tabBarManagement.updateTab(tabId);
			}
		});

		/**初始化标签页拖动功能 */
		tabBarManagement.initializeTabDragging();

		/***防止浏览器默认行为 */
		tabBarManagement.container.addEventListener("dragover", (e) => e.preventDefault());

		/**处理拖放事件，添加标签页 */
		tabBarManagement.container.addEventListener("drop", (e) => {
			e.preventDefault();

			var data = e.dataTransfer;
			uiManagement.addTab(
				window.tabs.add({
					url: data.files[0] ? "file://" + data.files[0].path : data.getData("text"),
					private: window.tabs.get(window.tabs.getSelected()).private,
				}),
				{ enterEditMode: false, openInBackground: !settingManagement.get("openTabsInForeground") }
			);
		});
	},
};

tabBarManagement.initialize();

module.exports = tabBarManagement;
