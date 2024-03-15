const settingManagement = require("../../settings/renderSettingManagement.js");

const modalMode = require("../modalMode.js");

const { webviews } = require("../webviewManagement.js");

const passwordFactory = require("./passwordFactory.js");

/**
 * 密码查看器对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日11:02:48
 */
const passwordViewer = {
	/** 密码查看器的容器元素 */
	container: document.getElementById("password-viewer"),

	/** 密码条目列表的容器元素 */
	listContainer: document.getElementById("password-viewer-list"),

	/** 当密码为空时的提示标题元素 */
	emptyHeading: document.getElementById("password-viewer-empty"),
	
	/** 关闭按钮元素 */
	closeButton: document.querySelector("#password-viewer .modal-close-button"),

	/**
	 * 创建密码条目的 DOM 元素
	 * @param {*} credential 密码凭据
	 * @returns {HTMLElement} 密码条目的 DOM 元素
	 */
	createCredentialListElement: function (credential) {
		var container = document.createElement("div");

		var domainEl = document.createElement("span");
		domainEl.className = "domain-name";
		domainEl.textContent = credential.domain;
		container.appendChild(domainEl);

		var usernameEl = document.createElement("input");
		usernameEl.value = credential.username;
		usernameEl.disabled = true;
		container.appendChild(usernameEl);

		var passwordEl = document.createElement("input");
		passwordEl.type = "password";
		passwordEl.value = credential.password;
		passwordEl.disabled = true;
		container.appendChild(passwordEl);

		var revealButton = document.createElement("button");
		revealButton.className = "i carbon:view";
		revealButton.addEventListener("click", function () {
			if (passwordEl.type === "password") {
				passwordEl.type = "text";
				revealButton.classList.remove("carbon:view");
				revealButton.classList.add("carbon:view-off");
			} else {
				passwordEl.type = "password";
				revealButton.classList.add("carbon:view");
				revealButton.classList.remove("carbon:view-off");
			}
		});
		container.appendChild(revealButton);

		var deleteButton = document.createElement("button");
		deleteButton.className = "i carbon:trash-can";
		container.appendChild(deleteButton);

		deleteButton.addEventListener("click", function () {
			if (confirm(l("deletePassword").replace("%s", credential.domain))) {
				passwordFactory.getConfiguredPasswordManager().then(function (manager) {
					manager.deleteCredential(credential.domain, credential.username);
					container.remove();
				});
			}
		});

		return container;
	},

	/**
	 * 创建从不保存密码的域名的 DOM 元素
	 * @param {*} domain 域名
	 * @returns {HTMLElement} 从不保存密码的域名的 DOM 元素
	 */
	createNeverSaveDomainElement: function (domain) {
		var container = document.createElement("div");

		var domainEl = document.createElement("span");
		domainEl.className = "domain-name";
		domainEl.textContent = domain;
		container.appendChild(domainEl);

		var descriptionEl = document.createElement("span");
		descriptionEl.className = "description";
		descriptionEl.textContent = l("savedPasswordsNeverSavedLabel");
		container.appendChild(descriptionEl);

		var deleteButton = document.createElement("button");
		deleteButton.className = "i carbon:trash-can";
		container.appendChild(deleteButton);

		deleteButton.addEventListener("click", function () {
			settingManagement.set(
				"passwordsNeverSaveDomains",
				settingManagement.get("passwordsNeverSaveDomains").filter((d) => d !== domain)
			);
			container.remove();
		});

		return container;
	},

	/**
	 * 显示密码查看器
	 */
	show: function () {
		passwordFactory.getConfiguredPasswordManager().then(function (manager) {
			if (!manager.getAllCredentials) {
				throw new Error("unsupported password manager");
			}

			manager.getAllCredentials().then(function (credentials) {
				webviews.requestPlaceholder("passwordViewer");
				modalMode.toggle(true, {
					onDismiss: passwordViewer.hide,
				});
				passwordViewer.container.hidden = false;

				credentials.forEach(function (cred) {
					passwordViewer.listContainer.appendChild(passwordViewer.createCredentialListElement(cred));
				});

				const neverSaveDomains = settingManagement.get("passwordsNeverSaveDomains") || [];

				neverSaveDomains.forEach(function (domain) {
					passwordViewer.listContainer.appendChild(passwordViewer.createNeverSaveDomainElement(domain));
				});

				passwordViewer.emptyHeading.hidden = credentials.length + neverSaveDomains.length !== 0;
			});
		});
	},

	/**
	 * 隐藏密码查看器
	 */
	hide: function () {
		webviews.hidePlaceholder("passwordViewer");
		modalMode.toggle(false);
		empty(passwordViewer.listContainer);
		passwordViewer.container.hidden = true;
	},

	/**
	 * 初始化密码查看器
	 */
	initialize: function () {
		passwordViewer.closeButton.addEventListener("click", passwordViewer.hide);
		webviews.bindIPC("showCredentialList", function () {
			passwordViewer.show();
		});
	},
};

module.exports = passwordViewer;
